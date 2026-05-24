/**
 * Gera 3 relatórios consolidados a partir dos JSONs da rodada de maio/2026:
 *   - relatorio_rodada_2026-05.csv (1 linha por jogo)
 *   - relatorio_rodada_2026-05.md  (markdown legível)
 *   - relatorio_rodada_2026-05.txt (texto plano)
 */
const fs = require('fs');
const path = require('path');

const PASTA = path.join(__dirname);
const SAIDA = path.join(__dirname, 'relatorios');
fs.mkdirSync(SAIDA, { recursive: true });

const ARQUIVOS = [
  ['BR',     'br_rodada_2_2026-05-05.json',     'Brasileirão Série A'],
  ['BR_B',   'br_b_rodada_2_2026-05-05.json',   'Brasileirão Série B'],
  ['ARG',    'arg_rodada_2_2026-05-05.json',    'Liga Profesional Argentina'],
  ['ARG_B',  'arg_b_rodada_2_2026-05-05.json',  'Primera B Nacional (Argentina)'],
  ['BUN',    'bun_rodada_2_2026-05-05.json',    'Bundesliga (Alemanha)'],
  ['USL',    'usl_rodada_2_2026-05-05.json',    'USL Championship'],
  ['MLS',    'mls_rodada_2_2026-05-05.json',    'Major League Soccer'],
  ['J1',     'j1_rodada_2_2026-05-04.json',     'J1 League (Japão)'],
  ['J2J3',   'j2j3_rodada_2_2026-05-04.json',   'J2/J3 League (Japão)'],
  ['CHN_SL', 'chn_sl_rodada_2_2026-05-04.json', 'Chinese Super League'],
  ['CHN_L1', 'chn_l1_rodada_2_2026-05-04.json', 'China League One']
];

function parsePlacar(s) {
  if (!s) return [null, null];
  const m = (s + '').match(/(\d+)\s*-\s*(\d+)/);
  return m ? [parseInt(m[1]), parseInt(m[2])] : [null, null];
}
function pick(obj, ...keys) {
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return '';
    cur = cur[k];
  }
  return cur == null ? '' : cur;
}
function dup(stat, slot) {
  if (!stat) return '';
  const v = stat[slot];
  return v == null ? '' : v;
}

// ============== CSV ==============
const cabCSV = [
  'liga_codigo','liga_nome','data','mandante','visitante',
  'placar_ht','placar_ft','gols_m_ht','gols_v_ht','gols_m_ft','gols_v_ft',
  'posse_m','posse_v',
  'finalizacoes_m','finalizacoes_v','chutes_alvo_m','chutes_alvo_v',
  'cantos_ft_m','cantos_ft_v','cantos_ht_m','cantos_ht_v',
  'faltas_m','faltas_v','impedimentos_m','impedimentos_v',
  'cartoes_amarelos_m','cartoes_amarelos_v','cartoes_vermelhos_m','cartoes_vermelhos_v',
  'defesas_goleiro_m','defesas_goleiro_v',
  'formacao_m','formacao_v',
  'odd_mandante','odd_empate','odd_visitante',
  'campos_disponiveis','match_id','url'
];
const linhasCSV = [cabCSV.join(';')];

// Para Markdown / TXT
const dadosLigaPorLiga = [];
let totalGeral = { jogos: 0, cantos: 0, gols: 0, btts: 0, o95: 0, o25: 0 };

