"""Gera perfil tático completo para cada time da MLS - 7 eixos + detecção de regime."""
import json, sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from collections import defaultdict
from statistics import mean, stdev
from datetime import datetime

DATASET = "../especialista-cantos/Auditoria Especialista em cantos/_Auditorias/_dataset_mls_consolidado.json"
PASTA_OUT = "MLS"
PASTA_TIMES = "MLS/times"

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

# Enriquece
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
    try: g["fin_m"]=int(g["estatisticas_ft"]["finalizacoes"]["m"]); g["fin_v"]=int(g["estatisticas_ft"]["finalizacoes"]["v"])
    except: g["fin_m"]=g["fin_v"]=0

# Helpers
def parse_dt(s):
    try: return datetime.strptime(s, "%d.%m.%Y %H:%M")
    except: return datetime.min

# Lista de todos times
times_set = sorted({g["mandante"] for g in games} | {g["visitante"] for g in games})
print(f"Times encontrados: {len(times_set)}")

def perfil_time(time):
    """Constrói perfil completo de UM time."""
    # Todos jogos do time, ordenados por data
    jogos_time = []
    for g in games:
        if g["mandante"] == time:
            jogos_time.append({
                "data": g["data_partida"], "rodada": g["_rodada_primeira"], "local": "CASA",
                "adv": g["visitante"],
                "c_pro_ht": g["c_ht_m"], "c_sof_ht": g["c_ht_v"],
                "c_pro_2t": g["c_2t_m"], "c_sof_2t": g["c_2t_v"],
                "c_pro_ft": g["c_ft_m"], "c_sof_ft": g["c_ft_v"],
                "gols_pro_ht": g["g_m_ht"], "gols_sof_ht": g["g_v_ht"],
                "gols_pro_ft": g["g_m_ft"], "gols_sof_ft": g["g_v_ft"],
                "posse": g["pos_m"], "fin": g["fin_m"]
            })
        elif g["visitante"] == time:
            jogos_time.append({
                "data": g["data_partida"], "rodada": g["_rodada_primeira"], "local": "FORA",
                "adv": g["mandante"],
                "c_pro_ht": g["c_ht_v"], "c_sof_ht": g["c_ht_m"],
                "c_pro_2t": g["c_2t_v"], "c_sof_2t": g["c_2t_m"],
                "c_pro_ft": g["c_ft_v"], "c_sof_ft": g["c_ft_m"],
                "gols_pro_ht": g["g_v_ht"], "gols_sof_ht": g["g_m_ht"],
                "gols_pro_ft": g["g_v_ft"], "gols_sof_ft": g["g_m_ft"],
                "posse": g["pos_v"], "fin": g["fin_v"]
            })

    jogos_time.sort(key=lambda x: parse_dt(x["data"]))
    n = len(jogos_time)
    if n == 0: return None

    # === EIXO 1: VOLUME (média 5 rodadas, média 3 últimas) ===
    casa = [j for j in jogos_time if j["local"] == "CASA"]
    fora = [j for j in jogos_time if j["local"] == "FORA"]

    def media_ou(lst, k, default=0):
        return mean([j[k] for j in lst]) if lst else default

    # === EIXO 2: PÓS-GOL-PRÓ ===
    # Quando o time fez gol no HT (lidera HT), o que aconteceu com cantos do 2T?
    venceu_ht = [j for j in jogos_time if j["gols_pro_ht"] is not None and j["gols_pro_ht"] > j["gols_sof_ht"]]
    pos_gol_pro = None
    if len(venceu_ht) >= 2:
        c_2t_pro_pos = mean(j["c_pro_2t"] for j in venceu_ht)
        c_2t_sof_pos = mean(j["c_sof_2t"] for j in venceu_ht)
        diff_pos = c_2t_pro_pos - c_2t_sof_pos
        if diff_pos >= 1:    estilo = "PRESSIONA_POS_GOL"
        elif diff_pos <= -1: estilo = "RECUA_POS_GOL"
        else:                estilo = "EQUILIBRADO_POS_GOL"
        pos_gol_pro = {"n": len(venceu_ht), "c_2t_pro": round(c_2t_pro_pos,2), "c_2t_sof": round(c_2t_sof_pos,2), "diff": round(diff_pos,2), "estilo": estilo}

    # === EIXO 3: PÓS-GOL-CONTRA ===
    # Quando o time SOFREU gol no HT (perde HT), reagiu ou desistiu?
    perdeu_ht = [j for j in jogos_time if j["gols_pro_ht"] is not None and j["gols_pro_ht"] < j["gols_sof_ht"]]
    pos_gol_contra = None
    if len(perdeu_ht) >= 2:
        c_2t_pro_neg = mean(j["c_pro_2t"] for j in perdeu_ht)
        c_2t_sof_neg = mean(j["c_sof_2t"] for j in perdeu_ht)
        diff_neg = c_2t_pro_neg - c_2t_sof_neg
        if diff_neg >= 1:    reacao = "REAGE_PRESSIONA"
        elif diff_neg <= -1: reacao = "DESISTE_RECUA"
        else:                reacao = "EQUILIBRADO_REACAO"
        pos_gol_contra = {"n": len(perdeu_ht), "c_2t_pro": round(c_2t_pro_neg,2), "c_2t_sof": round(c_2t_sof_neg,2), "diff": round(diff_neg,2), "estilo": reacao}

    # === EIXO 4: DISTRIBUIÇÃO HT/2T ===
    ht_pro = mean(j["c_pro_ht"] for j in jogos_time)
    t2_pro = mean(j["c_pro_2t"] for j in jogos_time)
    if ht_pro > 0:
        pct_ht = ht_pro / (ht_pro + t2_pro) * 100
        if pct_ht >= 55:   distrib = "BLITZ_INICIAL"
        elif pct_ht <= 35: distrib = "ASFIXIA_FINAL"
        else:              distrib = "DISTRIBUIDO"
    else:
        distrib = "?"

    # === EIXO 5: SANGRADOR HONESTO ===
    sof_pro_geral = mean(j["c_sof_ft"] for j in jogos_time)
    posse_avg = mean(j["posse"] for j in jogos_time)
    # Razão sof/posse: alto = sangra mesmo com bola; baixo = aceita pressão
    if sof_pro_geral >= 6 and posse_avg >= 50:
        tipo_sangr = "SANGRA_COM_BOLA"  # tem bola mas dá espaço
    elif sof_pro_geral >= 6 and posse_avg < 50:
        tipo_sangr = "SANGRA_SEM_BOLA"  # cede campo mesmo
    elif sof_pro_geral < 4:
        tipo_sangr = "DEFESA_SOLIDA"
    else:
        tipo_sangr = "NORMAL"

    # === EIXO 6: PRESSÃO ESTÉRIL ===
    gols_pro = [j["gols_pro_ft"] for j in jogos_time if j["gols_pro_ft"] is not None]
    cantos_pro = [j["c_pro_ft"] for j in jogos_time]
    if gols_pro and sum(gols_pro) > 0:
        razao = mean(cantos_pro) / mean(gols_pro)
        if razao >= 5:   eficacia = "ESTERIL"  # 5+ cantos por gol
        elif razao <= 3: eficacia = "CLINICA"  # converte
        else:            eficacia = "NORMAL"
    else:
        razao = float('inf') if cantos_pro else 0
        eficacia = "ESTERIL" if razao > 5 else "?"

    # === EIXO 7: RESPOSTA AO ADVERSÁRIO === (skip por enquanto - precisa dados de adversários)

    # === REGIME ATIVO/QUEBRADO ===
    # Pega últimos 3-4 jogos e analisa tendência
    ultimos = jogos_time[-min(4, n):]
    cantos_recentes = [j["c_pro_ft"] for j in ultimos]
    # Mantém padrão se variação for baixa E direção consistente
    if len(cantos_recentes) >= 3:
        sd_recente = stdev(cantos_recentes)
        med_recente = mean(cantos_recentes)
        med_geral = mean([j["c_pro_ft"] for j in jogos_time])
        diff_med = med_recente - med_geral

        if sd_recente < 2 and abs(diff_med) >= 1.5:
            regime = "🟢 ATIVO" if diff_med > 0 else "🟢 ATIVO_NEGATIVO"
            direcao = "alta" if diff_med > 0 else "baixa"
            obs_regime = f"Últimos 3+ jogos consistentemente {direcao} ({sd_recente:.1f} sd) | desvio vs geral: {diff_med:+.1f}"
        elif sd_recente < 2.5 and abs(diff_med) >= 1:
            regime = "🟡 EMERGENTE"
            direcao = "alta" if diff_med > 0 else "baixa"
            obs_regime = f"Tendência emergente em {direcao} | sd {sd_recente:.1f} | desvio {diff_med:+.1f}"
        elif sd_recente >= 3:
            regime = "🔴 QUEBRADO"
            obs_regime = f"Alta variância nos últimos jogos (sd {sd_recente:.1f}) | sem padrão claro"
        else:
            regime = "⚪ NEUTRO"
            obs_regime = f"Sem direção clara | sd {sd_recente:.1f} | desvio {diff_med:+.1f}"
    else:
        regime = "?"
        obs_regime = "Amostra pequena (<3 jogos)"

    # === Resumo dos jogos cronológicos ===
    return {
        "time": time,
        "n_jogos_total": n,
        "n_casa": len(casa),
        "n_fora": len(fora),
        "volume": {
            "casa_pro_ft": round(media_ou(casa, "c_pro_ft"),2),
            "casa_sof_ft": round(media_ou(casa, "c_sof_ft"),2),
            "casa_total_ft": round(media_ou(casa, "c_pro_ft")+media_ou(casa, "c_sof_ft"),2),
            "fora_pro_ft": round(media_ou(fora, "c_pro_ft"),2),
            "fora_sof_ft": round(media_ou(fora, "c_sof_ft"),2),
            "fora_total_ft": round(media_ou(fora, "c_pro_ft")+media_ou(fora, "c_sof_ft"),2),
        },
        "pos_gol_pro": pos_gol_pro,
        "pos_gol_contra": pos_gol_contra,
        "distribuicao_HT2T": {"pct_ht": round(pct_ht,1) if ht_pro > 0 else None, "categoria": distrib, "ht_pro_avg": round(ht_pro,2), "t2_pro_avg": round(t2_pro,2)},
        "sangrador": {"sof_avg": round(sof_pro_geral,2), "posse_avg": round(posse_avg,1), "tipo": tipo_sangr},
        "eficacia": {"cantos_por_gol": round(razao,2) if razao != float('inf') else None, "categoria": eficacia, "total_gols": sum(gols_pro) if gols_pro else 0, "total_cantos": sum(cantos_pro)},
        "regime_atual": {"status": regime, "obs": obs_regime, "ultimos_jogos": cantos_recentes},
        "historico": jogos_time
    }

