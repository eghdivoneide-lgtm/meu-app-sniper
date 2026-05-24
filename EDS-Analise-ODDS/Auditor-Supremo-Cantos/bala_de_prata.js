// ════════════════════════════════════════════════════════════════════
// BALA DE PRATA — Lista todas as indicações com prob ≥ 85
// (em qualquer mercado: HDP_M, HDP_V, UNDER_9)
// Cruza com gabarito e mede acerto na zona de máxima convicção.
// ════════════════════════════════════════════════════════════════════

const fs = require('fs');
const { carregarBase } = require('./engine/loader');
const { carregarCerebro } = require('./engine/cerebro');
const { perfilTimeCompleto, statsH2H, statsLiga } = require('./engine/stats');
const { analisarJogoInteligente } = require('./engine/inteligencia');
const { filtro1_dadosInsuficientes, filtro2_imprevisibilidade, MERCADOS } = require('./engine/filtros');
const { computarPerfisLiga, maxRodada } = require('./engine/agente');
const { normalizarTime } = require('./engine/aliases');

const args = { rodadaJson: null, gabarito: null, backtest: false, threshold: 85 };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--rodada-json') args.rodadaJson = argv[++i];
  else if (argv[i] === '--gabarito') args.gabarito = argv[++i];
  else if (argv[i] === '--backtest') args.backtest = true;
  else if (argv[i] === '--threshold') args.threshold = parseInt(argv[++i]);
}
if (!args.rodadaJson) { console.error('Uso: --rodada-json <path> [--gabarito <path>] [--backtest] [--threshold N]'); process.exit(1); }

console.log('');
console.log('💎 ════════════════════════════════════════════════════════════════');
console.log('       BALA DE PRATA — Indicações com Probabilidade ≥ ' + args.threshold);
console.log('       Modo: ' + (args.backtest ? 'BACKTEST (base 2026-05-08)' : 'PRODUÇÃO'));
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');

const base    = carregarBase({ dataLimite: args.backtest ? '2026-05-08' : null });
const cerebro = carregarCerebro();
const rodada  = JSON.parse(fs.readFileSync(args.rodadaJson, 'utf8'));
const gabarito = args.gabarito ? JSON.parse(fs.readFileSync(args.gabarito, 'utf8')) : null;

console.log(`🧠 Cérebro: ${cerebro?.estatisticasGerais?.totalTimes || '?'} times | ${cerebro?.estatisticasGerais?.totalH2H || '?'} H2H`);
console.log(`📥 Rodada: ${rodada.length} jogos\n`);

// Index rankings cérebro
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

const balas = []; // todas as indicações ≥ threshold
let analisados = 0;

for (const jOrig of rodada) {
  const cache = cacheLiga[jOrig.liga];
  if (!cache) continue;
  const tBanco = base.ligas[jOrig.liga].times;
  const j = {
    ...jOrig,
    mandante:  normalizarTime(jOrig.mandante,  jOrig.liga, tBanco),
    visitante: normalizarTime(jOrig.visitante, jOrig.liga, tBanco)
  };
  const pM = cache.perfis[j.mandante];
  const pV = cache.perfis[j.visitante];
  if (!pM || !pV) continue;
  const sH = statsH2H(base.ligas[j.liga].jogos, j.mandante, j.visitante);
  if (!filtro1_dadosInsuficientes(pM, pV, sH, cache.info).passou) continue;
  if (!filtro2_imprevisibilidade(pM, pV, sH).passou) continue;

  const an = analisarJogoInteligente({
    jogo: j, perfilM: { ...pM }, perfilV: { ...pV },
    statsH: sH, statsLigaInfo: cache.statsLiga, infoLiga: cache.info
  });

  // Bônus do cérebro
  const keyM = j.liga + '|' + j.mandante;
  const keyV = j.liga + '|' + j.visitante;
  const bonus = { hdpM:0, hdpV:0, under:0, motivos: [] };
  if (idx) {
    if (idx.mandantesDom.has(keyM))    { bonus.hdpM += 8;  bonus.motivos.push('🏆 ' + j.mandante + ' = TOP MANDANTE DOMINADOR'); }
    if (idx.visitantesDom.has(keyV))   { bonus.hdpV += 8;  bonus.motivos.push('✈️ ' + j.visitante + ' = TOP VISITANTE DOMINADOR'); }
    if (idx.mandantesUnder.has(keyM))  { bonus.under += 6; bonus.motivos.push('🏠 ' + j.mandante + ' = UNDER-FRIENDLY casa'); }
    if (idx.visitantesUnder.has(keyV)) { bonus.under += 6; bonus.motivos.push('🛡️ ' + j.visitante + ' = UNDER-FRIENDLY fora'); }
    if (idx.evitar.has(keyM))          { bonus.hdpM -= 10; bonus.under -= 10; bonus.motivos.push('⚠️ ' + j.mandante + ' = ERRÁTICO'); }
    if (idx.evitar.has(keyV))          { bonus.hdpV -= 10; bonus.under -= 10; bonus.motivos.push('⚠️ ' + j.visitante + ' = ERRÁTICO'); }
  }
  const probHDP_M = Math.min(100, Math.max(0, an.mercados[MERCADOS.HDP_FT_MANDANTE].prob  + bonus.hdpM));
  const probHDP_V = Math.min(100, Math.max(0, an.mercados[MERCADOS.HDP_FT_VISITANTE].prob + bonus.hdpV));
  const probUND   = Math.min(100, Math.max(0, an.mercados[MERCADOS.UNDER_9_FT].prob       + bonus.under));

  // Gera "balas" para cada mercado que atinge threshold
  if (probHDP_M >= args.threshold) balas.push({ jogo: j, mercado: 'HDP_FT_MANDANTE',  prob: probHDP_M, evidencias: an.mercados[MERCADOS.HDP_FT_MANDANTE].evidencias,  bonus });
  if (probHDP_V >= args.threshold) balas.push({ jogo: j, mercado: 'HDP_FT_VISITANTE', prob: probHDP_V, evidencias: an.mercados[MERCADOS.HDP_FT_VISITANTE].evidencias, bonus });
  if (probUND   >= args.threshold) balas.push({ jogo: j, mercado: 'UNDER_9_FT',       prob: probUND,   evidencias: an.mercados[MERCADOS.UNDER_9_FT].evidencias,       bonus });
  analisados++;
}

