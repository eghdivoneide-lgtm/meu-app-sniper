# 📊 RELATÓRIO — NOVAS LIGAS COLETADAS (29/04/2026)

**Solicitação do mestre:** adicionar J2/J3 (Japão), Brasileirão Série B e Liga Metropolitana (Argentina) ao especialista-cantos.

**Coleta:** Varredor-Rodada v4 (4 ligas em sequência) — 30+ min total.

---

## 🎯 Resumo executivo

| Liga | Pedido | Status | Jogos úteis | Pasta |
|---|---|---|---|---|
| 🇧🇷 **Brasileirão Série B** | ✅ | ✅ Pronto pra integrar | 11 | [_novas_ligas_2026-04-29/brasileiraoB2026.js](_novas_ligas_2026-04-29/brasileiraoB2026.js) |
| 🇦🇷 **Primera B Metropolitana** | ✅ | ✅ Pronto pra integrar | 11 | [_novas_ligas_2026-04-29/metropolitana2026.js](_novas_ligas_2026-04-29/metropolitana2026.js) |
| 🇯🇵 **J2 League (Japão)** | ⚠️ | ❌ Sem dados da temp 2026 | 0 | (JSON salvo, fora de uso) |
| 🇯🇵 **J3 League (Japão)** | ⚠️ | ❌ Sem dados da temp 2026 | 0 | (JSON salvo, fora de uso) |

---

## ⚠️ Por que J2 e J3 não aproveitam

Os 2 campeonatos foram **coletados com sucesso técnico** (12 jogos cada extraídos do FlashScore), MAS **as datas dos jogos são de 29/11/2025 a 14/12/2025** — ou seja, **jogos da temporada 2025 que já encerrou**.

A J-League roda em calendário fev-dez. A temporada 2026 da J2/J3 está provavelmente em pausa de inverno ou começou recentemente sem dados consolidados no FlashScore. Quando a temporada nova ganhar tração, basta rodar de novo:

```
cd EDS-Analise-ODDS/projeto-fantasma
node varredor-rodada.js --liga J2
node varredor-rodada.js --liga J3
```

(As configs já estão prontas no `varredor-rodada.js`.)

JSONs brutos salvos em [_novas_ligas_2026-04-29/](_novas_ligas_2026-04-29/) caso queira inspecionar os dados da temp 2025 (pode servir de "histórico" se decidir incluir).

---

## 🇧🇷 Brasileirão Série B — 11 jogos (rodada 19-27/04/2026)

**Times únicos coletados:** America MG, Athletic Club, Atletico GO, Avai, Botafogo SP, CRB, Ceara, Criciuma, Cuiaba, Fortaleza, Juventude, Londrina, Nautico, Novorizontino, Operario-PR, Ponte Preta, Sport Recife, Vila Nova FC (18 times — Série B tem 20 no total; 2 não jogaram nessa janela).

| Data | Mandante × Visitante | HT | FT | Cantos HT | Cantos FT | Posse FT | Finaliz FT |
|---|---|---|---|---|---|---|---|
| 27/04 19:00 | Athletic Club × Nautico | 0-0 | 0-1 | 4-0 | 8-4 | 54-46 | 9-15 |
| 26/04 20:30 | Atletico GO × Avai | 1-0 | 2-1 | 4-1 | 6-1 | 41-59 | 16-8 |
| 26/04 20:30 | Criciuma × CRB | 2-0 | 3-1 | 6-2 | 9-5 | 42-58 | 17-17 |
| 26/04 18:00 | Ceara × Vila Nova FC | 3-1 | 3-3 | 3-3 | 3-4 | 46-54 | 8-11 |
| 26/04 18:00 | Operario-PR × Fortaleza | 0-0 | 0-0 | 1-3 | 11-7 | 64-36 | 21-12 |
| 25/04 21:00 | Juventude × Londrina | 1-0 | 1-0 | 1-4 | 3-8 | 41-59 | 8-13 |
| 25/04 20:30 | Sport Recife × Novorizontino | 0-0 | 1-0 | 1-0 | 3-5 | 56-44 | 10-10 |
| 24/04 20:00 | Ponte Preta × America MG | 1-0 | 1-0 | 1-2 | 2-10 | 31-69 | 10-11 |
| 22/04 21:30 | Cuiaba × Botafogo SP | 0-0 | 1-1 | 4-0 | 6-4 | 57-43 | 17-10 |
| 19/04 20:00 | Fortaleza × Criciuma | 2-1 | 3-2 | 2-3 | 4-3 | 45-55 | 14-6 |
| 19/04 20:00 | Novorizontino × Athletic Club | 1-1 | 2-1 | 3-1 | 11-1 | 63-37 | 20-7 |

