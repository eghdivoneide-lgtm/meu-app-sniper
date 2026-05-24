// ════════════════════════════════════════════════════════════════════
// LOADER — Carrega dados das ligas, DNA escoteiro e memória qualitativa
// Aplica dataLimite (modo backtest) e normaliza datas heterogêneas.
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { LIGAS_ATIVAS, ARQUIVO_DNA, ARQUIVO_QUALI, DATA_DIR } = require('../config');

// ────────────────────────────────────────────────────────────────────
// Avaliação segura de arquivo `window.X = {...}` em sandbox.
// ────────────────────────────────────────────────────────────────────
function avaliarArquivoWindow(caminhoArquivo) {
  const src = fs.readFileSync(caminhoArquivo, 'utf8');
  const sandbox = { window: {} };
  // remove comentários de linha pra evitar parsing de notação relativa
  const codigo = src.replace(/^\s*\/\/.*$/gm, '');
  new Function('window', codigo)(sandbox.window);
  return sandbox.window;
}

// ────────────────────────────────────────────────────────────────────
// Normalização de datas — formatos heterogêneos no banco:
//   "2026-05-12"          (BR, BR_B, ARG, ARG_B, USL, BUN)
//   "12.05.2026 20:00"    (MLS)
// Retorna string ISO "YYYY-MM-DD" ou null se inválido.
// ────────────────────────────────────────────────────────────────────
function normalizarData(dataStr) {
  if (!dataStr || typeof dataStr !== 'string') return null;
  const s = dataStr.trim();

  // Formato ISO: 2026-05-12 ou 2026-05-12T...
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  // Formato BR: 12.05.2026 20:00
  m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  // Formato BR alternativo: 12/05/2026
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  return null;
}

// ────────────────────────────────────────────────────────────────────
// Carrega uma única liga e aplica filtro de dataLimite se houver.
// ────────────────────────────────────────────────────────────────────
function carregarLiga(ligaCfg, dataLimite) {
  const caminho = path.join(DATA_DIR, ligaCfg.arquivo);
  if (!fs.existsSync(caminho)) {
    return { codigo: ligaCfg.codigo, erro: 'arquivo nao encontrado: ' + caminho };
  }

  let win;
  try {
    win = avaliarArquivoWindow(caminho);
  } catch (e) {
    return { codigo: ligaCfg.codigo, erro: 'falha ao parsear: ' + e.message };
  }

  const dados = win[ligaCfg.varGlobal];
  if (!dados || !Array.isArray(dados.jogos)) {
    return { codigo: ligaCfg.codigo, erro: 'estrutura invalida em ' + ligaCfg.varGlobal };
  }

  // Normaliza data em cada jogo + aplica dataLimite
  const jogosNormalizados = [];
  let descartadosPorData = 0;
  let jogosSemData       = 0;

  for (const j of dados.jogos) {
    const dataNorm = normalizarData(j.data);
    if (!dataNorm) {
      jogosSemData++;
      // mantém o jogo (data ausente não é critério de exclusão por si só)
      jogosNormalizados.push({ ...j, dataNorm: null });
      continue;
    }
    if (dataLimite && dataNorm > dataLimite) {
      descartadosPorData++;
      continue; // backtest: este jogo é "futuro" para o agente
    }
    jogosNormalizados.push({ ...j, dataNorm });
  }

  return {
    codigo:              ligaCfg.codigo,
    nome:                ligaCfg.nome,
    varGlobal:           ligaCfg.varGlobal,
    dnaKey:              ligaCfg.dnaKey,
    times:               dados.times || [],
    totalRodadas:        dados.totalRodadas || null,
    ultimaAtualizacao:   dados.ultimaAtualizacao || null,
    jogos:               jogosNormalizados,
    _diagnostico: {
      jogosOriginais:        dados.jogos.length,
      jogosCarregados:       jogosNormalizados.length,
      descartadosPorData,
      jogosSemData
    }
  };
}

// ────────────────────────────────────────────────────────────────────
// Carrega DNA Escoteiro (window.DNA_ESCOTEIRO) — perfis de gols/forma.
// ────────────────────────────────────────────────────────────────────
function carregarDNA() {
  if (!fs.existsSync(ARQUIVO_DNA)) {
    return { _erro: 'dna_escoteiro.js nao encontrado em ' + ARQUIVO_DNA };
  }
  try {
    const win = avaliarArquivoWindow(ARQUIVO_DNA);
    return win.DNA_ESCOTEIRO || { _erro: 'window.DNA_ESCOTEIRO ausente' };
  } catch (e) {
    return { _erro: 'falha ao parsear DNA: ' + e.message };
  }
}

// ────────────────────────────────────────────────────────────────────
// Carrega Memória Qualitativa (window.MEMORIA_QUALITATIVA).
// Contém baseline por liga + perfis por time (xHT/xFT, volatilidade, alertas).
// ────────────────────────────────────────────────────────────────────
function carregarQualitativa() {
  if (!fs.existsSync(ARQUIVO_QUALI)) {
    return { _erro: 'memoria_qualitativa.js nao encontrado' };
  }
  try {
    const win = avaliarArquivoWindow(ARQUIVO_QUALI);
    return win.MEMORIA_QUALITATIVA || { _erro: 'window.MEMORIA_QUALITATIVA ausente' };
  } catch (e) {
    return { _erro: 'falha ao parsear quali: ' + e.message };
  }
}

// ────────────────────────────────────────────────────────────────────
// Função principal — carrega TODA a base do agente.
// Aceita modo { dataLimite: 'YYYY-MM-DD' | null }.
// ────────────────────────────────────────────────────────────────────
function carregarBase(modo = { dataLimite: null }) {
  const dataLimite = modo.dataLimite || null;

  const ligas = {};
  for (const cfg of LIGAS_ATIVAS) {
    ligas[cfg.codigo] = carregarLiga(cfg, dataLimite);
  }

  const dna         = carregarDNA();
  const qualitativa = carregarQualitativa();

  return {
    modo:        { dataLimite, nome: dataLimite ? 'BACKTEST' : 'PRODUCAO' },
    ligas,
    dna,
    qualitativa,
    geradoEm:    new Date().toISOString()
  };
}

module.exports = {
  carregarBase,
  carregarLiga,
  carregarDNA,
  carregarQualitativa,
  normalizarData
};
