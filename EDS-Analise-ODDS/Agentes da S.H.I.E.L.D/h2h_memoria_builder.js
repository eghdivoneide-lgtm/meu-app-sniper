/**
 * H2H MEMORIA BUILDER v2.0
 * EDS Soluções Inteligentes
 *
 * ─── MISSÃO ────────────────────────────────────────────────────────────────
 * Constrói uma memória completa de confrontos diretos (H2H) para TODOS os
 * pares de times de uma liga, rodando UMA VEZ por temporada.
 *
 * Diferente do Monster YAAKEN (coleta por rodada), este agente constrói um
 * banco histórico permanente: para N times, gera C(N,2) = N*(N-1)/2 pares.
 * Ex: Brasileirão 20 times → 190 pares completos.
 *
 * ─── v2.0 MELHORIAS ────────────────────────────────────────────────────────
 * • Reutiliza aba do browser (não abre/fecha por par) → ~2x mais rápido
 * • Resume automático: salva progresso parcial, retoma de onde parou
 * • Seletores atualizados para FlashScore 2026
 * • 10 ligas suportadas (incluindo ARG_B, CL, ECU, ALM, J1)
 * • Delay reduzido com anti-detecção inteligente
 *
 * ─── O QUE CAPTURA POR PAR ─────────────────────────────────────────────────
 * • Últimos 5 confrontos gerais (data, mandante, placar)
 * • Últimos 3 quando time A joga em casa
 * • Últimos 3 quando time B joga em casa
 * • Stats: total, vitórias de cada lado, empates, média de gols, % BTTS
 *
 * ─── USO ───────────────────────────────────────────────────────────────────
 *   node h2h_memoria_builder.js --liga BR
 *   node h2h_memoria_builder.js --todas
 *   node h2h_memoria_builder.js --liga BR --resume   (retoma de onde parou)
 *
 * @module h2h_memoria_builder
 * @version 2.0.0
 */

'use strict';

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO DE LIGAS
// ═══════════════════════════════════════════════════════════════
const LIGAS = {
  BR: {
    nome:          'Brasileirão Série A',
    url_results:   'https://www.flashscore.com/football/brazil/serie-a-betano/results/',
    url_prev:      'https://www.flashscore.com/football/brazil/serie-a-2025/results/',
    jogos_pagina:  40,
    max_pares:     190  // C(20,2)
  },
  MLS: {
    nome:          'Major League Soccer',
    url_results:   'https://www.flashscore.com/football/usa/mls/results/',
    url_prev:      'https://www.flashscore.com/football/usa/mls-2025/results/',
    jogos_pagina:  50,
    max_pares:     435  // C(30,2)
  },
  ARG: {
    nome:          'Liga Profesional Argentina',
    url_results:   'https://www.flashscore.com/football/argentina/liga-profesional/results/',
    url_prev:      'https://www.flashscore.com/football/argentina/liga-profesional-2025/results/',
    jogos_pagina:  50,
    max_pares:     325  // C(26,2)
  },
  ARG_B: {
    nome:          'Primera Nacional (Argentina B)',
    url_results:   'https://www.flashscore.com/football/argentina/primera-nacional/results/',
    url_prev:      'https://www.flashscore.com/football/argentina/primera-nacional-2025/results/',
    jogos_pagina:  50,
    max_pares:     630  // C(36,2)
  },
  BUN: {
    nome:          'Bundesliga (Alemanha)',
    url_results:   'https://www.flashscore.com/football/germany/bundesliga/results/',
    url_prev:      'https://www.flashscore.com/football/germany/bundesliga-2024-2025/results/',
    jogos_pagina:  40,
    max_pares:     153  // C(18,2)
  },
  USL: {
    nome:          'USL Championship (EUA)',
    url_results:   'https://www.flashscore.com/football/usa/usl-championship/results/',
    url_prev:      'https://www.flashscore.com/football/usa/usl-championship-2025/results/',
    jogos_pagina:  50,
    max_pares:     300  // ~25 times
  },
  CL: {
    nome:          'Primera División (Chile)',
    url_results:   'https://www.flashscore.com/football/chile/liga-de-primera/results/',
    url_prev:      'https://www.flashscore.com/football/chile/liga-de-primera-2025/results/',
    jogos_pagina:  40,
    max_pares:     120  // ~16 times
  },
  ECU: {
    nome:          'Liga Pro (Equador)',
    url_results:   'https://www.flashscore.com/football/ecuador/liga-pro/results/',
    url_prev:      'https://www.flashscore.com/football/ecuador/liga-pro-2025/results/',
    jogos_pagina:  40,
    max_pares:     120  // ~16 times
  },
  ALM: {
    nome:          'A-League (Austrália)',
    url_results:   'https://www.flashscore.com/football/australia/a-league/results/',
    url_prev:      'https://www.flashscore.com/football/australia/a-league-2024-2025/results/',
    jogos_pagina:  40,
    max_pares:     66   // ~12 times
  },
  J1: {
    nome:          'J1 League (Japão)',
    url_results:   'https://www.flashscore.com/football/japan/j1-league/results/',
    url_prev:      'https://www.flashscore.com/football/japan/j1-league-2025/results/',
    jogos_pagina:  50,
    max_pares:     171  // ~19 times
  }
};

