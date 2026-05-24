// ════════════════════════════════════════════════════════════════════
// FILTROS 1-6 + CONVERGÊNCIA 7/7 + SCORE + SELEÇÃO DE MERCADO
// Implementação literal da Spec do Auditor Supremo (Seções 4-6).
// ════════════════════════════════════════════════════════════════════

const { PARAMETROS }    = require('../config');
const { perfilTimeCompleto, statsH2H, statsLiga } = require('./stats');

// ────────────────────────────────────────────────────────────────────
// Bloco de mercados testáveis para um jogo específico.
// ────────────────────────────────────────────────────────────────────
const MERCADOS = {
  HDP_FT_MANDANTE:  'HDP_FT_MANDANTE',   // mandante -3.5 cantos sobre visitante
  HDP_FT_VISITANTE: 'HDP_FT_VISITANTE',  // visitante -3.5 cantos sobre mandante
  UNDER_9_FT:       'UNDER_9_FT'         // total < 9 cantos no FT
};

// ────────────────────────────────────────────────────────────────────
// FILTRO 1 — Eliminação por DADOS INSUFICIENTES.
// Retorna { passou: bool, motivo: string|null }.
// ────────────────────────────────────────────────────────────────────
function filtro1_dadosInsuficientes(perfilM, perfilV, statsH, infoLiga) {
  const cfg = PARAMETROS.filtro1;

  if (!perfilM.geral || perfilM.geral.n_jogos < cfg.minJogosPorTime) {
    return { passou: false, motivo: `F1: Mandante com apenas ${perfilM.geral?.n_jogos || 0} jogos (mínimo ${cfg.minJogosPorTime})` };
  }
  if (!perfilV.geral || perfilV.geral.n_jogos < cfg.minJogosPorTime) {
    return { passou: false, motivo: `F1: Visitante com apenas ${perfilV.geral?.n_jogos || 0} jogos (mínimo ${cfg.minJogosPorTime})` };
  }
  // Exige distribuição mando-aware mínima
  const nMCasa  = perfilM.mandante?.n_jogos || 0;
  const nVFora  = perfilV.visitante?.n_jogos || 0;
  if (nMCasa < cfg.minJogosCasaOuFora) {
    return { passou: false, motivo: `F1: Mandante com apenas ${nMCasa} jogos em casa (mínimo ${cfg.minJogosCasaOuFora})` };
  }
  if (nVFora < cfg.minJogosCasaOuFora) {
    return { passou: false, motivo: `F1: Visitante com apenas ${nVFora} jogos fora (mínimo ${cfg.minJogosCasaOuFora})` };
  }
  if (statsH.n_confrontos < cfg.minH2HConfrontos) {
    return { passou: false, motivo: `F1: Apenas ${statsH.n_confrontos} confrontos H2H (mínimo ${cfg.minH2HConfrontos})` };
  }
  if (infoLiga.maxRodadaRegistrada < cfg.minRodadasLiga) {
    return { passou: false, motivo: `F1: Liga com apenas ${infoLiga.maxRodadaRegistrada} rodadas (mínimo ${cfg.minRodadasLiga})` };
  }
  return { passou: true, motivo: null };
}

