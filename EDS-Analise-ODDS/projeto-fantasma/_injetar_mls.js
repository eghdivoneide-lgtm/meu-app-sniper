/**
 * INJETOR CIRÚRGICO — MLS — UPSERT (3 caminhos)
 * Chave: match_id || id (evita colapsar base legada do varredor-por-time)
 */
const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'mls_rodada_2_2026-04-22.json');
const ALVOS = [
  'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/EDS-Analise-ODDS/especialista-cantos/data/mls2026.js',
  'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/especialista-cantos/data/mls2026.js',
  'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/Yaaken-Scanner/yaaken-data/mls2026.js'
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
    gols: { ht: ht || { m: 0, v: 0 }, ft: ft || { m: 0, v: 0 } },
    cantos: {
      ht: eh.cantos || { m: 0, v: 0 },
      ft: ef.cantos || { m: 0, v: 0 }
    },
    stats_taticas: {
      posse: ef.posse || { m: 50, v: 50 },
      finalizacoes: ef.finalizacoes || { m: 0, v: 0 }
    },
    placar: ft || { m: 0, v: 0 }
  };
});

for (const alvo of ALVOS) {
  // Para o Yaaken, se não existir, copiar do path raiz antes
  if (!fs.existsSync(alvo)) {
    const src = 'C:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/especialista-cantos/data/mls2026.js';
    if (fs.existsSync(src) && alvo.includes('Yaaken-Scanner')) {
      fs.copyFileSync(src, alvo);
      console.log(`\n→ ${alvo.split('/').slice(-3).join('/')} (criado a partir de raiz)`);
    } else {
      console.log(`PULANDO (não existe): ${alvo}`);
      continue;
    }
  }

  const src = fs.readFileSync(alvo, 'utf8');
  const sandbox = { window: {} };
  const code = src.replace(/^\s*\/\/.*$/gm, '');
  const fn = new Function('window', code);
  fn(sandbox.window);
  const dados = sandbox.window.DADOS_MLS;
  if (!dados || !Array.isArray(dados.jogos)) {
    console.log(`ERRO: DADOS_MLS.jogos não encontrado em ${alvo}`);
    continue;
  }
  const antesTotal = dados.jogos.length;

  const chave = j => j.match_id || j.id;
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

  const timesSet = new Set(dados.times || []);
  novos.forEach(j => { timesSet.add(j.mandante); timesSet.add(j.visitante); });
  const timesFinal = Array.from(timesSet).sort();

  dados.times = timesFinal;
  dados.ultimaAtualizacao = new Date().toISOString().slice(0, 10);

  const rel = alvo.split('/').slice(-3).join('/');
  console.log(`\n→ ${rel}`);
  console.log(`  Antes: ${antesTotal} | Atualizados: ${atualizados} | Inseridos: ${inseridos} | Total: ${dados.jogos.length}`);

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  if (fs.existsSync(alvo)) fs.copyFileSync(alvo, `${alvo}.backup_${ts}`);

  const out =
    `// MLS 2026 — Injeção Varredor v4 (upsert)\n` +
    `// ${dados.jogos.length} jogos | Atualizado: ${dados.ultimaAtualizacao}\n` +
    `window.DADOS_MLS = ${JSON.stringify(dados, null, 2)};\n`;
  fs.writeFileSync(alvo, out);
  console.log(`  ✅ Salvo`);
}

console.log('\n🏁 Injeção MLS concluída');
