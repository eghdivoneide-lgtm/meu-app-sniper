// ════════════════════════════════════════════════════════════════════
// ANALISTA SENIOR EDS — App principal (browser)
//
// - Detecta jogos não jogados (rodada=null OU data futura) nas ligas
// - Permite input manual de jogos
// - Chama MotorCalibrado.analisarJogo para cada um
// - Renderiza cards com R1-R8 EDS visíveis
// ════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Mapeia ligas aprovadas com seus dados globais
  // window.LIGAS_DATA é populado abaixo a partir dos window.DADOS_<X>
  window.LIGAS_DATA = {
    BR:    window.DADOS_BR,
    BR_B:  window.DADOS_BR_B,
    MLS:   window.DADOS_MLS,
    USL:   window.DADOS_USL,
    ARG:   window.DADOS_ARG,
    ARG_B: window.DADOS_ARG_B
  };

  // Status por liga (vem da auditoria — futuramente carregado dinamicamente)
  const STATUS_LIGA = {
    ARG:   { status: 'APROVADA', taxaUnder: 67, n: 46 },
    ARG_B: { status: 'APROVADA', taxaUnder: 65, n: 57 },
    MLS:   { status: 'APROVADA', taxaUnder: 62, n: 39 },
    BR:    { status: 'PROMISSORA', taxaUnder: 100, n: 9 },
    BR_B:  { status: 'INSUFICIENTE', taxaUnder: 29, n: 7 },
    USL:   { status: 'INSUFICIENTE', taxaUnder: 0, n: 1 }
  };

  const NOME_LIGA = {
    BR:    'Brasileirão Série A',
    BR_B:  'Brasileirão Série B',
    MLS:   'MLS',
    USL:   'USL Championship',
    ARG:   'Liga Profesional (ARG)',
    ARG_B: 'Primera B Nacional (ARG)'
  };

  // ── Util: detecta jogos não jogados (rodada=null OU data futura sem placar)
  function jogosNaoJogados(ligaCod) {
    const d = window.LIGAS_DATA[ligaCod];
    if (!d || !d.jogos) return [];
    const hoje = new Date().toISOString().slice(0, 10);
    return d.jogos.filter(j => {
      const semPlacar = !j.estatisticas_ft || !j.estatisticas_ft.cantos;
      const semRodada = j.rodada === null || j.rodada === undefined;
      return semPlacar || semRodada;
    });
  }

  // ── Renderização
  function renderCard(res) {
    if (res.erro) return `<div class="card erro">❌ ${res.erro}</div>`;

    const cardCor = (v) => v.cor === 'green' ? 'card-green' : v.cor === 'yellow' ? 'card-yellow' : 'card-red';
    const corPrioritario = res.under.veredicto.cor === 'green' ? 'card-green'
                          : res.over.veredicto.cor === 'green' ? 'card-green'
                          : res.under.veredicto.cor === 'yellow' || res.over.veredicto.cor === 'yellow' ? 'card-yellow'
                          : 'card-red';

    return `
    <article class="card ${corPrioritario}">
      <header class="card-head">
        <span class="liga-tag">${res.liga}</span>
        <h3>${res.mandante} <small>vs</small> ${res.visitante}</h3>
      </header>

      <div class="markets">
        <div class="market ${cardCor(res.under.veredicto)}">
          <div class="m-tag">UNDER ${res.under.linha}</div>
          <div class="m-prob">${res.under.prob}%</div>
          <div class="m-verd">${res.under.veredicto.emoji} ${res.under.veredicto.tag}</div>
          <div class="m-motivo">${res.under.veredicto.motivo}</div>
        </div>
        <div class="market ${cardCor(res.over.veredicto)}">
          <div class="m-tag">OVER ${res.over.linha}</div>
          <div class="m-prob">${res.over.prob}%</div>
          <div class="m-verd">${res.over.veredicto.emoji} ${res.over.veredicto.tag}</div>
          <div class="m-motivo">${res.over.veredicto.motivo}</div>
        </div>
      </div>

      <details class="evidencias">
        <summary>Evidências (clique para abrir)</summary>
        <table>
          <thead><tr><th>Evidência</th><th>UNDER score</th><th>OVER score</th><th>n</th></tr></thead>
          <tbody>
            ${res.under.evidencias.map((e, i) => `
              <tr>
                <td>${e.nome} (peso ${e.peso})</td>
                <td>${e.score}%</td>
                <td>${res.over.evidencias[i] ? res.over.evidencias[i].score + '%' : '—'}</td>
                <td>${e.n}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </details>

      <footer class="checagem-eds">
        <strong>Checagem EDS:</strong>
        fonte=data/<i>${res.liga.toLowerCase()}2026.js</i> ·
        amostra mandante casa = ${res.stats.mandanteCasa.n} (média ${res.stats.mandanteCasa.media}) ·
        visitante fora = ${res.stats.visitanteFora.n} (média ${res.stats.visitanteFora.media}) ·
        liga média ${res.stats.mediaLiga} (DP ${res.stats.dpLiga}, n=${res.stats.n_liga})
      </footer>
    </article>
    `;
  }

  // ── Popular lista de jogos da liga
  function popularJogos(ligaCod) {
    const lista = document.getElementById('lista-jogos');
    lista.innerHTML = '';
    const jogos = jogosNaoJogados(ligaCod);
    if (jogos.length === 0) {
      lista.innerHTML = `<p class="info">Nenhum jogo "não jogado" detectado para ${NOME_LIGA[ligaCod]}. Use o input manual abaixo.</p>`;
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'jogos-lista';
    for (const j of jogos.slice(0, 25)) {
      const li = document.createElement('li');
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="checkbox" class="check-jogo" data-mandante="${j.mandante}" data-visitante="${j.visitante}" checked>
        <span>${j.mandante} <em>vs</em> ${j.visitante}</span>
        <small class="data-jogo">${j.data || 'data não definida'}</small>
      `;
      li.appendChild(label);
      ul.appendChild(li);
    }
    lista.appendChild(ul);
    if (jogos.length > 25) {
      const aviso = document.createElement('p');
      aviso.className = 'info';
      aviso.textContent = `Mostrando primeiros 25 de ${jogos.length} jogos detectados.`;
      lista.appendChild(aviso);
    }
  }

  // ── Analisa selecionados (ou manuais)
  function analisarSelecionados() {
    const ligaCod = document.getElementById('seletor-liga').value;
    const checks = document.querySelectorAll('.check-jogo:checked');
    const jogos = [...checks].map(c => ({
      mandante:  c.dataset.mandante,
      visitante: c.dataset.visitante
    }));

    // Adiciona manuais (textarea)
    const manuais = document.getElementById('input-manual').value.trim();
    if (manuais) {
      for (const linha of manuais.split('\n')) {
        const [m, v] = linha.split(/\s+(?:vs|x|×|VS|X)\s+/i).map(s => s && s.trim());
        if (m && v) jogos.push({ mandante: m, visitante: v });
      }
    }

    if (jogos.length === 0) {
      alert('Selecione ao menos 1 jogo (ou cole no input manual).');
      return;
    }

    const resultados = jogos.map(j => window.MotorCalibrado.analisarJogo(ligaCod, j.mandante, j.visitante));
    const html = resultados.map(renderCard).join('');
    document.getElementById('resultado').innerHTML = html;
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
  }

  // ── Render do status banner (qual liga é confiável)
  function renderStatusLiga(ligaCod) {
    const s = STATUS_LIGA[ligaCod];
    const banner = document.getElementById('status-liga');
    if (!s) { banner.innerHTML = ''; return; }
    const cor = s.status === 'APROVADA' ? 'green'
              : s.status === 'PROMISSORA' ? 'yellow'
              : 'red';
    const cal = window.LINHAS_CALIBRADAS.ligas[ligaCod];
    const linhaU = cal ? cal.linha_under_calibrada : '?';
    const linhaO = cal ? cal.linha_over_calibrada : '?';
    banner.className = 'status-banner ' + cor;
    banner.innerHTML = `
      <strong>${NOME_LIGA[ligaCod]} (${ligaCod}):</strong>
      Status auditoria UNDER ${linhaU} = <b>${s.status}</b> (taxa ${s.taxaUnder}%, amostra n=${s.n}).
      Linhas calibradas: <b>Under ${linhaU}</b> · <b>Over ${linhaO}</b>.
    `;
  }

  // ── Init
  document.addEventListener('DOMContentLoaded', () => {
    const seletor = document.getElementById('seletor-liga');
    seletor.addEventListener('change', () => {
      renderStatusLiga(seletor.value);
      popularJogos(seletor.value);
    });
    renderStatusLiga(seletor.value);
    popularJogos(seletor.value);
    document.getElementById('btn-analisar').addEventListener('click', analisarSelecionados);
  });
})();
