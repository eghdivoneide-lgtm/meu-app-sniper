/**
 * Debug profundo dos headers na página de results de team.
 * Lista TODOS os atributos HTML, links internos e estrutura.
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

  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 1500));
  }

  const result = await page.evaluate(() => {
    // Procurar TODOS os elementos com classes que contenham "header" ou "league"
    const todos = document.querySelectorAll('*');
    const candidatos = [];
    todos.forEach(el => {
      const cls = (el.className && typeof el.className === 'string') ? el.className : '';
      if (!cls) return;
      if (/header|league|event__title|wcl-headerLeague/i.test(cls)) {
        const txt = (el.innerText || '').replace(/\s+/g, ' ').trim().substring(0, 80);
        const href = el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '';
        if (txt && txt.length > 0) {
          candidatos.push({ tag: el.tagName, cls: cls.substring(0, 60), txt, href });
        }
      }
    });
    // Dedup
    const seen = new Set();
    return candidatos.filter(c => {
      const k = c.tag + c.cls + c.txt;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 30);
  });

  console.log('🔎 Elementos com "header"/"league" no className:\n');
  result.forEach(r => {
    console.log(`   <${r.tag} class="${r.cls}">`);
    console.log(`      texto: "${r.txt}"`);
    if (r.href) console.log(`      href:  "${r.href}"`);
    console.log('');
  });

  // Verificar se tem .event__match na página
  const totalMatches = await page.evaluate(() => document.querySelectorAll('.event__match').length);
  console.log(`\n📊 Total de .event__match na página: ${totalMatches}`);

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
