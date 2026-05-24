# 🔍 AUDITORIA DE QUALIDADE — 7 LIGAS NOVAS (2026-04-30)

Análise automática dos 7 arquivos `<liga>2026.js` em `EDS-Analise-ODDS/especialista-cantos/data/`.

---

## 📊 Sumário comparativo

| Liga | Jogos | Times tabela | Times c/ jogos | Datas | Rodadas | Média cantos FT | Mín/Máx | Cantos 0-0 | Sem placar | IDs dup |
|---|---|---|---|---|---|---|---|---|---|---|
| 🇧🇷 **BR_B** | 59 | 20 | 20 | 01.04.2026 18:00 → 31.03.2026 19:00 | 40 | **10.61** | 1/20 | 0 (0%) | 0 | 0 |
| 🇯🇵 **J2** | 46 | 20 | 19 | 01.03.2026 01:05 → 29.04.2026 05:00 | 35 | **9.96** | 2/17 | 0 (0%) | 0 | 0 |
| 🇦🇷 **ARG_M** | 131 | 22 | 22 | 03.03.2026 17:00 → 29.03.2026 16:00 | 118 | **8.50** | 3/15 | 0 (0%) | 0 | 0 |
| 🇨🇳 **CHN_1** | 47 | 16 | 16 | 04.04.2026 04:00 → 26.04.2026 08:30 | 34 | **9.45** | 4/21 | 0 (0%) | 0 | 0 |
| 🇨🇳 **CHN_2** | 68 | 24 | 24 | 04.04.2026 04:00 → 29.04.2026 08:35 | 51 | **8.91** | 3/16 | 0 (0%) | 0 | 0 |
| 🇨🇳 **CHN_SUP** | 65 | 16 | 16 | 01.03.2026 04:30 → 26.04.2026 09:00 | 52 | **10.89** | 4/20 | 0 (0%) | 0 | 0 |
| 🇯🇵 **J2_J3** | 258 | 40 | 40 | 01.03.2026 01:00 → 29.04.2026 06:00 | 233 | **10.00** | 2/17 | 0 (0%) | 0 | 0 |

---
## 📋 Detalhes por liga

### 🇧🇷 Brasileirão Série B (`BR_B`)

**Arquivo:** [`brasileiraoB2026.js`](EDS-Analise-ODDS/especialista-cantos/data/brasileiraoB2026.js) · **Variável:** `window.DADOS_BR_B`

**Resumo:**
- Jogos coletados: **59**
- Times no array `times[]`: 20
- Times únicos que apareceram em jogos: 20
- Datas: **01.04.2026 18:00** → **31.03.2026 19:00**
  - 🚨 **59 jogos com data fora de 2026** (vazamento de temp anterior)
- Rodadas detectadas: **40**
- Match IDs duplicados: **0** ✅

**Cantos FT:**
- Média: **10.61** cantos/jogo · Mediana: 11
- Mín: 1 · Máx: 20
- Jogos com **0 cantos** (suspeitos): **0** (0.0%)
- Média HT (1º tempo): 4.75

**Placar:**
- Jogos com placar válido: 59/59
- Média de gols/jogo: **2.15**

**Distribuição de jogos por time:**
- 🥇 Mais jogos: Ceara (6), Vila Nova FC (6), Operario-PR (6)
- 📉 Menos jogos: Sao Bernardo (5), Goias (5), America MG (6)

**Top 3 jogos com mais cantos:**
- 22.03.2026 16:00 · **Nautico 12 – 8 Criciuma** (total 20)
- 04.04.2026 18:00 · **Nautico 17 – 3 Ponte Preta** (total 20)
- 26.04.2026 18:00 · **Operario-PR 11 – 7 Fortaleza** (total 18)

---

### 🇯🇵 J2 League (sozinha) (`J2`)

**Arquivo:** [`j2league2026.js`](EDS-Analise-ODDS/especialista-cantos/data/j2league2026.js) · **Variável:** `window.DADOS_J2`

**Resumo:**
- Jogos coletados: **46**
- Times no array `times[]`: 20
- Times únicos que apareceram em jogos: 19
  - ⚠️ **Times no array sem jogos:** V-Varen Nagasaki
- Datas: **01.03.2026 01:05** → **29.04.2026 05:00**
  - 🚨 **46 jogos com data fora de 2026** (vazamento de temp anterior)
- Rodadas detectadas: **35**
- Match IDs duplicados: **0** ✅

**Cantos FT:**
- Média: **9.96** cantos/jogo · Mediana: 10
- Mín: 2 · Máx: 17
- Jogos com **0 cantos** (suspeitos): **0** (0.0%)
- Média HT (1º tempo): 4.28

**Placar:**
- Jogos com placar válido: 46/46
- Média de gols/jogo: **2.46**

