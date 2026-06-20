// EDS-HDP-Pro · Projeção HDP (Poisson conjunto + shrinkage por amostra)
//
// Para um confronto M x V calcula:
//   - expHomeHT, expAwayHT, expHomeFT, expAwayFT
//   - Probabilidade Poisson conjunto: P(home > away), P(empate), P(home < away)
//   - Odds justas 1x2 cantos
//   - Linhas HDP recomendadas por tamanho da vantagem projetada

const fs = require('fs');
const path = require('path');
const { LIGAS, carregarLiga, timesDaLiga } = require('./_io');
const { calcularRankings } = require('./ranking_hdp');

// Pseudo-contagem pra shrinkage — quanto MENOR, mais confiamos no time;
// quanto MAIOR, mais puxamos pra média da liga.
// Com amostras de 3-7 jogos por lado, k=5 é um ponto razoável.
const SHRINK_K = 5;

// Fatorial cache
const _fatCache = [1, 1];
function fat(n) {
  while (_fatCache.length <= n) _fatCache.push(_fatCache[_fatCache.length-1] * _fatCache.length);
  return _fatCache[n];
}

function poisson(k, lam) {
  if (lam <= 0) return k === 0 ? 1 : 0;
  return Math.exp(-lam) * Math.pow(lam, k) / fat(k);
}

// Probabilidade conjunto P(home > away), P(empate), P(home < away)
// Truncado em K=20 cantos por lado (cobertura >99.99% pra lambdas até 12)
function probConjunto(expHome, expAway) {
  const K = 20;
  let pH = 0, pE = 0, pA = 0;
  for (let h = 0; h <= K; h++) {
    const ph = poisson(h, expHome);
    for (let a = 0; a <= K; a++) {
      const pa = poisson(a, expAway);
      const joint = ph * pa;
      if (h > a) pH += joint;
      else if (h < a) pA += joint;
      else pE += joint;
    }
  }
  // Normaliza (defensivo — truncamento residual)
  const tot = pH + pE + pA;
  return { pH: pH/tot, pE: pE/tot, pA: pA/tot };
}

// Probabilidade HDP: P(home - away > linha) para handicap asiático
// linha pode ser -0.5, -1.0, -1.5, -2.0, -2.5 etc (do ponto de vista do home)
// Para half-line (-0.5, -1.5, -2.5): vence se diff > -linha (sem push)
// Para integer (-1.0, -2.0): vence se diff > -linha, push se diff = -linha
function probHDP(expHome, expAway, linha) {
  const K = 20;
  let win = 0, push = 0, loss = 0;
  for (let h = 0; h <= K; h++) {
    const ph = poisson(h, expHome);
    for (let a = 0; a <= K; a++) {
      const pa = poisson(a, expAway);
      const j = ph * pa;
      const diffAdj = (h - a) + linha; // linha negativa = handicap do home
      if (diffAdj > 0)      win  += j;
      else if (diffAdj === 0) push += j;
      else                    loss += j;
    }
  }
  const tot = win + push + loss;
  return { win: win/tot, push: push/tot, loss: loss/tot, oddJusta: tot/(win + push) /* push devolve, então conta como meio-acerto */ };
}

// Lambda esperado com shrinkage (média dupla perspectiva + shrinkage liga)
function lambdaShrunk(timeVal, n, mediaLiga) {
  if (timeVal == null || n === 0) return mediaLiga;
  return (timeVal * n + mediaLiga * SHRINK_K) / (n + SHRINK_K);
}

