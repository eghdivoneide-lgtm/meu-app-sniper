"""Gera perfis táticos para a BR (Brasileirão Série A) usando os mesmos 7 eixos da MLS."""
import json, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from collections import defaultdict
from statistics import mean, stdev
from datetime import datetime

DATASET = "BR/_dataset_consolidado.json"
PASTA_OUT = "BR"
PASTA_TIMES = "BR/times"
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
print(f"Times encontrados na BR: {len(times_set)}")
for t in times_set:
    print(f"  - {t}")

def perfil_time(time):
    jogos_time = []
    for g in games:
        if g["mandante"] == time:
            jogos_time.append({"data":g["data_partida"], "rodada":g["_rodada_primeira"], "local":"CASA", "adv":g["visitante"],
                "c_pro_ht":g["c_ht_m"], "c_sof_ht":g["c_ht_v"], "c_pro_2t":g["c_2t_m"], "c_sof_2t":g["c_2t_v"],
                "c_pro_ft":g["c_ft_m"], "c_sof_ft":g["c_ft_v"], "gols_pro_ht":g["g_m_ht"], "gols_sof_ht":g["g_v_ht"],
                "gols_pro_ft":g["g_m_ft"], "gols_sof_ft":g["g_v_ft"], "posse":g["pos_m"]})
        elif g["visitante"] == time:
            jogos_time.append({"data":g["data_partida"], "rodada":g["_rodada_primeira"], "local":"FORA", "adv":g["mandante"],
                "c_pro_ht":g["c_ht_v"], "c_sof_ht":g["c_ht_m"], "c_pro_2t":g["c_2t_v"], "c_sof_2t":g["c_2t_m"],
                "c_pro_ft":g["c_ft_v"], "c_sof_ft":g["c_ft_m"], "gols_pro_ht":g["g_v_ht"], "gols_sof_ht":g["g_m_ht"],
                "gols_pro_ft":g["g_v_ft"], "gols_sof_ft":g["g_m_ft"], "posse":g["pos_v"]})
    jogos_time.sort(key=lambda x: parse_dt(x["data"]))
    n = len(jogos_time)
    if n == 0: return None

    casa = [j for j in jogos_time if j["local"]=="CASA"]
    fora = [j for j in jogos_time if j["local"]=="FORA"]
    def med(lst, k, d=0): return mean([j[k] for j in lst]) if lst else d

    # Eixo 2: pós-gol-pró
    venceu_ht = [j for j in jogos_time if j["gols_pro_ht"] is not None and j["gols_pro_ht"]>j["gols_sof_ht"]]
    pos_gol_pro = None
    if len(venceu_ht) >= 2:
        cp = mean(j["c_pro_2t"] for j in venceu_ht); cs = mean(j["c_sof_2t"] for j in venceu_ht); d = cp-cs
        estilo = "PRESSIONA_POS_GOL" if d>=1 else ("RECUA_POS_GOL" if d<=-1 else "EQUILIBRADO_POS_GOL")
        pos_gol_pro = {"n":len(venceu_ht), "c_2t_pro":round(cp,2), "c_2t_sof":round(cs,2), "diff":round(d,2), "estilo":estilo}

    # Eixo 3: pós-gol-contra
    perdeu_ht = [j for j in jogos_time if j["gols_pro_ht"] is not None and j["gols_pro_ht"]<j["gols_sof_ht"]]
    pos_gol_contra = None
    if len(perdeu_ht) >= 2:
        cp = mean(j["c_pro_2t"] for j in perdeu_ht); cs = mean(j["c_sof_2t"] for j in perdeu_ht); d = cp-cs
        reacao = "REAGE_PRESSIONA" if d>=1 else ("DESISTE_RECUA" if d<=-1 else "EQUILIBRADO_REACAO")
        pos_gol_contra = {"n":len(perdeu_ht), "c_2t_pro":round(cp,2), "c_2t_sof":round(cs,2), "diff":round(d,2), "estilo":reacao}

    # Eixo 4: distribuição HT/2T
    ht_pro = mean(j["c_pro_ht"] for j in jogos_time)
    t2_pro = mean(j["c_pro_2t"] for j in jogos_time)
    pct_ht = ht_pro/(ht_pro+t2_pro)*100 if (ht_pro+t2_pro)>0 else None
    if pct_ht is None: distrib = "?"
    elif pct_ht >= 55: distrib = "BLITZ_INICIAL"
    elif pct_ht <= 35: distrib = "ASFIXIA_FINAL"
    else: distrib = "DISTRIBUIDO"

    # Eixo 5: sangrador
    sof_g = mean(j["c_sof_ft"] for j in jogos_time)
    posse_avg = mean(j["posse"] for j in jogos_time)
    if sof_g>=6 and posse_avg>=50: tipo_sangr = "SANGRA_COM_BOLA"
    elif sof_g>=6 and posse_avg<50: tipo_sangr = "SANGRA_SEM_BOLA"
    elif sof_g<4: tipo_sangr = "DEFESA_SOLIDA"
    else: tipo_sangr = "NORMAL"

    # Eixo 6: eficácia
    gols = [j["gols_pro_ft"] for j in jogos_time if j["gols_pro_ft"] is not None]
    cantos_p = [j["c_pro_ft"] for j in jogos_time]
    if gols and sum(gols)>0:
        razao = mean(cantos_p)/mean(gols) if mean(gols)>0 else None
        if razao is None: eficacia = "?"
        elif razao >= 5: eficacia = "ESTERIL"
        elif razao <= 3: eficacia = "CLINICA"
        else: eficacia = "NORMAL"
    else: razao=None; eficacia="?"

    # Regime
    ultimos = jogos_time[-min(4,n):]
    cr = [j["c_pro_ft"] for j in ultimos]
    if len(cr) >= 3:
        sd_r = stdev(cr); med_r = mean(cr); med_g = mean([j["c_pro_ft"] for j in jogos_time]); d = med_r-med_g
        if sd_r<2 and abs(d)>=1.5: regime = ("ATIVO_POSITIVO" if d>0 else "ATIVO_NEGATIVO"); obs=f"3+ jogos consistentes (sd {sd_r:.1f}) desvio {d:+.1f}"
        elif sd_r<2.5 and abs(d)>=1: regime = "EMERGENTE"; obs=f"Tendencia emergente sd {sd_r:.1f} desvio {d:+.1f}"
        elif sd_r>=3: regime = "QUEBRADO"; obs=f"Alta variancia sd {sd_r:.1f}"
        else: regime = "NEUTRO"; obs=f"Sem direcao clara sd {sd_r:.1f} desvio {d:+.1f}"
    else: regime="?"; obs="amostra pequena"

    return {
        "time":time, "n_jogos":n, "n_casa":len(casa), "n_fora":len(fora),
        "volume": {
            "casa_pro_ft":round(med(casa,"c_pro_ft"),2), "casa_sof_ft":round(med(casa,"c_sof_ft"),2),
            "casa_total":round(med(casa,"c_pro_ft")+med(casa,"c_sof_ft"),2),
            "fora_pro_ft":round(med(fora,"c_pro_ft"),2), "fora_sof_ft":round(med(fora,"c_sof_ft"),2),
            "fora_total":round(med(fora,"c_pro_ft")+med(fora,"c_sof_ft"),2)
        },
        "pos_gol_pro":pos_gol_pro, "pos_gol_contra":pos_gol_contra,
        "distribuicao":{"pct_ht":round(pct_ht,1) if pct_ht else None, "categoria":distrib, "ht_pro":round(ht_pro,2), "t2_pro":round(t2_pro,2)},
        "sangrador":{"sof_avg":round(sof_g,2), "posse_avg":round(posse_avg,1), "tipo":tipo_sangr},
        "eficacia":{"cantos_por_gol":round(razao,2) if razao else None, "categoria":eficacia, "total_gols":sum(gols) if gols else 0, "total_cantos":sum(cantos_p)},
        "regime":{"status":regime, "obs":obs, "ultimos":cr},
        "historico": jogos_time
    }

