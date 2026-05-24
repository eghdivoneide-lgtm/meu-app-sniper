"""
Mapeamento de DNA de cantos por liga.
Hipotese do usuario: MLS ~ Bundesliga (alta volatilidade, motor falha)
                     ARG / ARG_B teriam DNA diferente (motor funciona)
Objetivo: confirmar e identificar ligas similares ao argentino.
"""
import json, sys, io, re, statistics, os
from collections import defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DATA_DIR = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\especialista-cantos\data"

# Map arquivo -> nome liga
ligas_map = {
    "mls2026.js": ("MLS", "DADOS_MLS"),
    "brasileirao2026.js": ("BR", "DADOS_BRASILEIRAO"),
    "brasileiraoB2026.js": ("BR_B", "DADOS_BRASILEIRAO_B"),
    "argentina2026.js": ("ARG", "DADOS_ARGENTINA"),
    "argentina_b2026.js": ("ARG_B", "DADOS_ARGENTINA_B"),
    "bundesliga2026.js": ("BUN", "DADOS_BUNDESLIGA"),
    "usl2026.js": ("USL", "DADOS_USL"),
    "j1league2026.js": ("J1", "DADOS_J1"),
    "j2league2026.js": ("J2", "DADOS_J2"),
    "j2j3league2026.js": ("J2J3", "DADOS_J2J3"),
    "aleague2026.js": ("ALM", "DADOS_ALEAGUE"),
    "chile2026.js": ("CHI", "DADOS_CHILE"),
    "equador2026.js": ("ECU", "DADOS_EQUADOR"),
    "chinaone2026.js": ("CHN_L1", "DADOS_CHINA_ONE"),
    "chinasuper2026.js": ("CHN_SL", "DADOS_CHINA_SUPER"),
    "chinatwo2026.js": ("CHN_L2", "DADOS_CHINA_TWO"),
    "metropolitana2026.js": ("ARG_M", "DADOS_METROPOLITANA"),
}

def carregar(arquivo):
    p = os.path.join(DATA_DIR, arquivo)
    if not os.path.exists(p): return None
    with open(p, 'r', encoding='utf-8') as f:
        txt = f.read()
    # Tenta achar o objeto: window.X = {...};
    m = re.search(r"window\.\w+\s*=\s*(\{.*?\});", txt, re.S)
    if not m:
        m = re.search(r"window\.\w+\s*=\s*(\{.*\})\s*;?\s*$", txt, re.S)
    if not m: return None
    try:
        return json.loads(m.group(1))
    except Exception as e:
        return None

def stats_liga(obj):
    """Retorna o perfil DNA da liga."""
    if not obj or 'jogos' not in obj: return None
    jogos = obj['jogos']
    totais = []
    pro_por_time = defaultdict(list)
    for j in jogos:
        cantos = j.get('cantos') or {}
        if not isinstance(cantos, dict): continue
        cft = cantos.get('ft') or {}
        if not isinstance(cft, dict): continue
        cm = cft.get('m'); cv = cft.get('v')
        if cm is None or cv is None: continue
        if cm + cv == 0: continue  # provavel jogo sem dado
        totais.append(cm + cv)
        pro_por_time[j['mandante']].append(cm)
        pro_por_time[j['visitante']].append(cv)
    if not totais: return None

    media = statistics.mean(totais)
    desvio = statistics.pstdev(totais)
    mediana = statistics.median(totais)
    pct_over_10 = sum(1 for t in totais if t > 10)/len(totais)*100
    pct_under_10 = sum(1 for t in totais if t < 10)/len(totais)*100
    pct_extremos = sum(1 for t in totais if t <= 6 or t >= 15)/len(totais)*100

    # Spread inter-times (max - min media de cantos pro)
    medias_pro = [statistics.mean(v) for v in pro_por_time.values() if len(v) >= 5]
    spread = max(medias_pro) - min(medias_pro) if medias_pro else 0
    cv_inter = statistics.pstdev(medias_pro)/statistics.mean(medias_pro)*100 if medias_pro else 0

    # Coef variacao do total (volatilidade do volume)
    cv_total = desvio/media*100

    return {
        'n_jogos': len(totais),
        'media': media,
        'mediana': mediana,
        'desvio': desvio,
        'cv_total': cv_total,            # volatilidade do volume
        'pct_over_10': pct_over_10,
        'pct_under_10': pct_under_10,
        'pct_extremos': pct_extremos,    # jogos <=6 ou >=15
        'spread_intertimes': spread,     # diferenciacao entre times
        'cv_intertimes': cv_inter,       # variancia entre os times
    }

# Coleta dados
perfis = {}
for arq, (cod, _) in ligas_map.items():
    obj = carregar(arq)
    s = stats_liga(obj)
    if s:
        perfis[cod] = s

