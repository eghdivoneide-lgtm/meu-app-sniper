"""
PROOF OF CONCEPT: motor de Rei dos Cantos com regra MANDO-AWARE.

V1 (atual do app): media GERAL do time (pro_casa + pro_fora)/2
V2 (corrigida):    mandante usa pro_CASA, visitante usa pro_FORA
                   selo ABSOLUTO so se diff >= 2.0 entre os dois
                   selo DOMINANTE se 1.0 <= diff < 2.0
                   selo MODERADO se 0.5 <= diff < 1.0
                   selo EQUILIBRADO se < 0.5

Roda em 2 cenarios:
  A. Rodada real MLS 09-10/05 (15 jogos com palpites do app conhecidos)
  B. Backtest walk-forward na temporada inteira MLS (148 jogos)
  C. Mesmo backtest no BR (validacao - deve manter 80%+ no ABSOLUTO)
"""
import json, sys, io, re, statistics, os
from datetime import datetime
from collections import defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATA_DIR = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\especialista-cantos\data"

def carregar(arquivo):
    p = os.path.join(DATA_DIR, arquivo)
    with open(p, 'r', encoding='utf-8') as f:
        txt = f.read()
    m = re.search(r"window\.\w+\s*=\s*(\{.*?\});", txt, re.S)
    if not m: m = re.search(r"window\.\w+\s*=\s*(\{.*\})\s*;?\s*$", txt, re.S)
    return json.loads(m.group(1)) if m else None

def parse_data(s):
    try: return datetime.strptime(s.split(' ')[0], "%d.%m.%Y")
    except: return None

def carregar_jogos_validos(arquivo):
    obj = carregar(arquivo)
    jogos = obj['jogos']
    validos = []
    for j in jogos:
        d = parse_data(j.get('data',''))
        cantos = j.get('cantos') or {}
        if not isinstance(cantos, dict): continue
        cft = cantos.get('ft') or {}
        if not isinstance(cft, dict): continue
        cm = cft.get('m'); cv = cft.get('v')
        if cm is None or cv is None: continue
        if cm + cv == 0: continue
        if not d: continue
        j['_dt'] = d; j['_cm'] = cm; j['_cv'] = cv
        validos.append(j)
    validos.sort(key=lambda x: x['_dt'])
    return validos

def calc_selo(diff):
    """Da o nivel de confianca baseado na diff de cantos projetados."""
    if diff >= 2.0: return "ABSOLUTO"
    if diff >= 1.0: return "DOMINANTE"
    if diff >= 0.5: return "MODERADO"
    return "EQUILIBRADO"

def projecao_v1_geral(ts, m, v):
    """V1: media geral do time (atual do app)."""
    pm_geral = ts[m]['pro_casa'] + ts[m]['pro_fora']
    pv_geral = ts[v]['pro_casa'] + ts[v]['pro_fora']
    if not pm_geral or not pv_geral: return None
    pm = statistics.mean(pm_geral)
    pv = statistics.mean(pv_geral)
    rei = m if pm > pv else v
    return rei, abs(pm - pv), pm, pv

def projecao_v2_mando(ts, m, v):
    """V2: mando-aware. Mandante usa pro_casa, visitante usa pro_fora."""
    if not ts[m]['pro_casa'] or not ts[v]['pro_fora']: return None
    pm = statistics.mean(ts[m]['pro_casa'])
    pv = statistics.mean(ts[v]['pro_fora'])
    rei = m if pm > pv else v
    return rei, abs(pm - pv), pm, pv

def aval_rei(rei, m, v, cm, cv):
    if cm == cv: return "EMP"
    if cm > cv: return "OK" if rei == m else "ERR"
    return "OK" if rei == v else "ERR"

# ============================================================
# CENARIO A: Rodada real MLS 09-10/05/2026
# ============================================================
print("="*80)
print("CENARIO A: RODADA REAL MLS 09-10/05/2026 (15 jogos)")
print("="*80)
mls_jogos = carregar_jogos_validos("mls2026.js")

