/**
 * Monster YAAKEN v2 — Agente de Rodada para o Sistema YAAKEN
 * EDS Soluções Inteligentes
 *
 * ─── BASEADO NO PADRÃO V4 DO ANALISTA FANTASMA ───────────────────────────
 *  Usa o mesmo mecanismo de acesso ao FlashScore que funciona em produção:
 *   - headless: false  (navegador visível, anti-detecção)
 *   - StealthPlugin    (fingerprint humano)
 *   - IDs extraídos via .event__match[id^="g_1_"]  (não URLs de equipes)
 *   - URL limpa: flashscore.com/match/{ID}/#/match-summary
 *   - Navegação por abas via clickTab() (mesma página, sem nova navegação)
 *   - delayHumano() com jitter em todos os acessos
 *
 * ─── MISSÃO YAAKEN (diferente do varredor-rodada.js) ─────────────────────
 *   varredor-rodada.js  →  histórico completo por time (Especialista em Cantos)
 *   monster_yaaken.js   →  rodada ATUAL: odds 1X2 + H2H por jogo
 *
 * USO:
 *   node monster_yaaken.js --liga BR
 *   node monster_yaaken.js --liga MLS
 *   node monster_yaaken.js --liga ARG
 *   node monster_yaaken.js --liga USL
 *   node monster_yaaken.js --liga BUN
 *   node monster_yaaken.js --todas
 *
 * OUTPUT: EDS-ODDS-TEACHER/yaaken/yaaken_BR_2026-04-11.json
 *
 * @module monster_yaaken
 * @version 2.0.0
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO DE LIGAS
//  Mesmo padrão do varredor-rodada.js — URLs de resultados + fixtures
// ═══════════════════════════════════════════════════════════════
const LIGAS = {
  BR: {
    nome:         'Brasileirão Série A',
    url_fixture:  'https://www.flashscore.com/football/brazil/serie-a-betano/fixtures/',
    url_results:  'https://www.flashscore.com/football/brazil/serie-a-betano/results/',
    jogos_rodada: 10
  },
  MLS: {
    nome:         'Major League Soccer',
    url_fixture:  'https://www.flashscore.com/football/usa/mls/fixtures/',
    url_results:  'https://www.flashscore.com/football/usa/mls/results/',
    jogos_rodada: 15
  },
  ARG: {
    nome:         'Liga Profesional Argentina',
    url_fixture:  'https://www.flashscore.com/football/argentina/liga-profesional/fixtures/',
    url_results:  'https://www.flashscore.com/football/argentina/liga-profesional/results/',
    jogos_rodada: 15
  },
  USL: {
    nome:         'USL Championship',
    url_fixture:  'https://www.flashscore.com/football/usa/usl-championship/fixtures/',
    url_results:  'https://www.flashscore.com/football/usa/usl-championship/results/',
    jogos_rodada: 12
  },
  BUN: {
    nome:         'Bundesliga (Alemanha)',
    url_fixture:  'https://www.flashscore.com/football/germany/bundesliga/fixtures/',
    url_results:  'https://www.flashscore.com/football/germany/bundesliga/results/',
    jogos_rodada: 9
  }
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

/** Delay humanizado com jitter (igual ao varredor-rodada.js) */
function delayHumano(base, jitter = 1000) {
  const total = base + Math.floor(Math.random() * jitter);
  return new Promise(r => setTimeout(r, total));
}

function log(msg, tipo = 'info') {
  const icons = { info: 'ℹ️ ', success: '✅', error: '❌', warn: '⚠️ ', yaaken: '🎯', flashscore: '⚡' };
  console.log(`${icons[tipo] || '•'} ${msg}`);
}

function progressBar(current, total) {
  const pct  = Math.round((current / total) * 100);
  const fill = Math.round(pct / 10);
  return '█'.repeat(fill) + '░'.repeat(10 - fill) + ` ${pct}%`;
}

