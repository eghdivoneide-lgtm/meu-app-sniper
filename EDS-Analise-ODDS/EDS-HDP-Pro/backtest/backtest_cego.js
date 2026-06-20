// EDS-HDP-Pro · Backtest cego (walk-forward sem leak)
//
// Estratégia: para cada jogo i da liga (após cutoff de aquecimento), recalcula
// rankings usando APENAS jogos anteriores a i e simula o pick Elite. Compara
// com o resultado real de i. Agrega WR/ROI/EDGE por liga, por linha HDP, por tier.
//
// Saída: backtest/_resultado_<timestamp>.json + relatório no console.
//
// Uso:
//   node backtest/backtest_cego.js                    # roda com X atuais
//   node backtest/backtest_cego.js --grid             # grid search de X por liga

const fs = require('fs');
const path = require('path');
const { LIGAS, carregarLiga } = require('../motor/_io');
const { calcularRankings } = require('../motor/ranking_hdp');
const { projetarJogo } = require('../motor/projecao_hdp');
const { X_POR_LIGA } = require('../motor/filtro_elite');

const CUTOFF_AQUECIMENTO = 15; // mínimo de jogos antes de começar backtest
const TOP_N_FRAC = 0.25;       // top 25% (mesmo critério do app — adaptativo)
const MIN_AMOSTRA = 3;
const MIN_WIN_LINHA = 0.55;    // mesmo do filtro Elite atual
const MIN_PICKS_GRID = 5;      // mínimo de picks para o grid considerar uma faixa X

function parseData(s) {
  if (!s) return null;
  const m = String(s).substring(0,10).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  return new Date(+m[3], +m[2]-1, +m[1]);
}

function ordenarPorData(jogos) {
  return jogos.slice().sort((a,b) => {
    const da = parseData(a.data_partida) || new Date(0);
    const db = parseData(b.data_partida) || new Date(0);
    return da - db;
  });
}

// Top-N adaptativo igual ao motor browser
function topNPorRanking(rankings) {
  return Math.max(5, Math.min(10, Math.round(rankings.times_total / 4)));
}

function topN(rankings, criterio, periodo, n, minJogos) {
  const lista = Object.entries(rankings.times)
    .filter(([_, v]) => {
      const block = v[periodo];
      const valor = block[criterio];
      const nc = criterio.includes('casa') ? block.n_casa : block.n_fora;
      return valor !== null && nc >= (minJogos || MIN_AMOSTRA);
    })
    .map(([nome, v]) => ({ time: nome, valor: v[periodo][criterio] }));
  lista.sort((a,b) => b.valor - a.valor);
  return lista.slice(0, n);
}

// Avalia se o pick seria emitido nesse momento histórico.
// modo: 'estrito' = filtro Elite completo (top fav + top azr + diff + prob)
//        'relaxado' = só diff + prob (sem top N) — testa o motor base
function avaliarEliteHist(liga, M, V, rankings, X, modo) {
  modo = modo || 'estrito';
  const proj = projetarJogo(liga, M, V, rankings);
  if (!proj) return null;

  const absDiff = Math.abs(proj.diffFT);
  const linhaRec = proj.linhaFT_rec;
  const probLinha = linhaRec && proj.hdpFT[linhaRec] ? proj.hdpFT[linhaRec].win : 0;

  // Sempre exige diff >= X e prob >= 55%
  if (absDiff < X || probLinha < MIN_WIN_LINHA) return null;

  let favRank = null, azrRank = null;
  if (modo === 'estrito') {
    const N = topNPorRanking(rankings);
    const favoritoEhMandante = proj.favorito === M;
    const topFav = favoritoEhMandante
      ? topN(rankings, 'pro_casa',    'ft', N)
      : topN(rankings, 'pro_fora',    'ft', N);
    const topAzr = favoritoEhMandante
      ? topN(rankings, 'contra_fora', 'ft', N)
      : topN(rankings, 'contra_casa', 'ft', N);
    const favNoTop = topFav.find(t => t.time === proj.favorito);
    const azrNoTop = topAzr.find(t => t.time === proj.azarao);
    if (!favNoTop || !azrNoTop) return null;
    favRank = topFav.indexOf(favNoTop) + 1;
    azrRank = topAzr.indexOf(azrNoTop) + 1;
  }

  const razao = absDiff / X;
  const tier = (razao >= 1.5 && probLinha >= 0.62) ? 'ELITE_NUCLEAR' :
               (razao >= 1.2 && probLinha >= 0.58) ? 'ELITE_FORTE'  : 'ELITE';

  return {
    proj, linhaRec, probLinha, tier, razao,
    favorito: proj.favorito,
    fav_rank: favRank, azr_rank: azrRank
  };
}

