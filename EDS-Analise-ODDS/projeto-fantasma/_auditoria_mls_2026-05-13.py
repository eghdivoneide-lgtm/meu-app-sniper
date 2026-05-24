"""Auditoria MLS — palpites do app vs resultados reais (rodada 09-10/05/2026)."""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

p = r"c:\Users\egnal\OneDrive\Área de Trabalho\MEU APP\EDS-Analise-ODDS\projeto-fantasma\mls_rodada_2_2026-05-12.json"
with open(p, 'r', encoding='utf-8') as f:
    data = json.load(f)

def chave(m, v): return f"{m.strip()}|{v.strip()}"

real = {}
for j in data:
    if not j.get('data_partida','').startswith(('09.05','10.05')):
        continue
    k = chave(j['mandante'], j['visitante'])
    cft = j.get('estatisticas_ft', {}).get('cantos', {})
    cht = j.get('estatisticas_ht', {}).get('cantos', {})
    real[k] = {
        'cantos_ft_m': cft.get('m'), 'cantos_ft_v': cft.get('v'),
        'cantos_ht_m': cht.get('m'), 'cantos_ht_v': cht.get('v'),
        'placar_ft': j['placar']['ft'],
    }

# (mand, visit, sniper_ft, sniper_ht, rei_cantos, bp_selo, bp_fav, cn_fav, cn_vantagem)
palpites = [
    ("Toronto FC","Inter Miami","OVER 10","OVER 4","Inter Miami","NUCLEAR","Inter Miami","Inter Miami",3.52),
    ("Chicago Fire","New York Red Bulls","OVER 10","OVER 4","Chicago Fire","FORTE","Chicago Fire",None,None),
    ("CF Montreal","Orlando City","UNDER 10","UNDER 4","Orlando City",None,None,None,None),
    ("Atlanta Utd","Los Angeles Galaxy","UNDER 10","UNDER 4","Los Angeles Galaxy","NUCLEAR","Los Angeles Galaxy","Los Angeles Galaxy",3.14),
    ("Charlotte","FC Cincinnati","UNDER 10","UNDER 4","FC Cincinnati","MODERADA","FC Cincinnati",None,None),
    ("New England Revolution","Philadelphia Union","UNDER 10","UNDER 4","Philadelphia Union","NUCLEAR","Philadelphia Union","Philadelphia Union",5.13),
    ("FC Dallas","Real Salt Lake","OVER 10","OVER 4","FC Dallas",None,None,None,None),
    ("Nashville SC","DC United","UNDER 10","UNDER 4","Nashville SC","NUCLEAR","Nashville SC","Nashville SC",3.71),
    ("Colorado Rapids","St. Louis City","UNDER 10","NEUTRO","St. Louis City","MODERADA","St. Louis City",None,None),
    ("Portland Timbers","Sporting Kansas City","UNDER 10","UNDER 4","Portland Timbers","MODERADA","Portland Timbers",None,None),
    ("San Jose Earthquakes","Vancouver Whitecaps","OVER 10","OVER 4","San Jose Earthquakes",None,None,None,None),
    ("Seattle Sounders","San Diego FC","UNDER 10","UNDER 4","San Diego FC",None,None,None,None),
    ("New York City","Columbus Crew","UNDER 10","OVER 4","Columbus Crew",None,None,None,None),
    ("Minnesota United","Austin FC","OVER 10","OVER 4","Minnesota United","NUCLEAR","Minnesota United","Minnesota United",4.09),
    ("Los Angeles FC","Houston Dynamo","NEUTRO","OVER 4","Houston Dynamo","MODERADA","Houston Dynamo",None,None),
]

def aval_sniper(palpite, total, linha):
    if palpite == "NEUTRO": return "NEU"
    if total == linha: return "PUSH"
    if palpite.startswith("OVER"):
        return "OK" if total > linha else "ERR"
    if palpite.startswith("UNDER"):
        return "OK" if total < linha else "ERR"
    return "?"

def aval_rei(rei, m, v, cm, cv):
    if cm == cv: return "ERR_EMP"
    if cm > cv: return "OK" if rei == m else "ERR"
    return "OK" if rei == v else "ERR"

stats_ft = {'OK':0,'ERR':0,'PUSH':0,'NEU':0}
stats_ht = {'OK':0,'ERR':0,'PUSH':0,'NEU':0}
stats_rei = {'OK':0,'ERR':0,'ERR_EMP':0}

print(f"{'Jogo':<60}{'CantosFT':<14}{'SniperFT':<14}{'SniperHT':<14}{'Rei'}")
print("-"*120)

for pp in palpites:
    m, v, sft, sht, rei, bp, bpf, cnf, cnv = pp
    r = real.get(chave(m, v))
    if not r:
        print(f"{m} vs {v}: SEM DADO REAL")
        continue
    cm, cv = r['cantos_ft_m'] or 0, r['cantos_ft_v'] or 0
    chm, chv = r['cantos_ht_m'] or 0, r['cantos_ht_v'] or 0
    total_ft = cm + cv
    total_ht = chm + chv

    aft = aval_sniper(sft, total_ft, 10)
    aht = aval_sniper(sht, total_ht, 4)
    arei = aval_rei(rei, m, v, cm, cv)

    stats_ft[aft] += 1
    stats_ht[aht] += 1
    stats_rei[arei] += 1

    jogo = f"{m[:22]} {cm}-{cv} {v[:22]}"
    print(f"{jogo:<60}{f'{cm}-{cv}={total_ft}':<14}{sft+' '+aft:<14}{sht+' '+aht:<14}{arei}")

