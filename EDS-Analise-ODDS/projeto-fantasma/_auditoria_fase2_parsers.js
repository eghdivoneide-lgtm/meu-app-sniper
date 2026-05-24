/**
 * Fase 2 — Parsers dos relatórios HTML.
 *
 * Para cada um dos 5 sistemas (Cisne, Teacher, Enigma, Vencedor, Bala),
 * extrai os palpites por jogo e normaliza num formato comum.
 *
 * Saída: _auditoria_palpites.json com array de:
 *   {
 *     liga, sistema, data_relatorio,
 *     jogo: "Mandante vs Visitante",
 *     mandante, visitante,
 *     palpites: [
 *       { mercado, linha, direcao, forca, score, raw }
 *     ]
 *   }
 */
const fs = require('fs');
const path = require('path');

const cobertura = JSON.parse(fs.readFileSync(path.join(__dirname, '_auditoria_cobertura.json')));
const RAIZ = cobertura.RAIZ_AUDIT;
const MAP_LIGA_PASTA = cobertura.MAP_LIGA_PASTA;

// --- helper: limpar HTML pra texto ---
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

// Normaliza nome de time para matching (lowercase, remove acentos, abreviações comuns)
function norm(t) {
  if (!t) return '';
  return t.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\bfc\b|\bsc\b|\bcf\b|\b-pr\b|\b-mg\b|\b-rj\b|\b-sp\b|\b-go\b/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// =============================================================================
// PARSER: BALA DE PRATA
// =============================================================================
function parseBala(txt) {
  const palpites = {};
  // Bala: blocos "🐺 Time1 vs Time2 ... Selo X ... Tiro Sniper FT OVER/UNDER 10/NEUTRO"
  // Mapa: tabela "Reis dos Cantos" com Sniper HT, Sniper FT, xCorners FT
  // Vamos pegar os cards de Bala e os Reis em sequência.

  // Cards Bala — regex
  const reCard = /🐺\s+([^\n]+?)\s+vs\s+([^\n]+?)(?=\s+🏆|\s+🛡)/g;
  // Não confiável entre html e texto — vou outra estratégia: split por "🐺"
  const blocos = txt.split(/🐺(?!\s*Bala de Prata|\s*Reis|\s*Tiro)/g);

  // Cards Bala individuais — "X vs Y 🏆 Favorito Z 🛡️ Odd Justa @ N 🏷️ Selo TIPO 🎯 Tiro Sniper FT DIRECAO_LINHA"
  const reBalaCard = /([^\n🐺]+?)\s+vs\s+([^\n🏆🛡🏷🎯]+?)\s+🏆\s+Favorito\s+([^\n🛡]+?)\s+🛡️\s+Odd Justa\s+@\s*([\d.]+)\s+🏷️\s+Selo\s+(\w+)\s+🎯\s+Tiro Sniper FT\s+(OVER|UNDER|NEUTRO)(?:\s+(\d+))?/gi;
  let m;
  while ((m = reBalaCard.exec(txt)) !== null) {
    const key = m[1].trim() + '|' + m[2].trim();
    palpites[key] = palpites[key] || { mandante: m[1].trim(), visitante: m[2].trim(), palpites: [] };
    palpites[key].palpites.push({
      mercado: 'cantos_ft',
      linha: m[7] ? parseFloat(m[7]) : 10,
      direcao: m[6].toUpperCase(),
      forca: m[5].toUpperCase(),
      score: parseFloat(m[4]),
      raw: 'BalaCard'
    });
    palpites[key].palpites.push({
      mercado: 'vencedor_cantos_ft',
      time_favorito: m[3].trim(),
      forca: m[5].toUpperCase(),
      score: parseFloat(m[4]),
      raw: 'BalaFavorito'
    });
  }

  // Tabela Reis dos Cantos — formato típico:
  // "Time vs Time2 [favorito] @ N FAIXA SniperHT(UNDER/OVER N|NEUTRO) SniperFT(OVER/UNDER N|NEUTRO) xCornersFT N.NN"
  const reRei = /([^\n@]+?)\s+vs\s+([^\n@]+?)\s+([A-Za-zÀ-ú\-\.]+(?:\s+[A-Za-zÀ-ú\-\.]+){0,2})\s+@\s*([\d.]+)\s+(ABSOLUTO|DOMINANTE|MODERADO|MEDIANO|EQUILIBRADO)\s+(NEUTRO|OVER\s+\d+|UNDER\s+\d+)\s+(NEUTRO|OVER\s+\d+|UNDER\s+\d+)\s+([\d.]+)/gi;
  while ((m = reRei.exec(txt)) !== null) {
    const key = m[1].trim() + '|' + m[2].trim();
    palpites[key] = palpites[key] || { mandante: m[1].trim(), visitante: m[2].trim(), palpites: [] };
    // Sniper HT
    if (m[6].toUpperCase() !== 'NEUTRO') {
      const [dir, lin] = m[6].split(/\s+/);
      palpites[key].palpites.push({
        mercado: 'cantos_ht',
        linha: parseFloat(lin),
        direcao: dir.toUpperCase(),
        forca: m[5],
        raw: 'BalaRei_SniperHT'
      });
    }
    // Sniper FT
    if (m[7].toUpperCase() !== 'NEUTRO') {
      const [dir, lin] = m[7].split(/\s+/);
      palpites[key].palpites.push({
        mercado: 'cantos_ft',
        linha: parseFloat(lin),
        direcao: dir.toUpperCase(),
        forca: m[5],
        raw: 'BalaRei_SniperFT'
      });
    }
    // xCorners FT
    palpites[key].palpites.push({
      mercado: 'cantos_ft_estimado',
      valor: parseFloat(m[8]),
      forca: m[5],
      raw: 'BalaRei_xCornersFT'
    });
    // Vencedor (já capturado nos cards, mas reforça)
    palpites[key].palpites.push({
      mercado: 'vencedor_cantos_ft',
      time_favorito: m[3].trim(),
      forca: m[5],
      odd_justa: parseFloat(m[4]),
      raw: 'BalaRei_Favorito'
    });
  }

  return Object.values(palpites);
}

// =============================================================================
// PARSER: TEACHER
// =============================================================================
function parseTeacher(txt) {
  const palpites = {};
  // Padrão: "📅 DD/MM · 🕒 HH:MM TimeA vs TimeB 🐺 BP X ... xCorners FT N.NN UNDER/OVER N xCorners HT N.NN UNDER/OVER N Confiança N%"
  const reTeacher = /(\d{2}\/\d{2})\s+·\s+🕒\s+\d{2}:\d{2}\s+([^\n🐺📅]+?)\s+vs\s+([^\n🐺📅]+?)\s+(?:🐺\s+BP\s+(\w+))?(?:\s+🔥\s+TOP\s+\w+)?\s+Métrica.*?xCorners FT\s+([\d.]+)\s+(UNDER|OVER|NEUTRO)(?:\s+(\d+))?\s+xCorners HT\s+([\d.]+)\s+(UNDER|OVER|NEUTRO)(?:\s+(\d+))?\s+Confiança\s+(\d+)%/gis;
  let m;
  while ((m = reTeacher.exec(txt)) !== null) {
    const key = m[2].trim() + '|' + m[3].trim();
    palpites[key] = palpites[key] || { mandante: m[2].trim(), visitante: m[3].trim(), palpites: [] };
    const conf = parseInt(m[11]);
    const bp = m[4] || null;
    // FT
    if (m[6] !== 'NEUTRO') {
      palpites[key].palpites.push({
        mercado: 'cantos_ft',
        linha: m[7] ? parseFloat(m[7]) : 10,
        direcao: m[6],
        confianca: conf,
        forca: bp,
        xcorners: parseFloat(m[5]),
        raw: 'TeacherFT'
      });
    }
    // HT
    if (m[9] !== 'NEUTRO') {
      palpites[key].palpites.push({
        mercado: 'cantos_ht',
        linha: m[10] ? parseFloat(m[10]) : 4,
        direcao: m[9],
        confianca: conf,
        forca: bp,
        xcorners: parseFloat(m[8]),
        raw: 'TeacherHT'
      });
    }
  }
  return Object.values(palpites);
}

// =============================================================================
// PARSER: ENIGMA
// =============================================================================
function parseEnigma(txt) {
  const palpites = {};
  // Padrão: "📅 DD/MM ... TimeA × TimeB ... NN SDE / 100 (ATIVO|OBSERVAÇÃO|RUÍDO|EM OBSERVAÇÃO) ... LINHA RECOMENDADA ... FT N.N TIME ... HT N total ... Confiança X"
  const reEnigma = /(\d{2}\/\d{2}).*?([A-Za-zÀ-ú0-9\.\-' ]+?)\s+×\s+([A-Za-zÀ-ú0-9\.\-' ]+?)\s+(?:🏠|✈|🌍).*?(\d+)\s+SDE\s*\/\s*100\s+(ATIVO|EM OBSERVAÇÃO|RU[ÍI]DO|SEM SINAL)/gi;
  // Como o regex acima é frágil, vamos usar split por "📅" e processar cada bloco
  const blocos = txt.split(/📅\s+(\d{2}\/\d{2})/);
  for (let i = 1; i < blocos.length; i += 2) {
    const data = blocos[i];
    const corpo = blocos[i + 1] || '';
    // Extrair times: "TimeA × TimeB"
    const mTimes = corpo.match(/^[\s\S]*?([A-Za-zÀ-ú0-9\.\-'\s]+?)\s+×\s+([A-Za-zÀ-ú0-9\.\-'\s]+?)(?=\s+🏠|\s+✈|\s+🌍|\s+\d+\s+SDE)/);
    if (!mTimes) continue;
    const mand = mTimes[1].trim().replace(/^\s+|\s+$/g, '');
    const vis = mTimes[2].trim().replace(/^\s+|\s+$/g, '');
    const key = mand + '|' + vis;
    palpites[key] = palpites[key] || { mandante: mand, visitante: vis, palpites: [] };
    // SDE score
    const mSDE = corpo.match(/(\d+)\s+SDE\s*\/\s*100\s+(ATIVO|EM OBSERVAÇÃO|RU[ÍI]DO|SEM SINAL)/);
    const sdeScore = mSDE ? parseInt(mSDE[1]) : null;
    const sdeStatus = mSDE ? mSDE[2].replace(/RU[ÍI]DO/i, 'RUIDO') : null;
    // Total estimado
    const mTotal = corpo.match(/Total Estimado:\s*~?\s*([\d.]+)\s+cant/i);
    const totalEst = mTotal ? parseFloat(mTotal[1]) : null;
    // HT total
    const mHT = corpo.match(/HT\s+(\d+(?:\.\d+)?)\s+total/i);
    const htTotal = mHT ? parseFloat(mHT[1]) : null;
    // Confiança
    const mConf = corpo.match(/Confian[çc]a\s+(ALTA|M[ÉE]DIA|BAIXA)/i);
    const conf = mConf ? mConf[1].toUpperCase().replace(/É/g, 'E') : null;
    // Vantagem (Δ Saldo / Δ Produção)
    const mDeltaSaldo = corpo.match(/Δ Saldo:\s*([+\-][\d.]+)/);
    const deltaSaldo = mDeltaSaldo ? parseFloat(mDeltaSaldo[1]) : null;

    if (sdeStatus === 'ATIVO' && totalEst != null) {
      // Inferir Over/Under FT da linha 10
      palpites[key].palpites.push({
        mercado: 'cantos_ft',
        linha: 10,
        direcao: totalEst > 10.5 ? 'OVER' : (totalEst < 9.5 ? 'UNDER' : 'NEUTRO'),
        sde_score: sdeScore,
        confianca: conf,
        total_estimado: totalEst,
        forca: sdeStatus,
        raw: 'EnigmaFT'
      });
    }
    if (sdeStatus === 'ATIVO' && htTotal != null) {
      palpites[key].palpites.push({
        mercado: 'cantos_ht',
        linha: 4,
        direcao: htTotal > 4.5 ? 'OVER' : (htTotal < 3.5 ? 'UNDER' : 'NEUTRO'),
        sde_score: sdeScore,
        confianca: conf,
        total_estimado: htTotal,
        forca: sdeStatus,
        raw: 'EnigmaHT'
      });
    }
    if (sdeStatus === 'ATIVO' && deltaSaldo != null) {
      // Se delta saldo positivo, mandante domina; negativo, visitante
      palpites[key].palpites.push({
        mercado: 'vencedor_cantos_ft',
        time_favorito: deltaSaldo > 0 ? mand : vis,
        delta: Math.abs(deltaSaldo),
        sde_score: sdeScore,
        forca: sdeStatus,
        raw: 'EnigmaVencedor'
      });
    }
  }
  return Object.values(palpites);
}

// =============================================================================
// PARSER: VENCEDOR CANTOS
// =============================================================================
function parseVencedor(txt) {
  const palpites = {};
  // Padrão: "📅 DD/MM ... TimeA vs TimeB — coerência? ... 1º Tempo (HT) [favorito] Vantagem: +N.N cantos FAIXA ... Jogo todo (FT) [favorito] Vantagem: +N.N FAIXA"
  const blocos = txt.split(/📅\s+(\d{2}\/\d{2})\s+·\s+🕒\s+\d{2}:\d{2}/);
  for (let i = 1; i < blocos.length; i += 2) {
    const corpo = blocos[i + 1] || '';
    const mLinha = corpo.match(/^([^\n]+?)\s+vs\s+([^\n—]+?)(?:\s+—|\s+✅|\s+⚡|\s+🏆)/);
    if (!mLinha) continue;
    const mand = mLinha[1].trim();
    const vis = mLinha[2].trim();
    const key = mand + '|' + vis;
    palpites[key] = palpites[key] || { mandante: mand, visitante: vis, palpites: [] };

    // Coerência HT=FT?
    const coerente = /✅\s+COERENTE/.test(corpo);
    const reversao = /⚡\s+REVERS[ÃA]O/.test(corpo);

    // HT
    const mHT = corpo.match(/1º Tempo\s+\(HT\)\s+(?:🏠|✈|⚖)\s*([^\n]+?)\s+(?:Vantagem:\s*([+\-][\d.]+)\s+cantos|Equil[íi]brio\s+Δ\s*([\d.]+))\s+(👑\s+DOM[ÍI]NIO TOTAL|⚫\s+FORTE|🟢\s+CLARA|💧\s+LEVE|⚖\s+EQUIL[ÍI]BRADO)/i);
    if (mHT) {
      const fav = mHT[1].trim();
      const vantagem = mHT[2] ? parseFloat(mHT[2]) : 0;
      const faixa = mHT[4].replace(/[👑⚫🟢💧⚖]\s*/g, '').trim();
      palpites[key].palpites.push({
        mercado: 'vencedor_cantos_ht',
        time_favorito: faixa.includes('EQUIL') ? null : fav,
        vantagem,
        forca: faixa,
        coerente,
        reversao,
        raw: 'VencedorHT'
      });
    }
    // FT
    const mFT = corpo.match(/Jogo todo\s+\(FT\)\s+(?:🏠|✈|⚖)\s*([^\n]+?)\s+Vantagem:\s*([+\-][\d.]+)(?:\s+cantos)?\s+(👑\s+DOM[ÍI]NIO TOTAL|⚫\s+FORTE|🟢\s+CLARA|💧\s+LEVE|⚖\s+EQUIL[ÍI]BRADO)/i);
    if (mFT) {
      const fav = mFT[1].trim();
      const vantagem = parseFloat(mFT[2]);
      const faixa = mFT[3].replace(/[👑⚫🟢💧⚖]\s*/g, '').trim();
      palpites[key].palpites.push({
        mercado: 'vencedor_cantos_ft',
        time_favorito: faixa.includes('EQUIL') ? null : fav,
        vantagem,
        forca: faixa,
        coerente,
        reversao,
        raw: 'VencedorFT'
      });
    }
  }
  return Object.values(palpites);
}

// =============================================================================
// PARSER: CISNE NEGRO
// =============================================================================
function parseCisne(txt) {
  const palpites = {};
  // Padrão: "🦢 SELO CISNE NEGRO TimeA vs TimeB Favorito Absoluto: TimeX Vantagem Projetada: +N.NN cantos Nível Matemática: Altíssima"
  const re = /🦢\s+SELO CISNE NEGRO\s+([^\n]+?)\s+vs\s+([^\n]+?)\s+Favorito Absoluto:\s+([^\n]+?)\s+Vantagem Projetada:\s+\+?([\d.]+)\s+cantos\s+N[íi]vel Matem[áa]tica:\s+([^\n(]+?)(?:\s*\(([^)]+)\))?/gi;
  let m;
  while ((m = re.exec(txt)) !== null) {
    const key = m[1].trim() + '|' + m[2].trim();
    palpites[key] = palpites[key] || { mandante: m[1].trim(), visitante: m[2].trim(), palpites: [] };
    palpites[key].palpites.push({
      mercado: 'vencedor_cantos_ft',
      time_favorito: m[3].trim(),
      vantagem: parseFloat(m[4]),
      nivel: m[5].trim(),
      gatilho: m[6] ? m[6].trim() : null,
      forca: 'CISNE_GATILHO',
      raw: 'CisneNegro'
    });
  }
  return Object.values(palpites);
}

// =============================================================================
// MAIN
// =============================================================================
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

let totalJogosUnicos = 0;
let totalPalpites = 0;
const stats = {};

for (const [cod, pastaLiga] of Object.entries(MAP_LIGA_PASTA)) {
  stats[cod] = {};
  for (const sigla of Object.keys(SISTEMAS_PARSE)) {
    const c = cobertura.cobertura[cod][sigla];
    if (!c.existe) { stats[cod][sigla] = { jogos: 0, palpites: 0 }; continue; }
    const arq = path.join(RAIZ, pastaLiga, SUBPASTAS[sigla], c.arq);
    const html = fs.readFileSync(arq, 'utf-8');
    const txt = htmlToText(html);
    const dados = SISTEMAS_PARSE[sigla](txt);
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
    totalJogosUnicos += dados.length;
    totalPalpites += nPalp;
  }
}

fs.writeFileSync(path.join(__dirname, '_auditoria_palpites.json'), JSON.stringify(TODOS, null, 2));

// === RESUMO ===
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('  FASE 2 — PARSER DOS RELATÓRIOS — RESUMO');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('| LIGA   | CISNE        | TEACHER      | ENIGMA       | VENCEDOR     | BALA         |');
console.log('|--------|--------------|--------------|--------------|--------------|--------------|');
for (const cod of Object.keys(MAP_LIGA_PASTA)) {
  const cells = ['CISNE', 'TEACHER', 'ENIGMA', 'VENCEDOR', 'BALA'].map(s => {
    const x = stats[cod][s];
    const j = x.jogos.toString().padStart(2);
    const p = x.palpites.toString().padStart(3);
    return j + 'j ' + p + 'palp ';
  });
  console.log('| ' + cod.padEnd(6) + ' | ' + cells.join(' | ') + ' |');
}
console.log('');
console.log(`Entradas totais (registros liga×sistema): ${TODOS.length}`);
console.log(`Total de palpites parseados: ${totalPalpites}`);
console.log(`💾 Salvo: _auditoria_palpites.json`);
