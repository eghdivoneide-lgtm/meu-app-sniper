/**
 * Análise: Bala de Prata — Vencedor 1x2 cantos com confiança ≥ N%.
 * Cruza com resultados reais para calcular acerto.
 */
const fs = require('fs');
const path = require('path');

const cobertura = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_cobertura.json')));
const RAIZ = cobertura.RAIZ_AUDIT;
const MAP_LIGA_PASTA = cobertura.MAP_LIGA_PASTA;

function htmlToText(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<\/(div|p|tr|li|h\d|td|th)[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
}
function norm(s) {
  if (!s) return '';
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

const ALIASES = {
  'red bull bragantino': 'bragantino', 'sao paulo fc': 'sao paulo', 'bayer leverkusen': 'leverkusen',
  'fc bayern munich': 'bayern munich', 'fc bayern': 'bayern munich', 'eintracht frankfurt': 'frankfurt',
  'borussia m gladbach': 'monchengladbach', 'b monchengladbach': 'monchengladbach', 'borussia dortmund': 'dortmund',
  'koln': 'fc koln', 'flamengo rj': 'flamengo', 'botafogo rj': 'botafogo', 'atletico mg': 'atletico mg',
  'tokyo verdy': 'verdy', 'jef united chiba': 'chiba', 'fagiano okayama': 'okayama',
  'matsumoto yamaga': 'yamaga', 'hokkaido consadole sapporo': 'sapporo', 'consadole sapporo': 'sapporo',
  'newells old boys': 'newells old boys', 'newell s old boys': 'newells old boys',
  'gimnasia la plata': 'gimnasia lp', 'gimnasia l p': 'gimnasia lp',
  'estudiantes la plata': 'estudiantes lp', 'estudiantes l p': 'estudiantes lp',
  'argentinos juniors': 'argentinos jrs',
  'club atletico tucuman': 'atl tucuman', 'atletico tucuman': 'atl tucuman',
  'independiente rivadavia': 'ind rivadavia', 'ind rivadavia': 'ind rivadavia',
  'deportivo riestra': 'dep riestra', 'sao paulo': 'sao paulo',
  'inter': 'internacional'
};
function aliasNorm(s) { const n = norm(s); return ALIASES[n] || n; }

// Carregar resultados
const ARQUIVOS = {
  BR: 'br_rodada_2_2026-05-05.json', BR_B: 'br_b_rodada_2_2026-05-05.json',
  ARG: 'arg_rodada_2_2026-05-05.json', ARG_B: 'arg_b_rodada_2_2026-05-05.json',
  BUN: 'bun_rodada_2_2026-05-05.json', USL: 'usl_rodada_2_2026-05-05.json',
  MLS: 'mls_rodada_2_2026-05-05.json', J1: 'j1_rodada_2_2026-05-04.json',
  J2J3: 'j2j3_rodada_2_2026-05-04.json', CHN_SL: 'chn_sl_rodada_2_2026-05-04.json',
  CHN_L1: 'chn_l1_rodada_2_2026-05-04.json'
};
const resultados = {};
for (const [cod, arq] of Object.entries(ARQUIVOS)) {
  const dados = JSON.parse(fs.readFileSync(path.join(__dirname, arq)));
  resultados[cod] = dados.map(j => ({
    mandante: j.mandante, visitante: j.visitante,
    chave_mand: aliasNorm(j.mandante), chave_vis: aliasNorm(j.visitante),
    cantos_ft: j.estatisticas_ft && j.estatisticas_ft.cantos,
    cantos_ht: j.estatisticas_ht && j.estatisticas_ht.cantos
  }));
}

function acharJogo(liga, mand, vis) {
  const pool = resultados[liga] || [];
  const cm = aliasNorm(mand), cv = aliasNorm(vis);
  let m = pool.find(p => p.chave_mand === cm && p.chave_vis === cv);
  if (m) return m;
  m = pool.find(p => (p.chave_mand.includes(cm) || cm.includes(p.chave_mand)) && (p.chave_vis.includes(cv) || cv.includes(p.chave_vis)));
  return m || null;
}

// Parser tabela 1x2 da Bala — detectar tanto HT quanto FT
function parseTabela1x2(txt, secao) {
  // secao = 'HT' ou 'FT'
  const inicioMarker = secao === 'HT' ? 'Mercado 1x2 Cantos — HT' : 'Mercado 1x2 Cantos — FT';
  const fimMarker = secao === 'HT' ? 'Mercado 1x2 Cantos — FT' : '🦢|🐺|Reis dos|🛡️ Mercado HT|$';
  const idx = txt.indexOf(inicioMarker);
  if (idx === -1) return [];
  const fim = secao === 'HT' ? txt.indexOf('Mercado 1x2 Cantos — FT', idx) : txt.length;
  const trecho = txt.slice(idx, fim === -1 ? txt.length : fim);

  // Padrão: "TimeA vs TimeB\n NN.NN%\n @ N.NN\n NN.NN%\n @ N.NN\n NN.NN%\n @ N.NN\n SniperX [xCornersFT]"
  const linhas = trecho.split('\n').map(s => s.trim()).filter(Boolean);
  const jogos = [];
  for (let i = 0; i < linhas.length; i++) {
    const m = linhas[i].match(/^(.+?)\s+vs\s+(.+)$/);
    if (!m) continue;
    if (m[1].length < 2 || m[2].length < 2) continue;
    if (m[1].includes('—') || m[2].includes('—')) continue;
    // Próximas linhas devem ser %
    const expCasa = (linhas[i+1] || '').match(/^([\d.]+)%$/);
    if (!expCasa) continue;
    const expEmp  = (linhas[i+3] || '').match(/^([\d.]+)%$/);
    const expFora = (linhas[i+5] || '').match(/^([\d.]+)%$/);
    if (!expEmp || !expFora) continue;
    jogos.push({
      mand: m[1].trim(), vis: m[2].trim(),
      pCasa: parseFloat(expCasa[1]),
      pEmp:  parseFloat(expEmp[1]),
      pFora: parseFloat(expFora[1])
    });
    i += 5;
  }
  return jogos;
}

// =========== rodar para todas as ligas ===========
const todos = []; // {liga, secao, mand, vis, melhor_lado, p, real_diff, hit}
for (const [cod, pastaLiga] of Object.entries(MAP_LIGA_PASTA)) {
  const c = cobertura.cobertura[cod].BALA;
  if (!c.existe) continue;
  const arq = path.join(RAIZ, pastaLiga, '05_Bala de Prata', c.arq);
  const txt = htmlToText(fs.readFileSync(arq, 'utf-8'));
  for (const secao of ['HT', 'FT']) {
    const jogos = parseTabela1x2(txt, secao);
    for (const J of jogos) {
      const real = acharJogo(cod, J.mand, J.vis);
      if (!real || !real.cantos_ft) continue;
      const cantos = secao === 'HT' ? real.cantos_ht : real.cantos_ft;
      if (!cantos) continue;
      const dM = (cantos.m||0) - (cantos.v||0);
      // Escolher lado mais provável
      const probs = [['Casa', J.pCasa], ['Empate', J.pEmp], ['Fora', J.pFora]];
      probs.sort((a,b) => b[1] - a[1]);
      const [melhorLado, melhorProb] = probs[0];
      let hit = null;
      if (melhorLado === 'Casa') hit = dM > 0;
      else if (melhorLado === 'Fora') hit = dM < 0;
      else hit = dM === 0;
      todos.push({ liga: cod, secao, mand: J.mand, vis: J.vis, lado: melhorLado, prob: melhorProb, real_diff: dM, hit, cantos_total: (cantos.m||0)+(cantos.v||0) });
    }
  }
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  BALA DE PRATA — Vencedor 1x2 Cantos × Confiança');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log(`Total de jogos avaliados: ${todos.length}`);
console.log('');

const cortes = [50, 60, 70, 75, 80, 85, 90];
console.log('| Confiança | HT Acerto       | FT Acerto       | Total           |');
console.log('|-----------|-----------------|-----------------|-----------------|');
for (const c of cortes) {
  const filtHT = todos.filter(t => t.secao === 'HT' && t.prob >= c);
  const filtFT = todos.filter(t => t.secao === 'FT' && t.prob >= c);
  const allFilt = todos.filter(t => t.prob >= c);
  const hHT = filtHT.filter(t => t.hit).length;
  const hFT = filtFT.filter(t => t.hit).length;
  const hAll = allFilt.filter(t => t.hit).length;
  const cellHT = filtHT.length ? `${hHT}/${filtHT.length} = ${(hHT/filtHT.length*100).toFixed(0)}%` : '—';
  const cellFT = filtFT.length ? `${hFT}/${filtFT.length} = ${(hFT/filtFT.length*100).toFixed(0)}%` : '—';
  const cellAll = allFilt.length ? `${hAll}/${allFilt.length} = ${(hAll/allFilt.length*100).toFixed(0)}%` : '—';
  console.log('| ≥ ' + String(c).padEnd(7) + ' | ' + cellHT.padEnd(15) + ' | ' + cellFT.padEnd(15) + ' | ' + cellAll.padEnd(15) + ' |');
}

console.log('');
console.log('=== JOGOS ELITE (prob ≥ 75%) ===');
console.log('');
console.log('| Liga   | Seção | Jogo                          | Lado  | Prob   | Real diff | Resultado |');
console.log('|--------|-------|-------------------------------|-------|--------|-----------|-----------|');
const elite = todos.filter(t => t.prob >= 75).sort((a,b) => b.prob - a.prob);
for (const t of elite) {
  console.log('| ' + t.liga.padEnd(6) + ' | ' + t.secao.padEnd(5) + ' | ' + (t.mand + ' vs ' + t.vis).slice(0, 29).padEnd(29) + ' | ' + t.lado.padEnd(5) + ' | ' + (t.prob.toFixed(1)+'%').padStart(6) + ' | ' + String(t.real_diff).padStart(9) + ' | ' + (t.hit ? '✅' : '❌') + '       |');
}

fs.writeFileSync(path.join(__dirname, '_auditoria_bala_confianca.json'), JSON.stringify(todos, null, 2));
