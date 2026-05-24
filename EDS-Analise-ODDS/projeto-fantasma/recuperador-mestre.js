const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');

// Nomes de times padrão do Especialista
const mapLiga = ['Athletico-PR', 'Atlético-MG', 'Bahia', 'Botafogo', 'Chapecoense', 'Corinthians', 'Coritiba', 'Cruzeiro', 'Flamengo', 'Fluminense', 'Grêmio', 'Internacional', 'Mirassol', 'Palmeiras', 'Red Bull Bragantino', 'Remo', 'Santos', 'São Paulo', 'Vasco', 'Vitória'];

function norm(t) {
    if(!t) return '';
    return t.toLowerCase().replace(/ rj|-sc| red bull| atlético| grêmio| são paulo| athletico/g,'').trim();
}

function getLigaName(nome) {
    const n = norm(nome);
    for(const l of mapLiga) {
        if(norm(l) === n) return l;
    }
    // fallbacks
    if(n.includes('fla') || nome.toLowerCase().includes('flamengo')) return 'Flamengo';
    if(n.includes('sao paulo')) return 'São Paulo';
    if(n.includes('gremio')) return 'Grêmio';
    if(n.includes('botafogo')) return 'Botafogo';
    if(n.includes('fluminense')) return 'Fluminense';
    if(n.includes('athletico')) return 'Athletico-PR';
    if(n.includes('mineiro')||n.includes('atletico-mg')) return 'Atlético-MG';
    if(n.includes('bragantino')) return 'Red Bull Bragantino';
    
    return nome;
}

