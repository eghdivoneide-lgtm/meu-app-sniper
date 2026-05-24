/**
 * INJETOR CIRÚRGICO — Primera B Nacional (Argentina) — UPSERT
 * Atualiza jogos existentes (caso de correção de placar) e insere novos.
 * Alvos: raiz, EDS-Analise-ODDS e Yaaken-Scanner.
 */
const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'arg_b_rodada_2_2026-04-22.json');
const ALVOS = [
  'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/EDS-Analise-ODDS/especialista-cantos/data/argentina_b2026.js',
  'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/especialista-cantos/data/argentina_b2026.js',
  'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/Yaaken-Scanner/yaaken-data/argentina_b2026.js'
];

const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
const jogosRaw = Array.isArray(raw) ? raw : Object.values(raw);
console.log(`RAW jogos lidos: ${jogosRaw.length}`);

function parsePlacar(p) {
  if (!p || typeof p !== 'string' || !p.includes(' - ')) return null;
  const [m, v] = p.split(' - ').map(x => parseInt(x));
  if (isNaN(m) || isNaN(v)) return null;
  return { m, v };
}

const novos = jogosRaw.map(j => {
  const ef = j.estatisticas_ft || {};
  const eh = j.estatisticas_ht || {};
  const ft = parsePlacar(j.placar?.ft);
  const ht = parsePlacar(j.placar?.ht);
  return {
    match_id: j.match_id,
    id: j.match_id,
    mandante: j.mandante,
    visitante: j.visitante,
    data: j.data_partida || '',
    rodada: null,
    fonte: 'varredor-rodada-v4',
    gols: {
      ht: ht || { m: null, v: null },
      ft: ft || { m: null, v: null }
    },
    cantos: {
      ht: eh.cantos || { m: 0, v: 0 },
      ft: ef.cantos || { m: 0, v: 0 }
    },
    stats_taticas: {
      posse: ef.posse || { m: 50, v: 50 },
      finalizacoes: ef.finalizacoes || { m: 0, v: 0 }
    },
    placar: ft || { m: null, v: null }
  };
});

for (const alvo of ALVOS) {
  if (!fs.existsSync(alvo)) { console.log(`PULANDO (não existe): ${alvo}`); continue; }
  const src = fs.readFileSync(alvo, 'utf8');

  const sandbox = { window: {} };
  const code = src.replace(/^\s*\/\/.*$/gm, '');
  const fn = new Function('window', code);
  fn(sandbox.window);
  const dados = sandbox.window.DADOS_ARG_B;
  if (!dados || !Array.isArray(dados.jogos)) {
    console.log(`ERRO: DADOS_ARG_B.jogos não encontrado em ${alvo}`);
    continue;
  }
  const antesTotal = dados.jogos.length;

  // UPSERT usando match_id||id como chave (base tem mix dos dois campos)
  const chave = j => j.match_id || j.id;
  // Mantém array original (não vira Map) para preservar duplicatas existentes e entradas sem id
  const indicePorChave = new Map();
  dados.jogos.forEach((j, idx) => {
    const k = chave(j);
    if (k) indicePorChave.set(k, idx);
  });
  let atualizados = 0, inseridos = 0;
  novos.forEach(n => {
    const k = chave(n);
    if (indicePorChave.has(k)) {
      Object.assign(dados.jogos[indicePorChave.get(k)], n);
      atualizados++;
    } else {
      dados.jogos.push(n);
      inseridos++;
    }
  });

  // Adiciona times novos
  const timesSet = new Set(dados.times || []);
  novos.forEach(j => { timesSet.add(j.mandante); timesSet.add(j.visitante); });
  const timesFinal = Array.from(timesSet).sort();

  dados.times = timesFinal;
  dados.ultimaAtualizacao = new Date().toISOString().slice(0, 10);

  const rel = alvo.split('/').slice(-3).join('/');
  console.log(`\n→ ${rel}`);
  console.log(`  Antes: ${antesTotal} | Atualizados: ${atualizados} | Inseridos: ${inseridos} | Total agora: ${dados.jogos.length}`);

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(alvo, `${alvo}.backup_${ts}`);

  const out =
    `// Primera B Nacional (Argentina) 2026 — Injeção Varredor v4 (upsert)\n` +
    `// ${dados.jogos.length} jogos | Atualizado: ${dados.ultimaAtualizacao}\n` +
    `window.DADOS_ARG_B = ${JSON.stringify(dados, null, 2)};\n`;
  fs.writeFileSync(alvo, out);
  console.log(`  ✅ Salvo`);
}

console.log('\n🏁 Injeção UPSERT concluída');
