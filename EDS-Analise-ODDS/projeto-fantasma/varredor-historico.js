/**
 * Varredor Histórico v5 — Backfill Completo Multi-Liga
 * EDS Soluções Inteligentes
 *
 * Diferença do varredor-rodada.js:
 *   - Varre TODAS as rodadas visíveis no Flashscore (não só a última)
 *   - Detecta rodadas pelos cabeçalhos "Round N" do Flashscore
 *   - Faz scroll automático para carregar rodadas antigas
 *   - Deduplicação: pula jogos já presentes no histórico
 *   - Injeta resultado diretamente nos arquivos .js do Especialista/TEACHER
 *   - Captura data real de cada partida
 *   - Configs corrigidas: ARG 30 times/15 jogos, USL 25/12, MLS 30/15
 *
 * Uso:
 *   node varredor-historico.js --liga ARG
 *   node varredor-historico.js --liga ARG --rodadas 5    (últimas N rodadas)
 *   node varredor-historico.js --todas
 *   node varredor-historico.js --liga ARG --dry-run      (só lista, não salva)
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs   = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');
const { log } = require('./logger');

// ═══════════════════════════════════════════════════
//  CONFIGURAÇÃO CORRIGIDA DE LIGAS
// ═══════════════════════════════════════════════════
const LIGAS = {
  BR: {
    nome:            'Brasileirão Série A',
    url:             'https://www.flashscore.com/football/brazil/serie-a-betano/results/',
    times:           20,
    jogos_por_rodada: 10,
    variavelJS:      'DADOS_BR',
    arquivoJS:       'brasileirao2026.js'
  },
  MLS: {
    nome:            'Major League Soccer',
    url:             'https://www.flashscore.com/football/usa/mls/results/',
    times:           30,
    jogos_por_rodada: 15,   // 30 times ÷ 2
    variavelJS:      'DADOS_MLS',
    arquivoJS:       'mls2026.js'
  },
  ARG: {
    nome:            'Liga Profesional Argentina',
    url:             'https://www.flashscore.com/football/argentina/liga-profesional/results/',
    times:           30,
    jogos_por_rodada: 15,   // 30 times ÷ 2  (era 14 — CORRIGIDO)
    variavelJS:      'DADOS_ARG',
    arquivoJS:       'argentina2026.js'
  },
  USL: {
    nome:            'USL Championship',
    url:             'https://www.flashscore.com/football/usa/usl-championship/results/',
    times:           25,
    jogos_por_rodada: 12,   // 25 times: 12 jogos (1 folga por rodada)
    variavelJS:      'DADOS_USL',
    arquivoJS:       'usl2026.js'
  },
  ECU: {
    nome:            'Liga Pro Equador',
    url:             'https://www.flashscore.com/football/ecuador/liga-pro/results/',
    times:           16,
    jogos_por_rodada: 8,
    variavelJS:      'DADOS_ECU',
    arquivoJS:       'equador2026.js'
  }
};

// Pastas dos arquivos históricos
const PASTA_DADOS = [
  path.join(__dirname, '../especialista-cantos/data'),
  path.join(__dirname, '../EDS-Odds-Analyzer/EDS-ODDS-TEACHER/data')
];

// ═══════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════
function delay(ms, jitter = 500) {
  return new Promise(r => setTimeout(r, ms + Math.floor(Math.random() * jitter)));
}

function progressBar(cur, total) {
  const pct = Math.round((cur / total) * 100);
  const f   = Math.round(pct / 5);
  return '█'.repeat(f) + '░'.repeat(20 - f) + ' ' + pct + '%';
}

/** Carrega o objeto DADOS_XXX de um arquivo .js histórico */
function carregarHistorico(liga) {
  for (const pasta of PASTA_DADOS) {
    const p = path.join(pasta, liga.arquivoJS);
    if (fs.existsSync(p)) {
      let code = fs.readFileSync(p, 'utf8');
      code = code.replace(
        /if\s*\(typeof\s+module\s*!==?\s*["']undefined["']\)\s*module\.exports\s*=\s*[^;]+;?/g, ''
      );
      const m = code.match(/window\.\w+\s*=\s*(\{[\s\S]+\})\s*;?\s*$/);
      if (m) return eval('(' + m[1] + ')');
    }
  }
  return null;
}

/** Converte dado do Fantasma v4 → formato histórico do Especialista */
function fantasmaParaHistorico(j, rodadaNum) {
  const ft  = j.estatisticas_ft || {};
  const ht  = j.estatisticas_ht || {};

  // Cantos
  const cantosHT = ht.cantos || { m: null, v: null };
  const cantosFT = ft.cantos || { m: null, v: null };
  if (cantosFT.m === null || cantosFT.v === null) return null; // sem dado essencial

  // Stats tácticas (posse + finalizações)
  const hasTaticas = ft.posse && ft.finalizacoes;

  return {
    mandante:      j.mandante,
    visitante:     j.visitante,
    rodada:        rodadaNum || j.rodada || null,
    data:          j.data_partida ? j.data_partida.split('T')[0] : null,
    cantos: {
      ht: { m: cantosHT.m || 0, v: cantosHT.v || 0 },
      ft: { m: cantosFT.m,      v: cantosFT.v      }
    },
    stats_taticas: hasTaticas ? {
      posse:       { m: ft.posse.m,       v: ft.posse.v       },
      finalizacoes:{ m: ft.finalizacoes.m, v: ft.finalizacoes.v }
    } : null
  };
}

/** Salva o histórico atualizado nos arquivos .js de todas as pastas */
function salvarHistorico(liga, dados) {
  const conteudo =
    `// ============================================================\n` +
    `// DADOS ${liga.nome.toUpperCase()} 2026 — MOTOR FANTASMA v5\n` +
    `// Última atualização: ${new Date().toISOString().split('T')[0]}\n` +
    `// ============================================================\n\n` +
    `window.${liga.variavelJS} = ` +
    JSON.stringify(dados, null, 2) +
    `;\n`;

  let salvos = 0;
  for (const pasta of PASTA_DADOS) {
    const p = path.join(pasta, liga.arquivoJS);
    if (fs.existsSync(pasta)) {
      fs.writeFileSync(p, conteudo, 'utf8');
      log(`Salvo: ${p}`, 'success');
      salvos++;
    }
  }
  return salvos;
}

// ═══════════════════════════════════════════════════
//  EXTRAÇÃO DE ROUNDS DO FLASHSCORE
//  Detecta cabeçalhos "Round N", agrupa IDs por rodada
//  e para o scroll ao detectar jogos da temporada anterior
// ═══════════════════════════════════════════════════
async function extrairTodasRodadas(page, liga, maxRodadas, temporada = '2026') {
  log(`Detectando rodadas do Flashscore (temporada ${temporada})...`, 'info');
  log('Proteção ativa: scroll para quando detectar jogos de temporada anterior.', 'info');

  // Scroll progressivo — com freio de temporada
  let tentativasScroll = 0;
  const maxScroll = maxRodadas ? Math.ceil(maxRodadas * 2) : 60;
  let cruzouTemporada = false;

  while (tentativasScroll < maxScroll && !cruzouTemporada) {
    // Tentar clicar no botão "Mostrar Mais" do Flashscore
    const botaoMais = await page.$('a.event__more, button.event__more, .showMore');
    if (botaoMais) {
      await botaoMais.click();
      await delay(2500, 1000);
    } else {
      const alturaAntes = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(2000, 500);
      const alturaDepois = await page.evaluate(() => document.body.scrollHeight);
      if (alturaDepois === alturaAntes) break; // chegou ao fundo real da página
    }

    // ── FREIO DE TEMPORADA ──
    // Lê as datas visíveis nos jogos já carregados.
    // Se encontrar alguma data com o ano anterior, para o scroll.
    cruzouTemporada = await page.evaluate((anoAtual) => {
      // O Flashscore exibe a data de cada jogo no elemento .event__time
      const datas = Array.from(document.querySelectorAll('.event__time'));
      for (const el of datas) {
        const txt = el.innerText || '';
        // Formatos comuns: "12.03.", "12.03.2025", "Mar 12, 2025"
        const anoMatch = txt.match(/20(\d\d)/);
        if (anoMatch) {
          const ano = parseInt('20' + anoMatch[1]);
          if (ano < parseInt(anoAtual)) return true; // achou ano anterior → para
        }
      }
      return false;
    }, temporada);

    if (cruzouTemporada) {
      log(`⛔ Detectada data de temporada anterior — scroll interrompido.`, 'info');
    }

    tentativasScroll++;
  }

  // Extrair rounds e IDs agrupados pelos cabeçalhos do Flashscore
  // Inclui apenas jogos COM data dentro da temporada atual
  const rounds = await page.evaluate((anoAtual) => {
    const resultado  = [];
    let rodadaAtual  = null;
    let idsAtual     = [];
    let datasAtual   = [];

    const elementos = document.querySelectorAll(
      '.event__round, .event__match--static, .event__match'
    );

    elementos.forEach(el => {
      if (el.classList.contains('event__round')) {
        if (rodadaAtual !== null && idsAtual.length > 0) {
          resultado.push({ cabecalho: rodadaAtual, ids: idsAtual, datas: datasAtual });
        }
        rodadaAtual = el.innerText.trim();
        idsAtual    = [];
        datasAtual  = [];
      } else {
        // Verificar data do jogo antes de incluir
        const timeEl = el.querySelector('.event__time');
        const dataTexto = timeEl ? timeEl.innerText.trim() : '';
        const anoMatch  = dataTexto.match(/20(\d\d)/);

        // Se tem ano explícito e é de temporada anterior → ignorar
        if (anoMatch && parseInt('20' + anoMatch[1]) < parseInt(anoAtual)) return;

        const elId = el.getAttribute('id') || '';
        if (elId.includes('g_1_')) {
          idsAtual.push(elId.replace('g_1_', ''));
          datasAtual.push(dataTexto);
        }
      }
    });

    if (rodadaAtual !== null && idsAtual.length > 0) {
      resultado.push({ cabecalho: rodadaAtual, ids: idsAtual, datas: datasAtual });
    }

    return resultado;
  }, temporada);

  // Extrair número da rodada do cabeçalho (ex: "Round 11" → 11)
  const rodadasParsed = rounds
    .filter(r => r.ids.length > 0)
    .map(r => {
      const numMatch = r.cabecalho.match(/\d+/);
      return {
        rodada:    numMatch ? parseInt(numMatch[0]) : null,
        cabecalho: r.cabecalho,
        ids:       r.ids
      };
    });

  log(`Detectadas ${rodadasParsed.length} rodadas válidas da temporada ${temporada}`, 'info');
  rodadasParsed.forEach(r =>
    log(`  ${r.cabecalho}: ${r.ids.length} jogos`, 'info')
  );

  // Filtrar por maxRodadas (pega as mais recentes = primeiras da lista)
  if (maxRodadas && rodadasParsed.length > maxRodadas) {
    return rodadasParsed.slice(0, maxRodadas);
  }
  return rodadasParsed;
}

// ═══════════════════════════════════════════════════
//  VARREDURA HISTÓRICA DE UMA LIGA
// ═══════════════════════════════════════════════════
async function varrerHistoricoLiga(codigoLiga, browser, opcoes = {}) {
  const liga = LIGAS[codigoLiga];
  if (!liga) {
    log(`Liga "${codigoLiga}" inválida.`, 'error');
    return null;
  }

  const { maxRodadas, dryRun, temporada = '2026' } = opcoes;
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`👻 VARREDOR HISTÓRICO v5 — ${liga.nome} (${codigoLiga})`);
  console.log(`   Times: ${liga.times} | Jogos/Rod: ${liga.jogos_por_rodada}`);
  if (maxRodadas) console.log(`   Modo: últimas ${maxRodadas} rodadas`);
  else            console.log('   Modo: histórico COMPLETO');
  console.log(`   Temporada: ${temporada} (jogos de anos anteriores serão ignorados`);
  if (dryRun)     console.log('   ⚠️  DRY-RUN — não vai salvar arquivos');
  console.log('═══════════════════════════════════════════════════════');

  // Carregar histórico existente (para deduplicação)
  const dadosExistentes = carregarHistorico(liga);
  const jogosExistentes = new Set(
    (dadosExistentes?.jogos || []).map(j => `${j.mandante}||${j.visitante}||${j.rodada}`)
  );
  const timesExistentes = new Set(dadosExistentes?.times || []);

  log(`Histórico atual: ${jogosExistentes.size} jogos já catalogados`, 'info');

  // ── Passo 1: Abrir página de resultados e detectar rodadas ──
  const page = await browser.newPage();
  log(`Acessando: ${liga.url}`, 'flashscore');
  await page.goto(liga.url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delay(5000, 2000);

  const rodadasDetectadas = await extrairTodasRodadas(page, liga, maxRodadas, temporada);
  await page.close();

  if (rodadasDetectadas.length === 0) {
    log('Nenhuma rodada detectada. Verifique a URL da liga.', 'error');
    return null;
  }

  // ── Passo 2: Scrape de cada jogo de cada rodada ──
  const jogosNovos     = [];
  const timesNovos     = new Set();
  let totalExtraidos   = 0;
  let totalDuplicados  = 0;
  let totalFalhas      = 0;

  for (const { rodada, cabecalho, ids } of rodadasDetectadas) {
    console.log('');
    console.log(`  ── ${cabecalho} (${ids.length} jogos) ──`);

    for (let i = 0; i < ids.length; i++) {
      const chaveDedup = `||${ids[i]}`;
      const url = `https://www.flashscore.com/match/${ids[i]}/#/match-summary`;

      // Verificar duplicata pelo ID do jogo (mais confiável que nome+rodada)
      // Usamos mandante+visitante depois da extração
      console.log(`\n    [${i + 1}/${ids.length}] ${progressBar(i + 1, ids.length)} | ${cabecalho}`);

      let partida = null;
      let tentativas = 0;

      while (tentativas < 3) {
        try {
          partida = await fantasma.extrairPartida(url, {
            liga:        liga.nome,
            codigo_liga: codigoLiga,
            rodada:      rodada
          });

          if (partida?.estatisticas_ft?.cantos) {
            const c = partida.estatisticas_ft.cantos;
            console.log(`    ✅ ${partida.mandante} vs ${partida.visitante} | FT Cantos: ${c.m}-${c.v}`);
            break;
          } else {
            throw new Error('Cantos FT não extraídos');
          }
        } catch (e) {
          tentativas++;
          if (tentativas < 3) {
            console.log(`    ⚠️  Retry ${tentativas}/3: ${e.message}`);
            await delay(5000 * tentativas, 1000);
          } else {
            console.log(`    ❌ Falha permanente: ${e.message}`);
            totalFalhas++;
            partida = null;
          }
        }
      }

      if (!partida) continue;

      // Verificar duplicata pelo conteúdo
      const chaveConteudo = `${partida.mandante}||${partida.visitante}||${rodada}`;
      if (jogosExistentes.has(chaveConteudo)) {
        console.log(`    ⏭️  Já no histórico — pulando`);
        totalDuplicados++;
        continue;
      }

      // Converter para formato histórico
      const jogoHistorico = fantasmaParaHistorico(partida, rodada);
      if (jogoHistorico) {
        jogosNovos.push(jogoHistorico);
        timesNovos.add(partida.mandante);
        timesNovos.add(partida.visitante);
        totalExtraidos++;
        jogosExistentes.add(chaveConteudo); // evitar duplicata na mesma execução
      }

      await delay(4000, 1500);
    }
  }

  // ── Passo 3: Mesclar com histórico e salvar ──
  console.log('');
  console.log(`═══════════════════════════════════════════════════════`);
  console.log(`📊 RESULTADO — ${liga.nome}`);
  console.log(`   Jogos novos extraídos: ${totalExtraidos}`);
  console.log(`   Duplicatas ignoradas:  ${totalDuplicados}`);
  console.log(`   Falhas:                ${totalFalhas}`);

  if (totalExtraidos === 0) {
    log('Nenhum jogo novo para adicionar.', 'info');
    return { liga: codigoLiga, novos: 0, falhas: totalFalhas };
  }

  if (dryRun) {
    log('DRY-RUN: arquivos não serão salvos.', 'info');
    return { liga: codigoLiga, novos: totalExtraidos, falhas: totalFalhas };
  }

  // Combinar todos os times
  const todosOsTimes = [
    ...new Set([
      ...(dadosExistentes?.times || []),
      ...Array.from(timesNovos)
    ])
  ].sort();

  // Combinar jogos: existentes + novos, ordenados por rodada
  const todosJogos = [
    ...(dadosExistentes?.jogos || []),
    ...jogosNovos
  ].sort((a, b) => (a.rodada || 0) - (b.rodada || 0));

  const maxRodada = Math.max(...todosJogos.map(j => j.rodada || 0), 0);

  const dadosFinais = {
    temporada:       dadosExistentes?.temporada || liga.nome,
    ultimaAtualizacao: new Date().toISOString().split('T')[0],
    totalRodadas:    maxRodada,
    times:           todosOsTimes,
    jogos:           todosJogos
  };

  const arquivosSalvos = salvarHistorico(liga, dadosFinais);

  console.log(`   Total histórico final: ${todosJogos.length} jogos`);
  console.log(`   Times registrados:     ${todosOsTimes.length}`);
  console.log(`   Rodadas completas:     ${maxRodada}`);
  console.log(`   Arquivos atualizados:  ${arquivosSalvos}`);
  console.log(`═══════════════════════════════════════════════════════`);

  return { liga: codigoLiga, novos: totalExtraidos, total: todosJogos.length, falhas: totalFalhas };
}

// ═══════════════════════════════════════════════════
//  CLI
// ═══════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);

  // Opções
  const dryRun    = args.includes('--dry-run');
  const todasFlag = args.includes('--todas');

  let maxRodadas  = null;
  if (args.includes('--rodadas')) {
    const idx = args.indexOf('--rodadas');
    maxRodadas = parseInt(args[idx + 1]) || null;
  }

  // Temporada (padrão: ano atual)
  let temporada = String(new Date().getFullYear());
  if (args.includes('--temporada')) {
    const idx = args.indexOf('--temporada');
    temporada = args[idx + 1] || temporada;
  }

  let ligasParaVarrer = [];
  if (todasFlag) {
    ligasParaVarrer = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const idx    = args.indexOf('--liga');
    const codigo = (args[idx + 1] || '').toUpperCase();
    if (LIGAS[codigo]) {
      ligasParaVarrer = [codigo];
    } else {
      console.log(`Liga inválida: "${args[idx + 1]}". Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('Uso:');
    console.log('  node varredor-historico.js --liga ARG');
    console.log('  node varredor-historico.js --liga ARG --rodadas 5');
    console.log('  node varredor-historico.js --todas');
    console.log('  node varredor-historico.js --todas --dry-run');
    process.exit(0);
  }

  console.log('');
  console.log('╔═════════════════════════════════════════════════════╗');
  console.log('║   👻 ANALISTA FANTASMA v5 — VARREDOR HISTÓRICO      ║');
  console.log('║   EDS Soluções Inteligentes                         ║');
  console.log('╚═════════════════════════════════════════════════════╝');
  console.log(`   Ligas:      ${ligasParaVarrer.join(', ')}`);
  console.log(`   Max rodadas: ${maxRodadas || 'TODAS'}`);
  console.log(`   Dry-run:     ${dryRun}`);
  console.log('');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  const resumo = [];

  for (const codigoLiga of ligasParaVarrer) {
    try {
      const resultado = await varrerHistoricoLiga(codigoLiga, browser, { maxRodadas, dryRun, temporada });
      if (resultado) resumo.push(resultado);
    } catch (err) {
      log(`Erro fatal na liga ${codigoLiga}: ${err.message}`, 'error');
      console.error(err);
    }

    if (ligasParaVarrer.indexOf(codigoLiga) < ligasParaVarrer.length - 1) {
      log('Pausa de 15s entre ligas...', 'info');
      await delay(15000, 3000);
    }
  }

  await browser.close();

  // Resumo final
  if (resumo.length > 1) {
    console.log('\n╔═════════════════════════════════════════╗');
    console.log('║   RESUMO GERAL                          ║');
    console.log('╚═════════════════════════════════════════╝');
    resumo.forEach(r => {
      console.log(`  ${r.liga}: +${r.novos} novos | total: ${r.total || '?'} | falhas: ${r.falhas}`);
    });
  }

  console.log('\n🏁 Varredura histórica concluída!');
})();