# Gera todos os perfis
todos_perfis = {}
for time in times_set:
    p = perfil_time(time)
    if p: todos_perfis[time] = p

print(f"Perfis gerados: {len(todos_perfis)}")

# Salva JSON consolidado
json.dump(todos_perfis, open(f"{PASTA_OUT}/_padroes_pos_gol.json", "w", encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"JSON salvo: {PASTA_OUT}/_padroes_pos_gol.json")

# Gera 1 arquivo MD por time
def gerar_md_time(time, p):
    lines = []
    lines.append(f"# 🎯 {time} — Perfil Tático Memória Recente")
    lines.append(f"\n**Liga:** MLS · **N jogos analisados:** {p['n_jogos_total']} ({p['n_casa']} casa · {p['n_fora']} fora) · **Snapshot:** 2026-05-18")
    lines.append(f"\n## 📊 Volume (eixo 1)\n")
    v = p["volume"]
    lines.append(f"| Local | Pró FT | Sof FT | Total | Saldo |")
    lines.append(f"|-------|--------|--------|-------|-------|")
    lines.append(f"| 🏠 Casa | {v['casa_pro_ft']} | {v['casa_sof_ft']} | {v['casa_total_ft']} | {v['casa_pro_ft']-v['casa_sof_ft']:+.1f} |")
    lines.append(f"| ✈️ Fora | {v['fora_pro_ft']} | {v['fora_sof_ft']} | {v['fora_total_ft']} | {v['fora_pro_ft']-v['fora_sof_ft']:+.1f} |")

    lines.append(f"\n## 🎯 Pós-gol-pró (eixo 2) — Comportamento depois de marcar")
    if p["pos_gol_pro"]:
        pg = p["pos_gol_pro"]
        emoji = "🔥" if pg["estilo"] == "PRESSIONA_POS_GOL" else ("🛡️" if pg["estilo"] == "RECUA_POS_GOL" else "⚖️")
        lines.append(f"\n{emoji} **{pg['estilo']}** (N={pg['n']} jogos vencendo HT)")
        lines.append(f"- Cantos PRÓ no 2T (já vencendo): {pg['c_2t_pro']}")
        lines.append(f"- Cantos SOFRIDOS no 2T: {pg['c_2t_sof']}")
        lines.append(f"- Diff: {pg['diff']:+.2f}")
        if pg["estilo"] == "PRESSIONA_POS_GOL":
            lines.append(f"- ✅ **Após marcar, MANTÉM a pressão** — bom para HDP cantos cravado")
        elif pg["estilo"] == "RECUA_POS_GOL":
            lines.append(f"- ⚠️ **Após marcar, RECUA** — cuidado com HDP de cantos (pode parar de fazer)")
        else:
            lines.append(f"- ⚖️ Equilibrado após marcar")
    else:
        lines.append(f"\n_Amostra insuficiente (precisa de ≥2 jogos com vitória no HT)_")

    lines.append(f"\n## 🩸 Pós-gol-contra (eixo 3) — Reação depois de sofrer")
    if p["pos_gol_contra"]:
        pc = p["pos_gol_contra"]
        emoji = "⚔️" if pc["estilo"] == "REAGE_PRESSIONA" else ("😶" if pc["estilo"] == "DESISTE_RECUA" else "⚖️")
        lines.append(f"\n{emoji} **{pc['estilo']}** (N={pc['n']} jogos perdendo HT)")
        lines.append(f"- Cantos PRÓ no 2T (perdendo): {pc['c_2t_pro']}")
        lines.append(f"- Cantos SOFRIDOS no 2T: {pc['c_2t_sof']}")
        lines.append(f"- Diff: {pc['diff']:+.2f}")
        if pc["estilo"] == "REAGE_PRESSIONA":
            lines.append(f"- 🔥 **Quando perde, MORDE** — gera OVER cantos via pressão reativa")
        elif pc["estilo"] == "DESISTE_RECUA":
            lines.append(f"- 😶 **Quando perde, DESISTE** — UNDER cantos pode aparecer")
        else:
            lines.append(f"- ⚖️ Mantém equilíbrio mesmo perdendo")
    else:
        lines.append(f"\n_Amostra insuficiente (precisa de ≥2 jogos perdendo no HT)_")

    lines.append(f"\n## ⏱️ Distribuição HT/2T (eixo 4)")
    d = p["distribuicao_HT2T"]
    if d["pct_ht"] is not None:
        emoji = "⚡" if d["categoria"] == "BLITZ_INICIAL" else ("🔚" if d["categoria"] == "ASFIXIA_FINAL" else "📊")
        lines.append(f"\n{emoji} **{d['categoria']}** — {d['pct_ht']}% dos cantos saem no 1T")
        lines.append(f"- HT pró médio: {d['ht_pro_avg']}")
        lines.append(f"- 2T pró médio: {d['t2_pro_avg']}")

    lines.append(f"\n## 🛡️ Sangrador honesto (eixo 5)")
    s = p["sangrador"]
    emoji = {"DEFESA_SOLIDA":"🛡️","SANGRA_COM_BOLA":"🤔","SANGRA_SEM_BOLA":"🩸","NORMAL":"⚖️"}.get(s["tipo"],"⚖️")
    lines.append(f"\n{emoji} **{s['tipo']}** — sofre {s['sof_avg']} cantos com posse média {s['posse_avg']}%")

    lines.append(f"\n## 🎯 Eficácia ofensiva (eixo 6)")
    e = p["eficacia"]
    if e["cantos_por_gol"] is not None:
        emoji = "⚠️" if e["categoria"] == "ESTERIL" else ("🎯" if e["categoria"] == "CLINICA" else "📊")
        lines.append(f"\n{emoji} **{e['categoria']}** — {e['cantos_por_gol']:.1f} cantos por gol marcado ({e['total_cantos']} cantos / {e['total_gols']} gols)")
        if e["categoria"] == "ESTERIL":
            lines.append(f"- ⚠️ Faz muitos cantos sem converter — bom para OVER cantos / ruim para 1x2 gols")
        elif e["categoria"] == "CLINICA":
            lines.append(f"- ✅ Converte com poucos cantos — economiza força")

    lines.append(f"\n## 🔥 REGIME ATUAL ({p['regime_atual']['status']})")
    lines.append(f"\n{p['regime_atual']['obs']}")
    lines.append(f"\n**Últimos jogos (cantos pró):** {p['regime_atual']['ultimos_jogos']}")

    lines.append(f"\n## 📅 Histórico cronológico\n")
    lines.append(f"| Rodada | Data | Local | Adv | Cantos pró | Cantos sof | Gols | Posse |")
    lines.append(f"|--------|------|-------|-----|------------|------------|------|-------|")
    for j in p["historico"]:
        gols = f"{j['gols_pro_ft']}x{j['gols_sof_ft']}" if j['gols_pro_ft'] is not None else "?"
        lines.append(f"| {j['rodada']} | {j['data'][:10]} | {j['local']} | {j['adv']} | {j['c_pro_ft']} (HT{j['c_pro_ht']}) | {j['c_sof_ft']} (HT{j['c_sof_ht']}) | {gols} | {j['posse']}% |")

    lines.append(f"\n---\n_Gerado em 2026-05-18 · auto-update a cada nova rodada_")
    return "\n".join(lines)

for time, p in todos_perfis.items():
    fname = time.replace(" ", "_").replace(".","").replace("/","_")
    md = gerar_md_time(time, p)
    open(f"{PASTA_TIMES}/{fname}.md", "w", encoding='utf-8').write(md)

print(f"30 arquivos MD gerados em {PASTA_TIMES}/")

# Resumo da liga
status_count = defaultdict(int)
for t, p in todos_perfis.items():
    status_count[p["regime_atual"]["status"]] += 1

# Resumo MD
resumo = []
resumo.append("# 📊 MLS — Resumo da Liga (Memória Recente)\n")
resumo.append(f"**Snapshot:** 2026-05-18 · **Jogos analisados:** {len(games)} · **Times:** {len(todos_perfis)}\n")
resumo.append("## 🎨 Distribuição de Regimes Atuais\n")
for status, cnt in status_count.items():
    resumo.append(f"- {status}: **{cnt}** times")
resumo.append("\n## 🔥 Top times PRESSIONA pós-gol (bom HDP cantos)\n")
press = sorted([(t,p) for t,p in todos_perfis.items() if p["pos_gol_pro"] and p["pos_gol_pro"]["estilo"]=="PRESSIONA_POS_GOL"],
               key=lambda x: -x[1]["pos_gol_pro"]["diff"])
for t, p in press[:8]:
    resumo.append(f"- **{t}**: Diff +{p['pos_gol_pro']['diff']:.2f} (N={p['pos_gol_pro']['n']})")

resumo.append("\n## 🛡️ Top times RECUA pós-gol (cuidado HDP cantos)\n")
recua = sorted([(t,p) for t,p in todos_perfis.items() if p["pos_gol_pro"] and p["pos_gol_pro"]["estilo"]=="RECUA_POS_GOL"],
               key=lambda x: x[1]["pos_gol_pro"]["diff"])
for t, p in recua[:8]:
    resumo.append(f"- **{t}**: Diff {p['pos_gol_pro']['diff']:.2f} (N={p['pos_gol_pro']['n']})")

resumo.append("\n## ⚔️ Top times REAGE pós-gol-contra (gera OVER quando sofre)\n")
reage = sorted([(t,p) for t,p in todos_perfis.items() if p["pos_gol_contra"] and p["pos_gol_contra"]["estilo"]=="REAGE_PRESSIONA"],
               key=lambda x: -x[1]["pos_gol_contra"]["diff"])
for t, p in reage[:8]:
    resumo.append(f"- **{t}**: Diff +{p['pos_gol_contra']['diff']:.2f} (N={p['pos_gol_contra']['n']})")

resumo.append("\n## ⚡ Top times BLITZ_INICIAL (carga no 1T)\n")
blitz = sorted([(t,p) for t,p in todos_perfis.items() if p["distribuicao_HT2T"]["categoria"]=="BLITZ_INICIAL"],
               key=lambda x: -x[1]["distribuicao_HT2T"]["pct_ht"])
for t, p in blitz[:8]:
    resumo.append(f"- **{t}**: {p['distribuicao_HT2T']['pct_ht']}% no HT (média HT {p['distribuicao_HT2T']['ht_pro_avg']})")

resumo.append("\n## 🔚 Top times ASFIXIA_FINAL (carga no 2T)\n")
asf = sorted([(t,p) for t,p in todos_perfis.items() if p["distribuicao_HT2T"]["categoria"]=="ASFIXIA_FINAL"],
             key=lambda x: x[1]["distribuicao_HT2T"]["pct_ht"])
for t, p in asf[:8]:
    resumo.append(f"- **{t}**: {p['distribuicao_HT2T']['pct_ht']}% no HT")

resumo.append("\n## 📈 TIMES EM REGIME ATIVO (padrão claro nos últimos 3+ jogos)\n")
ativos = [(t,p) for t,p in todos_perfis.items() if "ATIVO" in p["regime_atual"]["status"]]
for t, p in ativos:
    resumo.append(f"- {p['regime_atual']['status']} **{t}**: {p['regime_atual']['obs']}")

resumo.append("\n## 🔴 TIMES EM REGIME QUEBRADO (alta variância recente)\n")
quebr = [(t,p) for t,p in todos_perfis.items() if "QUEBRADO" in p["regime_atual"]["status"]]
for t, p in quebr:
    resumo.append(f"- 🔴 **{t}**: {p['regime_atual']['obs']}")

open(f"{PASTA_OUT}/_resumo_liga.md", "w", encoding='utf-8').write("\n".join(resumo))
print(f"Resumo da liga salvo: {PASTA_OUT}/_resumo_liga.md")
