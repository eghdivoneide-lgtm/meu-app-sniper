/**
 * RECUPERADOR DE HT v2 — Conta gols dos eventos do 1º tempo (minuto <= 45)
 * Estratégia: /match-summary lista os eventos. Gols viram { team, min }.
 * HT = número de gols mandante com min<=45 vs número de gols visitante com min<=45.
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
  const falta = jogos.filter(j =>
    !j.placar?.ht || !j.placar.ht.includes(' - ') || j.placar.ht.toLowerCase().includes('indisp')
  );
  console.log(`HTs faltando: ${falta.length}`);
  if (!falta.length) { console.log('Nada a fazer'); return; }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  let ok = 0, fail = 0;
  for (let i = 0; i < falta.length; i++) {
    const j = falta[i];
    process.stdout.write(`[${i + 1}/${falta.length}] ${j.mandante} x ${j.visitante} (FT ${j.placar?.ft}) ... `);

    try {
      await page.goto(`https://www.flashscore.com/match/${j.match_id}/#/match-summary`, { waitUntil: 'networkidle2', timeout: 30000 });
      await delay(3500, 500);

      const resultado = await page.evaluate(() => {
        const incidents = document.querySelectorAll('.smv__incident, [class*="incidentRow"]');
        let hm = 0, hv = 0;
        let debug = [];
        incidents.forEach(el => {
          const timeEl = el.querySelector('.smv__timeBox, [class*="time"]');
          if (!timeEl) return;
          const min = parseInt((timeEl.textContent.match(/(\d+)/) || [])[1]);
          if (isNaN(min) || min > 45) return;
          // Detectar gol: ícone soccerBall/goal/ownGoal, ou imagem com alt "goal"
          const isGoal = !!(
            el.querySelector('[class*="soccerBall"]') ||
            el.querySelector('[class*="-goal"], [class*="goal-"]') ||
            el.querySelector('svg[class*="goal"]') ||
            /(?:^|\s)goal(?:$|\s)/i.test(el.className)
          );
          if (!isGoal) return;
          // Home vs Away pela posição/classe
          const isHome = /home|--home/.test(el.className) ||
                         el.closest('[class*="home"]') !== null;
          const isAway = /away|--away/.test(el.className) ||
                         el.closest('[class*="away"]') !== null;
          if (isHome && !isAway) hm++;
          else if (isAway && !isHome) hv++;
          else {
            // fallback: posição horizontal relativa
            const rect = el.getBoundingClientRect();
            if (rect.left < window.innerWidth / 2) hm++;
            else hv++;
          }
          debug.push({ min, cls: el.className.substring(0, 60), home: isHome, away: isAway });
        });
        return { hm, hv, debug, count: incidents.length };
      });

      if (resultado.count === 0) {
        // Fallback: tentar seletor alternativo
        const alt = await page.evaluate(() => {
          const blocks = document.querySelectorAll('[class*="incident"]');
          return blocks.length;
        });
        console.log(`sem eventos (incident alt=${alt})`);
        fail++;
        continue;
      }

      j.placar = { ...j.placar, ht: `${resultado.hm} - ${resultado.hv}` };
      console.log(`HT ${resultado.hm} - ${resultado.hv} (${resultado.debug.length} gols no 1T) ✅`);
      ok++;
    } catch (e) {
      console.log(`ERRO: ${e.message}`);
      fail++;
    }
    await delay(1800, 400);
  }

  await browser.close();

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(RAW, RAW.replace('.json', `.backup_prehtfix_${ts}.json`));
  fs.writeFileSync(RAW, JSON.stringify(jogos, null, 2));
  console.log(`\n✅ ${ok}/${falta.length} HTs calculados (${fail} falhas)`);
})();
