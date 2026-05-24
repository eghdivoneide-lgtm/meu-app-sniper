/**
 * Fase 4 — Análise profunda das métricas
 *   - Acurácia por sistema × mercado
 *   - Acurácia por liga × sistema
 *   - Acurácia por força do sinal (NUCLEAR/FORTE/MODERADA, ATIVO/OBSERVAÇÃO, DOMÍNIO/FORTE/CLARA/LEVE)
 *   - CONVERGÊNCIA: quando 2+ sistemas concordam, qual a taxa?
 *   - Erro absoluto médio (xCorners estimado vs real)
 */
const fs = require('fs');
const path = require('path');
const cruzados = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_resultados.json')));

// helpers
function pct(num, den) { return den > 0 ? (num / den * 100).toFixed(1) : '-'; }
function bumpStats(obj, key, av) {
  if (!obj[key]) obj[key] = { HIT: 0, MISS: 0, PUSH: 0, NEUTRO: 0, SEM_DADO: 0, INFO: 0 };
  if (av.resultado === 'HIT') obj[key].HIT++;
  else if (av.resultado === 'MISS') obj[key].MISS++;
  else if (av.resultado === 'PUSH') obj[key].PUSH++;
  else if (av.resultado === 'NEUTRO') obj[key].NEUTRO++;
  else if (av.resultado === 'SEM_DADO') obj[key].SEM_DADO++;
  else if (av.resultado === 'INFO') obj[key].INFO++;
}
function acerto(s) { return s ? pct(s.HIT, s.HIT + s.MISS) : '-'; }
function nDecisivos(s) { return s ? s.HIT + s.MISS : 0; }

// ============== A) Por sistema × mercado =================
const porSistMerc = {};
const porLigaSist = {};
const porSistForca = {};
const porLigaSistMerc = {};
const errosXcorners = [];

for (const c of cruzados) {
  if (c._sem_match) continue;
  const sist = c.sistema;
  const liga = c.liga;
  c.palpites.forEach((p, idx) => {
    const av = c.avaliacao[idx];
    const merc = p.mercado;
    const forca = p.forca || 'sem_forca';

    bumpStats(porSistMerc, sist + '|' + merc, av);
    bumpStats(porLigaSist, liga + '|' + sist, av);
    bumpStats(porSistForca, sist + '|' + forca, av);
    bumpStats(porLigaSistMerc, liga + '|' + sist + '|' + merc, av);

    if (merc === 'cantos_ft_estimado' && av.resultado === 'INFO' && av.real != null) {
      errosXcorners.push({ liga, sist, real: av.real, est: av.estimado, erro: av.erro_abs });
    }
  });
}

// ============== B) Convergência ==================
// Para cada jogo (chave: liga+jogo), agrupar todos os palpites cantos_ft (OVER/UNDER) e cantos_ht
const porJogo = {};
for (const c of cruzados) {
  if (c._sem_match) continue;
  const k = c.liga + '|' + c.mandante + '|' + c.visitante;
  if (!porJogo[k]) porJogo[k] = { liga: c.liga, mand: c.mandante, vis: c.visitante, real: { cantos_ft: c.cantos_ft, cantos_ht: c.cantos_ht, placar_ft: c.placar_ft }, palpites: [] };
  c.palpites.forEach((p, idx) => {
    porJogo[k].palpites.push({ sistema: c.sistema, ...p, _av: c.avaliacao[idx] });
  });
}

