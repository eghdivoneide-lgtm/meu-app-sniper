"""
Recalibragem do motor de cantos MLS + Backtest walk-forward na temporada inteira.

4 regras novas:
  R1: Linha Sniper FT = 11.5 (em vez de 10) - linha 10 e neutra (push 10%)
  R2: Regressao a media - se xC > 13 ou < 8, puxa 30% pra media global da janela
  R3: Filtro Bottom-10 - se Rei projetado esta no bottom-10 atacante, rebaixar selo
  R4: Cisne Negro 2 condicoes - vantagem >= 2.0 E favorito top-8 atacante E adversario top-8 sofredor

Backtest walk-forward: para cada jogo (em ordem temporal), so usa jogos ANTERIORES.
Compara: baseline (soma de medias) vs calibrado (com R2).
Mede acerto de decisao em: Sniper FT 10 / Sniper FT 11.5 / Rei dos Cantos / Rei + R3 / CN original / CN R4.
"""
import json, sys, io, re, statistics
from datetime import datetime
from collections import defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Carregar historico
mls_path = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\especialista-cantos\data\mls2026.js"
with open(mls_path, 'r', encoding='utf-8') as f:
    txt = f.read()
m = re.search(r"window\.DADOS_MLS\s*=\s*(\{.*?\});", txt, re.S)
obj = json.loads(m.group(1))
jogos = obj['jogos']

def parse_data(s):
    try: return datetime.strptime(s.split(' ')[0], "%d.%m.%Y")
    except: return None

def total_cantos(j):
    c = j.get('cantos', {}).get('ft', {})
    return (c.get('m') or 0) + (c.get('v') or 0)

# Filtra valid + ordena cronologicamente
validos = []
for j in jogos:
    d = parse_data(j.get('data',''))
    cm = j.get('cantos',{}).get('ft',{}).get('m')
    cv = j.get('cantos',{}).get('ft',{}).get('v')
    if d and cm is not None and cv is not None:
        j['_dt'] = d
        j['_cft_m'] = cm
        j['_cft_v'] = cv
        validos.append(j)
validos.sort(key=lambda x: x['_dt'])
print(f"Total jogos validos cronologicos: {len(validos)}")

# ============================================================
# WALK-FORWARD
# ============================================================
# Para cada jogo i, usar so jogos ANTERIORES (j[0..i-1]) para construir DNA
# Depois: prever cantos do jogo i e checar acerto

MIN_JOGOS = 5  # minimo de jogos previos por time para entrar no backtest
LINHA_V1 = 10
LINHA_V2 = 11.5

# Resultados
res = {
    'n_avaliados': 0,
    # Erro absoluto xC
    'mae_baseline': [], 'mae_calibrado': [],
    # Sniper FT linha 10 (v1) - decisao OVER se previsto > linha
    'sniper10_v1_ok': 0, 'sniper10_v1_err': 0, 'sniper10_v1_neu': 0, 'sniper10_v1_push': 0,
    # Sniper FT linha 11.5 (v2)
    'sniper115_v2_ok': 0, 'sniper115_v2_err': 0, 'sniper115_v2_neu': 0,
    # Rei dos Cantos (vencedor de cantos FT)
    'rei_v1_ok': 0, 'rei_v1_err': 0, 'rei_v1_emp': 0,
    # Rei com R3 (rebaixa se top do match esta no bottom-10)
    'rei_v2_ok': 0, 'rei_v2_err': 0, 'rei_v2_emp': 0, 'rei_v2_filtrados': 0,
    # Cisne Negro (vantagem fav >= 2.0)
    'cn_v1_ok': 0, 'cn_v1_err': 0,
    # Cisne Negro v2 (vantagem >= 2 + top-8 fav atacante + top-8 adv sofredor)
    'cn_v2_ok': 0, 'cn_v2_err': 0, 'cn_v2_filtrados': 0,
}

# Para o walk-forward, precisamos do ranking BOTTOM-10 / TOP-8 atualizado a cada jogo
# Vamos manter listas dinamicas
ts = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[], 'contra_casa':[], 'contra_fora':[]})

def media_pro(time, lado):
    arr = ts[time]['pro_casa'] if lado=='casa' else ts[time]['pro_fora']
    return statistics.mean(arr) if arr else None

def media_contra(time, lado):
    arr = ts[time]['contra_casa'] if lado=='casa' else ts[time]['contra_fora']
    return statistics.mean(arr) if arr else None

def media_pro_total(time):
    arr = ts[time]['pro_casa'] + ts[time]['pro_fora']
    return statistics.mean(arr) if arr else None

def media_contra_total(time):
    arr = ts[time]['contra_casa'] + ts[time]['contra_fora']
    return statistics.mean(arr) if arr else None

# Janela movel para calcular media global (regressao a media)
janela_global = []