# JSON do varredor (jogos novos nao injetados ainda)
with open(r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\projeto-fantasma\mls_rodada_2_2026-05-12.json") as f:
    rd = json.load(f)
jogos_alvo = []
for jr in rd:
    d = parse_data(jr.get('data_partida','').split(' ')[0])
    if d and d.day in (9,10) and d.month == 5:
        cft = jr.get('estatisticas_ft',{}).get('cantos',{})
        if cft.get('m') is not None:
            jogos_alvo.append({'_dt': d, 'mandante': jr['mandante'], 'visitante': jr['visitante'],
                               '_cm': cft['m'], '_cv': cft['v']})

# DNA construido com jogos ATE 09/05 (excluindo a propria rodada)
data_corte = datetime(2026, 5, 9)
ts = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[]})
for j in mls_jogos:
    if j['_dt'] >= data_corte: continue
    ts[j['mandante']]['pro_casa'].append(j['_cm'])
    ts[j['visitante']]['pro_fora'].append(j['_cv'])

# Avalia V1 e V2 para cada um dos 15 jogos
print(f"\n{'Jogo':<48}{'V1 Rei':<22}{'V2 Rei (mando)':<22}{'Real':<8}{'V1':<6}{'V2'}")
print("-"*120)
v1 = {'OK_abs':0, 'ERR_abs':0, 'EMP_abs':0, 'OK_total':0, 'ERR_total':0, 'EMP_total':0}
v2 = {'OK_abs':0, 'ERR_abs':0, 'EMP_abs':0, 'OK_total':0, 'ERR_total':0, 'EMP_total':0, 'filtrados_abs':0}

for j in jogos_alvo:
    m, v = j['mandante'], j['visitante']
    cm, cv = j['_cm'], j['_cv']

    # V1
    p1 = projecao_v1_geral(ts, m, v)
    p2 = projecao_v2_mando(ts, m, v)
    if not p1 or not p2:
        print(f"  {m[:18]} vs {v[:18]}: SEM HISTORICO")
        continue
    rei1, diff1, pm1, pv1 = p1
    rei2, diff2, pm2, pv2 = p2
    selo1 = calc_selo(diff1)
    selo2 = calc_selo(diff2)

    a1 = aval_rei(rei1, m, v, cm, cv)
    a2 = aval_rei(rei2, m, v, cm, cv)
    v1[f'{a1}_total'] += 1
    v2[f'{a2}_total'] += 1
    if selo1 == "ABSOLUTO":
        v1[f'{a1}_abs'] += 1
    if selo2 == "ABSOLUTO":
        v2[f'{a2}_abs'] += 1
    elif selo1 == "ABSOLUTO":
        v2['filtrados_abs'] += 1

    real_str = f"{cm}-{cv}"
    print(f"  {m[:18]} vs {v[:20]:<20}  {rei1[:14]:<14} {selo1[:5]:<5}  {rei2[:14]:<14} {selo2[:5]:<5} {real_str:<8}{a1:<6}{a2}")

print(f"\n--- ABSOLUTO (alta confianca) ---")
t1a = v1['OK_abs']+v1['ERR_abs']+v1['EMP_abs']
t2a = v2['OK_abs']+v2['ERR_abs']+v2['EMP_abs']
print(f"V1 (atual): OK {v1['OK_abs']} | ERR {v1['ERR_abs']} | EMP {v1['EMP_abs']}  -> {v1['OK_abs']/t1a*100 if t1a else 0:.1f}% (n={t1a})")
print(f"V2 (mando): OK {v2['OK_abs']} | ERR {v2['ERR_abs']} | EMP {v2['EMP_abs']} | FILTRADOS {v2['filtrados_abs']}  -> {v2['OK_abs']/t2a*100 if t2a else 0:.1f}% (n={t2a})")

print(f"\n--- TODOS OS SINAIS ---")
t1 = sum(v1[k] for k in ['OK_total','ERR_total','EMP_total'])
t2 = sum(v2[k] for k in ['OK_total','ERR_total','EMP_total'])
print(f"V1: OK {v1['OK_total']} | ERR {v1['ERR_total']} | EMP {v1['EMP_total']}  -> {v1['OK_total']/t1*100:.1f}% (n={t1})")
print(f"V2: OK {v2['OK_total']} | ERR {v2['ERR_total']} | EMP {v2['EMP_total']}  -> {v2['OK_total']/t2*100:.1f}% (n={t2})")

