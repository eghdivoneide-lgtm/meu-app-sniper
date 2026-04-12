/**
 * Classificador Pós-Jogo v4 — Sistema de Aprendizado
 * EDS Soluções Inteligentes
 *
 * Compara projeções vs resultados reais e classifica:
 * ACERTO | ERRO_MODELO | VARIANCIA
 *
 * @module classificador_pos_jogo
 */
const fs = require('fs');
const path = require('path');
const { log } = require('./logger');
const { DNA_LIGAS, atualizarDNA } = require('./dna_ligas');

/**
 * Classifica o resultado de uma projeção
 * @param {Object} projecao - { prob_over_9_5, exp_cantos_ft, confianca }
 * @param {Object} resultado - { cantos_ft }
 * @param {Object} qualitativas - Variáveis qualitativas do jogo
 * @returns {Object} { tipo, causa?, nota?, confianca? }
 */
function classificarResultado(projecao, resultado, qualitativas) {
  const projetouOver = projecao.prob_over_9_5 >= 55;
  const foiOver = resultado.cantos_ft > 9;

  // ACERTOU
  if (projetouOver === foiOver) {
    return { tipo: 'ACERTO', confianca: projecao.confianca };
  }

  // ERROU — diagnosticar causa
  const anomalias = qualitativas?.anomalias || [];
  const desvio = Math.abs(projecao.exp_cantos_ft - resultado.cantos_ft);

  if (projetouOver && !foiOver) {
    // Projetou Over mas veio Under
    if (anomalias.some(a => a.includes('ULTRA_DEFENSIVA'))) {
      return { tipo: 'ERRO_MODELO', causa: 'Formação ultra-defensiva não penalizada suficientemente' };
    }
    if (anomalias.some(a => a.includes('EXPULSAO'))) {
      return { tipo: 'ERRO_MODELO', causa: 'Expulsão mudou dinâmica do jogo' };
    }
    if (anomalias.includes('JOGO_TRUNCADO')) {
      return { tipo: 'ERRO_MODELO', causa: 'Jogo truncado (muitas faltas, ritmo cortado)' };
    }
    if (anomalias.some(a => a.includes('POSSE_ESTERIL'))) {
      return { tipo: 'ERRO_MODELO', causa: 'Time dominante não converteu posse em pressão' };
    }
    if (anomalias.includes('MURO_DEFENSIVO')) {
      return { tipo: 'ERRO_MODELO', causa: 'Adversário bloqueou todas as tentativas' };
    }
    if (desvio > 4) {
      return { tipo: 'VARIANCIA', nota: `Resultado outlier — desvio de ${desvio.toFixed(1)} cantos da projeção` };
    }
    return { tipo: 'VARIANCIA', nota: 'Resultado abaixo da projeção sem causa identificável' };
  }

  if (!projetouOver && foiOver) {
    // Projetou Under mas veio Over
    if (qualitativas?.ritmo_jogo === 'ALTO') {
      return { tipo: 'ERRO_MODELO', causa: 'Ritmo alto do jogo não capturado pelo modelo' };
    }
    if (qualitativas?.momentum_2t?.cantos_aceleracao > 2) {
      return { tipo: 'ERRO_MODELO', causa: 'Explosão de cantos no 2T não prevista' };
    }
    if (desvio > 4) {
      return { tipo: 'VARIANCIA', nota: `Resultado outlier acima — desvio de +${desvio.toFixed(1)} cantos` };
    }
    return { tipo: 'VARIANCIA', nota: 'Jogo acima do esperado sem causa identificável' };
  }

  return { tipo: 'VARIANCIA', nota: 'Resultado dentro da margem de incerteza' };
}

/**
 * Gera relatório completo pós-rodada
 * @param {string} codigoLiga - Código da liga
 * @param {number} rodada - Número da rodada
 * @param {Array} jogos - Array com { mandante, visitante, projecao, resultado, qualitativas }
 * @returns {string} Relatório formatado para console
 */
