# CONVERSA MOTOR V4 — Histórico Completo
## Código de acesso: "Motor V4"

---

## SESSÃO 1 — 06-07/04/2026

### FASE 1: Auditoria do Auditor EDS APP
- Mapeamos a arquitetura do Auditor EDS (SPA de análise de cantos MLS 2026)
- 4 arquivos: index.html, motor-matematico.js, data/memoria_viva.js, clonador_espelho.js
- **Problemas encontrados e corrigidos:**
  - CRÍTICO: Dependência externa quebrada (`../especialista-cantos/data/mls2026.js`) → copiado localmente
  - CRÍTICO: `DADOS_2026` sem fallback → guard clause adicionada
  - CRÍTICO: Chart.js carregado sem uso → removido (~200KB economia)
  - ALTO: Zero responsividade → media queries + header mobile
  - ALTO: 50 linhas de código morto (ordenarRanking, getRanking) → removidas
  - ALTO: showView() não atualizava botões → corrigido
  - ALTO: Memory leak em forcarSincronizacao() → script com id fixo
  - MÉDIO: Sem estado vazio/loading → adicionados
  - MÉDIO: XSS via innerHTML → escapeHtml() implementado

### FASE 2: Auditoria Sênior do Auditor
- Reescrita completa do index.html (316 → 478 linhas)
- Adicionado: spinner no sync, timestamp, resumo pós-revelação (acurácia %), botão Nova Rodada, botão Voltar
- Mobile: tabela empilhada em card para < 768px
- Produção: favicon SVG, meta description, window.onerror, DOMContentLoaded
- Motor limpo: 202 → 196 linhas

### FASE 3: Análise da Engenharia do Motor Fantasma
- Mapeamento completo do ecossistema de scraping:
  - flashscore-monster.js (Puppeteer + Stealth, DOM parsing)
  - varredor-rodada.js (batch MLS, 15 jogos, 5s delay)
  - orquestrador-eds.js (JSON → memoria_viva.js, red flags)
  - especialista-cantos/scraper/ (mineradores por liga via Playwright)

### FASE 4: Construção do Analista Fantasma v4 (5 Fases)

#### Fase 1 — Auditoria de Fidelidade
- mls_rodada_atual.json: 15 jogos, cantos/posse/formação/odds 100% presentes
- 11 campos novos necessários para v4 (ataques perigosos, faltas, cruzamentos, etc.)

#### Fase 2 — Refinamento
- **flashscore-monster.js v4** (522 linhas): Schema expandido 14+ campos, dupla rota (rede + DOM), interceptação de pacotes FlashScore, formações sem hífens, data real da partida, match_id, metadados de qualidade
- **varredor-rodada.js v4** (295 linhas): Multi-liga (BR/MLS/ARG/USL/ECU), `--liga` e `--todas`, retry com backoff exponencial (5s→10s→20s), barra de progresso, sumário pós-varredura
- **orquestrador-eds.js v4** (329 linhas): Pipeline 5 passos, 7 red flags expandidos, 4 outputs (memoria_viva.js + qualitativas_rodada.js + dna_ligas.js + parametros_heuristica.json)
- Arquivados: conector-betano.js, fantasma-central.js → deprecated/

#### Fase 3 — DNA Cultural das Ligas
- **dna_ligas.js** (233 linhas): 5 ligas com perfil cultural (BR: INTENSO_VARIAVEL, MLS: OFENSIVO_ABERTO, ARG: DEFENSIVO_TATICO, USL: EQUILIBRADO_INFERIOR, ECU: IMPREVISIVEL_ALTITUDE)
- Atualização dinâmica: médias, desvio padrão, fator mandante, rankings de times
- Ajustes de modelo por contexto (clássico, altitude, viagem longa, etc.)

#### Fase 4 — Aprendizado Pós-Jogo
- **classificador_pos_jogo.js** (218 linhas): Classifica cada resultado como ACERTO / ERRO_MODELO / VARIÂNCIA
- Relatório automático pós-rodada com diagnóstico de erros
- Loop de aprendizado: atualiza parametros_heuristica.json com histórico

#### Fase 5 — Variáveis Qualitativas
- **qualitativas_engine.js** (244 linhas): 10 variáveis derivadas (pressão territorial, ritmo, dominância cantos, agressividade, taxa conversão, fator muro, momentum 2T)
- Classificação de formações (4 categorias) e jogos (OVER_FORTE → UNDER_FORTE)
- Detecção de 11 tipos de anomalias

