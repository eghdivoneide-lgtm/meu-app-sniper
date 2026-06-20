// EDS-HDP-Pro · Motor (browser)
// Adaptação dos motores Node (projecao_hdp.js + filtro_elite.js) para rodar
// no navegador sem require. Consome window.HDP_BANCO e window.HDP_RANKINGS.

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  //  PARÂMETROS DE CALIBRAÇÃO (DNA preliminar — Fase 5 refina)
  // ═══════════════════════════════════════════════════════════
  const X_POR_LIGA = {
    ARG: 2.5, USL: 2.3, MLS: 2.3, BR: 2.0, BR_B: 2.0, ARG_B: 1.8
  };
  const SHRINK_K = 5;
  const MIN_JOGOS_RANKING = 3;
  // Top-N adaptativo: sempre o quarto superior da liga (mínimo 5, máximo 10)
  function topNPorLiga(liga) {
    const r = getRanking(liga);
    if (!r) return 8;
    return Math.max(5, Math.min(10, Math.round(r.times_total / 4)));
  }
  // Mínimo de jogos por lado para considerar amostra "confiável"
  const MIN_AMOSTRA_CONFIAVEL = 5;

  // ═══════════════════════════════════════════════════════════
  //  POISSON
  // ═══════════════════════════════════════════════════════════
  const _fatCache = [1, 1];
  function fat(n) {
    while (_fatCache.length <= n) _fatCache.push(_fatCache[_fatCache.length - 1] * _fatCache.length);
    return _fatCache[n];
  }
  function poisson(k, lam) {
    if (lam <= 0) return k === 0 ? 1 : 0;
    return Math.exp(-lam) * Math.pow(lam, k) / fat(k);
  }
  function probConjunto(expHome, expAway) {
    const K = 20;
    let pH = 0, pE = 0, pA = 0;
    for (let h = 0; h <= K; h++) {
      const ph = poisson(h, expHome);
      for (let a = 0; a <= K; a++) {
        const pa = poisson(a, expAway);
        const j = ph * pa;
        if (h > a) pH += j;
        else if (h < a) pA += j;
        else pE += j;
      }
    }
    const t = pH + pE + pA;
    return { pH: pH/t, pE: pE/t, pA: pA/t };
  }
  function probHDP(expHome, expAway, linha) {
    const K = 20;
    let win = 0, push = 0, loss = 0;
    for (let h = 0; h <= K; h++) {
      const ph = poisson(h, expHome);
      for (let a = 0; a <= K; a++) {
        const pa = poisson(a, expAway);
        const j = ph * pa;
        const diffAdj = (h - a) + linha;
        if (diffAdj > 0) win += j;
        else if (diffAdj === 0) push += j;
        else loss += j;
      }
    }
    const t = win + push + loss;
    return { win: win/t, push: push/t, loss: loss/t, oddJusta: t / (win + push) };
  }

  // ═══════════════════════════════════════════════════════════
  //  HELPERS DE RANKING
  // ═══════════════════════════════════════════════════════════
  function getRanking(liga) {
    return (global.HDP_RANKINGS || {})[liga] || null;
  }
  function getBanco(liga) {
    return (global.HDP_BANCO || {})[liga] || [];
  }

  // Top-N por critério (criterio: pro_casa/pro_fora/contra_casa/contra_fora, periodo: ft/ht)
  function topN(liga, criterio, periodo, n, minJogos) {
    const r = getRanking(liga);
    if (!r) return [];
    const min = minJogos == null ? MIN_JOGOS_RANKING : minJogos;
    const lista = Object.entries(r.times)
      .filter(([_, v]) => {
        const block = v[periodo];
        const valor = block[criterio];
        const nc = criterio.indexOf('casa') >= 0 ? block.n_casa : block.n_fora;
        return valor !== null && nc >= min;
      })
      .map(([nome, v]) => ({
        time: nome,
        valor: v[periodo][criterio],
        n: criterio.indexOf('casa') >= 0 ? v[periodo].n_casa : v[periodo].n_fora
      }));
    lista.sort((a, b) => b.valor - a.valor);
    return lista.slice(0, n || topNPorLiga(liga));
  }

  // #7 — Ranking de SALDO de cantos por lado (atk - conc)
  // criterioSaldo: 'casa' ou 'fora'
  function topSaldo(liga, ladoLista, periodo, n, minJogos) {
    const r = getRanking(liga);
    if (!r) return [];
    const min = minJogos == null ? MIN_JOGOS_RANKING : minJogos;
    const lado = ladoLista; // 'casa' | 'fora'
    const proKey    = 'pro_'    + lado;
    const contraKey = 'contra_' + lado;
    const nKey      = 'n_'      + lado;

    const lista = Object.entries(r.times)
      .filter(([_, v]) => v[periodo][proKey] != null && v[periodo][nKey] >= min)
      .map(([nome, v]) => {
        const pro = v[periodo][proKey];
        const con = v[periodo][contraKey];
        return {
          time: nome,
          pro:   +pro.toFixed(2),
          contra:+con.toFixed(2),
          saldo: +(pro - con).toFixed(2),
          n:     v[periodo][nKey]
        };
      });
    lista.sort((a, b) => b.saldo - a.saldo);
    return lista.slice(0, n || topNPorLiga(liga));
  }

  // Médias agregadas da liga por lado (para shrinkage)
  function baselinesLiga(liga) {
    const r = getRanking(liga);
    if (!r) return null;
    const acc = {
      ft: { pro_casa: 0, contra_casa: 0, pro_fora: 0, contra_fora: 0, n: 0 },
      ht: { pro_casa: 0, contra_casa: 0, pro_fora: 0, contra_fora: 0, n: 0 }
    };
    for (const t of Object.values(r.times)) {
      if (t.ft.pro_casa != null) {
        acc.ft.pro_casa += t.ft.pro_casa; acc.ft.contra_casa += t.ft.contra_casa;
        acc.ft.pro_fora += t.ft.pro_fora; acc.ft.contra_fora += t.ft.contra_fora;
        acc.ft.n++;
      }
      if (t.ht.pro_casa != null) {
        acc.ht.pro_casa += t.ht.pro_casa; acc.ht.contra_casa += t.ht.contra_casa;
        acc.ht.pro_fora += t.ht.pro_fora; acc.ht.contra_fora += t.ht.contra_fora;
        acc.ht.n++;
      }
    }
    return {
      ft: { pro_casa: acc.ft.pro_casa/acc.ft.n, contra_casa: acc.ft.contra_casa/acc.ft.n, pro_fora: acc.ft.pro_fora/acc.ft.n, contra_fora: acc.ft.contra_fora/acc.ft.n },
      ht: { pro_casa: acc.ht.pro_casa/acc.ht.n, contra_casa: acc.ht.contra_casa/acc.ht.n, pro_fora: acc.ht.pro_fora/acc.ht.n, contra_fora: acc.ht.contra_fora/acc.ht.n }
    };
  }

  function lambdaShrunk(timeVal, n, mediaLiga) {
    if (timeVal == null || n === 0) return mediaLiga;
    return (timeVal * n + mediaLiga * SHRINK_K) / (n + SHRINK_K);
  }

  // ═══════════════════════════════════════════════════════════
  //  PROJEÇÃO DE JOGO
  // ═══════════════════════════════════════════════════════════
  function projetarJogo(liga, M, V) {
    const r = getRanking(liga);
    if (!r) return null;
    const tM = r.times[M], tV = r.times[V];
    if (!tM || !tV) return null;
    const base = baselinesLiga(liga);

    const expHomeFT = (lambdaShrunk(tM.ft.pro_casa, tM.ft.n_casa, base.ft.pro_casa)
                    + lambdaShrunk(tV.ft.contra_fora, tV.ft.n_fora, base.ft.contra_fora)) / 2;
    const expAwayFT = (lambdaShrunk(tV.ft.pro_fora, tV.ft.n_fora, base.ft.pro_fora)
                    + lambdaShrunk(tM.ft.contra_casa, tM.ft.n_casa, base.ft.contra_casa)) / 2;
    const expHomeHT = (lambdaShrunk(tM.ht.pro_casa, tM.ht.n_casa, base.ht.pro_casa)
                    + lambdaShrunk(tV.ht.contra_fora, tV.ht.n_fora, base.ht.contra_fora)) / 2;
    const expAwayHT = (lambdaShrunk(tV.ht.pro_fora, tV.ht.n_fora, base.ht.pro_fora)
                    + lambdaShrunk(tM.ht.contra_casa, tM.ht.n_casa, base.ht.contra_casa)) / 2;

    const probsFT = probConjunto(expHomeFT, expAwayFT);
    const probsHT = probConjunto(expHomeHT, expAwayHT);
    const diffFT = expHomeFT - expAwayFT;
    const diffHT = expHomeHT - expAwayHT;
    const favorito = diffFT >= 0 ? M : V;
    const azarao   = diffFT >= 0 ? V : M;

    const expFav = Math.max(expHomeFT, expAwayFT);
    const expAzr = Math.min(expHomeFT, expAwayFT);
    const expFavHT = Math.max(expHomeHT, expAwayHT);
    const expAzrHT = Math.min(expHomeHT, expAwayHT);

    const hdpFT = {};
    for (const linha of [-1.0, -1.5, -2.0, -2.5]) hdpFT[linha] = probHDP(expFav, expAzr, linha);
    const hdpHT = {};
    for (const linha of [-0.5, -1.0]) hdpHT[linha] = probHDP(expFavHT, expAzrHT, linha);

    return {
      M, V, favorito, azarao,
      expHomeHT: +expHomeHT.toFixed(2), expAwayHT: +expAwayHT.toFixed(2),
      expHomeFT: +expHomeFT.toFixed(2), expAwayFT: +expAwayFT.toFixed(2),
      diffFT: +diffFT.toFixed(2), diffHT: +diffHT.toFixed(2),
      linhaFT_rec: recomendarLinhaFT(Math.abs(diffFT)),
      linhaHT_rec: recomendarLinhaHT(Math.abs(diffHT)),
      probsFT, probsHT,
      oddsJustasFT: { home: 1/probsFT.pH, empate: 1/probsFT.pE, away: 1/probsFT.pA },
      oddsJustasHT: { home: 1/probsHT.pH, empate: 1/probsHT.pE, away: 1/probsHT.pA },
      hdpFT, hdpHT,
      amostras: { M: { casa: tM.ft.n_casa, fora: tM.ft.n_fora }, V: { casa: tV.ft.n_casa, fora: tV.ft.n_fora } }
    };
  }

  function recomendarLinhaFT(absDiff) {
    if (absDiff >= 2.5) return -2.5;
    if (absDiff >= 1.8) return -2.0;
    if (absDiff >= 1.2) return -1.5;
    if (absDiff >= 0.5) return -1.0;
    return null;
  }
  function recomendarLinhaHT(absDiff) {
    if (absDiff >= 1.0) return -1.0;
    if (absDiff >= 0.5) return -0.5;
    return null;
  }

  // ═══════════════════════════════════════════════════════════
  //  FILTRO ELITE
  // ═══════════════════════════════════════════════════════════
  function avaliarElite(liga, M, V, opcoes) {
    opcoes = opcoes || {};
    const N = opcoes.topN || topNPorLiga(liga);
    const X = opcoes.X || X_POR_LIGA[liga] || 2.0;
    const proj = projetarJogo(liga, M, V);
    if (!proj) return null;

    const favoritoEhMandante = proj.favorito === M;
    let topFav, topAzr;
    if (favoritoEhMandante) {
      topFav = topN(liga, 'pro_casa',    'ft', N);
      topAzr = topN(liga, 'contra_fora', 'ft', N);
    } else {
      topFav = topN(liga, 'pro_fora',    'ft', N);
      topAzr = topN(liga, 'contra_casa', 'ft', N);
    }
    const favNoTop = topFav.find(t => t.time === proj.favorito);
    const azrNoTop = topAzr.find(t => t.time === proj.azarao);

    const absDiff = Math.abs(proj.diffFT);
    const razao = absDiff / X;

    // #2 — Filtro Elite agora exige que a linha HDP recomendada tenha WIN >= 55%
    const linhaRec = proj.linhaFT_rec;
    const probLinha = linhaRec && proj.hdpFT[linhaRec] ? proj.hdpFT[linhaRec].win : 0;
    const MIN_WIN_LINHA = 0.55;

    // #6 — Amostra fraca: mandante (lado casa) ou visitante (lado fora) com < 5 jogos
    const amostraMinima = Math.min(proj.amostras.M.casa, proj.amostras.V.fora);
    const amostraFraca = amostraMinima < MIN_AMOSTRA_CONFIAVEL;

    const checks = {
      favorito_no_top:   !!favNoTop,
      azarao_no_top:     !!azrNoTop,
      diff_acima_de_X:   absDiff >= X,
      linha_lucrativa:   probLinha >= MIN_WIN_LINHA
    };
    const passa = checks.favorito_no_top && checks.azarao_no_top &&
                  checks.diff_acima_de_X && checks.linha_lucrativa;

    let tier = null;
    if (passa) {
      if (razao >= 1.5 && probLinha >= 0.62)      tier = 'ELITE_NUCLEAR';
      else if (razao >= 1.2 && probLinha >= 0.58) tier = 'ELITE_FORTE';
      else                                         tier = 'ELITE';
    }

    // ═══════ SELO SNIPER 🎯 — MÃE da rodada ═══════
    // Critérios SIMULTÂNEOS (todos têm que passar):
    //   1. Razão diff/X ≥ 1.5 (forte sinal acima do threshold)
    //   2. WIN linha recomendada ≥ 60%
    //   3. Linha recomendada ∈ {-2.0, -2.5} (paga odd maior, ROI esp. melhor)
    //   4. Amostra mínima ≥ 6 jogos (mandante casa + visitante fora)
    //   5. Saldo do favorito no lado em que joga ≥ +2.5 (dominador real)
    //   6. Forma recente do favorito ≥ 85% da histórica (não em queda forte)
    //   7. Volatilidade do favorito < 4.5 (excluir times caóticos)
    let snipe = false;
    let snipe_motivos = [];
    if (passa && linhaRec != null) {
      const c1 = razao >= 1.5;                  snipe_motivos.push({ k:'razão≥1.5',     ok:c1, v:+razao.toFixed(2) });
      const c2 = probLinha >= 0.60;             snipe_motivos.push({ k:'WIN≥60%',       ok:c2, v:+(probLinha*100).toFixed(1) });
      const c3 = linhaRec === -2.0 || linhaRec === -2.5; snipe_motivos.push({ k:'linha -2/-2.5', ok:c3, v:linhaRec });
      const c4 = amostraMinima >= 6;            snipe_motivos.push({ k:'amostra≥6',     ok:c4, v:amostraMinima });

      // Calcula saldo, forma recente e volatilidade do favorito
      const rankings = getRanking(liga);
      const favStats = rankings && rankings.times[proj.favorito];
      const favEhMandante = proj.favorito === M;
      let saldo = 0, formaOK = true, volOK = true;
      if (favStats) {
        const lado = favEhMandante ? 'casa' : 'fora';
        const pro = favStats.ft['pro_'+lado];
        const con = favStats.ft['contra_'+lado];
        if (pro != null && con != null) saldo = pro - con;
      }
      const c5 = saldo >= 2.5;                  snipe_motivos.push({ k:'saldo fav≥+2.5', ok:c5, v:+saldo.toFixed(2) });

      // Forma recente + volatilidade vêm de perfilTime
      const perfFav = perfilTime(liga, proj.favorito);
      if (perfFav) {
        const fr = perfFav.forma_recente;
        const histPro = fr.media_pro_hist;
        const recPro  = fr.media_pro;
        formaOK = (histPro != null && recPro != null) ? (recPro >= histPro * 0.85) : false;
        volOK = perfFav.desvio_pro < 4.5;
        snipe_motivos.push({ k:'forma rec≥85% hist', ok:formaOK, v:recPro!=null?+recPro.toFixed(2):null });
        snipe_motivos.push({ k:'desvio<4.5',         ok:volOK,   v:+perfFav.desvio_pro.toFixed(2) });
      } else {
        formaOK = false; volOK = false;
        snipe_motivos.push({ k:'perfil indisponível', ok:false, v:null });
      }

      snipe = c1 && c2 && c3 && c4 && c5 && formaOK && volOK;
      if (snipe) tier = 'SNIPER';
    }

    return {
      ...proj,
      X_usado: X, razao: +razao.toFixed(2),
      prob_linha_rec: +probLinha.toFixed(3),
      amostra_minima: amostraMinima,
      amostra_fraca:  amostraFraca,
      checks, passa, tier,
      snipe,
      snipe_motivos,
      favorito_rank_pos: favNoTop ? topFav.indexOf(favNoTop) + 1 : null,
      azarao_rank_pos:   azrNoTop ? topAzr.indexOf(azrNoTop) + 1 : null
    };
  }

  // ═══════════════════════════════════════════════════════════
  //  ESTATÍSTICAS DASHBOARD
  // ═══════════════════════════════════════════════════════════
  function statsLiga(liga) {
    const jogos = getBanco(liga);
    const r = getRanking(liga);
    if (!r) return null;
    let sumTotFT = 0, sumTotHT = 0, sumDiffFT = 0, n = 0, nDominados = 0;
    for (const j of jogos) {
      const c = j.estatisticas_ft && j.estatisticas_ft.cantos;
      const ch = j.estatisticas_ht && j.estatisticas_ht.cantos;
      if (!c || c.m == null) continue;
      sumTotFT += (c.m + c.v);
      sumDiffFT += Math.abs(c.m - c.v);
      if (Math.abs(c.m - c.v) >= 3) nDominados++;
      if (ch && ch.m != null) sumTotHT += (ch.m + ch.v);
      n++;
    }
    const timesComBase = Object.values(r.times).filter(t => (t.ft.n_casa + t.ft.n_fora) >= 3).length;
    return {
      jogos_n: jogos.length,
      n_ricos: n,
      media_total_ft: n ? sumTotFT/n : 0,
      media_total_ht: n ? sumTotHT/n : 0,
      diff_media_ft: n ? sumDiffFT/n : 0,
      pct_dominados: n ? nDominados/n*100 : 0,
      times_total: r.times_total,
      times_com_base: timesComBase
    };
  }

  // Lista de jogos mais recentes da liga (ordem desc por data)
  function ultimosJogos(liga, limite) {
    const jogos = getBanco(liga).slice();
    jogos.sort((a, b) => {
      const da = (a.data_partida || '').split('.').reverse().join('');
      const db = (b.data_partida || '').split('.').reverse().join('');
      return db.localeCompare(da);
    });
    return jogos.slice(0, limite || 10);
  }

  // Perfil completo de um time (Por Time) — agora com histograma + forma recente
  function perfilTime(liga, time) {
    const r = getRanking(liga);
    if (!r || !r.times[time]) return null;
    const jogos = getBanco(liga).filter(j => j.mandante === time || j.visitante === time);
    // Ordena por data (mais recente primeiro)
    jogos.sort((a, b) => {
      const da = parseData(a.data_partida);
      const db = parseData(b.data_partida);
      return (db || 0) - (da || 0);
    });
    const t = r.times[time];

    // HDP histórico (quando favorito em casa)
    let asFavCasa = 0, hdpBatidos = { '-1': 0, '-1.5': 0, '-2': 0, '-2.5': 0 };
    for (const j of jogos.filter(x => x.mandante === time)) {
      const c = j.estatisticas_ft && j.estatisticas_ft.cantos;
      if (!c) continue;
      const diff = c.m - c.v;
      if (diff > 0) {
        asFavCasa++;
        if (diff > 1)   hdpBatidos['-1']++;
        if (diff > 1.5) hdpBatidos['-1.5']++;
        if (diff > 2)   hdpBatidos['-2']++;
        if (diff > 2.5) hdpBatidos['-2.5']++;
      }
    }

    // #4 — Histograma de cantos PRÓ por jogo (qualquer lado)
    const histograma = {}; // bucket → count
    let somaPro = 0, somaSqr = 0, nPro = 0;
    for (const j of jogos) {
      const c = j.estatisticas_ft && j.estatisticas_ft.cantos;
      if (!c) continue;
      const pro = j.mandante === time ? c.m : c.v;
      somaPro += pro; somaSqr += pro * pro; nPro++;
      const bucket = pro <= 1 ? '0-1' : pro <= 3 ? '2-3' : pro <= 5 ? '4-5' : pro <= 7 ? '6-7' : pro <= 9 ? '8-9' : '10+';
      histograma[bucket] = (histograma[bucket] || 0) + 1;
    }
    const mediaPro = nPro ? somaPro / nPro : 0;
    const varPro   = nPro ? (somaSqr / nPro - mediaPro * mediaPro) : 0;
    const desvio   = Math.sqrt(Math.max(0, varPro));

    // #4 — Forma recente (últimos 5 vs histórico geral)
    const ultimos5 = jogos.slice(0, 5);
    let proRec = 0, conRec = 0, nRec = 0;
    for (const j of ultimos5) {
      const c = j.estatisticas_ft && j.estatisticas_ft.cantos;
      if (!c) continue;
      if (j.mandante === time) { proRec += c.m; conRec += c.v; }
      else                     { proRec += c.v; conRec += c.m; }
      nRec++;
    }
    const proRecMed = nRec ? proRec / nRec : null;
    const conRecMed = nRec ? conRec / nRec : null;
    const mediaProHist = (t.ft.pro_casa != null && t.ft.pro_fora != null)
      ? (t.ft.pro_casa * t.ft.n_casa + t.ft.pro_fora * t.ft.n_fora) / (t.ft.n_casa + t.ft.n_fora) : null;
    const mediaConHist = (t.ft.contra_casa != null && t.ft.contra_fora != null)
      ? (t.ft.contra_casa * t.ft.n_casa + t.ft.contra_fora * t.ft.n_fora) / (t.ft.n_casa + t.ft.n_fora) : null;

    return {
      time, liga, ranking: t,
      n_jogos: jogos.length,
      jogos: jogos.slice(0, 10),     // últimos 10
      hdp_historico: hdpBatidos,
      n_como_fav_casa: asFavCasa,
      // novo
      histograma,
      n_pro: nPro,
      media_pro: +mediaPro.toFixed(2),
      desvio_pro: +desvio.toFixed(2),
      forma_recente: {
        n: nRec,
        media_pro: proRecMed != null ? +proRecMed.toFixed(2) : null,
        media_con: conRecMed != null ? +conRecMed.toFixed(2) : null,
        media_pro_hist: mediaProHist != null ? +mediaProHist.toFixed(2) : null,
        media_con_hist: mediaConHist != null ? +mediaConHist.toFixed(2) : null
      }
    };
  }

  function parseData(s) {
    if (!s) return null;
    const m = String(s).substring(0, 10).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1]);
  }

  // ═══════════════════════════════════════════════════════════
  //  EXPORT GLOBAL
  // ═══════════════════════════════════════════════════════════
  global.HDP_MOTOR = {
    X_POR_LIGA,
    topNPorLiga,
    projetarJogo, avaliarElite,
    topN, topSaldo, baselinesLiga,
    statsLiga, ultimosJogos, perfilTime,
    getBanco, getRanking,
    poisson, probConjunto, probHDP
  };
})(window);
