
/**
 * DIAGNÓSTICO AVANÇADO — MLS 2026
 * Detecta campos com valor zero que podem representar ausência real de dado
 * e investiga os jogos da rodada 0
 */

const fs   = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'especialista-cantos', 'data');
const arquivo = path.join(dataDir, 'mls2026.js');

const raw = fs.readFileSync(arquivo, 'utf-8');
const window = {};
const varNames = ['DADOS_MLS','DADOS_BR','DADOS_ARG','DADOS_USL','DADOS_BUN','DADOS_ECU'];
const decls = varNames.map(v => `var ${v};`).join('\n');
const fn = new Function('window', 'module', decls + '\n' + raw + '\nreturn window;');
const w = fn({}, { exports: {} });
const dados = w['DADOS_MLS'];

const jogos = dados.jogos || [];

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║    🔬 DIAGNÓSTICO AVANÇADO — MLS 2026               ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ── Critério expandido: valores zerados também são suspeitos ──
// Cantos 0-0 em ambos os tempos = provável dado faltando
// Finalizações 0-0 = improvável em jogo real

let suspeitosCantos = 0, suspeitosHT = 0, semiCompletos = 0;
let rodada0Completos = 0, rodada0Suspeitos = 0;

const problematicos = [];
const rod0Jogos = [];

jogos.forEach((j, idx) => {
  const cantFT = j.cantos?.ft || { m: 0, v: 0 };
  const cantHT = j.cantos?.ht || { m: 0, v: 0 };
  const fins = j.stats_taticas?.finalizacoes || { m: 0, v: 0 };
  
  const cantos_ft_zeros = cantFT.m === 0 && cantFT.v === 0;
  const cantos_ht_zeros = cantHT.m === 0 && cantHT.v === 0;
  const fins_zeros      = fins.m === 0 && fins.v === 0;
  const cantos_total    = cantFT.m + cantFT.v;
  
  // Suspeito: ambos tempos com 0 cantos E finalizações 0
  const altamente_suspeito = cantos_ft_zeros && cantos_ht_zeros && fins_zeros;
  // Levemente suspeito: cantos FT zerados mas tem placar
  const levemente_suspeito = cantos_ft_zeros && (j.placar?.m > 0 || j.placar?.v > 0);
  
  const temPlacar = j.placar && j.placar.m != null;
  const rodada = j.rodada || 0;
  
  if (altamente_suspeito) {
    suspeitosCantos++;
    problematicos.push({
      rodada, data: j.data || '?',
      mandante: j.mandante, visitante: j.visitante,
      placar: temPlacar ? `${j.placar.m}-${j.placar.v}` : 'N/A',
      cantos_ft: `${cantFT.m}-${cantFT.v}`,
      cantos_ht: `${cantHT.m}-${cantHT.v}`,
      fins: `${fins.m}-${fins.v}`,
      tipo: '❌ ALTAMENTE SUSPEITO (tudo zero)'
    });
  } else if (levemente_suspeito) {
    problematicos.push({
      rodada, data: j.data || '?',
      mandante: j.mandante, visitante: j.visitante,
      placar: temPlacar ? `${j.placar.m}-${j.placar.v}` : 'N/A',
      cantos_ft: `${cantFT.m}-${cantFT.v}`,
      cantos_ht: `${cantHT.m}-${cantHT.v}`,
      fins: `${fins.m}-${fins.v}`,
      tipo: '⚠️  Cantos FT=0 com gols marcados'
    });
  }
  
  // Rodada 0 análise detalhada
  if (rodada === 0) {
    rod0Jogos.push({
      mandante: j.mandante, visitante: j.visitante,
      data: j.data || '?',
      placar: temPlacar ? `${j.placar.m}-${j.placar.v}` : 'sem placar',
      cantos_ft: `${cantFT.m}-${cantFT.v}`,
      cantos_ht: `${cantHT.m}-${cantHT.v}`,
      suspeito: altamente_suspeito || levemente_suspeito
    });
    if (altamente_suspeito || levemente_suspeito) rodada0Suspeitos++;
    else rodada0Completos++;
  }
});

// ── Resumo de suspeitos ──
console.log('═══════════════════════════════════════════════════════');
console.log('         ANÁLISE COM CRITÉRIO EXPANDIDO (zeros)');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Total de jogos:              ${jogos.length}`);
console.log(`  ❌ Altamente suspeitos:       ${problematicos.filter(p=>p.tipo.includes('ALTA')).length}`);
console.log(`  ⚠️  Com cantos FT=0 + gols:   ${problematicos.filter(p=>p.tipo.includes('Cantos')).length}`);
console.log(`  ✅ Sem qualquer suspeita:     ${jogos.length - problematicos.length}`);

// ── Rodada 0 ──
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log(`         RODADA 0 — ${rod0Jogos.length} JOGOS (SUSPEITA DE DADO ANTIGO)`);
console.log('═══════════════════════════════════════════════════════');
console.log(`  ✅ Com dados normais:  ${rodada0Completos}`);
console.log(`  ⚠️  Suspeitos:          ${rodada0Suspeitos}`);
console.log('');

// Datas dos jogos da rodada 0
const datasRod0 = [...new Set(rod0Jogos.map(j => j.data))].sort();
console.log('  📅 Datas dos jogos da rodada 0:');
datasRod0.forEach(d => {
  const count = rod0Jogos.filter(j => j.data === d).length;
  console.log(`     ${d}: ${count} jogos`);
});

// ── Jogos com problemas listados ──
if (problematicos.length > 0) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`      JOGOS COM DADOS SUSPEITOS (${problematicos.length} total)`);
  console.log('═══════════════════════════════════════════════════════');
  problematicos.slice(0, 40).forEach(j => {
    console.log(`  ${j.tipo}`);
    console.log(`     Rod ${String(j.rodada).padStart(2)} | ${j.data} | ${j.mandante} vs ${j.visitante}`);
    console.log(`     Placar: ${j.placar} | Cantos FT: ${j.cantos_ft} | HT: ${j.cantos_ht} | Fins: ${j.fins}`);
  });
}

// ── Distribuição de cantos por rodada ──
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('     MÉDIA DE CANTOS FT POR RODADA (sanidade dos dados)');
console.log('═══════════════════════════════════════════════════════');
const porRodadaStats = {};
jogos.forEach(j => {
  const rod = j.rodada || 0;
  if (!porRodadaStats[rod]) porRodadaStats[rod] = { soma: 0, count: 0, zeros: 0 };
  const total = (j.cantos?.ft?.m || 0) + (j.cantos?.ft?.v || 0);
  porRodadaStats[rod].soma += total;
  porRodadaStats[rod].count++;
  if (total === 0) porRodadaStats[rod].zeros++;
});

Object.keys(porRodadaStats).sort((a,b)=>Number(a)-Number(b)).forEach(rod => {
  const r = porRodadaStats[rod];
  const media = r.count > 0 ? (r.soma / r.count).toFixed(1) : 0;
  const icon = r.zeros > r.count * 0.3 ? '🔴' : r.zeros > 0 ? '🟡' : '✅';
  console.log(`  ${icon} Rodada ${String(rod).padStart(2)}: ${r.count} jogos | média cantos FT: ${media} | jogos c/ 0 cantos: ${r.zeros}`);
});

console.log('');
console.log('✅ Diagnóstico completo!');