// ═══════════════════════════════════════════════════════════════
//  EXTRAÇÃO DE IDs DA RODADA
//  Igual ao varredor-rodada.js: usa .event__match[id^="g_1_"]
// ═══════════════════════════════════════════════════════════════

/**
 * Extrai IDs de jogos de uma página do FlashScore (fixtures ou results)
 */
async function extrairIdsRodada(page, limite) {
  return await page.evaluate((lim) => {
    const matches = document.querySelectorAll('.event__match');
    const ids = [];
    for (let i = 0; i < Math.min(matches.length, lim); i++) {
      const elId = matches[i].getAttribute('id');
      if (elId && elId.startsWith('g_1_')) {
        ids.push(elId.replace('g_1_', ''));
      }
    }
    return ids;
  }, limite);
}

// ═══════════════════════════════════════════════════════════════
//  CLICK TAB — Navega entre abas do FlashScore
//  Método idêntico ao flashscore-monster.js v4
// ═══════════════════════════════════════════════════════════════

async function clickTab(page, ...textos) {
  const clicked = await page.evaluate((...labels) => {
    const els = Array.from(document.querySelectorAll('button, a, div, span, li, nav'))
      .filter(el => {
        const t = (el.innerText || '').toUpperCase().trim();
        return labels.some(l => t === l.toUpperCase());
      })
      .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
    if (els.length > 0) { els[0].click(); return true; }
    return false;
  }, ...textos);

  if (!clicked) log(`Aba "${textos.join('/')}" não encontrada`, 'warn');
  await delayHumano(2500, 800);
  return clicked;
}

// ═══════════════════════════════════════════════════════════════
//  EXTRAÇÃO DE ODDS 1X2
//  Reusa a mesma lógica do flashscore-monster.js v4
// ═══════════════════════════════════════════════════════════════

async function extrairOdds(page) {
  await clickTab(page, 'ODDS', 'Odds', 'COTAÇÕES');
  await delayHumano(3000, 1000);

  return await page.evaluate(() => {
    const lines = document.body.innerText.split('\n').map(l => l.trim()).filter(Boolean);

    // Método 1: padrão "1 X 2" seguido por três números
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '1' && lines[i + 1] === 'X' && lines[i + 2] === '2') {
        const vals = [];
        for (let j = i + 3; j < Math.min(i + 25, lines.length) && vals.length < 3; j++) {
          const n = parseFloat(lines[j]);
          if (!isNaN(n) && n > 1.0 && n < 100) vals.push(lines[j]);
        }
        if (vals.length === 3) return { oddM: vals[0], oddEmpate: vals[1], oddV: vals[2], metodo: '1X2_label' };
      }
    }

    // Método 2: seletores CSS específicos do FlashScore
    const oddEls = document.querySelectorAll('[class*="oddsCell__odd"], [class*="odds__odd"]');
    if (oddEls.length >= 3) {
      const vals = Array.from(oddEls).slice(0, 3).map(el => el.innerText.trim());
      const nums = vals.filter(v => !isNaN(parseFloat(v)) && parseFloat(v) > 1);
      if (nums.length === 3) return { oddM: nums[0], oddEmpate: nums[1], oddV: nums[2], metodo: 'css_selector' };
    }

    // Método 3: busca por padrão numérico "X.XX" próximos
    const numericLines = lines.filter(l => /^\d+\.\d{2}$/.test(l) && parseFloat(l) > 1.0 && parseFloat(l) < 30);
    if (numericLines.length >= 3) {
      return { oddM: numericLines[0], oddEmpate: numericLines[1], oddV: numericLines[2], metodo: 'numeric_scan' };
    }

    return { oddM: 'Oculta', oddEmpate: 'Oculta', oddV: 'Oculta', metodo: 'nao_encontrado' };
  });
}

