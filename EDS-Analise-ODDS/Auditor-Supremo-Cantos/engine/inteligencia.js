// ════════════════════════════════════════════════════════════════════
// INTELIGÊNCIA DO ESPECIALISTA — Modelo probabilístico contínuo
//
// Cada jogo recebe uma probabilidade 0-100 para cada um dos 3 mercados
// (HDP_FT_MANDANTE, HDP_FT_VISITANTE, UNDER_9_FT). A probabilidade é
// combinação ponderada de 6-10 evidências, cada uma justificada.
//
// O agente NUNCA elimina por "regra que não bate" — ele RANQUEIA. Sempre
// existe um top-10 por mercado. O critério final é "qual o mais forte",
// não "qual passou OU não".
// ════════════════════════════════════════════════════════════════════

const { MERCADOS } = require('./filtros');

// ────────────────────────────────────────────────────────────────────
// Função utilitária: dado um valor X, retorna probabilidade 0-100 com
// curva linear entre [ruim, médio, forte].
// Ex.: score(5, 3, 6, 8) → 5 está entre 3 e 6, retorna ~67
// ────────────────────────────────────────────────────────────────────
function rampaCrescente(valor, ruim, otimo) {
  if (valor <= ruim)  return 0;
  if (valor >= otimo) return 100;
  return ((valor - ruim) / (otimo - ruim)) * 100;
}
function rampaDecrescente(valor, otimo, ruim) {
  if (valor <= otimo) return 100;
  if (valor >= ruim)  return 0;
  return ((ruim - valor) / (ruim - otimo)) * 100;
}

// ────────────────────────────────────────────────────────────────────
// EVIDÊNCIAS PARA HDP_FT_MANDANTE (mandante -3.5 cantos)
// ────────────────────────────────────────────────────────────────────
function evidenciasHDP_Mandante(perfilM, perfilV, statsH, statsLigaInfo) {
  const ev = [];
  const pM = perfilM.mandante, pV = perfilV.visitante, dnaM = perfilM.dna || {}, dnaV = perfilV.dna || {};

  // E1: Mandante diferencial em casa (peso 22)
  ev.push({
    nome: 'Mandante domina em casa',
    valor: pM.diferencial_media,
    score: rampaCrescente(pM.diferencial_media, 1.5, 6.0),
    peso: 22,
    detalhe: `dif média casa = ${pM.diferencial_media} (cobra ${pM.cobrados_media}, sofre ${pM.sofridos_media})`
  });

  // E2: Mandante % de jogos com diferencial 4+ (peso 14)
  ev.push({
    nome: 'Mandante recorrente em dif≥4 em casa',
    valor: pM.pct_diferencial_4_mais,
    score: rampaCrescente(pM.pct_diferencial_4_mais, 20, 70),
    peso: 14,
    detalhe: `${pM.pct_diferencial_4_mais}% dos jogos em casa com dif≥4`
  });

  // E3: Visitante sofre em cantos fora (peso 18)
  ev.push({
    nome: 'Visitante submisso fora',
    valor: pV.diferencial_media,
    score: rampaDecrescente(pV.diferencial_media, 0, -4),
    peso: 18,
    detalhe: `dif média fora = ${pV.diferencial_media} (cobra só ${pV.cobrados_media}, sofre ${pV.sofridos_media})`
  });

  // E4: Visitante cobra pouco fora (peso 8)
  ev.push({
    nome: 'Visitante gera poucos cantos fora',
    valor: pV.cobrados_media,
    score: rampaDecrescente(pV.cobrados_media, 4.0, 6.5),
    peso: 8,
    detalhe: `cobra ${pV.cobrados_media} cantos/jogo fora`
  });

  // E5: H2H confirma dominação do mandante (peso 12)
  let scoreH2H = 50; // neutro se não há H2H
  let detH2H   = `${statsH.n_confrontos} confrontos`;
  if (statsH.n_confrontos >= 1) {
    scoreH2H = rampaCrescente(statsH.diferencial_media_A, -2, 6);
    detH2H = `${statsH.n_confrontos} confrontos, dif média vista mand = ${statsH.diferencial_media_A}`;
  }
  ev.push({ nome: 'H2H confirma mandante', valor: statsH.diferencial_media_A, score: scoreH2H, peso: 12, detalhe: detH2H });

  // E6: Liga compatível com HDP (peso 8)
  ev.push({
    nome: 'Liga produz jogos com dif≥4 frequentemente',
    valor: statsLigaInfo.pct_diferencial_4_mais,
    score: rampaCrescente(statsLigaInfo.pct_diferencial_4_mais, 25, 55),
    peso: 8,
    detalhe: `liga tem ${statsLigaInfo.pct_diferencial_4_mais}% de jogos com dif≥4`
  });

  // E7: Consistência (DP baixo do diferencial casa do mandante) (peso 10)
  ev.push({
    nome: 'Mandante consistente em casa',
    valor: pM.diferencial_dp,
    score: rampaDecrescente(pM.diferencial_dp, 1.5, 5.0),
    peso: 10,
    detalhe: `DP diferencial casa = ${pM.diferencial_dp} (menor = mais previsível)`
  });

  // E8: DNA escoteiro — mandante em chama / casa forte (peso 8)
  const mandanteCasaForte = (dnaM.casa_v_pct || 50) >= 60;
  const emChama           = (dnaM.notas || []).some(n => /chama|🔥/i.test(n));
  const visitanteCrise    = (dnaV.notas || []).some(n => /crise|❄️/i.test(n));
  const evitarFora        = (dnaV.notas || []).some(n => /evitar.*visit|✈️.*alta/i.test(n));
  let scoreDNA = 50;
  if (mandanteCasaForte) scoreDNA += 15;
  if (emChama)           scoreDNA += 15;
  if (visitanteCrise)    scoreDNA += 10;
  if (evitarFora)        scoreDNA += 10;
  scoreDNA = Math.min(100, scoreDNA);
  ev.push({
    nome: 'DNA: contexto favorece mandante',
    valor: '',
    score: scoreDNA,
    peso: 8,
    detalhe: `mandCasa${mandanteCasaForte?'✓':'✗'} chama${emChama?'✓':'✗'} crise${visitanteCrise?'✓':'✗'} evitarV${evitarFora?'✓':'✗'}`
  });

  return ev;
}

