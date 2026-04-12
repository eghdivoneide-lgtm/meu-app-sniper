/**
 * Qualitativas Engine v4 — Motor de Variáveis Qualitativas
 * EDS Soluções Inteligentes
 *
 * Recebe dados brutos do Analista Fantasma e calcula variáveis derivadas
 * que enriquecem a análise de cantos com inteligência contextual.
 *
 * @module qualitativas_engine
 */

// ═══════════════════════════════════════════════════
//  CLASSIFICAÇÃO DE FORMAÇÕES
// ═══════════════════════════════════════════════════
const FORMACOES_ULTRA_DEFENSIVAS = ['5-4-1', '6-3-1', '5-5-0', '6-4-0'];
const FORMACOES_DEFENSIVAS = ['5-3-2', '5-2-3', '4-5-1', '4-1-4-1', '5-2-1-2'];
const FORMACOES_EQUILIBRADAS = ['4-4-2', '4-2-3-1', '3-5-2', '4-3-2-1', '4-4-1-1', '3-4-2-1'];
const FORMACOES_OFENSIVAS = ['4-3-3', '3-4-3', '4-2-4', '3-3-4', '4-1-2-3', '3-4-1-2'];

/**
 * Classifica uma formação tática
 * @param {string} formacao - Ex: "4-2-3-1"
 * @returns {string} OFENSIVA | EQUILIBRADA | DEFENSIVA | ULTRA_DEFENSIVA | DESCONHECIDA
 */
function classificarFormacao(formacao) {
  if (!formacao || formacao === 'Desconhecida') return 'DESCONHECIDA';
  if (FORMACOES_ULTRA_DEFENSIVAS.includes(formacao)) return 'ULTRA_DEFENSIVA';
  if (FORMACOES_DEFENSIVAS.includes(formacao)) return 'DEFENSIVA';
  if (FORMACOES_OFENSIVAS.includes(formacao)) return 'OFENSIVA';
  if (FORMACOES_EQUILIBRADAS.includes(formacao)) return 'EQUILIBRADA';
  // Heurística: se começa com 5 ou 6 é defensiva
  if (formacao.startsWith('5-') || formacao.startsWith('6-')) return 'DEFENSIVA';
  return 'EQUILIBRADA';
}

/**
 * Calcula a pressão territorial (score 0-100)
 */
function calcularPressao(stats) {
  if (!stats) return 0;
  const ap = (stats.ataques_perigosos?.m || 0);
  const cantos = (stats.cantos?.m || 0);
  const chutes = (stats.chutes_alvo?.m || 0);
  const cruz = (stats.cruzamentos?.m || 0);
  const lat = (stats.laterais?.m || 0);

  const raw = (ap * 0.35) + (cantos * 3 * 0.25) + (chutes * 2 * 0.20) + (cruz * 0.10) + (lat * 0.10);
  return Math.min(100, Math.round(raw));
}

/**
 * Calcula todas as variáveis qualitativas para um jogo
 * @param {Object} jogo - Dados do jogo no schema v4
 * @returns {Object} Variáveis qualitativas calculadas
 */