for i, j in enumerate(validos):
    m_t, v_t = j['mandante'], j['visitante']
    cm_real = j['_cft_m']; cv_real = j['_cft_v']
    total_real = cm_real + cv_real

    # === Construir previsao SO se tem historico minimo ===
    n_m = len(ts[m_t]['pro_casa']) + len(ts[m_t]['pro_fora'])
    n_v = len(ts[v_t]['pro_casa']) + len(ts[v_t]['pro_fora'])

    if n_m >= MIN_JOGOS and n_v >= MIN_JOGOS and len(janela_global) >= 20:
        # Baseline: pro mandante em casa + pro visitante fora
        pm_casa = media_pro(m_t, 'casa')
        pv_fora = media_pro(v_t, 'fora')
        # Fallback: total
        if pm_casa is None: pm_casa = media_pro_total(m_t)
        if pv_fora is None: pv_fora = media_pro_total(v_t)
        baseline_total = pm_casa + pv_fora

        # === R2: Regressao a media ===
        media_global = statistics.mean(janela_global)
        if baseline_total > 13 or baseline_total < 8:
            calibrado_total = baseline_total * 0.7 + media_global * 0.3
        else:
            calibrado_total = baseline_total

        # Erros absolutos
        res['mae_baseline'].append(abs(baseline_total - total_real))
        res['mae_calibrado'].append(abs(calibrado_total - total_real))

        # === Sniper FT linha 10 (v1) ===
        if abs(baseline_total - LINHA_V1) < 0.5:
            res['sniper10_v1_neu'] += 1
        else:
            sinal = 'OVER' if baseline_total > LINHA_V1 else 'UNDER'
            if total_real == LINHA_V1: res['sniper10_v1_push'] += 1
            elif sinal == 'OVER' and total_real > LINHA_V1: res['sniper10_v1_ok'] += 1
            elif sinal == 'UNDER' and total_real < LINHA_V1: res['sniper10_v1_ok'] += 1
            else: res['sniper10_v1_err'] += 1

        # === Sniper FT linha 11.5 (v2) - mais restritivo ===
        if abs(calibrado_total - LINHA_V2) < 1.0:
            res['sniper115_v2_neu'] += 1
        else:
            sinal = 'OVER' if calibrado_total > LINHA_V2 else 'UNDER'
            if sinal == 'OVER' and total_real > LINHA_V2: res['sniper115_v2_ok'] += 1
            elif sinal == 'UNDER' and total_real < LINHA_V2: res['sniper115_v2_ok'] += 1
            else: res['sniper115_v2_err'] += 1

        # === Rei dos Cantos (v1): quem tem maior media pro vence ===
        if pm_casa > pv_fora:
            rei_proj = m_t
        else:
            rei_proj = v_t
        # Real
        if cm_real == cv_real:
            res['rei_v1_emp'] += 1
        elif (cm_real > cv_real and rei_proj == m_t) or (cv_real > cm_real and rei_proj == v_t):
            res['rei_v1_ok'] += 1
        else:
            res['rei_v1_err'] += 1

        # === Rei v2 (R3): rebaixa se rei projetado esta no bottom-10 atacante ===
        # Calcular ranking atual de cantos pro
        ranking = []
        for t, s in ts.items():
            n_t = len(s['pro_casa']) + len(s['pro_fora'])
            if n_t >= MIN_JOGOS:
                m_pro = media_pro_total(t)
                ranking.append((t, m_pro))
        ranking.sort(key=lambda x: -x[1])
        top8 = set(t for t,_ in ranking[:8])
        bot10 = set(t for t,_ in ranking[-10:])

        if rei_proj in bot10:
            # rebaixar: nao da palpite (filtra)
            res['rei_v2_filtrados'] += 1
        else:
            if cm_real == cv_real:
                res['rei_v2_emp'] += 1
            elif (cm_real > cv_real and rei_proj == m_t) or (cv_real > cm_real and rei_proj == v_t):
                res['rei_v2_ok'] += 1
            else:
                res['rei_v2_err'] += 1

        # === Cisne Negro v1: vantagem fav >= 2.0 ===
        vantagem = abs(pm_casa - pv_fora)
        fav = m_t if pm_casa > pv_fora else v_t
        diff_real_fav = (cm_real - cv_real) if fav == m_t else (cv_real - cm_real)
        if vantagem >= 2.0:
            if diff_real_fav >= vantagem:
                res['cn_v1_ok'] += 1
            else:
                res['cn_v1_err'] += 1
            # === Cisne Negro v2 (R4): + filtro top-8 fav E top-8 adv sofredor ===
            adv = v_t if fav == m_t else m_t
            # bottom em 'contra' = sofre muito (top-8 sofredor)
            ranking_contra = []
            for t, s in ts.items():
                n_t = len(s['contra_casa']) + len(s['contra_fora'])
                if n_t >= MIN_JOGOS:
                    m_contra = media_contra_total(t)
                    ranking_contra.append((t, m_contra))
            ranking_contra.sort(key=lambda x: -x[1])  # quem mais sofre primeiro
            top8_sofredor = set(t for t,_ in ranking_contra[:8])
            if fav in top8 and adv in top8_sofredor:
                if diff_real_fav >= vantagem:
                    res['cn_v2_ok'] += 1
                else:
                    res['cn_v2_err'] += 1
            else:
                res['cn_v2_filtrados'] += 1

        res['n_avaliados'] += 1

    # === Atualizar DNA com este jogo (so DEPOIS de avaliar) ===
    ts[m_t]['pro_casa'].append(cm_real)
    ts[m_t]['contra_casa'].append(cv_real)
    ts[v_t]['pro_fora'].append(cv_real)
    ts[v_t]['contra_fora'].append(cm_real)
    janela_global.append(total_real)

