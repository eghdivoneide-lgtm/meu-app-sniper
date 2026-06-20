# Consolidação de Dados — EDS-HDP-Pro

> Executado em 24/05/2026 após a Fase 3.
> Operador pediu: "Quero os dados reais de todo o histórico de jogos".

## Fontes consolidadas

Para cada uma das 6 ligas, agregamos jogos de 3 fontes diferentes,
deduplicando por `match_id` e mantendo sempre a versão **mais rica** quando há conflito:

1. **`Analise-Refinada/<LIGA>/`** — fonte primária do HDP-Pro (formato Flashscore-Monster v4)
2. **`projeto-fantasma/rodadas/<LIGA>/`** — lotes do varredor (mesmo formato, mais histórico)
3. **`especialista-cantos/data/<liga>2026.js`** — banco operacional do especialista (formato `window.DADOS_X`)

O especialista usa formato simplificado (`cantos.ft.m/v`); criamos um **normalizador**
no script de consolidação que mapeia esse formato para `estatisticas_ft.cantos.{m,v}`,
destravando jogos que antes seriam descartados.

## Resultado

| Liga  | Fase 0 (só Refinada) | Especialista | **HDP-Pro consolidado** | Ganho |
|-------|----------------------|--------------|-------------------------|-------|
| BR    |  58 |  157 | **169** | +12 vs especialista |
| BR_B  |  43 |   87 |  **87** | — |
| ARG   | 116 |  253 | **268** | +15 |
| ARG_B | 137 |  234 | **249** | +15 |
| MLS   | 119 |  192 | **209** | +17 |
| USL   |  67 |  106 | **106** | — |
| **TOTAL** | **540** | **1.029** | **1.088** | **+59 vs especialista, +684 vs Fase 0** |

## DNA atualizado (Fase 3 — pós-consolidação)

Com amostra 2.7× maior, várias médias se estabilizaram. Comparação:

| Liga  | Diff média Fase 0 | Diff média Fase 3 | % Dominados (diff ≥ 3) |
|-------|-------------------|-------------------|-------------------------|
| BR    | 3.47 | **3.75** ⬆ | 58.0% |
| BR_B  | 3.33 | 3.23 | 48.3% |
| ARG   | **4.23** | **3.28** ⬇⬇ | 53.0% |
| ARG_B | 3.12 | 3.31 | 57.0% |
| MLS   | 3.75 | 3.69 | 58.9% |
| USL   | 3.78 | 3.72 | **62.3%** (maior!) |

**Achado importante:** A ARG NÃO é a mais polarizada como o DNA preliminar sugeriu
(amostra de 116 jogos era enviesada). Com 268 jogos, a diff média caiu de **4.23 → 3.28**,
ficando na média do grupo. Isso **invalida** a sugestão de X=2.5 só pra ARG.

A USL tem o maior **% Dominados** (62.3%) — sugere que jogos com sinal forte são mais
comuns na USL apesar da liga ter média de cantos não tão alta. Pode ser interessante
pra estratégia de filtro Elite.

## Implicação pros thresholds X (a confirmar na Fase 5 com backtest)

DNA preliminar sugeria:
- ARG: 2.5  →  **revisar pra 2.0** (média alinhada com BR/MLS agora)
- USL: 2.3  →  **manter ou subir pra 2.5** (alto % dominados)
- MLS: 2.3
- BR:  2.0  →  **revisar pra 2.2** (diff subiu pra 3.75)
- BR_B: 2.0
- ARG_B: 1.8 →  **revisar pra 2.0** (alinhada com BR_B agora)

**Não vou aplicar essas mudanças agora** — Fase 5 vai validar com backtest cego e definir
os valores finais com base em WR e ROI observados, não em palpite.

## Como regenerar

```bash
# 1. Re-consolidar (busca em todas as 3 fontes, dedup, normaliza, salva)
node EDS-HDP-Pro/data/_build_banco.js  # (consome /tmp/hdppro_consolidado_v2.json)

# Alternativa: rodar o script ad-hoc que fez esta consolidação
# (atualmente foi feito inline; ver chat 24/05/2026)
```
