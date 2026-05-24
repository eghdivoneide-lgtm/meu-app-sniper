/**
 * MOTOR DE PROJEÇÃO — Portado do Especialista em Cantos para Node.js
 * EDS Soluções Inteligentes — Analista Cisne Negro
 *
 * Contém todas as funções matemáticas do motor Sniper Pro v2
 * (Bayesiano + EWMA + TMI + DNA Escoteiro + Poisson)
 *
 * @module motor-projecao
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════
//  FUNÇÕES AUXILIARES MATEMÁTICAS
// ═══════════════════════════════════════════════════════

function avg(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

function stdDev(arr) {
  if (!arr || arr.length < 2) return 0;
  const m = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function calcDNA(jogos, time) {
  const vals = (jogos || []).filter(j => j.cantos && j.cantos.ft).map(j => j.mandante === time ? j.cantos.ft.m : j.cantos.ft.v);
  if (vals.length < 3) return { label: 'Sem dados', cor: 'muted', cv: '—', dp: '—' };
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const dp = stdDev(vals);
  const cv = mean > 0 ? (dp / mean) * 100 : 0;
  if (cv < 25) return { label: 'ESTAVEL', cor: 'green', cv: cv.toFixed(0), dp: dp.toFixed(1) };
  if (cv < 40) return { label: 'MODERADO', cor: 'gold', cv: cv.toFixed(0), dp: dp.toFixed(1) };
  return { label: 'VOLATIL', cor: 'red', cv: cv.toFixed(0), dp: dp.toFixed(1) };
}

function avgWeighted(arr, decay = 0.85) {
  if (!arr.length) return 0;
  let weightedSum = 0, totalWeight = 0;
  arr.forEach((val, i) => {
    const w = Math.pow(decay, arr.length - 1 - i);
    weightedSum += val * w;
    totalWeight += w;
  });
  return weightedSum / totalWeight;
}

function shrink(mediaTime, mediaLiga, n, k = 5) {
  return (n * mediaTime + k * mediaLiga) / (n + k);
}

function fmt(n) { return Number(n).toFixed(2); }

function poisson(k, lambda) {
  if (lambda === 0) return k === 0 ? 1 : 0;
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) p *= lambda / i;
  return p;
}

function getOvers(lambda, lines) {
  let overs = [];
  lines.forEach(line => {
    let probUnderOrEqual = 0;
    const kMax = Math.floor(line);
    for (let i = 0; i <= kMax; i++) {
      probUnderOrEqual += poisson(i, lambda);
    }
    const probOver = 1 - probUnderOrEqual;
    overs.push({
      line: 'Over ' + line,
      prob: probOver * 100,
      odd: probOver > 0 ? (1 / probOver) : 0
    });
  });
  return overs;
}

function getMatchOdds(lamH, lamA) {
  let home = 0, away = 0, draw = 0, homeHcp = 0;
  for (let h = 0; h <= 25; h++) {
    for (let a = 0; a <= 25; a++) {
      const prob = poisson(h, lamH) * poisson(a, lamA);
      if (h > a) home += prob;
      else if (h < a) away += prob;
      else draw += prob;
      if (h - a >= 2) homeHcp += prob;
    }
  }
  const norm = home + away + draw || 1;
  return { home: home / norm, draw: draw / norm, away: away / norm, homeHcp: homeHcp / norm };
}

// ═══════════════════════════════════════════════════════
//  getStatsTime — Estatísticas de um time
// ═══════════════════════════════════════════════════════

function getStatsTime(time, DADOS) {
  const jogosValidos = DADOS.jogos.filter(j => j.cantos !== null);
  const casa = jogosValidos.filter(j => j.mandante === time);
  const fora = jogosValidos.filter(j => j.visitante === time);
  const todos = jogosValidos.filter(j => j.mandante === time || j.visitante === time);
  const t_todos = todos.filter(j => j.stats_taticas);

  return {
    time,
    jogos: todos.length,
    jogosData: todos,
    media: {
      ht_casa: avg(casa.map(j => j.cantos.ht.m)),
      ht_casa_c: avg(casa.map(j => j.cantos.ht.v)),
      ht_fora: avg(fora.map(j => j.cantos.ht.v)),
      ht_fora_c: avg(fora.map(j => j.cantos.ht.m)),
      ft_casa: avg(casa.map(j => j.cantos.ft.m)),
      ft_casa_c: avg(casa.map(j => j.cantos.ft.v)),
      ft_fora: avg(fora.map(j => j.cantos.ft.v)),
      ft_fora_c: avg(fora.map(j => j.cantos.ft.m)),
      ht_geral: avg(todos.map(j => j.mandante === time ? j.cantos.ht.m : j.cantos.ht.v)),
      ht_geral_c: avg(todos.map(j => j.mandante === time ? j.cantos.ht.v : j.cantos.ht.m)),
      ft_geral: avg(todos.map(j => j.mandante === time ? j.cantos.ft.m : j.cantos.ft.v)),
      ft_geral_c: avg(todos.map(j => j.mandante === time ? j.cantos.ft.v : j.cantos.ft.m)),
      posse: t_todos.length ? avg(t_todos.map(j => j.mandante === time ? j.stats_taticas.posse.m : j.stats_taticas.posse.v)) : null,
      chutes: t_todos.length ? avg(t_todos.map(j => j.mandante === time ? j.stats_taticas.finalizacoes.m : j.stats_taticas.finalizacoes.v)) : null,
      chutes_c: t_todos.length ? avg(t_todos.map(j => j.mandante === time ? j.stats_taticas.finalizacoes.v : j.stats_taticas.finalizacoes.m)) : null
    }
  };
}

// ═══════════════════════════════════════════════════════
//  projecaoJogo — Motor Sniper Pro v2 completo
// ═══════════════════════════════════════════════════════

function projecaoJogo(mandante, visitante, DADOS) {
  const timesAtivos = DADOS && DADOS.times ? DADOS.times : [];
  const mExiste = timesAtivos.includes(mandante);
  const vExiste = timesAtivos.includes(visitante);
  if (!mExiste || !vExiste) return null;

  const m = getStatsTime(mandante, DADOS);
  const v = getStatsTime(visitante, DADOS);
  const jogosValidos = DADOS.jogos.filter(j => j.cantos !== null);

  const casa = jogosValidos.filter(j => j.mandante === mandante);
  const fora = jogosValidos.filter(j => j.visitante === visitante);

  // Médias Gerais do Campeonato
  const l_htHome = avg(jogosValidos.map(j => j.cantos.ht.m));
  const l_htAway = avg(jogosValidos.map(j => j.cantos.ht.v));
  const l_2tHome = avg(jogosValidos.map(j => j.cantos.ft.m - j.cantos.ht.m));
  const l_2tAway = avg(jogosValidos.map(j => j.cantos.ft.v - j.cantos.ht.v));

  // TMI
  const t_val = jogosValidos.filter(j => j.stats_taticas && typeof j.stats_taticas.posse?.m === 'number');
  let tmiHome = 1.0, tmiAway = 1.0;
  let dadosTaticosAusentes = false;

  if (t_val.length === 0 || !m.media.chutes || !v.media.chutes) {
    dadosTaticosAusentes = true;
  } else {
    const l_chutesHome = avg(t_val.map(j => j.stats_taticas.finalizacoes.m));
    const l_chutesAway = avg(t_val.map(j => j.stats_taticas.finalizacoes.v));
    const l_vertAvg = (l_chutesHome + l_chutesAway) / 100;
    const l_avgCorners = avg(jogosValidos.map(j => (j.cantos.ft.m + j.cantos.ft.v) / 2));
    const l_rejAvg = l_avgCorners / ((l_chutesHome + l_chutesAway) / 2);
    const m_vert = (m.media.chutes / (m.media.posse || 50)) / l_vertAvg;
    const v_vert = (v.media.chutes / (v.media.posse || 50)) / l_vertAvg;
    const m_rej = ((m.media.ft_geral_c) / (m.media.chutes_c || 1)) / l_rejAvg;
    const v_rej = ((v.media.ft_geral_c) / (v.media.chutes_c || 1)) / l_rejAvg;
    tmiHome = Math.max(0.65, Math.min(1.65, (m_vert * 0.75) + (v_rej * 0.25)));
    tmiAway = Math.max(0.65, Math.min(1.65, (v_vert * 0.75) + (m_rej * 0.25)));
  }

  // EWMA + Blend
  const nM = casa.length, nV = fora.length;
  const todosM = jogosValidos.filter(j => j.mandante === mandante || j.visitante === mandante);
  const todosV = jogosValidos.filter(j => j.mandante === visitante || j.visitante === visitante);

  const m_ht_gen = avgWeighted(todosM.map(j => j.mandante === mandante ? j.cantos.ht.m : j.cantos.ht.v));
  const m_2t_gen = avgWeighted(todosM.map(j => j.mandante === mandante ? j.cantos.ft.m - j.cantos.ht.m : j.cantos.ft.v - j.cantos.ht.v));
  const m_ht_con_g = avgWeighted(todosM.map(j => j.mandante === mandante ? j.cantos.ht.v : j.cantos.ht.m));
  const m_2t_con_g = avgWeighted(todosM.map(j => j.mandante === mandante ? j.cantos.ft.v - j.cantos.ht.v : j.cantos.ft.m - j.cantos.ht.m));
  const v_ht_gen = avgWeighted(todosV.map(j => j.visitante === visitante ? j.cantos.ht.v : j.cantos.ht.m));
  const v_2t_gen = avgWeighted(todosV.map(j => j.visitante === visitante ? j.cantos.ft.v - j.cantos.ht.v : j.cantos.ft.m - j.cantos.ht.m));
  const v_ht_con_g = avgWeighted(todosV.map(j => j.visitante === visitante ? j.cantos.ht.m : j.cantos.ht.v));
  const v_2t_con_g = avgWeighted(todosV.map(j => j.visitante === visitante ? j.cantos.ft.m - j.cantos.ht.m : j.cantos.ft.v - j.cantos.ht.v));

  function blendSit(vSit, vGen, n, thr = 3) {
    if (!n || isNaN(vSit)) return (!isNaN(vGen) && vGen != null) ? vGen : null;
    if (n >= thr) return vSit;
    const w = n / thr;
    return w * vSit + (1 - w) * vGen;
  }

  const m_ht_pro = blendSit(avgWeighted(casa.map(j => j.cantos.ht.m)), m_ht_gen, nM);
  const m_ht_con = blendSit(avgWeighted(casa.map(j => j.cantos.ht.v)), m_ht_con_g, nM);
  const m_2t_pro = blendSit(avgWeighted(casa.map(j => j.cantos.ft.m - j.cantos.ht.m)), m_2t_gen, nM);
  const m_2t_con = blendSit(avgWeighted(casa.map(j => j.cantos.ft.v - j.cantos.ht.v)), m_2t_con_g, nM);
  const v_ht_pro = blendSit(avgWeighted(fora.map(j => j.cantos.ht.v)), v_ht_gen, nV);
  const v_ht_con = blendSit(avgWeighted(fora.map(j => j.cantos.ht.m)), v_ht_con_g, nV);
  const v_2t_pro = blendSit(avgWeighted(fora.map(j => j.cantos.ft.v - j.cantos.ht.v)), v_2t_gen, nV);
  const v_2t_con = blendSit(avgWeighted(fora.map(j => j.cantos.ft.m - j.cantos.ht.m)), v_2t_con_g, nV);

  // Shrinkage Bayesiano
  const l_htGlobal = (l_htHome + l_htAway) / 2;
  const l_2tGlobal = (l_2tHome + l_2tAway) / 2;
  const atkHomeHT = shrink(m_ht_pro, l_htGlobal, nM, 3) / (l_htHome || 1);
  const defHomeHT = shrink(m_ht_con, l_htAway, nM, 3) / (l_htAway || 1);
  const atkAwayHT = shrink(v_ht_pro, l_htGlobal, nV, 3) / (l_htAway || 1);
  const defAwayHT = shrink(v_ht_con, l_htHome, nV, 3) / (l_htHome || 1);
  const atkHome2T = shrink(m_2t_pro, l_2tGlobal, nM, 3) / (l_2tHome || 1);
  const defHome2T = shrink(m_2t_con, l_2tAway, nM, 3) / (l_2tAway || 1);
  const atkAway2T = shrink(v_2t_pro, l_2tGlobal, nV, 3) / (l_2tAway || 1);
  const defAway2T = shrink(v_2t_con, l_2tHome, nV, 3) / (l_2tHome || 1);

  // xCorners
  const expHomeHT = atkHomeHT * defAwayHT * l_htHome * tmiHome;
  const expAwayHT = atkAwayHT * defHomeHT * l_htAway * tmiAway;
  const expTotalHT = expHomeHT + expAwayHT;
  const expHome2T = atkHome2T * defAway2T * l_2tHome * tmiHome;
  const expAway2T = atkAway2T * defHome2T * l_2tAway * tmiAway;
  const expTotalFT = expTotalHT + expHome2T + expAway2T;
  const expHomeFT = expHomeHT + expHome2T;
  const expAwayFT = expAwayHT + expAway2T;

  // Confiança
  const nMin = Math.min(m.jogos, v.jogos);
  const totalRodadasReal = Math.max(...DADOS.jogos.map(j => typeof j.rodada === 'number' ? j.rodada : 0)) || 38;
  const confFT = Math.min(95, 40 + (nMin / totalRodadasReal) * 55);

  // Mercados Over/Under
  const oversHT = getOvers(expTotalHT, [2.5, 3.5, 4.5, 5.5, 6.5]);
  const oversFT = getOvers(expTotalFT, [7.5, 8.5, 9.5, 10.5, 11.5, 12.5]);
  const oversHomeHT = getOvers(expHomeHT, [2.5, 3.5, 4.5, 5.5]);
  const oversAwayHT = getOvers(expAwayHT, [1.5, 2.5, 3.5, 4.5]);
  const oversHomeFT = getOvers(expHomeFT, [4.5, 5.5, 6.5, 7.5]);
  const oversAwayFT = getOvers(expAwayFT, [3.5, 4.5, 5.5, 6.5]);

  // Match Odds
  const oddsHT = getMatchOdds(expHomeHT, expAwayHT);
  const oddsFT = getMatchOdds(expHomeFT, expAwayFT);

  // Reis dos Cantos
  const oddCasaFT = 1 / oddsFT.home;
  const oddForaFT = 1 / oddsFT.away;
  let rcVencedor, rcOdd, rcLado;
  if (oddsFT.home >= oddsFT.away) { rcVencedor = mandante; rcOdd = oddCasaFT; rcLado = 'casa'; }
  else { rcVencedor = visitante; rcOdd = oddForaFT; rcLado = 'fora'; }
  let rcFaixa;
  if (rcOdd <= 1.30) rcFaixa = 'ABSOLUTO';
  else if (rcOdd <= 1.54) rcFaixa = 'DOMINANTE';
  else if (rcOdd <= 1.75) rcFaixa = 'MODERADO';
  else if (rcOdd <= 1.90) rcFaixa = 'MEDIANO';
  else rcFaixa = 'EQUILIBRADO';

  // Tiro Sniper
  let pUnderHT = 0;
  for (let k = 0; k <= 4; k++) pUnderHT += poisson(k, expTotalHT);
  const pOverHT = (1 - pUnderHT) * 100;
  const sniperHT = pOverHT >= 58 ? 'OVER 4' : (pOverHT <= 42 ? 'UNDER 4' : 'NEUTRO');
  let pUnderFT = 0;
  for (let k = 0; k <= 10; k++) pUnderFT += poisson(k, expTotalFT);
  const pOverFT = (1 - pUnderFT) * 100;
  const sniperFT = pOverFT >= 58 ? 'OVER 10' : (pOverFT <= 42 ? 'UNDER 10' : 'NEUTRO');

  // Bala de Prata
  const bpOdd = Math.min(oddCasaFT, oddForaFT);
  const bpTime = oddCasaFT <= oddForaFT ? mandante : visitante;
  let bpFaixa = null;
  if (bpOdd <= 1.35) bpFaixa = 'NUCLEAR';
  else if (bpOdd <= 1.50) bpFaixa = 'FORTE';
  else if (bpOdd <= 1.63) bpFaixa = 'MODERADA';

  // Incerteza
  const ftValsM = todosM.map(j => j.mandante === mandante ? j.cantos.ft.m : j.cantos.ft.v);
  const ftValsV = todosV.map(j => j.visitante === visitante ? j.cantos.ft.v : j.cantos.ft.m);
  const dpFT = Math.sqrt(stdDev(ftValsM) ** 2 + stdDev(ftValsV) ** 2).toFixed(1);

  // DNA
  const dnaM = calcDNA(todosM, mandante);
  const dnaV = calcDNA(todosV, visitante);

  return {
    mandante, visitante,
    expTotalHT: +expTotalHT.toFixed(2),
    expTotalFT: +expTotalFT.toFixed(2),
    expHomeFT: +expHomeFT.toFixed(2),
    expAwayFT: +expAwayFT.toFixed(2),
    expHomeHT: +expHomeHT.toFixed(2),
    expAwayHT: +expAwayHT.toFixed(2),
    confFT: +confFT.toFixed(1),
    oversHT, oversFT,
    oversHomeFT, oversAwayFT,
    oddsHT, oddsFT,
    reisDosCantosData: { vencedor: rcVencedor, odd: +rcOdd.toFixed(2), faixa: rcFaixa, lado: rcLado },
    tiroSniperData: { ft: sniperFT, ht: sniperHT, pOverHT: +pOverHT.toFixed(1), pOverFT: +pOverFT.toFixed(1) },
    balaDePrataData: bpFaixa ? { time: bpTime, odd: +bpOdd.toFixed(2), faixa: bpFaixa } : null,
    incerteza: { dpFT },
    dnaM, dnaV,
    jogosM: m.jogos, jogosV: v.jogos
  };
}

module.exports = { projecaoJogo, getStatsTime, avg, poisson, getOvers, getMatchOdds };
