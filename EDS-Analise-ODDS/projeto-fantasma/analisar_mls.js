
/**
 * ANALISADOR DE COMPLETUDE — MLS 2026
 * Verifica quais jogos têm dados completos e quais têm ausências
 */

const fs   = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'especialista-cantos', 'data');
const arquivo = path.join(dataDir, 'mls2026.js');

// ── Carregar arquivo ──
const raw = fs.readFileSync(arquivo, 'utf-8');
const window = {};
const varNames = ['DADOS_MLS','DADOS_BR','DADOS_ARG','DADOS_USL','DADOS_BUN','DADOS_ECU'];
const decls = varNames.map(v => `var ${v};`).join('\n');
const fn = new Function('window', 'module', decls + '\n' + raw + '\nreturn window;');
const w = fn({}, { exports: {} });
const dados = w['DADOS_MLS'];

if (!dados) { console.log('ERRO: DADOS_MLS não encontrado'); process.exit(1); }

const jogos = dados.jogos || [];

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║         📊 ANÁLISE DE COMPLETUDE — MLS 2026         ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log('');
console.log('📁 Arquivo:', path.basename(arquivo));
console.log('⏱️  Atualizado em:', dados.ultimaAtualizacao || '?');
console.log('🏆 Times:', (dados.times || []).length);
console.log('📅 Total de rodadas:', dados.totalRodadas || '?');
console.log('⚽ Total de jogos:', jogos.length);
console.log('');

// ── Análise campo a campo ──
const stats = {
  completos:        0,
  semCantosFT:      0,
  semCantosHT:      0,
  semPlacar:        0,
  semData:          0,
  semStatsTaticas:  0,
  semPosse:         0,
  semFinalizacoes:  0,
  comTudoFaltando:  0
};

const jogosBroken = [];
const porRodada = {};

jogos.forEach((j, idx) => {
  const issues = [];

  // 1. Cantos FT (dado ESSENCIAL para análise de cantos)
  const cantFT = j.cantos?.ft;
  const temCantosFT = cantFT && cantFT.m != null && cantFT.v != null;
  if (!temCantosFT) { stats.semCantosFT++; issues.push('cantos_ft'); }

  // 2. Cantos HT
  const cantHT = j.cantos?.ht;
  const temCantosHT = cantHT && cantHT.m != null && cantHT.v != null;
  if (!temCantosHT) { stats.semCantosHT++; issues.push('cantos_ht'); }

  // 3. Placar de gols
  const temPlacar = j.placar && j.placar.m != null && j.placar.v != null;
  if (!temPlacar) { stats.semPlacar++; issues.push('placar'); }

  // 4. Data do jogo
  const temData = j.data && j.data !== '?' && j.data !== null;
  if (!temData) { stats.semData++; issues.push('data'); }

  // 5. Stats táticas gerais
  if (!j.stats_taticas) {
    stats.semStatsTaticas++;
    issues.push('stats_taticas');
  } else {
    if (!j.stats_taticas.posse)         { stats.semPosse++;         issues.push('posse'); }
    if (!j.stats_taticas.finalizacoes)  { stats.semFinalizacoes++;  issues.push('finalizacoes'); }
  }

  // Classificação geral
  if (issues.length === 0) {
    stats.completos++;
  } else {
    if (issues.length >= 4) stats.comTudoFaltando++;
    jogosBroken.push({
      idx: idx + 1,
      mandante: j.mandante || '?',
      visitante: j.visitante || '?',
      rodada: j.rodada || '?',
      data: j.data || '?',
      issues
    });
  }

  // Por rodada
  const rod = j.rodada || 0;
  if (!porRodada[rod]) porRodada[rod] = { total: 0, completos: 0, semCantosFT: 0, semPlacar: 0, semData: 0 };
  porRodada[rod].total++;
  if (issues.length === 0) porRodada[rod].completos++;
  if (!temCantosFT) porRodada[rod].semCantosFT++;
  if (!temPlacar)   porRodada[rod].semPlacar++;
  if (!temData)     porRodada[rod].semData++;
});

const incompletos = jogos.length - stats.completos;
const pctCompleto = jogos.length > 0 ? ((stats.completos / jogos.length) * 100).toFixed(1) : 0;

