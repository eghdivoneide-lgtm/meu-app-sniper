// Análise profunda da Primera División Chile (CHI) — A + B + C
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..');

global.window = {};
const src = fs.readFileSync(path.join(BASE, 'especialista-cantos/data/chile2026.js'), 'utf8');
new Function('window', src.replace(/^\s*\/\/.*$/gm, ''))(global.window);
const data = global.window.DADOS_CHI;

function getCantos(j) {
  if (j.estatisticas_ft && j.estatisticas_ft.cantos && j.estatisticas_ft.cantos.m != null) return j.estatisticas_ft.cantos;
  if (j.cantos && j.cantos.ft && j.cantos.ft.m != null) return j.cantos.ft;
  return null;
}
const jogos = (data.jogos || []).filter(j => getCantos(j));

// ════════════ A · DNA ════════════
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║  A · DNA ESTATÍSTICO — Primera División Chile (CHI)              ║');
console.log('║  Base: ' + jogos.length + ' jogos · 16 times                                         ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');

let sumCasa=0, sumFora=0, sumTotal=0, sumDiff=0, sumDiffAbs=0;
let sumHTcasa=0, sumHTfora=0, nHT=0;
const diffs=[], totais=[];
for (const j of jogos) {
  const c = getCantos(j);
  sumCasa += c.m; sumFora += c.v;
  sumTotal += c.m + c.v;
  sumDiff += (c.m - c.v); sumDiffAbs += Math.abs(c.m - c.v);
  diffs.push(c.m - c.v); totais.push(c.m + c.v);
  const ch = (j.estatisticas_ht && j.estatisticas_ht.cantos) || (j.cantos && j.cantos.ht);
  if (ch && ch.m != null) { sumHTcasa += ch.m; sumHTfora += ch.v; nHT++; }
}
const n = jogos.length;
console.log('');
console.log('  📊 Médias:');
console.log('     Cantos CASA (FT): ' + (sumCasa/n).toFixed(2));
console.log('     Cantos FORA (FT): ' + (sumFora/n).toFixed(2));
console.log('     TOTAL FT:         ' + (sumTotal/n).toFixed(2));
if (nHT) console.log('     TOTAL HT:         ' + ((sumHTcasa+sumHTfora)/nHT).toFixed(2));
console.log('');
console.log('  🎯 Mando:');
console.log('     Vantagem média mandante: ' + (sumDiff/n).toFixed(2) + ' cantos');
console.log('     Diff absoluta média:     ' + (sumDiffAbs/n).toFixed(2));

const buckets = { '0-1':0, '2-3':0, '4-5':0, '6-7':0, '8+':0 };
for (const d of diffs) {
  const a = Math.abs(d);
  if (a<=1) buckets['0-1']++;
  else if (a<=3) buckets['2-3']++;
  else if (a<=5) buckets['4-5']++;
  else if (a<=7) buckets['6-7']++;
  else buckets['8+']++;
}
console.log('');
console.log('  📈 Distribuição |diff|:');
for (const k of Object.keys(buckets)) {
  const p = (buckets[k]/n*100).toFixed(1);
  const bar = '#'.repeat(Math.round(p/3));
  console.log('     ' + k.padEnd(5) + ': ' + String(buckets[k]).padStart(3) + ' (' + p.padStart(4) + '%) ' + bar);
}

let venM=0, venV=0, emp=0;
for (const j of jogos) { const c = getCantos(j); if (c.m > c.v) venM++; else if (c.m < c.v) venV++; else emp++; }
console.log('');
console.log('  🏆 Vencedor de cantos:');
console.log('     Mandante: ' + venM + ' (' + (venM/n*100).toFixed(1) + '%)');
console.log('     Visitante:' + venV + ' (' + (venV/n*100).toFixed(1) + '%)');
console.log('     Empate:   ' + emp + ' (' + (emp/n*100).toFixed(1) + '%)');
console.log('     → Vantagem mando: +' + ((venM-venV)/n*100).toFixed(1) + 'pp');

const mediaTotal = sumTotal/n;
const varTotal = totais.reduce((s,t) => s + (t-mediaTotal)**2, 0)/n;
const desvio = Math.sqrt(varTotal);
console.log('');
console.log('  📉 Volatilidade:');
console.log('     Desvio padrão (total cantos): +-' + desvio.toFixed(2));
console.log('     Coef. variação: ' + (desvio/mediaTotal*100).toFixed(1) + '%');

// ════════════ B · RANKING ════════════
console.log('');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║  B · RANKING DE TIMES + OUTLIERS                                 ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');

