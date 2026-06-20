// EDS-HDP-Pro · Consolidador de fontes
//
// Lê jogos das 3 fontes (Analise-Refinada + projeto-fantasma + especialista-cantos),
// deduplica por match_id, normaliza formatos diferentes e salva 1 arquivo por liga
// em data/<LIGA>/<liga>_historico_consolidado.json
//
// Roda automaticamente: data/_build_banco.js depende destes arquivos.
//
// Uso:
//   node data/_consolidar_fontes.js          # consolida e salva
//   node data/_consolidar_fontes.js --build  # consolida + roda build_banco

const fs = require('fs');
const path = require('path');
const { TIMES_OFICIAIS, ALIASES, aliasOuOriginal, ehOficialFast } = require('./_times_oficiais');

const BASE_PROJETO = path.join(__dirname, '..', '..');  // EDS-Analise-ODDS/
const DST = path.join(__dirname);                       // EDS-HDP-Pro/data/

const LIGAS_MAP = {
  BR:    { refinada: 'BR',    fantasma: 'BR',    espec_arq: 'brasileirao2026.js',  varname: 'DADOS_BR'    },
  BR_B:  { refinada: 'BR_B',  fantasma: 'BR_B',  espec_arq: 'brasileiraoB2026.js', varname: 'DADOS_BR_B'  },
  ARG:   { refinada: 'ARG',   fantasma: 'ARG',   espec_arq: 'argentina2026.js',    varname: 'DADOS_ARG'   },
  ARG_B: { refinada: 'ARG_B', fantasma: 'ARG_B', espec_arq: 'argentina_b2026.js',  varname: 'DADOS_ARG_B' },
  MLS:   { refinada: 'MLS',   fantasma: 'MLS',   espec_arq: 'mls2026.js',          varname: 'DADOS_MLS'   },
  USL:   { refinada: 'USL',   fantasma: 'USL',   espec_arq: 'usl2026.js',          varname: 'DADOS_USL'   }
};

function chaveJogo(j) {
  const id = j.match_id || j.id;
  if (id) return id;
  return (j.mandante || j.m || '') + '|' + (j.visitante || j.v || '') + '|' + (j.data_partida || j.data || '');
}

// Normaliza para o formato padrão Analise-Refinada
function normalizar(j) {
  const out = {
    match_id:     j.match_id || j.id,
    mandante:     j.mandante || j.m,
    visitante:    j.visitante || j.v,
    data_partida: j.data_partida || j.data,
    liga:         j.liga,
    codigo_liga:  j.codigo_liga,
    placar:       j.placar || (j.gols ? { ht: j.gols.ht.m + ' - ' + j.gols.ht.v, ft: j.gols.ft.m + ' - ' + j.gols.ft.v } : null),
    estatisticas_ft: j.estatisticas_ft || null,
    estatisticas_ht: j.estatisticas_ht || null,
    formacao: j.formacao,
    mercado:  j.mercado
  };
  // Especialista usa cantos.ft.{m,v} — sintetizamos estatisticas_ft.cantos quando ausente
  if ((!out.estatisticas_ft || !out.estatisticas_ft.cantos) && j.cantos && j.cantos.ft) {
    out.estatisticas_ft = out.estatisticas_ft || {};
    out.estatisticas_ft.cantos = { m: j.cantos.ft.m, v: j.cantos.ft.v };
  }
  if ((!out.estatisticas_ht || !out.estatisticas_ht.cantos) && j.cantos && j.cantos.ht) {
    out.estatisticas_ht = out.estatisticas_ht || {};
    out.estatisticas_ht.cantos = { m: j.cantos.ht.m, v: j.cantos.ht.v };
  }
  return out;
}

function temCantosFT(j) {
  return j.estatisticas_ft && j.estatisticas_ft.cantos && j.estatisticas_ft.cantos.m !== undefined;
}

function carregarDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const a of fs.readdirSync(dir)) {
    if (!a.endsWith('.json') || a.includes('backup') || a.includes('consolidado')) continue;
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, a), 'utf8'));
      out.push(...(Array.isArray(d) ? d : (d.jogos || [])));
    } catch (e) {}
  }
  return out;
}

function carregarEspecialista(arquivo, varname) {
  global.window = {};
  const full = path.join(BASE_PROJETO, 'especialista-cantos', 'data', arquivo);
  if (!fs.existsSync(full)) return [];
  try {
    delete require.cache[require.resolve(full)];
    require(full);
    return (global.window[varname]?.jogos) || [];
  } catch (e) { return []; }
}

