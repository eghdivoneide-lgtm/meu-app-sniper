/**
 * Testa exatamente os seletores do varredor-por-time na página de results.
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

  const url = 'https://www.flashscore.com/team/vila-nova-fc/Y3E1Lrj3/results/';
  console.log(`📡 ${url}\n`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await new Promise(r => setTimeout(r, 5000));

  try {
    const btn = await page.$('button#onetrust-accept-btn-handler');
    if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 1000)); }
  } catch (_) {}

  // Click "show more" se existir, e scroll
  for (let i = 0; i < 5; i++) {
    try {
      const btn = await page.$('a.event__more, button.event__more');
      if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 2000)); }
    } catch (_) {}
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 1500));
  }

  // Replicar EXATAMENTE o seletor do varredor-por-time
  const result = await page.evaluate(() => {
    const seletoresHeader = [
      '.event__header',
      '.wclLeagueHeader',
      '[class*="leagueHeader"]',
      '[class*="tournamentHeader"]'
    ];
    const headers = [];
    seletoresHeader.forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach(el => {
        const txt = (el.innerText || '').replace(/\n+/g, ' | ').trim();
        if (txt && !headers.find(h => h.txt === txt)) {
          headers.push({ seletor: sel, classe: el.className?.substring(0, 80), txt });
        }
      });
    });
    return headers;
  });

  console.log('🏷️  HEADERS encontrados pelos seletores do varredor:\n');
  if (result.length === 0) {
    console.log('   ❌ Nada encontrado pelos seletores oficiais.');
  } else {
    result.forEach(h => {
      console.log(`   [${h.seletor}] (class: "${h.classe}")`);
      console.log(`     "${h.txt}"\n`);
    });
  }

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