# Tabela principal
print("=" * 110)
print("DNA DE CANTOS - TODAS AS LIGAS (toda temporada 2026)")
print("=" * 110)
print(f"{'Liga':<8}{'n':>5}{'media':>8}{'med':>5}{'desvio':>8}{'cv%':>7}{'%>10':>7}{'%<10':>7}{'%extr':>7}{'spread':>8}{'cv_inter%':>10}")
print("-" * 110)

# Ordena por media
for cod, s in sorted(perfis.items(), key=lambda x: -x[1]['media']):
    print(f"{cod:<8}{s['n_jogos']:>5}{s['media']:>8.2f}{s['mediana']:>5.1f}{s['desvio']:>8.2f}{s['cv_total']:>6.1f}%{s['pct_over_10']:>6.0f}%{s['pct_under_10']:>6.0f}%{s['pct_extremos']:>6.0f}%{s['spread_intertimes']:>8.2f}{s['cv_intertimes']:>9.1f}%")

# Clustering simples por similaridade ao ARG (referencia)
if 'ARG' in perfis:
    print("\n" + "=" * 90)
    print("DISTANCIA EUCLIDIANA DO PERFIL ARG (5 dimensoes normalizadas)")
    print("=" * 90)
    print("Quanto MENOR a distancia, mais parecido com o DNA da Liga Profesional Argentina.")
    print()

    # Vamos normalizar features importantes e calcular distancia
    feats = ['media', 'cv_total', 'pct_over_10', 'pct_extremos', 'cv_intertimes']
    # min-max normalize
    mins = {f: min(p[f] for p in perfis.values()) for f in feats}
    maxs = {f: max(p[f] for p in perfis.values()) for f in feats}
    def norm(p):
        return [(p[f] - mins[f])/(maxs[f]-mins[f]) if maxs[f]>mins[f] else 0 for f in feats]

    arg_vec = norm(perfis['ARG'])
    distancias = []
    for cod, p in perfis.items():
        if cod == 'ARG': continue
        v = norm(p)
        d = sum((a-b)**2 for a,b in zip(arg_vec, v))**0.5
        distancias.append((cod, d))
    distancias.sort(key=lambda x: x[1])
    for cod, d in distancias:
        marca = ""
        if d < 0.3: marca = "  <- MUITO PARECIDA com ARG"
        elif d < 0.5: marca = "  <- parecida"
        elif d > 0.8: marca = "  <- bem diferente"
        print(f"  {cod:<8}  distancia={d:.3f}{marca}")

    # Distancia BUN vs MLS (confirmar hipotese do usuario)
    print("\n" + "=" * 90)
    print("CONFIRMA HIPOTESE: MLS ~ BUN?  E vs ARG?")
    print("=" * 90)
    if 'MLS' in perfis and 'BUN' in perfis:
        mls_v = norm(perfis['MLS'])
        bun_v = norm(perfis['BUN'])
        d_mls_bun = sum((a-b)**2 for a,b in zip(mls_v, bun_v))**0.5
        d_mls_arg = sum((a-b)**2 for a,b in zip(mls_v, arg_vec))**0.5
        d_bun_arg = sum((a-b)**2 for a,b in zip(bun_v, arg_vec))**0.5
        print(f"  MLS <-> BUN:  {d_mls_bun:.3f}")
        print(f"  MLS <-> ARG:  {d_mls_arg:.3f}")
        print(f"  BUN <-> ARG:  {d_bun_arg:.3f}")
        if d_mls_bun < d_mls_arg:
            print(f"\n  CONFIRMADO: MLS e mais parecida com BUN do que com ARG ({d_mls_bun:.3f} < {d_mls_arg:.3f})")

# Dimensoes-chave ARG vs MLS vs BUN
print("\n" + "=" * 90)
print("PERFIL DETALHADO - LIGAS-FOCO")
print("=" * 90)
chave = ['ARG', 'ARG_B', 'MLS', 'BUN', 'BR', 'BR_B', 'USL']
print(f"{'Dimensao':<28}", end="")
for c in chave:
    if c in perfis: print(f"{c:>9}", end="")
print()
print("-" * 90)
labels = [
    ('Jogos analisados', 'n_jogos', '{:>9d}'),
    ('Media cantos/jogo', 'media', '{:>9.2f}'),
    ('Desvio (volatilidade)', 'desvio', '{:>9.2f}'),
    ('CV% (vol relativa)', 'cv_total', '{:>8.1f}%'),
    ('% jogos > 10 cantos', 'pct_over_10', '{:>8.0f}%'),
    ('% jogos extremos', 'pct_extremos', '{:>8.0f}%'),
    ('Spread inter-times', 'spread_intertimes', '{:>9.2f}'),
    ('CV% inter-times', 'cv_intertimes', '{:>8.1f}%'),
]
for lbl, k, fmt in labels:
    print(f"{lbl:<28}", end="")
    for c in chave:
        if c in perfis:
            print(fmt.format(perfis[c][k]), end="")
    print()