// Quantos confrontos coletar por par (configurável)
const CFG = {
  max_geral:     5,  // últimos N confrontos gerais
  max_casa_a:    3,  // últimos N quando time A é mandante
  max_casa_b:    3   // últimos N quando time B é mandante
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

function delay(ms, jitter = 800) {
  return new Promise(r => setTimeout(r, ms + Math.floor(Math.random() * jitter)));
}

function log(msg, tipo = 'info') {
  const icons = { info: 'ℹ️ ', ok: '✅', err: '❌', warn: '⚠️ ', h2h: '🔗', scan: '🔍' };
  console.log(`${icons[tipo] || '•'} ${msg}`);
}

function chaveCanonica(a, b) {
  // Chave sempre ordenada alfabeticamente para garantir unicidade
  const [t1, t2] = [a, b].sort();
  return `${t1}|${t2}`;
}

function nomesSimilares(a, b) {
  if (!a || !b) return false;
  const norm = s => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  if (na.length >= 4 && nb.includes(na.slice(0, 4))) return true;
  if (nb.length >= 4 && na.includes(nb.slice(0, 4))) return true;
  return false;
}

function calcStats(jogos) {
  if (!jogos || jogos.length === 0) return { tot: 0, av: 0, e: 0, bv: 0, avg_gols: 0, btts: 0 };
  // jogos = [{ d, m_nome (nome do mandante), gm, gv }, ...]
  // av = vitórias do primeiro time da chave canônica (alfabeticamente)
  let av = 0, e = 0, bv = 0, totalGols = 0, btts = 0;
  for (const j of jogos) {
    if (j.gm > j.gv) av++;
    else if (j.gm < j.gv) bv++;
    else e++;
    totalGols += (j.gm + j.gv);
    if (j.gm >= 1 && j.gv >= 1) btts++;
  }
  return {
    tot:      jogos.length,
    av:       av,
    e:        e,
    bv:       bv,
    avg_gols: parseFloat((totalGols / jogos.length).toFixed(2)),
    btts_pct: Math.round((btts / jogos.length) * 100)
  };
}

// ═══════════════════════════════════════════════════════════════
//  FASE 1: COLETA DE MATCH IDs DA PÁGINA DE RESULTADOS
// ═══════════════════════════════════════════════════════════════

/**
 * Coleta IDs de jogos da página de resultados, fazendo scroll para
 * carregar mais jogos. Retorna array de { id, mandante, visitante }
 * (os nomes dos times são extraídos para montar o mapa de pares).
 */
async function coletarMatchIds(page, url, limite) {
  log(`Acessando: ${url}`, 'scan');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delay(5000, 2000);

  // Scroll progressivo para carregar mais resultados
  const scrolls = Math.ceil(limite / 12);
  for (let s = 0; s < scrolls; s++) {
    await page.evaluate(() => window.scrollBy(0, 1200));
    await delay(1500, 500);

    // Tenta clicar em "Mostrar mais" / "Show more" se disponível
    try {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button, a'))
          .find(el => /show more|mostrar mais|ver mais/i.test(el.innerText || ''));
        if (btn) btn.click();
      });
      await delay(2000, 500);
    } catch (_) {}
  }

  // Extrai IDs e nomes dos times (v2: seletores atualizados FlashScore 2026)
  return await page.evaluate(() => {
    const jogos = [];
    const matches = document.querySelectorAll('div[id^="g_1_"]');
    for (const m of matches) {
      const id = m.id.replace('g_1_', '');

      // Seletores em ordem de prioridade (FlashScore 2026)
      const homeEl = m.querySelector('[class*="homeParticipant"], [class*="participant--home"]');
      const awayEl = m.querySelector('[class*="awayParticipant"], [class*="participant--away"]');
      let mandante  = homeEl ? homeEl.innerText.trim().split('\n')[0] : '';
      let visitante = awayEl ? awayEl.innerText.trim().split('\n')[0] : '';

      // Fallback: extrair do texto (formato: data, mandante, visitante, score1, score2)
      if ((!mandante || !visitante) && m.innerText) {
        const lines = m.innerText.split('\n').map(l => l.trim()).filter(Boolean);
        // Padrão FlashScore: [data, mandante, visitante, golsM, golsV]
        if (lines.length >= 5) {
          if (!mandante) mandante = lines[1];
          if (!visitante) visitante = lines[2];
        }
      }

      if (id && mandante && visitante) {
        jogos.push({ id, mandante, visitante });
      }
    }
    return jogos;
  });
}

