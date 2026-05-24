/**
 * RECALCULAR ESCOTEIRO — Gera perfis DNA completos a partir dos dados de cantos+placar
 * EDS Soluções Inteligentes — Dados REAIS, zero estimativas
 *
 * Usa os arquivos *2026.js (que têm placar real do FlashScore) para calcular:
 *   V/E/D, GP/GC, Casa/Fora, Forma recente, Perfil, Tendência empate, Notas YAAKEN
 *
 * Substitui os escoteiro_*.json que tinham dados parciais (só ~100 jogos)
 * pelos dados completos (180+ ARG, 255 BUN)
 *
 * Uso:
 *   node recalcular_escoteiro.js --liga ARG
 *   node recalcular_escoteiro.js --liga BUN
 *   node recalcular_escoteiro.js --todas
 */

const fs   = require('fs');
const path = require('path');

const LIGAS = {
  BR:  { arquivo: 'brasileirao2026.js', variavel: 'DADOS_BR',  nome: 'Brasileirão Série A' },
  MLS: { arquivo: 'mls2026.js',         variavel: 'DADOS_MLS', nome: 'Major League Soccer' },
  ARG: { arquivo: 'argentina2026.js',   variavel: 'DADOS_ARG', nome: 'Liga Profesional Argentina' },
  USL: { arquivo: 'usl2026.js',         variavel: 'DADOS_USL', nome: 'USL Championship' },
  BUN: { arquivo: 'bundesliga2026.js',  variavel: 'DADOS_BUN', nome: 'Bundesliga' }
};

const dataDir = path.join(__dirname, '..', 'especialista-cantos', 'data');
const escoteiroDir = path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'escoteiro');

function carregarDados(liga) {
  const caminho = path.join(dataDir, liga.arquivo);
  if (!fs.existsSync(caminho)) return null;
  let raw = fs.readFileSync(caminho, 'utf-8');
  const window = {};
  const varNames = ['DADOS_ARG','DADOS_USL','DADOS_MLS','DADOS_BR','DADOS_BUN','DADOS_ECU'];
  const decls = varNames.map(v => `var ${v};`).join('\n');
  // Primeira tentativa: arquivo completo
  try {
    const fn = new Function('window', 'module', decls + '\n' + raw + '\nreturn window;');
    const w = fn({}, { exports: {} });
    return w[liga.variavel];
  } catch(e) {
    // Arquivo pode estar truncado — tentar recuperar até o último objeto completo
    console.warn(`  ⚠️  ${liga.arquivo} parece truncado. Tentando recuperar dados parciais...`);
    // Encontrar último fechamento de objeto de jogo: '    },' ou '    }' antes de ']'
    const lastComplete = raw.lastIndexOf('\n    },\n    {');
    if (lastComplete > 0) {
      // Truncar na última vírgula + fechar a array e o objeto
      let truncated = raw.slice(0, lastComplete + 6); // inclui '    },'
      // Remover a vírgula final e fechar ]};
      truncated = truncated.replace(/,\s*$/, '') + '\n  ]\n};\n';
      // Recolocar o prefixo correto (window.DADOS_XX = {...})
      // O truncated já inclui o início (window.DADOS_XX = {...)
      try {
        const fn2 = new Function('window', 'module', decls + '\n' + truncated + '\nreturn window;');
        const w2 = fn2({}, { exports: {} });
        const resultado = w2[liga.variavel];
        if (resultado) {
          console.warn(`  ✅  Recuperados ${resultado.jogos?.length || 0} jogos do arquivo truncado.`);
          return resultado;
        }
      } catch(e2) {
        console.warn(`  ❌  Falha na recuperação: ${e2.message}`);
      }
    }
    console.warn(`  ❌  Não foi possível recuperar ${liga.arquivo}: ${e.message}`);
    return null;
  }
}

function calcularPerfil(gp_jogo, gc_jogo) {
  if (gp_jogo >= 1.8 && gc_jogo >= 1.5) return 'CAMISA_ABERTA';
  if (gp_jogo >= 1.8 && gc_jogo < 1.2)  return 'OFENSIVO_SOLIDO';
  if (gp_jogo < 1.0  && gc_jogo < 1.0)  return 'MURO_DUPLO';
  if (gp_jogo < 1.0  && gc_jogo >= 1.5) return 'VULNERAVEL';
  if (gp_jogo >= 1.5 && gc_jogo < 1.5)  return 'OFENSIVO';
  if (gp_jogo < 1.2  && gc_jogo < 1.2)  return 'DEFENSIVO';
  return 'EQUILIBRADO';
}

