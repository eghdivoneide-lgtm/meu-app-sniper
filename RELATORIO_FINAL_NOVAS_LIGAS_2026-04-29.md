# 🏆 RELATÓRIO FINAL — NOVAS LIGAS COLETADAS (29/04/2026)

**Agente:** `varredor-por-time.js` (histórico completo via tabela de classificação, deduplicação por `match_id`, filtro por temporada)
**Tempo total:** ~13h (coleta inicial + recovery J2/J3, com 4GB heap, AUTO-RESTART do browser a cada 35 jogos)
**Total coletado:** **693 jogos** em **7 ligas** novas

---

## 📊 Resumo geral

| # | Liga | País | Times | Jogos novos detectados | Jogos salvos | % |
|---|---|---|---|---|---|---|
| 1 | **Brasileirão Série B** | 🇧🇷 | 20 | 92 | **78** | 85% |
| 2 | **J2 League** (separada) | 🇯🇵 | 20 | 46 | **46** | 100% |
| 3 | **Primera B Metropolitana** | 🇦🇷 | 22 | 132 | **131** | 99% |
| 4 | **China League One** (2ª div) | 🇨🇳 | 16 | 47 | **47** | 100% |
| 5 | **China League Two** (3ª div) | 🇨🇳 | 24 | 70 | **68** | 97% |
| 6 | **Chinese Super League** (1ª div) | 🇨🇳 | 16 | 65 | **65** | 100% |
| 7 | **J2/J3 League** (combinada, 4 federações) | 🇯🇵 | 40 | 259 | **258** ✅ | 99.6% |
| | **TOTAL** | | **158** | **711** | **693** | **97.5%** |

> ✅ J2/J3 foi reprocessada após o recovery — passou de 153 para 258 jogos (recuperou 105 dos 106 faltantes; 1 jogo no FlashScore não tinha cantos disponíveis).

---

## 📁 Arquivos gerados

Todos salvos em `EDS-Analise-ODDS/especialista-cantos/data/` (com backup automático em `EDS-Analise-ODDS/projeto-fantasma/backups/`):

| Arquivo | Variável JS | Tamanho |
|---|---|---|
| [brasileiraoB2026.js](EDS-Analise-ODDS/especialista-cantos/data/brasileiraoB2026.js) | `window.DADOS_BR_B` | 54 KB |
| [j2league2026.js](EDS-Analise-ODDS/especialista-cantos/data/j2league2026.js) | `window.DADOS_J2` | 32 KB |
| [metropolitana2026.js](EDS-Analise-ODDS/especialista-cantos/data/metropolitana2026.js) | `window.DADOS_ARG_M` | 92 KB |
| [chinaone2026.js](EDS-Analise-ODDS/especialista-cantos/data/chinaone2026.js) | `window.DADOS_CHN_1` | 33 KB |
| [chinatwo2026.js](EDS-Analise-ODDS/especialista-cantos/data/chinatwo2026.js) | `window.DADOS_CHN_2` | 48 KB |
| [chinasuper2026.js](EDS-Analise-ODDS/especialista-cantos/data/chinasuper2026.js) | `window.DADOS_CHN_SUP` | 46 KB |
| [j2j3league2026.js](EDS-Analise-ODDS/especialista-cantos/data/j2j3league2026.js) | `window.DADOS_J2_J3` | 106 KB |

> ⚠️ **IMPORTANTE:** os arquivos foram salvos APENAS em `EDS-Analise-ODDS/especialista-cantos/data/`. Não foram copiados para `especialista-cantos/data/` da raiz (a cópia que o `RODAR_NOITE.bat` usa). Quando autorizar a integração, copio também.

---

## ⚠️ Observações importantes

### 🇯🇵 J2/J3 — recovery executado com sucesso ✅
1ª rodada: 259 detectados → 153 salvos (106 falhas por `net::ERR_FAILED`).
**Recovery rodado em 22:35–23:40:** dedupe pulou os 153 já salvos, processou os 106 faltantes e recuperou **105**. Resultado final: **258/259 = 99.6%**.

> 1 jogo continuou sem cantos no FlashScore (provavelmente partida muito antiga ou sem stats publicadas pela federação).

