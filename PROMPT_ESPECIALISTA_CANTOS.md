# PROMPT COMPLETO — RECONSTRUÇÃO DO APP "ESPECIALISTA EM CANTOS"
## EDS Soluções Inteligentes

---

Crie o app **Especialista em Cantos** completo, um arquivo `index.html` single-page + 4 arquivos de dados JS em uma pasta `data/`. O app é uma ferramenta profissional de análise estatística de escanteios (corners) para apostas esportivas.

---

## ESTRUTURA DE ARQUIVOS

```
especialista-cantos/
  index.html               ← app principal (tudo em um único arquivo HTML)
  data/
    brasileirao2026.js
    mls2026.js
    argentina2026.js
    usl2026.js
```

---

## IDENTIDADE VISUAL

- **Fundo**: `#0D1117` (preto GitHub)
- **Cards**: `#161B22`
- **Bordas**: `#21262D`
- **Texto secundário**: `#8B949E`
- **Texto principal**: `#F0F6FC`
- **Verde destaque**: `#00C851`
- **Verde escuro**: `#007E33`
- **Azul**: `#1565C0` / `#1E88E5`
- **Amarelo**: `#FFD600`
- **Laranja**: `#FF6D00`
- **Vermelho**: `#D32F2F`
- **Fonte**: Inter (Google Fonts), pesos 400/500/600/700/800

---

## ESTRUTURA DO index.html

### Header (fixo no topo, sticky)
- Logo com ícone ⚽ + título dinâmico "🇧🇷 Especialista em Cantos — Brasileirão Série A"
- Título muda conforme a liga selecionada
- 4 botões de liga: `🇧🇷 Brasileirão` | `🇺🇸 MLS` | `🇦🇷 Argentina` | `🏟 USL`
- Botão ativo fica verde com texto preto
- IDs dos botões: `btn-liga-BR`, `btn-liga-MLS`, `btn-liga-ARG`, `btn-liga-USL`

### Nav Tabs (abaixo do header)
5 abas de navegação:
1. `🎯 Projeção`
2. `⭐ Bala de Prata`
3. `📊 Backtest`
4. `🤖 SmartCoach`
5. `📋 Bet Tracker`

Aba ativa tem borda inferior verde + texto verde.

---

## SEÇÃO 1: PROJEÇÃO

**Card principal:**
- Título: "🎯 Projeção de Cantos — Poisson + EWMA + TMI"
- 2 selects lado a lado: Mandante / Visitante (populados dinamicamente com times da liga atual, ordenados alfabeticamente)
- Botões: "⚡ Calcular Projeção" e "✕ Limpar"

**Output da projeção:**
- Nome do jogo centralizado
- Grid 2x2 com 4 `proj-box`:
  - λ Mandante HT (cantos esperados 1T)
  - λ Visitante HT
  - λ Mandante FT
  - λ Visitante FT
- Badges TMI dos dois times + total de rodadas + total de jogos
- Tabela HT (linhas: 3.5, 4.5, 5.5, 6.5, 7.5) e Tabela FT (linhas: 7.5, 8.5, 9.5, 10.5, 11.5, 12.5)
  - Colunas: Linha | λ Total | Prob.% | barra visual
  - Linhas com prob ≥ 60% ficam destacadas em verde
- Alerta informando o modelo usado

**Card "Registrar Resultado Real" (aparece após calcular):**
- Campos: Rodada | Cantos HT Mandante | Cantos HT Visitante | Cantos FT Mandante | Cantos FT Visitante
- Botão "💾 Salvar Resultado" → executa push do jogo real no array `DADOS_2026.jogos` (walk-forward)
- Mensagem de confirmação que some após 4s

---

## SEÇÃO 2: BALA DE PRATA

**Card principal (borda amarela `#FFD600`):**
- Título: "🥈 Bala de Prata — Picks Premium"
- Subtítulo: "Cruzamento automático: Lobisomens do Over × Reis dos Cantos"
- Info dinâmica: rodadas | jogos | liga
- Botão "🔄 Atualizar Picks"
- Lista de picks gerados automaticamente (máx. 5 picks, prob ≥ 55%)

