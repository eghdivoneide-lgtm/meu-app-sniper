// ════════════════════════════════════════════════════════════════════
// BACKTEST RETROATIVO — Roda agente em MÚLTIPLAS rodadas históricas
// Acumula Balas de Prata (prob ≥ 85) + Top picks pra ter amostra
// estatisticamente válida (R5 EDS: ≥ 30 sinais).
//
// Para cada rodada, base é congelada em 1 semana antes da rodada
// (backtest cego perfeito).
// ════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const { carregarBase } = require('./engine/loader');
const { carregarCerebro } = require('./engine/cerebro');
const { perfilTimeCompleto, statsH2H, statsLiga } = require('./engine/stats');
const { analisarJogoInteligente } = require('./engine/inteligencia');
const { filtro1_dadosInsuficientes, filtro2_imprevisibilidade, MERCADOS } = require('./engine/filtros');
const { computarPerfisLiga, maxRodada } = require('./engine/agente');
const { normalizarTime } = require('./engine/aliases');

const PASTA_VARREDOR = path.resolve(__dirname, '..', 'projeto-fantasma');
const THRESHOLD_BALA = 85;
const THRESHOLD_TOP  = 60;

// Rodadas a testar — { data_rodada, data_limite (1 semana antes), arquivos }
const RODADAS = [
  {
    data_rodada: '2026-04-22',
    data_limite: '2026-04-15',
    arquivos: {
      ARG:   'arg_rodada_2_2026-04-22.json',
      ARG_B: 'arg_b_rodada_2_2026-04-22.json'
    }
  },
  {
    data_rodada: '2026-04-28',
    data_limite: '2026-04-21',
    arquivos: {
      BR:    'br_rodada_2_2026-04-28.json',
      ARG:   'arg_rodada_2_2026-04-28.json',
      ARG_B: 'arg_b_rodada_2_2026-04-28.json',
      BUN:   'bun_rodada_2_2026-04-28.json',
      MLS:   'mls_rodada_2_2026-04-28.json'
    }
  },
  {
    data_rodada: '2026-05-05',
    data_limite: '2026-04-29',
    arquivos: {
      BR:    'br_rodada_2_2026-05-05.json',
      BR_B:  'br_b_rodada_2_2026-05-05.json',
      ARG:   'arg_rodada_2_2026-05-05.json',
      ARG_B: 'arg_b_rodada_2_2026-05-05.json',
      BUN:   'bun_rodada_2_2026-05-05.json',
      MLS:   'mls_rodada_2_2026-05-05.json'
    }
  },
  {
    data_rodada: '2026-05-12',
    data_limite: '2026-05-08',
    arquivos: {
      BR:    'br_rodada_2_2026-05-12.json',
      BR_B:  'br_b_rodada_2_2026-05-12.json',
      ARG:   'arg_rodada_2_2026-05-12.json',
      ARG_B: 'arg_b_rodada_2_2026-05-12.json',
      BUN:   'bun_rodada_2_2026-05-12.json',
      MLS:   'mls_rodada_2_2026-05-12.json'
    }
  }
];

// ────────────────────────────────────────────────────────────────────
// Constrói input + gabarito a partir dos JSONs da rodada
// ────────────────────────────────────────────────────────────────────
function montarRodada(R) {
  const input = [], gabarito = [];
  for (const liga of Object.keys(R.arquivos)) {
    const p = path.join(PASTA_VARREDOR, R.arquivos[liga]);
    if (!fs.existsSync(p)) continue;
    let raw;
    try { raw = JSON.parse(fs.readFileSync(p, 'utf8')); }
    catch { continue; }
    const jogos = Array.isArray(raw) ? raw : Object.values(raw);
    for (const j of jogos) {
      const cantos = j.estatisticas_ft?.cantos;
      input.push({ liga, match_id: j.match_id || j.id, mandante: j.mandante, visitante: j.visitante, rodada: j.rodada });
      gabarito.push({ liga, match_id: j.match_id || j.id, mandante: j.mandante, visitante: j.visitante, cantos_ft: cantos || null });
    }
  }
  return { input, gabarito };
}

