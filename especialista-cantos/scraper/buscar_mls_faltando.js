/**
 * BUSCAR MLS FALTANDO — Coleta qualquer rodada nova da MLS
 * Roda no seu PC: node buscar_mls_faltando.js
 *
 * O que faz:
 * 1. Busca todos IDs da página de resultados da MLS no FlashScore
 * 2. Compara com mls2026.js para encontrar jogos novos
 * 3. Para cada novo: scrapa placar FT + HT + cantos + posse (via ninja)
 * 4. Auditoria: apenas jogos com cantos completos entram no dataset
 * 5. Regera mls2026.js e salva nos dois caminhos
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCRAPER_DIR = __dirname;
const DATA_ROOT   = path.join(SCRAPER_DIR, '..', 'data');
const DATA_EDS    = path.join(SCRAPER_DIR, '..', '..', '..', 'EDS-Analise-ODDS', 'especialista-cantos', 'data');
const MLS_JS      = path.join(DATA_ROOT, 'mls2026.js');

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
    gols: { ht:{m:0,v:0}, ft:{m:0,v:0} },
    cantos: { ht:{m:0,v:0}, ft:{m:0,v:0} },
    stats_taticas: { posse:{m:50,v:50}, finalizacoes:{m:0,v:0} }
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
    await page.goto(`https://www.flashscore.com/match/${id}/`, { waitUntil: 'load', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2500));
    try { await page.click('#onetrust-accept-btn-handler', { timeout: 1500 }); } catch(e) {}

    try {
      const info = await page.evaluate(() => {
        const home = document.querySelector('.duelParticipant__home .participant__participantName');
        const away = document.querySelector('.duelParticipant__away .participant__participantName');
        const nums = Array.from(document.querySelectorAll('.detailScore__wrapper span'))
          .map(s => parseInt(s.textContent)).filter(n => !isNaN(n));
        return { home: home?.textContent?.trim()||'', away: away?.textContent?.trim()||'', ftM: nums[0]??0, ftV: nums[nums.length-1]??0 };
      });
      res.mandante = info.home;
      res.visitante = info.away;
      res.gols.ft = { m: info.ftM, v: info.ftV };
    } catch(e) {}

    await page.goto(`https://www.flashscore.com/match/${id}/#/match-summary/match-statistics/0`, { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3500));

    await page.goto(`https://www.flashscore.com/match/${id}/#/match-summary/match-statistics/1`, { waitUntil: 'load', timeout: 12000 });
    await new Promise(r => setTimeout(r, 2500));
  } catch(e) {
    console.log(`  ⚠️ ${id}: ${e.message.slice(0,60)}`);
  }

  page.off('response', interceptor);

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

(async () => {
  console.log('⚽ BUSCAR MLS FALTANDO — Detecção automática de rodadas novas');
  console.log('='.repeat(55));

  const mlsTxt = fs.readFileSync(MLS_JS, 'utf8');
  const idsExistentes = new Set([...mlsTxt.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]));
  console.log(`Jogos atuais na MLS: ${idsExistentes.size}`);

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' });
  const page = await ctx.newPage();

  console.log('\n🔍 Buscando IDs novos no FlashScore MLS...');
  await page.goto('https://www.flashscore.com/football/usa/mls/results/', { waitUntil: 'load', timeout: 30000 });
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
      visitante: el.querySelector('.event__awayParticipant')?.textContent?.trim() || ''
    })).filter(j => j.id && j.mandante)
  );

  const novos = todosNaSite.filter(j => !idsExistentes.has(j.id));
  console.log(`No site: ${todosNaSite.length} | Novos: ${novos.length}`);

  if (novos.length === 0) {
    console.log('✅ MLS está atualizada! Nenhum jogo novo.');
    await browser.close();
    return;
  }

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

  // Carregar jogos atuais
  let jogosAtuais = [];
  try {
    const tmp = {};
    new Function('tmp', mlsTxt.replace('window.DADOS_MLS', 'tmp.DADOS_MLS'))(tmp);
    jogosAtuais = tmp.DADOS_MLS.jogos || [];
  } catch(e) { console.log('Aviso ao carregar jogos atuais:', e.message.slice(0,50)); }

  // AUDITORIA: apenas com cantos completos
  const novosAuditados = coletados.filter(j => j.cantos.ft.m + j.cantos.ft.v > 0);
  const semCantos = coletados.length - novosAuditados.length;
  console.log(`\n📋 Auditoria: ${novosAuditados.length}/${coletados.length} com cantos | ${semCantos} excluídos`);

  const maxRodadaAtual = Math.max(...jogosAtuais.map(j => j.rodada || 0), 0);
  const novaRodada = maxRodadaAtual + 1;

  const novosComRodada = novosAuditados.map(j => ({
    ...j,
    rodada: novaRodada,
    placar: { m: j.gols.ft.m, v: j.gols.ft.v }
  }));

  const todosJogos = [...jogosAtuais, ...novosComRodada];
  const times = [...new Set([...todosJogos.map(j=>j.mandante), ...todosJogos.map(j=>j.visitante)])].filter(Boolean).sort();
  const maxRod = Math.max(...todosJogos.map(j=>j.rodada||0), 1);

  const saida = `// MLS 2026 — Gerado automaticamente | ${new Date().toISOString()}\n// ${todosJogos.length} jogos auditados (apenas com cantos completos)\nwindow.DADOS_MLS = {\n  temporada: "MLS 2026",\n  ultimaAtualizacao: "${new Date().toLocaleDateString('pt-BR')}",\n  totalRodadas: ${maxRod},\n  times: ${JSON.stringify(times, null, 2)},\n  jogos: ${JSON.stringify(todosJogos, null, 2)}\n};\n`;

  const ts = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  if (fs.existsSync(MLS_JS)) fs.copyFileSync(MLS_JS, MLS_JS + `.backup_${ts}`);

  fs.writeFileSync(MLS_JS, saida);
  if (fs.existsSync(DATA_EDS)) {
    fs.writeFileSync(path.join(DATA_EDS, 'mls2026.js'), saida);
  }

  console.log(`\n✅ mls2026.js ATUALIZADO:`);
  console.log(`   Total: ${todosJogos.length} jogos | Rodadas: 1-${maxRod} | Times: ${times.length}`);
  console.log(`   Novos adicionados: ${novosComRodada.length} (rodada ${novaRodada})`);
})();
