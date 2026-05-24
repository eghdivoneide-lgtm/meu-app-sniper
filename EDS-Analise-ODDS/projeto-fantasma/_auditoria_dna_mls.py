"""Auditoria DNA da MLS — verifica drift entre historico e o xCorners projetado."""
import json, sys, io, re, statistics
from datetime import datetime
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 1) Carregar TODOS os jogos historicos do mls2026.js (parsear o objeto JS como JSON)
mls_path = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\especialista-cantos\data\mls2026.js"
with open(mls_path, 'r', encoding='utf-8') as f:
    txt = f.read()

# Extrai o JSON entre "window.DADOS_MLS = " e o último "}";
m = re.search(r"window\.DADOS_MLS\s*=\s*(\{.*?\});", txt, re.S)
if not m:
    # tentar sem ;
    m = re.search(r"window\.DADOS_MLS\s*=\s*(\{.*\})\s*;?\s*$", txt, re.S)
obj = json.loads(m.group(1))
jogos = obj['jogos']
print(f"Carregados {len(jogos)} jogos historicos da MLS 2026")

# 2) Estatisticas globais — só jogos que tem placar e cantos validos
def total_cantos(j):
    c = j.get('cantos', {}).get('ft', {})
    return (c.get('m') or 0) + (c.get('v') or 0)

def parse_data(s):
    try: return datetime.strptime(s.split(' ')[0], "%d.%m.%Y")
    except: return None

jogos_validos = [j for j in jogos if total_cantos(j) > 0 and j.get('cantos',{}).get('ft',{}).get('m') is not None]
print(f"Jogos com cantos validos: {len(jogos_validos)}")

# Total de cantos por jogo (FT)
totals = [total_cantos(j) for j in jogos_validos]
print(f"\n--- ESTATISTICA GLOBAL DE CANTOS FT (toda temporada) ---")
print(f"  Media:    {statistics.mean(totals):.2f}")
print(f"  Mediana:  {statistics.median(totals):.2f}")
print(f"  Desvio:   {statistics.pstdev(totals):.2f}")
print(f"  Min/Max:  {min(totals)} / {max(totals)}")
print(f"  > 10 cantos: {sum(1 for t in totals if t > 10)}/{len(totals)} = {sum(1 for t in totals if t > 10)/len(totals)*100:.0f}%")
print(f"  < 10 cantos: {sum(1 for t in totals if t < 10)}/{len(totals)} = {sum(1 for t in totals if t < 10)/len(totals)*100:.0f}%")
print(f"  = 10 cantos: {sum(1 for t in totals if t == 10)}/{len(totals)} = {sum(1 for t in totals if t == 10)/len(totals)*100:.0f}%")

# 3) Tendencia recente — ultimos 30 dias vs janela inteira
data_hoje = datetime(2026, 5, 13)
janelas = [
    ("Toda temporada", jogos_validos),
    ("Ultimos 60 dias", [j for j in jogos_validos if parse_data(j.get('data','')) and (data_hoje - parse_data(j['data'])).days <= 60]),
    ("Ultimos 30 dias", [j for j in jogos_validos if parse_data(j.get('data','')) and (data_hoje - parse_data(j['data'])).days <= 30]),
    ("Ultimos 14 dias", [j for j in jogos_validos if parse_data(j.get('data','')) and (data_hoje - parse_data(j['data'])).days <= 14]),
    ("Ultimos 7 dias", [j for j in jogos_validos if parse_data(j.get('data','')) and (data_hoje - parse_data(j['data'])).days <= 7]),
]
print("\n--- DRIFT TEMPORAL (volume medio de cantos FT) ---")
for nome, js in janelas:
    if not js: continue
    ts = [total_cantos(j) for j in js]
    pct_over = sum(1 for t in ts if t > 10) / len(ts) * 100
    print(f"  {nome:<22} n={len(js):>3}  media={statistics.mean(ts):>5.2f}  mediana={statistics.median(ts):>4.1f}  %>10 cantos: {pct_over:>4.0f}%")

# 4) Por time: media de cantos pro / contra (pegar todos jogos do time)
print("\n--- TOP 10 TIMES POR MEDIA DE CANTOS PRO (atacante) ---")
times_stats = {}
for j in jogos_validos:
    m_t, v_t = j['mandante'], j['visitante']
    cm, cv = j['cantos']['ft']['m'], j['cantos']['ft']['v']
    times_stats.setdefault(m_t, {'pro':[], 'contra':[]})
    times_stats.setdefault(v_t, {'pro':[], 'contra':[]})
    times_stats[m_t]['pro'].append(cm)
    times_stats[m_t]['contra'].append(cv)
    times_stats[v_t]['pro'].append(cv)
    times_stats[v_t]['contra'].append(cm)