// ── Output ──
console.log('══════════════════════════════════════════════');
console.log('                 COMPLETUDE GERAL');
console.log('══════════════════════════════════════════════');
console.log(`  ✅ Jogos COMPLETOS :  ${stats.completos.toString().padStart(4)}  (${pctCompleto}%)`);
console.log(`  ⚠️  Jogos INCOMPLETOS: ${incompletos.toString().padStart(4)}  (${(100 - Number(pctCompleto)).toFixed(1)}%)`);
console.log(`  ❌ Completamente vazios: ${stats.comTudoFaltando}`);
console.log('');
console.log('══════════════════════════════════════════════');
console.log('            AUSÊNCIAS POR CAMPO');
console.log('══════════════════════════════════════════════');

const campos = [
  ['Cantos FT (escanteios)',    stats.semCantosFT],
  ['Cantos HT (1º tempo)',      stats.semCantosHT],
  ['Placar de gols',            stats.semPlacar],
  ['Data do jogo',              stats.semData],
  ['Stats táticas (posse/fin)', stats.semStatsTaticas],
  ['Posse de bola',             stats.semPosse],
  ['Finalizações',              stats.semFinalizacoes],
];

campos.forEach(([nome, qtd]) => {
  const pct = jogos.length > 0 ? ((qtd / jogos.length) * 100).toFixed(1) : '0.0';
  const barra = '█'.repeat(Math.round(qtd / jogos.length * 20)) + '░'.repeat(20 - Math.round(qtd / jogos.length * 20));
  const icon = qtd === 0 ? '✅' : qtd < jogos.length * 0.1 ? '🟡' : '🔴';
  console.log(`  ${icon} ${nome.padEnd(26)}: ${String(qtd).padStart(4)} jogos (${String(pct).padStart(5)}%)  ${barra}`);
});

console.log('');
console.log('══════════════════════════════════════════════');
console.log('              SITUAÇÃO POR RODADA');
console.log('══════════════════════════════════════════════');
console.log('  Rod | Total | Completos |  %  | sem_CF | sem_Plac | sem_Data');
console.log('  ─────────────────────────────────────────────────────────────');

Object.keys(porRodada)
  .sort((a,b) => Number(a) - Number(b))
  .forEach(rod => {
    const r = porRodada[rod];
    const pct = ((r.completos / r.total) * 100).toFixed(0);
    const icon = r.completos === r.total ? '✅' : r.completos === 0 ? '❌' : '⚠️ ';
    console.log(
      `  ${icon} ${String(rod).padStart(3)} |  ${String(r.total).padStart(4)} |` +
      `     ${String(r.completos).padStart(4)} | ${String(pct).padStart(3)}% |` +
      `    ${String(r.semCantosFT).padStart(4)} |     ${String(r.semPlacar).padStart(4)} |   ${String(r.semData).padStart(4)}`
    );
  });

// ── Lista dos 20 primeiros jogos incompletos ──
if (jogosBroken.length > 0) {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log(`   PRIMEIROS JOGOS COM AUSÊNCIAS (${Math.min(25, jogosBroken.length)} de ${jogosBroken.length})`);
  console.log('══════════════════════════════════════════════');
  jogosBroken.slice(0, 25).forEach(j => {
    console.log(`  Rod ${String(j.rodada).padStart(2)} | ${String(j.data).padStart(10)} | ${j.mandante.padEnd(22)} vs ${j.visitante.padEnd(22)} | ❌ ${j.issues.join(', ')}`);
  });
}

// ── Salvar relatório ──
const relatorio = {
  gerado_em: new Date().toISOString(),
  liga: 'MLS 2026',
  total_jogos: jogos.length,
  completos: stats.completos,
  incompletos,
  pct_completo: pctCompleto,
  ausencias: {
    cantos_ft:      stats.semCantosFT,
    cantos_ht:      stats.semCantosHT,
    placar:         stats.semPlacar,
    data:           stats.semData,
    stats_taticas:  stats.semStatsTaticas,
    posse:          stats.semPosse,
    finalizacoes:   stats.semFinalizacoes
  },
  por_rodada: porRodada,
  jogos_incompletos: jogosBroken
};

const outPath = path.join(__dirname, '_relatorio_completude_mls.json');
fs.writeFileSync(outPath, JSON.stringify(relatorio, null, 2));
console.log('');
console.log('💾 Relatório salvo em: _relatorio_completude_mls.json');
console.log('');
