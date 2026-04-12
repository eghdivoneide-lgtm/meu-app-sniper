const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
        await page.goto("https://www.flashscore.com/match/jLJhQjQN/#/match-summary/match-statistics/0", { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(res => setTimeout(res, 5000));
        
        // Extrai texto bruto pra podermos ver como o Flashscore posiciona os números
        const text = await page.evaluate(() => {
            const el = document.querySelector('#detail') || document.body;
            return el.innerText;
        });
        
        fs.writeFileSync('fs_dom.txt', text);
        console.log("DOM dump concluído.");
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
