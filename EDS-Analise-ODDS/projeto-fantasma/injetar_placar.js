/**
 * INJETAR PLACAR — Adiciona placar de gols aos jogos existentes
 * EDS Soluções Inteligentes — Premissa: dados REAIS, zero estimativas
 *
 * Estratégia:
 *   1. Lê o histórico de uma liga (ex: argentina2026.js)
 *   2. Identifica jogos SEM placar de gols
 *   3. Para cada jogo sem placar:
 *      a. Se tem match_id → abre FlashScore/match/{id} e extrai placar
 *      b. Se não tem match_id → busca na página de resultados da liga por mandante+visitante
 *   4. Atualiza o arquivo preservando todos os dados existentes
 *
 * Uso:
 *   node injetar_placar.js --liga ARG
 *   node injetar_placar.js --liga BUN
 *   node injetar_placar.js --todas
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs   = require('fs');
const path = require('path');
const { log } = require('./logger');

const LIGAS = {
  BR:  { arquivo: 'brasileirao2026.js', variavel: 'DADOS_BR',  url_results: 'https://www.flashscore.com/football/brazil/serie-a-betano/results/' },
  MLS: { arquivo: 'mls2026.js',         variavel: 'DADOS_MLS', url_results: 'https://www.flashscore.com/football/usa/mls/results/' },
  ARG: { arquivo: 'argentina2026.js',   variavel: 'DADOS_ARG', url_results: 'https://www.flashscore.com/football/argentina/liga-profesional/results/' },
  USL: { arquivo: 'usl2026.js',         variavel: 'DADOS_USL', url_results: 'https://www.flashscore.com/football/usa/usl-championship/results/' },
  BUN: { arquivo: 'bundesliga2026.js',  variavel: 'DADOS_BUN', url_results: 'https://www.flashscore.com/football/germany/bundesliga/results/' }
};

function delay(base, jitter = 500) {
  return new Promise(r => setTimeout(r, base + Math.floor(Math.random() * jitter)));
}

function carregarDados(liga) {
  const destinos = [
    path.join(__dirname, '..', 'especialista-cantos', 'data', liga.arquivo),
    path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'data', liga.arquivo)
  ];
  const caminho = destinos.find(f => fs.existsSync(f));
  if (!caminho) return null;

  const raw = fs.readFileSync(caminho, 'utf-8');
  const window = {};
  try {
    const varNames = ['DADOS_ARG','DADOS_USL','DADOS_MLS','DADOS_BR','DADOS_BUN','DADOS_ECU'];
    const decls = varNames.map(v => `var ${v};`).join('\n');
    const fn = new Function('window', 'module', decls + '\n' + raw + '\nreturn window;');
    const w = fn({}, { exports: {} });
    return { dados: w[liga.variavel], caminho, raw };
  } catch (e) {
    log(`Erro ao carregar ${liga.arquivo}: ${e.message}`, 'error');
    return null;
  }
}

function salvarDados(liga, dados, caminhoOriginal) {
  const header = `window.${liga.variavel} = `;
  const json = JSON.stringify(dados, null, 2);
  const footer = `;\n\nif (typeof module !== "undefined") module.exports = { ${liga.variavel} };\n`;
  const output = header + json + footer;

  // Salvar nos dois destinos
  const destinos = [
    path.join(__dirname, '..', 'especialista-cantos', 'data', liga.arquivo),
    path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'data', liga.arquivo)
  ];

  let salvos = 0;
  destinos.forEach(dest => {
    try {
      fs.writeFileSync(dest, output);
      salvos++;
      log(`💾 Salvo: ${dest.split('EDS-Analise-ODDS')[1] || dest}`, 'success');
    } catch (_) {}
  });
  return salvos;
}

async function extrairPlacarPorMatchId(page, matchId) {
  const url = `https://www.flashscore.com/match/${matchId}/#/match-summary`;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(2000);

    const placar = await page.evaluate(() => {
      const scoreWrapper = document.querySelector('.detailScore__wrapper');
      if (!scoreWrapper) return null;
      const spans = scoreWrapper.querySelectorAll('span');
      if (spans.length >= 3) {
        const m = parseInt(spans[0].textContent.trim());
        const v = parseInt(spans[2].textContent.trim());
        if (!isNaN(m) && !isNaN(v)) return { m, v };
      }
      return null;
    });
    return placar;
  } catch (e) {
    return null;
  }
}

async function injetarPlacarLiga(codigoLiga, browser) {
  const liga = LIGAS[codigoLiga];
  if (!liga) { log(`Liga "${codigoLiga}" não encontrada.`, 'error'); return; }

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log(`║  💉 INJETAR PLACAR — ${codigoLiga.padEnd(30)}      ║`);
  console.log('╚══════════════════════════════════════════════════════╝');

  const result = carregarDados(liga);
  if (!result) { log('Arquivo não encontrado.', 'error'); return; }

  const { dados } = result;
  const jogosSemPlacar = dados.jogos.filter(j => !j.placar || j.placar.m == null);
  const jogosComPlacar = dados.jogos.filter(j => j.placar && j.placar.m != null);

  console.log(`  Total de jogos:    ${dados.jogos.length}`);
  console.log(`  Com placar:        ${jogosComPlacar.length}`);
  console.log(`  Sem placar:        ${jogosSemPlacar.length}`);

  if (jogosSemPlacar.length === 0) {
    log('Todos os jogos já têm placar! Nada a fazer.', 'success');
    return;
  }

  // Separar: com match_id (direto) vs sem match_id (precisa buscar)
  const comId = jogosSemPlacar.filter(j => j.match_id);
  const semId = jogosSemPlacar.filter(j => !j.match_id);

  console.log(`  Com match_id:      ${comId.length} (extração direta)`);
  console.log(`  Sem match_id:      ${semId.length} (busca por nome)`);
  console.log('');

  let atualizados = 0;
  let falhas = 0;
  let jogosDesdeRestart = 0;
  const LOTE = 35;

  // ── Fase 1: Jogos COM match_id — extração direta ──
  if (comId.length > 0) {
    console.log(`  ── Fase 1: Extraindo placar de ${comId.length} jogos (por match_id) ──`);
    let page = await browser.newPage();

    for (let i = 0; i < comId.length; i++) {
      // Auto-restart
      if (jogosDesdeRestart >= LOTE) {
        console.log(`\n  🔄 Auto-restart do browser...`);
        try { await page.close(); } catch (_) {}
        try { await browser.close(); } catch (_) {}
        await delay(3000);
        browser = await puppeteer.launch({
          headless: false,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
        });
        page = await browser.newPage();
        jogosDesdeRestart = 0;
        console.log(`  ✅ Browser reiniciado\n`);
      }

      const jogo = comId[i];
      process.stdout.write(`  [${i+1}/${comId.length}] ${jogo.mandante} vs ${jogo.visitante} ... `);

      const placar = await extrairPlacarPorMatchId(page, jogo.match_id);
      if (placar) {
        jogo.placar = placar;
        atualizados++;
        console.log(`${placar.m}-${placar.v} ✅`);
      } else {
        falhas++;
        console.log(`FALHA ❌`);
      }

      jogosDesdeRestart++;
      await delay(2000, 500);
    }
    try { await page.close(); } catch (_) {}
  }

  // ── Fase 2: Jogos SEM match_id — busca na página de resultados ──
  if (semId.length > 0) {
    console.log(`\n  ── Fase 2: Buscando placar de ${semId.length} jogos (por nome na página de resultados) ──`);

    // Carregar TODOS os resultados da página de resultados
    let page = await browser.newPage();
    try {
      await page.goto(liga.url_results, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await delay(5000);

      // Scroll para carregar todos
      for (let scroll = 0; scroll < 40; scroll++) {
        const clicou = await page.evaluate(() => {
          const btn = document.querySelector('a.event__more, [class*="showMore"]');
          if (btn) { btn.click(); return true; }
          return false;
        });
        if (!clicou) await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
        await delay(1500, 300);
        const total = await page.evaluate(() => document.querySelectorAll('.event__match').length);
        if (scroll % 10 === 0) console.log(`    Scroll ${scroll}: ${total} jogos carregados`);
      }

      // Extrair todos os placares da página
      const resultados = await page.evaluate(() => {
        const matches = document.querySelectorAll('.event__match');
        const res = [];
        matches.forEach(m => {
          const homeEl = m.querySelector('.event__participant--home, .event__homeParticipant');
          const awayEl = m.querySelector('.event__participant--away, .event__awayParticipant');
          const scoreH = m.querySelector('.event__score--home, [class*="score--home"]');
          const scoreA = m.querySelector('.event__score--away, [class*="score--away"]');
          if (!homeEl || !awayEl || !scoreH || !scoreA) return;
          const gh = parseInt(scoreH.textContent.trim());
          const ga = parseInt(scoreA.textContent.trim());
          if (isNaN(gh) || isNaN(ga)) return;
          res.push({
            mandante: homeEl.textContent.trim().replace(/\s+/g, ' '),
            visitante: awayEl.textContent.trim().replace(/\s+/g, ' '),
            m: gh, v: ga
          });
        });
        return res;
      });

      console.log(`    ${resultados.length} resultados carregados da página`);

      // Matching por nome
      semId.forEach(jogo => {
        const match = resultados.find(r =>
          (r.mandante.toLowerCase().includes(jogo.mandante.toLowerCase().split(' ')[0]) ||
           jogo.mandante.toLowerCase().includes(r.mandante.toLowerCase().split(' ')[0])) &&
          (r.visitante.toLowerCase().includes(jogo.visitante.toLowerCase().split(' ')[0]) ||
           jogo.visitante.toLowerCase().includes(r.visitante.toLowerCase().split(' ')[0]))
        );
        if (match) {
          jogo.placar = { m: match.m, v: match.v };
          atualizados++;
          // Remover da lista para não fazer match duplo
          const idx = resultados.indexOf(match);
          if (idx > -1) resultados.splice(idx, 1);
        } else {
          falhas++;
        }
      });
    } catch (e) {
      log(`Erro na busca por nome: ${e.message}`, 'error');
      falhas += semId.length;
    }
    try { await page.close(); } catch (_) {}
  }

  // ── Salvar ──
  dados.ultimaAtualizacao = new Date().toISOString().split('T')[0];
  const salvos = salvarDados(liga, dados, result.caminho);

  // ── Verificação de qualidade ──
  const finalComPlacar = dados.jogos.filter(j => j.placar && j.placar.m != null).length;
  const finalSemPlacar = dados.jogos.filter(j => !j.placar || j.placar.m == null).length;
  const pctCompleto = ((finalComPlacar / dados.jogos.length) * 100).toFixed(1);

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO — ${codigoLiga}`);
  console.log(`   Jogos atualizados:  ${atualizados}`);
  console.log(`   Falhas:             ${falhas}`);
  console.log(`   Total com placar:   ${finalComPlacar}/${dados.jogos.length} (${pctCompleto}%)`);
  console.log(`   Ainda sem placar:   ${finalSemPlacar}`);
  console.log(`   Arquivos salvos:    ${salvos}`);
  console.log('═══════════════════════════════════════════════════════');

  if (finalSemPlacar > 0) {
    console.log(`\n  ⚠️  ${finalSemPlacar} jogos ainda sem placar:`);
    dados.jogos.filter(j => !j.placar || j.placar.m == null).slice(0, 10).forEach(j => {
      console.log(`    - ${j.mandante} vs ${j.visitante} (${j.data || '?'}) [ID: ${j.match_id || 'SEM'}]`);
    });
  }

  return { liga: codigoLiga, atualizados, falhas, total: dados.jogos.length, comPlacar: finalComPlacar, _browser: browser };
}

// ═══════════════════════════════════════════════════
//  CLI
// ═══════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  let ligasParaInjetar = [];

  if (args.includes('--todas')) {
    ligasParaInjetar = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const codigo = (args[args.indexOf('--liga') + 1] || '').toUpperCase();
    if (LIGAS[codigo]) ligasParaInjetar = [codigo];
    else { console.log(`Liga inválida. Disponíveis: ${Object.keys(LIGAS).join(', ')}`); process.exit(1); }
  } else {
    console.log('Uso: node injetar_placar.js --liga ARG');
    console.log('     node injetar_placar.js --todas');
    process.exit(0);
  }

  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  💉 INJETAR PLACAR — EDS Soluções Inteligentes       ║');
  console.log('║  Dados REAIS do FlashScore · Zero estimativas        ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`Ligas: ${ligasParaInjetar.join(', ')}\n`);

  let browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  const resumo = [];
  for (const liga of ligasParaInjetar) {
    try {
      const r = await injetarPlacarLiga(liga, browser);
      if (r) {
        resumo.push(r);
        browser = r._browser;
      }
    } catch (e) {
      log(`Erro fatal em ${liga}: ${e.message}`, 'error');
      try { await browser.close(); } catch (_) {}
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
      });
    }
    if (ligasParaInjetar.indexOf(liga) < ligasParaInjetar.length - 1) {
      console.log('\n⏳ Intervalo entre ligas (10s)...');
      await delay(10000);
    }
  }

  try { await browser.close(); } catch (_) {}

  if (resumo.length > 0) {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║  💉 RESUMO FINAL                                     ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    resumo.forEach(r => {
      const pct = ((r.comPlacar / r.total) * 100).toFixed(1);
      console.log(`║  ${r.liga}: ${r.comPlacar}/${r.total} com placar (${pct}%) | +${r.atualizados} novos | ${r.falhas} falhas`);
    });
    console.log('╚══════════════════════════════════════════════════════╝');
  }

  console.log('\n🏁 Injeção de placar concluída!');
})();