**Distribuição de jogos por time:**
- 🥇 Mais jogos: Omiya Ardija (8), Kofu (8), Hokkaido Consadole Sapporo (8)
- 📉 Menos jogos: Mito (2), Chiba (2), Blaublitz (3)

**Top 3 jogos com mais cantos:**
- 28.02.2026 04:00 · **Ehime 11 – 6 Tokushima** (total 17)
- 29.03.2026 02:00 · **Toyama 9 – 7 Imabari** (total 16)
- 14.03.2026 02:00 · **Kofu 4 – 11 Iwaki** (total 15)

---

### 🇦🇷 Primera B Metropolitana (Argentina) (`ARG_M`)

**Arquivo:** [`metropolitana2026.js`](EDS-Analise-ODDS/especialista-cantos/data/metropolitana2026.js) · **Variável:** `window.DADOS_ARG_M`

**Resumo:**
- Jogos coletados: **131**
- Times no array `times[]`: 22
- Times únicos que apareceram em jogos: 22
- Datas: **03.03.2026 17:00** → **29.03.2026 16:00**
  - 🚨 **131 jogos com data fora de 2026** (vazamento de temp anterior)
- Rodadas detectadas: **118**
- Match IDs duplicados: **0** ✅

**Cantos FT:**
- Média: **8.50** cantos/jogo · Mediana: 8
- Mín: 3 · Máx: 15
- Jogos com **0 cantos** (suspeitos): **0** (0.0%)
- Média HT (1º tempo): 4.00

**Placar:**
- Jogos com placar válido: 131/131
- Média de gols/jogo: **1.98**

**Distribuição de jogos por time:**
- 🥇 Mais jogos: Arsenal Sarandi (12), Villa Dalmine (12), Excursionistas (12)
- 📉 Menos jogos: UAI Urquiza (11), Flandria (11), Liniers (12)

**Top 3 jogos com mais cantos:**
- 11.04.2026 15:30 · **Villa Dalmine 10 – 5 Laferrere** (total 15)
- 25.04.2026 15:30 · **Ituzaingo 8 – 7 Excursionistas** (total 15)
- 22.02.2026 17:00 · **Villa Dalmine 6 – 8 Dep. Merlo** (total 14)

---

### 🇨🇳 China League One (2ª div) (`CHN_1`)

**Arquivo:** [`chinaone2026.js`](EDS-Analise-ODDS/especialista-cantos/data/chinaone2026.js) · **Variável:** `window.DADOS_CHN_1`

**Resumo:**
- Jogos coletados: **47**
- Times no array `times[]`: 16
- Times únicos que apareceram em jogos: 16
- Datas: **04.04.2026 04:00** → **26.04.2026 08:30**
  - 🚨 **47 jogos com data fora de 2026** (vazamento de temp anterior)
- Rodadas detectadas: **34**
- Match IDs duplicados: **0** ✅

**Cantos FT:**
- Média: **9.45** cantos/jogo · Mediana: 8
- Mín: 4 · Máx: 21
- Jogos com **0 cantos** (suspeitos): **0** (0.0%)
- Média HT (1º tempo): 4.64

**Placar:**
- Jogos com placar válido: 47/47
- Média de gols/jogo: **2.13**

**Distribuição de jogos por time:**
- 🥇 Mais jogos: Changchun Yatai (6), Guangdong GZ-Power (6), Meizhou Hakka (6)
- 📉 Menos jogos: Shaanxi Union (5), Dalian K'un City (5), Shijiazhuang Gongfu (6)

**Top 3 jogos com mais cantos:**
- 12.04.2026 08:30 · **Dingnan Ganlian 17 – 4 Nanjing City** (total 21)
- 04.04.2026 08:30 · **Guangxi Hengchen 6 – 12 Guangdong GZ-Power** (total 18)
- 14.03.2026 08:30 · **Nantong Zhiyun 8 – 6 Shijiazhuang Gongfu** (total 14)

---

### 🇨🇳 China League Two (3ª div) (`CHN_2`)

**Arquivo:** [`chinatwo2026.js`](EDS-Analise-ODDS/especialista-cantos/data/chinatwo2026.js) · **Variável:** `window.DADOS_CHN_2`

**Resumo:**
- Jogos coletados: **68**
- Times no array `times[]`: 24
- Times únicos que apareceram em jogos: 24
- Datas: **04.04.2026 04:00** → **29.04.2026 08:35**
  - 🚨 **68 jogos com data fora de 2026** (vazamento de temp anterior)
- Rodadas detectadas: **51**
- Match IDs duplicados: **0** ✅

**Cantos FT:**
- Média: **8.91** cantos/jogo · Mediana: 9
- Mín: 3 · Máx: 16
- Jogos com **0 cantos** (suspeitos): **0** (0.0%)
- Média HT (1º tempo): 4.13

**Placar:**
- Jogos com placar válido: 68/68
- Média de gols/jogo: **2.35**

