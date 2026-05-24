/**
 * RECUPERADOR DE DATAS — Agente Cirúrgico para Ligas sem Rodada
 * EDS Soluções Inteligentes
 *
 * ─── MISSÃO ─────────────────────────────────────────────────────
 *   Ligas como USL e MLS não separam jogos por rodada.
 *   O varredor-por-time.js coletou os jogos mas PERDEU as datas.
 *   Este agente acessa o FlashScore usando o match_id de cada jogo
 *   e recupera APENAS a data/hora — operação cirúrgica e rápida.
 *
 * ─── BASEADO NO PADRÃO V4 DO ANALISTA FANTASMA ─────────────────
 *   - headless: false (navegador visível, anti-detecção)
 *   - StealthPlugin (fingerprint humano)
 *   - URL limpa: flashscore.com/match/{ID}/#/match-summary
 *   - delayHumano() com jitter
 *
 * USO:
 *   node recuperador-datas.js --liga USL
 *   node recuperador-datas.js --liga MLS
 *   node recuperador-datas.js --todas
 *
 * RESULTADO:
 *   Atualiza o arquivo *2026.js com datas preenchidas
 *   e roda recalcular_escoteiro.js automaticamente
 *
 * @module recuperador-datas
 * @version 1.0.0
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ═══════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO DE LIGAS (apenas as sem rodada fixa)
// ═══════════════════════════════════════════════════════════════
const LIGAS = {
  USL: { arquivo: 'usl2026.js',  variavel: 'DADOS_USL', nome: 'USL Championship' },
  MLS: { arquivo: 'mls2026.js',  variavel: 'DADOS_MLS', nome: 'Major League Soccer' }
};

const dataDir = path.join(__dirname, '..', 'especialista-cantos', 'data');

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

function delayHumano(base, jitter = 1000) {
  const total = base + Math.floor(Math.random() * jitter);
  return new Promise(r => setTimeout(r, total));
}

function log(msg, tipo = 'info') {
  const icons = {
    info: 'ℹ️ ', success: '✅', error: '❌', warn: '⚠️ ',
    data: '📅', flashscore: '⚡', fix: '🔧'
  };
  console.log(`${icons[tipo] || '•'} ${msg}`);
}

function progressBar(current, total) {
  const pct  = Math.round((current / total) * 100);
  const fill = Math.round(pct / 10);
  return '█'.repeat(fill) + '░'.repeat(10 - fill) + ` ${pct}%`;
}

// ═══════════════════════════════════════════════════════════════
//  CARREGAR DADOS DO ARQUIVO *2026.js
// ═══════════════════════════════════════════════════════════════

function carregarDados(liga) {
  const caminho = path.join(dataDir, liga.arquivo);
  if (!fs.existsSync(caminho)) return null;

  const raw = fs.readFileSync(caminho, 'utf-8');
  const window = {};
  const varNames = ['DADOS_USL', 'DADOS_MLS', 'DADOS_BR', 'DADOS_ARG', 'DADOS_BUN'];
  const decls = varNames.map(v => `var ${v};`).join('\n');

  try {
    const fn = new Function('window', 'module', decls + '\n' + raw + '\nreturn window;');
    const w = fn({}, { exports: {} });
    return w[liga.variavel];
  } catch (e) {
    log(`Erro ao carregar ${liga.arquivo}: ${e.message}`, 'error');
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
//  SALVAR DADOS DE VOLTA NO ARQUIVO *2026.js
// ═══════════════════════════════════════════════════════════════

function salvarDados(liga, dados) {
  const caminho = path.join(dataDir, liga.arquivo);

  // Backup antes de sobrescrever
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupPath = path.join(backupDir, `${liga.arquivo.replace('.js', '')}_${ts}_pre-datas.js`);

  if (fs.existsSync(caminho)) {
    fs.copyFileSync(caminho, backupPath);
    log(`Backup salvo: ${path.basename(backupPath)}`, 'info');
  }

  // Reconstruir o arquivo no formato original
  const header = [
    `// ${liga.nome} 2026 — DATAS RECUPERADAS`,
    `// ${dados.jogos.length} jogos | Atualizado: ${new Date().toISOString().split('T')[0]}`,
    `window.${liga.variavel} = ${JSON.stringify(dados, null, 2)};`
  ].join('\n');

  fs.writeFileSync(caminho, header, 'utf-8');
  log(`Arquivo salvo: ${liga.arquivo}`, 'success');
}

// ═══════════════════════════════════════════════════════════════
//  EXTRAÇÃO DE DATA DE UMA PARTIDA (operação cirúrgica)
// ═══════════════════════════════════════════════════════════════

async function extrairDataPartida(page, matchId) {
  const url = `https://www.flashscore.com/match/${matchId}/#/match-summary`;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await delayHumano(3000, 1000);

    const data = await page.evaluate(() => {
      // Método 1: seletor direto do FlashScore
      const dateEl = document.querySelector(
        '.duelParticipant__startTime, .startTime, [class*="startTime"]'
      );
      if (dateEl) {
        const txt = dateEl.innerText.trim();
        if (txt && txt.length > 3) return txt;
      }

      // Método 2: buscar no texto da página por padrão de data DD.MM.YYYY HH:MM
      const body = document.body.innerText;
      const match = body.match(/(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})/);
      if (match) return match[1];

      // Método 3: meta tags ou título
      const title = document.title || '';
      const dateMatch = title.match(/(\d{2}\.\d{2}\.\d{4})/);
      if (dateMatch) return dateMatch[1];

      return null;
    });

    return data;

  } catch (err) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
//  CORE: RECUPERAR DATAS DE UMA LIGA
// ═══════════════════════════════════════════════════════════════

async function recuperarDatasLiga(codigoLiga, browser) {
  const liga = LIGAS[codigoLiga];
  if (!liga) {
    log(`Liga "${codigoLiga}" não suportada. Disponíveis: ${Object.keys(LIGAS).join(', ')}`, 'error');
    return null;
  }

  const dados = carregarDados(liga);
  if (!dados) {
    log(`Arquivo ${liga.arquivo} não encontrado ou inválido`, 'error');
    return null;
  }

  // Identificar jogos sem data
  const jogosSemData = dados.jogos.filter(j => !j.data || j.data === '?' || j.data === null);
  const jogosComData = dados.jogos.filter(j => j.data && j.data !== '?' && j.data !== null);

  // Identificar jogos sem match_id (não podem ser recuperados)
  const semId = jogosSemData.filter(j => !j.id && !j.match_id);
  const comId = jogosSemData.filter(j => j.id || j.match_id);

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📅 RECUPERADOR DE DATAS — ${liga.nome} (${codigoLiga})`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Total de jogos:     ${dados.jogos.length}`);
  console.log(`  Já com data:        ${jogosComData.length}`);
  console.log(`  Sem data (com ID):  ${comId.length} → serão recuperados`);
  if (semId.length > 0) {
    console.log(`  Sem data (sem ID):  ${semId.length} → NÃO podem ser recuperados`);
  }
  console.log('═══════════════════════════════════════════════════');

  if (comId.length === 0) {
    log('Todos os jogos já têm data! Nada a fazer.', 'success');
    return { liga: codigoLiga, recuperados: 0, falhas: 0, total: dados.jogos.length };
  }

  // Abrir uma única aba para todas as consultas (mais rápido)
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  let recuperados = 0;
  let falhas = 0;
  const startTime = Date.now();

  for (let i = 0; i < comId.length; i++) {
    const jogo = comId[i];
    const matchId = jogo.id || jogo.match_id;

    console.log(`  [${i + 1}/${comId.length}] ${progressBar(i + 1, comId.length)} | ${jogo.mandante} vs ${jogo.visitante}`);

    let dataExtraida = null;
    let tentativas = 0;
    const maxRetries = 2;

    while (tentativas < maxRetries && !dataExtraida) {
      dataExtraida = await extrairDataPartida(page, matchId);
      if (!dataExtraida) {
        tentativas++;
        if (tentativas < maxRetries) {
          log(`  Tentativa ${tentativas}/${maxRetries} falhou. Retry...`, 'warn');
          await delayHumano(4000, 2000);
        }
      }
    }

    if (dataExtraida) {
      // Encontrar o jogo no array original e atualizar
      const idx = dados.jogos.findIndex(j => (j.id || j.match_id) === matchId);
      if (idx !== -1) {
        dados.jogos[idx].data = dataExtraida;
        recuperados++;
        log(`  ${dataExtraida} ← ${jogo.mandante} vs ${jogo.visitante}`, 'data');
      }
    } else {
      falhas++;
      log(`  FALHA: ${jogo.mandante} vs ${jogo.visitante} (ID: ${matchId})`, 'error');
    }

    // Pausa anti-DDoS entre consultas
    if (i < comId.length - 1) {
      await delayHumano(2500, 1500);
    }
  }

  await page.close();

  // ── Salvar arquivo atualizado ──
  if (recuperados > 0) {
    salvarDados(liga, dados);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📊 SUMÁRIO — ${liga.nome}`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Jogos processados:   ${comId.length}`);
  console.log(`  Datas recuperadas:   ${recuperados}/${comId.length}`);
  console.log(`  Falhas:              ${falhas}`);
  console.log(`  Tempo total:         ${mins}m ${secs}s`);
  console.log('═══════════════════════════════════════════════════');

  return { liga: codigoLiga, recuperados, falhas, total: dados.jogos.length };
}

// ═══════════════════════════════════════════════════════════════
//  ENTRY POINT — CLI
// ═══════════════════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  let ligasParaProcessar = [];

  if (args.includes('--todas')) {
    ligasParaProcessar = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const idx    = args.indexOf('--liga');
    const codigo = (args[idx + 1] || '').toUpperCase();
    if (LIGAS[codigo]) {
      ligasParaProcessar = [codigo];
    } else {
      console.log(`Liga "${args[idx + 1]}" inválida. Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('');
    console.log('╔═════════════════════════════════════════════════════════╗');
    console.log('║  📅 RECUPERADOR DE DATAS — EDS Soluções Inteligentes   ║');
    console.log('║  Recupera datas perdidas de ligas sem rodada (USL/MLS) ║');
    console.log('╚═════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('USO:');
    console.log('  node recuperador-datas.js --liga USL');
    console.log('  node recuperador-datas.js --liga MLS');
    console.log('  node recuperador-datas.js --todas');
    console.log('');
    process.exit(0);
  }

  console.log('');
  console.log('═════════════════════════════════════════════════════════');
  console.log('📅 RECUPERADOR DE DATAS — EDS Soluções Inteligentes');
  console.log(`   Ligas: ${ligasParaProcessar.join(', ')}`);
  console.log('   Padrão V4: headless=false + StealthPlugin');
  console.log('═════════════════════════════════════════════════════════');

  // Browser idêntico aos demais agentes V4
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1366,900',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const resultados = [];

  for (const liga of ligasParaProcessar) {
    try {
      const result = await recuperarDatasLiga(liga, browser);
      if (result) resultados.push(result);
    } catch (err) {
      log(`Erro fatal na liga ${liga}: ${err.message}`, 'error');
    }

    if (ligasParaProcessar.indexOf(liga) < ligasParaProcessar.length - 1) {
      log('Pausa de 10s entre ligas...', 'info');
      await delayHumano(10000, 3000);
    }
  }

  await browser.close();

  // ── Sumário geral ──
  if (resultados.length > 1) {
    console.log('\n══════════════ SUMÁRIO GERAL ══════════════');
    resultados.forEach(r => {
      console.log(`  ${r.liga}: ${r.recuperados} datas recuperadas, ${r.falhas} falhas`);
    });
  }

  // ── Rodar recalcular_escoteiro automaticamente ──
  const totalRecuperados = resultados.reduce((s, r) => s + r.recuperados, 0);
  if (totalRecuperados > 0) {
    console.log('');
    log('Rodando recalcular_escoteiro.js para regenerar perfis DNA...', 'fix');

    for (const r of resultados) {
      if (r.recuperados > 0) {
        try {
          console.log(`  → Recalculando ${r.liga}...`);
          execSync(`node "${path.join(__dirname, 'recalcular_escoteiro.js')}" --liga ${r.liga}`, {
            stdio: 'inherit',
            cwd: __dirname
          });
        } catch (e) {
          log(`Erro ao recalcular ${r.liga}: ${e.message}`, 'error');
        }
      }
    }

    console.log('');
    log('Recuperação completa! Perfis DNA atualizados com datas reais.', 'success');
    console.log('   Abra o YAAKEN Scanner para ver os dados atualizados.');
  } else {
    console.log('\n⚠️  Nenhuma data recuperada. Verifique os logs acima.');
  }
})();
