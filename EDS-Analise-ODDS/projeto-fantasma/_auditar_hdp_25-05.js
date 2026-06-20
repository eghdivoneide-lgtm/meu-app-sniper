/**
 * Cruza os SINAIS HDP emitidos pelo Especialista (Bala de Prata 26/05/2026)
 * com os RESULTADOS REAIS coletados pelo varredor (rodada 22-25/05).
 *
 * Para cada sinal: calcula GREEN / RED / PUSH e agrega por liga, faixa, linha.
 */
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, 'rodadas');

// ═════════════════════════════════════════════════════════════════════
// SINAIS DO ESPECIALISTA — extraídos dos HTMLs BalaDePrata_*_2026-05-26
// Formato: [mandante, visitante, time_hdp, linha, faixa, diff_proj]
// ═════════════════════════════════════════════════════════════════════
const SINAIS = {
  BR: [
    ['Cruzeiro','Chapecoense','Cruzeiro',-2.5,'ABSOLUTO',5.25],
    ['Vitória','Internacional','Internacional',-2.0,'ABSOLUTO',3.69],
    ['Vasco','Red Bull Bragantino','Vasco',-2.0,'ABSOLUTO',3.61],
    ['Corinthians','Atlético-MG','Atlético-MG',-2.0,'ABSOLUTO',3.59],
    ['Coritiba','Bahia','Bahia',-2.0,'DOMINANTE',3.16],
    ['São Paulo','Botafogo','São Paulo',-1.5,'DOMINANTE',2.31],
    ['Grêmio','Santos','Santos',-0.5,'MODERADO',1.35],
    ['Mirassol','Fluminense','Mirassol',-0.5,'EQUILIBRADO',0.78],
    ['Remo','Athletico-PR','Athletico-PR',-0.5,'EQUILIBRADO',0.36],
    ['Flamengo','Palmeiras','Flamengo',-0.5,'EQUILIBRADO',0.32]
  ],
  BR_B: [
    ['Atletico GO','Sao Bernardo','Atletico GO',-2.5,'DOMINANTE',4.70],
    ['Botafogo SP','Athletic Club','Botafogo SP',-2.0,'DOMINANTE',3.92],
    ['Novorizontino','Ceara','Novorizontino',-2.0,'DOMINANTE',3.37],
    ['Nautico','Cuiaba','Nautico',-1.5,'MODERADO',2.55],
    ['CRB','Ponte Preta','CRB',-0.5,'EQUILIBRADO',1.46],
    ['Fortaleza','Londrina','Fortaleza',-0.5,'EQUILIBRADO',1.19],
    ['Avai','Goias','Avai',-0.5,'EQUILIBRADO',1.00],
    ['Operario-PR','Criciuma','Operario-PR',-0.5,'EQUILIBRADO',0.91],
    ['Juventude','Sport Recife','Sport Recife',-0.5,'EQUILIBRADO',0.45],
    ['America MG','Vila Nova FC','America MG',-0.5,'EQUILIBRADO',0.23]
  ],
  ARG_B: [
    ['Ferro','Central Norte','Ferro',-2.5,'ABSOLUTO',7.35],
    ['San Martin S.J.','Deportivo Maipu','San Martin S.J.',-2.0,'ABSOLUTO',3.98],
    ['Gimnasia y Tiro','Gimnasia Jujuy','Gimnasia y Tiro',-1.5,'DOMINANTE',2.97],
    ['San Miguel','Almirante Brown','San Miguel',-1.5,'DOMINANTE',2.88],
    ['Atl. Rafaela','Midland','Atl. Rafaela',-1.5,'DOMINANTE',2.80],
    ['Colon Santa Fe','CA Mitre','Colon Santa Fe',-1.5,'DOMINANTE',2.76],
    ['Nueva Chicago','Temperley','Temperley',-1.5,'DOMINANTE',2.54],
    ['Godoy Cruz','All Boys','All Boys',-1.5,'DOMINANTE',2.51],
    ['Agropecuario','Quilmes','Agropecuario',-1.5,'MODERADO',2.25],
    ['Acassuso','Def. de Belgrano','Def. de Belgrano',-1.5,'DOMINANTE',2.18],
    ['Chaco For Ever','Deportivo Madryn','Chaco For Ever',-0.5,'EQUILIBRADO',1.43],
    ['Club A. Guemes','Patronato','Club A. Guemes',-0.5,'MEDIANO',1.30],
    ['Los Andes','Racing Cordoba','Racing Cordoba',-0.5,'EQUILIBRADO',1.26],
    ['San Martin T.','Atletico Atlanta','San Martin T.',-0.5,'MEDIANO',1.23],
    ['Tristan Suarez','Colegiales','Colegiales',-0.5,'EQUILIBRADO',1.12],
    ['Chacarita Juniors','Almagro','Almagro',-0.5,'EQUILIBRADO',0.34],
    ['Deportivo Moron','CA Estudiantes','Deportivo Moron',-0.5,'EQUILIBRADO',0.31]
  ],
  MLS: [
    ['Chicago Fire','Toronto FC','Chicago Fire',-2.5,'ABSOLUTO',4.78],
    ['Los Angeles FC','Seattle Sounders','Los Angeles FC',-2.5,'ABSOLUTO',4.50],
    ['Sporting Kansas City','New York Red Bulls','New York Red Bulls',-2.5,'ABSOLUTO',4.35],
    ['FC Cincinnati','Orlando City','FC Cincinnati',-2.0,'ABSOLUTO',3.97],
    ['Charlotte','New England Revolution','Charlotte',-2.0,'ABSOLUTO',3.68],
    ['Nashville SC','New York City','Nashville SC',-2.0,'ABSOLUTO',3.35],
    ['Portland Timbers','San Jose Earthquakes','San Jose Earthquakes',-2.0,'ABSOLUTO',3.09],
    ['Colorado Rapids','FC Dallas','Colorado Rapids',-2.0,'ABSOLUTO',3.06],
    ['Inter Miami','Philadelphia Union','Inter Miami',-1.5,'DOMINANTE',2.57],
    ['Los Angeles Galaxy','Houston Dynamo','Los Angeles Galaxy',-1.5,'DOMINANTE',2.29],
    ['St. Louis City','Austin FC','St. Louis City',-1.5,'DOMINANTE',2.18],
    ['Minnesota United','Real Salt Lake','Minnesota United',-1.0,'MODERADO',1.61],
    ['San Diego FC','Vancouver Whitecaps','Vancouver Whitecaps',-0.5,'MODERADO',1.26],
    ['DC United','CF Montreal','CF Montreal',-0.5,'MEDIANO',0.70],
    ['Columbus Crew','Atlanta Utd','Atlanta Utd',-0.5,'EQUILIBRADO',0.41]
  ],
  USL: [
    ['Miami FC','Louisville City','Louisville City',-2.5,'ABSOLUTO',5.88],
    ['Loudoun','Detroit','Detroit',-2.5,'ABSOLUTO',5.45],
    ['Orange County SC','Oakland Roots','Oakland Roots',-2.0,'DOMINANTE',3.36],
    ['Tampa Bay','Phoenix Rising','Tampa Bay',-1.5,'DOMINANTE',2.93],
    ['Indy Eleven','Lexington','Indy Eleven',-1.5,'MODERADO',2.11],
    ['Rhode Island','Brooklyn','Rhode Island',-1.0,'MODERADO',1.72],
    ['Sporting Jax','San Antonio','San Antonio',-0.5,'EQUILIBRADO',1.20],
    ['New Mexico','Charleston','New Mexico',-0.5,'EQUILIBRADO',1.10],
    ['Las Vegas Lights','Colorado Springs','Colorado Springs',-0.5,'EQUILIBRADO',0.90],
    ['FC Tulsa','Hartford Athletic','Hartford Athletic',-0.5,'EQUILIBRADO',0.62],
    ['San Antonio','Sacramento Republic','Sacramento Republic',-0.5,'EQUILIBRADO',0.43],
    ['Monterey Bay','Birmingham','Monterey Bay',-0.5,'EQUILIBRADO',0.02]
  ],
  CHI: [
    ['A. Italiano','Cobresal','Cobresal',-1.5,'DOMINANTE',2.81],
    ['D. Concepcion','Huachipato','D. Concepcion',-1.5,'MODERADO',2.27],
    ['Nublense','U. De Concepcion','Nublense',-1.0,'MEDIANO',1.68],
    ['U. Catolica','Colo Colo','Colo Colo',-0.5,'MEDIANO',1.45],
    ['Union La Calera','Palestino','Palestino',-0.5,'EQUILIBRADO',1.40],
    ['Everton','Coquimbo','Coquimbo',-0.5,'EQUILIBRADO',1.10],
    ['La Serena','Limache','La Serena',-0.5,'EQUILIBRADO',0.94]
  ],
  ECU: [
    ['Ind. del Valle','Leones del Norte','Ind. del Valle',-2.5,'ABSOLUTO',6.34],
    ['Aucas','Delfin','Aucas',-2.0,'ABSOLUTO',3.93],
    ['Emelec','LDU Quito','Emelec',-2.0,'DOMINANTE',3.14],
    ['Macara','Libertad','Macara',-0.5,'MEDIANO',1.25],
    ['Guayaquil City','Tecnico U.','Tecnico U.',-0.5,'EQUILIBRADO',0.90],
    ['Orense','Barcelona SC','Orense',-0.5,'EQUILIBRADO',0.75],
    ['Mushuc Runa','Dep. Cuenca','Dep. Cuenca',-0.5,'EQUILIBRADO',0.57],
    ['Manta','U. Catolica','Manta',-0.5,'EQUILIBRADO',0.41]
  ]
};

