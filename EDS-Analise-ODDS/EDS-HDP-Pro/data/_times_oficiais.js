// EDS-HDP-Pro · Listas oficiais de times por liga + aliases
//
// FONTE DE VERDADE: clonado do especialista-cantos/data/*.js (banco oficial do operador)
// Última sincronização: 2026-05-24
//
// Duas estruturas:
//   1) TIMES_OFICIAIS  — lista canônica deduplicada (alinhada com o especialista)
//   2) ALIASES         — mapeia variantes de grafia → nome canônico

// ═══════════════════════════════════════════════════════════════════
//  TIMES OFICIAIS POR LIGA — clonados do especialista-cantos
// ═══════════════════════════════════════════════════════════════════

const TIMES_OFICIAIS = {
  // BR (Brasileirão Série A 2026) — 20 times únicos
  // Especialista tinha 28 entradas (duplicatas de grafia); deduplicadas via ALIASES.
  BR: [
    'Athletico-PR', 'Atlético-MG', 'Bahia', 'Botafogo', 'Red Bull Bragantino',
    'Chapecoense', 'Corinthians', 'Coritiba', 'Cruzeiro', 'Flamengo',
    'Fluminense', 'Grêmio', 'Internacional', 'Mirassol', 'Palmeiras',
    'Remo', 'Santos', 'São Paulo', 'Vasco', 'Vitória'
  ],

  // BR_B (Brasileirão Série B 2026) — 20 times (especialista já estava limpo)
  BR_B: [
    'America MG', 'Athletic Club', 'Atletico GO', 'Avai', 'Botafogo SP',
    'CRB', 'Ceara', 'Criciuma', 'Cuiaba', 'Fortaleza',
    'Goias', 'Juventude', 'Londrina', 'Nautico', 'Novorizontino',
    'Operario-PR', 'Ponte Preta', 'Sao Bernardo', 'Sport Recife', 'Vila Nova FC'
  ],

  // ARG (Liga Profesional Argentina 2026) — 30 times
  ARG: [
    'Aldosivi', 'Argentinos Jrs', 'Atl. Tucuman', 'Banfield', 'Barracas Central',
    'Belgrano', 'Boca Juniors', 'Central Cordoba', 'Defensa y Justicia', 'Dep. Riestra',
    'Estudiantes L.P.', 'Estudiantes Rio Cuarto', 'Gimnasia L.P.', 'Gimnasia Mendoza', 'Huracan',
    'Ind. Rivadavia', 'Independiente', 'Instituto', 'Lanus', 'Newells Old Boys',
    'Platense', 'Racing Club', 'River Plate', 'Rosario Central', 'San Lorenzo',
    'Sarmiento Junin', 'Talleres Cordoba', 'Tigre', 'Union de Santa Fe', 'Velez Sarsfield'
  ],

  // ARG_B (Primera Nacional 2026) — 36 times (2 zonas)
  ARG_B: [
    'Acassuso', 'Agropecuario', 'All Boys', 'Almagro', 'Almirante Brown',
    'Atl. Rafaela', 'Atletico Atlanta', 'CA Estudiantes', 'CA Mitre', 'Central Norte',
    'Chacarita Juniors', 'Chaco For Ever', 'Ciudad Bolivar', 'Club A. Guemes', 'Colegiales',
    'Colon Santa Fe', 'Def. de Belgrano', 'Deportivo Madryn', 'Deportivo Maipu', 'Deportivo Moron',
    'Ferro', 'Gimnasia Jujuy', 'Gimnasia y Tiro', 'Godoy Cruz', 'Los Andes',
    'Midland', 'Nueva Chicago', 'Patronato', 'Quilmes', 'Racing Cordoba',
    'San Martin S.J.', 'San Martin T.', 'San Miguel', 'San Telmo', 'Temperley', 'Tristan Suarez'
  ],

  // MLS 2026 — 30 times (com San Diego FC novo)
  MLS: [
    'Atlanta Utd', 'Austin FC', 'CF Montreal', 'Charlotte', 'Chicago Fire',
    'Colorado Rapids', 'Columbus Crew', 'DC United', 'FC Cincinnati', 'FC Dallas',
    'Houston Dynamo', 'Inter Miami', 'Los Angeles FC', 'Los Angeles Galaxy', 'Minnesota United',
    'Nashville SC', 'New England Revolution', 'New York City', 'New York Red Bulls', 'Orlando City',
    'Philadelphia Union', 'Portland Timbers', 'Real Salt Lake', 'San Diego FC', 'San Jose Earthquakes',
    'Seattle Sounders', 'Sporting Kansas City', 'St. Louis City', 'Toronto FC', 'Vancouver Whitecaps'
  ],

  // USL Championship 2026 — 25 times
  USL: [
    'Birmingham', 'Brooklyn', 'Charleston', 'Colorado Springs', 'Detroit',
    'El Paso', 'FC Tulsa', 'Hartford Athletic', 'Indy Eleven', 'Las Vegas Lights',
    'Lexington', 'Loudoun', 'Louisville City', 'Miami FC', 'Monterey Bay',
    'New Mexico', 'Oakland Roots', 'Orange County SC', 'Phoenix Rising', 'Pittsburgh',
    'Rhode Island', 'Sacramento Republic', 'San Antonio', 'Sporting Jax', 'Tampa Bay'
  ]
};

// ═══════════════════════════════════════════════════════════════════
//  ALIASES — "como aparece no banco" → "nome canônico em TIMES_OFICIAIS"
//  Aplicado ANTES de filtrar pela lista oficial
// ═══════════════════════════════════════════════════════════════════

const ALIASES = {
  // BR — 8 pares de duplicatas no banco do especialista
  BR: {
    'Atletico-MG':           'Atlético-MG',
    'Atletico MG':           'Atlético-MG',
    'Atlético MG':           'Atlético-MG',
    'Gremio':                'Grêmio',
    'Sao Paulo':             'São Paulo',
    'Vitoria':               'Vitória',
    'Bragantino':            'Red Bull Bragantino',
    'RB Bragantino':         'Red Bull Bragantino',
    'Flamengo RJ':           'Flamengo',
    'Botafogo RJ':           'Botafogo',
    'Chapecoense-SC':        'Chapecoense'
  },

  // BR_B — sem duplicatas detectadas
  BR_B: {},

  // ARG — sem duplicatas detectadas
  ARG: {},

  // ARG_B — sem duplicatas detectadas
  ARG_B: {},

  // MLS — sem duplicatas detectadas
  MLS: {},

  // USL — sem duplicatas detectadas
  USL: {}
};

// ═══════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════

function aliasOuOriginal(liga, nome) {
  const map = ALIASES[liga] || {};
  return map[nome] || nome;
}

const _OFICIAIS_SET = {};
for (const liga of Object.keys(TIMES_OFICIAIS)) {
  _OFICIAIS_SET[liga] = new Set(TIMES_OFICIAIS[liga]);
}
function ehOficialFast(liga, nome) {
  return _OFICIAIS_SET[liga] ? _OFICIAIS_SET[liga].has(nome) : false;
}

module.exports = { TIMES_OFICIAIS, ALIASES, aliasOuOriginal, ehOficialFast };
