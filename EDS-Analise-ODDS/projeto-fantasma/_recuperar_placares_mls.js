/**
 * RECUPERADOR DE PLACARES — MLS rodada 2026-04-22
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'mls_rodada_2_2026-04-22.json');

function delay(ms, jitter = 500) {
  return new Promise(r => setTimeout(r, ms + Math.floor(Math.random() * jitter)));
}

(async () => {
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
  const jogos = Array.isArray(raw) ? raw : Object.values(raw);

  // Precisa recuperar: FT ausente OU HT ausente
  const precisaFT = jogos.filter(j =>
    !j.placar?.ft || !j.placar.ft.includes(' - ') || j.placar.ft.toLowerCase().includes('indisp')
  );
  const precisaHT = jogos.filter(j =>
    j.placar?.ft && j.placar.ft.includes(' - ') &&  // FT OK
    (!j.placar?.ht || !j.placar.ht.includes(' - ') || j.placar.ht.toLowerCase().includes('indisp'))
  );
  const todos = [...new Set([...precisaFT, ...precisaHT])];
  console.log(`Total: ${jogos.length} | FT faltando: ${precisaFT.length} | HT faltando: ${precisaHT.length} | Total único: ${todos.length}`);

  if (!todos.length) { console.log('Nada a recuperar'); return; }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (let i = 0; i < todos.length; i++) {
    const j = todos[i];
    process.stdout.write(`[${i + 1}/${todos.length}] ${j.mandante} x ${j.visitante} ... `);

    let ft = null, ht = null;
    const precisaF = !j.placar?.ft || !j.placar.ft.includes(' - ');
    const precisaH = !j.placar?.ht || !j.placar.ht.includes(' - ');

    try {
      // FT: primeiro tenta match-statistics/0 (aba completa) que é mais estável
      if (precisaF) {
        await page.goto(`https://www.flashscore.com/match/${j.match_id}/#/match-summary/match-statistics/0`, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(3500, 500);
        ft = await page.evaluate(() => {
          const wrap = document.querySelector('.detailScore__wrapper');
          if (wrap) {
            const spans = wrap.querySelectorAll('span');
            const nums = Array.from(spans).map(s => parseInt(s.textContent.trim())).filter(n => !isNaN(n));
            if (nums.length >= 2) return `${nums[0]} - ${nums[1]}`;
          }
          return null;
        });
      }

      // HT: aba match-statistics/1 (1º tempo)
      if (precisaH) {
        await page.goto(`https://www.flashscore.com/match/${j.match_id}/#/match-summary/match-statistics/1`, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(3000, 500);
        ht = await page.evaluate(() => {
          const wrap = document.querySelector('.detailScore__wrapper');
          if (wrap) {
            const spans = wrap.querySelectorAll('span');
            const nums = Array.from(spans).map(s => parseInt(s.textContent.trim())).filter(n => !isNaN(n));
            if (nums.length >= 2) return `${nums[0]} - ${nums[1]}`;
          }
          return null;
        });
      }

      const parts = [];
      if (ft) { j.placar = { ...j.placar, ft }; parts.push(`FT ${ft}`); }
      if (ht) { j.placar = { ...j.placar, ht }; parts.push(`HT ${ht}`); }
      if (parts.length) console.log(parts.join(' | ') + ' ✅');
      else console.log('FALHA ❌');
    } catch (e) {
      console.log(`ERRO: ${e.message}`);
    }
    await delay(2000, 500);
  }

  await browser.close();

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(RAW, RAW.replace('.json', `.backup_${ts}.json`));
  fs.writeFileSync(RAW, JSON.stringify(jogos, null, 2));
  console.log(`\n✅ Salvo em mls_rodada_2_2026-04-22.json`);
})();