// ────────────────────────────────────────────────────────────────────
// EVIDÊNCIAS PARA HDP_FT_VISITANTE (visitante -3.5 cantos)
// ────────────────────────────────────────────────────────────────────
function evidenciasHDP_Visitante(perfilM, perfilV, statsH, statsLigaInfo) {
  const ev = [];
  const pM = perfilM.mandante, pV = perfilV.visitante, dnaM = perfilM.dna || {}, dnaV = perfilV.dna || {};

  ev.push({
    nome: 'Visitante domina fora',
    valor: pV.diferencial_media,
    score: rampaCrescente(pV.diferencial_media, 1.5, 6.0),
    peso: 22,
    detalhe: `dif média fora = ${pV.diferencial_media} (cobra ${pV.cobrados_media}, sofre ${pV.sofridos_media})`
  });

  ev.push({
    nome: 'Visitante recorrente em dif≥4 fora',
    valor: pV.pct_diferencial_4_mais,
    score: rampaCrescente(pV.pct_diferencial_4_mais, 20, 60),
    peso: 14,
    detalhe: `${pV.pct_diferencial_4_mais}% dos jogos fora com dif≥4`
  });

  ev.push({
    nome: 'Mandante submisso em casa',
    valor: pM.diferencial_media,
    score: rampaDecrescente(pM.diferencial_media, 0, -4),
    peso: 18,
    detalhe: `dif média casa = ${pM.diferencial_media}`
  });

  ev.push({
    nome: 'Mandante gera poucos cantos em casa',
    valor: pM.cobrados_media,
    score: rampaDecrescente(pM.cobrados_media, 4.0, 6.5),
    peso: 8,
    detalhe: `cobra ${pM.cobrados_media} cantos/jogo em casa`
  });

  let scoreH2H = 50;
  let detH2H   = `${statsH.n_confrontos} confrontos`;
  if (statsH.n_confrontos >= 1) {
    scoreH2H = rampaDecrescente(statsH.diferencial_media_A, 2, -6);
    detH2H = `${statsH.n_confrontos} confrontos, dif média vista mand = ${statsH.diferencial_media_A}`;
  }
  ev.push({ nome: 'H2H confirma visitante', valor: statsH.diferencial_media_A, score: scoreH2H, peso: 12, detalhe: detH2H });

  ev.push({
    nome: 'Liga produz jogos com dif≥4 frequentemente',
    valor: statsLigaInfo.pct_diferencial_4_mais,
    score: rampaCrescente(statsLigaInfo.pct_diferencial_4_mais, 25, 55),
    peso: 8,
    detalhe: `liga tem ${statsLigaInfo.pct_diferencial_4_mais}% de jogos com dif≥4`
  });

  ev.push({
    nome: 'Visitante consistente fora',
    valor: pV.diferencial_dp,
    score: rampaDecrescente(pV.diferencial_dp, 1.5, 5.0),
    peso: 10,
    detalhe: `DP diferencial fora = ${pV.diferencial_dp}`
  });

  const visitanteForaForte = (dnaV.fora_v_pct || 30) >= 50;
  const visitanteEmChama   = (dnaV.notas || []).some(n => /chama|🔥/i.test(n));
  const mandanteCrise      = (dnaM.notas || []).some(n => /crise|❄️/i.test(n));
  let scoreDNA = 50;
  if (visitanteForaForte)  scoreDNA += 20;
  if (visitanteEmChama)    scoreDNA += 15;
  if (mandanteCrise)       scoreDNA += 15;
  scoreDNA = Math.min(100, scoreDNA);
  ev.push({
    nome: 'DNA: contexto favorece visitante',
    valor: '',
    score: scoreDNA,
    peso: 8,
    detalhe: `vistFora${visitanteForaForte?'✓':'✗'} chamaV${visitanteEmChama?'✓':'✗'} criseM${mandanteCrise?'✓':'✗'}`
  });

  return ev;
}