**Card "🐺 Lobisomens do Over"** — top 6 times por volume de cantos (score = atq_ajustado × TMI, ordenado decrescente)

**Card "👑 Reis dos Cantos"** — top 6 times por TMI (Tactical Mastery Index)

**Lógica dos picks:**
- Cruzar Lobisomens × Reis (mandante = Lobo, visitante = Rei)
- Calcular lambda FT e HT para cada par
- Se prob Over 9.5 FT ≥ 55% → pick "Over 9.5 FT"
- Senão, se prob Over 4.5 HT ≥ 55% → pick "Over 4.5 HT"
- Ordenar por probabilidade decrescente
- Se nenhum pick → mostrar mensagem pedindo mais dados

---

## SEÇÃO 3: BACKTEST

**Metodologia walk-forward 70/30:**
- Ordenar jogos cronologicamente por rodada
- 70% = treino, 30% = teste
- Para cada jogo do conjunto teste: projetar usando APENAS os jogos de treino
- Simular apostas apenas quando prob ≥ 55%
- Testar linhas configuráveis: HT (select: Over 3.5 / 4.5 / 5.5) e FT (select: Over 8.5 / 9.5 / 10.5 / 11.5)

**Cards de resultado:**
- Jogos Treino (70%) | Jogos Teste (30%) | Apostas simuladas FT | Acurácia FT | Acurácia HT | Confiança média
- Se acurácia ≥ 58% → alerta verde "Modelo com acurácia robusta"
- Se < 58% → alerta laranja "Adicione mais rodadas reais"
- Se < 10 jogos → alerta de dados insuficientes

---

## SEÇÃO 4: SMARTCOACH

**Integração com Claude claude-opus-4-6 via Anthropic API (browser direto):**

Header da requisição obrigatório: `'anthropic-dangerous-direct-browser-access': 'true'`

**Campo API Key:**
- Input tipo password, placeholder "sk-ant-api03-..."
- Botão "Salvar Chave" → valida se começa com `sk-ant-` → salva em `localStorage.setItem('sniper_api_key', key)`
- Status: ✅ Salva! / ❌ Chave inválida

**Chat:**
- Área de chat estilizada, max-height 400px, overflow scroll
- Mensagens do usuário à direita (azul), respostas à esquerda (card cinza)
- Input + botão Enviar + tecla Enter
- Botões de sugestão rápida: "📊 Tendências da liga" | "🏠 Top mandantes" | "🗑 Limpar"
- Indicador de loading animado enquanto aguarda resposta

**System prompt injetado:**
```
Você é o SmartCoach da EDS Soluções Inteligentes — analista especialista em escanteios (corners) de futebol.
Modelos disponíveis: Poisson, EWMA (decay=0.85), Bayesian Shrinkage (k=5), TMI (Tactical Mastery Index: m_vert×0.75 + v_rej×0.25, intervalo [0.65, 1.65]).
[CONTEXTO DINÂMICO]: Liga: {nome_liga}. Rodadas: {N}. Jogos: {N}. Times: {lista_times}.
Responda em português brasileiro, de forma objetiva. Cite fatores estatísticos quando relevante. Não faça garantias absolutas.
```

**Persistência do chat:**
- Salvar histórico em `localStorage` com chave separada por liga: `sniper_chat_BR`, `sniper_chat_MLS`, `sniper_chat_ARG`, `sniper_chat_USL`
- Limitar a 30 mensagens salvas
- Ao trocar de liga, recarregar o histórico correto

---

## SEÇÃO 5: BET TRACKER

**Label dinâmico:** mostra a liga atual

**Cards de resumo (grid adaptativo):**
- Total apostas | Pendentes | Green ✅ | Red ❌ | P&L (R$) | Yield%

**IMPORTANTE — Cálculo do Yield:**
- Yield calculado APENAS sobre apostas resolvidas (green + red), não sobre pendentes
- `yield = (lucro_total / stake_total_resolvidas) * 100`
- Lucro green: `stake * (odd - 1)`
- Prejuízo red: `-stake`

