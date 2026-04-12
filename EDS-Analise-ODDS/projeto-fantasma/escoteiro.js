/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          ESCOTEIRO YAAKEN v1 — EDS Soluções Inteligentes     ║
 * ║      Coletor de DNA dos Times para o YAAKEN Scanner          ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Coleta por liga:                                            ║
 * ║  • Classificação geral: P, V, E, D, GP, GC, Pts             ║
 * ║  • Breakdown CASA: V/E/D + GP/GC em casa                    ║
 * ║  • Breakdown FORA: V/E/D + GP/GC fora                       ║
 * ║  • Forma recente: últimos 5 resultados por time              ║
 * ║  • Perfil calculado: ofensivo/defensivo/equilibrado          ║
 * ║                                                              ║
 * ║  Alimenta: YAAKEN Scanner + Especialista Cantos + App Gols   ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Uso:                                                        ║
 * ║    node escoteiro.js --liga BR                               ║
 * ║    node escoteiro.js --liga MLS                              ║
 * ║    node escoteiro.js --liga ARG                              ║
 * ║    node escoteiro.js --liga USL                              ║
 * ║    node escoteiro.js --todas                                 ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs   = require('fs');
const path = require('path');
const { log } = require('./logger');

// ═══════════════════════════════════════════════════
//  LIGAS SUPORTADAS
// ═══════════════════════════════════════════════════
const LIGAS = {
  BR: {
    nome: 'Brasileirão Série A',
    url_standings: 'https://www.flashscore.com/football/brazil/serie-a-betano/standings/',
    url_results:   'https://www.flashscore.com/football/brazil/serie-a-betano/results/',
    times: 20
  },
  MLS: {
    nome: 'Major League Soccer',
    url_standings: 'https://www.flashscore.com/football/usa/mls/standings/',
    url_results:   'https://www.flashscore.com/football/usa/mls/results/',
    times: 30
  },
  ARG: {
    nome: 'Liga Profesional Argentina',
    url_standings: 'https://www.flashscore.com/football/argentina/liga-profesional/standings/',
    url_results:   'https://www.flashscore.com/football/argentina/liga-profesional/results/',
    times: 30
  },
  USL: {
    nome: 'USL Championship',
    url_standings: 'https://www.flashscore.com/football/usa/usl-championship/standings/',
    url_results:   'https://www.flashscore.com/football/usa/usl-championship/results/',
    times: 25
  },
  BUN: {
    nome: 'Bundesliga',
    url_standings: 'https://www.flashscore.com/football/germany/bundesliga/standings/',
    url_results:   'https://www.flashscore.com/football/germany/bundesliga/results/',
    times: 18
  }
};

// ═══════════════════════════════════════════════════
//  UTILITÁRIOS
// ═══════════════════════════════════════════════════
function delayHumano(base, jitter = 1000) {
  const total = base + Math.floor(Math.random() * jitter);
  return new Promise(r => setTimeout(r, total));
}

function dataHoje() {
  return new Date().toISOString().split('T')[0];
}

function calcularPerfil(gp_jogo, gc_jogo) {
  if (gp_jogo >= 1.8 && gc_jogo >= 1.5) return 'CAMISA_ABERTA';   // ataca e sofre
  if (gp_jogo >= 1.8 && gc_jogo < 1.2)  return 'OFENSIVO_SOLIDO'; // ataca e se defende
  if (gp_jogo < 1.0  && gc_jogo < 1.0)  return 'MURO_DUPLO';      // não marca e não sofre
  if (gp_jogo < 1.0  && gc_jogo >= 1.5) return 'VULNERAVEL';       // não marca e sofre
  if (gp_jogo >= 1.5 && gc_jogo < 1.5)  return 'OFENSIVO';
  if (gp_jogo < 1.2  && gc_jogo < 1.2)  return 'DEFENSIVO';
  return 'EQUILIBRADO';
}

function calcularTendenciaEmpate(e_pct, gc_jogo, gp_jogo) {
  // Times com > 30% empates E média de gols baixa = forte candidato a empate
  if (e_pct >= 35 && (gp_jogo + gc_jogo) < 2.5) return 'ALTO';
  if (e_pct >= 25) return 'MEDIO';
  return 'BAIXO';
}

