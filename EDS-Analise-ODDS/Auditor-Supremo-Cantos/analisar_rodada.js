// ════════════════════════════════════════════════════════════════════
// ANÁLISE FRIA — Top 10 HDP (ou Under) usando o cérebro
//
// O agente analisa CADA jogo da rodada SEM amarras de cascata.
// Apenas sanidade mínima (F1/F2 leves) e depois ranking probabilístico.
// Bônus quando time está nos rankings do cérebro (dominador/under-friendly).
//
// Uso:
//   node analisar_rodada.js --rodada-json <caminho> --tipo HDP|UNDER [--top N]
//   node analisar_rodada.js --rodada-json ./backtest/rodada_2026-05-12.json --tipo HDP --top 10
// ════════════════════════════════════════════════════════════════════

const fs = require('fs');
const { carregarBase } = require('./engine/loader');
const { carregarCerebro } = require('./engine/cerebro');
const { perfilTimeCompleto, statsH2H, statsLiga } = require('./engine/stats');
const { analisarJogoInteligente } = require('./engine/inteligencia');
const { filtro1_dadosInsuficientes, filtro2_imprevisibilidade, MERCADOS } = require('./engine/filtros');
const { computarPerfisLiga, maxRodada } = require('./engine/agente');
const { normalizarTime } = require('./engine/aliases');

// ── Args
const args = { rodadaJson: null, tipo: 'HDP', top: 10, porLiga: null, backtest: false, gabarito: null };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--rodada-json') args.rodadaJson = argv[++i];
  else if (argv[i] === '--tipo')   args.tipo = argv[++i].toUpperCase();
  else if (argv[i] === '--top')    args.top = parseInt(argv[++i]);
  else if (argv[i] === '--por-liga') args.porLiga = parseInt(argv[++i]);
  else if (argv[i] === '--backtest') args.backtest = true;
  else if (argv[i] === '--gabarito') args.gabarito = argv[++i];
}

if (!args.rodadaJson) {
  console.error('Uso: node analisar_rodada.js --rodada-json <path> --tipo HDP|UNDER [--top N]');
  process.exit(1);
}

console.log('');
console.log('🛡️  ════════════════════════════════════════════════════════════════');
console.log('       AUDITOR SUPREMO DE CANTOS — Análise Fria');
console.log('       Tipo: TOP-' + args.top + ' ' + args.tipo);
console.log('       Modo: ' + (args.backtest ? 'BACKTEST (base congelada 2026-05-08)' : 'PRODUÇÃO'));
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');

// ── Carrega base, cérebro, rodada
const base    = carregarBase({ dataLimite: args.backtest ? '2026-05-08' : null });
const cerebro = carregarCerebro();
const rodada  = JSON.parse(fs.readFileSync(args.rodadaJson, 'utf8'));
const gabarito = args.gabarito ? JSON.parse(fs.readFileSync(args.gabarito, 'utf8')) : null;

if (!cerebro) {
  console.error('⚠️  Cérebro não encontrado. Rode: node construir_cerebro.js primeiro.');
  process.exit(1);
}

console.log(`🧠 Cérebro carregado: ${Object.keys(cerebro.ligas).length} ligas, ${cerebro.estatisticasGerais.totalTimes} times, ${cerebro.estatisticasGerais.totalH2H} H2H`);
console.log(`📥 Rodada: ${rodada.length} jogos para analisar`);
console.log('');

// ── Indexa rankings do cérebro (lookup rápido)
const idx = {
  mandantesDom:   new Set(cerebro.rankings.top_mandantes_dominadores.map(r => r.liga + '|' + r.time)),
  visitantesDom:  new Set(cerebro.rankings.top_visitantes_dominadores.map(r => r.liga + '|' + r.time)),
  mandantesUnder: new Set(cerebro.rankings.top_mandantes_under_friendly.map(r => r.liga + '|' + r.time)),
  visitantesUnder:new Set(cerebro.rankings.top_visitantes_under_friendly.map(r => r.liga + '|' + r.time)),
  evitar:         new Set(cerebro.rankings.times_evitados_alta_volatilidade.map(r => r.liga + '|' + r.time))
};

// ── Cache de perfis por liga
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

// ── Analisa CADA jogo, calcula prob, aplica bônus do cérebro
const candidatos = [];
const stats = { F1: 0, F2: 0, semDados: 0, ok: 0 };

