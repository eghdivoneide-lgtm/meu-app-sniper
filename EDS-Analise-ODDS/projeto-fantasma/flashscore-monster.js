/**
 * FlashScore Monster v4 — Extrator Unitário Ultra Pro
 * EDS Soluções Inteligentes
 *
 * Extrai dados completos de uma partida do FlashScore usando
 * dupla rota: Interceptação de Rede (prioridade) + DOM Parsing (fallback).
 *
 * @module flashscore-monster
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { log } = require('./logger');
const fs = require('fs');

// ═══════════════════════════════════════════════════
//  MAPA DE NOMES DE ESTATÍSTICAS (PT-BR + EN)
// ═══════════════════════════════════════════════════
const STAT_NAMES = {
  cantos:             ['corner kicks', 'corners', 'escanteios', 'cantos'],
  posse:              ['ball possession', 'posse de bola'],
  finalizacoes:       ['total shots', 'goal attempts', 'tentativas de gol', 'finalizações'],
  chutes_alvo:        ['shots on target', 'chutes no alvo', 'chutes ao gol'],
  ataques_perigosos:  ['dangerous attacks', 'ataques perigosos'],
  faltas:             ['fouls', 'faltas'],
  impedimentos:       ['offsides', 'impedimentos', 'fora de jogo'],
  cruzamentos:        ['crosses', 'cruzamentos'],
  cartoes_amarelos:   ['yellow cards', 'cartões amarelos'],
  cartoes_vermelhos:  ['red cards', 'cartões vermelhos'],
  defesas_goleiro:    ['goalkeeper saves', 'defesas do goleiro', 'defesas'],
  tiros_de_meta:      ['goal kicks', 'tiros de meta'],
  laterais:           ['throw-ins', 'arremessos laterais', 'laterais'],
  passes:             ['passes', 'passes completed']
};

/**
 * Encontra o nome padronizado da estatística a partir do texto do FlashScore
 * @param {string} rawName - Nome bruto encontrado no DOM/pacote
 * @returns {string|null} Nome padronizado ou null
 */
function matchStatName(rawName) {
  const lower = rawName.toLowerCase().trim();
  for (const [key, aliases] of Object.entries(STAT_NAMES)) {
    if (aliases.some(a => lower === a || lower.includes(a))) return key;
  }
  return null;
}

/**
 * Parseia pacote exótico do FlashScore (interceptação de rede)
 * Formato: ~SD÷14¬SG÷Corner kicks¬SH÷7¬SI÷8
 *
 * @param {string} textoCru - Texto bruto do pacote de rede
 * @returns {Object} Estatísticas parseadas { cantos: {m,v}, posse: {m,v}, ... }
 */
function parseFlashscoreStats(textoCru) {
  const stats = {};
  const blocos = textoCru.split('~');

  blocos.forEach(bloco => {
    if (!bloco.includes('SG÷')) return;
    const parts = bloco.split('¬');
    let nome = '', m = null, v = null;

    parts.forEach(p => {
      if (p.startsWith('SG÷')) nome = p.replace('SG÷', '');
      if (p.startsWith('SH÷')) m = p.replace('SH÷', '').replace('%', '');
      if (p.startsWith('SI÷')) v = p.replace('SI÷', '').replace('%', '');
    });

    const key = matchStatName(nome);
    if (key && m !== null && v !== null) {
      if (key === 'passes') {
        stats[key] = { m: m, v: v };
      } else {
        stats[key] = { m: parseInt(m) || 0, v: parseInt(v) || 0 };
      }
    }
  });

  return stats;
}

class FlashscoreMonster {
  constructor() {
    this.browser = null;
    this.versao = 'v4';
  }

