/**
 * Fase 2 v2 — Parsers refeitos.
 * Cada parser primeiro fragmenta o HTML em "blocos por jogo" e depois
 * extrai campos individualmente, tolerante a quebras de linha.
 */
const fs = require('fs');
const path = require('path');

const cobertura = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_cobertura.json')));
const RAIZ = cobertura.RAIZ_AUDIT;
const MAP_LIGA_PASTA = cobertura.MAP_LIGA_PASTA;

function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(div|p|tr|li|h\d|td|th)[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

// ============================================================================
// VENCEDOR CANTOS (refeito)
// ============================================================================
function parseVencedor(txt) {
  const palpites = {};
  // Cada jogo começa com "📅 DD/MM" e tem padrão de duas seções (HT e FT)
  const blocos = txt.split(/📅\s+(\d{2}\/\d{2})/);
  for (let i = 1; i < blocos.length; i += 2) {
    const corpo = blocos[i + 1] || '';
    // Times: linha "X vs Y" antes de "1º Tempo"
    const mTimes = corpo.match(/([^\n]+?)\s+vs\s+([^\n]+?)\s*\n/);
    if (!mTimes) continue;
    const mand = mTimes[1].replace(/^\s*🕒\s*\d{2}:\d{2}\s*/, '').trim();
    const vis = mTimes[2].trim();
    const key = mand + '|' + vis;
    palpites[key] = palpites[key] || { mandante: mand, visitante: vis, palpites: [] };

    const coerente = /✅\s+COERENTE/.test(corpo);
    const reversao = /⚡\s+REVERS[ÃA]O/.test(corpo);

    // HT: bloco entre "1º Tempo (HT)" e "Jogo todo (FT)"
    const mHT = corpo.match(/1º Tempo\s*\(HT\)\s*\n([\s\S]*?)Jogo todo\s*\(FT\)/);
    if (mHT) {
      const ht = mHT[1];
      // Tipo 1: "🏠 TimeNome\n Vantagem: +N.N cantos\n FAIXA"
      // Tipo 2: "⚖️ Equilíbrio\n Δ N.N cantos\n EQUILIBRADO"
      const equil = /⚖.{0,3}Equil[íi]brio[\s\S]*?Δ\s+([\d.]+)\s+cantos[\s\S]*?(EQUIL[ÍI]BRADO|REVERS[ÃA]O)/i.exec(ht);
      const fav = /(?:🏠|✈)\s*([^\n]+?)\s*\n\s*Vantagem:\s*\+?([\d.]+)\s+cantos\s*\n\s*(?:.\s*)?(DOM[ÍI]NIO TOTAL|FORTE|CLARA|LEVE)/i.exec(ht);
      if (equil) {
        palpites[key].palpites.push({
          mercado: 'vencedor_cantos_ht',
          time_favorito: null,
          vantagem: parseFloat(equil[1]),
          forca: 'EQUILIBRADO',
          coerente, reversao,
          raw: 'VencedorHT'
        });
      } else if (fav) {
        const lado = /✈/.test(ht.match(/(?:🏠|✈)\s*[^\n]+/)[0]) ? 'visitante' : 'mandante';
        palpites[key].palpites.push({
          mercado: 'vencedor_cantos_ht',
          time_favorito: fav[1].trim(),
          time_lado: lado,
          vantagem: parseFloat(fav[2]),
          forca: fav[3].toUpperCase().replace(/Í/g, 'I'),
          coerente, reversao,
          raw: 'VencedorHT'
        });
      }
    }
    // FT: bloco depois de "Jogo todo (FT)"
    const mFT = corpo.match(/Jogo todo\s*\(FT\)\s*\n([\s\S]*?)(?=📅|$)/);
    if (mFT) {
      const ft = mFT[1];
      const equil = /⚖.{0,3}Equil[íi]brio[\s\S]*?Δ\s+([\d.]+)\s+cantos[\s\S]*?(EQUIL[ÍI]BRADO|REVERS[ÃA]O)/i.exec(ft);
      const fav = /(?:🏠|✈)\s*([^\n]+?)\s*\n\s*Vantagem:\s*\+?([\d.]+)\s+cantos\s*\n\s*(?:.\s*)?(DOM[ÍI]NIO TOTAL|FORTE|CLARA|LEVE)/i.exec(ft);
      if (equil) {
        palpites[key].palpites.push({
          mercado: 'vencedor_cantos_ft',
          time_favorito: null,
          vantagem: parseFloat(equil[1]),
          forca: 'EQUILIBRADO',
          coerente, reversao,
          raw: 'VencedorFT'
        });
      } else if (fav) {
        const lado = /✈/.test(ft.match(/(?:🏠|✈)\s*[^\n]+/)[0]) ? 'visitante' : 'mandante';
        palpites[key].palpites.push({
          mercado: 'vencedor_cantos_ft',
          time_favorito: fav[1].trim(),
          time_lado: lado,
          vantagem: parseFloat(fav[2]),
          forca: fav[3].toUpperCase().replace(/Í/g, 'I'),
          coerente, reversao,
          raw: 'VencedorFT'
        });
      }
    }
  }
  return Object.values(palpites);
}

// ============================================================================
// CISNE NEGRO
// ============================================================================
function parseCisne(txt) {
  const palpites = {};
  // "🦢 SELO CISNE NEGRO\n A vs B\n Favorito Absoluto: X\n Vantagem Projetada: +N cantos\n Nível Matemática: Altíssima (Gatilho)"
  const blocos = txt.split(/🦢\s+SELO\s+CISNE\s+NEGRO/);
  for (let i = 1; i < blocos.length; i++) {
    const b = blocos[i];
    const mTimes = b.match(/^\s*([^\n]+?)\s+vs\s+([^\n]+?)\s*\n/);
    if (!mTimes) continue;
    const mand = mTimes[1].trim();
    const vis = mTimes[2].trim();
    const mFav = b.match(/Favorito Absoluto:\s*([^\n]+)/);
    const mVan = b.match(/Vantagem Projetada:\s*\+?([\d.]+)\s+cantos/i);
    const mNiv = b.match(/N[íi]vel Matem[áa]tica:\s*([^(\n]+?)(?:\s*\(([^)]+)\))?/);
    if (!mFav || !mVan) continue;
    const key = mand + '|' + vis;
    palpites[key] = palpites[key] || { mandante: mand, visitante: vis, palpites: [] };
    palpites[key].palpites.push({
      mercado: 'vencedor_cantos_ft',
      time_favorito: mFav[1].trim(),
      vantagem: parseFloat(mVan[1]),
      nivel: mNiv ? mNiv[1].trim() : null,
      gatilho: mNiv && mNiv[2] ? mNiv[2].trim() : null,
      forca: 'CISNE_GATILHO',
      raw: 'CisneNegro'
    });
  }
  return Object.values(palpites);
}

// ============================================================================
// TEACHER (refeito)
// ============================================================================
function parseTeacher(txt) {
  const palpites = {};
  const blocos = txt.split(/📅\s+\d{2}\/\d{2}\s+·\s+🕒\s+\d{2}:\d{2}/);
  for (let i = 1; i < blocos.length; i++) {
    const b = blocos[i];
    const mTimes = b.match(/^\s*([^\n]+?)\s+vs\s+([^\n]+?)(?:\s+🐺|\s+🔥|\s*\n\s*Métrica|\s*\n)/);
    if (!mTimes) continue;
    const mand = mTimes[1].trim();
    const vis = mTimes[2].trim();
    const key = mand + '|' + vis;
    palpites[key] = palpites[key] || { mandante: mand, visitante: vis, palpites: [] };

    const bp = (b.match(/🐺\s+BP\s+(\w+)/) || [])[1];
    const conf = parseInt((b.match(/Confian[çc]a\s+(\d+)%/) || [])[1] || 0);
    const xFT = parseFloat((b.match(/xCorners FT\s+([\d.]+)/) || [])[1]);
    const xHT = parseFloat((b.match(/xCorners HT\s+([\d.]+)/) || [])[1]);
    // Sniper FT: padrão "xCorners FT N.NN UNDER/OVER N" OU "xCorners FT N.NN NEUTRO"
    const mSnFT = b.match(/xCorners FT\s+[\d.]+\s+(UNDER|OVER|NEUTRO)(?:\s+(\d+))?/i);
    const mSnHT = b.match(/xCorners HT\s+[\d.]+\s+(UNDER|OVER|NEUTRO)(?:\s+(\d+))?/i);
    if (mSnFT && mSnFT[1].toUpperCase() !== 'NEUTRO') {
      palpites[key].palpites.push({
        mercado: 'cantos_ft',
        linha: mSnFT[2] ? parseFloat(mSnFT[2]) : 10,
        direcao: mSnFT[1].toUpperCase(),
        confianca: conf,
        forca: bp || null,
        xcorners: xFT,
        raw: 'TeacherFT'
      });
    }
    if (mSnHT && mSnHT[1].toUpperCase() !== 'NEUTRO') {
      palpites[key].palpites.push({
        mercado: 'cantos_ht',
        linha: mSnHT[2] ? parseFloat(mSnHT[2]) : 4,
        direcao: mSnHT[1].toUpperCase(),
        confianca: conf,
        forca: bp || null,
        xcorners: xHT,
        raw: 'TeacherHT'
      });
    }
  }
  return Object.values(palpites);
}

// ============================================================================
// ENIGMA (refeito)
// ============================================================================
function parseEnigma(txt) {
  const palpites = {};
  const blocos = txt.split(/📅\s+\d{2}\/\d{2}\s+·\s+🕒\s+\d{2}:\d{2}/);
  for (let i = 1; i < blocos.length; i++) {
    const b = blocos[i];
    // Times: "TimeA × TimeB"
    const mTimes = b.match(/^\s*([^\n]+?)\s+×\s+([^\n]+?)\s*\n/);
    if (!mTimes) continue;
    const mand = mTimes[1].trim();
    const vis = mTimes[2].trim();
    const key = mand + '|' + vis;
    palpites[key] = palpites[key] || { mandante: mand, visitante: vis, palpites: [] };

    const mSDE = b.match(/(\d+)\s+SDE\s*\/\s*100\s+(ATIVO|EM OBSERVAÇÃO|RU[ÍI]DO|SEM SINAL)/);
    if (!mSDE) continue;
    const sdeScore = parseInt(mSDE[1]);
    const sdeStatus = mSDE[2].normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    if (sdeStatus !== 'ATIVO') {
      palpites[key].palpites.push({
        mercado: 'enigma_status',
        sde_score: sdeScore,
        forca: sdeStatus,
        raw: 'EnigmaStatus'
      });
      continue;
    }

    const mTotal = b.match(/Total Estimado:\s*~?\s*([\d.]+)\s+cant/i);
    const totalEst = mTotal ? parseFloat(mTotal[1]) : null;
    const mHT = b.match(/HT\s+(\d+(?:\.\d+)?)\s+total/i);
    const htTotal = mHT ? parseFloat(mHT[1]) : null;
    const mConf = b.match(/Confian[çc]a\s+(ALTA|M[ÉE]DIA|BAIXA)/i);
    const conf = mConf ? mConf[1].toUpperCase().replace(/É/g, 'E') : null;
    const mDeltaSaldo = b.match(/Δ Saldo:\s*([+\-]?[\d.]+)/);
    const deltaSaldo = mDeltaSaldo ? parseFloat(mDeltaSaldo[1]) : null;
    const mLinha = b.match(/LINHA RECOMENDADA[\s\S]*?FT\s+([\d.\-+]+)\s+([^\n]+)/i);

    if (totalEst != null) {
      palpites[key].palpites.push({
        mercado: 'cantos_ft',
        linha: 10,
        direcao: totalEst > 10.5 ? 'OVER' : (totalEst < 9.5 ? 'UNDER' : 'NEUTRO'),
        sde_score: sdeScore,
        confianca: conf,
        total_estimado: totalEst,
        forca: 'ATIVO',
        linha_recomendada: mLinha ? mLinha[0].slice(0, 60) : null,
        raw: 'EnigmaFT'
      });
    }
    if (htTotal != null) {
      palpites[key].palpites.push({
        mercado: 'cantos_ht',
        linha: 4,
        direcao: htTotal > 4.5 ? 'OVER' : (htTotal < 3.5 ? 'UNDER' : 'NEUTRO'),
        sde_score: sdeScore,
        confianca: conf,
        total_estimado: htTotal,
        forca: 'ATIVO',
        raw: 'EnigmaHT'
      });
    }
    if (deltaSaldo != null && deltaSaldo !== 0) {
      palpites[key].palpites.push({
        mercado: 'vencedor_cantos_ft',
        time_favorito: deltaSaldo > 0 ? mand : vis,
        delta: Math.abs(deltaSaldo),
        sde_score: sdeScore,
        forca: 'ATIVO',
        raw: 'EnigmaVencedor'
      });
    }
  }
  return Object.values(palpites);
}

// ============================================================================
// BALA DE PRATA (refeito - menos duplicatas)
// ============================================================================
function parseBala(txt) {
  const palpites = {};
  // 1) Cards Bala — após o cabeçalho "Bala de Prata (Selo do JOGO)"
  // Padrão: "🐺 A vs B\n 🏆 Favorito X\n 🛡️ Odd Justa @ N\n 🏷️ Selo TIPO\n 🎯 Tiro Sniper FT DIRECAO LINHA"
  const cards = [...txt.matchAll(/🐺\s+([^\n]+?)\s+vs\s+([^\n]+?)\s*\n[\s\S]*?🏆\s+Favorito\s+([^\n]+?)\s*\n[\s\S]*?🛡️\s+Odd Justa\s+@\s*([\d.]+)[\s\S]*?🏷️\s+Selo\s+(\w+)[\s\S]*?🎯\s+Tiro Sniper FT\s+(OVER|UNDER|NEUTRO)(?:\s+(\d+))?/g)];
  for (const m of cards) {
    const mand = m[1].trim();
    const vis = m[2].trim();
    const key = mand + '|' + vis;
    if (palpites[key]) continue; // já capturou esse card
    palpites[key] = { mandante: mand, visitante: vis, palpites: [] };
    if (m[6].toUpperCase() !== 'NEUTRO') {
      palpites[key].palpites.push({
        mercado: 'cantos_ft',
        linha: m[7] ? parseFloat(m[7]) : 10,
        direcao: m[6].toUpperCase(),
        forca: m[5].toUpperCase(),
        odd_justa: parseFloat(m[4]),
        raw: 'BalaCardFT'
      });
    }
    palpites[key].palpites.push({
      mercado: 'vencedor_cantos_ft',
      time_favorito: m[3].trim(),
      forca: m[5].toUpperCase(),
      odd_justa: parseFloat(m[4]),
      raw: 'BalaCardFavorito'
    });
  }

  // 2) Tabela "Reis dos Cantos" — entrada com Sniper HT / Sniper FT / xCorners FT
  // Procurar linhas: "TimeA vs TimeB FavoritoNome @ N FAIXA SniperHT SniperFT xCornersFT"
  // Como a tabela vem após "Reis dos Cantos", e os jogos podem repetir os do card.
  // Vamos identificar somente os jogos que NÃO estavam nos cards (=> ampliar cobertura)
  // Padrão exemplo: "Internacional vs Fluminense Fluminense @ 1.97 EQUILIBRADO OVER 4 OVER 10 11.42"
  const reRei = /([A-Za-zÀ-úÇç0-9'\.\-\s]+?)\s+vs\s+([A-Za-zÀ-úÇç0-9'\.\-\s]+?)\s+([A-Za-zÀ-úÇç0-9'\.\-\s]+?)\s+@\s*([\d.]+)\s+(ABSOLUTO|DOMINANTE|MODERADO|MEDIANO|EQUILIBRADO)\s+(NEUTRO|OVER\s+\d+|UNDER\s+\d+)\s+(NEUTRO|OVER\s+\d+|UNDER\s+\d+)\s+([\d.]+)/g;
  let m;
  while ((m = reRei.exec(txt)) !== null) {
    const mand = m[1].trim();
    const vis = m[2].trim();
    const key = mand + '|' + vis;
    if (!palpites[key]) {
      palpites[key] = { mandante: mand, visitante: vis, palpites: [] };
    }
    const faixa = m[5];
    // Sniper HT
    if (m[6].toUpperCase() !== 'NEUTRO') {
      const [dir, lin] = m[6].split(/\s+/);
      palpites[key].palpites.push({
        mercado: 'cantos_ht',
        linha: parseFloat(lin),
        direcao: dir.toUpperCase(),
        forca: faixa,
        raw: 'BalaRei_SniperHT'
      });
    }
    // Sniper FT (só adiciona se ainda não tem cantos_ft no key)
    const jaTemFT = palpites[key].palpites.some(p => p.mercado === 'cantos_ft' && p.raw === 'BalaCardFT');
    if (!jaTemFT && m[7].toUpperCase() !== 'NEUTRO') {
      const [dir, lin] = m[7].split(/\s+/);
      palpites[key].palpites.push({
        mercado: 'cantos_ft',
        linha: parseFloat(lin),
        direcao: dir.toUpperCase(),
        forca: faixa,
        raw: 'BalaRei_SniperFT'
      });
    }
    // xCorners FT (estimativa numérica)
    palpites[key].palpites.push({
      mercado: 'cantos_ft_estimado',
      valor: parseFloat(m[8]),
      forca: faixa,
      raw: 'BalaRei_xCornersFT'
    });
  }

  return Object.values(palpites);
}

// ============================================================================
// MAIN
// ============================================================================
const TODOS = [];
const SISTEMAS_PARSE = {
  CISNE: parseCisne,
  TEACHER: parseTeacher,
  ENIGMA: parseEnigma,
  VENCEDOR: parseVencedor,
  BALA: parseBala
};
const SUBPASTAS = {
  CISNE: '01_Rodadas Cisne Negro',
  TEACHER: '02_Projeção Teacher Rodada',
  ENIGMA: '03_Projeção Enigma',
  VENCEDOR: '04_Vencedor Cantos',
  BALA: '05_Bala de Prata'
};

const stats = {};
let totalPalpites = 0;

for (const [cod, pastaLiga] of Object.entries(MAP_LIGA_PASTA)) {
  stats[cod] = {};
  for (const sigla of Object.keys(SISTEMAS_PARSE)) {
    const c = cobertura.cobertura[cod][sigla];
    if (!c.existe) { stats[cod][sigla] = { jogos: 0, palpites: 0 }; continue; }
    const arq = path.join(RAIZ, pastaLiga, SUBPASTAS[sigla], c.arq);
    const html = fs.readFileSync(arq, 'utf-8');
    const txt = htmlToText(html);
    let dados = [];
    try { dados = SISTEMAS_PARSE[sigla](txt); } catch (e) { console.error('Erro ' + cod + ' ' + sigla + ':', e.message); }
    const nPalp = dados.reduce((acc, j) => acc + j.palpites.length, 0);
    stats[cod][sigla] = { jogos: dados.length, palpites: nPalp };
    dados.forEach(j => {
      TODOS.push({
        liga: cod,
        sistema: sigla,
        data_relatorio: c.data,
        jogo: j.mandante + ' vs ' + j.visitante,
        mandante: j.mandante,
        visitante: j.visitante,
        palpites: j.palpites
      });
    });
    totalPalpites += nPalp;
  }
}

fs.writeFileSync(path.join(__dirname, '_auditoria_palpites.json'), JSON.stringify(TODOS, null, 2));

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('  FASE 2 v2 — PARSER DOS RELATÓRIOS — RESUMO');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('| LIGA   | CISNE       | TEACHER     | ENIGMA      | VENCEDOR    | BALA        |');
console.log('|--------|-------------|-------------|-------------|-------------|-------------|');
for (const cod of Object.keys(MAP_LIGA_PASTA)) {
  const cells = ['CISNE', 'TEACHER', 'ENIGMA', 'VENCEDOR', 'BALA'].map(s => {
    const x = stats[cod][s];
    return (x.jogos + 'j ' + x.palpites + 'p').padEnd(11);
  });
  console.log('| ' + cod.padEnd(6) + ' | ' + cells.join(' | ') + ' |');
}
console.log('');
console.log(`Entradas (liga×sistema): ${TODOS.length}`);
console.log(`Total palpites: ${totalPalpites}`);
