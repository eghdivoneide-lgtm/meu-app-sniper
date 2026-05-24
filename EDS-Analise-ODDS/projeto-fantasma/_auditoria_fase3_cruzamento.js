/**
 * Fase 3 — Cruzamento dos palpites (Fase 2) com os resultados coletados.
 *
 * Para cada palpite, verifica se acertou contra o gabarito real.
 * Saída: _auditoria_resultados.json
 */
const fs = require('fs');
const path = require('path');

const palpitesAll = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_palpites.json')));

const ARQUIVOS = {
  BR:     'br_rodada_2_2026-05-05.json',
  BR_B:   'br_b_rodada_2_2026-05-05.json',
  ARG:    'arg_rodada_2_2026-05-05.json',
  ARG_B:  'arg_b_rodada_2_2026-05-05.json',
  BUN:    'bun_rodada_2_2026-05-05.json',
  USL:    'usl_rodada_2_2026-05-05.json',
  MLS:    'mls_rodada_2_2026-05-05.json',
  J1:     'j1_rodada_2_2026-05-04.json',
  J2J3:   'j2j3_rodada_2_2026-05-04.json',
  CHN_SL: 'chn_sl_rodada_2_2026-05-04.json',
  CHN_L1: 'chn_l1_rodada_2_2026-05-04.json'
};