**Formulário de nova aposta:**
- Jogo (text) | Mercado (select) | Odd (number) | Stake R$ (number)
- Mercados disponíveis: Over 9.5 FT, Over 10.5 FT, Over 11.5 FT, Over 4.5 HT, Over 5.5 HT, Cantos Mandante +1.5 HT, Cantos Visitante +1.5 HT, Ambos Marcam 5+ Cantos HT, Outro
- Botão "💾 Registrar Aposta" → salva com status "pendente"

**Lista de apostas:**
- Filtros: Todas | ⏳ Pendentes | ✅ Green | ❌ Red
- Cada aposta mostra: jogo, mercado, odd, stake, data, liga
- Badge colorido: amarelo=pendente, verde=green, vermelho=red
- Apostas pendentes têm botões ✅ e ❌ para resolver
- Botão 🗑 para excluir qualquer aposta
- Lista em ordem reversa (mais recente no topo)

**CRÍTICO — Isolamento por liga:**
- Chave localStorage separada por liga: `sniper_bets_BR`, `sniper_bets_MLS`, `sniper_bets_ARG`, `sniper_bets_USL`
- Ao trocar de liga, o tracker mostra apenas as apostas daquela liga

---

## ALGORITMOS ESTATÍSTICOS (implementar em JS)

### Constantes
```javascript
const DECAY = 0.85;       // fator de decaimento EWMA
const K_BAYES = 5;        // parâmetro de encolhimento Bayesiano
const PROB_MINIMA = 55;   // probabilidade mínima para picks/backtest
```

### Poisson PMF e CDF
```javascript
function factorial(n) {
  if (n <= 1) return 1;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

function poissonPMF(lambda, k) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function poissonCDF(lambda, k) {
  let s = 0;
  for (let i = 0; i <= k; i++) s += poissonPMF(lambda, i);
  return s;
}

function probOver(lambda, linha) {
  return Math.max(0, Math.min(100, (1 - poissonCDF(lambda, Math.floor(linha))) * 100));
}
```

### EWMA (Exponentially Weighted Moving Average)
- Decay = 0.85 → peso maior nos jogos mais recentes
- Calcular separadamente para: `feitos_ht`, `sofridos_ht`, `feitos_ft`, `sofridos_ft`
```javascript
function calcEWMA(jogos, time, tipo) {
  // filtrar jogos do time, ordenar por rodada ASC
  // tipo: 'feitos_ht' | 'sofridos_ht' | 'feitos_ft' | 'sofridos_ft'
  // mandante: feitos_ht = escanteios_ht_m, sofridos_ht = escanteios_ht_v
  // visitante: feitos_ht = escanteios_ht_v, sofridos_ht = escanteios_ht_m
  // ewma = null no início
  // ewma = valor se ewma===null, senão: DECAY * ewma + (1 - DECAY) * valor
}
```

### Bayesian Shrinkage
- Puxa estimativa individual em direção à média da liga
- Especialmente útil nas primeiras rodadas (poucos jogos)
```javascript
function bayesian(ewma, mediaLiga, n) {
  if (ewma === null) return mediaLiga;
  return (n * ewma + K_BAYES * mediaLiga) / (n + K_BAYES);
}
```

### Média da Liga
```javascript
function mediaLiga(jogos, periodo) {
  // periodo: 'ft' ou 'ht'
  // coletar todos escanteios_ft_m e escanteios_ft_v (ou ht)
  // retornar média, default 5 se sem dados
}
```

### TMI — Tactical Mastery Index
```javascript
function calcTMI(jogos, time) {
  const eFt  = calcEWMA(jogos, time, 'feitos_ft')   ?? 5;
  const eSFt = calcEWMA(jogos, time, 'sofridos_ft') ?? 5;
  const m_vert = Math.min(2, eFt  / Math.max(0.5, eSFt));
  const v_rej  = Math.min(2, eSFt / Math.max(0.5, eFt));
  const tmi = (m_vert * 0.75) + (v_rej * 0.25);
  return Math.max(0.65, Math.min(1.65, tmi));  // clamp [0.65, 1.65]
}
```

