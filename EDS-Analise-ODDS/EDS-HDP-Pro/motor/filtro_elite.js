// EDS-HDP-Pro · Filtro ELITE
//
// Critério (alinhado com o operador em 24/05/2026):
//   ELITE = (favorito ∈ Top-N "ataca cantos no lado em que joga")
//         ∧ (azarão  ∈ Top-N "concede cantos no lado em que joga")
//         ∧ (|expHomeFT - expAwayFT| ≥ X cantos, X calibrado por liga)
//
// Tier intra-ELITE (pela razão diff/X):
//   - ELITE_NUCLEAR : razão ≥ 1.5
//   - ELITE_FORTE   : razão ≥ 1.2
//   - ELITE         : razão ≥ 1.0

const { calcularRankings, topN } = require('./ranking_hdp');
const { projetarJogo } = require('./projecao_hdp');
const { carregarLiga } = require('./_io');

// Thresholds X por liga — DNA preliminar (Fase 0); calibração final na Fase 5
const X_POR_LIGA = {
  ARG:   2.5,
  USL:   2.3,
  MLS:   2.3,
  BR:    2.0,
  BR_B:  2.0,
  ARG_B: 1.8
};

// Top-N inicial — 8 times (1/3 da liga típica de 20-30 times)
const TOP_N_DEFAULT = 8;

// Mínimo de jogos pra entrar no ranking (evitar Top com 1-2 jogos só)
const MIN_JOGOS_RANKING = 3;

function avaliarJogo(liga, M, V, rankings, opcoes = {}) {
  const N = opcoes.topN || TOP_N_DEFAULT;
  const X = opcoes.X || X_POR_LIGA[liga] || 2.0;

  const proj = projetarJogo(liga, M, V, rankings);
  if (!proj) return null;

  const favoritoEhMandante = proj.favorito === M;

  // Critério de ranking ataca/concede
  // Se favorito é mandante: ele precisa atacar bem EM CASA; azarão precisa conceder bem FORA
  // Se favorito é visitante: ele precisa atacar bem FORA; azarão precisa conceder bem EM CASA
  let topFav, topAzr;
  if (favoritoEhMandante) {
    topFav = topN(rankings, 'pro_casa',    'ft', N, MIN_JOGOS_RANKING);
    topAzr = topN(rankings, 'contra_fora', 'ft', N, MIN_JOGOS_RANKING);
  } else {
    topFav = topN(rankings, 'pro_fora',    'ft', N, MIN_JOGOS_RANKING);
    topAzr = topN(rankings, 'contra_casa', 'ft', N, MIN_JOGOS_RANKING);
  }
  const favNoTop = topFav.find(t => t.time === proj.favorito);
  const azrNoTop = topAzr.find(t => t.time === proj.azarao);

  const absDiff = Math.abs(proj.diffFT);
  const razao = absDiff / X;

  const checks = {
    favorito_no_top: !!favNoTop,
    azarao_no_top:   !!azrNoTop,
    diff_acima_de_X: absDiff >= X
  };
  const passa = checks.favorito_no_top && checks.azarao_no_top && checks.diff_acima_de_X;

  let tier = null;
  if (passa) {
    if (razao >= 1.5)      tier = 'ELITE_NUCLEAR';
    else if (razao >= 1.2) tier = 'ELITE_FORTE';
    else                   tier = 'ELITE';
  }

  return {
    liga, M, V,
    favorito: proj.favorito, azarao: proj.azarao,
    diffFT: proj.diffFT, expHomeFT: proj.expHomeFT, expAwayFT: proj.expAwayFT,
    linhaFT_rec: proj.linhaFT_rec, linhaHT_rec: proj.linhaHT_rec,
    probsFT: proj.probsFT, oddsJustasFT: proj.oddsJustasFT,
    hdpFT: proj.hdpFT, hdpHT: proj.hdpHT,
    X_usado: X, razao: +razao.toFixed(2),
    checks,
    favorito_rank_pos: favNoTop ? topFav.indexOf(favNoTop) + 1 : null,
    azarao_rank_pos:   azrNoTop ? topAzr.indexOf(azrNoTop) + 1 : null,
    tier, passa,
    amostras: proj.amostras
  };
}

function avaliarLote(liga, confrontos, opcoes = {}) {
  const rankings = calcularRankings(liga);
  const todos = confrontos.map(c => avaliarJogo(liga, c.m, c.v, rankings, opcoes)).filter(Boolean);
  const elite = todos.filter(t => t.passa);
  return { liga, total: todos.length, elite_n: elite.length, todos, elite };
}

// Smoke test: pega 5 pares aleatórios de cada liga e avalia
if (require.main === module) {
  const { LIGAS, timesDaLiga } = require('./_io');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  FILTRO ELITE — Fase 1 (smoke test, 5 confrontos por liga)');
  console.log('═══════════════════════════════════════════════════════════');
  for (const liga of LIGAS) {
    const jogos = carregarLiga(liga);
    const times = timesDaLiga(jogos);
    if (times.length < 4) { console.log(`\n[${liga}] amostra insuficiente`); continue; }

    // Pega 8 confrontos pseudo-aleatórios mas determinísticos
    const confrontos = [];
    const N = Math.min(8, Math.floor(times.length / 2));
    for (let i = 0; i < N; i++) {
      confrontos.push({ m: times[i*2 % times.length], v: times[(i*2+3) % times.length] });
    }
    const r = avaliarLote(liga, confrontos);
    console.log(`\n══ ${liga} ══   X=${X_POR_LIGA[liga]}  ·  ${r.elite_n}/${r.total} passariam em ELITE`);
    for (const a of r.todos) {
      const status = a.passa ? `✅ ${a.tier}` : '❌';
      console.log(`  ${status.padEnd(20)} ${a.M.substring(0,18).padEnd(20)} × ${a.V.substring(0,18).padEnd(20)} diff ${a.diffFT.toString().padStart(5)} (X=${a.X_usado}, razão=${a.razao})  fav#${a.favorito_rank_pos||'-'} azr#${a.azarao_rank_pos||'-'}`);
    }
  }
  console.log('\n✅ Smoke test concluído');
}

module.exports = { avaliarJogo, avaliarLote, X_POR_LIGA, TOP_N_DEFAULT };
