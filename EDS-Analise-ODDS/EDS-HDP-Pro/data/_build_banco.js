// Pré-compila o banco para ser consumido pelo browser sem servidor.
// Gera data/_banco.js com window.HDP_BANCO + window.HDP_RANKINGS
//
// Uso: node data/_build_banco.js

const fs = require('fs');
const path = require('path');
const { LIGAS, carregarLiga } = require('../motor/_io');
const { calcularRankings } = require('../motor/ranking_hdp');

console.log('🔨 Build do banco para o browser…');

const banco = {};
const rankings = {};
for (const l of LIGAS) {
  banco[l] = carregarLiga(l);
  rankings[l] = calcularRankings(l);
  console.log(`  ✅ ${l}: ${banco[l].length} jogos, ${rankings[l].times_total} times`);
}

const total = Object.values(banco).reduce((s, j) => s + j.length, 0);

const out = `// EDS-HDP-Pro · banco pré-compilado
// Gerado por data/_build_banco.js em ${new Date().toISOString()}
// NÃO EDITAR À MÃO — regenerar via: node data/_build_banco.js
window.HDP_BANCO = ${JSON.stringify(banco)};
window.HDP_RANKINGS = ${JSON.stringify(rankings)};
window.HDP_META = ${JSON.stringify({
  gerado_em: new Date().toISOString(),
  total_jogos: total,
  ligas: LIGAS
})};
`;

const outPath = path.join(__dirname, '_banco.js');
fs.writeFileSync(outPath, out);
const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`\n✅ Gerado: ${outPath} (${sizeKB} KB · ${total} jogos)`);
