// ════════════════════════════════════════════════════════════════════
// DIAGNÓSTICO — Modo "TOP-20 por score" (sem exigir 7/7 rígido).
// Objetivo: medir o TETO de capacidade do agente.
// Se top-20 por score atinge ≥ 70% → o agente PODE funcionar, falta
// calibrar a cascata. Se < 50%, há problema mais profundo.
// ════════════════════════════════════════════════════════════════════

const fs = require('fs');
const { carregarBase } = require('./engine/loader');
const { perfilTimeCompleto, statsH2H, statsLiga } = require('./engine/stats');
const {
  filtro1_dadosInsuficientes, filtro2_imprevisibilidade,
  filtro4_convergencia, filtro5_score, MERCADOS
} = require('./engine/filtros');
const { computarPerfisLiga, maxRodada } = require('./engine/agente');
const { normalizarTime } = require('./engine/aliases');

const base = carregarBase({ dataLimite: '2026-05-08' });
const rodada   = JSON.parse(fs.readFileSync('./backtest/rodada_2026-05-12.json'));
const gabarito = JSON.parse(fs.readFileSync('./backtest/gabarito_2026-05-12.json'));

// Pré-computa caches
const cacheLiga = {};
for (const cod of Object.keys(base.ligas)) {
  const L = base.ligas[cod];
  if (L.erro) continue;
  cacheLiga[cod] = {
    perfis: computarPerfisLiga(L.jogos, base.dna[cod] || {}),
    statsLiga: statsLiga(L.jogos),
    info: { codigo: cod, maxRodadaRegistrada: maxRodada(L.jogos), dnaLiga: base.dna[cod] || {} }
  };
}

const gabaritoPorId = {};
for (const g of gabarito) if (g.match_id) gabaritoPorId[g.match_id] = g;

const candidatos = [];

for (const j of rodada) {
  const cache = cacheLiga[j.liga];
  if (!cache) continue;
  const tBanco = base.ligas[j.liga].times;
  const mN = normalizarTime(j.mandante, j.liga, tBanco);
  const vN = normalizarTime(j.visitante, j.liga, tBanco);
  const pM = cache.perfis[mN];
  const pV = cache.perfis[vN];
  if (!pM || !pV) continue;

  const sH = statsH2H(base.ligas[j.liga].jogos, mN, vN);
  pM.dna = (base.dna[j.liga] || {})[mN] || {};
  pV.dna = (base.dna[j.liga] || {})[vN] || {};

  // Aplica F1+F2 só (sanidade), e mede F4/F5 sem cortar
  const f1 = filtro1_dadosInsuficientes(pM, pV, sH, cache.info);
  if (!f1.passou) continue;
  const f2 = filtro2_imprevisibilidade(pM, pV, sH);
  if (!f2.passou) continue;

  // Para cada mercado, mede convergência + score
  for (const m of [MERCADOS.HDP_FT_MANDANTE, MERCADOS.HDP_FT_VISITANTE, MERCADOS.UNDER_9_FT]) {
    const conv  = filtro4_convergencia(m, pM, pV, sH, cache.info, cache.statsLiga);
    const score = filtro5_score(m, pM, pV, sH, cache.statsLiga);
    candidatos.push({
      liga: j.liga, mandante: mN, visitante: vN, match_id: j.match_id,
      mercado: m, convergencia: conv.convergencia,
      ok_count: conv.camadas.filter(c => c.ok).length,
      score: score.score, score_detalhe: score.detalhe
    });
  }
}

// Ordena: primeiro por convergencia, depois por score
candidatos.sort((a, b) => {
  if (b.ok_count !== a.ok_count) return b.ok_count - a.ok_count;
  return b.score - a.score;
});

// Deduplica por jogo (mantém só o melhor mercado por jogo)
const visto = new Set();
const top = [];
for (const c of candidatos) {
  const k = c.liga + '|' + c.mandante + '|' + c.visitante;
  if (visto.has(k)) continue;
  visto.add(k);
  top.push(c);
  if (top.length >= 20) break;
}

// Cruza com gabarito
let acertos = 0, erros = 0, semGab = 0;
console.log('═══════════════════════════════════════════════════════════════════');
console.log('  DIAGNÓSTICO TOP-20 (sem exigir 7/7 rígido)');
console.log('═══════════════════════════════════════════════════════════════════\n');
console.log('# | Resultado | Conv | Score | Mercado            | Jogo');
console.log('--+-----------+------+-------+--------------------+----------------------------');

for (let i = 0; i < top.length; i++) {
  const c = top[i];
  let g = c.match_id ? gabaritoPorId[c.match_id] : null;
  if (!g) {
    g = gabarito.find(x => x.liga === c.liga &&
                            normalizarTime(x.mandante, c.liga, base.ligas[c.liga].times) === c.mandante &&
                            normalizarTime(x.visitante, c.liga, base.ligas[c.liga].times) === c.visitante);
  }
  let res = '? sem-gab';
  if (g && g.cantos_ft) {
    const m = g.cantos_ft.m, v = g.cantos_ft.v, dif = m - v, total = m + v;
    const real = {
      HDP_FT_MANDANTE:  dif >=  4,
      HDP_FT_VISITANTE: dif <= -4,
      UNDER_9_FT:       total < 9
    };
    const acertou = real[c.mercado] === true;
    if (acertou) { acertos++; res = '✅ GREEN  '; }
    else         { erros++;   res = '❌ RED    '; }
  } else {
    semGab++;
  }

  const jogo = (c.mandante + ' vs ' + c.visitante).substring(0, 45);
  console.log(
    String(i+1).padStart(2) + ' | ' + res + ' | ' + c.convergencia + ' | ' +
    String(c.score).padStart(3) + '   | ' + c.mercado.padEnd(18) + ' | ' +
    '[' + c.liga + '] ' + jogo
  );
}

const total = acertos + erros;
const pct = total ? (acertos/total*100).toFixed(1) : 0;
console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`  TOTAL: ${acertos}✅  ${erros}❌  (${semGab} sem gabarito)`);
console.log(`  TAXA DE ACERTO: ${pct}% (${acertos}/${total})`);
console.log('═══════════════════════════════════════════════════════════════════');
