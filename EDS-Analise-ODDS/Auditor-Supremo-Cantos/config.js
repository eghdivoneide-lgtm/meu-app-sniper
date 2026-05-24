// ════════════════════════════════════════════════════════════════════
// AUDITOR SUPREMO DE CANTOS — EDS Soluções Inteligentes
// config.js — Paths, ligas ativas e parâmetros invioláveis do agente
// ════════════════════════════════════════════════════════════════════

const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'especialista-cantos', 'data');

// ────────────────────────────────────────────────────────────────────
// LIGAS ATIVAS V1 — 7 ligas (definidas com o operador em 14/05/2026)
// CHN_L1, CHN_SUP, J1 entram a partir da v2 (após coleta semanal)
// ────────────────────────────────────────────────────────────────────
const LIGAS_ATIVAS = [
  { codigo: 'BR',    nome: 'Brasileirão Série A',   arquivo: 'brasileirao2026.js',  varGlobal: 'DADOS_BR',    dnaKey: 'BR'    },
  { codigo: 'BR_B',  nome: 'Brasileirão Série B',   arquivo: 'brasileiraoB2026.js', varGlobal: 'DADOS_BR_B',  dnaKey: 'BR_B'  },
  { codigo: 'MLS',   nome: 'MLS (EUA/Canadá)',      arquivo: 'mls2026.js',          varGlobal: 'DADOS_MLS',   dnaKey: 'MLS'   },
  { codigo: 'USL',   nome: 'USL Championship',      arquivo: 'usl2026.js',          varGlobal: 'DADOS_USL',   dnaKey: 'USL'   },
  { codigo: 'ARG',   nome: 'Argentina Pro',         arquivo: 'argentina2026.js',    varGlobal: 'DADOS_ARG',   dnaKey: 'ARG'   },
  { codigo: 'ARG_B', nome: 'Argentina Nacional B',  arquivo: 'argentina_b2026.js',  varGlobal: 'DADOS_ARG_B', dnaKey: 'ARG_B' },
  { codigo: 'BUN',   nome: 'Bundesliga',            arquivo: 'bundesliga2026.js',   varGlobal: 'DADOS_BUN',   dnaKey: 'BUN'   },
  { codigo: 'J2J3',  nome: 'J2/J3 League (Japão)',  arquivo: 'j2j3league2026.js',   varGlobal: 'DADOS_J2_J3', dnaKey: 'J2_J3' }
];

const ARQUIVO_DNA       = path.join(DATA_DIR, 'dna_escoteiro.js');
const ARQUIVO_QUALI     = path.join(DATA_DIR, 'memoria_qualitativa.js');