function calcularTendenciaEmpate(e_pct, gc_jogo, gp_jogo) {
  if (e_pct >= 35 && (gp_jogo + gc_jogo) < 2.5) return 'ALTO';
  if (e_pct >= 25) return 'MEDIO';
  return 'BAIXO';
}

function recalcularLiga(codigoLiga) {
  const liga = LIGAS[codigoLiga];
  if (!liga) { console.log(`  ❌ Liga "${codigoLiga}" não encontrada`); return null; }

  const dados = carregarDados(liga);
  if (!dados) { console.log(`  ❌ Arquivo ${liga.arquivo} não encontrado`); return null; }

  // Filtrar jogos COM placar real
  const jogosComPlacar = dados.jogos.filter(j => j.placar && j.placar.m != null);
  const jogosSemPlacar = dados.jogos.filter(j => !j.placar || j.placar.m == null);
  const todosJogos = dados.jogos;
  const times = dados.times || [];

  console.log(`  📊 ${liga.nome}`);
  console.log(`     Total jogos: ${todosJogos.length}`);
  console.log(`     Com placar:  ${jogosComPlacar.length}`);
  console.log(`     Sem placar:  ${jogosSemPlacar.length}`);
  console.log(`     Times:       ${times.length}`);

  // Construir perfis por time
  const perfis = {};

  times.forEach(nomeTime => {
    // Jogos COM placar para V/E/D e GP/GC
    const jogosTimePlacar = jogosComPlacar.filter(j =>
      j.mandante === nomeTime || j.visitante === nomeTime
    );
    const casaPlacar = jogosComPlacar.filter(j => j.mandante === nomeTime);
    const foraPlacar = jogosComPlacar.filter(j => j.visitante === nomeTime);

    // TODOS os jogos para posição/contagem geral
    const todosTimes = todosJogos.filter(j => j.mandante === nomeTime || j.visitante === nomeTime);

    const totalJogos = jogosTimePlacar.length;
    if (totalJogos === 0) return;

    // V/E/D Geral
    let vG = 0, eG = 0, dG = 0, gpG = 0, gcG = 0;
    jogosTimePlacar.forEach(j => {
      const ehMandante = j.mandante === nomeTime;
      const golsPro  = ehMandante ? j.placar.m : j.placar.v;
      const golsCon  = ehMandante ? j.placar.v : j.placar.m;
      gpG += golsPro;
      gcG += golsCon;
      if (golsPro > golsCon) vG++;
      else if (golsPro === golsCon) eG++;
      else dG++;
    });

    // V/E/D Casa
    let vC = 0, eC = 0, dC = 0, gpC = 0, gcC = 0;
    casaPlacar.forEach(j => {
      gpC += j.placar.m;
      gcC += j.placar.v;
      if (j.placar.m > j.placar.v) vC++;
      else if (j.placar.m === j.placar.v) eC++;
      else dC++;
    });

    // V/E/D Fora
    let vF = 0, eF = 0, dF = 0, gpF = 0, gcF = 0;
    foraPlacar.forEach(j => {
      gpF += j.placar.v;
      gcF += j.placar.m;
      if (j.placar.v > j.placar.m) vF++;
      else if (j.placar.v === j.placar.m) eF++;
      else dF++;
    });

    const jC = casaPlacar.length;
    const jF = foraPlacar.length;

    // Forma recente (últimos 5 jogos com placar, ordenados por data)
    const recentes = [...jogosTimePlacar]
      .sort((a, b) => new Date(b.data || '2026-01-01') - new Date(a.data || '2026-01-01'))
      .slice(0, 5);

    const formaRecente = recentes.map(j => {
      const ehMandante = j.mandante === nomeTime;
      const golsPro = ehMandante ? j.placar.m : j.placar.v;
      const golsCon = ehMandante ? j.placar.v : j.placar.m;
      if (golsPro > golsCon) return 'V';
      if (golsPro === golsCon) return 'E';
      return 'D';
    });

    // Cálculos
    const gp_jogo = parseFloat((gpG / totalJogos).toFixed(2));
    const gc_jogo = parseFloat((gcG / totalJogos).toFixed(2));
    const v_pct = Math.round((vG / totalJogos) * 100);
    const e_pct = Math.round((eG / totalJogos) * 100);
    const d_pct = Math.round((dG / totalJogos) * 100);

    const perfil = calcularPerfil(gp_jogo, gc_jogo);
    const tendencia_empate = calcularTendenciaEmpate(e_pct, gc_jogo, gp_jogo);

    // Pontos estimados
    const pontos = vG * 3 + eG;

    // Notas YAAKEN automáticas
    const notas = [];
    if (e_pct >= 35) notas.push(`⚖️ Empata muito (${e_pct}% dos jogos) — empate tem valor`);
    if (jC > 0 && Math.round((vC / jC) * 100) >= 60) notas.push(`🏠 Forte em casa (${Math.round((vC / jC) * 100)}% vitórias)`);
    if (jF > 0 && Math.round((vF / jF) * 100) >= 50) notas.push(`✈️ Surpreende fora (${Math.round((vF / jF) * 100)}% vitórias fora)`);
    if (jF > 0 && Math.round((dF / jF) * 100) >= 60) notas.push(`⚠️ Perda fora alta (${Math.round((dF / jF) * 100)}%) — evitar como visitante`);
    if (jC > 0 && Math.round((dC / jC) * 100) >= 50) notas.push(`🚨 Perde em casa (${Math.round((dC / jC) * 100)}%) — zebra visitante tem valor`);
    if (gp_jogo >= 2.0) notas.push(`⚽ Muito ofensivo (${gp_jogo} gols/jogo)`);
    if (gc_jogo >= 2.0) notas.push(`🔓 Defesa frágil (${gc_jogo} sofridos/jogo)`);
    if (gp_jogo < 0.8) notas.push(`🧱 Ataque fraco (${gp_jogo} gols/jogo)`);

    const vitoriasRecentes = formaRecente.filter(r => r === 'V').length;
    const derrotasRecentes = formaRecente.filter(r => r === 'D').length;
    if (vitoriasRecentes >= 4) notas.push(`🔥 Em chama! ${vitoriasRecentes}/5 vitórias recentes`);
    if (derrotasRecentes >= 3) notas.push(`❄️ Crise! ${derrotasRecentes}/5 derrotas recentes`);

    // ── Helper para parsear data no formato DD.MM.YYYY HH:MM ─────────────────
    function parseDataJogo(dataStr) {
      if (!dataStr || dataStr === '?') return new Date(0);
      // Formato: "DD.MM.YYYY HH:MM"
      const m = dataStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`);
      return new Date(dataStr);
    }

    // ── Últimos 5 jogos GERAIS (com placar) — para renderDNAPartida ──────────
    const ultGeral = [...jogosTimePlacar]
      .sort((a, b) => parseDataJogo(b.data) - parseDataJogo(a.data))
      .slice(0, 5)
      .map(j => {
        const ehMandante = j.mandante === nomeTime;
        const golsPro = ehMandante ? j.placar.m : j.placar.v;
        const golsCon = ehMandante ? j.placar.v : j.placar.m;
        const outro   = ehMandante ? j.visitante : j.mandante;
        const res = golsPro > golsCon ? 'V' : golsPro === golsCon ? 'E' : 'D';
        return {
          data:     j.data || '?',
          mandante: j.mandante,
          visitante:j.visitante,
          gm:       j.placar.m,
          gv:       j.placar.v,
          ctx:      ehMandante ? 'CASA' : 'FORA',
          outro,
          golsPro,
          golsCon,
          res
        };
      });

    // ── Últimos 5 jogos em casa (com placar) — para renderDNAPartida ─────────
    const ultCasa = [...casaPlacar]
      .sort((a, b) => parseDataJogo(b.data) - parseDataJogo(a.data))
      .slice(0, 5)
      .map(j => ({
        data:      j.data || '?',
        mandante:  j.mandante,
        visitante: j.visitante,
        gm:        j.placar.m,
        gv:        j.placar.v,
        res:       j.placar.m > j.placar.v ? 'V' : j.placar.m === j.placar.v ? 'E' : 'D'
      }));

    // ── Últimos 5 jogos fora (com placar) — para renderDNAPartida ────────────
    const ultFora = [...foraPlacar]
      .sort((a, b) => parseDataJogo(b.data) - parseDataJogo(a.data))
      .slice(0, 5)
      .map(j => ({
        data:      j.data || '?',
        mandante:  j.mandante,
        visitante: j.visitante,
        gm:        j.placar.m,
        gv:        j.placar.v,
        res:       j.placar.v > j.placar.m ? 'V' : j.placar.v === j.placar.m ? 'E' : 'D'
      }));

    // ── TODOS os jogos GERAIS em ordem cronológica DECRESCENTE — mais recente primeiro ─
    const todosPlacarGeral = [...jogosTimePlacar]
      .sort((a, b) => parseDataJogo(b.data) - parseDataJogo(a.data))
      .map(j => {
        const ehMandante = j.mandante === nomeTime;
        const golsPro = ehMandante ? j.placar.m : j.placar.v;
        const golsCon = ehMandante ? j.placar.v : j.placar.m;
        const outro   = ehMandante ? j.visitante : j.mandante;
        const res = golsPro > golsCon ? 'V' : golsPro === golsCon ? 'E' : 'D';
        return {
          data:      j.data || '?',
          adversario: outro,
          ctx:       ehMandante ? 'CASA' : 'FORA',
          golsPro,
          golsCon,
          gm:        j.placar.m,
          gv:        j.placar.v,
          res
        };
      });

    // ── TODOS os jogos em CASA em ordem cronológica DECRESCENTE — mais recente primeiro ─
    const todosPlacarCasa = [...casaPlacar]
      .sort((a, b) => parseDataJogo(b.data) - parseDataJogo(a.data))
      .map(j => {
        const golsPro = j.placar.m;
        const golsCon = j.placar.v;
        return {
          data:      j.data || '?',
          adversario: j.visitante,
          ctx:       'CASA',
          golsPro,
          golsCon,
          gm:        j.placar.m,
          gv:        j.placar.v,
          res:       golsPro > golsCon ? 'V' : golsPro === golsCon ? 'E' : 'D'
        };
      });

    // ── TODOS os jogos FORA em ordem cronológica DECRESCENTE — mais recente primeiro ─
    const todosPlacarFora = [...foraPlacar]
      .sort((a, b) => parseDataJogo(b.data) - parseDataJogo(a.data))
      .map(j => {
        const golsPro = j.placar.v;
        const golsCon = j.placar.m;
        return {
          data:      j.data || '?',
          adversario: j.mandante,
          ctx:       'FORA',
          golsPro,
          golsCon,
          gm:        j.placar.m,
          gv:        j.placar.v,
          res:       golsPro > golsCon ? 'V' : golsPro === golsCon ? 'E' : 'D'
        };
      });

    perfis[nomeTime] = {
      nome: nomeTime,
      posicao: times.indexOf(nomeTime) + 1,
      jogos: totalJogos,
      pontos,
      geral: {
        v: vG, e: eG, d: dG, j: totalJogos,
        v_pct, e_pct, d_pct,
        gp: gpG, gc: gcG, gp_jogo, gc_jogo,
        saldo: gpG - gcG,
        media_gols_jogo: parseFloat(((gpG + gcG) / totalJogos).toFixed(2))
      },
      casa: {
        v: vC, e: eC, d: dC, j: jC,
        gp: gpC, gc: gcC,
        gp_jogo: jC > 0 ? parseFloat((gpC / jC).toFixed(2)) : 0,
        gc_jogo: jC > 0 ? parseFloat((gcC / jC).toFixed(2)) : 0,
        v_pct: jC > 0 ? Math.round((vC / jC) * 100) : 0,
        e_pct: jC > 0 ? Math.round((eC / jC) * 100) : 0,
        d_pct: jC > 0 ? Math.round((dC / jC) * 100) : 0,
        media_gols: jC > 0 ? parseFloat(((gpC + gcC) / jC).toFixed(2)) : 0
      },
      fora: {
        v: vF, e: eF, d: dF, j: jF,
        gp: gpF, gc: gcF,
        gp_jogo: jF > 0 ? parseFloat((gpF / jF).toFixed(2)) : 0,
        gc_jogo: jF > 0 ? parseFloat((gcF / jF).toFixed(2)) : 0,
        v_pct: jF > 0 ? Math.round((vF / jF) * 100) : 0,
        e_pct: jF > 0 ? Math.round((eF / jF) * 100) : 0,
        d_pct: jF > 0 ? Math.round((dF / jF) * 100) : 0,
        media_gols: jF > 0 ? parseFloat(((gpF + gcF) / jF).toFixed(2)) : 0
      },
      forma_recente:      formaRecente,
      jogos_geral:        ultGeral,
      jogos_casa:         ultCasa,
      jogos_fora:         ultFora,
      historico_geral:    todosPlacarGeral,
      historico_casa:     todosPlacarCasa,
      historico_fora:     todosPlacarFora,
      perfil,
      tendencia_empate,
      notas_yaaken: notas
    };
  });

  // Ordenar por pontos (classificação real)
  const perfilOrdenados = Object.values(perfis)
    .sort((a, b) => b.pontos - a.pontos || (b.geral.gp - b.geral.gc) - (a.geral.gp - a.geral.gc));
  perfilOrdenados.forEach((p, i) => { p.posicao = i + 1; });

  // Reconstruir objeto com posições atualizadas
  const perfisFinais = {};
  perfilOrdenados.forEach(p => { perfisFinais[p.nome] = p; });

  const output = {
    meta: {
      liga: codigoLiga,
      nome_liga: liga.nome,
      data_coleta: new Date().toISOString().split('T')[0],
      total_times: Object.keys(perfisFinais).length,
      jogos_analisados: jogosComPlacar.length,
      jogos_sem_placar: jogosSemPlacar.length,
      fonte: 'Recalculado a partir dos dados completos do Motor V4/V5 com placar real',
      agente: 'Recalcular Escoteiro v1 (dados reais)'
    },
    perfis: perfisFinais
  };

  // Salvar JSON principal
  const filename = `escoteiro_${codigoLiga}_${output.meta.data_coleta}.json`;
  const filepath = path.join(escoteiroDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));

  // Salvar como .js no yaaken-data (MÚLTIPLAS PASTAS — EDS-ODDS-TEACHER e raiz MEU APP)
  const jsContent = `// Auto-gerado em ${output.meta.data_coleta} — EDS Soluções Inteligentes\n// Liga: ${codigoLiga} | Times: ${output.meta.total_times} | Jogos c/ placar: ${output.meta.jogos_analisados}\n\nwindow.ESCOTEIRO_${codigoLiga} = ${JSON.stringify(output, null, 2)};\n`;
  const yaakDirs = [
    path.join(__dirname, '..', 'EDS-ODDS-TEACHER', 'yaaken-data'),  // EDS-ODDS-TEACHER
    path.join(__dirname, '..', '..', 'yaaken-data'),                 // /MEU APP/yaaken-data (browser)
  ];
  yaakDirs.forEach(yaakDir => {
    if (fs.existsSync(yaakDir)) {
      fs.writeFileSync(path.join(yaakDir, `escoteiro_${codigoLiga}.js`), jsContent);
      console.log(`  📂 yaaken-data atualizado: ${path.basename(yaakDir)} → escoteiro_${codigoLiga}.js`);
    }
  });

  // Preview top 5
  console.log(`\n  🏆 Top 5:`);
  perfilOrdenados.slice(0, 5).forEach(t => {
    const g = t.geral;
    console.log(`     ${String(t.posicao).padStart(2)}. ${t.nome.padEnd(22)} | ${g.v}V ${g.e}E ${g.d}D | GP:${g.gp} GC:${g.gc} | ${t.perfil}`);
    if (t.notas_yaaken.length > 0) console.log(`        → ${t.notas_yaaken[0]}`);
  });

  console.log(`\n  💾 Salvo: ${filename}`);
  console.log(`  ✅ ${Object.keys(perfisFinais).length} times | ${jogosComPlacar.length} jogos com placar real`);

  return output;
}

// ═══════════════════════════════════════════════════
//  CLI
// ═══════════════════════════════════════════════════
const args = process.argv.slice(2);
let ligasParaRecalcular = [];

if (args.includes('--todas')) {
  ligasParaRecalcular = Object.keys(LIGAS);
} else if (args.includes('--liga')) {
  const codigo = (args[args.indexOf('--liga') + 1] || '').toUpperCase();
  if (LIGAS[codigo]) ligasParaRecalcular = [codigo];
  else { console.log(`Liga inválida. Disponíveis: ${Object.keys(LIGAS).join(', ')}`); process.exit(1); }
} else {
  console.log('Uso: node recalcular_escoteiro.js --liga ARG');
  console.log('     node recalcular_escoteiro.js --todas');
  process.exit(0);
}

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  🧬 RECALCULAR ESCOTEIRO — Dados Completos          ║');
console.log('║  Fonte: Motor V4/V5 com placar REAL do FlashScore   ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log(`Ligas: ${ligasParaRecalcular.join(', ')}\n`);

const resumo = [];
ligasParaRecalcular.forEach(liga => {
  const r = recalcularLiga(liga);
  if (r) resumo.push({ liga, times: Object.keys(r.perfis).length, jogos: r.meta.jogos_analisados });
  console.log('');
});

if (resumo.length > 0) {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  ✅ RESUMO                                           ║');
  resumo.forEach(r => console.log(`║  ${r.liga}: ${r.times} times | ${r.jogos} jogos com placar real`));
  console.log('╚══════════════════════════════════════════════════════╝');
}

// Atualizar DNA integrador também
console.log('\n🧬 Atualizando dna_escoteiro.js...');
try {
  require('child_process').execSync('node dna_integrador.js', { cwd: __dirname, stdio: 'inherit' });
} catch (_) {}

console.log('\n🏁 Recálculo concluído!');
