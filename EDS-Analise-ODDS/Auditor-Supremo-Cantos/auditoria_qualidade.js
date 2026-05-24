// ════════════════════════════════════════════════════════════════════
// AUDITORIA DE QUALIDADE DOS DADOS
// Relatório visual da qualidade da base do Auditor Supremo:
//   - Cobertura temporal (rodadas, datas, gaps)
//   - Completude (cantos FT, cantos HT, placar, posse, finalizações)
//   - Distribuição por time (amostra suficiente?)
//   - Anomalias (jogos zerados, dados estranhos)
//   - JSONs do varredor pendentes de injeção
// ════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { carregarBase } = require('./engine/loader');

const PASTA_VARREDOR = path.resolve(__dirname, '..', 'projeto-fantasma');

const base = carregarBase({ dataLimite: null });

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  AUDITORIA DE QUALIDADE — Base do Auditor Supremo de Cantos');
console.log('  Gerado em ' + new Date().toISOString().slice(0, 19));
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');

// ────────────────────────────────────────────────────────────────────
// VISÃO GERAL
// ────────────────────────────────────────────────────────────────────
const ligasOk = Object.keys(base.ligas).filter(c => !base.ligas[c].erro);
let totalJogos = 0, totalTimes = 0;
for (const c of ligasOk) {
  totalJogos += base.ligas[c].jogos.length;
  totalTimes += base.ligas[c].times.length;
}

console.log('📊 VISÃO GERAL');
console.log('   Ligas ativas: ' + ligasOk.length);
console.log('   Times catalogados: ' + totalTimes);
console.log('   Jogos no banco: ' + totalJogos);
console.log('');

// ────────────────────────────────────────────────────────────────────
// POR LIGA — completude e qualidade
// ────────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  COMPLETUDE POR LIGA');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('Liga    Jogos | Cantos FT | Cantos HT | Placar | Posse | Finaliz | Última');
console.log('------ ------+-----------+-----------+--------+-------+---------+----------');

const auditPorLiga = {};

for (const cod of ligasOk) {
  const L = base.ligas[cod];
  let nCantosFT = 0, nCantosHT = 0, nPlacar = 0, nPosse = 0, nFinaliz = 0;
  let datasValidas = [];

  for (const j of L.jogos) {
    if (j.cantos?.ft && typeof j.cantos.ft.m === 'number' && typeof j.cantos.ft.v === 'number') nCantosFT++;
    if (j.cantos?.ht && typeof j.cantos.ht.m === 'number' && typeof j.cantos.ht.v === 'number') nCantosHT++;
    if (j.placar && (j.placar.ft || (typeof j.placar.m === 'number'))) nPlacar++;
    if (j.stats_taticas?.posse && typeof j.stats_taticas.posse.m === 'number') nPosse++;
    if (j.stats_taticas?.finalizacoes && typeof j.stats_taticas.finalizacoes.m === 'number') nFinaliz++;
    if (j.dataNorm) datasValidas.push(j.dataNorm);
  }

  datasValidas.sort();
  const ult = datasValidas[datasValidas.length - 1] || '?';
  const tot = L.jogos.length;
  const pct = (n) => ((n/tot)*100).toFixed(0) + '%';

  console.log(
    cod.padEnd(6) + ' ' + String(tot).padStart(5) + ' | ' +
    (String(nCantosFT) + ' (' + pct(nCantosFT) + ')').padStart(9) + ' | ' +
    (String(nCantosHT) + ' (' + pct(nCantosHT) + ')').padStart(9) + ' | ' +
    (pct(nPlacar)).padStart(6) + ' | ' +
    (pct(nPosse)).padStart(5) + ' | ' +
    (pct(nFinaliz)).padStart(7) + ' | ' +
    ult
  );

  auditPorLiga[cod] = { tot, nCantosFT, nCantosHT, nPlacar, nPosse, nFinaliz, ult, datasValidas };
}
console.log('');

// ────────────────────────────────────────────────────────────────────
// COBERTURA POR TIME
// ────────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  COBERTURA POR TIME — distribuição de jogos por time em cada liga');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('Liga    Min | Max | Média | <5 jogos | <8 jogos | ≥10 jogos | OK pra agente?');
console.log('------ -----+-----+-------+----------+----------+-----------+----------------');

