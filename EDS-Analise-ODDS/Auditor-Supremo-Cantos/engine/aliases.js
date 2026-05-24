// ════════════════════════════════════════════════════════════════════
// ALIASES — Normaliza nomes de times entre fontes diferentes
// O varredor (projeto-fantasma) e o banco (especialista-cantos/data)
// às vezes têm grafias diferentes para o mesmo time. Este mapa unifica.
// ════════════════════════════════════════════════════════════════════

// Map: <nome no varredor/JSON externo>  →  <nome canônico no banco>
const ALIASES = {
  BR: {
    'Gremio':          'Grêmio',
    'Flamengo RJ':     'Flamengo',
    'Sao Paulo':       'São Paulo',
    'Chapecoense-SC':  'Chapecoense',
    'Bragantino':      'Red Bull Bragantino',
    'Atletico-MG':     'Atlético-MG',
    'Botafogo RJ':     'Botafogo',
    'Vitoria':         'Vitória'
  },
  BR_B:  {},
  MLS:   {},
  USL:   {},
  ARG:   {},
  ARG_B: {},
  BUN:   {}
};

// ────────────────────────────────────────────────────────────────────
// Normaliza um nome de time para o nome canônico do banco.
// Tenta: (1) alias direto; (2) match exato; (3) match insensível a
// acentos/case; (4) match de prefixo. Retorna o nome canônico ou
// o original se não achar.
// ────────────────────────────────────────────────────────────────────
function semAcentos(s) {
  return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function normalizarTime(nome, liga, timesDoBanco) {
  if (!nome) return nome;
  const aliasesLiga = ALIASES[liga] || {};

  // (1) Alias direto
  if (aliasesLiga[nome]) return aliasesLiga[nome];

  // (2) Match exato no banco
  if (timesDoBanco && timesDoBanco.includes(nome)) return nome;

  // (3) Match insensível a acentos
  if (timesDoBanco) {
    const semAc = semAcentos(nome).toLowerCase();
    const match = timesDoBanco.find(t => semAcentos(t).toLowerCase() === semAc);
    if (match) return match;
  }

  // (4) Match de prefixo (último recurso, ambíguo)
  if (timesDoBanco) {
    const prefixo4 = semAcentos(nome).toLowerCase().slice(0, 4);
    const candidatos = timesDoBanco.filter(t =>
      semAcentos(t).toLowerCase().startsWith(prefixo4)
    );
    if (candidatos.length === 1) return candidatos[0];
  }

  return nome;  // sem match — vai falhar no F1, o que está ok
}

module.exports = { ALIASES, normalizarTime, semAcentos };