#### Validação com Dados Reais
- `node orquestrador-eds.js` executado: 15 jogos processados, 6 red flags, DNA MLS calculado (média 9.6 cantos, fator casa 1.36x)

### FASE 5: Teste Real do Monster v4 (LA Galaxy vs Minnesota United)
- **3 iterações de debug:**
  1. FT null + HT com dados FT → Bug: FlashScore abre em "2ND HALF" por padrão
  2. Navegação direta por URL piorou → React não carrega stats por URL direta
  3. Wait até "Corner kicks" no DOM → Funcionou com 22+ campos
- **Divergência cantos FT (9 vs 6):** V4 lê o 2T isolado (6), V3 lia o total (9). NÃO é bug.

### DECISÃO ARQUITETURAL DO EGHDIVONEIDE
- **V4 é superior:** Dá HT e FT (2T) como dados primários isolados
- **Total da partida** = HT + FT (cálculo trivial pelo motor via `_somarTempos()`)
- **3 camadas de visão:** HT, FT(2T), Total — permite análise de tendência por período
- Stats aditivas: soma direta. Stats não-aditivas (posse): média.
- O cálculo fica por conta do motor matemático, não do scraper.

### FASE 6: Organização do Repositório
- Criada pasta **EDS-Odds-Analyzer/** unificando projeto-fantasma + AUDITOR EDS APP
- Eghdivoneide planeja mover para pasta mãe dedicada a apps de análise estatística

### FASE 7: EDS-ODDS-TEACHER
- Construído app completo (725 linhas, arquivo único index.html)
- 3 telas: Importar → Crash Test → Relatório
- 11 mercados avaliados (Bala de Prata, Match Odds, Overs FT/HT, Handicap)
- Detector de padrões, Mapa Bala de Prata, Autópsia jogo a jogo
- Exportação JSON + HTML, localStorage para persistência
- 5 jogos mock incluídos para demonstração

---

## ESTADO ATUAL DOS ARQUIVOS

### EDS-Odds-Analyzer/
```
EDS-Odds-Analyzer/
├── AUDITOR EDS APP/
│   ├── index.html (478 linhas) — Dashboard de auditoria
│   ├── motor-matematico.js (196 linhas) — Poisson + EWMA + Bayesian
│   ├── data/memoria_viva.js — Feed do Motor Fantasma
│   ├── data/mls2026.js — Dados históricos MLS
│   ├── data/qualitativas_rodada.js — Variáveis qualitativas
│   ├── data/dna_ligas.js — DNA cultural das ligas
│   └── clonador_espelho.js — Script de clone (dev only)
│
├── projeto-fantasma/
│   ├── flashscore-monster.js (~530 linhas) — Extrator unitário v4
│   ├── varredor-rodada.js (295 linhas) — Batch multi-liga
│   ├── orquestrador-eds.js (329 linhas) — Pipeline central
│   ├── dna_ligas.js (233 linhas) — DNA cultural
│   ├── qualitativas_engine.js (244 linhas) — Variáveis derivadas
│   ├── classificador_pos_jogo.js (218 linhas) — Aprendizado pós-jogo
│   ├── logger.js (43 linhas) — Logging colorido
│   ├── package.json (v4.0.0) — Scripts npm por liga
│   ├── pipeline.bat — Windows batch com parâmetro de liga
│   ├── mls_rodada_atual.json — Última rodada extraída
│   └── deprecated/ — conector-betano.js, fantasma-central.js, public/
│
├── EDS-ODDS-TEACHER/
│   └── index.html (725 linhas) — Crash Test Lab
│
└── CONVERSA_MOTOR_V4.md — Este arquivo
```

### Comandos de Uso
```bash
# Pipeline completo
npm run pipeline:mls
node varredor-rodada.js --liga BR && node orquestrador-eds.js --liga BR
node varredor-rodada.js --todas

# Teste unitário
node flashscore-monster.js URL

# Windows
pipeline.bat MLS
```

---

## PRÓXIMOS PASSOS SUGERIDOS
1. Rodar varredura completa de uma rodada MLS com o Monster v4
2. Integrar qualitativas no Especialista em Cantos (index.html principal)
3. Rodar primeiro Crash Test real com dados de projeção + resultados
4. Adicionar liga do Brasileirão ao pipeline
5. Implementar auto-refresh no Auditor (timer para recarregar memoria_viva.js)
