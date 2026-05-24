/**
 * Auditoria de qualidade — 7 ligas novas coletadas em 29/04/2026.
 * Lê os arquivos <liga>2026.js, calcula estatísticas e gera relatório markdown.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'EDS-Analise-ODDS', 'especialista-cantos', 'data');
const HOJE = new Date().toISOString().split('T')[0];

const LIGAS = [
  { cod: 'BR_B',    nome: 'Brasileirão Série B',                          arq: 'brasileiraoB2026.js', vjs: 'DADOS_BR_B',    flag: '🇧🇷' },
  { cod: 'J2',      nome: 'J2 League (sozinha)',                          arq: 'j2league2026.js',     vjs: 'DADOS_J2',      flag: '🇯🇵' },
  { cod: 'ARG_M',   nome: 'Primera B Metropolitana (Argentina)',          arq: 'metropolitana2026.js',vjs: 'DADOS_ARG_M',   flag: '🇦🇷' },
  { cod: 'CHN_1',   nome: 'China League One (2ª div)',                    arq: 'chinaone2026.js',     vjs: 'DADOS_CHN_1',   flag: '🇨🇳' },
  { cod: 'CHN_2',   nome: 'China League Two (3ª div)',                    arq: 'chinatwo2026.js',     vjs: 'DADOS_CHN_2',   flag: '🇨🇳' },
  { cod: 'CHN_SUP', nome: 'Chinese Super League (1ª div)',                arq: 'chinasuper2026.js',   vjs: 'DADOS_CHN_SUP', flag: '🇨🇳' },
  { cod: 'J2_J3',   nome: 'J2/J3 League (combinada — 4 federações)',      arq: 'j2j3league2026.js',   vjs: 'DADOS_J2_J3',   flag: '🇯🇵' },
];

function carregarLiga(arq, vjs) {
  const p = path.join(DATA_DIR, arq);
  if (!fs.existsSync(p)) return null;
  const code = fs.readFileSync(p, 'utf8');
  const re = new RegExp(`window\\.${vjs}\\s*=\\s*(\\{[\\s\\S]+\\})\\s*;?\\s*$`);
  const m = code.match(re);
  if (!m) return null;
  return JSON.parse(m[1]);
}

function fmt(n, casas = 2) {
  if (n === 'N/A' || n == null || isNaN(n)) return 'N/A';
  return Number(n).toFixed(casas);
}

function mediana(arr) {
  if (!arr.length) return 'N/A';
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function auditarLiga(liga, dados) {
  const jogos = dados.jogos || [];
  const times = dados.times || [];

  // Datas
  const datas = jogos.map(j => j.data).filter(Boolean).sort();
  const dataMin = datas[0] || 'N/A';
  const dataMax = datas[datas.length - 1] || 'N/A';

  // Datas fora de 2026 (vazamento)
  const datasForaTemp = datas.filter(d => !/^2026-/.test(d));

  // Rodadas
  const rodadas = jogos.map(j => j.rodada).filter(r => r != null);
  const rodadaMax = rodadas.length ? Math.max(...rodadas) : null;

  // Cantos FT (total m+v)
  const cantosFT = [];
  let cantos0 = 0;
  let cantosNull = 0;
  jogos.forEach(j => {
    const c = j.cantos?.ft;
    if (!c || c.m == null || c.v == null) { cantosNull++; return; }
    const t = c.m + c.v;
    cantosFT.push(t);
    if (t === 0) cantos0++;
  });

  const cantosTotal = cantosFT.reduce((s, v) => s + v, 0);
  const cantosMedia = cantosFT.length ? cantosTotal / cantosFT.length : 0;
  const cantosMin = cantosFT.length ? Math.min(...cantosFT) : 0;
  const cantosMax = cantosFT.length ? Math.max(...cantosFT) : 0;
  const cantosMed = mediana(cantosFT);

  // Cantos HT
  const cantosHT = [];
  jogos.forEach(j => {
    const c = j.cantos?.ht;
    if (!c || c.m == null || c.v == null) return;
    cantosHT.push(c.m + c.v);
  });
  const cantosHTMedia = cantosHT.length ? cantosHT.reduce((s, v) => s + v, 0) / cantosHT.length : 0;

  // Placar
  const semPlacar = jogos.filter(j => !j.placar || j.placar.m == null).length;
  const golsFT = jogos.map(j => j.placar && j.placar.m != null ? j.placar.m + j.placar.v : null).filter(v => v != null);
  const mediaGols = golsFT.length ? golsFT.reduce((s, v) => s + v, 0) / golsFT.length : 0;

  // Match IDs
  const matchIds = jogos.map(j => j.match_id).filter(Boolean);
  const idsUnicos = new Set(matchIds);
  const dups = matchIds.length - idsUnicos.size;

  // Times: contagem por time
  const jogosPorTime = {};
  jogos.forEach(j => {
    if (j.mandante) jogosPorTime[j.mandante] = (jogosPorTime[j.mandante] || 0) + 1;
    if (j.visitante) jogosPorTime[j.visitante] = (jogosPorTime[j.visitante] || 0) + 1;
  });

  const timesNosJogos = new Set(Object.keys(jogosPorTime));
  const timesNoArray = new Set(times);
  const timesFaltando = [...timesNoArray].filter(t => !timesNosJogos.has(t));
  const timesExtras = [...timesNosJogos].filter(t => !timesNoArray.has(t));

  const jogosPorTimeOrd = Object.entries(jogosPorTime).sort((a, b) => b[1] - a[1]);
  const top3 = jogosPorTimeOrd.slice(0, 3);
  const bot3 = jogosPorTimeOrd.slice(-3).reverse();

  // Top jogos por cantos
  const jogosComCantos = jogos
    .filter(j => j.cantos?.ft && j.cantos.ft.m != null)
    .map(j => ({ ...j, totalC: j.cantos.ft.m + j.cantos.ft.v }))
    .sort((a, b) => b.totalC - a.totalC);

  const top3MaisCantos = jogosComCantos.slice(0, 3);

  return {
    totalJogos: jogos.length,
    totalTimes: times.length,
    timesNosJogos: timesNosJogos.size,
    dataMin, dataMax, datasForaTemp: datasForaTemp.length,
    rodadaMax,
    cantos: {
      media: cantosMedia, mediana: cantosMed, min: cantosMin, max: cantosMax,
      jogos0: cantos0, jogosNull: cantosNull,
      htMedia: cantosHTMedia,
      total: cantosFT.length
    },
    placar: { semPlacar, mediaGols, total: golsFT.length },
    duplicados: dups,
    timesFaltando, timesExtras,
    top3, bot3, top3MaisCantos
  };
}

const linhas = [];
linhas.push(`# 🔍 AUDITORIA DE QUALIDADE — 7 LIGAS NOVAS (${HOJE})\n`);
linhas.push(`Análise automática dos 7 arquivos \`<liga>2026.js\` em \`EDS-Analise-ODDS/especialista-cantos/data/\`.\n`);
linhas.push(`---\n`);

// SUMÁRIO GERAL
linhas.push(`## 📊 Sumário comparativo\n`);
linhas.push(`| Liga | Jogos | Times tabela | Times c/ jogos | Datas | Rodadas | Média cantos FT | Mín/Máx | Cantos 0-0 | Sem placar | IDs dup |`);
linhas.push(`|---|---|---|---|---|---|---|---|---|---|---|`);

const todas = [];
for (const liga of LIGAS) {
  const dados = carregarLiga(liga.arq, liga.vjs);
  if (!dados) {
    linhas.push(`| ${liga.flag} ${liga.cod} | ❌ ARQUIVO NÃO ENCONTRADO | | | | | | | | | |`);
    continue;
  }
  const a = auditarLiga(liga, dados);
  todas.push({ liga, dados, a });
  linhas.push(
    `| ${liga.flag} **${liga.cod}** | ${a.totalJogos} | ${a.totalTimes} | ${a.timesNosJogos} | ${a.dataMin} → ${a.dataMax} | ${a.rodadaMax || '?'} | **${fmt(a.cantos.media)}** | ${a.cantos.min}/${a.cantos.max} | ${a.cantos.jogos0} (${fmt((a.cantos.jogos0/a.cantos.total)*100, 0)}%) | ${a.placar.semPlacar} | ${a.duplicados} |`
  );
}
linhas.push('');

// DETALHES POR LIGA
linhas.push(`---\n## 📋 Detalhes por liga\n`);

for (const { liga, dados, a } of todas) {
  linhas.push(`### ${liga.flag} ${liga.nome} (\`${liga.cod}\`)\n`);
  linhas.push(`**Arquivo:** [\`${liga.arq}\`](EDS-Analise-ODDS/especialista-cantos/data/${liga.arq}) · **Variável:** \`window.${liga.vjs}\`\n`);

  linhas.push(`**Resumo:**`);
  linhas.push(`- Jogos coletados: **${a.totalJogos}**`);
  linhas.push(`- Times no array \`times[]\`: ${a.totalTimes}`);
  linhas.push(`- Times únicos que apareceram em jogos: ${a.timesNosJogos}`);
  if (a.timesFaltando.length > 0) linhas.push(`  - ⚠️ **Times no array sem jogos:** ${a.timesFaltando.join(', ')}`);
  if (a.timesExtras.length > 0) linhas.push(`  - ⚠️ **Times em jogos fora do array:** ${a.timesExtras.join(', ')}`);
  linhas.push(`- Datas: **${a.dataMin}** → **${a.dataMax}**`);
  if (a.datasForaTemp > 0) linhas.push(`  - 🚨 **${a.datasForaTemp} jogos com data fora de 2026** (vazamento de temp anterior)`);
  linhas.push(`- Rodadas detectadas: **${a.rodadaMax || '?'}**`);
  linhas.push(`- Match IDs duplicados: **${a.duplicados}** ${a.duplicados === 0 ? '✅' : '🚨'}`);
  linhas.push('');

  linhas.push(`**Cantos FT:**`);
  linhas.push(`- Média: **${fmt(a.cantos.media)}** cantos/jogo · Mediana: ${a.cantos.mediana}`);
  linhas.push(`- Mín: ${a.cantos.min} · Máx: ${a.cantos.max}`);
  linhas.push(`- Jogos com **0 cantos** (suspeitos): **${a.cantos.jogos0}** (${fmt((a.cantos.jogos0/a.cantos.total)*100, 1)}%)`);
  if (a.cantos.jogosNull > 0) linhas.push(`- Jogos sem dado de cantos: ${a.cantos.jogosNull}`);
  linhas.push(`- Média HT (1º tempo): ${fmt(a.cantos.htMedia)}`);
  linhas.push('');

  linhas.push(`**Placar:**`);
  linhas.push(`- Jogos com placar válido: ${a.placar.total}/${a.totalJogos}`);
  if (a.placar.semPlacar > 0) linhas.push(`- 🚨 **${a.placar.semPlacar} jogos sem placar**`);
  linhas.push(`- Média de gols/jogo: **${fmt(a.placar.mediaGols)}**`);
  linhas.push('');

  linhas.push(`**Distribuição de jogos por time:**`);
  linhas.push(`- 🥇 Mais jogos: ${a.top3.map(([t, n]) => `${t} (${n})`).join(', ')}`);
  linhas.push(`- 📉 Menos jogos: ${a.bot3.map(([t, n]) => `${t} (${n})`).join(', ')}`);
  linhas.push('');

  if (a.top3MaisCantos.length > 0) {
    linhas.push(`**Top 3 jogos com mais cantos:**`);
    a.top3MaisCantos.forEach(j => {
      const c = j.cantos.ft;
      linhas.push(`- ${j.data || '?'} · **${j.mandante} ${c.m} – ${c.v} ${j.visitante}** (total ${c.m + c.v})`);
    });
    linhas.push('');
  }

  linhas.push(`---\n`);
}

// VEREDITO
linhas.push(`## 🩺 Veredito de qualidade\n`);
const todosOK = todas.every(({ a }) => a.duplicados === 0 && a.datasForaTemp === 0);
linhas.push(`- **Match IDs duplicados:** ${todosOK ? 'nenhuma liga com duplicatas ✅' : '⚠️ Verificar tabela acima'}`);

const totalJogos = todas.reduce((s, { a }) => s + a.totalJogos, 0);
const totalCantos0 = todas.reduce((s, { a }) => s + a.cantos.jogos0, 0);
const totalSemPlacar = todas.reduce((s, { a }) => s + a.placar.semPlacar, 0);
linhas.push(`- **Total de jogos auditados:** ${totalJogos}`);
linhas.push(`- **Jogos com 0 cantos no FT:** ${totalCantos0} (${fmt((totalCantos0/totalJogos)*100, 1)}%)`);
linhas.push(`- **Jogos sem placar:** ${totalSemPlacar}`);
linhas.push('');
linhas.push(`### O que olhar:`);
linhas.push(`1. **Times sem jogos** (se aparecer): time foi rebaixado/desligou? Ou problema na coleta?`);
linhas.push(`2. **Datas fora de 2026** (se aparecer): vazamento da temp 2025 — precisa filtrar.`);
linhas.push(`3. **Jogos com 0 cantos**: se >5%, pode haver bug de extração.`);
linhas.push(`4. **Distribuição por time**: se um time tem MUITO menos jogos que os outros, scrape pode ter falhado.`);
linhas.push(`5. **Média de cantos**: se for muito baixa (<7) ou muito alta (>14), revisar.`);

const out = path.join(__dirname, `AUDITORIA_QUALIDADE_${HOJE}.md`);
fs.writeFileSync(out, linhas.join('\n'));
console.log(`✅ Auditoria gerada: ${out}`);
console.log(`   ${todas.length}/7 ligas auditadas, ${totalJogos} jogos analisados.`);
