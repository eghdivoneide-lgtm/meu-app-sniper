// ════════════════════════════════════════════════════════════════════
// ANALISTA SENIOR EDS — POC Aba 1 (Auditoria do Motor)
//
// Re-emite sinais do motor Auditor-Supremo nas últimas 5 rodadas
// e mede GREEN%/RED% por (liga × mercado). Liga reprovada se
// taxa < 50% OU n < 30. Critério travado com o Mestre em 23-mai-2026.
//
// Zero modificação no motor original. Reusa engines via require.
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const AUDITOR = path.resolve(__dirname, '..', '..', 'Auditor-Supremo-Cantos');
const { carregarBase }                                           = require(path.join(AUDITOR, 'engine', 'loader'));
const { carregarCerebro }                                        = require(path.join(AUDITOR, 'engine', 'cerebro'));
const { statsH2H, statsLiga }                                    = require(path.join(AUDITOR, 'engine', 'stats'));
const { analisarJogoInteligente }                                = require(path.join(AUDITOR, 'engine', 'inteligencia'));
const { filtro1_dadosInsuficientes, filtro2_imprevisibilidade,
        MERCADOS }                                               = require(path.join(AUDITOR, 'engine', 'filtros'));
const { computarPerfisLiga, maxRodada }                          = require(path.join(AUDITOR, 'engine', 'agente'));
const { normalizarTime }                                         = require(path.join(AUDITOR, 'engine', 'aliases'));

const REPO           = path.resolve(__dirname, '..', '..');
const PASTA_REFINADA = path.join(REPO, 'Analise-Refinada');
const PASTA_FANTASMA = path.join(REPO, 'projeto-fantasma', 'rodadas');

const THRESHOLD_TOP = 60;    // top pick (mesmo que backtest_retroativo original)
const CORTE_TAXA    = 50;    // taxa < 50% = reprovado
const CORTE_AMOSTRA = 30;    // n < 30 = reprovado (R5 + R8)

// Janela ampliada para 10 rodadas (após POC v1 mostrar amostra insuficiente com 5).
// Tolerância ±2 dias na localização de JSON.
const RODADAS = [
  { data: '2026-04-01', limite: '2026-03-25' },
  { data: '2026-04-08', limite: '2026-04-01' },
  { data: '2026-04-15', limite: '2026-04-08' },
  { data: '2026-04-22', limite: '2026-04-15' },
  { data: '2026-04-28', limite: '2026-04-21' },
  { data: '2026-05-05', limite: '2026-04-29' },
  { data: '2026-05-12', limite: '2026-05-05' },
  { data: '2026-05-13', limite: '2026-05-06' },
  { data: '2026-05-15', limite: '2026-05-08' },
  { data: '2026-05-18', limite: '2026-05-11' }
];

// Faixas de probabilidade — para segmentar acerto por nível de confiança
const FAIXAS = [
  { min: 90, max: 100, label: '90+'   },
  { min: 75, max:  89, label: '75-89' },
  { min: 60, max:  74, label: '60-74' }
];

// Onde achar o JSON de cada liga.
// Algumas ligas estão em Analise-Refinada/, outras em projeto-fantasma/rodadas/.
const FONTES_LIGA = {
  BR:    { pasta: path.join(PASTA_REFINADA, 'BR'),    prefixo: 'br_rodada_'    },
  BR_B:  { pasta: path.join(PASTA_REFINADA, 'BR_B'),  prefixo: 'br_b_rodada_'  },
  ARG:   { pasta: path.join(PASTA_FANTASMA, 'ARG'),   prefixo: 'arg_rodada_'   },
  ARG_B: { pasta: path.join(PASTA_REFINADA, 'ARG_B'), prefixo: 'arg_b_rodada_' },
  MLS:   { pasta: path.join(PASTA_REFINADA, 'MLS'),   prefixo: 'mls_rodada_'   },
  USL:   { pasta: path.join(PASTA_FANTASMA, 'USL'),   prefixo: 'usl_rodada_'   },
  BUN:   { pasta: path.join(PASTA_REFINADA, 'BUN'),   prefixo: 'bun_rodada_'   },
  J1:    { pasta: path.join(PASTA_REFINADA, 'J1'),    prefixo: 'j1_rodada_'    },
  J2J3:  { pasta: path.join(PASTA_REFINADA, 'J2J3'),  prefixo: 'j2j3_rodada_'  }
};