// ═══════════════════════════════════════════════════════════════
//  EXTRAÇÃO DE H2H (Confrontos Diretos)
//  Navega para /#/h2h/overall na mesma sessão
// ═══════════════════════════════════════════════════════════════

async function extrairH2H(page, matchUrl) {
  const h2hUrl = matchUrl
    .replace('/#/match-summary', '/#/h2h/overall')
    .replace('/#/odds', '/#/h2h/overall');

  try {
    // Tenta clicar na aba H2H sem navegar
    const clicou = await clickTab(page, 'H2H', 'HEAD-TO-HEAD', 'CONFRONTOS');

    if (!clicou) {
      // Fallback: navegar diretamente para URL H2H
      await page.goto(h2hUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await delayHumano(3500, 1000);
    } else {
      await delayHumano(3000, 800);
    }

    const h2h = await page.evaluate(() => {
      const resultado = {
        total: 0,
        vitorias_mandante: 0,
        empates: 0,
        vitorias_visitante: 0,
        taxa_empate: 0,
        taxa_visitante: 0,
        ultimos_jogos: []
      };

      let countHome = 0, countEmpate = 0, countAway = 0, total = 0;

      // Método 1: seletores CSS do painel H2H
      const h2hRows = document.querySelectorAll(
        '[class*="h2h__row"], [class*="h2hRow"], [class*="h2h__section"] .event__match'
      );

      h2hRows.forEach(row => {
        const txt = row.innerText || '';
        const scoreMatch = txt.match(/(\d+)\s*[-:]\s*(\d+)/);
        if (scoreMatch) {
          total++;
          const g1 = parseInt(scoreMatch[1]);
          const g2 = parseInt(scoreMatch[2]);
          if (g1 > g2) countHome++;
          else if (g1 < g2) countAway++;
          else countEmpate++;

          if (resultado.ultimos_jogos.length < 5) {
            resultado.ultimos_jogos.push(txt.replace(/\n/g, ' ').trim().slice(0, 80));
          }
        }
      });

      // Método 2: varrer texto completo por placares com contexto de data
      if (total === 0) {
        const fullText = document.body.innerText;
        const scoreRegex = /\b(\d{1,2})\s*[-:]\s*(\d{1,2})\b/g;
        let m;
        const seen = new Set();

        while ((m = scoreRegex.exec(fullText)) !== null && total < 25) {
          const ctx = fullText.substring(Math.max(0, m.index - 40), m.index + 40);
          const key = `${m.index}`;
          // Filtra por contexto: deve ter ano (20xx) próximo
          if (!seen.has(key) && /20\d\d/.test(ctx)) {
            seen.add(key);
            const g1 = parseInt(m[1]), g2 = parseInt(m[2]);
            total++;
            if (g1 > g2) countHome++;
            else if (g1 < g2) countAway++;
            else countEmpate++;
          }
        }
      }

      if (total > 0) {
        resultado.total             = total;
        resultado.vitorias_mandante = countHome;
        resultado.empates           = countEmpate;
        resultado.vitorias_visitante= countAway;
        resultado.taxa_empate       = parseFloat(((countEmpate / total) * 100).toFixed(1));
        resultado.taxa_visitante    = parseFloat(((countAway  / total) * 100).toFixed(1));
      }

      return resultado;
    });

    return h2h;

  } catch (err) {
    log(`H2H falhou: ${err.message}`, 'warn');
    return {
      total: 0, vitorias_mandante: 0, empates: 0,
      vitorias_visitante: 0, taxa_empate: 0, taxa_visitante: 0, ultimos_jogos: []
    };
  }
}

// ═══════════════════════════════════════════════════════════════
//  EXTRAÇÃO DE DADOS BÁSICOS DA PARTIDA (Cabeçalho)
//  Mesmo padrão do flashscore-monster.js v4
// ═══════════════════════════════════════════════════════════════

async function extrairCabecalho(page) {
  return await page.evaluate(() => {
    let mandante = '', visitante = '', dataPartida = '', status = 'AGENDADO';

    const hEl = document.querySelector('.duelParticipant__home .participant__participantName');
    const aEl = document.querySelector('.duelParticipant__away .participant__participantName');
    if (hEl) mandante  = hEl.innerText.trim();
    if (aEl) visitante = aEl.innerText.trim();

    // Fallback: título da página
    if (!mandante || !visitante) {
      const title = document.title || '';
      if (title.includes(' - ')) {
        const [p1, p2] = title.split(' - ');
        if (!mandante)  mandante  = p1.replace(/\d+/g, '').trim();
        if (!visitante) visitante = (p2 || '').replace(/Live|H2H|\d+/gi, '').trim();
      }
    }

    // Data e hora
    const dateEl = document.querySelector('.duelParticipant__startTime, .startTime, [class*="startTime"]');
    if (dateEl) dataPartida = dateEl.innerText.trim();

    // Placar (jogo em andamento ou encerrado)
    let placar = null;
    const scoreWrapper = document.querySelector('.detailScore__wrapper');
    if (scoreWrapper) {
      const spans = scoreWrapper.querySelectorAll('span');
      if (spans.length >= 3) {
        placar = `${spans[0].textContent.trim()} - ${spans[2].textContent.trim()}`;
      }
    }

    return { mandante, visitante, dataPartida, status, placar };
  });
}

// ═══════════════════════════════════════════════════════════════
//  CORE: EXTRAIR DADOS YAAKEN DE UMA PARTIDA
// ═══════════════════════════════════════════════════════════════

async function extrairPartidaYaaken(browser, matchId, ligaConfig, codigoLiga) {
  const matchUrl = `https://www.flashscore.com/match/${matchId}/#/match-summary`;
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  const resultado = {
    match_id:    matchId,
    url:         matchUrl,
    liga:        ligaConfig.nome,
    codigo_liga: codigoLiga,
    mandante:    '',
    visitante:   '',
    data:        '',
    status:      'AGENDADO',
    placar:      null,
    odds: {
      oddM:      'Oculta',
      oddEmpate: 'Oculta',
      oddV:      'Oculta',
      metodo:    'nao_tentado'
    },
    h2h: {
      total: 0,
      vitorias_mandante:  0,
      empates:            0,
      vitorias_visitante: 0,
      taxa_empate:        0,
      taxa_visitante:     0,
      ultimos_jogos:      []
    },
    timestamp_coleta: new Date().toISOString()
  };

  try {
    log(`Acessando: ${matchUrl}`, 'flashscore');
    await page.goto(matchUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await delayHumano(4500, 1500);

    // 1. Cabeçalho
    const cab = await extrairCabecalho(page);
    resultado.mandante  = cab.mandante;
    resultado.visitante = cab.visitante;
    resultado.data      = cab.dataPartida;
    resultado.status    = cab.status;
    resultado.placar    = cab.placar;

    log(`  Times: ${resultado.mandante} vs ${resultado.visitante}`, 'info');

    // 2. Odds 1X2
    log('  Buscando odds 1X2...', 'info');
    const odds = await extrairOdds(page);
    resultado.odds = odds;
    log(`  Odds: M=${odds.oddM} | E=${odds.oddEmpate} | V=${odds.oddV} [${odds.metodo}]`, 'info');

    await delayHumano(2000, 800);

    // 3. H2H
    log('  Buscando H2H...', 'info');
    const h2h = await extrairH2H(page, matchUrl);
    resultado.h2h = h2h;
    log(`  H2H: ${h2h.total} jogos | Empate ${h2h.taxa_empate}% | Visitante ${h2h.taxa_visitante}%`, 'info');

    return resultado;

  } catch (err) {
    log(`Erro em ${matchId}: ${err.message}`, 'error');
    resultado.erro = err.message;
    return resultado;
  } finally {
    await page.close();
  }
}

// ═══════════════════════════════════════════════════════════════
//  VARREDURA DE UMA LIGA — RODADA ATUAL
// ═══════════════════════════════════════════════════════════════

async function varrerLigaYaaken(codigoLiga, browser) {
  const liga = LIGAS[codigoLiga];
  if (!liga) {
    log(`Liga "${codigoLiga}" não encontrada. Disponíveis: ${Object.keys(LIGAS).join(', ')}`, 'error');
    return null;
  }

  const startTime = Date.now();
  const limite = liga.jogos_rodada + 3;

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`🎯 MONSTER YAAKEN v2 — ${liga.nome} (${codigoLiga})`);
  console.log('═══════════════════════════════════════════════════');

  // ── Passo 1: Obter IDs dos jogos (fixtures = próximos) ──
  const pageFix = await browser.newPage();
  await pageFix.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  log(`Acessando fixtures: ${liga.url_fixture}`, 'flashscore');
  await pageFix.goto(liga.url_fixture, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delayHumano(5000, 2000);

  let gameIds = await extrairIdsRodada(pageFix, limite);
  await pageFix.close();

  // Fallback: results (jogos recentes) se fixtures estiver vazia
  if (gameIds.length === 0) {
    log('Fixtures vazia. Tentando results (jogos recentes)...', 'warn');
    const pageRes = await browser.newPage();
    await pageRes.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );
    await pageRes.goto(liga.url_results, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await delayHumano(5000, 2000);
    gameIds = await extrairIdsRodada(pageRes, limite);
    await pageRes.close();
  }

  log(`Encontrados ${gameIds.length} jogos para analisar`, 'info');

  if (gameIds.length === 0) {
    log('Nenhum jogo encontrado. Verifique a URL da liga.', 'error');
    return null;
  }

  // ── Passo 2: Extrair dados de cada jogo ──
  const rodada = [];
  const falhas = [];

  for (let i = 0; i < gameIds.length; i++) {
    const gameId = gameIds[i];
    console.log(`\n  [${i + 1}/${gameIds.length}] ${progressBar(i + 1, gameIds.length)} | ID: ${gameId}`);

    let jogo = null;
    let tentativas = 0;
    const maxRetries = 2;
    const delays = [5000, 12000];

    while (tentativas < maxRetries) {
      try {
        jogo = await extrairPartidaYaaken(browser, gameId, liga, codigoLiga);

        if (jogo && jogo.mandante && jogo.visitante) {
          const oddsOK = jogo.odds.oddM !== 'Oculta';
          const h2hOK  = jogo.h2h.total > 0;
          console.log(`  ✅ ${jogo.mandante} vs ${jogo.visitante} | Odds: ${oddsOK ? '✓' : '?'} | H2H: ${h2hOK ? jogo.h2h.total + ' jogos' : '?'}`);
          break;
        } else {
          throw new Error('Times não extraídos — página provavelmente não carregou');
        }
      } catch (e) {
        tentativas++;
        if (tentativas < maxRetries) {
          console.log(`  ⚠️  Tentativa ${tentativas}/${maxRetries}: ${e.message}. Retry em ${delays[tentativas - 1] / 1000}s...`);
          await delayHumano(delays[tentativas - 1], 2000);
        } else {
          console.log(`  ❌ Falha permanente: ${e.message}`);
          falhas.push({ id: gameId, erro: e.message });
          jogo = null;
        }
      }
    }

    if (jogo) rodada.push(jogo);

    // Pausa anti-DDoS entre jogos (igual ao varredor-rodada.js)
    if (i < gameIds.length - 1) {
      await delayHumano(5000, 2000);
    }
  }

  // ── Passo 3: Salvar arquivo ──
  const dataHoje = new Date().toISOString().split('T')[0];
  const nomeArquivo = `yaaken_${codigoLiga}_${dataHoje}.json`;

  const pastaYaaken = path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'yaaken');
  if (!fs.existsSync(pastaYaaken)) {
    fs.mkdirSync(pastaYaaken, { recursive: true });
  }

  const caminhoArquivo = path.join(pastaYaaken, nomeArquivo);
  const output = {
    liga:        codigoLiga,
    nome_liga:   liga.nome,
    data_coleta: dataHoje,
    total_jogos: rodada.length,
    falhas:      falhas.length,
    jogos:       rodada
  };

  fs.writeFileSync(caminhoArquivo, JSON.stringify(output, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const oddsEncontradas = rodada.filter(j => j.odds.oddM !== 'Oculta').length;
  const h2hEncontrados  = rodada.filter(j => j.h2h.total > 0).length;

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📊 SUMÁRIO — ${liga.nome}`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Jogos encontrados:   ${gameIds.length}`);
  console.log(`  Jogos extraídos:     ${rodada.length}`);
  console.log(`  Com odds 1X2:        ${oddsEncontradas}/${rodada.length}`);
  console.log(`  Com H2H:             ${h2hEncontrados}/${rodada.length}`);
  console.log(`  Falhas:              ${falhas.length}`);
  console.log(`  Tempo total:         ${mins}m ${secs}s`);
  console.log(`  Arquivo:             ${nomeArquivo}`);
  console.log('═══════════════════════════════════════════════════');

  return { liga: codigoLiga, arquivo: caminhoArquivo, jogos: rodada.length, falhas: falhas.length };
}

// ═══════════════════════════════════════════════════════════════
//  ENTRY POINT — CLI
// ═══════════════════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  let ligasParaVarrer = [];

  if (args.includes('--todas')) {
    ligasParaVarrer = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const idx    = args.indexOf('--liga');
    const codigo = (args[idx + 1] || '').toUpperCase();
    if (LIGAS[codigo]) {
      ligasParaVarrer = [codigo];
    } else {
      console.log(`Liga "${args[idx + 1]}" inválida. Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('');
    console.log('USO:');
    console.log('  node monster_yaaken.js --liga BR');
    console.log('  node monster_yaaken.js --liga MLS');
    console.log('  node monster_yaaken.js --todas');
    console.log('');
    console.log('  (ou use yaaken.bat BR)');
    process.exit(0);
  }

  console.log('');
  console.log('═════════════════════════════════════════════════════════');
  console.log('🎯 MONSTER YAAKEN v2 — EDS Soluções Inteligentes');
  console.log(`   Ligas: ${ligasParaVarrer.join(', ')}`);
  console.log(`   Padrão V4: headless=false + StealthPlugin + IDs do DOM`);
  console.log('═════════════════════════════════════════════════════════');

  // Browser idêntico ao varredor-rodada.js v4
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1366,900',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const resultados = [];

  for (const liga of ligasParaVarrer) {
    try {
      const result = await varrerLigaYaaken(liga, browser);
      if (result) resultados.push(result);
    } catch (err) {
      log(`Erro fatal na liga ${liga}: ${err.message}`, 'error');
    }

    if (ligasParaVarrer.indexOf(liga) < ligasParaVarrer.length - 1) {
      log('Pausa de 12s entre ligas...', 'info');
      await delayHumano(12000, 3000);
    }
  }

  await browser.close();

  if (resultados.length > 1) {
    console.log('\n══════════════ SUMÁRIO GERAL ══════════════');
    resultados.forEach(r => {
      console.log(`  ${r.liga}: ${r.jogos} jogos, ${r.falhas} falhas`);
    });
  }

  if (resultados.length > 0) {
    console.log('\n🎯 Monster YAAKEN completo! Abra o YAAKEN Scanner para analisar.');
    console.log('   Arquivo(s) em: EDS-ODDS-TEACHER/yaaken/');
  } else {
    console.log('\n⚠️  Nenhum resultado salvo. Verifique os logs acima.');
  }
})();