// Projeção principal: M (mandante) x V (visitante) na liga
function projetarJogo(liga, M, V, rankingsCache) {
  const rankings = rankingsCache || calcularRankings(liga);
  const tM = rankings.times[M];
  const tV = rankings.times[V];
  if (!tM || !tV) return null;

  // Média da liga por "lado" (pró-casa, pró-fora, contra-casa, contra-fora)
  // Aqui agregamos da própria estrutura — média ponderada
  const baselines = calcularBaselinesLiga(rankings);

  // FT
  const expHomeFT_M = lambdaShrunk(tM.ft.pro_casa,    tM.ft.n_casa, baselines.ft.pro_casa);
  const expHomeFT_V = lambdaShrunk(tV.ft.contra_fora, tV.ft.n_fora, baselines.ft.contra_fora);
  const expHomeFT = (expHomeFT_M + expHomeFT_V) / 2;

  const expAwayFT_V = lambdaShrunk(tV.ft.pro_fora,    tV.ft.n_fora, baselines.ft.pro_fora);
  const expAwayFT_M = lambdaShrunk(tM.ft.contra_casa, tM.ft.n_casa, baselines.ft.contra_casa);
  const expAwayFT = (expAwayFT_V + expAwayFT_M) / 2;

  // HT
  const expHomeHT_M = lambdaShrunk(tM.ht.pro_casa,    tM.ht.n_casa, baselines.ht.pro_casa);
  const expHomeHT_V = lambdaShrunk(tV.ht.contra_fora, tV.ht.n_fora, baselines.ht.contra_fora);
  const expHomeHT = (expHomeHT_M + expHomeHT_V) / 2;

  const expAwayHT_V = lambdaShrunk(tV.ht.pro_fora,    tV.ht.n_fora, baselines.ht.pro_fora);
  const expAwayHT_M = lambdaShrunk(tM.ht.contra_casa, tM.ht.n_casa, baselines.ht.contra_casa);
  const expAwayHT = (expAwayHT_V + expAwayHT_M) / 2;

  // Probabilidades 1x2
  const probsFT = probConjunto(expHomeFT, expAwayFT);
  const probsHT = probConjunto(expHomeHT, expAwayHT);

  // HDP recomendado pela vantagem projetada
  const diffFT = expHomeFT - expAwayFT;
  const diffHT = expHomeHT - expAwayHT;
  const favorito = diffFT >= 0 ? M : V;
  const azarao   = diffFT >= 0 ? V : M;
  const linhaFT_rec = recomendarLinhaFT(Math.abs(diffFT));
  const linhaHT_rec = recomendarLinhaHT(Math.abs(diffHT));

  // Probabilidades por linha HDP (do ponto de vista do FAVORITO)
  const expFav = Math.max(expHomeFT, expAwayFT);
  const expAzr = Math.min(expHomeFT, expAwayFT);
  const expFavHT = Math.max(expHomeHT, expAwayHT);
  const expAzrHT = Math.min(expHomeHT, expAwayHT);

  const hdpFT = {};
  for (const linha of [-1.0, -1.5, -2.0, -2.5]) {
    hdpFT[linha] = probHDP(expFav, expAzr, linha);
  }
  const hdpHT = {};
  for (const linha of [-0.5, -1.0]) {
    hdpHT[linha] = probHDP(expFavHT, expAzrHT, linha);
  }

  return {
    M, V,
    expHomeHT: +expHomeHT.toFixed(2), expAwayHT: +expAwayHT.toFixed(2),
    expHomeFT: +expHomeFT.toFixed(2), expAwayFT: +expAwayFT.toFixed(2),
    diffFT: +diffFT.toFixed(2), diffHT: +diffHT.toFixed(2),
    favorito, azarao,
    linhaFT_rec, linhaHT_rec,
    probsFT: { pH: +probsFT.pH.toFixed(3), pE: +probsFT.pE.toFixed(3), pA: +probsFT.pA.toFixed(3) },
    probsHT: { pH: +probsHT.pH.toFixed(3), pE: +probsHT.pE.toFixed(3), pA: +probsHT.pA.toFixed(3) },
    oddsJustasFT: {
      home:  +(1/probsFT.pH).toFixed(2),
      empate:+(1/probsFT.pE).toFixed(2),
      away:  +(1/probsFT.pA).toFixed(2)
    },
    hdpFT, hdpHT,
    amostras: { M: { casa: tM.ft.n_casa, fora: tM.ft.n_fora }, V: { casa: tV.ft.n_casa, fora: tV.ft.n_fora } }
  };
}

function recomendarLinhaFT(absDiff) {
  if (absDiff >= 2.5) return -2.5;
  if (absDiff >= 1.8) return -2.0;
  if (absDiff >= 1.2) return -1.5;
  if (absDiff >= 0.5) return -1.0;
  return null; // jogo equilibrado, sem HDP de cantos recomendado
}

