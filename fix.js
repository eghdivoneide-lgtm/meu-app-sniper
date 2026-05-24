const fs = require('fs');
let c = fs.readFileSync('c:\\Users\\egnal\\OneDrive\\Área de Trabalho\\MEU APP\\EDS-Analise-ODDS\\especialista-cantos\\index.html', 'utf8');

c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$\{/g, '${');

fs.writeFileSync('c:\\Users\\egnal\\OneDrive\\Área de Trabalho\\MEU APP\\EDS-Analise-ODDS\\especialista-cantos\\index.html', c);
