/**
 * Batch de coleta — 25/05/2026
 * Roda varredor-rodada.js para 10 ligas ativas (sem asiáticas) em SÉRIE.
 * Coleta vai pra projeto-fantasma/rodadas/<LIGA>/ — sem injetar no especialista.
 *
 * Operador autorizou em 25/05/2026.
 *
 * Output: _batch_25-05_resumo.json com stats por liga
 * Log:    _batch_25-05.log (acompanhar com: tail -f)
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIGAS = ['BR', 'BR_B', 'ARG', 'ARG_B', 'MLS', 'USL', 'BUN', 'CHI', 'ECU', 'ALM'];

const LOG_PATH = path.join(__dirname, '_batch_25-05.log');
const RES_PATH = path.join(__dirname, '_batch_25-05_resumo.json');

function logLinha(msg) {
  const linha = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_PATH, linha);
  process.stdout.write(linha);
}

// Zera log no início
fs.writeFileSync(LOG_PATH, '');

async function rodarLiga(cod) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    logLinha(`▶️  Iniciando ${cod}...`);
    const child = spawn('node', ['varredor-rodada.js', '--liga', cod], {
      cwd: __dirname,
      env: process.env
    });

    let stdoutLen = 0;
    child.stdout.on('data', (d) => {
      stdoutLen += d.length;
      fs.appendFileSync(LOG_PATH, '[' + cod + '] ' + d.toString());
    });
    child.stderr.on('data', (d) => {
      fs.appendFileSync(LOG_PATH, '[' + cod + ' STDERR] ' + d.toString());
    });

    // Timeout de segurança: 12 min por liga
    const timeoutId = setTimeout(() => {
      logLinha(`⏰ ${cod} excedeu 12 min — abortando`);
      try { child.kill(); } catch (e) {}
    }, 12 * 60 * 1000);

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      const tempo = ((Date.now() - t0) / 1000).toFixed(1);
      logLinha(`${code === 0 ? '✅' : '❌'} ${cod} terminou (exit=${code}, ${tempo}s, ${stdoutLen}b)`);
      resolve({ liga: cod, exit: code, tempo_s: +tempo, stdout_bytes: stdoutLen });
    });
  });
}

// Conta jogos coletados na rodada mais recente da liga
function statsLiga(cod) {
  const dir = path.join(__dirname, 'rodadas', cod);
  if (!fs.existsSync(dir)) return { dir_existe: false };
  const arqs = fs.readdirSync(dir)
    .filter(a => a.endsWith('.json') && !a.includes('backup') && !a.includes('lote'))
    .map(a => ({ nome: a, mtime: fs.statSync(path.join(dir, a)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);
  if (!arqs.length) return { dir_existe: true, arquivos: 0 };
  const maisRecente = arqs[0];
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dir, maisRecente.nome), 'utf8'));
    const jogos = Array.isArray(d) ? d : (d.jogos || []);
    const comCantos = jogos.filter(j => j.estatisticas_ft && j.estatisticas_ft.cantos && j.estatisticas_ft.cantos.m !== undefined).length;
    return {
      dir_existe: true,
      arquivos: arqs.length,
      mais_recente: maisRecente.nome,
      mtime: maisRecente.mtime.toISOString(),
      jogos_total: jogos.length,
      jogos_com_cantos: comCantos,
      pct_rico: jogos.length ? Math.round(comCantos / jogos.length * 100) : 0
    };
  } catch (e) { return { dir_existe: true, erro: e.message.substring(0, 80) }; }
}

(async () => {
  logLinha('🚀 BATCH 25/05/2026 — 10 ligas em série');
  logLinha('   Ligas: ' + LIGAS.join(', '));

  const resultados = [];
  for (const cod of LIGAS) {
    const r = await rodarLiga(cod);
    r.stats = statsLiga(cod);
    resultados.push(r);

    // Salva resumo parcial a cada liga (caso aborte)
    fs.writeFileSync(RES_PATH, JSON.stringify({
      inicio: resultados[0]?._inicio,
      em_andamento: cod !== LIGAS[LIGAS.length - 1],
      total_ligas: LIGAS.length,
      concluidas: resultados.length,
      resultados
    }, null, 2));
  }

  const okN = resultados.filter(r => r.exit === 0).length;
  logLinha('');
  logLinha('═══════════════════════════════════════════════════════════');
  logLinha(`🏁 BATCH CONCLUÍDO: ${okN}/${LIGAS.length} ligas OK`);
  logLinha('═══════════════════════════════════════════════════════════');
  for (const r of resultados) {
    const s = r.stats;
    logLinha(`  ${r.exit === 0 ? '✅' : '❌'} ${r.liga.padEnd(6)} | ${r.tempo_s}s | ${s.jogos_com_cantos || 0}/${s.jogos_total || 0} jogos com cantos (${s.pct_rico || 0}%)`);
  }
  logLinha('');
  logLinha(`📄 Resumo: _batch_25-05_resumo.json`);
})();
