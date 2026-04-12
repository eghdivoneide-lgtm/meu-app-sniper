/**
 * DNA Cultural das Ligas — EDS Soluções Inteligentes v4
 *
 * Perfil comportamental de cada liga que afeta diretamente
 * a projeção de cantos. Atualizado dinamicamente pelo orquestrador.
 *
 * @module dna_ligas
 */

const DNA_LIGAS = {

  BR: {
    nome: 'Brasileirão Série A',
    perfil: 'INTENSO_VARIAVEL',
    descricao: 'Liga de alta intensidade com grande variação entre times grandes e pequenos. Mandante tem vantagem forte. Clássicos tendem a ter muitos cantos.',
    media_cantos_ft: null,
    media_cantos_ht: null,
    media_gols_ft: null,
    desvio_padrao_cantos: null,
    fator_mandante: null,
    tendencia_cantos: 'NA_MEDIA',
    peculiaridades: [
      'Clássicos regionais (FLA×FLU, COR×PAL) tendem a 12+ cantos',
      'Times visitantes pequenos frequentemente retrancam (5ATB)',
      'Calendário congestionado (Copa do Brasil + Libertadores) causa fadiga',
      'VAR gera paralisações que resfriam o ritmo'
    ],
    ajuste_modelo: {
      base: 0,
      classico: +0.12,
      time_pequeno_fora: -0.10,
      rodada_pos_libertadores: -0.08
    },
    times_alto_canto: [],
    times_baixo_canto: [],
    times_muro: []
  },

  MLS: {
    nome: 'MLS',
    perfil: 'OFENSIVO_ABERTO',
    descricao: 'Liga com jogo aberto, muitas transições e espaços. Tendência de mais cantos que a média global.',
    media_cantos_ft: null,
    media_cantos_ht: null,
    media_gols_ft: null,
    desvio_padrao_cantos: null,
    fator_mandante: null,
    tendencia_cantos: 'ACIMA_MEDIA_GLOBAL',
    peculiaridades: [
      'Campos maiores = mais espaço nas pontas',
      'Pouca tradição de retranca tática',
      '5 substituições mantém intensidade alta',
      'Viagens longas afetam visitantes',
      'Altitude em Denver/Salt Lake = fadiga no 2T',
      'Calor extremo no verão = ritmo cai no 2T'
    ],
    ajuste_modelo: {
      base: +0.08,
      viagem_longa: -0.05,
      altitude: +0.06,
      calor_extremo: -0.07
    },
    times_alto_canto: [],
    times_baixo_canto: [],
    times_muro: []
  },

  ARG: {
    nome: 'Liga Profesional Argentina',
    perfil: 'DEFENSIVO_TATICO',
    descricao: 'Liga truncada com poucos gols e muitas faltas. Cultura de cerrojo domina visitantes. Clássicos são exceções explosivas.',
    media_cantos_ft: null,
    media_cantos_ht: null,
    media_gols_ft: null,
    desvio_padrao_cantos: null,
    fator_mandante: null,
    tendencia_cantos: 'ABAIXO_MEDIA_GLOBAL',
    peculiaridades: [
      'Média ~2.1 gols/jogo (abaixo da média global de 2.6)',
      'Visitantes quase sempre retrancam (5-4-1 / 5-3-2)',
      'Muitas faltas (~25/jogo) cortam o ritmo',
      'Superclásico (Boca × River) é exceção (jogo intenso)',
      'Campos em mau estado em times menores',
      'Pressão da torcida mandante é enorme'
    ],
    ajuste_modelo: {
      base: -0.12,
      classico: +0.15,
      visitante_retrancado: -0.15,
      campo_ruim: -0.05
    },
    times_alto_canto: [],
    times_baixo_canto: [],
    times_muro: []
  },

  USL: {
    nome: 'USL Championship',
    perfil: 'EQUILIBRADO_INFERIOR',
    descricao: 'Liga de segundo escalão. Qualidade técnica menor. Jogos mais caóticos. Dados mais escassos = maior incerteza.',
    media_cantos_ft: null,
    media_cantos_ht: null,
    media_gols_ft: null,
    desvio_padrao_cantos: null,
    fator_mandante: null,
    tendencia_cantos: 'NA_MEDIA',
    peculiaridades: [
      'Qualidade técnica inferior = jogadas menos elaboradas',
      'Menos dados históricos = modelo precisa de mais shrinkage',
      'Campos menores em alguns estádios',
      'Viagens longas afetam visitantes'
    ],
    ajuste_modelo: {
      base: -0.05,
      dados_escassos: +0.10
    },
    times_alto_canto: [],
    times_baixo_canto: [],
    times_muro: []
  },

  BUN: {
    nome: 'Bundesliga (Alemanha)',
    perfil: 'OFENSIVO_ALTO_RITMO',
    descricao: 'Liga de maior volume de cantos da Europa. Gegenpressing obriga times a atacar em bloco. Média real 2025/26: 9.58 cantos/jogo (255 jogos coletados). OVER 8.5 em 59% dos jogos. Mandante médio: 5.40 cantos; visitante: 4.18.',
    // ── CALIBRADO COM 255 JOGOS REAIS (Fantasma v5, 2026-04-11) ──
    media_cantos_ft:       9.58,  // era null → agora dado real
    media_cantos_ht:       4.36,  // dado real
    media_gols_ft:         null,
    desvio_padrao_cantos:  null,
    fator_mandante:        1.29,  // mandante faz 5.40 vs visitante 4.18
    tendencia_cantos: 'ACIMA_MEDIA_GLOBAL',
    peculiaridades: [
      'Gegenpressing universal: até times menores pressionam alto',
      'Média real 2025/26: 9.58 cantos/jogo (255 jogos) — topo da Europa',
      'OVER 8.5: 59.2% dos jogos | OVER 10.5: 37.3% | OVER 12.5: 20.0%',
      'Dortmund é o maior gerador de cantos como mandante: 7.87/jogo',
      'Bayern Munich como mandante: 7.14 cantos/jogo',
      'Wolfsburg sofre 6.29 cantos/jogo como mandante — muito vulnerável',
      'Hamburger SV: gera 3.87 mas SOFRE 5.67 — perfil muro extremo',
      'Mainz SURPREENDE: 6.29 cantos/jogo — NÃO é muro (correção do DNA inicial)',
      'Calendário sem copa paralela = foco total na liga = intensidade máxima'
    ],
    ajuste_modelo: {
      base:                +0.15,
      dortmund_mandante:   +0.25,  // 7.87/jogo — maior da liga
      bayern_mandante:     +0.20,  // 7.14/jogo
      hoffenheim_mandante: +0.18,  // 6.64/jogo
      leverkusen_mandante: +0.12,
      wolfsburg_visitante: +0.15,  // sofre muito
      hamburger_visitante: +0.12,  // muro = adversário ataca mais
      jogo_inverno:        -0.05
    },
    // Baseado em dados reais de 255 jogos:
    times_alto_canto: ['Dortmund', 'Bayern Munich', 'Hoffenheim', 'Bayer Leverkusen', 'Mainz'],
    times_baixo_canto: ['Hamburger SV', 'B. Monchengladbach', 'Heidenheim', 'Werder Bremen', 'FC Koln'],
    times_muro: ['Hamburger SV', 'B. Monchengladbach', 'Heidenheim'],  // sofrem mais que fazem
    times_vulneraveis: ['Wolfsburg', 'Augsburg', 'FC Koln']            // sofrem muitos cantos
  },

  ECU: {
    nome: 'Liga Pro Equador',
    perfil: 'IMPREVISIVEL_ALTITUDE',
    descricao: 'Liga impactada pela altitude. Jogos em Quito (2.850m) são completamente diferentes de Guayaquil (nível do mar).',
    media_cantos_ft: null,
    media_cantos_ht: null,
    media_gols_ft: null,
    desvio_padrao_cantos: null,
    fator_mandante: null,
    tendencia_cantos: 'NA_MEDIA',
    peculiaridades: [
      'ALTITUDE é o fator nº 1 — Quito a 2.850m, Ambato a 2.600m',
      'Times de terras baixas sofrem no 2T em altitude',
      'Mandante em altitude tem vantagem EXTREMA (>60% vitórias)',
      'Fadiga no 2T = mais cantos do mandante',
      'Bola viaja mais rápido em altitude'
    ],
    ajuste_modelo: {
      base: 0,
      mandante_altitude: +0.15,
      visitante_altitude: -0.20,
      jogo_nivel_mar: 0
    },
    times_alto_canto: [],
    times_baixo_canto: [],
    times_muro: []
  }
};

