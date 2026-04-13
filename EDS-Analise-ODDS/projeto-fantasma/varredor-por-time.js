/**
 * Varredor por Time v5 — Histórico Completo via Tabela de Classificação
 * EDS Soluções Inteligentes
 *
 * ESTRATÉGIA:
 *   1. Abre a tabela de classificação da liga no Flashscore
 *   2. Extrai automaticamente todos os times + seus links de resultados
 *   3. Para cada time, navega em seu histórico e coleta TODOS os jogos de 2026
 *   4. Deduplica por match_id (cada jogo é scraped apenas 1x, mesmo aparecendo em 2 times)
 *   5. Ordena do mais antigo ao mais recente e detecta a rodada por data
 *   6. Injeta direto nos arquivos .js do Especialista e TEACHER
 *
 * VANTAGENS vs varredor por rodada:
 *   ✅ 100% completo — não depende de "jogos por rodada"
 *   ✅ Não precisa de configuração manual de times
 *   ✅ Nunca captura jogos de temporada anterior (filtra por ano)
 *   ✅ Ordenação cronológica natural por data real
 *   ✅ Funciona com qualquer estrutura de torneio (grupos, mata-mata, etc.)
 *
 * Uso:
 *   node varredor-por-time.js --liga ARG
 *   node varredor-por-time.js --liga ARG --temporada 2026
 *   node varredor-por-time.js --todas
 *   node varredor-por-time.js --liga ARG --dry-run
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs   = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');
const { log } = require('./logger');

// ═══════════════════════════════════════════════════
//  CONFIGURAÇÃO DE LIGAS
//  url_tabela: página de classificação (fonte dos times)
//  url_resultados: fallback se tabela não disponível
// ═══════════════════════════════════════════════════
const LIGAS = {
  BR: {
    nome:              'Brasileirão Série A',
    url_tabela:        'https://www.flashscore.com/football/brazil/serie-a-betano/standings/',
    variavelJS:        'DADOS_BR',
    arquivoJS:         'brasileirao2026.js',
    // Termos que identificam a competição no cabeçalho do Flashscore
    // (case-insensitive — qualquer um que bater já filtra)
    filtroCompetição:  []  // desativado — limpeza por lista de times depois
  },
  MLS: {
    nome:              'Major League Soccer',
    url_tabela:        'https://www.flashscore.com/football/usa/mls/standings/',
    variavelJS:        'DADOS_MLS',
    arquivoJS:         'mls2026.js',
    filtroCompetição:  []  // desativado
  },
  ARG: {
    nome:              'Liga Profesional Argentina',
    url_tabela:        'https://www.flashscore.com/football/argentina/liga-profesional/standings/',
    variavelJS:        'DADOS_ARG',
    arquivoJS:         'argentina2026.js',
    filtroCompetição:  []  // desativado
  },
  USL: {
    nome:              'USL Championship',
    url_tabela:        'https://www.flashscore.com/football/usa/usl-championship/standings/',
    variavelJS:        'DADOS_USL',
    arquivoJS:         'usl2026.js',
    filtroCompetição:  []  // desativado
  },
  ECU: {
    nome:              'Liga Pro Equador',
    url_tabela:        'https://www.flashscore.com/football/ecuador/liga-pro/standings/',
    variavelJS:        'DADOS_ECU',
    arquivoJS:         'equador2026.js',
    filtroCompetição:  []  // desativado
  },
  BUN: {
    nome:              'Bundesliga (Alemanha)',
    url_tabela:        'https://www.flashscore.com/football/germany/bundesliga/standings/',
    variavelJS:        'DADOS_BUN',
    arquivoJS:         'bundesliga2026.js',
    filtroCompetição:  []
  },
  J1: {
    nome:              'J1 League (Japão)',
    url_tabela:        'https://www.flashscore.com/football/japan/j1-league/standings/',
    variavelJS:        'DADOS_J1',
    arquivoJS:         'j1league2026.js',
    filtroCompetição:  []
  },
  ALM: {
    nome:              'A-League Men (Austrália)',
    url_tabela:        'https://www.flashscore.com/football/australia/a-league/standings/',
    variavelJS:        'DADOS_ALM',
    arquivoJS:         'aleague2026.js',
    filtroCompetição:  []
  },
  CHI: {
    nome:              'Primera División (Chile)',
    url_tabela:        'https://www.flashscore.com/football/chile/liga-de-primera/standings/',
    variavelJS:        'DADOS_CHI',
    arquivoJS:         'chile2026.js',
    filtroCompetição:  []
  },
  ARG_B: {
    nome:              'Primera B Nacional (Argentina)',
    url_tabela:        'https://www.flashscore.com/football/argentina/primera-nacional/standings/',
    variavelJS:        'DADOS_ARG_B',
    arquivoJS:         'argentina_b2026.js',
    filtroCompetição:  []
  }
};

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
  return '█'.repeat(f) + '░'.repeat(20 - f) + ` ${String(cur).padStart(2)}/${total} (${pct}%)`;
}

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

/** Converte jogo do formato Fantasma v4 → formato histórico do Especialista */
function fantasmaParaHistorico(j, tabelaPosicoes = {}) {
  const ft = j.estatisticas_ft || {};
  const ht = j.estatisticas_ht || {};

  const cantosFT = ft.cantos;
  const cantosHT = ht.cantos || { m: 0, v: 0 };

  if (!cantosFT || cantosFT.m == null || cantosFT.v == null) return null;

  // Posição na tabela no momento da coleta
  const posM = tabelaPosicoes[j.mandante]  || null;
  const posV = tabelaPosicoes[j.visitante] || null;

  return {
    match_id:  j.match_id || null,
    mandante:  j.mandante,
    visitante: j.visitante,
    rodada:    j.rodada   || null,
    data:      j.data_partida ? j.data_partida.split('T')[0] : null,
    // Posição na tabela no momento do jogo (M = mandante, V = visitante)
    // Permite análise futura: time desesperado (Z4) vs líder muda a dinâmica de cantos?
    tabela: (posM || posV) ? {
      pos_mandante:  posM ? posM.posicao : null,
      pts_mandante:  posM ? posM.pontos  : null,
      pos_visitante: posV ? posV.posicao : null,
      pts_visitante: posV ? posV.pontos  : null
    } : null,
    cantos: {
      ht: { m: cantosHT.m || 0, v: cantosHT.v || 0 },
      ft: { m: cantosFT.m,      v: cantosFT.v      }
    },
    stats_taticas: (ft.posse && ft.finalizacoes) ? {
      posse:        { m: ft.posse.m,        v: ft.posse.v        },
      finalizacoes: { m: ft.finalizacoes.m,  v: ft.finalizacoes.v }
    } : null
  };
}

