/**
 * Gerador de Relatório Visual — EDS Analista Fantasma V4
 * EDS Soluções Inteligentes
 *
 * Gera HTML visual rico após cada análise do orquestrador.
 * Salva em  projeto-fantasma/relatorios/  com nome padronizado:
 *   relatorio_{LIGA}_rod{N}_{DATA}.html
 *
 * @module gerarRelatorioRodada
 */
const fs = require('fs');
const path = require('path');

const RELATORIOS_DIR = path.join(__dirname, 'relatorios');

// ═══════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function cornerColor(val, line) {
  if (typeof val !== 'number') return '#94a3b8';
  return val > line ? '#34d399' : val < line ? '#f87171' : '#fbbf24';
}

function rfIcon(tipo) {
  const map = {
    'ULTRA_DEFENSIVA': '🛡️', 'TATICA_DEFENSIVA': '🛡️', 'EXPULSAO': '🟥',
    'POSSE_ESTERIL': '🌀', 'JOGO_TRUNCADO': '⛏️', 'COLAPSO_2T': '📉',
    'MURO_DEFENSIVO': '🧱', 'DOMINIO_UNILATERAL': '🎯'
  };
  return map[tipo] || '⚠️';
}

function classColor(label) {
  if (!label) return '#94a3b8';
  if (label.includes('OVER')) return '#34d399';
  if (label.includes('UNDER')) return '#f87171';
  return '#fbbf24';
}

// ═══════════════════════════════════════════════════
//  RENDER JOGO CARD
// ═══════════════════════════════════════════════════
function renderJogoCard(j, qualData, index) {
  const cFTm = j.estatisticas_ft?.cantos?.m ?? '?';
  const cFTv = j.estatisticas_ft?.cantos?.v ?? '?';
  const cHTm = j.estatisticas_ht?.cantos?.m ?? '?';
  const cHTv = j.estatisticas_ht?.cantos?.v ?? '?';
  const totalFT = (typeof cFTm === 'number' && typeof cFTv === 'number') ? cFTm + cFTv : '?';
  const totalHT = (typeof cHTm === 'number' && typeof cHTv === 'number') ? cHTm + cHTv : '?';
  const placarHT = j.placar?.ht || '—';
  const placarFT = j.placar?.ft || '—';
  const formM = j.formacao?.m || '—';
  const formV = j.formacao?.v || '—';

  // Stats
  const s = (key, period) => {
    const src = period === 'ht' ? j.estatisticas_ht : period === '2t' ? j.estatisticas_2t : j.estatisticas_ft;
    return src?.[key] ? `${src[key].m ?? '?'} - ${src[key].v ?? '?'}` : '— - —';
  };

  // Red flags for this game
  const rf = qualData?.red_flags || [];
  const classificacao = qualData?.classificacao || '—';

  let h = '';
  h += `<div class="game-card">`;

  // Header
  h += `<div class="game-header">`;
  h += `<span class="game-num">JOGO ${index + 1}</span>`;
  h += `<span class="game-date">${esc(j.data_partida || '')}</span>`;
  h += `<span class="game-class" style="color:${classColor(classificacao)}">${esc(classificacao)}</span>`;
  h += `</div>`;

  // Teams
  h += `<div class="teams-row">`;
  h += `<div class="team home"><div class="team-name">${esc(j.mandante)}</div><div class="team-form">${esc(formM)}</div></div>`;
  h += `<div class="vs-block"><div class="placar">${esc(placarHT)} / ${esc(placarFT)}</div><div class="vs-label">VS</div></div>`;
  h += `<div class="team away"><div class="team-name">${esc(j.visitante)}</div><div class="team-form">${esc(formV)}</div></div>`;
  h += `</div>`;

  // Corners highlight
  h += `<div class="corners-row">`;
  h += `<div class="corner-box"><div class="corner-label">CANTOS FT</div>`;
  h += `<div class="corner-val"><span>${cFTm}</span><span class="x">x</span><span>${cFTv}</span>`;
  h += `<span class="corner-total" style="color:${cornerColor(totalFT, 10)}">= ${totalFT}</span></div></div>`;
  h += `<div class="corner-box"><div class="corner-label">CANTOS HT</div>`;
  h += `<div class="corner-val"><span>${cHTm}</span><span class="x">x</span><span>${cHTv}</span>`;
  h += `<span class="corner-total" style="color:${cornerColor(totalHT, 4)}">= ${totalHT}</span></div></div>`;

  // 2T corners
  if (j.estatisticas_2t?.cantos) {
    const c2m = j.estatisticas_2t.cantos.m, c2v = j.estatisticas_2t.cantos.v;
    const total2T = c2m + c2v;
    h += `<div class="corner-box"><div class="corner-label">CANTOS 2T</div>`;
    h += `<div class="corner-val"><span>${c2m}</span><span class="x">x</span><span>${c2v}</span>`;
    h += `<span class="corner-total" style="color:${cornerColor(total2T, 5)}">= ${total2T}</span></div></div>`;
  }
  h += `</div>`;

  // Stats grid
  const statsList = [
    ['Posse', s('posse', 'ft')],
    ['Finalizações', s('finalizacoes', 'ft')],
    ['No Alvo', s('chutes_alvo', 'ft')],
    ['Faltas', s('faltas', 'ft')],
    ['Defesas GK', s('defesas_goleiro', 'ft')],
    ['Amarelos', s('cartoes_amarelos', 'ft')],
    ['Vermelhos', s('cartoes_vermelhos', 'ft')],
    ['Impedimentos', s('impedimentos', 'ft')],
  ];

  h += `<div class="stats-grid">`;
  statsList.forEach(([label, val]) => {
    h += `<div class="stat-cell"><div class="stat-label">${label}</div><div class="stat-val">${val}</div></div>`;
  });
  h += `</div>`;

  // Red Flags
  if (rf.length > 0) {
    h += `<div class="red-flags">`;
    rf.forEach(flag => {
      const penText = flag.penalidade === 'INVALIDAR' ? 'INVALIDAR' :
        typeof flag.penalidade === 'number' ? (flag.penalidade > 0 ? '+' : '') + flag.penalidade.toFixed(2) : '';
      h += `<div class="rf-item"><span class="rf-icon">${rfIcon(flag.tipo)}</span>`;
      h += `<span class="rf-tipo">${esc(flag.tipo)}</span>`;
      h += `<span class="rf-desc">${esc(flag.descricao)}</span>`;
      if (penText) h += `<span class="rf-pen" style="color:${flag.penalidade === 'INVALIDAR' ? '#f87171' : '#fbbf24'}">${penText}</span>`;
      h += `</div>`;
    });
    h += `</div>`;
  }

  h += `</div>`;
  return h;
}