// Avalia resultado real do pick contra os cantos do jogo i
function avaliarResultado(pick, jogoReal) {
  const c = jogoReal.estatisticas_ft && jogoReal.estatisticas_ft.cantos;
  if (!c) return null;
  const favoritoEhM = pick.favorito === jogoReal.mandante;
  const cantosFav = favoritoEhM ? c.m : c.v;
  const cantosAzr = favoritoEhM ? c.v : c.m;
  const diffReal  = cantosFav - cantosAzr;

  // pick.linhaRec é negativo (ex: -1.5) — handicap do favorito
  const margem = diffReal + pick.linhaRec;
  const resultado = margem > 0 ? 'V' : margem < 0 ? 'D' : 'R';
  return {
    cantos: c.m + '-' + c.v,
    diff_real: diffReal,
    resultado, // V (win), D (loss), R (push/reembolso)
    margem
  };
}

// Backtest da liga com X dado
function rodarBacktest(liga, X, modo) {
  modo = modo || 'estrito';
  const todos = ordenarPorData(carregarLiga(liga));
  const picks = [];
  for (let i = CUTOFF_AQUECIMENTO; i < todos.length; i++) {
    const jogosAnteriores = todos.slice(0, i);
    const rankings = calcularRankings(liga, jogosAnteriores);
    if (!rankings.times[todos[i].mandante] || !rankings.times[todos[i].visitante]) continue;
    const pick = avaliarEliteHist(liga, todos[i].mandante, todos[i].visitante, rankings, X, modo);
    if (!pick) continue;
    const res = avaliarResultado(pick, todos[i]);
    if (!res) continue;
    picks.push({
      data: (todos[i].data_partida || '').substring(0,10),
      m: todos[i].mandante, v: todos[i].visitante,
      favorito: pick.favorito,
      linha: pick.linhaRec,
      prob_linha: +pick.probLinha.toFixed(3),
      razao: +pick.razao.toFixed(2),
      tier: pick.tier,
      ...res
    });
  }
  return picks;
}

function agregar(picks) {
  if (!picks.length) return { n: 0, V: 0, D: 0, R: 0, wr: 0, wr_sem_push: 0, roi: 0 };
  const V = picks.filter(p => p.resultado === 'V').length;
  const D = picks.filter(p => p.resultado === 'D').length;
  const R = picks.filter(p => p.resultado === 'R').length;
  // Assume odd justa do motor (lucro = stake / probLinha)
  let stakeTotal = 0, retornoTotal = 0;
  for (const p of picks) {
    stakeTotal += 1;
    if (p.resultado === 'V') retornoTotal += 1 / p.prob_linha; // odd justa
    else if (p.resultado === 'R') retornoTotal += 1;
  }
  return {
    n: picks.length, V, D, R,
    wr: +(V / picks.length * 100).toFixed(1),
    wr_sem_push: V + D > 0 ? +(V / (V+D) * 100).toFixed(1) : 0,
    roi: +((retornoTotal - stakeTotal) / stakeTotal * 100).toFixed(1)
  };
}