/** Inferir número da rodada a partir da data (jogos ordenados cronologicamente) */
function inferirRodadas(jogos) {
  if (!jogos.length) return jogos;

  // Agrupar por datas próximas (janela de 5 dias = mesma rodada)
  const ordenados = [...jogos].sort((a, b) =>
    new Date(a.data || '2026-01-01') - new Date(b.data || '2026-01-01')
  );

  let rodadaAtual = 1;
  let dataRef     = ordenados[0]?.data || '2026-01-01';
  const timesNaRodada = new Set();

  for (const jogo of ordenados) {
    const diff = Math.abs(
      new Date(jogo.data || dataRef) - new Date(dataRef)
    ) / (1000 * 60 * 60 * 24);

    // Novo ciclo de rodada se:
    //  - Data muito distante (>5 dias), OU
    //  - Um dos times já jogou nessa rodada (impossível jogar 2x na mesma rodada)
    const mandanteRepetido  = timesNaRodada.has(jogo.mandante);
    const visitanteRepetido = timesNaRodada.has(jogo.visitante);

    if (diff > 5 || mandanteRepetido || visitanteRepetido) {
      rodadaAtual++;
      dataRef = jogo.data || dataRef;
      timesNaRodada.clear();
    }

    jogo.rodada = rodadaAtual;
    timesNaRodada.add(jogo.mandante);
    timesNaRodada.add(jogo.visitante);
  }

  return ordenados;
}

