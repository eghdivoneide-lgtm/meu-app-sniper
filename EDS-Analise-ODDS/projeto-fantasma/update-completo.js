const fs = require('fs');

let code = `const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { log } = require('./logger');
const fs = require('fs');

class FlashscoreMonster {
  constructor() {
    this.browser = null;
  }

  async iniciar() {
    log("Iniciando Flashscore Data Monster (Modo Stealth)...", "info");
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });
  }

  async fechar() {
    if (this.browser) await this.browser.close();
  }

  async extrairPartida(url) {
    const page = await this.browser.newPage();
    const dadosPartida = { url, data_brasileira: new Date().toLocaleDateString() };

    try {
      log(\`Acessando Partida: \${url}\`, "bot");
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 4000));

      const cabecalho = await page.evaluate(() => {
        let title = document.title || ""; 
        let mandante = "DesconhecidoM";
        let visitante = "DesconhecidoV";
        
        const nomesSpan = Array.from(document.querySelectorAll('.participant__participantName'));
        if(nomesSpan.length >= 2) {
           mandante = nomesSpan[0].innerText.trim();
           visitante = Object.keys(nomesSpan).length > 1 ? nomesSpan[1].innerText.trim() : "DesconhecidoV";
        } else if(title.includes('-')) {
            const parts = title.split('-');
            mandante = parts[0].trim();
            visitante = parts[1].split('placar')[0].split('Live')[0].split('H2H')[0].trim();
        }

        // Busca Placar FT e HT no Sumário (Resumo)
        const lines = document.body.innerText.split('\\n').map(l => l.trim());
        let placar_ft = "Indisponível";
        let placar_ht = "Indisponível";
        
        for(let i=0; i < lines.length; i++) {
           if(lines[i] === '-' && !isNaN(parseInt(lines[i-1])) && !isNaN(parseInt(lines[i+1]))) {
               if(placar_ft === "Indisponível") {
                   placar_ft = \`\${lines[i-1]} - \${lines[i+1]}\`;
               }
           }
           if((lines[i] === '1ST HALF' || lines[i] === '1º TEMPO') && lines[i+1].includes('-')) {
               placar_ht = lines[i+1];
           }
        }
        return { mandante, visitante, placar_ft, placar_ht };
      });
      dadosPartida.mandante = cabecalho.mandante;
      dadosPartida.visitante = cabecalho.visitante;
      dadosPartida.placar = { ht: cabecalho.placar_ht, ft: cabecalho.placar_ft };

      const extractStats = () => {
        const lines = document.body.innerText.split('\\n').map(l => l.trim());
        const r = {};
        for(let i = 0; i < lines.length; i++) {
          const l = lines[i].toLowerCase();
          if(l === 'escanteios' || l === 'corner kicks' || l === 'corners') r.cantos = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'posse de bola' || l === 'ball possession') r.posse = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'ataques perigosos' || l === 'dangerous attacks') r.ataquesPerigosos = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'tentativas de gol' || l === 'total shots') r.finalizacoes = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'chutes no alvo' || l === 'shots on target') r.chutes_alvo = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'cartões vermelhos' || l === 'red cards') r.cartoes_vermelhos = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'passes' || l === 'passes') r.passes = { m: lines[i-1], v: lines[i+1] }; // Ex: 86%
        }
        return r;
      };

      const clickTabAndWait = async (searchText1, searchText2) => {
         await page.evaluate((s1, s2) => {
            const links = document.querySelectorAll('button, a, div.tabs__tab');
            const target = Array.from(links).find(el => el.innerText && (el.innerText.toUpperCase().includes(s1) || el.innerText.toUpperCase().includes(s2)));
            if(target) target.click();
         }, searchText1, searchText2);
         await new Promise(r => setTimeout(r, 4000)); // Aguarda o dom do frontend renderizar
      };

      log(\`Buscando Formações Táticas...\`, "info");
      await clickTabAndWait('ESCALAÇÕES', 'LINEUPS');
      const forms = await page.evaluate(() => {
         const lines = document.body.innerText.split('\\n').map(l => l.trim());
         let formM = "Desconhecida";
         let formV = "Desconhecida";
         for(let i=0; i < lines.length; i++) {
             // procura formato de forcação: 4-2-3-1 ou 4 - 2 - 3 - 1
             const f = lines[i].replace(/\\s/g, '');
             if(/^[0-9]+-[0-9]+(-[0-9]+)*$/.test(f) && f.length >= 5) {
                 if(formM === "Desconhecida") formM = f;
                 else if(formV === "Desconhecida" && f !== formM) formV = f; // As vezes times tem a mesma, mas se for diferente garantimos. Na verdade a primeira eh Home, a ultima eh Away.
             }
         }
         return { m: formM, v: formV };
      });
      dadosPartida.formacao = forms;

      log(\`Buscando estatísticas (FT)...\`, "info");
      await clickTabAndWait('ESTATÍSTICAS', 'STATS');
      dadosPartida.estatisticas_ft = await page.evaluate(extractStats);

      log(\`Buscando estatísticas (HT)...\`, "info");
      await clickTabAndWait('1º TEMPO', '1ST HALF');
      dadosPartida.estatisticas_ht = await page.evaluate(extractStats);

      log(\`Buscando precificações de Mercado (ODDs)...\`, "info");
      await clickTabAndWait('ODDS', 'ODDS');
      const odds = await page.evaluate(() => {
         const lines = document.body.innerText.split('\\n').map(l => l.trim());
         for(let i = 0; i < lines.length; i++) {
            if(lines[i] === '1' && lines[i+1] === 'X' && lines[i+2] === '2') {
               return { oddM: lines[i+3], oddEmpate: lines[i+4], oddV: lines[i+5] };
            }
         }
         return null;
      });
      dadosPartida.mercado = odds || "ODDs Ocultas";

      log(\`Dados consolidados com sucesso!\`, "success");
      return dadosPartida;

    } catch(err) {
      log(\`Erro ao extrair \${url}: \${err.message}\`, "error");
      return null;
    } finally {
      await page.close();
    }
  }
}

if (require.main === module) {
  (async () => {
    const fantasma = new FlashscoreMonster();
    await fantasma.iniciar();
    const urlTeste = process.argv[2] || "https://www.flashscore.com/match/lhZ72d6h/#/match-summary"; 
    const dados = await fantasma.extrairPartida(urlTeste);
    console.log("\\n================ RESULTADO DA EXTRAÇÃO ======================");
    console.log(JSON.stringify(dados, null, 2));
    console.log("=============================================================\\n");
    fs.writeFileSync('output-auditor-mock.json', JSON.stringify([dados], null, 2));
    await fantasma.fechar();
  })();
}
module.exports = FlashscoreMonster;
`;

fs.writeFileSync('flashscore-monster.js', code);
