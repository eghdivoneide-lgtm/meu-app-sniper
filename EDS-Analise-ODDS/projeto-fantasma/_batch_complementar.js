/**
 * BATCH COMPLEMENTAR — USL + BR + 5 ligas novas
 *
 * Ordem:
 *   1. USL: enriquecer (MERGE + SCRAPING + MERGE)
 *   2. BR:  varredor (rodada atual) — coleta novos jogos
 *   3-7. J1, CHI, ECU, CHN_SL, CHN_L1: varredor (rodada atual)
 *
 * Log em rodadas/_batch_complementar.log
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, 'rodadas', '_batch_complementar.log');

function log(msg) {
  const linha = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(linha);
  fs.appendFileSync(LOG_PATH, linha);
}

function rodar(cmd, args, label) {
  log(`▶ ${label}`);
  const r = spawnSync('node', [cmd, ...args], {
    cwd: __dirname,
    stdio: ['ignore', 'inherit', 'inherit'],
    timeout: 7200000
  });
  log(`◀ ${label} → exitCode: ${r.status}`);
  return r.status === 0;
}

fs.writeFileSync(LOG_PATH, '');
log('═══════════════════════════════════════════════════════');
log('🌅 BATCH COMPLEMENTAR INICIADO');
log('═══════════════════════════════════════════════════════');

const tInicio = Date.now();
const resumo = [];

// ───────────────────────────────────────────────────────
//  ETAPA 1: USL — pipeline completo
// ───────────────────────────────────────────────────────
const tUsl = Date.now();
log('');
log('═══ USL — pipeline (MERGE + SCRAPING + MERGE) ═══');
const uslMerge1 = rodar('_mesclar_ricos_no_banco.js', ['--liga', 'USL'], 'USL MERGE-1');
const uslScrap  = rodar('_enriquecer_liga.js',         ['--liga', 'USL'], 'USL SCRAPING');
const uslMerge2 = rodar('_mesclar_ricos_no_banco.js', ['--liga', 'USL'], 'USL MERGE-2');
resumo.push({ liga: 'USL', tempo: ((Date.now()-tUsl)/60000).toFixed(1) + ' min', ok: uslMerge1 && uslScrap && uslMerge2 });

// ───────────────────────────────────────────────────────
//  ETAPA 2: BR — varredor + enriquecedor pra capturar novos
// ───────────────────────────────────────────────────────
const tBr = Date.now();
log('');
log('═══ BR — varredor (rodada atual) ═══');
const brVar = rodar('varredor-rodada.js', ['--liga', 'BR'], 'BR VARREDOR');
log('  ⚠️  Lembre: novos jogos NÃO entram no banco automaticamente — exige injeção manual ou re-execução do _injetar_rodada_*.js');
resumo.push({ liga: 'BR', tempo: ((Date.now()-tBr)/60000).toFixed(1) + ' min', ok: brVar });

// ───────────────────────────────────────────────────────
//  ETAPA 3-7: 5 ligas novas — só varredor
// ───────────────────────────────────────────────────────
const NOVAS = ['J1', 'CHI', 'ECU', 'CHN_SL', 'CHN_L1'];
for (const liga of NOVAS) {
  const t = Date.now();
  log('');
  log(`═══ ${liga} — varredor ═══`);
  const ok = rodar('varredor-rodada.js', ['--liga', liga], `${liga} VARREDOR`);
  resumo.push({ liga, tempo: ((Date.now()-t)/60000).toFixed(1) + ' min', ok });
}

const totalMin = ((Date.now()-tInicio)/60000).toFixed(1);
log('');
log('═══════════════════════════════════════════════════════');
log(`🏆 BATCH COMPLEMENTAR COMPLETO — ${totalMin} min`);
log('═══════════════════════════════════════════════════════');
resumo.forEach(r => log(`  ${r.ok ? '✅' : '⚠️'} ${r.liga.padEnd(8)} — ${r.tempo}`));

fs.writeFileSync(path.join(__dirname, 'rodadas', '_batch_complementar_resumo.json'), JSON.stringify(resumo, null, 2));
