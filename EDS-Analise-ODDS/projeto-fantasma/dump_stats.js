const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const url = 'https://www.flashscore.com/match/8lOoUP7F/#/match-summary'; 
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 6000));
    
    await page.evaluate(() => {
        const links = document.querySelectorAll('a, button, div, span');
        const target = Array.from(links).find(el => el.innerText && (el.innerText.toUpperCase() === 'ESTATÍSTICAS' || el.innerText.toUpperCase() === 'STATS'));
        if(target) target.click();
    });
    
    await new Promise(r => setTimeout(r, 4000));
    
    const lines = await page.evaluate(() => document.body.innerText.split('\n').map(l => l.trim()).filter(l => l.length > 0));
    console.log("STAT LINES DUMP:");
    const startIdx = lines.findIndex(l => l.toLowerCase().includes('posse de bola') || l.toLowerCase().includes('ball possession'));
    if(startIdx !== -1) {
       console.log(lines.slice(startIdx, startIdx + 30));
    } else {
       console.log("Stats start not found. Lines:");
       console.log(lines.slice(0, 30));
    }
    await browser.close();
})();
