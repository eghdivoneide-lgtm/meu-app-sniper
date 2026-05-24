// ════════════════════════════════════════════════════════════════════
// CÉREBRO DO ESPECIALISTA
//
// Estrutura de conhecimento PERMANENTE do Auditor Supremo.
// Pré-computa, indexa e cataloga TUDO que o agente precisa saber:
//   - DNA de cada liga (baseline, distribuições, % de cada faixa)
//   - Perfil 360° de cada time (mandante, visitante, geral, padrões)
//   - H2H catalogado de cada par
//   - Rankings (top mandantes em HDP, top times under-friendly, etc)
//   - Insights derivados (anomalias, padrões fortes)
//
// O cérebro é gerado uma vez e consultado pelo agente. Atualiza-se
// quando novos dados chegam.
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { perfilTimeCompleto, statsH2H, statsLiga, cantosFT, media, desvioPadrao, arred } = require('./stats');
const { LIGAS_ATIVAS } = require('../config');

const PASTA_CEREBRO = path.join(__dirname, '..', 'cerebro');
if (!fs.existsSync(PASTA_CEREBRO)) fs.mkdirSync(PASTA_CEREBRO, { recursive: true });

// ────────────────────────────────────────────────────────────────────
// EXTRA: estatísticas de distribuição da liga (não só média)
// ────────────────────────────────────────────────────────────────────
function distribuicaoLiga(jogos) {
  const validos = jogos.filter(j => cantosFT(j));
  if (validos.length === 0) return null;

  const totais     = validos.map(j => cantosFT(j).total);
  const dif_abs    = validos.map(j => Math.abs(cantosFT(j).diferencial_m_v));

  // Buckets de total de cantos
  const buckets = { '0-5': 0, '6-7': 0, '8-9': 0, '10-11': 0, '12-13': 0, '14+': 0 };
  for (const t of totais) {
    if      (t <= 5)  buckets['0-5']++;
    else if (t <= 7)  buckets['6-7']++;
    else if (t <= 9)  buckets['8-9']++;
    else if (t <= 11) buckets['10-11']++;
    else if (t <= 13) buckets['12-13']++;
    else              buckets['14+']++;
  }
  // Converte pra percentuais
  const dist = {};
  const n = totais.length;
  for (const k of Object.keys(buckets)) dist[k] = arred((buckets[k] / n) * 100, 1);

  return {
    n_jogos:        n,
    media:          arred(media(totais), 2),
    dp:             arred(desvioPadrao(totais), 2),
    mediana:        arred([...totais].sort((a,b)=>a-b)[Math.floor(n/2)], 1),
    min:            Math.min(...totais),
    max:            Math.max(...totais),
    distribuicao:   dist,
    pct_under_8:    arred((totais.filter(t => t < 8).length / n) * 100, 1),
    pct_under_9:    arred((totais.filter(t => t < 9).length / n) * 100, 1),
    pct_under_10:   arred((totais.filter(t => t <10).length / n) * 100, 1),
    pct_over_10:    arred((totais.filter(t => t >10).length / n) * 100, 1),
    pct_over_11:    arred((totais.filter(t => t >11).length / n) * 100, 1),
    pct_dif_4_mais: arred((dif_abs.filter(d => d >= 4).length / n) * 100, 1),
    pct_dif_5_mais: arred((dif_abs.filter(d => d >= 5).length / n) * 100, 1)
  };
}

// ────────────────────────────────────────────────────────────────────
// Insights de uma LIGA
// ────────────────────────────────────────────────────────────────────
function insightsLiga(distribLiga) {
  const ins = [];
  if (!distribLiga) return ins;
  if (distribLiga.media <= 8.5)            ins.push('🛡️ Liga DEFENSIVA — média baixa de cantos (' + distribLiga.media + ')');
  if (distribLiga.media >= 10.5)           ins.push('⚔️ Liga OFENSIVA — média alta de cantos (' + distribLiga.media + ')');
  if (distribLiga.pct_under_9 >= 45)       ins.push('🟢 Mercado UNDER 9 favorável — ' + distribLiga.pct_under_9 + '% dos jogos abaixo de 9');
  if (distribLiga.pct_dif_4_mais >= 40)    ins.push('🟢 Mercado HDP -3.5 favorável — ' + distribLiga.pct_dif_4_mais + '% dos jogos com dif≥4');
  if (distribLiga.dp >= 4)                 ins.push('⚠️ Liga VOLÁTIL — DP ' + distribLiga.dp + ' (cuidado com previsões)');
  if (distribLiga.dp <= 2.8)               ins.push('✓ Liga PREVISÍVEL — DP ' + distribLiga.dp + ' baixo');
  return ins;
}

