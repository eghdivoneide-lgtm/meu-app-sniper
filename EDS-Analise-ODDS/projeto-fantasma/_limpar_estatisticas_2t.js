/**
 * LIMPADOR — remove o campo `estatisticas_2t` (corrompido — armazenava HT+FT em vez de 2T real)
 *
 * Escopo:
 *   - JSONs ricos em projeto-fantasma/rodadas/<LIGA>/
 *   - JSONs ricos em EDS-Analise-ODDS/Analise-Refinada/<LIGA>/
 *   - Bancos em especialista-cantos/data/*.js (3 cópias: EDS-Analise-ODDS/, MEU APP/, Yaaken-Scanner/)
 *
 * Para cada jogo:
 *   - delete j.estatisticas_2t
 *   - se j.meta existir, registra j.meta.estatisticas_2t_removida = true (auditoria)
 *
 * Backup automático antes de cada escrita.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const ts   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

const LIGAS = ['BR', 'BR_B', 'MLS', 'USL', 'ARG', 'ARG_B', 'BUN', 'J2J3'];
const ARQUIVOS_BANCO = {
  BR:'brasileirao2026.js', BR_B:'brasileiraoB2026.js', MLS:'mls2026.js',
  USL:'usl2026.js', ARG:'argentina2026.js', ARG_B:'argentina_b2026.js',
  BUN:'bundesliga2026.js', J2J3:'j2j3league2026.js'
};
const VAR_JS = {
  BR:'DADOS_BR', BR_B:'DADOS_BR_B', MLS:'DADOS_MLS', USL:'DADOS_USL',
  ARG:'DADOS_ARG', ARG_B:'DADOS_ARG_B', BUN:'DADOS_BUN', J2J3:'DADOS_J2_J3'
};
const PASTAS_BANCO = [
  'EDS-Analise-ODDS/especialista-cantos/data',
  'especialista-cantos/data',
  'EDS-Analise-ODDS/Yaaken-Scanner/yaaken-data'
];

let totalArqProcessados = 0;
let totalJogosLimpos    = 0;
let totalJogosJaLimpos  = 0;

// ─── Helper: limpa array de jogos ───
function limparJogos(jogos) {
  let limpos = 0, jaLimpos = 0;
  jogos.forEach(j => {
    if (j.estatisticas_2t) {
      delete j.estatisticas_2t;
      limpos++;
      if (j.meta) j.meta.estatisticas_2t_removida = true;
    } else {
      jaLimpos++;
    }
  });
  return { limpos, jaLimpos };
}

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  🧹 LIMPEZA: remover campo estatisticas_2t (bug HT+FT)');
console.log('═══════════════════════════════════════════════════════');
console.log('');

// ─── 1. JSONs em projeto-fantasma/rodadas/<LIGA>/ ───
console.log('▸ Fase 1: projeto-fantasma/rodadas/<LIGA>/*.json');
LIGAS.forEach(liga => {
  const pasta = path.join(__dirname, 'rodadas', liga);
  if (!fs.existsSync(pasta)) return;
  const arquivos = fs.readdirSync(pasta).filter(f =>
    f.endsWith('.json') && !f.includes('.backup_') && !f.includes('_log')
  );
  if (arquivos.length === 0) return;
  let ligaLimpos = 0;
  arquivos.forEach(f => {
    const full = path.join(pasta, f);
    const raw = JSON.parse(fs.readFileSync(full, 'utf8'));
    const jogos = Array.isArray(raw) ? raw : Object.values(raw);
    const { limpos, jaLimpos } = limparJogos(jogos);
    if (limpos > 0) {
      fs.copyFileSync(full, full + '.backup_' + ts);
      fs.writeFileSync(full, JSON.stringify(Array.isArray(raw) ? jogos : raw, null, 2));
    }
    ligaLimpos += limpos;
    totalArqProcessados++;
    totalJogosJaLimpos += jaLimpos;
  });
  console.log(`  ${liga.padEnd(7)} → ${arquivos.length} arquivos | ${ligaLimpos} jogos limpos`);
  totalJogosLimpos += ligaLimpos;
});
console.log('');

// ─── 2. JSONs em Analise-Refinada/<LIGA>/ ───
console.log('▸ Fase 2: Analise-Refinada/<LIGA>/*.json');
const rootRefinada = path.join(__dirname, '..', 'Analise-Refinada');
if (fs.existsSync(rootRefinada)) {
  LIGAS.forEach(liga => {
    const pasta = path.join(rootRefinada, liga);
    if (!fs.existsSync(pasta)) return;
    const arquivos = fs.readdirSync(pasta).filter(f =>
      f.endsWith('.json') && !f.includes('.backup_')
    );
    if (arquivos.length === 0) return;
    let ligaLimpos = 0;
    arquivos.forEach(f => {
      const full = path.join(pasta, f);
      const raw = JSON.parse(fs.readFileSync(full, 'utf8'));
      const jogos = Array.isArray(raw) ? raw : (raw.jogos || Object.values(raw));
      if (!Array.isArray(jogos)) return;
      const { limpos } = limparJogos(jogos);
      if (limpos > 0) {
        fs.copyFileSync(full, full + '.backup_' + ts);
        if (Array.isArray(raw)) {
          fs.writeFileSync(full, JSON.stringify(jogos, null, 2));
        } else {
          fs.writeFileSync(full, JSON.stringify(raw, null, 2));
        }
      }
      ligaLimpos += limpos;
      totalArqProcessados++;
    });
    if (ligaLimpos > 0 || arquivos.length > 0) {
      console.log(`  ${liga.padEnd(7)} → ${arquivos.length} arquivos | ${ligaLimpos} jogos limpos`);
    }
    totalJogosLimpos += ligaLimpos;
  });
}
console.log('');

// ─── 3. Bancos (especialista-cantos/data/*.js) ───
console.log('▸ Fase 3: bancos especialista-cantos/data/*.js (3 caminhos)');
LIGAS.forEach(liga => {
  const arquivo = ARQUIVOS_BANCO[liga];
  const varJS   = VAR_JS[liga];

  const alvos = PASTAS_BANCO
    .map(p => path.join(ROOT, p, arquivo))
    .filter(p => fs.existsSync(p));

  if (alvos.length === 0) return;

  let ligaTotal = 0;
  alvos.forEach(alvo => {
    const src = fs.readFileSync(alvo, 'utf8');
    const sandbox = { window: {} };
    const code = src.replace(/^\s*\/\/.*$/gm, '');
    try {
      new Function('window', code)(sandbox.window);
    } catch (e) {
      console.log(`  ⚠️  Erro lendo ${alvo}: ${e.message}`);
      return;
    }
    const dados = sandbox.window[varJS];
    if (!dados || !Array.isArray(dados.jogos)) return;

    const { limpos } = limparJogos(dados.jogos);

    if (limpos > 0) {
      fs.copyFileSync(alvo, alvo + '.backup_' + ts);
      const out =
        '// ============================================================\n' +
        `// ${liga} 2026 — Limpeza estatisticas_2t (bug HT+FT removido)\n` +
        `// ${dados.jogos.length} jogos | Atualizado: ${new Date().toISOString().slice(0,10)}\n` +
        '// ============================================================\n\n' +
        `window.${varJS} = ${JSON.stringify(dados, null, 2)};\n`;
      fs.writeFileSync(alvo, out);
    }
    ligaTotal += limpos;
    totalArqProcessados++;
  });
  console.log(`  ${liga.padEnd(7)} → ${alvos.length} bancos | ${ligaTotal} jogos limpos (cumulativo)`);
  totalJogosLimpos += ligaTotal;
});

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  🏁 RESUMO');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Arquivos processados:     ${totalArqProcessados}`);
console.log(`  Jogos limpos (estatisticas_2t removido): ${totalJogosLimpos}`);
console.log(`  Jogos já sem o campo:     ${totalJogosJaLimpos}`);
console.log('');
console.log(`  Backups gravados com timestamp: ${ts}`);