// Normalizador
function norm(s) {
  if (!s) return '';
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Aliases comuns (quando o nome no relatório difere do flashscore)
const ALIASES = {
  'red bull bragantino': 'bragantino',
  'sao paulo fc': 'sao paulo',
  'bayer leverkusen': 'leverkusen',
  'fc bayern munich': 'bayern munich',
  'fc bayern': 'bayern munich',
  'rb leipzig': 'rb leipzig',
  'eintracht frankfurt': 'frankfurt',
  'borussia m gladbach': 'monchengladbach',
  'b monchengladbach': 'monchengladbach',
  'borussia dortmund': 'dortmund',
  'fc koln': 'fc koln',
  'koln': 'fc koln',
  'sao paulo': 'sao paulo',
  'atletico mg': 'atletico mg',
  'atletico minas': 'atletico mg',
  'atletico goianiense': 'atletico go',
  'fc tokyo': 'fc tokyo',
  'kashiwa reysol': 'kashiwa reysol',
  'gamba osaka': 'gamba osaka',
  'cerezo osaka': 'cerezo osaka',
  'urawa reds': 'urawa reds',
  'tokyo verdy': 'verdy',
  'verdy': 'verdy',
  'jef united chiba': 'chiba',
  'kawasaki frontale': 'kawasaki frontale',
  'sanfrecce hiroshima': 'sanfrecce hiroshima',
  'shimizu s pulse': 'shimizu s pulse',
  'fagiano okayama': 'okayama',
  'okayama': 'okayama',
  'machida zelvia': 'machida',
  'fc machida zelvia': 'machida',
  'machida': 'machida',
  'mito hollyhock': 'mito',
  'avispa fukuoka': 'avispa fukuoka',
  'consadole sapporo': 'sapporo',
  'hokkaido consadole sapporo': 'sapporo',
  'fc gifu': 'gifu',
  'matsumoto yamaga': 'yamaga',
  'matsumoto': 'yamaga',
  'yamaga': 'yamaga',
  'tochigi sc': 'tochigi sc',
  'tochigi': 'tochigi sc',
  'sagan tosu': 'sagan tosu',
  'tegevajaro miyazaki': 'tegevajaro miyazaki',
  'fukushima united': 'fukushima utd',
  'fukushima utd': 'fukushima utd',
  'omiya ardija': 'omiya ardija',
  'kagoshima united': 'kagoshima utd',
  'kagoshima utd': 'kagoshima utd',
  'shanghai shenhua': 'shanghai shenhua',
  'shanghai port': 'shanghai port',
  'shandong taishan': 'shandong taishan',
  'beijing guoan': 'beijing guoan',
  'newells old boys': 'newells old boys',
  'newell s old boys': 'newells old boys',
  'velez sarsfield': 'velez sarsfield',
  'club a velez sarsfield': 'velez sarsfield',
  'gimnasia la plata': 'gimnasia lp',
  'gimnasia l p': 'gimnasia lp',
  'gimnasia lp': 'gimnasia lp',
  'estudiantes la plata': 'estudiantes lp',
  'estudiantes l p': 'estudiantes lp',
  'estudiantes lp': 'estudiantes lp',
  'estudiantes rio cuarto': 'estudiantes rio cuarto',
  'argentinos juniors': 'argentinos jrs',
  'argentinos jrs': 'argentinos jrs',
  'gimnasia mendoza': 'gimnasia mendoza',
  'gimnasia jujuy': 'gimnasia jujuy',
  'gimnasia y tiro': 'gimnasia y tiro',
  'union de santa fe': 'union de santa fe',
  'central cordoba se': 'central cordoba',
  'central cordoba': 'central cordoba',
  'racing club': 'racing club',
  'racing cordoba': 'racing cordoba',
  'rosario central': 'rosario central',
  'tigre': 'tigre',
  'belgrano': 'belgrano',
  'sarmiento de junin': 'sarmiento junin',
  'sarmiento junin': 'sarmiento junin',
  'platense': 'platense',
  'huracan': 'huracan',
  'club atletico tucuman': 'atl tucuman',
  'atletico tucuman': 'atl tucuman',
  'atl tucuman': 'atl tucuman',
  'aldosivi': 'aldosivi',
  'independiente rivadavia mendoza': 'ind rivadavia',
  'independiente rivadavia': 'ind rivadavia',
  'ind rivadavia': 'ind rivadavia',
  'ind rivadavia mza': 'ind rivadavia',
  'lanus': 'lanus',
  'deportivo riestra': 'dep riestra',
  'dep riestra': 'dep riestra',
  'banfield': 'banfield',
  'barracas central': 'barracas central',
  'club atletico independiente': 'independiente',
  'independiente': 'independiente',
  'san lorenzo': 'san lorenzo',
  'talleres cordoba': 'talleres cordoba',
  'talleres de cordoba': 'talleres cordoba',
  'defensa y justicia': 'defensa y justicia',
  'instituto cordoba': 'instituto',
  'instituto ac cordoba': 'instituto',
  'instituto': 'instituto',
  'boca juniors': 'boca juniors',
  'boca jrs': 'boca juniors',
  'cruzeiro': 'cruzeiro',
  'flamengo': 'flamengo',
  'flamengo rj': 'flamengo',
  'fluminense': 'fluminense',
  'mirassol': 'mirassol',
  'corinthians': 'corinthians',
  'chapecoense': 'chapecoense',
  'chapecoense sc': 'chapecoense',
  'palmeiras': 'palmeiras',
  'santos': 'santos',
  'sao paulo': 'sao paulo',
  'bahia': 'bahia',
  'athletico paranaense': 'athletico pr',
  'athletico pr': 'athletico pr',
  'gremio': 'gremio',
  'internacional': 'internacional',
  'inter': 'internacional',
  'vitoria': 'vitoria',
  'coritiba': 'coritiba',
  'botafogo': 'botafogo',
  'botafogo rj': 'botafogo',
  'remo': 'remo',
  'vasco': 'vasco',
  'vasco da gama': 'vasco'
};

function aliasNorm(s) {
  const n = norm(s);
  return ALIASES[n] || n;
}

// Carregar resultados
const resultados = {};
for (const [cod, arq] of Object.entries(ARQUIVOS)) {
  const dados = JSON.parse(fs.readFileSync(path.join(__dirname, arq)));
  resultados[cod] = dados.map(j => ({
    mandante: j.mandante,
    visitante: j.visitante,
    chave_mand: aliasNorm(j.mandante),
    chave_vis: aliasNorm(j.visitante),
    placar_ft: j.placar && j.placar.ft || '',
    placar_ht: j.placar && j.placar.ht || '',
    cantos_ft: j.estatisticas_ft && j.estatisticas_ft.cantos,
    cantos_ht: j.estatisticas_ht && j.estatisticas_ht.cantos,
    raw: j
  }));
}

function parsePlacar(s) { if (!s) return [null,null]; const m=(s+'').match(/(\d+)\s*-\s*(\d+)/); return m?[+m[1],+m[2]]:[null,null]; }

// Para cada palpite, encontrar resultado
function acharJogo(liga, mandante, visitante) {
  const pool = resultados[liga] || [];
  const cmd = aliasNorm(mandante);
  const cvs = aliasNorm(visitante);
  // exato
  let m = pool.find(p => p.chave_mand === cmd && p.chave_vis === cvs);
  if (m) return m;
  // contém
  m = pool.find(p => (p.chave_mand.includes(cmd) || cmd.includes(p.chave_mand)) && (p.chave_vis.includes(cvs) || cvs.includes(p.chave_vis)));
  if (m) return m;
  // último recurso: primeiro nome
  const cmd0 = cmd.split(' ')[0];
  const cvs0 = cvs.split(' ')[0];
  if (cmd0.length >= 4 && cvs0.length >= 4) {
    m = pool.find(p => p.chave_mand.startsWith(cmd0) && p.chave_vis.startsWith(cvs0));
    if (m) return m;
  }
  return null;
}

// Avaliar um palpite contra um jogo real
function avaliar(palpite, jogo) {
  if (!jogo || !jogo.cantos_ft) return { resultado: 'SEM_DADO', motivo: 'sem cantos FT' };
  const cFT = (jogo.cantos_ft.m || 0) + (jogo.cantos_ft.v || 0);
  const cHT = jogo.cantos_ht ? (jogo.cantos_ht.m || 0) + (jogo.cantos_ht.v || 0) : null;
  const dM_FT = (jogo.cantos_ft.m || 0) - (jogo.cantos_ft.v || 0);
  const dM_HT = jogo.cantos_ht ? (jogo.cantos_ht.m || 0) - (jogo.cantos_ht.v || 0) : null;

  if (palpite.mercado === 'cantos_ft') {
    if (palpite.direcao === 'OVER') {
      const linha = palpite.linha || 10;
      if (cFT > linha) return { resultado: 'HIT', real: cFT, linha };
      if (cFT === linha) return { resultado: 'PUSH', real: cFT, linha };
      return { resultado: 'MISS', real: cFT, linha };
    } else if (palpite.direcao === 'UNDER') {
      const linha = palpite.linha || 10;
      if (cFT < linha) return { resultado: 'HIT', real: cFT, linha };
      if (cFT === linha) return { resultado: 'PUSH', real: cFT, linha };
      return { resultado: 'MISS', real: cFT, linha };
    }
    return { resultado: 'NEUTRO', real: cFT };
  }
  if (palpite.mercado === 'cantos_ht') {
    if (cHT == null) return { resultado: 'SEM_DADO', motivo: 'sem cantos HT' };
    if (palpite.direcao === 'OVER') {
      const linha = palpite.linha || 4;
      if (cHT > linha) return { resultado: 'HIT', real: cHT, linha };
      if (cHT === linha) return { resultado: 'PUSH', real: cHT, linha };
      return { resultado: 'MISS', real: cHT, linha };
    } else if (palpite.direcao === 'UNDER') {
      const linha = palpite.linha || 4;
      if (cHT < linha) return { resultado: 'HIT', real: cHT, linha };
      if (cHT === linha) return { resultado: 'PUSH', real: cHT, linha };
      return { resultado: 'MISS', real: cHT, linha };
    }
    return { resultado: 'NEUTRO', real: cHT };
  }
  if (palpite.mercado === 'vencedor_cantos_ft') {
    if (!palpite.time_favorito) return { resultado: 'SEM_PALPITE' };
    const fav = aliasNorm(palpite.time_favorito);
    const isMand = fav === jogo.chave_mand || fav.includes(jogo.chave_mand) || jogo.chave_mand.includes(fav);
    if (dM_FT > 0 && isMand) return { resultado: 'HIT', diff: dM_FT };
    if (dM_FT < 0 && !isMand) return { resultado: 'HIT', diff: -dM_FT };
    if (dM_FT === 0) return { resultado: 'PUSH', diff: 0 };
    return { resultado: 'MISS', diff: dM_FT, lado_palpite: isMand ? 'mandante' : 'visitante' };
  }
  if (palpite.mercado === 'vencedor_cantos_ht') {
    if (dM_HT == null) return { resultado: 'SEM_DADO', motivo: 'sem cantos HT' };
    if (!palpite.time_favorito) return { resultado: 'SEM_PALPITE' };
    const fav = aliasNorm(palpite.time_favorito);
    const isMand = fav === jogo.chave_mand || fav.includes(jogo.chave_mand) || jogo.chave_mand.includes(fav);
    if (dM_HT > 0 && isMand) return { resultado: 'HIT', diff: dM_HT };
    if (dM_HT < 0 && !isMand) return { resultado: 'HIT', diff: -dM_HT };
    if (dM_HT === 0) return { resultado: 'PUSH', diff: 0 };
    return { resultado: 'MISS', diff: dM_HT, lado_palpite: isMand ? 'mandante' : 'visitante' };
  }
  if (palpite.mercado === 'cantos_ft_estimado') {
    return { resultado: 'INFO', real: cFT, estimado: palpite.valor, erro_abs: Math.abs(cFT - palpite.valor) };
  }
  if (palpite.mercado === 'enigma_status') {
    return { resultado: 'INFO', sde: palpite.sde_score, status: palpite.forca };
  }
  return { resultado: 'IGNORADO' };
}

// Cruzar
const cruzados = [];
let semJogo = 0;
for (const entry of palpitesAll) {
  const jogo = acharJogo(entry.liga, entry.mandante, entry.visitante);
  if (!jogo) {
    semJogo++;
    cruzados.push({
      liga: entry.liga, sistema: entry.sistema,
      jogo: entry.jogo, mandante: entry.mandante, visitante: entry.visitante,
      palpites: entry.palpites,
      avaliacao: entry.palpites.map(() => ({ resultado: 'SEM_JOGO_REAL' })),
      _sem_match: true
    });
    continue;
  }
  cruzados.push({
    liga: entry.liga, sistema: entry.sistema,
    jogo: entry.jogo, mandante: entry.mandante, visitante: entry.visitante,
    real_mandante: jogo.mandante, real_visitante: jogo.visitante,
    placar_ft: jogo.placar_ft, placar_ht: jogo.placar_ht,
    cantos_ft: jogo.cantos_ft, cantos_ht: jogo.cantos_ht,
    palpites: entry.palpites,
    avaliacao: entry.palpites.map(p => avaliar(p, jogo))
  });
}

fs.writeFileSync(path.join(__dirname, '_auditoria_resultados.json'), JSON.stringify(cruzados, null, 2));

// Stats: HIT/MISS por sistema
const stats = {};
for (const c of cruzados) {
  if (c._sem_match) continue;
  const sist = c.sistema;
  if (!stats[sist]) stats[sist] = { HIT: 0, MISS: 0, PUSH: 0, NEUTRO: 0, SEM_DADO: 0, INFO: 0, OUTRO: 0 };
  c.avaliacao.forEach(av => {
    if (av.resultado === 'HIT') stats[sist].HIT++;
    else if (av.resultado === 'MISS') stats[sist].MISS++;
    else if (av.resultado === 'PUSH') stats[sist].PUSH++;
    else if (av.resultado === 'NEUTRO') stats[sist].NEUTRO++;
    else if (av.resultado === 'SEM_DADO') stats[sist].SEM_DADO++;
    else if (av.resultado === 'INFO') stats[sist].INFO++;
    else stats[sist].OUTRO++;
  });
}

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('  FASE 3 — CRUZAMENTO PALPITES × RESULTADOS');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log(`Entradas cruzadas: ${cruzados.length}  Sem match com jogo real: ${semJogo}`);
console.log('');
console.log('| SISTEMA   | HIT  | MISS | PUSH | NEUTRO | SEM_DADO | INFO | %ACERTO (palpites com HIT/MISS) |');
console.log('|-----------|------|------|------|--------|----------|------|----------------------------------|');
for (const s of Object.keys(stats)) {
  const x = stats[s];
  const denom = x.HIT + x.MISS;
  const pct = denom > 0 ? (x.HIT / denom * 100).toFixed(1) : '-';
  console.log('| ' + s.padEnd(9) + ' | ' +
    String(x.HIT).padStart(4) + ' | ' +
    String(x.MISS).padStart(4) + ' | ' +
    String(x.PUSH).padStart(4) + ' | ' +
    String(x.NEUTRO).padStart(6) + ' | ' +
    String(x.SEM_DADO).padStart(8) + ' | ' +
    String(x.INFO).padStart(4) + ' | ' +
    String(pct).padStart(5) + '%                          |');
}
console.log('');
console.log('💾 Salvo: _auditoria_resultados.json');
