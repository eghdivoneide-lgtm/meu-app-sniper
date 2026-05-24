// ════════════════════════════════════════════════════════════════════
// STATS ENGINE — Cálculos estatísticos por time, par H2H e liga
// Tudo derivado direto da fonte primária (jogos[]). Zero estimativa.
// ════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────────
// Funções estatísticas básicas
// ────────────────────────────────────────────────────────────────────
function media(arr)        { return arr.length === 0 ? 0 : arr.reduce((a,b) => a+b, 0) / arr.length; }
function desvioPadrao(arr) {
  if (arr.length < 2) return 0;
  const m = media(arr);
  const variancia = arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length;
  return Math.sqrt(variancia);
}
function pct(arr, predicado) {
  if (arr.length === 0) return 0;
  return (arr.filter(predicado).length / arr.length) * 100;
}
function arred(n, casas = 2) { return Math.round(n * (10 ** casas)) / (10 ** casas); }

// ────────────────────────────────────────────────────────────────────
// Extrai cantos FT do jogo (tolerante a estrutura ausente).
// Retorna { m, v, total, diferencial_m_v } ou null se inválido.
// ────────────────────────────────────────────────────────────────────
function cantosFT(jogo) {
  const c = jogo?.cantos?.ft;
  if (!c || typeof c.m !== 'number' || typeof c.v !== 'number') return null;
  return {
    m:  c.m,
    v:  c.v,
    total:           c.m + c.v,
    diferencial_m_v: c.m - c.v   // positivo = mandante dominou
  };
}

// ────────────────────────────────────────────────────────────────────
// Filtra jogos válidos (com cantos FT preenchidos) de um time
// como mandante, ou como visitante. Retorna array de jogos.
// ────────────────────────────────────────────────────────────────────
function jogosDoTime(jogos, nomeTime, mando = 'AMBOS') {
  return jogos.filter(j => {
    if (!cantosFT(j)) return false;
    if (mando === 'MANDANTE')  return j.mandante  === nomeTime;
    if (mando === 'VISITANTE') return j.visitante === nomeTime;
    return j.mandante === nomeTime || j.visitante === nomeTime;
  });
}

// ────────────────────────────────────────────────────────────────────
// Stats de UM time como MANDANTE.
// Ponto de vista: cantos COBRADOS pelo time (m) e CONCEDIDOS (v).
// ────────────────────────────────────────────────────────────────────
function statsTimeMandante(jogos, nomeTime) {
  const arr = jogosDoTime(jogos, nomeTime, 'MANDANTE');
  if (arr.length === 0) return null;

  const cobrados   = arr.map(j => cantosFT(j).m);
  const sofridos   = arr.map(j => cantosFT(j).v);
  const totais     = arr.map(j => cantosFT(j).total);
  const diferencas = arr.map(j => cantosFT(j).diferencial_m_v);  // mandante - visitante

  return {
    n_jogos:                arr.length,
    cobrados_media:         arred(media(cobrados)),
    cobrados_dp:            arred(desvioPadrao(cobrados)),
    sofridos_media:         arred(media(sofridos)),
    sofridos_dp:            arred(desvioPadrao(sofridos)),
    total_media:            arred(media(totais)),
    total_dp:               arred(desvioPadrao(totais)),
    diferencial_media:      arred(media(diferencas)),
    diferencial_dp:         arred(desvioPadrao(diferencas)),
    pct_cobrados_5_mais:    arred(pct(cobrados,   x => x >= 5),  1),
    pct_total_under_9:      arred(pct(totais,     x => x <  9),  1),
    pct_total_over_11:      arred(pct(totais,     x => x > 11),  1),
    pct_diferencial_4_mais: arred(pct(diferencas, x => x >= 4),  1),
    min_total:              Math.min(...totais),
    max_total:              Math.max(...totais)
  };
}

// ────────────────────────────────────────────────────────────────────
// Stats de UM time como VISITANTE.
// Ponto de vista: cantos COBRADOS pelo time (v) e CONCEDIDOS (m).
// ────────────────────────────────────────────────────────────────────
function statsTimeVisitante(jogos, nomeTime) {
  const arr = jogosDoTime(jogos, nomeTime, 'VISITANTE');
  if (arr.length === 0) return null;

  const cobrados   = arr.map(j => cantosFT(j).v);   // visitante = v
  const sofridos   = arr.map(j => cantosFT(j).m);   // mandante = m
  const totais     = arr.map(j => cantosFT(j).total);
  const diferencas = arr.map(j => cantosFT(j).v - cantosFT(j).m);  // visitante - mandante

  return {
    n_jogos:                arr.length,
    cobrados_media:         arred(media(cobrados)),
    cobrados_dp:            arred(desvioPadrao(cobrados)),
    sofridos_media:         arred(media(sofridos)),
    sofridos_dp:            arred(desvioPadrao(sofridos)),
    total_media:            arred(media(totais)),
    total_dp:               arred(desvioPadrao(totais)),
    diferencial_media:      arred(media(diferencas)),
    diferencial_dp:         arred(desvioPadrao(diferencas)),
    pct_cobrados_5_mais:    arred(pct(cobrados,   x => x >= 5),  1),
    pct_total_under_9:      arred(pct(totais,     x => x <  9),  1),
    pct_total_over_11:      arred(pct(totais,     x => x > 11),  1),
    pct_diferencial_4_mais: arred(pct(diferencas, x => x >= 4),  1),
    min_total:              Math.min(...totais),
    max_total:              Math.max(...totais)
  };
}

