/**
 * COLETOR HISTÓRICO — busca jogos antigos de uma liga
 *
 * Estratégia:
 *   1. Abre Flashscore /results/ da liga
 *   2. Clica "Show more" agressivamente (até 80 vezes ou até parar de crescer)
 *   3. Extrai TODOS os match_ids da página
 *   4. Faz diff contra rodadas/<LIGA>/ existentes
 *   5. Enriquece via FlashscoreMonster os IDs novos
 *   6. Salva em lotes de 25 jogos
 *
 * Uso: node _coletar_historico_liga.js --liga J1 [--max 200]
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');

const LIGAS = {
  J1:     { nome: 'J1 League (Japão)',              url: 'https://www.flashscore.com/football/japan/j1-league/results/' },
  J2:     { nome: 'J2 League (Japão)',              url: 'https://www.flashscore.com/football/japan/j2-league/results/' },
  CHI:    { nome: 'Primera División (Chile)',       url: 'https://www.flashscore.com/football/chile/liga-de-primera/results/' },
  ECU:    { nome: 'Liga Pro (Equador)',             url: 'https://www.flashscore.com/football/ecuador/liga-pro/results/' },
  CHN_SL: { nome: 'Chinese Super League',           url: 'https://www.flashscore.com/football/china/super-league/results/' },
  CHN_L1: { nome: 'China League One',               url: 'https://www.flashscore.com/football/china/league-one/results/' },
  ALM:    { nome: 'A-League Men (Austrália)',       url: 'https://www.flashscore.com/football/australia/a-league/results/' },
  ARG_M:  { nome: 'Primera B Metropolitana',        url: 'https://www.flashscore.com/football/argentina/primera-b-metropolitana/results/' }
};

const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const LIGA = (getArg('--liga', 'J1')).toUpperCase();
const MAX  = parseInt(getArg('--max', '300'), 10);

if (!LIGAS[LIGA]) {
  console.error(`Liga "${LIGA}" não suportada. Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
  process.exit(1);
}

const PASTA_LIGA = path.join(__dirname, 'rodadas', LIGA);
fs.mkdirSync(PASTA_LIGA, { recursive: true });

function delayHumano(base, jitter = 1000) {
  return new Promise(r => setTimeout(r, base + Math.floor(Math.random() * jitter)));
}

function carregarIdsExistentes() {
  const ids = new Set();
  if (!fs.existsSync(PASTA_LIGA)) return ids;
  fs.readdirSync(PASTA_LIGA)
    .filter(f => f.endsWith('.json') && !f.includes('.backup_') && !f.includes('_log'))
    .forEach(f => {
      try {
        const j = JSON.parse(fs.readFileSync(path.join(PASTA_LIGA, f), 'utf8'));
        const arr = Array.isArray(j) ? j : Object.values(j);
        arr.forEach(g => { if (g.match_id) ids.add(g.match_id); });
      } catch (e) {}
    });
  return ids;
}

(async () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🕰️  COLETOR HISTÓRICO — ${LIGA} (${LIGAS[LIGA].nome})`);
  console.log('═══════════════════════════════════════════════════════');

  const idsExistentes = carregarIdsExistentes();
  console.log(`  📥 Jogos já coletados: ${idsExistentes.size}`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  // Página de resultados
  const page = await browser.newPage();
  console.log(`  🌐 Abrindo ${LIGAS[LIGA].url}`);
  await page.goto(LIGAS[LIGA].url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await delayHumano(5000, 1500);

  // Aceitar cookies
  try {
    await page.evaluate(() => {
      const btn = document.querySelector('#onetrust-accept-btn-handler');
      if (btn) btn.click();
    });
    await delayHumano(2000, 500);
  } catch(_) {}

  // Cliques agressivos no "Show more"
  console.log(`  🔄 Clicando "Show more" até esgotar histórico (até 80 cliques)...`);
  let ultimoCount = 0;
  let semCrescimento = 0;
  for (let i = 0; i < 80; i++) {
    try {
      const r = await page.evaluate(() => {
        const seletores = [
          '.event__more', 'a.event__more', 'a.event__more--static',
          '[data-testid="wcl-buttonLink"]', 'button[aria-label*="more"]', 'a[class*="more"]'
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
      const count = await page.evaluate(() => document.querySelectorAll('.event__match').length);
      if (count === ultimoCount) {
        semCrescimento++;
        if (semCrescimento >= 4) {
          console.log(`\n  ⚠️  Histórico esgotado após ${i+1} cliques (total: ${count} jogos)`);
          break;
        }
      } else {
        semCrescimento = 0;
      }
      ultimoCount = count;
      if (i % 5 === 0) process.stdout.write(`[${i+1}:${count}] `);
    } catch (e) { break; }
  }
  console.log('');

  // Extrair todos os IDs visíveis
  const todosJogos = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.event__match').forEach(el => {
      const id = (el.id || '').replace('g_1_', '');
      const home = el.querySelector('.event__participant--home, .event__homeParticipant')?.textContent?.trim() || '';
      const away = el.querySelector('.event__participant--away, .event__awayParticipant')?.textContent?.trim() || '';
      const time = el.querySelector('.event__time')?.textContent?.trim() || '';
      if (id) out.push({ id, home, away, time });
    });
    return out;
  });
  await page.close();
  console.log(`  📊 Total de jogos visíveis na página: ${todosJogos.length}`);

  // Filtrar: apenas novos (não estão em idsExistentes)
  let candidatos = todosJogos.filter(j => !idsExistentes.has(j.id));
  console.log(`  🆕 Jogos NOVOS a coletar: ${candidatos.length}`);

  if (candidatos.length > MAX) {
    candidatos = candidatos.slice(0, MAX);
    console.log(`  ⚠️  Limitado a ${MAX} jogos (use --max para ajustar)`);
  }

  if (candidatos.length === 0) {
    console.log('  ✅ Nada novo. Encerrando.');
    await browser.close();
    process.exit(0);
  }

  const tempoEst = (candidatos.length * 28 / 60).toFixed(1);
  console.log(`  ⏱️  Tempo estimado: ~${tempoEst} min`);
  console.log('');

  // Enriquecer cada um
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  const TAMANHO_LOTE = 25;
  const dataHoje = new Date().toISOString().split('T')[0];
  const startTime = Date.now();

  let lote = [];
  let loteNum = 1;
  let okTotal = 0, falhaTotal = 0;
  const falhas = [];

  function salvarLote() {
    if (lote.length === 0) return;
    const arquivo = path.join(PASTA_LIGA, `${LIGA.toLowerCase()}_historico_lote_${String(loteNum).padStart(2,'0')}_${dataHoje}.json`);
    fs.writeFileSync(arquivo, JSON.stringify(lote, null, 2));
    console.log(`\n  💾 Lote ${loteNum} salvo: ${lote.length} jogos → ${path.basename(arquivo)}\n`);
    lote = [];
    loteNum++;
  }

  for (let i = 0; i < candidatos.length; i++) {
    const c = candidatos[i];
    const url = `https://www.flashscore.com/match/${c.id}/#/match-summary`;
    console.log(`  [${i+1}/${candidatos.length}] ${c.id} | ${c.home} x ${c.away} (${c.time})`);

    let partida = null;
    try {
      partida = await fantasma.extrairPartida(url, {
        liga: LIGAS[LIGA].nome,
        codigo_liga: LIGA
      });
      if (partida && partida.estatisticas_ft && partida.estatisticas_ft.cantos) {
        const ca = partida.estatisticas_ft.cantos;
        console.log(`     ✅ Cantos FT: ${ca.m}-${ca.v} | Campos: ${partida.meta.campos_disponiveis}`);
        lote.push(partida);
        okTotal++;
      } else {
        throw new Error('Cantos FT não extraídos');
      }
    } catch (e) {
      console.log(`     ❌ Falha: ${e.message}`);
      falhas.push({ id: c.id, home: c.home, away: c.away, erro: e.message });
      falhaTotal++;
    }

    if (lote.length >= TAMANHO_LOTE) salvarLote();
    if (i < candidatos.length - 1) await delayHumano(4000, 1500);
  }
  salvarLote();

  if (falhas.length > 0) {
    fs.writeFileSync(
      path.join(PASTA_LIGA, `_falhas_historico_${dataHoje}.json`),
      JSON.stringify(falhas, null, 2)
    );
  }

  await browser.close();

  const mins = ((Date.now()-startTime)/60000).toFixed(1);
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🏁 COLETA HISTÓRICA ${LIGA} CONCLUÍDA`);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  ✅ Sucesso:  ${okTotal}`);
  console.log(`  ❌ Falhas:   ${falhaTotal}`);
  console.log(`  ⏱️  Tempo:    ${mins} min`);
})();
