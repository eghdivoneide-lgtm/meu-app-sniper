const fs = require('fs');
const html = fs.readFileSync('c:\\Users\\egnal\\OneDrive\\Área de Trabalho\\MEU APP\\especialista-cantos\\index.html', 'utf8');
const start = html.indexOf('function avg(arr)');
const end = html.indexOf('function renderDashboard()');
let motor = html.slice(start, end).trim();
motor = `let DADOS_2026 = window.DADOS_MLS;\n` + motor;
fs.writeFileSync('c:\\Users\\egnal\\OneDrive\\Área de Trabalho\\MEU APP\\especialista-cantos\\auditor\\motor-matematico.js', motor);
console.log('Motor clonado com sucesso!');
