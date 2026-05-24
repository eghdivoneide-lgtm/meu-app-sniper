// ════════════════════════════════════════════════════════════════════
// AGENTE — Orquestrador do Auditor Supremo (modelo probabilístico v2)
//
// Para cada jogo da rodada, calcula probabilidade contínua de cada
// mercado. Ranqueia GLOBALMENTE: top-10 HDP (melhor entre mandante/
// visitante) + top-10 Under 9 = até 20 entradas.
//
// F1 e F2 viram SANIDADE (descarta jogos sem dados ou erráticos
// extremos), não cortes em cascata.
// ════════════════════════════════════════════════════════════════════

const { perfilTimeCompleto, statsH2H, statsLiga } = require('./stats');
const { analisarJogoInteligente }                 = require('./inteligencia');
const { filtro1_dadosInsuficientes, filtro2_imprevisibilidade, MERCADOS } = require('./filtros');
const { PARAMETROS }                              = require('../config');
const { normalizarTime }                          = require('./aliases');

// ────────────────────────────────────────────────────────────────────
function computarPerfisLiga(jogosLiga, dnaLiga) {
  const cache = {};
  const timesUnicos = new Set();
  jogosLiga.forEach(j => { timesUnicos.add(j.mandante); timesUnicos.add(j.visitante); });
  for (const t of timesUnicos) cache[t] = perfilTimeCompleto(jogosLiga, t);
  return cache;
}

function maxRodada(jogos) {
  return jogos.reduce((mx, j) => (typeof j.rodada === 'number' && j.rodada > mx) ? j.rodada : mx, 0);
}