// ────────────────────────────────────────────────────────────────────
// Stats GERAIS de um time (todos os jogos).
// Útil para sanity check e para o filtro de "n_jogos" do Filtro 1.
// ────────────────────────────────────────────────────────────────────
function statsTimeGeral(jogos, nomeTime) {
  const arr = jogosDoTime(jogos, nomeTime, 'AMBOS');
  if (arr.length === 0) return { n_jogos: 0 };

  // Cobrados: usa "m" se mandante, "v" se visitante. Idem sofridos.
  const cobrados   = arr.map(j => j.mandante === nomeTime ? cantosFT(j).m : cantosFT(j).v);
  const sofridos   = arr.map(j => j.mandante === nomeTime ? cantosFT(j).v : cantosFT(j).m);
  const totais     = arr.map(j => cantosFT(j).total);
  const diferencas = arr.map((j, i) => cobrados[i] - sofridos[i]);  // perspectiva do time

  return {
    n_jogos:                arr.length,
    cobrados_media:         arred(media(cobrados)),
    sofridos_media:         arred(media(sofridos)),
    total_media:            arred(media(totais)),
    total_dp:               arred(desvioPadrao(totais)),
    diferencial_media:      arred(media(diferencas)),
    diferencial_dp:         arred(desvioPadrao(diferencas)),
    pct_total_under_9:      arred(pct(totais,     x => x <  9),  1),
    pct_total_over_11:      arred(pct(totais,     x => x > 11),  1),
    pct_diferencial_4_mais: arred(pct(diferencas, x => x >=  4), 1)
  };
}

// ────────────────────────────────────────────────────────────────────
// H2H entre dois times (em ambas as orientações).
// Retorna stats vista do "timeA".
// ────────────────────────────────────────────────────────────────────
function statsH2H(jogos, timeA, timeB) {
  const confrontos = jogos.filter(j => {
    if (!cantosFT(j)) return false;
    return (j.mandante === timeA && j.visitante === timeB) ||
           (j.mandante === timeB && j.visitante === timeA);
  });

  if (confrontos.length === 0) return { n_confrontos: 0 };

  const totais     = confrontos.map(j => cantosFT(j).total);
  // Diferencial vista do timeA: cantos do A - cantos do B (independente do mando)
  const diferencas = confrontos.map(j => {
    const c = cantosFT(j);
    return j.mandante === timeA ? (c.m - c.v) : (c.v - c.m);
  });

  return {
    n_confrontos:            confrontos.length,
    total_media:             arred(media(totais)),
    total_dp:                arred(desvioPadrao(totais)),
    total_min:               Math.min(...totais),
    total_max:               Math.max(...totais),
    total_range:             Math.max(...totais) - Math.min(...totais),
    diferencial_media_A:     arred(media(diferencas)),
    diferencial_dp:          arred(desvioPadrao(diferencas)),
    pct_total_under_9:       arred(pct(totais,     x => x <  9), 1),
    pct_diferencial_4_A:     arred(pct(diferencas, x => x >=  4), 1),
    pct_diferencial_neg4_A:  arred(pct(diferencas, x => x <= -4), 1),
    confrontos_detalhe:      confrontos.map(j => ({
      data:      j.dataNorm || j.data,
      rodada:    j.rodada,
      mandante:  j.mandante,
      visitante: j.visitante,
      cantos_m:  cantosFT(j).m,
      cantos_v:  cantosFT(j).v,
      total:     cantosFT(j).total
    }))
  };
}

// ────────────────────────────────────────────────────────────────────
// Stats de uma LIGA inteira (baseline).
// ────────────────────────────────────────────────────────────────────
function statsLiga(jogos) {
  const validos = jogos.filter(j => cantosFT(j));
  if (validos.length === 0) return { n_jogos: 0 };

  const totaisFT       = validos.map(j => cantosFT(j).total);
  const cantosMandante = validos.map(j => cantosFT(j).m);
  const cantosVisit    = validos.map(j => cantosFT(j).v);
  const diferencas     = validos.map(j => Math.abs(cantosFT(j).diferencial_m_v));

  return {
    n_jogos:                  validos.length,
    media_cantos_FT:          arred(media(totaisFT)),
    dp_cantos_FT:             arred(desvioPadrao(totaisFT)),
    media_cantos_mandante:    arred(media(cantosMandante)),
    media_cantos_visitante:   arred(media(cantosVisit)),
    media_diferencial_abs:    arred(media(diferencas)),
    pct_under_9:              arred(pct(totaisFT, x => x <  9), 1),
    pct_under_8:              arred(pct(totaisFT, x => x <  8), 1),
    pct_over_11:              arred(pct(totaisFT, x => x > 11), 1),
    pct_diferencial_4_mais:   arred(pct(diferencas, x => x >= 4), 1),
    min_total:                Math.min(...totaisFT),
    max_total:                Math.max(...totaisFT)
  };
}

// ────────────────────────────────────────────────────────────────────
// Constrói o "perfil completo" de um time numa liga.
// Combina: mandante + visitante + geral.
// ────────────────────────────────────────────────────────────────────
function perfilTimeCompleto(jogosLiga, nomeTime) {
  return {
    nome:      nomeTime,
    geral:     statsTimeGeral(jogosLiga, nomeTime),
    mandante:  statsTimeMandante(jogosLiga, nomeTime),
    visitante: statsTimeVisitante(jogosLiga, nomeTime)
  };
}

module.exports = {
  // utilidades
  media, desvioPadrao, pct, arred, cantosFT,
  // perfis
  statsTimeMandante,
  statsTimeVisitante,
  statsTimeGeral,
  perfilTimeCompleto,
  statsH2H,
  statsLiga
};