for (const jOrig of rodada) {
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
  const f1 = filtro1_dadosInsuficientes(pM, pV, sH, cache.info);
  if (!f1.passou) { stats.F1++; continue; }
  const f2 = filtro2_imprevisibilidade(pM, pV, sH);
  if (!f2.passou) { stats.F2++; continue; }

  const analise = analisarJogoInteligente({
    jogo: j, perfilM: { ...pM }, perfilV: { ...pV },
    statsH: sH, statsLigaInfo: cache.statsLiga, infoLiga: cache.info
  });

  // Bônus do cérebro: aplica boost se time está nos rankings
  const keyM = j.liga + '|' + j.mandante;
  const keyV = j.liga + '|' + j.visitante;
  const bonus = { hdpM: 0, hdpV: 0, under: 0, motivos: [] };

  if (idx.mandantesDom.has(keyM))    { bonus.hdpM += 8;  bonus.motivos.push('🏆 ' + j.mandante + ' está no TOP MANDANTES DOMINADORES'); }
  if (idx.visitantesDom.has(keyV))   { bonus.hdpV += 8;  bonus.motivos.push('✈️ ' + j.visitante + ' está no TOP VISITANTES DOMINADORES'); }
  if (idx.mandantesUnder.has(keyM))  { bonus.under += 6; bonus.motivos.push('🏠 ' + j.mandante + ' é UNDER-FRIENDLY em casa'); }
  if (idx.visitantesUnder.has(keyV)) { bonus.under += 6; bonus.motivos.push('🛡️ ' + j.visitante + ' é UNDER-FRIENDLY fora'); }
  if (idx.evitar.has(keyM))          { bonus.hdpM -= 10; bonus.under -= 10; bonus.motivos.push('⚠️ ' + j.mandante + ' está na lista EVITAR (errático)'); }
  if (idx.evitar.has(keyV))          { bonus.hdpV -= 10; bonus.under -= 10; bonus.motivos.push('⚠️ ' + j.visitante + ' está na lista EVITAR (errático)'); }

  // Aplica bônus às probabilidades
  const probHDP_M = Math.min(100, Math.max(0, analise.mercados[MERCADOS.HDP_FT_MANDANTE].prob  + bonus.hdpM));
  const probHDP_V = Math.min(100, Math.max(0, analise.mercados[MERCADOS.HDP_FT_VISITANTE].prob + bonus.hdpV));
  const probUND   = Math.min(100, Math.max(0, analise.mercados[MERCADOS.UNDER_9_FT].prob       + bonus.under));

  candidatos.push({
    jogo: j, perfilM: pM, perfilV: pV, statsH: sH,
    HDP_FT_MANDANTE:  { prob: probHDP_M, evidencias: analise.mercados[MERCADOS.HDP_FT_MANDANTE].evidencias },
    HDP_FT_VISITANTE: { prob: probHDP_V, evidencias: analise.mercados[MERCADOS.HDP_FT_VISITANTE].evidencias },
    UNDER_9_FT:       { prob: probUND,   evidencias: analise.mercados[MERCADOS.UNDER_9_FT].evidencias },
    bonus: bonus
  });
  stats.ok++;
}

console.log('🔬 Analisados:', stats.ok, '| Cortados F1:', stats.F1, '| F2:', stats.F2, '| sem dados:', stats.semDados);
console.log('');

// ── Seleciona TOP-N do tipo pedido (com cap por liga se especificado)
let candsOrdenados = [];
if (args.tipo === 'HDP') {
  candsOrdenados = candidatos.map(c => {
    const m = c.HDP_FT_MANDANTE.prob;
    const v = c.HDP_FT_VISITANTE.prob;
    const lado = m >= v ? 'MANDANTE' : 'VISITANTE';
    const obj  = m >= v ? c.HDP_FT_MANDANTE : c.HDP_FT_VISITANTE;
    return { c, mercado: 'HDP_FT_' + lado, prob: obj.prob, evidencias: obj.evidencias };
  }).sort((a, b) => b.prob - a.prob);
} else if (args.tipo === 'UNDER') {
  candsOrdenados = candidatos.map(c => ({
    c, mercado: 'UNDER_9_FT', prob: c.UNDER_9_FT.prob, evidencias: c.UNDER_9_FT.evidencias
  })).sort((a, b) => b.prob - a.prob);
}

