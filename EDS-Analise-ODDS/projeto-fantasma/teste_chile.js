const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.flashscore.com/football/chile/primera-division/standings/', { waitUntil: 'networkidle2' });
    const title = await page.title();
    const html = await page.content();
    console.log("Title: " + title);
    if(html.includes("ui-table__row")) { console.log("FOUND TABLE ROW"); }
    else { console.log("NO TABLE ROW FOUND"); }
    console.log(html.substring(0, 500));
    await browser.close();
})();