// ═══════════════════════════════════════════════════
//  BACKUP AUTOMÁTICO — protege contra sobrescrita acidental
//  Mantém os últimos BACKUP_MAX arquivos por liga
// ═══════════════════════════════════════════════════
const BACKUP_DIR  = path.join(__dirname, 'backups');
const BACKUP_MAX  = 5; // quantas versões manter por liga

function fazerBackup(liga, arquivoOrigem) {
  try {
    if (!fs.existsSync(arquivoOrigem)) return; // nada a fazer se não existe ainda

    // Criar pasta de backups se não existir
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

    const ts        = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const nomeBase  = path.basename(arquivoOrigem, '.js');
    const destino   = path.join(BACKUP_DIR, `${nomeBase}_${ts}.js`);

    fs.copyFileSync(arquivoOrigem, destino);
    log(`  💾 Backup salvo: backups/${path.basename(destino)}`, 'info');

    // Limpar backups antigos — manter apenas os BACKUP_MAX mais recentes desta liga
    const todos = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith(nomeBase + '_') && f.endsWith('.js'))
      .sort(); // ISO timestamp → ordem cronológica natural

    if (todos.length > BACKUP_MAX) {
      const paraApagar = todos.slice(0, todos.length - BACKUP_MAX);
      paraApagar.forEach(f => {
        fs.unlinkSync(path.join(BACKUP_DIR, f));
        log(`  🗑️  Backup antigo removido: ${f}`, 'info');
      });
    }
  } catch (err) {
    log(`  ⚠️  Backup falhou (não crítico): ${err.message}`, 'error');
    // Nunca bloquear o fluxo principal por causa de backup
  }
}

function salvarHistorico(liga, dados) {
  const conteudo =
    `// ============================================================\n` +
    `// ${liga.nome.toUpperCase()} 2026 — MOTOR FANTASMA v5 (por time)\n` +
    `// Atualizado: ${new Date().toISOString().split('T')[0]}\n` +
    `// ============================================================\n\n` +
    `window.${liga.variavelJS} = ` +
    JSON.stringify(dados, null, 2) + `;\n`;

  let salvos = 0;
  for (const pasta of PASTA_DADOS) {
    const p = path.join(pasta, liga.arquivoJS);
    if (fs.existsSync(pasta)) {
      // ── Backup antes de sobrescrever ──
      fazerBackup(liga, p);
      fs.writeFileSync(p, conteudo, 'utf8');
      log(`✅ Salvo: ${p}  (${dados.jogos?.length || 0} jogos)`, 'success');
      salvos++;
    }
  }
  return salvos;
}