// Localiza JSON da rodada com tolerância ±2 dias (cadências de liga divergem)
function localizarJSON(liga, dataAlvo) {
  const f = FONTES_LIGA[liga];
  if (!f || !fs.existsSync(f.pasta)) return null;
  const arquivos = fs.readdirSync(f.pasta).filter(n => n.startsWith(f.prefixo) && n.endsWith('.json'));
  // exato
  const exato = arquivos.find(n => n.includes(dataAlvo));
  if (exato) return path.join(f.pasta, exato);
  // ±2 dias
  const alvo = new Date(dataAlvo + 'T00:00:00');
  for (let delta = 1; delta <= 2; delta++) {
    for (const sinal of [-1, 1]) {
      const d = new Date(alvo.getTime() + sinal * delta * 86400000);
      const ds = d.toISOString().slice(0, 10);
      const cand = arquivos.find(n => n.includes(ds));
      if (cand) return path.join(f.pasta, cand);
    }
  }
  return null;
}

// Constrói input + gabarito a partir do JSON da rodada
function montarRodada(R) {
  const input = [], gabarito = [];
  const ligasOk = [];
  for (const liga of Object.keys(FONTES_LIGA)) {
    const p = localizarJSON(liga, R.data);
    if (!p) continue;
    let raw;
    try { raw = JSON.parse(fs.readFileSync(p, 'utf8')); }
    catch { continue; }
    const jogos = Array.isArray(raw) ? raw : Object.values(raw);
    let temGab = 0;
    for (const j of jogos) {
      const cantos = j.estatisticas_ft && j.estatisticas_ft.cantos;
      input.push({ liga, match_id: j.match_id || j.id, mandante: j.mandante, visitante: j.visitante, rodada: j.rodada });
      gabarito.push({ liga, match_id: j.match_id || j.id, mandante: j.mandante, visitante: j.visitante, cantos_ft: cantos || null });
      if (cantos) temGab++;
    }
    ligasOk.push(`${liga}(${jogos.length}j gab=${temGab})`);
  }
  return { input, gabarito, ligasOk };
}

