/**
 * INJETOR — Rodada 2026-05-05 (11 ligas, 132 jogos)
 *
 * UPSERT por match_id nos arquivos .js do Especialista-Cantos.
 * Backup automático antes de gravar.
 *
 * Uso:
 *   node _injetar_rodada_2026-05-05.js              (todas)
 *   node _injetar_rodada_2026-05-05.js BR ARG       (filtra)
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP';

const LIGAS = [
  { codigo: 'BR',     json: 'br_rodada_2_2026-05-05.json',     arquivo: 'brasileirao2026.js',  varJS: 'DADOS_BR'      },
  { codigo: 'BR_B',   json: 'br_b_rodada_2_2026-05-05.json',   arquivo: 'brasileiraoB2026.js', varJS: 'DADOS_BR_B'    },
  { codigo: 'ARG',    json: 'arg_rodada_2_2026-05-05.json',    arquivo: 'argentina2026.js',    varJS: 'DADOS_ARG'     },
  { codigo: 'ARG_B',  json: 'arg_b_rodada_2_2026-05-05.json',  arquivo: 'argentina_b2026.js',  varJS: 'DADOS_ARG_B'   },
  { codigo: 'BUN',    json: 'bun_rodada_2_2026-05-05.json',    arquivo: 'bundesliga2026.js',   varJS: 'DADOS_BUN'     },
  { codigo: 'USL',    json: 'usl_rodada_2_2026-05-05.json',    arquivo: 'usl2026.js',          varJS: 'DADOS_USL'     },
  { codigo: 'MLS',    json: 'mls_rodada_2_2026-05-05.json',    arquivo: 'mls2026.js',          varJS: 'DADOS_MLS'     },
  { codigo: 'J1',     json: 'j1_rodada_2_2026-05-04.json',     arquivo: 'j1league2026.js',     varJS: 'DADOS_J1'      },
  { codigo: 'J2J3',   json: 'j2j3_rodada_2_2026-05-04.json',   arquivo: 'j2j3league2026.js',   varJS: 'DADOS_J2_J3'   },
  { codigo: 'CHN_SL', json: 'chn_sl_rodada_2_2026-05-04.json', arquivo: 'chinasuper2026.js',   varJS: 'DADOS_CHN_SUP' },
  { codigo: 'CHN_L1', json: 'chn_l1_rodada_2_2026-05-04.json', arquivo: 'chinaone2026.js',     varJS: 'DADOS_CHN_1'   }
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
    match_id:   j.match_id,
    id:         j.match_id,
    mandante:   j.mandante,
    visitante:  j.visitante,
    data:       j.data_partida || '',
    rodada:     j.rodada || null,
    fonte:      'varredor-rodada-v4',
    gols: {
      ht: ht || null,
      ft: ft || null
    },
    cantos: {
      ht: eh.cantos || { m: 0, v: 0 },
      ft: ef.cantos || { m: 0, v: 0 }
    },
    stats_taticas: {
      posse:        ef.posse        || { m: 50, v: 50 },
      finalizacoes: ef.finalizacoes || { m: 0, v: 0 }
    },
    placar: ft || null
  };
}

const filtro = process.argv.slice(2).map(s => s.toUpperCase());
const ligasAlvo = filtro.length ? LIGAS.filter(l => filtro.includes(l.codigo)) : LIGAS;
if (!ligasAlvo.length) { console.log('Nenhuma liga corresponde ao filtro:', filtro); process.exit(0); }

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  INJEÇÃO RODADA 2026-05-05 — ' + ligasAlvo.length + ' liga(s)');
console.log('═══════════════════════════════════════════════════════════════════');

const resumoGlobal = [];
const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

for (const liga of ligasAlvo) {
  console.log('');
  console.log('▸ ' + liga.codigo + ' — ' + liga.arquivo);

  const jsonPath = path.join(__dirname, liga.json);
  if (!fs.existsSync(jsonPath)) {
    console.log('  ⚠️  JSON não encontrado: ' + jsonPath);
    resumoGlobal.push({ liga: liga.codigo, status: 'PULADO (json n/existe)' });
    continue;
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const jogosRaw = Array.isArray(raw) ? raw : Object.values(raw);
  console.log('  📥 JSON: ' + jogosRaw.length + ' jogos');

  const novos = jogosRaw.map(normalizarJogo);

  const alvos = PASTAS_CANDIDATAS
    .map(p => path.join(ROOT, p, liga.arquivo))
    .filter(p => fs.existsSync(p));

  if (alvos.length === 0) {
    console.log('  ⚠️  Nenhum arquivo alvo encontrado para ' + liga.arquivo);
    resumoGlobal.push({ liga: liga.codigo, status: 'PULADO (alvo n/existe)' });
    continue;
  }

  const porArquivo = [];

  for (const alvo of alvos) {
    const src = fs.readFileSync(alvo, 'utf8');
    const sandbox = { window: {} };
    const code = src.replace(/^\s*\/\/.*$/gm, '');
    try {
      const fn = new Function('window', code);
      fn(sandbox.window);
    } catch (e) {
      console.log('  ❌ Erro lendo ' + alvo + ': ' + e.message);
      continue;
    }

    const dados = sandbox.window[liga.varJS];
    if (!dados || !Array.isArray(dados.jogos)) {
      console.log('  ❌ ' + liga.varJS + '.jogos não encontrado em ' + alvo);
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

    dados.ultimaAtualizacao = '2026-05-05';

    fs.copyFileSync(alvo, alvo + '.backup_' + ts);

    const out =
      '// ============================================================\n' +
      '// ' + liga.codigo + ' 2026 — Injeção Varredor v4 (rodada 2026-05-05)\n' +
      '// ' + dados.jogos.length + ' jogos | Atualizado: ' + dados.ultimaAtualizacao + '\n' +
      '// ============================================================\n\n' +
      'window.' + liga.varJS + ' = ' + JSON.stringify(dados, null, 2) + ';\n';
    fs.writeFileSync(alvo, out);

    const rel = alvo.split(/[\\/]/).slice(-4).join('/');
    console.log('  → ' + rel);
    console.log('     antes: ' + antesTotal + '  +' + inseridos + ' novos  ~' + atualizados + ' atualizados  →  total: ' + dados.jogos.length);
    porArquivo.push({ alvo: rel, antesTotal, atualizados, inseridos, total: dados.jogos.length });
  }

  resumoGlobal.push({ liga: liga.codigo, status: 'OK', arquivos: porArquivo });
}

console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('  RESUMO FINAL');
console.log('═══════════════════════════════════════════════════════════════════');
let tInseridos = 0, tAtualizados = 0;
resumoGlobal.forEach(r => {
  console.log('');
  console.log('▸ ' + r.liga + ': ' + r.status);
  if (r.arquivos) r.arquivos.forEach(a => {
    console.log('   • ' + a.alvo + '  →  +' + a.inseridos + ' novos / ~' + a.atualizados + ' atu / total ' + a.total);
    tInseridos += a.inseridos; tAtualizados += a.atualizados;
  });
});
console.log('');
console.log('  TOTAIS: +' + tInseridos + ' jogos novos · ~' + tAtualizados + ' atualizados');
console.log('  Backups com sufixo .backup_' + ts);
console.log('');
console.log('🏁 Injeção concluída.');
