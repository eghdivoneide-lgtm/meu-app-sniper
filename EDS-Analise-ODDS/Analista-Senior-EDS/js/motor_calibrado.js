// ════════════════════════════════════════════════════════════════════
// ANALISTA SENIOR EDS — Motor Calibrado (browser)
//
// Replica a lógica do motor calibrado de auditoria_linha_calibrada.js
// em JavaScript de browser, usando data/*.js já carregados como
// window.DADOS_<LIGA>.
//
// 4 evidências ponderadas → prob 0-100.
// ════════════════════════════════════════════════════════════════════

(function (global) {
  'use strict';

  // ── Cantos FT a partir de um jogo do data/*.js
  function cantosFT(j) {
    const c = j && j.estatisticas_ft && j.estatisticas_ft.cantos;
    if (!c || typeof c.m !== 'number' || typeof c.v !== 'number') return null;
    return c;
  }

  // ── Pct dos jogos do TIME (casa/fora) que satisfazem condição em cantos
  function pctTimeCondicao(jogosLiga, nomeTime, ondeJoga, cond) {
    let validos = 0, ok = 0;
    for (const j of jogosLiga) {
      const c = cantosFT(j);
      if (!c) continue;
      if (ondeJoga === 'casa' && j.mandante !== nomeTime)   continue;
      if (ondeJoga === 'fora' && j.visitante !== nomeTime)  continue;
      validos++;
      if (cond(c.m + c.v)) ok++;
    }
    return { pct: validos > 0 ? +(ok / validos * 100).toFixed(1) : 0, n: validos };
  }

  function pctLigaCondicao(jogosLiga, cond) {
    let validos = 0, ok = 0;
    for (const j of jogosLiga) {
      const c = cantosFT(j);
      if (!c) continue;
      validos++;
      if (cond(c.m + c.v)) ok++;
    }
    return { pct: validos > 0 ? +(ok / validos * 100).toFixed(1) : 0, n: validos };
  }

  // ── H2H entre dois times
  function pctH2HCondicao(jogosLiga, timeA, timeB, cond) {
    let validos = 0, ok = 0;
    for (const j of jogosLiga) {
      const ehAB = j.mandante === timeA && j.visitante === timeB;
      const ehBA = j.mandante === timeB && j.visitante === timeA;
      if (!ehAB && !ehBA) continue;
      const c = cantosFT(j);
      if (!c) continue;
      validos++;
      if (cond(c.m + c.v)) ok++;
    }
    if (validos === 0) return null;
    return { pct: +(ok / validos * 100).toFixed(1), n: validos };
  }

  // ── Núcleo: prob calibrada para uma condição de cantos
  function probCalibrada(jogosLiga, mandante, visitante, condicao) {
    const e1 = pctTimeCondicao(jogosLiga, mandante,  'casa', condicao);
    const e2 = pctTimeCondicao(jogosLiga, visitante, 'fora', condicao);
    const e3 = pctLigaCondicao(jogosLiga, condicao);
    const e4 = pctH2HCondicao(jogosLiga, mandante, visitante, condicao);

    const evs = [
      { nome: 'mandante em casa',  score: e1.pct, peso: 30, n: e1.n },
      { nome: 'visitante fora',    score: e2.pct, peso: 25, n: e2.n },
      { nome: 'liga geral',        score: e3.pct, peso: 15, n: e3.n }
    ];
    if (e4) evs.push({ nome: 'H2H', score: e4.pct, peso: 10, n: e4.n });

    const somaPeso = evs.reduce((s, e) => s + e.peso, 0);
    const somaPond = evs.reduce((s, e) => s + e.score * e.peso, 0);
    const prob = Math.round(somaPond / somaPeso);

    return { prob, evidencias: evs };
  }

  // ── Estatísticas básicas do time para o card (R4 EDS — contexto completo)
  function statsTime(jogosLiga, nomeTime, ondeJoga) {
    let n = 0, somaTotal = 0;
    const totais = [];
    for (const j of jogosLiga) {
      const c = cantosFT(j);
      if (!c) continue;
      if (ondeJoga === 'casa' && j.mandante !== nomeTime)  continue;
      if (ondeJoga === 'fora' && j.visitante !== nomeTime) continue;
      const t = c.m + c.v;
      somaTotal += t;
      totais.push(t);
      n++;
    }
    if (n === 0) return { n: 0, media: null, dp: null };
    const media = somaTotal / n;
    const dp = Math.sqrt(totais.reduce((s, x) => s + (x - media) ** 2, 0) / n);
    return { n, media: +media.toFixed(2), dp: +dp.toFixed(2) };
  }

  // ── Veredicto baseado em prob + amostra (R5+R8 EDS)
  function veredicto(prob, amostraMin) {
    // amostraMin = menor n entre time mandante (casa) e visitante (fora)
    if (amostraMin < 3)    return { tag: 'EVITAR',     emoji: '🔴', motivo: `amostra crítica (n=${amostraMin} < 3) — R5`,    cor: 'red' };
    if (amostraMin < 5)    return { tag: 'EVITAR',     emoji: '🔴', motivo: `amostra crítica (n=${amostraMin} < 5) — R8`,    cor: 'red' };
    if (amostraMin < 10)   {
      if (prob >= 75) return { tag: 'VIGILÂNCIA', emoji: '🟡', motivo: `amostra amarela (n=${amostraMin}) + prob ${prob}%`, cor: 'yellow' };
      return { tag: 'EVITAR',     emoji: '🔴', motivo: `amostra fraca (n=${amostraMin}) + prob ${prob}%`,                  cor: 'red' };
    }
    if (prob >= 75)        return { tag: 'ELITE',       emoji: '🟢', motivo: `zona dourada (prob ${prob}% ≥ 75)`,             cor: 'green' };
    if (prob >= 60)        return { tag: 'VIGILÂNCIA',  emoji: '🟡', motivo: `prob ${prob}% (60-74 = zona vigilância)`,       cor: 'yellow' };
    return { tag: 'EVITAR', emoji: '🔴', motivo: `prob ${prob}% < 60`, cor: 'red' };
  }

  // ── API pública: analisa um jogo nos 2 mercados (UNDER + OVER calibrados)
  function analisarJogo(ligaCod, mandante, visitante) {
    const ligaConfig = global.LIGAS_DATA[ligaCod];
    if (!ligaConfig) return { erro: 'liga desconhecida: ' + ligaCod };
    const jogos = ligaConfig.jogos;
    if (!jogos || !jogos.length) return { erro: 'sem jogos na base para ' + ligaCod };

    const cal = global.LINHAS_CALIBRADAS.ligas[ligaCod];
    if (!cal || cal.erro) return { erro: 'sem calibração para ' + ligaCod };

    const linhaU = cal.linha_under_calibrada;
    const linhaO = cal.linha_over_calibrada;

    const under = probCalibrada(jogos, mandante, visitante, t => t < linhaU);
    const over  = probCalibrada(jogos, mandante, visitante, t => t > linhaO);

    const statsM = statsTime(jogos, mandante,  'casa');
    const statsV = statsTime(jogos, visitante, 'fora');
    const amostraMin = Math.min(statsM.n, statsV.n);

    return {
      liga: ligaCod,
      mandante, visitante,
      stats: { mandanteCasa: statsM, visitanteFora: statsV, mediaLiga: cal.media_cantos_FT, dpLiga: cal.dp_cantos_FT, n_liga: cal.n_jogos },
      under: {
        linha:      linhaU,
        prob:       under.prob,
        evidencias: under.evidencias,
        veredicto:  veredicto(under.prob, amostraMin)
      },
      over: {
        linha:      linhaO,
        prob:       over.prob,
        evidencias: over.evidencias,
        veredicto:  veredicto(over.prob, amostraMin)
      }
    };
  }

  global.MotorCalibrado = { analisarJogo, probCalibrada, statsTime, cantosFT };
})(window);
