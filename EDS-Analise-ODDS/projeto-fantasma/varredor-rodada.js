/**
 * Varredôr de Rodada v4 — Batch Processor Multi-Liga
 * EDS Soluções Inteligentes
 *
 * Uso:
 *   node varredor-rodada.js --liga MLS
 *   node varredor-rodada.js --liga BR
 *   node varredor-rodada.js --liga ARG
 *   node varredor-rodada.js --liga BUN
 *   node varredor-rodada.js --todas
 *
 * @module varredor-rodada
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');
const { log } = require('./logger');

// ═══════════════════════════════════════════════════
//  CONFIGURAÇÃO DE LIGAS
// ═══════════════════════════════════════════════════
const LIGAS = {
  BR: {
    nome: 'Brasileirão Série A',
    url: 'https://www.flashscore.com/football/brazil/serie-a-betano/results/',
    times: 20,
    jogos_por_rodada: 10   // 20 times ÷ 2
  },
  MLS: {
    nome: 'Major League Soccer',
    url: 'https://www.flashscore.com/football/usa/mls/results/',
    times: 30,
    jogos_por_rodada: 15   // 30 times ÷ 2 (era 14 — CORRIGIDO)
  },
  ARG: {
    nome: 'Liga Profesional Argentina',
    url: 'https://www.flashscore.com/football/argentina/liga-profesional/results/',
    times: 30,
    jogos_por_rodada: 15   // 30 times ÷ 2 (era 28/14 — CORRIGIDO)
  },
  USL: {
    nome: 'USL Championship',
    url: 'https://www.flashscore.com/football/usa/usl-championship/results/',
    times: 25,
    jogos_por_rodada: 12   // 25 times: 12 jogos + 1 folga por rodada (era 24 — CORRIGIDO)
  },
  ECU: {
    nome: 'Liga Pro Equador',
    url: 'https://www.flashscore.com/football/ecuador/liga-pro/results/',
    times: 16,
    jogos_por_rodada: 8    // 16 times ÷ 2
  },
  BUN: {
    nome: 'Bundesliga (Alemanha)',
    url: 'https://www.flashscore.com/football/germany/bundesliga/results/',
    times: 18,
    jogos_por_rodada: 9    // 18 times ÷ 2
  }
};

/**
 * Delay com jitter humanizado
 * @param {number} base - Delay base em ms
 * @param {number} [jitter=1000] - Variação aleatória
 */
function delayHumano(base, jitter = 1000) {
  const total = base + Math.floor(Math.random() * jitter);
  return new Promise(r => setTimeout(r, total));
}

/**
 * Gera barra de progresso visual
 * @param {number} current
 * @param {number} total
 * @returns {string}
 */
