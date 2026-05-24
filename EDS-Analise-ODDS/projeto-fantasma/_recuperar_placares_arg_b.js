/**
 * RECUPERADOR DE PLACARES — ARG_B rodada 10
 * Lê arg_b_rodada_2_2026-04-22.json, identifica jogos com placar "Indisponível"
 * e refaz scraping só do placar via DOM (detailScore__wrapper).
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'arg_b_rodada_2_2026-04-22.json');

function delay(ms, jitter = 500) {
  return new Promise(r => setTimeout(r, ms + Math.floor(Math.random() * jitter)));
}

(async () => {
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
  const jogos = Array.isArray(raw) ? raw : Object.values(raw);

  const faltando = jogos.filter(j =>
    !j.placar?.ft || !j.placar.ft.includes(' - ') || j.placar.ft.toLowerCase().includes('indisp')
  );
  console.log(`Total jogos: ${jogos.length} | Sem placar FT: ${faltando.length}`);
  faltando.forEach((j, i) => console.log(`  ${i + 1}. ${j.match_id} | ${j.mandante} x ${j.visitante} | placar atual: ${JSON.stringify(j.placar)}`));

  if (!faltando.length) { console.log('Nada a recuperar'); return; }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const corrigidos = [];
  for (let i = 0; i < faltando.length; i++) {
    const j = faltando[i];
    const url = `https://www.flashscore.com/match/${j.match_id}/#/match-summary`;
    process.stdout.write(`[${i + 1}/${faltando.length}] ${j.mandante} x ${j.visitante} ... `);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await delay(2500, 500);

      const placar = await page.evaluate(() => {
        // Estratégia 1: detailScore__wrapper
        const wrap = document.querySelector('.detailScore__wrapper');
        if (wrap) {
          const spans = wrap.querySelectorAll('span');
          const nums = Array.from(spans).map(s => parseInt(s.textContent.trim())).filter(n => !isNaN(n));
          if (nums.length >= 2) return { ft: `${nums[0]} - ${nums[1]}` };
        }
        // Estratégia 2: event__score / score
        const h = document.querySelector('[class*="homeScore"], [class*="score--home"], .detailScore__home');
        const a = document.querySelector('[class*="awayScore"], [class*="score--away"], .detailScore__away');
        if (h && a) {
          const m = parseInt(h.textContent.trim());
          const v = parseInt(a.textContent.trim());
          if (!isNaN(m) && !isNaN(v)) return { ft: `${m} - ${v}` };
        }
        // Estratégia 3: buscar texto com padrão "N - N" perto do topo
        const title = document.querySelector('.duelParticipant, .detailScore, .smh__score');
        if (title) {
          const m = title.textContent.match(/(\d+)\s*[-:]\s*(\d+)/);
          if (m) return { ft: `${m[1]} - ${m[2]}` };
        }
        return null;
      });

      // HT: buscar aba match-statistics/1 (1º tempo) — usa mesmo wrapper mas valor muda
      let ht = null;
      if (placar) {
        try {
          await page.goto(`https://www.flashscore.com/match/${j.match_id}/#/match-summary/match-statistics/1`, { waitUntil: 'domcontentloaded', timeout: 20000 });
          await delay(2000, 300);
          ht = await page.evaluate(() => {
            const wrap = document.querySelector('.detailScore__wrapper');
            if (wrap) {
              const spans = wrap.querySelectorAll('span');
              const nums = Array.from(spans).map(s => parseInt(s.textContent.trim())).filter(n => !isNaN(n));
              if (nums.length >= 2) return { ht: `${nums[0]} - ${nums[1]}` };
            }
            return null;
          });
        } catch (_) {}
      }

      if (placar) {
        j.placar = { ft: placar.ft, ht: ht?.ht || j.placar?.ht || 'Indisponível' };
        console.log(`FT: ${placar.ft}${ht?.ht ? ' | HT: ' + ht.ht : ''} ✅`);
        corrigidos.push(j);
      } else {
        console.log('FALHA ❌');
      }
    } catch (e) {
      console.log(`ERRO: ${e.message}`);
    }
    await delay(2000, 500);
  }

  await browser.close();

  // Salvar JSON atualizado
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(RAW, RAW.replace('.json', `.backup_${ts}.json`));
  fs.writeFileSync(RAW, JSON.stringify(jogos, null, 2));
  console.log(`\n✅ ${corrigidos.length}/${faltando.length} placares recuperados e salvos em arg_b_rodada_2_2026-04-22.json`);
})();
