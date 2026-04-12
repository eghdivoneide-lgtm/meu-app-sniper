/**
 * Orquestrador EDS v4 — Cérebro Central do Analista Fantasma
 * EDS Soluções Inteligentes
 *
 * Pipeline de 5 passos:
 *  1. Carregar dados brutos da rodada
 *  2. Calcular estatísticas 2T
 *  3. Calcular variáveis qualitativas + classificar cada jogo
 *  4. Aplicar DNA cultural da liga
 *  5. Gerar outputs (memoria_viva.js + qualitativas_rodada.js + parametros)
 *
 * Uso:
 *   node orquestrador-eds.js                          (default: mls_rodada_atual.json)
 *   node orquestrador-eds.js --arquivo mls_rodada_1_2026-04-06.json
 *   node orquestrador-eds.js --liga MLS
 *
 * @module orquestrador-eds
 */
const fs = require('fs');
const path = require('path');
const { log } = require('./logger');
const { calcularQualitativas, classificarJogo, processarRodada } = require('./qualitativas_engine');
const { DNA_LIGAS, atualizarDNA } = require('./dna_ligas');
const { gerarRelatorio } = require('./gerarRelatorioRodada');

// ═══════════════════════════════════════════════════
//  CONFIGURAÇÃO
// ═══════════════════════════════════════════════════
const AUDITOR_DATA_DIR = path.join(__dirname, '../AUDITOR EDS APP/data');
const ESPECIALISTA_DADOS_DIR = path.join(__dirname, '../especialista-cantos/dados');

// Classificação de formações para Red Flags
const FORMACOES_ULTRA_DEFENSIVAS = ['5-4-1', '6-3-1', '5-5-0', '6-4-0'];
const FORMACOES_DEFENSIVAS = ['5-3-2', '5-2-3', '4-5-1', '4-1-4-1', '5-2-1-2'];

// ═══════════════════════════════════════════════════
//  FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════

/**
 * Calcula estatísticas do 2º tempo (FT - HT) para um jogo
 */