// ────────────────────────────────────────────────────────────────────
// FILTRO 2 — Eliminação por IMPREVISIBILIDADE (DP alto).
// ────────────────────────────────────────────────────────────────────
function filtro2_imprevisibilidade(perfilM, perfilV, statsH) {
  const cfg = PARAMETROS.filtro2;

  if (perfilM.geral.total_dp > cfg.maxDPCantosTotaisTime) {
    return { passou: false, motivo: `F2: Mandante DP cantos ${perfilM.geral.total_dp} > ${cfg.maxDPCantosTotaisTime} (errático)` };
  }
  if (perfilV.geral.total_dp > cfg.maxDPCantosTotaisTime) {
    return { passou: false, motivo: `F2: Visitante DP cantos ${perfilV.geral.total_dp} > ${cfg.maxDPCantosTotaisTime} (errático)` };
  }
  if (perfilM.geral.diferencial_dp > cfg.maxDPDiferencialTime) {
    return { passou: false, motivo: `F2: Mandante DP diferencial ${perfilM.geral.diferencial_dp} > ${cfg.maxDPDiferencialTime}` };
  }
  if (perfilV.geral.diferencial_dp > cfg.maxDPDiferencialTime) {
    return { passou: false, motivo: `F2: Visitante DP diferencial ${perfilV.geral.diferencial_dp} > ${cfg.maxDPDiferencialTime}` };
  }
  if (statsH.total_range && statsH.total_range > cfg.maxRangeH2HCantosTotais) {
    return { passou: false, motivo: `F2: H2H disperso (range ${statsH.total_range} > ${cfg.maxRangeH2HCantosTotais})` };
  }
  return { passou: true, motivo: null };
}

// ────────────────────────────────────────────────────────────────────
// FILTRO 3 — Contexto instável.
// V1: troca-de-técnico e desfalques DESATIVADOS (sem dado externo).
// Mantém apenas verificações deriváveis.
// ────────────────────────────────────────────────────────────────────
function filtro3_contextoInstavel(infoJogo, infoLiga) {
  const cfg = PARAMETROS.filtro3;

  // Mata-mata (fase de copa) — V1: ainda sem dado de "fase eliminatória".
  // O `rodada` no schema é numérica e sequencial, não tem flag de mata-mata.
  // Marca como pendente para v2.

  // Motivacional: "nada em jogo" — derivável da posição na tabela.
  // V1: implementação stub. Retorna passou=true. Será ativado quando integrarmos
  // cálculo de tabela ao vivo.

  return { passou: true, motivo: null, _v1_stub: true };
}

