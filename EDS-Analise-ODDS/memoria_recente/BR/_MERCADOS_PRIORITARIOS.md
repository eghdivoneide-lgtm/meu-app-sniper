# 🇧🇷 BR — Mercados Prioritários (Calibragem por Validação Cega)

**Última validação cega:** Rodada 16-17/05/2026 (10 picks, stake fixa 1u)
**Saldo:** +1.20u | ROI +12% | WR 60%
**Snapshot atualizado:** 2026-05-18

---

## 🏆 HIERARQUIA OPERACIONAL CRAVADA

### ✅ MERCADOS QUE FUNCIONAM (operar)

| Mercado | WR validado | Stake recomendada | Observações |
|---------|-------------|---------------------|-----------------|
| 🥇 **1x2 Cantos Mandante** | 100% (2/2) | 1.0u | Operar quando xDiff ≥+2 e mandante regime NEUTRO+ |
| 🥇 **UNDER 4.5 HT** | 100% (1/1) | 1.0u | Times com ASFIXIA_FINAL + DEFESA_SOLIDA visitante |
| 🥈 **UNDER 9.5 FT** | 100% (1/1) | 1.0u | xFT ≤9 + ambos times com perfis defensivos |
| 🥈 **OVER 9.5 FT** | 50% (1/2) | 0.75u | Exige xFT ≥11 (folga +1.5 mínimo) — não usar marginal |
| 🥈 **OVER 10.5 FT** | 100% (1/1) | 1.0u | xFT ≥12 + ambos times ofensivos |

### ❌ MERCADO QUE FALHA (evitar ou cuidado extremo)

| Mercado | WR validado | Decisão | Razão |
|---------|-------------|---------|-------|
| ❌ **HDP -1.5/-2.0** | 0% (0/3) | **NÃO OPERAR** | Times BR não dominam cantos com a previsibilidade da MLS |
| ⚠️ **HDP -1.0** | 0% (0/1) | Cuidado extremo | Margem mais apertada que MLS — esperar xDiff ≥+4 |

---

## 🔬 Por que HDP falha no BR (análise dos 3 reds)

### Caso 1 — Chapecoense -2.0 vs Remo (RED brutal 3×9)
- xDiff projetado: +4.08
- **Real: Diff −6 cantos** (Remo dominou 9×3)
- **Diagnóstico:** Remo HT já estava 7×0 em cantos. Chape sofreu colapso total.
- **Lição:** times BR azarões reagem mais agressivamente que MLS quando jogam fora contra equipes em queda

### Caso 2 — Bragantino -1.5 vs Vitória (RED por margem mínima)
- xDiff projetado: +3.0
- **Real: Diff +1** (Bragantino 7×6 — faltou 1 canto)
- **Diagnóstico:** Bragantino dominou jogo (gols 2×0, 23 finalizações) mas Vitória ainda defendeu com volume
- **Lição:** HDP -1.5 no BR é APERTADO; precisa xDiff ≥+4 pra ter margem

### Caso 3 — Fluminense -1.0 vs São Paulo (RED clean)
- xDiff projetado: +2.25
- **Real: Diff −2** (Flu 3×5 — SP venceu cantos!)
- **Diagnóstico:** Flu venceu gols 2×1 mas SP dominou posse e finalização do 2T (8 cantos só no 2T)
- **Lição:** o padrão MLS "favorito perde gols vence cantos" pode SE INVERTER no BR — favorito que vence gols PODE perder cantos no 2T

---

## 🧬 Padrão BR cravado (vs MLS)

| Característica | MLS | BR |
|----------------|-----|-----|
| Favorito MAND perde gols → vence cantos | **93%** | **0%** (1 caso testado) |
| Visitante vence gols → perde cantos | 63% (cravado MLS) | Falta validar |
| Padrão "vence HT → sofre cantos 2T" | Confirmado MLS | **Pode INVERTER no BR** |
| Estilo de jogo | Aberto, contra-ataque rápido | Mais cadenciado, posse de bola |

**Hipótese cravada:** BR tem jogos mais **táticos/cadenciados**, onde o time que está vencendo **mantém posse** (não recua tanto) — gera cantos mesmo liderando. Isso quebra o padrão MLS de "lidera → recua → sofre cantos".

---

## 🎯 PROTOCOLO OPERACIONAL BR (cravado)

### Para cada jogo da próxima rodada, OPERAR APENAS:

1. **UNDER 9.5 FT** se:
   - xFT projetado ≤8.5
   - Ambos times têm RECUA_POS_GOL ou DESISTE_POS_DERROTA
   - Pelo menos 1 dos times com DEFESA_SOLIDA
   - Stake 1.0u

2. **OVER 10.5 FT** se:
   - xFT projetado ≥12
   - Ambos times com perfis ofensivos (BLITZ_INICIAL ou ASFIXIA_FINAL)
   - Pelo menos 1 dos times SANGRA_COM_BOLA ou SANGRA_SEM_BOLA
   - Stake 1.0u

3. **OVER 9.5 FT** se:
   - xFT projetado ≥11 (folga ≥+1.5)
   - Pelo menos 1 elite_casa vs sangrador_fora
   - Stake 0.75u

4. **UNDER 4.5 HT** se:
   - Mandante ASFIXIA_FINAL (≤35% cantos no HT)
   - Visitante DEFESA_SOLIDA
   - xHT ≤3.5
   - Stake 1.0u

5. **1x2 Cantos Mandante** se:
   - xDiff ≥+2.5
   - Mandante saldo casa ≥+3 NOS ÚLTIMOS 3 JOGOS (regime ATIVO ou NEUTRO)
   - Visitante NÃO está em ATIVO_POSITIVO
   - Stake 1.0u

### NÃO OPERAR:
- ❌ HDP -1.5 ou -2.0 cantos
- ❌ HDP -1.0 com xDiff < +4
- ❌ Qualquer pick com time em REGIME QUEBRADO sem confirmação de outros sinais
- ❌ Picks com amostra do visitante fora N=1 (insuficiente)

---

## 📈 Janela de revalidação

Esse protocolo é **CALIBRADO em 1 rodada do BR** — exige confirmação em **3 rodadas seguidas** antes de virar regra cravada universal. Cada nova rodada:
1. Aplicar protocolo
2. Validar cego pós-rodada
3. Atualizar este documento
4. Se HDP voltar a funcionar consistentemente → reabilitar com cuidado

---

## 🗂️ Histórico de validações

| Data | WR | Saldo | Observações |
|------|-----|-------|-----------------|
| 2026-05-18 | 6/10 (60%) | +1.20u | HDP 0/3 (tóxico) · Resto 6/7 (86%) |

---

## 🛡️ Princípio cravado

> **No Brasil, a previsibilidade está no VOLUME de cantos, não na DIFERENÇA.**
> Aposte em quanto vai sair, não em quem vai dominar.