// ═══════════════════════════════════════════════════
//  EXTRAÇÃO DE CLASSIFICAÇÃO (Calibrado com Motor V5)
// ═══════════════════════════════════════════════════
async function extrairClassificacao(page, url) {
  log(`📊 Acessando classificação: ${url}`, 'flashscore');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delayHumano(6000, 2000);

  // Aceitar cookies (padrão V5)
  try {
    const btnCookie = await page.$('button#onetrust-accept-btn-handler, button.fc-cta-consent');
    if (btnCookie) { await btnCookie.click(); await delayHumano(1500); }
  } catch (_) {}

  const dados = await page.evaluate(() => {
    const times = [];

    // ════ ESTRATÉGIA 1: Linhas completas da tabela (padrão V5 — mais robusto) ════
    const linhas = document.querySelectorAll(
      '.tableTeam, .ui-table__row, .standings__row, [class*="table__row"], [class*="tableRow"]'
    );

    linhas.forEach((linha, idx) => {
      // Pula headers
      if (linha.classList.contains('ui-table__header') ||
          linha.classList.contains('table__header')) return;

      // Nome do time — múltiplos seletores (V5 pattern)
      const nomeEl = linha.querySelector(
        '.tableCellParticipant__name, a[href*="/team/"], .standings__cell--name a, [class*="participant"] a, [class*="teamName"], .team__name'
      );
      if (!nomeEl) return;
      const nome = (nomeEl.textContent || nomeEl.innerText || '').trim();
      if (!nome || nome.length < 2) return;

      // Posição — rank cell ou índice
      const posEl = linha.querySelector(
        '.table__cell--rank, .standings__cell--rank, [class*="rank"], [class*="position"]'
      );
      const pos = posEl ? parseInt(posEl.innerText?.trim()) : (idx + 1);

      // Células numéricas — aceita qualquer quantidade (flexível vs V1 que exigia 8+)
      const cells = linha.querySelectorAll(
        '.ui-table__cell, .table__cell, [class*="table__cell"], [class*="tableCell"], td'
      );
      const nums = [];
      cells.forEach(c => {
        const txt = (c.textContent || '').trim();
        // Aceita números, incluindo negativos (saldo de gols) e com : (formato GP:GC)
        if (/^-?\d+$/.test(txt)) nums.push(parseInt(txt));
      });

      // Pontos — busca específica
      const ptsCandidatos = linha.querySelectorAll(
        '.table__cell--points, [class*="pts"], [class*="points"]'
      );
      let pontos = null;
      ptsCandidatos.forEach(el => {
        const v = parseInt(el.innerText?.trim());
        if (!isNaN(v)) pontos = v;
      });

      // Monta dados — aceita com mínimo de 5 números (V1 exigia 7, muito rígido)
      if (nums.length >= 5) {
        // Tenta J, V, E, D, GP, GC, Pts dos últimos 7
        if (nums.length >= 7) {
          const [j, v, e, d, gp, gc, pts2] = nums.slice(-7);
          if (!times.find(t => t.nome === nome)) {
            times.push({ pos: isNaN(pos) ? (idx+1) : pos, nome, j, v, e, d, gp, gc, pts: pontos || pts2 });
          }
        } else {
          // Fallback: usa o que tem
          const [j, v, e, d, pts2] = nums.slice(-5);
          if (!times.find(t => t.nome === nome)) {
            times.push({ pos: isNaN(pos) ? (idx+1) : pos, nome, j: j||0, v: v||0, e: e||0, d: d||0, gp: 0, gc: 0, pts: pontos || pts2 || 0 });
          }
        }
      } else if (nums.length > 0) {
        // Fallback mínimo — só tem posição e/ou pontos
        if (!times.find(t => t.nome === nome)) {
          times.push({ pos: isNaN(pos) ? (idx+1) : pos, nome, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: pontos || nums[nums.length-1] || 0 });
        }
      }
    });

    // ════ ESTRATÉGIA 2: Fallback por links de participantes (padrão V5) ════
    if (times.length === 0) {
      const seletores = [
        '.tableCellParticipant__name',
        '.table__cell--participantStandingsLink',
        '.standings__cell--name a',
        '[class*="participant"] a',
        '.team_name_span',
        'a[href*="/team/"]'
      ];
      for (const sel of seletores) {
        const els = document.querySelectorAll(sel);
        if (els.length >= 5) {
          els.forEach((el, i) => {
            const nome = (el.textContent || el.innerText || '').trim();
            if (nome && nome.length >= 2 && !times.find(t => t.nome === nome)) {
              times.push({ pos: i+1, nome, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 });
            }
          });
          break;
        }
      }
    }

    // ════ ESTRATÉGIA 3: Fallback por innerText bruto (último recurso) ════
    if (times.length === 0) {
      const texto = document.body.innerText;
      const linhasTexto = texto.split('\n').map(l => l.trim()).filter(l => l);
      // Procura padrão: "1. NomeTime  28  16  5  7  52  34  53"
      const regex = /^(\d+)\.\s+(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
      linhasTexto.forEach(l => {
        const match = l.match(regex);
        if (match) {
          const [, pos, nome, j, v, e, d, gp, gc, pts] = match;
          if (!times.find(t => t.nome === nome.trim())) {
            times.push({
              pos: parseInt(pos), nome: nome.trim(),
              j: parseInt(j), v: parseInt(v), e: parseInt(e), d: parseInt(d),
              gp: parseInt(gp), gc: parseInt(gc), pts: parseInt(pts)
            });
          }
        }
      });
    }

    return times;
  });

  log(`Classificação: ${dados.length} times extraídos`, 'info');
  return dados;
}

// ═══════════════════════════════════════════════════
//  EXTRAÇÃO DE RESULTADOS → FORMA + GOLS POR JOGO
//  Com scroll automático para carregar toda temporada
// ═══════════════════════════════════════════════════
async function extrairResultados(page, url, maxJogos = 300) {
  log(`📋 Acessando resultados: ${url}`, 'flashscore');

  // Carrega página com retry
  let carregou = false;
  for (let tentativa = 0; tentativa < 3 && !carregou; tentativa++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      carregou = true;
    } catch (e) {
      log(`  ⚠️ Timeout na página de resultados (tentativa ${tentativa+1}/3)`, 'error');
      if (tentativa < 2) await delayHumano(5000);
    }
  }
  if (!carregou) { log('Falha ao carregar resultados', 'error'); return []; }

  await delayHumano(4000, 1000);

  // ── Scroll automático para carregar todos os jogos da temporada ──
  // BUN tem ~261 jogos, ARG ~180 — precisamos de mais iterações
  log('  📜 Scrolling completo para carregar toda a temporada...', 'info');
  let anteriorTotal = 0;
  let rodadasSemNovo = 0;
  const MAX_VOLTAS = 80;   // aumentado: BUN precisa de ~45+ scrolls
  const MAX_SEM_NOVO = 6;  // aumentado: aguenta carregamentos lentos

  for (let volta = 0; volta < MAX_VOLTAS; volta++) {
    // Conta jogos atuais na página
    const totalAtual = await page.evaluate(() =>
      document.querySelectorAll('.event__match').length
    );

    if (totalAtual >= maxJogos) {
      log(`  ✅ Limite de ${maxJogos} jogos atingido (${totalAtual} carregados)`, 'info');
      break;
    }

    if (totalAtual === anteriorTotal) {
      rodadasSemNovo++;
      if (rodadasSemNovo >= MAX_SEM_NOVO) {
        log(`  ✅ Fim da página — ${totalAtual} jogos carregados (${volta} scrolls)`, 'info');
        break;
      }
    } else {
      rodadasSemNovo = 0;
      if (volta % 5 === 0 || totalAtual - anteriorTotal > 10) {
        log(`  📄 Scroll ${volta}: ${totalAtual} jogos carregados...`, 'info');
      }
    }

    anteriorTotal = totalAtual;

    // Clica no botão "Mostrar mais" se existir (FlashScore às vezes usa botão)
    const clicou = await page.evaluate(() => {
      const btn = document.querySelector(
        'a.event__more, button[class*="more"], [class*="showMore"], ' +
        'a[class*="more-results"], .show-more__btn, [data-testid*="more"]'
      );
      if (btn) {
        btn.scrollIntoView();
        btn.click();
        return true;
      }
      return false;
    });

    // Se não há botão, scroll progressivo até o fim da página
    if (!clicou) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 3);
      });
    }

    // Delay menor para não demorar demais, mas respeitoso com o servidor
    await delayHumano(1800, 500);
  }

  // ── Extrai todos os jogos carregados ──
  const totalFinal = await page.evaluate(() =>
    document.querySelectorAll('.event__match').length
  );
  log(`  📊 Extraindo ${Math.min(totalFinal, maxJogos)} jogos...`, 'info');

  const jogos = await page.evaluate((limite) => {
    const resultado = [];
    const matches = document.querySelectorAll('.event__match');

    for (let i = 0; i < Math.min(matches.length, limite); i++) {
      const m = matches[i];

      const homeEl = m.querySelector('.event__participant--home, .event__homeParticipant');
      const awayEl = m.querySelector('.event__participant--away, .event__awayParticipant');
      if (!homeEl || !awayEl) continue;

      const mandante  = homeEl.textContent.trim().replace(/\s+/g, ' ');
      const visitante = awayEl.textContent.trim().replace(/\s+/g, ' ');

      const scoreHome = m.querySelector('.event__score--home, [class*="score--home"]');
      const scoreAway = m.querySelector('.event__score--away, [class*="score--away"]');
      if (!scoreHome || !scoreAway) continue;

      const gh = parseInt(scoreHome.textContent.trim());
      const ga = parseInt(scoreAway.textContent.trim());
      if (isNaN(gh) || isNaN(ga)) continue;

      let resultado_jogo = 'E';
      if (gh > ga) resultado_jogo = 'V_CASA';
      if (ga > gh) resultado_jogo = 'V_FORA';

      resultado.push({ mandante, visitante, gh, ga, resultado: resultado_jogo });
    }
    return resultado;
  }, maxJogos);

  log(`✅ Resultados extraídos: ${jogos.length} jogos`, 'info');
  return jogos;
}