function calcularQualitativas(jogo) {
  const ft = jogo.estatisticas_ft || {};
  const ht = jogo.estatisticas_ht || {};
  const t2 = jogo.estatisticas_2t || {};

  const cantosM_ft = ft.cantos?.m || 0;
  const cantosV_ft = ft.cantos?.v || 0;
  const cantosTotal = cantosM_ft + cantosV_ft;

  const cantosM_ht = ht.cantos?.m || 0;
  const cantosV_ht = ht.cantos?.v || 0;
  const cantosHT_total = cantosM_ht + cantosV_ht;

  const cantosM_2t = t2.cantos?.m || 0;
  const cantosV_2t = t2.cantos?.v || 0;
  const cantos2T_total = cantosM_2t + cantosV_2t;

  const finM = ft.finalizacoes?.m || 0;
  const finV = ft.finalizacoes?.v || 0;
  const finTotal = finM + finV;

  const apM = ft.ataques_perigosos?.m || 0;
  const apV = ft.ataques_perigosos?.v || 0;
  const apTotal = apM + apV;

  const faltasTotal = (ft.faltas?.m || 0) + (ft.faltas?.v || 0);
  const chutesTotal = (ft.chutes_alvo?.m || 0) + (ft.chutes_alvo?.v || 0);
  const cruzM = ft.cruzamentos?.m || 0;
  const cruzV = ft.cruzamentos?.v || 0;
  const latM = ft.laterais?.m || 0;
  const latV = ft.laterais?.v || 0;
  const tmM = ft.tiros_de_meta?.m || 0;
  const tmV = ft.tiros_de_meta?.v || 0;
  const defM = ft.defesas_goleiro?.m || 0;
  const defV = ft.defesas_goleiro?.v || 0;

  // Formação
  const formClasse_m = classificarFormacao(jogo.formacao?.m);
  const formClasse_v = classificarFormacao(jogo.formacao?.v);

  // Pressão territorial
  const pressaoM = calcularPressao(ft);
  const pressaoV_stats = ft ? {
    ataques_perigosos: { m: apV },
    cantos: { m: cantosV_ft },
    chutes_alvo: { m: ft.chutes_alvo?.v || 0 },
    cruzamentos: { m: cruzV },
    laterais: { m: latV }
  } : null;
  const pressaoV = calcularPressao(pressaoV_stats);

  // Ritmo de jogo
  const ritmoRaw = (apTotal + finTotal) / 90;
  const ritmo = ritmoRaw > 1.2 ? 'ALTO' : ritmoRaw < 0.6 ? 'BAIXO' : 'MEDIO';

  // Dominância de cantos
  const mandanteShare = cantosTotal > 0 ? Math.round((cantosM_ft / cantosTotal) * 100) : 50;

  // Índice de agressividade
  const agressividadeM = ((ft.chutes_alvo?.m || 0) + apM + cantosM_ft) / 90;
  const agressividadeV = ((ft.chutes_alvo?.v || 0) + apV + cantosV_ft) / 90;

  // Taxa de conversão de pressão
  const denominadorM = Math.max((ft.chutes_alvo?.m || 0) + cruzM, 1);
  const denominadorV = Math.max((ft.chutes_alvo?.v || 0) + cruzV, 1);
  const taxaConversaoM = cantosM_ft / denominadorM;
  const taxaConversaoV = cantosV_ft / denominadorV;

  // Fator muro
  const fatorMuroM = Math.max(ft.chutes_alvo?.v || 1, 1) > 0
    ? (tmM + defM) / Math.max(ft.chutes_alvo?.v || 1, 1) : 0;
  const fatorMuroV = Math.max(ft.chutes_alvo?.m || 1, 1) > 0
    ? (tmV + defV) / Math.max(ft.chutes_alvo?.m || 1, 1) : 0;

  // Momentum 2T
  const cantosAceleracao = cantosHT_total > 0 ? cantos2T_total / cantosHT_total : 1;
  const posseShift = (t2.posse?.m || ft.posse?.m || 50) - (ht.posse?.m || 50);

  // Anomalias
  const anomalias = [];
  if (formClasse_m === 'ULTRA_DEFENSIVA') anomalias.push('FORMACAO_ULTRA_DEFENSIVA_MANDANTE');
  if (formClasse_v === 'ULTRA_DEFENSIVA') anomalias.push('FORMACAO_ULTRA_DEFENSIVA_VISITANTE');
  if (formClasse_m === 'DEFENSIVA' || formClasse_v === 'DEFENSIVA') anomalias.push('FORMACAO_5ATB');

  if (ft.cartoes_vermelhos?.m > 0) anomalias.push('EXPULSAO_MANDANTE');
  if (ft.cartoes_vermelhos?.v > 0) anomalias.push('EXPULSAO_VISITANTE');

  if ((ft.posse?.m || 50) > 70 && cantosM_ft < 4) anomalias.push('POSSE_ESTERIL_MANDANTE');
  if ((ft.posse?.v || 50) > 70 && cantosV_ft < 4) anomalias.push('POSSE_ESTERIL_VISITANTE');

  if (faltasTotal > 30 && chutesTotal < 15) anomalias.push('JOGO_TRUNCADO');
  if (cantosHT_total > 0 && cantos2T_total < cantosHT_total * 0.5) anomalias.push('COLAPSO_2T');
  if (tmM + tmV > 16) anomalias.push('MURO_DEFENSIVO');
  if (latM > latV * 2) anomalias.push('DOMINIO_UNILATERAL_MANDANTE');
  if (latV > latM * 2) anomalias.push('DOMINIO_UNILATERAL_VISITANTE');

  return {
    formacao_classe_m: formClasse_m,
    formacao_classe_v: formClasse_v,
    pressao_territorial: {
      mandante: pressaoM,
      visitante: pressaoV
    },
    ritmo_jogo: ritmo,
    dominancia_cantos: {
      mandante_share: mandanteShare,
      visitante_share: 100 - mandanteShare
    },
    indice_agressividade: {
      mandante: parseFloat(agressividadeM.toFixed(3)),
      visitante: parseFloat(agressividadeV.toFixed(3))
    },
    taxa_conversao_pressao: {
      mandante: parseFloat(taxaConversaoM.toFixed(3)),
      visitante: parseFloat(taxaConversaoV.toFixed(3))
    },
    fator_muro: {
      mandante: parseFloat(fatorMuroM.toFixed(2)),
      visitante: parseFloat(fatorMuroV.toFixed(2))
    },
    momentum_2t: {
      cantos_aceleracao: parseFloat(cantosAceleracao.toFixed(2)),
      posse_shift: parseFloat(posseShift.toFixed(1))
    },
    anomalias
  };
}