// ═══════════════════════════════════════════════════════════════
//  FASE 2: EXTRAÇÃO DO H2H DE UM JOGO ESPECÍFICO
// ═══════════════════════════════════════════════════════════════

/**
 * Navega para a página H2H de um jogo e extrai os confrontos históricos.
 * Retorna { geral[], a_casa[], b_casa[] } com dados individuais de cada jogo.
 *
 * @param {Page}   page     - Puppeteer page
 * @param {string} matchId  - ID do jogo no FlashScore
 * @param {string} timeA    - Nome do time A (mandante no confronto atual)
 * @param {string} timeB    - Nome do time B (visitante no confronto atual)
 */
async function extrairH2HMemoria(page, matchId, timeA, timeB, tentativa = 1) {
  log(`  H2H: ${timeA} vs ${timeB} → ${matchId}${tentativa > 1 ? ' (retry)' : ''}`, 'h2h');

  try {
    // Navegar para página do jogo (delay reduzido v2.1)
    await page.goto(`https://www.flashscore.com/match/${matchId}/#/match-summary`, {
      waitUntil: 'domcontentloaded', timeout: 25000
    });
    await delay(tentativa === 1 ? 1800 : 3000, 500);

    // Clicar na aba H2H (FlashScore 2026: hash routing não funciona mais)
    await page.evaluate(() => {
      const tabs = document.querySelectorAll('a, button, div, span');
      for (const t of tabs) {
        if (t.textContent.trim() === 'H2H') { t.click(); return; }
      }
    });
    await delay(tentativa === 1 ? 2200 : 3500, 500);

    // Extrair dados das DOM rows
    const resultado = await page.evaluate((nA, nB, maxG, maxCA, maxCB) => {
      const res = { geral: [], a_casa: [], b_casa: [] };

      function norm(s) {
        return (s || '').toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '');
      }
      function sim(a, b) {
        const na = norm(a), nb = norm(b);
        return na === nb || (na.length >= 4 && nb.includes(na.slice(0, 4)))
          || (nb.length >= 4 && na.includes(nb.slice(0, 4)));
      }

      // Extrair rows do DOM (formato FlashScore 2026):
      // Cada row: "14.04.26 | SA | Sao Paulo | Flamengo RJ | 2 | 1"
      const allRows = document.querySelectorAll('[class*="rows"] [class*="row"], [class*="Row"]');
      const jogos = [];

      allRows.forEach(r => {
        const parts = r.innerText.split('\n').map(s => s.trim()).filter(Boolean);
        // Formato: [data, liga, mandante, visitante, golsM, golsV, resultado?]
        if (parts.length < 5) return;

        const dateStr = parts[0]; // "28.01.26" ou "05.11.25"
        const dm = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{2,4})$/);
        if (!dm) return;

        const ano = dm[3].length === 2 ? '20' + dm[3] : dm[3];
        const dataISO = `${ano}-${dm[2]}-${dm[1]}`;

        // Detectar posição dos nomes e scores
        // parts pode ser: [data, liga, mandante, visitante, gm, gv, W/L/D]
        // ou:              [data, liga, mandante, visitante, gm, gv]
        let mandante = '', visitante = '', gm = NaN, gv = NaN;

        // Procurar scores (números isolados) de trás pra frente
        const nums = [];
        for (let i = parts.length - 1; i >= 2; i--) {
          if (/^\d+$/.test(parts[i])) nums.unshift({ idx: i, val: parseInt(parts[i]) });
          if (nums.length >= 2) break;
        }

        if (nums.length >= 2) {
          gm = nums[0].val;
          gv = nums[1].val;
          // Times são logo antes dos scores, pulando a liga (idx 1)
          mandante = parts[nums[0].idx - 2] || parts[2];
          visitante = parts[nums[0].idx - 1] || parts[3];
        }

        if (!mandante || !visitante || isNaN(gm)) return;
        jogos.push({ d: dataISO, m: mandante, v: visitante, gm, gv });
      });

      // Filtrar apenas H2H direto (ambos os times presentes)
      const h2hDireto = jogos.filter(j =>
        (sim(j.m, nA) && sim(j.v, nB)) || (sim(j.m, nB) && sim(j.v, nA))
      );

      // Preencher geral (últimos N H2H diretos)
      for (const j of h2hDireto) {
        if (res.geral.length >= maxG) break;
        res.geral.push({ d: j.d, m: j.m, gm: j.gm, gv: j.gv });

        // Splits casa
        if (sim(j.m, nA) && res.a_casa.length < maxCA) {
          res.a_casa.push({ d: j.d, gm: j.gm, gv: j.gv });
        } else if (sim(j.m, nB) && res.b_casa.length < maxCB) {
          res.b_casa.push({ d: j.d, gm: j.gm, gv: j.gv });
        }
      }

      return res;
    }, timeA, timeB, CFG.max_geral, CFG.max_casa_a, CFG.max_casa_b);

    // Retry automático se extraction retornou vazio (página pode estar carregando)
    if (resultado.geral.length === 0 && tentativa === 1) {
      log(`  ⚠️  Extração vazia, tentando novamente...`, 'warn');
      await delay(2000, 500);
      return await extrairH2HMemoria(page, matchId, timeA, timeB, 2);
    }

    return resultado;

  } catch (err) {
    // Retry em caso de erro de rede/timeout
    if (tentativa === 1 && /timeout|Target|Navigation/i.test(err.message)) {
      log(`  ⚠️  ${err.message.substring(0, 40)}, retry...`, 'warn');
      await delay(3000, 1000);
      return await extrairH2HMemoria(page, matchId, timeA, timeB, 2);
    }
    log(`  H2H falhou para ${matchId}: ${err.message.substring(0, 50)}`, 'warn');
    return { geral: [], a_casa: [], b_casa: [] };
  }
}

