// EDS-HDP-Pro · App (render das 5 telas)
// Consome window.HDP_MOTOR (em js/motor.js) e window.HDP_BANCO/HDP_RANKINGS (em data/_banco.js)

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  //  ESTADO
  // ═══════════════════════════════════════════════════════════
  let LIGA_ATUAL = localStorage.getItem('hdppro_liga_atual') || 'BR';
  let RANKING_PERIODO = localStorage.getItem('hdppro_ranking_periodo') || 'ft';
  let PROXIMOS_JOGOS = []; // confrontos colados pelo usuário (parseados)
  let PROXIMOS_ABA = 'vencedor';

  const LIGA_NOMES = {
    'BR':    '🇧🇷 Brasileirão A',
    'BR_B':  '🇧🇷 Brasileirão B',
    'ARG':   '🇦🇷 Liga Profesional',
    'ARG_B': '🇦🇷 Primera B Nacional',
    'MLS':   '🇺🇸 Major League Soccer',
    'USL':   '🇺🇸 USL Championship'
  };

  function fmt(n, c)  { return (n == null || isNaN(n)) ? '—' : (+n).toFixed(c == null ? 2 : c); }
  function pct(p, c)  { return (p == null || isNaN(p)) ? '—' : (+p * 100).toFixed(c == null ? 1 : c) + '%'; }
  function esc(s)     { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  // ═══════════════════════════════════════════════════════════
  //  NAV (já existe no index.html — só faço o re-render ao trocar view)
  // ═══════════════════════════════════════════════════════════
  const VIEW_TO_GRUPO = {
    'dashboard':'visao','ranking':'visao','time':'visao',
    'proximos':'analise','tracker':'operacao','backtest':'auditoria'
  };
  const SUBNAV_BY_GRUPO = {
    visao: [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'ranking',   label: '🏆 Ranking Times' },
      { id: 'time',      label: '👕 Por Time' }
    ],
    analise:   [{ id: 'proximos', label: '🎯 Próximos Jogos' }],
    operacao:  [{ id: 'tracker',  label: '📈 Bet Tracker' }],
    auditoria: [{ id: 'backtest', label: '🔍 Backtest' }]
  };

  function _renderSubNav(grupo, viewAtiva) {
    const sub = document.getElementById('nav-subnav');
    const itens = SUBNAV_BY_GRUPO[grupo] || [];
    sub.innerHTML = itens.map(it =>
      `<button id="btn-${it.id}" class="${it.id === viewAtiva ? 'active' : ''}" onclick="showView('${it.id}')">${it.label}</button>`
    ).join('');
  }
  function _atualizarTabsGrupo(grupoAtivo, viewAtiva) {
    const grupoDaView = VIEW_TO_GRUPO[viewAtiva];
    document.querySelectorAll('.tab-grupo').forEach(b => {
      const g = b.dataset.grupo;
      b.classList.toggle('active', g === grupoAtivo);
      b.classList.toggle('has-active', g === grupoDaView && g !== grupoAtivo);
    });
  }
  function setNavGrupo(grupo) {
    const viewAtual = (document.querySelector('.view.active')?.id || '').replace('view-', '');
    const grupoAtual = VIEW_TO_GRUPO[viewAtual];
    if (grupoAtual === grupo) return;
    const primeira = (SUBNAV_BY_GRUPO[grupo] || [])[0];
    if (primeira) showView(primeira.id);
  }
  function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + id);
    if (target) target.classList.add('active');
    const grupo = VIEW_TO_GRUPO[id] || 'visao';
    _renderSubNav(grupo, id);
    _atualizarTabsGrupo(grupo, id);
    // Re-render por view
    if (id === 'dashboard') renderDashboard();
    if (id === 'ranking')   renderRanking();
    if (id === 'time')      renderTime();
    if (id === 'proximos')  renderProximos();
    if (id === 'tracker')   renderTracker();
    if (id === 'backtest')  renderBacktest();
  }

  // ═══════════════════════════════════════════════════════════
  //  TROCAR LIGA
  // ═══════════════════════════════════════════════════════════
  function trocarLiga(liga) {
    LIGA_ATUAL = liga;
    localStorage.setItem('hdppro_liga_atual', liga);
    document.getElementById('dash-liga-nome').textContent = LIGA_NOMES[liga];
    document.getElementById('rank-liga-nome').textContent = LIGA_NOMES[liga];
    PROXIMOS_JOGOS = []; // limpa rodada ao trocar de liga
    // Re-render da view ativa
    const viewAtiva = (document.querySelector('.view.active')?.id || '').replace('view-', '');
    if (viewAtiva === 'dashboard') renderDashboard();
    else if (viewAtiva === 'ranking') renderRanking();
    else if (viewAtiva === 'time') renderTime();
    else if (viewAtiva === 'proximos') renderProximos();
  }

  // ═══════════════════════════════════════════════════════════
  //  TELA 1 · DASHBOARD
  // ═══════════════════════════════════════════════════════════
  function renderDashboard() {
    const s = HDP_MOTOR.statsLiga(LIGA_ATUAL);
    if (!s) return;
    const ctr = document.getElementById('cards-dashboard');
    ctr.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Jogos Registrados</div>
        <div class="stat-value">${s.jogos_n}</div>
        <div class="stat-hint">${s.n_ricos} com cantos completos</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Diff Média FT</div>
        <div class="stat-value" style="color:var(--blue2)">${fmt(s.diff_media_ft)}</div>
        <div class="stat-hint">cantos absolutos por jogo · X liga = ${HDP_MOTOR.X_POR_LIGA[LIGA_ATUAL]}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">% Jogos Dominados</div>
        <div class="stat-value" style="color:var(--gold)">${fmt(s.pct_dominados, 1)}%</div>
        <div class="stat-hint">com diff ≥ 3 cantos (mercado HDP forte)</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Times com Base</div>
        <div class="stat-value" style="color:var(--purple)">${s.times_com_base}<span style="color:var(--muted);font-size:1rem;font-weight:600">/${s.times_total}</span></div>
        <div class="stat-hint">≥ 3 jogos por lado · confiabilidade</div>
      </div>
    `;

    // #8 — Cards SNIPER e Top ELITE da rodada (se houver jogos colados em PROXIMOS_JOGOS)
    if (PROXIMOS_JOGOS.length > 0) {
      const avaliados = PROXIMOS_JOGOS
        .map(c => HDP_MOTOR.avaliarElite(LIGA_ATUAL, c.m, c.v))
        .filter(Boolean);
      const snipers = avaliados.filter(a => a.snipe).sort((a,b)=>b.razao-a.razao);
      const elites  = avaliados.filter(a => a.passa && !a.snipe).sort((a,b)=>b.razao-a.razao).slice(0, 3);

      // BLOCO SNIPER (com destaque dourado animado)
      if (snipers.length > 0) {
        const ctrS = document.createElement('div');
        ctrS.className = 'sniper-card';
        ctrS.style.cssText = 'grid-column:1/-1;border:1px solid var(--gold);border-radius:14px;padding:1.3rem;margin-top:.5rem';
        ctrS.innerHTML = `
          <div style="font-size:.85rem;color:var(--gold);text-transform:uppercase;font-weight:900;letter-spacing:1px;margin-bottom:1rem">🎯 SNIPER PICKS DA RODADA — ${snipers.length} jogo${snipers.length>1?'s':''} de altíssima confiança</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:.8rem">
            ${snipers.map((a, i) => {
              const h = a.hdpFT[a.linhaFT_rec];
              return `<div style="background:rgba(10,31,26,0.7);border:1px solid var(--gold);border-radius:10px;padding:.9rem;backdrop-filter:blur(4px)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
                  <div style="font-size:.7rem;color:var(--gold);font-weight:900;letter-spacing:.5px">🎯 SNIPER #${i+1}</div>
                  <div style="font-size:.65rem;color:var(--muted)">razão ${a.razao} · WIN ${pct(a.prob_linha_rec,1)}</div>
                </div>
                <div style="font-weight:800;font-size:.92rem;color:var(--text)">${esc(a.M)} × ${esc(a.V)}</div>
                <div style="font-size:.78rem;color:var(--text);margin-top:.6rem;background:rgba(251,191,36,0.10);border-radius:6px;padding:.4rem .6rem;border:1px solid rgba(251,191,36,0.3)">
                  🎯 <strong style="color:var(--gold)">${esc(a.favorito)} ${a.linhaFT_rec}</strong> · odd justa ${fmt(h.oddJusta)}
                </div>
              </div>`;
            }).join('')}
          </div>
        `;
        ctr.appendChild(ctrS);
      }

      // BLOCO TOP ELITE (somente os que NÃO são Sniper, top 3)
      if (elites.length > 0) {
        const ctrElite = document.createElement('div');
        ctrElite.style.cssText = 'grid-column:1/-1;background:linear-gradient(135deg,rgba(251,191,36,0.10),rgba(245,158,11,0.04));border:1px solid var(--gold);border-radius:12px;padding:1.2rem;margin-top:.5rem';
        ctrElite.innerHTML = `
          <div style="font-size:.78rem;color:var(--gold);text-transform:uppercase;font-weight:800;margin-bottom:.8rem">🥇 Top ${elites.length} ELITE da rodada — ordenado por razão diff/X</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.8rem">
            ${elites.map((a, i) => {
              const corT = a.tier === 'ELITE_NUCLEAR' ? 'var(--red)' : a.tier === 'ELITE_FORTE' ? 'var(--gold)' : 'var(--green)';
              return `<div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid ${corT};border-radius:8px;padding:.8rem">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
                  <div style="font-size:.7rem;color:${corT};font-weight:900">#${i+1} ${a.tier.replace('_',' ')}</div>
                  <div style="font-size:.65rem;color:var(--muted)">razão ${a.razao}</div>
                </div>
                <div style="font-weight:800;font-size:.88rem">${esc(a.M)} × ${esc(a.V)}</div>
                <div style="font-size:.72rem;color:var(--text);margin-top:.4rem">🎯 <strong style="color:var(--blue2)">${esc(a.favorito)} ${a.linhaFT_rec}</strong> · WIN ${pct(a.hdpFT[a.linhaFT_rec].win,1)} · odd ${fmt(a.hdpFT[a.linhaFT_rec].oddJusta)}</div>
              </div>`;
            }).join('')}
          </div>
        `;
        ctr.appendChild(ctrElite);
      }
    }

    const ultimos = HDP_MOTOR.ultimosJogos(LIGA_ATUAL, 10);
    const ult = document.getElementById('ultimos-jogos');
    if (!ultimos.length) {
      ult.innerHTML = `<div class="empty"><div class="eicon">📭</div><strong>Sem jogos</strong><p>Banco vazio nesta liga.</p></div>`;
    } else {
      ult.innerHTML = `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden">
          <table style="width:100%;border-collapse:collapse;font-size:.82rem">
            <thead>
              <tr style="background:var(--bg3);text-align:left">
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Data</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Mandante</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Visitante</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Cantos HT</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Cantos FT</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Diff</th>
              </tr>
            </thead>
            <tbody>
              ${ultimos.map(j => {
                const c = j.estatisticas_ft.cantos;
                const ch = j.estatisticas_ht && j.estatisticas_ht.cantos;
                const diff = c.m - c.v;
                const diffC = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--blue2)' : 'var(--muted)';
                return `<tr style="border-top:1px solid var(--border)">
                  <td style="padding:.7rem 1rem;color:var(--muted)">${esc(j.data_partida || '—').substring(0,10)}</td>
                  <td style="padding:.7rem 1rem;font-weight:600">${esc(j.mandante)}</td>
                  <td style="padding:.7rem 1rem;font-weight:600">${esc(j.visitante)}</td>
                  <td style="padding:.7rem 1rem;text-align:center">${ch ? ch.m+' - '+ch.v : '—'}</td>
                  <td style="padding:.7rem 1rem;text-align:center;font-weight:700">${c.m} - ${c.v}</td>
                  <td style="padding:.7rem 1rem;text-align:center;color:${diffC};font-weight:700">${diff>=0?'+':''}${diff}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  TELA 2 · RANKING
  // ═══════════════════════════════════════════════════════════
  function renderRanking() {
    const ctr = document.getElementById('view-ranking');
    const r = HDP_MOTOR.getRanking(LIGA_ATUAL);
    if (!r) {
      ctr.innerHTML = `<div class="empty"><div class="eicon">📭</div><strong>Ranking não disponível</strong></div>`;
      return;
    }

    const toggleBtn = (p) => `<button onclick="setRankingPeriodo('${p}')" style="background:${RANKING_PERIODO===p?'linear-gradient(135deg,var(--green),var(--blue))':'var(--bg3)'};color:${RANKING_PERIODO===p?'#0a1f1a':'var(--muted)'};border:1px solid ${RANKING_PERIODO===p?'var(--green)':'var(--border)'};padding:.5rem 1.2rem;border-radius:8px;font-weight:800;font-size:.82rem;cursor:pointer">${p.toUpperCase()}</button>`;

    const top = (criterio, periodo, cor) => {
      const lista = HDP_MOTOR.topN(LIGA_ATUAL, criterio, periodo, 10);
      if (!lista.length) return `<tr><td colspan="3" style="padding:1rem;text-align:center;color:var(--muted)">Sem times com base mínima</td></tr>`;
      return lista.map((t, i) => `<tr style="border-top:1px solid var(--border)">
        <td style="padding:.55rem 1rem;color:${i<3?'var(--gold)':'var(--muted)'};font-weight:800;width:30px">#${i+1}</td>
        <td style="padding:.55rem 1rem;font-weight:600">${esc(t.time)}</td>
        <td style="padding:.55rem 1rem;text-align:right;color:${cor};font-weight:800">${fmt(t.valor)} <span style="color:var(--muted);font-weight:500;font-size:.75rem">(n=${t.n})</span></td>
      </tr>`).join('');
    };

    const rankCard = (titulo, criterio, cor, icone) => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden">
        <div style="padding:.9rem 1.2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div style="font-weight:800;font-size:.92rem;color:${cor}">${icone} ${titulo}</div>
          <div style="font-size:.7rem;color:var(--muted)">Top 10</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.85rem">${top(criterio, RANKING_PERIODO, cor)}</table>
      </div>
    `;

    // #7 — Tabela de SALDO (atk - conc) por lado
    const topSaldoHtml = (lado) => {
      const lista = HDP_MOTOR.topSaldo(LIGA_ATUAL, lado, RANKING_PERIODO, 10);
      if (!lista.length) return `<tr><td colspan="4" style="padding:1rem;text-align:center;color:var(--muted)">sem dados</td></tr>`;
      return lista.map((t, i) => {
        const corSaldo = t.saldo > 0 ? 'var(--green)' : t.saldo < 0 ? 'var(--red)' : 'var(--muted)';
        return `<tr style="border-top:1px solid var(--border)">
          <td style="padding:.5rem .9rem;color:${i<3?'var(--gold)':'var(--muted)'};font-weight:800;width:28px">#${i+1}</td>
          <td style="padding:.5rem .9rem;font-weight:600">${esc(t.time)}</td>
          <td style="padding:.5rem .9rem;text-align:right;font-size:.75rem;color:var(--muted)">${fmt(t.pro)}<span style="color:var(--text)"> − </span>${fmt(t.contra)}</td>
          <td style="padding:.5rem .9rem;text-align:right;color:${corSaldo};font-weight:900;font-size:.95rem">${t.saldo>=0?'+':''}${fmt(t.saldo)}</td>
        </tr>`;
      }).join('');
    };
    const saldoCard = (titulo, lado, icone) => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;border-top:3px solid var(--purple)">
        <div style="padding:.9rem 1.2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div style="font-weight:800;font-size:.92rem;color:var(--purple)">${icone} ${titulo}</div>
          <div style="font-size:.65rem;color:var(--muted)">atk − conc · Top 10</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">${topSaldoHtml(lado)}</table>
      </div>
    `;

    ctr.innerHTML = `
      <div class="section-title">🏆 Ranking de Times — <span style="color:var(--blue2)">${LIGA_NOMES[LIGA_ATUAL]}</span></div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:.8rem 1.2rem;margin-bottom:1.2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
        <div style="font-size:.8rem;color:var(--muted)">Período: <strong style="color:var(--text)">${RANKING_PERIODO.toUpperCase()}</strong> · ${r.jogos_total} jogos · ${r.times_total} times · pesos EWMA (recentes valem mais)</div>
        <div style="display:flex;gap:.4rem">${toggleBtn('ft')} ${toggleBtn('ht')}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:1.2rem;margin-bottom:1.2rem">
        ${rankCard('Ataca em Casa',   'pro_casa',    'var(--green)',  '🏠')}
        ${rankCard('Ataca Fora',      'pro_fora',    'var(--blue2)',  '✈️')}
        ${rankCard('Concede em Casa', 'contra_casa', 'var(--amber)',  '🏠')}
        ${rankCard('Concede Fora',    'contra_fora', 'var(--red)',    '✈️')}
      </div>
      <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">📊 Saldo de Cantos (dominadores reais)</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:1.2rem">
        ${saldoCard('Saldo em Casa', 'casa', '🏠')}
        ${saldoCard('Saldo Fora',    'fora', '✈️')}
      </div>
    `;
  }

  function setRankingPeriodo(p) {
    RANKING_PERIODO = p;
    localStorage.setItem('hdppro_ranking_periodo', p);
    renderRanking();
  }

  // ═══════════════════════════════════════════════════════════
  //  TELA 3 · POR TIME
  // ═══════════════════════════════════════════════════════════
  function renderTime() {
    const ctr = document.getElementById('view-time');
    const r = HDP_MOTOR.getRanking(LIGA_ATUAL);
    if (!r) return;
    const times = Object.keys(r.times).sort();
    const timeAtual = localStorage.getItem('hdppro_time_atual_' + LIGA_ATUAL) || times[0];

    const select = `<select id="sel-time" onchange="setTimeAtual(this.value)" class="liga-selector" style="min-width:280px">
      ${times.map(t => `<option value="${esc(t)}" ${t === timeAtual ? 'selected' : ''}>${esc(t)}</option>`).join('')}
    </select>`;

    const perfil = HDP_MOTOR.perfilTime(LIGA_ATUAL, timeAtual);
    if (!perfil) {
      ctr.innerHTML = `<div class="section-title">👕 Perfil por Time</div>${select}<div class="empty" style="margin-top:1rem"><strong>Sem dados</strong></div>`;
      return;
    }

    const t = perfil.ranking;
    const card = (label, valor, hint, cor) => `
      <div class="stat-card">
        <div class="stat-label">${label}</div>
        <div class="stat-value" style="color:${cor};font-size:1.7rem">${valor == null ? '—' : fmt(valor)}</div>
        <div class="stat-hint">${hint}</div>
      </div>`;

    const ultimos = perfil.jogos.slice().reverse();
    const ultimosRows = ultimos.map(j => {
      const c = j.estatisticas_ft.cantos;
      const ehMandante = j.mandante === timeAtual;
      const cantos_time = ehMandante ? c.m : c.v;
      const cantos_opo  = ehMandante ? c.v : c.m;
      const opo = ehMandante ? j.visitante : j.mandante;
      const lado = ehMandante ? '🏠 Casa' : '✈️ Fora';
      const diff = cantos_time - cantos_opo;
      const diffC = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--muted)';
      return `<tr style="border-top:1px solid var(--border)">
        <td style="padding:.55rem 1rem;color:var(--muted);font-size:.75rem">${esc(j.data_partida || '—').substring(0,10)}</td>
        <td style="padding:.55rem 1rem;font-weight:600">${lado}</td>
        <td style="padding:.55rem 1rem">${esc(opo)}</td>
        <td style="padding:.55rem 1rem;text-align:center;font-weight:700">${cantos_time} - ${cantos_opo}</td>
        <td style="padding:.55rem 1rem;text-align:center;color:${diffC};font-weight:700">${diff>=0?'+':''}${diff}</td>
      </tr>`;
    }).join('');

    const hdpHist = perfil.hdp_historico;
    const nFav = perfil.n_como_fav_casa || 1;
    const hdpHistHtml = ['-1', '-1.5', '-2', '-2.5'].map(linha => {
      const n = hdpHist[linha];
      const p = (n / nFav * 100).toFixed(0);
      return `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:.7rem;text-align:center">
        <div style="font-size:.7rem;color:var(--muted);text-transform:uppercase">HDP ${linha}</div>
        <div style="font-size:1.4rem;font-weight:900;color:var(--green);margin-top:.3rem">${p}%</div>
        <div style="font-size:.65rem;color:var(--muted)">${n}/${nFav} como fav. casa</div>
      </div>`;
    }).join('');

    // #4 — Histograma de cantos pró
    const buckets = ['0-1','2-3','4-5','6-7','8-9','10+'];
    const counts = buckets.map(b => perfil.histograma[b] || 0);
    const maxCount = Math.max(1, ...counts);
    const histHtml = buckets.map((b, i) => {
      const h = (counts[i] / maxCount * 100).toFixed(0);
      const pct = perfil.n_pro ? (counts[i] / perfil.n_pro * 100).toFixed(0) : 0;
      return `<div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:.4rem">
        <div style="font-size:.62rem;color:var(--text);font-weight:700">${counts[i]}</div>
        <div style="width:100%;background:var(--bg);border-radius:4px;height:80px;display:flex;align-items:flex-end;position:relative;overflow:hidden">
          <div style="width:100%;height:${h}%;background:linear-gradient(180deg,var(--blue2),var(--green));transition:height .3s"></div>
        </div>
        <div style="font-size:.65rem;color:var(--muted);font-weight:700">${b}</div>
        <div style="font-size:.6rem;color:var(--muted)">${pct}%</div>
      </div>`;
    }).join('');

    // #4 — Forma recente vs histórico
    const fr = perfil.forma_recente;
    const setaCmp = (rec, hist) => {
      if (rec == null || hist == null) return '';
      const diff = rec - hist;
      if (Math.abs(diff) < 0.3) return '<span style="color:var(--muted)">→</span>';
      return diff > 0
        ? `<span style="color:var(--green);font-weight:800" title="+${diff.toFixed(2)} vs histórico">⬆ ${diff>0?'+':''}${diff.toFixed(2)}</span>`
        : `<span style="color:var(--red);font-weight:800" title="${diff.toFixed(2)} vs histórico">⬇ ${diff.toFixed(2)}</span>`;
    };
    const formaHtml = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.7rem">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:.8rem">
          <div style="font-size:.65rem;color:var(--muted);text-transform:uppercase;margin-bottom:.3rem">PRÓ — últimos ${fr.n}</div>
          <div style="font-size:1.3rem;font-weight:900;color:var(--green)">${fr.media_pro != null ? fmt(fr.media_pro) : '—'}</div>
          <div style="font-size:.7rem;color:var(--muted);margin-top:.3rem">hist. ${fr.media_pro_hist != null ? fmt(fr.media_pro_hist) : '—'} ${setaCmp(fr.media_pro, fr.media_pro_hist)}</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:.8rem">
          <div style="font-size:.65rem;color:var(--muted);text-transform:uppercase;margin-bottom:.3rem">CONTRA — últimos ${fr.n}</div>
          <div style="font-size:1.3rem;font-weight:900;color:var(--red)">${fr.media_con != null ? fmt(fr.media_con) : '—'}</div>
          <div style="font-size:.7rem;color:var(--muted);margin-top:.3rem">hist. ${fr.media_con_hist != null ? fmt(fr.media_con_hist) : '—'} ${setaCmp(fr.media_con, fr.media_con_hist)}</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:.8rem">
          <div style="font-size:.65rem;color:var(--muted);text-transform:uppercase;margin-bottom:.3rem">SALDO RECENTE</div>
          <div style="font-size:1.3rem;font-weight:900;color:${(fr.media_pro||0)-(fr.media_con||0)>=0?'var(--green)':'var(--red)'}">${fr.media_pro != null && fr.media_con != null ? ((fr.media_pro - fr.media_con)>=0?'+':'') + (fr.media_pro - fr.media_con).toFixed(2) : '—'}</div>
          <div style="font-size:.7rem;color:var(--muted);margin-top:.3rem">pró − contra</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:.8rem">
          <div style="font-size:.65rem;color:var(--muted);text-transform:uppercase;margin-bottom:.3rem">VOLATILIDADE</div>
          <div style="font-size:1.3rem;font-weight:900;color:${perfil.desvio_pro>3?'var(--amber)':'var(--purple)'}">±${fmt(perfil.desvio_pro)}</div>
          <div style="font-size:.7rem;color:var(--muted);margin-top:.3rem">desvio pró · ${perfil.desvio_pro>3?'alta — cuidado HDP':'estável'}</div>
        </div>
      </div>
    `;

    ctr.innerHTML = `
      <div class="section-title">👕 Perfil por Time</div>
      <div style="margin-bottom:1.2rem;display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
        ${select}
        <div style="color:var(--muted);font-size:.82rem">${perfil.n_jogos} jogos registrados em <strong style="color:var(--text)">${LIGA_NOMES[LIGA_ATUAL]}</strong></div>
      </div>

      <div style="margin-bottom:1.5rem">
        <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">Médias (FT)</div>
        <div class="grid4">
          ${card('🏠 Ataca em Casa',   t.ft.pro_casa,    `n=${t.ft.n_casa} jogos`, 'var(--green)')}
          ${card('🏠 Concede em Casa', t.ft.contra_casa, `n=${t.ft.n_casa} jogos`, 'var(--amber)')}
          ${card('✈️ Ataca Fora',      t.ft.pro_fora,    `n=${t.ft.n_fora} jogos`, 'var(--blue2)')}
          ${card('✈️ Concede Fora',    t.ft.contra_fora, `n=${t.ft.n_fora} jogos`, 'var(--red)')}
        </div>
      </div>

      <div style="margin-bottom:1.5rem">
        <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">📈 Forma recente (últimos 5) vs Histórico</div>
        ${formaHtml}
      </div>

      <div style="margin-bottom:1.5rem">
        <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">📊 Distribuição de cantos PRÓ por jogo (n=${perfil.n_pro})</div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem">
          <div style="display:flex;gap:.5rem;align-items:flex-end">${histHtml}</div>
          <div style="font-size:.7rem;color:var(--muted);margin-top:.6rem;text-align:center">Média ${fmt(perfil.media_pro)} · Desvio ±${fmt(perfil.desvio_pro)}</div>
        </div>
      </div>

      <div style="margin-bottom:1.5rem">
        <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">% de vezes que bateu cada linha HDP (como favorito em casa)</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.7rem">
          ${hdpHistHtml}
        </div>
      </div>

      <div>
        <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">Últimos ${ultimos.length} jogos</div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden">
          <table style="width:100%;border-collapse:collapse;font-size:.82rem">
            <thead><tr style="background:var(--bg3);text-align:left">
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Data</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Lado</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Adversário</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Cantos</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Diff</th>
            </tr></thead>
            <tbody>${ultimosRows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function setTimeAtual(time) {
    localStorage.setItem('hdppro_time_atual_' + LIGA_ATUAL, time);
    renderTime();
  }

  // ═══════════════════════════════════════════════════════════
  //  TELA 4 · PRÓXIMOS JOGOS (Vencedor + HDP / Filtro Elite)
  // ═══════════════════════════════════════════════════════════
  function renderProximos() {
    const ctr = document.getElementById('view-proximos');
    const r = HDP_MOTOR.getRanking(LIGA_ATUAL);
    if (!r) return;

    const inputBox = `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.2rem;margin-bottom:1.5rem">
        <div style="font-size:.85rem;color:var(--muted);margin-bottom:.7rem">Cole os confrontos da rodada (um por linha, formato <strong style="color:var(--text)">Mandante x Visitante</strong> ou <strong style="color:var(--text)">Mandante v Visitante</strong>)</div>
        <textarea id="proximos-input" placeholder="Flamengo x Palmeiras&#10;Botafogo v Fluminense&#10;Cruzeiro - Santos" style="width:100%;height:130px;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.9rem;border-radius:8px;resize:vertical;font-family:monospace;font-size:.85rem">${PROXIMOS_JOGOS.map(j => j.m + ' x ' + j.v).join('\n')}</textarea>
        <div style="display:flex;gap:.7rem;margin-top:.9rem;flex-wrap:wrap">
          <button onclick="analisarProximos()" style="background:linear-gradient(135deg,var(--green),var(--blue));color:#0a1f1a;border:none;padding:.7rem 1.4rem;border-radius:8px;font-weight:800;cursor:pointer;font-size:.88rem">🚀 Analisar Rodada</button>
          <button onclick="limparProximos()" style="background:transparent;color:var(--red);border:1px solid var(--red);padding:.7rem 1.2rem;border-radius:8px;font-weight:700;cursor:pointer;font-size:.85rem">🗑️ Limpar</button>
        </div>
      </div>
    `;

    if (!PROXIMOS_JOGOS.length) {
      ctr.innerHTML = `<div class="section-title">🎯 Próximos Jogos da Rodada — ${LIGA_NOMES[LIGA_ATUAL]}</div>${inputBox}<div class="empty"><div class="eicon">📥</div><strong>Cole os jogos da rodada</strong><p>O motor projeta cantos por time, recomenda HDP por linha e roda o Filtro Elite.</p></div>`;
      return;
    }

    // Avalia cada confronto
    const avaliados = PROXIMOS_JOGOS.map(c => HDP_MOTOR.avaliarElite(LIGA_ATUAL, c.m, c.v)).filter(Boolean);
    const elite  = avaliados.filter(a => a.passa);
    const sniper = avaliados.filter(a => a.snipe);

    // Ordena: SNIPER > ELITE_NUCLEAR > ELITE_FORTE > ELITE > resto, com razão decrescente como desempate
    const tierRank = { 'SNIPER':0, 'ELITE_NUCLEAR':1, 'ELITE_FORTE':2, 'ELITE':3 };
    const ordenarPicks = arr => arr.slice().sort((a,b) => {
      const ta = tierRank[a.tier] ?? 99;
      const tb = tierRank[b.tier] ?? 99;
      if (ta !== tb) return ta - tb;
      return (b.razao || 0) - (a.razao || 0);
    });

    // Sub-tabs (3 abas agora)
    const subTabBtn = (id, label, n, cor) => `<button onclick="setProximosAba('${id}')" style="background:${PROXIMOS_ABA===id?(cor||'linear-gradient(135deg,var(--green),var(--blue))'):'var(--bg3)'};color:${PROXIMOS_ABA===id?'#0a1f1a':'var(--muted)'};border:1px solid ${PROXIMOS_ABA===id?'var(--green)':'var(--border)'};padding:.55rem 1.1rem;border-radius:8px;font-weight:800;font-size:.82rem;cursor:pointer">${label} (${n})</button>`;

    let lista;
    if      (PROXIMOS_ABA === 'sniper') lista = sniper;
    else if (PROXIMOS_ABA === 'elite')  lista = elite;
    else                                lista = avaliados;
    lista = ordenarPicks(lista);

    const emptyMsg = PROXIMOS_ABA === 'sniper'
      ? `<div class="empty"><div class="eicon">🎯</div><strong>Nenhum jogo SNIPER nesta rodada</strong><p>Critério rigoroso: razão≥1.8 · WIN≥68% · linha -2/-2.5 · amostra≥7 · saldo fav≥+2.5 · forma alinhada · desvio<3.5.<br>Escassez é o ponto — espera o sniper real.</p></div>`
      : PROXIMOS_ABA === 'elite'
        ? `<div class="empty"><div class="eicon">🥇</div><strong>Nenhum jogo passou no Filtro Elite</strong><p>Critério: ranking + diff ≥ ${HDP_MOTOR.X_POR_LIGA[LIGA_ATUAL]} cantos + WIN linha ≥ 55%.</p></div>`
        : `<div class="empty"><div class="eicon">📭</div><strong>Sem picks</strong><p>Cole os jogos e analise a rodada.</p></div>`;

    ctr.innerHTML = `
      <div class="section-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.6rem">
        <span>🎯 Próximos Jogos da Rodada — ${LIGA_NOMES[LIGA_ATUAL]}</span>
        ${avaliados.length > 0 ? `<button onclick="exportarRelatorioHDP()" style="background:linear-gradient(135deg,var(--green),var(--blue));color:#0a1f1a;border:none;padding:.55rem 1.1rem;border-radius:8px;font-weight:800;cursor:pointer;font-size:.82rem;box-shadow:0 4px 12px rgba(16,185,129,0.3)">📤 Exportar Relatório HTML</button>` : ''}
      </div>
      ${inputBox}
      <div style="display:flex;gap:.5rem;margin-bottom:1.2rem;flex-wrap:wrap;align-items:center">
        ${subTabBtn('sniper',   '🎯 Sniper',          sniper.length,   'linear-gradient(135deg,var(--gold),#ffd75e)')}
        ${subTabBtn('elite',    '🥇 Filtro Elite',    elite.length)}
        ${subTabBtn('vencedor', '⚔️ Vencedor + HDP', avaliados.length)}
        ${sniper.length > 0 ? '<span style="margin-left:auto;color:var(--gold);font-size:.78rem;font-weight:700">🎯 '+sniper.length+' Sniper'+(sniper.length>1?'s':'')+' detectado'+(sniper.length>1?'s':'')+'!</span>' : ''}
      </div>
      ${lista.length === 0 ? emptyMsg : `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:1.2rem">${lista.map(a => cardJogo(a)).join('')}</div>`}
    `;
  }

  // ═══════════════════════════════════════════════════════════
  //  EXPORT RELATÓRIO HTML — tema HDP-Pro (verde escuro + azul)
  // ═══════════════════════════════════════════════════════════
  function exportarRelatorioHDP() {
    if (!PROXIMOS_JOGOS.length) { alert('Cole jogos da rodada e clique "Analisar" antes de exportar.'); return; }
    const avaliados = PROXIMOS_JOGOS.map(c => HDP_MOTOR.avaliarElite(LIGA_ATUAL, c.m, c.v)).filter(Boolean);
    const sniper = avaliados.filter(a => a.snipe);
    const elite  = avaliados.filter(a => a.passa && !a.snipe);
    const outros = avaliados.filter(a => !a.passa);
    const dataStr = new Date().toLocaleString('pt-BR');
    const dataISO = new Date().toISOString().substring(0,10);

    const tierBadge = (a) => {
      if (a.snipe) return '<span style="background:linear-gradient(135deg,#fbbf24,#ffd75e);color:#0a1f1a;padding:.25rem .7rem;border-radius:6px;font-size:.65rem;font-weight:900;letter-spacing:1px">🎯 SNIPER</span>';
      if (!a.tier) return '<span style="background:rgba(107,142,127,.15);color:#6b8e7f;padding:.25rem .6rem;border-radius:6px;font-size:.62rem;font-weight:700">—</span>';
      const cor = a.tier === 'ELITE_NUCLEAR' ? '#ef4444' : a.tier === 'ELITE_FORTE' ? '#fbbf24' : '#10b981';
      return `<span style="background:${cor}22;color:${cor};padding:.25rem .6rem;border-radius:6px;font-size:.62rem;font-weight:900;letter-spacing:.5px;border:1px solid ${cor}66">${a.tier.replace('_',' ')}</span>`;
    };

    const linhaTab = (a, mostrarSniperReason) => {
      const linhaRec = a.linhaFT_rec;
      const h = linhaRec ? a.hdpFT[linhaRec] : null;
      const probFav = a.diffFT >= 0 ? a.probsFT.pH : a.probsFT.pA;
      const corDiff = Math.abs(a.diffFT) >= 3 ? '#3b82f6' : Math.abs(a.diffFT) >= 2 ? '#10b981' : Math.abs(a.diffFT) >= 1.5 ? '#fbbf24' : '#6b8e7f';
      return `
        <tr style="border-top:1px solid #1e3a3a">
          <td style="padding:.7rem 1rem;font-weight:700;font-size:.85rem">${esc(a.M)} <span style="color:#6b8e7f">×</span> ${esc(a.V)}</td>
          <td style="padding:.7rem 1rem;font-weight:800;color:#10b981">${esc(a.favorito)}</td>
          <td style="padding:.7rem 1rem;text-align:center;font-weight:900;color:#fbbf24;font-size:.95rem">${linhaRec ?? '—'}</td>
          <td style="padding:.7rem 1rem;text-align:center;color:${corDiff};font-weight:800">${a.diffFT >= 0 ? '+' : ''}${a.diffFT}</td>
          <td style="padding:.7rem 1rem;text-align:center;color:#d1e7dd">${a.expHomeFT}</td>
          <td style="padding:.7rem 1rem;text-align:center;color:#d1e7dd">${a.expAwayFT}</td>
          <td style="padding:.7rem 1rem;text-align:center;color:#10b981;font-weight:700">${h ? (h.win*100).toFixed(1)+'%' : '—'}</td>
          <td style="padding:.7rem 1rem;text-align:center;color:#d1e7dd;font-weight:700">${h ? h.oddJusta.toFixed(2) : '—'}</td>
          <td style="padding:.7rem 1rem;text-align:center">${tierBadge(a)}</td>
        </tr>
      `;
    };

    const tabela = (titulo, cor, icone, descricao, lista) => {
      if (!lista.length) return '';
      return `
        <div style="background:linear-gradient(135deg,${cor}15,#0a1f1a40);border-left:4px solid ${cor};padding:1rem 1.2rem;border-radius:12px;margin:1.5rem 0 .9rem;line-height:1.5">
          <div style="font-size:1.15rem;font-weight:900;color:${cor};margin-bottom:.3rem">${icone} ${titulo} <span style="color:#6b8e7f;font-weight:600;font-size:.85rem">· ${lista.length} jogo${lista.length>1?'s':''}</span></div>
          <div style="font-size:.78rem;color:#6b8e7f">${descricao}</div>
        </div>
        <div style="background:#133835;border:1px solid #1e3a3a;border-radius:12px;overflow:hidden">
          <table style="width:100%;border-collapse:collapse;font-size:.82rem">
            <thead>
              <tr style="background:#0f2a35">
                <th style="padding:.7rem 1rem;text-align:left;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Partida</th>
                <th style="padding:.7rem 1rem;text-align:left;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Favorito</th>
                <th style="padding:.7rem 1rem;text-align:center;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Linha HDP</th>
                <th style="padding:.7rem 1rem;text-align:center;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Δ Diff</th>
                <th style="padding:.7rem 1rem;text-align:center;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">xC Casa</th>
                <th style="padding:.7rem 1rem;text-align:center;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">xC Fora</th>
                <th style="padding:.7rem 1rem;text-align:center;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">WIN%</th>
                <th style="padding:.7rem 1rem;text-align:center;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Odd Justa</th>
                <th style="padding:.7rem 1rem;text-align:center;font-size:.7rem;color:#6b8e7f;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Tier</th>
              </tr>
            </thead>
            <tbody>${lista.map(a => linhaTab(a)).join('')}</tbody>
          </table>
        </div>
      `;
    };

    // Snipers tem bloco extra com card detalhado
    const snipersDetalhado = sniper.length > 0 ? `
      <div style="margin:1.5rem 0">
        <div style="font-size:.85rem;color:#fbbf24;text-transform:uppercase;font-weight:800;letter-spacing:1px;margin-bottom:.7rem">🎯 SNIPER PICKS — Detalhamento</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1rem">
          ${sniper.map((a, i) => {
            const h = a.hdpFT[a.linhaFT_rec];
            const motivos = (a.snipe_motivos || []).filter(m => m.ok).map(m => m.k+'('+m.v+')').join(' · ');
            return `
              <div style="background:linear-gradient(135deg,#133835 0%,rgba(251,191,36,0.08) 100%);border:1px solid #fbbf24;border-radius:12px;padding:1.1rem;box-shadow:0 4px 18px rgba(251,191,36,.18)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem">
                  <span style="color:#fbbf24;font-weight:900;font-size:.75rem;letter-spacing:1px">🎯 SNIPER #${i+1}</span>
                  <span style="color:#6b8e7f;font-size:.7rem">razão ${a.razao} · WIN ${(a.prob_linha_rec*100).toFixed(1)}%</span>
                </div>
                <div style="font-weight:800;font-size:.95rem;color:#d1e7dd;margin-bottom:.5rem">${esc(a.M)} × ${esc(a.V)}</div>
                <div style="background:rgba(251,191,36,.10);border:1px solid rgba(251,191,36,.35);border-radius:8px;padding:.6rem .8rem;margin-bottom:.5rem">
                  🎯 <strong style="color:#fbbf24">${esc(a.favorito)} ${a.linhaFT_rec}</strong> · odd justa <strong style="color:#d1e7dd">${h.oddJusta.toFixed(2)}</strong>
                </div>
                <div style="font-size:.7rem;color:#6b8e7f;border-top:1px dashed #1e3a3a;padding-top:.5rem;margin-top:.5rem">
                  <strong style="color:#fbbf24">Por que SNIPER:</strong> ${motivos}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : '';

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>🐺 HDP-Pro · ${LIGA_NOMES[LIGA_ATUAL]} · ${dataISO}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a1f1a; color: #d1e7dd; font-family: 'Inter','Segoe UI',sans-serif; padding: 2rem; line-height: 1.55; }
  .container { max-width: 1200px; margin: 0 auto; }
  .header { background: linear-gradient(135deg,#0f2a35 0%,#0a1f1a 100%); border: 1px solid #285252; border-radius: 16px; padding: 1.8rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .brand { display: flex; align-items: center; gap: 1rem; }
  .brand-logo { width: 56px; height: 56px; background: linear-gradient(135deg,#10b981,#3b82f6); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.4rem; color: #0a1f1a; }
  .brand-title { font-size: 1.4rem; font-weight: 900; color: #d1e7dd; letter-spacing: -.3px; }
  .brand-sub { font-size: .8rem; color: #6b8e7f; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
  .meta { text-align: right; font-size: .85rem; color: #6b8e7f; }
  .meta strong { color: #10b981; font-size: 1rem; font-weight: 800; display: block; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.8rem; }
  .stat { background: #133835; border: 1px solid #1e3a3a; border-top: 3px solid #10b981; border-radius: 12px; padding: 1rem; }
  .stat-l { font-size: .68rem; color: #6b8e7f; text-transform: uppercase; letter-spacing: .8px; font-weight: 700; margin-bottom: .4rem; }
  .stat-v { font-size: 2rem; font-weight: 900; line-height: 1; }
  footer { text-align: center; padding: 1.5rem; border-top: 1px solid #1e3a3a; color: #6b8e7f; font-size: .8rem; margin-top: 2.5rem; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="brand">
      <div class="brand-logo">HP</div>
      <div>
        <div class="brand-title">EDS-HDP-Pro · Relatório de Rodada</div>
        <div class="brand-sub">Handicap Asiático de Cantos</div>
      </div>
    </div>
    <div class="meta">
      <strong>${LIGA_NOMES[LIGA_ATUAL]}</strong>
      ${avaliados.length} jogos analisados<br>
      Gerado em ${dataStr}
    </div>
  </div>

  <div class="stats">
    <div class="stat" style="border-top-color:#fbbf24"><div class="stat-l">🎯 Sniper</div><div class="stat-v" style="color:#fbbf24">${sniper.length}</div></div>
    <div class="stat" style="border-top-color:#10b981"><div class="stat-l">🥇 Filtro Elite</div><div class="stat-v" style="color:#10b981">${elite.length}</div></div>
    <div class="stat" style="border-top-color:#3b82f6"><div class="stat-l">⚔️ Vencedor + HDP</div><div class="stat-v" style="color:#3b82f6">${avaliados.length}</div></div>
    <div class="stat"><div class="stat-l">X da Liga</div><div class="stat-v" style="color:#a78bfa">${HDP_MOTOR.X_POR_LIGA[LIGA_ATUAL] || 2.0}</div></div>
  </div>

  ${snipersDetalhado}

  ${tabela('🎯 SNIPER (alta confiança)', '#fbbf24', '🎯', 'razão diff/X ≥ 1.5 · WIN linha ≥ 60% · linha -2.0/-2.5 · amostra ≥ 6 · saldo fav ≥ +2.5 · forma alinhada · desvio < 4.5', sniper)}
  ${tabela('🥇 Filtro Elite', '#10b981', '🥇', 'cruzamento de ranking (Top-N) + diff ≥ X da liga + WIN linha ≥ 55%', elite)}
  ${tabela('⚔️ Vencedor + HDP — todos os jogos', '#3b82f6', '⚔️', 'projeção completa de todos os confrontos da rodada, mesmo fora do filtro Elite', outros)}

  <footer>EDS-HDP-Pro · Especialista em HDP de Cantos · Banco com aliases canônicos + EWMA temporal (half-life 60d) · Soluções Inteligentes EDS</footer>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `HDP-Pro_${LIGA_ATUAL}_${dataISO}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function cardJogo(a) {
    const ehSniper = a.snipe === true;
    const corTier = !a.passa ? 'var(--muted)' :
      a.tier === 'SNIPER'        ? 'var(--gold)' :
      a.tier === 'ELITE_NUCLEAR' ? 'var(--red)' :
      a.tier === 'ELITE_FORTE'   ? 'var(--gold)' :
                                   'var(--green)';

    const tierBadge = ehSniper
      ? `<span class="sniper-badge" style="border-radius:6px;font-size:.72rem">🎯 SNIPER</span>`
      : (a.tier ? `<span style="background:${corTier}22;color:${corTier};padding:.2rem .6rem;border-radius:6px;font-size:.65rem;font-weight:900;border:1px solid ${corTier}88;letter-spacing:.5px">${a.tier.replace('_', ' ')}</span>` : '');

    const amostraBadge = a.amostra_fraca ? `<span style="background:rgba(245,158,11,0.18);color:var(--amber);padding:.2rem .6rem;border-radius:6px;font-size:.62rem;font-weight:800;border:1px solid var(--amber);letter-spacing:.3px;margin-left:.4rem" title="Mandante tem ${a.amostras.M.casa} jogos em casa, visitante ${a.amostras.V.fora} fora — projeção menos confiável">⚠ AMOSTRA FRACA</span>` : '';

    const probVencedor = a.diffFT >= 0 ? a.probsFT.pH : a.probsFT.pA;
    const oddVencedor = 1 / probVencedor;

    // #3 — Tabela comparativa das 4 linhas HDP FT
    const linhasFT = [-1.0, -1.5, -2.0, -2.5];
    const colHdr = linhasFT.map(l => {
      const ehRec = l === a.linhaFT_rec;
      return `<th style="padding:.4rem .6rem;text-align:center;font-size:.7rem;${ehRec?'background:rgba(59,130,246,0.18);color:var(--blue2)':'color:var(--muted)'};font-weight:800">${esc(a.favorito)} ${l.toFixed(1)}${ehRec?' ★':''}</th>`;
    }).join('');
    const colWin = linhasFT.map(l => {
      const h = a.hdpFT[l];
      const ehRec = l === a.linhaFT_rec;
      const corWin = h.win >= 0.60 ? 'var(--green)' : h.win >= 0.50 ? 'var(--blue2)' : 'var(--muted)';
      return `<td style="padding:.45rem .6rem;text-align:center;font-weight:800;color:${corWin};${ehRec?'background:rgba(59,130,246,0.08)':''}">${pct(h.win, 1)}</td>`;
    }).join('');
    const colPush = linhasFT.map(l => {
      const h = a.hdpFT[l]; const ehRec = l === a.linhaFT_rec;
      return `<td style="padding:.35rem .6rem;text-align:center;font-size:.72rem;color:var(--muted);${ehRec?'background:rgba(59,130,246,0.08)':''}">${pct(h.push, 1)}</td>`;
    }).join('');
    const colOdd = linhasFT.map(l => {
      const h = a.hdpFT[l]; const ehRec = l === a.linhaFT_rec;
      return `<td style="padding:.35rem .6rem;text-align:center;font-size:.72rem;color:var(--text);font-weight:700;${ehRec?'background:rgba(59,130,246,0.08)':''}">${fmt(h.oddJusta)}</td>`;
    }).join('');

    // Tabela HDP HT (2 linhas)
    const linhasHT = [-0.5, -1.0];
    const colHdrHT = linhasHT.map(l => {
      const ehRec = l === a.linhaHT_rec;
      return `<th style="padding:.4rem .6rem;text-align:center;font-size:.7rem;${ehRec?'background:rgba(167,139,250,0.18);color:var(--purple)':'color:var(--muted)'};font-weight:800">${esc(a.favorito)} ${l.toFixed(1)}${ehRec?' ★':''}</th>`;
    }).join('');
    const colWinHT = linhasHT.map(l => {
      const h = a.hdpHT[l]; const ehRec = l === a.linhaHT_rec;
      const corWin = h.win >= 0.60 ? 'var(--green)' : h.win >= 0.50 ? 'var(--blue2)' : 'var(--muted)';
      return `<td style="padding:.45rem .6rem;text-align:center;font-weight:800;color:${corWin};${ehRec?'background:rgba(167,139,250,0.08)':''}">${pct(h.win, 1)}</td>`;
    }).join('');
    const colOddHT = linhasHT.map(l => {
      const h = a.hdpHT[l]; const ehRec = l === a.linhaHT_rec;
      return `<td style="padding:.35rem .6rem;text-align:center;font-size:.72rem;color:var(--text);font-weight:700;${ehRec?'background:rgba(167,139,250,0.08)':''}">${fmt(h.oddJusta)}</td>`;
    }).join('');

    const sniperFootnote = ehSniper && a.snipe_motivos ? `
      <div style="margin-top:.8rem;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:6px;padding:.55rem .7rem;font-size:.7rem">
        <strong style="color:var(--gold);text-transform:uppercase;letter-spacing:.4px">🎯 Por que SNIPER:</strong>
        <span style="color:var(--muted);margin-left:.3rem">${a.snipe_motivos.filter(m=>m.ok).map(m=>m.k+'('+m.v+')').join(' · ')}</span>
      </div>
    ` : '';

    return `
      <div class="stat-card ${ehSniper ? 'sniper-card' : ''}" style="padding:0;${ehSniper?'':`border-top:3px solid ${corTier}`}">
        <div style="padding:1rem 1.2rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;flex-wrap:wrap">
          <div style="flex:1;min-width:200px">
            <div style="font-weight:800;font-size:.95rem">${esc(a.M)}<span style="color:var(--muted);font-weight:500"> × </span>${esc(a.V)}</div>
            <div style="font-size:.7rem;color:var(--muted);margin-top:.2rem">Favorito: <strong style="color:${ehSniper?'var(--gold)':'var(--green)'}">${esc(a.favorito)}</strong> · diff projetada <strong style="color:var(--blue2)">${a.diffFT >= 0 ? '+' : ''}${a.diffFT}</strong> cantos</div>
          </div>
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:.2rem">${tierBadge}${amostraBadge}</div>
        </div>
        <div style="padding:1rem 1.2rem">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-bottom:1rem">
            <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:.7rem">
              <div style="font-size:.65rem;color:var(--muted);text-transform:uppercase">Projeção HT</div>
              <div style="font-size:1.05rem;font-weight:800;color:var(--text);margin-top:.2rem">${a.expHomeHT} × ${a.expAwayHT}</div>
            </div>
            <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:.7rem">
              <div style="font-size:.65rem;color:var(--muted);text-transform:uppercase">Projeção FT</div>
              <div style="font-size:1.05rem;font-weight:800;color:var(--text);margin-top:.2rem">${a.expHomeFT} × ${a.expAwayFT}</div>
            </div>
          </div>
          <div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:.8rem;margin-bottom:.7rem">
            <div style="font-size:.65rem;color:var(--green);text-transform:uppercase;font-weight:800">⚔️ Vencedor de Cantos FT</div>
            <div style="font-size:1.05rem;font-weight:800;color:var(--text);margin-top:.3rem">${esc(a.favorito)} <span style="color:var(--green)">vence</span></div>
            <div style="font-size:.75rem;color:var(--muted);margin-top:.2rem">Prob ${pct(probVencedor, 1)} · odd justa ${fmt(oddVencedor)} · empate ${pct(a.probsFT.pE, 1)}</div>
          </div>
          <div style="background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.25);border-radius:8px;padding:.6rem;margin-bottom:.7rem;overflow-x:auto">
            <div style="font-size:.65rem;color:var(--blue2);text-transform:uppercase;font-weight:800;margin-bottom:.4rem">🎯 HDP FT — todas as linhas (★ = recomendada)</div>
            <table style="width:100%;border-collapse:collapse;font-size:.78rem">
              <thead><tr>${colHdr}</tr></thead>
              <tbody>
                <tr><th style="padding:.35rem .6rem;text-align:left;color:var(--muted);font-size:.62rem;font-weight:700;text-transform:uppercase">WIN</th>${colWin.replace(/^<td/, '<td').replace('<td', '<td')}</tr>
                <tr><th style="padding:.35rem .6rem;text-align:left;color:var(--muted);font-size:.62rem;font-weight:700;text-transform:uppercase">PUSH</th>${colPush}</tr>
                <tr><th style="padding:.35rem .6rem;text-align:left;color:var(--muted);font-size:.62rem;font-weight:700;text-transform:uppercase">Odd justa</th>${colOdd}</tr>
              </tbody>
            </table>
          </div>
          ${a.linhaHT_rec ? `
            <div style="background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.25);border-radius:8px;padding:.6rem;overflow-x:auto">
              <div style="font-size:.65rem;color:var(--purple);text-transform:uppercase;font-weight:800;margin-bottom:.4rem">⏱️ HDP HT — linhas (★ = recomendada)</div>
              <table style="width:100%;border-collapse:collapse;font-size:.78rem">
                <thead><tr>${colHdrHT}</tr></thead>
                <tbody>
                  <tr><th style="padding:.35rem .6rem;text-align:left;color:var(--muted);font-size:.62rem;font-weight:700;text-transform:uppercase">WIN</th>${colWinHT}</tr>
                  <tr><th style="padding:.35rem .6rem;text-align:left;color:var(--muted);font-size:.62rem;font-weight:700;text-transform:uppercase">Odd justa</th>${colOddHT}</tr>
                </tbody>
              </table>
            </div>
          ` : `<div style="background:var(--bg3);border:1px dashed var(--border);border-radius:8px;padding:.6rem;text-align:center;color:var(--muted);font-size:.75rem">⚖️ HT equilibrado — sem HDP recomendado</div>`}
          ${a.passa ? `<div style="margin-top:.8rem;font-size:.7rem;color:var(--muted);border-top:1px dashed var(--border);padding-top:.6rem">
            ✅ Favorito ${a.favorito_rank_pos ? '#'+a.favorito_rank_pos : ''} ataca · azarão ${a.azarao_rank_pos ? '#'+a.azarao_rank_pos : ''} concede · razão diff/X = ${a.razao} · WIN da linha rec. = ${pct(a.prob_linha_rec, 1)}
          </div>` : ''}
          ${sniperFootnote}
        </div>
      </div>
    `;
  }

  function analisarProximos() {
    const txt = document.getElementById('proximos-input').value;
    const r = HDP_MOTOR.getRanking(LIGA_ATUAL);
    const timesAtual = r ? Object.keys(r.times) : [];
    const linhas = txt.split('\n').map(s => s.trim()).filter(Boolean);

    const out = [];
    const naoReconhecidos = [];
    for (const linha of linhas) {
      const partes = linha.split(/\s+[x×]\s+|\s+vs\.?\s+|\s+v\s+|\s+-\s+/i);
      if (partes.length < 2) { naoReconhecidos.push(linha); continue; }
      const m = matchTime(partes[0], timesAtual);
      const v = matchTime(partes[1], timesAtual);
      if (m && v && m !== v) out.push({ m, v });
      else naoReconhecidos.push(linha);
    }

    PROXIMOS_JOGOS = out;

    // Se NADA foi reconhecido na liga atual, varre as outras 5 ligas
    // pra detectar onde esses times realmente estão
    if (out.length === 0 && linhas.length > 0) {
      const sugestoes = {};
      for (const otherLiga of Object.keys(LIGA_NOMES)) {
        if (otherLiga === LIGA_ATUAL) continue;
        const r2 = HDP_MOTOR.getRanking(otherLiga);
        if (!r2) continue;
        const t2 = Object.keys(r2.times);
        let hits = 0;
        for (const linha of linhas) {
          const partes = linha.split(/\s+[x×]\s+|\s+vs\.?\s+|\s+v\s+|\s+-\s+/i);
          if (partes.length < 2) continue;
          if (matchTime(partes[0], t2) && matchTime(partes[1], t2)) hits++;
        }
        if (hits > 0) sugestoes[otherLiga] = hits;
      }
      const sugestao = Object.entries(sugestoes).sort((a,b) => b[1] - a[1])[0];

      const ctr = document.getElementById('view-proximos');
      const inputBoxHTML = ctr.querySelector('textarea')?.parentNode.parentNode.outerHTML || '';
      ctr.innerHTML = `
        <div class="section-title">🎯 Próximos Jogos da Rodada — ${LIGA_NOMES[LIGA_ATUAL]}</div>
        ${inputBoxHTML}
        <div style="background:rgba(239,68,68,0.08);border:1px solid var(--red);border-radius:12px;padding:1.2rem;margin-top:1rem">
          <div style="font-weight:800;color:var(--red);font-size:1rem;margin-bottom:.6rem">❌ Nenhum time reconhecido em <strong>${LIGA_NOMES[LIGA_ATUAL]}</strong></div>
          <div style="font-size:.85rem;color:var(--text);margin-bottom:.7rem">${linhas.length} linha(s) colada(s) não bateram com nenhum time desta liga.</div>
          ${sugestao ? `
            <div style="background:rgba(16,185,129,0.10);border:1px solid var(--green);border-radius:8px;padding:.9rem;margin-top:.7rem">
              <div style="color:var(--green);font-weight:700;font-size:.85rem;margin-bottom:.4rem">💡 Detectei que ${sugestao[1]} de ${linhas.length} confrontos pertencem a <strong>${LIGA_NOMES[sugestao[0]]}</strong></div>
              <button onclick="trocarLigaEReanalisar('${sugestao[0]}')" style="background:linear-gradient(135deg,var(--green),var(--blue));color:#0a1f1a;border:none;padding:.55rem 1.1rem;border-radius:6px;font-weight:800;cursor:pointer;font-size:.82rem;margin-top:.4rem">🔁 Trocar para ${sugestao[0]} e analisar</button>
            </div>
          ` : `<div style="font-size:.8rem;color:var(--muted);margin-top:.5rem">Verifique se selecionou a liga correta no seletor do topo.</div>`}
          <details style="margin-top:.8rem">
            <summary style="cursor:pointer;color:var(--muted);font-size:.78rem">Ver linhas não reconhecidas (${naoReconhecidos.length})</summary>
            <div style="margin-top:.5rem;font-family:monospace;font-size:.75rem;color:var(--muted);background:var(--bg);padding:.6rem;border-radius:6px">${naoReconhecidos.map(l => '• ' + esc(l)).join('<br>')}</div>
          </details>
        </div>
      `;
      return;
    }

    // Reconheceu alguns mas não TODOS — banner amarelo informativo
    if (naoReconhecidos.length > 0 && out.length > 0) {
      window._naoReconhecidosUltimo = naoReconhecidos;
    } else {
      window._naoReconhecidosUltimo = null;
    }
    renderProximos();
  }

  function trocarLigaEReanalisar(liga) {
    // Preserva texto colado antes de trocar (trocarLiga limpa PROXIMOS_JOGOS e re-renderiza)
    const textoColado = document.getElementById('proximos-input')?.value || '';
    document.getElementById('liga-selector').value = liga;
    trocarLiga(liga);
    setTimeout(() => {
      const txt = document.getElementById('proximos-input');
      if (txt) { txt.value = textoColado; analisarProximos(); }
    }, 50);
  }

  function limparProximos() {
    PROXIMOS_JOGOS = [];
    renderProximos();
  }

  function setProximosAba(aba) {
    PROXIMOS_ABA = aba;
    renderProximos();
  }

  // Fuzzy match simples (mesma estratégia do especialista — substring case-insensitive)
  function matchTime(query, times) {
    if (!query) return null;
    const n = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '');
    const q = n(query);
    if (!q) return null;
    // exato primeiro
    for (const t of times) if (n(t) === q) return t;
    // começa com
    for (const t of times) if (n(t).startsWith(q)) return t;
    // contém
    for (const t of times) if (n(t).includes(q)) return t;
    // ou query contém o nome do time
    for (const t of times) if (q.includes(n(t))) return t;
    return null;
  }

  // ═══════════════════════════════════════════════════════════
  //  TELA 5 · BET TRACKER
  // ═══════════════════════════════════════════════════════════
  function lerBets() {
    try { return JSON.parse(localStorage.getItem('hdppro_bets') || '[]'); }
    catch (e) { return []; }
  }
  function salvarBets(bets) {
    localStorage.setItem('hdppro_bets', JSON.stringify(bets));
  }
  function agregaBets(bets) {
    if (!bets.length) return { n: 0, V: 0, D: 0, R: 0, pendentes: 0, stake: 0, lucro: 0, wr: 0, roi: 0 };
    let V = 0, D = 0, R = 0, pendentes = 0, stake = 0, retorno = 0;
    for (const b of bets) {
      const s = +b.stake || 0;
      const o = +b.odd || 0;
      stake += s;
      if (b.resultado === 'V')      { V++; retorno += s * o; }
      else if (b.resultado === 'D') { D++; /* retorno 0 */ }
      else if (b.resultado === 'R') { R++; retorno += s; }
      else                          { pendentes++; retorno += s; /* pendente: stake "preservado" pra mostrar */ }
    }
    const fechadas = V + D;
    const lucro = retorno - stake;
    return {
      n: bets.length, V, D, R, pendentes,
      stake: +stake.toFixed(2),
      lucro: +lucro.toFixed(2),
      wr: fechadas > 0 ? +(V / fechadas * 100).toFixed(1) : 0,
      roi: stake > 0 ? +((lucro / stake) * 100).toFixed(1) : 0
    };
  }

  function renderTracker() {
    const ctr = document.getElementById('view-tracker');
    if (!ctr) return;
    const bets = lerBets();
    const todas = agregaBets(bets);
    const ligaSel = document.getElementById('tracker-filtro-liga')?.value || 'todas';
    const visiveis = ligaSel === 'todas' ? bets : bets.filter(b => b.liga === ligaSel);
    const aggLiga = agregaBets(visiveis);

    const liGas = ['todas', ...Object.keys(LIGA_NOMES)];
    const optsLiga = liGas.map(l => `<option value="${l}" ${l===ligaSel?'selected':''}>${l==='todas'?'Todas':LIGA_NOMES[l]}</option>`).join('');

    // Agregação por linha HDP
    const porLinha = {};
    for (const b of visiveis) {
      const k = b.linha || '?';
      (porLinha[k] = porLinha[k] || []).push(b);
    }
    const linhaRows = Object.entries(porLinha).sort((a,b) => a[0].localeCompare(b[0])).map(([linha, lista]) => {
      const a = agregaBets(lista);
      return `<tr style="border-top:1px solid var(--border)">
        <td style="padding:.5rem 1rem;font-weight:700;color:var(--blue2)">${esc(linha)}</td>
        <td style="padding:.5rem 1rem;text-align:center">${a.n}</td>
        <td style="padding:.5rem 1rem;text-align:center;color:var(--green)">${a.V}</td>
        <td style="padding:.5rem 1rem;text-align:center;color:var(--red)">${a.D}</td>
        <td style="padding:.5rem 1rem;text-align:center;color:var(--muted)">${a.R}</td>
        <td style="padding:.5rem 1rem;text-align:right;font-weight:700;color:${a.wr>=55?'var(--green)':a.wr>=50?'var(--blue2)':'var(--muted)'}">${a.wr.toFixed(1)}%</td>
        <td style="padding:.5rem 1rem;text-align:right;font-weight:800;color:${a.roi>=0?'var(--green)':'var(--red)'}">${a.roi>=0?'+':''}${a.roi.toFixed(1)}%</td>
      </tr>`;
    }).join('');

    // Lista de apostas (últimas 30, decrescente por data)
    const ordenadas = visiveis.slice().sort((a,b) => (b.data || '').localeCompare(a.data || ''));
    const rows = ordenadas.slice(0, 50).map((b, i) => {
      const corRes = b.resultado === 'V' ? 'var(--green)' : b.resultado === 'D' ? 'var(--red)' : b.resultado === 'R' ? 'var(--muted)' : 'var(--amber)';
      const labelRes = b.resultado === 'V' ? 'GREEN' : b.resultado === 'D' ? 'RED' : b.resultado === 'R' ? 'PUSH' : 'PENDENTE';
      const lucroBet = b.resultado === 'V' ? ((+b.stake) * ((+b.odd) - 1)).toFixed(2) :
                      b.resultado === 'D' ? (-(+b.stake)).toFixed(2) :
                      b.resultado === 'R' ? '0.00' : '—';
      return `<tr style="border-top:1px solid var(--border)">
        <td style="padding:.55rem .9rem;color:var(--muted);font-size:.72rem">${esc(b.data || '—')}</td>
        <td style="padding:.55rem .9rem;font-weight:600;font-size:.78rem">${esc(b.m)} × ${esc(b.v)}</td>
        <td style="padding:.55rem .9rem;font-size:.72rem;color:var(--blue2)">${esc(b.liga)}</td>
        <td style="padding:.55rem .9rem;font-weight:700;font-size:.78rem">${esc(b.favorito || '')} ${esc(b.linha || '')}</td>
        <td style="padding:.55rem .9rem;text-align:right;font-size:.78rem">${fmt(b.odd)}</td>
        <td style="padding:.55rem .9rem;text-align:right;font-size:.78rem">R$ ${fmt(b.stake)}</td>
        <td style="padding:.55rem .9rem;text-align:center;font-size:.7rem;font-weight:800;color:${corRes}">${labelRes}</td>
        <td style="padding:.55rem .9rem;text-align:right;font-weight:800;color:${corRes};font-size:.78rem">${lucroBet === '—' ? '—' : (lucroBet >= 0 ? '+' : '') + 'R$ ' + lucroBet}</td>
        <td style="padding:.55rem .9rem;text-align:center;display:flex;gap:.2rem;justify-content:center">
          ${b.resultado == null ? `
            <button onclick="setBetResult('${b.id}','V')" title="Green" style="background:var(--green);color:#0a1f1a;border:none;padding:.2rem .45rem;border-radius:4px;font-size:.7rem;font-weight:800;cursor:pointer">V</button>
            <button onclick="setBetResult('${b.id}','D')" title="Red"   style="background:var(--red);color:#fff;border:none;padding:.2rem .45rem;border-radius:4px;font-size:.7rem;font-weight:800;cursor:pointer">D</button>
            <button onclick="setBetResult('${b.id}','R')" title="Push"  style="background:var(--muted);color:#fff;border:none;padding:.2rem .45rem;border-radius:4px;font-size:.7rem;font-weight:800;cursor:pointer">R</button>
          ` : `<button onclick="setBetResult('${b.id}', null)" title="Reabrir" style="background:transparent;color:var(--muted);border:1px solid var(--border);padding:.2rem .45rem;border-radius:4px;font-size:.7rem;cursor:pointer">↺</button>`}
          <button onclick="deleteBet('${b.id}')" title="Excluir" style="background:transparent;color:var(--red);border:1px solid var(--red);padding:.2rem .45rem;border-radius:4px;font-size:.7rem;cursor:pointer">×</button>
        </td>
      </tr>`;
    }).join('');

    ctr.innerHTML = `
      <div class="section-title">📈 Bet Tracker</div>

      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.2rem;margin-bottom:1.2rem">
        <div style="font-size:.85rem;color:var(--muted);margin-bottom:.7rem;font-weight:700;text-transform:uppercase">➕ Nova aposta</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.6rem;margin-bottom:.7rem">
          <input id="bet-data" type="date" value="${new Date().toISOString().substring(0,10)}" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
          <select id="bet-liga" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
            ${Object.keys(LIGA_NOMES).map(l => `<option value="${l}" ${l===LIGA_ATUAL?'selected':''}>${LIGA_NOMES[l]}</option>`).join('')}
          </select>
          <input id="bet-m" type="text" placeholder="Mandante" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
          <input id="bet-v" type="text" placeholder="Visitante" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
          <input id="bet-favorito" type="text" placeholder="Favorito" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
          <select id="bet-linha" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
            <option value="-0.5">HT -0.5</option><option value="-1.0">HT -1.0</option>
            <option value="-1.0" selected>FT -1.0</option><option value="-1.5">FT -1.5</option>
            <option value="-2.0">FT -2.0</option><option value="-2.5">FT -2.5</option>
          </select>
          <input id="bet-odd" type="number" step="0.01" placeholder="Odd" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
          <input id="bet-stake" type="number" step="0.01" placeholder="Stake R$" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.55rem;border-radius:6px;font-size:.85rem">
        </div>
        <button onclick="addBet()" style="background:linear-gradient(135deg,var(--green),var(--blue));color:#0a1f1a;border:none;padding:.7rem 1.4rem;border-radius:8px;font-weight:800;cursor:pointer;font-size:.88rem">➕ Adicionar Aposta</button>
        <button onclick="addBetFromTopElite()" style="background:transparent;color:var(--gold);border:1px solid var(--gold);padding:.7rem 1.2rem;border-radius:8px;font-weight:700;cursor:pointer;font-size:.85rem;margin-left:.5rem" title="Pré-preenche com o primeiro pick ELITE da rodada carregada em Próximos Jogos">⚡ Pré-preencher Elite #1</button>
      </div>

      <div class="grid4" style="margin-bottom:1.5rem">
        <div class="stat-card"><div class="stat-label">Apostas</div><div class="stat-value">${aggLiga.n}</div><div class="stat-hint">${aggLiga.pendentes} pendentes</div></div>
        <div class="stat-card"><div class="stat-label">Win Rate (fechadas)</div><div class="stat-value" style="color:${aggLiga.wr>=55?'var(--green)':aggLiga.wr>=50?'var(--blue2)':'var(--muted)'}">${aggLiga.wr.toFixed(1)}%</div><div class="stat-hint">${aggLiga.V}V · ${aggLiga.D}D · ${aggLiga.R}R</div></div>
        <div class="stat-card"><div class="stat-label">ROI</div><div class="stat-value" style="color:${aggLiga.roi>=0?'var(--green)':'var(--red)'}">${aggLiga.roi>=0?'+':''}${aggLiga.roi.toFixed(1)}%</div><div class="stat-hint">R$ ${aggLiga.stake.toFixed(2)} apostados</div></div>
        <div class="stat-card"><div class="stat-label">Lucro / Prejuízo</div><div class="stat-value" style="color:${aggLiga.lucro>=0?'var(--green)':'var(--red)'}">${aggLiga.lucro>=0?'+':''}R$ ${aggLiga.lucro.toFixed(2)}</div><div class="stat-hint">${ligaSel==='todas'?'todas as ligas':LIGA_NOMES[ligaSel]}</div></div>
      </div>

      ${linhaRows ? `
        <div style="margin-bottom:1.2rem">
          <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">📊 Performance por linha HDP</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden">
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
              <thead><tr style="background:var(--bg3);text-align:left">
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Linha</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">N</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">V</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">D</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">R</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">WR</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">ROI</th>
              </tr></thead>
              <tbody>${linhaRows}</tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;flex-wrap:wrap;gap:.5rem">
        <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase">📋 Histórico de apostas (últimas 50)</div>
        <div style="display:flex;gap:.5rem;align-items:center">
          <span style="color:var(--muted);font-size:.75rem">Liga:</span>
          <select id="tracker-filtro-liga" onchange="renderTracker_()" style="background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.4rem .7rem;border-radius:6px;font-size:.78rem">${optsLiga}</select>
          <button onclick="exportarBets()" style="background:transparent;color:var(--blue2);border:1px solid var(--blue2);padding:.4rem .9rem;border-radius:6px;font-size:.75rem;cursor:pointer">📤 Exportar JSON</button>
        </div>
      </div>

      ${rows ? `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:var(--bg3);text-align:left">
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Data</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Jogo</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Liga</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Pick</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">Odd</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">Stake</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Status</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">L/P</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Ações</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      ` : `<div class="empty"><div class="eicon">📭</div><strong>Sem apostas ainda</strong><p>Use o formulário acima ou o botão "⚡ Pré-preencher Elite #1" depois de analisar uma rodada.</p></div>`}
    `;
  }

  function addBet() {
    const data = document.getElementById('bet-data').value;
    const liga = document.getElementById('bet-liga').value;
    const m = document.getElementById('bet-m').value.trim();
    const v = document.getElementById('bet-v').value.trim();
    const favorito = document.getElementById('bet-favorito').value.trim();
    const linha = document.getElementById('bet-linha').value;
    const odd = parseFloat(document.getElementById('bet-odd').value);
    const stake = parseFloat(document.getElementById('bet-stake').value);
    if (!m || !v || !favorito || !odd || !stake) { alert('Preencha todos os campos'); return; }
    const bets = lerBets();
    bets.push({
      id: 'bet_' + Date.now() + '_' + Math.random().toString(36).substring(2,7),
      data, liga, m, v, favorito, linha, odd, stake,
      resultado: null,
      criado_em: new Date().toISOString()
    });
    salvarBets(bets);
    renderTracker();
  }

  function addBetFromTopElite() {
    if (!PROXIMOS_JOGOS.length) { alert('Cole jogos em "Próximos Jogos" primeiro'); return; }
    const avaliados = PROXIMOS_JOGOS
      .map(c => HDP_MOTOR.avaliarElite(LIGA_ATUAL, c.m, c.v))
      .filter(a => a && a.passa)
      .sort((a, b) => b.razao - a.razao);
    if (!avaliados.length) { alert('Nenhum jogo ELITE na rodada atual'); return; }
    const top = avaliados[0];
    document.getElementById('bet-m').value = top.M;
    document.getElementById('bet-v').value = top.V;
    document.getElementById('bet-favorito').value = top.favorito;
    document.getElementById('bet-linha').value = top.linhaFT_rec;
    document.getElementById('bet-odd').value = (top.hdpFT[top.linhaFT_rec].oddJusta).toFixed(2);
    document.getElementById('bet-stake').value = '10.00';
  }

  function setBetResult(id, resultado) {
    const bets = lerBets();
    const b = bets.find(x => x.id === id);
    if (!b) return;
    b.resultado = resultado;
    b.fechado_em = resultado ? new Date().toISOString() : null;
    salvarBets(bets);
    renderTracker();
  }

  function deleteBet(id) {
    if (!confirm('Excluir esta aposta?')) return;
    const bets = lerBets().filter(x => x.id !== id);
    salvarBets(bets);
    renderTracker();
  }

  function exportarBets() {
    const bets = lerBets();
    const blob = new Blob([JSON.stringify(bets, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hdppro_bets_' + new Date().toISOString().substring(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ═══════════════════════════════════════════════════════════
  //  TELA 6 · BACKTEST (consome _resultado_ultimo.json se carregar)
  // ═══════════════════════════════════════════════════════════
  let _backtestCache = null;
  async function renderBacktest() {
    const ctr = document.getElementById('view-backtest');
    if (!ctr) return;

    // Tenta carregar relatório se ainda não tem.
    // Quando aberto via file://, fetch falha silenciosamente (CORS) — esperado.
    if (!_backtestCache && location.protocol !== 'file:') {
      try {
        const r = await fetch('backtest/_resultado_ultimo.json');
        if (r.ok) _backtestCache = await r.json();
      } catch (e) {}
    }

    if (!_backtestCache) {
      const ehFile = location.protocol === 'file:';
      ctr.innerHTML = `
        <div class="section-title">🔍 Backtest Cego</div>
        <div class="empty" style="max-width:720px;margin:0 auto">
          <div class="eicon">🔍</div>
          <strong>Relatório de backtest não disponível aqui</strong>
          ${ehFile ? `
            <p style="margin-top:.5rem;font-size:.82rem">Você abriu via <code>file://</code> — o navegador bloqueia leitura de arquivos JSON por segurança. <strong>O backtest funciona</strong>, só não dá pra exibir aqui.</p>
            <p style="margin-top:.8rem;font-size:.82rem">Pra ver o relatório:</p>
            <p style="margin-top:.3rem;font-size:.82rem">1. Rode no terminal:</p>
            <pre style="background:var(--bg);padding:.8rem 1rem;border-radius:6px;display:inline-block;text-align:left;color:var(--blue2);font-size:.78rem;margin-top:.4rem">node backtest/backtest_cego.js --grid</pre>
            <p style="margin-top:.6rem;font-size:.82rem">2. Veja o output direto no terminal — vai mostrar WR e ROI por liga.</p>
            <p style="margin-top:.6rem;font-size:.75rem;color:var(--muted)">Pra ver aqui na tela, precisaria servir via servidor local (<code>python -m http.server</code>, p.ex.).</p>
          ` : `
            <p>Rode no terminal:</p>
            <pre style="background:var(--bg);padding:.8rem 1rem;border-radius:6px;display:inline-block;text-align:left;color:var(--blue2);font-size:.78rem;margin-top:.8rem">node backtest/backtest_cego.js --grid</pre>
            <p style="margin-top:1rem;font-size:.78rem">Vai gerar <code>backtest/_resultado_ultimo.json</code> que esta tela consome.</p>
          `}
        </div>
      `;
      return;
    }

    const d = _backtestCache;
    const ligaRows = Object.entries(d.ligas).map(([l, info]) => {
      const a = info.agg;
      return `<tr style="border-top:1px solid var(--border)">
        <td style="padding:.55rem 1rem;font-weight:700">${l}</td>
        <td style="padding:.55rem 1rem;text-align:center">${info.X_atual}</td>
        <td style="padding:.55rem 1rem;text-align:center">${a.n}</td>
        <td style="padding:.55rem 1rem;text-align:center;color:var(--green)">${a.V}</td>
        <td style="padding:.55rem 1rem;text-align:center;color:var(--red)">${a.D}</td>
        <td style="padding:.55rem 1rem;text-align:center;color:var(--muted)">${a.R}</td>
        <td style="padding:.55rem 1rem;text-align:right;font-weight:700;color:${a.wr>=55?'var(--green)':a.wr>=50?'var(--blue2)':'var(--muted)'}">${a.wr.toFixed(1)}%</td>
        <td style="padding:.55rem 1rem;text-align:right;font-weight:800;color:${a.roi>=0?'var(--green)':'var(--red)'}">${a.roi>=0?'+':''}${a.roi.toFixed(1)}%</td>
      </tr>`;
    }).join('');

    const relaxRows = d.relaxado ? Object.entries(d.relaxado.agg_ligas).map(([l, a]) => {
      return `<tr style="border-top:1px solid var(--border)">
        <td style="padding:.55rem 1rem;font-weight:700">${l}</td>
        <td style="padding:.55rem 1rem;text-align:center">${a.n}</td>
        <td style="padding:.55rem 1rem;text-align:right;font-weight:700;color:${a.wr>=55?'var(--green)':a.wr>=50?'var(--blue2)':'var(--muted)'}">${a.wr.toFixed(1)}%</td>
        <td style="padding:.55rem 1rem;text-align:right;font-weight:800;color:${a.roi>=0?'var(--green)':'var(--red)'}">${a.roi>=0?'+':''}${a.roi.toFixed(1)}%</td>
      </tr>`;
    }).join('') : '';

    ctr.innerHTML = `
      <div class="section-title">🔍 Backtest Cego — relatório de ${new Date(d.gerado_em).toLocaleString('pt-BR')}</div>
      <div style="background:rgba(245,158,11,0.08);border:1px solid var(--amber);border-radius:10px;padding:.9rem 1.2rem;margin-bottom:1.2rem;font-size:.82rem;color:var(--text)">
        ⚠️ <strong>Banco atual é insuficiente</strong> para calibração estatisticamente robusta (cada liga tem 87-268 jogos; o walk-forward consome ~15 de aquecimento, deixando volume baixo de picks). Os X em uso são <strong>preliminares</strong> e serão ajustados quando o Bet Tracker construir base real de apostas.
      </div>

      <div style="margin-bottom:1.5rem">
        <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">🥇 Modo ESTRITO (filtro Elite completo: ranking + diff + prob da linha)</div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden">
          <table style="width:100%;border-collapse:collapse;font-size:.85rem">
            <thead><tr style="background:var(--bg3);text-align:left">
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Liga</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">X</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Picks</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">V</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">D</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">R</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">WR</th>
              <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">ROI</th>
            </tr></thead>
            <tbody>${ligaRows}</tbody>
          </table>
        </div>
      </div>

      ${relaxRows ? `
        <div>
          <div style="font-size:.85rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:.6rem">🧪 Modo RELAXADO (só diff + prob, sem filtro de ranking) — saúde do motor base</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden">
            <table style="width:100%;border-collapse:collapse;font-size:.85rem">
              <thead><tr style="background:var(--bg3);text-align:left">
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase">Liga</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:center">Picks</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">WR</th>
                <th style="padding:.7rem 1rem;color:var(--muted);font-size:.7rem;text-transform:uppercase;text-align:right">ROI</th>
              </tr></thead>
              <tbody>${relaxRows}</tbody>
            </table>
          </div>
        </div>
      ` : ''}
    `;
  }

  function renderTracker_() { renderTracker(); }

  // ═══════════════════════════════════════════════════════════
  //  EXPORT GLOBAL (handlers chamados via onclick)
  // ═══════════════════════════════════════════════════════════
  window.trocarLiga = trocarLiga;
  window.setNavGrupo = setNavGrupo;
  window.showView = showView;
  window.setRankingPeriodo = setRankingPeriodo;
  window.setTimeAtual = setTimeAtual;
  window.analisarProximos = analisarProximos;
  window.trocarLigaEReanalisar = trocarLigaEReanalisar;
  window.limparProximos = limparProximos;
  window.setProximosAba = setProximosAba;
  window.exportarRelatorioHDP = exportarRelatorioHDP;
  window.addBet = addBet;
  window.addBetFromTopElite = addBetFromTopElite;
  window.setBetResult = setBetResult;
  window.deleteBet = deleteBet;
  window.exportarBets = exportarBets;
  window.renderTracker_ = renderTracker_;

  // ═══════════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════════
  window.addEventListener('DOMContentLoaded', () => {
    if (!window.HDP_BANCO || !window.HDP_RANKINGS || !window.HDP_MOTOR) {
      document.body.innerHTML = '<div style="padding:3rem;text-align:center;font-family:sans-serif;color:#ef4444"><h1>❌ Erro de inicialização</h1><p>Banco ou motor não carregados. Rode <code>node data/_build_banco.js</code> e recarregue.</p></div>';
      return;
    }
    document.getElementById('liga-selector').value = LIGA_ATUAL;
    trocarLiga(LIGA_ATUAL);
    showView('dashboard');
  });
})();
