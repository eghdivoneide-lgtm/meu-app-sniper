// ════════════════════════════════════════════════════════════════════
// BACKTEST CEGO v2 — Modelo probabilístico
// Roda agente em backtest mode + cruza com gabarito real.
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { carregarBase }                       = require('./engine/loader');
const { executarAuditor }                    = require('./engine/agente');
const { MODOS }                              = require('./config');
const { MERCADOS }                           = require('./engine/filtros');
const { normalizarTime }                     = require('./engine/aliases');

const RODADA_INPUT   = './backtest/rodada_2026-05-12.json';
const GABARITO_INPUT = './backtest/gabarito_2026-05-12.json';

function classificarReal(cantos_ft) {
  if (!cantos_ft) return null;
  const m = cantos_ft.m, v = cantos_ft.v;
  return {
    cantos_m: m, cantos_v: v, total: m + v, dif: m - v,
    HDP_FT_MANDANTE:  (m - v) >=  4,
    HDP_FT_VISITANTE: (m - v) <= -4,
    UNDER_9_FT:       (m + v) <  9
  };
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  BACKTEST CEGO v2 (probabilístico) — Rodada 11-12/05');
console.log('═══════════════════════════════════════════════════════════════════\n');

const rodada    = JSON.parse(fs.readFileSync(RODADA_INPUT, 'utf8'));
const gabarito  = JSON.parse(fs.readFileSync(GABARITO_INPUT, 'utf8'));

const modo = MODOS.BACKTEST_F3;
const base = carregarBase({ dataLimite: modo.dataLimite });

const gabaritoPorId = {};
for (const g of gabarito) if (g.match_id) gabaritoPorId[g.match_id] = g;

const resultado = executarAuditor({ base, jogosParaAnalisar: rodada });

console.log('📊 Análise:');
console.log('   Modo:', resultado.modo);
console.log('   Total analisados:', resultado.totalAnalisados);
console.log('   Eliminados:', JSON.stringify(resultado.eliminadosPor));
console.log('   Aprovados (com prob):', resultado.aprovadosBrutos);
console.log('   Lista final:', resultado.listaFinal.length);
console.log('');

if (resultado.listaFinal.length === 0) {
  console.log('⚠️  Lista vazia — verifique sanidade F1/F2.');
  process.exit(0);
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  CRUZAMENTO COM GABARITO REAL');
console.log('═══════════════════════════════════════════════════════════════════\n');

let acertos = 0, erros = 0, semGab = 0;
const detalhes = [];
const porMercado = {
  HDP_FT_MANDANTE: { green: 0, red: 0 },
  HDP_FT_VISITANTE:{ green: 0, red: 0 },
  UNDER_9_FT:      { green: 0, red: 0 }
};

for (const c of resultado.listaFinal) {
  const a = c.analise;
  const tBanco = base.ligas[a.jogo.liga]?.times || [];
  const mN = normalizarTime(a.jogo.mandante, a.jogo.liga, tBanco);
  const vN = normalizarTime(a.jogo.visitante, a.jogo.liga, tBanco);

  let g = a.jogo.match_id ? gabaritoPorId[a.jogo.match_id] : null;
  if (!g) {
    g = gabarito.find(x => x.liga === a.jogo.liga &&
      normalizarTime(x.mandante, a.jogo.liga, tBanco) === mN &&
      normalizarTime(x.visitante, a.jogo.liga, tBanco) === vN);
  }

  if (!g || !g.cantos_ft) {
    semGab++;
    detalhes.push({ jogo: a.jogo, mercado: c.mercado, prob: c.prob, resultado: '?' });
    continue;
  }

  const real = classificarReal(g.cantos_ft);
  const acertou = real[c.mercado] === true;
  if (acertou) { acertos++; porMercado[c.mercado].green++; }
  else         { erros++;   porMercado[c.mercado].red++;   }

  detalhes.push({ jogo: a.jogo, mercado: c.mercado, prob: c.prob, real, acertou });
}

// Tabela
console.log('# | Resultado | Prob | Mercado          | Liga | Jogo                                     | Real');
console.log('--+-----------+------+------------------+------+------------------------------------------+-------');
for (let i = 0; i < detalhes.length; i++) {
  const d = detalhes[i];
  let resStr = '? sem-gab';
  if (d.acertou !== undefined) resStr = d.acertou ? '✅ GREEN  ' : '❌ RED    ';
  const realStr = d.real ? `M=${d.real.cantos_m} V=${d.real.cantos_v} dif=${d.real.dif} tot=${d.real.total}` : '?';
  const jogoStr = (d.jogo.mandante + ' vs ' + d.jogo.visitante).substring(0, 40).padEnd(40);
  console.log(
    String(i+1).padStart(2) + ' | ' + resStr + ' | ' +
    String(d.prob).padStart(3) + '  | ' + d.mercado.padEnd(16) + ' | ' +
    d.jogo.liga.padEnd(4) + ' | ' + jogoStr + ' | ' + realStr
  );
}

const total = acertos + erros;
const pct = total ? (acertos/total*100).toFixed(1) : 0;

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('  VEREDITO');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`  GREEN:        ${acertos}`);
console.log(`  RED:          ${erros}`);
console.log(`  Sem gabarito: ${semGab}`);
console.log(`  TAXA DE ACERTO GERAL: ${pct}% (${acertos}/${total})`);
console.log('');
console.log('  Por mercado:');
for (const m of Object.keys(porMercado)) {
  const pm = porMercado[m];
  const t = pm.green + pm.red;
  if (t === 0) continue;
  const p = (pm.green/t*100).toFixed(1);
  console.log(`    ${m.padEnd(18)} ${pm.green}✅ ${pm.red}❌ = ${p}% (${pm.green}/${t})`);
}
console.log('═══════════════════════════════════════════════════════════════════');

const out = path.join(__dirname, 'backtest', `resultado_v2_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`);
fs.writeFileSync(out, JSON.stringify({
  modo, total: resultado.totalAnalisados, eliminadosPor: resultado.eliminadosPor,
  aprovadosBrutos: resultado.aprovadosBrutos, listaFinal: resultado.listaFinal.length,
  acertos, erros, semGab, pctAcerto: parseFloat(pct), porMercado,
  detalhes: detalhes.map(d => ({
    liga: d.jogo.liga, mandante: d.jogo.mandante, visitante: d.jogo.visitante,
    mercado: d.mercado, prob: d.prob, real: d.real || null, acertou: d.acertou
  }))
}, null, 2));
console.log('\n💾 ' + out);
