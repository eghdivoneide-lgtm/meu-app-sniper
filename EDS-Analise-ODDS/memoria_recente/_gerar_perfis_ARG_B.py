"""Gera perfis táticos para ARG_B com os mesmos 7 eixos."""
import json, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from collections import defaultdict
from statistics import mean, stdev
from datetime import datetime

DATASET = "ARG_B/_dataset_consolidado.json"
PASTA_OUT = "ARG_B"
PASTA_TIMES = "ARG_B/times"
os.makedirs(PASTA_TIMES, exist_ok=True)

games = json.load(open(DATASET, encoding='utf-8'))

def ct(g, key, lado):
    try: return int(g[key]["cantos"][lado])
    except: return 0
def parse_placar(s):
    try:
        a, b = s.split(" - ")
        return int(a), int(b)
    except:
        return None, None
for g in games:
    g["c_ft_m"]=ct(g,"estatisticas_ft","m"); g["c_ft_v"]=ct(g,"estatisticas_ft","v")
    g["c_ht_m"]=ct(g,"estatisticas_ht","m"); g["c_ht_v"]=ct(g,"estatisticas_ht","v")
    g["c_2t_m"]=g["c_ft_m"]-g["c_ht_m"]; g["c_2t_v"]=g["c_ft_v"]-g["c_ht_v"]
    g["t_ft"]=g["c_ft_m"]+g["c_ft_v"]; g["t_ht"]=g["c_ht_m"]+g["c_ht_v"]
    gm_ft, gv_ft = parse_placar(g.get("placar",{}).get("ft",""))
    gm_ht, gv_ht = parse_placar(g.get("placar",{}).get("ht",""))
    g["g_m_ft"], g["g_v_ft"] = gm_ft, gv_ft
    g["g_m_ht"], g["g_v_ht"] = gm_ht, gv_ht
    try: g["pos_m"]=int(g["estatisticas_ft"]["posse"]["m"]); g["pos_v"]=int(g["estatisticas_ft"]["posse"]["v"])
    except: g["pos_m"]=g["pos_v"]=50

def parse_dt(s):
    try: return datetime.strptime(s, "%d.%m.%Y %H:%M")
    except: return datetime.min

times_set = sorted({g["mandante"] for g in games} | {g["visitante"] for g in games})