for (const [cod, arq, nome] of ARQUIVOS) {
  const caminho = path.join(PASTA, arq);
  if (!fs.existsSync(caminho)) continue;
  const dados = JSON.parse(fs.readFileSync(caminho));
  const stat = { cod, nome, arq, jogos: dados.length, cantos: 0, gols: 0, btts: 0, o95: 0, o25: 0, partidas: dados };

  dados.forEach(j => {
    const [gMht, gVht] = parsePlacar(j.placar && j.placar.ht);
    const [gMft, gVft] = parsePlacar(j.placar && j.placar.ft);
    const cFT = j.estatisticas_ft && j.estatisticas_ft.cantos;
    if (cFT) {
      const t = (cFT.m || 0) + (cFT.v || 0);
      stat.cantos += t;
      if (t > 9.5) stat.o95++;
    }
    if (gMft != null && gVft != null) {
      stat.gols += gMft + gVft;
      if (gMft > 0 && gVft > 0) stat.btts++;
      if (gMft + gVft > 2.5) stat.o25++;
    }

    // CSV
    const linha = [
      cod, nome,
      (j.data_partida || '').slice(0, 10),
      j.mandante || '',
      j.visitante || '',
      pick(j, 'placar', 'ht'),
      pick(j, 'placar', 'ft'),
      gMht == null ? '' : gMht,
      gVht == null ? '' : gVht,
      gMft == null ? '' : gMft,
      gVft == null ? '' : gVft,
      dup(j.estatisticas_ft && j.estatisticas_ft.posse, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.posse, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.finalizacoes, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.finalizacoes, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.chutes_alvo, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.chutes_alvo, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.cantos, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.cantos, 'v'),
      dup(j.estatisticas_ht && j.estatisticas_ht.cantos, 'm'),
      dup(j.estatisticas_ht && j.estatisticas_ht.cantos, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.faltas, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.faltas, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.impedimentos, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.impedimentos, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.cartoes_amarelos, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.cartoes_amarelos, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.cartoes_vermelhos, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.cartoes_vermelhos, 'v'),
      dup(j.estatisticas_ft && j.estatisticas_ft.defesas_goleiro, 'm'),
      dup(j.estatisticas_ft && j.estatisticas_ft.defesas_goleiro, 'v'),
      dup(j.formacao, 'm'),
      dup(j.formacao, 'v'),
      pick(j, 'mercado', 'oddM'),
      pick(j, 'mercado', 'oddEmpate'),
      pick(j, 'mercado', 'oddV'),
      pick(j, 'meta', 'campos_disponiveis'),
      j.match_id || '',
      j.url || ''
    ].map(c => {
      const s = String(c).replace(/[\r\n]+/g, ' ').replace(/;/g, ',');
      return s;
    });
    linhasCSV.push(linha.join(';'));
  });

  totalGeral.jogos += stat.jogos;
  totalGeral.cantos += stat.cantos;
  totalGeral.gols += stat.gols;
  totalGeral.btts += stat.btts;
  totalGeral.o95 += stat.o95;
  totalGeral.o25 += stat.o25;
  dadosLigaPorLiga.push(stat);
}

const arqCSV = path.join(SAIDA, 'relatorio_rodada_2026-05.csv');
fs.writeFileSync(arqCSV, '﻿' + linhasCSV.join('\n'), 'utf-8');
console.log('✅ CSV:', arqCSV, '(' + (linhasCSV.length - 1) + ' linhas + cabeçalho)');

