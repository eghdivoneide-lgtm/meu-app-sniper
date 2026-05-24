"""Auditoria BR - palpites do app vs resultados reais (rodada 09-10/05/2026)."""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

p = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\projeto-fantasma\br_rodada_2_2026-05-12.json"
with open(p, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Mapping de nomes (relatorio -> varredor)
def chave(m, v): return f"{m.strip()}|{v.strip()}"
NORM = {
    "Internacional": "Internacional",
    "Vitoria": "Vitória",
    "Vitória": "Vitoria",
    "Sao Paulo": "São Paulo",
    "São Paulo": "Sao Paulo",
    "Chapecoense-SC": "Chapecoense",
    "Chapecoense": "Chapecoense-SC",
    "Bragantino": "Red Bull Bragantino",
    "Red Bull Bragantino": "Bragantino",
    "Atletico-MG": "Atlético-MG",
    "Atlético-MG": "Atletico-MG",
    "Botafogo RJ": "Botafogo",
    "Botafogo": "Botafogo RJ",
    "Flamengo RJ": "Flamengo",
    "Flamengo": "Flamengo RJ",
    "Gremio": "Grêmio",
    "Grêmio": "Gremio",
}
def lookup_real(real_dict, m, v):
    k = chave(m, v)
    if k in real_dict: return real_dict[k]
    # tenta normalizar
    m2 = NORM.get(m, m); v2 = NORM.get(v, v)
    return real_dict.get(chave(m2, v2))

real = {}
for j in data:
    if not j.get('data_partida','').startswith(('09.05','10.05')):
        continue
    cft = j.get('estatisticas_ft',{}).get('cantos',{})
    cht = j.get('estatisticas_ht',{}).get('cantos',{})
    real[chave(j['mandante'], j['visitante'])] = {
        'cm_ft': cft.get('m',0), 'cv_ft': cft.get('v',0),
        'cm_ht': cht.get('m',0), 'cv_ht': cht.get('v',0),
        'placar': j['placar']['ft'],
    }

# Palpites do app extraidos dos 5 HTMLs do BR
# (mand, visit, sniper_ft, sniper_ht, rei, rei_faixa, bp_selo, bp_fav, cn_fav, cn_vant, enigma_status)
palpites = [
    ("Coritiba","Internacional","NEUTRO","OVER 4","Internacional","ABSOLUTO","NUCLEAR","Internacional","Internacional",6.86,None),
    ("Fluminense","Vitória","UNDER 10","UNDER 4","Fluminense","ABSOLUTO","NUCLEAR","Fluminense","Fluminense",4.27,"WATCH"),
    ("Bahia","Cruzeiro","UNDER 10","UNDER 4","Bahia","DOMINANTE","FORTE","Bahia","Bahia",2.08,None),
    ("Atlético-MG","Botafogo","NEUTRO","NEUTRO","Botafogo","MODERADO","MODERADA","Botafogo",None,None,None),
    ("Remo","Palmeiras","OVER 10","NEUTRO","Remo","EQUILIBRADO",None,None,None,None,None),
    ("Corinthians","São Paulo","UNDER 10","UNDER 4","São Paulo","ABSOLUTO","NUCLEAR","São Paulo","São Paulo",3.98,None),
    ("Mirassol","Chapecoense","UNDER 10","UNDER 4","Mirassol","ABSOLUTO","NUCLEAR","Mirassol","Mirassol",3.79,"ATIVO"),
    ("Santos","Red Bull Bragantino","UNDER 10","NEUTRO","Santos","EQUILIBRADO",None,None,None,None,None),
    ("Grêmio","Flamengo","UNDER 10","UNDER 4","Grêmio","MODERADO",None,None,None,None,"WATCH"),
    ("Vasco","Athletico-PR","NEUTRO","OVER 4","Vasco","ABSOLUTO","NUCLEAR","Vasco","Vasco",5.25,"ATIVO"),
]

def aval_sniper(palpite, total, linha):
    if palpite == "NEUTRO": return "NEU"
    if total == linha and linha == int(linha): return "PUSH"
    sinal = "OVER" if palpite.startswith("OVER") else "UNDER"
    if sinal == "OVER" and total > linha: return "OK"
    if sinal == "UNDER" and total < linha: return "OK"
    return "ERR"

def aval_rei(rei, m, v, cm, cv):
    if cm == cv: return "EMP"
    if cm > cv: return "OK" if rei == m else "ERR"
    return "OK" if rei == v else "ERR"

# Loop e print
print(f"{'Jogo':<46}{'C_FT':<10}{'SniperFT':<14}{'SniperHT':<14}{'Rei'}")
print("-"*120)
stats_ft = {'OK':0,'ERR':0,'PUSH':0,'NEU':0}
stats_ht = {'OK':0,'ERR':0,'PUSH':0,'NEU':0}
stats_rei = {'OK':0,'ERR':0,'EMP':0}
stats_rei_abs = {'OK':0,'ERR':0,'EMP':0}  # Reis ABSOLUTO (alta confianca)

for pp in palpites:
    m, v, sft, sht, rei, faixa, bp, bpf, cnf, cnv, enig = pp
    r = lookup_real(real, m, v)
    if not r:
        print(f"  {m} vs {v}: SEM DADO REAL")
        continue
    cm_ft, cv_ft = r['cm_ft'], r['cv_ft']
    cm_ht, cv_ht = r['cm_ht'], r['cv_ht']
    total_ft = cm_ft + cv_ft
    total_ht = cm_ht + cv_ht

    aft = aval_sniper(sft, total_ft, 10)
    aht = aval_sniper(sht, total_ht, 4)
    arei = aval_rei(rei, m, v, cm_ft, cv_ft)

    stats_ft[aft] += 1
    stats_ht[aht] += 1
    stats_rei[arei] += 1
    if faixa == "ABSOLUTO":
        stats_rei_abs[arei] += 1

    jogo = f"{m[:18]:<18} {cm_ft}-{cv_ft} {v[:18]:<18}"
    print(f"  {jogo:<46}{f'{total_ft}':<10}{sft+' '+aft:<14}{sht+' '+aht:<14}{arei} (rei={rei[:14]} {faixa})")

print()
print("="*100)
print("RESUMO POR MERCADO")
print("="*100)
t_ft = stats_ft['OK']+stats_ft['ERR']+stats_ft['PUSH']
t_ht = stats_ht['OK']+stats_ht['ERR']+stats_ht['PUSH']
t_rei = stats_rei['OK']+stats_rei['ERR']+stats_rei['EMP']
t_rei_abs = stats_rei_abs['OK']+stats_rei_abs['ERR']+stats_rei_abs['EMP']
print(f"Sniper FT 10:               OK {stats_ft['OK']:>2} | ERR {stats_ft['ERR']:>2} | PUSH {stats_ft['PUSH']:>2} | NEU {stats_ft['NEU']:>2}  -> {stats_ft['OK']/t_ft*100 if t_ft else 0:.1f}%  (n={t_ft})")
print(f"Sniper HT 4:                OK {stats_ht['OK']:>2} | ERR {stats_ht['ERR']:>2} | PUSH {stats_ht['PUSH']:>2} | NEU {stats_ht['NEU']:>2}  -> {stats_ht['OK']/t_ht*100 if t_ht else 0:.1f}%  (n={t_ht})")
print(f"Rei dos Cantos (todos):     OK {stats_rei['OK']:>2} | ERR {stats_rei['ERR']:>2} | EMP {stats_rei['EMP']:>2}            -> {stats_rei['OK']/t_rei*100:.1f}%  (n={t_rei})")
print(f"Rei dos Cantos (ABSOLUTO):  OK {stats_rei_abs['OK']:>2} | ERR {stats_rei_abs['ERR']:>2} | EMP {stats_rei_abs['EMP']:>2}            -> {stats_rei_abs['OK']/t_rei_abs*100 if t_rei_abs else 0:.1f}%  (n={t_rei_abs})")

# CISNE NEGRO - bate margem? bate direcao?
print()
print("="*100)
print("RADAR CISNE NEGRO (favorito teve vantagem real >= projetada?)")
print("="*100)
cn_ok = cn_err = cn_dir = 0
for pp in palpites:
    m, v, sft, sht, rei, faixa, bp, bpf, cnf, cnv, enig = pp
    if not cnf: continue
    r = lookup_real(real, m, v)
    if not r: continue
    cm_ft, cv_ft = r['cm_ft'], r['cv_ft']
    diff_fav = (cm_ft - cv_ft) if cnf == m else (cv_ft - cm_ft)
    bate_margem = diff_fav >= cnv
    venceu = diff_fav > 0
    if bate_margem: cn_ok += 1
    else: cn_err += 1
    if venceu: cn_dir += 1
    print(f"  {cnf:<22} esp +{cnv:.2f} | real {cm_ft}-{cv_ft} = dif fav {diff_fav:+d}  margem:{'OK' if bate_margem else 'ERR'}  direcao:{'OK' if venceu else 'ERR'}")
print(f"\nCN MARGEM:    {cn_ok}/{cn_ok+cn_err} = {cn_ok/(cn_ok+cn_err)*100:.1f}%")
print(f"CN DIRECAO:   {cn_dir}/{cn_ok+cn_err} = {cn_dir/(cn_ok+cn_err)*100:.1f}%")

# BALA DE PRATA - 1x2 do JOGO
print()
print("="*100)
print("BALA DE PRATA (favorito do JOGO ganhou?)")
print("="*100)
bp_ok = bp_err = bp_emp = 0
for pp in palpites:
    m, v, sft, sht, rei, faixa, bp, bpf, cnf, cnv, enig = pp
    if not bp: continue
    r = lookup_real(real, m, v)
    if not r: continue
    placar = r['placar']
    gm, gv = [int(x) for x in placar.split(' - ')]
    venc = m if gm > gv else (v if gv > gm else "EMPATE")
    if venc == "EMPATE": res = "ERR(emp)"; bp_emp += 1
    elif venc == bpf: res = "OK"; bp_ok += 1
    else: res = f"ERR ({venc} venceu)"; bp_err += 1
    print(f"  [{bp:<10}] {bpf:<22} | {m[:18]} {placar} {v[:18]} -> {res}")
print(f"\nBP: OK {bp_ok} | ERR vit {bp_err} | EMP {bp_emp} -> {bp_ok/(bp_ok+bp_err+bp_emp)*100:.1f}%")

# ENIGMA - linha recomendada (handicap)
print()
print("="*100)
print("ENIGMA (linha FT -X.X mandante: o mandante venceu por X+ gols?)")
print("="*100)
# Mirassol -2.5 -> venceu por 3+? Mirassol 1-1 ❌
# Vasco -2.5 -> Vasco venceu por 3+? Vasco 1-0 ❌
# Gremio (WATCH) -1.0 nao recomendado
# Fluminense (WATCH) -1.0 -> Flu venceu por 2+? Flu 2-2 ❌
enigma_ativos = [
    ("Mirassol","Chapecoense", "Mirassol", 2.5),
    ("Vasco","Athletico-PR", "Vasco", 2.5),
]
for m, v, fav, hdp in enigma_ativos:
    r = lookup_real(real, m, v)
    if not r: continue
    placar = r['placar']
    gm, gv = [int(x) for x in placar.split(' - ')]
    diff = gm - gv if fav == m else gv - gm
    bate = diff > hdp
    print(f"  {fav} -{hdp} | placar {placar} -> diff fav {diff:+d}  {'OK' if bate else 'ERR'}")
PYEOF