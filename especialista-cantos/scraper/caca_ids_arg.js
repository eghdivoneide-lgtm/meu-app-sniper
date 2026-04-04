const { chromium } = require('playwright');
const fs = require('fs');

async function mineIds() {
  console.log('🕵️‍♂️ CAÇADOR DE IDs: Iniciando rastreamento no FlashScore (Liga Profesional Argentina)...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Vamos acessar a versão Global do Flashscore direcionada para a Argentina
  await page.goto('https://www.flashscore.com/football/argentina/liga-profesional/results/', { waitUntil: 'load' });
  
  // Aguarda a lista de jogos carregar
  try {
    await page.waitForSelector('.sportName.soccer', { timeout: 10000 });
  } catch(e) {
    console.log('Timeout ao aguardar carregamento dos jogos. Salvando screenshot de erro.');
    await page.screenshot({ path: 'diagnose_caca_ids.png' });
    await browser.close();
    return;
  }

  // Clica no botão "Mostrar Mais Jogos" se ele existir
  let loadMore = true;
  while (loadMore) {
    try {
      const showMoreButton = await page.$('.event__more');
      if (showMoreButton) {
        console.log('🔄 Rolando e abrindo mais jogos históricos...');
        await showMoreButton.click();
        await page.waitForTimeout(2000); // Espera o conteúdo novo ser injetado no DOM
      } else {
        loadMore = false;
      }
    } catch (e) {
      loadMore = false; // Botão não encontrado ou deu erro
    }
  }

  // Extrai todos os IDs
  const matchIds = await page.evaluate(() => {
    // O Flashscore coloca um ID na forma "g_1_XYZ12345" na div de cada partida
    const events = Array.from(document.querySelectorAll('div[id^="g_1_"]'));
    return events.map(el => {
      return el.id.split('g_1_')[1]; 
    });
  });

  console.log(`✅ Rastreados com sucesso: ${matchIds.length} jogos da Liga Argentina.`);
  
  fs.writeFileSync('match_ids_arg.json', JSON.stringify(matchIds, null, 2));
  console.log(`Arquivo 'match_ids_arg.json' foi salvo perfeitamente com os IDs extraídos!`);

  await browser.close();
}

mineIds();
