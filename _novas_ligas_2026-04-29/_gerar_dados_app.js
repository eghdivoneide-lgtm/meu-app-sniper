/**
 * Gerador de arquivos <liga>2026.js para o especialista-cantos.
 * Lê JSONs brutos do varredor-rodada e produz arquivos no formato
 * window.DADOS_<CODIGO> = { temporada, ultimaAtualizacao, totalRodadas, times, jogos }.
 *
 * Saída: <liga>2026.js dentro desta pasta.
 * Roda: cd _novas_ligas_2026-04-29 && node _gerar_dados_app.js
 */
const fs = require('fs');
const path = require('path');

const HOJE = new Date().toISOString().split('T')[0];

const LIGAS = [
  { json: 'br_b_rodada_2_2026-04-29.json',  out: 'brasileiraoB2026.js', varJS: 'DADOS_BR_B', temporada: 'Brasileirão Série B' },
  { json: 'arg_m_rodada_2_2026-04-29.json', out: 'metropolitana2026.js', varJS: 'DADOS_ARG_M', temporada: 'Primera B Metropolitana (Argentina)' },
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
    gols: {
      ht: ht || null,
      ft: ft || null,
    },
    cantos: {
      ht: eh.cantos || { m: 0, v: 0 },
      ft: ef.cantos || { m: 0, v: 0 },
    },
    stats_taticas: {
      posse:        ef.posse        || { m: 50, v: 50 },
      finalizacoes: ef.finalizacoes || { m: 0,  v: 0 },
    },
    placar: ft || null,
  };
}

for (const liga of LIGAS) {
  const jsonPath = path.join(__dirname, liga.json);
  if (!fs.existsSync(jsonPath)) {
    console.log(`⚠️  ${liga.json} não encontrado — pulando.`);
    continue;
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const jogosRaw = Array.isArray(raw) ? raw : Object.values(raw);
  const jogos = jogosRaw.map(normalizarJogo);

  // Coletar lista única de times
  const timesSet = new Set();
  jogos.forEach(j => { if (j.mandante) timesSet.add(j.mandante); if (j.visitante) timesSet.add(j.visitante); });
  const times = [...timesSet].sort();

  const dados = {
    temporada: liga.temporada,
    ultimaAtualizacao: HOJE,
    totalRodadas: null,
    times,
    jogos,
  };

  const conteudo = `// ============================================================\n` +
                   `// ${liga.temporada} 2026 — DADOS COLETADOS VIA Varredor-Rodada v4\n` +
                   `// Gerado: ${HOJE} (rodada 24-27/04/2026, ${jogos.length} jogos)\n` +
                   `// ATENÇÃO: liga NOVA — ainda não integrada no index.html do app.\n` +
                   `// Para integrar, ver passos em RELATORIO_NOVAS_LIGAS_2026-04-29.md\n` +
                   `// ============================================================\n\n` +
                   `window.${liga.varJS} = ${JSON.stringify(dados, null, 2)};\n`;

  const outPath = path.join(__dirname, liga.out);
  fs.writeFileSync(outPath, conteudo);

  console.log(`✅ ${liga.out} gerado: ${jogos.length} jogos, ${times.length} times`);
  console.log(`   Times: ${times.join(', ')}`);
  console.log('');
}

console.log('🏁 Geração concluída.');