// ────────────────────────────────────────────────────────────────────
// EVIDÊNCIAS PARA UNDER_9_FT (total cantos < 9)
// ────────────────────────────────────────────────────────────────────
function evidenciasUnder9(perfilM, perfilV, statsH, statsLigaInfo) {
  const ev = [];
  const pM = perfilM.mandante, pV = perfilV.visitante, dnaM = perfilM.dna || {}, dnaV = perfilV.dna || {};

  // E1: Mandante total médio em casa (peso 22)
  ev.push({
    nome: 'Mandante joga partidas de poucos cantos em casa',
    valor: pM.total_media,
    score: rampaDecrescente(pM.total_media, 6.5, 11),
    peso: 22,
    detalhe: `total médio casa = ${pM.total_media} (min ${pM.min_total}, max ${pM.max_total})`
  });

  // E2: Mandante % under 9 em casa (peso 14)
  ev.push({
    nome: 'Mandante recorrente em under 9 casa',
    valor: pM.pct_total_under_9,
    score: rampaCrescente(pM.pct_total_under_9, 25, 75),
    peso: 14,
    detalhe: `${pM.pct_total_under_9}% dos jogos casa com <9 cantos`
  });

  // E3: Visitante total médio fora (peso 18)
  ev.push({
    nome: 'Visitante joga partidas de poucos cantos fora',
    valor: pV.total_media,
    score: rampaDecrescente(pV.total_media, 6.5, 11),
    peso: 18,
    detalhe: `total médio fora = ${pV.total_media} (min ${pV.min_total}, max ${pV.max_total})`
  });

  // E4: Visitante % under 9 fora (peso 12)
  ev.push({
    nome: 'Visitante recorrente em under 9 fora',
    valor: pV.pct_total_under_9,
    score: rampaCrescente(pV.pct_total_under_9, 25, 75),
    peso: 12,
    detalhe: `${pV.pct_total_under_9}% dos jogos fora com <9 cantos`
  });

  // E5: H2H total baixo (peso 10)
  let scoreH2H = 50;
  let detH2H   = `${statsH.n_confrontos} confrontos`;
  if (statsH.n_confrontos >= 1) {
    scoreH2H = rampaDecrescente(statsH.total_media, 7, 12);
    detH2H = `${statsH.n_confrontos} confrontos, total médio = ${statsH.total_media}`;
  }
  ev.push({ nome: 'H2H confirma under 9', valor: statsH.total_media, score: scoreH2H, peso: 10, detalhe: detH2H });

  // E6: Liga é de poucos cantos (peso 8)
  ev.push({
    nome: 'Liga é defensiva em cantos',
    valor: statsLigaInfo.media_cantos_FT,
    score: rampaDecrescente(statsLigaInfo.media_cantos_FT, 8, 11),
    peso: 8,
    detalhe: `liga média ${statsLigaInfo.media_cantos_FT} cantos, ${statsLigaInfo.pct_under_9}% under 9`
  });

  // E7: Consistência (peso 8)
  const dpAvg = (pM.total_dp + pV.total_dp) / 2;
  ev.push({
    nome: 'Ambos consistentes em total',
    valor: dpAvg,
    score: rampaDecrescente(dpAvg, 2.0, 4.5),
    peso: 8,
    detalhe: `DP médio = ${dpAvg.toFixed(2)} (M=${pM.total_dp}, V=${pV.total_dp})`
  });

  // E8: DNA — ambos defensivos/equilibrados, sem em chama (peso 8)
  const ambosDef = (dnaM.perfil || '').match(/DEFENSIVO|EQUILIBRADO|MURO/) &&
                   (dnaV.perfil || '').match(/DEFENSIVO|EQUILIBRADO|MURO/);
  const semChama = !((dnaM.notas || []).concat(dnaV.notas || []).some(n => /chama|🔥/i.test(n)));
  let scoreDNA = 50;
  if (ambosDef)  scoreDNA += 25;
  if (semChama)  scoreDNA += 15;
  scoreDNA = Math.min(100, scoreDNA);
  ev.push({
    nome: 'DNA: perfis defensivos',
    valor: '',
    score: scoreDNA,
    peso: 8,
    detalhe: `M=${dnaM.perfil||'?'}, V=${dnaV.perfil||'?'} | semChama${semChama?'✓':'✗'}`
  });

  return ev;
}

