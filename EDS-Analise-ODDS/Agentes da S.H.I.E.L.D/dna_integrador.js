/**
 * DNA INTEGRADOR — Converte dados do Escoteiro YAAKEN em multiplicadores
 * para o Motor Poisson do Especialista em Cantos
 *
 * Uso:
 *   node dna_integrador.js              (gera dna_escoteiro.js)
 *   node dna_integrador.js --verbose    (mostra detalhes)
 *
 * Saída: especialista-cantos/data/dna_escoteiro.js
 *        EDS-ODDS-TEACHER/data/dna_escoteiro.js
 */

const fs   = require('fs');
const path = require('path');

const escoteiroDir = path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'escoteiro');
const verbose = process.argv.includes('--verbose');

const LIGAS = ['BR', 'MLS', 'ARG', 'USL', 'BUN'];

// Mapeamento perfil → multiplicador de cantos
const PERFIL_MULT = {
  'OFENSIVO_SOLIDO': 1.10,  // ataca bem e se defende → gera cantos acima da média
  'OFENSIVO':        1.05,  // ataca mas nem sempre converte → leve acréscimo
  'CAMISA_ABERTA':   1.15,  // ataca E sofre → jogos com muitos cantos total
  'EQUILIBRADO':     1.00,  // neutro
  'DEFENSIVO':       0.85,  // bloqueia jogo → menos cantos gerados
  'MURO_DUPLO':      0.70,  // não ataca e não sofre → cantos muito abaixo da média
  'VULNERAVEL':      0.90   // sofre mas não gera → cantos do adversário sobem
};

console.log('╔══════════════════════════════════════════════════╗');
console.log('║  🧬 DNA INTEGRADOR — Escoteiro → Motor Poisson   ║');
console.log('╚══════════════════════════════════════════════════╝\n');

const DNA = {};
let totalTimes = 0;

LIGAS.forEach(liga => {
  const files = fs.readdirSync(escoteiroDir).filter(f => f.startsWith('escoteiro_' + liga));
  if (files.length === 0) { console.log(`  ⚠️  ${liga}: sem dados do escoteiro`); return; }

  const latest = files.sort().pop();
  const data = JSON.parse(fs.readFileSync(path.join(escoteiroDir, latest), 'utf-8'));
  const perfis = data.perfis || {};

  DNA[liga] = {};
  let count = 0;

  Object.entries(perfis).forEach(([nome, p]) => {
    const g = p.geral || {};
    const c = p.casa  || {};
    const f = p.fora  || {};

    const multPerfil = PERFIL_MULT[p.perfil] || 1.00;

    // Fator casa/fora — quão diferente o time é fora vs casa
    const deltaCasaFora = (c.gp_jogo || 0) - (f.gp_jogo || 0);
    const multFora = deltaCasaFora > 1.0 ? 0.75 :
                     deltaCasaFora > 0.5 ? 0.85 :
                     deltaCasaFora < -0.3 ? 1.10 :
                     1.00;

    // Fator supressão — time que domina suprime cantos do adversário
    const gpTotal = (g.gp_jogo || 0);
    const gcTotal = (g.gc_jogo || 0);
    const ratioDom = gcTotal > 0 ? gpTotal / gcTotal : 1.0;
    const multSupressao = ratioDom > 2.0 ? 0.75 :
                          ratioDom > 1.5 ? 0.85 :
                          ratioDom < 0.6 ? 1.15 :
                          1.00;

    DNA[liga][nome] = {
      perfil: p.perfil,
      tendencia_empate: p.tendencia_empate,
      forma: (p.forma_recente || []).join(''),
      multPerfil,
      multFora,
      multSupressao,
      casa_v_pct: c.v_pct || 0,
      fora_v_pct: f.v_pct || 0,
      casa_d_pct: c.d_pct || 0,
      fora_d_pct: f.d_pct || 0,
      gp_jogo: g.gp_jogo || 0,
      gc_jogo: g.gc_jogo || 0,
      casa_gp: c.gp_jogo || 0,
      casa_gc: c.gc_jogo || 0,
      fora_gp: f.gp_jogo || 0,
      fora_gc: f.gc_jogo || 0,
      notas: p.notas_yaaken || []
    };
    count++;
  });

  totalTimes += count;
  console.log(`  ✅ ${liga}: ${count} times | Arquivo: ${latest}`);
  if (verbose) {
    const perfisCount = {};
    Object.values(DNA[liga]).forEach(t => { perfisCount[t.perfil] = (perfisCount[t.perfil]||0) + 1; });
    Object.entries(perfisCount).sort((a,b) => b[1]-a[1]).forEach(([p,c]) => console.log(`     ${p}: ${c}`));
  }
});

// Gerar arquivo JS
const output = `// ══════════════════════════════════════════════════════════════
// DNA INTEGRADOR — Perfis do Escoteiro YAAKEN para Motor Poisson
// Gerado automaticamente por dna_integrador.js
// Data: ${new Date().toISOString().split('T')[0]}
// Total: ${totalTimes} times em ${Object.keys(DNA).length} ligas
// ══════════════════════════════════════════════════════════════
window.DNA_ESCOTEIRO = ${JSON.stringify(DNA, null, 2)};
`;

const destinos = [
  path.join(__dirname, '..', 'especialista-cantos', 'data', 'dna_escoteiro.js'),
  path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'data', 'dna_escoteiro.js')
];

destinos.forEach(dest => {
  try {
    fs.writeFileSync(dest, output);
    console.log(`  💾 Salvo: ${path.basename(path.dirname(path.dirname(dest)))}/${path.basename(path.dirname(dest))}/${path.basename(dest)}`);
  } catch (e) {
    console.log(`  ⚠️  Erro ao salvar ${dest}: ${e.message}`);
  }
});

console.log(`\n══════════════════════════════════════════════════`);
console.log(`  🧬 ${totalTimes} times integrados em ${Object.keys(DNA).length} ligas`);
console.log(`══════════════════════════════════════════════════`);