function calcular2T(jogo) {
  if (!jogo.estatisticas_ft || !jogo.estatisticas_ht) return null;

  const ft = jogo.estatisticas_ft;
  const ht = jogo.estatisticas_ht;
  const result = {};

  const numericKeys = ['cantos', 'posse', 'finalizacoes', 'chutes_alvo', 'ataques_perigosos',
                       'faltas', 'cruzamentos', 'cartoes_amarelos', 'cartoes_vermelhos',
                       'defesas_goleiro', 'tiros_de_meta', 'laterais', 'impedimentos'];

  for (const key of numericKeys) {
    if (ft[key] && ht[key]) {
      result[key] = {
        m: Math.max(0, (ft[key].m || 0) - (ht[key].m || 0)),
        v: Math.max(0, (ft[key].v || 0) - (ht[key].v || 0))
      };
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Detecta Red Flags expandidos (7 regras)
 */
function detectarRedFlags(jogo, qualitativas) {
  const flags = [];
  const ft = jogo.estatisticas_ft || {};
  const ht = jogo.estatisticas_ht || {};

  // 1. Formação Ultra Defensiva
  if (jogo.formacao) {
    if (FORMACOES_ULTRA_DEFENSIVAS.includes(jogo.formacao.m)) {
      flags.push({ tipo: 'ULTRA_DEFENSIVA', time: jogo.mandante, penalidade: -0.40, descricao: `Mandante usou ${jogo.formacao.m}` });
    }
    if (FORMACOES_ULTRA_DEFENSIVAS.includes(jogo.formacao.v)) {
      flags.push({ tipo: 'ULTRA_DEFENSIVA', time: jogo.visitante, penalidade: -0.40, descricao: `Visitante usou ${jogo.formacao.v}` });
    }
    // Formação defensiva (menos severa)
    if (FORMACOES_DEFENSIVAS.includes(jogo.formacao.m) || (jogo.formacao.m && jogo.formacao.m.startsWith('5-'))) {
      flags.push({ tipo: 'TATICA_DEFENSIVA', time: jogo.mandante, penalidade: -0.20, descricao: `Mandante usou ${jogo.formacao.m}` });
    }
    if (FORMACOES_DEFENSIVAS.includes(jogo.formacao.v) || (jogo.formacao.v && jogo.formacao.v.startsWith('5-'))) {
      flags.push({ tipo: 'TATICA_DEFENSIVA', time: jogo.visitante, penalidade: -0.20, descricao: `Visitante usou ${jogo.formacao.v}` });
    }
  }

  // 2. Cartão Vermelho
  if (ft.cartoes_vermelhos) {
    if (ft.cartoes_vermelhos.m > 0) flags.push({ tipo: 'EXPULSAO', time: jogo.mandante, penalidade: 'INVALIDAR', descricao: `${ft.cartoes_vermelhos.m} expulsão(ões) do mandante` });
    if (ft.cartoes_vermelhos.v > 0) flags.push({ tipo: 'EXPULSAO', time: jogo.visitante, penalidade: 'INVALIDAR', descricao: `${ft.cartoes_vermelhos.v} expulsão(ões) do visitante` });
  }

  // 3. Posse Estéril
  if (ft.posse && ft.cantos) {
    if (ft.posse.m > 70 && ft.cantos.m < 4) {
      flags.push({ tipo: 'POSSE_ESTERIL', time: jogo.mandante, penalidade: -0.15, descricao: `${ft.posse.m}% posse mas apenas ${ft.cantos.m} cantos` });
    }
    if (ft.posse.v > 70 && ft.cantos.v < 4) {
      flags.push({ tipo: 'POSSE_ESTERIL', time: jogo.visitante, penalidade: -0.15, descricao: `${ft.posse.v}% posse mas apenas ${ft.cantos.v} cantos` });
    }
  }

  // 4. Jogo Truncado
  const faltasTotal = (ft.faltas?.m || 0) + (ft.faltas?.v || 0);
  const chutesTotal = (ft.finalizacoes?.m || 0) + (ft.finalizacoes?.v || 0);
  if (faltasTotal > 30 && chutesTotal < 15) {
    flags.push({ tipo: 'JOGO_TRUNCADO', time: 'ambos', penalidade: -0.25, descricao: `${faltasTotal} faltas e apenas ${chutesTotal} finalizações` });
  }

  // 5. Colapso no 2T
  if (jogo.estatisticas_2t && ht.cantos) {
    const cantos2T = (jogo.estatisticas_2t.cantos?.m || 0) + (jogo.estatisticas_2t.cantos?.v || 0);
    const cantosHT = (ht.cantos.m || 0) + (ht.cantos.v || 0);
    if (cantosHT > 0 && cantos2T < cantosHT * 0.5) {
      flags.push({ tipo: 'COLAPSO_2T', time: 'ambos', penalidade: -0.10, descricao: `${cantosHT} cantos no HT vs ${cantos2T} no 2T` });
    }
  }

  // 6. Defesa Consolidada / Muro
  if (ft.tiros_de_meta) {
    const tirosTotal = (ft.tiros_de_meta.m || 0) + (ft.tiros_de_meta.v || 0);
    if (tirosTotal > 16) {
      flags.push({ tipo: 'MURO_DEFENSIVO', time: 'ambos', penalidade: -0.15, descricao: `${tirosTotal} tiros de meta totais` });
    }
  }

  // 7. Domínio Territorial Unilateral
  if (ft.laterais) {
    if (ft.laterais.m > ft.laterais.v * 2) {
      flags.push({ tipo: 'DOMINIO_UNILATERAL', time: jogo.mandante, penalidade: 0, descricao: `Laterais ${ft.laterais.m}x${ft.laterais.v}` });
    }
    if (ft.laterais.v > ft.laterais.m * 2) {
      flags.push({ tipo: 'DOMINIO_UNILATERAL', time: jogo.visitante, penalidade: 0, descricao: `Laterais ${ft.laterais.m}x${ft.laterais.v}` });
    }
  }

  return flags;
}

// ═══════════════════════════════════════════════════
//  PIPELINE PRINCIPAL
// ═══════════════════════════════════════════════════

(async () => {
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('💿 ORQUESTRADOR EDS v4 — Pipeline de Inteligência');
  console.log('══════════════════════════════════════════════════');

  // Determinar arquivo de entrada
  const args = process.argv.slice(2);
  let jsonFile = 'mls_rodada_atual.json';
  let codigoLiga = 'MLS';

  if (args.includes('--arquivo')) {
    jsonFile = args[args.indexOf('--arquivo') + 1];
  }
  if (args.includes('--liga')) {
    codigoLiga = args[args.indexOf('--liga') + 1]?.toUpperCase() || 'MLS';
  }

  let rodadaNum = '?';
  if (args.includes('--rodada')) {
    rodadaNum = args[args.indexOf('--rodada') + 1] || '?';
  }

  // Detectar liga do nome do arquivo se não especificado
  const lowerFile = jsonFile.toLowerCase();
  if (lowerFile.startsWith('br_')) codigoLiga = 'BR';
  else if (lowerFile.startsWith('arg_')) codigoLiga = 'ARG';
  else if (lowerFile.startsWith('usl_')) codigoLiga = 'USL';
  else if (lowerFile.startsWith('ecu_')) codigoLiga = 'ECU';

  // Auto-detectar número da rodada do nome do arquivo (ex: arg_rodada_2_...)
  if (rodadaNum === '?') {
    const rodMatch = lowerFile.match(/rodada[_-](\d+)/);
    if (rodMatch) rodadaNum = rodMatch[1];
  }

  const jsonPath = path.join(__dirname, jsonFile);

  // ═══ PASSO 1: Carregar dados ═══
  console.log(`\n[PASSO 1/5] Carregando dados: ${jsonFile}`);

  if (!fs.existsSync(jsonPath)) {
    log(`Arquivo '${jsonFile}' não encontrado. Rode o varredor-rodada.js primeiro.`, 'error');
    process.exit(1);
  }

  const rodada = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  log(`${rodada.length} jogos carregados (${codigoLiga})`, 'success');

  // ═══ PASSO 2: Calcular 2T ═══
  console.log(`\n[PASSO 2/5] Calculando estatísticas do 2º tempo...`);
  let count2T = 0;
  rodada.forEach(j => {
    if (!j.estatisticas_2t) {
      j.estatisticas_2t = calcular2T(j);
      if (j.estatisticas_2t) count2T++;
    }
  });
  log(`${count2T} jogos com 2T calculado`, 'success');

  // ═══ PASSO 3: Qualitativas + Red Flags ═══
  console.log(`\n[PASSO 3/5] Calculando variáveis qualitativas e Red Flags...`);
  const qualitativasRodada = [];
  let totalRedFlags = 0;

  rodada.forEach(j => {
    // Qualitativas
    const qual = calcularQualitativas(j);
    j.qualitativas = qual;

    // Classificação
    const cantosTotal = (j.estatisticas_ft?.cantos?.m || 0) + (j.estatisticas_ft?.cantos?.v || 0);
    const classificacao = classificarJogo(qual, cantosTotal);

    // Red Flags
    const redFlags = detectarRedFlags(j, qual);
    totalRedFlags += redFlags.length;

    qualitativasRodada.push({
      mandante: j.mandante,
      visitante: j.visitante,
      cantos_ft_total: cantosTotal,
      classificacao,
      qualitativas: qual,
      red_flags: redFlags
    });
  });

  log(`${qualitativasRodada.length} jogos analisados, ${totalRedFlags} red flags detectados`, 'success');

  // ═══ PASSO 4: DNA Cultural ═══
  console.log(`\n[PASSO 4/5] Atualizando DNA cultural da liga ${codigoLiga}...`);

  // Calcular média global (simplificada — usa dados da rodada atual)
  const cantosTodos = rodada
    .filter(j => j.estatisticas_ft?.cantos)
    .map(j => (j.estatisticas_ft.cantos.m || 0) + (j.estatisticas_ft.cantos.v || 0));
  const mediaGlobal = cantosTodos.length > 0
    ? cantosTodos.reduce((a, b) => a + b, 0) / cantosTodos.length : 10;

  atualizarDNA(codigoLiga, rodada, mediaGlobal);
  const dna = DNA_LIGAS[codigoLiga];
  if (dna) {
    log(`DNA ${codigoLiga}: média FT=${dna.media_cantos_ft}, fator mandante=${dna.fator_mandante}, tendência=${dna.tendencia_cantos}`, 'success');
  }

  // ═══ PASSO 5: Gerar Outputs ═══
  console.log(`\n[PASSO 5/5] Gerando outputs...`);

  // Garantir diretórios
  [AUDITOR_DATA_DIR, ESPECIALISTA_DADOS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // 5a. memoria_viva.js (para Auditor)
  const memoriaVivaContent = `window.dadosFantasma = ${JSON.stringify(rodada, null, 2)};`;
  fs.writeFileSync(path.join(AUDITOR_DATA_DIR, 'memoria_viva.js'), memoriaVivaContent);
  log('memoria_viva.js → Auditor EDS', 'success');

  // 5b. qualitativas_rodada.js (para Especialista)
  const qualContent = `window.qualitativasFantasma = ${JSON.stringify(qualitativasRodada, null, 2)};`;
  fs.writeFileSync(path.join(AUDITOR_DATA_DIR, 'qualitativas_rodada.js'), qualContent);
  log('qualitativas_rodada.js → Auditor EDS', 'success');

  // 5c. dna_ligas.js exportável (para Especialista)
  const dnaContent = `window.DNA_LIGAS = ${JSON.stringify(DNA_LIGAS, null, 2)};`;
  fs.writeFileSync(path.join(AUDITOR_DATA_DIR, 'dna_ligas.js'), dnaContent);
  log('dna_ligas.js → Auditor EDS', 'success');

  // 5d. Atualizar parametros_heuristica.json
  const memoriaTmiPath = path.join(ESPECIALISTA_DADOS_DIR, 'parametros_heuristica.json');
  let baseConhecimento = { versoes_treino: 0, penalidades_ativas: [], historico_acuracia: [] };

  if (fs.existsSync(memoriaTmiPath)) {
    try {
      baseConhecimento = JSON.parse(fs.readFileSync(memoriaTmiPath, 'utf8'));
      if (!baseConhecimento.historico_acuracia) baseConhecimento.historico_acuracia = [];
    } catch (e) { /* recria */ }
  }

  baseConhecimento.versoes_treino += 1;

  // Injetar Red Flags únicos
  qualitativasRodada.forEach(q => {
    q.red_flags.forEach(rf => {
      const exists = baseConhecimento.penalidades_ativas.find(p =>
        p.tipo === rf.tipo && p.time === rf.time
      );
      if (!exists) {
        baseConhecimento.penalidades_ativas.push({
          tipo: rf.tipo,
          time: rf.time,
          penalidade: rf.penalidade,
          liga: codigoLiga,
          data: new Date().toISOString().split('T')[0]
        });
      }
    });
  });

  fs.writeFileSync(memoriaTmiPath, JSON.stringify(baseConhecimento, null, 2));
  log(`Parâmetros heurística v${baseConhecimento.versoes_treino} (${baseConhecimento.penalidades_ativas.length} penalidades)`, 'success');

  // ═══ PASSO 6: Gerar Relatório Visual ═══
  console.log(`\n[PASSO 6/6] Gerando relatório visual para auditoria...`);
  let relatorioPath = null;
  try {
    relatorioPath = gerarRelatorio(rodada, qualitativasRodada, dna, codigoLiga, rodadaNum);
    log(`Relatório salvo: ${path.basename(relatorioPath)}`, 'success');
  } catch (e) {
    log(`Erro ao gerar relatório: ${e.message}`, 'error');
  }

  // ═══ SUMÁRIO FINAL ═══
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 ORQUESTRAÇÃO v4 COMPLETA');
  console.log('══════════════════════════════════════════════════');
  console.log(`  Liga:           ${dna?.nome || codigoLiga}`);
  console.log(`  Jogos:          ${rodada.length}`);
  console.log(`  Red Flags:      ${totalRedFlags}`);
  console.log(`  DNA Cantos FT:  ${dna?.media_cantos_ft || '?'}`);
  console.log(`  Fator Casa:     ${dna?.fator_mandante || '?'}`);
  console.log(`  Tendência:      ${dna?.tendencia_cantos || '?'}`);
  console.log(`  Versão treino:  v${baseConhecimento.versoes_treino}`);
  console.log('');
  console.log('  OUTPUTS GERADOS:');
  console.log('    ✅ AUDITOR EDS APP/data/memoria_viva.js');
  console.log('    ✅ AUDITOR EDS APP/data/qualitativas_rodada.js');
  console.log('    ✅ AUDITOR EDS APP/data/dna_ligas.js');
  console.log('    ✅ especialista-cantos/dados/parametros_heuristica.json');
  if (relatorioPath) {
    console.log(`    ✅ ${path.relative(path.join(__dirname, '..'), relatorioPath)}`);
  }

  // Classificações
  const labels = {};
  qualitativasRodada.forEach(q => { labels[q.classificacao] = (labels[q.classificacao] || 0) + 1; });
  console.log('');
  console.log('  CLASSIFICAÇÃO DOS JOGOS:');
  Object.entries(labels).sort((a, b) => b[1] - a[1]).forEach(([label, count]) => {
    const emoji = label.includes('OVER') ? '🔥' : label.includes('UNDER') ? '❄️' : '⚖️';
    console.log(`    ${emoji} ${label}: ${count} jogos`);
  });

  console.log('══════════════════════════════════════════════════');
})();