function recomendarLinhaHT(absDiff) {
  if (absDiff >= 1.0) return -1.0;
  if (absDiff >= 0.5) return -0.5;
  return null;
}

// Médias agregadas da liga por lado (para shrinkage)
function calcularBaselinesLiga(rankings) {
  const acc = {
    ft: { pro_casa: 0, contra_casa: 0, pro_fora: 0, contra_fora: 0, n: 0 },
    ht: { pro_casa: 0, contra_casa: 0, pro_fora: 0, contra_fora: 0, n: 0 }
  };
  for (const t of Object.values(rankings.times)) {
    if (t.ft.pro_casa != null) { acc.ft.pro_casa += t.ft.pro_casa; acc.ft.contra_casa += t.ft.contra_casa; acc.ft.pro_fora += t.ft.pro_fora; acc.ft.contra_fora += t.ft.contra_fora; acc.ft.n++; }
    if (t.ht.pro_casa != null) { acc.ht.pro_casa += t.ht.pro_casa; acc.ht.contra_casa += t.ht.contra_casa; acc.ht.pro_fora += t.ht.pro_fora; acc.ht.contra_fora += t.ht.contra_fora; acc.ht.n++; }
  }
  return {
    ft: { pro_casa: acc.ft.pro_casa/acc.ft.n, contra_casa: acc.ft.contra_casa/acc.ft.n, pro_fora: acc.ft.pro_fora/acc.ft.n, contra_fora: acc.ft.contra_fora/acc.ft.n },
    ht: { pro_casa: acc.ht.pro_casa/acc.ht.n, contra_casa: acc.ht.contra_casa/acc.ht.n, pro_fora: acc.ht.pro_fora/acc.ht.n, contra_fora: acc.ht.contra_fora/acc.ht.n }
  };
}

// Standalone — projeta 3 confrontos de exemplo de cada liga e imprime
if (require.main === module) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  PROJEÇÃO HDP — Fase 1 (smoke test)');
  console.log('═══════════════════════════════════════════════════════════');
  for (const liga of LIGAS) {
    const jogos = carregarLiga(liga);
    const times = timesDaLiga(jogos);
    const rankings = calcularRankings(liga);
    if (times.length < 4) { console.log(`\n[${liga}] amostra insuficiente`); continue; }
    console.log(`\n══ ${liga} ══`);
    // 3 confrontos sintéticos: 1º vs 4º, 2º vs último, meio vs meio
    const trios = [
      [times[0], times[3]],
      [times[1], times[times.length - 1]],
      [times[Math.floor(times.length/2)], times[Math.floor(times.length/2) + 1]]
    ];
    for (const [m, v] of trios) {
      const p = projetarJogo(liga, m, v, rankings);
      if (!p) continue;
      console.log(`\n  ${m} × ${v}`);
      console.log(`    expFT: ${p.expHomeFT} × ${p.expAwayFT}  (diff ${p.diffFT})`);
      console.log(`    expHT: ${p.expHomeHT} × ${p.expAwayHT}  (diff ${p.diffHT})`);
      console.log(`    probFT 1x2: H=${(p.probsFT.pH*100).toFixed(1)}% E=${(p.probsFT.pE*100).toFixed(1)}% A=${(p.probsFT.pA*100).toFixed(1)}%`);
      console.log(`    favorito: ${p.favorito}  ·  HDP FT recomendado: ${p.linhaFT_rec ?? 'equilibrado'}  ·  HT: ${p.linhaHT_rec ?? 'equilibrado'}`);
      if (p.linhaFT_rec) {
        const h = p.hdpFT[p.linhaFT_rec];
        console.log(`    HDP ${p.linhaFT_rec}: WIN=${(h.win*100).toFixed(1)}% PUSH=${(h.push*100).toFixed(1)}% LOSS=${(h.loss*100).toFixed(1)}% (odd justa ${h.oddJusta.toFixed(2)})`);
      }
    }
  }
  console.log('\n✅ Smoke test concluído');
}

module.exports = { projetarJogo, probConjunto, probHDP, poisson, recomendarLinhaFT, recomendarLinhaHT };