function progressBar(current, total) {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round(pct / 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + ' ' + pct + '%';
}

/**
 * Executa a varredura de uma liga
 * @param {string} codigoLiga - Código da liga (BR, MLS, ARG, USL, ECU)
 * @param {Object} browser - Instância do Puppeteer browser
 */
async function varrerLiga(codigoLiga, browser) {
  const liga = LIGAS[codigoLiga];
  if (!liga) {
    log(`Liga "${codigoLiga}" não encontrada. Disponíveis: ${Object.keys(LIGAS).join(', ')}`, 'error');
    return null;
  }

  const startTime = Date.now();
  const maxPartidas = liga.jogos_por_rodada + 2; // margem

  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log(`👻 VARREDÔR v4 — ${liga.nome} (${codigoLiga})`);
  console.log('═══════════════════════════════════════════');

  // Extrair IDs dos jogos recentes
  const page = await browser.newPage();
  log(`Acessando resultados: ${liga.url}`, 'flashscore');

  await page.goto(liga.url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delayHumano(5000, 2000);

  const gameIds = await page.evaluate((limite) => {
    const matches = document.querySelectorAll('.event__match');
    const ids = [];
    for (let i = 0; i < Math.min(matches.length, limite); i++) {
      const elId = matches[i].getAttribute('id');
      if (elId && elId.includes('g_1_')) {
        ids.push(elId.replace('g_1_', ''));
      }
    }
    return ids;
  }, maxPartidas);

  await page.close();
  log(`Encontrados ${gameIds.length} jogos recentes`, 'info');

  if (gameIds.length === 0) {
    log('Nenhum jogo encontrado. Verifique a URL da liga.', 'error');
    return null;
  }

  // Instanciar Monster e injetar browser
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  const rodada = [];
  const falhas = [];
  let retryTotal = 0;

  for (let i = 0; i < gameIds.length; i++) {
    const url = `https://www.flashscore.com/match/${gameIds[i]}/#/match-summary`;

    console.log(`\n  [${i + 1}/${gameIds.length}] ${progressBar(i + 1, gameIds.length)} | ID: ${gameIds[i]}`);

    let partida = null;
    let tentativas = 0;
    const maxRetries = 3;
    const delays = [5000, 10000, 20000]; // backoff exponencial

    while (tentativas < maxRetries) {
      try {
        partida = await fantasma.extrairPartida(url, {
          liga: liga.nome,
          codigo_liga: codigoLiga
        });

        // Validar extração mínima
        if (partida && partida.estatisticas_ft && partida.estatisticas_ft.cantos) {
          const cantos = partida.estatisticas_ft.cantos;
          console.log(`  ✅ ${partida.mandante} vs ${partida.visitante} | Cantos FT: ${cantos.m}-${cantos.v} | Campos: ${partida.meta.campos_disponiveis}`);
          break;
        } else {
          throw new Error('Cantos FT não extraídos');
        }
      } catch (e) {
        tentativas++;
        retryTotal++;
        if (tentativas < maxRetries) {
          console.log(`  ⚠️  Falha (tentativa ${tentativas}/${maxRetries}): ${e.message}. Retry em ${delays[tentativas] / 1000}s...`);
          await delayHumano(delays[tentativas], 1000);
        } else {
          console.log(`  ❌ Falha permanente após ${maxRetries} tentativas: ${e.message}`);
          falhas.push({ id: gameIds[i], erro: e.message });
          partida = null;
        }
      }
    }

    if (partida) rodada.push(partida);

    // Pausa anti-DDoS
    if (i < gameIds.length - 1) {
      await delayHumano(5000, 2000);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  // Salvar arquivo
  const dataHoje = new Date().toISOString().split('T')[0];
  const rodadaNum = Math.ceil(rodada.length / (liga.jogos_por_rodada || 10)) || '?';
  const nomeArquivo = `${codigoLiga.toLowerCase()}_rodada_${rodadaNum}_${dataHoje}.json`;
  const caminhoArquivo = path.join(__dirname, nomeArquivo);

  fs.writeFileSync(caminhoArquivo, JSON.stringify(rodada, null, 2));

  // Retrocompatibilidade: salvar como mls_rodada_atual.json se for MLS
  if (codigoLiga === 'MLS') {
    fs.writeFileSync(path.join(__dirname, 'mls_rodada_atual.json'), JSON.stringify(rodada, null, 2));
  }

  // Calcular campos médios
  let camposMedia = 0;
  let camposFalhadosCounts = {};
  rodada.forEach(j => {
    camposMedia += j.meta.campos_disponiveis;
    j.meta.campos_falhados.forEach(f => {
      camposFalhadosCounts[f] = (camposFalhadosCounts[f] || 0) + 1;
    });
  });
  camposMedia = rodada.length > 0 ? (camposMedia / rodada.length).toFixed(1) : 0;

  const topFalhados = Object.entries(camposFalhadosCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([campo, count]) => `${campo} (${count}x)`)
    .join(', ');

  // Sumário
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log(`📊 SUMÁRIO DA VARREDURA — ${liga.nome}`);
  console.log('═══════════════════════════════════════════');
  console.log(`  Jogos encontrados:  ${gameIds.length}`);
  console.log(`  Jogos extraídos:    ${rodada.length} (${Math.round(rodada.length / gameIds.length * 100)}%)`);
  console.log(`  Jogos com falha:    ${falhas.length}${falhas.length > 0 ? ' (' + falhas.map(f => f.id).join(', ') + ')' : ''}`);
  console.log(`  Retries totais:     ${retryTotal}`);
  console.log(`  Campos médios:      ${camposMedia}`);
  console.log(`  Campos falhados:    ${topFalhados || 'nenhum'}`);
  console.log(`  Tempo total:        ${mins}m ${secs}s`);
  console.log(`  Arquivo:            ${nomeArquivo}`);
  console.log('═══════════════════════════════════════════');

  return { liga: codigoLiga, arquivo: nomeArquivo, jogos: rodada.length, falhas: falhas.length };
}

// ═══════════════════════════════════════════════════
//  CLI
// ═══════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  let ligasParaVarrer = [];

  if (args.includes('--todas')) {
    ligasParaVarrer = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const idx = args.indexOf('--liga');
    const codigo = (args[idx + 1] || '').toUpperCase();
    if (LIGAS[codigo]) {
      ligasParaVarrer = [codigo];
    } else {
      console.log(`Liga "${args[idx + 1]}" inválida. Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
      process.exit(1);
    }
  } else {
    // Default: MLS
    ligasParaVarrer = ['MLS'];
  }

  console.log('');
  console.log('═════════════════════════════════════════════════');
  console.log('👻 ANALISTA FANTASMA v4 — VARREDURA INICIADA');
  console.log(`   Ligas: ${ligasParaVarrer.join(', ')}`);
  console.log('═════════════════════════════════════════════════');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  const resultados = [];

  for (const liga of ligasParaVarrer) {
    try {
      const result = await varrerLiga(liga, browser);
      if (result) resultados.push(result);
    } catch (err) {
      log(`Erro fatal na liga ${liga}: ${err.message}`, 'error');
    }

    // Pausa entre ligas
    if (ligasParaVarrer.indexOf(liga) < ligasParaVarrer.length - 1) {
      log('Pausa de 10s entre ligas...', 'info');
      await delayHumano(10000, 3000);
    }
  }

  await browser.close();

  // Sumário geral
  if (resultados.length > 1) {
    console.log('\n═══ SUMÁRIO GERAL ═══');
    resultados.forEach(r => {
      console.log(`  ${r.liga}: ${r.jogos} jogos, ${r.falhas} falhas → ${r.arquivo}`);
    });
  }

  console.log('\n🏁 Varredura completa!');
})();
