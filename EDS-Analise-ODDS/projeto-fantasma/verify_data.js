const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto("https://www.flashscore.com/football/usa/mls/results/", { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 6000));
    const gameIds = await page.evaluate(() => {
        const matches = document.querySelectorAll('.event__match');
        let ids = [];
        for(let i=0; i < 5; i++) {
            const elId = matches[i].getAttribute('id');
            if(elId) ids.push(elId.replace('g_1_', ''));
        }
        return ids;
    });
    
    console.log("Checking Games:", gameIds);
    for(let id of gameIds) {
        await page.goto(`https://www.flashscore.com/match/${id}/#/match-summary/match-statistics/0`, {waitUntil: 'domcontentloaded'});
        await new Promise(r => setTimeout(r, 4000));
        const html = await page.evaluate(() => document.body.innerHTML);
        const hasStats = html.toLowerCase().includes('corner kicks') || html.toLowerCase().includes('escanteios');
        const hasTabs = html.toLowerCase().includes('stats') || html.toLowerCase().includes('estatísticas');
        console.log(`Match ${id} -> Has Corners included? ${hasStats} | Has Stats Tab? ${hasTabs}`);
    }
    await browser.close();
})();