/**
 * Classifica o jogo com label preditivo
 * @param {Object} qualitativas - Variáveis qualitativas calculadas
 * @param {number} cantosTotal - Total de cantos FT
 * @returns {string} OVER_FORTE | OVER_MODERADO | NEUTRO | UNDER_MODERADO | UNDER_FORTE
 */
function classificarJogo(qualitativas, cantosTotal) {
  let score = 0;

  // Formação
  if (qualitativas.formacao_classe_m === 'OFENSIVA') score += 2;
  if (qualitativas.formacao_classe_v === 'OFENSIVA') score += 2;
  if (qualitativas.formacao_classe_m === 'ULTRA_DEFENSIVA') score -= 3;
  if (qualitativas.formacao_classe_v === 'ULTRA_DEFENSIVA') score -= 3;
  if (qualitativas.formacao_classe_m === 'DEFENSIVA') score -= 1;
  if (qualitativas.formacao_classe_v === 'DEFENSIVA') score -= 1;

  // Ritmo
  if (qualitativas.ritmo_jogo === 'ALTO') score += 2;
  if (qualitativas.ritmo_jogo === 'BAIXO') score -= 2;

  // Anomalias negativas
  if (qualitativas.anomalias.includes('JOGO_TRUNCADO')) score -= 3;
  if (qualitativas.anomalias.includes('MURO_DEFENSIVO')) score -= 2;
  if (qualitativas.anomalias.includes('COLAPSO_2T')) score -= 1;
  if (qualitativas.anomalias.some(a => a.includes('POSSE_ESTERIL'))) score -= 1;

  // Momentum positivo
  if (qualitativas.momentum_2t.cantos_aceleracao > 1.5) score += 1;

  // Pressão
  if (qualitativas.pressao_territorial.mandante > 60 || qualitativas.pressao_territorial.visitante > 60) score += 1;

  if (score >= 4) return 'OVER_FORTE';
  if (score >= 2) return 'OVER_MODERADO';
  if (score <= -4) return 'UNDER_FORTE';
  if (score <= -2) return 'UNDER_MODERADO';
  return 'NEUTRO';
}

/**
 * Processa um array de jogos e retorna dados enriquecidos
 * @param {Array} jogos - Array de jogos no schema v4
 * @returns {Array} Jogos com qualitativas calculadas
 */
function processarRodada(jogos) {
  return jogos.map(jogo => {
    const qualitativas = calcularQualitativas(jogo);
    const cantosTotal = (jogo.estatisticas_ft?.cantos?.m || 0) + (jogo.estatisticas_ft?.cantos?.v || 0);
    const classificacao = classificarJogo(qualitativas, cantosTotal);

    return {
      mandante: jogo.mandante,
      visitante: jogo.visitante,
      cantos_ft_total: cantosTotal,
      classificacao,
      qualitativas
    };
  });
}

module.exports = { calcularQualitativas, classificarJogo, classificarFormacao, processarRodada };
