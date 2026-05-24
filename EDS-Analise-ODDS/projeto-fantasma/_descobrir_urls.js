/**
 * Script ad-hoc — Descobre URLs corretas no FlashScore para:
 *   - Primera B Metropolitana (Argentina)
 *   - China League One
 *   - China League Two
 *
 * Estratégia: abre a página do país (argentina/ e china/) e lista todos os
 * links de competição encontrados. Aí o humano (ou outro script) identifica
 * a URL canônica correta.
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function listarLigasDoPais(page, urlPais) {
  console.log(`\n📡 Abrindo ${urlPais}...`);
  await page.goto(urlPais, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await new Promise(r => setTimeout(r, 4000));

  // Aceitar cookies
  try {
    const btn = await page.$('button#onetrust-accept-btn-handler, button.fc-cta-consent');
    if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 1000)); }
  } catch (_) {}

  const ligas = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/football/"]'));
    const seen = new Set();
    const out = [];
    links.forEach(a => {
      const href = a.href || a.getAttribute('href') || '';
      const txt = (a.innerText || '').trim();
      if (!href || !txt || txt.length > 60) return;
      // Capturar links que parecem de ligas (último segmento > 3 chars + tem -ou contém country)
      const m = href.match(/\/football\/([^\/]+)\/([^\/?#]+)/);
      if (!m) return;
      const chave = `${m[1]}/${m[2]}`;
      if (seen.has(chave)) return;
      seen.add(chave);
      out.push({ pais: m[1], slug: m[2], texto: txt, href: href.split('?')[0] });
    });
    return out;
  });

  console.log(`   ${ligas.length} links de ligas encontrados:\n`);
  ligas.forEach(l => {
    console.log(`   • ${l.texto.padEnd(40)} → ${l.pais}/${l.slug}`);
  });
  return ligas;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();

  console.log('═══════════════════════════════════════════════════');
  console.log('  ARGENTINA — buscando ligas (procuramos B Metropolitana)');
  console.log('═══════════════════════════════════════════════════');
  await listarLigasDoPais(page, 'https://www.flashscore.com/football/argentina/');

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  CHINA — buscando ligas (procuramos League One e Two)');
  console.log('═══════════════════════════════════════════════════');
  await listarLigasDoPais(page, 'https://www.flashscore.com/football/china/');

  await browser.close();
  console.log('\n🏁 Descoberta concluída.');
})().catch(e => {
  console.error('💥 Erro:', e.message);
  process.exit(1);
});