// ═══════════════════════════════════════════════════════════════
//  CORE: BUILDER DE UMA LIGA
// ═══════════════════════════════════════════════════════════════

async function buildH2HMemoriaLiga(codigoLiga, browser) {
  const liga = LIGAS[codigoLiga];
  if (!liga) { log(`Liga "${codigoLiga}" inválida`, 'err'); return null; }

  const startTime = Date.now();
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`🔗 H2H MEMORIA BUILDER — ${liga.nome} (${codigoLiga})`);
  console.log('═══════════════════════════════════════════════════════════════');

  // ── Fase 1: Coletar match IDs da temporada atual ──────────────────────────
  const pageRes = await browser.newPage();
  await pageRes.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36');

  log('Fase 1A: Coletando jogos da temporada atual...', 'scan');
  let todosJogos = await coletarMatchIds(pageRes, liga.url_results, liga.jogos_pagina);
  log(`  → ${todosJogos.length} jogos encontrados na temporada atual`, 'ok');

  // ── Fase 1B: Temporada anterior para cobrir pares faltando ────────────────
  if (liga.url_prev) {
    try {
      log('Fase 1B: Coletando temporada anterior (pares faltando)...', 'scan');
      // Nova aba para evitar erro de contexto destruído na navegação
      const pagePrev = await browser.newPage();
      await pagePrev.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36');
      const jogosAnteriores = await coletarMatchIds(pagePrev, liga.url_prev, liga.jogos_pagina * 2);
      await pagePrev.close();
      log(`  → ${jogosAnteriores.length} jogos encontrados na temporada anterior`, 'ok');
      todosJogos = [...todosJogos, ...jogosAnteriores];
    } catch (err) {
      log(`Fase 1B falhou (${err.message.substring(0, 60)}), continuando com temporada atual`, 'warn');
    }
  }
  await pageRes.close();

  // ── Monta mapa de pares → match ID mais recente ───────────────────────────
  const paresMap = new Map(); // chave → { matchId, timeA, timeB }
  const timesSet = new Set();

  for (const jogo of todosJogos) {
    if (!jogo.mandante || !jogo.visitante) continue;
    timesSet.add(jogo.mandante);
    timesSet.add(jogo.visitante);
    const chave = chaveCanonica(jogo.mandante, jogo.visitante);
    if (!paresMap.has(chave)) {
      // Primeiro encontrado é o mais recente (resultados vêm ordem decrescente de data)
      const [tA, tB] = chave.split('|');
      paresMap.set(chave, { matchId: jogo.id, timeA: tA, timeB: tB });
    }
  }

  const times = Array.from(timesSet).sort();
  const totalPares = paresMap.size;
  log(`Times detectados: ${times.length} | Pares com histórico: ${totalPares}`, 'ok');

  // ── Fase 2: Extração H2H para cada par ────────────────────────────────────
  // Resume: carregar progresso parcial se existir
  const resumeFile = path.join(__dirname, `_h2h_resume_${codigoLiga}.json`);
  let confrontos = {};
  let processados = 0, comDados = 0, semDados = 0;

  if (fs.existsSync(resumeFile)) {
    try {
      const saved = JSON.parse(fs.readFileSync(resumeFile, 'utf-8'));
      confrontos = saved.confrontos || {};
      comDados = saved.comDados || 0;
      semDados = saved.semDados || 0;
      log(`RESUME: retomando de ${Object.keys(confrontos).length} pares já coletados`, 'ok');
    } catch (_) {}
  }

  const paresArray = Array.from(paresMap.entries());

  // Reutiliza UMA página para todos os pares (v2: muito mais rápido)
  const pageH2H = await browser.newPage();
  await pageH2H.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36');

  for (const [chave, { matchId, timeA, timeB }] of paresArray) {
    processados++;

    // Pular pares já coletados (resume)
    if (confrontos[chave]) {
      if (processados % 20 === 0) log(`  Pulando ${processados}/${totalPares} (já coletado)`, 'info');
      continue;
    }

    console.log(`\n  [${processados}/${totalPares}] ${timeA} × ${timeB}`);

    const h2hRaw = await extrairH2HMemoria(pageH2H, matchId, timeA, timeB);

    const stats = calcStats(h2hRaw.geral);

    const entrada = {
      times: [timeA, timeB],
      geral:  h2hRaw.geral,
      a_casa: h2hRaw.a_casa,  // timeA como mandante
      b_casa: h2hRaw.b_casa,  // timeB como mandante
      stats
    };

    confrontos[chave] = entrada;

    if (stats.tot > 0) {
      comDados++;
      log(`  ✅ ${stats.tot} confrontos | ${timeA}: ${stats.av}v | E: ${stats.e} | ${timeB}: ${stats.bv}v | avg_gols: ${stats.avg_gols} | BTTS: ${stats.btts_pct}%`, 'ok');
    } else {
      semDados++;
      log(`  ⚠️  Sem dados H2H encontrados`, 'warn');
    }

    // Salvar progresso a cada 5 pares (v2.1: proteção dobrada)
    if (processados % 5 === 0) {
      try {
        fs.writeFileSync(resumeFile, JSON.stringify({ confrontos, comDados, semDados }), 'utf-8');
      } catch (_) {}
    }

    // Anti-DDoS: pausa reduzida v2.1 (1.5s em vez de 2.5s)
    if (processados < totalPares) {
      await delay(1500, 700);
    }
  }

  await pageH2H.close();

  // Limpar arquivo de resume (coleta completa)
  try { fs.unlinkSync(resumeFile); } catch (_) {}

  // ── Fase 3: Gerar arquivo JS ───────────────────────────────────────────────
  const dataHoje   = new Date().toISOString().split('T')[0];
  const nomeArquivo = 'h2h_memoria_' + codigoLiga + '.js';

  const outputData = {
    gerado_em:       dataHoje,
    liga:            codigoLiga,
    nome_liga:       liga.nome,
    times:           times,
    total_pares:     totalPares,
    pares_com_dados: comDados,
    confrontos:      confrontos
  };
  const outputJS = [
    '// H2H Memoria — ' + liga.nome,
    '// Gerado por h2h_memoria_builder.js — EDS Solucoes Inteligentes',
    '// Data: ' + dataHoje + ' | Pares: ' + totalPares + ' | Times: ' + times.length + ' | Com dados: ' + comDados,
    '// NAO EDITAR MANUALMENTE — regenerar com: node h2h_memoria_builder.js --liga ' + codigoLiga,
    '(function() {',
    '  const dados = ' + JSON.stringify(outputData, null, 2) + ';',
    '  if (!window.H2H_MEM) window.H2H_MEM = {};',
    "  window.H2H_MEM['" + codigoLiga + "'] = dados;",
    "  console.log('[EDS] H2H Memoria " + codigoLiga + ": ' + Object.keys(dados.confrontos).length + ' pares carregados');",
    '})();'
  ].join('\n');

  // Salva nas 4 localizações padrão (mesmo padrão do escoteiro)
  const destinos = [
    path.join(__dirname, '..', '..', 'Yaaken-Scanner',        'yaaken-data', nomeArquivo),
    path.join(__dirname, '..', 'Yaaken-Scanner',              'yaaken-data', nomeArquivo),
    path.join(__dirname, '..', '..', 'yaaken-data',           nomeArquivo),
    path.join(__dirname, '..', 'especialista-cantos', 'data', nomeArquivo)
  ];

  let salvos = 0;
  for (const dest of destinos) {
    try {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, outputJS, 'utf8');
      salvos++;
      log(`Salvo: ${dest}`, 'ok');
    } catch (e) {
      log(`Erro ao salvar em ${dest}: ${e.message}`, 'warn');
    }
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const mins = Math.floor(elapsed / 60), secs = elapsed % 60;

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📊 SUMÁRIO — ${liga.nome}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Times detectados:    ${times.length}`);
  console.log(`  Pares processados:   ${totalPares}`);
  console.log(`  Com dados H2H:       ${comDados}/${totalPares}`);
  console.log(`  Sem dados:           ${semDados}`);
  console.log(`  Arquivos salvos:     ${salvos}`);
  console.log(`  Tempo total:         ${mins}m ${secs}s`);
  console.log('═══════════════════════════════════════════════════════════════');

  return { liga: codigoLiga, pares: totalPares, comDados, arquivo: nomeArquivo };
}

// ═══════════════════════════════════════════════════════════════
//  HELPER PARA O YAAKEN SCANNER (função de lookup)
//  Gera h2h_helpers.js que o Scanner pode usar para converter
//  os dados da memória para o formato esperado por agScoreH2H()
// ═══════════════════════════════════════════════════════════════

function gerarHelpersJS() {
  const helpersPath = path.join(
    __dirname, '..', '..', 'Yaaken-Scanner', 'yaaken-data', 'h2h_helpers.js'
  );

  const helpersContent = `// h2h_helpers.js — EDS Soluções Inteligentes