perfis = {}
for t in times_set:
    p = perfil_time(t)
    if p: perfis[t] = p

print(f"\n{'='*60}")
print(f"Perfis gerados: {len(perfis)}")

# Salva consolidado
json.dump(perfis, open(f"{PASTA_OUT}/_padroes_pos_gol.json","w",encoding='utf-8'), ensure_ascii=False, indent=1)

# Gera MDs individuais
def gen_md(t, p):
    L = [f"# 🎯 {t} — Perfil Tático (BR)", f"\n**Liga:** Brasileirão Série A · **N jogos:** {p['n_jogos']} ({p['n_casa']} casa / {p['n_fora']} fora) · **Snapshot:** 2026-05-18"]
    v = p["volume"]
    L += [f"\n## 📊 Volume\n", f"| Local | Pró | Sof | Total | Saldo |", f"|---|---|---|---|---|",
          f"| 🏠 Casa | {v['casa_pro_ft']} | {v['casa_sof_ft']} | {v['casa_total']} | {v['casa_pro_ft']-v['casa_sof_ft']:+.1f} |",
          f"| ✈️ Fora | {v['fora_pro_ft']} | {v['fora_sof_ft']} | {v['fora_total']} | {v['fora_pro_ft']-v['fora_sof_ft']:+.1f} |"]
    L += [f"\n## 🎯 Pós-gol-pró"]
    if p["pos_gol_pro"]:
        pg = p["pos_gol_pro"]
        L.append(f"**{pg['estilo']}** (N={pg['n']}) — 2T pro {pg['c_2t_pro']} vs sof {pg['c_2t_sof']} (diff {pg['diff']:+.2f})")
    else: L.append("_Amostra insuficiente_")
    L += [f"\n## 🩸 Pós-gol-contra"]
    if p["pos_gol_contra"]:
        pc = p["pos_gol_contra"]
        L.append(f"**{pc['estilo']}** (N={pc['n']}) — 2T pro {pc['c_2t_pro']} vs sof {pc['c_2t_sof']} (diff {pc['diff']:+.2f})")
    else: L.append("_Amostra insuficiente_")
    d = p["distribuicao"]; s = p["sangrador"]; e = p["eficacia"]; r = p["regime"]
    L += [f"\n## ⏱️ Distribuição HT/2T", f"**{d['categoria']}** — {d['pct_ht']}% no HT" if d["pct_ht"] else "?",
          f"\n## 🛡️ Sangrador", f"**{s['tipo']}** — sof {s['sof_avg']} / posse {s['posse_avg']}%",
          f"\n## 🎯 Eficácia", f"**{e['categoria']}** — {e['cantos_por_gol']} c/gol" if e["cantos_por_gol"] else "?",
          f"\n## 🔥 REGIME ATUAL: {r['status']}", f"{r['obs']}", f"**Últimos jogos (cantos pró):** {r['ultimos']}"]
    L += [f"\n## 📅 Histórico\n", f"| Rod | Data | Local | Adv | Pró | Sof | Gols | Posse |", f"|---|---|---|---|---|---|---|---|"]
    for j in p["historico"]:
        g = f"{j['gols_pro_ft']}x{j['gols_sof_ft']}" if j["gols_pro_ft"] is not None else "?"
        L.append(f"| {j['rodada']} | {j['data'][:10]} | {j['local']} | {j['adv']} | {j['c_pro_ft']} (HT{j['c_pro_ht']}) | {j['c_sof_ft']} (HT{j['c_sof_ht']}) | {g} | {j['posse']}% |")
    open(f"{PASTA_TIMES}/{t.replace(' ','_').replace('-','_')}.md","w",encoding='utf-8').write("\n".join(L))