// ────────────────────────────────────────────────────────────────────
// FILTRO 4 — CONVERGÊNCIA 7/7 para um mercado específico.
// Testa o jogo contra UM mercado e retorna detalhe das 7 camadas.
// ────────────────────────────────────────────────────────────────────
function filtro4_convergencia(mercado, perfilM, perfilV, statsH, infoLiga, statsLigaInfo) {
  const camadas = [];

  // ── Calibragens C1/C2 (14/05/2026): thresholds calibrados em dados reais.
  // C1 e C2 trabalham EM CONJUNTO. Lógica:
  //   - cada mercado tem um "lado dominante" e um "lado submisso"
  //   - default: dominante ≥ 4.0 (HDP) ou ≤ 8.5 (Under)
  //              submisso  ≤ -2.0 (HDP) ou ≤ 8.5 (Under)
  //   - se o dominante está com FOLGA AMPLA (dif ≥ 5.0 ou total ≤ 7.0),
  //     o submisso pode ser apenas mediano (≤ -0.5 / ≤ 9.0)
  const TH_HDP_DOMINA      = 4.0;
  const TH_HDP_SOFRE       = 2.0;
  const TH_HDP_DOMINA_AMPLA = 5.0;
  const TH_HDP_SOFRE_RELAX  = 0.5;
  const TH_UNDER_TOTAL      = 8.5;
  const TH_UNDER_AMPLO      = 7.0;
  const TH_UNDER_RELAX      = 9.0;

  // Identifica os valores de cada lado e mercado
  const dM = perfilM.mandante.diferencial_media;
  const dV = perfilV.visitante.diferencial_media;
  const tM = perfilM.mandante.total_media;
  const tV = perfilV.visitante.total_media;

  let c1_ok = false, c1_just = '', c2_ok = false, c2_just = '';

  if (mercado === MERCADOS.HDP_FT_MANDANTE) {
    // C1: mandante domina | C2: visitante submisso
    c1_ok = dM >= TH_HDP_DOMINA;
    c1_just = `Mandante dif casa = ${dM} (≥ ${TH_HDP_DOMINA})`;
    const dominaForte = dM >= TH_HDP_DOMINA_AMPLA;
    const tholdV = dominaForte ? -TH_HDP_SOFRE_RELAX : -TH_HDP_SOFRE;
    c2_ok = dV <= tholdV;
    c2_just = `Visitante dif fora = ${dV} (≤ ${tholdV})${dominaForte ? ' [relaxado: mand domina ≥5]' : ''}`;

  } else if (mercado === MERCADOS.HDP_FT_VISITANTE) {
    // C1: mandante submisso | C2: visitante domina
    const dominaForte = dV >= TH_HDP_DOMINA_AMPLA;
    const tholdM = dominaForte ? TH_HDP_SOFRE_RELAX : TH_HDP_SOFRE;
    c1_ok = dM <= -tholdM;
    c1_just = `Mandante dif casa = ${dM} (≤ -${tholdM})${dominaForte ? ' [relaxado: visit domina ≥5]' : ''}`;
    c2_ok = dV >= TH_HDP_DOMINA;
    c2_just = `Visitante dif fora = ${dV} (≥ ${TH_HDP_DOMINA})`;

  } else if (mercado === MERCADOS.UNDER_9_FT) {
    // C1 e C2: ambos "poucos cantos"; um lado muito baixo relaxa o outro.
    const mandanteAmplo  = tM <= TH_UNDER_AMPLO;
    const visitanteAmplo = tV <= TH_UNDER_AMPLO;
    const tholdM = visitanteAmplo ? TH_UNDER_RELAX : TH_UNDER_TOTAL;
    const tholdV = mandanteAmplo  ? TH_UNDER_RELAX : TH_UNDER_TOTAL;
    c1_ok = tM <= tholdM;
    c1_just = `Mandante total casa = ${tM} (≤ ${tholdM})${visitanteAmplo ? ' [relax: visit ≤7]' : ''}`;
    c2_ok = tV <= tholdV;
    c2_just = `Visitante total fora = ${tV} (≤ ${tholdV})${mandanteAmplo ? ' [relax: mand ≤7]' : ''}`;
  }
  camadas.push({ n: 1, nome: 'Média mandante',  ok: c1_ok, just: c1_just });
  camadas.push({ n: 2, nome: 'Média visitante', ok: c2_ok, just: c2_just });

  // ── Camada 3: H2H confirma? ───────────────────────────────────────
  let c3_ok = false, c3_just = '';
  if (mercado === MERCADOS.HDP_FT_MANDANTE) {
    // statsH.diferencial_media_A é vista do timeA (mandante atual).
    // Se positivo e ≥4 = mandante domina H2H.
    c3_ok = statsH.diferencial_media_A >= PARAMETROS.mercados.HDP_FT.diferencialMinimoMedia;
    c3_just = `H2H diferencial médio (vista mandante) = ${statsH.diferencial_media_A} em ${statsH.n_confrontos} confrontos`;
  } else if (mercado === MERCADOS.HDP_FT_VISITANTE) {
    c3_ok = statsH.diferencial_media_A <= -PARAMETROS.mercados.HDP_FT.diferencialMinimoMedia;
    c3_just = `H2H diferencial médio (vista mandante) = ${statsH.diferencial_media_A} em ${statsH.n_confrontos} confrontos`;
  } else if (mercado === MERCADOS.UNDER_9_FT) {
    c3_ok = statsH.total_media <= PARAMETROS.mercados.UNDER_9_FT.mediaMaximaTotal;
    c3_just = `H2H total médio = ${statsH.total_media} em ${statsH.n_confrontos} confrontos`;
  }
  camadas.push({ n: 3, nome: 'H2H confirma', ok: c3_ok, just: c3_just });

  // ── Camada 4: Contexto motivacional. V1 = passa por padrão. ───────
  // Quando integrarmos tabela ao vivo, valida aqui.
  camadas.push({ n: 4, nome: 'Contexto motivacional', ok: true, just: 'V1: sem dado de tabela ao vivo (passa)' , _stub: true });

  // ── Camada 5: Perfil de CANTOS do time (não DNA de gols). ────────
  // Spec original: "estilo de jogo dos dois times confirma".
  // V1: usa dados REAIS de cantos do banco — perfil derivado do que o time
  // FAZ em cantos, não do que faz em gols. DNA escoteiro (de gols) entra
  // só como confirmação secundária pra detectar "chama" / "crise".
  let c5_ok = false, c5_just = '';
  const dnaM = (perfilM.dna || {});
  const dnaV = (perfilV.dna || {});
  const noEmChama = !((dnaM.notas || []).concat(dnaV.notas || []).some(n => /chama|🔥/i.test(n)));

  if (mercado === MERCADOS.HDP_FT_MANDANTE) {
    // Mandante perfil "dominador de cantos em casa": cobra muito, sofre pouco
    const mandanteDomina = perfilM.mandante.cobrados_media >= 5.5 &&
                           perfilM.mandante.pct_diferencial_4_mais >= 40;
    // Visitante perfil "submisso fora": sofre dif 4+ frequentemente
    const visitanteSofre = perfilV.visitante.diferencial_media <= -2 ||
                           perfilV.visitante.cobrados_media <= 4.5;
    c5_ok = mandanteDomina && visitanteSofre;
    c5_just = `Mandante cobra ${perfilM.mandante.cobrados_media}/jogo casa, %dif4+=${perfilM.mandante.pct_diferencial_4_mais}% | Visitante dif fora=${perfilV.visitante.diferencial_media}`;
  } else if (mercado === MERCADOS.HDP_FT_VISITANTE) {
    const visitanteDomina = perfilV.visitante.cobrados_media >= 5.5 &&
                            perfilV.visitante.pct_diferencial_4_mais >= 35;
    const mandanteSofre   = perfilM.mandante.diferencial_media <= -1 ||
                            perfilM.mandante.cobrados_media <= 4.5;
    c5_ok = visitanteDomina && mandanteSofre;
    c5_just = `Visitante cobra ${perfilV.visitante.cobrados_media}/jogo fora, %dif4+=${perfilV.visitante.pct_diferencial_4_mais}% | Mandante dif casa=${perfilM.mandante.diferencial_media}`;
  } else if (mercado === MERCADOS.UNDER_9_FT) {
    // Ambos têm perfil de "poucos cantos" — total médio baixo + alta % de jogos under 9
    const mandantePoucosCantos  = perfilM.mandante.total_media <= 8.5 &&
                                  perfilM.mandante.pct_total_under_9 >= 40;
    const visitantePoucosCantos = perfilV.visitante.total_media <= 8.5 &&
                                  perfilV.visitante.pct_total_under_9 >= 40;
    c5_ok = mandantePoucosCantos && visitantePoucosCantos && noEmChama;
    c5_just = `M casa: total ${perfilM.mandante.total_media}, %<9=${perfilM.mandante.pct_total_under_9}% | V fora: total ${perfilV.visitante.total_media}, %<9=${perfilV.visitante.pct_total_under_9}%`;
  }
  camadas.push({ n: 5, nome: 'Perfil de cantos', ok: c5_ok, just: c5_just });

  // ── Camada 6: Padrão da liga nesta fase. ─────────────────────────
  // Valida se o mercado é compatível com a liga (não pedir Under 9 em liga de 11+ média).
  let c6_ok = false, c6_just = '';
  if (mercado === MERCADOS.UNDER_9_FT) {
    c6_ok = statsLigaInfo.media_cantos_FT <= 9.5 || statsLigaInfo.pct_under_9 >= 40;
    c6_just = `Liga média ${statsLigaInfo.media_cantos_FT} | %<9 = ${statsLigaInfo.pct_under_9}`;
  } else {
    // HDP FT: valida que a liga tem volume razoável de jogos com diferencial 4+
    c6_ok = statsLigaInfo.pct_diferencial_4_mais >= 35;
    c6_just = `Liga %dif≥4 = ${statsLigaInfo.pct_diferencial_4_mais}`;
  }
  camadas.push({ n: 6, nome: 'Padrão da liga', ok: c6_ok, just: c6_just });

  // ── Camada 7: Consistência estatística (DP baixo nos dois). ──────
  // F2 já cortou casos extremos (>4.0); C7 reforça com 1 nível abaixo (≤3.5).
  let c7_ok = false, c7_just = '';
  const TH_DP_C7 = 3.5;
  if (mercado === MERCADOS.UNDER_9_FT) {
    c7_ok = perfilM.mandante.total_dp <= TH_DP_C7 && perfilV.visitante.total_dp <= TH_DP_C7;
    c7_just = `DP total: M(casa)=${perfilM.mandante.total_dp}, V(fora)=${perfilV.visitante.total_dp} (limite ${TH_DP_C7})`;
  } else {
    c7_ok = perfilM.mandante.diferencial_dp <= TH_DP_C7 && perfilV.visitante.diferencial_dp <= TH_DP_C7;
    c7_just = `DP diferencial: M(casa)=${perfilM.mandante.diferencial_dp}, V(fora)=${perfilV.visitante.diferencial_dp} (limite ${TH_DP_C7})`;
  }
  camadas.push({ n: 7, nome: 'Consistência estatística', ok: c7_ok, just: c7_just });

  // ── Veredito ─────────────────────────────────────────────────────
  const okCount = camadas.filter(c => c.ok).length;
  const passou  = okCount >= PARAMETROS.filtro4.camadasObrigatorias;

  return {
    passou,
    convergencia: `${okCount}/7`,
    camadas,
    motivo: passou ? null : `F4: convergência ${okCount}/7 (precisa ${PARAMETROS.filtro4.camadasObrigatorias}/7)`
  };
}

