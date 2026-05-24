/**
 * ENRIQUECEDOR DE LIGA — converte jogos POBRES em RICOS
 * Reutiliza FlashscoreMonster do varredor v4.
 *
 * Uso:
 *   node _enriquecer_liga.js --liga MLS              (todos os pobres)
 *   node _enriquecer_liga.js --liga MLS --max 5      (teste com 5 jogos)
 *   node _enriquecer_liga.js --liga MLS --offset 50  (retomar a partir do 51º)
 *
 * Saídas:
 *   - rodadas/<LIGA>/<liga>_enriquecido_lote_NN_YYYY-MM-DD.json (lotes de 25)
 *   - Log persistente em rodadas/<LIGA>/_enriquecimento_log.json
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');

const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const LIGA   = (getArg('--liga', 'MLS')).toUpperCase();
const MAX    = parseInt(getArg('--max', '99999'), 10);
const OFFSET = parseInt(getArg('--offset', '0'), 10);

// Mapeamento liga → arquivo do banco
const BANCO_PATHS = {
  BR:    '../especialista-cantos/data/brasileirao2026.js',
  BR_B:  '../especialista-cantos/data/brasileiraoB2026.js',
  MLS:   '../especialista-cantos/data/mls2026.js',
  USL:   '../especialista-cantos/data/usl2026.js',
  ARG:   '../especialista-cantos/data/argentina2026.js',
  ARG_B: '../especialista-cantos/data/argentina_b2026.js',
  BUN:   '../especialista-cantos/data/bundesliga2026.js',
  J2J3:  '../especialista-cantos/data/j2j3league2026.js'
};
const VAR_JS = {
  BR:'DADOS_BR', BR_B:'DADOS_BR_B', MLS:'DADOS_MLS', USL:'DADOS_USL',
  ARG:'DADOS_ARG', ARG_B:'DADOS_ARG_B', BUN:'DADOS_BUN', J2J3:'DADOS_J2_J3'
};
const LIGAS_NOME = {
  BR:'Brasileirão Série A', BR_B:'Brasileirão Série B', MLS:'Major League Soccer',
  USL:'USL Championship', ARG:'Liga Profesional Argentina',
  ARG_B:'Primera B Nacional (Argentina)', BUN:'Bundesliga (Alemanha)',
  J2J3:'J2/J3 League (Japão — 4 federações regionais)'
};

if (!BANCO_PATHS[LIGA]) {
  console.error(`Liga "${LIGA}" não suportada. Disponíveis: ${Object.keys(BANCO_PATHS).join(', ')}`);
  process.exit(1);
}

const PASTA_LIGA = path.join(__dirname, 'rodadas', LIGA);
const LOG_PATH   = path.join(PASTA_LIGA, '_enriquecimento_log.json');
fs.mkdirSync(PASTA_LIGA, { recursive: true });

function delayHumano(base, jitter = 1000) {
  return new Promise(r => setTimeout(r, base + Math.floor(Math.random() * jitter)));
}

function carregarBanco() {
  const bancoPath = path.join(__dirname, BANCO_PATHS[LIGA]);
  const sandbox = { window: {} };
  const code = fs.readFileSync(bancoPath, 'utf8').replace(/^\s*\/\/.*$/gm, '');
  new Function('window', code)(sandbox.window);
  return sandbox.window[VAR_JS[LIGA]];
}

function carregarLogJaFeitos() {
  if (!fs.existsSync(LOG_PATH)) return { enriquecidos: [], falhados: [] };
  return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
}

function salvarLog(log) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

function ehRico(j) {
  return j.estatisticas_ft && j.estatisticas_ft.chutes_alvo;
}

function matchIdValido(j) {
  const id = j.match_id || j.id;
  return id && /^[a-zA-Z0-9]{6,10}$/.test(id);
}

(async () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  🧬 ENRIQUECEDOR — ${LIGA} (${LIGAS_NOME[LIGA]})`);
  console.log('═══════════════════════════════════════════════════');

  const dados = carregarBanco();
  const jogos = dados.jogos || [];
  console.log(`  📥 Banco carregado: ${jogos.length} jogos`);

  // Filtra: pobres + match_id válido + não enriquecidos antes
  const logJa = carregarLogJaFeitos();
  const idsJa = new Set([...logJa.enriquecidos.map(x => x.match_id), ...logJa.falhados.map(x => x.match_id)]);

  let candidatos = jogos.filter(j => !ehRico(j) && matchIdValido(j) && !idsJa.has(j.match_id || j.id));
  const semId = jogos.filter(j => !matchIdValido(j)).length;
  const jaRicos = jogos.filter(j => ehRico(j)).length;

  console.log(`  📊 Já ricos:     ${jaRicos}`);
  console.log(`  📊 Sem match_id: ${semId}`);
  console.log(`  📊 Já processados (log): ${idsJa.size}`);
  console.log(`  📊 Candidatos pendentes: ${candidatos.length}`);

  if (OFFSET > 0) candidatos = candidatos.slice(OFFSET);
  if (MAX < candidatos.length) candidatos = candidatos.slice(0, MAX);
  console.log(`  🎯 Processando agora: ${candidatos.length} jogos`);
  console.log('');

  if (candidatos.length === 0) {
    console.log('  ✅ Nada a fazer — todos enriquecidos ou inviáveis.');
    process.exit(0);
  }

  // Estimativa de tempo
  const minEst = (candidatos.length * 6 / 60).toFixed(1);
  console.log(`  ⏱️  Tempo estimado: ~${minEst} min`);
  console.log('');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  const TAMANHO_LOTE = 25;
  const dataHoje = new Date().toISOString().split('T')[0];
  const startTime = Date.now();

  let lote = [];
  let loteNum = Math.floor((logJa.enriquecidos.length) / TAMANHO_LOTE) + 1;
  let okTotal = 0, falhaTotal = 0;

  function salvarLote() {
    if (lote.length === 0) return;
    const arquivo = path.join(PASTA_LIGA, `${LIGA.toLowerCase()}_enriquecido_lote_${String(loteNum).padStart(2,'0')}_${dataHoje}.json`);
    fs.writeFileSync(arquivo, JSON.stringify(lote, null, 2));
    console.log(`\n  💾 Lote ${loteNum} salvo: ${lote.length} jogos → ${path.basename(arquivo)}\n`);
    lote = [];
    loteNum++;
  }

  for (let i = 0; i < candidatos.length; i++) {
    const j = candidatos[i];
    const matchId = j.match_id || j.id;
    const url = `https://www.flashscore.com/match/${matchId}/#/match-summary`;

    console.log(`  [${i+1}/${candidatos.length}] ${matchId} | ${j.mandante} x ${j.visitante}`);

    let partida = null;
    let tentativas = 0;
    const maxRetries = 2;
    const delays = [5000, 15000];

    while (tentativas < maxRetries) {
      try {
        partida = await fantasma.extrairPartida(url, {
          liga: LIGAS_NOME[LIGA],
          codigo_liga: LIGA
        });
        if (partida && partida.estatisticas_ft && partida.estatisticas_ft.cantos) {
          const cantos = partida.estatisticas_ft.cantos;
          console.log(`     ✅ Cantos FT: ${cantos.m}-${cantos.v} | Campos: ${partida.meta.campos_disponiveis}`);
          break;
        }
        throw new Error('Cantos FT não extraídos');
      } catch (e) {
        tentativas++;
        if (tentativas < maxRetries) {
          console.log(`     ⚠️  Falha ${tentativas}/${maxRetries}: ${e.message}. Retry em ${delays[tentativas-1]/1000}s...`);
          await delayHumano(delays[tentativas-1], 1000);
        } else {
          console.log(`     ❌ Falha permanente: ${e.message}`);
          logJa.falhados.push({ match_id: matchId, mandante: j.mandante, visitante: j.visitante, erro: e.message, ts: new Date().toISOString() });
          partida = null;
        }
      }
    }

    if (partida) {
      lote.push(partida);
      logJa.enriquecidos.push({ match_id: matchId, mandante: j.mandante, visitante: j.visitante, campos: partida.meta.campos_disponiveis, ts: new Date().toISOString() });
      okTotal++;
    } else {
      falhaTotal++;
    }

    // Salva log a cada jogo (durável)
    salvarLog(logJa);

    // Salva lote a cada 25
    if (lote.length >= TAMANHO_LOTE) salvarLote();

    // Pausa anti-DDoS
    if (i < candidatos.length - 1) await delayHumano(4000, 2000);
  }

  // Salva lote final
  salvarLote();

  await browser.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  🏁 ENRIQUECIMENTO ${LIGA} CONCLUÍDO`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`  ✅ Sucesso:    ${okTotal}`);
  console.log(`  ❌ Falhas:     ${falhaTotal}`);
  console.log(`  ⏱️  Tempo:      ${mins}m ${secs}s`);
  console.log(`  📂 Pasta:      rodadas/${LIGA}/`);
  console.log(`  📝 Log:        rodadas/${LIGA}/_enriquecimento_log.json`);
  console.log('');
})();
