/**
 * MESCLADOR — copia campos RICOS dos arquivos rodadas/<LIGA>/ para o BANCO
 * sem apagar os campos POBRES (preserva compatibilidade do app).
 *
 * Uso: node _mesclar_ricos_no_banco.js --liga MLS
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const LIGA = (args[args.indexOf('--liga') + 1] || 'MLS').toUpperCase();

const ROOT = path.join(__dirname, '..', '..');
const PASTAS_CANDIDATAS = [
  'EDS-Analise-ODDS/especialista-cantos/data',
  'especialista-cantos/data',
  'EDS-Analise-ODDS/Yaaken-Scanner/yaaken-data'
];
const ARQUIVOS = {
  BR:'brasileirao2026.js', BR_B:'brasileiraoB2026.js', MLS:'mls2026.js',
  USL:'usl2026.js', ARG:'argentina2026.js', ARG_B:'argentina_b2026.js',
  BUN:'bundesliga2026.js', J2J3:'j2j3league2026.js',
  J1:'j1league2026.js', CHI:'chile2026.js', ECU:'equador2026.js',
  CHN_SL:'chinasuper2026.js', CHN_L1:'chinaone2026.js'
};
const VAR_JS = {
  BR:'DADOS_BR', BR_B:'DADOS_BR_B', MLS:'DADOS_MLS', USL:'DADOS_USL',
  ARG:'DADOS_ARG', ARG_B:'DADOS_ARG_B', BUN:'DADOS_BUN', J2J3:'DADOS_J2_J3',
  J1:'DADOS_J1', CHI:'DADOS_CHI', ECU:'DADOS_ECU',
  CHN_SL:'DADOS_CHN_SUP', CHN_L1:'DADOS_CHN_1'
};

const pastaRicos = path.join(__dirname, 'rodadas', LIGA);
const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const dataHoje = new Date().toISOString().slice(0, 10);

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log(`  🔗 MESCLADOR ${LIGA} — Pobre + Rico = Banco Uniforme`);
console.log('═══════════════════════════════════════════════════════');

// 1. Carregar mapa de jogos ricos (chaveados por match_id E por id_antigo se houver)
const arquivosRicos = fs.readdirSync(pastaRicos).filter(f =>
  f.endsWith('.json') && !f.includes('.backup_') && !f.includes('_log')
);
const ricosMap = new Map();        // chave: match_id Flashscore
const ricosMapAntigo = new Map();  // chave: id_antigo (órfão resolvido)
arquivosRicos.forEach(f => {
  const dados = JSON.parse(fs.readFileSync(path.join(pastaRicos, f), 'utf8'));
  const jogos = Array.isArray(dados) ? dados : Object.values(dados);
  jogos.forEach(j => {
    if (j.match_id && j.estatisticas_ft && j.estatisticas_ft.chutes_alvo) {
      if (!ricosMap.has(j.match_id) ||
          (j.meta?.timestamp_extracao > (ricosMap.get(j.match_id).meta?.timestamp_extracao || ''))) {
        ricosMap.set(j.match_id, j);
      }
      // Indexação também por id_antigo se for um órfão resolvido
      if (j.id_antigo) {
        ricosMapAntigo.set(j.id_antigo, j);
      }
    }
  });
});
console.log(`  📥 Arquivos ricos carregados: ${arquivosRicos.length}`);
console.log(`  📥 Jogos ricos únicos disponíveis: ${ricosMap.size}`);

// 2. Localizar arquivos do banco (3 caminhos)
const alvos = PASTAS_CANDIDATAS
  .map(p => path.join(ROOT, p, ARQUIVOS[LIGA]))
  .filter(p => fs.existsSync(p));
console.log(`  📂 Bancos alvo encontrados: ${alvos.length}`);
console.log('');

let mergesTotal = 0;

alvos.forEach(alvo => {
  const src = fs.readFileSync(alvo, 'utf8');
  const sandbox = { window: {} };
  const code = src.replace(/^\s*\/\/.*$/gm, '');
  new Function('window', code)(sandbox.window);
  const dados = sandbox.window[VAR_JS[LIGA]];
  if (!dados || !Array.isArray(dados.jogos)) {
    console.log(`  ⚠️  Estrutura inválida em ${alvo}`);
    return;
  }

  let merges = 0, jaRicos = 0, semRicoDisponivel = 0, inseridos = 0;
  const idsNoBanco = new Set();

  dados.jogos = dados.jogos.map(j => {
    const idK = j.match_id || j.id;
    if (idK) idsNoBanco.add(idK);
    return j;
  });

  dados.jogos = dados.jogos.map(j => {
    const id = j.match_id || j.id;
    if (!id) return j;

    // Já é rico?
    if (j.estatisticas_ft && j.estatisticas_ft.chutes_alvo) {
      jaRicos++;
      return j;
    }

    // Tenta primeiro como Flash ID direto
    let rico = ricosMap.get(id);
    let resolvidoPorAntigo = false;

    // Se não achou e o ID é "artificial" (órfão), tenta via id_antigo
    if (!rico && ricosMapAntigo.has(id)) {
      rico = ricosMapAntigo.get(id);
      resolvidoPorAntigo = true;
    }

    if (!rico) {
      semRicoDisponivel++;
      return j;
    }

    // MERGE: mantém campos pobres + adiciona campos ricos
    merges++;
    const novo = {
      ...j,
      url: rico.url,
      liga: rico.liga,
      codigo_liga: rico.codigo_liga,
      data_partida: rico.data_partida || j.data,
      estatisticas_ft: rico.estatisticas_ft,
      estatisticas_ht: rico.estatisticas_ht,
      formacao: rico.formacao,
      mercado: rico.mercado,
      meta: rico.meta,
      placar_str: rico.placar
    };
    // Se resolveu via id_antigo, ATUALIZA o match_id pro real do Flashscore
    if (resolvidoPorAntigo) {
      novo.match_id_antigo = id;
      novo.match_id = rico.match_id;
      novo.id = rico.match_id;
    }
    return novo;
  });

  // Helper pra converter placar string "X - Y" em {m,v}
  function parsePlacar(p) {
    if (!p || typeof p !== 'string' || !p.includes(' - ')) return null;
    const [m, v] = p.split(' - ').map(x => parseInt(x));
    return isNaN(m) || isNaN(v) ? null : { m, v };
  }

  // INSERT: jogos ricos que ainda NÃO estão no banco
  ricosMap.forEach((rico, mid) => {
    if (idsNoBanco.has(mid)) return; // já cuidou no map acima
    const ft = parsePlacar(rico.placar?.ft);
    const ht = parsePlacar(rico.placar?.ht);
    const ef = rico.estatisticas_ft || {};
    const eh = rico.estatisticas_ht || {};
    const novo = {
      match_id: rico.match_id,
      id: rico.match_id,
      mandante: rico.mandante,
      visitante: rico.visitante,
      data: rico.data_partida || '',
      rodada: rico.rodada || null,
      fonte: 'varredor-rodada-v4-pos-fix',
      gols: { ht: ht || null, ft: ft || null },
      cantos: { ht: eh.cantos || { m:0, v:0 }, ft: ef.cantos || { m:0, v:0 } },
      stats_taticas: { posse: ef.posse || { m:50, v:50 }, finalizacoes: ef.finalizacoes || { m:0, v:0 } },
      placar: ft || null,
      url: rico.url,
      liga: rico.liga,
      codigo_liga: rico.codigo_liga,
      data_partida: rico.data_partida,
      estatisticas_ft: ef,
      estatisticas_ht: eh,
      formacao: rico.formacao,
      mercado: rico.mercado,
      meta: rico.meta,
      placar_str: rico.placar
    };
    dados.jogos.push(novo);
    inseridos++;
  });

  // Atualiza lista de times
  const timesSet = new Set(dados.times || []);
  dados.jogos.forEach(j => {
    if (j.mandante) timesSet.add(j.mandante);
    if (j.visitante) timesSet.add(j.visitante);
  });
  dados.times = Array.from(timesSet).sort();

  dados.ultimaAtualizacao = dataHoje;

  // Backup
  fs.copyFileSync(alvo, alvo + '.backup_' + ts);

  // Escreve
  const out =
    '// ============================================================\n' +
    `// ${LIGA} 2026 — Mesclagem Rico+Pobre (uniformização)\n` +
    `// ${dados.jogos.length} jogos | Atualizado: ${dados.ultimaAtualizacao}\n` +
    '// ============================================================\n\n' +
    `window.${VAR_JS[LIGA]} = ${JSON.stringify(dados, null, 2)};\n`;
  fs.writeFileSync(alvo, out);

  const rel = alvo.split(/[\\/]/).slice(-4).join('/');
  console.log(`  → ${rel}`);
  console.log(`     MERGE: ${merges} | INSERIDOS: ${inseridos} | já ricos: ${jaRicos} | sem rico: ${semRicoDisponivel}`);
  console.log(`     Total final: ${dados.jogos.length} jogos`);
  mergesTotal = Math.max(mergesTotal, merges);
});

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log(`  🏁 Mesclagem ${LIGA} concluída: ${mergesTotal} jogos enriquecidos por merge`);
console.log('═══════════════════════════════════════════════════════');