// ────────────────────────────────────────────────────────────────────
// Insights de um TIME
// ────────────────────────────────────────────────────────────────────
function insightsTime(perfil, dnaEscoteiro = {}) {
  const ins = [];
  const m = perfil.mandante, v = perfil.visitante, g = perfil.geral;

  // Mandante dominante em cantos
  if (m && m.diferencial_media >= 4 && m.pct_diferencial_4_mais >= 50) {
    ins.push(`🏠💪 MANDANTE DOMINANTE — dif média casa ${m.diferencial_media}, ${m.pct_diferencial_4_mais}% jogos com dif≥4`);
  }
  // Mandante "fechado" — baixos cantos em casa
  if (m && m.total_media <= 8 && m.pct_total_under_9 >= 55) {
    ins.push(`🏠🛡️ MANDANTE CONTROLA RITMO — ${m.pct_total_under_9}% dos jogos casa com <9 cantos`);
  }
  // Visitante explosivo
  if (v && v.diferencial_media >= 3 && v.pct_diferencial_4_mais >= 40) {
    ins.push(`✈️🔥 VISITANTE EXPLOSIVO — domina mesmo fora (dif fora ${v.diferencial_media})`);
  }
  // Visitante "muro" — sofre poucos cantos fora
  if (v && v.total_media <= 8 && v.pct_total_under_9 >= 55) {
    ins.push(`✈️🧱 VISITANTE MURO — ${v.pct_total_under_9}% jogos fora com <9 cantos`);
  }
  // Time errático
  if (g && g.total_dp >= 4) {
    ins.push(`⚠️ ERRÁTICO — DP total ${g.total_dp} (alta variância)`);
  }
  // Time previsível
  if (g && g.total_dp <= 2.5) {
    ins.push(`✓ PREVISÍVEL — DP total ${g.total_dp} baixo`);
  }
  // Notas do DNA escoteiro
  if (dnaEscoteiro.notas) ins.push(...dnaEscoteiro.notas);

  return ins;
}