  /**
   * Inicia o browser com Stealth Plugin
   */
  async iniciar() {
    log('Iniciando FlashScore Monster v4 (Stealth Mode)...', 'info');
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,900']
    });
  }

  async fechar() {
    if (this.browser) await this.browser.close();
  }

  /**
   * Extrai dados completos de uma partida do FlashScore
   *
   * @param {string} url - URL da partida no FlashScore
   * @param {Object} [opcoes] - Opções de extração
   * @param {string} [opcoes.liga] - Nome da liga (ex: "MLS")
   * @param {string} [opcoes.codigo_liga] - Código da liga (ex: "MLS")
   * @returns {Object|null} Dados da partida no schema v4
   */
  async extrairPartida(url, opcoes = {}) {
    const page = await this.browser.newPage();
    const matchId = url.match(/match\/([^/]+)/)?.[1] || '';
    const timestamp = new Date().toISOString();

    // Schema v4 base
    const dados = {
      url,
      match_id: matchId,
      data_partida: '',
      liga: opcoes.liga || '',
      codigo_liga: opcoes.codigo_liga || '',
      rodada: opcoes.rodada || null,
      mandante: '',
      visitante: '',
      placar: { ht: 'Indisponível', ft: 'Indisponível' },
      estatisticas_ft: null,
      estatisticas_ht: null,
      estatisticas_2t: null,
      formacao: { m: 'Desconhecida', v: 'Desconhecida' },
      mercado: null,
      meta: {
        fonte: 'flashscore',
        versao_analista: 'v4',
        timestamp_extracao: timestamp,
        campos_disponiveis: 0,
        campos_falhados: [],
        metodo_extracao: { ft: 'DOM', ht: 'DOM' }
      }
    };

    // Pacotes de rede interceptados
    let networkStatsFT = null;
    let networkStatsHT = null;

    try {
      log(`[Monster v4] Acessando: ${url}`, 'bot');

      // ═══ INTERCEPTADOR DE REDE ═══
      const interceptor = async (response) => {
        try {
          const rurl = response.url();
          if (rurl.includes('feed/df_st_1_') && rurl.includes(matchId)) {
            const txt = await response.text();
            networkStatsFT = parseFlashscoreStats(txt);
            dados.meta.metodo_extracao.ft = 'REDE';
          }
          if (rurl.includes('feed/df_st_2_') && rurl.includes(matchId)) {
            const txt = await response.text();
            networkStatsHT = parseFlashscoreStats(txt);
            dados.meta.metodo_extracao.ht = 'REDE';
          }
        } catch (e) { /* pacote corrompido — ignorar */ }
      };
      page.on('response', interceptor);

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this._delay(4000);

      // ═══ CABEÇALHO: Times, Placar, Data ═══
      const cabecalho = await page.evaluate(() => {
        let mandante = '', visitante = '', placarFT = 'Indisponível', placarHT = 'Indisponível', dataPartida = '';

        // Times
        const hEl = document.querySelector('.duelParticipant__home .participant__participantName');
        const aEl = document.querySelector('.duelParticipant__away .participant__participantName');
        if (hEl) mandante = hEl.innerText.trim();
        if (aEl) visitante = aEl.innerText.trim();

        // Fallback: título da página
        if (!mandante || !visitante) {
          const title = document.title || '';
          if (title.includes('-')) {
            const parts = title.split('-');
            if (!mandante) mandante = parts[0].replace(/[\d\s]+$/, '').trim();
            if (!visitante) visitante = parts[1]?.split(/placar|Live|H2H/)[0].replace(/^[\d\s]+/, '').trim() || '';
          }
        }

        // Placar FT
        const scoreWrapper = document.querySelector('.detailScore__wrapper');
        if (scoreWrapper) {
          const spans = scoreWrapper.querySelectorAll('span');
          if (spans.length >= 3) {
            placarFT = spans[0].textContent.trim() + ' - ' + spans[2].textContent.trim();
          }
        }

        // Placar HT — buscar no detailScore__halfTime ou innerText
        const htEl = document.querySelector('.smh__part--current, .detailScore__halfTime');
        if (htEl) {
          const htText = htEl.innerText.replace(/[()]/g, '').trim();
          if (htText.includes('-')) placarHT = htText;
        }
        if (placarHT === 'Indisponível') {
          const lines = document.body.innerText.split('\n').map(l => l.trim());
          for (let i = 0; i < lines.length; i++) {
            if ((lines[i] === '1ST HALF' || lines[i] === '1º TEMPO') && lines[i + 1]?.includes('-')) {
              placarHT = lines[i + 1]; break;
            }
          }
        }

        // Data real da partida
        const dateEl = document.querySelector('.duelParticipant__startTime, .startTime');
        if (dateEl) dataPartida = dateEl.innerText.trim();
        if (!dataPartida) {
          const lines = document.body.innerText.split('\n').map(l => l.trim());
          for (const line of lines) {
            if (/^\d{2}\.\d{2}\.\d{4}/.test(line) || /^\d{2}\/\d{2}\/\d{4}/.test(line)) {
              dataPartida = line.split(' ')[0]; break;
            }
          }
        }

        return { mandante, visitante, placarFT, placarHT, dataPartida };
      });

      dados.mandante = cabecalho.mandante;
      dados.visitante = cabecalho.visitante;
      dados.placar = { ht: cabecalho.placarHT, ft: cabecalho.placarFT };
      dados.data_partida = cabecalho.dataPartida || new Date().toLocaleDateString('pt-BR');

      // ═══ ESTATÍSTICAS FT (2º tempo — tela padrão do FlashScore) ═══
      log('Buscando estatísticas FT...', 'info');
      await this._clickTab(page, 'ESTATÍSTICAS', 'STATS');

      // Aguardar stats renderizarem no DOM (max 15s)
      let domReady = false;
      for (let w = 0; w < 30 && !domReady; w++) {
        domReady = await page.evaluate(() => {
          const t = document.body.innerText.toLowerCase();
          return t.includes('corner kicks') || t.includes('escanteios');
        });
        if (!domReady) await this._delay(500);
      }

      const domStatsFT = await page.evaluate(this._extractStatsFromDOM);
      dados.estatisticas_ft = Object.keys(domStatsFT || {}).length > 0 ? domStatsFT : null;

      // ═══ ESTATÍSTICAS HT ═══
      log('Buscando estatísticas HT...', 'info');
      await this._clickTab(page, '1ST HALF', '1º TEMPO');
      await this._delay(4000);

      const domStatsHT = await page.evaluate(this._extractStatsFromDOM);
      dados.estatisticas_ht = Object.keys(domStatsHT || {}).length > 0 ? domStatsHT : null;

      // ═══ TOTAL DA PARTIDA (HT + FT = dados gerais) ═══
      dados.estatisticas_2t = this._somarTempos(dados.estatisticas_ht, dados.estatisticas_ft);
      dados.meta.metodo_extracao.ft = 'DOM';
      dados.meta.metodo_extracao.ht = 'DOM';

      // ═══ FORMAÇÕES TÁTICAS ═══
      log('Buscando formações táticas...', 'info');
      await this._clickTab(page, 'ESCALAÇÕES', 'LINEUPS');
      await this._delay(3000);
      dados.formacao = await page.evaluate(() => {
        const lines = document.body.innerText.split('\n').map(l => l.trim());
        const forms = [];
        for (const line of lines) {
          const clean = line.replace(/\s/g, '');
          // Aceitar formatos: 4-2-3-1, 4231, 4-4-2
          if (/^[0-9]+-[0-9]+(-[0-9]+)*$/.test(clean) && clean.length >= 5) {
            forms.push(clean);
          } else if (/^[3-5][0-9]{2,4}$/.test(clean) && clean.length >= 3) {
            // Formato sem hífens: "4231" → "4-2-3-1"
            forms.push(clean.split('').join('-'));
          }
        }
        return { m: forms[0] || 'Desconhecida', v: forms[1] || forms[0] || 'Desconhecida' };
      });

      // ═══ ODDS / MERCADO ═══
      log('Buscando odds pré-jogo...', 'info');
      await this._clickTab(page, 'ODDS', 'ODDS');
      await this._delay(3000);
      const mercado = await page.evaluate(() => {
        const lines = document.body.innerText.split('\n').map(l => l.trim());
        let odds1x2 = null;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] === '1' && lines[i + 1] === 'X' && lines[i + 2] === '2') {
            // Buscar primeiros 3 valores numéricos após "1 X 2"
            const vals = [];
            for (let j = i + 3; j < Math.min(i + 20, lines.length) && vals.length < 3; j++) {
              const n = parseFloat(lines[j]);
              if (!isNaN(n) && n > 1 && n < 100) vals.push(lines[j]);
            }
            if (vals.length === 3) {
              odds1x2 = { oddM: vals[0], oddEmpate: vals[1], oddV: vals[2] };
              break;
            }
          }
        }
        return odds1x2;
      });
      dados.mercado = mercado || { oddM: 'Oculta', oddEmpate: 'Oculta', oddV: 'Oculta' };

      // ═══ METADADOS DE QUALIDADE ═══
      const camposPresentes = this._contarCampos(dados);
      dados.meta.campos_disponiveis = camposPresentes.total;
      dados.meta.campos_falhados = camposPresentes.falhados;

      // Limpar interceptor
      page.off('response', interceptor);

      log(`[${dados.mandante} vs ${dados.visitante}] Extração completa (${camposPresentes.total} campos)`, 'success');
      return dados;

    } catch (err) {
      log(`Erro ao extrair ${url}: ${err.message}`, 'error');
      dados.meta.campos_falhados.push('ERRO_GERAL: ' + err.message);
      return dados;
    } finally {
      await page.close();
    }
  }

  // ═══════════════════════════════════════════════════
  //  MÉTODOS AUXILIARES
  // ═══════════════════════════════════════════════════

  /**
   * Extrai estatísticas do DOM usando innerText (fallback)
   * Executado dentro do page.evaluate()
   */
  _extractStatsFromDOM() {
    const STAT_MAP = {
      'corner kicks': 'cantos', 'corners': 'cantos', 'escanteios': 'cantos', 'cantos': 'cantos',
      'ball possession': 'posse', 'posse de bola': 'posse',
      'total shots': 'finalizacoes', 'goal attempts': 'finalizacoes', 'tentativas de gol': 'finalizacoes',
      'shots on target': 'chutes_alvo', 'chutes no alvo': 'chutes_alvo', 'chutes ao gol': 'chutes_alvo',
      'dangerous attacks': 'ataques_perigosos', 'ataques perigosos': 'ataques_perigosos',
      'fouls': 'faltas', 'faltas': 'faltas',
      'offsides': 'impedimentos', 'impedimentos': 'impedimentos', 'fora de jogo': 'impedimentos',
      'crosses': 'cruzamentos', 'cruzamentos': 'cruzamentos',
      'yellow cards': 'cartoes_amarelos', 'cartões amarelos': 'cartoes_amarelos',
      'red cards': 'cartoes_vermelhos', 'cartões vermelhos': 'cartoes_vermelhos',
      'goalkeeper saves': 'defesas_goleiro', 'defesas do goleiro': 'defesas_goleiro', 'defesas': 'defesas_goleiro',
      'goal kicks': 'tiros_de_meta', 'tiros de meta': 'tiros_de_meta',
      'throw-ins': 'laterais', 'arremessos laterais': 'laterais', 'laterais': 'laterais',
      'passes': 'passes'
    };

    const result = {};
    const lines = document.body.innerText.split('\n').map(l => l.trim());

    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      const key = STAT_MAP[lower];
      if (key && i > 0 && i < lines.length - 1) {
        const valM = lines[i - 1];
        const valV = lines[i + 1];
        if (key === 'passes') {
          result[key] = { m: valM, v: valV };
        } else {
          const m = parseInt(valM);
          const v = parseInt(valV);
          if (!isNaN(m) && !isNaN(v)) {
            result[key] = { m, v };
          }
        }
      }
    }

    // Tentar seletores CSS como segunda opção
    if (!result.cantos) {
      const rows = document.querySelectorAll('.stat__category, [class*="stat__row"]');
      rows.forEach(row => {
        const nameEl = row.querySelector('.stat__categoryName, [class*="categoryName"]');
        const homeEl = row.querySelector('.stat__homeValue, [class*="homeValue"]');
        const awayEl = row.querySelector('.stat__awayValue, [class*="awayValue"]');
        if (nameEl && homeEl && awayEl) {
          const name = nameEl.innerText.trim().toLowerCase();
          const cssKey = STAT_MAP[name];
          if (cssKey && !result[cssKey]) {
            if (cssKey === 'passes') {
              result[cssKey] = { m: homeEl.innerText.trim(), v: awayEl.innerText.trim() };
            } else {
              result[cssKey] = {
                m: parseInt(homeEl.innerText.replace('%', '')) || 0,
                v: parseInt(awayEl.innerText.replace('%', '')) || 0
              };
            }
          }
        }
      });
    }

    return result;
  }

  /**
   * Mescla estatísticas da rede e do DOM. Rede tem prioridade.
   * @param {Object|null} rede - Stats da interceptação de rede
   * @param {Object|null} dom - Stats do DOM parsing
   * @returns {Object} Stats mescladas
   */
  _mergeStats(rede, dom) {
    const merged = {};
    const allKeys = new Set([...Object.keys(rede || {}), ...Object.keys(dom || {})]);

    for (const key of allKeys) {
      if (rede && rede[key] !== undefined) {
        merged[key] = rede[key];
      } else if (dom && dom[key] !== undefined) {
        merged[key] = dom[key];
      }
    }

    return Object.keys(merged).length > 0 ? merged : null;
  }

  /**
   * Soma estatísticas de dois tempos para gerar o total FT.
   * Stats aditivas (cantos, chutes, faltas...): soma direta.
   * Stats não-aditivas (posse): média arredondada.
   * Stats texto (passes): usa o valor mais completo.
   *
   * @param {Object|null} ht - Estatísticas do 1º tempo
   * @param {Object|null} t2 - Estatísticas do 2º tempo
   * @returns {Object|null} Estatísticas FT totais
   */
  _somarTempos(ht, t2) {
    if (!ht && !t2) return null;
    if (!ht) return t2;
    if (!t2) return ht;

    const result = {};
    const allKeys = new Set([...Object.keys(ht), ...Object.keys(t2)]);
    const naoAditivas = ['posse'];
    const textuais = ['passes'];

    for (const key of allKeys) {
      const valHT = ht[key];
      const val2T = t2[key];

      if (textuais.includes(key)) {
        // Passes: manter o texto (não somável)
        result[key] = val2T || valHT;
      } else if (naoAditivas.includes(key)) {
        // Posse: média dos dois tempos
        if (valHT && val2T) {
          result[key] = {
            m: Math.round(((valHT.m || 0) + (val2T.m || 0)) / 2),
            v: Math.round(((valHT.v || 0) + (val2T.v || 0)) / 2)
          };
        } else {
          result[key] = valHT || val2T;
        }
      } else {
        // Stats aditivas: soma direta
        if (valHT && val2T && typeof valHT.m === 'number' && typeof val2T.m === 'number') {
          result[key] = { m: valHT.m + val2T.m, v: valHT.v + val2T.v };
        } else {
          result[key] = valHT || val2T;
        }
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Conta campos disponíveis e falhados
   */
  _contarCampos(dados) {
    const esperados = ['cantos', 'posse', 'finalizacoes', 'chutes_alvo', 'ataques_perigosos',
                       'faltas', 'impedimentos', 'cruzamentos', 'cartoes_amarelos', 'cartoes_vermelhos',
                       'defesas_goleiro', 'tiros_de_meta', 'laterais', 'passes'];
    let total = 0;
    const falhados = [];

    // Checar FT
    for (const campo of esperados) {
      if (dados.estatisticas_ft && dados.estatisticas_ft[campo]) total++;
      else falhados.push(campo + '_ft');
    }
    // Checar HT
    for (const campo of esperados) {
      if (dados.estatisticas_ht && dados.estatisticas_ht[campo]) total++;
      else falhados.push(campo + '_ht');
    }

    // Outros
    if (dados.formacao.m !== 'Desconhecida') total++; else falhados.push('formacao_m');
    if (dados.formacao.v !== 'Desconhecida') total++; else falhados.push('formacao_v');
    if (dados.mercado && dados.mercado.oddM !== 'Oculta') total++; else falhados.push('odds');
    if (dados.data_partida) total++; else falhados.push('data_partida');

    return { total, falhados };
  }

  /**
   * Clica em uma aba do FlashScore
   */
  async _clickTab(page, text1, text2) {
    const clicked = await page.evaluate((s1, s2) => {
      // Buscar elemento clicável cujo texto CONTÉM (não apenas igual) o texto alvo
      // Priorizar elementos menores (mais específicos)
      const els = Array.from(document.querySelectorAll('button, a, div, span, li'))
        .filter(el => {
          const t = (el.innerText || '').toUpperCase().trim();
          return t === s1 || t === s2;
        })
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);

      if (els.length > 0) { els[0].click(); return true; }
      return false;
    }, text1, text2);
    if (!clicked) log(`Aba "${text1}/${text2}" não encontrada no DOM`, 'warn');
    await this._delay(2000);
  }

  _delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

// ═══ CLI STANDALONE ═══
if (require.main === module) {
  (async () => {
    const fantasma = new FlashscoreMonster();
    await fantasma.iniciar();
    const urlTeste = process.argv[2] || 'https://www.flashscore.com/match/GERgS3xS/#/match-summary';
    const dados = await fantasma.extrairPartida(urlTeste, { liga: 'MLS', codigo_liga: 'MLS' });
    console.log('\n══════ RESULTADO DA EXTRAÇÃO v4 ══════');
    console.log(JSON.stringify(dados, null, 2));
    console.log('══════════════════════════════════════\n');
    fs.writeFileSync('output-test-v4.json', JSON.stringify([dados], null, 2));
    await fantasma.fechar();
  })();
}

module.exports = FlashscoreMonster;
