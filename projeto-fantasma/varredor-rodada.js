const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const FlashscoreMonster = require('./flashscore-monster');

(async () => {
    console.log("=========================================");
    console.log("👻 VARREDÔR EM MASSA: FANTASMA INICIADO");
    console.log("=========================================");
    
    const maxPartidas = 15; // Extai até 15 partidas da última rodada da MLS
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--window-size=1280,800'] });
    const page = await browser.newPage();
    
    console.log("🌐 Acessando Portal de Resultados da MLS...");
    await page.goto("https://www.flashscore.com/football/usa/mls/results/", { waitUntil: 'domcontentloaded', timeout: 40000 });
    await new Promise(r => setTimeout(r, 6000)); // Aguarda carregar toda a lista de javascript

    // Extrair os IDs das últimas partidas
    const gameIds = await page.evaluate((limite) => {
        const matches = document.querySelectorAll('.event__match');
        let ids = [];
        for(let i=0; i < Math.min(matches.length, limite); i++) {
            const elId = matches[i].getAttribute('id');
            if(elId && elId.includes('g_1_')) {
                ids.push(elId.replace('g_1_', '')); // Retira prefixo do Flashscore
            }
        }
        return ids;
    }, maxPartidas);
    
    await page.close();

    console.log(`📡 Foram encontrados ${gameIds.length} jogos recentes finalizados. Iniciando Extração Profunda...`);
    
    // Instanciação e Re-aproveitamento de Browser para Extração Rapida
    const fantasma = new FlashscoreMonster();
    fantasma.browser = browser; // injetamos a aba viva

    const relatorioDaRodada = [];
    
    for (let i = 0; i < gameIds.length; i++) {
        const url = `https://www.flashscore.com/match/${gameIds[i]}/#/match-summary`;
        console.log(`\n=========================================`);
        console.log(`🔍 [${i+1}/${gameIds.length}] Investigando Partida ID: ${gameIds[i]}...`);
        
        try {
            const partidaExata = await fantasma.extrairPartida(url);
            if(partidaExata) {
                relatorioDaRodada.push(partidaExata);
            }
        } catch(e) {
            console.log(`Erro crítico no jogo ${gameIds[i]}: ${e.message}`);
        }
        
        // Pausa Humana para não ativar o Anti-DDOS do Cloudflare
        console.log(`⏳ Aguardando 5 segundos para resfriar a rede...`);
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log("\n=========================================");
    console.log("🔥 EXTRAÇÃO EM LOTE FINALIZADA!");
    console.log("=========================================");
    
    fs.writeFileSync('mls_rodada_atual.json', JSON.stringify(relatorioDaRodada, null, 2));
    console.log(`💾 Arquivo salvo com sucesso em: mls_rodada_atual.json (${relatorioDaRodada.length} jogos mapeados)`);

    await fantasma.fechar();
})();
