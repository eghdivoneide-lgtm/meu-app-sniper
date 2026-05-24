// ════════════════════════════════════════════════════════════════════
// ANÁLISE 4 MERCADOS — Auditor Supremo Multi-Mercado
//   1. Under FT 8.5  (total FT ≤ 8)
//   2. Under HT 4.5  (total HT ≤ 4)
//   3. HDP HT -1     (diff HT ≥ 2)
//   4. HDP FT -2.5   (diff FT ≥ 3)
//
// Ligas EXCLUÍDAS: J2J3, BUN (foco em 6 ligas: BR, BR_B, ARG, ARG_B, MLS, USL)
// ════════════════════════════════════════════════════════════════════

const fs = require('fs');
const { carregarBase } = require('./engine/loader');
const { carregarCerebro } = require('./engine/cerebro');
const { perfilTimeCompleto, statsH2H, statsLiga, cantosFT, media, desvioPadrao, arred } = require('./engine/stats');
const { filtro1_dadosInsuficientes, filtro2_imprevisibilidade } = require('./engine/filtros');
const { computarPerfisLiga, maxRodada } = require('./engine/agente');
const { normalizarTime } = require('./engine/aliases');

const LIGAS_EXCLUIDAS = new Set(['J2J3', 'BUN']);

// ────────────────────────────────────────────────────────────────────
// STATS HT — análogo às stats FT do agente, mas usando cantos.ht
// ────────────────────────────────────────────────────────────────────
function cantosHT(jogo) {
  const c = jogo?.cantos?.ht;
  if (!c || typeof c.m !== 'number' || typeof c.v !== 'number') return null;
  return { m: c.m, v: c.v, total: c.m + c.v, diff: c.m - c.v };
}

function statsTimeHTMandante(jogos, nomeTime) {
  const arr = jogos.filter(j => j.mandante === nomeTime && cantosHT(j));
  if (arr.length === 0) return null;
  const cobrados   = arr.map(j => cantosHT(j).m);
  const sofridos   = arr.map(j => cantosHT(j).v);
  const totais     = arr.map(j => cantosHT(j).total);
  const diff       = arr.map(j => cantosHT(j).diff);
  return {
    n: arr.length,
    cobrados_media: arred(media(cobrados)),
    sofridos_media: arred(media(sofridos)),
    total_media:    arred(media(totais)),
    total_dp:       arred(desvioPadrao(totais)),
    diff_media:     arred(media(diff)),
    diff_dp:        arred(desvioPadrao(diff)),
    pct_under_4_5:  arred((totais.filter(t => t <= 4).length / arr.length) * 100, 1),
    pct_diff_2_mais:arred((diff.filter(d => d >= 2).length / arr.length) * 100, 1)
  };
}

function statsTimeHTVisitante(jogos, nomeTime) {
  const arr = jogos.filter(j => j.visitante === nomeTime && cantosHT(j));
  if (arr.length === 0) return null;
  const cobrados   = arr.map(j => cantosHT(j).v);
  const sofridos   = arr.map(j => cantosHT(j).m);
  const totais     = arr.map(j => cantosHT(j).total);
  const diff       = arr.map(j => cantosHT(j).v - cantosHT(j).m);
  return {
    n: arr.length,
    cobrados_media: arred(media(cobrados)),
    sofridos_media: arred(media(sofridos)),
    total_media:    arred(media(totais)),
    total_dp:       arred(desvioPadrao(totais)),
    diff_media:     arred(media(diff)),
    diff_dp:        arred(desvioPadrao(diff)),
    pct_under_4_5:  arred((totais.filter(t => t <= 4).length / arr.length) * 100, 1),
    pct_diff_2_mais:arred((diff.filter(d => d >= 2).length / arr.length) * 100, 1)
  };
}

function statsLigaHT(jogos) {
  const validos = jogos.filter(j => cantosHT(j));
  if (validos.length === 0) return null;
  const totais = validos.map(j => cantosHT(j).total);
  const diff_abs = validos.map(j => Math.abs(cantosHT(j).diff));
  return {
    n: validos.length,
    media_total:    arred(media(totais)),
    pct_under_4_5:  arred((totais.filter(t => t <= 4).length / validos.length) * 100, 1),
    pct_diff_2_mais:arred((diff_abs.filter(d => d >= 2).length / validos.length) * 100, 1)
  };
}

