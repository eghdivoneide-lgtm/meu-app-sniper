/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          OLHOS DE ÁGUIA — EDS Soluções Inteligentes             ║
 * ║      Motor de Seleção YAAKEN: 1 jogo por liga, o melhor         ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  PIPELINE:                                                       ║
 * ║  1. Lê yaaken_{LIGA}_{DATA}.json (odds + H2H coletados)         ║
 * ║  2. Lê escoteiro_{LIGA}_{DATA}.json (DNA dos times)             ║
 * ║  3. Aplica 6 camadas de pontuação por jogo                      ║
 * ║  4. Seleciona o TOP 1 por liga (+ TOP 2 como reserva)           ║
 * ║  5. Exibe o boletim "Olhos de Águia" no terminal                ║
 * ║  6. Salva JSON em EDS-ODDS-TEACHER/yaaken/aguia_{DATA}.json     ║
 * ║                                                                  ║
 * ║  USO:                                                            ║
 * ║    node olhos_de_aguia.js                (usa data de hoje)     ║
 * ║    node olhos_de_aguia.js --data 2026-04-11  (data específica)  ║
 * ║    node olhos_de_aguia.js --liga BR      (só uma liga)          ║
 * ║                                                                  ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  CAMADAS DE PONTUAÇÃO (0-100 pts total):                        ║
 * ║  [1] ZONA DE ODD       — 0-25 pts                               ║
 * ║  [2] ALINHAMENTO DNA   — 0-25 pts (Escoteiro)                   ║
 * ║  [3] HISTÓRICO H2H     — 0-20 pts                               ║
 * ║  [4] FORMA RECENTE     — 0-15 pts                               ║
 * ║  [5] TENDÊNCIA EMPATE  — 0-10 pts (bônus/penalidade)            ║
 * ║  [6] DISPERSÃO DE ODDS — 0-5 pts  (mercado indeciso)            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════

const BASE_DIR    = path.join(__dirname, '..', 'EDS-ODDS-TEACHER');
const DIR_YAAKEN  = path.join(BASE_DIR, 'yaaken');
const DIR_ESCOT   = path.join(BASE_DIR, 'escoteiro');

const ODD_MIN     = 2.40;   // abaixo disso não é zona YAAKEN
const ODD_MAX     = 5.50;   // acima disso é especulativo demais
const ODD_IDEAL_L = 2.60;   // faixa ideal inferior
const ODD_IDEAL_H = 4.00;   // faixa ideal superior

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

