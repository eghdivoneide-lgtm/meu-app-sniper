/**
 * BUSCAR USL FALTANDO — Coleta 24 jogos novos da USL Championship
 * Roda no seu PC: node buscar_usl_faltando.js
 *
 * O que faz:
 * 1. Coleta IDs novos da página de resultados da USL
 * 2. Para cada jogo novo: scrapa placar FT + HT + cantos + posse
 * 3. Adiciona ao raw_usl.json e regera usl2026.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCRAPER_DIR = __dirname;
const DATA_ROOT   = path.join(SCRAPER_DIR, '..', 'data');
const DATA_EDS    = path.join(SCRAPER_DIR, '..', '..', '..', 'EDS-Analise-ODDS', 'especialista-cantos', 'data');
const RAW_FILE    = path.join(SCRAPER_DIR, 'raw_usl.json');
const IDS_FILE    = path.join(SCRAPER_DIR, 'match_ids_usl.json');
const USL_JS      = path.join(DATA_ROOT, 'usl2026.js');

function parseNinja(txt) {
  const res = { m_cantos: null, v_cantos: null, m_posse: null, v_posse: null };
  if (!txt) return res;
  txt.split('~').forEach(bloco => {
    if (!bloco.includes('SG÷')) return;
    let nome = '', m = 0, v = 0;
    bloco.split('¬').forEach(p => {
      if (p.startsWith('SG÷')) nome = p.replace('SG÷', '').toLowerCase();
      if (p.startsWith('SH÷')) m = parseInt(p.replace('SH÷', '').replace('%', '')) || 0;
      if (p.startsWith('SI÷')) v = parseInt(p.replace('SI÷', '').replace('%', '')) || 0;
    });
    if (nome.includes('corner') || nome.includes('escanteio')) {
      if (res.m_cantos === null) { res.m_cantos = m; res.v_cantos = v; }
    } else if (nome.includes('possession')) {
      if (res.m_posse === null) { res.m_posse = m; res.v_posse = v; }
    }
  });
  return res;
}

async function scrapeJogo(page, id) {
  const res = {
    id,
    mandante: '', visitante: '', rodada: 0,
    gols: { ht: {m:0,v:0}, ft: {m:0,v:0} },
    cantos: { ht: {m:0,v:0}, ft: {m:0,v:0} },
    stats_taticas: { posse: {m:50,v:50}, finalizacoes: {m:0,v:0} }
  };

  let ninjaTxt = [];
  const interceptor = resp => {
    const url = resp.url();
    if (url.includes('ninja') && !url.includes('mc_') && !url.includes('f_')) {
      resp.body().then(buf => {
        const t = buf.toString('utf8');
        if (t.includes('SG÷') && t.length > 100) ninjaTxt.push(t);
      }).catch(() => {});
    }
  };
  page.on('response', interceptor);

  try {
    // Página principal
    await page.goto(`https://www.flashscore.com/match/${id}/`, { waitUntil: 'load', timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));
    try { await page.click('#onetrust-accept-btn-handler', { timeout: 1500 }); } catch(e) {}

    // Nomes e placar FT
    try {
      const info = await page.evaluate(() => {
        const home = document.querySelector('.duelParticipant__home .participant__participantName');
        const away = document.querySelector('.duelParticipant__away .participant__participantName');
        const spans = document.querySelectorAll('.detailScore__wrapper span');
        const nums = Array.from(spans).map(s => parseInt(s.textContent)).filter(n => !isNaN(n));
        return {
          home: home?.textContent?.trim() || '',
          away: away?.textContent?.trim() || '',
          ftM: nums[0] ?? 0, ftV: nums[nums.length-1] ?? 0
        };
      });
      res.mandante = info.home;
      res.visitante = info.away;
      res.gols.ft = { m: info.ftM, v: info.ftV };
    } catch(e) {}

    // Estatísticas FT (dispara ninja)
    await page.goto(`https://www.flashscore.com/match/${id}/#/match-summary/match-statistics/0`, { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3500));

    // Estatísticas HT
    await page.goto(`https://www.flashscore.com/match/${id}/#/match-summary/match-statistics/1`, { waitUntil: 'load', timeout: 12000 });
    await new Promise(r => setTimeout(r, 2500));

  } catch(e) {
    console.log(`  ⚠️ ${id}: ${e.message.slice(0,60)}`);
  }

  page.off('response', interceptor);

  // Aplicar cantos coletados via ninja
  if (ninjaTxt.length > 0) {
    const s = parseNinja(ninjaTxt[0]);
    if (s.m_cantos !== null) res.cantos.ft = { m: s.m_cantos, v: s.v_cantos };
    if (s.m_posse !== null) res.stats_taticas.posse = { m: s.m_posse, v: s.v_posse };
  }
  if (ninjaTxt.length > 1) {
    const s = parseNinja(ninjaTxt[1]);
    if (s.m_cantos !== null) res.cantos.ht = { m: s.m_cantos, v: s.v_cantos };
  }

  return res;
}

function gerarUSL2026(jogos) {
  const times = [...new Set([...jogos.map(j=>j.mandante), ...jogos.map(j=>j.visitante)])].filter(Boolean).sort();
  const maxRod = Math.max(...jogos.map(j=>j.rodada||0), 1);
  return `// USL Championship 2026 — Gerado automaticamente\n// ${jogos.length} jogos | ${new Date().toISOString()}\nwindow.DADOS_USL = {\n  temporada: "USL Championship 2026",\n  ultimaAtualizacao: "${new Date().toLocaleDateString('pt-BR')}",\n  totalRodadas: ${maxRod},\n  times: ${JSON.stringify(times, null, 2)},\n  jogos: ${JSON.stringify(jogos, null, 2)}\n};\n`;
}

(async () => {
  console.log('🏈 BUSCAR USL FALTANDO');
  console.log('='.repeat(50));

  // Carregar dados atuais
  const rawAtual = JSON.parse(fs.readFileSync(RAW_FILE, 'utf8'));
  const idsAtual = new Set(rawAtual.map(j => j.id));
  console.log(`Raw atual: ${rawAtual.length} jogos`);

  // Coletar IDs novos da página
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' });
  const page = await ctx.newPage();

  console.log('\n🔍 Buscando IDs novos na página USL...');
  await page.goto('https://www.flashscore.com/football/usa/usl-championship/results/', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000));
  try { await page.click('#onetrust-accept-btn-handler', { timeout: 2000 }); await new Promise(r => setTimeout(r, 2000)); } catch(e) {}

  for (let i = 0; i < 10; i++) {
    try {
      const btn = await page.$('.event__more');
      if (!btn) break;
      await btn.click();
      await new Promise(r => setTimeout(r, 2500));
      process.stdout.write('.');
    } catch(e) { break; }
  }
  console.log('');

  const todosNaSite = await page.evaluate(() =>
    Array.from(document.querySelectorAll('div[id^="g_1_"]')).map(el => ({
      id: el.id.replace('g_1_', ''),
      mandante: el.querySelector('.event__homeParticipant')?.textContent?.trim() || '',
      visitante: el.querySelector('.event__awayParticipant')?.textContent?.trim() || '',
    })).filter(j => j.id && j.mandante)
  );

  const novos = todosNaSite.filter(j => !idsAtual.has(j.id));
  console.log(`\nEncontrados: ${todosNaSite.length} | Novos: ${novos.length}`);

  // Salvar IDs atualizados
  fs.writeFileSync(IDS_FILE, JSON.stringify(todosNaSite.map(j=>j.id), null, 2));

  if (novos.length === 0) {
    console.log('✅ Nenhum jogo novo. Base USL está atualizada!');
    await browser.close();
    return;
  }

  // Scrape de cada jogo novo
  const coletados = [];
  for (let i = 0; i < novos.length; i++) {
    const j = novos[i];
    process.stdout.write(`[${i+1}/${novos.length}] ${j.mandante} x ${j.visitante} → `);
    const res = await scrapeJogo(page, j.id);
    const temCantos = res.cantos.ft.m + res.cantos.ft.v > 0;
    console.log(`FT:${res.gols.ft.m}-${res.gols.ft.v} | Cantos:${res.cantos.ft.m}-${res.cantos.ft.v} ${temCantos ? '✅' : '⚠️'}`);
    coletados.push(res);
    await new Promise(r => setTimeout(r, 1500 + Math.floor(Math.random() * 1000)));
  }

  await browser.close();

  // Atualizar raw_usl.json
  const rawNovo = [...rawAtual, ...coletados];
  const ts = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  fs.copyFileSync(RAW_FILE, RAW_FILE.replace('.json', `_backup_${ts}.json`));
  fs.writeFileSync(RAW_FILE, JSON.stringify(rawNovo, null, 2));

  // AUDITORIA: apenas jogos com cantos completos
  const completos = rawNovo.filter(j => j.cantos?.ft?.m + j.cantos?.ft?.v > 0);
  const semCantos = rawNovo.length - completos.length;

  // Atribuir rodadas (grupos de ~14 por semana)
  const JOGOS_POR_RODADA = 14;
  completos.sort((a, b) => (a.id > b.id ? 1 : -1)); // mantém ordem original
  const comRodada = completos.map((j, i) => ({
    ...j,
    rodada: j.rodada || Math.floor(i / JOGOS_POR_RODADA) + 1,
    placar: { m: j.gols.ft.m, v: j.gols.ft.v }
  }));

  const saida = gerarUSL2026(comRodada);
  fs.writeFileSync(USL_JS, saida);
  if (fs.existsSync(DATA_EDS)) {
    fs.writeFileSync(path.join(DATA_EDS, 'usl2026.js'), saida);
  }

  console.log(`\n✅ USL ATUALIZADA:`);
  console.log(`   Total raw: ${rawNovo.length} | Com cantos: ${completos.length} | Sem cantos (excluídos): ${semCantos}`);
  console.log(`   usl2026.js: ${comRodada.length} jogos auditados`);
})();
