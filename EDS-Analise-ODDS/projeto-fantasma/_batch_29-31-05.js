/**
 * Batch coleta 29-31/05/2026 — 7 ligas ativas
 * Saída em projeto-fantasma/rodadas/<LIGA>/<liga>_rodada_2_2026-06-01.json
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIGAS = ['BR','BR_B','ARG_B','MLS','USL','CHI','ECU'];

const LOG = path.join(__dirname, '_batch_29-31-05.log');
const RES = path.join(__dirname, '_batch_29-31-05_resumo.json');
fs.writeFileSync(LOG,'');

function log(m) { const l='['+new Date().toISOString()+'] '+m+'\n'; fs.appendFileSync(LOG,l); process.stdout.write(l); }

async function rodar(cod) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    log('▶️  Iniciando ' + cod);
    const child = spawn('node', ['varredor-rodada.js','--liga',cod], { cwd: __dirname, env: process.env });
    let bytes = 0;
    child.stdout.on('data', d => { bytes += d.length; fs.appendFileSync(LOG, '['+cod+'] '+d.toString()); });
    child.stderr.on('data', d => fs.appendFileSync(LOG, '['+cod+' STDERR] '+d.toString()));
    const timeout = setTimeout(() => { log('⏰ ' + cod + ' excedeu 12 min — abortando'); try { child.kill(); } catch(e) {} }, 12*60*1000);
    child.on('close', code => {
      clearTimeout(timeout);
      const t = ((Date.now()-t0)/1000).toFixed(1);
      log((code===0?'✅':'❌') + ' ' + cod + ' fim (exit=' + code + ', ' + t + 's)');
      resolve({ liga: cod, exit: code, tempo_s: +t, stdout_bytes: bytes });
    });
  });
}

function statsLiga(cod) {
  const dir = path.join(__dirname,'rodadas',cod);
  if (!fs.existsSync(dir)) return { erro: 'dir ausente' };
  const arqs = fs.readdirSync(dir)
    .filter(a => a.endsWith('.json') && !a.includes('backup') && !a.includes('lote') && !a.includes('BRUTO'))
    .map(a => ({ nome: a, mtime: fs.statSync(path.join(dir,a)).mtime }))
    .sort((a,b) => b.mtime - a.mtime);
  if (!arqs.length) return { erro: 'sem arquivos' };
  const recente = arqs[0];
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dir,recente.nome),'utf8'));
    const jogos = Array.isArray(d) ? d : (d.jogos||[]);
    const cc = jogos.filter(j => j.estatisticas_ft?.cantos?.m != null).length;
    return { arquivos: arqs.length, mais_recente: recente.nome, jogos_total: jogos.length, jogos_com_cantos: cc };
  } catch(e) { return { erro: e.message.substring(0,80) }; }
}

(async () => {
  log('🚀 BATCH 29-31/05/2026 — ' + LIGAS.length + ' ligas em série');
  const r = [];
  for (const cod of LIGAS) {
    const x = await rodar(cod);
    x.stats = statsLiga(cod);
    r.push(x);
    fs.writeFileSync(RES, JSON.stringify({ em_andamento: cod !== LIGAS[LIGAS.length-1], concluidas: r.length, total: LIGAS.length, resultados: r }, null, 2));
  }
  log('');
  log('🏁 BATCH CONCLUÍDO — ' + r.filter(x=>x.exit===0).length + '/' + LIGAS.length);
  for (const x of r) {
    const s = x.stats;
    log('  ' + (x.exit===0?'✅':'❌') + ' ' + x.liga.padEnd(6) + ' | ' + x.tempo_s + 's | ' + (s.jogos_com_cantos||0) + '/' + (s.jogos_total||0) + ' c/ cantos');
  }
})();