// Métrica de convergência por mercado:
// Para cada jogo, contar quantos sistemas DECIDIRAM (OVER ou UNDER) e em qual direção
const convergStats = {
  cantos_ft: { 1: { HIT:0, MISS:0 }, 2: { HIT:0, MISS:0 }, 3: { HIT:0, MISS:0 }, 4: { HIT:0, MISS:0 }, 5: { HIT:0, MISS:0 } },
  cantos_ht: { 1: { HIT:0, MISS:0 }, 2: { HIT:0, MISS:0 }, 3: { HIT:0, MISS:0 }, 4: { HIT:0, MISS:0 }, 5: { HIT:0, MISS:0 } },
  vencedor_cantos_ft: { 1: { HIT:0, MISS:0 }, 2: { HIT:0, MISS:0 }, 3: { HIT:0, MISS:0 }, 4: { HIT:0, MISS:0 }, 5: { HIT:0, MISS:0 } },
  vencedor_cantos_ht: { 1: { HIT:0, MISS:0 }, 2: { HIT:0, MISS:0 }, 3: { HIT:0, MISS:0 }, 4: { HIT:0, MISS:0 }, 5: { HIT:0, MISS:0 } }
};
const convergJogos = []; // pra listar os jogos com alta convergência

for (const k of Object.keys(porJogo)) {
  const J = porJogo[k];
  if (!J.real.cantos_ft) continue;
  const cFT = (J.real.cantos_ft.m||0) + (J.real.cantos_ft.v||0);
  const cHT = J.real.cantos_ht ? (J.real.cantos_ht.m||0) + (J.real.cantos_ht.v||0) : null;
  const dM_FT = (J.real.cantos_ft.m||0) - (J.real.cantos_ft.v||0);
  const dM_HT = J.real.cantos_ht ? (J.real.cantos_ht.m||0) - (J.real.cantos_ht.v||0) : null;

  // Para cada mercado, contar sistemas únicos que palpitaram em cada direção
  const cantarFT = { OVER: new Set(), UNDER: new Set() };
  const cantarHT = { OVER: new Set(), UNDER: new Set() };
  const vencFT = {}; // time → set de sistemas
  const vencHT = {};

  for (const p of J.palpites) {
    if (p.mercado === 'cantos_ft' && p.direcao === 'OVER') cantarFT.OVER.add(p.sistema);
    else if (p.mercado === 'cantos_ft' && p.direcao === 'UNDER') cantarFT.UNDER.add(p.sistema);
    else if (p.mercado === 'cantos_ht' && p.direcao === 'OVER') cantarHT.OVER.add(p.sistema);
    else if (p.mercado === 'cantos_ht' && p.direcao === 'UNDER') cantarHT.UNDER.add(p.sistema);
    else if (p.mercado === 'vencedor_cantos_ft' && p.time_favorito) {
      const t = p.time_favorito;
      if (!vencFT[t]) vencFT[t] = new Set();
      vencFT[t].add(p.sistema);
    } else if (p.mercado === 'vencedor_cantos_ht' && p.time_favorito) {
      const t = p.time_favorito;
      if (!vencHT[t]) vencHT[t] = new Set();
      vencHT[t].add(p.sistema);
    }
  }

  // cantos FT — qual direção tem mais sistemas? (descarta empate)
  function avalConverg(stats, direcao, qtdSistemas, hit) {
    if (qtdSistemas < 1 || qtdSistemas > 5) return;
    if (!stats[qtdSistemas]) return;
    if (hit) stats[qtdSistemas].HIT++;
    else stats[qtdSistemas].MISS++;
  }
  // FT cantos
  if (cantarFT.OVER.size > cantarFT.UNDER.size && cantarFT.OVER.size >= 1) {
    const hit = cFT > 10;
    avalConverg(convergStats.cantos_ft, 'OVER', cantarFT.OVER.size, hit);
    if (cantarFT.OVER.size >= 3) {
      convergJogos.push({ liga: J.liga, jogo: J.mand + ' vs ' + J.vis, mercado: 'cantos_ft', direcao: 'OVER', sistemas: [...cantarFT.OVER], real_cFT: cFT, hit });
    }
  } else if (cantarFT.UNDER.size > cantarFT.OVER.size && cantarFT.UNDER.size >= 1) {
    const hit = cFT < 10;
    avalConverg(convergStats.cantos_ft, 'UNDER', cantarFT.UNDER.size, hit);
    if (cantarFT.UNDER.size >= 3) {
      convergJogos.push({ liga: J.liga, jogo: J.mand + ' vs ' + J.vis, mercado: 'cantos_ft', direcao: 'UNDER', sistemas: [...cantarFT.UNDER], real_cFT: cFT, hit });
    }
  }
  // HT cantos
  if (cHT != null) {
    if (cantarHT.OVER.size > cantarHT.UNDER.size && cantarHT.OVER.size >= 1) {
      const hit = cHT > 4;
      avalConverg(convergStats.cantos_ht, 'OVER', cantarHT.OVER.size, hit);
      if (cantarHT.OVER.size >= 3) {
        convergJogos.push({ liga: J.liga, jogo: J.mand + ' vs ' + J.vis, mercado: 'cantos_ht', direcao: 'OVER', sistemas: [...cantarHT.OVER], real_cHT: cHT, hit });
      }
    } else if (cantarHT.UNDER.size > cantarHT.OVER.size && cantarHT.UNDER.size >= 1) {
      const hit = cHT < 4;
      avalConverg(convergStats.cantos_ht, 'UNDER', cantarHT.UNDER.size, hit);
      if (cantarHT.UNDER.size >= 3) {
        convergJogos.push({ liga: J.liga, jogo: J.mand + ' vs ' + J.vis, mercado: 'cantos_ht', direcao: 'UNDER', sistemas: [...cantarHT.UNDER], real_cHT: cHT, hit });
      }
    }
  }
  // Vencedor FT
  for (const time of Object.keys(vencFT)) {
    const qts = vencFT[time].size;
    // Real vencedor:
    const realVencedor = dM_FT > 0 ? J.mand : (dM_FT < 0 ? J.vis : null);
    if (qts >= 1 && realVencedor) {
      // Match nome: usa includes simplificado
      const hit = (time.toLowerCase().includes(realVencedor.toLowerCase()) || realVencedor.toLowerCase().includes(time.toLowerCase()));
      avalConverg(convergStats.vencedor_cantos_ft, 'TIME', qts, hit);
      if (qts >= 3) {
        convergJogos.push({ liga: J.liga, jogo: J.mand + ' vs ' + J.vis, mercado: 'vencedor_cantos_ft', favorito: time, sistemas: [...vencFT[time]], real_vencedor: realVencedor, hit });
      }
    }
  }
  // Vencedor HT
  for (const time of Object.keys(vencHT)) {
    const qts = vencHT[time].size;
    const realVencedor = dM_HT > 0 ? J.mand : (dM_HT < 0 ? J.vis : null);
    if (qts >= 1 && realVencedor) {
      const hit = (time.toLowerCase().includes(realVencedor.toLowerCase()) || realVencedor.toLowerCase().includes(time.toLowerCase()));
      avalConverg(convergStats.vencedor_cantos_ht, 'TIME', qts, hit);
      if (qts >= 3) {
        convergJogos.push({ liga: J.liga, jogo: J.mand + ' vs ' + J.vis, mercado: 'vencedor_cantos_ht', favorito: time, sistemas: [...vencHT[time]], real_vencedor: realVencedor, hit });
      }
    }
  }
}