function relatorio(modo) {
  modo = modo || 'estrito';
  const out = { gerado_em: new Date().toISOString(), modo, ligas: {} };
  const X_ATUAL = X_POR_LIGA;

  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('  BACKTEST CEGO — X atuais — modo ' + modo.toUpperCase());
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('| LIGA  | X   | picks | V  | D  | R | WR%  | WR s/push | ROI%   |');
  console.log('|-------|-----|-------|----|----|---|------|-----------|--------|');

  for (const liga of LIGAS) {
    const X = X_ATUAL[liga] || 2.0;
    const picks = rodarBacktest(liga, X, modo);
    const agg = agregar(picks);
    out.ligas[liga] = { X_atual: X, picks_n: picks.length, agg, picks };
    console.log('| '+liga.padEnd(5)+' | '+String(X).padStart(3)+' | '+
      String(picks.length).padStart(5)+' | '+
      String(agg.V).padStart(2)+' | '+String(agg.D).padStart(2)+' | '+String(agg.R).padStart(1)+' | '+
      String(agg.wr).padStart(4)+' | '+
      String(agg.wr_sem_push).padStart(9)+' | '+
      (agg.roi>=0?'+':'')+String(agg.roi).padStart(6)+' |');
  }

  // Por linha HDP
  console.log('\n═══ WR por linha HDP (agregado todas as ligas) ═══');
  const todosPicks = LIGAS.flatMap(l => out.ligas[l].picks);
  const porLinha = {};
  for (const p of todosPicks) {
    const k = p.linha;
    porLinha[k] = porLinha[k] || [];
    porLinha[k].push(p);
  }
  for (const linha of [-1.0,-1.5,-2.0,-2.5]) {
    const lista = porLinha[linha] || [];
    const a = agregar(lista);
    console.log('  HDP '+linha+': n='+String(a.n).padStart(3)+'  WR='+String(a.wr).padStart(4)+'%  ROI='+(a.roi>=0?'+':'')+a.roi+'%');
  }

  // Por tier
  console.log('\n═══ WR por tier ═══');
  const porTier = {};
  for (const p of todosPicks) { porTier[p.tier] = porTier[p.tier] || []; porTier[p.tier].push(p); }
  for (const tier of ['ELITE','ELITE_FORTE','ELITE_NUCLEAR']) {
    const lista = porTier[tier] || [];
    const a = agregar(lista);
    console.log('  '+tier.padEnd(15)+': n='+String(a.n).padStart(3)+'  WR='+String(a.wr).padStart(4)+'%  ROI='+(a.roi>=0?'+':'')+a.roi+'%');
  }

  return out;
}

function gridSearch(modo) {
  modo = modo || 'estrito';
  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  console.log('  GRID SEARCH — X otimizado por liga — modo ' + modo.toUpperCase());
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('| LIGA  | X otimo | picks | WR%  | ROI%   | X atual | ROI atual |');
  console.log('|-------|---------|-------|------|--------|---------|-----------|');
  const recomendado = {};
  for (const liga of LIGAS) {
    let melhor = null;
    for (let X = 0.5; X <= 3.5; X += 0.25) {
      const picks = rodarBacktest(liga, X, modo);
      const agg = agregar(picks);
      if (picks.length < MIN_PICKS_GRID) continue;
      const score = agg.roi + Math.min(picks.length / 5, 10);
      if (!melhor || score > melhor.score) melhor = { X, agg, picks, score };
    }
    const xAtual = X_POR_LIGA[liga] || 2.0;
    const picksAtuais = rodarBacktest(liga, xAtual, modo);
    const aggAtual = agregar(picksAtuais);
    recomendado[liga] = melhor ? melhor.X : xAtual;
    if (!melhor) {
      console.log('| '+liga.padEnd(5)+' | (amostra insuficiente em todas as faixas) |');
      continue;
    }
    console.log('| '+liga.padEnd(5)+' | '+String(melhor.X).padStart(7)+' | '+
      String(melhor.picks.length).padStart(5)+' | '+
      String(melhor.agg.wr).padStart(4)+' | '+
      (melhor.agg.roi>=0?'+':'')+String(melhor.agg.roi).padStart(6)+' | '+
      String(xAtual).padStart(7)+' | '+
      (aggAtual.roi>=0?'+':'')+String(aggAtual.roi).padStart(9)+' |');
  }
  return recomendado;
}

if (require.main === module) {
  const modo = process.argv.includes('--relaxado') ? 'relaxado' : 'estrito';
  const out = relatorio(modo);
  if (process.argv.includes('--grid')) {
    out.recomendado = gridSearch(modo);
  }
  // Sempre roda o relaxado também (mostra saúde do motor base)
  if (modo === 'estrito') {
    console.log('\n');
    out.relaxado = { agg_ligas: {} };
    const r = relatorio('relaxado');
    for (const l of LIGAS) out.relaxado.agg_ligas[l] = r.ligas[l].agg;
    if (process.argv.includes('--grid')) {
      out.recomendado_relaxado = gridSearch('relaxado');
    }
  }
  const arq = path.join(__dirname, '_resultado_' + new Date().toISOString().substring(0,19).replace(/[:T]/g,'-') + '.json');
  fs.writeFileSync(arq, JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(__dirname, '_resultado_ultimo.json'), JSON.stringify(out, null, 2));
  console.log('\n✅ Salvo: backtest/' + path.basename(arq));
}

module.exports = { rodarBacktest, agregar, relatorio, gridSearch };