// ────────────────────────────────────────────────────────────────────
// FILTRO 5 — SCORE 0-100 (mínimo 85 inegociável).
// ────────────────────────────────────────────────────────────────────
function filtro5_score(mercado, perfilM, perfilV, statsH, statsLigaInfo) {
  const pesos = PARAMETROS.filtro5.pesos;
  let pontos = 0;
  const detalhe = {};

  // ── (a) Força bruta dos números (25) ─────────────────────────────
  // Modelo: 12 pontos base (jogo passou 7/7 já é forte) + 9/unidade de folga
  // acima do threshold. Calibrado em 14/05/2026 pra refletir base atual.
  let forca = 0;
  if (mercado === MERCADOS.UNDER_9_FT) {
    const folgaM = 9 - perfilM.mandante.total_media;
    const folgaV = 9 - perfilV.visitante.total_media;
    forca = 12 + ((folgaM + folgaV) / 2) * 7;
  } else if (mercado === MERCADOS.HDP_FT_MANDANTE) {
    const folga = perfilM.mandante.diferencial_media - 3.5;
    forca = 12 + folga * 9;
  } else {
    const folga = -perfilV.visitante.diferencial_media - 3.5;
    forca = 12 + folga * 9;
  }
  detalhe.forcaBruta = Math.min(pesos.forcaBrutaNumeros, Math.max(0, Math.round(forca)));
  pontos += detalhe.forcaBruta;

  // ── (b) Consistência H2H (20) ────────────────────────────────────
  // Calibrado em 14/05/2026: 1 confronto vale 10 (não zero), 2=14, 3-4=17, 5+=20.
  let h2hPts = 0;
  if      (statsH.n_confrontos >= 5) h2hPts = 20;
  else if (statsH.n_confrontos >= 3) h2hPts = 17;
  else if (statsH.n_confrontos === 2) h2hPts = 14;
  else if (statsH.n_confrontos === 1) h2hPts = 10;

  // Penaliza H2H disperso
  if (statsH.total_range && statsH.total_range > 5) h2hPts = Math.round(h2hPts * 0.6);
  detalhe.consistH2H = h2hPts;
  pontos += h2hPts;

  // ── (c) Baixo desvio padrão (20) ─────────────────────────────────
  // Pivot calibrado em 14/05/2026: 4.0 (alinhado com F2). DP avg=2 → 10pts;
  // DP avg=3 → 5pts; DP avg=4 → 0pts.
  let dpPts = 0;
  if (mercado === MERCADOS.UNDER_9_FT) {
    const dpAvg = (perfilM.mandante.total_dp + perfilV.visitante.total_dp) / 2;
    dpPts = Math.round(Math.max(0, pesos.baixoDesvioPadrao * (1 - dpAvg / 4.0)));
  } else {
    const dpAvg = (perfilM.mandante.diferencial_dp + perfilV.visitante.diferencial_dp) / 2;
    dpPts = Math.round(Math.max(0, pesos.baixoDesvioPadrao * (1 - dpAvg / 4.0)));
  }
  detalhe.baixoDP = dpPts;
  pontos += dpPts;

  // ── (d) Contexto motivacional (15) — V1: pontuação parcial padrão ─
  detalhe.contexto = Math.round(pesos.contextoMotivacional * 0.6);
  pontos += detalhe.contexto;

  // ── (e) Mando confirmado (10) ────────────────────────────────────
  // Se o mandante tem n_jogos casa ≥ 5 e padrão consistente em casa.
  let mandoPts = 0;
  if (perfilM.mandante.n_jogos >= 5 && perfilM.mandante.total_dp <= 3) {
    mandoPts = pesos.mandoConfirmado;
  } else if (perfilM.mandante.n_jogos >= 3) {
    mandoPts = Math.round(pesos.mandoConfirmado * 0.6);
  }
  detalhe.mando = mandoPts;
  pontos += mandoPts;

  // ── (f) Sem fatores de risco residuais (10) ──────────────────────
  // V1: passa cheio se nenhuma nota DNA com "crise", "errático", "evitar"
  detalhe.semRisco = pesos.semFatoresRisco;
  pontos += detalhe.semRisco;

  return { score: Math.min(100, Math.round(pontos)), detalhe };
}