// ────────────────────────────────────────────────────────────────────
// Funções de rampa (curva linear ruim→ótimo)
// ────────────────────────────────────────────────────────────────────
function rampaCresc(v, ruim, otimo) { if (v <= ruim) return 0; if (v >= otimo) return 100; return ((v - ruim) / (otimo - ruim)) * 100; }
function rampaDecr(v, otimo, ruim)  { if (v <= otimo) return 100; if (v >= ruim) return 0; return ((ruim - v) / (ruim - otimo)) * 100; }
function combinar(evs) { const sp = evs.reduce((s,e)=>s+e.peso,0); if (!sp) return 0; return Math.round(evs.reduce((s,e)=>s+e.score*e.peso,0)/sp); }

// ────────────────────────────────────────────────────────────────────
// PROB para cada mercado
// ────────────────────────────────────────────────────────────────────
function probUnderFT85(pFT_M_casa, pFT_V_fora, sH, sLiga_FT) {
  const evs = [
    { peso: 22, score: rampaDecr(pFT_M_casa.total_media, 6.5, 10.5) },
    { peso: 18, score: rampaDecr(pFT_V_fora.total_media, 6.5, 10.5) },
    { peso: 14, score: rampaCresc(pFT_M_casa.pct_total_under_9, 25, 75) },
    { peso: 12, score: rampaCresc(pFT_V_fora.pct_total_under_9, 25, 75) },
    { peso: 10, score: sH.n_confrontos >= 1 ? rampaDecr(sH.total_media, 6, 11) : 50 },
    { peso:  8, score: rampaDecr((pFT_M_casa.total_dp + pFT_V_fora.total_dp)/2, 2, 4.5) },
    { peso:  8, score: rampaDecr(sLiga_FT.media_cantos_FT, 8, 11) }
  ];
  return { prob: combinar(evs), evs };
}

function probUnderHT45(pHT_M_casa, pHT_V_fora, sLigaHT) {
  const evs = [
    { peso: 22, score: rampaDecr(pHT_M_casa.total_media, 2.5, 5.5) },
    { peso: 18, score: rampaDecr(pHT_V_fora.total_media, 2.5, 5.5) },
    { peso: 14, score: rampaCresc(pHT_M_casa.pct_under_4_5, 35, 80) },
    { peso: 12, score: rampaCresc(pHT_V_fora.pct_under_4_5, 35, 80) },
    { peso: 10, score: rampaDecr((pHT_M_casa.total_dp + pHT_V_fora.total_dp)/2, 1.2, 2.8) },
    { peso:  8, score: rampaDecr(sLigaHT.media_total, 3.5, 5.5) }
  ];
  return { prob: combinar(evs), evs };
}

function probHDPHT(pHT_M_casa, pHT_V_fora, sLigaHT, lado /* 'M' ou 'V' */) {
  const pM_dom = lado === 'M' ? pHT_M_casa.diff_media >=  0.5 : pHT_V_fora.diff_media >=  0.5;
  const evs = [
    { peso: 22, score: lado === 'M' ? rampaCresc(pHT_M_casa.diff_media, 0, 2.5) : rampaCresc(pHT_V_fora.diff_media, 0, 2.5) },
    { peso: 18, score: lado === 'M' ? rampaDecr(pHT_V_fora.diff_media, 0, -2)  : rampaDecr(pHT_M_casa.diff_media, 0, -2)  },
    { peso: 14, score: lado === 'M' ? rampaCresc(pHT_M_casa.pct_diff_2_mais, 25, 70) : rampaCresc(pHT_V_fora.pct_diff_2_mais, 25, 70) },
    { peso: 10, score: rampaDecr((pHT_M_casa.diff_dp + pHT_V_fora.diff_dp)/2, 1.0, 2.8) },
    { peso:  8, score: rampaCresc(sLigaHT.pct_diff_2_mais, 25, 55) }
  ];
  return { prob: combinar(evs), evs };
}