function gerarRelatorio(codigoLiga, rodada, jogos) {
  const liga = DNA_LIGAS[codigoLiga];
  const nomeLiga = liga ? liga.nome : codigoLiga;

  let acertos = 0, errosModelo = 0, variancia = 0;
  const errosDetalhados = [];
  const varianciaDetalhados = [];
  const aprendizados = [];

  jogos.forEach(jogo => {
    const resultado = classificarResultado(jogo.projecao, jogo.resultado, jogo.qualitativas);

    switch (resultado.tipo) {
      case 'ACERTO':
        acertos++;
        break;
      case 'ERRO_MODELO':
        errosModelo++;
        errosDetalhados.push({
          jogo: `${jogo.mandante} vs ${jogo.visitante}`,
          placar: jogo.resultado.placar || '?',
          projecao: `${jogo.projecao.prob_over_9_5}% Over 9.5`,
          real: `${jogo.resultado.cantos_ft} cantos`,
          causa: resultado.causa
        });
        break;
      case 'VARIANCIA':
        variancia++;
        varianciaDetalhados.push({
          jogo: `${jogo.mandante} vs ${jogo.visitante}`,
          projecao: `${jogo.projecao.exp_cantos_ft?.toFixed(1)} exp`,
          real: `${jogo.resultado.cantos_ft} cantos`,
          nota: resultado.nota
        });
        break;
    }
  });

  const total = jogos.length;
  const acuraciaRodada = total > 0 ? ((acertos / total) * 100).toFixed(1) : 0;

  let report = '';
  report += '\n═══════════════════════════════════════════════════════\n';
  report += `📊 RELATÓRIO PÓS-RODADA — ${nomeLiga} Rodada ${rodada}\n`;
  report += '═══════════════════════════════════════════════════════\n\n';
  report += `ACURÁCIA DA RODADA:  ${acuraciaRodada}% (${acertos}/${total} jogos)\n\n`;
  report += `DISTRIBUIÇÃO:\n`;
  report += `  ✅ ACERTOS:           ${acertos} jogos (${total > 0 ? ((acertos / total) * 100).toFixed(1) : 0}%)\n`;
  report += `  ❌ ERROS DE MODELO:   ${errosModelo} jogos (${total > 0 ? ((errosModelo / total) * 100).toFixed(1) : 0}%)\n`;
  report += `  🎲 VARIÂNCIA:         ${variancia} jogos (${total > 0 ? ((variancia / total) * 100).toFixed(1) : 0}%)\n`;

  if (errosDetalhados.length > 0) {
    report += '\nERROS DE MODELO (para aprendizado):\n';
    errosDetalhados.forEach(e => {
      report += `  • ${e.jogo} | Projetou ${e.projecao} → Real: ${e.real}\n`;
      report += `    CAUSA: ${e.causa}\n`;
    });
  }

  if (varianciaDetalhados.length > 0) {
    report += '\nVARIÂNCIA (sem ação corretiva):\n';
    varianciaDetalhados.forEach(v => {
      report += `  • ${v.jogo} | Projetou ${v.projecao} → Real: ${v.real}\n`;
      report += `    NOTA: ${v.nota}\n`;
    });
  }

  report += '\n═══════════════════════════════════════════════════════\n';

  return report;
}

/**
 * Aplica aprendizados ao DNA da liga e parâmetros de heurística
 * @param {string} codigoLiga - Código da liga
 * @param {Array} jogos - Jogos classificados
 */
function aplicarAprendizados(codigoLiga, jogos) {
  const parametrosPath = path.join(__dirname, '../especialista-cantos/dados/parametros_heuristica.json');

  let params = { versoes_treino: 0, penalidades_ativas: [], historico_acuracia: [] };
  if (fs.existsSync(parametrosPath)) {
    try {
      params = JSON.parse(fs.readFileSync(parametrosPath, 'utf8'));
      if (!params.historico_acuracia) params.historico_acuracia = [];
    } catch (e) { /* arquivo corrompido, recria */ }
  }

  params.versoes_treino += 1;

  // Registrar acurácia
  const total = jogos.length;
  const acertos = jogos.filter(j => {
    const r = classificarResultado(j.projecao, j.resultado, j.qualitativas);
    return r.tipo === 'ACERTO';
  }).length;

  params.historico_acuracia.push({
    liga: codigoLiga,
    rodada: jogos[0]?.resultado?.rodada || '?',
    data: new Date().toISOString().split('T')[0],
    acuracia: total > 0 ? parseFloat(((acertos / total) * 100).toFixed(1)) : 0,
    total,
    acertos
  });

  // Manter últimas 50 entradas
  if (params.historico_acuracia.length > 50) {
    params.historico_acuracia = params.historico_acuracia.slice(-50);
  }

  // Adicionar penalidades de erros de modelo
  jogos.forEach(j => {
    const r = classificarResultado(j.projecao, j.resultado, j.qualitativas);
    if (r.tipo === 'ERRO_MODELO') {
      const penalty = {
        tipo: r.causa,
        liga: codigoLiga,
        jogo: `${j.mandante} vs ${j.visitante}`,
        data: new Date().toISOString().split('T')[0]
      };
      // Não duplicar
      const exists = params.penalidades_ativas.find(p =>
        p.tipo === penalty.tipo && p.liga === penalty.liga
      );
      if (!exists) params.penalidades_ativas.push(penalty);
    }
  });

  const dir = path.dirname(parametrosPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(parametrosPath, JSON.stringify(params, null, 2));

  log(`Parâmetros atualizados (v${params.versoes_treino})`, 'success');
}

module.exports = { classificarResultado, gerarRelatorio, aplicarAprendizados };