// ═══════════════════════════════════════════════════
//  CONSTRUIR PERFIS POR TIME
// ═══════════════════════════════════════════════════
function construirPerfis(classificacao, resultados) {
  const perfis = {};

  // Inicializa com dados da classificação
  classificacao.forEach(t => {
    if (!t.nome) return;
    const j = t.j || 1;
    perfis[t.nome] = {
      nome:      t.nome,
      posicao:   t.pos,
      jogos:     j,
      pontos:    t.pts,
      // Geral
      geral: {
        v: t.v, e: t.e, d: t.d,
        v_pct: Math.round((t.v / j) * 100),
        e_pct: Math.round((t.e / j) * 100),
        d_pct: Math.round((t.d / j) * 100),
        gp: t.gp, gc: t.gc,
        gp_jogo: parseFloat((t.gp / j).toFixed(2)),
        gc_jogo: parseFloat((t.gc / j).toFixed(2)),
        saldo: t.gp - t.gc
      },
      // Casa e fora serão preenchidos pelos resultados
      casa:  { v: 0, e: 0, d: 0, j: 0, gp: 0, gc: 0 },
      fora:  { v: 0, e: 0, d: 0, j: 0, gp: 0, gc: 0 },
      forma_recente:    [],  // últimos 5 (V/E/D) — geral
      historico_geral:  [],  // últimos 5 jogos: { adversario, resultado, gp, gc, mando }
      historico_casa:   [],  // últimos 5 em casa: { adversario, resultado, gp, gc }
      historico_fora:   [],  // últimos 5 fora:    { adversario, resultado, gp, gc }
      perfil: '',
      tendencia_empate: '',
      notas_yaaken: []
    };
  });

  // Processa resultados → casa/fora + forma
  resultados.forEach(jogo => {
    const { mandante, visitante, gh, ga, resultado } = jogo;

    // Mandante
    if (perfis[mandante]) {
      const c = perfis[mandante].casa;
      c.j++;
      c.gp += gh;
      c.gc += ga;
      if (resultado === 'V_CASA') c.v++;
      else if (resultado === 'E')  c.e++;
      else                         c.d++;

      const resM = resultado === 'V_CASA' ? 'V' : resultado === 'E' ? 'E' : 'D';
      if (perfis[mandante].forma_recente.length < 5) {
        perfis[mandante].forma_recente.push(resM);
      }
      if (perfis[mandante].historico_geral.length < 5) {
        perfis[mandante].historico_geral.push({ adversario: visitante, resultado: resM, gp: gh, gc: ga, mando: 'C' });
      }
      if (perfis[mandante].historico_casa.length < 5) {
        perfis[mandante].historico_casa.push({ adversario: visitante, resultado: resM, gp: gh, gc: ga });
      }
    }

    // Visitante
    if (perfis[visitante]) {
      const f = perfis[visitante].fora;
      f.j++;
      f.gp += ga;
      f.gc += gh;
      if (resultado === 'V_FORA') f.v++;
      else if (resultado === 'E')  f.e++;
      else                         f.d++;

      const resV = resultado === 'V_FORA' ? 'V' : resultado === 'E' ? 'E' : 'D';
      if (perfis[visitante].forma_recente.length < 5) {
        perfis[visitante].forma_recente.push(resV);
      }
      if (perfis[visitante].historico_geral.length < 5) {
        perfis[visitante].historico_geral.push({ adversario: mandante, resultado: resV, gp: ga, gc: gh, mando: 'F' });
      }
      if (perfis[visitante].historico_fora.length < 5) {
        perfis[visitante].historico_fora.push({ adversario: mandante, resultado: resV, gp: ga, gc: gh });
      }
    }
  });

  // Calcula médias casa/fora e perfis
  Object.values(perfis).forEach(t => {
    const c = t.casa;
    const f = t.fora;

    if (c.j > 0) {
      c.gp_jogo    = parseFloat((c.gp / c.j).toFixed(2));
      c.gc_jogo    = parseFloat((c.gc / c.j).toFixed(2));
      c.v_pct      = Math.round((c.v / c.j) * 100);
      c.e_pct      = Math.round((c.e / c.j) * 100);
      c.d_pct      = Math.round((c.d / c.j) * 100);
      c.media_gols = parseFloat(((c.gp + c.gc) / c.j).toFixed(2));
    }

    if (f.j > 0) {
      f.gp_jogo    = parseFloat((f.gp / f.j).toFixed(2));
      f.gc_jogo    = parseFloat((f.gc / f.j).toFixed(2));
      f.v_pct      = Math.round((f.v / f.j) * 100);
      f.e_pct      = Math.round((f.e / f.j) * 100);
      f.d_pct      = Math.round((f.d / f.j) * 100);
      f.media_gols = parseFloat(((f.gp + f.gc) / f.j).toFixed(2));
    }

    // ── GERAL: recalcula sempre a partir de casa + fora (mais confiável que standings) ──
    const total_j = c.j + f.j;
    if (total_j > 0) {
      const v  = c.v  + f.v;
      const e  = c.e  + f.e;
      const d  = c.d  + f.d;
      const gp = c.gp + f.gp;
      const gc = c.gc + f.gc;
      t.geral = {
        v, e, d, j: total_j,
        v_pct:   Math.round((v  / total_j) * 100),
        e_pct:   Math.round((e  / total_j) * 100),
        d_pct:   Math.round((d  / total_j) * 100),
        gp, gc,
        gp_jogo: parseFloat((gp / total_j).toFixed(2)),
        gc_jogo: parseFloat((gc / total_j).toFixed(2)),
        saldo:   gp - gc,
        media_gols_jogo: parseFloat(((gp + gc) / total_j).toFixed(2))
      };
      // Atualiza jogos e pontos calculados (3V + 1E)
      t.jogos  = total_j;
      if (!t.pontos || t.pontos === 0) t.pontos = v * 3 + e;
    }

    // ── A partir daqui usa geral recalculado ──
    const g = t.geral;
    if (!g || g.j === 0) return; // sem dados suficientes, pula

    // Perfil geral
    t.perfil           = calcularPerfil(g.gp_jogo, g.gc_jogo);
    t.tendencia_empate = calcularTendenciaEmpate(g.e_pct, g.gc_jogo, g.gp_jogo);

    // Notas YAAKEN automáticas
    const notas = [];

    if (g.e_pct >= 35) notas.push(`⚖️ Empata muito (${g.e_pct}% dos jogos) — empate tem valor`);
    if (c.v_pct >= 60) notas.push(`🏠 Forte em casa (${c.v_pct}% vitórias)`);
    if (f.v_pct >= 50) notas.push(`✈️ Surpreende fora (${f.v_pct}% vitórias fora)`);
    if (f.d_pct >= 60) notas.push(`⚠️ Perda fora alta (${f.d_pct}%) — evitar como visitante`);
    if (c.d_pct >= 50) notas.push(`🚨 Perde em casa (${c.d_pct}%) — zebra visitante tem valor`);
    if (g.gp_jogo >= 2.0) notas.push(`⚽ Muito ofensivo (${g.gp_jogo} gols/jogo)`);
    if (g.gc_jogo >= 2.0) notas.push(`🔓 Defesa frágil (${g.gc_jogo} sofridos/jogo)`);
    if (g.gp_jogo < 0.8)  notas.push(`🧱 Ataque fraco (${g.gp_jogo} gols/jogo)`);

    // Forma recente
    const vitorias_recentes = t.forma_recente.filter(r => r === 'V').length;
    const derrotas_recentes = t.forma_recente.filter(r => r === 'D').length;
    if (vitorias_recentes >= 4) notas.push(`🔥 Em chama! ${vitorias_recentes}/5 vitórias recentes`);
    if (derrotas_recentes >= 3) notas.push(`❄️ Crise! ${derrotas_recentes}/5 derrotas recentes`);

    t.notas_yaaken = notas;
  });

  return perfis;
}

