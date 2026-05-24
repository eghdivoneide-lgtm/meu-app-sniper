"""
Recalibragem MLS v2:
  Teste 1: Backtest walk-forward com R4 RELAXADA (AND -> OR)
  Teste 2: Aplicar motor calibrado nos 15 jogos reais 09-10/05 e comparar com app (14%)
"""
import json, sys, io, re, statistics
from datetime import datetime
from collections import defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

mls_path = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\especialista-cantos\data\mls2026.js"
with open(mls_path, 'r', encoding='utf-8') as f:
    txt = f.read()
m = re.search(r"window\.DADOS_MLS\s*=\s*(\{.*?\});", txt, re.S)
obj = json.loads(m.group(1))
jogos = obj['jogos']

def parse_data(s):
    try: return datetime.strptime(s.split(' ')[0], "%d.%m.%Y")
    except: return None

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

# ============================================================
# Funcoes auxiliares
# ============================================================
def construir_dna(ate_data):
    """Constroi DNA usando jogos com data < ate_data."""
    ts = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[], 'contra_casa':[], 'contra_fora':[]})
    janela = []
    for j in validos:
        if j['_dt'] >= ate_data: continue
        m_t, v_t = j['mandante'], j['visitante']
        cm, cv = j['_cft_m'], j['_cft_v']
        ts[m_t]['pro_casa'].append(cm)
        ts[m_t]['contra_casa'].append(cv)
        ts[v_t]['pro_fora'].append(cv)
        ts[v_t]['contra_fora'].append(cm)
        janela.append(cm + cv)
    return ts, janela

def media_pro(ts, t, lado):
    arr = ts[t]['pro_casa'] if lado=='casa' else ts[t]['pro_fora']
    return statistics.mean(arr) if arr else None

def media_pro_total(ts, t):
    arr = ts[t]['pro_casa'] + ts[t]['pro_fora']
    return statistics.mean(arr) if arr else None

def media_contra_total(ts, t):
    arr = ts[t]['contra_casa'] + ts[t]['contra_fora']
    return statistics.mean(arr) if arr else None

def prever(ts, janela, m_t, v_t, MIN=5):
    """Retorna dict com previsoes ou None se nao tem historico suficiente."""
    n_m = len(ts[m_t]['pro_casa']) + len(ts[m_t]['pro_fora'])
    n_v = len(ts[v_t]['pro_casa']) + len(ts[v_t]['pro_fora'])
    if n_m < MIN or n_v < MIN or len(janela) < 20:
        return None
    pm_casa = media_pro(ts, m_t, 'casa') or media_pro_total(ts, m_t)
    pv_fora = media_pro(ts, v_t, 'fora') or media_pro_total(ts, v_t)
    baseline = pm_casa + pv_fora
    media_global = statistics.mean(janela)
    # R2: regressao a media
    if baseline > 13 or baseline < 8:
        calibrado = baseline * 0.7 + media_global * 0.3
    else:
        calibrado = baseline
    # Rankings
    rank_pro = []
    rank_contra = []
    for t, s in ts.items():
        n_t = len(s['pro_casa']) + len(s['pro_fora'])
        if n_t >= MIN:
            rank_pro.append((t, media_pro_total(ts, t)))
            rank_contra.append((t, media_contra_total(ts, t)))
    rank_pro.sort(key=lambda x: -x[1])
    rank_contra.sort(key=lambda x: -x[1])
    top8_pro = set(t for t,_ in rank_pro[:8])
    top10_pro = set(t for t,_ in rank_pro[:10])
    bot10_pro = set(t for t,_ in rank_pro[-10:])
    top8_sof = set(t for t,_ in rank_contra[:8])
    top10_sof = set(t for t,_ in rank_contra[:10])

    rei = m_t if pm_casa > pv_fora else v_t
    fav = rei
    adv = v_t if fav == m_t else m_t
    vantagem = abs(pm_casa - pv_fora)

    return {
        'pm_casa': pm_casa, 'pv_fora': pv_fora,
        'baseline': baseline, 'calibrado': calibrado,
        'rei': rei, 'fav': fav, 'adv': adv, 'vantagem': vantagem,
        'rei_no_bot10': rei in bot10_pro,
        'cn_v2_AND': fav in top8_pro and adv in top8_sof,
        'cn_v2_OR':  fav in top10_pro or adv in top10_sof,
    }

def aval_sniper(prev, total, linha, dead_zone=1.0):
    if abs(prev - linha) < dead_zone:
        return "NEU"
    sinal = 'OVER' if prev > linha else 'UNDER'
    if total == linha and linha == int(linha): return "PUSH"
    if sinal == 'OVER' and total > linha: return "OK"
    if sinal == 'UNDER' and total < linha: return "OK"
    return "ERR"