// Normaliza nome — tira acentos e espaços/símbolos pra match fuzzy
function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}

// Carrega jogos da liga (rodada 22-25/05 já filtrada)
function carregarJogos(liga) {
  const arq = path.join(BASE, liga, liga.toLowerCase() + '_rodada_2_2026-05-26.json');
  if (!fs.existsSync(arq)) return [];
  const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
  return Array.isArray(d) ? d : (d.jogos || []);
}

function buscarJogo(jogos, m, v) {
  const nm = norm(m), nv = norm(v);
  return jogos.find(j => norm(j.mandante) === nm && norm(j.visitante) === nv)
      || jogos.find(j => norm(j.mandante).includes(nm) || nm.includes(norm(j.mandante)))
              && jogos.find(j => norm(j.visitante).includes(nv) || nv.includes(norm(j.visitante)));
}

// Avalia o pick contra os cantos reais
function avaliarPick(sinal, jogo) {
  const [m, v, timeHDP, linha] = sinal;
  const c = jogo.estatisticas_ft && jogo.estatisticas_ft.cantos;
  if (!c || c.m == null) return null;
  const cantosFav = norm(timeHDP) === norm(jogo.mandante) ? c.m : c.v;
  const cantosOpo = norm(timeHDP) === norm(jogo.mandante) ? c.v : c.m;
  const diff = cantosFav - cantosOpo;
  const margem = diff + linha; // linha negativa (-1.5, -2.0...)
  let resultado;
  if (margem > 0) resultado = 'V';
  else if (margem < 0) resultado = 'D';
  else resultado = 'R'; // PUSH (só em linha inteira: -1.0, -2.0)
  return { cantos: c.m + '-' + c.v, diff_real: diff, margem, resultado };
}

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  AUDITORIA — SINAIS HDP do ESPECIALISTA vs RESULTADOS REAIS (22-25/05)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const todos = [];
for (const liga of Object.keys(SINAIS)) {
  const jogos = carregarJogos(liga);
  console.log('══ [' + liga + '] ' + SINAIS[liga].length + ' sinais ══');
  console.log('| Partida'.padEnd(54) + '| Pick'.padEnd(35) + '| Cantos | Diff | Result |');
  for (const s of SINAIS[liga]) {
    const [m, v, time, linha, faixa] = s;
    const j = buscarJogo(jogos, m, v);
    if (!j) { console.log('  ❓ ' + m + ' x ' + v + ' — jogo não encontrado na coleta'); continue; }
    const r = avaliarPick(s, j);
    if (!r) { console.log('  ⚠️ ' + m + ' x ' + v + ' — sem cantos'); continue; }
    const icon = r.resultado === 'V' ? '✅ GREEN' : r.resultado === 'D' ? '❌ RED  ' : '➖ PUSH ';
    console.log('  '+(m+' x '+v).substring(0,50).padEnd(52)+' '+(time+' '+linha+' ['+faixa+']').substring(0,33).padEnd(35)+' '+r.cantos.padEnd(7)+' '+String(r.diff_real).padStart(4)+'  '+icon);
    todos.push({ liga, faixa, linha, resultado: r.resultado, diff_proj: s[5], diff_real: r.diff_real, pick: time + ' ' + linha, jogo: m + ' x ' + v });
  }
  console.log('');
}