function parseOdd(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function dataHoje() {
  return new Date().toISOString().split('T')[0];
}

function log(msg, tipo = 'info') {
  const icons = { info: '  ℹ️ ', ok: '  ✅', warn: '  ⚠️ ', aguia: '  🦅', score: '  🎯', liga: '\n🏆' };
  console.log(`${icons[tipo] || '  •'} ${msg}`);
}

// ─── carrega o JSON mais recente de uma pasta para uma liga ───
function carregarJson(pasta, prefixo, liga, data) {
  // Tenta data exata primeiro, depois procura o mais recente
  const exato = path.join(pasta, `${prefixo}_${liga}_${data}.json`);
  if (fs.existsSync(exato)) return JSON.parse(fs.readFileSync(exato, 'utf8'));

  // Busca o arquivo mais recente para essa liga
  const arquivos = fs.readdirSync(pasta)
    .filter(f => f.startsWith(`${prefixo}_${liga}_`) && f.endsWith('.json'))
    .sort()
    .reverse();

  if (arquivos.length === 0) return null;
  const arq = path.join(pasta, arquivos[0]);
  log(`Usando arquivo mais recente: ${arquivos[0]}`, 'warn');
  return JSON.parse(fs.readFileSync(arq, 'utf8'));
}

// ═══════════════════════════════════════════════════════════════
//  CAMADA 1 — ZONA DE ODD (0-25 pts)
//  Faixa ideal 2.60-4.00: máximos 25 pts
//  Limites 2.40-2.59 ou 4.01-5.50: parcial
//  Fora da faixa: 0 pts + jogo excluído
// ═══════════════════════════════════════════════════════════════

function scoreZonaOdd(odd) {
  if (!odd || odd < ODD_MIN || odd > ODD_MAX) return { pts: 0, excluir: true, motivo: `Odd ${odd} fora da zona YAAKEN` };

  if (odd >= ODD_IDEAL_L && odd <= ODD_IDEAL_H) {
    // Pico em ~3.20 (centro da faixa)
    const distCentro = Math.abs(odd - 3.20);
    const pts = Math.round(25 - (distCentro / 0.8) * 5);
    return { pts: Math.max(20, pts), excluir: false, motivo: `Odd ${odd} na faixa ideal` };
  }

  // Bordas
  const pts = odd < ODD_IDEAL_L ? 12 : 10;
  return { pts, excluir: false, motivo: `Odd ${odd} na borda da zona` };
}

// ═══════════════════════════════════════════════════════════════
//  CAMADA 2 — ALINHAMENTO DNA (0-25 pts)
//  Verifica se o perfil do time apoia o resultado de alto odd
// ═══════════════════════════════════════════════════════════════

// Direção da aposta: M = mandante ganhou, E = empate, V = visitante ganhou
function scoreAlinhamentoDNA(dnaM, dnaV, direcao) {
  if (!dnaM || !dnaV) return { pts: 0, motivo: 'DNA não disponível' };

  const perfilM = dnaM.perfil || 'EQUILIBRADO';
  const perfilV = dnaV.perfil || 'EQUILIBRADO';
  const empM    = dnaM.tendencia_empate || 'MEDIO';
  const empV    = dnaV.tendencia_empate || 'MEDIO';

  let pts = 0;
  const motivos = [];

  if (direcao === 'M') {
    // Mandante vencendo com odd alta → inesperado → mais pontos se visitante for forte
    if (['OFENSIVO_SOLIDO', 'OFENSIVO', 'CAMISA_ABERTA'].includes(perfilV)) {
      pts += 12; motivos.push(`Visitante ${perfilV} (ataque forte)`);
    }
    if (['VULNERAVEL', 'EQUILIBRADO'].includes(perfilM)) {
      pts += 8; motivos.push(`Mandante ${perfilM} com reação possível`);
    }
    if (dnaM.geral?.v_pct >= 40) { pts += 5; motivos.push(`Mandante vence ${dnaM.geral.v_pct}% em casa`); }
  }

  if (direcao === 'V') {
    // Visitante vencendo com odd alta → zebra → DNA do visitante conta muito
    if (['OFENSIVO_SOLIDO', 'OFENSIVO', 'CAMISA_ABERTA'].includes(perfilV)) {
      pts += 15; motivos.push(`Visitante ${perfilV} — ataque poderoso fora`);
    }
    if (['VULNERAVEL', 'EQUILIBRADO'].includes(perfilM)) {
      pts += 10; motivos.push(`Mandante ${perfilM} — defesa exposta em casa`);
    }
    if (dnaV.fora?.v_pct >= 30) { pts += 5; motivos.push(`Visitante vence ${dnaV.fora.v_pct}% fora`); }
    if (dnaM.geral?.gc_jogo >= 1.3) { pts += 5; motivos.push(`Mandante leva ${dnaM.geral.gc_jogo} GC/jogo`); }
  }

  if (direcao === 'E') {
    // Empate com odd alta → ambos equilibrados ou DEFENSIVOS
    if (['DEFENSIVO', 'EQUILIBRADO', 'MURO_DUPLO'].includes(perfilM)) {
      pts += 10; motivos.push(`Mandante ${perfilM}`);
    }
    if (['DEFENSIVO', 'EQUILIBRADO', 'MURO_DUPLO'].includes(perfilV)) {
      pts += 10; motivos.push(`Visitante ${perfilV}`);
    }
    if (empM === 'ALTO') { pts += 5; motivos.push('Mandante tem tendência ALTO empate'); }
    if (empV === 'ALTO') { pts += 5; motivos.push('Visitante tem tendência ALTO empate'); }
  }

  return { pts: Math.min(pts, 25), motivo: motivos.join(' | ') || 'Sem alinhamento DNA' };
}

// ═══════════════════════════════════════════════════════════════
//  CAMADA 3 — HISTÓRICO H2H (0-20 pts)
// ═══════════════════════════════════════════════════════════════

function scoreH2H(h2h, direcao) {
  if (!h2h || h2h.total === 0) return { pts: 5, motivo: 'H2H sem dados (neutro)' };

  const total = h2h.total;
  const taxaEmp = h2h.taxa_empate || 0;
  const taxaV   = h2h.taxa_visitante || 0;
  const taxaM   = 100 - taxaEmp - taxaV;

  // Penalidade para H2H com poucos jogos
  const peso = total >= 5 ? 1.0 : total >= 3 ? 0.7 : 0.4;

  let pts = 0;
  let motivo = '';

  if (direcao === 'E') {
    pts = Math.round((taxaEmp / 100) * 20 * peso);
    motivo = `H2H empate: ${taxaEmp}% (${total} jogos)`;
  } else if (direcao === 'V') {
    pts = Math.round((taxaV / 100) * 20 * peso);
    motivo = `H2H visitante: ${taxaV}% (${total} jogos)`;
  } else {
    pts = Math.round((taxaM / 100) * 20 * peso);
    motivo = `H2H mandante: ${Math.round(taxaM)}% (${total} jogos)`;
  }

  if (total < 3) motivo += ' ⚠️ amostra pequena';

  return { pts, motivo };
}

// ═══════════════════════════════════════════════════════════════
//  CAMADA 4 — FORMA RECENTE (0-15 pts)
//  Últimos 5 resultados do time apostado
// ═══════════════════════════════════════════════════════════════

function scoreForma(dna, direcao) {
  if (!dna) return { pts: 5, motivo: 'DNA não disponível' };

  // Para direcao V ou M, usa forma do time apostado
  const forma = dna.forma_recente || [];
  if (forma.length === 0) return { pts: 5, motivo: 'Forma não disponível' };

  // Últimos 5 jogos: V=3pts, E=1pt, D=0pts
  const ultimos = forma.slice(-5);
  const score = ultimos.reduce((acc, r) => acc + (r === 'V' ? 3 : r === 'E' ? 1 : 0), 0);
  const maxScore = ultimos.length * 3;
  const pts = Math.round((score / maxScore) * 15);

  const streak = forma.slice(-3).every(r => r === 'V') ? ' 🔥 série 3V' :
                 forma.slice(-3).every(r => r === 'D') ? ' 📉 3 derrotas' : '';

  return { pts, motivo: `Forma ${ultimos.join('-')} (${score}/${maxScore} pts)${streak}` };
}

// ═══════════════════════════════════════════════════════════════
//  CAMADA 5 — TENDÊNCIA EMPATE (bônus/penalidade) (0-10 pts)
// ═══════════════════════════════════════════════════════════════

function scoreTendenciaEmpate(dnaM, dnaV, direcao) {
  if (!dnaM || !dnaV) return { pts: 5, motivo: 'DNA não disponível' };

  const empM = dnaM.tendencia_empate || 'MEDIO';
  const empV = dnaV.tendencia_empate || 'MEDIO';

  if (direcao === 'E') {
    const pts = (empM === 'ALTO' ? 5 : empM === 'MEDIO' ? 3 : 0) +
                (empV === 'ALTO' ? 5 : empV === 'MEDIO' ? 3 : 0);
    return { pts, motivo: `Empate: M=${empM} | V=${empV}` };
  }

  if (direcao === 'V' || direcao === 'M') {
    // Empate alto em ambos penaliza um pouco a aposta no resultado decisivo
    const penalidade = (empM === 'ALTO' && empV === 'ALTO') ? 2 : 0;
    const pts = Math.max(0, 10 - penalidade - (empM === 'ALTO' ? 3 : 0));
    return { pts, motivo: `Tendência empate M=${empM} | V=${empV}` };
  }

  return { pts: 5, motivo: 'Neutro' };
}

// ═══════════════════════════════════════════════════════════════
//  CAMADA 6 — DISPERSÃO DE ODDS (0-5 pts)
//  Mercado muito indeciso (3 odds próximas) = mais instabilidade = mais valor
// ═══════════════════════════════════════════════════════════════

function scoreDispersao(oddM, oddE, oddV) {
  if (!oddM || !oddE || !oddV) return { pts: 2, motivo: 'Odds incompletas' };

  const todas  = [oddM, oddE, oddV].sort((a, b) => a - b);
  const spread = todas[2] - todas[0];

  // Spread pequeno (< 1.0) = mercado indeciso = mais valor na odd alta
  if (spread < 0.80) return { pts: 5, motivo: `Spread ${spread.toFixed(2)} — mercado indeciso 🎯` };
  if (spread < 1.50) return { pts: 3, motivo: `Spread ${spread.toFixed(2)} — mercado moderado` };
  return { pts: 1, motivo: `Spread ${spread.toFixed(2)} — favorito claro` };
}

// ═══════════════════════════════════════════════════════════════
//  MOTOR PRINCIPAL — calcula score para cada direção possível
// ═══════════════════════════════════════════════════════════════

function calcularScoreJogo(jogo, dnaM, dnaV) {
  const odds = jogo.odds;
  const oM   = parseOdd(odds.oddM);
  const oE   = parseOdd(odds.oddEmpate);
  const oV   = parseOdd(odds.oddV);

  const candidatos = [];

  for (const [dir, odd, dnaBet] of [['M', oM, dnaM], ['E', oE, null], ['V', oV, dnaV]]) {
    const c1 = scoreZonaOdd(odd);
    if (c1.excluir) continue;

    const c2 = scoreAlinhamentoDNA(dnaM, dnaV, dir);
    const c3 = scoreH2H(jogo.h2h, dir);

    // Para empate, usa DNA de ambos os times (pior caso)
    const dnaForma = dir === 'E' ? (dnaM || dnaV) :
                     dir === 'M' ? dnaM : dnaV;
    const c4 = scoreForma(dnaForma, dir);
    const c5 = scoreTendenciaEmpate(dnaM, dnaV, dir);
    const c6 = scoreDispersao(oM, oE, oV);

    const total = c1.pts + c2.pts + c3.pts + c4.pts + c5.pts + c6.pts;

    candidatos.push({
      direcao:   dir,
      odd:       odd,
      score:     total,
      detalhes: {
        zona_odd:    c1,
        dna:         c2,
        h2h:         c3,
        forma:       c4,
        tendencia:   c5,
        dispersao:   c6
      }
    });
  }

  // Ordena pelo score mais alto
  candidatos.sort((a, b) => b.score - a.score);
  return candidatos;
}

// ═══════════════════════════════════════════════════════════════
//  PROCESSADOR DE LIGA
// ═══════════════════════════════════════════════════════════════

function processarLiga(codigoLiga, data) {
  const yaaken  = carregarJson(DIR_YAAKEN, 'yaaken',    codigoLiga, data);
  const escot   = carregarJson(DIR_ESCOT,  'escoteiro', codigoLiga, data);

  if (!yaaken) {
    log(`Sem dados YAAKEN para ${codigoLiga}`, 'warn');
    return null;
  }

  const perfis = escot ? escot.perfis : {};

  const resultados = [];

  for (const jogo of yaaken.jogos) {
    const dnaM = perfis[jogo.mandante] || null;
    const dnaV = perfis[jogo.visitante] || null;

    // Tenta match fuzzy se nome exato falhar
    if (!dnaM || !dnaV) {
      const nomes = Object.keys(perfis);
      const encontrarFuzzy = (nome) => {
        const n = nome.toLowerCase().replace(/[^a-z]/g, '');
        return nomes.find(p => p.toLowerCase().replace(/[^a-z]/g, '').includes(n) ||
                               n.includes(p.toLowerCase().replace(/[^a-z]/g, '')));
      };
      if (!dnaM) {
        const match = encontrarFuzzy(jogo.mandante);
        if (match) jogo._dnaM_key = match;
      }
      if (!dnaV) {
        const match = encontrarFuzzy(jogo.visitante);
        if (match) jogo._dnaV_key = match;
      }
    }

    const dnaFinalM = dnaM || (jogo._dnaM_key ? perfis[jogo._dnaM_key] : null);
    const dnaFinalV = dnaV || (jogo._dnaV_key ? perfis[jogo._dnaV_key] : null);

    const candidatos = calcularScoreJogo(jogo, dnaFinalM, dnaFinalV);
    if (candidatos.length === 0) continue;

    const melhor = candidatos[0];

    resultados.push({
      mandante:  jogo.mandante,
      visitante: jogo.visitante,
      data:      jogo.data,
      liga:      codigoLiga,
      odds: {
        M: parseOdd(jogo.odds.oddM),
        E: parseOdd(jogo.odds.oddEmpate),
        V: parseOdd(jogo.odds.oddV)
      },
      aposta:    melhor.direcao,
      odd_alvo:  melhor.odd,
      score:     melhor.score,
      nivel:     melhor.score >= 70 ? '🔥 FORTE'  :
                 melhor.score >= 55 ? '✅ SÓLIDO' :
                 melhor.score >= 40 ? '⚠️  MÉDIO'  : '❌ FRACO',
      detalhes:  melhor.detalhes,
      dna_m:     dnaFinalM ? { perfil: dnaFinalM.perfil, tend_emp: dnaFinalM.tendencia_empate } : null,
      dna_v:     dnaFinalV ? { perfil: dnaFinalV.perfil, tend_emp: dnaFinalV.tendencia_empate } : null,
      todos_candidatos: candidatos.map(c => ({
        dir: c.direcao, odd: c.odd, score: c.score
      }))
    });
  }

  resultados.sort((a, b) => b.score - a.score);
  return resultados;
}

// ═══════════════════════════════════════════════════════════════
//  BOLETIM OLHOS DE ÁGUIA — saída no terminal
// ═══════════════════════════════════════════════════════════════

function exibirBoletim(todosResultados, data) {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║         🦅  OLHOS DE ÁGUIA  —  EDS Soluções Inteligentes    ║');
  console.log(`║              Boletim de Seleção YAAKEN — ${data}          ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const top1PorLiga = [];

  for (const [liga, resultados] of Object.entries(todosResultados)) {
    if (!resultados || resultados.length === 0) {
      console.log(`\n  🏆 ${liga} — sem dados disponíveis`);
      continue;
    }

    const nomeliga = {
      BR: 'Brasileirão', MLS: 'MLS', ARG: 'Argentina',
      USL: 'USL', BUN: 'Bundesliga'
    }[liga] || liga;

    console.log(`\n  ┌─── 🏆 ${nomeliga} (${liga}) ${'─'.repeat(40 - nomeliga.length)}`);

    const top = resultados.slice(0, 3);

    top.forEach((r, i) => {
      const icone = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
      const dir   = r.aposta === 'M' ? `CASA  (${r.mandante})` :
                    r.aposta === 'V' ? `FORA  (${r.visitante})` : 'EMPATE';
      const barra = '█'.repeat(Math.round(r.score / 10)) + '░'.repeat(10 - Math.round(r.score / 10));

      console.log(`  │`);
      console.log(`  │  ${icone} ${r.mandante} vs ${r.visitante}`);
      console.log(`  │     Aposta:  ${dir}  @  ${r.odd_alvo}`);
      console.log(`  │     Score:   ${barra} ${r.score}/100  ${r.nivel}`);

      if (i === 0) {
        // Detalhes do TOP 1
        const d = r.detalhes;
        console.log(`  │     ─────────────────────────────────────────`);
        console.log(`  │     📐 Zona odd:   ${d.zona_odd.pts}/25 — ${d.zona_odd.motivo}`);
        console.log(`  │     🧬 DNA:        ${d.dna.pts}/25 — ${d.dna.motivo}`);
        console.log(`  │     📊 H2H:        ${d.h2h.pts}/20 — ${d.h2h.motivo}`);
        console.log(`  │     📋 Forma:      ${d.forma.pts}/15 — ${d.forma.motivo}`);
        console.log(`  │     📈 Tend.emp:   ${d.tendencia.pts}/10 — ${d.tendencia.motivo}`);
        console.log(`  │     💫 Dispersão:  ${d.dispersao.pts}/5 — ${d.dispersao.motivo}`);
        if (r.dna_m) console.log(`  │     🧬 DNA: ${r.mandante}=${r.dna_m.perfil}(${r.dna_m.tend_emp}) | ${r.visitante}=${r.dna_v?.perfil || '?'}(${r.dna_v?.tend_emp || '?'})`);
      }
    });

    console.log(`  └${'─'.repeat(52)}`);

    if (resultados.length > 0) top1PorLiga.push(resultados[0]);
  }

  // Sumário final
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🦅  SELEÇÃO FINAL — 1 JOGO POR LIGA                        ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');

  top1PorLiga.sort((a, b) => b.score - a.score);

  top1PorLiga.forEach((r, i) => {
    const nomes = { BR: '🇧🇷', MLS: '🇺🇸 MLS', ARG: '🇦🇷', USL: '🇺🇸 USL', BUN: '🇩🇪' };
    const flag  = nomes[r.liga] || r.liga;
    const dir   = r.aposta === 'M' ? `CASA  @${r.odd_alvo}` :
                  r.aposta === 'V' ? `FORA  @${r.odd_alvo}` : `EMPATE @${r.odd_alvo}`;
    console.log(`║  ${i+1}. ${flag} ${r.mandante} vs ${r.visitante}`);
    console.log(`║     → ${dir}  |  ${r.nivel}  (${r.score}/100)`);
    console.log('║');
  });

  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  let data  = dataHoje();
  let ligas = ['BR', 'MLS', 'ARG', 'USL', 'BUN'];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && args[i + 1]) data = args[++i];
    if (args[i] === '--liga' && args[i + 1]) ligas = [args[++i].toUpperCase()];
  }

  console.log(`\n🦅 OLHOS DE ÁGUIA — Iniciando análise para ${data}`);
  console.log(`   Ligas: ${ligas.join(', ')}\n`);

  const todosResultados = {};

  for (const liga of ligas) {
    process.stdout.write(`  Processando ${liga}... `);
    try {
      const resultado = processarLiga(liga, data);
      todosResultados[liga] = resultado;
      console.log(`${resultado ? resultado.length + ' jogos pontuados' : 'sem dados'}`);
    } catch (e) {
      console.log(`ERRO: ${e.message}`);
      todosResultados[liga] = null;
    }
  }

  exibirBoletim(todosResultados, data);

  // Salva JSON
  const pastaOut = path.join(DIR_YAAKEN);
  if (!fs.existsSync(pastaOut)) fs.mkdirSync(pastaOut, { recursive: true });

  const nomeArq = path.join(pastaOut, `aguia_${data}.json`);
  const output  = {
    data,
    ligas_analisadas: ligas,
    gerado_em: new Date().toISOString(),
    selecao: Object.entries(todosResultados)
      .filter(([, r]) => r && r.length > 0)
      .map(([liga, r]) => ({ liga, top1: r[0], top2: r[1] || null, total_candidatos: r.length }))
  };

  fs.writeFileSync(nomeArq, JSON.stringify(output, null, 2));
  console.log(`📁 Salvo: ${nomeArq}\n`);
}

main().catch(console.error);
