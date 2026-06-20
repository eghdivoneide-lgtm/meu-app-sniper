// ════════════════════════════════════════════════════════════════════
// ANALISTA SENIOR EDS — Auditoria com LINHA CALIBRADA por liga
//
// Re-roda backtest cego nas mesmas rodadas, mas em vez de Under 9 fixo
// usa Under calibrado por liga (BR→11.5, MLS→11.5, ARG→9.5, etc).
//
// Motor simplificado (4 evidências) só para validar o conceito.
// Reusa Filtros 1+2 do motor original (não toca).
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const AUDITOR = path.resolve(__dirname, '..', '..', 'Auditor-Supremo-Cantos');
const { carregarBase }                                          = require(path.join(AUDITOR, 'engine', 'loader'));
const { carregarCerebro }                                       = require(path.join(AUDITOR, 'engine', 'cerebro'));
const { statsH2H, statsLiga, cantosFT }                         = require(path.join(AUDITOR, 'engine', 'stats'));
const { filtro1_dadosInsuficientes, filtro2_imprevisibilidade } = require(path.join(AUDITOR, 'engine', 'filtros'));
const { computarPerfisLiga, maxRodada }                         = require(path.join(AUDITOR, 'engine', 'agente'));
const { normalizarTime }                                        = require(path.join(AUDITOR, 'engine', 'aliases'));

const THRESHOLD_TOP = 60;
const CORTE_TAXA    = 50;
const CORTE_AMOSTRA = 30;

// Carrega linhas calibradas
const linhasJsonPath = path.resolve(__dirname, '..', 'output', `linhas_calibradas_${new Date().toISOString().slice(0,10)}.json`);
if (!fs.existsSync(linhasJsonPath)) {
  console.error('❌ Linhas calibradas não encontradas. Rode primeiro: node calibrar_linhas.js');
  process.exit(1);
}
const linhasData = JSON.parse(fs.readFileSync(linhasJsonPath, 'utf8'));
const linhaUnderPorLiga = {}, linhaOverPorLiga = {};
for (const liga of Object.keys(linhasData.ligas)) {
  const r = linhasData.ligas[liga];
  if (r.erro) continue;
  if (r.linha_under_calibrada) linhaUnderPorLiga[liga] = r.linha_under_calibrada;
  if (r.linha_over_calibrada)  linhaOverPorLiga[liga]  = r.linha_over_calibrada;
}

const REPO = path.resolve(__dirname, '..', '..');
const PASTA_REFINADA = path.join(REPO, 'Analise-Refinada');
const PASTA_FANTASMA = path.join(REPO, 'projeto-fantasma', 'rodadas');

const FONTES_LIGA = {
  BR:    { pasta: path.join(PASTA_REFINADA, 'BR'),    prefixo: 'br_rodada_'    },
  BR_B:  { pasta: path.join(PASTA_REFINADA, 'BR_B'),  prefixo: 'br_b_rodada_'  },
  ARG:   { pasta: path.join(PASTA_FANTASMA, 'ARG'),   prefixo: 'arg_rodada_'   },
  ARG_B: { pasta: path.join(PASTA_REFINADA, 'ARG_B'), prefixo: 'arg_b_rodada_' },
  MLS:   { pasta: path.join(PASTA_REFINADA, 'MLS'),   prefixo: 'mls_rodada_'   },
  USL:   { pasta: path.join(PASTA_FANTASMA, 'USL'),   prefixo: 'usl_rodada_'   }
};

// Descobre automaticamente todas as datas de rodada disponíveis nas fontes.
// Retorna [{ data: 'YYYY-MM-DD', limite: 'YYYY-MM-DD' }] ordenado cronologicamente.
function descobrirRodadas() {
  const datasSet = new Set();
  for (const liga of Object.keys(FONTES_LIGA)) {
    const f = FONTES_LIGA[liga];
    if (!fs.existsSync(f.pasta)) continue;
    for (const arq of fs.readdirSync(f.pasta)) {
      if (!arq.endsWith('.json')) continue;
      if (!arq.startsWith(f.prefixo)) continue;
      const m = arq.match(/(\d{4}-\d{2}-\d{2})/);
      if (m) datasSet.add(m[1]);
    }
  }
  const datas = [...datasSet].sort();
  return datas.map(d => {
    const dt = new Date(d + 'T00:00:00');
    const lim = new Date(dt.getTime() - 7 * 86400000);
    return { data: d, limite: lim.toISOString().slice(0, 10) };
  });
}

const RODADAS = descobrirRodadas();
// Adiciona rodada virtual 17/mai (data/*.js) para auditar pós-injeção
RODADAS.push({ data: '2026-05-17', limite: '2026-05-10', fonte: 'data_js' });