// ═══════════════════════════════════════════════════
//  RENDER RELATÓRIO COMPLETO
// ═══════════════════════════════════════════════════
function gerarRelatorioHTML(rodada, qualitativasRodada, dna, codigoLiga, rodadaNum) {
  const dataGeracao = new Date().toISOString().slice(0, 10);
  const nomeCompleto = dna?.nome || codigoLiga;

  // Calcular resumos
  let totalCFT = 0, totalCHT = 0, totalRF = 0;
  const classificacoes = {};
  rodada.forEach((j, i) => {
    const q = qualitativasRodada[i];
    if (j.estatisticas_ft?.cantos) totalCFT += j.estatisticas_ft.cantos.m + j.estatisticas_ft.cantos.v;
    if (j.estatisticas_ht?.cantos) totalCHT += j.estatisticas_ht.cantos.m + j.estatisticas_ht.cantos.v;
    totalRF += (q?.red_flags?.length || 0);
    const cl = q?.classificacao || '—';
    classificacoes[cl] = (classificacoes[cl] || 0) + 1;
  });
  const avgFT = (totalCFT / rodada.length).toFixed(1);
  const avgHT = (totalCHT / rodada.length).toFixed(1);

  let html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Relatório Fantasma V4 — ${esc(nomeCompleto)} Rod ${rodadaNum}</title>
<style>
:root{--bg:#0f172a;--card:#1a1f2e;--border:#2d3548;--text:#e2e8f0;--muted:#94a3b8;--dim:#64748b;--gold:#fbbf24;--green:#34d399;--red:#f87171;--blue:#60a5fa;--dark:#0f172a}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:"Segoe UI",system-ui,sans-serif;padding:1.5rem;max-width:950px;margin:0 auto}
h1{color:var(--gold);font-size:1.5rem;letter-spacing:2px;text-align:center}
.subtitle{color:var(--muted);font-size:.85rem;text-align:center;margin-top:4px}
.meta{color:var(--dim);font-size:.7rem;text-align:center;margin-top:4px}

.kpi-bar{display:flex;justify-content:space-around;background:linear-gradient(135deg,#1e293b,var(--dark));border:1px solid var(--gold);border-radius:12px;padding:1rem;margin:1.5rem 0;text-align:center}
.kpi{flex:1}.kpi-label{color:var(--muted);font-size:.65rem;text-transform:uppercase;letter-spacing:1px}.kpi-val{font-weight:900;font-size:1.4rem;margin-top:2px}

.class-bar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:1.5rem}
.class-pill{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:4px 14px;font-size:.75rem;font-weight:700}

.game-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1rem}
.game-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.7rem}
.game-num{color:var(--muted);font-size:.72rem;font-family:monospace}
.game-date{color:var(--dim);font-size:.7rem}
.game-class{font-size:.72rem;font-weight:800;background:var(--dark);padding:2px 10px;border-radius:10px}

.teams-row{display:flex;justify-content:center;align-items:center;gap:1rem;margin-bottom:.8rem}
.team{flex:1}.team.home{text-align:right}.team.away{text-align:left}
.team-name{color:var(--text);font-weight:800;font-size:1.05rem}
.team-form{color:var(--dim);font-size:.7rem}
.vs-block{text-align:center;min-width:90px}
.vs-label{color:var(--gold);font-weight:900;font-size:1.1rem}
.placar{background:var(--dark);color:var(--gold);font-size:.7rem;font-weight:700;padding:2px 10px;border-radius:12px;display:inline-block;margin-bottom:2px}

.corners-row{display:flex;justify-content:center;gap:1.5rem;margin-bottom:.7rem;flex-wrap:wrap}
.corner-box{text-align:center;background:var(--dark);padding:6px 18px;border-radius:8px}
.corner-label{color:var(--muted);font-size:.6rem;text-transform:uppercase;letter-spacing:1px}
.corner-val{font-weight:900;font-size:1.1rem;color:var(--text)}
.corner-val .x{color:var(--dim);margin:0 3px;font-weight:400}
.corner-total{font-size:.85rem;margin-left:6px}

.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
.stat-cell{text-align:center;background:var(--dark);padding:4px 5px;border-radius:6px}
.stat-label{color:var(--dim);font-size:.58rem;text-transform:uppercase;letter-spacing:.5px}
.stat-val{color:#cbd5e1;font-size:.78rem;font-weight:600}

.red-flags{margin-top:.6rem;border-top:1px solid var(--border);padding-top:.5rem}
.rf-item{display:flex;align-items:center;gap:6px;font-size:.72rem;padding:2px 0}
.rf-icon{font-size:.85rem}
.rf-tipo{color:var(--gold);font-weight:700;min-width:120px}
.rf-desc{color:var(--muted);flex:1}
.rf-pen{font-weight:800;font-size:.7rem}

.section-title{color:var(--gold);font-size:1.1rem;font-weight:800;border-bottom:2px solid var(--gold);padding-bottom:6px;margin:1.5rem 0 1rem}
.dna-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:1.5rem}
.dna-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.7rem;text-align:center}
.dna-label{color:var(--dim);font-size:.6rem;text-transform:uppercase;letter-spacing:1px}
.dna-val{color:var(--text);font-weight:800;font-size:1rem;margin-top:2px}