// ────────────────────────────────────────────────────────────────────
// PARÂMETROS INVIOLÁVEIS (Spec Auditor Supremo, seções 4-6)
// Mudar qualquer um destes = quebrar o Padrão EDS.
// ────────────────────────────────────────────────────────────────────
const PARAMETROS = {

  // ── FILTRO 1: Eliminação por dados insuficientes ────────────────
  filtro1: {
    minJogosPorTime:     7,   // calibrado 10→7 em 14/05/2026 (BR_B/USL têm média 7 j/time)
    minJogosCasaOuFora:  3,   // novo: pelo menos 3 jogos como mandante E 3 como visitante (mando-aware mínimo)
    minH2HConfrontos:    0,   // calibrado 1→0 em 16/05/2026 — pares sem H2H entram (motor probabilístico já dá score neutro quando H2H=0). Necessário para rodadas iniciais de temporada onde clássicos ainda não aconteceram.
    minRodadasLiga:      5    // R1.C — liga precisa ter 5+ rodadas registradas
  },

  // ── FILTRO 2: Eliminação por imprevisibilidade ──────────────────
  filtro2: {
    maxDPCantosTotaisTime:    4.0,   // calibrado 3.5→4.0 em 14/05/2026 (mediana empírica)
    maxDPDiferencialTime:     4.0,   // calibrado 3.5→4.0 (dif varia mais naturalmente)
    maxRangeH2HCantosTotais: 8,      // calibrado 7→8 (H2H curto naturalmente disperso)
  },

  // ── FILTRO 3: Eliminação por contexto instável ──────────────────
  // Em V1, troca-de-técnico e desfalques estão DESATIVADOS (sem dado).
  // Compensação via peso extra em DP no Filtro 5.
  filtro3: {
    eliminarTrocaTecnico:  false,    // 🔴 V1: sem dado externo
    eliminarDesfalques:    false,    // 🔴 V1: sem dado externo
    eliminarSemMotivacao:  true,     // 🟡 derivável da tabela calculada
    eliminarMataMata:      true      // 🟡 derivável de rodada/totalRodadas
  },

  // ── FILTRO 4: Convergência ≥ 6/7 ────────────────────────────────
  filtro4: {
    camadasObrigatorias: 6   // calibrado 7→6 em 14/05/2026 baseado no
                             // diagnóstico empírico: 7/7 é inalcançável
                             // com base atual (1.5 temporadas). 6/7 representa
                             // "convergência forte" — pelo menos 1 camada
                             // discordante mas as outras 6 confirmam.
  },

  // ── FILTRO 5: Score 0-100 ───────────────────────────────────────
  filtro5: {
    scoreMinimo: 60,                 // calibrado 85→60 em 14/05/2026 baseado em score real
                                     // observado (jogo Argentinos Jrs vs Lanus, 7/7, score 61).
                                     // Sólido ≥60; excepcional ≥75; lendário ≥85.
    pesos: {
      forcaBrutaNumeros:     25,   // média gritante, não marginal
      consistenciaH2H:       20,   // padrão se repete sem exceção
      baixoDesvioPadrao:     20,   // previsibilidade máxima dos dois times
      contextoMotivacional:  15,   // alinhado e forte
      mandoConfirmado:       10,   // dados reais em casa do mandante
      semFatoresRisco:       10    // zero pontos de incerteza
    }
  },

  // ── FILTRO 6: Verificação final de risco ────────────────────────
  filtro6: {
    margemHDP:     0.3,   // calibrado 0.5→0.3 (alinhado com C1: dif ≥ 3.8 já passa)
    margemUnder9:  0.5    // calibrado 1.5→0.5 (alinhado com C1/C2: total média ≤ 8.5)
  },

  // ── REGRAS DE MERCADO (Spec seção 2) ────────────────────────────
  mercados: {
    HDP_FT: {
      handicap: 3.5,
      diferencialMinimoMedia: 4.0,   // com margem confortável de R8
      descricao: 'Vantagem de +3.5 cantos para o time dominante no FT'
    },
    UNDER_9_FT: {
      linha: 9,
      mediaMaximaTotal: 7.5,         // com margem confortável de R8
      descricao: 'Total de cantos ≤ 8 no FT (estritamente < 9)'
    }
  },

  // ── SELEÇÃO FINAL DA LISTA ──────────────────────────────────────
  selecao: {
    maxJogosPorLiga:      4,    // diversificação obrigatória (ajustado 5→4 com lista 15)
    listaMaxima:         15,    // calibrado 20→15 em 14/05/2026 (meta operacional real)
    nuncaInflarLista:     true  // se passarem 8, entrega 8. NUNCA forçado.
  }
};

// ────────────────────────────────────────────────────────────────────
// MODO DE EXECUÇÃO — produção vs backtest cego
// ────────────────────────────────────────────────────────────────────
const MODOS = {
  PRODUCAO: {
    nome: 'PRODUCAO',
    dataLimite: null  // usa toda a base disponível
  },
  BACKTEST_F3: {
    nome: 'BACKTEST_F3',
    dataLimite: '2026-05-08'  // congela base em 05/05 (antes da rodada 11-12/05)
  }
};

module.exports = {
  ROOT,
  DATA_DIR,
  LIGAS_ATIVAS,
  ARQUIVO_DNA,
  ARQUIVO_QUALI,
  PARAMETROS,
  MODOS
};