// ═══════════════════════════════════════════════════
//  PASSO 1: EXTRAIR TIMES DA TABELA DE CLASSIFICAÇÃO
// ═══════════════════════════════════════════════════
async function extrairTimesTabela(page, liga) {
  log(`Abrindo tabela de classificação: ${liga.url_tabela}`, 'flashscore');
  await page.goto(liga.url_tabela, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delay(5000, 2000);

  // Clicar em "Aceitar cookies" se aparecer
  try {
    const btnCookie = await page.$('button#onetrust-accept-btn-handler, button.fc-cta-consent');
    if (btnCookie) { await btnCookie.click(); await delay(1000); }
  } catch (_) {}

  const times = await page.evaluate(() => {
    const resultado = [];

    // Estratégia 1: linhas completas da tabela (captura nome + posição + pontos)
    const linhas = document.querySelectorAll(
      '.tableTeam, .ui-table__row, .standings__row, [class*="table__row"]'
    );

    linhas.forEach((linha, idx) => {
      // Posição: primeira célula com número
      const posEl   = linha.querySelector(
        '.table__cell--rank, .standings__cell--rank, [class*="rank"], [class*="position"]'
      );
      const posicao = posEl ? parseInt(posEl.innerText?.trim()) : (idx + 1);

      // Link do time
      const linkEl = linha.querySelector(
        '.tableCellParticipant__name, a[href*="/team/"], .standings__cell--name a, [class*="participant"] a'
      );
      if (!linkEl) return;

      const nome = linkEl.innerText?.trim();
      const href = linkEl.href || linkEl.getAttribute('href') || '';
      if (!nome || !href || nome.length < 2) return;

      // Pontos: célula com classe "pts" ou última célula numérica
      const ptsCandidatos = linha.querySelectorAll(
        '.table__cell--points, [class*="pts"], [class*="points"]'
      );
      let pontos = null;
      ptsCandidatos.forEach(el => {
        const v = parseInt(el.innerText?.trim());
        if (!isNaN(v)) pontos = v;
      });

      if (!resultado.find(t => t.nome === nome)) {
        resultado.push({
          nome,
          posicao:       isNaN(posicao) ? (idx + 1) : posicao,
          pontos:        pontos,
          urlResultados: href.replace(/\/results\/?$/, '').replace(/\/$/, '') + '/results/'
        });
      }
    });

    // Estratégia 2: só links de participantes (sem posição/pontos)
    if (resultado.length === 0) {
      const seletores = [
        '.tableCellParticipant__name',
        '.table__cell--participantStandingsLink',
        '.standings__cell--name a',
        '[class*="participant"] a',
        '.team_name_span'
      ];
      for (const sel of seletores) {
        const els = document.querySelectorAll(sel);
        if (els.length > 0) {
          els.forEach((el, i) => {
            const nome = el.innerText?.trim();
            const href = el.href || el.getAttribute('href') || '';
            if (nome && href && !resultado.find(t => t.nome === nome)) {
              resultado.push({
                nome,
                posicao: i + 1,
                pontos: null,
                urlResultados: href.replace(/\/results\/?$/, '').replace(/\/$/, '') + '/results/'
              });
            }
          });
          if (resultado.length > 0) break;
        }
      }
    }

    return resultado;
  });

  if (times.length === 0) {
    log('⚠️  Não encontrou times pela tabela — tentando extrair do DOM completo...', 'info');
    // Fallback: pegar todos os links de times na página
    const timesFallback = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/team/"]'));
      const vistos = new Set();
      return links.reduce((acc, el, i) => {
        const nome = el.innerText?.trim();
        const href = el.href;
        if (nome && href && nome.length > 2 && !vistos.has(nome)) {
          vistos.add(nome);
          acc.push({
            nome,
            posicao: i + 1,
            pontos: null,
            urlResultados: href.replace(/\/results\/?$/, '').replace(/\/$/, '') + '/results/'
          });
        }
        return acc;
      }, []);
    });
    return timesFallback;
  }

  return times;
}

