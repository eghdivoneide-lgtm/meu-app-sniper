// EDS-HDP-Pro · Rankings dedicados a HDP
//
// Para cada liga, calcula 8 rankings por time (HT e FT separados):
//   - cantos_pro_casa     : média que o time faz quando joga em CASA
//   - cantos_pro_fora     : média que o time faz quando joga FORA
//   - cantos_contra_casa  : média que o time CONCEDE em casa
//   - cantos_contra_fora  : média que o time CONCEDE fora
//
// Saída: ranking_hdp.json com estrutura
//   { LIGA: { times: { TIME: { ft: {pro_casa, pro_fora, contra_casa, contra_fora, n_casa, n_fora},
//                              ht: {...} } } } }

const fs = require('fs');
const path = require('path');
const { LIGAS, carregarLiga, timesDaLiga } = require('./_io');

// EWMA — peso temporal exponencial: jogos recentes valem mais.
// half_life em dias: peso(t) = exp(-ln(2) * idade_dias / half_life).
// Com half_life = 60 dias, jogo de 60 dias atrás vale metade do de hoje.
const HALF_LIFE_DIAS = 60;
const LN2 = Math.log(2);

function parseDataPartida(s) {
  if (!s) return null;
  // formato: "13.05.2026 21:30" ou "13.05.2026"
  const m = String(s).substring(0, 10).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  return new Date(+m[3], +m[2] - 1, +m[1]);
}

function pesoTemporal(dataJogo, dataRef) {
  if (!dataJogo) return 1.0; // sem data — peso neutro
  const dias = (dataRef - dataJogo) / (24 * 3600 * 1000);
  if (dias < 0) return 1.0; // jogo no futuro? ignora EWMA
  return Math.exp(-LN2 * dias / HALF_LIFE_DIAS);
}

function calcularRankings(liga, jogosInjetados) {
  // Permite injetar lista de jogos (usado pelo backtest cego — sem leak temporal)
  const jogos = jogosInjetados || carregarLiga(liga);
  const times = timesDaLiga(jogos);

  // Data de referência = data do jogo mais recente do banco da liga
  let dataMax = new Date(2000, 0, 1);
  for (const j of jogos) {
    const d = parseDataPartida(j.data_partida);
    if (d && d > dataMax) dataMax = d;
  }

  // Acumuladores por time — sums ponderados + count efetivo (soma de pesos)
  const acc = {};
  for (const t of times) {
    acc[t] = {
      ft: { pro_casa_w: 0, pro_fora_w: 0, contra_casa_w: 0, contra_fora_w: 0, w_casa: 0, w_fora: 0, n_casa: 0, n_fora: 0 },
      ht: { pro_casa_w: 0, pro_fora_w: 0, contra_casa_w: 0, contra_fora_w: 0, w_casa: 0, w_fora: 0, n_casa: 0, n_fora: 0 }
    };
  }

  for (const j of jogos) {
    const M = j.mandante, V = j.visitante;
    const cft = j.estatisticas_ft?.cantos;
    const cht = j.estatisticas_ht?.cantos;
    if (!cft) continue;

    const w = pesoTemporal(parseDataPartida(j.data_partida), dataMax);

    // Mandante em CASA: pró = cft.m, contra = cft.v
    acc[M].ft.pro_casa_w    += cft.m * w;
    acc[M].ft.contra_casa_w += cft.v * w;
    acc[M].ft.w_casa        += w;
    acc[M].ft.n_casa++;
    // Visitante FORA
    acc[V].ft.pro_fora_w    += cft.v * w;
    acc[V].ft.contra_fora_w += cft.m * w;
    acc[V].ft.w_fora        += w;
    acc[V].ft.n_fora++;

    if (cht && cht.m !== undefined) {
      acc[M].ht.pro_casa_w    += cht.m * w;
      acc[M].ht.contra_casa_w += cht.v * w;
      acc[M].ht.w_casa        += w;
      acc[M].ht.n_casa++;
      acc[V].ht.pro_fora_w    += cht.v * w;
      acc[V].ht.contra_fora_w += cht.m * w;
      acc[V].ht.w_fora        += w;
      acc[V].ht.n_fora++;
    }
  }

  // Médias ponderadas
  const timesOut = {};
  for (const t of times) {
    const a = acc[t];
    timesOut[t] = {
      ft: {
        pro_casa:    a.ft.w_casa ? +(a.ft.pro_casa_w   / a.ft.w_casa).toFixed(2) : null,
        contra_casa: a.ft.w_casa ? +(a.ft.contra_casa_w/ a.ft.w_casa).toFixed(2) : null,
        pro_fora:    a.ft.w_fora ? +(a.ft.pro_fora_w   / a.ft.w_fora).toFixed(2) : null,
        contra_fora: a.ft.w_fora ? +(a.ft.contra_fora_w/ a.ft.w_fora).toFixed(2) : null,
        n_casa: a.ft.n_casa,
        n_fora: a.ft.n_fora
      },
      ht: {
        pro_casa:    a.ht.w_casa ? +(a.ht.pro_casa_w   / a.ht.w_casa).toFixed(2) : null,
        contra_casa: a.ht.w_casa ? +(a.ht.contra_casa_w/ a.ht.w_casa).toFixed(2) : null,
        pro_fora:    a.ht.w_fora ? +(a.ht.pro_fora_w   / a.ht.w_fora).toFixed(2) : null,
        contra_fora: a.ht.w_fora ? +(a.ht.contra_fora_w/ a.ht.w_fora).toFixed(2) : null,
        n_casa: a.ht.n_casa,
        n_fora: a.ht.n_fora
      }
    };
  }

  // Médias gerais da liga (baseline para shrinkage) — ponderado
  let totalProW = 0, totalW = 0, totalN = 0;
  for (const t of times) {
    totalProW += (acc[t].ft.pro_casa_w + acc[t].ft.pro_fora_w);
    totalW    += (acc[t].ft.w_casa + acc[t].ft.w_fora);
    totalN    += (acc[t].ft.n_casa + acc[t].ft.n_fora);
  }
  const mediaLigaFT = totalW ? +(totalProW / totalW).toFixed(2) : null;

  return {
    liga,
    jogos_total: jogos.length,
    times_total: times.length,
    media_liga_ft: mediaLigaFT,
    half_life_dias: HALF_LIFE_DIAS,
    data_referencia: dataMax.toISOString().substring(0, 10),
    times: timesOut
  };
}

