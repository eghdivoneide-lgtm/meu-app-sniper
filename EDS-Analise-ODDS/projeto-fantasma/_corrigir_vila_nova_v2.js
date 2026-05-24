/**
 * 2ª tentativa Vila Nova × Athletic — espera mais tempo no DOM antes de extrair.
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  // Inspeção crua primeiro — ver o que tá no DOM
  const page = await browser.newPage();
  await page.goto('https://www.flashscore.com/match/GUGqk0PP/#/match-summary', {
    waitUntil: 'domcontentloaded',
    timeout: 40000
  });
  await new Promise(r => setTimeout(r, 12000));

  const info = await page.evaluate(() => {
    const text = document.body.innerText;
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
    return {
      title: document.title,
      first40: lines.slice(0, 40)
    };
  });
  console.log('=== TITULO ===');
  console.log(info.title);
  console.log('=== PRIMEIRAS 40 LINHAS DO BODY ===');
  info.first40.forEach((l, i) => console.log(String(i+1).padStart(2) + ': ' + l));
  await page.close();

  // Tentar extração via FlashscoreMonster
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;
  console.log('\n=== EXTRAÇÃO VIA MONSTER ===');
  const novo = await fantasma.extrairPartida(
    'https://www.flashscore.com/match/GUGqk0PP/#/match-summary',
    { liga: 'Brasileirão Série B', codigo_liga: 'BR_B' }
  );
  console.log('placar:', JSON.stringify(novo.placar));
  console.log('cantos FT:', JSON.stringify(novo.estatisticas_ft && novo.estatisticas_ft.cantos));
  console.log('campos:', novo.meta && novo.meta.campos_disponiveis);

  // Se cantos vieram, atualiza
  const caminho = path.join(__dirname, 'br_b_rodada_2_2026-05-05.json');
  const dados = JSON.parse(fs.readFileSync(caminho));
  const idx = dados.findIndex(j => j.match_id === 'GUGqk0PP');
  if (idx !== -1 && novo.estatisticas_ft && novo.estatisticas_ft.cantos) {
    dados[idx] = novo;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    console.log('✅ Atualizado!');
  } else if (idx !== -1) {
    // Restaurar cantos originais (9-1) caso flashscore continue inconsistente
    console.log('⚠️  Sem cantos extraídos — restaurando cantos originais (9-1) e marcando placar Indisponível');
    dados[idx].estatisticas_ft = { cantos: { m: 9, v: 1 } };
    dados[idx].placar = { ht: 'Indisponível', ft: 'Indisponível' };
    dados[idx].meta = dados[idx].meta || {};
    dados[idx].meta.observacao = 'Placar não disponível no Flashscore — verificar manualmente. Cantos preservados da 1ª coleta.';
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    console.log('✅ Restaurado.');
  }

  await browser.close();
})().catch(e => { console.error('💥', e.message); process.exit(1); });
