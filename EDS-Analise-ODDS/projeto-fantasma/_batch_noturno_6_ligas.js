/**
 * BATCH NOTURNO — Uniformização das 6 ligas restantes
 *
 * Ordem (menor → maior, pra validar fluxo cedo):
 *   BR_B → BR → ARG_B → ARG → BUN → J2J3
 *
 * Para cada liga:
 *   1. MERGE express (move ricos já coletados pro banco)
 *   2. ENRIQUECER (scraping dos pobres com Flash ID)
 *   3. MERGE final (consolida novos ricos)
 *
 * Log detalhado em rodadas/_batch_noturno.log
 * Resumo final em rodadas/_batch_noturno_resumo.json
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIGAS = ['BR_B', 'BR', 'ARG_B', 'ARG', 'BUN', 'J2J3'];

const LOG_PATH    = path.join(__dirname, 'rodadas', '_batch_noturno.log');
const RESUMO_PATH = path.join(__dirname, 'rodadas', '_batch_noturno_resumo.json');

function log(msg) {
  const linha = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(linha);
  fs.appendFileSync(LOG_PATH, linha);
}

function rodar(cmd, args, label) {
  log(`▶ ${label}: node ${cmd} ${args.join(' ')}`);
  const r = spawnSync('node', [cmd, ...args], {
    cwd: __dirname,
    stdio: ['ignore', 'inherit', 'inherit'],
    timeout: 14400000  // 4h por step
  });
  log(`◀ ${label} → exitCode: ${r.status}`);
  return r.status === 0;
}

// Inicializar log
fs.writeFileSync(LOG_PATH, '');
log('═══════════════════════════════════════════════════════');
log(`🌙 BATCH NOTURNO INICIADO — 6 ligas: ${LIGAS.join(', ')}`);
log('═══════════════════════════════════════════════════════');

const resumo = [];
const tInicio = Date.now();

for (const liga of LIGAS) {
  const tLigaInicio = Date.now();
  log('');
  log('═══════════════════════════════════════════════════════');
  log(`🏁 LIGA: ${liga}`);
  log('═══════════════════════════════════════════════════════');

  const result = { liga, etapas: {}, tempoMin: 0 };

  // 1. MERGE express
  log(`[${liga}] Etapa 1: MERGE express`);
  result.etapas.merge1 = rodar('_mesclar_ricos_no_banco.js', ['--liga', liga], `${liga} MERGE-1`);

  // 2. ENRIQUECER
  log(`[${liga}] Etapa 2: ENRIQUECIMENTO`);
  result.etapas.enriquecer = rodar('_enriquecer_liga.js', ['--liga', liga], `${liga} SCRAPING`);

  // 3. MERGE final
  log(`[${liga}] Etapa 3: MERGE final`);
  result.etapas.merge2 = rodar('_mesclar_ricos_no_banco.js', ['--liga', liga], `${liga} MERGE-2`);

  // 4. Limpeza preventiva (caso varredor antigo tenha sido cacheado)
  log(`[${liga}] Etapa 4: Limpeza preventiva 2T`);
  result.etapas.limpeza = rodar('_limpar_estatisticas_2t.js', [], `${liga} LIMPEZA`);

  result.tempoMin = ((Date.now() - tLigaInicio) / 60000).toFixed(1);
  log(`✅ ${liga} CONCLUÍDA em ${result.tempoMin} min`);

  resumo.push(result);
  fs.writeFileSync(RESUMO_PATH, JSON.stringify(resumo, null, 2));
}

const tempoTotalMin = ((Date.now() - tInicio) / 60000).toFixed(1);
log('');
log('═══════════════════════════════════════════════════════');
log(`🏆 BATCH NOTURNO COMPLETO — ${tempoTotalMin} min totais`);
log('═══════════════════════════════════════════════════════');
resumo.forEach(r => {
  const ok = Object.values(r.etapas).every(Boolean) ? '✅' : '⚠️';
  log(`  ${ok} ${r.liga} — ${r.tempoMin} min`);
});
log('');
log('Resumo salvo em: rodadas/_batch_noturno_resumo.json');
log('Log completo em: rodadas/_batch_noturno.log');