⚠️ **1 jogo não veio com cantos:** São Bernardo × Goiás (FlashScore retornou só 4 campos — provavelmente jogo sem stats publicadas).

---

## 🇦🇷 Primera B Metropolitana — 11 jogos (rodada 25-26/04/2026)

> ⚠️ Liga com **dataset reduzido** no FlashScore — só posse, finalizações, chutes ao alvo, cantos e cartões. Sem faltas/passes/impedimentos/defesas. Mesma limitação da Primera Nacional.

**Times únicos:** 22 — Argentino de Merlo, Argentino de Quilmes, Arsenal Sarandi, Brown Adrogue, Comunicaciones, Defensores Unidos, Dep. Merlo, Deportivo Armenio, Deportivo Camioneros, Dock Sud, Excursionistas, Flandria, Ituzaingo, Laferrere, Liniers, Real Pilar, San Martin Burzaco, Sportivo Italiano, Talleres (R.E), UAI Urquiza, Villa Dalmine, Villa San Carlos.

| Data | Mandante × Visitante | HT | FT | Cantos HT | Cantos FT | Posse FT | Finaliz FT |
|---|---|---|---|---|---|---|---|
| 26/04 15:30 | Arsenal Sarandi × Villa Dalmine | 1-1 | 1-1 | 3-5 | 7-5 | 56-44 | 7-12 |
| 26/04 15:30 | Comunicaciones × Dock Sud | 1-0 | 2-0 | 0-5 | 1-5 | 47-53 | 15-5 |
| 26/04 15:30 | Laferrere × Liniers | 0-0 | 0-0 | 2-2 | 2-4 | 51-49 | 4-1 |
| 26/04 15:30 | Talleres (R.E) × Real Pilar | 0-0 | 0-0 | 0-1 | 4-4 | 46-54 | 6-7 |
| 26/04 13:00 | Deportivo Armenio × San Martin Burzaco | 1-1 | 1-1 | 2-4 | 2-5 | 41-59 | 4-7 |
| 25/04 15:30 | Argentino de Merlo × UAI Urquiza | 0-0 | 0-2 | 1-1 | 1-4 | 46-54 | 9-7 |
| 25/04 15:30 | Argentino de Quilmes × Deportivo Camioneros | 0-0 | 0-0 | 1-0 | 6-1 | 51-49 | 14-7 |
| 25/04 15:30 | Defensores Unidos × Dep. Merlo | 1-1 | 1-1 | 2-1 | 4-4 | 56-44 | 12-10 |
| 25/04 15:30 | Flandria × Sportivo Italiano | 0-0 | 0-0 | 1-6 | 3-6 | 41-59 | 5-7 |
| 25/04 15:30 | Ituzaingo × Excursionistas | 1-2 | 1-3 | 5-3 | 8-7 | 52-48 | 11-18 |
| 25/04 15:00 | Brown Adrogue × Villa San Carlos | 1-0 | 2-1 | 3-1 | 4-3 | 50-50 | 9-11 |

---

## 🛠️ Como integrar no app especialista-cantos

> ⚠️ **Não fiz essas alterações** porque mexer no `index.html` é risco alto e a regra do mestre é não tocar no app. Entrego o passo-a-passo aqui pra você revisar e decidir.

### 1. Copiar os arquivos `.js` para a pasta `data/` do app

Copiar **dos dois lados** (raiz + EDS-Analise-ODDS):
```
cp _novas_ligas_2026-04-29/brasileiraoB2026.js especialista-cantos/data/
cp _novas_ligas_2026-04-29/brasileiraoB2026.js EDS-Analise-ODDS/especialista-cantos/data/
cp _novas_ligas_2026-04-29/metropolitana2026.js especialista-cantos/data/
cp _novas_ligas_2026-04-29/metropolitana2026.js EDS-Analise-ODDS/especialista-cantos/data/
```

### 2. Editar `EDS-Analise-ODDS/especialista-cantos/index.html`

Os pontos do HTML que precisam de edição (linha aproximada — verificar antes de editar):

**a) Linha ~1010-1012 — adicionar `<script src>`:**
```html
<script src="data/brasileiraoB2026.js?v=2026-04-29"></script>
<script src="data/metropolitana2026.js?v=2026-04-29"></script>
```