.footer{text-align:center;color:var(--dim);font-size:.65rem;margin-top:2rem;padding-top:1rem;border-top:1px solid var(--border)}
</style></head><body>`;

  // Header
  html += `<h1>EDS ANALISTA FANTASMA V4</h1>`;
  html += `<div class="subtitle">${esc(nomeCompleto)} — Rodada ${rodadaNum} — ${rodada.length} jogos</div>`;
  html += `<div class="meta">Gerado: ${dataGeracao} | Motor: FlashScore Monster V4 | EDS Soluções Inteligentes</div>`;

  // KPI bar
  html += `<div class="kpi-bar">`;
  html += `<div class="kpi"><div class="kpi-label">Jogos</div><div class="kpi-val" style="color:var(--gold)">${rodada.length}</div></div>`;
  html += `<div class="kpi"><div class="kpi-label">Média FT</div><div class="kpi-val" style="color:var(--green)">${avgFT}</div></div>`;
  html += `<div class="kpi"><div class="kpi-label">Média HT</div><div class="kpi-val" style="color:var(--blue)">${avgHT}</div></div>`;
  html += `<div class="kpi"><div class="kpi-label">Total FT</div><div class="kpi-val">${totalCFT}</div></div>`;
  html += `<div class="kpi"><div class="kpi-label">Red Flags</div><div class="kpi-val" style="color:${totalRF > 5 ? 'var(--red)' : 'var(--green)'}">${totalRF}</div></div>`;
  html += `</div>`;

  // Classification pills
  html += `<div class="class-bar">`;
  Object.entries(classificacoes).sort((a, b) => b[1] - a[1]).forEach(([label, count]) => {
    const emoji = label.includes('OVER') ? '🔥' : label.includes('UNDER') ? '❄️' : '⚖️';
    html += `<div class="class-pill" style="color:${classColor(label)}">${emoji} ${esc(label)}: ${count}</div>`;
  });
  html += `</div>`;

  // DNA section
  if (dna) {
    html += `<div class="section-title">🧬 DNA Cultural — ${esc(codigoLiga)}</div>`;
    html += `<div class="dna-grid">`;
    html += `<div class="dna-card"><div class="dna-label">Média Cantos FT</div><div class="dna-val" style="color:var(--green)">${dna.media_cantos_ft ?? '—'}</div></div>`;
    html += `<div class="dna-card"><div class="dna-label">Fator Mandante</div><div class="dna-val" style="color:var(--blue)">${dna.fator_mandante ?? '—'}</div></div>`;
    html += `<div class="dna-card"><div class="dna-label">Tendência</div><div class="dna-val" style="color:var(--gold)">${esc(dna.tendencia_cantos || '—')}</div></div>`;
    html += `<div class="dna-card"><div class="dna-label">Volatilidade</div><div class="dna-val">${dna.volatilidade_cantos ?? '—'}</div></div>`;
    html += `<div class="dna-card"><div class="dna-label">Cantos HT %</div><div class="dna-val">${dna.proporcao_ht ? (dna.proporcao_ht * 100).toFixed(0) + '%' : '—'}</div></div>`;
    html += `<div class="dna-card"><div class="dna-label">Rodadas Analisadas</div><div class="dna-val">${dna.rodadas_analisadas ?? '—'}</div></div>`;
    html += `</div>`;
  }

  // Games
  html += `<div class="section-title">📊 Jogos da Rodada</div>`;
  rodada.forEach((j, i) => {
    html += renderJogoCard(j, qualitativasRodada[i], i);
  });

  // Footer
  html += `<div class="footer">EDS Soluções Inteligentes © 2026 — Analista Fantasma V4<br>Este relatório foi gerado automaticamente pelo orquestrador e salvo para auditoria futura.</div>`;

  html += `</body></html>`;
  return html;
}

// ═══════════════════════════════════════════════════
//  EXPORTAÇÃO
// ═══════════════════════════════════════════════════

/**
 * Gera e salva o relatório HTML na pasta relatorios/
 * @param {Array} rodada - Array de jogos com estatísticas
 * @param {Array} qualitativasRodada - Qualitativas calculadas
 * @param {Object} dna - DNA cultural da liga
 * @param {string} codigoLiga - Código da liga (BR, ARG, USL, MLS...)
 * @param {number|string} rodadaNum - Número da rodada
 * @returns {string} Caminho completo do relatório salvo
 */
function gerarRelatorio(rodada, qualitativasRodada, dna, codigoLiga, rodadaNum) {
  // Garantir pasta
  if (!fs.existsSync(RELATORIOS_DIR)) {
    fs.mkdirSync(RELATORIOS_DIR, { recursive: true });
  }

  const dataStr = new Date().toISOString().slice(0, 10);
  const fileName = `relatorio_${codigoLiga.toLowerCase()}_rod${rodadaNum}_${dataStr}.html`;
  const filePath = path.join(RELATORIOS_DIR, fileName);

  const html = gerarRelatorioHTML(rodada, qualitativasRodada, dna, codigoLiga, rodadaNum);
  fs.writeFileSync(filePath, html, 'utf8');

  return filePath;
}

module.exports = { gerarRelatorio };
