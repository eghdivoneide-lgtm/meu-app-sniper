// ════════════════════════════════════════════════════════════════════
// CONSTRUIR CÉREBRO — Script standalone
// Varre TODA a base, gera o cérebro completo, salva em disco
// e imprime resumo executivo.
//
// Uso: node construir_cerebro.js
// ════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const { carregarBase }                                          = require('./engine/loader');
const { construirCerebro, salvarCerebro, resumoCerebro }       = require('./engine/cerebro');

console.log('');
console.log('🛡️  ════════════════════════════════════════════════════════════════');
console.log('       CONSTRUTOR DO CÉREBRO — Auditor Supremo de Cantos');
console.log('       EDS Soluções Inteligentes');
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');

// Carrega base completa (modo PRODUÇÃO — tudo que tem)
console.log('📥 Carregando base completa do banco...');
const base = carregarBase({ dataLimite: null });

const ligasOk = Object.keys(base.ligas).filter(c => !base.ligas[c].erro);
let totalJogos = 0, totalTimes = 0;
for (const c of ligasOk) {
  totalJogos += base.ligas[c].jogos.length;
  totalTimes += base.ligas[c].times.length;
}
console.log(`   ${ligasOk.length} ligas, ${totalTimes} times, ${totalJogos} jogos\n`);

// Constrói o cérebro
const cerebro = construirCerebro(base, { logProgresso: true });

// Salva
const { arquivoVersao, arquivoAtual } = salvarCerebro(cerebro);
console.log('\n💾 Salvo em:');
console.log('   ' + arquivoVersao);
console.log('   ' + arquivoAtual + '  (link permanente)');
console.log('');

// Resumo executivo
console.log('');
console.log(resumoCerebro(cerebro, 8));

// Tamanho do cérebro
const sizeKb = Math.round(fs.statSync(arquivoAtual).size / 1024);
console.log(`\n📦 Tamanho do cérebro: ${sizeKb} KB\n`);