def aval_rei(rei, m_t, v_t, cm, cv):
    if cm == cv: return "EMP"
    if cm > cv: return "OK" if rei == m_t else "ERR"
    return "OK" if rei == v_t else "ERR"

# ============================================================
# TESTE 1: Backtest walk-forward com R4 OR (AND -> OR)
# ============================================================
print("=" * 80)
print("TESTE 1 - BACKTEST WALK-FORWARD (R4 relaxada OR)")
print("=" * 80)

ts = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[], 'contra_casa':[], 'contra_fora':[]})
janela = []
res = defaultdict(int)
mae_b, mae_c = [], []

for j in validos:
    m_t, v_t = j['mandante'], j['visitante']
    cm_real, cv_real = j['_cft_m'], j['_cft_v']
    total_real = cm_real + cv_real

    p = prever(ts, janela, m_t, v_t, MIN=5)
    if p is not None:
        mae_b.append(abs(p['baseline'] - total_real))
        mae_c.append(abs(p['calibrado'] - total_real))

        # Sniper FT linha 11.5 com calibrado
        a = aval_sniper(p['calibrado'], total_real, 11.5)
        res[f'sniper115_{a}'] += 1

        # Rei dos Cantos com R3
        if p['rei_no_bot10']:
            res['rei_R3_filtrados'] += 1
        else:
            r = aval_rei(p['rei'], m_t, v_t, cm_real, cv_real)
            res[f'rei_R3_{r}'] += 1

        # CN v1
        if p['vantagem'] >= 2.0:
            diff_fav = (cm_real - cv_real) if p['fav'] == m_t else (cv_real - cm_real)
            if diff_fav >= p['vantagem']:
                res['cn_v1_OK'] += 1
            else:
                res['cn_v1_ERR'] += 1
            # CN v2 OR (relaxada)
            if p['cn_v2_OR']:
                if diff_fav >= p['vantagem']:
                    res['cn_v2OR_OK'] += 1
                else:
                    res['cn_v2OR_ERR'] += 1
            else:
                res['cn_v2OR_filtrados'] += 1

        res['n_avaliados'] += 1

    # Atualiza DNA
    ts[m_t]['pro_casa'].append(cm_real)
    ts[m_t]['contra_casa'].append(cv_real)
    ts[v_t]['pro_fora'].append(cv_real)
    ts[v_t]['contra_fora'].append(cm_real)
    janela.append(total_real)

print(f"\nJogos avaliados: {res['n_avaliados']}\n")
print(f"MAE baseline:  {statistics.mean(mae_b):.2f}")
print(f"MAE calibrado: {statistics.mean(mae_c):.2f}\n")

t = res['sniper115_OK']+res['sniper115_ERR']
print(f"Sniper FT 11.5 + R2:  OK {res['sniper115_OK']} | ERR {res['sniper115_ERR']} | NEU {res['sniper115_NEU']}  -> {res['sniper115_OK']/t*100 if t else 0:.1f}% (n={t})")

t = res['rei_R3_OK']+res['rei_R3_ERR']+res['rei_R3_EMP']
print(f"Rei + R3:             OK {res['rei_R3_OK']} | ERR {res['rei_R3_ERR']} | EMP {res['rei_R3_EMP']} | FILT {res['rei_R3_filtrados']}  -> {res['rei_R3_OK']/t*100 if t else 0:.1f}% (n={t})")

t1 = res['cn_v1_OK']+res['cn_v1_ERR']
print(f"CN V1 (so vantagem):  OK {res['cn_v1_OK']} | ERR {res['cn_v1_ERR']}  -> {res['cn_v1_OK']/t1*100 if t1 else 0:.1f}% (n={t1})")
t2 = res['cn_v2OR_OK']+res['cn_v2OR_ERR']
print(f"CN V2 OR (relaxada):  OK {res['cn_v2OR_OK']} | ERR {res['cn_v2OR_ERR']} | FILT {res['cn_v2OR_filtrados']}  -> {res['cn_v2OR_OK']/t2*100 if t2 else 0:.1f}% (n={t2})")

# ============================================================
# TESTE 2: Aplicar motor calibrado nos 15 jogos REAIS de 09-10/05
# Comparar diretamente com o motor atual do app (que deu 14% Sniper FT)
# ============================================================
print()
print("=" * 80)
print("TESTE 2 - MOTOR CALIBRADO NOS 15 JOGOS REAIS (09-10/05)")
print("=" * 80)

