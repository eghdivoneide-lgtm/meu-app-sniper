/**
 * AGENTE NASSIM TALEB v2 — Analista Cisne Negro
 * EDS Soluções Inteligentes
 *
 * ABORDAGEM: Abre o Especialista em Cantos no browser,
 * interage com a aba "Projeção de Jogo" para cada fixture,
 * e lê os dados diretamente da tela (100% fiel ao app).
 *
 * MERCADOS ANALISADOS:
 *   - HT: OVER 4 / UNDER 4 (com %)
 *   - FT: OVER 10 / UNDER 10 (com %)
 *   - Vencedor em Cantos (faixa + odd)
 *   - xCorners por equipe (Casa e Fora)
 *
 * USO:
 *   node agente-nassim-taleb.js --liga BR
 *   node agente-nassim-taleb.js --todas
 *
 * @version 2.0.0
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════
//  CONFIGURAÇÃO DE LIGAS
// ═══════════════════════════════════════════════════════
const LIGAS = {
  BR:    { nome: 'Brasileirão Série A',          url_fixture: 'https://www.flashscore.com/football/brazil/serie-a-betano/fixtures/',        arquivo: 'brasileirao2026.js', variavel: 'DADOS_BR',    seletor: 'BR' },
  MLS:   { nome: 'Major League Soccer',           url_fixture: 'https://www.flashscore.com/football/usa/mls/fixtures/',                     arquivo: 'mls2026.js',         variavel: 'DADOS_MLS',   seletor: 'MLS' },
  ARG:   { nome: 'Liga Profesional Argentina',     url_fixture: 'https://www.flashscore.com/football/argentina/liga-profesional/fixtures/',   arquivo: 'argentina2026.js',   variavel: 'DADOS_ARG',   seletor: 'ARG' },
  ARG_B: { nome: 'Argentina Primera Nacional',     url_fixture: 'https://www.flashscore.com/football/argentina/primera-nacional/fixtures/',  arquivo: 'argentina_b2026.js', variavel: 'DADOS_ARG_B', seletor: 'ARG_B' },
  USL:   { nome: 'USL Championship',              url_fixture: 'https://www.flashscore.com/football/usa/usl-championship/fixtures/',        arquivo: 'usl2026.js',         variavel: 'DADOS_USL',   seletor: 'USL' },
  BUN:   { nome: 'Bundesliga',                    url_fixture: 'https://www.flashscore.com/football/germany/bundesliga/fixtures/',           arquivo: 'bundesliga2026.js',  variavel: 'DADOS_BUN',   seletor: 'BUN' },
  CL:    { nome: 'Primera División Chile',         url_fixture: 'https://www.flashscore.com/football/chile/liga-de-primera/fixtures/',       arquivo: 'chile2026.js',       variavel: 'DADOS_CHI',   seletor: 'CHI' },
  ECU:   { nome: 'Liga Pro Equador',              url_fixture: 'https://www.flashscore.com/football/ecuador/liga-pro/fixtures/',             arquivo: 'equador2026.js',     variavel: 'DADOS_ECU',   seletor: 'ECU' },
  ALM:   { nome: 'A-League Austrália',             url_fixture: 'https://www.flashscore.com/football/australia/a-league/fixtures/',           arquivo: 'aleague2026.js',     variavel: 'DADOS_ALM',   seletor: 'ALM' },
  J1:    { nome: 'J1 League Japão',               url_fixture: 'https://www.flashscore.com/football/japan/j1-league/fixtures/',              arquivo: 'j1league2026.js',    variavel: 'DADOS_J1',    seletor: 'J1' }
};

const especialistaPath = path.join(__dirname, '..', 'especialista-cantos', 'index.html');
const relatoriosDir = path.join(__dirname, 'relatorios');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function log(msg, tipo = 'info') {
  const icons = { info: 'ℹ️ ', success: '✅', error: '❌', warn: '⚠️ ', taleb: '🦢', fixture: '📅' };
  console.log(`${icons[tipo] || '•'} ${msg}`);
}

// ═══════════════════════════════════════════════════════
//  COLETOR DE FIXTURES (próxima rodada do FlashScore)
// ═══════════════════════════════════════════════════════

async function coletarFixtures(browser, liga) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  log(`Buscando fixtures: ${liga.url_fixture}`, 'fixture');
  await page.goto(liga.url_fixture, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(6000);

  const fixtures = await page.evaluate(() => {
    const jogos = [];
    const matches = document.querySelectorAll('.event__match');
    for (const match of matches) {
      try {
        const home = (match.querySelector('[class*="participant--home"]') || match.querySelector('.event__homeParticipant'))?.textContent?.trim();
        const away = (match.querySelector('[class*="participant--away"]') || match.querySelector('.event__awayParticipant'))?.textContent?.trim();
        const time = (match.querySelector('[class*="time"]'))?.textContent?.trim();
        if (home && away) jogos.push({ mandante: home, visitante: away, horario: time || '?' });
      } catch (e) {}
    }
    return jogos;
  });

  await page.close();
  return fixtures;
}

// ═══════════════════════════════════════════════════════
//  EXTRAIR PROJEÇÃO DO ESPECIALISTA EM CANTOS (via browser)
// ═══════════════════════════════════════════════════════

async function extrairProjecao(page, mandante, visitante) {
  // Selecionar mandante via page.select (seta o <select> e dispara onchange)
  await page.select('#sel-mandante', mandante);
  await delay(500);
  // Selecionar visitante
  await page.select('#sel-visitante', visitante);
  await delay(2000); // renderProjecao() é chamada automaticamente pelo onchange

  // Chamar projecaoJogo() diretamente no contexto do browser
  const dados = await page.evaluate((m, v) => {
    try {
      if (typeof projecaoJogo !== 'function') return { erro: 'projecaoJogo não existe' };
      const p = projecaoJogo(m, v);
      if (!p || !p.m || !p.v || !p.m.jogos || !p.v.jogos) return null;

      return {
        mandante: m,
        visitante: v,
        xCornersFT: +p.expTotalFT.toFixed(2),
        xCornersHT: +p.expTotalHT.toFixed(2),
        xCornersCasa: +p.expHomeFT.toFixed(2),
        xCornersFora: +p.expAwayFT.toFixed(2),
        confianca: +p.confFT.toFixed(1),
        incertezaFT: p.incerteza.dpFT,
        // Sniper
        sniperHT: p.tiroSniperData.ht,
        sniperFT: p.tiroSniperData.ft,
        pOverHT: p.tiroSniperData.pOverHT,
        pOverFT: p.tiroSniperData.pOverFT,
        // Reis dos Cantos
        rcVencedor: p.reisDosCantosData.vencedor,
        rcFaixa: p.reisDosCantosData.faixa,
        rcOdd: +p.reisDosCantosData.odd.toFixed(2),
        rcLado: p.reisDosCantosData.lado,
        // Bala de Prata
        bpTime: p.balaDePrataData ? p.balaDePrataData.time : null,
        bpFaixa: p.balaDePrataData ? p.balaDePrataData.faixa : null,
        bpOdd: p.balaDePrataData ? +p.balaDePrataData.odd.toFixed(2) : null,
        // DNA
        dnaM: p.dnaM ? p.dnaM.label : 'N/D',
        dnaV: p.dnaV ? p.dnaV.label : 'N/D',
        jogosM: p.m.jogos,
        jogosV: p.v.jogos,
        // DNA Escoteiro status
        dnaEscoteiroAtivo: p.dnaEscoteiro ? p.dnaEscoteiro.ativo : false,
        dnaPerfilM: p.dnaEscoteiro ? p.dnaEscoteiro.perfilM : 'N/D',
        dnaPerfilV: p.dnaEscoteiro ? p.dnaEscoteiro.perfilV : 'N/D'
      };
    } catch (e) {
      return { erro: e.message };
    }
  }, mandante, visitante);

  if (dados && dados.erro) {
    log(`  ERRO projecaoJogo: ${dados.erro}`, 'error');
    return null;
  }

  return dados;
}

// ═══════════════════════════════════════════════════════
//  CLASSIFICAÇÃO CISNE NEGRO
// ═══════════════════════════════════════════════════════

function classificarMercado(prob, confianca) {
  if (prob >= 65 && confianca >= 60) return { nivel: 'CISNE NEGRO', emoji: '🦢' };
  if (prob >= 58) return { nivel: 'ALTA', emoji: '🟢' };
  if (prob >= 50) return { nivel: 'MEDIA', emoji: '🟡' };
  return { nivel: 'BAIXA', emoji: '🔴' };
}

// ═══════════════════════════════════════════════════════
//  GERAR RELATÓRIO CONCISO
// ═══════════════════════════════════════════════════════

function gerarRelatorio(liga, projecoes) {
  const dataHoje = new Date().toISOString().split('T')[0];
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  let txt = '';
  txt += '═══════════════════════════════════════════════════════════\n';
  txt += '  🦢 RELATÓRIO CISNE NEGRO — EDS Soluções Inteligentes\n';
  txt += '═══════════════════════════════════════════════════════════\n';
  txt += `  Liga:   ${liga.nome}\n`;
  txt += `  Data:   ${dataHoje} ${hora}\n`;
  txt += `  Jogos:  ${projecoes.length}\n`;
  txt += '═══════════════════════════════════════════════════════════\n\n';

  // Coletar mercados para ranking
  const mercados = [];

  projecoes.forEach((p, i) => {
    const jogo = `${p.mandante} vs ${p.visitante}`;

    txt += `  ── JOGO ${i + 1}: ${p.mandante} (CASA) vs ${p.visitante} (FORA) ──\n`;
    txt += `  xCorners FT: ${p.xCornersFT} ±${p.incertezaFT} | Confiança: ${p.confianca}%\n`;
    txt += `  Cantos esperados: ${p.mandante} = ${p.xCornersCasa} | ${p.visitante} = ${p.xCornersFora}\n`;

    // HT
    const clsHT = classificarMercado(p.sniperHT === 'OVER 4' ? p.pOverHT : (100 - p.pOverHT), p.confianca);
    txt += `  HT: ${p.sniperHT} (${p.pOverHT}% over) ${clsHT.emoji} ${clsHT.nivel}\n`;
    mercados.push({ jogo, mercado: `HT ${p.sniperHT}`, prob: p.sniperHT.includes('OVER') ? p.pOverHT : (100 - p.pOverHT), conf: p.confianca, cls: clsHT });

    // FT
    const clsFT = classificarMercado(p.sniperFT === 'OVER 10' ? p.pOverFT : (100 - p.pOverFT), p.confianca);
    txt += `  FT: ${p.sniperFT} (${p.pOverFT}% over) ${clsFT.emoji} ${clsFT.nivel}\n`;
    mercados.push({ jogo, mercado: `FT ${p.sniperFT}`, prob: p.sniperFT.includes('OVER') ? p.pOverFT : (100 - p.pOverFT), conf: p.confianca, cls: clsFT });

    // Vencedor em Cantos
    txt += `  Vencedor: 👑 ${p.rcVencedor} · ${p.rcFaixa} @${p.rcOdd}\n`;

    // Bala de Prata
    if (p.bpTime) txt += `  Bala de Prata: 🐺 ${p.bpTime} (${p.bpFaixa}) @${p.bpOdd}\n`;

    txt += '\n';
  });

  // RANKING CISNE NEGRO
  txt += '═══════════════════════════════════════════════════════════\n';
  txt += '  🦢 RANKING CISNE NEGRO — ONDE ESTÁ O OURO\n';
  txt += '═══════════════════════════════════════════════════════════\n\n';

  const cisne = mercados.filter(m => m.cls.nivel === 'CISNE NEGRO').sort((a, b) => b.prob - a.prob);
  const alta = mercados.filter(m => m.cls.nivel === 'ALTA').sort((a, b) => b.prob - a.prob);
  const neutros = mercados.filter(m => m.cls.nivel === 'MEDIA' || m.cls.nivel === 'BAIXA');

  if (cisne.length > 0) {
    txt += '  🦢🦢🦢 PADRÃO CISNE NEGRO — ENTRAR 🦢🦢🦢\n';
    cisne.forEach((m, i) => txt += `  ${i + 1}. ${m.jogo} → ${m.mercado}: ${m.prob.toFixed(1)}% [Conf: ${m.conf}%]\n`);
    txt += '\n';
  } else {
    txt += '  Nenhum mercado Cisne Negro nesta rodada.\n\n';
  }

  if (alta.length > 0) {
    txt += '  🟢 ALTA CONFIANÇA — CONSIDERAR\n';
    alta.forEach((m, i) => txt += `  ${i + 1}. ${m.jogo} → ${m.mercado}: ${m.prob.toFixed(1)}% [Conf: ${m.conf}%]\n`);
    txt += '\n';
  }

  if (neutros.length > 0) {
    txt += '  🟡/🔴 NEUTRO OU BAIXA — EVITAR\n';
    neutros.forEach((m, i) => txt += `  ${i + 1}. ${m.jogo} → ${m.mercado}: ${m.prob.toFixed(1)}%\n`);
    txt += '\n';
  }

  txt += '═══════════════════════════════════════════════════════════\n';
  txt += `  Agente Nassim Taleb v2.0 | ${dataHoje} ${hora}\n`;
  txt += `  Dados extraídos diretamente do Especialista em Cantos\n`;
  txt += '═══════════════════════════════════════════════════════════\n';

  return txt;
}

// ═══════════════════════════════════════════════════════
//  PROCESSAR UMA LIGA
// ═══════════════════════════════════════════════════════

async function processarLiga(codigoLiga, browserFlash, pageEsp) {
  const liga = LIGAS[codigoLiga];
  if (!liga) { log(`Liga "${codigoLiga}" não encontrada`, 'error'); return null; }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`🦢 NASSIM TALEB — ${liga.nome} (${codigoLiga})`);
  console.log('═══════════════════════════════════════════════════');

  // 1. Coletar fixtures
  const allFixtures = await coletarFixtures(browserFlash, liga);
  log(`Fixtures encontrados: ${allFixtures.length}`, 'fixture');
  if (allFixtures.length === 0) { log('Liga em pausa — sem fixtures.', 'warn'); return null; }

  // 2. Selecionar liga no Especialista em Cantos via trocarLiga()
  const ligaSelecionada = await pageEsp.evaluate((seletor) => {
    if (typeof trocarLiga === 'function') {
      trocarLiga(seletor);
      return true;
    }
    return false;
  }, liga.seletor);

  if (!ligaSelecionada) {
    log(`ERRO: trocarLiga() não encontrada no Especialista!`, 'error');
    return null;
  }

  log(`Liga selecionada: ${liga.seletor} → ${liga.nome}`, 'success');
  await delay(2000);

  // Navegar para aba Projeção
  await pageEsp.evaluate(() => {
    if (typeof showView === 'function') showView('projecao');
  });
  await delay(1000);

  // Obter times disponíveis no Especialista
  const timesDisp = await pageEsp.evaluate(() => {
    const sel = document.getElementById('sel-mandante');
    if (!sel) return [];
    return [...sel.options].filter(o => o.value).map(o => o.value);
  });
  log(`Times no Especialista: ${timesDisp.length}`, 'info');

  // Normalizar nomes dos fixtures
  function normNome(nome) {
    const removeAcentos = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nomeNorm = removeAcentos(nome.toLowerCase());
    const nomeClean = nome.replace(/[-\s]+(SC|RJ|SP|MG|PR|BA|RS|CE|PA|GO|PE|AL|MA|ES|FC)$/i, '').trim();
    let match = timesDisp.find(t => t === nome);
    if (match) return match;
    match = timesDisp.find(t => removeAcentos(t.toLowerCase()) === nomeNorm);
    if (match) return match;
    match = timesDisp.find(t => removeAcentos(t.toLowerCase()) === removeAcentos(nomeClean.toLowerCase()));
    if (match) return match;
    const token = removeAcentos(nome.split(/[\s-]/)[0].toLowerCase());
    match = timesDisp.find(t => removeAcentos(t.toLowerCase()).startsWith(token));
    if (match) return match;
    match = timesDisp.find(t => removeAcentos(t.toLowerCase()).includes(token) || nomeNorm.includes(removeAcentos(t.toLowerCase())));
    return match || nome;
  }

  // Limitar a próxima rodada
  const maxJogos = Math.ceil(timesDisp.length / 2) + 2;
  const fixtures = allFixtures.slice(0, maxJogos);

  // 3. Para cada jogo: selecionar e ler projeção
  const projecoes = [];
  for (let i = 0; i < fixtures.length; i++) {
    const fix = fixtures[i];
    const m = normNome(fix.mandante);
    const v = normNome(fix.visitante);

    if (!timesDisp.includes(m) || !timesDisp.includes(v)) {
      log(`  ${i + 1}. ${fix.mandante} vs ${fix.visitante}: NÃO ENCONTRADO no Especialista`, 'warn');
      continue;
    }

    const dados = await extrairProjecao(pageEsp, m, v);
    if (dados) {
      projecoes.push(dados);
      log(`  ${i + 1}. ${m} vs ${v}: xC=${dados.xCornersFT} | ${dados.sniperFT} | ${dados.rcVencedor}·${dados.rcFaixa}`, 'taleb');
    } else {
      log(`  ${i + 1}. ${m} vs ${v}: DADOS INSUFICIENTES`, 'warn');
    }
  }

  if (projecoes.length === 0) { log('Nenhuma projeção válida.', 'warn'); return null; }

  // 4. Gerar relatório
  const relatorio = gerarRelatorio(liga, projecoes);
  const nomeLimpo = liga.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
  const nomeArquivo = `Relatorio-CisneNegro-${nomeLimpo}.txt`;
  const caminhoRelatorio = path.join(relatoriosDir, nomeArquivo);
  if (!fs.existsSync(relatoriosDir)) fs.mkdirSync(relatoriosDir, { recursive: true });
  fs.writeFileSync(caminhoRelatorio, relatorio, 'utf-8');
  log(`Relatório salvo: ${nomeArquivo}`, 'success');

  // 5. Auto-auditoria
  const cisneCount = (relatorio.match(/CISNE NEGRO/g) || []).length - 2; // minus header mentions
  log(`AUDITORIA: ${projecoes.length} jogos | Cisne Negro: ${Math.max(0, cisneCount)} mercados`, projecoes.length > 0 ? 'success' : 'error');

  return { liga: codigoLiga, nome: liga.nome, jogos: projecoes.length, arquivo: nomeArquivo };
}

// ═══════════════════════════════════════════════════════
//  ENTRY POINT
// ═══════════════════════════════════════════════════════
(async () => {
  const args = process.argv.slice(2);
  let ligasParaProcessar = [];

  if (args.includes('--todas')) {
    ligasParaProcessar = Object.keys(LIGAS);
  } else if (args.includes('--liga')) {
    const idx = args.indexOf('--liga');
    const codigo = (args[idx + 1] || '').toUpperCase();
    if (LIGAS[codigo]) ligasParaProcessar = [codigo];
    else { console.log(`Liga inválida. Disponíveis: ${Object.keys(LIGAS).join(', ')}`); process.exit(1); }
  } else {
    console.log('\n🦢 AGENTE NASSIM TALEB v2 — Analista Cisne Negro\n');
    console.log('USO:');
    Object.entries(LIGAS).forEach(([k, v]) => console.log(`  node agente-nassim-taleb.js --liga ${k}  (${v.nome})`));
    console.log('  node agente-nassim-taleb.js --todas');
    process.exit(0);
  }

  console.log('\n═════════════════════════════════════════════════════════');
  console.log('🦢 AGENTE NASSIM TALEB v2 — Analista Cisne Negro');
  console.log(`   Ligas: ${ligasParaProcessar.join(', ')}`);
  console.log('═════════════════════════════════════════════════════════');

  // Browser para FlashScore (fixtures)
  const browserFlash = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });

  // Browser para Especialista em Cantos (projeções)
  const browserEsp = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--window-size=1366,900']
  });
  const pageEsp = await browserEsp.newPage();
  await pageEsp.goto(`file:///${especialistaPath.replace(/\\/g, '/')}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(3000);
  log('Especialista em Cantos carregado!', 'success');

  const resultados = [];

  for (const liga of ligasParaProcessar) {
    try {
      const result = await processarLiga(liga, browserFlash, pageEsp);
      if (result) resultados.push(result);
    } catch (err) {
      log(`Erro na liga ${liga}: ${err.message}`, 'error');
    }
    if (ligasParaProcessar.indexOf(liga) < ligasParaProcessar.length - 1) await delay(3000);
  }

  await browserFlash.close();
  await browserEsp.close();

  console.log('\n═══════════════════════════════ SUMÁRIO ═══════════════════════════════');
  resultados.forEach(r => console.log(`  ✅ ${r.nome}: ${r.jogos} jogos → ${r.arquivo}`));
  console.log(`  Total: ${resultados.length} relatórios`);
  console.log('═════════════════════════════════════════════════════════════════════════');
})();