/**
 * Atualiza dinamicamente o DNA de uma liga com base nos dados reais
 * @param {string} codigoLiga - Código da liga
 * @param {Array} jogos - Array de jogos com estatisticas_ft.cantos
 * @param {number} [mediaGlobal] - Média global de cantos (todas as ligas)
 */
function atualizarDNA(codigoLiga, jogos, mediaGlobal) {
  const liga = DNA_LIGAS[codigoLiga];
  if (!liga || !jogos || jogos.length === 0) return;

  const jogosValidos = jogos.filter(j =>
    j.estatisticas_ft && j.estatisticas_ft.cantos &&
    typeof j.estatisticas_ft.cantos.m === 'number'
  );

  if (jogosValidos.length === 0) return;

  // Médias
  const cantosFT = jogosValidos.map(j => j.estatisticas_ft.cantos.m + j.estatisticas_ft.cantos.v);
  const cantosHT = jogosValidos.filter(j => j.estatisticas_ht && j.estatisticas_ht.cantos)
    .map(j => j.estatisticas_ht.cantos.m + j.estatisticas_ht.cantos.v);

  const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const std = arr => {
    const mean = avg(arr);
    return Math.sqrt(avg(arr.map(x => (x - mean) ** 2)));
  };

  liga.media_cantos_ft = parseFloat(avg(cantosFT).toFixed(2));
  liga.media_cantos_ht = cantosHT.length > 0 ? parseFloat(avg(cantosHT).toFixed(2)) : null;
  liga.desvio_padrao_cantos = parseFloat(std(cantosFT).toFixed(2));

  // Gols
  const golsFT = jogosValidos
    .filter(j => j.placar && j.placar.ft && j.placar.ft !== 'Indisponível')
    .map(j => {
      const parts = j.placar.ft.split('-').map(s => parseInt(s.trim()));
      return (parts[0] || 0) + (parts[1] || 0);
    });
  liga.media_gols_ft = golsFT.length > 0 ? parseFloat(avg(golsFT).toFixed(2)) : null;

  // Fator mandante
  const cantosM = avg(jogosValidos.map(j => j.estatisticas_ft.cantos.m));
  const cantosV = avg(jogosValidos.map(j => j.estatisticas_ft.cantos.v));
  liga.fator_mandante = cantosV > 0 ? parseFloat((cantosM / cantosV).toFixed(2)) : null;

  // Tendência vs média global
  if (mediaGlobal && mediaGlobal > 0) {
    if (liga.media_cantos_ft > mediaGlobal * 1.10) liga.tendencia_cantos = 'ACIMA_MEDIA_GLOBAL';
    else if (liga.media_cantos_ft < mediaGlobal * 0.90) liga.tendencia_cantos = 'ABAIXO_MEDIA_GLOBAL';
    else liga.tendencia_cantos = 'NA_MEDIA';
  }

  // Rankings de times
  const timeStats = {};
  jogosValidos.forEach(j => {
    const m = j.mandante;
    const v = j.visitante;
    if (!timeStats[m]) timeStats[m] = { cantos_pro: [], cantos_con: [] };
    if (!timeStats[v]) timeStats[v] = { cantos_pro: [], cantos_con: [] };
    timeStats[m].cantos_pro.push(j.estatisticas_ft.cantos.m);
    timeStats[m].cantos_con.push(j.estatisticas_ft.cantos.v);
    timeStats[v].cantos_pro.push(j.estatisticas_ft.cantos.v);
    timeStats[v].cantos_con.push(j.estatisticas_ft.cantos.m);
  });

  const ranking = Object.entries(timeStats)
    .filter(([, s]) => s.cantos_pro.length >= 3)
    .map(([time, s]) => ({
      time,
      media_pro: avg(s.cantos_pro),
      media_con: avg(s.cantos_con)
    }));

  ranking.sort((a, b) => b.media_pro - a.media_pro);
  liga.times_alto_canto = ranking.slice(0, 5).map(t => t.time);
  liga.times_baixo_canto = ranking.slice(-5).map(t => t.time);

  ranking.sort((a, b) => a.media_con - b.media_con);
  liga.times_muro = ranking.slice(0, 5).map(t => t.time);
}

module.exports = { DNA_LIGAS, atualizarDNA };