// Funções de lookup para H2H Memoria no Yaaken Scanner
// Gerado automaticamente por h2h_memoria_builder.js

(function() {
  /**
   * Busca o H2H histórico entre dois times na memória carregada.
   * Retorna objeto compatível com agScoreH2H() + dados extras.
   *
   * @param {string} ligaCod    - Ex: 'BR', 'MLS'
   * @param {string} mandante   - Nome do time mandante
   * @param {string} visitante  - Nome do time visitante
   * @returns {object|null}     - { total, vitorias_mandante, empates, vitorias_visitante,
   *                               taxa_empate, taxa_visitante, avg_gols, btts_pct,
   *                               mandante_casa[], visitante_fora[] } ou null
   */
  window.buscarH2HMemoria = function(ligaCod, mandante, visitante) {
    if (!window.H2H_MEM || !window.H2H_MEM[ligaCod]) return null;
    const mem = window.H2H_MEM[ligaCod];
    if (!mem.confrontos) return null;

    function norm(s) {
      return (s || '').toLowerCase()
        .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
    }
    function sim(a, b) {
      const na = norm(a), nb = norm(b);
      return na === nb
        || (na.length >= 4 && nb.includes(na.slice(0,4)))
        || (nb.length >= 4 && na.includes(nb.slice(0,4)));
    }

    // Busca o par pelo método de chave canônica
    for (const [chave, conf] of Object.entries(mem.confrontos)) {
      const [tA, tB] = chave.split('|');
      const aEhMandante = sim(tA, mandante) && sim(tB, visitante);
      const bEhMandante = sim(tB, mandante) && sim(tA, visitante);

      if (!aEhMandante && !bEhMandante) continue;

      const s = conf.stats || {};
      const tot  = s.tot  || 0;
      const eE   = s.e    || 0;

      let vMandante, vVisitante, mandanteCasa, visitanteFora;

      if (aEhMandante) {
        // timeA é o mandante atual → vitórias de A = av, vitórias de B = bv
        vMandante  = s.av || 0;
        vVisitante = s.bv || 0;
        mandanteCasa  = conf.a_casa || [];  // histórico de quando mandante jogou em casa
        visitanteFora = conf.b_casa || [];  // histórico de quando visitante jogou como visitante (b jogou em casa = b era visitante aqui)
      } else {
        // timeB é o mandante atual → vitórias de B = bv, vitórias de A = av
        vMandante  = s.bv || 0;
        vVisitante = s.av || 0;
        mandanteCasa  = conf.b_casa || [];
        visitanteFora = conf.a_casa || [];
      }

      const taxaV = tot > 0 ? parseFloat(((vVisitante / tot) * 100).toFixed(1)) : 0;
      const taxaE = tot > 0 ? parseFloat(((eE       / tot) * 100).toFixed(1)) : 0;

      return {
        // Formato compatível com agScoreH2H()
        total:               tot,
        vitorias_mandante:   vMandante,
        empates:             eE,
        vitorias_visitante:  vVisitante,
        taxa_empate:         taxaE,
        taxa_visitante:      taxaV,
        // Dados extras para análise futura
        avg_gols:            s.avg_gols  || 0,
        btts_pct:            s.btts_pct  || 0,
        mandante_casa:       mandanteCasa,   // [{ d, gm, gv }, ...]
        visitante_fora:      visitanteFora,  // [{ d, gm, gv }, ...]
        jogos_geral:         conf.geral  || []
      };
    }

    return null;  // par não encontrado na memória
  };

  console.log('[EDS] h2h_helpers.js carregado — buscarH2HMemoria() disponível');
})();
`;

  try {
    fs.mkdirSync(path.dirname(helpersPath), { recursive: true });
    fs.writeFileSync(helpersPath, helpersContent, 'utf8');
    // Copia também para EDS-Analise-ODDS
    const mirror = path.join(__dirname, '..', 'Yaaken-Scanner', 'yaaken-data', 'h2h_helpers.js');
    fs.mkdirSync(path.dirname(mirror), { recursive: true });
    fs.writeFileSync(mirror, helpersContent, 'utf8');
    log('h2h_helpers.js gerado em ambos os locais', 'ok');
  } catch (e) {
    log(`Erro ao gerar helpers: ${e.message}`, 'warn');
  }
}

// ═══════════════════════════════════════════════════════════════
//  ENTRY POINT — CLI
// ═══════════════════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  let ligasParaBuildar = [];

  if (args.includes('--todas')) {
    ligasParaBuildar = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const idx    = args.indexOf('--liga');
    const codigo = (args[idx + 1] || '').toUpperCase();
    if (LIGAS[codigo]) {
      ligasParaBuildar = [codigo];
    } else {
      console.log(`Liga "${args[idx + 1]}" inválida. Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('');
    console.log('H2H MEMORIA BUILDER — EDS Soluções Inteligentes');
    console.log('');
    console.log('USO:');
    console.log('  node h2h_memoria_builder.js --liga BR');
    console.log('  node h2h_memoria_builder.js --liga MLS');
    console.log('  node h2h_memoria_builder.js --todas');
    console.log('');
    console.log('Ligas disponíveis:', Object.keys(LIGAS).join(', '));
    console.log('');
    console.log('FREQUÊNCIA RECOMENDADA: 1x por temporada (ou após mercado de transferências)');
    process.exit(0);
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔗 H2H MEMORIA BUILDER v1.0 — EDS Soluções Inteligentes');
  console.log(`   Ligas: ${ligasParaBuildar.join(', ')}`);
  console.log('   Modo: headless=false + StealthPlugin');
  console.log(`   Config: ${CFG.max_geral} gerais + ${CFG.max_casa_a} casa_A + ${CFG.max_casa_b} casa_B por par`);
  console.log('═══════════════════════════════════════════════════════════════');

  // Gera helpers antes do browser (não precisa de puppeteer)
  gerarHelpersJS();

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

  for (const liga of ligasParaBuildar) {
    try {
      const res = await buildH2HMemoriaLiga(liga, browser);
      if (res) resultados.push(res);
    } catch (err) {
      log(`Erro fatal na liga ${liga}: ${err.message}`, 'err');
    }

    // Pausa entre ligas
    if (ligasParaBuildar.indexOf(liga) < ligasParaBuildar.length - 1) {
      log('Pausa de 15s entre ligas...', 'info');
      await delay(15000, 3000);
    }
  }

  await browser.close();

  if (resultados.length > 1) {
    console.log('\n══════════════ SUMÁRIO GERAL ══════════════');
    resultados.forEach(r => {
      console.log(`  ${r.liga}: ${r.pares} pares | ${r.comDados} com dados | → ${r.arquivo}`);
    });
  }

  console.log('\n🔗 H2H Memoria Builder completo!');
  console.log('   Adicione os arquivos h2h_memoria_*.js ao index.html do Yaaken Scanner.');
  console.log('   O Scanner usará automaticamente buscarH2HMemoria() no DNA por Partida.');
})();
