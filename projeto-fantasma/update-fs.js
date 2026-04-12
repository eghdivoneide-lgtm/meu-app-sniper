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
        
        // Se título falhar, tenta achar os nomes pela classe grande
        const nomesSpan = Array.from(document.querySelectorAll('.participant__participantName'));
        if(nomesSpan.length >= 2) {
           mandante = nomesSpan[0].innerText.trim();
           visitante = Object.keys(nomesSpan).length > 1 ? nomesSpan[1].innerText.trim() : "DesconhecidoV";
        } else if(title.includes('-')) {
            const parts = title.split('-');
            mandante = parts[0].trim();
            visitante = parts[1].split('placar')[0].split('Live')[0].split('H2H')[0].trim();
        }
        return { mandante, visitante };
      });
      dadosPartida.mandante = cabecalho.mandante;
      dadosPartida.visitante = cabecalho.visitante;

      const clickTab = async (searchText1, searchText2) => {
         await page.evaluate((s1, s2) => {
            const links = document.querySelectorAll('button, a, div.tabs__tab');
            const target = Array.from(links).find(el => el.innerText && (el.innerText.toUpperCase().includes(s1) || el.innerText.toUpperCase().includes(s2)));
            if(target) target.click();
         }, searchText1, searchText2);
         await new Promise(r => setTimeout(r, 2000));
      };

      const extractStats = () => {
        const lines = document.body.innerText.split('\\n').map(l => l.trim());
        const r = {};
        for(let i = 0; i < lines.length; i++) {
          const l = lines[i].toLowerCase();
          if(l === 'escanteios' || l === 'corner kicks' || l === 'corners') r.cantos = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'posse de bola' || l === 'ball possession') r.posse = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'ataques perigosos' || l === 'dangerous attacks') r.ataquesPerigosos = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'tentativas de gol' || l === 'total shots' || l === 'goal attempts') r.finalizacoes = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
          if(l === 'cartões vermelhos' || l === 'red cards') r.cartoes_vermelhos = { m: parseInt(lines[i-1]), v: parseInt(lines[i+1]) };
        }
        return r;
      };

      // 1. TENTA ESTATÍSTICAS FT
      log(\`Buscando estatísticas (FT)...\`, "info");
      await clickTab('ESTATÍSTICAS', 'STATS');
      const statsFT = await page.evaluate(extractStats);
      dadosPartida.estatisticas_ft = Object.keys(statsFT).length > 0 ? statsFT : "Indisponível";

      // 1.5 TENTA ESTATÍSTICAS HT
      log(\`Buscando estatísticas (HT)...\`, "info");
      await clickTab('1º TEMPO', '1ST HALF');
      const statsHT = await page.evaluate(extractStats);
      dadosPartida.estatisticas_ht = Object.keys(statsHT).length > 0 ? statsHT : "Indisponível";

      // 2. TENTA ODDs PRE-MATCH
      log(\`Buscando precificações de Mercado (ODDs)...\`, "info");
      await clickTab('ODDS', 'ODDS');
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

      log(\`Dados consolidados para \${dadosPartida.mandante} x \${dadosPartida.visitante}\`, "success");
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
console.log('Update finished');
