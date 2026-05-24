/**
 * MIGRADOR — Analise-Refinada/
 * Substitui o formato pobre (1 arquivo consolidado) pelo formato rico
 * (espelho de projeto-fantasma/rodadas/<LIGA>/<liga>_rodada_*.json).
 *
 * Regras:
 *   - 8 ligas ativas: BR, BR_B, MLS, USL, ARG, ARG_B, BUN, J2J3
 *   - Apaga *_jogos.json antigo
 *   - Copia todos os arquivos canônicos (pulando *.backup_*.json e *_atual.json)
 *   - Valida contagem de jogos por liga antes/depois
 */
const fs   = require('fs');
const path = require('path');

const ROOT_FANTASMA = path.join(__dirname, 'rodadas');
const ROOT_REFINADA = path.join(__dirname, '..', 'Analise-Refinada');

const LIGAS = ['BR', 'BR_B', 'MLS', 'USL', 'ARG', 'ARG_B', 'BUN', 'J2J3'];

const resumo = [];

for (const liga of LIGAS) {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log(`  ${liga}`);
  console.log('═══════════════════════════════════════════');

  const pastaFantasma = path.join(ROOT_FANTASMA, liga);
  const pastaRefinada = path.join(ROOT_REFINADA, liga);

  if (!fs.existsSync(pastaFantasma)) {
    console.log(`  ⚠️  Pasta fonte não encontrada: rodadas/${liga}`);
    resumo.push({ liga, status: 'FONTE-AUSENTE', arquivos: 0, jogosAntes: 0, jogosDepois: 0 });
    continue;
  }

  // Garante pasta destino
  fs.mkdirSync(pastaRefinada, { recursive: true });

  // Contagem ANTES
  let jogosAntes = 0;
  const arquivosAntigos = fs.readdirSync(pastaRefinada).filter(f => f.endsWith('.json'));
  arquivosAntigos.forEach(f => {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(pastaRefinada, f), 'utf8'));
      const jogos = Array.isArray(raw) ? raw : (raw.jogos || Object.values(raw));
      jogosAntes += Array.isArray(jogos) ? jogos.length : 0;
    } catch (e) {}
  });

  // Apaga arquivos antigos
  arquivosAntigos.forEach(f => {
    fs.unlinkSync(path.join(pastaRefinada, f));
    console.log(`  🗑️  Removido: ${f}`);
  });

  // Lista arquivos canônicos da pasta fantasma
  const arquivosFantasma = fs.readdirSync(pastaFantasma).filter(f => {
    if (!f.endsWith('.json')) return false;
    if (f.includes('.backup_')) return false;   // pula backups
    if (f.includes('_atual.json')) return false; // pula auxiliares
    return true;
  });

  // Copia cada um e conta jogos
  let copiados = 0;
  let jogosDepois = 0;
  arquivosFantasma.forEach(f => {
    const src = path.join(pastaFantasma, f);
    const dst = path.join(pastaRefinada, f);
    fs.copyFileSync(src, dst);
    copiados++;
    try {
      const raw = JSON.parse(fs.readFileSync(dst, 'utf8'));
      const jogos = Array.isArray(raw) ? raw : (raw.jogos || Object.values(raw));
      jogosDepois += Array.isArray(jogos) ? jogos.length : 0;
    } catch (e) {}
  });

  console.log(`  📥 ${copiados} arquivos copiados`);
  console.log(`  📊 Jogos: antes ${jogosAntes} → depois ${jogosDepois}`);

  resumo.push({ liga, status: 'OK', arquivos: copiados, jogosAntes, jogosDepois });
}

console.log('');
console.log('╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║                    RESUMO DA MIGRAÇÃO                                    ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝');
console.log('');

let totalArq = 0, totalJogos = 0;
resumo.forEach(r => {
  console.log(`  ▸ ${r.liga.padEnd(7)} ${r.status.padEnd(15)} → ${r.arquivos} arquivos | ${r.jogosAntes} → ${r.jogosDepois} jogos`);
  totalArq += r.arquivos;
  totalJogos += r.jogosDepois;
});

console.log('');
console.log(`  🎯 TOTAL: ${totalArq} arquivos | ${totalJogos} jogos no novo formato`);
console.log('');
console.log('🏁 Migração concluída.');
