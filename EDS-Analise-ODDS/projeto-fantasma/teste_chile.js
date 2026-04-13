const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.flashscore.com/football/chile/', { waitUntil: 'domcontentloaded' });
    
    // allow time to load and bypass CF
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(href => href.includes('chile'));
    });
    console.log(links);
    await browser.close();
})();