function probHDPFT_25(pFT_M_casa, pFT_V_fora, sH, sLiga_FT, lado /* 'M' ou 'V' */) {
  const evs = [
    { peso: 22, score: lado === 'M' ? rampaCresc(pFT_M_casa.diferencial_media, 1.5, 5)  : rampaCresc(pFT_V_fora.diferencial_media, 1.5, 5)  },
    { peso: 18, score: lado === 'M' ? rampaDecr(pFT_V_fora.diferencial_media, 0, -3.5) : rampaDecr(pFT_M_casa.diferencial_media, 0, -3.5) },
    { peso: 14, score: lado === 'M' ? rampaCresc(pFT_M_casa.pct_diferencial_4_mais, 25, 70) : rampaCresc(pFT_V_fora.pct_diferencial_4_mais, 25, 70) },
    { peso: 10, score: sH.n_confrontos >= 1
        ? (lado === 'M' ? rampaCresc(sH.diferencial_media_A, -2, 5) : rampaDecr(sH.diferencial_media_A, 2, -5))
        : 50 },
    { peso: 10, score: rampaDecr((pFT_M_casa.diferencial_dp + pFT_V_fora.diferencial_dp)/2, 1.5, 4.5) },
    { peso:  8, score: rampaCresc(sLiga_FT.pct_diferencial_4_mais, 25, 55) }
  ];
  return { prob: combinar(evs), evs };
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
const args = { rodadaJson: null };
process.argv.slice(2).forEach((a, i, arr) => { if (a === '--rodada-json') args.rodadaJson = arr[i+1]; });
if (!args.rodadaJson) { console.error('Uso: --rodada-json <path>'); process.exit(1); }

console.log('');
console.log('🛡️  ════════════════════════════════════════════════════════════════');
console.log('       AUDITOR SUPREMO — Análise 4 Mercados');
console.log('       Ligas excluídas: J2/J3, BUN | Mercados: U8.5 FT, U4.5 HT, HDP HT, HDP FT -2.5');
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');

const base    = carregarBase({ dataLimite: null });
const cerebro = carregarCerebro();
const rodada  = JSON.parse(fs.readFileSync(args.rodadaJson));

// Filtra rodada (sem J2J3, sem BUN)
const rodadaFiltrada = rodada.filter(j => !LIGAS_EXCLUIDAS.has(j.liga));
console.log(`📥 Rodada original: ${rodada.length} jogos | Após filtro: ${rodadaFiltrada.length} jogos\n`);

// Cache de stats por liga
const cacheLiga = {};
for (const cod of Object.keys(base.ligas)) {
  if (LIGAS_EXCLUIDAS.has(cod)) continue;
  const L = base.ligas[cod];
  if (L.erro) continue;
  cacheLiga[cod] = {
    perfisFT:    computarPerfisLiga(L.jogos, base.dna[cod] || {}),
    statsLigaFT: statsLiga(L.jogos),
    statsLigaHT: statsLigaHT(L.jogos),
    info: { codigo: cod, maxRodadaRegistrada: maxRodada(L.jogos), dnaLiga: base.dna[cod] || {} }
  };
}

const out = {
  UNDER_FT_85: [], UNDER_HT_45: [], HDP_HT: [], HDP_FT_25: []
};
let stats = { tot: 0, F1: 0, F2: 0, sem: 0, ok: 0 };

for (const jOrig of rodadaFiltrada) {
  stats.tot++;
  const cache = cacheLiga[jOrig.liga];
  if (!cache) { stats.sem++; continue; }
  const tBanco = base.ligas[jOrig.liga].times;
  const j = {
    ...jOrig,
    mandante:  normalizarTime(jOrig.mandante,  jOrig.liga, tBanco),
    visitante: normalizarTime(jOrig.visitante, jOrig.liga, tBanco)
  };
  const pFTM = cache.perfisFT[j.mandante];
  const pFTV = cache.perfisFT[j.visitante];
  if (!pFTM || !pFTV) { stats.sem++; continue; }
  const sH = statsH2H(base.ligas[j.liga].jogos, j.mandante, j.visitante);
  if (!filtro1_dadosInsuficientes(pFTM, pFTV, sH, cache.info).passou) { stats.F1++; continue; }
  if (!filtro2_imprevisibilidade(pFTM, pFTV, sH).passou) { stats.F2++; continue; }

  // Calcula stats HT on-the-fly
  const pHTM_casa = statsTimeHTMandante (base.ligas[j.liga].jogos, j.mandante);
  const pHTV_fora = statsTimeHTVisitante(base.ligas[j.liga].jogos, j.visitante);
  if (!pHTM_casa || !pHTV_fora || pHTM_casa.n < 3 || pHTV_fora.n < 3) { stats.sem++; continue; }

  // Mercado 1: Under FT 8.5
  const u85 = probUnderFT85(pFTM.mandante, pFTV.visitante, sH, cache.statsLigaFT);
  out.UNDER_FT_85.push({ jogo: j, prob: u85.prob, dadosM: pFTM.mandante, dadosV: pFTV.visitante, sH });

  // Mercado 2: Under HT 4.5
  const u45ht = probUnderHT45(pHTM_casa, pHTV_fora, cache.statsLigaHT);
  out.UNDER_HT_45.push({ jogo: j, prob: u45ht.prob, htM: pHTM_casa, htV: pHTV_fora });

  // Mercado 3: HDP HT (testa lado M e V, mantém o melhor)
  const hdpHT_M = probHDPHT(pHTM_casa, pHTV_fora, cache.statsLigaHT, 'M');
  const hdpHT_V = probHDPHT(pHTM_casa, pHTV_fora, cache.statsLigaHT, 'V');
  const hdpHT_melhor = hdpHT_M.prob >= hdpHT_V.prob
    ? { prob: hdpHT_M.prob, lado: 'M' } : { prob: hdpHT_V.prob, lado: 'V' };
  out.HDP_HT.push({ jogo: j, prob: hdpHT_melhor.prob, lado: hdpHT_melhor.lado, htM: pHTM_casa, htV: pHTV_fora });

  // Mercado 4: HDP FT -2.5
  const hdpFT_M = probHDPFT_25(pFTM.mandante, pFTV.visitante, sH, cache.statsLigaFT, 'M');
  const hdpFT_V = probHDPFT_25(pFTM.mandante, pFTV.visitante, sH, cache.statsLigaFT, 'V');
  const hdpFT_melhor = hdpFT_M.prob >= hdpFT_V.prob
    ? { prob: hdpFT_M.prob, lado: 'M' } : { prob: hdpFT_V.prob, lado: 'V' };
  out.HDP_FT_25.push({ jogo: j, prob: hdpFT_melhor.prob, lado: hdpFT_melhor.lado, dadosM: pFTM.mandante, dadosV: pFTV.visitante, sH });

  stats.ok++;
}

console.log('🔬 Diagnóstico: ' + stats.tot + ' analisados | ' + stats.ok + ' OK | F1 cortou ' + stats.F1 + ' | F2 cortou ' + stats.F2 + ' | sem dados ' + stats.sem);
console.log('');

// Ranqueia e imprime TOP 5 por mercado
function imprimirTop(titulo, lista, formatarLinha) {
  const top = [...lista].sort((a,b) => b.prob - a.prob).slice(0, 5);
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('  ' + titulo);
  console.log('═══════════════════════════════════════════════════════════════════════════');
  if (top.length === 0) { console.log('  (sem candidatos)\n'); return; }
  for (let i = 0; i < top.length; i++) {
    console.log('  #' + (i+1) + '  prob ' + String(top[i].prob).padStart(3) + '/100  ' + formatarLinha(top[i]));
  }
  console.log('');
}

imprimirTop('🎯 TOP 5 — UNDER FT 8.5 (total ≤ 8 cantos)', out.UNDER_FT_85, t => {
  const m = t.dadosM, v = t.dadosV, sH = t.sH;
  return `[${t.jogo.liga}] ${t.jogo.mandante} × ${t.jogo.visitante}\n` +
         `         └ M casa: total ${m.total_media} (%<9: ${m.pct_total_under_9}%) | V fora: total ${v.total_media} (%<9: ${v.pct_total_under_9}%) | H2H: ${sH.n_confrontos>=1?sH.total_media:'sem'}`;
});

imprimirTop('🎯 TOP 5 — UNDER HT 4.5 (total HT ≤ 4 cantos)', out.UNDER_HT_45, t => {
  const m = t.htM, v = t.htV;
  return `[${t.jogo.liga}] ${t.jogo.mandante} × ${t.jogo.visitante}\n` +
         `         └ M casa HT: total ${m.total_media} (%≤4: ${m.pct_under_4_5}%) | V fora HT: total ${v.total_media} (%≤4: ${v.pct_under_4_5}%)`;
});

imprimirTop('🎯 TOP 5 — HDP HT -1 (lado favorito 2+ cantos no HT)', out.HDP_HT, t => {
  const m = t.htM, v = t.htV;
  const lado = t.lado === 'M' ? t.jogo.mandante + ' (casa)' : t.jogo.visitante + ' (fora)';
  return `[${t.jogo.liga}] ${t.jogo.mandante} × ${t.jogo.visitante}  → HDP HT -1 a favor de ${lado}\n` +
         `         └ M casa HT: dif ${m.diff_media} (%dif≥2: ${m.pct_diff_2_mais}%) | V fora HT: dif ${v.diff_media} (%dif≥2: ${v.pct_diff_2_mais}%)`;
});

imprimirTop('🎯 TOP 5 — HDP FT -2.5 (favorito 3+ cantos no FT)', out.HDP_FT_25, t => {
  const m = t.dadosM, v = t.dadosV, sH = t.sH;
  const lado = t.lado === 'M' ? t.jogo.mandante + ' (casa)' : t.jogo.visitante + ' (fora)';
  return `[${t.jogo.liga}] ${t.jogo.mandante} × ${t.jogo.visitante}  → HDP FT -2.5 a favor de ${lado}\n` +
         `         └ M casa: dif ${m.diferencial_media} (%dif≥4: ${m.pct_diferencial_4_mais}%) | V fora: dif ${v.diferencial_media} (%dif≥4: ${v.pct_diferencial_4_mais}%) | H2H dif: ${sH.n_confrontos>=1?sH.diferencial_media_A:'sem'}`;
});
