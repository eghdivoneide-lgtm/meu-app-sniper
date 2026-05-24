/**
 * Diagnóstico rápido de brasileiraoB2026.js — investigar 18 jogos a mais.
 */
const fs = require('fs');
const path = require('path');

const ARQ = path.join(__dirname, 'EDS-Analise-ODDS', 'especialista-cantos', 'data', 'brasileiraoB2026.js');
const code = fs.readFileSync(ARQ, 'utf8');
const m = code.match(/window\.DADOS_BR_B\s*=\s*(\{[\s\S]+\})\s*;?\s*$/);
const dados = JSON.parse(m[1]);
const jogos = dados.jogos;

console.log(`Total de jogos: ${jogos.length}`);
console.log(`Times no array: ${dados.times.length}`);
console.log('');

// Distribuição de datas
const datasFmt = jogos.map(j => j.data).filter(Boolean).sort();
console.log(`Data mais antiga: ${datasFmt[0]}`);
console.log(`Data mais recente: ${datasFmt[datasFmt.length - 1]}`);
console.log('');

// Distribuição por mês
const porMes = {};
datasFmt.forEach(d => {
  const mes = d.split(' ')[0].split('.').slice(1).reverse().join('-'); // DD.MM.YYYY → YYYY-MM
  porMes[mes] = (porMes[mes] || 0) + 1;
});
console.log('Jogos por mês:');
Object.entries(porMes).sort().forEach(([m, n]) => console.log(`  ${m}: ${n} jogos`));
console.log('');

// Confrontos: cada par de times deveria aparecer no MÁXIMO 2x (turno + returno)
const confrontos = {};
jogos.forEach(j => {
  const par = [j.mandante, j.visitante].sort().join(' × ');
  if (!confrontos[par]) confrontos[par] = [];
  confrontos[par].push({ data: j.data, m: j.mandante, v: j.visitante, placar: j.placar, id: j.match_id });
});

const duplicados = Object.entries(confrontos).filter(([_, jogs]) => jogs.length > 1);
console.log(`Confrontos com 2+ jogos (turno + returno OU duplicata): ${duplicados.length}`);
duplicados.forEach(([par, jogs]) => {
  console.log(`  ${par}:`);
  jogs.forEach(j => console.log(`    - ${j.data} | ${j.m} ${j.placar?.m ?? '?'} - ${j.placar?.v ?? '?'} ${j.v} | id ${j.id}`));
});
console.log('');

// Jogos por time — lista completa
const porTime = {};
jogos.forEach(j => {
  if (j.mandante) porTime[j.mandante] = (porTime[j.mandante] || 0) + 1;
  if (j.visitante) porTime[j.visitante] = (porTime[j.visitante] || 0) + 1;
});
console.log('Jogos por time (deveria ser 6 cada):');
Object.entries(porTime).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => {
  const flag = n === 6 ? '✅' : (n > 6 ? '🚨' : '⚠️');
  console.log(`  ${flag} ${t.padEnd(25)} ${n}`);
});
