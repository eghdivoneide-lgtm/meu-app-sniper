const fs = require('fs');
const filePath = 'c:\\Users\\egnal\\OneDrive\\Área de Trabalho\\MEU APP\\EDS-Analise-ODDS\\especialista-cantos\\index.html';
let c = fs.readFileSync(filePath, 'utf8');

const targetStr = 'async function exportarRelatorioTeacherVisuais() {';
const start = c.indexOf(targetStr);
const endFunc = c.indexOf('// ══════════════════════════════════════════════════\r\n//  INIT');
const end = endFunc > -1 ? endFunc : c.indexOf('// ══════════════════════════════════════════════════\n//  INIT');

const newFunc = `async function exportarRelatorioTeacherVisuais() {
  if(!jogosFuturos || jogosFuturos.length === 0) {
    alert('Nenhum jogo na rodada para exportar. Importe jogos primeiro na aba "Adicionar Jogos".');
    return;
  }

  // Pegamos a folha de estilos principal da página para usar no laudo exportado
  const stylesObj = document.querySelector('style');
  const baseStyles = stylesObj ? stylesObj.innerHTML : '';

  // Pegamos o conteúdo renderizado da Aba TEACHER (que tem exatamente a estrutura que o usuário quer)
  const wrapper = document.getElementById('wrapper-teacher');
  let teacherContent = wrapper ? wrapper.innerHTML : '';

  // Removemos o botão de "Abrir Análise" que não vai funcionar fora do App local
  teacherContent = teacherContent.replace(/<div style="padding:\\.6rem 1\\.2rem 1rem;text-align:center">\\s*<button onclick="carregarProjecaoExata[^>]+>[\\s\\S]*?<\\/button>\\s*<\\/div>/g, '');

  const dataExt = new Date().toISOString().split('T')[0];
  const nomeArq = \`Relatorio_Teacher_Completo_\${dataExt}.html\`;

  const htmlContent = \`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório TEACHER - \${dataExt}</title>
      <style>
        \${baseStyles}
        body {
          background: var(--bg);
          padding: 2rem;
          color: var(--text);
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          margin: 0;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        .cabecalho-export {
          text-align: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--green);
        }
        .cabecalho-export h1 {
          color: var(--green);
          margin: 0;
          font-size: 2.2rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .cabecalho-export p {
          color: var(--muted);
          margin-top: 0.5rem;
          font-size: 1rem;
        }
        /* Garantir que .glass-panel renderize bem fora do App */
        .glass-panel {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .conf-bar-bg { background: rgba(255,255,255,0.06); height: 6px; border-radius: 3px; overflow: hidden; }
        .conf-bar { background: var(--green); height: 100%; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="cabecalho-export">
          <h1>🏗️ PROJEÇÃO TEACHER VISUAL</h1>
          <p>Relatório Consolidado da Rodada — \${jogosFuturos.length} Jogos</p>
          <div style="font-size:0.85rem; color:#fca5a5; margin-top:0.5rem">Data: \${new Date().toLocaleDateString('pt-BR')} às \${new Date().toLocaleTimeString('pt-BR')}</div>
        </div>
        
        <!-- O conteúdo importado dinamicamente exatamente igual ao site -->
        \${teacherContent}
        
        <div style="text-align:center; padding-top:2rem; margin-top:2rem; border-top:1px solid var(--border); color:var(--muted); font-size:0.8rem">
          Gerado pelo Especialista em Cantos | Baseado no algoritmo Teacher
        </div>
      </div>
    </body>
    </html>
  \`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nomeArq;
  a.click();
  URL.revokeObjectURL(a.href);
  alert('✅ Relatório Visual (HTML) exportado com formato IDÊNTICO ao App!');
}\n\n`;

c = c.substring(0, start) + newFunc + c.substring(end);
fs.writeFileSync(filePath, c);
console.log('Done replacement');