// ────────────────────────────────────────────────────────────────────
// CONSTRUIR CÉREBRO COMPLETO
// ────────────────────────────────────────────────────────────────────
function construirCerebro(base, opts = { logProgresso: true }) {
  const inicioMs = Date.now();
  const log = (msg) => { if (opts.logProgresso) console.log(msg); };

  const cerebro = {
    versao:    '1.0',
    geradoEm:  new Date().toISOString(),
    modo:      base.modo,
    ligasAtivas: LIGAS_ATIVAS.map(l => l.codigo),
    ligas:     {},
    rankings:  {
      top_mandantes_dominadores:        [],   // melhores HDP_M
      top_visitantes_dominadores:       [],   // melhores HDP_V
      top_mandantes_under_friendly:     [],   // melhores Under em casa
      top_visitantes_under_friendly:    [],   // melhores Under fora
      times_evitados_alta_volatilidade: [],   // erráticos extremos
      pares_h2h_mais_consistentes:      []    // H2H com baixo range
    },
    estatisticasGerais: { totalJogosCobertos: 0, totalTimes: 0, totalH2H: 0 }
  };

  log('🧠 Construindo cérebro do Auditor Supremo...\n');

  // ── 1. Para cada LIGA ──────────────────────────────────────────────
  for (const cod of Object.keys(base.ligas)) {
    const L = base.ligas[cod];
    if (L.erro) continue;

    log('  ▸ ' + cod.padEnd(6) + ' — ' + L.times.length + ' times, ' + L.jogos.length + ' jogos');

    const dnaLiga = base.dna[L.dnaKey] || {};
    const distrib = distribuicaoLiga(L.jogos);
    const baseline= statsLiga(L.jogos);
    const insLiga = insightsLiga(distrib);

    const ligaCerebro = {
      codigo:     cod,
      nome:       L.nome,
      ultAtualiz: L.ultimaAtualizacao,
      n_jogos:    L.jogos.length,
      n_times:    L.times.length,
      baseline,
      distribuicao: distrib,
      insights:     insLiga,
      times:        {},
      h2h:          {}
    };
    cerebro.estatisticasGerais.totalJogosCobertos += L.jogos.length;
    cerebro.estatisticasGerais.totalTimes        += L.times.length;

    // ── 2. Para cada TIME da liga ────────────────────────────────────
    for (const t of L.times) {
      const perfil = perfilTimeCompleto(L.jogos, t);
      const dnaT   = dnaLiga[t] || {};

      const insT   = insightsTime(perfil, dnaT);

      ligaCerebro.times[t] = {
        nome:    t,
        geral:   perfil.geral,
        mandante:perfil.mandante,
        visitante: perfil.visitante,
        dna_escoteiro: dnaT,
        insights: insT
      };

      // ── Acumula rankings globais ───────────────────────────────────
      const m = perfil.mandante, v = perfil.visitante, g = perfil.geral;
      if (m && m.n_jogos >= 4) {
        if (m.diferencial_media >= 3 && m.pct_diferencial_4_mais >= 40) {
          cerebro.rankings.top_mandantes_dominadores.push({
            time: t, liga: cod,
            dif_media: m.diferencial_media,
            pct_dif_4_mais: m.pct_diferencial_4_mais,
            n_jogos: m.n_jogos
          });
        }
        if (m.total_media <= 8.5 && m.pct_total_under_9 >= 50) {
          cerebro.rankings.top_mandantes_under_friendly.push({
            time: t, liga: cod,
            total_media: m.total_media,
            pct_under_9: m.pct_total_under_9,
            n_jogos: m.n_jogos
          });
        }
      }
      if (v && v.n_jogos >= 4) {
        if (v.diferencial_media >= 2 && v.pct_diferencial_4_mais >= 30) {
          cerebro.rankings.top_visitantes_dominadores.push({
            time: t, liga: cod,
            dif_media: v.diferencial_media,
            pct_dif_4_mais: v.pct_diferencial_4_mais,
            n_jogos: v.n_jogos
          });
        }
        if (v.total_media <= 8.5 && v.pct_total_under_9 >= 50) {
          cerebro.rankings.top_visitantes_under_friendly.push({
            time: t, liga: cod,
            total_media: v.total_media,
            pct_under_9: v.pct_total_under_9,
            n_jogos: v.n_jogos
          });
        }
      }
      if (g && g.total_dp >= 4.5) {
        cerebro.rankings.times_evitados_alta_volatilidade.push({
          time: t, liga: cod, total_dp: g.total_dp, n_jogos: g.n_jogos
        });
      }
    }

    // ── 3. Para cada PAR H2H ─────────────────────────────────────────
    for (let i = 0; i < L.times.length; i++) {
      for (let j = i + 1; j < L.times.length; j++) {
        const tA = L.times[i], tB = L.times[j];
        const sH = statsH2H(L.jogos, tA, tB);
        if (sH.n_confrontos === 0) continue;
        const k = tA + ' x ' + tB;
        ligaCerebro.h2h[k] = {
          timeA: tA, timeB: tB,
          n_confrontos: sH.n_confrontos,
          total_media:  sH.total_media,
          total_dp:     sH.total_dp,
          total_range:  sH.total_range,
          dif_media_A:  sH.diferencial_media_A,
          confrontos:   sH.confrontos_detalhe
        };
        cerebro.estatisticasGerais.totalH2H++;

        // Pares H2H consistentes (pra futuro ranking)
        if (sH.n_confrontos >= 3 && sH.total_dp <= 2.0) {
          cerebro.rankings.pares_h2h_mais_consistentes.push({
            par: k, liga: cod, n: sH.n_confrontos,
            total_media: sH.total_media, total_dp: sH.total_dp
          });
        }
      }
    }

    cerebro.ligas[cod] = ligaCerebro;
  }

  // ── Ordena rankings ────────────────────────────────────────────────
  cerebro.rankings.top_mandantes_dominadores.sort((a, b) => b.dif_media - a.dif_media);
  cerebro.rankings.top_visitantes_dominadores.sort((a, b) => b.dif_media - a.dif_media);
  cerebro.rankings.top_mandantes_under_friendly.sort((a, b) => a.total_media - b.total_media);
  cerebro.rankings.top_visitantes_under_friendly.sort((a, b) => a.total_media - b.total_media);
  cerebro.rankings.times_evitados_alta_volatilidade.sort((a, b) => b.total_dp - a.total_dp);
  cerebro.rankings.pares_h2h_mais_consistentes.sort((a, b) => a.total_dp - b.total_dp);

  cerebro.duracaoMs = Date.now() - inicioMs;

  log('\n✅ Cérebro construído em ' + cerebro.duracaoMs + 'ms');
  log('   Ligas: ' + Object.keys(cerebro.ligas).length);
  log('   Times catalogados: ' + cerebro.estatisticasGerais.totalTimes);
  log('   Jogos cobertos: ' + cerebro.estatisticasGerais.totalJogosCobertos);
  log('   Pares H2H catalogados: ' + cerebro.estatisticasGerais.totalH2H);
  log('   Mandantes dominadores: ' + cerebro.rankings.top_mandantes_dominadores.length);
  log('   Visitantes dominadores: ' + cerebro.rankings.top_visitantes_dominadores.length);
  log('   Mandantes under-friendly: ' + cerebro.rankings.top_mandantes_under_friendly.length);
  log('   Visitantes under-friendly: ' + cerebro.rankings.top_visitantes_under_friendly.length);

  return cerebro;
}