# Os jogos de 09-10/05 NAO estao em mls2026.js (nao foi injetado).
# Pegar do JSON do varredor.
varredor_path = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\projeto-fantasma\mls_rodada_2_2026-05-12.json"
with open(varredor_path, 'r', encoding='utf-8') as f:
    rd = json.load(f)
jogos_alvo = []
for jr in rd:
    d = parse_data(jr.get('data_partida','').split(' ')[0]+' 00:00') if 'data_partida' in jr else None
    if d and d.day in (9,10) and d.month == 5:
        cft = jr.get('estatisticas_ft',{}).get('cantos',{})
        if cft.get('m') is not None and cft.get('v') is not None:
            jogos_alvo.append({
                '_dt': d,
                'mandante': jr['mandante'],
                'visitante': jr['visitante'],
                '_cft_m': cft['m'],
                '_cft_v': cft['v'],
            })
print(f"Jogos alvo encontrados: {len(jogos_alvo)}\n")

resultados = []
res2 = defaultdict(int)
mae_total = []

for j in jogos_alvo:
    m_t, v_t = j['mandante'], j['visitante']
    cm_real, cv_real = j['_cft_m'], j['_cft_v']
    total_real = cm_real + cv_real

    ts2, jan2 = construir_dna(j['_dt'])
    p = prever(ts2, jan2, m_t, v_t, MIN=5)
    if p is None:
        print(f"  {m_t} vs {v_t}: SEM HISTORICO SUFICIENTE")
        continue

    mae_total.append(abs(p['calibrado'] - total_real))

    a_sniper = aval_sniper(p['calibrado'], total_real, 11.5)
    res2[f'sniper_{a_sniper}'] += 1

    rei_filtrado = p['rei_no_bot10']
    if rei_filtrado:
        res2['rei_filtrado'] += 1
        a_rei = "FILT"
    else:
        a_rei = aval_rei(p['rei'], m_t, v_t, cm_real, cv_real)
        res2[f'rei_{a_rei}'] += 1

    cn_call = ""
    if p['vantagem'] >= 2.0 and p['cn_v2_OR']:
        diff_fav = (cm_real - cv_real) if p['fav'] == m_t else (cv_real - cm_real)
        if diff_fav >= p['vantagem']:
            cn_call = f"CN_OK ({p['fav']} +{p['vantagem']:.1f})"
            res2['cn_OK'] += 1
        else:
            cn_call = f"CN_ERR ({p['fav']} +{p['vantagem']:.1f}, real {diff_fav:+d})"
            res2['cn_ERR'] += 1

    print(f"  {m_t[:18]} {cm_real}-{cv_real} {v_t[:18]:<18} | "
          f"xC_calib={p['calibrado']:>5.2f} (real={total_real:>2}) | "
          f"Sniper11.5: {a_sniper:<4} | Rei: {p['rei'][:14]:<14} {a_rei}  {cn_call}")

print()
print("-" * 80)
print(f"MAE motor calibrado: {statistics.mean(mae_total):.2f} cantos\n")

t_s = res2['sniper_OK']+res2['sniper_ERR']
print(f"SNIPER FT 11.5 + R2:")
print(f"  OK {res2['sniper_OK']} | ERR {res2['sniper_ERR']} | NEU {res2['sniper_NEU']}")
print(f"  Acerto: {res2['sniper_OK']/t_s*100 if t_s else 0:.1f}% (n={t_s})")
print(f"  vs APP atual: 14% -> melhora de {res2['sniper_OK']/t_s*100 - 14 if t_s else 0:+.1f}pp")

t_r = res2['rei_OK']+res2['rei_ERR']+res2['rei_EMP']
print(f"\nREI DOS CANTOS + R3:")
print(f"  OK {res2['rei_OK']} | ERR {res2['rei_ERR']} | EMP {res2['rei_EMP']} | FILT {res2['rei_filtrado']}")
print(f"  Acerto: {res2['rei_OK']/t_r*100 if t_r else 0:.1f}% (n={t_r})")
print(f"  vs APP atual: 20% -> melhora de {res2['rei_OK']/t_r*100 - 20 if t_r else 0:+.1f}pp")

t_c = res2['cn_OK']+res2['cn_ERR']
print(f"\nCISNE NEGRO V2 OR:")
print(f"  OK {res2['cn_OK']} | ERR {res2['cn_ERR']}")
print(f"  Acerto: {res2['cn_OK']/t_c*100 if t_c else 0:.1f}% (n={t_c})")
print(f"  vs APP atual: 0% -> melhora de {res2['cn_OK']/t_c*100 - 0 if t_c else 0:+.1f}pp")