for t, p in perfis.items():
    gen_md(t, p)
print(f"30 MDs gerados em {PASTA_TIMES}/")

# Resumo da liga
R = ["# 📊 BR — Resumo da Liga (Memória Recente)\n", f"**Jogos:** {len(games)} · **Times:** {len(perfis)} · **Snapshot:** 2026-05-18\n"]
# Distribuição regimes
from collections import Counter
regs = Counter(p["regime"]["status"] for p in perfis.values())
R += ["## 🎨 Regimes"]
for s, c in regs.most_common(): R.append(f"- {s}: {c}")

R += ["\n## 🔥 PRESSIONA pós-gol"]
press = sorted([(t,p) for t,p in perfis.items() if p["pos_gol_pro"] and p["pos_gol_pro"]["estilo"]=="PRESSIONA_POS_GOL"], key=lambda x:-x[1]["pos_gol_pro"]["diff"])
for t,p in press: R.append(f"- **{t}** diff +{p['pos_gol_pro']['diff']} (N={p['pos_gol_pro']['n']})")

R += ["\n## 🛡️ RECUA pós-gol"]
rec = sorted([(t,p) for t,p in perfis.items() if p["pos_gol_pro"] and p["pos_gol_pro"]["estilo"]=="RECUA_POS_GOL"], key=lambda x:x[1]["pos_gol_pro"]["diff"])
for t,p in rec: R.append(f"- **{t}** diff {p['pos_gol_pro']['diff']} (N={p['pos_gol_pro']['n']})")

R += ["\n## ⚔️ REAGE pós-derrota"]
reage = sorted([(t,p) for t,p in perfis.items() if p["pos_gol_contra"] and p["pos_gol_contra"]["estilo"]=="REAGE_PRESSIONA"], key=lambda x:-x[1]["pos_gol_contra"]["diff"])
for t,p in reage: R.append(f"- **{t}** diff +{p['pos_gol_contra']['diff']} (N={p['pos_gol_contra']['n']})")

R += ["\n## ⚡ BLITZ_INICIAL"]
blz = sorted([(t,p) for t,p in perfis.items() if p["distribuicao"]["categoria"]=="BLITZ_INICIAL"], key=lambda x:-x[1]["distribuicao"]["pct_ht"])
for t,p in blz: R.append(f"- **{t}** {p['distribuicao']['pct_ht']}% HT")

R += ["\n## 🔚 ASFIXIA_FINAL"]
asf = sorted([(t,p) for t,p in perfis.items() if p["distribuicao"]["categoria"]=="ASFIXIA_FINAL"], key=lambda x:x[1]["distribuicao"]["pct_ht"])
for t,p in asf: R.append(f"- **{t}** {p['distribuicao']['pct_ht']}% HT")

R += ["\n## 📈 REGIMES ATIVOS"]
atv = [(t,p) for t,p in perfis.items() if "ATIVO" in p["regime"]["status"]]
for t,p in atv: R.append(f"- **{t}** {p['regime']['status']} — {p['regime']['obs']}")

R += ["\n## 🔴 REGIMES QUEBRADOS"]
qb = [(t,p) for t,p in perfis.items() if "QUEBRADO" in p["regime"]["status"]]
for t,p in qb: R.append(f"- **{t}** — {p['regime']['obs']}")

open(f"{PASTA_OUT}/_resumo_liga.md","w",encoding='utf-8').write("\n".join(R))
print(f"Resumo: {PASTA_OUT}/_resumo_liga.md")
PYEOF