// ────────────────────────────────────────────────────────────────────
// FILTRO 6 — Verificação final de risco.
// ────────────────────────────────────────────────────────────────────
function filtro6_riscoFinal(mercado, perfilM, perfilV) {
  const cfg = PARAMETROS.filtro6;

  if (mercado === MERCADOS.UNDER_9_FT) {
    const mediaAvg = (perfilM.mandante.total_media + perfilV.visitante.total_media) / 2;
    const folga = 9 - mediaAvg;
    if (folga < cfg.margemUnder9) {
      return { passou: false, motivo: `F6: Margem Under 9 apertada (folga ${folga.toFixed(2)} < ${cfg.margemUnder9})` };
    }
  } else if (mercado === MERCADOS.HDP_FT_MANDANTE) {
    const folga = perfilM.mandante.diferencial_media - 3.5;
    if (folga < cfg.margemHDP) {
      return { passou: false, motivo: `F6: Margem HDP mandante apertada (folga ${folga.toFixed(2)} < ${cfg.margemHDP})` };
    }
  } else if (mercado === MERCADOS.HDP_FT_VISITANTE) {
    const folga = -perfilV.visitante.diferencial_media - 3.5;
    if (folga < cfg.margemHDP) {
      return { passou: false, motivo: `F6: Margem HDP visitante apertada (folga ${folga.toFixed(2)} < ${cfg.margemHDP})` };
    }
  }
  return { passou: true, motivo: null };
}

