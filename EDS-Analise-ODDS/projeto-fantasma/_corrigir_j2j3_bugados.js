/**
 * Corrige o jogo bugado em j2j3league2026.js (match_id: IgtRrUhB)
 * Mandante e visitante vieram com strings absurdas em vez de nomes de times.
 * Re-extrai via FlashscoreMonster e substitui o registro corrompido.
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');

const ARQUIVO = path.join(__dirname, '..', 'especialista-cantos', 'data', 'j2j3league2026.js');
const ID_BUGADO = 'IgtRrUhB';

function parseFt(s) {
  if (!s || typeof s !== 'string' || !s.includes(' - ')) return null;
  const [m, v] = s.split(' - ').map(x => parseInt(x));
  if (isNaN(m) || isNaN(v)) return null;
  return { m, v };
}

(async () => {
  // Carregar arquivo atual
  const code = fs.readFileSync(ARQUIVO, 'utf8');
  const m = code.match(/window\.DADOS_J2_J3\s*=\s*(\{[\s\S]+\})\s*;?\s*$/);
  if (!m) { console.error('❌ Não conseguiu parsear j2j3league2026.js'); process.exit(1); }
  const dados = JSON.parse(m[1]);

  const idxBugado = dados.jogos.findIndex(j => j.match_id === ID_BUGADO);
  if (idxBugado === -1) { console.error(`❌ Jogo ${ID_BUGADO} não encontrado`); process.exit(1); }

  console.log(`📋 Jogo bugado encontrado no índice ${idxBugado}:`);
  console.log(`   Mandante atual:  ${dados.jogos[idxBugado].mandante}`);
  console.log(`   Visitante atual: ${dados.jogos[idxBugado].visitante}`);
  console.log(`   Placar atual:    ${JSON.stringify(dados.jogos[idxBugado].placar)}`);

  // Re-extrair
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  console.log(`\n👻 Re-extraindo via FlashscoreMonster...`);
  const url = `https://www.flashscore.com/match/${ID_BUGADO}/#/match-summary`;
  const partida = await fantasma.extrairPartida(url, {
    liga: 'J2/J3 League (Japão — 4 federações regionais)',
    codigo_liga: 'J2_J3'
  });

  if (!partida || !partida.estatisticas_ft || !partida.estatisticas_ft.cantos) {
    console.log(`❌ Falha ao re-extrair: cantos não vieram`);
    await browser.close();
    process.exit(1);
  }

  const ft = parseFt(partida.placar?.ft);
  const ht = parseFt(partida.placar?.ht);
  const eft = partida.estatisticas_ft || {};
  const eht = partida.estatisticas_ht || {};

  // Construir registro no formato do arquivo (igual ao varredor-por-time)
  const novoJogo = {
    match_id: partida.match_id,
    mandante: partida.mandante,
    visitante: partida.visitante,
    rodada: dados.jogos[idxBugado].rodada, // preservar
    data: partida.data_partida ? partida.data_partida.split('T')[0] : null,
    placar: ft,
    tabela: dados.jogos[idxBugado].tabela, // preservar (pode ser null)
    cantos: {
      ht: { m: eht.cantos?.m || 0, v: eht.cantos?.v || 0 },
      ft: { m: eft.cantos.m, v: eft.cantos.v }
    },
    stats_taticas: (eft.posse && eft.finalizacoes) ? {
      posse: { m: eft.posse.m, v: eft.posse.v },
      finalizacoes: { m: eft.finalizacoes.m, v: eft.finalizacoes.v }
    } : null
  };

  console.log(`\n✅ Re-extração OK:`);
  console.log(`   Mandante:  ${novoJogo.mandante}`);
  console.log(`   Visitante: ${novoJogo.visitante}`);
  console.log(`   Placar HT: ${JSON.stringify(ht)} | FT: ${JSON.stringify(ft)}`);
  console.log(`   Cantos HT: ${novoJogo.cantos.ht.m}-${novoJogo.cantos.ht.v} | FT: ${novoJogo.cantos.ft.m}-${novoJogo.cantos.ft.v}`);

  // Substituir
  dados.jogos[idxBugado] = novoJogo;

  // Atualizar lista de times se nomes novos não estiverem
  const timesSet = new Set(dados.times || []);
  if (novoJogo.mandante) timesSet.add(novoJogo.mandante);
  if (novoJogo.visitante) timesSet.add(novoJogo.visitante);

  // Remover entradas antigas bugadas do array de times
  ['Flashscore', 'Nara Club v Kanazawa 28/03/2026 | Football'].forEach(bad => timesSet.delete(bad));
  dados.times = [...timesSet].sort();

  // Salvar
  const conteudo =
    `// ============================================================\n` +
    `// J2/J3 LEAGUE (JAPÃO — 4 FEDERAÇÕES REGIONAIS) 2026 — MOTOR FANTASMA v5 (por time)\n` +
    `// Atualizado: ${new Date().toISOString().split('T')[0]} — correção de jogo bugado ${ID_BUGADO}\n` +
    `// ============================================================\n\n` +
    `window.DADOS_J2_J3 = ` + JSON.stringify(dados, null, 2) + `;\n`;

  // Backup antes de salvar
  const backupPath = ARQUIVO + '.backup_pre_correcao_' + Date.now();
  fs.copyFileSync(ARQUIVO, backupPath);
  console.log(`\n💾 Backup salvo: ${path.basename(backupPath)}`);

  fs.writeFileSync(ARQUIVO, conteudo, 'utf8');
  console.log(`✅ Arquivo corrigido: ${ARQUIVO}`);

  await browser.close();
  console.log(`\n🏁 Correção concluída.`);
})().catch(e => {
  console.error('💥 Erro:', e);
  process.exit(1);
});