// ────────────────────────────────────────────────────────────────────
// Roda agente sobre 1 rodada e retorna { balas, top, stats }
// ────────────────────────────────────────────────────────────────────
function analisarRodada(R, cerebro) {
  const { input, gabarito } = montarRodada(R);
  if (input.length === 0) return null;

  const base = carregarBase({ dataLimite: R.data_limite });

  // Index do cérebro
  const idx = cerebro ? {
    mandantesDom:   new Set(cerebro.rankings.top_mandantes_dominadores.map(r => r.liga + '|' + r.time)),
    visitantesDom:  new Set(cerebro.rankings.top_visitantes_dominadores.map(r => r.liga + '|' + r.time)),
    mandantesUnder: new Set(cerebro.rankings.top_mandantes_under_friendly.map(r => r.liga + '|' + r.time)),
    visitantesUnder:new Set(cerebro.rankings.top_visitantes_under_friendly.map(r => r.liga + '|' + r.time)),
    evitar:         new Set(cerebro.rankings.times_evitados_alta_volatilidade.map(r => r.liga + '|' + r.time))
  } : null;

  const cacheLiga = {};
  for (const cod of Object.keys(base.ligas)) {
    const L = base.ligas[cod];
    if (L.erro) continue;
    cacheLiga[cod] = {
      perfis: computarPerfisLiga(L.jogos, base.dna[cod] || {}),
      statsLiga: statsLiga(L.jogos),
      info: { codigo: cod, maxRodadaRegistrada: maxRodada(L.jogos), dnaLiga: base.dna[cod] || {} }
    };
  }

  const balas = [], top = [];
  const stats = { total: input.length, ok: 0, F1: 0, F2: 0, semDados: 0 };

  for (const jOrig of input) {
    const cache = cacheLiga[jOrig.liga];
    if (!cache) { stats.semDados++; continue; }
    const tBanco = base.ligas[jOrig.liga].times;
    const j = {
      ...jOrig,
      mandante:  normalizarTime(jOrig.mandante,  jOrig.liga, tBanco),
      visitante: normalizarTime(jOrig.visitante, jOrig.liga, tBanco)
    };
    const pM = cache.perfis[j.mandante];
    const pV = cache.perfis[j.visitante];
    if (!pM || !pV) { stats.semDados++; continue; }
    const sH = statsH2H(base.ligas[j.liga].jogos, j.mandante, j.visitante);
    if (!filtro1_dadosInsuficientes(pM, pV, sH, cache.info).passou) { stats.F1++; continue; }
    if (!filtro2_imprevisibilidade(pM, pV, sH).passou) { stats.F2++; continue; }

    const an = analisarJogoInteligente({
      jogo: j, perfilM: { ...pM }, perfilV: { ...pV },
      statsH: sH, statsLigaInfo: cache.statsLiga, infoLiga: cache.info
    });

    const keyM = j.liga + '|' + j.mandante;
    const keyV = j.liga + '|' + j.visitante;
    const bonus = { hdpM:0, hdpV:0, under:0 };
    if (idx) {
      if (idx.mandantesDom.has(keyM))    bonus.hdpM += 8;
      if (idx.visitantesDom.has(keyV))   bonus.hdpV += 8;
      if (idx.mandantesUnder.has(keyM))  bonus.under += 6;
      if (idx.visitantesUnder.has(keyV)) bonus.under += 6;
      if (idx.evitar.has(keyM))          { bonus.hdpM -= 10; bonus.under -= 10; }
      if (idx.evitar.has(keyV))          { bonus.hdpV -= 10; bonus.under -= 10; }
    }
    const probs = {
      HDP_FT_MANDANTE:  Math.min(100, Math.max(0, an.mercados[MERCADOS.HDP_FT_MANDANTE].prob  + bonus.hdpM)),
      HDP_FT_VISITANTE: Math.min(100, Math.max(0, an.mercados[MERCADOS.HDP_FT_VISITANTE].prob + bonus.hdpV)),
      UNDER_9_FT:       Math.min(100, Math.max(0, an.mercados[MERCADOS.UNDER_9_FT].prob       + bonus.under))
    };

    // Gera entries para cada mercado >= threshold_top
    for (const merc of Object.keys(probs)) {
      const p = probs[merc];
      if (p < THRESHOLD_TOP) continue;
      const entry = { jogo: j, mercado: merc, prob: p, dataRodada: R.data_rodada };
      top.push(entry);
      if (p >= THRESHOLD_BALA) balas.push(entry);
    }
    stats.ok++;
  }

  // Cruza com gabarito
  function conferir(entries) {
    let g = 0, r = 0, sg = 0;
    const det = [];
    for (const e of entries) {
      const tBanco = base.ligas[e.jogo.liga].times;
      const real = gabarito.find(x => x.liga === e.jogo.liga &&
        normalizarTime(x.mandante, e.jogo.liga, tBanco) === e.jogo.mandante &&
        normalizarTime(x.visitante, e.jogo.liga, tBanco) === e.jogo.visitante);
      if (!real || !real.cantos_ft) { sg++; continue; }
      const dif = real.cantos_ft.m - real.cantos_ft.v;
      const tot = real.cantos_ft.m + real.cantos_ft.v;
      let ok = false;
      if (e.mercado === 'HDP_FT_MANDANTE')      ok = dif >=  4;
      else if (e.mercado === 'HDP_FT_VISITANTE') ok = dif <= -4;
      else if (e.mercado === 'UNDER_9_FT')      ok = tot < 9;
      if (ok) g++; else r++;
      det.push({ ...e, real: { m: real.cantos_ft.m, v: real.cantos_ft.v, dif, tot }, ok });
    }
    return { green: g, red: r, semGab: sg, det };
  }

  return {
    rodada: R, stats,
    balas: { lista: balas, conf: conferir(balas) },
    top:   { lista: top,   conf: conferir(top) }
  };
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
console.log('');
console.log('🛡️  ════════════════════════════════════════════════════════════════');
console.log('       BACKTEST RETROATIVO — Auditor Supremo de Cantos');
console.log('       ' + RODADAS.length + ' rodadas históricas | Bala de Prata = prob ≥ ' + THRESHOLD_BALA);
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');

const cerebro = carregarCerebro();
console.log(`🧠 Cérebro: ${cerebro?.estatisticasGerais?.totalTimes || '?'} times, ${cerebro?.estatisticasGerais?.totalH2H || '?'} H2H\n`);

const resultados = [];
let totalBalas = { green: 0, red: 0, sg: 0, lista: [] };
let totalTop   = { green: 0, red: 0, sg: 0, lista: [] };

for (const R of RODADAS) {
  console.log('─────────────────────────────────────────────────────────────────────');
  console.log(`📅 RODADA ${R.data_rodada} (dataLimite ${R.data_limite})`);
  const res = analisarRodada(R, cerebro);
  if (!res) { console.log('   ⚠️ Sem dados — pulando'); continue; }

  console.log(`   📥 Jogos: ${res.stats.total} | analisados ${res.stats.ok} | F1 ${res.stats.F1} | F2 ${res.stats.F2} | semDados ${res.stats.semDados}`);
  console.log(`   💎 Balas de Prata: ${res.balas.lista.length}  →  ${res.balas.conf.green}✅ ${res.balas.conf.red}❌`);
  console.log(`   🎯 Top picks (prob ≥ ${THRESHOLD_TOP}): ${res.top.lista.length}  →  ${res.top.conf.green}✅ ${res.top.conf.red}❌`);

  // Acumula
  totalBalas.green += res.balas.conf.green;
  totalBalas.red   += res.balas.conf.red;
  totalBalas.sg    += res.balas.conf.semGab;
  totalBalas.lista.push(...res.balas.conf.det);
  totalTop.green   += res.top.conf.green;
  totalTop.red     += res.top.conf.red;
  totalTop.sg      += res.top.conf.semGab;
  totalTop.lista.push(...res.top.conf.det);

  resultados.push(res);
  console.log('');
}

// ════════════════════════════════════════════════════════════════════
// CONSOLIDADO
// ════════════════════════════════════════════════════════════════════
const sep = '═'.repeat(75);
console.log('\n' + sep);
console.log('  CONSOLIDADO — ' + RODADAS.length + ' RODADAS HISTÓRICAS');
console.log(sep);

const totalB = totalBalas.green + totalBalas.red;
const totalT = totalTop.green + totalTop.red;
const pctB = totalB ? (totalBalas.green/totalB*100).toFixed(1) : 0;
const pctT = totalT ? (totalTop.green/totalT*100).toFixed(1) : 0;

console.log(`\n💎 BALAS DE PRATA (prob ≥ ${THRESHOLD_BALA}):`);
console.log(`   Total indicações: ${totalB}  |  ${totalBalas.green} GREEN ✅  ${totalBalas.red} RED ❌`);
console.log(`   TAXA: ${pctB}% (${totalBalas.green}/${totalB})`);
if (totalB > 0) {
  console.log('   Lista:');
  for (const d of totalBalas.lista) {
    console.log(`     ${d.ok ? '✅' : '❌'}  [${d.dataRodada}] ${d.mercado.padEnd(16)} prob ${String(d.prob).padStart(3)} — ${d.jogo.mandante} vs ${d.jogo.visitante} [${d.jogo.liga}] real M=${d.real.m} V=${d.real.v} dif=${d.real.dif}`);
  }
}

console.log(`\n🎯 TOP PICKS (prob ≥ ${THRESHOLD_TOP}):`);
console.log(`   Total indicações: ${totalT}  |  ${totalTop.green} GREEN ✅  ${totalTop.red} RED ❌`);
console.log(`   TAXA: ${pctT}% (${totalTop.green}/${totalT})`);

// Análise por liga
const porLiga = {};
for (const d of totalTop.lista) {
  porLiga[d.jogo.liga] = porLiga[d.jogo.liga] || { g: 0, r: 0 };
  if (d.ok) porLiga[d.jogo.liga].g++; else porLiga[d.jogo.liga].r++;
}
console.log('\n📊 Taxa por LIGA (top picks ≥ ' + THRESHOLD_TOP + '):');
for (const liga of Object.keys(porLiga).sort()) {
  const x = porLiga[liga];
  const t = x.g + x.r;
  const p = t ? (x.g/t*100).toFixed(1) : 0;
  console.log(`   ${liga.padEnd(6)} ${x.g}✅ ${x.r}❌ = ${p}% (${x.g}/${t})`);
}

// Análise por mercado
const porMerc = {};
for (const d of totalTop.lista) {
  porMerc[d.mercado] = porMerc[d.mercado] || { g: 0, r: 0 };
  if (d.ok) porMerc[d.mercado].g++; else porMerc[d.mercado].r++;
}
console.log('\n📊 Taxa por MERCADO (top picks ≥ ' + THRESHOLD_TOP + '):');
for (const merc of Object.keys(porMerc)) {
  const x = porMerc[merc];
  const t = x.g + x.r;
  const p = t ? (x.g/t*100).toFixed(1) : 0;
  console.log(`   ${merc.padEnd(18)} ${x.g}✅ ${x.r}❌ = ${p}% (${x.g}/${t})`);
}

// Análise por faixa de probabilidade
const faixas = [
  { min: 90, max: 100, label: '90-100 (lendário)' },
  { min: 80, max: 89,  label: '80-89  (excelente)' },
  { min: 70, max: 79,  label: '70-79  (forte)' },
  { min: 60, max: 69,  label: '60-69  (sólido)' }
];
console.log('\n📊 Taxa por FAIXA DE PROBABILIDADE:');
for (const f of faixas) {
  const sub = totalTop.lista.filter(d => d.prob >= f.min && d.prob <= f.max);
  if (sub.length === 0) { console.log(`   ${f.label}: (sem indicações)`); continue; }
  const g = sub.filter(d => d.ok).length;
  const t = sub.length;
  console.log(`   ${f.label}: ${g}✅ ${t-g}❌ = ${(g/t*100).toFixed(1)}% (${g}/${t})`);
}

console.log('\n' + sep);
console.log('VEREDICTO ESTATÍSTICO (sob R5 EDS — ≥ 30 sinais)');
console.log(sep);
console.log(`Top picks totais: ${totalT}  ${totalT >= 30 ? '✅ AMOSTRA VÁLIDA' : '⚠️ amostra ainda pequena (precisa ≥ 30)'}`);
console.log(`Balas totais:     ${totalB}  ${totalB >= 10 ? '✅ amostra ok' : '⚠️ amostra ainda pequena (precisa ≥ 10)'}`);
console.log(sep);