// ────────────────────────────────────────────────────────────────────
// Auditor principal — modelo probabilístico
// ────────────────────────────────────────────────────────────────────
function executarAuditor({ base, jogosParaAnalisar, configSelecao = null }) {
  const inicioMs = Date.now();
  const cfg = configSelecao || PARAMETROS.selecao;

  // Pré-computa perfis e baseline por liga
  const cacheLiga = {};
  for (const codigo of Object.keys(base.ligas)) {
    const L = base.ligas[codigo];
    if (L.erro) continue;
    cacheLiga[codigo] = {
      perfis:    computarPerfisLiga(L.jogos, base.dna[L.dnaKey] || {}),
      statsLiga: statsLiga(L.jogos),
      info: {
        codigo,
        nome:                L.nome,
        totalRodadas:        L.totalRodadas,
        ultimaAtualizacao:   L.ultimaAtualizacao,
        maxRodadaRegistrada: maxRodada(L.jogos),
        dnaLiga:             base.dna[L.dnaKey] || {}
      }
    };
  }

  // Estatísticas
  const eliminadosPor = { F1: 0, F2: 0, sem_dados: 0 };
  const analisados    = [];   // todos jogos com prob calculada

  for (const jOrig of jogosParaAnalisar) {
    const cache = cacheLiga[jOrig.liga];
    if (!cache) {
      eliminadosPor.sem_dados++;
      continue;
    }

    // Normaliza nomes via aliases
    const tBanco = base.ligas[jOrig.liga].times;
    const j = {
      ...jOrig,
      mandante:  normalizarTime(jOrig.mandante,  jOrig.liga, tBanco),
      visitante: normalizarTime(jOrig.visitante, jOrig.liga, tBanco)
    };

    const perfilM = cache.perfis[j.mandante];
    const perfilV = cache.perfis[j.visitante];
    if (!perfilM || !perfilV) {
      eliminadosPor.sem_dados++;
      continue;
    }

    const sH = statsH2H(base.ligas[j.liga].jogos, j.mandante, j.visitante);

    // Sanidade mínima — F1: precisa ter dados (apenas elimina caso DRÁSTICO)
    const f1 = filtro1_dadosInsuficientes(perfilM, perfilV, sH, cache.info);
    if (!f1.passou) { eliminadosPor.F1++; continue; }

    // Sanidade — F2: descarta erráticos extremos
    const f2 = filtro2_imprevisibilidade(perfilM, perfilV, sH);
    if (!f2.passou) { eliminadosPor.F2++; continue; }

    // Análise inteligente (probabilidade contínua para os 3 mercados)
    const analise = analisarJogoInteligente({
      jogo: j,
      perfilM: { ...perfilM },
      perfilV: { ...perfilV },
      statsH: sH,
      statsLigaInfo: cache.statsLiga,
      infoLiga: cache.info
    });

    analisados.push(analise);
  }

  // ── Ranking GLOBAL ────────────────────────────────────────────────
  // Para cada jogo, escolhe o "melhor HDP" entre mandante/visitante.
  // Top-10 HDP + Top-10 Under = lista final.
  const candidatosHDP = analisados.map(a => {
    const hdpM = a.mercados[MERCADOS.HDP_FT_MANDANTE];
    const hdpV = a.mercados[MERCADOS.HDP_FT_VISITANTE];
    const melhorMercado = hdpM.prob >= hdpV.prob ? MERCADOS.HDP_FT_MANDANTE : MERCADOS.HDP_FT_VISITANTE;
    const melhorObj     = hdpM.prob >= hdpV.prob ? hdpM : hdpV;
    return { analise: a, mercado: melhorMercado, prob: melhorObj.prob, evidencias: melhorObj.evidencias };
  }).sort((a, b) => b.prob - a.prob);

  const candidatosUnder = analisados.map(a => {
    const u = a.mercados[MERCADOS.UNDER_9_FT];
    return { analise: a, mercado: MERCADOS.UNDER_9_FT, prob: u.prob, evidencias: u.evidencias };
  }).sort((a, b) => b.prob - a.prob);

  // Aplica diversificação por liga em cada mercado
  function selecionarTopComCapPorLiga(candidatos, max, capPorLiga) {
    const out = [];
    const contagem = {};
    for (const c of candidatos) {
      const liga = c.analise.jogo.liga;
      contagem[liga] = contagem[liga] || 0;
      if (contagem[liga] >= capPorLiga) continue;
      if (out.length >= max) break;
      contagem[liga]++;
      out.push(c);
    }
    return out;
  }

  const topHDP   = selecionarTopComCapPorLiga(candidatosHDP,   10, cfg.maxJogosPorLiga || 4);
  const topUnder = selecionarTopComCapPorLiga(candidatosUnder, 10, cfg.maxJogosPorLiga || 4);

  // Lista final = topHDP + topUnder, dedup se mesmo jogo apareceu em 2 mercados
  const listaFinal = [];
  const visto = new Set();
  for (const c of [...topHDP, ...topUnder]) {
    const k = c.analise.jogo.liga + '|' + c.analise.jogo.mandante + '|' + c.analise.jogo.visitante + '|' + c.mercado;
    if (visto.has(k)) continue;
    visto.add(k);
    listaFinal.push(c);
  }

  return {
    modo:               base.modo,
    geradoEm:           new Date().toISOString(),
    duracaoMs:          Date.now() - inicioMs,
    totalAnalisados:    jogosParaAnalisar.length,
    eliminadosPor,
    aprovadosBrutos:    analisados.length,
    listaFinal,
    cacheLiga
  };
}

// ────────────────────────────────────────────────────────────────────
// FORMATADOR DE RELATÓRIO
// ────────────────────────────────────────────────────────────────────
function formatarMercado(mercado, mandante, visitante) {
  if (mercado === MERCADOS.HDP_FT_MANDANTE)  return `HDP FT — ${mandante} -3.5 cantos`;
  if (mercado === MERCADOS.HDP_FT_VISITANTE) return `HDP FT — ${visitante} -3.5 cantos`;
  if (mercado === MERCADOS.UNDER_9_FT)       return `Under 9 Cantos FT`;
  return mercado;
}

