# Backtest Cego — Fase 5 (24/05/2026)

## Metodologia

Walk-forward sem leak temporal: para cada jogo `i` da liga (após aquecimento de 15 jogos), recalcula rankings usando APENAS jogos anteriores a `i`, simula o pick do Filtro Elite e compara com o resultado real.

Dois modos:
- **Estrito**: filtro Elite completo (favorito Top-N + azarão Top-N + diff ≥ X + WIN linha ≥ 55%)
- **Relaxado**: apenas diff ≥ X + WIN linha ≥ 55% (mede saúde do motor base, sem o filtro de ranking)

## Resultado (modo Estrito — filtro Elite completo)

| Liga  | X   | Picks | V | D | R | WR%  | ROI% |
|-------|-----|-------|---|---|---|------|------|
| BR    | 2.0 |   0   | — | — | — | —    | —    |
| BR_B  | 2.0 |   1   | 0 | 1 | 0 | 0%   | −100% |
| ARG   | 2.5 |   1   | 0 | 1 | 0 | 0%   | −100% |
| ARG_B | 1.8 |   2   | 2 | 0 | 0 | 100% | +71% |
| MLS   | 2.3 |   1   | 1 | 0 | 0 | 100% | +74% |
| USL   | 2.3 |   0   | — | — | — | —    | —    |
| **TOTAL** | — | **5** | 3 | 2 | 0 | **60%** | **+3.5%** |

**Diagnóstico:** filtro Elite estrito é tão seletivo que mal emite picks no histórico (apenas 5 totais em 1.088 jogos). Volume insuficiente pra calibrar X com confiança estatística.

## Resultado (modo Relaxado — apenas diff + prob)

| Liga  | X   | Picks | V  | D  | R | WR%   | ROI%  |
|-------|-----|-------|----|----|---|-------|-------|
| BR    | 2.0 |   1   | 0  | 1  | 0 | 0%    | −100% |
| BR_B  | 2.0 |   1   | 0  | 1  | 0 | 0%    | −100% |
| ARG   | 2.5 |   4   | 2  | 2  | 0 | 50%   | −13%  |
| ARG_B | 1.8 |  19   | 9  | 10 | 0 | 47.4% | −18%  |
| MLS   | 2.3 |   1   | 1  | 0  | 0 | 100%  | +74%  |
| USL   | 2.3 |   0   | —  | —  | — | —     | —     |
| **TOTAL** | — | **26** | 12 | 14 | 0 | **46.2%** | **−20%** |

**Por tier (modo relaxado):**
- ELITE: 17 picks, WR 41.2%, ROI −27%
- ELITE_FORTE: 6 picks, **WR 66.7%, ROI +13%** ✅
- ELITE_NUCLEAR: 3 picks, WR 33%, ROI −48%

## Conclusões honestas (Padrão EDS R3 + R10)

1. **Banco atual é insuficiente para calibrar X de forma confiável.** Cada liga tem 87-268 jogos no banco; metade já é "aquecimento" do walk-forward. Sobram poucos picks históricos pra mostrar tendência.

2. **Os X atuais NÃO devem ser alterados.** A evidência é fraca pra mudar. Manter X conforme `data/_times_oficiais.js` até o banco crescer.

3. **A faixa ELITE_FORTE no relaxado tem WR de 66.7%** com ROI +13% — sinal de que o motor base funciona quando há volume.

4. **O motor está recomendando muito HDP -2.5** (todos os 26 picks do relaxado foram nessa linha). Isso é porque `recomendarLinhaFT(absDiff)` sobe pra -2.5 quando diff ≥ 2.5. Combinado com nosso threshold X mínimo de 1.8-2.5, quase sempre cai em -2.5 — linha de baixa probabilidade.

5. **Recomendação técnica:** revisitar `recomendarLinhaFT()` no motor pra ser menos agressivo (ex: precisar de diff ≥ 3.0 pra recomendar -2.5, não 2.5). Não vou fazer agora sem mais dados.

## O que fazer agora

- **Manter X atuais** (`ARG=2.5, USL=2.3, MLS=2.3, BR=2.0, BR_B=2.0, ARG_B=1.8`).
- **Construir Bet Tracker (Fase 4)** — registra apostas reais que vão alimentar uma base de dados orgânica.
- **Re-rodar backtest mensalmente** conforme banco cresce: `node backtest/backtest_cego.js --grid`.
- **Quando alguma liga ultrapassar 50 picks Elite no histórico**, aí sim ajustar X com base no resultado.

## Comando

```bash
# Backtest completo (estrito + relaxado + grid search)
node backtest/backtest_cego.js --grid

# Só relaxado
node backtest/backtest_cego.js --relaxado --grid
```

Output: `backtest/_resultado_ultimo.json`