balas.sort((a, b) => b.prob - a.prob);

console.log('🔬 Analisados (passaram sanidade): ' + analisados);
console.log('💎 BALAS DE PRATA (prob ≥ ' + args.threshold + '): ' + balas.length);
console.log('');

if (balas.length === 0) {
  console.log('⚠️ Nenhuma indicação com prob ≥ ' + args.threshold + '. Tente um threshold mais baixo.');
  process.exit(0);
}

const sep = '═'.repeat(75);

// Lista cada Bala de Prata
for (let i = 0; i < balas.length; i++) {
  const b = balas[i];
  const j = b.jogo;
  console.log(sep);
  console.log(`💎 BALA #${i+1} — Probabilidade ${b.prob}/100 — ${b.mercado}`);
  console.log(sep);
  console.log(`Liga: ${j.liga} | Rodada ${j.rodada || '?'}`);
  console.log(`Partida: ${j.mandante} (casa) vs ${j.visitante} (fora)`);
  console.log('');
  if (b.bonus.motivos.length > 0) {
    console.log('🧠 SINAIS DO CÉREBRO:');
    for (const m of b.bonus.motivos) console.log('   ' + m);
    console.log('');
  }
  console.log('🔍 TOP 5 EVIDÊNCIAS:');
  for (let k = 0; k < Math.min(5, b.evidencias.length); k++) {
    const e = b.evidencias[k];
    const barra = '█'.repeat(Math.round(e.score / 10)) + '░'.repeat(10 - Math.round(e.score / 10));
    console.log(`   ${barra}  ${String(Math.round(e.score)).padStart(3)}/100 (peso ${String(e.peso).padStart(2)})  ${e.nome}`);
    console.log(`         └ ${e.detalhe}`);
  }
  console.log('');
}

// Cruza com gabarito
if (gabarito) {
  console.log(sep);
  console.log('CONFERÊNCIA COM RESULTADO REAL');
  console.log(sep);
  let g = 0, r = 0, sg = 0;
  for (const b of balas) {
    const j = b.jogo;
    const tBanco = base.ligas[j.liga].times;
    const real = gabarito.find(x => x.liga === j.liga &&
      normalizarTime(x.mandante, j.liga, tBanco) === j.mandante &&
      normalizarTime(x.visitante, j.liga, tBanco) === j.visitante);
    if (!real || !real.cantos_ft) { sg++; continue; }
    const dif = real.cantos_ft.m - real.cantos_ft.v;
    const tot = real.cantos_ft.m + real.cantos_ft.v;
    let ok = false;
    if (b.mercado === 'HDP_FT_MANDANTE')   ok = dif >=  4;
    else if (b.mercado === 'HDP_FT_VISITANTE') ok = dif <= -4;
    else if (b.mercado === 'UNDER_9_FT')    ok = tot < 9;
    if (ok) g++; else r++;
    console.log((ok ? '  ✅' : '  ❌') + ' [' + b.mercado.padEnd(16) + '] prob ' + String(b.prob).padStart(3) + ' — ' + j.mandante + ' vs ' + j.visitante + ' [' + j.liga + '] real: M=' + real.cantos_ft.m + ' V=' + real.cantos_ft.v + ' (dif=' + dif + ', tot=' + tot + ')');
  }
  const tot = g + r;
  const pct = tot ? (g/tot*100).toFixed(1) : 0;
  console.log('');
  console.log(sep);
  console.log(`  💎 TAXA DE ACERTO BALA DE PRATA (prob ≥ ${args.threshold}): ${pct}% (${g}/${tot})`);
  console.log(`     ${g} GREEN ✅  |  ${r} RED ❌` + (sg ? '  |  ' + sg + ' sem gabarito' : ''));
  console.log(sep);
}
