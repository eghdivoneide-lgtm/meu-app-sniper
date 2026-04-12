let DADOS_2026 = window.DADOS_MLS;
function avg(arr){ return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
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

// Poisson base function
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
    for(let i=0; i<=kMax; i++){
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
  return {
    home: home / norm,
    draw: draw / norm,
    away: away / norm,
    homeHcp: homeHcp / norm
  };
}

function getStatsTime(time) {
  const jogosValidos = DADOS_2026.jogos.filter(j => j.cantos !== null);
  const casa   = jogosValidos.filter(j => j.mandante  === time);
  const fora   = jogosValidos.filter(j => j.visitante === time);
  const todos  = [...casa,...fora];
  const t_todos = todos.filter(j => j.stats_taticas);

  return {
    time,
    jogos: todos.length,
    jogosData: todos,
    media: {
      ht_casa:  avg(casa.map(j => j.cantos.ht.m)),
      ht_casa_c: avg(casa.map(j => j.cantos.ht.v)), // concedido
      ht_fora:  avg(fora.map(j => j.cantos.ht.v)),
      ht_fora_c: avg(fora.map(j => j.cantos.ht.m)), // concedido
      ft_casa:  avg(casa.map(j => j.cantos.ft.m)),
      ft_casa_c: avg(casa.map(j => j.cantos.ft.v)),
      ft_fora:  avg(fora.map(j => j.cantos.ft.v)),
      ft_fora_c: avg(fora.map(j => j.cantos.ft.m)),
      ht_geral: avg(todos.map(j => j.mandante===time ? j.cantos.ht.m : j.cantos.ht.v)),
      ht_geral_c: avg(todos.map(j => j.mandante===time ? j.cantos.ht.v : j.cantos.ht.m)),
      ft_geral: avg(todos.map(j => j.mandante===time ? j.cantos.ft.m : j.cantos.ft.v)),
      ft_geral_c: avg(todos.map(j => j.mandante===time ? j.cantos.ft.v : j.cantos.ft.m)),
      posse: avgWeighted(t_todos.map(j => j.mandante===time ? j.stats_taticas.posse.m : j.stats_taticas.posse.v), 0.9),
      chutes: avgWeighted(t_todos.map(j => j.mandante===time ? j.stats_taticas.finalizacoes.m : j.stats_taticas.finalizacoes.v), 0.9),
      chutes_c: avgWeighted(t_todos.map(j => j.mandante===time ? j.stats_taticas.finalizacoes.v : j.stats_taticas.finalizacoes.m), 0.9)
    }
  };
}

function projecaoJogo(mandante, visitante) {
  const m = getStatsTime(mandante);
  const v = getStatsTime(visitante);
  const jogosValidos = DADOS_2026.jogos.filter(j => j.cantos !== null);

  // Arrays locais em ordem cronológica (p/ modelagem avançada)
  const casa = jogosValidos.filter(j => j.mandante === mandante);
  const fora = jogosValidos.filter(j => j.visitante === visitante);

  // Médias Gerais do Campeonato
  const l_htHome = avg(jogosValidos.map(j => j.cantos.ht.m));
  const l_htAway = avg(jogosValidos.map(j => j.cantos.ht.v));
  const l_2tHome = avg(jogosValidos.map(j => j.cantos.ft.m - j.cantos.ht.m));
  const l_2tAway = avg(jogosValidos.map(j => j.cantos.ft.v - j.cantos.ht.v));

  // --- MODELAGEM TMI (Índice de Domínio Tático Total) ---
  const t_val = jogosValidos.filter(j=>j.stats_taticas && typeof j.stats_taticas.posse?.m === 'number');
  
  let tmiHome = 1.0;
  let tmiAway = 1.0;
  let m_vert = 1.0, v_vert = 1.0, m_rej = 1.0, v_rej = 1.0;
  let dadosTaticosAusentes = false;
  
  if (t_val.length === 0 || !m.media.chutes || !v.media.chutes) {
      dadosTaticosAusentes = true;
  } else {
      const l_chutesHome = avg(t_val.map(j=>j.stats_taticas.finalizacoes.m));
      const l_chutesAway = avg(t_val.map(j=>j.stats_taticas.finalizacoes.v));
      const l_vertAvg = (l_chutesHome + l_chutesAway) / 100;
      
      const l_avgCorners = avg(jogosValidos.map(j=>(j.cantos.ft.m + j.cantos.ft.v)/2));
      const l_rejAvg = l_avgCorners / ((l_chutesHome + l_chutesAway)/2);

      m_vert = (m.media.chutes / (m.media.posse || 50)) / l_vertAvg;
      v_vert = (v.media.chutes / (v.media.posse || 50)) / l_vertAvg;
      
      m_rej = ((m.media.ft_geral_c) / (m.media.chutes_c || 1)) / l_rejAvg;
      v_rej = ((v.media.ft_geral_c) / (v.media.chutes_c || 1)) / l_rejAvg;

      tmiHome = (m_vert * 0.75) + (v_rej * 0.25);
      tmiAway = (v_vert * 0.75) + (m_rej * 0.25);

      tmiHome = Math.max(0.65, Math.min(1.65, tmiHome));
      tmiAway = Math.max(0.65, Math.min(1.65, tmiAway));
  }

  // -------- CÁLCULO SNIPER PRO v2 (Bayesiano + EWMA + 2T Mixado) --------
  // Os cálculos operam num campo matemático isolado:

  // 1. Médias com Decaimento Exponencial (Peso maior pra jogos recentes)
  const m_ht_pro = avgWeighted(casa.map(j => j.cantos.ht.m));
  const m_ht_con = avgWeighted(casa.map(j => j.cantos.ht.v));
  const m_2t_pro = avgWeighted(casa.map(j => j.cantos.ft.m - j.cantos.ht.m));
  const m_2t_con = avgWeighted(casa.map(j => j.cantos.ft.v - j.cantos.ht.v));

  const v_ht_pro = avgWeighted(fora.map(j => j.cantos.ht.v));
  const v_ht_con = avgWeighted(fora.map(j => j.cantos.ht.m));
  const v_2t_pro = avgWeighted(fora.map(j => j.cantos.ft.v - j.cantos.ht.v));
  const v_2t_con = avgWeighted(fora.map(j => j.cantos.ft.m - j.cantos.ht.m));

  // 2. Fatores Ofensivos / Defensivos (Com Shrinkage Bayesiano Anti-Variância)
  const nM = casa.length;
  const nV = fora.length;

  const atkHomeHT = shrink(m_ht_pro, l_htHome, nM) / (l_htHome||1);
  const defHomeHT = shrink(m_ht_con, l_htAway, nM) / (l_htAway||1);
  const atkAwayHT = shrink(v_ht_pro, l_htAway, nV) / (l_htAway||1);
  const defAwayHT = shrink(v_ht_con, l_htHome, nV) / (l_htHome||1);

  const atkHome2T = shrink(m_2t_pro, l_2tHome, nM) / (l_2tHome||1);
  const defHome2T = shrink(m_2t_con, l_2tAway, nM) / (l_2tAway||1);
  const atkAway2T = shrink(v_2t_pro, l_2tAway, nV) / (l_2tAway||1);
  const defAway2T = shrink(v_2t_con, l_2tHome, nV) / (l_2tHome||1);

  // 3. Cantos Esperados (xCorners Real) -> Injetado com o TMI!
  const expHomeHT = atkHomeHT * defAwayHT * l_htHome * tmiHome;
  const expAwayHT = atkAwayHT * defHomeHT * l_htAway * tmiAway;
  const expTotalHT = expHomeHT + expAwayHT;
  
  const expHome2T = atkHome2T * defAway2T * l_2tHome * tmiHome;
  const expAway2T = atkAway2T * defHome2T * l_2tAway * tmiAway;
  const expTotalFT = expTotalHT + expHome2T + expAway2T;

  // Derivando os agregadores FT só para carregar os marcadores visuais do Site (Escala Sniper)
  const atkHomeFT = (atkHomeHT + atkHome2T)/2;
  const atkAwayFT = (atkAwayHT + atkAway2T)/2;
  const defHomeFT = (defHomeHT + defHome2T)/2;
  const defAwayFT = (defAwayHT + defAway2T)/2;

  // Confiança agora lastreada na estabilidade amostral
  const nMin = Math.min(m.jogos, v.jogos);
  const totalRodadasReal = Math.max(...DADOS_2026.jogos.map(j => typeof j.rodada === 'number' ? j.rodada : 0)) || 38;
  const confFT = Math.min(95, 40 + (nMin / totalRodadasReal) * 55);

  // Mercados "Fair Odds" (Handicaps de Linha e Match Odds)
  const oversHT = getOvers(expTotalHT, [3.5, 4.5, 5.5]);
  const oversFT = getOvers(expTotalFT, [8.5, 9.5, 10.5, 11.5]);
  
  const oddsHT = getMatchOdds(expHomeHT, expAwayHT);
  const oddsFT = getMatchOdds(expHomeHT + expHome2T, expAwayHT + expAway2T);

  return { expTotalHT, expTotalFT, confFT, oversHT, oversFT, oddsHT, oddsFT, m, v, pow: { atkHomeFT, atkAwayFT, defHomeFT, defAwayFT }, tatica: { m_vert, v_vert, m_rej, v_rej, tmiHome, tmiAway, dadosTaticosAusentes } };
}