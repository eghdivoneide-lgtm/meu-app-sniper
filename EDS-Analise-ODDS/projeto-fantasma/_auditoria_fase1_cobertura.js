/**
 * Fase 1 — Mapeamento de cobertura.
 * Para cada liga coletada, lista quais relatórios existem em cada um dos 5 sistemas,
 * destacando os mais recentes e identificando lacunas para a rodada de 02-04/05/2026.
 */
const fs = require('fs');
const path = require('path');

const RAIZ_AUDIT = path.join(__dirname, '..', 'especialista-cantos', 'Auditoria Especialista em cantos');

// Mapeamento: código da liga → pasta da auditoria
const MAP_LIGA_PASTA = {
  BR:     '01_Brasileirão Série A',
  MLS:    '02_Major League Soccer',
  ARG:    '03_Liga Profesional (ARG)',
  USL:    '04_USL Championship',
  BUN:    '05_Bundesliga',
  J1:     '07_J1 League',
  ARG_B:  '10_Primera B (ARG)',
  CHN_SL: '11_Super Liga China',
  CHN_L1: '12_Liga One China',
  BR_B:   '13_Brasileirão Série B',
  J2J3:   '14_J2-J3 Japão'
};

const SISTEMAS = [
  ['CISNE',     '01_Rodadas Cisne Negro',    'CisneNegro'],
  ['TEACHER',   '02_Projeção Teacher Rodada', 'Teacher'],
  ['ENIGMA',    '03_Projeção Enigma',         'Enigma'],
  ['VENCEDOR',  '04_Vencedor Cantos',         'VencedorCantos'],
  ['BALA',      '05_Bala de Prata',           'BalaDePrata']
];

// Data de corte: queremos relatório PRÉ-jogo da rodada 02-04/05/2026
// Aceitamos relatórios entre 28/04 e 04/05 (próximos da rodada)
const DATA_INI = '2026-04-28';
const DATA_FIM = '2026-05-05';

function extrairData(nomeArq) {
  const m = nomeArq.match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

const cobertura = {};
const lacunas = [];
const detalhe = [];

for (const [cod, pastaLiga] of Object.entries(MAP_LIGA_PASTA)) {
  cobertura[cod] = {};
  for (const [sigla, sub, prefixo] of SISTEMAS) {
    const pasta = path.join(RAIZ_AUDIT, pastaLiga, sub);
    if (!fs.existsSync(pasta)) {
      cobertura[cod][sigla] = { existe: false, arq: null, data: null };
      lacunas.push(`${cod} × ${sigla}: pasta inexistente (${pasta})`);
      continue;
    }
    const arquivos = fs.readdirSync(pasta).filter(f => f.endsWith('.html') && !f.startsWith('~$'));
    if (arquivos.length === 0) {
      cobertura[cod][sigla] = { existe: false, arq: null, data: null };
      lacunas.push(`${cod} × ${sigla}: pasta vazia`);
      continue;
    }
    // Pegar o relatório com data dentro do range, mais recente
    const candidatos = arquivos
      .map(f => ({ f, data: extrairData(f) }))
      .filter(x => x.data && x.data >= DATA_INI && x.data <= DATA_FIM)
      .sort((a, b) => b.data.localeCompare(a.data));
    if (candidatos.length === 0) {
      // Pegar o mais recente que houver
      const todos = arquivos
        .map(f => ({ f, data: extrairData(f) }))
        .filter(x => x.data)
        .sort((a, b) => b.data.localeCompare(a.data));
      if (todos.length > 0) {
        cobertura[cod][sigla] = { existe: true, arq: todos[0].f, data: todos[0].data, fora_janela: true };
        lacunas.push(`${cod} × ${sigla}: relatório mais recente (${todos[0].data}) fora da janela ${DATA_INI}..${DATA_FIM}`);
      } else {
        cobertura[cod][sigla] = { existe: false, arq: null, data: null };
        lacunas.push(`${cod} × ${sigla}: nenhum relatório com data parseável`);
      }
    } else {
      cobertura[cod][sigla] = { existe: true, arq: candidatos[0].f, data: candidatos[0].data, fora_janela: false };
    }
    detalhe.push({ cod, sigla, total: arquivos.length, escolhido: cobertura[cod][sigla].arq, data: cobertura[cod][sigla].data });
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  FASE 1 — COBERTURA DE RELATÓRIOS PRÉ-JOGO (janela ' + DATA_INI + ' a ' + DATA_FIM + ')');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('| LIGA   | CISNE     | TEACHER   | ENIGMA    | VENCEDOR  | BALA      |');
console.log('|--------|-----------|-----------|-----------|-----------|-----------|');
for (const cod of Object.keys(MAP_LIGA_PASTA)) {
  const cells = SISTEMAS.map(([sigla]) => {
    const c = cobertura[cod][sigla];
    if (!c.existe) return '   —      ';
    if (c.fora_janela) return '⚠ ' + c.data;
    return '✅ ' + c.data;
  });
  console.log('| ' + cod.padEnd(6) + ' | ' + cells.join(' | ') + ' |');
}

const totalSlots = Object.keys(MAP_LIGA_PASTA).length * SISTEMAS.length;
const slotsOK = detalhe.filter(d => {
  const c = cobertura[d.cod][d.sigla];
  return c.existe && !c.fora_janela;
}).length;
const slotsFora = detalhe.filter(d => {
  const c = cobertura[d.cod][d.sigla];
  return c.existe && c.fora_janela;
}).length;
const slotsAusentes = totalSlots - slotsOK - slotsFora;

console.log('');
console.log('═══ COBERTURA ═══');
console.log(`  Total slots:       ${totalSlots} (${Object.keys(MAP_LIGA_PASTA).length} ligas × ${SISTEMAS.length} sistemas)`);
console.log(`  Dentro da janela:  ${slotsOK} (${(slotsOK / totalSlots * 100).toFixed(0)}%)`);
console.log(`  Fora da janela:    ${slotsFora}`);
console.log(`  Ausentes:          ${slotsAusentes}`);
console.log('');
if (lacunas.length > 0) {
  console.log('═══ LACUNAS ═══');
  lacunas.forEach(l => console.log('  ' + l));
}

// Salvar mapeamento JSON pra próxima fase usar
fs.writeFileSync(
  path.join(__dirname, '_auditoria_cobertura.json'),
  JSON.stringify({ data_geracao: new Date().toISOString(), cobertura, MAP_LIGA_PASTA, SISTEMAS, RAIZ_AUDIT }, null, 2)
);
console.log('');
console.log('💾 Cobertura salva em: _auditoria_cobertura.json');
