/**
 * Abre a página do match Vila Nova × Athletic e inspeciona o estado real.
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
  await page.goto('https://www.flashscore.com/match/GUGqk0PP/#/match-summary', {
    waitUntil: 'domcontentloaded',
    timeout: 40000
  });
  await new Promise(r => setTimeout(r, 8000));

  const info = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      title: document.title,
      // primeiras 60 linhas do body
      bodyLines: text.split('\n').filter(l => l.trim()).slice(0, 60),
      // status / placar
      detailScore: document.querySelector('.detailScore__wrapper')?.innerText || null,
      status: document.querySelector('.fixedHeaderDuel__detailStatus')?.innerText || null,
      eventInfo: document.querySelector('.duelParticipant__startTime')?.innerText || null
    };
  });

  console.log('TITLE:', info.title);
  console.log('STATUS:', info.status);
  console.log('DETAIL SCORE:', info.detailScore);
  console.log('EVENT INFO:', info.eventInfo);
  console.log('--- TOP BODY LINES ---');
  info.bodyLines.forEach(l => console.log(l));

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
