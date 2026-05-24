#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// AUDITOR SUPREMO DE CANTOS — CLI Entry Point
// ════════════════════════════════════════════════════════════════════
//
// Uso:
//   node auditor.js --rodada-json <caminho>            # produção
//   node auditor.js --rodada-json <caminho> --backtest # backtest cego
//   node auditor.js --self-test                         # smoke test interno
//
// Formato do --rodada-json (array de jogos):
//   [ { "liga": "MLS", "mandante": "...", "visitante": "...", "rodada": 7 }, ... ]
//
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { carregarBase }                  = require('./engine/loader');
const { executarAuditor, formatarRelatorio } = require('./engine/agente');
const { MODOS, LIGAS_ATIVAS }           = require('./config');

function args() {
  const a = { rodadaJson: null, backtest: false, selfTest: false, salvarOutput: true };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--rodada-json') a.rodadaJson = argv[++i];
    else if (argv[i] === '--backtest') a.backtest = true;
    else if (argv[i] === '--self-test') a.selfTest = true;
    else if (argv[i] === '--no-save') a.salvarOutput = false;
  }
  return a;
}

function logoBanner() {
  return [
    '',
    '🛡️  ════════════════════════════════════════════════════════════',
    '       AUDITOR SUPREMO DE CANTOS — EDS Soluções Inteligentes',
    '       v1.0 — O eliminador de incertezas',
    '   ════════════════════════════════════════════════════════════',
    ''
  ].join('\n');
}

// ────────────────────────────────────────────────────────────────────
// SELF-TEST: roda o agente sobre um conjunto sintético de jogos
// (todos os jogos do banco) só pra confirmar que o pipeline roda.
// ────────────────────────────────────────────────────────────────────
function selfTest() {
  console.log(logoBanner());
  console.log('🧪 SELF-TEST — analisando todos os jogos do banco como teste de pipeline.');
  console.log('   (em produção, você passa apenas os jogos da rodada via --rodada-json)\n');

  const base = carregarBase({ dataLimite: null });

  // Monta lista sintética: pega os 3 jogos mais recentes de CADA liga
  const jogosTeste = [];
  for (const codigo of Object.keys(base.ligas)) {
    const L = base.ligas[codigo];
    if (L.erro) continue;
    const ordenados = [...L.jogos].sort((a, b) => (b.dataNorm || '').localeCompare(a.dataNorm || ''));
    for (const j of ordenados.slice(0, 3)) {
      jogosTeste.push({
        liga:      codigo,
        mandante:  j.mandante,
        visitante: j.visitante,
        rodada:    j.rodada,
        data:      j.dataNorm
      });
    }
  }

  console.log(`📥 Jogos no teste sintético: ${jogosTeste.length}\n`);

  const resultado = executarAuditor({ base, jogosParaAnalisar: jogosTeste });
  const relatorio = formatarRelatorio(resultado);
  console.log(relatorio);
}

// ────────────────────────────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────────────────────────────
function main() {
  const a = args();
  console.log(logoBanner());

  if (a.selfTest) return selfTest();

  if (!a.rodadaJson) {
    console.error('❌ Erro: --rodada-json <caminho> é obrigatório (ou use --self-test).');
    process.exit(1);
  }

  if (!fs.existsSync(a.rodadaJson)) {
    console.error('❌ Arquivo da rodada não encontrado: ' + a.rodadaJson);
    process.exit(1);
  }

  let jogosParaAnalisar;
  try {
    jogosParaAnalisar = JSON.parse(fs.readFileSync(a.rodadaJson, 'utf8'));
  } catch (e) {
    console.error('❌ Falha ao parsear rodada JSON: ' + e.message);
    process.exit(1);
  }
  if (!Array.isArray(jogosParaAnalisar)) {
    console.error('❌ JSON da rodada deve ser um array de jogos.');
    process.exit(1);
  }

  const modo = a.backtest ? MODOS.BACKTEST_F3 : MODOS.PRODUCAO;
  console.log(`📋 Modo: ${modo.nome}` + (modo.dataLimite ? ` (dataLimite=${modo.dataLimite})` : ''));
  console.log(`📥 Jogos para analisar: ${jogosParaAnalisar.length}\n`);

  const base      = carregarBase({ dataLimite: modo.dataLimite });
  const resultado = executarAuditor({ base, jogosParaAnalisar });
  const relatorio = formatarRelatorio(resultado);
  console.log(relatorio);

  if (a.salvarOutput) {
    const ts   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const out  = path.join(__dirname, 'output', `relatorio_${modo.nome}_${ts}.txt`);
    const json = path.join(__dirname, 'output', `dados_${modo.nome}_${ts}.json`);
    fs.writeFileSync(out, relatorio);
    fs.writeFileSync(json, JSON.stringify({
      modo:            resultado.modo,
      geradoEm:        resultado.geradoEm,
      totalAnalisados: resultado.totalAnalisados,
      eliminadosPor:   resultado.eliminadosPor,
      aprovadosBrutos: resultado.aprovadosBrutos,
      listaFinal:      resultado.listaFinal.map(ap => ({
        liga:         ap.jogo.liga,
        mandante:     ap.jogo.mandante,
        visitante:    ap.jogo.visitante,
        rodada:       ap.jogo.rodada,
        mercado:      ap.mercado,
        score:        ap.score,
        convergencia: ap.convergencia
      }))
    }, null, 2));
    console.log(`\n💾 Relatório salvo em: ${path.relative(process.cwd(), out)}`);
    console.log(`💾 JSON salvo em:       ${path.relative(process.cwd(), json)}`);
  }
}

if (require.main === module) main();