// ═══════════════════════════════════════════════════
//  VARREDURA PRINCIPAL DE UMA LIGA
// ═══════════════════════════════════════════════════
async function escotarLiga(codigoLiga, browser) {
  const liga = LIGAS[codigoLiga];
  if (!liga) {
    log(`Liga "${codigoLiga}" não encontrada. Disponíveis: ${Object.keys(LIGAS).join(', ')}`, 'error');
    return null;
  }

  const inicio = Date.now();
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log(`║  🔭 ESCOTEIRO YAAKEN — ${liga.nome.padEnd(18)} ║`);
  console.log('╚══════════════════════════════════════════╝');

  const page = await browser.newPage();

  // ── 1. Classificação geral ──
  console.log('\n📊 Passo 1/3 — Classificação geral...');
  const classificacao = await extrairClassificacao(page, liga.url_standings);

  if (classificacao.length === 0) {
    log('Nenhum dado de classificação extraído. Abortando.', 'error');
    await page.close();
    return null;
  }

  // ── 2. Resultados da temporada completa (scroll automático) ──
  console.log('\n📋 Passo 2/3 — Resultados da temporada (scroll completo)...');
  const resultados = await extrairResultados(page, liga.url_results, 500);
  await delayHumano(2000, 500);

  // ── 3. Montar perfis ──
  console.log('\n🧬 Passo 3/3 — Construindo perfis DNA dos times...');
  const perfis = construirPerfis(classificacao, resultados);

  await page.close();

  const duracao = Math.round((Date.now() - inicio) / 1000);

  // ── Output ──
  const output = {
    meta: {
      liga:            codigoLiga,
      nome_liga:       liga.nome,
      data_coleta:     dataHoje(),
      total_times:     Object.keys(perfis).length,
      jogos_analisados: resultados.length,
      duracao_segundos: duracao,
      agente:          'Escoteiro YAAKEN v1'
    },
    perfis
  };

  // Salvar JSON
  const outputDir = path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'escoteiro');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filename = `escoteiro_${codigoLiga}_${dataHoje()}.json`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));

  console.log('');
  console.log('══════════════════════════════════════════');
  console.log(`✅ ${liga.nome} concluído em ${duracao}s`);
  console.log(`📁 Times: ${Object.keys(perfis).length} | Jogos analisados: ${resultados.length}`);
  console.log(`💾 Salvo: ${filename}`);
  console.log('══════════════════════════════════════════');

  // Preview dos top 5 na classificação
  console.log('\n🏆 Preview — Top 5 com notas YAAKEN:');
  Object.values(perfis)
    .sort((a, b) => a.posicao - b.posicao)
    .slice(0, 5)
    .forEach(t => {
      const g = t.geral;
      console.log(`  ${String(t.posicao).padStart(2)}. ${t.nome.padEnd(22)} | V${g.v} E${g.e} D${g.d} | GP:${g.gp} GC:${g.gc} | ${t.perfil}`);
      if (t.notas_yaaken.length > 0) {
        console.log(`     → ${t.notas_yaaken[0]}`);
      }
    });

  return { liga: codigoLiga, times: Object.keys(perfis).length, jogos: resultados.length, duracao, arquivo: filename };
}

