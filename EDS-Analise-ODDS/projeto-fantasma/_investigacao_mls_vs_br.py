"""
Investigacao profunda: por que o motor performa 80% no BR (Rei ABSOLUTO)
mas 20% na MLS (mesmo mercado)?

Hipoteses:
H1: Viés de mando - mandante venceu cantos quando o Rei era VISITANTE
H2: Fator casa muito mais forte na MLS (viagens longas, jet lag)
H3: Posse de bola NAO correlaciona com cantos na MLS
H4: Times "atacantes" da MLS sao mais inconsistentes
H5: Os 5 Reis ABSOLUTO MLS estavam todos viajando, ou contra times muito ofensivos
"""
import json, sys, io, re, statistics, os
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

def stats_cantos(arquivo):
    obj = carregar(arquivo)
    jogos = obj['jogos']
    validos = []
    for j in jogos:
        cantos = j.get('cantos') or {}
        if not isinstance(cantos, dict): continue
        cft = cantos.get('ft') or {}
        if not isinstance(cft, dict): continue
        cm = cft.get('m'); cv = cft.get('v')
        if cm is None or cv is None: continue
        if cm + cv == 0: continue
        validos.append({'m': j['mandante'], 'v': j['visitante'], 'cm': cm, 'cv': cv})
    return validos

# Carrega BR e MLS
br_jogos = stats_cantos("brasileirao2026.js")
mls_jogos = stats_cantos("mls2026.js")
print(f"BR jogos validos: {len(br_jogos)}")
print(f"MLS jogos validos: {len(mls_jogos)}\n")

# ============================================================
# H1: Viés de mando - mandante venceu cantos por que %?
# ============================================================
print("="*80)
print("H1: VANTAGEM DO MANDANTE EM CANTOS")
print("="*80)
for nome, jogos in [("BR", br_jogos), ("MLS", mls_jogos)]:
    venceu_casa = sum(1 for j in jogos if j['cm'] > j['cv'])
    venceu_fora = sum(1 for j in jogos if j['cv'] > j['cm'])
    empate = sum(1 for j in jogos if j['cm'] == j['cv'])
    media_casa = statistics.mean([j['cm'] for j in jogos])
    media_fora = statistics.mean([j['cv'] for j in jogos])
    pct_casa_venceu = venceu_casa / len(jogos) * 100
    pct_fora_venceu = venceu_fora / len(jogos) * 100
    print(f"\n{nome}:")
    print(f"  Mandante venceu cantos: {venceu_casa}/{len(jogos)} = {pct_casa_venceu:.1f}%")
    print(f"  Visitante venceu cantos: {venceu_fora}/{len(jogos)} = {pct_fora_venceu:.1f}%")
    print(f"  Empate cantos:           {empate}/{len(jogos)} = {empate/len(jogos)*100:.1f}%")
    print(f"  Media cantos mandante:   {media_casa:.2f}")
    print(f"  Media cantos visitante:  {media_fora:.2f}")
    print(f"  Bonus de mando:          +{media_casa-media_fora:.2f} cantos")

