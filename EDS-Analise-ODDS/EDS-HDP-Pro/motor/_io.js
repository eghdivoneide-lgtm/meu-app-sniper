// EDS-HDP-Pro · IO comum
// Carrega todos os jogos de uma liga, normalizado pro motor

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const LIGAS = ['BR', 'BR_B', 'ARG', 'ARG_B', 'MLS', 'USL'];

// Lê todos os jogos de uma liga, deduplica por match_id
function carregarLiga(liga) {
  const dir = path.join(DATA_DIR, liga);
  if (!fs.existsSync(dir)) return [];
  const arqs = fs.readdirSync(dir).filter(a => a.endsWith('.json') && !a.includes('backup'));
  const seen = new Set();
  const jogos = [];
  for (const a of arqs) {
    let d;
    try { d = JSON.parse(fs.readFileSync(path.join(dir, a), 'utf8')); }
    catch (e) { continue; }
    const lista = Array.isArray(d) ? d : (d.jogos || []);
    for (const j of lista) {
      const id = j.match_id || (j.mandante + '|' + j.visitante + '|' + (j.data_partida || ''));
      if (seen.has(id)) continue;
      if (!j.estatisticas_ft?.cantos || j.estatisticas_ft.cantos.m === undefined) continue;
      seen.add(id);
      jogos.push(j);
    }
  }
  return jogos;
}

function carregarTodas() {
  const out = {};
  for (const l of LIGAS) out[l] = carregarLiga(l);
  return out;
}

// Lista de times únicos de uma liga (extraídos dos próprios jogos)
function timesDaLiga(jogos) {
  const set = new Set();
  for (const j of jogos) { set.add(j.mandante); set.add(j.visitante); }
  return [...set].sort();
}

module.exports = { LIGAS, DATA_DIR, carregarLiga, carregarTodas, timesDaLiga };