# ============================================================
# CENARIO B/C: Backtest walk-forward (MLS e BR)
# ============================================================
def backtest_walk(arquivo, nome, MIN=5):
    print(f"\n{'='*80}")
    print(f"CENARIO {nome}: BACKTEST WALK-FORWARD - {arquivo}")
    print(f"{'='*80}")
    jogos = carregar_jogos_validos(arquivo)
    ts = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[]})
    v1 = {'OK_abs':0, 'ERR_abs':0, 'EMP_abs':0, 'OK_total':0, 'ERR_total':0, 'EMP_total':0}
    v2 = {'OK_abs':0, 'ERR_abs':0, 'EMP_abs':0, 'OK_total':0, 'ERR_total':0, 'EMP_total':0, 'filtrados_abs':0}
    n_aval = 0
    for j in jogos:
        m, v = j['mandante'], j['visitante']
        cm, cv = j['_cm'], j['_cv']
        n_m = len(ts[m]['pro_casa']) + len(ts[m]['pro_fora'])
        n_v = len(ts[v]['pro_casa']) + len(ts[v]['pro_fora'])
        if n_m >= MIN and n_v >= MIN and ts[m]['pro_casa'] and ts[v]['pro_fora']:
            p1 = projecao_v1_geral(ts, m, v)
            p2 = projecao_v2_mando(ts, m, v)
            if p1 and p2:
                rei1, diff1, _, _ = p1
                rei2, diff2, _, _ = p2
                selo1 = calc_selo(diff1)
                selo2 = calc_selo(diff2)
                a1 = aval_rei(rei1, m, v, cm, cv)
                a2 = aval_rei(rei2, m, v, cm, cv)
                v1[f'{a1}_total'] += 1
                v2[f'{a2}_total'] += 1
                if selo1 == "ABSOLUTO": v1[f'{a1}_abs'] += 1
                if selo2 == "ABSOLUTO": v2[f'{a2}_abs'] += 1
                elif selo1 == "ABSOLUTO": v2['filtrados_abs'] += 1
                n_aval += 1
        # Atualiza DNA com jogo recem-avaliado
        ts[m]['pro_casa'].append(cm)
        ts[v]['pro_fora'].append(cv)

    print(f"Jogos avaliados: {n_aval}")
    t1a = v1['OK_abs']+v1['ERR_abs']+v1['EMP_abs']
    t2a = v2['OK_abs']+v2['ERR_abs']+v2['EMP_abs']
    print(f"\n--- ABSOLUTO (alta confianca) ---")
    print(f"  V1 (geral): OK {v1['OK_abs']:>3} | ERR {v1['ERR_abs']:>3} | EMP {v1['EMP_abs']:>3}  -> {v1['OK_abs']/t1a*100 if t1a else 0:.1f}% (n={t1a})")
    print(f"  V2 (mando): OK {v2['OK_abs']:>3} | ERR {v2['ERR_abs']:>3} | EMP {v2['EMP_abs']:>3} | FILT {v2['filtrados_abs']:>2}  -> {v2['OK_abs']/t2a*100 if t2a else 0:.1f}% (n={t2a})")
    t1 = sum(v1[k] for k in ['OK_total','ERR_total','EMP_total'])
    t2 = sum(v2[k] for k in ['OK_total','ERR_total','EMP_total'])
    print(f"\n--- TODOS OS SINAIS ---")
    if t1: print(f"  V1: OK {v1['OK_total']:>3} | ERR {v1['ERR_total']:>3} | EMP {v1['EMP_total']:>3}  -> {v1['OK_total']/t1*100:.1f}% (n={t1})")
    else: print("  V1: sem amostra")
    if t2: print(f"  V2: OK {v2['OK_total']:>3} | ERR {v2['ERR_total']:>3} | EMP {v2['EMP_total']:>3}  -> {v2['OK_total']/t2*100:.1f}% (n={t2})")
    else: print("  V2: sem amostra")

backtest_walk("mls2026.js", "B - MLS")
backtest_walk("brasileirao2026.js", "C - BR (validacao)", MIN=3)