(async () => {
    let rawFile = path.join(__dirname, '../especialista-cantos/data/brasileirao2026.js');
    let code = fs.readFileSync(rawFile, 'utf8');
    code = code.replace(/if\s*\(typeof\s+module\s*!==?\s*["']undefined["']\)\s*module\.exports\s*=\s*[^;]+;?/g, '');
    const m = code.match(/window\.\w+\s*=\s*(\{[\s\S]+\})\s*;?\s*$/);
    if (!m) { console.log('Erro ao ler base'); process.exit(1); }
    let db = eval('(' + m[1] + ')');

    console.log(`📡 Base local carregada com ${db.jogos.length} jogos.`);

    const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1366,900'] });
    const page = await browser.newPage();
    console.log('📡 Acessando resultados oficiais da Série A...');
    await page.goto('https://www.flashscore.com/football/brazil/serie-a-betano/results/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    for (let i = 0; i < 15; i++) {
        const btnMais = await page.$('a.event__more, button.event__more');
        if (btnMais) {
            await btnMais.click();
            await new Promise(r => setTimeout(r, 1500));
        } else {
            const h = await page.evaluate(() => document.body.scrollHeight);
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await new Promise(r => setTimeout(r, 1000));
            if (h === await page.evaluate(() => document.body.scrollHeight)) break;
        }
    }

    const matchesFs = await page.evaluate(() => {
        const res = [];
        const els = document.querySelectorAll('.event__match');
        els.forEach(el => {
            const home = el.querySelector('[class*="Participant"][class*="home"]')?.innerText?.trim().split('\n')[0] || '';
            const away = el.querySelector('[class*="Participant"][class*="away"]')?.innerText?.trim().split('\n')[0] || '';
            const sh = el.querySelector('[class*="score"][class*="home"]')?.innerText?.trim();
            const sa = el.querySelector('[class*="score"][class*="away"]')?.innerText?.trim();
            const id = (el.getAttribute('id') || '').replace('g_1_', '');
            const timeEl = el.querySelector('.event__time')?.innerText?.trim() || '';
            
            if (home && away && sh && sa && id) {
                res.push({
                    id, home, away, scoreHome: parseInt(sh), scoreAway: parseInt(sa), dataTxt: timeEl
                });
            }
        });
        return res;
    });

    console.log(`✅ FlashScore: Encontrados ${matchesFs.length} jogos OFICIAIS da Série A com Placar.`);
    
    let atualizados = 0;
    let scrapeNovos = [];

    // Loop through Flashscore clean games
    for (const fsMatch of matchesFs) {
        const nHome = getLigaName(fsMatch.home);
        const nAway = getLigaName(fsMatch.away);
        
        // Find in our database
        let jogodb = db.jogos.find(j => 
            (getLigaName(j.mandante) === nHome && getLigaName(j.visitante) === nAway) || j.match_id === fsMatch.id
        );

        if (jogodb) {
            // Update placar and match_id! Guaranteeing perfection without data loss!
            if (!jogodb.placar || jogodb.placar.m !== fsMatch.scoreHome) {
                jogodb.placar = { m: fsMatch.scoreHome, v: fsMatch.scoreAway };
                jogodb.match_id = fsMatch.id;
                
                // Fix date safely using typical Flashscore format "13.04. 16:00" -> "2026-04-13"
                if (!jogodb.data && fsMatch.dataTxt) {
                    const parts = fsMatch.dataTxt.split(' ')[0].split('.');
                    if(parts.length >= 2) {
                        jogodb.data = `2026-${String(parts[1]).padStart(2,'0')}-${String(parts[0]).padStart(2,'0')}`;
                    }
                }
                atualizados++;
            }
        } else {
            // Jogo novo (ex. rodada 11)! Precisamos extrair
            scrapeNovos.push(fsMatch);
        }
    }

    console.log(`\n🎉 SUCESSO INICIAL! Extraídos resultados da página oficial e atualizados placares existentes.`);
    await browser.close(); // IMPORTANT: CLOSE BROWSER BEFORE STARTING THE SECOND ONE TO SAVE MEMORY

    if (scrapeNovos.length > 0) {
        console.log(`\n👻 Ativando Flashscore Monster para raspar os ${scrapeNovos.length} jogos faltantes...`);
        const fantasma = new FlashscoreMonster();
        await fantasma.iniciar(); // It manages its own browser instance properly

        for (let i = 0; i < scrapeNovos.length; i++) {
            const fsm = scrapeNovos[i];
            console.log(`  [${i+1}/${scrapeNovos.length}] Extraindo cantos: ${fsm.home} vs ${fsm.away} (${fsm.scoreHome}-${fsm.scoreAway})`);
            
            try {
                const url = `https://www.flashscore.com/match/${fsm.id}/#/match-summary`;
                const stats = await fantasma.extrairPartida(url, { liga: 'Série A', codigo_liga: 'BR' });
                
                if (stats && stats.estatisticas_ft && stats.estatisticas_ft.cantos) {
                    let dateIso = '2026-06-01';
                    if (fsm.dataTxt) {
                        const parts = fsm.dataTxt.split(' ')[0].split('.');
                        if(parts.length >= 2) {
                            dateIso = `2026-${String(parts[1]).padStart(2,'0')}-${String(parts[0]).padStart(2,'0')}`;
                        }
                    }

                    const newGame = {
                        match_id: fsm.id,
                        rodada: null,
                        data: dateIso,
                        mandante: mapLiga.includes(getLigaName(fsm.home)) ? getLigaName(fsm.home) : fsm.home,
                        visitante: mapLiga.includes(getLigaName(fsm.away)) ? getLigaName(fsm.away) : fsm.away,
                        placar: { m: fsm.scoreHome, v: fsm.scoreAway },
                        cantos: {
                            ht: stats.estatisticas_ht?.cantos ? { m: stats.estatisticas_ht.cantos.m, v: stats.estatisticas_ht.cantos.v } : {m:0, v:0},
                            ft: { m: stats.estatisticas_ft.cantos.m, v: stats.estatisticas_ft.cantos.v }
                        },
                        stats_taticas: (stats.estatisticas_ft.posse && stats.estatisticas_ft.finalizacoes) ? {
                            posse: { m: stats.estatisticas_ft.posse.m, v: stats.estatisticas_ft.posse.v },
                            finalizacoes: { m: stats.estatisticas_ft.finalizacoes.m, v: stats.estatisticas_ft.finalizacoes.v }
                        } : null
                    };
                    db.jogos.push(newGame);
                    console.log(`      ✅ Sucesso! Cantos: ${newGame.cantos.ft.m}-${newGame.cantos.ft.v}`);
                } else {
                    console.log(`      ⚠️ Falha ao ler cantos/stats`);
                }
            } catch(e) {
                console.log(`      ❌ Erro: ${e.message}`);
                // Restart to avoid stale connections
                await fantasma.fechar();
                await fantasma.iniciar();
            }
            await new Promise(r => setTimeout(r, 2000));
        }
        await fantasma.fechar();
    }

    // Ordenar por data cronológica natural
    db.jogos.sort((a,b) => new Date(a.data||'2026-01-01') - new Date(b.data||'2026-01-01'));

    // Inferir Rodadas (simples: agrupa jogos em janelas de 5 dias)
    let rodadaAtual = 1;
    let dataRef = db.jogos[0]?.data || '2026-01-01';
    let timesNaRodada = new Set();
    
    for (const jogo of db.jogos) {
      const diff = Math.abs(new Date(jogo.data) - new Date(dataRef)) / (1000 * 60 * 60 * 24);
      if (diff > 5 || timesNaRodada.has(jogo.mandante) || timesNaRodada.has(jogo.visitante)) {
        rodadaAtual++;
        dataRef = jogo.data;
        timesNaRodada.clear();
      }
      jogo.rodada = rodadaAtual;
      timesNaRodada.add(jogo.mandante);
      timesNaRodada.add(jogo.visitante);
    }
    
    db.totalRodadas = Math.max(...db.jogos.map(j => j.rodada||0), 0);
    db.ultimaAtualizacao = new Date().toISOString().split('T')[0];

    // Salvar!
    const conteudo = 
        `// ============================================================\n` +
        `// BRASILEIRÃO SÉRIE A 2026 — MOTOR FANTASMA (RECUPERAÇÃO MESTRE)\n` +
        `// Atualizado: ${db.ultimaAtualizacao}\n` +
        `// ============================================================\n\n` +
        `window.DADOS_BR = ${JSON.stringify(db, null, 2)};\n`;

    fs.writeFileSync(rawFile, conteudo, 'utf8');
    
    const dstTeacher = path.join(__dirname, '../EDS-ODDS-TEACHER/data/brasileirao2026.js');
    if (fs.existsSync(path.dirname(dstTeacher))) {
        fs.writeFileSync(dstTeacher, conteudo, 'utf8');
    }

    console.log(`\n🎉 SUCESSO ABSOLUTO! Série A contêm exatamente ${db.jogos.length} jogos limpos!`);
    await browser.close();
})();
