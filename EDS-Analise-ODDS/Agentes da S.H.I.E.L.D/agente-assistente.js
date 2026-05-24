/**
 * AGENTE ASSISTENTE — Completador Inteligente de Jogos Faltantes
 * EDS Soluções Inteligentes — Agentes da S.H.I.E.L.D
 *
 * ─── MISSÃO ─────────────────────────────────────────────────────
 *   Detecta automaticamente os jogos que FALTAM no nosso banco
 *   comparando com a página de resultados do FlashScore.
 *   Coleta APENAS os jogos novos com estatísticas completas.
 *   Cirúrgico: não refaz o que já temos.
 *
 * ─── BASEADO NO PADRÃO V4 DO ANALISTA FANTASMA ─────────────────
 *   - headless: false (navegador visível, anti-detecção)
 *   - StealthPlugin (fingerprint humano)
 *   - FlashscoreMonster para extração completa de cada jogo
 *   - delayHumano() com jitter
 *
 * ─── ADAPTÁVEL A QUALQUER LIGA ──────────────────────────────────
 *   node agente-assistente.js --liga MLS
 *   node agente-assistente.js --liga USL
 *   node agente-assistente.js --liga ARG
 *   node agente-assistente.js --liga BR
 *   node agente-assistente.js --liga BUN
 *   node agente-assistente.js --todas
 *
 * RESULTADO:
 *   Atualiza o arquivo *2026.js com os jogos novos
 *   e roda recalcular_escoteiro.js automaticamente
 *
 * @module agente-assistente
 * @version 1.0.0
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Caminho relativo ao projeto-fantasma (onde estão as dependências)
const fantasmaDir = path.join(__dirname, '..', 'projeto-fantasma');
const FlashscoreMonster = require(path.join(fantasmaDir, 'flashscore-monster'));

// ═══════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO DE LIGAS
// ═══════════════════════════════════════════════════════════════
const LIGAS = {
  BR: {
    nome:       'Brasileirão Série A',
    url_results:'https://www.flashscore.com/football/brazil/serie-a-betano/results/',
    variavelJS: 'DADOS_BR',
    arquivoJS:  'brasileirao2026.js'
  },
  MLS: {
    nome:       'Major League Soccer',
    url_results:'https://www.flashscore.com/football/usa/mls/results/',
    variavelJS: 'DADOS_MLS',
    arquivoJS:  'mls2026.js'
  },
  ARG: {
    nome:       'Liga Profesional Argentina',
    url_results:'https://www.flashscore.com/football/argentina/liga-profesional/results/',
    variavelJS: 'DADOS_ARG',
    arquivoJS:  'argentina2026.js'
  },
  USL: {
    nome:       'USL Championship',
    url_results:'https://www.flashscore.com/football/usa/usl-championship/results/',
    variavelJS: 'DADOS_USL',
    arquivoJS:  'usl2026.js'
  },
  BUN: {
    nome:       'Bundesliga (Alemanha)',
    url_results:'https://www.flashscore.com/football/germany/bundesliga/results/',
    variavelJS: 'DADOS_BUN',
    arquivoJS:  'bundesliga2026.js'
  }
};

const dataDir     = path.join(__dirname, '..', 'especialista-cantos', 'data');
const backupDir   = path.join(fantasmaDir, 'backups');

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
    shield: '🛡️', flashscore: '⚡', new: '🆕', fix: '🔧'
  };
  console.log(`${icons[tipo] || '•'} ${msg}`);
}

function progressBar(current, total) {
  const pct  = Math.round((current / total) * 100);
  const fill = Math.round(pct / 10);
  return '█'.repeat(fill) + '░'.repeat(10 - fill) + ` ${pct}%`;
}

// ═══════════════════════════════════════════════════════════════
//  CARREGAR DADOS EXISTENTES
// ═══════════════════════════════════════════════════════════════

function carregarDados(liga) {
  const caminho = path.join(dataDir, liga.arquivoJS);
  if (!fs.existsSync(caminho)) return null;

  const raw = fs.readFileSync(caminho, 'utf-8');
  const window = {};
  const varNames = ['DADOS_USL','DADOS_MLS','DADOS_BR','DADOS_ARG','DADOS_BUN','DADOS_ECU'];
  const decls = varNames.map(v => `var ${v};`).join('\n');

  try {
    const fn = new Function('window', 'module', decls + '\n' + raw + '\nreturn window;');
    const w = fn({}, { exports: {} });
    return w[liga.variavelJS];
  } catch (e) {
    log(`Erro ao carregar ${liga.arquivoJS}: ${e.message}`, 'error');
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
//  EXTRAIR IDs DE JOGOS RECENTES DO FLASHSCORE
// ═══════════════════════════════════════════════════════════════

async function extrairIdsResultados(page, url, maxJogos = 80) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delayHumano(5000, 2000);

  // Clicar "Mostrar mais" se disponível
  for (let i = 0; i < 3; i++) {
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('a, button, div'))
        .find(el => (el.innerText || '').toLowerCase().includes('show more') ||
                    (el.innerText || '').toLowerCase().includes('mostrar mais'));
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!clicked) break;
    await delayHumano(3000, 1000);
  }

  return await page.evaluate((lim) => {
    const matches = document.querySelectorAll('.event__match');
    const ids = [];
    for (let i = 0; i < Math.min(matches.length, lim); i++) {
      const elId = matches[i].getAttribute('id');
      if (elId && elId.startsWith('g_1_')) {
        ids.push(elId.replace('g_1_', ''));
      }
    }
    return ids;
  }, maxJogos);
}

// ═══════════════════════════════════════════════════════════════
//  CONVERTER JOGO DO FORMATO FANTASMA → FORMATO ESPECIALISTA
// ═══════════════════════════════════════════════════════════════

function fantasmaParaEspecialista(j) {
  const ft = j.estatisticas_ft || {};
  const ht = j.estatisticas_ht || {};

  const cantosFT = ft.cantos || { m: 0, v: 0 };
  const cantosHT = ht.cantos || { m: 0, v: 0 };

  // Placar de gols
  let placar = null;
  if (j.placar && j.placar.ft && j.placar.ft !== 'Indisponível') {
    const partes = j.placar.ft.split('-').map(s => parseInt(s.trim()));
    if (partes.length === 2 && !isNaN(partes[0]) && !isNaN(partes[1])) {
      placar = { m: partes[0], v: partes[1] };
    }
  }

  // Gols HT
  let golsHT = null;
  if (j.placar && j.placar.ht && j.placar.ht !== 'Indisponível') {
    const partes = j.placar.ht.split('-').map(s => parseInt(s.trim()));
    if (partes.length === 2 && !isNaN(partes[0]) && !isNaN(partes[1])) {
      golsHT = { m: partes[0], v: partes[1] };
    }
  }

  return {
    id:        j.match_id || null,
    mandante:  j.mandante,
    visitante: j.visitante,
    data:      j.data_partida || null,
    rodada:    null,
    fonte:     'agente-assistente',
    gols: {
      ht: golsHT || { m: 0, v: 0 },
      ft: placar || { m: 0, v: 0 }
    },
    cantos: {
      ht: { m: cantosHT.m || 0, v: cantosHT.v || 0 },
      ft: { m: cantosFT.m || 0, v: cantosFT.v || 0 }
    },
    stats_taticas: (ft.posse && ft.finalizacoes) ? {
      posse:        { m: ft.posse.m, v: ft.posse.v },
      finalizacoes: { m: ft.finalizacoes.m, v: ft.finalizacoes.v }
    } : null,
    placar: placar
  };
}

// ═══════════════════════════════════════════════════════════════
//  SALVAR DADOS ATUALIZADOS
// ═══════════════════════════════════════════════════════════════

function salvarDados(liga, dados) {
  const caminho = path.join(dataDir, liga.arquivoJS);

  // Backup
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const ts = new Date().toISOString().split('T')[0];
  const backupPath = path.join(backupDir, `${liga.arquivoJS.replace('.js','')}_${ts}_pre-assistente.js`);
  if (fs.existsSync(caminho)) {
    fs.copyFileSync(caminho, backupPath);
    log(`Backup: ${path.basename(backupPath)}`, 'info');
  }

  // Atualizar metadados
  dados.ultimaAtualizacao = new Date().toISOString().split('T')[0].replace(/-/g, '/');

  const header = [
    `// ${liga.nome} 2026 — ATUALIZADO PELO AGENTE ASSISTENTE`,
    `// ${dados.jogos.length} jogos | Atualizado: ${new Date().toISOString().split('T')[0]}`,
    `window.${liga.variavelJS} = ${JSON.stringify(dados, null, 2)};`
  ].join('\n');

  fs.writeFileSync(caminho, header, 'utf-8');
  log(`Salvo: ${liga.arquivoJS} (${dados.jogos.length} jogos)`, 'success');
}

// ═══════════════════════════════════════════════════════════════
//  CORE: COMPLETAR JOGOS FALTANTES DE UMA LIGA
// ═══════════════════════════════════════════════════════════════

async function completarLiga(codigoLiga, browser) {
  const liga = LIGAS[codigoLiga];
  if (!liga) {
    log(`Liga "${codigoLiga}" não encontrada. Disponíveis: ${Object.keys(LIGAS).join(', ')}`, 'error');
    return null;
  }

  const dados = carregarDados(liga);
  if (!dados) {
    log(`Arquivo ${liga.arquivoJS} não encontrado`, 'error');
    return null;
  }

  // IDs que já temos
  const idsExistentes = new Set(dados.jogos.map(j => j.id || j.match_id).filter(Boolean));

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`🛡️ AGENTE ASSISTENTE — ${liga.nome} (${codigoLiga})`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Jogos existentes:   ${dados.jogos.length} (${idsExistentes.size} com ID)`);

  // Passo 1: Obter IDs da página de resultados
  log(`Acessando resultados: ${liga.url_results}`, 'flashscore');
  const pageScan = await browser.newPage();
  await pageScan.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  const idsFlashscore = await extrairIdsResultados(pageScan, liga.url_results, 120);
  await pageScan.close();

  log(`IDs encontrados no FlashScore: ${idsFlashscore.length}`, 'info');

  // Passo 2: Filtrar apenas os que NÃO temos
  const idsNovos = idsFlashscore.filter(id => !idsExistentes.has(id));

  console.log(`  IDs no FlashScore:  ${idsFlashscore.length}`);
  console.log(`  Já temos:           ${idsFlashscore.length - idsNovos.length}`);
  console.log(`  🆕 NOVOS:           ${idsNovos.length}`);
  console.log('═══════════════════════════════════════════════════');

  if (idsNovos.length === 0) {
    log('Nenhum jogo novo encontrado! Base completa.', 'success');
    return { liga: codigoLiga, novos: 0, falhas: 0, total: dados.jogos.length };
  }

  // Passo 3: Extrair dados completos de cada jogo novo
  const monster = new FlashscoreMonster();
  let novosColetados = 0;
  let falhas = 0;
  const startTime = Date.now();

  for (let i = 0; i < idsNovos.length; i++) {
    const matchId = idsNovos[i];
    const matchUrl = `https://www.flashscore.com/match/${matchId}/#/match-summary`;

    console.log(`\n  [${i + 1}/${idsNovos.length}] ${progressBar(i + 1, idsNovos.length)} | ID: ${matchId}`);

    let dadosJogo = null;
    let tentativas = 0;
    const maxRetries = 2;

    while (tentativas < maxRetries && !dadosJogo) {
      try {
        dadosJogo = await monster.extrairPartida(browser, matchUrl);

        if (dadosJogo && dadosJogo.mandante && dadosJogo.visitante) {
          dadosJogo.match_id = matchId;
          const convertido = fantasmaParaEspecialista(dadosJogo);

          if (convertido) {
            dados.jogos.push(convertido);
            novosColetados++;
            const placar = convertido.placar ? `${convertido.placar.m}-${convertido.placar.v}` : '?';
            const cantos = convertido.cantos.ft ? `C:${convertido.cantos.ft.m}-${convertido.cantos.ft.v}` : '';
            log(`  ${convertido.mandante} ${placar} ${convertido.visitante} | ${cantos} | ${convertido.data || '?'}`, 'new');
          }
          break;
        } else {
          throw new Error('Times não extraídos');
        }
      } catch (e) {
        tentativas++;
        if (tentativas < maxRetries) {
          log(`  Retry ${tentativas}/${maxRetries}: ${e.message}`, 'warn');
          await delayHumano(5000, 2000);
        } else {
          log(`  FALHA: ${matchId} — ${e.message}`, 'error');
          falhas++;
        }
      }
    }

    // Pausa anti-DDoS
    if (i < idsNovos.length - 1) {
      await delayHumano(5000, 2000);
    }
  }

  // Passo 4: Salvar
  if (novosColetados > 0) {
    // Atualizar contagem de times
    const timesSet = new Set();
    dados.jogos.forEach(j => { timesSet.add(j.mandante); timesSet.add(j.visitante); });
    dados.times = [...timesSet].sort();

    salvarDados(liga, dados);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📊 SUMÁRIO — ${liga.nome}`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Jogos novos:         ${novosColetados}/${idsNovos.length}`);
  console.log(`  Falhas:              ${falhas}`);
  console.log(`  Total agora:         ${dados.jogos.length}`);
  console.log(`  Tempo:               ${mins}m ${secs}s`);
  console.log('═══════════════════════════════════════════════════');

  return { liga: codigoLiga, novos: novosColetados, falhas, total: dados.jogos.length };
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
    console.log('║  🛡️ AGENTE ASSISTENTE — Agentes da S.H.I.E.L.D        ║');
    console.log('║  EDS Soluções Inteligentes                             ║');
    console.log('║  Completa jogos faltantes com estatísticas completas   ║');
    console.log('╚═════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('USO:');
    console.log('  node agente-assistente.js --liga MLS');
    console.log('  node agente-assistente.js --liga USL');
    console.log('  node agente-assistente.js --liga ARG');
    console.log('  node agente-assistente.js --liga BR');
    console.log('  node agente-assistente.js --liga BUN');
    console.log('  node agente-assistente.js --todas');
    console.log('');
    process.exit(0);
  }

  console.log('');
  console.log('═════════════════════════════════════════════════════════');
  console.log('🛡️ AGENTE ASSISTENTE — Agentes da S.H.I.E.L.D');
  console.log('   EDS Soluções Inteligentes');
  console.log(`   Ligas: ${ligasParaProcessar.join(', ')}`);
  console.log('   Padrão V4: headless=false + StealthPlugin + Monster');
  console.log('═════════════════════════════════════════════════════════');

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
      const result = await completarLiga(liga, browser);
      if (result) resultados.push(result);
    } catch (err) {
      log(`Erro fatal na liga ${liga}: ${err.message}`, 'error');
    }

    if (ligasParaProcessar.indexOf(liga) < ligasParaProcessar.length - 1) {
      log('Pausa de 12s entre ligas...', 'info');
      await delayHumano(12000, 3000);
    }
  }

  await browser.close();

  // Sumário geral
  if (resultados.length > 1) {
    console.log('\n══════════════ SUMÁRIO GERAL ══════════════');
    resultados.forEach(r => {
      console.log(`  ${r.liga}: +${r.novos} novos, ${r.falhas} falhas (total: ${r.total})`);
    });
  }

  // Rodar recalcular_escoteiro automaticamente
  const totalNovos = resultados.reduce((s, r) => s + r.novos, 0);
  if (totalNovos > 0) {
    console.log('');
    log('Rodando recalcular_escoteiro.js para regenerar perfis DNA...', 'fix');

    for (const r of resultados) {
      if (r.novos > 0) {
        try {
          console.log(`  → Recalculando ${r.liga}...`);
          execSync(`node "${path.join(fantasmaDir, 'recalcular_escoteiro.js')}" --liga ${r.liga}`, {
            stdio: 'inherit',
            cwd: fantasmaDir
          });
        } catch (e) {
          log(`Erro ao recalcular ${r.liga}: ${e.message}`, 'error');
        }
      }
    }

    // Sincronizar Yaaken-Scanner
    const scannerDir = path.join(__dirname, '..', '..', 'Yaaken-Scanner', 'yaaken-data');
    const rootYaakenDir = path.join(__dirname, '..', '..', 'yaaken-data');
    if (fs.existsSync(scannerDir) && fs.existsSync(rootYaakenDir)) {
      log('Sincronizando Yaaken-Scanner...', 'fix');
      const ligas = ['BR', 'MLS', 'ARG', 'USL', 'BUN'];
      ligas.forEach(l => {
        const src = path.join(rootYaakenDir, `escoteiro_${l}.js`);
        const dst = path.join(scannerDir, `escoteiro_${l}.js`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dst);
        }
      });
      log('Yaaken-Scanner sincronizado!', 'success');
    }

    console.log('');
    log('Missão completa! Dados atualizados em todos os apps.', 'success');
  } else {
    console.log('\n🛡️ Base de dados já está completa. Nenhuma ação necessária.');
  }
})();