### Lambda de Projeção (função principal)
```javascript
function lambdaProj(jogos, mandante, visitante, periodo) {
  // periodo: 'ht' ou 'ft'
  const mL   = mediaLiga(jogos, periodo);
  const nM   = nJogos(jogos, mandante);
  const nV   = nJogos(jogos, visitante);
  const atqM = bayesian(calcEWMA(jogos, mandante, `feitos_${periodo}`),   mL, nM);
  const defM = bayesian(calcEWMA(jogos, mandante, `sofridos_${periodo}`), mL, nM);
  const atqV = bayesian(calcEWMA(jogos, visitante, `feitos_${periodo}`),  mL, nV);
  const defV = bayesian(calcEWMA(jogos, visitante, `sofridos_${periodo}`),mL, nV);
  const tmiM = calcTMI(jogos, mandante);
  const tmiV = calcTMI(jogos, visitante);
  const lambdaM = ((atqM + defV) / 2) * tmiM;
  const lambdaV = ((atqV + defM) / 2) * tmiV;
  return { lambdaM, lambdaV, tmiM, tmiV };
}
```

### Cálculo dinâmico de rodadas
```javascript
function totalRodadas(jogos) {
  return Math.max(...jogos.map(j => typeof j.rodada === 'number' ? j.rodada : 0), 0);
}
```

---

## ESTADO GLOBAL E TROCA DE LIGA

```javascript
const LIGAS_CFG = {
  BR:  { dados: () => window.DADOS_BR,  nome: 'Brasileirão Série A',  bandeira: '🇧🇷', betKey: 'sniper_bets_BR',  chatKey: 'sniper_chat_BR'  },
  MLS: { dados: () => window.DADOS_MLS, nome: 'MLS 2026',             bandeira: '🇺🇸', betKey: 'sniper_bets_MLS', chatKey: 'sniper_chat_MLS' },
  ARG: { dados: () => window.DADOS_ARG, nome: 'Liga Profesional ARG', bandeira: '🇦🇷', betKey: 'sniper_bets_ARG', chatKey: 'sniper_chat_ARG' },
  USL: { dados: () => window.DADOS_USL, nome: 'USL Championship',     bandeira: '🏟',  betKey: 'sniper_bets_USL', chatKey: 'sniper_chat_USL' },
};

let LIGA_ATUAL = 'BR';
let DADOS_2026 = null;  // referência à liga ativa

function trocarLiga(liga) {
  LIGA_ATUAL = liga;
  DADOS_2026 = LIGAS_CFG[liga].dados();
  // atualizar botões, título da página, título do header
  // repopular selects de mandante/visitante
  // limpar projeção anterior
  // recarregar chat e tracker da nova liga
}
```

---

## ESTRUTURA DOS ARQUIVOS DE DADOS JS

Cada arquivo exporta para `window.DADOS_XX`:

```javascript
window.DADOS_BR = {
  equipes: [
    { nome: 'Flamengo', sigla: 'FLA' },
    // ... 20 times
  ],
  jogos: [
    {
      rodada: 1,
      mandante: 'Flamengo',
      visitante: 'Vasco',
      escanteios_ht_m: 6,   // cantos HT do mandante
      escanteios_ht_v: 2,   // cantos HT do visitante
      escanteios_ft_m: 11,  // cantos FT do mandante
      escanteios_ft_v: 5,   // cantos FT do visitante
    },
    // ...
  ]
};
```

---

## TIMES POR LIGA

### 🇧🇷 Brasileirão Série A (window.DADOS_BR) — 20 times
Flamengo, Palmeiras, Atlético Mineiro, São Paulo, Fluminense, Internacional, Corinthians, Grêmio, Botafogo, Vasco, Cruzeiro, Fortaleza, Bahia, Athletico-PR, Bragantino, Juventude, Vitória, Criciúma, Goiás, Cuiabá

### 🇺🇸 MLS 2026 (window.DADOS_MLS) — 24 times
LA Galaxy, LAFC, Seattle Sounders, Portland Timbers, Colorado Rapids, Real Salt Lake, Austin FC, FC Dallas, Houston Dynamo, Sporting KC, Minnesota United, Chicago Fire, Columbus Crew, Toronto FC, New York City FC, New York Red Bulls, New England Revolution, Atlanta United, Orlando City, Inter Miami, CF Montréal, Vancouver Whitecaps, San Jose Earthquakes, St. Louis City

