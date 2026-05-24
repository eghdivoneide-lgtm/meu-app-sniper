/**
 * Corrige 2 jogos com placar "Indisponível":
 *   - Werder Bremen × Augsburg (BUN) — match Kd5f8Z4F
 *   - Vila Nova × Athletic Club (BR_B) — match GUGqk0PP
 *
 * Re-extrai via FlashscoreMonster e atualiza JSONs em-place.
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const FlashscoreMonster = require('./flashscore-monster');

const ALVOS = [
  {
    arquivo: 'bun_rodada_2_2026-05-05.json',
    match_id: 'Kd5f8Z4F',
    liga: 'Bundesliga (Alemanha)',
    codigo_liga: 'BUN',
    label: 'Werder × Augsburg'
  },
  {
    arquivo: 'br_b_rodada_2_2026-05-05.json',
    match_id: 'GUGqk0PP',
    liga: 'Brasileirão Série B',
    codigo_liga: 'BR_B',
    label: 'Vila Nova × Athletic'
  }
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
  });
  const fantasma = new FlashscoreMonster();
  fantasma.browser = browser;

  for (const alvo of ALVOS) {
    console.log('\n═══════════════════════════════════════════');
    console.log('🔄 Re-extraindo: ' + alvo.label + ' (' + alvo.match_id + ')');
    console.log('═══════════════════════════════════════════');

    const url = `https://www.flashscore.com/match/${alvo.match_id}/#/match-summary`;
    let novo;
    try {
      novo = await fantasma.extrairPartida(url, {
        liga: alvo.liga,
        codigo_liga: alvo.codigo_liga
      });
    } catch (e) {
      console.log('❌ Falha: ' + e.message);
      continue;
    }

    console.log('   placar HT/FT: ' + JSON.stringify(novo && novo.placar));
    console.log('   cantos FT:    ' + JSON.stringify(novo && novo.estatisticas_ft && novo.estatisticas_ft.cantos));
    console.log('   campos:       ' + (novo && novo.meta && novo.meta.campos_disponiveis));

    // Atualizar JSON em-place
    const caminho = path.join(__dirname, alvo.arquivo);
    const dados = JSON.parse(fs.readFileSync(caminho));
    const idx = dados.findIndex(j => j.match_id === alvo.match_id);
    if (idx === -1) {
      console.log('⚠️  match_id não encontrado em ' + alvo.arquivo);
      continue;
    }
    dados[idx] = novo;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    console.log('✅ Atualizado em ' + alvo.arquivo + ' (índice ' + idx + ')');
  }

  await browser.close();
  console.log('\n🏁 Correção concluída.');
})().catch(e => {
  console.error('💥 Erro fatal:', e.message);
  process.exit(1);
});
