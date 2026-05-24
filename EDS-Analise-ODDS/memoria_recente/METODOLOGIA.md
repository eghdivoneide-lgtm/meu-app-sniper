# 🧠 METODOLOGIA — Memória Recente (regime tático em andamento)

**Comandante:** Egnaldo · **Operador analítico:** Claude Opus 4.7 · **Início:** 2026-05-18

---

## 🎯 Razão de existir

O **app** (`Especialista em Cantos`) opera com regras CALIBRADAS sobre histórico longo (toda a temporada). Funciona bem para padrões duradouros, mas **DILUI** mudanças de regime que ocorrem em janelas curtas (2-4 rodadas).

**Memória Recente** é um sistema PARALELO que captura:

1. **Padrão em andamento** — o que o time está fazendo HOJE, não o que fez em média na temporada
2. **Comportamento pós-gol** — o time recua ou pressiona depois de marcar?
3. **Regime ativo vs quebrado** — está mantendo o padrão ou já saiu dele?

O app **NÃO USA** essa memória. As duas análises rodam em paralelo:

```
Rodada nova → análise pelo app (regras gerais)
            → análise pela memoria_recente (padrão em andamento)
            → comparar performance
            → se memoria_recente vencer N rodadas seguidas, ela vira fonte primária
```

---

## 📐 Os 7 eixos do perfil tático

Cada time é caracterizado em 7 dimensões:

| Eixo | O que mede | Como detectar nos dados |
|------|------------|--------------------------|
| **1. Volume** | Cantos médios FT pró/contra | Média simples 3R e 5R |
| **2. Pós-gol-pró** | Pressiona ou recua após marcar? | Cantos 2T dele quando vence o HT |
| **3. Pós-gol-contra** | Reage ou desiste após sofrer? | Cantos 2T dele quando perde o HT |
| **4. Distribuição HT/2T** | "Blitz inicial" ou "asfixia final"? | % cantos 1T vs 2T |
| **5. Sangrador honesto** | Sofre por ser fraco ou por dar espaço? | Cantos sofridos vs posse |
| **6. Pressão estéril** | Faz cantos sem converter? | Cantos pró ÷ gols pró |
| **7. Resposta ao adversário** | Reage ao perfil do oponente? | Δ cantos vs perfil enfrentado |

---

## 🔥 Conceito-chave: PADRÃO EM ANDAMENTO

Um time está em **padrão ativo** quando 3+ jogos consecutivos mostram a mesma tendência.

**Exemplo cravado:** Inter Miami nas rodadas R8/R9/R10 fez 7/10/4 cantos pró. **Não há padrão consistente** — variância alta → entrada de risco.

**Exemplo cravado:** Orlando City como sangrador fora: sofreu 7/10/11 nas últimas rodadas. **Padrão ATIVO** = continuará sangrando.

### Classificação do regime:

| Status | Critério | Como operar |
|--------|----------|-------------|
| 🟢 **ATIVO** | 3+ jogos confirmando direção | Operar com confiança ALTA |
| 🟡 **EMERGENTE** | 2 jogos na nova direção | Operar com stake reduzida |
| 🔴 **QUEBRADO** | último jogo reverteu padrão de 3+ jogos | PASSAR — esperar nova consolidação |
| ⚪ **NEUTRO** | sem direção clara | Ignorar este time como sinal |

---

## 📊 Pesos por janela temporal

A predição dá MAIOR peso ao mais recente:

```
xCantos_pró = 0.50 × média(R-1) + 0.30 × média(R-2) + 0.20 × média(R-3)
```

EWMA implícito com decay 0.5. Captura mudança de regime mais rápido que média simples.

---

## 🛡️ Regras de segurança

1. **Mínimo 3 jogos** na janela analisada (não inferir com 1-2 jogos)
2. **Casa e fora separados** sempre — nunca misturar
3. **Padrão tem que ser tático** (cantos, finalizações, posse) — não estatístico apenas
4. **Validação cega obrigatória** a cada N rodadas para confirmar o método

---

## 🔁 Auto-ajuste

Quando uma rodada termina, atualizar:
1. Adicionar jogo da R-atual no perfil de cada time
2. Recalcular médias 3R com janela móvel
3. Marcar regime como ATIVO/EMERGENTE/QUEBRADO/NEUTRO
4. Comparar predição pré-rodada com resultado real
5. Registrar acerto/erro do método em `validacoes/`

Se o método validar com WR ≥65% por 3 rodadas seguidas em uma liga, ele vira **fonte primária** para essa liga.

---

## 📁 Estrutura

```
memoria_recente/
├── METODOLOGIA.md                          (este arquivo)
├── INDICE.md                               (mapa: status por time/liga)
├── MLS/
│   ├── _resumo_liga.md                     (visão geral da liga)
│   ├── _padroes_pos_gol.json               (consolidado JSON)
│   └── times/
│       ├── Atlanta_Utd.md
│       ├── Austin_FC.md
│       └── ... (30 times)
├── BR/                                     (futuro)
├── ARG/                                    (futuro)
└── validacoes/
    └── MLS_R12_2026-05-16.md               (já validado WR 65.5%)
```

---

## 🧭 Fontes de dados autorizadas

- **Dados raw:** `projeto-fantasma/rodadas/<LIGA>/` (snapshots Flashscore)
- **Cruzamento DNA:** `especialista-cantos/Auditoria Especialista em cantos/_AnaliseDNA/<NN_LIGA>/memoria_<LIGA>.json` (somente leitura)

**Não cruzar com:** `memoria Fotografica/`, worktrees, `data/` legado.