// ═══════════════════════════════════════════════════
//  PASSO 2: EXTRAIR TODOS OS MATCH IDs DO HISTÓRICO DE UM TIME
// ═══════════════════════════════════════════════════
async function extrairJogosDoTime(page, time, temporada, filtroCompetição = []) {
  log(`  🔍 ${time.nome} — buscando jogos de ${temporada}...`, 'info');

  await page.goto(time.urlResultados, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(3000, 1000);

  // Scroll para carregar todos os resultados da temporada
  let scrolls = 0;
  let cruzouTemporada = false;

  while (scrolls < 30 && !cruzouTemporada) {
    const btnMais = await page.$('a.event__more, button.event__more');
    if (btnMais) {
      await btnMais.click();
      await delay(2000, 500);
    } else {
      const antes = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(1500, 500);
      const depois = await page.evaluate(() => document.body.scrollHeight);
      if (depois === antes) break;
    }

    // Verificar se já cruzou para temporada anterior
    cruzouTemporada = await page.evaluate((ano) => {
      const els = document.querySelectorAll('.event__time');
      for (const el of els) {
        const m = el.innerText.match(/20(\d\d)/);
        if (m && parseInt('20' + m[1]) < parseInt(ano)) return true;
      }
      return false;
    }, temporada);

    scrolls++;
  }

  // Extrair IDs dos jogos — filtrando apenas a competição alvo
  const matchIds = await page.evaluate((ano, filtros) => {
    const resultado = [];

    // O Flashscore agrupa jogos por competição via cabeçalhos no DOM.
    // Percorremos todos os elementos em ordem e controlamos qual competição
    // está "ativa" no momento — só coletamos matches da competição certa.
    const seletoresHeader = [
      '.event__header',
      '.wclLeagueHeader',
      '[class*="leagueHeader"]',
      '[class*="tournamentHeader"]'
    ];

    const todosEls = document.querySelectorAll(
      seletoresHeader.join(', ') +
      ', .event__match, .event__match--static'
    );

    let competicaoAtiva = filtros.length === 0; // se sem filtro, aceita tudo

    todosEls.forEach(el => {
      // Se é um cabeçalho de competição, atualiza qual está ativa
      const isHeader = seletoresHeader.some(sel => el.matches(sel));
      if (isHeader) {
        const textoHeader = (el.innerText || '').toLowerCase();
        if (filtros.length === 0) {
          competicaoAtiva = true;
        } else {
          competicaoAtiva = filtros.some(f => textoHeader.includes(f.toLowerCase()));
        }
        return;
      }

      // Só processa matches se a competição atual é a desejada
      if (!competicaoAtiva) return;

      // Checar data
      const timeEl  = el.querySelector('.event__time');
      const dataTxt = timeEl?.innerText?.trim() || '';
      const anoMatch = dataTxt.match(/20(\d\d)/);
      if (anoMatch && parseInt('20' + anoMatch[1]) < parseInt(ano)) return;

      const elId = el.getAttribute('id') || '';
      if (elId.includes('g_1_')) {
        // ── PRÉ-FILTRO: capturar nomes dos times direto da linha de resultado ──
        // Evita tentar buscar stats de jogos de copa (US Open Cup, Libertadores, etc.)
        const homeEl = el.querySelector(
          '.event__participant--home, .event__homeParticipant, [class*="homeParticipant"]'
        );
        const awayEl = el.querySelector(
          '.event__participant--away, .event__awayParticipant, [class*="awayParticipant"]'
        );
        const nomeMandante = homeEl?.innerText?.trim().split('\n')[0] || '';
        const nomeVisitante = awayEl?.innerText?.trim().split('\n')[0] || '';

        resultado.push({
          matchId:      elId.replace('g_1_', ''),
          dataTxt,
          nomeMandante,
          nomeVisitante
        });
      }
    });

    return resultado;
  }, temporada, filtroCompetição);

  const filtroInfo = filtroCompetição.length > 0
    ? ` (filtrado: "${filtroCompetição[0]}")`
    : ' (sem filtro)';
  log(`     → ${matchIds.length} jogos encontrados em ${temporada}${filtroInfo}`, 'info');
  return matchIds;
}

// ═══════════════════════════════════════════════════
//  MOTOR PRINCIPAL: VARRER UMA LIGA POR TIME
// ═══════════════════════════════════════════════════
async function varrerPorTime(codigoLiga, browserRef, opcoes = {}) {
  let browser = browserRef; // let para permitir auto-restart
  const liga = LIGAS[codigoLiga];
  if (!liga) { log(`Liga "${codigoLiga}" inválida.`, 'error'); return null; }

  const { dryRun, temporada = String(new Date().getFullYear()) } = opcoes;
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log(`║  👻 VARREDOR POR TIME v5 — ${liga.nome.padEnd(30)}║`);
  console.log(`║  Temporada: ${temporada}   Dry-run: ${dryRun ? 'SIM' : 'NÃO'}                        ║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  // Carregar histórico existente (deduplicação por match_id)
  const dadosExist    = carregarHistorico(liga);
  const idsJaExist    = new Set(
    (dadosExist?.jogos || []).map(j => j.match_id).filter(Boolean)
  );
  const nomesJaExist  = new Set(
    (dadosExist?.jogos || []).map(j => `${j.mandante}||${j.visitante}`)
  );

  log(`Histórico atual: ${idsJaExist.size} jogos já catalogados`, 'info');

  // ── Passo 1: Times da tabela ──
  const page = await browser.newPage();
  const times = await extrairTimesTabela(page, liga);
  try { await page.close(); } catch (_) {}

  if (times.length === 0) {
    log('Nenhum time encontrado na tabela. Verifique a URL.', 'error');
    return null;
  }

  console.log(`\n  Times detectados na tabela: ${times.length}`);
  times.forEach((t, i) => {
    const pts = t.pontos != null ? ` | ${t.pontos} pts` : '';
    console.log(`    ${String(i + 1).padStart(2)}. ${t.nome} (pos ${t.posicao}${pts})`);
  });

  // Mapa de posição na tabela — usado para enriquecer cada jogo histórico
  const tabelaPosicoes = {};
  times.forEach(t => {
    tabelaPosicoes[t.nome] = { posicao: t.posicao, pontos: t.pontos };
  });

  // ── Passo 2: Coletar match IDs de cada time ──
  console.log('\n  ── Coletando IDs de jogos por time ──');
  const todosMatchIds  = new Map(); // matchId → dataTxt
  const timesNaLiga   = new Set(times.map(t => t.nome)); // set para pré-filtro rápido
  let descartadosCopa = 0;

  let pageTimes = await browser.newPage();
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    console.log(`\n  [${i + 1}/${times.length}] ${progressBar(i + 1, times.length)} | ${time.nome}`);
    try {
      const ids = await extrairJogosDoTime(pageTimes, time, temporada, liga.filtroCompetição || []);
      ids.forEach(({ matchId, dataTxt, nomeMandante, nomeVisitante }) => {
        // ── PRÉ-FILTRO: descartar jogos onde qualquer time não está na liga ──
        // Elimina jogos de copa (US Open Cup, Libertadores, etc.) SEM buscar stats
        if (nomeMandante && nomeVisitante) {
          const mandOk = timesNaLiga.has(nomeMandante);
          const visOk  = timesNaLiga.has(nomeVisitante);
          if (!mandOk || !visOk) {
            descartadosCopa++;
            return; // skip — time fora da liga → jogo de copa
          }
        }
        if (!todosMatchIds.has(matchId)) todosMatchIds.set(matchId, dataTxt);
      });
    } catch (e) {
      log(`  ⚠️  Erro ao ler ${time.nome}: ${e.message}`, 'error');
      // Se o browser crashou, reiniciar e continuar com os times restantes
      if (e.message.includes('Protocol error') || e.message.includes('Connection closed') || e.message.includes('detached Frame') || e.message.includes('Target closed') || e.message.includes('Session closed')) {
        console.log(`  🔄 Browser crashou na coleta — reiniciando...`);
        try { await pageTimes.close(); } catch (_) {}
        try { await browser.close(); } catch (_) {}
        await delay(5000);
        browser = await puppeteer.launch({
          headless: false,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
        });
        fantasma.browser = browser;
        pageTimes = await browser.newPage();
        console.log(`  ✅ Browser recuperado — continuando coleta de IDs`);
      }
    }
    await delay(3000, 1000);
  }
  try { await pageTimes.close(); } catch (_) {}

  // Filtrar os já existentes
  const idsNovos = [...todosMatchIds.keys()].filter(id => !idsJaExist.has(id));
  console.log(`\n  IDs únicos encontrados: ${todosMatchIds.size}`);
  console.log(`  ⛔ Descartados (copa):   ${descartadosCopa} (pré-filtro por time — sem buscar stats)`);
  console.log(`  Já no histórico:        ${todosMatchIds.size - idsNovos.length}`);
  console.log(`  Novos para scrape:      ${idsNovos.length}`);

  if (idsNovos.length === 0) {
    log('Histórico já está completo! Nenhum jogo novo.', 'info');
    return { liga: codigoLiga, novos: 0, total: dadosExist?.jogos?.length || 0, falhas: 0 };
  }

  // ── Passo 3: Scrape de cada jogo novo ──
  // AUTO-RESTART: reinicia o browser a cada LOTE_SIZE jogos para evitar
  // memory leak / "Protocol error: Connection closed" do Puppeteer
  const LOTE_SIZE = 35;
  console.log('\n  ── Extraindo dados de cada jogo ──');
  console.log(`  ⚙️  Auto-restart do browser a cada ${LOTE_SIZE} jogos (anti-crash)`);
  const jogosNovos = [];
  const timesNovos = new Set(times.map(t => t.nome));
  let falhas = 0;
  let jogosDesdeRestart = 0;

  for (let i = 0; i < idsNovos.length; i++) {
    // ── AUTO-RESTART: fechar e reabrir browser a cada LOTE_SIZE jogos ──
    if (jogosDesdeRestart >= LOTE_SIZE) {
      console.log(`\n  🔄 Auto-restart do browser (${jogosDesdeRestart} jogos no lote)...`);
      try { await browser.close(); } catch (_) {}
      await delay(3000);
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
      });
      fantasma.browser = browser;
      jogosDesdeRestart = 0;
      console.log(`  ✅ Browser reiniciado com sucesso\n`);
    }

    const matchId = idsNovos[i];
    const url     = `https://www.flashscore.com/match/${matchId}/#/match-summary`;
    console.log(`\n  [${i + 1}/${idsNovos.length}] ${progressBar(i + 1, idsNovos.length)}`);

    let partida = null;
    for (let t = 0; t < 3; t++) {
      try {
        partida = await fantasma.extrairPartida(url, {
          liga:        liga.nome,
          codigo_liga: codigoLiga
        });
        if (partida?.estatisticas_ft?.cantos) {
          const c = partida.estatisticas_ft.cantos;
          console.log(`  ✅ ${partida.mandante} vs ${partida.visitante} | Cantos: ${c.m}-${c.v}`);
          break;
        } else {
          throw new Error('Cantos não extraídos');
        }
      } catch (e) {
        if (t < 2) {
          console.log(`  ⚠️  Retry ${t + 1}/3: ${e.message}`);
          // Se o erro é de conexão, reiniciar browser imediatamente
          if (e.message.includes('Protocol error') || e.message.includes('Connection closed') || e.message.includes('Target closed') || e.message.includes('Session closed')) {
            console.log(`  🔄 Crash detectado — reiniciando browser...`);
            try { await browser.close(); } catch (_) {}
            await delay(5000);
            browser = await puppeteer.launch({
              headless: false,
              args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
            });
            fantasma.browser = browser;
            jogosDesdeRestart = 0;
            console.log(`  ✅ Browser recuperado`);
          }
          await delay(5000 * (t + 1));
        } else {
          console.log(`  ❌ Falha definitiva: ${e.message}`);
          falhas++;
          partida = null;
        }
      }
    }

    jogosDesdeRestart++;
    if (!partida) continue;

    // Deduplicação por nome (caso match_id não tenha sido capturado)
    const chave = `${partida.mandante}||${partida.visitante}`;
    if (nomesJaExist.has(chave)) {
      console.log(`  ⏭️  Duplicata por nome — pulando`);
      continue;
    }

    const jogoHist = fantasmaParaHistorico(partida, tabelaPosicoes);
    if (jogoHist) {
      jogoHist.match_id = matchId;
      jogosNovos.push(jogoHist);
      nomesJaExist.add(chave);
    }

    await delay(4000, 1500);
  }

  // ── Passo 4: Mesclar, inferir rodadas, ordenar e salvar ──
  console.log('');
  log('Mesclando com histórico existente...', 'info');

  const todosJogos = [
    ...(dadosExist?.jogos || []),
    ...jogosNovos
  ];

  // Inferir rodadas por data (do mais antigo ao mais recente)
  const jogosComRodada = inferirRodadas(todosJogos);
  const maxRodada      = Math.max(...jogosComRodada.map(j => j.rodada || 0), 0);

  const todosOsTimes = [...new Set([
    ...(dadosExist?.times || []),
    ...Array.from(timesNovos)
  ])].sort();

  const dadosFinais = {
    temporada:          dadosExist?.temporada || liga.nome,
    ultimaAtualizacao:  new Date().toISOString().split('T')[0],
    totalRodadas:       maxRodada,
    times:              todosOsTimes,
    jogos:              jogosComRodada
  };

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 RESULTADO FINAL — ${liga.nome}`);
  console.log(`   Jogos novos adicionados: ${jogosNovos.length}`);
  console.log(`   Falhas:                  ${falhas}`);
  console.log(`   Total no histórico:      ${jogosComRodada.length}`);
  console.log(`   Times registrados:       ${todosOsTimes.length}`);
  console.log(`   Rodadas detectadas:      ${maxRodada}`);
  console.log('═══════════════════════════════════════════════════════════');

  if (!dryRun) {
    const salvos = salvarHistorico(liga, dadosFinais);
    console.log(`   Arquivos atualizados:    ${salvos}`);
  } else {
    log('DRY-RUN: nenhum arquivo foi salvo.', 'info');
  }

  return {
    liga: codigoLiga,
    novos: jogosNovos.length,
    total: jogosComRodada.length,
    times: todosOsTimes.length,
    falhas,
    _browser: browser  // referência atualizada (pode ter sido reiniciado)
  };
}

// ═══════════════════════════════════════════════════
//  CLI
// ═══════════════════════════════════════════════════
(async () => {
  const args      = process.argv.slice(2);
  const dryRun    = args.includes('--dry-run');
  const todasFlag = args.includes('--todas');

  let temporada = String(new Date().getFullYear());
  if (args.includes('--temporada')) {
    temporada = args[args.indexOf('--temporada') + 1] || temporada;
  }

  let ligasParaVarrer = [];
  if (todasFlag) {
    ligasParaVarrer = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const codigo = (args[args.indexOf('--liga') + 1] || '').toUpperCase();
    if (LIGAS[codigo]) {
      ligasParaVarrer = [codigo];
    } else {
      console.log(`Liga inválida: "${codigo}". Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('Uso:');
    console.log('  node varredor-por-time.js --liga ARG');
    console.log('  node varredor-por-time.js --liga ARG --dry-run');
    console.log('  node varredor-por-time.js --todas');
    process.exit(0);
  }

  console.log('');
  console.log('╔═════════════════════════════════════════════════════════╗');
  console.log('║   👻 ANALISTA FANTASMA v5 — VARREDOR POR TIME           ║');
  console.log('║   Histórico completo via tabela de classificação        ║');
  console.log('╚═════════════════════════════════════════════════════════╝');
  console.log(`   Ligas:     ${ligasParaVarrer.join(', ')}`);
  console.log(`   Temporada: ${temporada}`);
  console.log(`   Dry-run:   ${dryRun}`);

  let browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  const resumo = [];
  for (const codigoLiga of ligasParaVarrer) {
    try {
      const resultado = await varrerPorTime(codigoLiga, browser, { dryRun, temporada });
      if (resultado) {
        resumo.push(resultado);
        // Atualizar referência do browser (pode ter sido reiniciado dentro da função)
        if (resultado._browser) browser = resultado._browser;
      }
    } catch (err) {
      log(`Erro fatal em ${codigoLiga}: ${err.message}`, 'error');
      console.error(err);
      // Tentar recuperar o browser após erro fatal
      try { await browser.close(); } catch (_) {}
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
      });
    }
    if (ligasParaVarrer.indexOf(codigoLiga) < ligasParaVarrer.length - 1) {
      log('Pausa de 20s entre ligas...', 'info');
      await delay(20000, 3000);
    }
  }

  try { await browser.close(); } catch (_) {}

  if (resumo.length > 1) {
    console.log('\n╔════════════════════════════════════╗');
    console.log('║   RESUMO GERAL                     ║');
    console.log('╚════════════════════════════════════╝');
    resumo.forEach(r => {
      console.log(`  ${r.liga}: +${r.novos} novos | total: ${r.total} | times: ${r.times} | falhas: ${r.falhas}`);
    });
  }

  console.log('\n🏁 Concluído!');
})();