// ═════ AGREGADO ═════
function agreg(arr) {
  const V = arr.filter(x => x.resultado === 'V').length;
  const D = arr.filter(x => x.resultado === 'D').length;
  const R = arr.filter(x => x.resultado === 'R').length;
  const n = arr.length;
  return { n, V, D, R, wr: n ? +(V/n*100).toFixed(1) : 0, wr_sem_push: (V+D)>0 ? +(V/(V+D)*100).toFixed(1) : 0 };
}

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  AGREGADO POR LIGA');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('| LIGA  | N  | V  | D  | R | WR%  | WR s/push |');
for (const liga of Object.keys(SINAIS)) {
  const a = agreg(todos.filter(x => x.liga === liga));
  console.log('| '+liga.padEnd(5)+' | '+String(a.n).padStart(2)+' | '+String(a.V).padStart(2)+' | '+String(a.D).padStart(2)+' | '+String(a.R).padStart(1)+' | '+String(a.wr).padStart(4)+' | '+String(a.wr_sem_push).padStart(9)+' |');
}
const total = agreg(todos);
console.log('|-------|----|----|----|---|------|-----------|');
console.log('| TOTAL | '+String(total.n).padStart(2)+' | '+String(total.V).padStart(2)+' | '+String(total.D).padStart(2)+' | '+String(total.R).padStart(1)+' | '+String(total.wr).padStart(4)+' | '+String(total.wr_sem_push).padStart(9)+' |');

