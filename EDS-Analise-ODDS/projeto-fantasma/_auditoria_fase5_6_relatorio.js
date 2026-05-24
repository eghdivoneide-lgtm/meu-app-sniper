/**
 * Fase 5+6 — Análise de erros sistêmicos + Relatório final em Markdown.
 */
const fs = require('fs');
const path = require('path');
const cruzados = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_resultados.json')));
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_metricas.json')));

const ordemSist = ['CISNE','TEACHER','ENIGMA','VENCEDOR','BALA'];
const ligasOrdem = ['BR','BR_B','ARG','ARG_B','BUN','USL','MLS','J1','J2J3','CHN_SL','CHN_L1'];

function pct(num, den) { return den > 0 ? (num / den * 100).toFixed(1) : '-'; }
function dec(s) { return s ? s.HIT + s.MISS : 0; }

const out = [];

// ============================================================================
// CABEÇALHO
// ============================================================================
out.push('# 🎯 Auditoria EDS — Especialista em Cantos');
out.push('');
out.push('**Período auditado:** 01/05/2026 a 04/05/2026 (rodada do fim de semana)  ');
out.push('**Universo:** 11 ligas · 5 sistemas analíticos · 132 jogos coletados · 868 palpites parseados  ');
out.push('**Gerado em:** ' + new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
out.push('');
out.push('---');
out.push('');

// ============================================================================
// SUMÁRIO EXECUTIVO
// ============================================================================
out.push('## 📌 Sumário executivo (TL;DR)');
out.push('');
out.push('### 🏆 Top achados');
out.push('');
out.push('1. **ENIGMA é o sistema mais confiável** — **69% de acerto** (29/42 decisivos), liderando em vencedor de cantos FT (75%).');
out.push('2. **CONVERGÊNCIA é regra de ouro:** quando **3+ sistemas concordam em cantos FT Over/Under**, acerto sobe pra **87.5%** (vs 54.7% com 1 sistema só).');
out.push('3. **MLS é a liga mais acertiva** (80%+ em quase todos os sistemas), seguida de **CHN_L1, ARG, BR_B**.');
out.push('4. **J1 é o desastre da rodada** — sistemas acertaram 20-37% (pior que cara/coroa). Investigar urgência.');
out.push('5. **Bala de Prata tem força do sinal INVERTIDA** — selo MEDIANO acertou mais (68.8%) que ABSOLUTO (55.8%) e NUCLEAR (59.5%). Calibração quebrada.');
out.push('');
out.push('### 🎯 Filtro recomendado para entradas de alta probabilidade');
out.push('');
out.push('Use SOMENTE quando:');
out.push('- ✅ ≥ 3 sistemas concordam na mesma direção (Over OU Under) em cantos FT, OU');
out.push('- ✅ ENIGMA marcou ATIVO + Vencedor cantos FT confirma o mesmo lado, OU');
out.push('- ✅ Liga é uma de [MLS, CHN_L1, ARG, BR_B] e ≥ 2 sistemas concordam.');
out.push('');
out.push('Evite:');
out.push('- ❌ Qualquer sinal isolado da Bala em BUN/J1/BR (acerto < 50%)');
out.push('- ❌ Confiar no selo "ABSOLUTO" da Bala — evidência mostra que é o pior estrato.');
out.push('- ❌ J1 — especialista está descalibrado pra essa liga nesta rodada.');
out.push('');
out.push('---');
out.push('');

// ============================================================================
// COBERTURA E SAÚDE DOS DADOS
// ============================================================================
out.push('## 📊 Cobertura e saúde dos dados');
out.push('');
out.push('| Item | Valor |');
out.push('|------|-------|');
out.push('| Ligas analisadas | 11 (BR, BR_B, ARG, ARG_B, BUN, USL, MLS, J1, J2J3, CHN_SL, CHN_L1) |');
out.push('| Sistemas | 5 (Cisne Negro, Teacher, Enigma, Vencedor Cantos, Bala de Prata) |');
out.push('| Slots de cobertura | **55/55 (100%)** — todas combinações têm relatório |');
out.push('| Jogos com gabarito real | 132 |');
out.push('| Palpites parseados | 868 |');
out.push('| Palpites avaliáveis (HIT/MISS) | 458 |');
out.push('| Sem match com jogo coletado | 17 (jogos da próxima rodada projetados pelo especialista) |');
out.push('');
out.push('### ⚠️ Lacunas detectadas');
out.push('');
out.push('1. **CHN_SL × Vencedor Cantos**: relatório existe mas **gera "0 jogos analisados"** (bug do app). Deve ser corrigido.');
out.push('2. **MLS × Enigma e J1 × Enigma e J2J3 × Enigma**: parser não conseguiu extrair "ATIVO" — há diferença de formato HTML; nesses sistemas o Enigma só registrou status, sem palpites decisivos.');
out.push('3. **Bala 05/05** é gerada DEPOIS dos jogos da rodada (não é pré-jogo real), o que pode contaminar a métrica de acurácia. Vale revisar o pipeline.');
out.push('');
out.push('---');
out.push('');

// ============================================================================
// RANKING DE SISTEMAS
// ============================================================================
out.push('## 🏅 Ranking de assertividade — Sistemas');
out.push('');
out.push('| Posição | Sistema | Acerto | n | Mercado mais forte |');
out.push('|---------|---------|--------|---|---------------------|');
const ranking = [];
for (const s of ordemSist) {
  const merMaior = [];
  let totalH = 0, totalM = 0;
  for (const merc of Object.keys(M.porSistMerc)) {
    if (!merc.startsWith(s + '|')) continue;
    const x = M.porSistMerc[merc];
    if (x.HIT + x.MISS === 0) continue;
    totalH += x.HIT;
    totalM += x.MISS;
    merMaior.push({ merc: merc.split('|')[1], pct: x.HIT/(x.HIT+x.MISS)*100, n: x.HIT+x.MISS });
  }
  merMaior.sort((a,b) => b.pct - a.pct);
  ranking.push({ s, pct: totalH/(totalH+totalM)*100, n: totalH+totalM, top: merMaior[0] });
}
ranking.sort((a,b) => b.pct - a.pct).forEach((r, i) => {
  out.push('| ' + (i+1) + ' | **' + r.s + '** | ' + r.pct.toFixed(1) + '% | ' + r.n + ' | ' +
    (r.top ? r.top.merc + ' (' + r.top.pct.toFixed(0) + '%)' : '-') + ' |');
});
out.push('');

// ============================================================================
// ACURÁCIA POR SISTEMA × MERCADO
// ============================================================================
out.push('## 🎯 Acurácia por SISTEMA × MERCADO');
out.push('');
out.push('| SISTEMA | MERCADO | HIT | MISS | %ACERTO | n |');
out.push('|---------|---------|-----|------|---------|---|');
const ordemMerc = ['cantos_ft','cantos_ht','vencedor_cantos_ft','vencedor_cantos_ht'];
for (const s of ordemSist) {
  for (const m of ordemMerc) {
    const x = M.porSistMerc[s + '|' + m];
    if (!x) continue;
    const d = x.HIT + x.MISS;
    if (d === 0) continue;
    const flag = (x.HIT/d > 0.65) ? ' 🟢' : (x.HIT/d < 0.45 ? ' 🔴' : '');
    out.push('| ' + s + ' | `' + m + '` | ' + x.HIT + ' | ' + x.MISS + ' | **' + pct(x.HIT, d) + '%**' + flag + ' | ' + d + ' |');
  }
}
out.push('');

// ============================================================================
// ACURÁCIA POR LIGA × SISTEMA
// ============================================================================
out.push('## 🌍 Acurácia por LIGA × SISTEMA');
out.push('');
out.push('Cada célula: **% acerto (HIT / decisivos)**. 🟢 ≥65% · 🔴 <45%');
out.push('');
out.push('| LIGA | CISNE | TEACHER | ENIGMA | VENCEDOR | BALA | MÉDIA LIGA |');
out.push('|------|-------|---------|--------|----------|------|------------|');
for (const liga of ligasOrdem) {
  let ligaH = 0, ligaM = 0;
  const cells = ordemSist.map(s => {
    const x = M.porLigaSist[liga + '|' + s];
    if (!x) return '—';
    const d = x.HIT + x.MISS;
    if (d === 0) return '—';
    ligaH += x.HIT; ligaM += x.MISS;
    const p = x.HIT / d * 100;
    const flag = p >= 65 ? ' 🟢' : p < 45 ? ' 🔴' : '';
    return p.toFixed(0) + '% (' + x.HIT + '/' + d + ')' + flag;
  });
  const mediaLiga = ligaH+ligaM > 0 ? (ligaH/(ligaH+ligaM)*100).toFixed(1) + '%' : '—';
  const flagLiga = (ligaH+ligaM > 0 && ligaH/(ligaH+ligaM) >= 0.65) ? ' 🟢' : (ligaH+ligaM > 0 && ligaH/(ligaH+ligaM) < 0.45) ? ' 🔴' : '';
  out.push('| **' + liga + '** | ' + cells.join(' | ') + ' | **' + mediaLiga + '**' + flagLiga + ' |');
}
out.push('');

// ============================================================================
// CONVERGÊNCIA
// ============================================================================
out.push('## 🤝 Convergência — Quando N sistemas concordam');
out.push('');
out.push('**Esta é a métrica-chave para definir entradas de alta probabilidade.**');
out.push('');
out.push('| Mercado | 1 sist. | 2 sist. | 3 sist. | 4 sist. | 5 sist. |');
out.push('|---------|---------|---------|---------|---------|---------|');
for (const merc of Object.keys(M.convergStats)) {
  const linha = [merc];
  for (let n = 1; n <= 5; n++) {
    const x = M.convergStats[merc][n];
    const d = x.HIT + x.MISS;
    if (d === 0) { linha.push('—'); continue; }
    const p = x.HIT / d * 100;
    const flag = p >= 75 ? ' 🟢' : p < 50 ? ' 🔴' : '';
    linha.push(p.toFixed(0) + '% (' + x.HIT + '/' + d + ')' + flag);
  }
  out.push('| `' + linha[0] + '` | ' + linha.slice(1).join(' | ') + ' |');
}
out.push('');
out.push('### 💡 Leitura');
out.push('- **`cantos_ft`**: 1 sistema → 55% acerto. **3 sistemas concordando → 87.5% acerto.** A convergência multiplica a confiança.');
out.push('- **`vencedor_cantos_ft`**: cresce monotonicamente — 1 sist. 42% → 2 sist. 63% → 3 sist. 70% → 4 sist. 100% (n=2).');
out.push('- **`cantos_ht`**: convergência NÃO ajuda muito (47%→44%→50%) — o mercado HT é mais difícil de prever, sistemas erram juntos.');
out.push('');

// ============================================================================
// JOGOS DE ALTA CONVERGÊNCIA
// ============================================================================
out.push('## 🎯 Jogos com 3+ sistemas convergentes (entradas premium)');
out.push('');
out.push('| Liga | Jogo | Mercado | Direção | Sistemas concordando | Real | Resultado |');
out.push('|------|------|---------|---------|---------------------|------|-----------|');
for (const j of M.convergJogos) {
  const realStr = j.real_cFT != null ? `${j.real_cFT} cantos FT` : (j.real_cHT != null ? `${j.real_cHT} cantos HT` : (j.real_vencedor || ''));
  const dirOuFav = j.direcao || j.favorito || '';
  out.push('| ' + j.liga + ' | ' + j.jogo + ' | ' + j.mercado + ' | ' + dirOuFav + ' | ' + j.sistemas.join(', ') + ' (' + j.sistemas.length + ') | ' + realStr + ' | ' + (j.hit ? '✅ HIT' : '❌ MISS') + ' |');
}
out.push('');

// ============================================================================
// ACURÁCIA POR FORÇA DO SINAL
// ============================================================================
out.push('## 💪 Acurácia por FORÇA DO SINAL');
out.push('');
const forcas = {};
for (const k of Object.keys(M.porSistForca)) {
  const [sist, forca] = k.split('|');
  const x = M.porSistForca[k];
  const d = x.HIT + x.MISS;
  if (d < 2) continue;
  if (!forcas[sist]) forcas[sist] = [];
  forcas[sist].push({ forca, ...x, dec: d, pct: x.HIT/d*100 });
}
for (const s of ordemSist) {
  if (!forcas[s]) continue;
  out.push('### ' + s);
  out.push('');
  out.push('| Força | %ACERTO | n |');
  out.push('|-------|---------|---|');
  forcas[s].sort((a,b) => b.pct - a.pct).forEach(f => {
    out.push('| ' + f.forca + ' | ' + f.pct.toFixed(1) + '% | ' + f.dec + ' |');
  });
  out.push('');
}

// ============================================================================
// ANÁLISE DE ERROS SISTÊMICOS
// ============================================================================
out.push('## 🚨 Análise de erros sistêmicos');
out.push('');
out.push('### 1. J1 (Japão) — colapso de assertividade');
out.push('');
const j1Stats = ordemSist.map(s => M.porLigaSist['J1|' + s]).filter(x => x && x.HIT+x.MISS > 0);
const j1H = j1Stats.reduce((a,x) => a+x.HIT, 0);
const j1M = j1Stats.reduce((a,x) => a+x.MISS, 0);
out.push('Acerto consolidado dos 5 sistemas no J1: **' + pct(j1H, j1H+j1M) + '%** (' + j1H + '/' + (j1H+j1M) + ').');
out.push('');
out.push('Pior que aleatório (50%). Hipóteses:');
out.push('- Liga ainda em ritmo de "início de temporada" — modelos calibrados em dados antigos podem estar defasados.');
out.push('- Diferença cultural nos times (volume de cantos) que o modelo treinado em ligas Europa/Américas não captura.');
out.push('- Linha de cantos FT 10 pode ser inadequada para J1 (média da rodada foi 12.3 cantos — mas modelo prevê UNDER frequente).');
out.push('');
out.push('**Ação recomendada:** evitar entradas no J1 até o app ser recalibrado.');
out.push('');

out.push('### 2. Bala de Prata — força do sinal invertida');
out.push('');
out.push('| Selo | %ACERTO | n |');
out.push('|------|---------|---|');
forcas.BALA && forcas.BALA.sort((a,b) => b.pct - a.pct).forEach(f => {
  out.push('| ' + f.forca + ' | ' + f.pct.toFixed(1) + '% | ' + f.dec + ' |');
});
out.push('');
out.push('Os selos teoricamente mais fortes (ABSOLUTO, NUCLEAR, DOMINANTE) **NÃO** estão acertando mais que MEDIANO/EQUILIBRADO. ');
out.push('Isso sugere que os critérios de "alta confiança" da Bala estão mal calibrados.');
out.push('');
out.push('**Ação recomendada:** revisar regras de selo. Pode ser que estejam aplicando regras conservadoras demais para casos óbvios e relaxando para casos sutis.');
out.push('');

out.push('### 3. BUN (Bundesliga) — Bala muito ruim');
out.push('');
const bunBala = M.porLigaSist['BUN|BALA'];
if (bunBala) {
  out.push('Bala em BUN: **' + pct(bunBala.HIT, bunBala.HIT+bunBala.MISS) + '% de acerto** (' + bunBala.HIT + '/' + (bunBala.HIT+bunBala.MISS) + ').');
}
out.push('Suspeita: a rodada teve goleadas atípicas (Bayern 13-5, Werder 8-2, etc.) que descalibraram o modelo Over.');
out.push('');

out.push('### 4. cantos_ht não é mercado seguro');
out.push('');
out.push('Em todas as configurações de convergência, cantos_ht ficou entre 43-50% — pior que cara/coroa. ');
out.push('Linha 4 cantos no HT tem variância muito alta — recomenda-se **abandonar esse mercado** ou aumentar threshold de confiança para entrar.');
out.push('');

// ============================================================================
// ERRO ABSOLUTO xCorners
// ============================================================================
if (M.errosXcorners && M.errosXcorners.length) {
  out.push('## 📐 Erro absoluto — xCorners FT estimado vs real');
  out.push('');
  const porSist2 = {};
  for (const e of M.errosXcorners) {
    if (!porSist2[e.sist]) porSist2[e.sist] = { soma: 0, n: 0 };
    porSist2[e.sist].soma += e.erro;
    porSist2[e.sist].n++;
  }
  out.push('| Sistema | Erro médio (cantos) | n |');
  out.push('|---------|--------------------|---|');
  for (const s of Object.keys(porSist2)) {
    out.push('| ' + s + ' | ' + (porSist2[s].soma/porSist2[s].n).toFixed(2) + ' | ' + porSist2[s].n + ' |');
  }
  out.push('');
  out.push('Bala erra em média 3.3 cantos no xCorners — significa que jogos próximos da linha 10 (entre 7 e 13) o modelo é vulnerável.');
  out.push('');
}

// ============================================================================
// REGRAS DE FILTRO RECOMENDADAS
// ============================================================================
out.push('## 🎯 Regras de filtro — entradas de ALTA PROBABILIDADE');
out.push('');
out.push('Baseado nos achados, propostas de regras a seguir nas próximas rodadas:');
out.push('');
out.push('### Regra A — Convergência forte (3+ sistemas)');
out.push('');
out.push('**Mercado:** Cantos FT Over/Under linha 10');
out.push('  - Quando 3+ sistemas (de [Cisne, Teacher, Enigma, Vencedor, Bala]) concordam na mesma direção → **entra com 87.5% confiança**.');
out.push('  - Stake recomendado: 2-3 unidades.');
out.push('');
out.push('### Regra B — Enigma ATIVO + Vencedor CLARO');
out.push('');
out.push('**Mercado:** Vencedor de cantos FT');
out.push('  - Quando Enigma marcar ATIVO E Vencedor Cantos FT marcar DOMÍNIO TOTAL ou FORTE para o mesmo lado → **70-75% de confiança**.');
out.push('  - Stake: 1-2 unidades.');
out.push('');
out.push('### Regra C — Liga assertiva + 2 sistemas');
out.push('');
out.push('**Ligas favoritas:** MLS, CHN_L1, ARG, BR_B, J2J3 (esta rodada).');
out.push('  - Em ligas assertivas, com 2+ sistemas concordando → **65-75% confiança**.');
out.push('  - Stake: 1 unidade.');
out.push('');
out.push('### REGRAS DE BLOQUEIO (não entrar)');
out.push('');
out.push('- ❌ **J1**: bloqueado até recalibração. Nenhuma entrada nesta liga.');
out.push('- ❌ **Cantos HT linha 4**: pular até melhorar (acerto ~50% em todas as configurações).');
out.push('- ❌ **Bala selo "ABSOLUTO" isolado** (sem outro sistema corroborando): só entra com confirmação.');
out.push('- ❌ **BUN com Bala isolada**: 27% de acerto na rodada — não entrar.');
out.push('');

// ============================================================================
// RECOMENDAÇÕES PARA O APP
// ============================================================================
out.push('## 🛠️ Recomendações para o app `especialista-cantos`');
out.push('');
out.push('1. **Recalibrar Bala de Prata.** Os selos (NUCLEAR/FORTE/MODERADA) não estão correlacionados com acerto. Investigar regra de cálculo de "Odd Justa" e thresholds dos selos.');
out.push('2. **Adicionar análise multi-sistema.** A descoberta de que 3+ convergências = 87.5% deve virar funcionalidade nativa do app — uma "tela de convergência" que já mostra automaticamente onde o sinal é forte.');
out.push('3. **Calibrar para J1 (Japão).** Criar perfil DNA específico para J1 com média de cantos diferente. Linha 10 talvez tenha que virar 11 ou 12 nessa liga.');
out.push('4. **Bala de 05/05 é pós-jogo.** Mover a geração da Bala para ANTES do primeiro jogo da rodada. Hoje a Bala está sendo gerada depois e não tem valor preditivo real.');
out.push('5. **Vencedor Cantos no CHN_SL retorna 0 jogos.** Bug a corrigir — dados existem (8 jogos coletados) mas o sistema não está processando.');
out.push('6. **Mercado HT linha 4 é fraco.** Considerar mudar para HT linha 4.5 ou 3.5 e auditar de novo.');
out.push('');

// ============================================================================
// JOGO POR JOGO (apêndice)
// ============================================================================
out.push('## 📋 Apêndice — Detalhamento jogo por jogo (palpites + resultado)');
out.push('');
out.push('Para cada jogo da rodada com palpites de qualquer sistema:');
out.push('');
const porJogo = {};
for (const c of cruzados) {
  if (c._sem_match) continue;
  const k = c.liga + '|' + c.mandante + '|' + c.visitante;
  if (!porJogo[k]) porJogo[k] = { liga: c.liga, mand: c.mandante, vis: c.visitante, real: { ft: c.placar_ft, ht: c.placar_ht, cFT: c.cantos_ft, cHT: c.cantos_ht }, sistemas: {} };
  if (!porJogo[k].sistemas[c.sistema]) porJogo[k].sistemas[c.sistema] = [];
  c.palpites.forEach((p, idx) => {
    const av = c.avaliacao[idx];
    porJogo[k].sistemas[c.sistema].push({ ...p, _av: av });
  });
}

for (const liga of ligasOrdem) {
  const jogos = Object.values(porJogo).filter(j => j.liga === liga);
  if (jogos.length === 0) continue;
  out.push('### ' + liga);
  out.push('');
  for (const J of jogos) {
    const cFT = J.real.cFT ? (J.real.cFT.m||0) + (J.real.cFT.v||0) : null;
    const cHT = J.real.cHT ? (J.real.cHT.m||0) + (J.real.cHT.v||0) : null;
    const cFTSplit = J.real.cFT ? J.real.cFT.m + '-' + J.real.cFT.v : '?';
    out.push('**' + J.mand + ' vs ' + J.vis + '** · placar FT ' + (J.real.ft || '?') + ' · cantos FT ' + cFTSplit + ' (' + (cFT||'?') + ')' + (cHT != null ? ' · HT ' + cHT : ''));
    out.push('');
    for (const s of ordemSist) {
      if (!J.sistemas[s]) continue;
      const palps = J.sistemas[s].map(p => {
        let descr = '';
        if (p.mercado === 'cantos_ft') descr = 'cantos FT ' + p.direcao + ' ' + (p.linha || 10);
        else if (p.mercado === 'cantos_ht') descr = 'cantos HT ' + p.direcao + ' ' + (p.linha || 4);
        else if (p.mercado === 'vencedor_cantos_ft') descr = 'venc. FT ' + (p.time_favorito || '?');
        else if (p.mercado === 'vencedor_cantos_ht') descr = 'venc. HT ' + (p.time_favorito || '?');
        else if (p.mercado === 'cantos_ft_estimado') descr = 'xCFT~' + p.valor;
        else descr = p.mercado;
        const forca = p.forca ? ' [' + p.forca + ']' : '';
        const res = p._av.resultado === 'HIT' ? '✅' : p._av.resultado === 'MISS' ? '❌' : p._av.resultado === 'PUSH' ? '➖' : p._av.resultado === 'INFO' ? 'ℹ' : '·';
        return res + ' ' + descr + forca;
      });
      out.push('  - **' + s + ':** ' + palps.join(' | '));
    }
    out.push('');
  }
}

// ============================================================================
// SALVAR
// ============================================================================
const dest = path.join(__dirname, 'relatorios', 'AUDITORIA_RODADA_2026-05.md');
fs.writeFileSync(dest, out.join('\n'), 'utf-8');
console.log('✅ Relatório salvo em: ' + dest);
console.log('Tamanho: ' + Buffer.byteLength(out.join('\n')) + ' bytes (' + out.length + ' linhas)');