let topLista = [];
if (args.porLiga) {
  // Diversificação: cap de N por liga
  const contagem = {};
  for (const item of candsOrdenados) {
    const liga = item.c.jogo.liga;
    contagem[liga] = contagem[liga] || 0;
    if (contagem[liga] >= args.porLiga) continue;
    if (topLista.length >= args.top) break;
    contagem[liga]++;
    topLista.push(item);
  }
} else {
  topLista = candsOrdenados.slice(0, args.top);
}

// ── Apresenta os jogos
const sep = '═'.repeat(75);
for (let i = 0; i < topLista.length; i++) {
  const it = topLista[i];
  const j  = it.c.jogo;
  console.log(sep);
  console.log(`#${i+1} — Probabilidade ${it.prob}/100 — ${it.mercado}`);
  console.log(sep);
  console.log(`Liga: ${j.liga} | Rodada ${j.rodada || '?'}`);
  console.log(`Partida: ${j.mandante} (casa) vs ${j.visitante} (fora)`);
  console.log('');

  // Bônus do cérebro
  if (it.c.bonus.motivos.length > 0) {
    console.log('🧠 SINAIS DO CÉREBRO:');
    for (const mot of it.c.bonus.motivos) console.log('   ' + mot);
    console.log('');
  }

  // Top 5 evidências
  console.log('🔍 EVIDÊNCIAS (ordenadas por força):');
  for (let k = 0; k < Math.min(5, it.evidencias.length); k++) {
    const e = it.evidencias[k];
    const barra = '█'.repeat(Math.round(e.score / 10)) + '░'.repeat(10 - Math.round(e.score / 10));
    console.log(`   ${barra}  ${String(e.score).padStart(3)}/100 (peso ${String(e.peso).padStart(2)})  ${e.nome}`);
    console.log(`        └ ${e.detalhe}`);
  }
  console.log('');
}

// ── Sumário + cruzamento com gabarito (se houver)
console.log(sep);
console.log(`SUMÁRIO — TOP ${args.top} ${args.tipo}`);
console.log(sep);
console.log(`Probabilidade média: ${(topLista.reduce((s, c) => s + c.prob, 0) / topLista.length).toFixed(1)}/100`);
console.log(`Probabilidade mín: ${topLista[topLista.length-1]?.prob || 0} | máx: ${topLista[0]?.prob || 0}`);
const distLiga = {};
for (const it of topLista) distLiga[it.c.jogo.liga] = (distLiga[it.c.jogo.liga] || 0) + 1;
console.log('Distribuição por liga:');
for (const l of Object.keys(distLiga)) console.log('   ' + l + ': ' + distLiga[l]);

if (gabarito) {
  console.log('');
  console.log(sep);
  console.log('CONFERÊNCIA COM GABARITO REAL');
  console.log(sep);
  let g = 0, r = 0;
  for (const it of topLista) {
    const j = it.c.jogo;
    const tBanco = base.ligas[j.liga].times;
    const real = gabarito.find(x => x.liga === j.liga &&
      normalizarTime(x.mandante, j.liga, tBanco) === j.mandante &&
      normalizarTime(x.visitante, j.liga, tBanco) === j.visitante);
    if (!real || !real.cantos_ft) continue;
    const dif = real.cantos_ft.m - real.cantos_ft.v;
    const tot = real.cantos_ft.m + real.cantos_ft.v;
    let ok = false;
    if (it.mercado === 'HDP_FT_MANDANTE')  ok = dif >=  4;
    else if (it.mercado === 'HDP_FT_VISITANTE') ok = dif <= -4;
    else if (it.mercado === 'UNDER_9_FT')   ok = tot < 9;
    if (ok) g++; else r++;
    console.log((ok ? '  ✅' : '  ❌') + ' ' + j.mandante + ' vs ' + j.visitante + ' [' + j.liga + '] real: M=' + real.cantos_ft.m + ' V=' + real.cantos_ft.v + ' (dif=' + dif + ', tot=' + tot + ')');
  }
  console.log('');
  console.log(`  TAXA: ${g}✅ ${r}❌ = ${total = g + r, total ? (g/total*100).toFixed(1) : 0}% (${g}/${total})`);
}