for (const cod of ligasOk) {
  const L = base.ligas[cod];
  const contagem = {};
  for (const t of L.times) contagem[t] = 0;
  for (const j of L.jogos) {
    if (j.mandante && contagem.hasOwnProperty(j.mandante))   contagem[j.mandante]++;
    if (j.visitante && contagem.hasOwnProperty(j.visitante)) contagem[j.visitante]++;
  }
  const valores = Object.values(contagem).sort((a,b)=>a-b);
  const min  = valores[0];
  const max  = valores[valores.length - 1];
  const med  = (valores.reduce((s,v)=>s+v, 0) / valores.length).toFixed(1);
  const lt5  = valores.filter(v => v < 5).length;
  const lt8  = valores.filter(v => v < 8).length;
  const ge10 = valores.filter(v => v >= 10).length;
  const okPct = (ge10 / valores.length * 100).toFixed(0);

  let status = '🔴 ruim';
  if (ge10 >= valores.length * 0.5) status = '🟡 médio';
  if (ge10 >= valores.length * 0.8) status = '🟢 ótimo';

  console.log(
    cod.padEnd(6) + ' ' + String(min).padStart(3) + ' | ' + String(max).padStart(3) + ' | ' +
    med.padStart(5) + ' | ' + String(lt5).padStart(8) + ' | ' + String(lt8).padStart(8) + ' | ' +
    (String(ge10) + ' (' + okPct + '%)').padStart(9) + ' | ' + status
  );
}
console.log('');

// ────────────────────────────────────────────────────────────────────
// DETECÇÃO DE ANOMALIAS
// ────────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  ANOMALIAS DETECTADAS');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');

const anomalias = { semCantosFT: [], cantosZerados: [], posseInvalida: [], placarSemCantos: [], rodadaSemNum: [], dataSemFormato: [] };

for (const cod of ligasOk) {
  const L = base.ligas[cod];
  for (const j of L.jogos) {
    if (!j.cantos?.ft || (typeof j.cantos.ft.m !== 'number')) {
      anomalias.semCantosFT.push({ liga: cod, jogo: j.mandante + ' vs ' + j.visitante, data: j.dataNorm });
    } else if (j.cantos.ft.m === 0 && j.cantos.ft.v === 0 && j.placar?.ft) {
      anomalias.cantosZerados.push({ liga: cod, jogo: j.mandante + ' vs ' + j.visitante, data: j.dataNorm });
    }
    if (j.stats_taticas?.posse && (j.stats_taticas.posse.m + j.stats_taticas.posse.v < 90)) {
      anomalias.posseInvalida.push({ liga: cod, jogo: j.mandante + ' vs ' + j.visitante, posse: j.stats_taticas.posse });
    }
    if (typeof j.rodada !== 'number') {
      anomalias.rodadaSemNum.push({ liga: cod, jogo: j.mandante + ' vs ' + j.visitante });
    }
    if (!j.dataNorm) {
      anomalias.dataSemFormato.push({ liga: cod, jogo: j.mandante + ' vs ' + j.visitante, data: j.data });
    }
  }
}

console.log('🚨 Jogos sem cantos FT:        ' + anomalias.semCantosFT.length);
console.log('🚨 Jogos com cantos 0×0:       ' + anomalias.cantosZerados.length);
console.log('🚨 Posse inválida (soma <90):  ' + anomalias.posseInvalida.length);
console.log('🚨 Sem número de rodada:       ' + anomalias.rodadaSemNum.length);
console.log('🚨 Data com formato inválido:  ' + anomalias.dataSemFormato.length);