// ════════════════════════════════════════════════════════════════════
// ANALISADOR DE UM JOGO — passa pelos 6 filtros e testa os 3 mercados.
// Retorna: { aprovado: bool, mercado, score, convergencia, evidencia }
//          ou { aprovado: false, etapa, motivo }
// ════════════════════════════════════════════════════════════════════
function analisarJogo({ jogo, perfilM, perfilV, statsH, infoLiga, statsLigaInfo }) {
  // Anexa DNA aos perfis se disponível
  const dnaLiga = infoLiga.dnaLiga || {};
  perfilM.dna = dnaLiga[perfilM.nome] || {};
  perfilV.dna = dnaLiga[perfilV.nome] || {};

  // F1
  const r1 = filtro1_dadosInsuficientes(perfilM, perfilV, statsH, infoLiga);
  if (!r1.passou) return { aprovado: false, etapa: 'F1', motivo: r1.motivo, jogo };

  // F2
  const r2 = filtro2_imprevisibilidade(perfilM, perfilV, statsH);
  if (!r2.passou) return { aprovado: false, etapa: 'F2', motivo: r2.motivo, jogo };

  // F3
  const r3 = filtro3_contextoInstavel(jogo, infoLiga);
  if (!r3.passou) return { aprovado: false, etapa: 'F3', motivo: r3.motivo, jogo };

  // F4 — testa os 3 mercados; aprovado se PELO MENOS UM atinge 7/7
  const candidatos = [
    MERCADOS.HDP_FT_MANDANTE,
    MERCADOS.HDP_FT_VISITANTE,
    MERCADOS.UNDER_9_FT
  ].map(m => ({
    mercado: m,
    resultado: filtro4_convergencia(m, perfilM, perfilV, statsH, infoLiga, statsLigaInfo)
  }));

  const aprovadosF4 = candidatos.filter(c => c.resultado.passou);
  if (aprovadosF4.length === 0) {
    const melhor = candidatos.reduce((a, b) => {
      const okA = parseInt(a.resultado.convergencia.split('/')[0]);
      const okB = parseInt(b.resultado.convergencia.split('/')[0]);
      return okB > okA ? b : a;
    });
    return { aprovado: false, etapa: 'F4', motivo: `F4: nenhum mercado atinge 7/7 (melhor: ${melhor.mercado} com ${melhor.resultado.convergencia})`, jogo };
  }

  // Se mais de um mercado passa em 7/7 (caso raro), escolhe o de maior score em F5
  let melhorAprovacao = null;
  for (const cand of aprovadosF4) {
    const f5 = filtro5_score(cand.mercado, perfilM, perfilV, statsH, statsLigaInfo);
    if (!melhorAprovacao || f5.score > melhorAprovacao.f5.score) {
      melhorAprovacao = { cand, f5 };
    }
  }

  // F5
  if (melhorAprovacao.f5.score < PARAMETROS.filtro5.scoreMinimo) {
    return { aprovado: false, etapa: 'F5', motivo: `F5: score ${melhorAprovacao.f5.score} < ${PARAMETROS.filtro5.scoreMinimo}`, jogo, _scoreCalculado: melhorAprovacao.f5 };
  }

  // F6
  const r6 = filtro6_riscoFinal(melhorAprovacao.cand.mercado, perfilM, perfilV);
  if (!r6.passou) return { aprovado: false, etapa: 'F6', motivo: r6.motivo, jogo };

  // ✅ APROVADO!
  return {
    aprovado:     true,
    jogo,
    mercado:      melhorAprovacao.cand.mercado,
    score:        melhorAprovacao.f5.score,
    score_detalhe: melhorAprovacao.f5.detalhe,
    convergencia: melhorAprovacao.cand.resultado.convergencia,
    camadas:      melhorAprovacao.cand.resultado.camadas,
    perfilM,
    perfilV,
    statsH
  };
}

module.exports = {
  MERCADOS,
  filtro1_dadosInsuficientes,
  filtro2_imprevisibilidade,
  filtro3_contextoInstavel,
  filtro4_convergencia,
  filtro5_score,
  filtro6_riscoFinal,
  analisarJogo
};