function localizarJSON(liga, dataAlvo) {
  const f = FONTES_LIGA[liga];
  if (!f || !fs.existsSync(f.pasta)) return null;
  const arquivos = fs.readdirSync(f.pasta).filter(n => n.startsWith(f.prefixo) && n.endsWith('.json'));
  const exato = arquivos.find(n => n.includes(dataAlvo));
  if (exato) return path.join(f.pasta, exato);
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

function montarRodada(R) {
  const input = [], gabarito = [];
  for (const liga of Object.keys(FONTES_LIGA)) {
    const p = localizarJSON(liga, R.data);
    if (!p) continue;
    let raw;
    try { raw = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
    const jogos = Array.isArray(raw) ? raw : Object.values(raw);
    for (const j of jogos) {
      const cantos = j.estatisticas_ft && j.estatisticas_ft.cantos;
      input.push({ liga, mandante: j.mandante, visitante: j.visitante, rodada: j.rodada });
      gabarito.push({ liga, mandante: j.mandante, visitante: j.visitante, cantos_ft: cantos || null });
    }
  }
  return { input, gabarito };
}

function montarRodadaFromDataJs(R) {
  const baseCompleta = carregarBase({ dataLimite: null });
  const input = [], gabarito = [];
  const alvo = new Date(R.data + 'T00:00:00').getTime();
  const minMs = alvo - 86400000;
  const maxMs = alvo + 86400000;
  for (const ligaCod of Object.keys(FONTES_LIGA)) {
    const L = baseCompleta.ligas[ligaCod];
    if (!L || L.erro) continue;
    for (const j of L.jogos) {
      if (!j.dataNorm) continue;
      const jMs = new Date(j.dataNorm + 'T00:00:00').getTime();
      if (jMs < minMs || jMs > maxMs) continue;
      const cantos = j.estatisticas_ft && j.estatisticas_ft.cantos;
      input.push({ liga: ligaCod, mandante: j.mandante, visitante: j.visitante, rodada: j.rodada });
      gabarito.push({ liga: ligaCod, mandante: j.mandante, visitante: j.visitante, cantos_ft: cantos || null });
    }
  }
  return { input, gabarito };
}

// ── Pct de jogos do TIME (casa/fora) cuja condição em cantos passa
function pctTimeCondicao(jogosLiga, nomeTime, ondeJoga, cond) {
  let validos = 0, ok = 0;
  for (const j of jogosLiga) {
    const c = cantosFT(j);
    if (!c) continue;
    const teamMandante = j.mandante === nomeTime;
    const teamVisitante = j.visitante === nomeTime;
    if (ondeJoga === 'casa' && !teamMandante)  continue;
    if (ondeJoga === 'fora' && !teamVisitante) continue;
    validos++;
    if (cond(c.m + c.v)) ok++;
  }
  return validos > 0 ? +(ok / validos * 100).toFixed(1) : 0;
}

function pctLigaCondicao(jogosLiga, cond) {
  let validos = 0, ok = 0;
  for (const j of jogosLiga) {
    const c = cantosFT(j);
    if (!c) continue;
    validos++;
    if (cond(c.m + c.v)) ok++;
  }
  return validos > 0 ? +(ok / validos * 100).toFixed(1) : 0;
}

function pctH2HCondicao(statsH, cond) {
  if (statsH.n_confrontos === 0) return null;
  return cond(statsH.total_media) ? 70 : 30;
}

// Motor simplificado: 4 evidências ponderadas → prob 0-100
function probCalibrado(perfilM, perfilV, statsH, jogosLiga, condicao) {
  const e1 = pctTimeCondicao(jogosLiga, perfilM.nome, 'casa', condicao);
  const e2 = pctTimeCondicao(jogosLiga, perfilV.nome, 'fora', condicao);
  const e3 = pctLigaCondicao(jogosLiga, condicao);
  const e4 = pctH2HCondicao(statsH, condicao);
  const evs = [
    { score: e1, peso: 30 },
    { score: e2, peso: 25 },
    { score: e3, peso: 15 }
  ];
  if (e4 !== null) evs.push({ score: e4, peso: 10 });
  const somaPeso = evs.reduce((s, e) => s + e.peso, 0);
  const somaPond = evs.reduce((s, e) => s + e.score * e.peso, 0);
  return Math.round(somaPond / somaPeso);
}

const probUnderCalibrado = (pM, pV, sH, jL, linha) => probCalibrado(pM, pV, sH, jL, t => t < linha);
const probOverCalibrado  = (pM, pV, sH, jL, linha) => probCalibrado(pM, pV, sH, jL, t => t > linha);

function analisarRodada(R) {
  const { input, gabarito } = R.fonte === 'data_js' ? montarRodadaFromDataJs(R) : montarRodada(R);
  if (input.length === 0) return { porLiga: {}, stats: { skip: true } };

  const base = carregarBase({ dataLimite: R.limite });

  const cacheLiga = {};
  for (const cod of Object.keys(base.ligas)) {
    const L = base.ligas[cod];
    if (L.erro) continue;
    cacheLiga[cod] = {
      perfis: computarPerfisLiga(L.jogos, base.dna[cod] || {}),
      statsLiga: statsLiga(L.jogos),
      info: { codigo: cod, maxRodadaRegistrada: maxRodada(L.jogos), dnaLiga: base.dna[cod] || {} },
      jogos: L.jogos
    };
  }

  const picks = [];
  const stats = { total: input.length, ok: 0, F1: 0, F2: 0, semDados: 0, semLinha: 0 };

  for (const jOrig of input) {
    const cache = cacheLiga[jOrig.liga];
    if (!cache) { stats.semDados++; continue; }
    const linhaU = linhaUnderPorLiga[jOrig.liga];
    const linhaO = linhaOverPorLiga[jOrig.liga];
    if (!linhaU && !linhaO) { stats.semLinha++; continue; }
    const tBanco = base.ligas[jOrig.liga].times;
    const j = {
      ...jOrig,
      mandante:  normalizarTime(jOrig.mandante,  jOrig.liga, tBanco),
      visitante: normalizarTime(jOrig.visitante, jOrig.liga, tBanco)
    };
    const pM = cache.perfis[j.mandante];
    const pV = cache.perfis[j.visitante];
    if (!pM || !pV) { stats.semDados++; continue; }
    pM.nome = j.mandante; pV.nome = j.visitante;
    const sH = statsH2H(base.ligas[j.liga].jogos, j.mandante, j.visitante);
    if (!filtro1_dadosInsuficientes(pM, pV, sH, cache.info).passou) { stats.F1++; continue; }
    if (!filtro2_imprevisibilidade(pM, pV, sH).passou) { stats.F2++; continue; }
    if (linhaU) {
      const probU = probUnderCalibrado(pM, pV, sH, cache.jogos, linhaU);
      if (probU >= THRESHOLD_TOP) picks.push({ liga: j.liga, mercado: 'UNDER', mandante: j.mandante, visitante: j.visitante, prob: probU, linha: linhaU });
    }
    if (linhaO) {
      const probO = probOverCalibrado(pM, pV, sH, cache.jogos, linhaO);
      if (probO >= THRESHOLD_TOP) picks.push({ liga: j.liga, mercado: 'OVER', mandante: j.mandante, visitante: j.visitante, prob: probO, linha: linhaO });
    }
    stats.ok++;
  }

  // Cruza com gabarito
  const porLigaMerc = {};
  for (const e of picks) {
    const tBanco = base.ligas[e.liga].times;
    const real = gabarito.find(x => x.liga === e.liga &&
      normalizarTime(x.mandante,  e.liga, tBanco) === e.mandante &&
      normalizarTime(x.visitante, e.liga, tBanco) === e.visitante);
    if (!real || !real.cantos_ft) continue;
    const tot = real.cantos_ft.m + real.cantos_ft.v;
    const ok = e.mercado === 'UNDER' ? (tot < e.linha) : (tot > e.linha);
    const key = e.liga + '|' + e.mercado;
    porLigaMerc[key] = porLigaMerc[key] || { g: 0, r: 0, picks: [], linha: e.linha };
    if (ok) porLigaMerc[key].g++; else porLigaMerc[key].r++;
    porLigaMerc[key].picks.push({ prob: e.prob, ok });
  }
  return { porLigaMerc, stats };
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
console.log('');
console.log('🛡️  ════════════════════════════════════════════════════════════════');
console.log('       ANALISTA SENIOR EDS — Auditoria com LINHA CALIBRADA');
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');
console.log('Linhas calibradas em uso:');
for (const liga of Object.keys(linhaUnderPorLiga)) {
  console.log(`   ${liga.padEnd(7)} → Under ${linhaUnderPorLiga[liga]} | Over ${linhaOverPorLiga[liga] || '?'}`);
}
console.log('');

const cerebro = carregarCerebro();

const matriz = {};  // matriz['BR|UNDER'] = { g, r, picks, linha }
for (const R of RODADAS) {
  console.log(`📅 ${R.data} (limite ${R.limite})`);
  const res = analisarRodada(R);
  if (res.stats.skip) { console.log('   ⚠️ sem dados\n'); continue; }
  console.log(`   📥 ${res.stats.total} jogos | OK ${res.stats.ok} | F1 ${res.stats.F1} | F2 ${res.stats.F2} | semDados ${res.stats.semDados} | semLinha ${res.stats.semLinha}`);
  for (const key of Object.keys(res.porLigaMerc)) {
    matriz[key] = matriz[key] || { g: 0, r: 0, picks: [], linha: res.porLigaMerc[key].linha };
    matriz[key].g += res.porLigaMerc[key].g;
    matriz[key].r += res.porLigaMerc[key].r;
    matriz[key].picks.push(...res.porLigaMerc[key].picks);
  }
}

// Matriz consolidada — UNDER e OVER lado a lado
const sep = '═'.repeat(90);
console.log('\n' + sep);
console.log('  MATRIZ UNDER + OVER CALIBRADOS POR LIGA');
console.log('  Critério: taxa ≥ ' + CORTE_TAXA + '% E n ≥ ' + CORTE_AMOSTRA + ' | threshold pick ≥ ' + THRESHOLD_TOP);
console.log(sep + '\n');
console.log('LIGA   │ UNDER calibrado                  │ OVER calibrado');
console.log('───────┼──────────────────────────────────┼──────────────────────────────────');

const matrizFinal = {};
const ligas = Object.keys(linhaUnderPorLiga).sort();
for (const liga of ligas) {
  matrizFinal[liga] = {};
  function fmt(merc) {
    const x = matriz[liga + '|' + merc];
    if (!x) {
      matrizFinal[liga][merc] = { n: 0, taxa: null, status: 'SEM_PICK' };
      return '— sem picks                       ';
    }
    const n = x.g + x.r;
    const taxa = n > 0 ? (x.g / n * 100) : 0;
    const aprov = taxa >= CORTE_TAXA && n >= CORTE_AMOSTRA;
    const flag = aprov ? '🟢' : '🔴';
    matrizFinal[liga][merc] = { linha: x.linha, g: x.g, r: x.r, n, taxa: +taxa.toFixed(1), status: aprov ? 'APROVADA' : 'REPROVADA' };
    return `${flag} ${merc === 'UNDER' ? 'U' : 'O'} ${String(x.linha).padEnd(4)} ${taxa.toFixed(0).padStart(3)}% ${x.g}✅${x.r}❌ n=${String(n).padStart(3)}`.padEnd(34);
  }
  console.log(`${liga.padEnd(7)}│ ${fmt('UNDER')}│ ${fmt('OVER')}`);
}

// Tabela comparativa contra motor original (Under 9)
console.log('\n' + sep);
console.log('  COMPARAÇÃO 3 vias — motor original | UNDER calibrado | OVER calibrado');
console.log(sep + '\n');
const motorOriginalUnder9 = {
  ARG:   { taxa: 58, n: 31 },
  ARG_B: { taxa: 54, n: 39 },
  BR:    { taxa: null, n: 0 },
  BR_B:  { taxa: 0, n: 2 },
  MLS:   { taxa: 0, n: 4 },
  USL:   { taxa: 0, n: 1 }
};
console.log('LIGA   │ Motor (Und 9)    │ UNDER calibr.        │ OVER calibr.');
console.log('───────┼──────────────────┼──────────────────────┼──────────────────────');
for (const liga of ligas) {
  const orig = motorOriginalUnder9[liga] || { taxa: null, n: 0 };
  const u = matrizFinal[liga].UNDER || {};
  const o = matrizFinal[liga].OVER  || {};
  const origStr = orig.taxa !== null ? `${orig.taxa}% n=${orig.n}` : 'sem picks';
  const uStr = u.taxa !== null ? `U${u.linha} ${u.taxa}% n=${u.n}` : 'sem picks';
  const oStr = o.taxa !== null ? `O${o.linha} ${o.taxa}% n=${o.n}` : 'sem picks';
  console.log(`${liga.padEnd(7)}│ ${origStr.padEnd(17)}│ ${uStr.padEnd(21)}│ ${oStr.padEnd(21)}`);
}

// Salva JSON
const outDir = path.resolve(__dirname, '..', 'output');
const outPath = path.join(outDir, `auditoria_calibrada_${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(outPath, JSON.stringify({
  geradoEm:           new Date().toISOString(),
  linhasUnder:        linhaUnderPorLiga,
  linhasOver:         linhaOverPorLiga,
  janelaRodadas:      RODADAS.map(r => r.data),
  matriz:             matrizFinal
}, null, 2));
console.log(`\n💾 Matriz salva em: ${path.relative(process.cwd(), outPath)}`);
