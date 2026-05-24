/**
 * Descobre URLs reais do FlashScore para Japão e China (revalidação).
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function listarLigas(page, url) {
  console.log(`\n📡 ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await new Promise(r => setTimeout(r, 4000));
  try {
    const btn = await page.$('button#onetrust-accept-btn-handler, button.fc-cta-consent');
    if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 1000)); }
  } catch (_) {}

  const ligas = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/football/"]'));
    const seen = new Set();
    const out = [];
    links.forEach(a => {
      const href = a.href || '';
      const txt = (a.innerText || '').trim();
      if (!href || !txt || txt.length > 60) return;
      const m = href.match(/\/football\/([^\/]+)\/([^\/?#]+)/);
      if (!m) return;
      const chave = `${m[1]}/${m[2]}`;
      if (seen.has(chave)) return;
      seen.add(chave);
      out.push({ pais: m[1], slug: m[2], texto: txt });
    });
    return out;
  });

  ligas.forEach(l => {
    if (l.pais === 'japan' || l.pais === 'china') {
      console.log(`   • ${l.texto.padEnd(45)} → ${l.pais}/${l.slug}`);
    }
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();

  console.log('═══ JAPAN ═══');
  await listarLigas(page, 'https://www.flashscore.com/football/japan/');

  console.log('\n═══ CHINA ═══');
  await listarLigas(page, 'https://www.flashscore.com/football/china/');

  await browser.close();
  console.log('\n🏁 Fim.');
})().catch(e => { console.error(e.message); process.exit(1); });
