/**
 * INJETOR — Rodada 22-25/05/2026
 * Injeta os 79 jogos coletados em DOIS bancos:
 *   1) especialista-cantos/data/*.js
 *   2) HDP ULTRA/data/*.js
 *
 * Aplica ALIASES CANÔNICOS (Atletico-MG → Atlético-MG, Bragantino → Red Bull Bragantino etc)
 * antes de inserir, mantendo banco limpo.
 *
 * Backup automático: cada arquivo .js vira *.js.backup_inject_<TS> antes da edição.
 * UPSERT idempotente: rodar 2x não duplica jogos.
 *
 * Operador autorizou em 26/05/2026 (opção A — com aliases).
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const FONTE = path.join(__dirname, 'rodadas');

const LIGAS = {
  BR:    { arq: 'brasileirao2026.js',  vname: 'DADOS_BR' },
  BR_B:  { arq: 'brasileiraoB2026.js', vname: 'DADOS_BR_B' },
  ARG_B: { arq: 'argentina_b2026.js',  vname: 'DADOS_ARG_B' },
  MLS:   { arq: 'mls2026.js',          vname: 'DADOS_MLS' },
  USL:   { arq: 'usl2026.js',          vname: 'DADOS_USL' },
  CHI:   { arq: 'chile2026.js',        vname: 'DADOS_CHI' },
  ECU:   { arq: 'equador2026.js',      vname: 'DADOS_ECU' }
};

const ALIASES = {
  BR: {
    'Atletico-MG':'Atlético-MG','Atletico MG':'Atlético-MG','Atlético MG':'Atlético-MG',
    'Gremio':'Grêmio','Sao Paulo':'São Paulo','Vitoria':'Vitória',
    'Bragantino':'Red Bull Bragantino','RB Bragantino':'Red Bull Bragantino',
    'Flamengo RJ':'Flamengo','Botafogo RJ':'Botafogo','Chapecoense-SC':'Chapecoense'
  }
};

const DESTINOS = [
  { nome: 'especialista-cantos', dir: path.join(BASE, 'especialista-cantos', 'data') },
  { nome: 'HDP ULTRA',           dir: path.join(BASE, 'HDP ULTRA', 'data') }
];

const ts = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
const hoje = new Date().toISOString().slice(0,10);

function aplicarAlias(liga, nome) {
  const map = ALIASES[liga] || {};
  return map[nome] || nome;
}

function parsePlacar(p) {
  if (!p || typeof p !== 'string' || !p.includes(' - ')) return null;
  const [m, v] = p.split(' - ').map(x => parseInt(x));
  return isNaN(m) || isNaN(v) ? null : { m, v };
}

function carregarColetaLiga(liga) {
  const arq = path.join(FONTE, liga, liga.toLowerCase() + '_rodada_2_2026-05-26.json');
  if (!fs.existsSync(arq)) return [];
  const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
  return (Array.isArray(d) ? d : (d.jogos || []));
}

// Constrói objeto novo no schema do banco (compatível com app)
function montarNovoJogo(rico, liga) {
  const mandante = aplicarAlias(liga, rico.mandante);
  const visitante = aplicarAlias(liga, rico.visitante);
  const ft = parsePlacar(rico.placar?.ft);
  const ht = parsePlacar(rico.placar?.ht);
  const ef = rico.estatisticas_ft || {};
  const eh = rico.estatisticas_ht || {};
  return {
    match_id: rico.match_id || rico.id,
    id:       rico.match_id || rico.id,
    mandante, visitante,
    data:     rico.data_partida || '',
    rodada:   rico.rodada || null,
    fonte:    'varredor-rodada-v4-2026-05-26',
    gols:     { ht: ht || null, ft: ft || null },
    cantos:   { ht: eh.cantos || { m:0, v:0 }, ft: ef.cantos || { m:0, v:0 } },
    stats_taticas: { posse: ef.posse || { m:50, v:50 }, finalizacoes: ef.finalizacoes || { m:0, v:0 } },
    placar:   ft || null,
    url:      rico.url,
    liga:     rico.liga,
    codigo_liga: rico.codigo_liga,
    data_partida: rico.data_partida,
    estatisticas_ft: ef,
    estatisticas_ht: eh,
    formacao: rico.formacao,
    mercado:  rico.mercado,
    meta:     rico.meta,
    placar_str: rico.placar
  };
}

function injetarLigaNoDestino(liga, destino) {
  const cfg = LIGAS[liga];
  const arqBanco = path.join(destino.dir, cfg.arq);
  if (!fs.existsSync(arqBanco)) return { erro: 'banco ausente: '+arqBanco };

  // Carrega banco
  global.window = {};
  const src = fs.readFileSync(arqBanco, 'utf8');
  const code = src.replace(/^\s*\/\/.*$/gm, '');
  new Function('window', code)(global.window);
  const dados = global.window[cfg.vname];
  if (!dados || !Array.isArray(dados.jogos)) return { erro: 'estrutura inválida' };

  // Carrega coleta
  const ricos = carregarColetaLiga(liga);
  if (!ricos.length) return { erro: 'sem coleta nova' };

  // Backup
  fs.copyFileSync(arqBanco, arqBanco + '.backup_inject_' + ts);

  // Index banco por match_id e (mandante|visitante|data)
  const indexId = new Map();
  const indexKey = new Map();
  for (let i = 0; i < dados.jogos.length; i++) {
    const j = dados.jogos[i];
    const id = j.match_id || j.id;
    if (id) indexId.set(id, i);
    const k = (j.mandante||'')+'|'+(j.visitante||'')+'|'+((j.data_partida||j.data||'').substring(0,10));
    indexKey.set(k, i);
  }

  // Aplica aliases nos jogos do banco (caso ainda tenha grafias antigas)
  const mapAlias = ALIASES[liga] || {};
  if (Object.keys(mapAlias).length) {
    for (const j of dados.jogos) {
      if (mapAlias[j.mandante]) j.mandante = mapAlias[j.mandante];
      if (mapAlias[j.visitante]) j.visitante = mapAlias[j.visitante];
    }
  }

  // UPSERT
  let atualizados = 0, inseridos = 0;
  for (const rico of ricos) {
    const novo = montarNovoJogo(rico, liga);
    const idNovo = novo.match_id || novo.id;
    const kNovo = novo.mandante+'|'+novo.visitante+'|'+(novo.data_partida||'').substring(0,10);

    let idx = idNovo ? indexId.get(idNovo) : undefined;
    if (idx === undefined) idx = indexKey.get(kNovo);

    if (idx !== undefined) {
      dados.jogos[idx] = { ...dados.jogos[idx], ...novo };
      atualizados++;
    } else {
      dados.jogos.push(novo);
      inseridos++;
      if (idNovo) indexId.set(idNovo, dados.jogos.length - 1);
      indexKey.set(kNovo, dados.jogos.length - 1);
    }
  }

  // Atualiza lista de times (deduplica via aliases)
  const timesSet = new Set();
  for (const j of dados.jogos) {
    if (j.mandante) timesSet.add(aplicarAlias(liga, j.mandante));
    if (j.visitante) timesSet.add(aplicarAlias(liga, j.visitante));
  }
  dados.times = [...timesSet].sort();
  dados.ultimaAtualizacao = hoje;

  // Escreve
  const out =
    '// ============================================================\n' +
    `// ${liga} 2026 — Injeção rodada 22-25/05/2026 (com aliases)\n` +
    `// ${dados.jogos.length} jogos | Atualizado: ${hoje}\n` +
    '// ============================================================\n\n' +
    `window.${cfg.vname} = ${JSON.stringify(dados, null, 2)};\n`;
  fs.writeFileSync(arqBanco, out);

  return { atualizados, inseridos, total: dados.jogos.length, times: dados.times.length };
}

// ═══ EXECUÇÃO ═══
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  💉 INJEÇÃO — Rodada 22-25/05/2026 (com aliases canônicos)');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  Backup timestamp: ' + ts);
console.log('');

for (const destino of DESTINOS) {
  console.log('▶️  Destino: ' + destino.nome);
  console.log('|  LIGA  | Atualizados | Inseridos | Total | Times | Status |');
  console.log('|--------|-------------|-----------|-------|-------|--------|');
  for (const liga of Object.keys(LIGAS)) {
    const r = injetarLigaNoDestino(liga, destino);
    if (r.erro) {
      console.log('|  ' + liga.padEnd(5) + ' | ❌ ' + r.erro);
    } else {
      console.log('|  ' + liga.padEnd(5) + ' | ' +
        String(r.atualizados).padStart(11) + ' | ' +
        String(r.inseridos).padStart(9) + ' | ' +
        String(r.total).padStart(5) + ' | ' +
        String(r.times).padStart(5) + ' | ✅ OK |');
    }
  }
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  🏁 Injeção concluída em ambos os apps');
console.log('  💾 Backups: *.js.backup_inject_' + ts);
console.log('═══════════════════════════════════════════════════════════════════════════');
