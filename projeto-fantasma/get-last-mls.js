const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto("https://www.flashscore.com.br/futebol/eua/mls/resultados/", { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // extrai o ID do primeiro jogo listado
    const matchId = await page.evaluate(() => {
        const firstMatch = document.querySelector('.event__match');
        return firstMatch ? firstMatch.id.split('_').slice(-1)[0] : null;
    });
    console.log("MATCH_ID=" + matchId);
    await browser.close();
})();
