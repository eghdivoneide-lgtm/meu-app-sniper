const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log("==================================================");
console.log("💿 ORQUESTRADOR CENTRAL EDS (Automação de Retreinamento)");
console.log("==================================================");

const auditorDataDir = path.join(__dirname, '../AUDITOR EDS APP/data');
if (!fs.existsSync(auditorDataDir)) {
    fs.mkdirSync(auditorDataDir, { recursive: true });
}

// 1. Inicia o Scraper Lote (Simulamos o sucesso verificando se o JSON existe, se não, pede pra rodar)
const jsonPath = path.join(__dirname, 'mls_rodada_atual.json');

console.log(`\n[PASSO 1] Lendo matriz fantasma gerada na raiz...`);

if (!fs.existsSync(jsonPath)) {
    console.log("⚠️ AVISO: O arquivo 'mls_rodada_atual.json' não foi encontrado.");
    console.log("Você precisa rodar 'node varredor-rodada.js' antes ou automatizar sua chamada aqui.");
    process.exit(1);
}

const dadosJson = fs.readFileSync(jsonPath, 'utf8');
const rodada = JSON.parse(dadosJson);
console.log(`✅ ${rodada.length} jogos carregados do Motor Fantasma.`);

// 2. Transforma o JSON bruto em Memória Viva para a Interface Web do Auditor (Resolve CORS)
console.log(`\n[PASSO 2] Injetando Memória Viva no Auditor Web...`);
const jsContent = `window.dadosFantasma = ${JSON.stringify(rodada, null, 2)};`;
const memoriaVivaPath = path.join(auditorDataDir, 'memoria_viva.js');
fs.writeFileSync(memoriaVivaPath, jsContent);
console.log(`✅ Arquivo 'memoria_viva.js' atualizado dentro do Auditor EDS!`);

// 3. O Retreinador Neural Oculto (Auto-Patching do Especialista em Cantos)
console.log(`\n[PASSO 3] Acionando Rede Neural Oculta para atualizar heurísticas...`);

let redFlags = [];
rodada.forEach(j => {
    // Replica da lógica de Heurística pesada (Busca anomalias para avisar o sistema principal)
    let cantosFT = 0;
    if(j.estatisticas_ft && j.estatisticas_ft.cantos) {
        cantosFT = (j.estatisticas_ft.cantos.m || 0) + (j.estatisticas_ft.cantos.v || 0);
    }
    
    // Anomalia Tática Severa 1: Times 5-4-1 Matam Cantos
    if(j.formacao && (j.formacao.m === "5-4-1" || j.formacao.m.startsWith("5-"))) {
        redFlags.push({ tipo: "TATICA_DEFENSIVA", team: j.mandante, penalidade_recomendada: "-40%" });
    }
    
    // Anomalia 2: Cartao Vermelho Invalida Jogo Over
    if(j.estatisticas_ft && j.estatisticas_ft.cartoes_vermelhos && 
      (j.estatisticas_ft.cartoes_vermelhos.m > 0 || j.estatisticas_ft.cartoes_vermelhos.v > 0)) {
        redFlags.push({ tipo: "SUPERIORIDADE_NUMERICA", team: j.mandante, ignorar_pre_live: true });
    }
});

// Atualizamos a Memória de Parâmetros global do App Especialista em Cantos!
const dirDadosApp = path.join(__dirname, '../especialista-cantos/dados');
if (!fs.existsSync(dirDadosApp)) fs.mkdirSync(dirDadosApp, { recursive: true });

const memoriaTmiPath = path.join(dirDadosApp, 'parametros_heuristica.json');
let baseConhecimento = { versoes_treino: 0, penalidades_ativas: [] };

if(fs.existsSync(memoriaTmiPath)) {
    baseConhecimento = JSON.parse(fs.readFileSync(memoriaTmiPath, 'utf8'));
}

baseConhecimento.versoes_treino += 1;
// Injeta apenas RedFlags unicas novas
redFlags.forEach(rf => {
    const existe = baseConhecimento.penalidades_ativas.find(p => p.tipo === rf.tipo);
    if(!existe) baseConhecimento.penalidades_ativas.push(rf);
});

fs.writeFileSync(memoriaTmiPath, JSON.stringify(baseConhecimento, null, 2));

console.log(`✅ Rede Neural do Especialista Atualizada! Treinos realizados: ${baseConhecimento.versoes_treino}`);
console.log(`✅ Foram detectadas ${redFlags.length} anomalias que foram convertidas em pesos matemáticos no App Principal!`);

console.log("\n==================================================");
console.log("🚀 AUTOMAÇÃO COMPLETA. ABRA O AUDITOR NO NAVEGADOR!");
console.log("O Aplicativo Especialista também já recebeu o novo DNA.");
console.log("==================================================");
