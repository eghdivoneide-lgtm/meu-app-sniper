/**
 * INJETOR — MLS rodada coletada em 2026-05-15 (17 jogos: 14 do 13/05 + 3 refresh do 10/05)
 *
 * UPSERT por match_id em mls2026.js do Especialista-Cantos.
 * Backup automático antes de gravar.
 *
 * Uso: node _injetar_mls_2026-05-15.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP';

const LIGA = {
  codigo: 'MLS',
  json:    'mls_rodada_2_2026-05-15.json',
  arquivo: 'mls2026.js',
  varJS:   'DADOS_MLS'
};

const PASTAS_CANDIDATAS = [
  'EDS-Analise-ODDS/especialista-cantos/data',
  'especialista-cantos/data',
  'Yaaken-Scanner/yaaken-data'
];

function parsePlacar(p) {
  if (!p || typeof p !== 'string' || !p.includes(' - ')) return null;
  const [m, v] = p.split(' - ').map(x => parseInt(x));
  if (isNaN(m) || isNaN(v)) return null;
  return { m, v };
}

function normalizarJogo(j) {
  const ef = j.estatisticas_ft || {};
  const eh = j.estatisticas_ht || {};
  const ft = parsePlacar(j.placar?.ft);
  const ht = parsePlacar(j.placar?.ht);
  return {
    match_id:  j.match_id,
    id:        j.match_id,
    mandante:  j.mandante,
    visitante: j.visitante,
    data:      j.data_partida || '',
    rodada:    j.rodada || null,
    fonte:     'varredor-rodada-v4',
    gols:  { ht: ht || null, ft: ft || null },
    cantos:{ ht: eh.cantos || { m: 0, v: 0 }, ft: ef.cantos || { m: 0, v: 0 } },
    stats_taticas: {
      posse:        ef.posse        || { m: 50, v: 50 },
      finalizacoes: ef.finalizacoes || { m: 0, v: 0 }
    },
    placar: ft || null
  };
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  INJEÇÃO MLS — Rodada 13/05/2026 (+ refresh 10/05)');
console.log('═══════════════════════════════════════════════════════════════════');

const jsonPath = path.join(__dirname, LIGA.json);
if (!fs.existsSync(jsonPath)) {
  console.log('⚠️  JSON não encontrado: ' + jsonPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const jogosRaw = Array.isArray(raw) ? raw : Object.values(raw);
console.log('📥 JSON: ' + jogosRaw.length + ' jogos');

const novos = jogosRaw.map(normalizarJogo);

const alvos = PASTAS_CANDIDATAS
  .map(p => path.join(ROOT, p, LIGA.arquivo))
  .filter(p => fs.existsSync(p));

if (alvos.length === 0) {
  console.log('⚠️  Nenhum arquivo alvo encontrado para ' + LIGA.arquivo);
  process.exit(1);
}

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const dataHoje = new Date().toISOString().slice(0, 10);

for (const alvo of alvos) {
  console.log('\n▸ Alvo: ' + alvo);
  const src = fs.readFileSync(alvo, 'utf8');
  const sandbox = { window: {} };
  const code = src.replace(/^\s*\/\/.*$/gm, '');
  try {
    const fn = new Function('window', code);
    fn(sandbox.window);
  } catch (e) {
    console.log('  ❌ Erro lendo: ' + e.message);
    continue;
  }

  const dados = sandbox.window[LIGA.varJS];
  if (!dados || !Array.isArray(dados.jogos)) {
    console.log('  ❌ ' + LIGA.varJS + '.jogos não encontrado');
    continue;
  }
  const antesTotal = dados.jogos.length;

  const indicePorChave = new Map();
  dados.jogos.forEach((j, idx) => {
    const k = j.match_id || j.id;
    if (k) indicePorChave.set(k, idx);
  });

  let atualizados = 0, inseridos = 0;
  novos.forEach(n => {
    const k = n.match_id || n.id;
    if (!k) return;
    if (indicePorChave.has(k)) {
      Object.assign(dados.jogos[indicePorChave.get(k)], n);
      atualizados++;
    } else {
      dados.jogos.push(n);
      inseridos++;
    }
  });

  const timesSet = new Set(dados.times || []);
  novos.forEach(j => {
    if (j.mandante)  timesSet.add(j.mandante);
    if (j.visitante) timesSet.add(j.visitante);
  });
  dados.times = Array.from(timesSet).sort();

  dados.ultimaAtualizacao = dataHoje;

  const backupPath = alvo + '.backup_' + ts;
  fs.copyFileSync(alvo, backupPath);
  console.log('  💾 Backup: ' + path.basename(backupPath));

  const out =
    '// ============================================================\n' +
    '// MLS 2026 — Injeção Varredor v4 (rodada 13/05/2026)\n' +
    '// ' + dados.jogos.length + ' jogos | Atualizado: ' + dados.ultimaAtualizacao + '\n' +
    '// ============================================================\n\n' +
    'window.' + LIGA.varJS + ' = ' + JSON.stringify(dados, null, 2) + ';\n';
  fs.writeFileSync(alvo, out);

  console.log('  ✅ antes: ' + antesTotal + '  +' + inseridos + ' novos  ~' + atualizados + ' atualizados  →  total: ' + dados.jogos.length);
}

console.log('\n🏁 Injeção concluída.');
