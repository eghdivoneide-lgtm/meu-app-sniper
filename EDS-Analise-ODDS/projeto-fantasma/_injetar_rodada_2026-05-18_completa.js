/**
 * INJETOR — Rodada 17-18/05/2026 (7 ligas)
 * UPSERT por match_id nos data/*.js do Especialista-Cantos.
 *
 * Lê os JSONs já organizados em projeto-fantasma/rodadas/<LIGA>/.
 * Backup automático antes de gravar.
 *
 * Uso: node _injetar_rodada_2026-05-18_completa.js
 */
const fs   = require('fs');
const path = require('path');

const ROOT = 'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP';

const LIGAS = [
  { codigo: 'BR',    json: 'rodadas/BR/br_rodada_2_2026-05-18.json',         arquivo: 'brasileirao2026.js',  varJS: 'DADOS_BR'    },
  { codigo: 'BR_B',  json: 'rodadas/BR_B/br_b_rodada_2_2026-05-18.json',     arquivo: 'brasileiraoB2026.js', varJS: 'DADOS_BR_B'  },
  { codigo: 'MLS',   json: 'rodadas/MLS/mls_rodada_2_2026-05-18.json',       arquivo: 'mls2026.js',          varJS: 'DADOS_MLS'   },
  { codigo: 'ARG',   json: 'rodadas/ARG/arg_rodada_2_2026-05-18.json',       arquivo: 'argentina2026.js',    varJS: 'DADOS_ARG'   },
  { codigo: 'ARG_B', json: 'rodadas/ARG_B/arg_b_rodada_2_2026-05-18.json',   arquivo: 'argentina_b2026.js',  varJS: 'DADOS_ARG_B' },
  { codigo: 'BUN',   json: 'rodadas/BUN/bun_rodada_2_2026-05-18.json',       arquivo: 'bundesliga2026.js',   varJS: 'DADOS_BUN'   },
  { codigo: 'J2J3',  json: 'rodadas/J2J3/j2j3_rodada_2_2026-05-17.json',     arquivo: 'j2j3league2026.js',   varJS: 'DADOS_J2_J3' }
];

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

const ts        = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const dataHoje  = new Date().toISOString().slice(0, 10);
const resumo    = [];

for (const liga of LIGAS) {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log(`  ${liga.codigo}  —  ${liga.arquivo}`);
  console.log('═══════════════════════════════════════════');

  const jsonPath = path.join(__dirname, liga.json);
  if (!fs.existsSync(jsonPath)) {
    console.log(`  ⚠️  JSON não encontrado: ${liga.json}`);
    resumo.push({ liga: liga.codigo, status: 'JSON-AUSENTE', novos: 0, atualizados: 0 });
    continue;
  }

  const raw      = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const jogosRaw = Array.isArray(raw) ? raw : Object.values(raw);
  console.log(`  📥 JSON coletado: ${jogosRaw.length} jogos`);

  const novos = jogosRaw.map(normalizarJogo);

  const alvos = PASTAS_CANDIDATAS
    .map(p => path.join(ROOT, p, liga.arquivo))
    .filter(p => fs.existsSync(p));

  if (alvos.length === 0) {
    console.log(`  ⚠️  Nenhum arquivo alvo encontrado para ${liga.arquivo}`);
    resumo.push({ liga: liga.codigo, status: 'ALVO-AUSENTE', novos: 0, atualizados: 0 });
    continue;
  }

  let totalNovos = 0, totalAtualizados = 0;

  for (const alvo of alvos) {
    const src = fs.readFileSync(alvo, 'utf8');
    const sandbox = { window: {} };
    const code = src.replace(/^\s*\/\/.*$/gm, '');
    try {
      new Function('window', code)(sandbox.window);
    } catch (e) {
      console.log(`  ❌ Erro ao ler ${alvo}: ${e.message}`);
      continue;
    }

    const dados = sandbox.window[liga.varJS];
    if (!dados || !Array.isArray(dados.jogos)) {
      console.log(`  ❌ ${liga.varJS}.jogos não encontrado em ${alvo}`);
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
    novos.forEach(j => { if (j.mandante) timesSet.add(j.mandante); if (j.visitante) timesSet.add(j.visitante); });
    dados.times = Array.from(timesSet).sort();
    dados.ultimaAtualizacao = dataHoje;

    const backupPath = alvo + '.backup_' + ts;
    fs.copyFileSync(alvo, backupPath);

    const out =
      '// ============================================================\n' +
      '// ' + liga.codigo + ' 2026 — Injeção Varredor v4 (rodada 17-18/05)\n' +
      '// ' + dados.jogos.length + ' jogos | Atualizado: ' + dados.ultimaAtualizacao + '\n' +
      '// ============================================================\n\n' +
      'window.' + liga.varJS + ' = ' + JSON.stringify(dados, null, 2) + ';\n';
    fs.writeFileSync(alvo, out);

    const rel = alvo.split(/[\\/]/).slice(-4).join('/');
    console.log(`  → ${rel}`);
    console.log(`     antes: ${antesTotal}  +${inseridos} novos  ~${atualizados} atualizados  →  total: ${dados.jogos.length}`);

    if (inseridos > totalNovos) totalNovos = inseridos;
    if (atualizados > totalAtualizados) totalAtualizados = atualizados;
  }

  resumo.push({ liga: liga.codigo, status: 'OK', novos: totalNovos, atualizados: totalAtualizados });
}

console.log('');
console.log('╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║                    RESUMO FINAL DA INJEÇÃO                                ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝');
console.log('');
let totalNovosGeral = 0;
resumo.forEach(r => {
  console.log(`  ▸ ${r.liga.padEnd(7)} ${r.status.padEnd(15)} → +${r.novos} novos / ~${r.atualizados} atualizados`);
  totalNovosGeral += r.novos;
});
console.log('');
console.log('  🎯 TOTAL DE JOGOS NOVOS INJETADOS: ' + totalNovosGeral);
console.log('');
console.log('🏁 Injeção concluída.');