function consolidarLiga(cod) {
  const cfg = LIGAS_MAP[cod];
  const ref   = carregarDir(path.join(BASE_PROJETO, 'Analise-Refinada', cfg.refinada));
  const fant  = carregarDir(path.join(BASE_PROJETO, 'projeto-fantasma', 'rodadas', cfg.fantasma));
  const espec = carregarEspecialista(cfg.espec_arq, cfg.varname);

  // 1) Normaliza + aplica aliases (mandante/visitante viram nome canônico)
  function aplicarAlias(j) {
    j.mandante  = aliasOuOriginal(cod, j.mandante);
    j.visitante = aliasOuOriginal(cod, j.visitante);
    return j;
  }

  const map = new Map();
  for (const raw of [...ref, ...fant, ...espec]) {
    const j = aplicarAlias(normalizar(raw));
    if (!j.mandante || !j.visitante) continue;
    const k = chaveJogo(j);
    if (!map.has(k)) { map.set(k, j); continue; }
    const atual = map.get(k);
    const richAtual = !!(atual.estatisticas_ft && atual.estatisticas_ft.chutes_alvo);
    const richNovo  = !!(j.estatisticas_ft && j.estatisticas_ft.chutes_alvo);
    const cantosAtual = temCantosFT(atual);
    const cantosNovo  = temCantosFT(j);
    if (!cantosAtual && cantosNovo) map.set(k, j);
    else if (cantosAtual === cantosNovo && !richAtual && richNovo) map.set(k, j);
  }

  const todos = [...map.values()];
  const comCantos = todos.filter(temCantosFT);

  // 2) Filtra: mantém SÓ jogos onde ambos os times estão na lista oficial
  const oficiais = comCantos.filter(j =>
    ehOficialFast(cod, j.mandante) && ehOficialFast(cod, j.visitante)
  );
  const descartados = comCantos.length - oficiais.length;

  // 3) Identifica times encontrados fora da lista oficial (transparência)
  const timesForaDaLista = new Set();
  for (const j of comCantos) {
    if (!ehOficialFast(cod, j.mandante)) timesForaDaLista.add(j.mandante);
    if (!ehOficialFast(cod, j.visitante)) timesForaDaLista.add(j.visitante);
  }

  return {
    todos,
    comCantos,
    oficiais,
    descartados,
    times_descartados: [...timesForaDaLista].sort(),
    fontes: { refinada: ref.length, fantasma: fant.length, especialista: espec.length }
  };
}

if (require.main === module) {
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('  EDS-HDP-Pro · Consolidação + Aliases + Filtro Oficial');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('| LIGA  | Bruto | C/cantos | Após filtro | Descartados | Times válidos |');
  console.log('|-------|-------|----------|-------------|-------------|---------------|');

  let totalOficial = 0;
  let totalDescartado = 0;
  const todosDescartados = {};

  for (const cod of Object.keys(LIGAS_MAP)) {
    const r = consolidarLiga(cod);
    totalOficial += r.oficiais.length;
    totalDescartado += r.descartados;
    todosDescartados[cod] = r.times_descartados;

    const dir = path.join(DST, cod);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    for (const a of fs.readdirSync(dir)) {
      if (a.endsWith('.json')) fs.unlinkSync(path.join(dir, a));
    }
    const arq = path.join(dir, cod.toLowerCase() + '_historico_consolidado.json');
    fs.writeFileSync(arq, JSON.stringify({
      liga: cod,
      total: r.oficiais.length,
      gerado_em: new Date().toISOString(),
      fonte: 'consolidado: Analise-Refinada + projeto-fantasma + especialista-cantos',
      fontes_n: r.fontes,
      times_oficiais_n: TIMES_OFICIAIS[cod].length,
      jogos_descartados_n: r.descartados,
      times_descartados: r.times_descartados,
      jogos: r.oficiais
    }, null, 2));

    const validos = new Set();
    r.oficiais.forEach(j => { validos.add(j.mandante); validos.add(j.visitante); });
    console.log('| ' + cod.padEnd(5) + ' | ' + String(r.todos.length).padStart(5) + ' | ' + String(r.comCantos.length).padStart(8) + ' | ' + String(r.oficiais.length).padStart(11) + ' | ' + String(r.descartados).padStart(11) + ' | ' + String(validos.size).padStart(4) + '/' + TIMES_OFICIAIS[cod].length + '       |');
  }
  console.log('─────────────────────────────────────────────────────────────────────────');
  console.log('  TOTAL OFICIAL: ' + totalOficial + ' jogos · ' + totalDescartado + ' descartados');

  // Relatório de times descartados (transparência)
  console.log('\n═══ TIMES DESCARTADOS (não estão na lista oficial da liga) ═══');
  for (const cod of Object.keys(todosDescartados)) {
    if (todosDescartados[cod].length === 0) continue;
    console.log('\n[' + cod + ']');
    for (const t of todosDescartados[cod]) console.log('   ❌ ' + t);
  }

  if (process.argv.includes('--build')) {
    console.log('\n🔨 Rodando _build_banco.js também…');
    require('./_build_banco');
  } else {
    console.log('\n💡 Para regenerar o banco do browser, rode em seguida:');
    console.log('   node data/_build_banco.js');
  }
}

module.exports = { consolidarLiga, LIGAS_MAP };
