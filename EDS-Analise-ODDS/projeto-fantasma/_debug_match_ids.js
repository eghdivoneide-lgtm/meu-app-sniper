/**
 * Inspeciona IDs dos .event__match na página de team results.
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();

  await page.goto('https://www.flashscore.com/team/vila-nova-fc/Y3E1Lrj3/results/', { waitUntil: 'domcontentloaded', timeout: 40000 });
  await new Promise(r => setTimeout(r, 5000));
  try {
    const btn = await page.$('button#onetrust-accept-btn-handler');
    if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 1000)); }
  } catch (_) {}

  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 1500));
  }

  // Replicar a lógica do varredor passo a passo
  const result = await page.evaluate((filtros) => {
    const seletoresHeader = [
      '.event__header',
      '.wclLeagueHeader',
      '[class*="leagueHeader"]',
      '[class*="tournamentHeader"]',
      '.headerLeague__wrapper',
      '.headerLeague__body',
      '[class*="headerLeague"]'
    ];

    const todosEls = document.querySelectorAll(
      seletoresHeader.join(', ') + ', .event__match, .event__match--static'
    );

    const trace = [];
    let competicaoAtiva = filtros.length === 0;

    todosEls.forEach((el, i) => {
      if (i > 30) return; // só os 30 primeiros
      const isHeader = seletoresHeader.some(sel => el.matches(sel));
      const id = el.getAttribute('id') || '';
      const cls = (el.className && typeof el.className === 'string') ? el.className.substring(0, 50) : '';
      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim().substring(0, 50);

      if (isHeader) {
        const tHdr = (el.innerText || '').toLowerCase();
        const novoEstado = filtros.length === 0 ? true : filtros.some(f => tHdr.includes(f.toLowerCase()));
        competicaoAtiva = novoEstado;
        trace.push({ tipo: 'HDR', id, cls, txt, ativo: novoEstado });
      } else {
        // É .event__match
        const temG1 = id.includes('g_1_');
        trace.push({ tipo: 'JOG', id, cls, txt, temG1, competicaoAtiva });
      }
    });
    return { trace, totalEls: todosEls.length };
  }, ['serie b', 'série b']);

  console.log(`\nTotal de elementos pelo seletor combinado: ${result.totalEls}\n`);
  console.log('🔎 Trace dos primeiros 30 elementos:\n');
  result.trace.forEach((e, i) => {
    if (e.tipo === 'HDR') {
      console.log(`[${i}] HDR ${e.ativo ? '✅' : '❌'} | id="${e.id}" | "${e.txt}"`);
    } else {
      console.log(`[${i}] JOG (compAtv:${e.competicaoAtiva ? '✅' : '❌'} g_1:${e.temG1 ? '✅' : '❌'}) | id="${e.id}"`);
    }
  });

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