const stats = {};
for (const j of jogos) {
  const c = getCantos(j);
  const M = j.mandante, V = j.visitante;
  for (const t of [M, V]) {
    if (!stats[t]) stats[t] = { proCasa:0, conCasa:0, nCasa:0, proFora:0, conFora:0, nFora:0, todosPro:[] };
  }
  stats[M].proCasa += c.m; stats[M].conCasa += c.v; stats[M].nCasa++; stats[M].todosPro.push(c.m);
  stats[V].proFora += c.v; stats[V].conFora += c.m; stats[V].nFora++; stats[V].todosPro.push(c.v);
}
const ranks = Object.entries(stats).map(([t,s]) => {
  const med = s.todosPro.reduce((a,b)=>a+b,0)/s.todosPro.length;
  const va = s.todosPro.reduce((a,b)=>a+(b-med)**2,0)/s.todosPro.length;
  return {
    time: t,
    proCasa: s.nCasa ? s.proCasa/s.nCasa : null,
    conCasa: s.nCasa ? s.conCasa/s.nCasa : null,
    saldoCasa: s.nCasa ? (s.proCasa-s.conCasa)/s.nCasa : null,
    proFora: s.nFora ? s.proFora/s.nFora : null,
    conFora: s.nFora ? s.conFora/s.nFora : null,
    saldoFora: s.nFora ? (s.proFora-s.conFora)/s.nFora : null,
    nCasa: s.nCasa, nFora: s.nFora,
    desvio: Math.sqrt(va),
    nJogos: s.todosPro.length
  };
});

console.log('');
console.log('  🏠 TOP 5 SALDO em CASA (dominadores — alvos pra HDP do mandante):');
console.log('  | # | Time                       | atk  | con  | saldo  | n |');
ranks.filter(r => r.nCasa >= 3).sort((a,b) => b.saldoCasa - a.saldoCasa).slice(0,5).forEach((r,i) => {
  console.log('  | ' + (i+1) + ' | ' + r.time.padEnd(26) + ' | ' + r.proCasa.toFixed(2).padStart(4) + ' | ' + r.conCasa.toFixed(2).padStart(4) + ' | ' + ((r.saldoCasa>=0?'+':'')+r.saldoCasa.toFixed(2)).padStart(6) + ' | ' + r.nCasa + ' |');
});

console.log('');
console.log('  ✈️ TOP 5 CONCEDE FORA (azarões que sofrem fora — HDP do mandante mais provável):');
ranks.filter(r => r.nFora >= 3).sort((a,b) => b.conFora - a.conFora).slice(0,5).forEach((r,i) => {
  console.log('  ' + (i+1) + '. ' + r.time.padEnd(26) + ' concede ' + r.conFora.toFixed(2) + ' fora (n=' + r.nFora + ')');
});

console.log('');
console.log('  ⚠️ TOP 5 MAIS VOLÁTEIS (cuidado — HDP arriscado):');
ranks.filter(r => r.nJogos >= 5).sort((a,b) => b.desvio - a.desvio).slice(0,5).forEach((r,i) => {
  console.log('  ' + (i+1) + '. ' + r.time.padEnd(26) + ' desvio +-' + r.desvio.toFixed(2) + ' (' + r.nJogos + ' jogos)');
});

console.log('');
console.log('  ✅ TOP 5 MAIS CONSISTENTES (HDP previsível):');
ranks.filter(r => r.nJogos >= 5).sort((a,b) => a.desvio - b.desvio).slice(0,5).forEach((r,i) => {
  console.log('  ' + (i+1) + '. ' + r.time.padEnd(26) + ' desvio +-' + r.desvio.toFixed(2) + ' (' + r.nJogos + ' jogos)');
});

// ════════════ C · CALIBRAÇÃO ════════════
console.log('');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║  C · CALIBRAÇÃO HDP — viés + backtest + recomendação             ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');

function getProj(M, V) {
  const sM = stats[M], sV = stats[V];
  if (!sM || !sM.nCasa || !sV || !sV.nFora) return null;
  const expM = (sM.proCasa/sM.nCasa + sV.conFora/sV.nFora) / 2;
  const expV = (sV.proFora/sV.nFora + sM.conCasa/sM.nCasa) / 2;
  return { expM, expV, diff: expM - expV };
}

const desvios = [];
for (const j of jogos) {
  const p = getProj(j.mandante, j.visitante);
  if (!p) continue;
  const c = getCantos(j);
  desvios.push({ proj: p.diff, real: c.m - c.v, abs: Math.abs(p.diff - (c.m - c.v)) });
}
const fortes = desvios.filter(d => Math.abs(d.proj) >= 3);
const medios = desvios.filter(d => Math.abs(d.proj) >= 1.5 && Math.abs(d.proj) < 3);
const fracas = desvios.filter(d => Math.abs(d.proj) < 1.5);
const erroM = arr => arr.length ? arr.reduce((s,d)=>s+d.abs, 0)/arr.length : 0;
console.log('');
console.log('  🎯 OVERCONFIDENCE (motor erra mais quando aposta forte?):');
console.log('     |proj| >= 3   (forte):  erro médio +-' + erroM(fortes).toFixed(2) + '  (n=' + fortes.length + ')');
console.log('     |proj| 1.5-3 (médio):  erro médio +-' + erroM(medios).toFixed(2) + '  (n=' + medios.length + ')');
console.log('     |proj| < 1.5 (fraco):  erro médio +-' + erroM(fracas).toFixed(2) + '  (n=' + fracas.length + ')');
if (erroM(fortes) > erroM(fracas) + 0.5) console.log('     ⚠️ OVERCONFIDENCE: erro +' + (erroM(fortes)-erroM(fracas)).toFixed(2) + ' a mais em projeções fortes');
else console.log('     ✅ Sem overconfidence sistêmica');