### 🇦🇷 Argentina (window.DADOS_ARG) — 20 times
River Plate, Boca Juniors, Independiente, Racing Club, San Lorenzo, Huracán, Vélez Sársfield, Estudiantes, Lanús, Banfield, Rosario Central, Newell's, Talleres, Belgrano, Defensa y Justicia, Platense, Godoy Cruz, Tigre, Unión, Colón

### 🏟 USL Championship (window.DADOS_USL) — 16 times
Louisville City, Tampa Bay Rowdies, Pittsburgh Riverhounds, Memphis 901 FC, Phoenix Rising, Sacramento Republic, New Mexico United, El Paso Locomotive, Charleston Battery, Indy Eleven, Birmingham Legion, Orange County SC, Las Vegas Lights, Rio Grande Valley FC, Hartford Athletic, FC Tulsa

---

## DADOS HISTÓRICOS POR LIGA

Popule cada arquivo com **pelo menos 5 a 7 rodadas completas** de jogos com dados de escanteios realistas. Use médias típicas de cada liga:

- **Brasileirão**: times grandes (Flamengo, Palmeiras) ~ 5-7 cantos HT como mandantes, 9-12 FT. Times pequenos ~ 2-3 HT, 4-6 FT.
- **MLS**: médias menores, ~ 3-5 HT, 6-9 FT. Inter Miami e LAFC ligeiramente acima.
- **Argentina**: similar ao Brasil. River e Boca dominantes em casa.
- **USL**: liga menor, médias ~ 3-4 HT, 5-7 FT.

---

## CARREGAMENTO DOS SCRIPTS

No `<head>` do index.html, carregar os 4 arquivos de dados ANTES do script principal:
```html
<script src="data/brasileirao2026.js"></script>
<script src="data/mls2026.js"></script>
<script src="data/argentina2026.js"></script>
<script src="data/usl2026.js"></script>
```

---

## INICIALIZAÇÃO

```javascript
window.addEventListener('DOMContentLoaded', () => {
  trocarLiga('BR');   // carrega brasileirão por padrão
  carregarApiKey();   // verifica se já tem chave salva
});
```

---

## BUGS CONHECIDOS — CORRIGIR

1. **CSS**: Não usar `padding: 0 1rem.` (ponto no final quebra o CSS). Usar `padding: 0 1rem;`
2. **Bet Tracker**: localStorage DEVE usar chave separada por liga. NUNCA usar chave fixa `'sniper_bets'`.
3. **Chat**: localStorage DEVE usar chave separada por liga. NUNCA usar chave fixa.
4. **totalRodadas**: sempre calcular dinamicamente do array de jogos, nunca hardcoded como 38.
5. **TMI clamp**: OBRIGATÓRIO clamp entre 0.65 e 1.65.
6. **Bayesian fallback**: se EWMA retornar null (time sem jogos), usar diretamente a média da liga.

---

## COMPORTAMENTOS IMPORTANTES

- Ao trocar de liga: limpar projeção exibida, repopular selects, recarregar bet tracker e chat da nova liga
- Ao salvar resultado real: dar push no array `DADOS_2026.jogos` (em memória) → modelo EWMA atualiza imediatamente na próxima projeção
- API key: validar que começa com `sk-ant-` antes de salvar
- Chat history: ao enviar, mostrar loading spinner → chamar API → remover spinner → mostrar resposta
- Backtest: mostrar alerta se menos de 10 jogos disponíveis
- Todos os textos em português brasileiro

---

## REQUISITO FINAL

O app deve funcionar **100% offline** (sem backend), abrindo o `index.html` direto no navegador. Toda a lógica roda no cliente. A única dependência externa é a API da Anthropic (SmartCoach) e Google Fonts.

Quando pronto, o app deve ter todas as 5 seções funcionando, troca de liga fluida, e os dados das 4 ligas pré-carregados com pelo menos 5 rodadas cada.