# ============================================================
# RELATORIO
# ============================================================
print(f"\nJogos avaliados (com >= {MIN_JOGOS} previos por time): {res['n_avaliados']}\n")

print("=" * 80)
print("ERRO ABSOLUTO MEDIO (xCorners FT)")
print("=" * 80)
print(f"  BASELINE (so soma de medias):     MAE = {statistics.mean(res['mae_baseline']):.2f} cantos")
print(f"  CALIBRADO (R2 - regressao media): MAE = {statistics.mean(res['mae_calibrado']):.2f} cantos")
print(f"  Reducao do erro:                  {(statistics.mean(res['mae_baseline'])-statistics.mean(res['mae_calibrado']))/statistics.mean(res['mae_baseline'])*100:.1f}%")

print()
print("=" * 80)
print("SNIPER FT - Linha 10 (v1)  vs  Linha 11.5 + R2 (v2)")
print("=" * 80)
v1_avaliados = res['sniper10_v1_ok'] + res['sniper10_v1_err']
v1_acerto = res['sniper10_v1_ok'] / v1_avaliados * 100 if v1_avaliados else 0
print(f"  Linha 10 (V1):   OK {res['sniper10_v1_ok']:>3} | ERR {res['sniper10_v1_err']:>3} | NEU {res['sniper10_v1_neu']:>2} | PUSH {res['sniper10_v1_push']:>2}  -> {v1_acerto:.1f}% (n={v1_avaliados})")
v2_avaliados = res['sniper115_v2_ok'] + res['sniper115_v2_err']
v2_acerto = res['sniper115_v2_ok'] / v2_avaliados * 100 if v2_avaliados else 0
print(f"  Linha 11.5 (V2): OK {res['sniper115_v2_ok']:>3} | ERR {res['sniper115_v2_err']:>3} | NEU {res['sniper115_v2_neu']:>2}  -> {v2_acerto:.1f}% (n={v2_avaliados})")

print()
print("=" * 80)
print("REI DOS CANTOS - V1 vs V2 (com R3 filtro Bottom-10)")
print("=" * 80)
v1t = res['rei_v1_ok']+res['rei_v1_err']+res['rei_v1_emp']
v2t = res['rei_v2_ok']+res['rei_v2_err']+res['rei_v2_emp']
print(f"  V1 (sem filtro):     OK {res['rei_v1_ok']:>3} | ERR {res['rei_v1_err']:>3} | EMP {res['rei_v1_emp']:>3}  -> {res['rei_v1_ok']/v1t*100:.1f}% (n={v1t})")
print(f"  V2 (R3 filtra Bot10): OK {res['rei_v2_ok']:>3} | ERR {res['rei_v2_err']:>3} | EMP {res['rei_v2_emp']:>3} | FILTRADOS {res['rei_v2_filtrados']:>2}  -> {res['rei_v2_ok']/v2t*100:.1f}% (n={v2t})")

print()
print("=" * 80)
print("CISNE NEGRO - V1 (vantagem >= 2) vs V2 (R4 + 2 condicoes)")
print("=" * 80)
cn1t = res['cn_v1_ok'] + res['cn_v1_err']
cn2t = res['cn_v2_ok'] + res['cn_v2_err']
print(f"  V1 (so vantagem):       OK {res['cn_v1_ok']:>3} | ERR {res['cn_v1_err']:>3}  -> {res['cn_v1_ok']/cn1t*100 if cn1t else 0:.1f}% (n={cn1t})")
print(f"  V2 (+top-8 + sofredor): OK {res['cn_v2_ok']:>3} | ERR {res['cn_v2_err']:>3} | FILTRADOS {res['cn_v2_filtrados']:>2}  -> {res['cn_v2_ok']/cn2t*100 if cn2t else 0:.1f}% (n={cn2t})")
