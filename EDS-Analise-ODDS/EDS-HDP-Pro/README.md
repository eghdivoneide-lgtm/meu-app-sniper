# EDS-HDP-Pro

App dedicado ao mercado de **Handicap Asiático (HDP) + Vencedor 1x2 de Cantos**,
com calibração exclusiva por liga.

## Ligas suportadas (540 jogos, 100% ricos)

| Liga  | Jogos | Cobertura FT/HT |
|-------|-------|-----------------|
| BR    |  58   | 100%            |
| BR_B  |  43   | 100%            |
| ARG   | 116   | 100%            |
| ARG_B | 137   | 100%            |
| MLS   | 119   | 100%            |
| USL   |  67   | 100%            |

## Estrutura

```
EDS-HDP-Pro/
├── index.html              # 5 telas: Dashboard, Ranking, Por Time, Vencedor+HDP, Filtro Elite
├── motor/
│   ├── projecao_hdp.js     # Poisson HT+FT por time
│   ├── ranking_hdp.js      # 4 rankings: atk/conc × casa/fora
│   ├── filtro_elite.js     # cruzamento ranking + vantagem projetada
│   └── calibracao.js       # thresholds por liga (calibrados via backtest)
├── data/                   # cópia local de Analise-Refinada/ (6 ligas)
├── backtest/               # validação cega + tracker de apostas reais
└── docs/
    ├── DNA_LIGAS.md        # DNA refinado por liga (atualizado a cada fase)
    └── dna_preliminar.json # estatísticas brutas iniciais
```

## Mercados cobertos

- **Vencedor Cantos 1x2** (Casa / Empate / Fora) HT e FT
- **HDP Asiático**:
  - HT: -0.5 / -1.0
  - FT: -1.0 / -1.5 / -2.0 / -2.5

## Critério ELITE (alinhado com operador 24/05/2026)

Jogo passa em ELITE quando:
1. Favorito ∈ Top-N "ataca cantos em casa" da liga
2. Azarão ∈ Top-N "concede cantos fora" da liga
3. `expFavorito − expAzarão ≥ X cantos` (X calibrado por liga)

Top-N inicial: 8. X inicial por liga (refinado na Fase 5).