if (anomalias.semCantosFT.length > 0 && anomalias.semCantosFT.length <= 10) {
  console.log('\n   Detalhe (sem cantos FT):');
  for (const a of anomalias.semCantosFT.slice(0, 10)) {
    console.log('     [' + a.liga + '] ' + a.jogo + ' (' + (a.data || '?') + ')');
  }
}
if (anomalias.cantosZerados.length > 0 && anomalias.cantosZerados.length <= 10) {
  console.log('\n   Detalhe (cantos 0×0):');
  for (const a of anomalias.cantosZerados.slice(0, 10)) {
    console.log('     [' + a.liga + '] ' + a.jogo + ' (' + (a.data || '?') + ')');
  }
}
if (anomalias.rodadaSemNum.length > 0 && anomalias.rodadaSemNum.length <= 30) {
  console.log('\n   ⚠️ Atenção: ' + anomalias.rodadaSemNum.length + ' jogos sem número de rodada (afeta sumário do agente).');
  // Mostra distribuição por liga
  const porLiga = {};
  for (const a of anomalias.rodadaSemNum) porLiga[a.liga] = (porLiga[a.liga] || 0) + 1;
  for (const l of Object.keys(porLiga)) console.log('     ' + l + ': ' + porLiga[l]);
}
console.log('');

// ────────────────────────────────────────────────────────────────────
// GAPS — JSONs DO VARREDOR PENDENTES DE INJEÇÃO
// ────────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  JSONS COLETADOS NO VARREDOR — PENDENTES DE INJEÇÃO');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');

if (fs.existsSync(PASTA_VARREDOR)) {
  const arquivos = fs.readdirSync(PASTA_VARREDOR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  // Filtra apenas arquivos de rodada
  const padrao = /^([a-z_]+)_rodada_\d+_(\d{4}-\d{2}-\d{2})\.json$/i;
  const porLigaData = {};
  for (const arq of arquivos) {
    const m = arq.match(padrao);
    if (!m) continue;
    const ligaCode = m[1].toUpperCase();
    const dataArq  = m[2];
    porLigaData[ligaCode] = porLigaData[ligaCode] || [];
    porLigaData[ligaCode].push({ arq, data: dataArq });
  }

  console.log('Liga   | Última JSON  | Última no banco | Gap?');
  console.log('-------|--------------|-----------------|------');

  // Mapeia variantes do varredor → códigos do agente
  const mapVarredor = { 'BR': 'BR', 'BR_B': 'BR_B', 'MLS': 'MLS', 'USL': 'USL', 'ARG': 'ARG', 'ARG_B': 'ARG_B', 'BUN': 'BUN' };

  for (const ligaVar of Object.keys(porLigaData).sort()) {
    const codAgente = mapVarredor[ligaVar];
    if (!codAgente) continue;
    const arqs = porLigaData[ligaVar].sort((a,b) => b.data.localeCompare(a.data));
    const ultJson = arqs[0]?.data || '?';
    const ultBanco = auditPorLiga[codAgente]?.ult || '?';
    const gap = (ultJson > ultBanco) ? '⚠️ JSON mais novo que o banco' : '✅ banco em dia';
    console.log(' ' + codAgente.padEnd(5) + ' | ' + ultJson + '   | ' + ultBanco.padEnd(15) + ' | ' + gap);
  }
}
console.log('');

// ────────────────────────────────────────────────────────────────────
// VEREDICTO
// ────────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('  VEREDICTO DE QUALIDADE');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('');

let pontos = 0, max = 0;
for (const cod of ligasOk) {
  max += 100;
  const a = auditPorLiga[cod];
  const pctCantos = (a.nCantosFT / a.tot) * 100;
  pontos += pctCantos;
}
const scoreGeral = (pontos / max * 100).toFixed(1);

console.log('🎯 Score de COMPLETUDE de cantos FT (média ponderada): ' + scoreGeral + '/100');

if (anomalias.semCantosFT.length === 0) {
  console.log('✅ TODOS os ' + totalJogos + ' jogos têm cantos FT preenchidos.');
} else {
  console.log('⚠️ ' + anomalias.semCantosFT.length + ' jogos sem cantos FT (' + ((anomalias.semCantosFT.length/totalJogos)*100).toFixed(1) + '%).');
}

if (anomalias.cantosZerados.length === 0) {
  console.log('✅ Nenhum jogo com cantos 0×0 suspeito.');
} else {
  console.log('⚠️ ' + anomalias.cantosZerados.length + ' jogos com cantos 0×0 — pode ser dado faltante mascarado.');
}

if (anomalias.rodadaSemNum.length > 0) {
  console.log('⚠️ ' + anomalias.rodadaSemNum.length + ' jogos sem número de rodada — afeta agrupamento por rodada nos relatórios.');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════');