// Roda uma rodada e devolve { porLigaMercado: { 'BR|HDP_M': {g,r}, ... } }
function analisarRodada(R, cerebro) {
  const { input, gabarito, ligasOk } = montarRodada(R);
  if (input.length === 0) return { porLigaMercado: {}, stats: { skip: true }, ligasOk: [] };

  const base = carregarBase({ dataLimite: R.limite });

  const cacheLiga = {};
  for (const cod of Object.keys(base.ligas)) {
    const L = base.ligas[cod];
    if (L.erro) continue;
    cacheLiga[cod] = {
      perfis:    computarPerfisLiga(L.jogos, base.dna[cod] || {}),
      statsLiga: statsLiga(L.jogos),
      info:      { codigo: cod, maxRodadaRegistrada: maxRodada(L.jogos), dnaLiga: base.dna[cod] || {} }
    };
  }

  const idx = cerebro && cerebro.rankings ? {
    mandantesDom:    new Set((cerebro.rankings.top_mandantes_dominadores       || []).map(r => r.liga + '|' + r.time)),
    visitantesDom:   new Set((cerebro.rankings.top_visitantes_dominadores      || []).map(r => r.liga + '|' + r.time)),
    mandantesUnder:  new Set((cerebro.rankings.top_mandantes_under_friendly    || []).map(r => r.liga + '|' + r.time)),
    visitantesUnder: new Set((cerebro.rankings.top_visitantes_under_friendly   || []).map(r => r.liga + '|' + r.time)),
    evitar:          new Set((cerebro.rankings.times_evitados_alta_volatilidade|| []).map(r => r.liga + '|' + r.time))
  } : null;

  const picks = [];
  const stats = { total: input.length, ok: 0, F1: 0, F2: 0, semDados: 0 };

  for (const jOrig of input) {
    const cache = cacheLiga[jOrig.liga];
    if (!cache) { stats.semDados++; continue; }
    const tBanco = base.ligas[jOrig.liga].times;
    const j = {
      ...jOrig,
      mandante:  normalizarTime(jOrig.mandante,  jOrig.liga, tBanco),
      visitante: normalizarTime(jOrig.visitante, jOrig.liga, tBanco)
    };
    const pM = cache.perfis[j.mandante];
    const pV = cache.perfis[j.visitante];
    if (!pM || !pV) { stats.semDados++; continue; }
    const sH = statsH2H(base.ligas[j.liga].jogos, j.mandante, j.visitante);
    if (!filtro1_dadosInsuficientes(pM, pV, sH, cache.info).passou) { stats.F1++; continue; }
    if (!filtro2_imprevisibilidade(pM, pV, sH).passou) { stats.F2++; continue; }

    const an = analisarJogoInteligente({
      jogo: j, perfilM: { ...pM }, perfilV: { ...pV },
      statsH: sH, statsLigaInfo: cache.statsLiga, infoLiga: cache.info
    });

    const keyM = j.liga + '|' + j.mandante;
    const keyV = j.liga + '|' + j.visitante;
    const bonus = { hdpM: 0, hdpV: 0, under: 0 };
    if (idx) {
      if (idx.mandantesDom.has(keyM))    bonus.hdpM  +=  8;
      if (idx.visitantesDom.has(keyV))   bonus.hdpV  +=  8;
      if (idx.mandantesUnder.has(keyM))  bonus.under +=  6;
      if (idx.visitantesUnder.has(keyV)) bonus.under +=  6;
      if (idx.evitar.has(keyM))          { bonus.hdpM -= 10; bonus.under -= 10; }
      if (idx.evitar.has(keyV))          { bonus.hdpV -= 10; bonus.under -= 10; }
    }
    const probs = {
      HDP_FT_MANDANTE:  Math.min(100, Math.max(0, an.mercados[MERCADOS.HDP_FT_MANDANTE].prob  + bonus.hdpM)),
      HDP_FT_VISITANTE: Math.min(100, Math.max(0, an.mercados[MERCADOS.HDP_FT_VISITANTE].prob + bonus.hdpV)),
      UNDER_9_FT:       Math.min(100, Math.max(0, an.mercados[MERCADOS.UNDER_9_FT].prob       + bonus.under))
    };

    for (const merc of Object.keys(probs)) {
      if (probs[merc] < THRESHOLD_TOP) continue;
      picks.push({ jogo: j, mercado: merc, prob: probs[merc] });
    }
    stats.ok++;
  }

  // Cruza com gabarito
  const porLigaMercado = {};
  for (const e of picks) {
    const tBanco = base.ligas[e.jogo.liga].times;
    const real = gabarito.find(x => x.liga === e.jogo.liga &&
      normalizarTime(x.mandante,  e.jogo.liga, tBanco) === e.jogo.mandante &&
      normalizarTime(x.visitante, e.jogo.liga, tBanco) === e.jogo.visitante);
    if (!real || !real.cantos_ft) continue;
    const dif = real.cantos_ft.m - real.cantos_ft.v;
    const tot = real.cantos_ft.m + real.cantos_ft.v;
    let ok = false;
    if      (e.mercado === 'HDP_FT_MANDANTE')  ok = dif >=  4;
    else if (e.mercado === 'HDP_FT_VISITANTE') ok = dif <= -4;
    else if (e.mercado === 'UNDER_9_FT')       ok = tot <  9;

    const key = e.jogo.liga + '|' + e.mercado;
    porLigaMercado[key] = porLigaMercado[key] || { g: 0, r: 0, picks: [] };
    if (ok) porLigaMercado[key].g++; else porLigaMercado[key].r++;
    porLigaMercado[key].picks.push({ prob: e.prob, ok });
  }

  return { porLigaMercado, stats, ligasOk };
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
console.log('');
console.log('🛡️  ════════════════════════════════════════════════════════════════');
console.log('       ANALISTA SENIOR EDS — POC Aba 1 (Auditoria do Motor)');
console.log('       ' + RODADAS.length + ' rodadas | janela móvel | gerado ' + new Date().toISOString().slice(0, 10));
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');

const cerebro = carregarCerebro();
const totT = cerebro && cerebro.estatisticasGerais && cerebro.estatisticasGerais.totalTimes;
const totH = cerebro && cerebro.estatisticasGerais && cerebro.estatisticasGerais.totalH2H;
console.log(`🧠 Cérebro: ${totT || '?'} times, ${totH || '?'} H2H\n`);

const matriz = {};  // matriz[liga][mercado] = { g, r, picks: [{prob, ok}] }

for (const R of RODADAS) {
  console.log('─────────────────────────────────────────────────────────────────────');
  console.log(`📅 RODADA ${R.data} (dataLimite ${R.limite})`);
  const res = analisarRodada(R, cerebro);
  if (res.stats.skip) {
    console.log('   ⚠️ Sem JSONs para esta rodada — pulando\n');
    continue;
  }
  console.log(`   📁 Ligas: ${res.ligasOk.join(', ')}`);
  console.log(`   📥 ${res.stats.total} jogos | analisados ${res.stats.ok} | F1 ${res.stats.F1} | F2 ${res.stats.F2} | semDados ${res.stats.semDados}`);
  for (const key of Object.keys(res.porLigaMercado)) {
    const [liga, merc] = key.split('|');
    matriz[liga] = matriz[liga] || {};
    matriz[liga][merc] = matriz[liga][merc] || { g: 0, r: 0, picks: [] };
    matriz[liga][merc].g += res.porLigaMercado[key].g;
    matriz[liga][merc].r += res.porLigaMercado[key].r;
    matriz[liga][merc].picks.push(...res.porLigaMercado[key].picks);
  }
  console.log('');
}

// ════════════════════════════════════════════════════════════════════
// MATRIZ CONSOLIDADA
// ════════════════════════════════════════════════════════════════════
const sep = '═'.repeat(80);
console.log('\n' + sep);
console.log('  MATRIZ AUDITORIA — LIGA × MERCADO (' + RODADAS.length + ' RODADAS)');
console.log('  Critério reprovação: taxa < ' + CORTE_TAXA + '% OU n < ' + CORTE_AMOSTRA + ' (R5 + R8 EDS)');
console.log(sep + '\n');

const mercados = ['HDP_FT_MANDANTE', 'HDP_FT_VISITANTE', 'UNDER_9_FT'];

console.log('LIGA   │ ' + mercados.map(m => m.padEnd(24)).join('│ '));
console.log('───────┼─' + mercados.map(() => '─'.repeat(25)).join('┼─'));

const matrizFinal = {};

for (const liga of Object.keys(matriz).sort()) {
  matrizFinal[liga] = {};
  const cells = [liga.padEnd(7)];
  for (const m of mercados) {
    const x = matriz[liga][m];
    if (!x) {
      cells.push('—'.padEnd(24));
      matrizFinal[liga][m] = { n: 0, taxa: null, status: 'SEM_DADOS' };
      continue;
    }
    const n = x.g + x.r;
    const taxa = n > 0 ? (x.g / n * 100) : 0;
    const aprov = taxa >= CORTE_TAXA && n >= CORTE_AMOSTRA;
    const flag = aprov ? '🟢' : '🔴';
    cells.push(`${flag} ${taxa.toFixed(0).padStart(3)}% ${x.g}✅${x.r}❌ n=${n}`.padEnd(24));
    matrizFinal[liga][m] = { g: x.g, r: x.r, n, taxa: +taxa.toFixed(1), status: aprov ? 'APROVADA' : 'REPROVADA' };
  }
  console.log(cells.join('│ '));
}

// Resumo reprovações
console.log('\n' + sep);
console.log('  LIGAS REPROVADAS POR MERCADO');
console.log('  (exclusão automática das abas Ranking/Anti-Ranking/Confronto)');
console.log(sep);

for (const m of mercados) {
  const reprov = Object.keys(matrizFinal).filter(l => matrizFinal[l][m].status === 'REPROVADA');
  console.log(`\n${m}:`);
  if (reprov.length === 0) {
    console.log('  ✅ (nenhuma liga reprovada)');
  } else {
    for (const l of reprov) {
      const cell = matrizFinal[l][m];
      const motivo = cell.n < CORTE_AMOSTRA
        ? `amostra ${cell.n} < ${CORTE_AMOSTRA}`
        : `taxa ${cell.taxa}% < ${CORTE_TAXA}%`;
      console.log(`  ❌ ${l.padEnd(7)} → ${motivo}`);
    }
  }
}

// ════════════════════════════════════════════════════════════════════
// AGREGADO POR LIGA (soma dos 3 mercados) — visão alternativa
// ════════════════════════════════════════════════════════════════════
console.log('\n' + sep);
console.log('  AGREGADO POR LIGA (soma dos 3 mercados)');
console.log('  Mesmo critério: taxa < ' + CORTE_TAXA + '% OU n < ' + CORTE_AMOSTRA);
console.log(sep + '\n');
console.log('LIGA   │ TAXA    │ AMOSTRA │ STATUS');
console.log('───────┼─────────┼─────────┼──────────');
const agregadoLiga = {};
for (const liga of Object.keys(matriz).sort()) {
  let g = 0, r = 0;
  for (const m of mercados) {
    const x = matriz[liga][m];
    if (!x) continue;
    g += x.g; r += x.r;
  }
  const n = g + r;
  const taxa = n > 0 ? (g / n * 100) : 0;
  const aprov = taxa >= CORTE_TAXA && n >= CORTE_AMOSTRA;
  agregadoLiga[liga] = { g, r, n, taxa: +taxa.toFixed(1), status: aprov ? 'APROVADA' : 'REPROVADA' };
  const flag = aprov ? '🟢' : '🔴';
  console.log(`${liga.padEnd(7)}│ ${flag} ${taxa.toFixed(0).padStart(3)}% │ n=${String(n).padStart(4)} │ ${g}✅ ${r}❌`);
}

// ════════════════════════════════════════════════════════════════════
// SEGMENTAÇÃO POR FAIXA DE PROBABILIDADE
// ════════════════════════════════════════════════════════════════════
console.log('\n' + sep);
console.log('  TAXA POR FAIXA DE PROBABILIDADE (todos os picks, todas as ligas)');
console.log(sep + '\n');
console.log('MERCADO              │ ' + FAIXAS.map(f => f.label.padEnd(18)).join('│ '));
console.log('─'.repeat(20) + '┼─' + FAIXAS.map(() => '─'.repeat(19)).join('┼─'));

const porFaixa = {}; // porFaixa[mercado][faixa] = {g, r}
for (const m of mercados) {
  porFaixa[m] = {};
  for (const f of FAIXAS) porFaixa[m][f.label] = { g: 0, r: 0 };
  for (const liga of Object.keys(matriz)) {
    const x = matriz[liga][m];
    if (!x) continue;
    for (const p of x.picks) {
      const f = FAIXAS.find(ff => p.prob >= ff.min && p.prob <= ff.max);
      if (!f) continue;
      if (p.ok) porFaixa[m][f.label].g++; else porFaixa[m][f.label].r++;
    }
  }
}

for (const m of mercados) {
  const cells = [m.padEnd(20)];
  for (const f of FAIXAS) {
    const x = porFaixa[m][f.label];
    const n = x.g + x.r;
    if (n === 0) { cells.push('—'.padEnd(18)); continue; }
    const taxa = (x.g / n * 100).toFixed(0);
    cells.push(`${taxa.padStart(3)}% ${x.g}✅${x.r}❌ n=${String(n).padStart(2)}`.padEnd(18));
  }
  console.log(cells.join('│ '));
}

// FOCO: UNDER_9_FT em ARG/ARG_B por faixa (pedido específico do Mestre)
console.log('\n📌 FOCO — UNDER_9_FT em ARG e ARG_B por faixa de prob:');
for (const liga of ['ARG', 'ARG_B']) {
  const x = matriz[liga] && matriz[liga]['UNDER_9_FT'];
  if (!x) { console.log(`   ${liga}: sem picks`); continue; }
  console.log(`   ${liga}:`);
  for (const f of FAIXAS) {
    const sub = x.picks.filter(p => p.prob >= f.min && p.prob <= f.max);
    if (sub.length === 0) { console.log(`     ${f.label.padEnd(6)}: —`); continue; }
    const g = sub.filter(p => p.ok).length;
    const taxa = (g / sub.length * 100).toFixed(0);
    console.log(`     ${f.label.padEnd(6)}: ${taxa.padStart(3)}% ${g}✅${sub.length-g}❌ n=${sub.length}`);
  }
}

// Salva JSON
const outDir = path.resolve(__dirname, '..', 'output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `auditoria_${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(outPath, JSON.stringify({
  geradoEm:      new Date().toISOString(),
  janelaRodadas: RODADAS.map(r => r.data),
  criterio:      { corteTaxa: CORTE_TAXA, corteAmostra: CORTE_AMOSTRA, thresholdTop: THRESHOLD_TOP },
  matriz:        matrizFinal,
  agregadoLiga,
  porFaixa
}, null, 2));

console.log('\n' + sep);
console.log(`💾 Matriz salva em: ${path.relative(process.cwd(), outPath)}`);
console.log(sep);