print()
print("="*100)
print("RESUMO POR MERCADO")
print("="*100)
t_ft = stats_ft['OK']+stats_ft['ERR']+stats_ft['PUSH']
t_ht = stats_ht['OK']+stats_ht['ERR']+stats_ht['PUSH']
t_rei = stats_rei['OK']+stats_rei['ERR']+stats_rei['ERR_EMP']

print(f"Sniper FT (Over/Under 10):  OK {stats_ft['OK']:>2} | ERR {stats_ft['ERR']:>2} | PUSH {stats_ft['PUSH']:>2} | NEU {stats_ft['NEU']:>2}  -> {stats_ft['OK']/t_ft*100 if t_ft else 0:.0f}% ({stats_ft['OK']}/{t_ft})")
print(f"Sniper HT (Over/Under 4):   OK {stats_ht['OK']:>2} | ERR {stats_ht['ERR']:>2} | PUSH {stats_ht['PUSH']:>2} | NEU {stats_ht['NEU']:>2}  -> {stats_ht['OK']/t_ht*100 if t_ht else 0:.0f}% ({stats_ht['OK']}/{t_ht})")
print(f"Reis dos Cantos (vencedor): OK {stats_rei['OK']:>2} | ERR {stats_rei['ERR']:>2} | EMP {stats_rei['ERR_EMP']:>2}              -> {stats_rei['OK']/t_rei*100:.0f}% ({stats_rei['OK']}/{t_rei})")

print()
print("="*100)
print("BALA DE PRATA (favorito do JOGO ganhou?)")
print("="*100)
bp_ok = bp_err = bp_emp = 0
for pp in palpites:
    m, v, sft, sht, rei, bp, bpf, cnf, cnv = pp
    if not bp: continue
    r = real.get(chave(m, v))
    if not r: continue
    placar = r['placar_ft']
    gm, gv = [int(x) for x in placar.split(' - ')]
    venc = m if gm > gv else (v if gv > gm else "EMPATE")
    if venc == "EMPATE":
        res = "ERR (empate)"; bp_emp += 1
    elif venc == bpf:
        res = "OK"; bp_ok += 1
    else:
        res = f"ERR ({venc} venceu)"; bp_err += 1
    print(f"  [{bp:<10}] {bpf:<26} | {m[:18]} {placar} {v[:18]} -> {res}")
print(f"\nBP: OK {bp_ok} | ERR vit {bp_err} | EMP {bp_emp} -> {bp_ok/(bp_ok+bp_err+bp_emp)*100:.0f}% ({bp_ok}/{bp_ok+bp_err+bp_emp})")

print()
print("="*100)
print("RADAR CISNE NEGRO (favorito teve vantagem real >= projetada?)")
print("="*100)
cn_ok = cn_err = cn_dir = 0
for pp in palpites:
    m, v, sft, sht, rei, bp, bpf, cnf, cnv = pp
    if not cnf: continue
    r = real.get(chave(m, v))
    if not r: continue
    cm, cv = r['cantos_ft_m'] or 0, r['cantos_ft_v'] or 0
    diff = (cm - cv) if cnf == m else (cv - cm)
    bate = diff >= cnv
    direcao = diff > 0
    if bate: cn_ok += 1
    else: cn_err += 1
    if direcao: cn_dir += 1
    print(f"  {cnf:<26} esperado: +{cnv:.2f} | real: {cm}-{cv} -> dif fav: {diff:+.0f}  {'OK' if bate else 'ERR'}  dir:{'OK' if direcao else 'ERR'}")
print(f"\nCisne Negro: OK {cn_ok} | ERR {cn_err} -> {cn_ok/(cn_ok+cn_err)*100:.0f}% ({cn_ok}/{cn_ok+cn_err})")
print(f"Direcao (favorito venceu cantos): {cn_dir}/{cn_ok+cn_err} = {cn_dir/(cn_ok+cn_err)*100:.0f}%")

print()
print("="*100)
print("SNIPER FT POR SELO BP")
print("="*100)
selos = {}
for pp in palpites:
    m, v, sft, sht, rei, bp, bpf, cnf, cnv = pp
    if not bp: continue
    r = real.get(chave(m, v))
    if not r: continue
    total = (r['cantos_ft_m'] or 0) + (r['cantos_ft_v'] or 0)
    ok = aval_sniper(sft, total, 10)
    selos.setdefault(bp, {'OK':0,'ERR':0,'PUSH':0,'NEU':0})
    selos[bp][ok] += 1
for selo, s in selos.items():
    tot = s['OK']+s['ERR']+s['PUSH']
    if tot:
        print(f"  [{selo:<10}] OK {s['OK']} | ERR {s['ERR']} | PUSH {s['PUSH']} | NEU {s['NEU']} -> {s['OK']/tot*100:.0f}%")
