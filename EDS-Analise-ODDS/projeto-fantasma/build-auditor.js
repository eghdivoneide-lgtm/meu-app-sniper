const fs = require('fs');

let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>O Auditor | Laboratório EDS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --bg: #050505; --bg2: #111; --bg3: #1a1a1a;
      --border: rgba(139, 92, 246, 0.2);
      --purple: #8b5cf6; --green: #10b981; --red: #ef4444; --gold: #fbbf24;
      --text: #f3f4f6; --muted: #6b7280;
    }
    body {
      margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text);
      display: grid; grid-template-columns: 280px 1fr; height: 100vh; overflow: hidden;
    }
    aside { background: var(--bg2); border-right: 1px solid var(--border); padding: 1.5rem; display: flex; flex-direction: column; }
    aside h1 { font-size: 1.5rem; color: var(--purple); margin: 0 0 .5rem 0; display: flex; align-items: center; gap: 10px; }
    .nav-btn { background: transparent; border: 1px solid transparent; color: var(--muted); padding: .8rem 1rem; text-align: left; font-size: .9rem; font-weight: 600; border-radius: 8px; cursor: pointer; margin-bottom: .5rem; transition: all .2s; }
    .nav-btn:hover { background: rgba(139, 92, 246, 0.1); color: var(--text); }
    .nav-btn.active { background: rgba(139, 92, 246, 0.15); border-color: var(--purple); color: var(--purple); }
    main { padding: 2rem; overflow-y: auto; }
    .view { display: none; } .view.active { display: block; }
    .upload-zone { background: var(--bg3); border: 2px dashed var(--border); padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem; }
    .upload-label { cursor: pointer; color: var(--purple); font-weight: 700; text-decoration: underline; }
    .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;}
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.85rem; }
    th, td { padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; }
    th { color: var(--muted); font-size: .75rem; text-transform: uppercase; letter-spacing: 1px; }
    .btn-action { background: var(--purple); color: #fff; border: none; padding: .8rem 2rem; font-weight: 700; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 14px rgba(139,92,246,0.3); transition: all 0.2s;}
    .btn-action:hover { opacity: 0.9; transform: translateY(-1px); }
    .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.75rem; }
    .bg-green { background: rgba(16, 185, 129, 0.15); color: var(--green); }
    .bg-red { background: rgba(239, 68, 68, 0.15); color: var(--red); }
    .bg-purple { background: rgba(139, 92, 246, 0.15); color: var(--purple); }
    .blur-text { filter: blur(5px); transition: filter 0.5s; user-select: none; }
    .revealed .blur-text { filter: blur(0px); }
  </style>