### 🇨🇳 China — foram coletadas as 3 divisões
Você inicialmente pediu "League One" e "League Two", depois corrigiu "1 = Super League". Pra não te deixar sem opção, coletei **as 3 divisões inteiras**:
- **CHN_SUP** = `china/super-league` = 1ª divisão (a "Liga 1" que você queria)
- **CHN_1** = `china/league-one` = 2ª divisão
- **CHN_2** = `china/league-two` = 3ª divisão

Você decide quais entram no app. Sugiro priorizar **CHN_SUP** + **CHN_1** (cobertura das 2 divisões principais — com 16 times cada e bons dados).

### 🇯🇵 Japão — 2 opções coletadas
- **J2** (sozinha, 20 times, 46 jogos)
- **J2/J3** (combinada, 4 federações regionais Leste A/B + Oeste A/B, 40 times, 153 jogos)

A J2/J3 combinada é a que você descreveu. A J2 sozinha foi coleta de ontem e ficou no banco como bônus. Use a que preferir.

---

## 🚨 Pendências pra integração no app

Como combinamos antes, **NÃO mexi no `index.html`** do especialista-cantos. Pra ativar essas 7 ligas no app, você (ou eu, com sua autorização) precisa editar o `index.html` em **6 pontos**, conforme o passo-a-passo do relatório anterior `RELATORIO_NOVAS_LIGAS_2026-04-29.md` (seção "Como integrar no app").

Pra cada liga nova, é equivalente a:

```js
// 1. <script src> no head/body do HTML
<script src="data/brasileiraoB2026.js?v=2026-04-29"></script>

// 2. mapa de códigos
mapa['BR_B'] = 'DADOS_BR_B';

// 3. _LIGAS_PRIORIDADE (push)
'DADOS_BR_B'

// 4. array de ligas (objeto)
{ code: 'BR_B', nome: 'Brasileirão Série B', flag: '🇧🇷', dadosKey: 'DADOS_BR_B' }

// 5. ligaMap
BR_B: window.DADOS_BR_B

// 6. lista de carregamento
{ key: 'BR_B', dados: window.DADOS_BR_B }
```

Multiplique isso por 7 ligas = **42 trechos** pra editar.

---

## 🔜 Próximos passos sugeridos

1. **Conferir os arquivos** — abrir cada `<liga>2026.js` e verificar se os jogos batem com seu gabarito.
2. **Decidir quais ligas vão pro app:**
   - Brasileirão Série B → recomendado ✅
   - ARG Metropolitana → recomendado ✅ (131 jogos é robusto)
   - China Super League → recomendado ✅
   - China League One/Two → opcional (ligas inferiores)
   - J2/J3 → recomendado ✅ (ou só J2 se preferir)
3. **Recuperar os 106 jogos do J2/J3** que falharam (re-rodar o varredor-por-time).
4. **Quando autorizar, eu integro no `index.html`** — fazendo uma liga por vez pra você acompanhar e testar.
5. Pendente histórico: investigar **jogos sumidos no app + bet tracker** (mencionado dia 28).

---

## 📋 Configurações que adicionei no `varredor-por-time.js`

Pra você poder re-rodar qualquer liga sob demanda no futuro:

```bash
cd EDS-Analise-ODDS/projeto-fantasma
node --max-old-space-size=4096 varredor-por-time.js --liga BR_B --temporada 2026
node --max-old-space-size=4096 varredor-por-time.js --liga J2 --temporada 2026
node --max-old-space-size=4096 varredor-por-time.js --liga J2_J3 --temporada 2026
node --max-old-space-size=4096 varredor-por-time.js --liga ARG_M --temporada 2026
node --max-old-space-size=4096 varredor-por-time.js --liga CHN_1 --temporada 2026
node --max-old-space-size=4096 varredor-por-time.js --liga CHN_2 --temporada 2026
node --max-old-space-size=4096 varredor-por-time.js --liga CHN_SUP --temporada 2026
```

Cada uma faz **upsert** (não duplica jogos já existentes) e gera backup automático.

---

🎯 **Pacote completo entregue, mestre.** Aguardo sua decisão sobre integração no app.
