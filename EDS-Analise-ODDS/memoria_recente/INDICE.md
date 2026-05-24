# 🗺️ INDICE — Memória Recente

**Localização:** `EDS-Analise-ODDS/memoria_recente/` (isolada do app)
**Última atualização:** 2026-05-18

---

## 📐 Como ler essa pasta

1. **[METODOLOGIA.md](METODOLOGIA.md)** — método dos 7 eixos + regime change detection
2. **`<LIGA>/_resumo_liga.md`** — visão consolidada da liga (top pressiona/recua/blitz)
3. **`<LIGA>/_padroes_pos_gol.json`** — dados estruturados (consumir via script)
4. **`<LIGA>/times/<Time>.md`** — perfil tático completo de UM time
5. **`validacoes/`** — testes cegos vs resultados reais

---

## 📊 Status por Liga

| Liga | Status | Jogos | Times | Snapshot | Validação cega | WR |
|------|--------|-------|-------|----------|------------------|-----|
| **MLS** | ✅ Mapeada + Validada | 91 | 30 | 2026-05-18 | R12 (16/05) | 100% (4/4 OURO) |
| **BR** | ✅ Mapeada + Validada | 44 | 20 | 2026-05-18 | R11 (16-17/05) | 60% (6/10) — HDP tóxico |
| BR_B | ⏳ Pendente | - | - | - | - | - |
| ARG | ⏳ Pendente | - | - | - | - | - |
| ARG_B | ⏳ Pendente | - | - | - | - | - |
| USL | ⏳ Pendente | - | - | - | - | - |
| BUN | ⏳ Pendente | - | - | - | - | - |
| J2/J3 | ⏳ Pendente | - | - | - | - | - |

### 🎯 Calibragens cravadas por liga

- **MLS:** HDP -1.5 mandante = OURO (100% validado). Operar todos mercados convergentes.
- **BR:** **HDP TÓXICO** (0/3 validado). Operar SÓ Over/Under + 1x2 cantos + UNDER HT. Ver `BR/_MERCADOS_PRIORITARIOS.md`.

---

## 🚦 Workflow operacional

```
Próxima rodada da MLS chega
    ↓
1. Atualizar dataset consolidado (deduplica + injeta novos jogos)
    ↓
2. Re-rodar _gerar_perfis_MLS.py (auto-atualiza perfis e regimes)
    ↓
3. ANTES de ver o app, fazer picks usando memoria_recente:
   - Para cada jogo da rodada: ler perfil dos 2 times
   - Cruzar pós-gol-pró × pós-gol-contra × distribuição HT/2T × regime
   - Cravar pick (FT / HT / HDP / 1x2)
    ↓
4. Depois ver o que o APP disse (Teacher/BP/Cisne/Enigma)
    ↓
5. Operar onde os DOIS concordam (segurança máxima)
   OU onde memoria_recente é mais ousada (se já validamos N rodadas)
    ↓
6. Pós-rodada: validar em `validacoes/MLS_R<N>.md` + atualizar regimes
```

---

## 🎯 Decisão operacional baseada em regime

| Regime do time | Confiabilidade do perfil | Como operar |
|----------------|--------------------------|-------------|
| 🟢 **ATIVO** | ALTA | Operar conforme perfil (stake cheia) |
| 🟡 **EMERGENTE** | MÉDIA | Operar perfil com stake reduzida (0.5u) |
| 🔴 **QUEBRADO** | BAIXA | NÃO operar perfil — esperar consolidação |
| ⚪ **NEUTRO** | BAIXA | Ignorar perfil — usar regra geral do app |

---

## 🔍 Atalhos de leitura por mercado

### Para HDP CANTOS mandante:
- Procurar time **PRESSIONA_POS_GOL** + **regime ATIVO** = HDP cravado
- Evitar time **RECUA_POS_GOL** (vai parar de fazer cantos quando lidera)

### Para OVER cantos:
- Mandante **REAGE_PRESSIONA** + adversário ofensivo (faz gol cedo) = OVER 2T cravado
- Distribuição **ASFIXIA_FINAL** + jogo apertado = OVER FT

### Para UNDER cantos:
- Mandante **RECUA_POS_GOL** vencendo provável + adversário passivo = UNDER FT
- Dois times com **DEFESA_SOLIDA** = UNDER 9.5

### Para 1x2 cantos:
- Mandante **PRESSIONA** + **regime ATIVO_POSITIVO** = mandante cantos
- Mandante **RECUA** + visitante **REAGE** = visitante cantos (mesmo perdendo gols)

---

## 📁 Arquivos gerados

- `METODOLOGIA.md` — base teórica
- `INDICE.md` — este arquivo
- `_gerar_perfis_MLS.py` — script de atualização
- `MLS/_resumo_liga.md` — overview MLS
- `MLS/_padroes_pos_gol.json` — JSON com 30 perfis completos
- `MLS/times/*.md` — 30 perfis individuais

---

## 🛡️ Princípios mandatórios

1. **Esta pasta NÃO é usada pelo app** — corremos em paralelo
2. **Fonte de dados:** `projeto-fantasma/rodadas/<LIGA>/` (raw scraper)
3. **Cruzamento DNA:** `especialista-cantos/Auditoria Especialista em cantos/_AnaliseDNA/<NN_LIGA>/` (read-only)
4. **NÃO cruzar com:** `memoria Fotografica/`, `data/`, worktrees, arquivos legados
5. **Validar a cada rodada** — sem validação, o método é só teoria