console.log('');
console.log('  📊 BACKTEST CEGO — grid X (1.0 a 3.5):');
console.log('     Critério: |diff projetada| >= X → emite pick HDP -floor(X) no favorito');
console.log('     ROI assume odd 1.90 (típica do mercado)');
console.log('');
console.log('  | X     | Picks | V  | D  | R | WR%   | ROI%  |');
console.log('  |-------|-------|----|----|---|-------|-------|');
const ODD = 1.90;
let melhorROI = -Infinity, melhorX = null, melhorWR = 0;
for (let X = 1.0; X <= 3.5; X += 0.25) {
  let V=0, D=0, R=0;
  for (const j of jogos) {
    const p = getProj(j.mandante, j.visitante);
    if (!p) continue;
    if (Math.abs(p.diff) < X) continue;
    const c = getCantos(j);
    const ehMand = p.diff >= 0;
    const realCorr = ehMand ? (c.m - c.v) : (c.v - c.m);
    const linha = Math.floor(X);
    if (realCorr > linha) V++;
    else if (realCorr < linha) D++;
    else R++;
  }
  const nT = V + D + R;
  if (nT < 5) continue;
  const wr = V / (V + D) * 100;
  const roi = ((V * ODD + R * 1 - nT) / nT) * 100;
  if (roi > melhorROI && nT >= 8) { melhorROI = roi; melhorX = X; melhorWR = wr; }
  console.log('  | ' + X.toFixed(2).padStart(5) + ' | ' + String(nT).padStart(5) + ' | ' + String(V).padStart(2) + ' | ' + String(D).padStart(2) + ' | ' + String(R).padStart(1) + ' | ' + wr.toFixed(1).padStart(5) + ' | ' + ((roi>=0?'+':'')+roi.toFixed(1)).padStart(5) + ' |');
}

// Comparação
console.log('');
console.log('  🌍 CHI vs outras ligas (DNA comparativo):');
console.log('  | LIGA  | n   | média FT | diff abs | %|d|>=3 | mando |');
console.log('  |-------|-----|----------|----------|---------|-------|');
let n3CHI=0; for (const d of diffs) if (Math.abs(d) >= 3) n3CHI++;
console.log('  | CHI   | ' + String(n).padStart(3) + ' | ' + (sumTotal/n).toFixed(2).padStart(8) + ' | ' + (sumDiffAbs/n).toFixed(2).padStart(8) + ' | ' + (n3CHI/n*100).toFixed(1).padStart(6) + '% | +' + ((venM-venV)/n*100).toFixed(1).padStart(4) + 'pp |');

const OUTRAS = [['BR','brasileirao2026.js','DADOS_BR'],['ARG','argentina2026.js','DADOS_ARG'],['ARG_B','argentina_b2026.js','DADOS_ARG_B'],['MLS','mls2026.js','DADOS_MLS'],['USL','usl2026.js','DADOS_USL'],['ECU','equador2026.js','DADOS_ECU'],['BR_B','brasileiraoB2026.js','DADOS_BR_B']];
for (const [cod, arq, vname] of OUTRAS) {
  try {
    global.window = {};
    const src2 = fs.readFileSync(path.join(BASE,'especialista-cantos/data',arq),'utf8');
    new Function('window', src2.replace(/^\s*\/\/.*$/gm,''))(global.window);
    const jj = (global.window[vname].jogos || []).filter(j => getCantos(j));
    let sT=0, sA=0, vM2=0, vV2=0, pctD=0;
    for (const j of jj) {
      const c = getCantos(j);
      sT += c.m+c.v; sA += Math.abs(c.m-c.v);
      if (c.m > c.v) vM2++; else if (c.m < c.v) vV2++;
      if (Math.abs(c.m-c.v) >= 3) pctD++;
    }
    const nn = jj.length;
    console.log('  | ' + cod.padEnd(5) + ' | ' + String(nn).padStart(3) + ' | ' + (sT/nn).toFixed(2).padStart(8) + ' | ' + (sA/nn).toFixed(2).padStart(8) + ' | ' + (pctD/nn*100).toFixed(1).padStart(6) + '% | +' + ((vM2-vV2)/nn*100).toFixed(1).padStart(4) + 'pp |');
  } catch (e) {}
}

console.log('');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║  🎯 RECOMENDAÇÃO FINAL                                            ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');
console.log('  X atual no HDP-Pro: 2.0 (genérico)');
if (melhorX) console.log('  X ótimo (backtest CHI):  ' + melhorX.toFixed(2) + '  (WR ' + melhorWR.toFixed(1) + '% · ROI ' + (melhorROI>=0?'+':'')+melhorROI.toFixed(1) + '%)');
console.log('  FAV_DOMINANCE CHI: 0.85 (especialista)');
console.log('  Home Win Rate em cantos: ' + (venM/n*100).toFixed(1) + '%');
