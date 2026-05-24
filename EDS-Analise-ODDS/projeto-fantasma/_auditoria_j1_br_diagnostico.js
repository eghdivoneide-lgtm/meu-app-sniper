/**
 * Diagnóstico profundo: por que J1 e BR estão errando?
 * Para cada jogo, comparar:
 *   - O que cada sistema previu
 *   - Real
 *   - Erro absoluto vs estimado
 *   - Direção (acerto/erro)
 *   - Magnitude do erro
 */
const fs = require('fs');
const path = require('path');

const cruzados = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_resultados.json')));

function analisarLiga(codLiga) {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`  DIAGNÓSTICO: ${codLiga}`);
  console.log('═══════════════════════════════════════════════════════════════════');

  const ligaJogos = {};
  for (const c of cruzados) {
    if (c._sem_match || c.liga !== codLiga) continue;
    const k = c.mandante + ' vs ' + c.visitante;
    if (!ligaJogos[k]) {
      const cFT = c.cantos_ft ? (c.cantos_ft.m||0) + (c.cantos_ft.v||0) : null;
      const cHT = c.cantos_ht ? (c.cantos_ht.m||0) + (c.cantos_ht.v||0) : null;
      const dFT = c.cantos_ft ? (c.cantos_ft.m||0) - (c.cantos_ft.v||0) : null;
      const dHT = c.cantos_ht ? (c.cantos_ht.m||0) - (c.cantos_ht.v||0) : null;
      ligaJogos[k] = {
        jogo: k, real: c.cantos_ft, real_ht: c.cantos_ht,
        cFT, cHT, dFT, dHT, placar: c.placar_ft,
        sistemas: {}
      };
    }
    if (!ligaJogos[k].sistemas[c.sistema]) ligaJogos[k].sistemas[c.sistema] = [];
    c.palpites.forEach((p, idx) => ligaJogos[k].sistemas[c.sistema].push({ ...p, _av: c.avaliacao[idx] }));
  }

  console.log('');
  console.log('| Jogo (placar)                                        | cFT | cHT | Cisne | Teacher | Enigma | Vencedor | Bala xCFT | erro |');
  console.log('|------------------------------------------------------|-----|-----|-------|---------|--------|----------|-----------|------|');
  for (const k of Object.keys(ligaJogos)) {
    const J = ligaJogos[k];
    function txtSist(s) {
      if (!J.sistemas[s]) return '—';
      const palps = J.sistemas[s];
      const ftP = palps.find(p => p.mercado === 'cantos_ft' && p.direcao);
      if (ftP) return ftP.direcao + (ftP.linha !== undefined ? ' ' + ftP.linha : '') + (ftP._av.resultado === 'HIT' ? '✅' : ftP._av.resultado === 'MISS' ? '❌' : '');
      const venc = palps.find(p => p.mercado === 'vencedor_cantos_ft' && p.time_favorito);
      if (venc) return 'V:' + venc.time_favorito.slice(0, 8) + (venc._av.resultado === 'HIT' ? '✅' : venc._av.resultado === 'MISS' ? '❌' : '');
      return '·';
    }
    const balaXCFT = (J.sistemas.BALA||[]).find(p => p.mercado === 'cantos_ft_estimado');
    const xCFTval = balaXCFT ? balaXCFT.valor : null;
    const erro = (xCFTval != null && J.cFT != null) ? (xCFTval - J.cFT).toFixed(1) : '—';
    const linha = '| ' + (J.jogo + ' (' + (J.placar || '?') + ')').padEnd(52) + ' | ' +
      String(J.cFT||'-').padStart(3) + ' | ' +
      String(J.cHT==null?'-':J.cHT).padStart(3) + ' | ' +
      txtSist('CISNE').slice(0, 5).padEnd(5) + ' | ' +
      txtSist('TEACHER').slice(0, 7).padEnd(7) + ' | ' +
      txtSist('ENIGMA').slice(0, 6).padEnd(6) + ' | ' +
      txtSist('VENCEDOR').slice(0, 8).padEnd(8) + ' | ' +
      String(xCFTval||'-').padStart(9) + ' | ' +
      String(erro).padStart(4) + ' |';
    console.log(linha);
  }

  // Métricas
  const todos = Object.values(ligaJogos);
  const cantosTotal = todos.filter(j => j.cFT != null).reduce((a,j) => a+j.cFT, 0);
  const cantosMedia = cantosTotal / todos.filter(j => j.cFT != null).length;
  console.log('');
  console.log(`  Cantos médio FT real:  ${cantosMedia.toFixed(2)} (linha modelo: 10)`);
  // Erro médio xCorners da Bala
  const errosBala = todos.map(j => {
    const x = (j.sistemas.BALA||[]).find(p => p.mercado === 'cantos_ft_estimado');
    return x && j.cFT != null ? { est: x.valor, real: j.cFT, erro: x.valor - j.cFT, abs: Math.abs(x.valor - j.cFT) } : null;
  }).filter(Boolean);
  if (errosBala.length) {
    const sumErro = errosBala.reduce((a,e) => a+e.erro, 0);
    const sumAbs = errosBala.reduce((a,e) => a+e.abs, 0);
    console.log(`  Bala xCorners FT: viés médio = ${(sumErro/errosBala.length).toFixed(2)} (negativo = SUBESTIMA), erro abs médio = ${(sumAbs/errosBala.length).toFixed(2)}`);
    const subestima = errosBala.filter(e => e.erro < -1).length;
    const superestima = errosBala.filter(e => e.erro > 1).length;
    console.log(`  Subestima >1: ${subestima}/${errosBala.length} jogos | Superestima >1: ${superestima}/${errosBala.length}`);
  }
  console.log('');
}

analisarLiga('J1');
analisarLiga('BR');