// ============= IMPRESSÃO ==============
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('  FASE 4 — MÉTRICAS PROFUNDAS');
console.log('═══════════════════════════════════════════════════════════════════════');

console.log('\n## A) Acurácia por SISTEMA × MERCADO\n');
console.log('| SISTEMA   | MERCADO              | HIT | MISS | %ACERTO | n=H+M |');
console.log('|-----------|----------------------|-----|------|---------|-------|');
const ordemSist = ['CISNE','TEACHER','ENIGMA','VENCEDOR','BALA'];
const ordemMerc = ['cantos_ft','cantos_ht','vencedor_cantos_ft','vencedor_cantos_ht','cantos_ft_estimado','enigma_status'];
for (const s of ordemSist) {
  for (const m of ordemMerc) {
    const x = porSistMerc[s + '|' + m];
    if (!x) continue;
    const dec = x.HIT + x.MISS;
    if (dec === 0) continue;
    console.log('| ' + s.padEnd(9) + ' | ' + m.padEnd(20) + ' | ' +
      String(x.HIT).padStart(3) + ' | ' +
      String(x.MISS).padStart(4) + ' | ' +
      pct(x.HIT, dec).padStart(6) + '% | ' +
      String(dec).padStart(5) + ' |');
  }
}

console.log('\n## B) Acurácia por LIGA × SISTEMA (palpites decisivos = HIT+MISS)\n');
const ligasOrdem = ['BR','BR_B','ARG','ARG_B','BUN','USL','MLS','J1','J2J3','CHN_SL','CHN_L1'];
console.log('| LIGA   | CISNE       | TEACHER     | ENIGMA      | VENCEDOR    | BALA        |');
console.log('|--------|-------------|-------------|-------------|-------------|-------------|');
for (const liga of ligasOrdem) {
  const cells = ordemSist.map(s => {
    const x = porLigaSist[liga + '|' + s];
    if (!x) return '-           ';
    const dec = x.HIT + x.MISS;
    if (dec === 0) return 'sem decis.  ';
    return (acerto(x).padStart(5) + '% (' + x.HIT + '/' + dec + ')').padEnd(11);
  });
  console.log('| ' + liga.padEnd(6) + ' | ' + cells.join(' | ') + ' |');
}

