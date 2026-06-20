// ════════════════════════════════════════════════════════════════════
// ANALISTA SENIOR EDS — Calibração de linhas Under/Over por DNA da liga
//
// Lê base completa (sem dataLimite), calcula média + DP de cantos FT
// por liga, e propõe linhas calibradas:
//   - Linha Under = ceil(media) + 0.5  (acima da média, conservador)
//   - Linha Over  = floor(media) + 0.5 (abaixo da média, conservador)
//
// Salva em output/linhas_calibradas_<data>.json
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const AUDITOR = path.resolve(__dirname, '..', '..', 'Auditor-Supremo-Cantos');
const { carregarBase } = require(path.join(AUDITOR, 'engine', 'loader'));
const { statsLiga }    = require(path.join(AUDITOR, 'engine', 'stats'));

// Ligas-alvo do Analista Senior (exclui BUN encerrada e J2J3 sem mercado)
const LIGAS_ALVO = ['BR', 'BR_B', 'MLS', 'USL', 'ARG', 'ARG_B', 'J1', 'CHI', 'CHN_L1', 'CHN_SL', 'ECU'];

function calcularLinhaUnder(media) {
  return Math.ceil(media) + 0.5;
}
function calcularLinhaOver(media) {
  return Math.floor(media) + 0.5;
}

// Calcula % de jogos com total cantos FT < linha
function pctTotalAbaixo(jogos, linha) {
  let validos = 0, abaixo = 0;
  for (const j of jogos) {
    const c = j.estatisticas_ft && j.estatisticas_ft.cantos;
    if (!c || typeof c.m !== 'number' || typeof c.v !== 'number') continue;
    validos++;
    if (c.m + c.v < linha) abaixo++;
  }
  return validos > 0 ? +(abaixo / validos * 100).toFixed(1) : null;
}
function pctTotalAcima(jogos, linha) {
  let validos = 0, acima = 0;
  for (const j of jogos) {
    const c = j.estatisticas_ft && j.estatisticas_ft.cantos;
    if (!c || typeof c.m !== 'number' || typeof c.v !== 'number') continue;
    validos++;
    if (c.m + c.v > linha) acima++;
  }
  return validos > 0 ? +(acima / validos * 100).toFixed(1) : null;
}

console.log('');
console.log('🛡️  ════════════════════════════════════════════════════════════════');
console.log('       ANALISTA SENIOR EDS — Calibração de linhas Under/Over');
console.log('       Por DNA da liga | gerado ' + new Date().toISOString().slice(0, 10));
console.log('   ════════════════════════════════════════════════════════════════');
console.log('');

const base = carregarBase({ dataLimite: null });

const resultado = {};
for (const cod of LIGAS_ALVO) {
  const L = base.ligas[cod];
  if (!L || L.erro) {
    resultado[cod] = { erro: L ? L.erro : 'liga não carregada' };
    continue;
  }
  const stats = statsLiga(L.jogos);
  const media = stats.media_cantos_FT;
  const linhaUnder = calcularLinhaUnder(media);
  const linhaOver  = calcularLinhaOver(media);
  resultado[cod] = {
    n_jogos:         L.jogos.length,
    media_cantos_FT: media,
    dp_cantos_FT:    stats.dp_cantos_FT ?? null,
    pct_under_9_motorOriginal: stats.pct_under_9,
    linha_under_calibrada:     linhaUnder,
    pct_under_calibrado:       pctTotalAbaixo(L.jogos, linhaUnder),
    linha_over_calibrada:      linhaOver,
    pct_over_calibrado:        pctTotalAcima(L.jogos, linhaOver)
  };
}

// Print legível
const sep = '═'.repeat(96);
console.log(sep);
console.log('  TABELA DE LINHAS CALIBRADAS POR LIGA');
console.log(sep + '\n');
console.log('LIGA   │ n_jogos │ média │ DP   │ %und9(motor) │ UNDER calib.    │ OVER calib.');
console.log('───────┼─────────┼───────┼──────┼──────────────┼─────────────────┼─────────────────');
for (const cod of LIGAS_ALVO) {
  const r = resultado[cod];
  if (r.erro) {
    console.log(`${cod.padEnd(7)}│ ${r.erro}`);
    continue;
  }
  const linhaU = `Under ${r.linha_under_calibrada} (${r.pct_under_calibrado}%)`;
  const linhaO = `Over ${r.linha_over_calibrada} (${r.pct_over_calibrado}%)`;
  console.log(
    `${cod.padEnd(7)}│ ${String(r.n_jogos).padStart(7)} │ ${String(r.media_cantos_FT).padStart(5)} │ ${String(r.dp_cantos_FT).padStart(4)} │ ${String(r.pct_under_9_motorOriginal).padStart(11)}% │ ${linhaU.padEnd(15)} │ ${linhaO.padEnd(15)}`
  );
}

console.log('\n' + sep);
console.log('  LEITURA:');
console.log('  - UNDER calibrado: linha ACIMA da média → maioria dos jogos fica < linha → Under é provável');
console.log('  - OVER calibrado:  linha ABAIXO da média → maioria dos jogos fica > linha → Over é provável');
console.log('  - %und9(motor): comparativo do mercado original (linha 9 fixa). Liga com %und9 baixo = motor original sofre.');
console.log(sep);

// Salva JSON (uso CLI/auditoria)
const outDir = path.resolve(__dirname, '..', 'output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `linhas_calibradas_${new Date().toISOString().slice(0, 10)}.json`);
const payload = {
  geradoEm:   new Date().toISOString(),
  formula:    { under: 'ceil(media) + 0.5', over: 'floor(media) + 0.5' },
  ligas:      resultado
};
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`\n💾 JSON salvo em:        ${path.relative(process.cwd(), outPath)}`);

// Também gera versão window (uso no browser — index.html)
const browserPath = path.resolve(__dirname, '..', 'linhas_calibradas.js');
const browserSrc = `// AUTO-GERADO por calibracao/calibrar_linhas.js — não editar manualmente
window.LINHAS_CALIBRADAS = ${JSON.stringify(payload, null, 2)};
`;
fs.writeFileSync(browserPath, browserSrc);
console.log(`💾 Browser global salvo: ${path.relative(process.cwd(), browserPath)}\n`);
