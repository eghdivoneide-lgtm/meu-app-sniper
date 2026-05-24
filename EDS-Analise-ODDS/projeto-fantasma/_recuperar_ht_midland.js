/**
 * RECUPERADOR HT — Midland x San Martin S.J. (match_id: nTfakQIs)
 * Tenta múltiplas estratégias para extrair o placar HT.
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

const MATCH_ID = 'nTfakQIs';
const RAW = path.join(__dirname, 'arg_b_rodada_2_2026-04-22.json');

function delay(ms, jitter = 500) {
  return new Promise(r => setTimeout(r, ms + Math.floor(Math.random() * jitter)));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Estratégia 1: match-summary principal (placar HT geralmente aparece como "(N-N)" abaixo do FT)
  console.log('Estrategia 1: match-summary principal');
  await page.goto(`https://www.flashscore.com/match/${MATCH_ID}/#/match-summary`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(3500, 500);

  let htPlacar = await page.evaluate(() => {
    // Procurar em containers de placar parcial
    const selectors = [
      '.detailScore__fullTime',
      '.detailScore__status',
      '.smh__part',
      '[class*="partialResult"]',
      '[class*="halftime"]',
      '[class*="halfTime"]'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const m = el.textContent.match(/(\d+)\s*[-:–]\s*(\d+)/);
        if (m) return { src: sel, ht: `${m[1]} - ${m[2]}`, raw: el.textContent.trim() };
      }
    }
    // Varredura por regex "1° / HT / Primeiro" perto de N-N
    const all = document.body.innerText;
    const htMatch = all.match(/(?:1[°º]\s*(?:tempo|tiempo|half)|half\s*time|HT|primer\s*tiempo)[\s:\-]*(\d+)\s*[-:–]\s*(\d+)/i);
    if (htMatch) return { src: 'regex-body', ht: `${htMatch[1]} - ${htMatch[2]}`, raw: htMatch[0] };
    return null;
  });
  console.log('  Resultado:', htPlacar || 'null');

  // Estratégia 2: summary tab onde tem lista de eventos (gols)
  if (!htPlacar) {
    console.log('Estrategia 2: contando gols da lista de eventos antes do minuto 46');
    await delay(2000);
    htPlacar = await page.evaluate(() => {
      // Cada gol no summary aparece com o minuto e side
      const items = document.querySelectorAll('.smv__incident, [class*="incident"]');
      let hm = 0, va = 0;
      items.forEach(it => {
        const txt = it.textContent || '';
        const min = parseInt((txt.match(/(\d+)'/) || [])[1]);
        if (isNaN(min) || min > 45) return;
        if (!/\bgoal\b/i.test(it.className) && !txt.toLowerCase().includes('gol') && !it.querySelector('[class*="goal"]')) return;
        const isHome = /home|--home/.test(it.className);
        const isAway = /away|--away/.test(it.className);
        if (isHome) hm++;
        else if (isAway) va++;
      });
      return hm + va > 0 ? { src: 'incident-count', ht: `${hm} - ${va}` } : null;
    });
    console.log('  Resultado:', htPlacar || 'null');
  }

  // Estratégia 3: página de estatísticas do 1º tempo (tem score-wrapper igual)
  if (!htPlacar) {
    console.log('Estrategia 3: /match-statistics/1 com espera maior');
    await page.goto(`https://www.flashscore.com/match/${MATCH_ID}/#/match-summary/match-statistics/1`, { waitUntil: 'networkidle2', timeout: 45000 });
    await delay(5000, 500);
    htPlacar = await page.evaluate(() => {
      const wrap = document.querySelector('.detailScore__wrapper');
      if (!wrap) return null;
      const spans = wrap.querySelectorAll('span');
      const nums = Array.from(spans).map(s => parseInt(s.textContent.trim())).filter(n => !isNaN(n));
      if (nums.length >= 2) return { src: 'detailScore-stats1', ht: `${nums[0]} - ${nums[1]}`, raw: wrap.innerText };
      return null;
    });
    console.log('  Resultado:', htPlacar || 'null');
  }

  await browser.close();

  if (!htPlacar) {
    console.log('\n❌ Nenhuma estrategia retornou HT');
    process.exit(1);
  }

  // Atualizar JSON
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
  const jogos = Array.isArray(raw) ? raw : Object.values(raw);
  const j = jogos.find(x => x.match_id === MATCH_ID);
  if (!j) { console.log('Jogo nao encontrado no JSON'); process.exit(1); }

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(RAW, RAW.replace('.json', `.backup_htmidland_${ts}.json`));
  j.placar = { ...j.placar, ht: htPlacar.ht };
  fs.writeFileSync(RAW, JSON.stringify(jogos, null, 2));

  console.log(`\n✅ HT atualizado: Midland x San Martin S.J. = ${htPlacar.ht} (fonte: ${htPlacar.src})`);
})();
