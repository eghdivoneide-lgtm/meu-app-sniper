/**
 * RESOLVER ÓRFÃOS — MLS rodada 2026-04-26 (15 jogos)
 *
 * Estratégia:
 *   1. Carrega https://www.flashscore.com/football/usa/mls/results/
 *   2. Clica "Show more matches" até passar pela data 26/04/2026
 *   3. Extrai (match_id, mandante, visitante, data) de cada jogo
 *   4. Filtra apenas 26/04 e tenta casar com os 15 órfãos do banco
 *   5. Para cada match, enriquece via FlashscoreMonster
 *   6. Salva em rodadas/MLS/mls_resolvidos_orfaos_2026-04-26.json
 *   7. Atualiza log
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');

const URL_MLS = 'https://www.flashscore.com/football/usa/mls/results/';
const DATA_ALVO = '2026-04-26';

function delayHumano(base, jitter = 1000) {
  return new Promise(r => setTimeout(r, base + Math.floor(Math.random() * jitter)));
}

// Normaliza nome de time pra matching tolerante
function normalizar(nome) {
  return (nome || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\./g, '')
    .replace(/fc|cf|sc|club|united|utd/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Aliases manuais MLS
const ALIAS = {
  'atlanta utd': 'atlanta',
  'atlanta united': 'atlanta',
  'new york city': 'nycfc',
  'nyc': 'nycfc',
  'new york red bulls': 'ny red bulls',
  'red bulls': 'ny red bulls',
  'minnesota united': 'minnesota',
  'inter miami': 'miami',
  'kansas city': 'sporting kc',
  'sporting kansas city': 'sporting kc',
  'la galaxy': 'galaxy',
  'los angeles galaxy': 'galaxy',
  'la fc': 'lafc',
  'los angeles fc': 'lafc',
  'san jose earthquakes': 'san jose',
  'columbus crew': 'columbus',
  'portland timbers': 'portland',
  'seattle sounders': 'seattle',
  'vancouver whitecaps': 'vancouver',
  'colorado rapids': 'colorado',
  'fc dallas': 'dallas',
  'fc cincinnati': 'cincinnati',
  'austin fc': 'austin',
  'houston dynamo': 'houston',
  'real salt lake': 'salt lake',
  'cf montreal': 'montreal',
  'chicago fire': 'chicago',
  'new england revolution': 'new england',
  'nashville sc': 'nashville',
  'charlotte': 'charlotte',
  'st louis city': 'st louis',
  'st louis': 'st louis',
  'orlando city': 'orlando',
  'dc united': 'dc',
  'toronto fc': 'toronto',
  'philadelphia union': 'philadelphia',
  'san diego fc': 'san diego'
};

function chave(nome) {
  const n = normalizar(nome);
  return ALIAS[n] || n;
}

(async () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🔍 RESOLVER ÓRFÃOS MLS — rodada ${DATA_ALVO}`);
  console.log('═══════════════════════════════════════════════════════');

  // 1. Carrega lista dos 15 órfãos
  const sandbox = { window: {} };
  const code = fs.readFileSync(path.join(__dirname, '..', 'especialista-cantos', 'data', 'mls2026.js'), 'utf8').replace(/^\s*\/\/.*$/gm, '');
  new Function('window', code)(sandbox.window);
  const banco = sandbox.window.DADOS_MLS.jogos;
  const orfaos = banco.filter(j => {
    const id = j.match_id || j.id || '';
    return !/^[a-zA-Z0-9]{6,10}$/.test(id) && (j.data || '').includes('2026-04-26');
  });
  console.log(`  📋 Órfãos a resolver: ${orfaos.length}`);

  const orfaosMap = new Map();
  orfaos.forEach(o => {
    const k = chave(o.mandante) + '|' + chave(o.visitante);
    orfaosMap.set(k, o);
  });

  // 2. Abre browser e scrapa lista de IDs
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();
  console.log(`  🌐 Abrindo Flashscore MLS results...`);
  await page.goto(URL_MLS, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await delayHumano(5000, 2000);

  try {
    // Aceitar cookies se aparecer
    await page.evaluate(() => {
      const btn = document.querySelector('#onetrust-accept-btn-handler');
      if (btn) btn.click();
    });
    await delayHumano(2000, 500);
  } catch(_) {}

  // Clicar "Show more matches" agressivamente até carregar 26/04
  console.log(`  🔄 Carregando histórico (até 60 cliques)...`);
  let ultimoCount = 0;
  let semCrescimento = 0;
  let achou26abr = false;
  for (let i = 0; i < 60; i++) {
    try {
      // Múltiplos seletores possíveis pra "Show more"
      const clicado = await page.evaluate(() => {
        const seletores = [
          '.event__more',
          'a.event__more',
          'a.event__more--static',
          '[data-testid="wcl-buttonLink"]',
          'button[aria-label*="more"]',
          'a[class*="more"]'
        ];
        for (const s of seletores) {
          const btn = document.querySelector(s);
          if (btn) {
            btn.scrollIntoView({behavior:'auto', block:'center'});
            btn.click();
            return true;
          }
        }
        return false;
      });

      await delayHumano(2500, 800);

      const counts = await page.evaluate(() => {
        const total = document.querySelectorAll('.event__match').length;
        const linhas = document.querySelectorAll('.event__time, .event__date');
        let achou26 = false;
        linhas.forEach(el => {
          const t = el.textContent || '';
          if (t.includes('26.04.') || t.includes('25.04.') || t.includes('24.04.')) achou26 = true;
        });
        return { total, achou26 };
      });

      if (counts.total === ultimoCount) {
        semCrescimento++;
        if (semCrescimento >= 3) {
          console.log(`\n  ⚠️  Sem crescimento após ${semCrescimento} tentativas (total: ${counts.total})`);
          break;
        }
      } else {
        semCrescimento = 0;
      }
      ultimoCount = counts.total;
      achou26abr = counts.achou26;

      process.stdout.write(`[${i+1}:${counts.total}${counts.achou26?'✓':''}] `);

      if (achou26abr && i >= 5) {
        // Carrega mais 3 cliques de segurança após achar 26/04
        console.log(`\n  ✓ Encontrou 26/04 após ${i+1} cliques. Mais 3 cliques de margem...`);
        for (let k = 0; k < 3; k++) {
          await page.evaluate(() => {
            const btn = document.querySelector('.event__more, a.event__more, a.event__more--static');
            if (btn) { btn.scrollIntoView({block:'center'}); btn.click(); }
          });
          await delayHumano(2500, 500);
        }
        break;
      }
    } catch (e) { break; }
  }
  console.log('');

  // 3. Extrair todos os jogos com data e ID
  const todosJogos = await page.evaluate(() => {
    const out = [];
    // Iterar sobre as seções (cada uma com data)
    const linhas = document.querySelectorAll('.event__match, .event__header');
    let dataAtual = '';
    linhas.forEach(el => {
      if (el.classList.contains('event__header')) {
        dataAtual = el.textContent.trim();
      } else {
        const id = (el.id || '').replace('g_1_', '');
        const home = el.querySelector('.event__participant--home, .event__homeParticipant')?.textContent?.trim() || '';
        const away = el.querySelector('.event__participant--away, .event__awayParticipant')?.textContent?.trim() || '';
        const time = el.querySelector('.event__time')?.textContent?.trim() || '';
        out.push({ id, home, away, time, secao: dataAtual });
      }
    });
    return out;
  });

  await page.close();
  console.log(`  📊 Jogos extraídos do Flashscore: ${todosJogos.length}`);

  // Filtra os de 26/04
  const jogos26 = todosJogos.filter(j => j.time.includes('26.04.') || j.time.includes('26.4.') || j.secao.includes('26.04'));
  console.log(`  📅 Jogos em 26/04 detectados: ${jogos26.length}`);

  // 4. Casar com órfãos
  const resolvidos = [];
  const naoResolvidos = [];
  jogos26.forEach(jf => {
    if (!jf.id) return;
    const k = chave(jf.home) + '|' + chave(jf.away);
    if (orfaosMap.has(k)) {
      const orfao = orfaosMap.get(k);
      resolvidos.push({ ...jf, orfao_id: orfao.match_id || orfao.id, mandante: orfao.mandante, visitante: orfao.visitante });
      orfaosMap.delete(k);
    }
  });

  orfaosMap.forEach(o => naoResolvidos.push(o));

  console.log('');
  console.log(`  ✅ Casados: ${resolvidos.length}/${orfaos.length}`);
  if (naoResolvidos.length > 0) {
    console.log(`  ❌ Não casados (${naoResolvidos.length}):`);
    naoResolvidos.forEach(o => console.log(`     - ${o.mandante} x ${o.visitante}`));
  }
  console.log('');

  if (resolvidos.length === 0) {
    console.log('  ⚠️  Nenhum match — possivelmente os jogos não estão mais visíveis no Flashscore ou os aliases falharam.');
    await browser.close();
    process.exit(1);
  }

  // 5. Enriquecer cada um
  console.log(`  🧬 Enriquecendo ${resolvidos.length} jogos...`);
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  const ricos = [];
  const falhas = [];
  for (let i = 0; i < resolvidos.length; i++) {
    const r = resolvidos[i];
    const url = `https://www.flashscore.com/match/${r.id}/#/match-summary`;
    console.log(`  [${i+1}/${resolvidos.length}] ${r.id} | ${r.mandante} x ${r.visitante}`);
    try {
      const partida = await fantasma.extrairPartida(url, {
        liga: 'Major League Soccer',
        codigo_liga: 'MLS'
      });
      if (partida && partida.estatisticas_ft && partida.estatisticas_ft.cantos) {
        // Adiciona referência ao ID antigo pra mesclagem posterior
        partida.id_antigo = r.orfao_id;
        ricos.push(partida);
        console.log(`     ✅ Cantos FT: ${partida.estatisticas_ft.cantos.m}-${partida.estatisticas_ft.cantos.v} | Campos: ${partida.meta.campos_disponiveis}`);
      } else {
        throw new Error('Cantos FT não extraídos');
      }
    } catch (e) {
      console.log(`     ❌ Falha: ${e.message}`);
      falhas.push({ id: r.id, mandante: r.mandante, visitante: r.visitante, erro: e.message });
    }
    if (i < resolvidos.length - 1) await delayHumano(4000, 2000);
  }

  await browser.close();

  // 6. Salvar
  const arquivoOut = path.join(__dirname, 'rodadas', 'MLS', `mls_resolvidos_orfaos_${DATA_ALVO}.json`);
  fs.writeFileSync(arquivoOut, JSON.stringify(ricos, null, 2));

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🏁 RESOLVER ÓRFÃOS MLS CONCLUÍDO`);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  ✅ Enriquecidos: ${ricos.length}/${orfaos.length}`);
  console.log(`  ❌ Falhas:       ${falhas.length}`);
  console.log(`  ❌ Não casados:  ${naoResolvidos.length}`);
  console.log(`  📂 Arquivo:      rodadas/MLS/${path.basename(arquivoOut)}`);
})();