// Top-N de um critério ("pro_casa", "contra_fora", etc) — para uso no filtro elite
// `rankingDaLiga` é o objeto retornado por calcularRankings(liga) (não wrapper {LIGA:...}).
function topN(rankingDaLiga, criterio, periodo, n, minJogos) {
  if (!rankingDaLiga || !rankingDaLiga.times) return [];
  const lista = Object.entries(rankingDaLiga.times)
    .filter(([_, v]) => {
      const block = v[periodo];
      const valor = block[criterio];
      const ncampo = criterio.includes('casa') ? block.n_casa : block.n_fora;
      return valor !== null && ncampo >= (minJogos || 3);
    })
    .map(([nome, v]) => ({ time: nome, valor: v[periodo][criterio], n: criterio.includes('casa') ? v[periodo].n_casa : v[periodo].n_fora }));
  lista.sort((a, b) => b.valor - a.valor);
  return lista.slice(0, n);
}

function gerarTodos() {
  const out = {};
  for (const l of LIGAS) {
    out[l] = calcularRankings(l);
  }
  return out;
}

// Execução standalone: gera ranking_hdp.json
if (require.main === module) {
  const rankings = gerarTodos();
  const outPath = path.join(__dirname, '..', 'data', '_ranking_hdp.json');
  fs.writeFileSync(outPath, JSON.stringify(rankings, null, 2));

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  RANKINGS HDP — Fase 1');
  console.log('═══════════════════════════════════════════════════════════');
  for (const l of LIGAS) {
    const r = rankings[l];
    console.log(`\n[${l}] ${r.jogos_total} jogos · ${r.times_total} times · média liga ${r.media_liga_ft} cantos FT`);
    console.log('  Top 5 ATACA CASA (FT):');
    topN(rankings[l], 'pro_casa', 'ft', 5, 3).forEach((t, i) =>
      console.log(`    ${i+1}. ${t.time.padEnd(28)} ${t.valor.toFixed(2)} cantos/jogo (n=${t.n})`));
    console.log('  Top 5 CONCEDE FORA (FT):');
    topN(rankings[l], 'contra_fora', 'ft', 5, 3).forEach((t, i) =>
      console.log(`    ${i+1}. ${t.time.padEnd(28)} ${t.valor.toFixed(2)} cantos contra (n=${t.n})`));
  }
  console.log(`\n✅ Salvo: ${outPath}`);
}

module.exports = { calcularRankings, gerarTodos, topN };