**Distribuição de jogos por time:**
- 🥇 Mais jogos: Shanghai Second (7), Wenzhou Professional (7), Shandong Taishan B (6)
- 📉 Menos jogos: Shanghai Port B (4), Jiangxi Lushan (5), Changchun Xidu (5)

**Top 3 jogos com mais cantos:**
- 21.03.2026 05:00 · **Xiamen Feilu 3 – 13 Guizhou Guiyang** (total 16)
- 29.04.2026 04:00 · **Shanxi Chongde Ronghai 9 – 6 Dalian Yingbo B** (total 15)
- 11.04.2026 08:35 · **Chengdu Rongcheng B 3 – 12 Shenzhen** (total 15)

---

### 🇨🇳 Chinese Super League (1ª div) (`CHN_SUP`)

**Arquivo:** [`chinasuper2026.js`](EDS-Analise-ODDS/especialista-cantos/data/chinasuper2026.js) · **Variável:** `window.DADOS_CHN_SUP`

**Resumo:**
- Jogos coletados: **65**
- Times no array `times[]`: 16
- Times únicos que apareceram em jogos: 16
- Datas: **01.03.2026 04:30** → **26.04.2026 09:00**
  - 🚨 **65 jogos com data fora de 2026** (vazamento de temp anterior)
- Rodadas detectadas: **52**
- Match IDs duplicados: **0** ✅

**Cantos FT:**
- Média: **10.89** cantos/jogo · Mediana: 10
- Mín: 4 · Máx: 20
- Jogos com **0 cantos** (suspeitos): **0** (0.0%)
- Média HT (1º tempo): 5.34

**Placar:**
- Jogos com placar válido: 65/65
- Média de gols/jogo: **2.85**

**Distribuição de jogos por time:**
- 🥇 Mais jogos: Beijing Guoan (9), Shanghai Port (9), Chengdu Rongcheng (8)
- 📉 Menos jogos: Henan Songshan Longmen (8), Liaoning Tieren (8), Dalian Yingbo (8)

**Top 3 jogos com mais cantos:**
- 25.04.2026 08:35 · **Beijing Guoan 17 – 3 Tianjin Jinmen Tiger** (total 20)
- 15.03.2026 08:00 · **Shanghai Port 12 – 7 Qingdao West Coast** (total 19)
- 21.03.2026 08:00 · **Henan Songshan Longmen 13 – 6 Wuhan Three Towns** (total 19)

---

### 🇯🇵 J2/J3 League (combinada — 4 federações) (`J2_J3`)

**Arquivo:** [`j2j3league2026.js`](EDS-Analise-ODDS/especialista-cantos/data/j2j3league2026.js) · **Variável:** `window.DADOS_J2_J3`

**Resumo:**
- Jogos coletados: **258**
- Times no array `times[]`: 40
- Times únicos que apareceram em jogos: 40
- Datas: **01.03.2026 01:00** → **29.04.2026 06:00**
  - 🚨 **258 jogos com data fora de 2026** (vazamento de temp anterior)
- Rodadas detectadas: **233**
- Match IDs duplicados: **0** ✅

**Cantos FT:**
- Média: **10.00** cantos/jogo · Mediana: 10
- Mín: 2 · Máx: 17
- Jogos com **0 cantos** (suspeitos): **0** (0.0%)
- Média HT (1º tempo): 4.63

**Placar:**
- Jogos com placar válido: 258/258
- Média de gols/jogo: **2.75**

**Distribuição de jogos por time:**
- 🥇 Mais jogos: Kusatsu (13), Vegalta Sendai (13), Montedio Yamagata (13)
- 📉 Menos jogos: Reilac Shiga (11), Oita Trinita (12), Gainare Tottori (12)

**Top 3 jogos com mais cantos:**
- 25.04.2026 05:00 · **Sagamihara 8 – 9 Shonan Bellmare** (total 17)
- 04.04.2026 02:00 · **Yokohama FC 11 – 6 Blaublitz** (total 17)
- 19.04.2026 02:00 · **Tochigi SC 9 – 8 Sagamihara** (total 17)

---

## 🩺 Veredito de qualidade

- **Match IDs duplicados:** ⚠️ Verificar tabela acima
- **Total de jogos auditados:** 674
- **Jogos com 0 cantos no FT:** 0 (0.0%)
- **Jogos sem placar:** 0

### O que olhar:
1. **Times sem jogos** (se aparecer): time foi rebaixado/desligou? Ou problema na coleta?
2. **Datas fora de 2026** (se aparecer): vazamento da temp 2025 — precisa filtrar.
3. **Jogos com 0 cantos**: se >5%, pode haver bug de extração.
4. **Distribuição por time**: se um time tem MUITO menos jogos que os outros, scrape pode ter falhado.
5. **Média de cantos**: se for muito baixa (<7) ou muito alta (>14), revisar.