// ═══════════════════════════════════════════════════
//  CLI
// ═══════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  let ligasParaEscotar = [];

  if (args.includes('--todas')) {
    ligasParaEscotar = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const idx = args.indexOf('--liga');
    const codigo = (args[idx + 1] || '').toUpperCase();
    if (LIGAS[codigo]) {
      ligasParaEscotar = [codigo];
    } else {
      console.log(`Liga inválida: "${args[idx + 1]}". Disponíveis: ${Object.keys(LIGAS).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('Uso:');
    console.log('  node escoteiro.js --liga BR');
    console.log('  node escoteiro.js --todas');
    process.exit(0);
  }

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   🔭 ESCOTEIRO YAAKEN v1 — EDS Soluções          ║');
  console.log('║   DNA dos Times: V/E/D · Gols · Forma · Perfil   ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`Ligas: ${ligasParaEscotar.join(', ')}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  const resumo = [];

  for (const codigoLiga of ligasParaEscotar) {
    try {
      const resultado = await escotarLiga(codigoLiga, browser);
      if (resultado) resumo.push(resultado);
    } catch (err) {
      log(`Erro fatal na liga ${codigoLiga}: ${err.message}`, 'error');
      console.error(err);
    }
    if (ligasParaEscotar.indexOf(codigoLiga) < ligasParaEscotar.length - 1) {
      console.log('\n⏳ Intervalo entre ligas (15s)...');
      await delayHumano(15000, 3000);
    }
  }

  await browser.close();

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   ✅ ESCOTEIRO FINALIZADO                         ║');
  resumo.forEach(r => {
    console.log(`║   ${r.liga}: ${r.times} times | ${r.jogos} jogos | ${r.duracao}s          ║`);
  });
  console.log('╚══════════════════════════════════════════════════╝');

  // ── Auto-enriquecimento: cruzar dados JS + memoria-teacher → historico por time ──
  console.log('\n🔗 Iniciando enriquecimento de dados (adversários + cantos + placar)...');
  const { execSync } = require('child_process');
  const enriquecedor = path.join(__dirname, 'enriquecedor.py');
  if (fs.existsSync(enriquecedor)) {
    try {
      execSync(`python3 "${enriquecedor}"`, { stdio: 'inherit' });
      console.log('✅ Enriquecimento concluído — historico_geral/casa/fora populados');
    } catch (e) {
      console.log('⚠️  Enriquecimento falhou (dados ainda usáveis sem historico):', e.message);
    }
  } else {
    console.log(`⚠️  enriquecedor.py não encontrado em ${enriquecedor}`);
  }
})();