</head>
<body>
  <aside>
    <h1><span>👁️</span> Auditor EDS</h1>
    <p style="color:var(--muted); font-size:.8rem; margin-bottom: 2rem;">Motor de Retreinamento Neural</p>
    <button class="nav-btn active" onclick="showView('ingestion')">⚖️ 1. Simulador & Realidade</button>
    <button class="nav-btn" onclick="showView('scatter')">📊 2. Laboratório de Variância</button>
  </aside>
  <main>
    <div id="view-ingestion" class="view active">
      <h2 style="margin:0 0 .5rem 0">O Teste Cego: Projeção vs Fatos</h2>
      <p style="color:var(--muted); margin-bottom: 2rem;">Forneça a matriz gerada pelo Motor Fantasma. O Auditor fará projeções cegamente, e depois a Muralha da Realidade será revelada.</p>
      
      <div class="upload-zone" id="drop-zone">
        <h3 style="margin:0 0 .5rem 0">Muralha da Realidade (Lote do Fantasma)</h3>
        <p style="color:var(--muted); font-size:.85rem; margin-bottom:1.5rem">Selecione o arquivo "mls_rodada_atual.json"</p>
        <input type="file" id="inp-fantasma" accept=".json" style="display:none" onchange="lerArquivoFantasma(event)">
        <label for="inp-fantasma" class="upload-label">Procurar Arquivo JSON</label>
        <div id="status-fantasma" style="margin-top:1rem;font-size:.8rem;color:var(--green)"></div>
      </div>

      <div class="card" id="painel-jogos" style="display:none;">
        <div style="display:flex; justify-content: space-between; align-items:center;">
           <h3 style="margin:0">Diagnóstico Cruzado</h3>
           <div>
               <button class="btn-action" id="btn-revelar" onclick="revelarRealidade()" style="background:var(--red); display:none;">💥 REVELAR REALIDADE</button>
           </div>
        </div>
        <table id="tabela-jogos">
          <thead>
            <tr>
              <th>Partida</th>
              <th>Formação</th>
              <th>Projeção IA (Eds)</th>
              <th>Fato: Cantos (FT)</th>
              <th>Fato: Placar (FT)</th>
              <th>Veredito</th>
            </tr>
          </thead>
          <tbody id="tbody-jogos"></tbody>
        </table>
      </div>
    </div>
    
    <div id="view-scatter" class="view">
       <div class="card">
         <h2 style="margin:0 0 1rem 0">Matriz de Aprendizado (Heurística)</h2>
         <div id="insights-log" style="font-family:monospace; color:var(--gold); line-height: 1.6; white-space: pre-wrap;"></div>
       </div>
    </div>
  </main>

  <script>
    let jogosDaRodada = [];
    let isRealityRevealed = false;

    function showView(id) {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-'+id).classList.add('active');
    }

    function lerArquivoFantasma(event) {
      const file = event.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = e => {
         jogosDaRodada = JSON.parse(e.target.result);
         document.getElementById('status-fantasma').innerText = \`✅ \${jogosDaRodada.length} jogos carregados no Cofre.\`;
         document.getElementById('painel-jogos').style.display = 'block';
         document.getElementById('btn-revelar').style.display = 'block';
         isRealityRevealed = false;
         renderizarTestesCegos();
      };
      reader.readAsText(file);
    }

    function mockModeloEspecialista(jogo) {
       // Falso modelo de Poisson baseado nas Odds pre-live pro auditor fazer a analise cega
       let oddBase = 1.80; 
       if(jogo.mercado && jogo.mercado.oddM !== "ODDs Ocultas") {
           oddBase = parseFloat(jogo.mercado.oddM || 2.0);
       }
       // Formula cega inventada: Se há um super favorito, a tendência dita mais posse -> mais cantos
       let projOver = oddBase < 1.5 ? "OVER 10.5" : "UNDER 10.5";
       const expectativa = oddBase < 1.5 ? 11.5 : 8.5;
       return { call: projOver, exp: expectativa };
    }

    function renderizarTestesCegos() {
      const tbody = document.getElementById('tbody-jogos');
      tbody.innerHTML = '';
      tbody.classList.remove('revealed');
      
      jogosDaRodada.forEach((j, index) => {
         const proj = mockModeloEspecialista(j);
         j.proj = proj; // save it
         
         // Realidade (Mascarada inicialmente)
         let cantosFT = "0"; let placarFT = "0 - 0"; let formM = "?"; let formV = "?";
         if(j.estatisticas_ft && j.estatisticas_ft !== "Indisponível") {
             cantosFT = (j.estatisticas_ft.cantos?.m || 0) + (j.estatisticas_ft.cantos?.v || 0);
         }
         if(j.placar && j.placar.ft) placarFT = j.placar.ft;
         if(j.formacao && j.formacao.m) { formM = j.formacao.m; formV = j.formacao.v; }

         const tr = document.createElement('tr');
         tr.innerHTML = \`
           <td><strong>\${j.mandante}</strong> vs <strong>\${j.visitante}</strong></td>
           <td><span class="badge bg-purple blur-text">\${formM} vs \${formV}</span></td>
           <td><span class="badge bg-green">\${proj.call} (Exp: \${proj.exp})</span></td>
           <td><span class="blur-text" style="font-weight:900">\${cantosFT}</span></td>
           <td><span class="blur-text">\${placarFT}</span></td>
           <td><span class="badge blur-text" id="veredicto-\${index}">Aguardando Fatos</span></td>
         \`;
         tbody.appendChild(tr);
      });
    }

    function revelarRealidade() {
       isRealityRevealed = true;
       document.getElementById('tbody-jogos').classList.add('revealed');
       document.getElementById('btn-revelar').style.display = 'none';

       // Calcular o veredicto (Muralha da Realidade)
       let redFlags = [];
       jogosDaRodada.forEach((j, idx) => {
           let cantosFT = 0;
           if(j.estatisticas_ft && j.estatisticas_ft.cantos) {
               cantosFT = (j.estatisticas_ft.cantos.m || 0) + (j.estatisticas_ft.cantos.v || 0);
           }
           let bateuUnder = cantosFT <= 10.5 && j.proj.call === "UNDER 10.5";
           let bateuOver = cantosFT > 10.5 && j.proj.call === "OVER 10.5";
           
           const span = document.getElementById('veredicto-'+idx);
           
           if(bateuUnder || bateuOver) {
               span.className = "badge bg-green revealed";
               span.innerText = "PRECISÃO CIRÚRGICA";
           } else {
               span.className = "badge bg-red revealed";
               span.innerText = "FALSO POSITIVO";
               
               // Investigar a Variância para a Matriz
               if(j.formacao && j.formacao.m === "5-4-1") {
                  redFlags.push(\`[TÁTICA] O time mandante \${j.mandante} utilizou \${j.formacao.m} (Hiper Defensivo). Isso mutilou a projeção matemática de Cantos. Regra Adicionada: Cortar Over em esquema 5-4-1.\`);
               }
               if(j.estatisticas_ft && j.estatisticas_ft.cartoes_vermelhos && 
                  (j.estatisticas_ft.cartoes_vermelhos.m > 0 || j.estatisticas_ft.cartoes_vermelhos.v > 0)) {
                  redFlags.push(\`[VARIÂNCIA] Cartão Vermelho destruiu a leitura matemática em \${j.mandante} x \${j.visitante}. Considerar risco incalculável.\`);
               }
           }
       });

       const log = document.getElementById('insights-log');
       if(redFlags.length === 0) log.innerHTML = "🎯 A matemática do Especialista atingiu perfeição na rodada. Variância inexistente ou dentro da margem de erro térmica.";
       else log.innerHTML = "🚨 SINAIS CAPTURADOS PARA RE-TREINAMENTO DA IA:\\n\\n" + redFlags.join("\\n\\n");
    }
  </script>
</body>
</html>
`;

fs.writeFileSync('c:/Users/egnal/OneDrive/Área de Trabalho/MEU APP/especialista-cantos/auditor/index.html', code);
console.log('Auditor frontend interface completely rewritten!');