// ────────────────────────────────────────────────────────────────────
// SALVAR CÉREBRO em disco
// ────────────────────────────────────────────────────────────────────
function salvarCerebro(cerebro, opts = {}) {
  const dataStr = (cerebro.geradoEm || '').slice(0, 10);
  const arquivoVersao = path.join(PASTA_CEREBRO, `cerebro_${dataStr}.json`);
  const arquivoAtual  = path.join(PASTA_CEREBRO, 'cerebro_atual.json');
  fs.writeFileSync(arquivoVersao, JSON.stringify(cerebro, null, 2));
  fs.writeFileSync(arquivoAtual,  JSON.stringify(cerebro, null, 2));
  return { arquivoVersao, arquivoAtual };
}

// ────────────────────────────────────────────────────────────────────
// CARREGAR CÉREBRO ATUAL (se existir)
// ────────────────────────────────────────────────────────────────────
function carregarCerebro() {
  const arquivo = path.join(PASTA_CEREBRO, 'cerebro_atual.json');
  if (!fs.existsSync(arquivo)) return null;
  return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

// ────────────────────────────────────────────────────────────────────
// RESUMO LEGÍVEL DO CÉREBRO (tabela em texto)
// ────────────────────────────────────────────────────────────────────
function resumoCerebro(cerebro, top = 10) {
  const linhas = [];
  const sep = '═'.repeat(75);
  linhas.push(sep);
  linhas.push('  CÉREBRO DO AUDITOR SUPREMO — Resumo Executivo');
  linhas.push('  Gerado: ' + cerebro.geradoEm);
  linhas.push(sep);
  linhas.push('');

  linhas.push('📊 LIGAS NO CÉREBRO:');
  for (const cod of Object.keys(cerebro.ligas)) {
    const L = cerebro.ligas[cod];
    const d = L.distribuicao || {};
    linhas.push(`   ${cod.padEnd(6)} ${L.n_jogos.toString().padStart(3)} jogos | média ${d.media}±${d.dp} | %<9 ${d.pct_under_9}% | %dif≥4 ${d.pct_dif_4_mais}%`);
    for (const ins of L.insights) linhas.push('              ' + ins);
  }
  linhas.push('');

  linhas.push(`🏆 TOP ${top} MANDANTES DOMINADORES (HDP -3.5 em casa):`);
  for (const r of cerebro.rankings.top_mandantes_dominadores.slice(0, top)) {
    linhas.push(`   ${r.time.padEnd(28)} [${r.liga}] dif média ${r.dif_media} | ${r.pct_dif_4_mais}% jogos dif≥4 | n=${r.n_jogos}`);
  }
  linhas.push('');

  linhas.push(`✈️ TOP ${top} VISITANTES DOMINADORES (HDP -3.5 fora):`);
  for (const r of cerebro.rankings.top_visitantes_dominadores.slice(0, top)) {
    linhas.push(`   ${r.time.padEnd(28)} [${r.liga}] dif média ${r.dif_media} | ${r.pct_dif_4_mais}% jogos dif≥4 | n=${r.n_jogos}`);
  }
  linhas.push('');

  linhas.push(`🏠 TOP ${top} MANDANTES UNDER-FRIENDLY (Under 9 em casa):`);
  for (const r of cerebro.rankings.top_mandantes_under_friendly.slice(0, top)) {
    linhas.push(`   ${r.time.padEnd(28)} [${r.liga}] total média ${r.total_media} | ${r.pct_under_9}% under 9 | n=${r.n_jogos}`);
  }
  linhas.push('');

  linhas.push(`🛡️ TOP ${top} VISITANTES UNDER-FRIENDLY (Under 9 fora):`);
  for (const r of cerebro.rankings.top_visitantes_under_friendly.slice(0, top)) {
    linhas.push(`   ${r.time.padEnd(28)} [${r.liga}] total média ${r.total_media} | ${r.pct_under_9}% under 9 | n=${r.n_jogos}`);
  }
  linhas.push('');

  if (cerebro.rankings.times_evitados_alta_volatilidade.length > 0) {
    linhas.push(`⚠️  TIMES PARA EVITAR (alta volatilidade, DP ≥ 4.5):`);
    for (const r of cerebro.rankings.times_evitados_alta_volatilidade.slice(0, top)) {
      linhas.push(`   ${r.time.padEnd(28)} [${r.liga}] DP ${r.total_dp} | n=${r.n_jogos}`);
    }
    linhas.push('');
  }

  linhas.push(sep);
  linhas.push(`  TOTAIS: ${cerebro.estatisticasGerais.totalTimes} times | ${cerebro.estatisticasGerais.totalJogosCobertos} jogos | ${cerebro.estatisticasGerais.totalH2H} pares H2H`);
  linhas.push(sep);
  return linhas.join('\n');
}

module.exports = {
  construirCerebro,
  salvarCerebro,
  carregarCerebro,
  resumoCerebro,
  distribuicaoLiga,
  insightsLiga,
  insightsTime,
  PASTA_CEREBRO
};