ranked = []
for t, s in times_stats.items():
    if len(s['pro']) < 5: continue
    media_pro = statistics.mean(s['pro'])
    media_contra = statistics.mean(s['contra'])
    media_total = statistics.mean([p+c for p,c in zip(s['pro'], s['contra'])])
    ranked.append((t, len(s['pro']), media_pro, media_contra, media_total))
for t, n, mp, mc, mt in sorted(ranked, key=lambda x: -x[2])[:10]:
    print(f"  {t:<26} n={n:>2}  pro={mp:.2f}  contra={mc:.2f}  jogo={mt:.2f}")

print("\n--- BOTTOM 10 TIMES POR MEDIA DE CANTOS PRO ---")
for t, n, mp, mc, mt in sorted(ranked, key=lambda x: x[2])[:10]:
    print(f"  {t:<26} n={n:>2}  pro={mp:.2f}  contra={mc:.2f}  jogo={mt:.2f}")

# 5) COMPARACAO: xCorners projetados pelo app na rodada 09-10/05 vs media historica do confronto
print("\n--- DRIFT MODELO vs HISTORICO (rodada 09-10/05) ---")
xc_app = {  # do relatorio Bala de Prata
    ('Toronto FC','Inter Miami'): 15.07,
    ('Chicago Fire','New York Red Bulls'): 12.89,
    ('CF Montreal','Orlando City'): 8.17,
    ('Atlanta Utd','Los Angeles Galaxy'): 8.23,
    ('Charlotte','FC Cincinnati'): 9.76,
    ('New England Revolution','Philadelphia Union'): 8.63,
    ('FC Dallas','Real Salt Lake'): 11.92,
    ('Nashville SC','DC United'): 7.70,
    ('Colorado Rapids','St. Louis City'): 8.88,
    ('Portland Timbers','Sporting Kansas City'): 7.21,
    ('San Jose Earthquakes','Vancouver Whitecaps'): 12.26,
    ('Seattle Sounders','San Diego FC'): 7.84,
    ('New York City','Columbus Crew'): 9.34,
    ('Minnesota United','Austin FC'): 15.41,
    ('Los Angeles FC','Houston Dynamo'): 11.14,
}
# resultado real
real_path = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\projeto-fantasma\mls_rodada_2_2026-05-12.json"
with open(real_path, 'r', encoding='utf-8') as f:
    rd = json.load(f)
real_dict = {}
for j in rd:
    cft = j.get('estatisticas_ft',{}).get('cantos',{})
    real_dict[(j['mandante'], j['visitante'])] = (cft.get('m',0), cft.get('v',0))

print(f"{'Confronto':<48}{'xC_app':>8}{'xC_hist':>10}{'real':>8}{'app_err':>10}{'hist_err':>10}")
print("-"*100)
diffs_app = []
diffs_hist = []
for (m_t, v_t), xc in xc_app.items():
    # media historica do mandante (cantos PRO em casa) + media do visitante (cantos PRO fora)
    mp = times_stats.get(m_t, {}).get('pro', [])
    vp = times_stats.get(v_t, {}).get('pro', [])
    if not mp or not vp:
        print(f"  {m_t} vs {v_t}: SEM HISTORICO")
        continue
    xc_hist = statistics.mean(mp) + statistics.mean(vp)
    real = real_dict.get((m_t, v_t))
    if not real:
        print(f"  {m_t} vs {v_t}: SEM REAL")
        continue
    real_total = real[0] + real[1]
    err_app = xc - real_total
    err_hist = xc_hist - real_total
    diffs_app.append(err_app)
    diffs_hist.append(err_hist)
    print(f"  {m_t[:18]} vs {v_t[:22]:<22}{xc:>8.1f}{xc_hist:>10.2f}{real_total:>8}{err_app:>+10.2f}{err_hist:>+10.2f}")

print(f"\nVies medio do APP    (xC - real): {statistics.mean(diffs_app):+.2f}  (negativo = subestimou)")
print(f"Vies medio do HIST   (media - real): {statistics.mean(diffs_hist):+.2f}")
print(f"Erro absoluto medio APP:  {statistics.mean([abs(d) for d in diffs_app]):.2f}")
print(f"Erro absoluto medio HIST: {statistics.mean([abs(d) for d in diffs_hist]):.2f}")

# 6) Ranking de quem inflou: jogos onde o app subestimou mais
print("\n--- TOP SUBESTIMACOES (app projetou MUITO menos do que aconteceu) ---")
sub = sorted([(m_t,v_t,xc,real_dict[(m_t,v_t)][0]+real_dict[(m_t,v_t)][1], real_dict[(m_t,v_t)][0]+real_dict[(m_t,v_t)][1]-xc)
              for (m_t,v_t),xc in xc_app.items() if real_dict.get((m_t,v_t))],
             key=lambda x: -x[4])[:8]
for m_t, v_t, xc, real, gap in sub:
    print(f"  {m_t[:20]} vs {v_t[:20]:<20}  app: {xc:>5.1f}  real: {real:>3}  gap: +{gap:>5.1f}")
