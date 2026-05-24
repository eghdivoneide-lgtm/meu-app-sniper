"""
Backtest walk-forward do Cisne Negro nas ligas BR e BR_B.
Mesma logica aplicada na MLS (que deu 31.6%) - pra confirmar/contradizer
percepcao do usuario de que CN funciona bem no Brasil.

Sinal CN: vantagem de cantos do favorito >= 2.0
Acerto: favorito venceu cantos com margem >= vantagem projetada
Direcao: favorito apenas venceu cantos (sem precisar bater margem)
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
    if not m:
        m = re.search(r"window\.\w+\s*=\s*(\{.*\})\s*;?\s*$", txt, re.S)
    return json.loads(m.group(1)) if m else None

def parse_data(s):
    try: return datetime.strptime(s.split(' ')[0], "%d.%m.%Y")
    except: return None

def backtest_cn(arquivo, nome_liga, MIN=5, vantagens=[2.0, 2.5, 3.0]):
    obj = carregar(arquivo)
    jogos = obj['jogos']
    validos = []
    for j in jogos:
        d = parse_data(j.get('data',''))
        cantos = j.get('cantos') or {}
        cft = cantos.get('ft') if isinstance(cantos, dict) else None
        if not cft or not isinstance(cft, dict): continue
        cm = cft.get('m'); cv = cft.get('v')
        if cm is None or cv is None: continue
        if cm + cv == 0: continue
        if not d: continue
        j['_dt'] = d; j['_cm'] = cm; j['_cv'] = cv
        validos.append(j)
    validos.sort(key=lambda x: x['_dt'])

    print(f"\n{'='*90}")
    print(f"LIGA: {nome_liga} ({arquivo})  |  Jogos validos: {len(validos)}")
    print(f"{'='*90}")

    ts = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[], 'contra_casa':[], 'contra_fora':[]})

    # Resultados por nivel de vantagem
    res = {v: {'OK':0, 'ERR':0, 'DIR_OK':0, 'TOTAL_DIFF': 0, 'casos':[]} for v in vantagens}
    n_avaliados = 0
    casos_top = []

    for j in validos:
        m_t, v_t = j['mandante'], j['visitante']
        cm, cv = j['_cm'], j['_cv']
        n_m = len(ts[m_t]['pro_casa']) + len(ts[m_t]['pro_fora'])
        n_v = len(ts[v_t]['pro_casa']) + len(ts[v_t]['pro_fora'])
        if n_m >= MIN and n_v >= MIN:
            pm_casa = statistics.mean(ts[m_t]['pro_casa']) if ts[m_t]['pro_casa'] else statistics.mean(ts[m_t]['pro_fora'])
            pv_fora = statistics.mean(ts[v_t]['pro_fora']) if ts[v_t]['pro_fora'] else statistics.mean(ts[v_t]['pro_casa'])
            vantagem = abs(pm_casa - pv_fora)
            fav = m_t if pm_casa > pv_fora else v_t
            diff_real = (cm - cv) if fav == m_t else (cv - cm)
            for limite in vantagens:
                if vantagem >= limite:
                    if diff_real >= vantagem:
                        res[limite]['OK'] += 1
                    else:
                        res[limite]['ERR'] += 1
                    if diff_real > 0:
                        res[limite]['DIR_OK'] += 1
                    res[limite]['TOTAL_DIFF'] += diff_real
                    if limite == 2.0 and len(res[limite]['casos']) < 5:
                        res[limite]['casos'].append((m_t, v_t, vantagem, fav, cm, cv, diff_real))
            n_avaliados += 1
        # Atualiza DNA
        ts[m_t]['pro_casa'].append(cm); ts[m_t]['contra_casa'].append(cv)
        ts[v_t]['pro_fora'].append(cv); ts[v_t]['contra_fora'].append(cm)

    print(f"\nJogos elegiveis (>= {MIN} previos por time): {n_avaliados}\n")
    print(f"{'Vantagem':<10}{'Sinais':>8}{'Acerto Margem':>16}{'Acerto Direcao':>17}{'Diff Media Fav':>17}")
    print("-" * 70)
    for v in vantagens:
        r = res[v]
        t = r['OK'] + r['ERR']
        if t == 0:
            print(f">= {v:<6}    sem sinais")
            continue
        acerto_margem = r['OK']/t*100
        acerto_dir = r['DIR_OK']/t*100
        diff_media = r['TOTAL_DIFF']/t
        print(f">= {v:<6}{t:>8}    {r['OK']}/{t} = {acerto_margem:>4.1f}%   {r['DIR_OK']}/{t} = {acerto_dir:>4.1f}%      {diff_media:+.2f}")

    # Casos exemplo
    print(f"\n--- Exemplos de sinais CN >= 2.0 ---")
    for m_t, v_t, vant, fav, cm, cv, diff in res[2.0]['casos']:
        status = "OK" if diff >= vant else ("DIR-OK" if diff > 0 else "ERR")
        print(f"  {m_t[:18]:<18} {cm}-{cv} {v_t[:18]:<18} | fav: {fav[:14]:<14} esp +{vant:.1f} real {diff:+d}  [{status}]")

# Rodar nos 3 (BR, BR_B, MLS pra comparar)
backtest_cn("brasileirao2026.js", "Brasileirao A")
backtest_cn("brasileiraoB2026.js", "Brasileirao B")
backtest_cn("mls2026.js", "MLS (referencia, ja sabido)")
backtest_cn("argentina2026.js", "Argentina (referencia positiva)")
