/**
 * Limpar Competições Contaminadas
 * EDS Soluções Inteligentes
 *
 * Remove jogos de competições externas (Copa Libertadores, Copa Argentina, etc.)
 * dos arquivos de histórico do Especialista em Cantos.
 *
 * Critério: mandante E visitante devem estar na lista de "times" da liga.
 * Se algum dos dois não está, o jogo é de outra competição → remove.
 */

const fs   = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'especialista-cantos', 'data');

const ARQUIVOS = [
  { arquivo: 'argentina2026.js',   variavel: 'DADOS_ARG', liga: 'ARG' },
  { arquivo: 'usl2026.js',         variavel: 'DADOS_USL', liga: 'USL' },
  { arquivo: 'mls2026.js',         variavel: 'DADOS_MLS', liga: 'MLS' },
  { arquivo: 'brasileirao2026.js', variavel: 'DADOS_BR',  liga: 'BR'  },
  { arquivo: 'bundesliga2026.js', variavel: 'DADOS_BUN', liga: 'BUN' },
];

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  🧹 LIMPEZA DE COMPETIÇÕES CONTAMINADAS             ║');
console.log('║  EDS Soluções Inteligentes                          ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

let totalGeral = 0;
let removidosGeral = 0;

ARQUIVOS.forEach(({ arquivo, variavel, liga }) => {
  const caminho = path.join(BASE, arquivo);

  if (!fs.existsSync(caminho)) {
    console.log(`  ❌ ${arquivo} — NÃO ENCONTRADO\n`);
    return;
  }

  // Ler e parsear o arquivo .js (formato: window.DADOS_XX = {...};)
  let raw = fs.readFileSync(caminho, 'utf-8');

  // Parsear usando eval (os arquivos usam JS objects, nem sempre JSON válido)
  let dados;
  try {
    // Simular window para que window.DADOS_XX = ... funcione
    const window = {};
    const module_backup = { exports: {} };
    const DADOS_2026 = null;
    // Injetar variáveis globais para que window.DADOS_XX e module.exports funcionem
    const varNames = ['DADOS_ARG','DADOS_USL','DADOS_MLS','DADOS_BR','DADOS_ECU','DADOS_2026'];
    const varDecls = varNames.map(v => `var ${v};`).join('\n');
    const fn = new Function('window', 'module', varDecls + '\n' + raw + `\nreturn window;`);
    const resultado = fn({}, module_backup, null);
    // Pegar o primeiro valor do objeto window
    dados = resultado[variavel] || Object.values(resultado)[0];
    if (!dados) {
      // Fallback: tentar extrair entre { e }
      const inicio = raw.indexOf('{');
      const fim    = raw.lastIndexOf('}');
      const jsonStr = raw.substring(inicio, fim + 1)
        .replace(/(\w+)\s*:/g, '"$1":')  // chaves sem aspas -> com aspas
        .replace(/'/g, '"');              // aspas simples -> duplas
      dados = JSON.parse(jsonStr);
    }
  } catch (e) {
    console.log(`  ❌ ${arquivo} — erro ao parsear: ${e.message}\n`);
    return;
  }

  const times = dados.times || [];
  const jogosAntes = dados.jogos ? dados.jogos.length : 0;

  if (times.length === 0) {
    console.log(`  ⚠️  ${arquivo} — sem lista de times, pulando\n`);
    return;
  }

  // Criar Set para busca O(1)
  const timesSet = new Set(times.map(t => t.toLowerCase().trim()));

  // Filtrar: manter só jogos onde AMBOS os times estão na lista
  const jogosLimpos = [];
  const jogosRemovidos = [];

  (dados.jogos || []).forEach(jogo => {
    const m = (jogo.mandante || '').toLowerCase().trim();
    const v = (jogo.visitante || '').toLowerCase().trim();

    if (timesSet.has(m) && timesSet.has(v)) {
      jogosLimpos.push(jogo);
    } else {
      jogosRemovidos.push(jogo);
    }
  });

  const removidos = jogosAntes - jogosLimpos.length;
  totalGeral += jogosAntes;
  removidosGeral += removidos;

  // Atualizar dados
  dados.jogos = jogosLimpos;
  dados.ultimaAtualizacao = new Date().toISOString().split('T')[0];

  // Reescrever o arquivo no formato original (window.DADOS_XX = {...};)
  const headerMatch = raw.match(/^[\s\S]*?window\.\w+\s*=\s*/);
  const header = headerMatch ? headerMatch[0] : `window.${variavel} = `;
  // Detectar se havia module.exports no final
  const hasModuleExports = raw.includes('module.exports');
  const jsonStr = JSON.stringify(dados, null, 2);
  let output = header + jsonStr + ';\n';
  if (hasModuleExports) {
    const exportMatch = raw.match(/if\s*\(typeof module[\s\S]*$/);
    if (exportMatch) output += '\n' + exportMatch[0];
  }
  fs.writeFileSync(caminho, output, 'utf-8');

  // Reportar
  console.log(`  📋 ${liga} (${arquivo})`);
  console.log(`     Times registrados: ${times.length}`);
  console.log(`     Jogos antes:       ${jogosAntes}`);
  console.log(`     Jogos removidos:   ${removidos}${removidos > 0 ? ' ⚠️' : ' ✅'}`);
  console.log(`     Jogos limpos:      ${jogosLimpos.length}`);

  if (jogosRemovidos.length > 0) {
    console.log(`     Jogos eliminados:`);
    jogosRemovidos.forEach(j => {
      console.log(`       ❌ ${j.mandante} vs ${j.visitante} (Rod ${j.rodada || '?'}, ${j.data || '?'})`);
    });
  }
  console.log('');
});

console.log('═══════════════════════════════════════════════════════');
console.log(`  TOTAL: ${totalGeral} jogos analisados, ${removidosGeral} removidos`);
console.log('═══════════════════════════════════════════════════════');
console.log('\n🏁 Limpeza concluída!');
