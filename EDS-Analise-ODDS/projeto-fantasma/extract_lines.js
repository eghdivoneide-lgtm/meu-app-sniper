const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto("https://www.flashscore.com/match/8lOoUP7F/#/match-summary/match-statistics/0", { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 6000));
    const lines = await page.evaluate(() => document.body.innerText.split('\n').map(l => l.trim()).filter(l => l.length > 0));
    console.log("STAT LINES:");
    console.log(lines.slice(0, 100)); // Print just the beginning where stats are
    await browser.close();
})();
