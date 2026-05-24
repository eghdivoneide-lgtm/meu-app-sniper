// ════════════════════════════════════════════════════════════════════
// BACKTEST — Monta a "rodada 11-12/05" a partir dos JSONs do varredor
// (projeto-fantasma) e separa:
//   - input do agente:  lista de jogos (sem placar/cantos)
//   - gabarito real:    resultados reais (cantos FT)
// Saída em ./backtest/rodada_2026-05-12.json + gabarito_2026-05-12.json
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const PASTA_VARREDOR = path.resolve(__dirname, '..', 'projeto-fantasma');
const PASTA_OUT      = path.join(__dirname, 'backtest');
if (!fs.existsSync(PASTA_OUT)) fs.mkdirSync(PASTA_OUT, { recursive: true });

// Map: liga → caminho do JSON da rodada 12/05
const FONTES = [
  { liga: 'BR',    arquivo: 'br_rodada_2_2026-05-12.json' },
  { liga: 'BR_B',  arquivo: 'br_b_rodada_2_2026-05-12.json' },
  { liga: 'MLS',   arquivo: 'mls_rodada_2_2026-05-12.json' },
  { liga: 'ARG',   arquivo: 'arg_rodada_2_2026-05-12.json' },
  { liga: 'ARG_B', arquivo: 'arg_b_rodada_2_2026-05-12.json' },
  { liga: 'BUN',   arquivo: 'bun_rodada_2_2026-05-12.json' }
  // USL: não existe JSON de 12/05; fica fora desse backtest
];

const rodadaInput = [];   // pro agente (sem resultado)
const gabarito    = [];   // resultado real (pra conferir)

for (const fonte of FONTES) {
  const p = path.join(PASTA_VARREDOR, fonte.arquivo);
  if (!fs.existsSync(p)) {
    console.log('⚠️  Pulando ' + fonte.liga + ': arquivo não encontrado ' + p);
    continue;
  }
  let raw;
  try { raw = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.log('❌ ' + fonte.liga + ' parse error: ' + e.message); continue; }

  const jogos = Array.isArray(raw) ? raw : Object.values(raw);
  console.log(fonte.liga.padEnd(6) + ' ' + fonte.arquivo + ' → ' + jogos.length + ' jogos');

  for (const j of jogos) {
    const cantosFT = j.estatisticas_ft?.cantos;
    rodadaInput.push({
      liga:      fonte.liga,
      match_id:  j.match_id || j.id,
      mandante:  j.mandante,
      visitante: j.visitante,
      rodada:    j.rodada || null,
      data:      j.data_partida || null
    });
    gabarito.push({
      liga:      fonte.liga,
      match_id:  j.match_id || j.id,
      mandante:  j.mandante,
      visitante: j.visitante,
      cantos_ft: cantosFT || null,
      placar_ft: j.placar?.ft || null
    });
  }
}

const inputPath    = path.join(PASTA_OUT, 'rodada_2026-05-12.json');
const gabaritoPath = path.join(PASTA_OUT, 'gabarito_2026-05-12.json');
fs.writeFileSync(inputPath,    JSON.stringify(rodadaInput, null, 2));
fs.writeFileSync(gabaritoPath, JSON.stringify(gabarito,    null, 2));

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('Total jogos da rodada (input): ' + rodadaInput.length);
console.log('Total jogos com gabarito:      ' + gabarito.filter(g => g.cantos_ft).length);
console.log('Salvo em:');
console.log('  ' + inputPath);
console.log('  ' + gabaritoPath);
console.log('═══════════════════════════════════════════════════════');
