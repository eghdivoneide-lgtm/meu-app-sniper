/**
 * Script ad-hoc — Buscar Ferro × Almirante Brown (Primera Nacional 2026)
 * Faltou no varredor-rodada porque está fora da janela de 20 jogos.
 *
 * Estratégia:
 *   1. Listar os ~50 jogos mais recentes em /results/
 *   2. Procurar match com (Ferro AND Almirante Brown) nos nomes dos times
 *   3. Se encontrar, extrair via FlashscoreMonster
 *   4. Se não, checar /fixtures/ (talvez ainda não tenha jogado)
 *   5. Salvar em arg_b_ferro_almirante_2026-04-28.json
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');
const { log } = require('./logger');

const URL_RESULTS  = 'https://www.flashscore.com/football/argentina/primera-nacional/results/';
const URL_FIXTURES = 'https://www.flashscore.com/football/argentina/primera-nacional/fixtures/';
const OUT_FILE = path.join(__dirname, 'arg_b_ferro_almirante_2026-04-28.json');

function delay(ms, jit = 800) {
  return new Promise(r => setTimeout(r, ms + Math.floor(Math.random() * jit)));
}

async function listarJogos(browser, url, limite = 80) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await delay(5000, 2000);
  try { await page.waitForSelector('.event__match', { timeout: 20000 }); } catch (_) {}

  // Tentar clicar em "Show more matches" algumas vezes para aumentar o universo
  for (let i = 0; i < 3; i++) {
    try {
      const more = await page.$('a.event__more.event__more--static, .event__more');
      if (more) {
        await more.click();
        await delay(3000, 1000);
      } else break;
    } catch (_) { break; }
  }

  const jogos = await page.evaluate((lim) => {
    const out = [];
    const matches = document.querySelectorAll('.event__match');
    for (let i = 0; i < Math.min(matches.length, lim); i++) {
      const el = matches[i];
      const elId = el.getAttribute('id') || '';
      const id = elId.includes('g_1_') ? elId.replace('g_1_', '') : null;
      const home = el.querySelector('.event__participant--home, .event__homeParticipant')?.textContent?.trim() || '';
      const away = el.querySelector('.event__participant--away, .event__awayParticipant')?.textContent?.trim() || '';
      const data = el.querySelector('.event__time')?.textContent?.trim() || '';
      if (id) out.push({ id, home, away, data });
    }
    return out;
  }, limite);

  await page.close();
  return jogos;
}

function casaFerroAlmirante(home, away) {
  const h = (home || '').toLowerCase();
  const a = (away || '').toLowerCase();
  const temFerro = h.includes('ferro') || a.includes('ferro');
  const temAlmirante = h.includes('almirante') || a.includes('almirante');
  return temFerro && temAlmirante;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  console.log('\n🔎 Buscando Ferro × Almirante Brown na Primera Nacional...\n');

  // 1) Tentar nos results
  console.log('📡 Listando results recentes...');
  const results = await listarJogos(browser, URL_RESULTS, 80);
  console.log(`   ${results.length} jogos listados em /results/`);

  let alvo = results.find(j => casaFerroAlmirante(j.home, j.away));

  // 2) Se não achou, tentar fixtures
  if (!alvo) {
    console.log('\n📡 Não achado em results. Listando fixtures...');
    const fixtures = await listarJogos(browser, URL_FIXTURES, 80);
    console.log(`   ${fixtures.length} jogos listados em /fixtures/`);
    alvo = fixtures.find(j => casaFerroAlmirante(j.home, j.away));
    if (alvo) alvo.__futuro = true;
  }

  if (!alvo) {
    console.log('\n❌ Ferro × Almirante Brown NÃO encontrado em results nem em fixtures.');
    console.log('   Possíveis causas: nomes divergentes (Almirante Brown LDP vs ABP), jogo adiado sem data, ou liga diferente.');
    console.log('\n   Amostra dos primeiros 25 results coletados (pra você conferir):');
    results.slice(0, 25).forEach((j, i) => console.log(`   ${i + 1}. ${j.home} × ${j.away} | ${j.data} | ${j.id}`));
    await browser.close();
    process.exit(2);
  }

  console.log(`\n✅ Encontrado: ${alvo.home} × ${alvo.away} | data: ${alvo.data} | id: ${alvo.id} ${alvo.__futuro ? '(JOGO FUTURO)' : ''}`);

  if (alvo.__futuro) {
    console.log('\n⚠️  Jogo ainda não foi disputado — não há estatísticas para extrair.');
    fs.writeFileSync(OUT_FILE, JSON.stringify({
      status: 'futuro',
      match_id: alvo.id,
      mandante: alvo.home,
      visitante: alvo.away,
      data_partida: alvo.data,
      observacao: 'Jogo da rodada 24-27/abr ainda não disputado quando varredor rodou em 28/04. Quando jogar, rodar varredor-rodada novamente.'
    }, null, 2));
    console.log(`   Salvo em ${OUT_FILE}`);
    await browser.close();
    return;
  }

  // 3) Extrair via FlashscoreMonster
  console.log('\n👻 Extraindo estatísticas...');
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  const url = `https://www.flashscore.com/match/${alvo.id}/#/match-summary`;
  const partida = await fantasma.extrairPartida(url, {
    liga: 'Primera B Nacional (Argentina)',
    codigo_liga: 'ARG_B'
  });

  if (!partida || !partida.estatisticas_ft || !partida.estatisticas_ft.cantos) {
    console.log('❌ Falha na extração de cantos FT. Salvo dados parciais.');
  } else {
    const c = partida.estatisticas_ft.cantos;
    console.log(`✅ ${partida.mandante} × ${partida.visitante} | HT: ${partida.placar?.ht} | FT: ${partida.placar?.ft} | Cantos FT: ${c.m}-${c.v} | Campos: ${partida.meta?.campos_disponiveis}`);
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify([partida], null, 2));
  console.log(`\n💾 Salvo em ${OUT_FILE}`);

  await browser.close();
})().catch(e => {
  console.error('\n💥 Erro fatal:', e);
  process.exit(1);
});