# ============================================================
# H2: Quao consistente e o "Rei dos Cantos" - top atacantes do casa vs fora?
# Diferenca entre cantos pro EM CASA e cantos pro FORA por time
# ============================================================
print()
print("="*80)
print("H2: ASSIMETRIA CASA-FORA POR TIME (rank top 10 atacantes)")
print("="*80)
for nome, jogos in [("BR", br_jogos), ("MLS", mls_jogos)]:
    print(f"\n{nome}:")
    times = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[]})
    for j in jogos:
        times[j['m']]['pro_casa'].append(j['cm'])
        times[j['v']]['pro_fora'].append(j['cv'])
    rank = []
    for t, s in times.items():
        if len(s['pro_casa']) >= 3 and len(s['pro_fora']) >= 3:
            mc = statistics.mean(s['pro_casa'])
            mf = statistics.mean(s['pro_fora'])
            mt = (mc + mf) / 2
            rank.append((t, mc, mf, mt, mc - mf))
    rank.sort(key=lambda x: -x[3])  # ordena por media total
    print(f"  {'Time':<26}{'casa':>6}{'fora':>6}{'media':>7}{'gap_casa':>10}")
    for t, mc, mf, mt, gap in rank[:10]:
        print(f"  {t:<26}{mc:>6.2f}{mf:>6.2f}{mt:>7.2f}{gap:>+10.2f}")
    # Calcula correlacao casa-fora
    casas = [r[1] for r in rank]; foras = [r[2] for r in rank]
    if len(casas) > 1:
        mean_c = sum(casas)/len(casas); mean_f = sum(foras)/len(foras)
        num = sum((casas[i]-mean_c)*(foras[i]-mean_f) for i in range(len(casas)))
        den = (sum((c-mean_c)**2 for c in casas) * sum((f-mean_f)**2 for f in foras))**0.5
        corr = num/den if den else 0
        print(f"  Correlacao casa<->fora dos times: {corr:.3f}  (alta = consistente, baixa = variavel)")

# ============================================================
# H3: A MLS premia visitante? Times TOP atacantes - quanto eles produzem em CASA vs FORA?
# ============================================================
print()
print("="*80)
print("H3: TOP 10 ATACANTES - quanto cai a producao QUANDO VIAJAM?")
print("="*80)
for nome, jogos in [("BR", br_jogos), ("MLS", mls_jogos)]:
    times = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[]})
    for j in jogos:
        times[j['m']]['pro_casa'].append(j['cm'])
        times[j['v']]['pro_fora'].append(j['cv'])
    rank = []
    for t, s in times.items():
        if len(s['pro_casa']) >= 3 and len(s['pro_fora']) >= 3:
            mc = statistics.mean(s['pro_casa'])
            mf = statistics.mean(s['pro_fora'])
            rank.append((t, mc, mf))
    rank.sort(key=lambda x: -(x[1]+x[2])/2)  # top atacantes geral
    top10 = rank[:10]
    casa_avg = statistics.mean([t[1] for t in top10])
    fora_avg = statistics.mean([t[2] for t in top10])
    print(f"\n{nome}: Top-10 atacantes")
    print(f"  Media cantos pro EM CASA:   {casa_avg:.2f}")
    print(f"  Media cantos pro FORA:      {fora_avg:.2f}")
    print(f"  Drop de produção fora:      {(fora_avg-casa_avg)/casa_avg*100:+.1f}%")

# ============================================================
# H4: Os 5 Reis ABSOLUTO da MLS na rodada 09-10/05 - quem eram?
# E os 5 do BR, que acertaram 80%?
# ============================================================
print()
print("="*80)
print("H4: OS 5 REIS ABSOLUTO DA RODADA - DETALHES")
print("="*80)

# MLS - 5 reis ABSOLUTO da rodada 09-10/05
mls_reis_abs = [
    ("Toronto FC", "Inter Miami", "Inter Miami", 4, 4),  # falhou - empate
    ("Atlanta Utd", "Los Angeles Galaxy", "Los Angeles Galaxy", 6, 5),  # falhou
    ("New England Revolution", "Philadelphia Union", "Philadelphia Union", 9, 3),  # falhou
    ("Nashville SC", "DC United", "Nashville SC", 8, 7),  # acertou
    ("Minnesota United", "Austin FC", "Minnesota United", 3, 4),  # falhou
]
br_reis_abs = [
    ("Coritiba", "Internacional", "Internacional", 3, 8),  # acertou
    ("Fluminense", "Vitória", "Fluminense", 6, 3),  # acertou
    ("Corinthians", "São Paulo", "São Paulo", 7, 7),  # empate
    ("Mirassol", "Chapecoense", "Mirassol", 8, 1),  # acertou
    ("Vasco", "Athletico-PR", "Vasco", 4, 3),  # acertou
]