console.log('\n═══ POR FAIXA DE CONFIANÇA ═══');
for (const faixa of ['ABSOLUTO','DOMINANTE','MODERADO','MEDIANO','EQUILIBRADO']) {
  const a = agreg(todos.filter(x => x.faixa === faixa));
  if (!a.n) continue;
  console.log('  '+faixa.padEnd(12)+' n='+String(a.n).padStart(2)+' · WR='+String(a.wr).padStart(5)+'%  ('+a.V+'V/'+a.D+'D/'+a.R+'R)');
}

console.log('\n═══ POR LINHA HDP ═══');
for (const linha of [-2.5,-2.0,-1.5,-1.0,-0.5]) {
  const a = agreg(todos.filter(x => x.linha === linha));
  if (!a.n) continue;
  console.log('  HDP '+linha+'  n='+String(a.n).padStart(2)+' · WR='+String(a.wr).padStart(5)+'%  ('+a.V+'V/'+a.D+'D/'+a.R+'R)');
}

console.log('\n═══ SURPRESAS (sinais ABSOLUTO/DOMINANTE que ERRARAM) ═══');
const reds = todos.filter(x => x.resultado === 'D' && ['ABSOLUTO','DOMINANTE'].includes(x.faixa));
for (const r of reds) {
  console.log('  ❌ '+r.jogo+' | '+r.pick+' ['+r.faixa+'] | proj +'+r.diff_proj+' · real '+r.diff_real);
}
