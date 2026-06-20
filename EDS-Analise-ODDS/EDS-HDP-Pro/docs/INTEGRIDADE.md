# Integridade do banco — 24/05/2026 (correção definitiva)

## Erro que cometi e correção (Padrão EDS R3)

### Primeira tentativa (errada)
Inventei uma lista da Série A 2026 com `Ceará, Fortaleza, Juventude, Sport` e descartei
`Chapecoense, Coritiba, Remo, Vitória` como sendo da Série B.

### Operador me corrigiu
> "Esses times que vc citou são da Série B! Clone os dados do especialista-cantos!"

### Correção aplicada
A lista canônica vem **direto do banco do especialista-cantos**. NÃO INVENTO mais:

- `especialista-cantos/data/brasileirao2026.js` → 20 times únicos (28 entradas brutas com duplicatas)
- `especialista-cantos/data/brasileiraoB2026.js` → 20 times (sem duplicatas)
- `especialista-cantos/data/argentina2026.js` → 30 times
- `especialista-cantos/data/argentina_b2026.js` → 36 times
- `especialista-cantos/data/mls2026.js` → 30 times
- `especialista-cantos/data/usl2026.js` → 25 times

## Lista oficial BR 2026 (clonada do especialista)

```
Athletico-PR     · Atlético-MG    · Bahia           · Botafogo
Red Bull Bragantino · Chapecoense  · Corinthians    · Coritiba
Cruzeiro         · Flamengo        · Fluminense      · Grêmio
Internacional    · Mirassol        · Palmeiras       · Remo
Santos           · São Paulo       · Vasco           · Vitória
```

## Duplicatas de grafia detectadas no banco BR (resolvidas via ALIASES)

| Variante "como aparecia" | Nome canônico |
|--------------------------|----------------|
| Atletico-MG / Atletico MG | Atlético-MG |
| Gremio | Grêmio |
| Sao Paulo | São Paulo |
| Vitoria | Vitória |
| Bragantino / RB Bragantino | Red Bull Bragantino |
| Flamengo RJ | Flamengo |
| Botafogo RJ | Botafogo |
| Chapecoense-SC | Chapecoense |

## Resultado final

| Liga | Jogos | Times oficiais | Cobertura |
|------|-------|----------------|-----------|
| BR | **169** | 20/20 | 100% ✅ |
| BR_B | 87 | 20/20 | 100% ✅ |
| ARG | 268 | 30/30 | 100% ✅ |
| ARG_B | 249 | 36/36 | 100% ✅ |
| MLS | 209 | 30/30 | 100% ✅ |
| USL | 106 | 25/25 | 100% ✅ |
| **TOTAL** | **1.088** | **161 times** | **100%** |

### Distribuição de jogos por time no BR (auditoria de balanceamento)

```
Athletico-PR        casa=10 fora= 7    ← Flamengo casa= 6 fora=11 (mais jogos fora)
Atlético-MG         casa= 9 fora= 8    ← Grêmio   casa= 8 fora=10
Bahia               casa= 9 fora= 7
Botafogo            casa= 8 fora= 8
Chapecoense         casa= 9 fora= 7
Corinthians         casa= 9 fora= 8
Coritiba            casa= 7 fora=10
Cruzeiro            casa= 8 fora= 9
Flamengo            casa= 6 fora=11
Fluminense          casa=10 fora= 7
Grêmio              casa= 8 fora=10
Internacional       casa= 9 fora= 8
Mirassol            casa= 8 fora= 8
Palmeiras           casa= 9 fora= 9
Red Bull Bragantino casa=10 fora= 8
Remo                casa= 8 fora= 9
Santos              casa= 9 fora= 8
São Paulo           casa= 8 fora= 9
Vasco               casa= 8 fora= 9
Vitória             casa= 7 fora= 9
```

Todos os 20 times com **≥ 6 jogos em casa e ≥ 7 fora** — base estatística saudável.

## Lição aprendida

**NUNCA inventar lista oficial.** A fonte de verdade é o `data/` do especialista-cantos.
O `_times_oficiais.js` é apenas uma cópia deduplicada (via ALIASES) — não uma "opinião" sobre
quem deveria estar na liga.

Se o especialista atualizar a lista (subir/descer time), basta re-rodar:
```bash
node EDS-HDP-Pro/data/_consolidar_fontes.js --build
```

Mas atenção: o `_times_oficiais.js` precisa ser regenerado manualmente se um time NOVO
aparecer no especialista — o script atual filtra contra a lista hard-coded. Pode ser
automatizado depois (script que extrai a lista e regenera o `.js`).