console.log('\n## C) CONVERGÊNCIA — Quando N sistemas concordam, taxa de acerto\n');
for (const merc of Object.keys(convergStats)) {
  console.log('  ' + merc + ':');
  for (let n = 1; n <= 5; n++) {
    const x = convergStats[merc][n];
    const dec = x.HIT + x.MISS;
    if (dec === 0) continue;
    console.log('    ' + n + ' sistema' + (n > 1 ? 's' : ' ').padEnd(2) + ' concordando: ' + pct(x.HIT, dec).padStart(5) + '% (' + x.HIT + '/' + dec + ')');
  }
}

console.log('\n## D) ACURÁCIA POR FORÇA DO SINAL (sistema × força)\n');
const forcas = {};
for (const k of Object.keys(porSistForca)) {
  const [sist, forca] = k.split('|');
  const x = porSistForca[k];
  const dec = x.HIT + x.MISS;
  if (dec < 2) continue;
  if (!forcas[sist]) forcas[sist] = [];
  forcas[sist].push({ forca, ...x, dec, pct: x.HIT/dec*100 });
}
for (const s of ordemSist) {
  if (!forcas[s]) continue;
  console.log('  ' + s + ':');
  forcas[s].sort((a,b) => b.pct - a.pct).forEach(f => {
    console.log('    ' + f.forca.padEnd(20) + ' ' + f.pct.toFixed(1).padStart(5) + '% (' + f.HIT + '/' + f.dec + ')');
  });
}

console.log('\n## E) ERRO ABSOLUTO MÉDIO — xCorners FT estimado vs real\n');
if (errosXcorners.length > 0) {
  const porSist2 = {};
  for (const e of errosXcorners) {
    if (!porSist2[e.sist]) porSist2[e.sist] = { soma: 0, n: 0 };
    porSist2[e.sist].soma += e.erro;
    porSist2[e.sist].n++;
  }
  for (const s of Object.keys(porSist2)) {
    console.log('  ' + s + ': erro médio ' + (porSist2[s].soma / porSist2[s].n).toFixed(2) + ' cantos (n=' + porSist2[s].n + ')');
  }
}

// salvar dados pra fase 5
fs.writeFileSync(path.join(__dirname, '_auditoria_metricas.json'), JSON.stringify({
  porSistMerc, porLigaSist, porSistForca, porLigaSistMerc, convergStats, convergJogos, errosXcorners
}, null, 2));
console.log('\n💾 Salvo: _auditoria_metricas.json');
