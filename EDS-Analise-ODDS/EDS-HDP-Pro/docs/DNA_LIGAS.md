# DNA das 6 ligas — EDS-HDP-Pro

> Documento vivo. Atualizado a cada fase conforme o motor é construído.
> Fase atual: **0 — DNA preliminar** (sem análise por time, sem ranking)

## Tabela base (Fase 0 — pós-cópia, 540 jogos)

| Liga  | Jogos | Cantos FT médio | Cantos HT médio | Diff média FT | Insight preliminar |
|-------|-------|-----------------|-----------------|---------------|---------------------|
| BR    | 58    | 9.91            | 4.53            | 3.47          | médio/equilibrada — HDP -1.5 deve dominar |
| BR_B  | 43    | 9.74            | 4.72            | 3.33          | similar a BR, mas HT mais alto |
| ARG   | 116   | 8.99            | 4.16            | **4.23** ⚠️   | **mais polarizada das 6** — favorito impõe quase 1 corner extra vs as outras |
| ARG_B | 137   | 8.92            | 4.14            | 3.12          | a MENOS polarizada — surpresa, prevíamos similar à ARG |
| MLS   | 119   | **10.37**       | **4.90**        | 3.75          | liga mais ofensiva — vantagens grandes mas voláteis |
| USL   | 67    | 9.30            | 4.37            | 3.78          | perfil próximo de MLS, amostra menor |

## Observações que JÁ orientam o motor

### 1. Threshold X (filtro Elite) deve variar por liga

A "diff média FT" sugere ponto de partida para X (a confirmar em backtest cego):

- ARG:    X ≈ **2.5** (sinal forte = diff projetada acima da média alta da liga)
- USL:    X ≈ **2.3**
- MLS:    X ≈ **2.3**
- BR:     X ≈ **2.0**
- BR_B:   X ≈ **2.0**
- ARG_B:  X ≈ **1.8** (liga menos polarizada — sinais menores já são significativos)

### 2. Linhas HDP naturais por liga

Baseado na diff média FT:

| Liga  | Linha HDP "central" sugerida |
|-------|------------------------------|
| ARG   | **-2.0** (diff 4.23) |
| MLS   | -1.5/-2.0 (diff 3.75) |
| USL   | -1.5/-2.0 (diff 3.78) |
| BR    | -1.5 (diff 3.47) |
| BR_B  | -1.5 (diff 3.33) |
| ARG_B | -1.5 (diff 3.12) |

### 3. HT vs FT — peso das duas linhas

- MLS tem HT médio mais alto (4.90) → mercado HT -0.5/-1 mais ativo
- ARG_B/ARG têm HT mais contidos (4.1) → priorizar HDP FT

## Surpresas em relação ao histórico do especialista

| Achado anterior (especialista) | Achado aqui (Analise-Refinada) | Comentário |
|-------------------------------|-------------------------------|------------|
| ARG e ARG_B "trucadas" similares | ARG diff 4.23 vs ARG_B 3.12 | **ARG_B é bem mais equilibrada** — calibração unificada estava errada |
| MLS "heterogênea, MAE 3.04" | MLS diff 3.75, alta média total | confirma volatilidade — precisa cruzamento ranking forte |
| BR "favorito-amigo" | BR diff 3.47, média 9.91 | confirma — boa liga pra HDP -1.5 |

## A refinar na Fase 1

- DNA por TIME (não só liga): ranking ataca/concede em casa e fora
- Validação do X via backtest cego (Fase 5)
- Identificação de times-zebra (favoritos que decepcionam)
- Detector de "jogo morno" (média baixa → HDP arriscado)

---

## Fase 1 — DNA por TIME (rankings calculados)

Arquivo gerado: `data/_ranking_hdp.json` (8 rankings × 6 ligas)

### Top "ataca cantos em casa" (FT) — favorito natural pra HDP em casa

| Liga  | #1 | #2 | #3 |
|-------|-----|-----|-----|
| BR    | São Paulo (10.67) | Palmeiras (7.67) | Mirassol (7.00) |
| BR_B  | Operario-PR (7.67) | Athletic Club (6.33) | Ceará (5.67) |
| ARG   | Union de Santa Fe (10.67) | Vélez (7.50) | River (6.71) |
| ARG_B | Quilmes (8.00) | Atl. Rafaela (7.33) | Colegiales (7.00) |
| MLS   | San Jose (9.00) | Inter Miami (8.33) | CF Montreal (7.60) |
| USL   | Louisville City (10.33) | Sacramento (7.33) | Colorado Springs (6.33) |

### Top "concede cantos fora" (FT) — azarão natural a sofrer HDP

| Liga  | #1 | #2 | #3 |
|-------|-----|-----|-----|
| BR    | Bragantino (8.00) | Grêmio (7.33) | Palmeiras (7.00 — favorito ofensivo concede muito) |
| BR_B  | Náutico (8.67) | Fortaleza (6.33) | Botafogo SP (5.00) |
| ARG   | Gimnasia LP (9.00) | Newells (8.33) | Huracán (8.00) |
| ARG_B | Guemes (7.67) | Madryn (7.33) | Rafaela (6.67) |
| MLS   | Chicago Fire (10.67) | DC United (9.00) | Orlando (9.00) |
| USL   | — (n_fora insuficiente em maioria) |

### Achados surpreendentes da Fase 1

1. **Palmeiras (BR) aparece nos DOIS rankings** — top atacante em casa E top "concede fora". É um time de cantos extremos pros dois lados → HDP é mercado natural quando favorito mas perigoso quando azarão.
2. **MLS tem maior concentração** — Chicago Fire concede 10.67 fora (caso isolado), Inter Miami ataca 8.33 em casa. Cruzamento Inter Miami × Chicago em Miami = ELITE quase garantido.
3. **ARG: Union de Santa Fe (10.67) e Gimnasia LP (9.00)** — se enfrentarem em SF, será o jogo mais extremo do banco.
4. **USL n_fora insuficiente** — muitos times com <3 jogos fora no banco. Filtro Elite vai ser raro até banco crescer.

### Smoke test do Filtro Elite — taxas de aprovação

Em 48 confrontos sintéticos (8 por liga):

| Liga  | Elite/Total | Comentário |
|-------|-------------|------------|
| BR    | 0/8 | X=2.0 mas confrontos pseudoaleatórios não conseguiram cruzamento triplo |
| BR_B  | 1/8 | Ceará × Fortaleza (diff 2.27, ELITE) |
| ARG   | 0/8 | mesmo — confrontos não favoreceram cruzamento |
| ARG_B | 1/8 | Colegiales × Madryn (diff 2.13, ELITE) |
| MLS   | 1/8 | Chicago × DC (diff 2.66, ELITE) |
| USL   | 0/8 | n_fora ainda escasso |

Taxa global ≈ 6% — coerente com filtro de elite (não pode ser fácil passar).
