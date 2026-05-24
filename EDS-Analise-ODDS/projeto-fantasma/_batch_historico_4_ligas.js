/**
 * BATCH HISTÓRICO — CHI → ECU → CHN_SL → CHN_L1 (sequencial)
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIGAS = ['CHI', 'ECU', 'CHN_SL', 'CHN_L1'];
const LOG_PATH = path.join(__dirname, 'rodadas', '_batch_historico_4ligas.log');

function log(msg) {
  const linha = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(linha);
  fs.appendFileSync(LOG_PATH, linha);
}

fs.writeFileSync(LOG_PATH, '');
log('═══════════════════════════════════════════════════════');
log(`🌍 BATCH HISTÓRICO 4 LIGAS — ${LIGAS.join(', ')}`);
log('═══════════════════════════════════════════════════════');

const tInicio = Date.now();
const resumo = [];

for (const liga of LIGAS) {
  const tLiga = Date.now();
  log('');
  log(`═══ ${liga} — coletor histórico ═══`);
  const r = spawnSync('node', ['_coletar_historico_liga.js', '--liga', liga, '--max', '500'], {
    cwd: __dirname,
    stdio: ['ignore', 'inherit', 'inherit'],
    timeout: 7200000
  });
  const mins = ((Date.now()-tLiga)/60000).toFixed(1);
  log(`◀ ${liga} → exitCode: ${r.status} | tempo: ${mins} min`);
  resumo.push({ liga, ok: r.status === 0, tempo: mins + ' min' });
  fs.writeFileSync(path.join(__dirname, 'rodadas', '_batch_historico_4ligas_resumo.json'), JSON.stringify(resumo, null, 2));
}

const totalMin = ((Date.now()-tInicio)/60000).toFixed(1);
log('');
log('═══════════════════════════════════════════════════════');
log(`🏆 BATCH HISTÓRICO COMPLETO — ${totalMin} min`);
log('═══════════════════════════════════════════════════════');
resumo.forEach(r => log(`  ${r.ok ? '✅' : '⚠️'} ${r.liga.padEnd(8)} — ${r.tempo}`));