function formatarRelatorio(resultado) {
  const linhas = [];
  const sep    = '═'.repeat(70);
  linhas.push(sep);
  linhas.push('  AUDITOR SUPREMO DE CANTOS — EDS Soluções Inteligentes');
  linhas.push('  ' + (resultado.modo.dataLimite ? `BACKTEST (dataLimite ${resultado.modo.dataLimite})` : 'PRODUÇÃO'));
  linhas.push('  Gerado em ' + resultado.geradoEm + ' (' + resultado.duracaoMs + 'ms)');
  linhas.push(sep);
  linhas.push('');

  if (resultado.listaFinal.length === 0) {
    linhas.push('⚠️ Nenhum candidato sobreviveu à sanidade (F1/F2). Verifique a base.');
  } else {
    for (let i = 0; i < resultado.listaFinal.length; i++) {
      const c = resultado.listaFinal[i];
      const a = c.analise;
      linhas.push(sep);
      linhas.push(`ENTRADA ${i+1} — Probabilidade ${c.prob}/100`);
      linhas.push(sep);
      linhas.push(`Liga: ${a.jogo.liga} | Rodada ${a.jogo.rodada || '?'}`);
      linhas.push(`Partida: ${a.jogo.mandante} (casa) vs ${a.jogo.visitante} (fora)`);
      linhas.push(`Mercado: ${formatarMercado(c.mercado, a.jogo.mandante, a.jogo.visitante)}`);
      linhas.push('');
      linhas.push('🔍 TOP 5 EVIDÊNCIAS QUE SUSTENTAM ESTA ENTRADA:');
      for (let k = 0; k < Math.min(5, c.evidencias.length); k++) {
        const e = c.evidencias[k];
        const barra = '█'.repeat(Math.round(e.score / 10)) + '░'.repeat(10 - Math.round(e.score / 10));
        linhas.push(`  ${barra}  ${e.score}/100 (peso ${e.peso})  ${e.nome}`);
        linhas.push(`              └ ${e.detalhe}`);
      }
      linhas.push('');
    }
  }

  // Sumário
  linhas.push(sep);
  linhas.push('SUMÁRIO');
  linhas.push(sep);
  linhas.push(`Total analisados: ${resultado.totalAnalisados}`);
  linhas.push(`Eliminados por sanidade F1 (dados): ${resultado.eliminadosPor.F1 || 0}`);
  linhas.push(`Eliminados por sanidade F2 (DP extremo): ${resultado.eliminadosPor.F2 || 0}`);
  linhas.push(`Eliminados por dados ausentes: ${resultado.eliminadosPor.sem_dados || 0}`);
  linhas.push(`Aprovados (com prob calculada): ${resultado.aprovadosBrutos}`);
  linhas.push(`Lista final: ${resultado.listaFinal.length}`);

  if (resultado.listaFinal.length > 0) {
    const distMercado = {}, distLiga = {};
    let probSum = 0, probMin = 100, probMax = 0;
    for (const c of resultado.listaFinal) {
      distMercado[c.mercado] = (distMercado[c.mercado] || 0) + 1;
      distLiga[c.analise.jogo.liga] = (distLiga[c.analise.jogo.liga] || 0) + 1;
      probSum += c.prob;
      if (c.prob < probMin) probMin = c.prob;
      if (c.prob > probMax) probMax = c.prob;
    }
    linhas.push('');
    linhas.push('Distribuição por mercado:');
    for (const m of Object.keys(distMercado)) linhas.push(`  ${m}: ${distMercado[m]}`);
    linhas.push('Distribuição por liga:');
    for (const l of Object.keys(distLiga)) linhas.push(`  ${l}: ${distLiga[l]}`);
    linhas.push('');
    linhas.push(`Probabilidade média: ${(probSum / resultado.listaFinal.length).toFixed(1)} | min: ${probMin} | max: ${probMax}`);
  }
  linhas.push(sep);
  return linhas.join('\n');
}

module.exports = {
  executarAuditor,
  formatarRelatorio,
  computarPerfisLiga,
  maxRodada
};
