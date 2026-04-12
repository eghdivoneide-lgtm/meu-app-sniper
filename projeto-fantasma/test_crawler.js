const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    console.log("Iniciando Teste...");
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    // Vancuver x Portland ID: hOqUj71O (Example MLS match)
    // Actually from screenshot: Los Angeles Galaxy x Minnesota United. Let's use any recent one.
    // Base URL is flashscore.com/match/xyz
    const url = 'https://www.flashscore.com/match/8lOoUP7F/#/match-summary'; 
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    
    console.log("Summary loaded. Injecting HT hash...");
    await page.evaluate(() => { window.location.hash = '#/match-summary/match-statistics/0'; });
    await new Promise(r => setTimeout(r, 4000));
    
    const ftStatsHash = await page.evaluate(() => document.body.innerText.toLowerCase().includes('escanteios') || document.body.innerText.toLowerCase().includes('corner kicks'));
    console.log("Found FT stats using HASH injection?", ftStatsHash);

    console.log("Trying Page.goto...");
    await page.goto('https://www.flashscore.com/match/8lOoUP7F/#/match-summary/match-statistics/0', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 4000));
    const ftStatsUrl = await page.evaluate(() => document.body.innerText.toLowerCase().includes('escanteios') || document.body.innerText.toLowerCase().includes('corner kicks'));
    console.log("Found FT stats using PAGE.GOTO?", ftStatsUrl);

    console.log("Trying DOM Clicking...");
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 4000));
    await page.evaluate(() => {
        const links = document.querySelectorAll('a, button, div');
        const target = Array.from(links).find(el => el.innerText && (el.innerText.toUpperCase().includes('ESTATÍSTICAS') || el.innerText.toUpperCase().includes('STATS')));
        if(target) target.click();
    });
    await new Promise(r => setTimeout(r, 4000));
    const ftStatsClick = await page.evaluate(() => document.body.innerText.toLowerCase().includes('escanteios') || document.body.innerText.toLowerCase().includes('corner kicks'));
    console.log("Found FT stats using DOM CLICK?", ftStatsClick);

    await browser.close();
})();