def perfil(time):
    jt = []
    for g in games:
        if g["mandante"]==time:
            jt.append({"data":g["data_partida"],"rodada":g["_rodada_primeira"],"local":"CASA","adv":g["visitante"],
                "c_pro_ht":g["c_ht_m"],"c_sof_ht":g["c_ht_v"],"c_pro_2t":g["c_2t_m"],"c_sof_2t":g["c_2t_v"],
                "c_pro_ft":g["c_ft_m"],"c_sof_ft":g["c_ft_v"],"gols_pro_ht":g["g_m_ht"],"gols_sof_ht":g["g_v_ht"],
                "gols_pro_ft":g["g_m_ft"],"gols_sof_ft":g["g_v_ft"],"posse":g["pos_m"],"t_ft":g["t_ft"],"t_ht":g["t_ht"]})
        elif g["visitante"]==time:
            jt.append({"data":g["data_partida"],"rodada":g["_rodada_primeira"],"local":"FORA","adv":g["mandante"],
                "c_pro_ht":g["c_ht_v"],"c_sof_ht":g["c_ht_m"],"c_pro_2t":g["c_2t_v"],"c_sof_2t":g["c_2t_m"],
                "c_pro_ft":g["c_ft_v"],"c_sof_ft":g["c_ft_m"],"gols_pro_ht":g["g_v_ht"],"gols_sof_ht":g["g_m_ht"],
                "gols_pro_ft":g["g_v_ft"],"gols_sof_ft":g["g_m_ft"],"posse":g["pos_v"],"t_ft":g["t_ft"],"t_ht":g["t_ht"]})
    jt.sort(key=lambda x: parse_dt(x["data"]))
    n = len(jt)
    if n == 0: return None
    casa = [j for j in jt if j["local"]=="CASA"]
    fora = [j for j in jt if j["local"]=="FORA"]
    def med(lst,k,d=0): return mean([j[k] for j in lst]) if lst else d

    venceu_ht = [j for j in jt if j["gols_pro_ht"] is not None and j["gols_pro_ht"]>j["gols_sof_ht"]]
    pgp = None
    if len(venceu_ht)>=2:
        cp=mean(j["c_pro_2t"] for j in venceu_ht);cs=mean(j["c_sof_2t"] for j in venceu_ht);d=cp-cs
        est="PRESSIONA_POS_GOL" if d>=1 else ("RECUA_POS_GOL" if d<=-1 else "EQUILIBRADO_POS_GOL")
        pgp = {"n":len(venceu_ht),"diff":round(d,2),"estilo":est}

    perdeu_ht = [j for j in jt if j["gols_pro_ht"] is not None and j["gols_pro_ht"]<j["gols_sof_ht"]]
    pgc = None
    if len(perdeu_ht)>=2:
        cp=mean(j["c_pro_2t"] for j in perdeu_ht);cs=mean(j["c_sof_2t"] for j in perdeu_ht);d=cp-cs
        r="REAGE_PRESSIONA" if d>=1 else ("DESISTE_RECUA" if d<=-1 else "EQUILIBRADO_REACAO")
        pgc = {"n":len(perdeu_ht),"diff":round(d,2),"estilo":r}

    ht_p=mean(j["c_pro_ht"] for j in jt); t2_p=mean(j["c_pro_2t"] for j in jt)
    pct_ht = ht_p/(ht_p+t2_p)*100 if (ht_p+t2_p)>0 else None
    if pct_ht is None: distrib="?"
    elif pct_ht >= 55: distrib="BLITZ_INICIAL"
    elif pct_ht <= 35: distrib="ASFIXIA_FINAL"
    else: distrib="DISTRIBUIDO"

    sof_g = mean(j["c_sof_ft"] for j in jt); posse_avg = mean(j["posse"] for j in jt)
    if sof_g>=6 and posse_avg>=50: sang="SANGRA_COM_BOLA"
    elif sof_g>=6 and posse_avg<50: sang="SANGRA_SEM_BOLA"
    elif sof_g<4: sang="DEFESA_SOLIDA"
    else: sang="NORMAL"

    ult = jt[-min(4,n):]
    cr = [j["c_pro_ft"] for j in ult]
    if len(cr)>=3:
        sd_r = stdev(cr); med_r=mean(cr); med_g=mean([j["c_pro_ft"] for j in jt]); d=med_r-med_g
        if sd_r<2 and abs(d)>=1.5: regime=("ATIVO_POSITIVO" if d>0 else "ATIVO_NEGATIVO"); obs=f"3+ jogos consistentes sd {sd_r:.1f} desvio {d:+.1f}"
        elif sd_r<2.5 and abs(d)>=1: regime="EMERGENTE"; obs=f"emergente sd {sd_r:.1f} desvio {d:+.1f}"
        elif sd_r>=3: regime="QUEBRADO"; obs=f"alta variancia sd {sd_r:.1f}"
        else: regime="NEUTRO"; obs=f"sd {sd_r:.1f} desvio {d:+.1f}"
    else: regime="?"; obs="N<3"

    return {
        "time":time,"n_jogos":n,"n_casa":len(casa),"n_fora":len(fora),
        "volume":{"casa_pro":round(med(casa,"c_pro_ft"),2),"casa_sof":round(med(casa,"c_sof_ft"),2),
                  "casa_total":round(med(casa,"c_pro_ft")+med(casa,"c_sof_ft"),2),
                  "casa_pro_ht":round(med(casa,"c_pro_ht"),2),"casa_sof_ht":round(med(casa,"c_sof_ht"),2),
                  "fora_pro":round(med(fora,"c_pro_ft"),2),"fora_sof":round(med(fora,"c_sof_ft"),2),
                  "fora_total":round(med(fora,"c_pro_ft")+med(fora,"c_sof_ft"),2),
                  "fora_pro_ht":round(med(fora,"c_pro_ht"),2),"fora_sof_ht":round(med(fora,"c_sof_ht"),2)},
        "pos_gol_pro":pgp,"pos_gol_contra":pgc,
        "distribuicao":{"pct_ht":round(pct_ht,1) if pct_ht else None,"categoria":distrib},
        "sangrador":{"sof_avg":round(sof_g,2),"posse_avg":round(posse_avg,1),"tipo":sang},
        "regime":{"status":regime,"obs":obs,"ultimos":cr}
    }

perfis = {}
for t in times_set:
    p = perfil(t)
    if p: perfis[t] = p

print(f"Perfis gerados: {len(perfis)}")
json.dump(perfis, open(f"{PASTA_OUT}/_padroes_pos_gol.json","w",encoding='utf-8'),ensure_ascii=False,indent=1)

from collections import Counter
regs = Counter(p["regime"]["status"] for p in perfis.values())
print(f"\nREGIMES: {dict(regs)}")

# Top/Bottom volume casa e fora
print(f"\n--- TOP 5 VOLUME CASA (total medio) ---")
casa_vol = sorted([(t,p) for t,p in perfis.items() if p["n_casa"]>=2], key=lambda x:-x[1]["volume"]["casa_total"])[:5]
for t,p in casa_vol: print(f"  {t}: total {p['volume']['casa_total']} (N={p['n_casa']})")

print(f"\n--- BOTTOM 5 VOLUME CASA ---")
casa_vol = sorted([(t,p) for t,p in perfis.items() if p["n_casa"]>=2], key=lambda x:x[1]["volume"]["casa_total"])[:5]
for t,p in casa_vol: print(f"  {t}: total {p['volume']['casa_total']} (N={p['n_casa']})")

print(f"\n--- TOP 5 VOLUME FORA ---")
fora_vol = sorted([(t,p) for t,p in perfis.items() if p["n_fora"]>=2], key=lambda x:-x[1]["volume"]["fora_total"])[:5]
for t,p in fora_vol: print(f"  {t}: total {p['volume']['fora_total']} (N={p['n_fora']})")

print(f"\n--- BOTTOM 5 VOLUME FORA ---")
fora_vol = sorted([(t,p) for t,p in perfis.items() if p["n_fora"]>=2], key=lambda x:x[1]["volume"]["fora_total"])[:5]
for t,p in fora_vol: print(f"  {t}: total {p['volume']['fora_total']} (N={p['n_fora']})")