def analisar_reis(jogos_liga, nome, casos):
    print(f"\n{nome}:")
    times_stats = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[]})
    for j in jogos_liga:
        times_stats[j['m']]['pro_casa'].append(j['cm'])
        times_stats[j['v']]['pro_fora'].append(j['cv'])
    for m, v, rei, cm, cv in casos:
        is_casa = (rei == m)
        rei_mando = "EM CASA" if is_casa else "FORA"
        # quantos jogos o time tem
        if is_casa:
            arr = times_stats.get(rei, {}).get('pro_casa', [])
            outro_arr = times_stats.get(v, {}).get('pro_fora', [])
        else:
            arr = times_stats.get(rei, {}).get('pro_fora', [])
            outro_arr = times_stats.get(m, {}).get('pro_casa', [])
        media_rei_no_mando = statistics.mean(arr) if arr else 0
        media_adv_oposto = statistics.mean(outro_arr) if outro_arr else 0
        venceu = (cm > cv and rei == m) or (cv > cm and rei == v)
        empate = cm == cv
        status = "✅" if venceu else ("=" if empate else "❌")
        print(f"  [{status}] Rei: {rei[:18]:<18} ({rei_mando:<7}) | media_pro={media_rei_no_mando:.1f} | adv produz={media_adv_oposto:.1f} | jogo {cm}-{cv}")

analisar_reis(mls_jogos, "MLS - 5 Reis ABSOLUTO", mls_reis_abs)
analisar_reis(br_jogos, "BR - 5 Reis ABSOLUTO", br_reis_abs)

# Quantos dos 5 reis MLS estavam JOGANDO FORA?
mls_reis_fora = sum(1 for m, v, rei, cm, cv in mls_reis_abs if rei != m)
br_reis_fora = sum(1 for m, v, rei, cm, cv in br_reis_abs if rei != m)
print(f"\nReis ABSOLUTO que eram VISITANTES:")
print(f"  MLS: {mls_reis_fora}/5 = {mls_reis_fora*20}%")
print(f"  BR:  {br_reis_fora}/5 = {br_reis_fora*20}%")
print(f"\n>> Os Reis MLS estavam predominantemente VIAJANDO. Os do BR estavam predominantemente em CASA.")
print(f">> Se fora-na-MLS castiga mais que fora-no-BR, isso explica TUDO.")

# ============================================================
# H5: Para cada Rei ABSOLUTO da MLS - eles ESTAVAM no top 5 atacantes da MLS?
# Talvez o algoritmo esteja escolhendo Reis que NAO sao atacantes-Reis
# ============================================================
print()
print("="*80)
print("H5: OS 5 REIS DA MLS estavam realmente entre os TOP atacantes?")
print("="*80)
times_mls = defaultdict(lambda: {'pro_casa':[], 'pro_fora':[]})
for j in mls_jogos:
    times_mls[j['m']]['pro_casa'].append(j['cm'])
    times_mls[j['v']]['pro_fora'].append(j['cv'])
rank_mls = []
for t, s in times_mls.items():
    if len(s['pro_casa']) >= 3 and len(s['pro_fora']) >= 3:
        mt = (statistics.mean(s['pro_casa']) + statistics.mean(s['pro_fora']))/2
        rank_mls.append((t, mt))
rank_mls.sort(key=lambda x: -x[1])
ranks = {t: i+1 for i, (t, _) in enumerate(rank_mls)}
n_total = len(rank_mls)

for m, v, rei, cm, cv in mls_reis_abs:
    pos_rei = ranks.get(rei, "?")
    pos_adv = ranks.get(v if rei == m else m, "?")
    # adversario do rei
    adv = v if rei == m else m
    print(f"  Rei: {rei:<22} (rank {pos_rei}/{n_total})  vs  Adv: {adv:<24} (rank {pos_adv}/{n_total}) | {cm}-{cv}")
print()
print("Se Rei nao esta no TOP-5 ou Adversario tambem esta no TOP-10 atacante,")
print("o sinal 'ABSOLUTO' e questionavel.")