// ============== MARKDOWN ==============
const linhasMD = [];
linhasMD.push('# Relatório consolidado — Rodada do fim de semana');
linhasMD.push('**Período:** 01/05/2026 a 04/05/2026  ');
linhasMD.push('**Total:** ' + totalGeral.jogos + ' jogos · 11 ligas · 5 confederações  ');
linhasMD.push('**Geração:** ' + new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
linhasMD.push('');
linhasMD.push('## Resumo agregado');
linhasMD.push('');
linhasMD.push('| LIGA | Jogos | Cantos FT méd | Gols méd | BTTS | Over 9.5C | Over 2.5G |');
linhasMD.push('|------|-------|---------------|----------|------|-----------|-----------|');
for (const s of dadosLigaPorLiga) {
  linhasMD.push('| **' + s.cod + '** ' + s.nome + ' | ' + s.jogos + ' | ' +
    (s.cantos / s.jogos).toFixed(1) + ' | ' +
    (s.gols / s.jogos).toFixed(1) + ' | ' +
    (s.btts / s.jogos * 100).toFixed(0) + '% | ' +
    (s.o95 / s.jogos * 100).toFixed(0) + '% | ' +
    (s.o25 / s.jogos * 100).toFixed(0) + '% |');
}
linhasMD.push('| **TOTAL** | **' + totalGeral.jogos + '** | ' +
  (totalGeral.cantos / totalGeral.jogos).toFixed(1) + ' | ' +
  (totalGeral.gols / totalGeral.jogos).toFixed(1) + ' | ' +
  (totalGeral.btts / totalGeral.jogos * 100).toFixed(0) + '% | ' +
  (totalGeral.o95 / totalGeral.jogos * 100).toFixed(0) + '% | ' +
  (totalGeral.o25 / totalGeral.jogos * 100).toFixed(0) + '% |');

for (const s of dadosLigaPorLiga) {
  linhasMD.push('');
  linhasMD.push('## ' + s.cod + ' — ' + s.nome + ' (' + s.jogos + ' jogos)');
  linhasMD.push('');
  linhasMD.push('| # | Data | Mandante | HT | FT | Visitante | C.HT | C.FT | Finaliz. | C.Alvo | Posse |');
  linhasMD.push('|---|------|----------|----|----|-----------|------|------|----------|--------|-------|');
  s.partidas.forEach((j, i) => {
    const data = (j.data_partida || '').slice(0, 5);
    const ht = ((j.placar && j.placar.ht) || '').replace('Indisponível', 'n/d');
    const ft = ((j.placar && j.placar.ft) || '').replace('Indisponível', 'n/d');
    const cFT = j.estatisticas_ft && j.estatisticas_ft.cantos;
    const cHT = j.estatisticas_ht && j.estatisticas_ht.cantos;
    const fin = j.estatisticas_ft && j.estatisticas_ft.finalizacoes;
    const cAl = j.estatisticas_ft && j.estatisticas_ft.chutes_alvo;
    const ps  = j.estatisticas_ft && j.estatisticas_ft.posse;
    const cFTs = cFT ? cFT.m + '-' + cFT.v : '-';
    const cHTs = cHT ? cHT.m + '-' + cHT.v : '-';
    const fins = fin ? fin.m + '-' + fin.v : '-';
    const cAls = cAl ? cAl.m + '-' + cAl.v : '-';
    const psS  = ps  ? ps.m + '-' + ps.v  : '-';
    linhasMD.push('| ' + (i + 1) + ' | ' + data + ' | ' + (j.mandante || '?') + ' | ' + ht + ' | ' + ft + ' | ' + (j.visitante || '?') + ' | ' + cHTs + ' | **' + cFTs + '** | ' + fins + ' | ' + cAls + ' | ' + psS + ' |');
  });
}

const arqMD = path.join(SAIDA, 'relatorio_rodada_2026-05.md');
fs.writeFileSync(arqMD, linhasMD.join('\n'), 'utf-8');
console.log('✅ MD :', arqMD);

// ============== TXT (plano) ==============
const linhasTXT = [];
linhasTXT.push('═══════════════════════════════════════════════════════════════════════════════');
linhasTXT.push('  RELATÓRIO CONSOLIDADO — RODADA DO FIM DE SEMANA');
linhasTXT.push('  Período: 01/05/2026 a 04/05/2026');
linhasTXT.push('  Total:   ' + totalGeral.jogos + ' jogos · 11 ligas · 5 confederações');
linhasTXT.push('  Gerado:  ' + new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
linhasTXT.push('═══════════════════════════════════════════════════════════════════════════════');
linhasTXT.push('');
linhasTXT.push('RESUMO AGREGADO');
linhasTXT.push('───────────────────────────────────────────────────────────────────────────────');
linhasTXT.push('LIGA       | JOGOS | C.FT | GOLS | BTTS | O9.5C | O2.5G');
linhasTXT.push('-----------+-------+------+------+------+-------+------');
for (const s of dadosLigaPorLiga) {
  linhasTXT.push(s.cod.padEnd(10) + ' | ' +
    String(s.jogos).padStart(5) + ' | ' +
    (s.cantos / s.jogos).toFixed(1).padStart(4) + ' | ' +
    (s.gols / s.jogos).toFixed(1).padStart(4) + ' | ' +
    (s.btts / s.jogos * 100).toFixed(0).padStart(3) + '% | ' +
    (s.o95 / s.jogos * 100).toFixed(0).padStart(4) + '% | ' +
    (s.o25 / s.jogos * 100).toFixed(0).padStart(4) + '%');
}
linhasTXT.push('-----------+-------+------+------+------+-------+------');
linhasTXT.push('TOTAL      | ' + String(totalGeral.jogos).padStart(5) + ' | ' +
  (totalGeral.cantos / totalGeral.jogos).toFixed(1).padStart(4) + ' | ' +
  (totalGeral.gols / totalGeral.jogos).toFixed(1).padStart(4) + ' | ' +
  (totalGeral.btts / totalGeral.jogos * 100).toFixed(0).padStart(3) + '% | ' +
  (totalGeral.o95 / totalGeral.jogos * 100).toFixed(0).padStart(4) + '% | ' +
  (totalGeral.o25 / totalGeral.jogos * 100).toFixed(0).padStart(4) + '%');

for (const s of dadosLigaPorLiga) {
  linhasTXT.push('');
  linhasTXT.push('═══════════════════════════════════════════════════════════════════════════════');
  linhasTXT.push('  ' + s.cod + ' — ' + s.nome + ' (' + s.jogos + ' jogos)');
  linhasTXT.push('═══════════════════════════════════════════════════════════════════════════════');
  s.partidas.forEach((j, i) => {
    const data = (j.data_partida || '').slice(0, 10);
    const ht = ((j.placar && j.placar.ht) || '').replace('Indisponível', 'n/d');
    const ft = ((j.placar && j.placar.ft) || '').replace('Indisponível', 'n/d');
    const cFT = j.estatisticas_ft && j.estatisticas_ft.cantos;
    const cHT = j.estatisticas_ht && j.estatisticas_ht.cantos;
    const fin = j.estatisticas_ft && j.estatisticas_ft.finalizacoes;
    const cAl = j.estatisticas_ft && j.estatisticas_ft.chutes_alvo;
    const ps  = j.estatisticas_ft && j.estatisticas_ft.posse;
    const fa  = j.estatisticas_ft && j.estatisticas_ft.faltas;
    const ca  = j.estatisticas_ft && j.estatisticas_ft.cartoes_amarelos;
    linhasTXT.push('');
    linhasTXT.push('  [' + String(i + 1).padStart(2) + '] ' + data + '  ' + (j.mandante || '?') + '  ' + ht + ' / ' + ft + '  ' + (j.visitante || '?'));
    linhasTXT.push('       Cantos: HT ' + (cHT ? cHT.m + '-' + cHT.v : '-') + '  FT ' + (cFT ? cFT.m + '-' + cFT.v : '-'));
    linhasTXT.push('       Finalizações: ' + (fin ? fin.m + '-' + fin.v : '-') + '  Chutes ao alvo: ' + (cAl ? cAl.m + '-' + cAl.v : '-'));
    linhasTXT.push('       Posse: ' + (ps ? ps.m + '%-' + ps.v + '%' : '-') + '  Faltas: ' + (fa ? fa.m + '-' + fa.v : '-') + '  Amarelos: ' + (ca ? ca.m + '-' + ca.v : '-'));
  });
}

const arqTXT = path.join(SAIDA, 'relatorio_rodada_2026-05.txt');
fs.writeFileSync(arqTXT, linhasTXT.join('\n'), 'utf-8');
console.log('✅ TXT:', arqTXT);

console.log('');
console.log('Arquivos gerados em:', SAIDA);