// ────────────────────────────────────────────────────────────────────
// Calcula probabilidade combinada de UM mercado a partir das evidências.
// ────────────────────────────────────────────────────────────────────
function combinarEvidencias(evidencias) {
  const somaPeso = evidencias.reduce((s, e) => s + e.peso, 0);
  if (somaPeso === 0) return { prob: 0, evidencias };
  const somaPond = evidencias.reduce((s, e) => s + e.score * e.peso, 0);
  return {
    prob:        Math.round(somaPond / somaPeso),
    evidencias:  evidencias.sort((a, b) => (b.score * b.peso) - (a.score * a.peso))
  };
}

// ────────────────────────────────────────────────────────────────────
// ANALISA UM JOGO — retorna probabilidade contínua para cada mercado.
// ────────────────────────────────────────────────────────────────────
function analisarJogoInteligente({ jogo, perfilM, perfilV, statsH, statsLigaInfo, infoLiga }) {
  // Anexa DNA aos perfis se ainda não anexado
  if (!perfilM.dna) perfilM.dna = (infoLiga.dnaLiga || {})[perfilM.nome] || {};
  if (!perfilV.dna) perfilV.dna = (infoLiga.dnaLiga || {})[perfilV.nome] || {};

  const hdpM   = combinarEvidencias(evidenciasHDP_Mandante (perfilM, perfilV, statsH, statsLigaInfo));
  const hdpV   = combinarEvidencias(evidenciasHDP_Visitante(perfilM, perfilV, statsH, statsLigaInfo));
  const und9   = combinarEvidencias(evidenciasUnder9       (perfilM, perfilV, statsH, statsLigaInfo));

  return {
    jogo,
    mercados: {
      [MERCADOS.HDP_FT_MANDANTE]:  hdpM,
      [MERCADOS.HDP_FT_VISITANTE]: hdpV,
      [MERCADOS.UNDER_9_FT]:       und9
    },
    perfilM, perfilV, statsH
  };
}

module.exports = {
  analisarJogoInteligente,
  combinarEvidencias,
  rampaCrescente, rampaDecrescente
};