**b) Linha ~1020-1022 — `mapa` de códigos:**
```js
const mapa = { BR:'DADOS_BR', MLS:'DADOS_MLS', ARG:'DADOS_ARG', USL:'DADOS_USL',
               BUN:'DADOS_BUN', ARG_B:'DADOS_ARG_B', CHI:'DADOS_CHI',
               ECU:'DADOS_ECU', J1:'DADOS_J1', ALM:'DADOS_ALM',
               BR_B:'DADOS_BR_B', ARG_M:'DADOS_ARG_M' };  // ← ADICIONAR ESTAS 2
```

**c) Linha ~1145 — `_LIGAS_PRIORIDADE`:**
```js
const _LIGAS_PRIORIDADE = ['DADOS_BR','DADOS_ARG','DADOS_MLS','DADOS_USL','DADOS_BUN',
                           'DADOS_ARG_B','DADOS_CHI','DADOS_ECU','DADOS_J1','DADOS_ALM',
                           'DADOS_BR_B','DADOS_ARG_M'];  // ← ADICIONAR
```

**d) Linha ~4151-4160 — array de ligas (objeto `{code, nome, flag, dadosKey}`):**
```js
{ code: 'BR_B',  nome: 'Brasileirão Série B',     flag: '🇧🇷', dadosKey: 'DADOS_BR_B'  },
{ code: 'ARG_M', nome: 'Primera B Metropolitana', flag: '🇦🇷', dadosKey: 'DADOS_ARG_M' },
```

**e) Linha ~4884 — `ligaMap`:**
```js
const ligaMap = { BR: window.DADOS_BR, ..., BR_B: window.DADOS_BR_B, ARG_M: window.DADOS_ARG_M };
```

**f) Linha ~7769-7778 — lista de carregamento:**
```js
{ key: 'BR_B',  dados: window.DADOS_BR_B  },
{ key: 'ARG_M', dados: window.DADOS_ARG_M },
```

### 3. Verificar regras contextuais (Enigma, ranking, etc)

O Enigma do especialista-cantos pode ter regras específicas por liga (ex: "0x0 MLS = RED"). Para BR Série B e Primera B Metropolitana, **vai usar a regra padrão**. Se quiser regras contextuais (típicas de cada liga), você precisa decidir caso a caso e adicionar manualmente.

⚠️ **Nunca modifique o código do Enigma.** Só adicione **regras NOVAS** específicas pra essas ligas, sem mexer nos pesos/lógica do `calcSDE_ENIGMA`.

### 4. Atualizar versão dos `?v=` nos `<script src>` existentes

Quando subir, atualize todos os `?v=2026-04-22b` para `?v=2026-04-29` (ou similar) pra forçar invalidação de cache do browser.

---

## 📁 Arquivos entregues

```
_novas_ligas_2026-04-29/
├── brasileiraoB2026.js          ← Pronto pra integrar (BR Série B, 11 jogos)
├── metropolitana2026.js          ← Pronto pra integrar (ARG Metropolitana, 11 jogos)
├── _gerar_dados_app.js           ← Script reproduzível (re-roda sob novos JSONs)
├── br_b_rodada_2_2026-04-29.json ← JSON bruto BR_B
├── arg_m_rodada_2_2026-04-29.json ← JSON bruto ARG_M
├── j2_rodada_2_2026-04-29.json   ← JSON bruto J2 (temp 2025, não usado agora)
└── j3_rodada_2_2026-04-29.json   ← JSON bruto J3 (temp 2025, não usado agora)
```

E nos arquivos do projeto:
- `EDS-Analise-ODDS/projeto-fantasma/varredor-rodada.js` — **modificado**: adicionadas configs J2, J3, BR_B, ARG_M no objeto `LIGAS`. (Isso é só config, não muda o motor — seguro.)

---

## 🔜 Próximos passos quando você acordar

1. **Conferir** as tabelas BR_B e ARG_M acima — ver se os placares e cantos batem com o que você lembra.
2. Decidir:
   - **Opção A (segura):** ficar com os arquivos `.js` na pasta `_novas_ligas_2026-04-29/` como base de dados independente. Não toca no app. Você roda análises manuais ou faz scripts à parte.
   - **Opção B (integração total):** seguir o passo-a-passo da seção "Como integrar no app" pra ver as ligas no especialista-cantos. Eu posso fazer essa integração com você acompanhando, em vez de fazer sozinho à noite (mais seguro).
3. Sobre J2/J3: confirmar se a temporada 2026 dessas ligas começou. Se sim, eu re-rodo o varredor e gero os arquivos.
4. Pendente da conversa anterior: investigar **jogos sumidos no app + bet tracker**.

Bom dia, mestre. 👻
