#!/usr/bin/env python3
"""
ENRIQUECEDOR YAAKEN v1
Integração de vetores de dados para alimentar historico_geral/casa/fora
no escoteiro com: adversário, resultado, placar, cantos, formação, stats táticas.

Fontes:
  - escoteiro_*.json        → V/E/D aggregates + forma_recente (ground truth de resultados)
  - brasileirao2026.js etc  → todos os jogos com cantos + stats_taticas (sem placar)
  - memoria-teacher/*.json  → amostra de jogos com placar + formação + odds

Saída:
  - escoteiro_*_enriched.json  → escoteiro com historico_geral/casa/fora enriquecido
"""

import re, json, os
from pathlib import Path

BASE = Path('/sessions/fervent-inspiring-hypatia/mnt/MEU APP/EDS-Analise-ODDS/EDS-ODDS-TEACHER')
ESCOT_DIR  = BASE / 'escoteiro'
DATA_DIR   = BASE / 'data'
MEM_DIR    = BASE / 'memoria-teacher'
OUT_DIR    = ESCOT_DIR   # overwrite in-place (enrich existing files)

# ─── Liga → JS data file mapping ───────────────────────────────────────────
LEAGUE_JS = {
    'BR':  ('brasileirao2026.js',  None),
    'MLS': ('mls2026.js',          None),
    'ARG': ('argentina2026.js',    None),
    'USL': ('usl2026.js',          None),
    # BUN has no .js cantos file → use only memoria-teacher when available
}

MEMORIA_FILES = {
    'BR':  'memoria-teacher_Brasileirao-Serie-A_2026-04-05.json',
    'MLS': 'memoria-teacher_MLS_2026-04-06.json',
    'ARG': 'memoria-teacher_ARG_2026-04-06.json',
    'USL': 'memoria-teacher_USL_2026-04-08.json',
}


def parse_js(fpath):
    """Parse window.DADOS_XX = {...}; JavaScript file to dict."""
    with open(fpath, encoding='utf-8') as f:
        raw = f.read()
    # Remove leading comments and blank lines
    raw = re.sub(r'^(//[^\n]*\n\s*)*', '', raw)
    # Remove module.exports tail
    raw = re.sub(r'\n\s*if\s*\(typeof\s+module.*', '', raw, flags=re.DOTALL)
    # Strip window.VARNAME =
    raw = re.sub(r'^window\.\w+\s*=\s*', '', raw.strip())
    raw = raw.rstrip(';').strip()
    return json.loads(raw)


def parse_placar(placar_str):
    """Parse '2-1' or '2 - 1' → (gh, ga)."""
    if not placar_str:
        return None, None
    m = re.match(r'(\d+)\s*[-–]\s*(\d+)', str(placar_str))
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None


def normalize(name):
    """Normalize team name for fuzzy matching."""
    return re.sub(r'[^a-z0-9]', '', name.lower())


def match_team(name, perfis_keys):
    """Find best match for name in perfis_keys."""
    norm = normalize(name)
    # Exact first
    for k in perfis_keys:
        if normalize(k) == norm:
            return k
    # Substring
    for k in perfis_keys:
        if norm in normalize(k) or normalize(k) in norm:
            return k
    return None


def build_historico_from_js(liga, perfis, js_jogos):
    """
    Build historico per team using JS games (have cantos/stats but no placar).
    Result inferred from forma_recente by matching ordered game sequence.
    """
    print(f'  [{liga}] Building historico from {len(js_jogos)} JS games...')

    # Group games per team (most recent rodada first)
    team_games = {}  # team_key → [(rodada, jogo, role)]
    for jogo in js_jogos:
        rodada = jogo.get('rodada', 0)
        man = match_team(jogo['mandante'], list(perfis.keys()))
        vis = match_team(jogo['visitante'], list(perfis.keys()))
        if man:
            team_games.setdefault(man, []).append((rodada, jogo, 'mandante'))
        if vis:
            team_games.setdefault(vis, []).append((rodada, jogo, 'visitante'))

    enriched = 0
    for team_key, games in team_games.items():
        p = perfis[team_key]
        # Sort by rodada descending (most recent first)
        games.sort(key=lambda x: x[0], reverse=True)

        forma_geral = p.get('forma_recente', [])  # ordered most recent first
        casa_ctx = p.get('casa', {})
        fora_ctx = p.get('fora', {})

        hist_geral = []
        hist_casa  = []
        hist_fora  = []

        forma_idx_geral = 0
        forma_idx_casa  = 0
        forma_idx_fora  = 0

        for rodada, jogo, role in games:
            if forma_idx_geral >= 5 and forma_idx_casa >= 5 and forma_idx_fora >= 5:
                break

            is_home = (role == 'mandante')
            adversario_raw = jogo['visitante'] if is_home else jogo['mandante']
            adversario = match_team(adversario_raw, list(perfis.keys())) or adversario_raw

            cantos = jogo.get('cantos', {})
            stats  = jogo.get('stats_taticas', {})
            formacao = jogo.get('formacao', {})

            # Cantos do time neste jogo
            side = 'm' if is_home else 'v'
            opp  = 'v' if is_home else 'm'
            cantos_ft_team = cantos.get('ft', {}).get(side, '?')
            cantos_ft_opp  = cantos.get('ft', {}).get(opp, '?')
            cantos_ht_team = cantos.get('ht', {}).get(side, '?')
            posse  = stats.get('posse', {}).get(side, '?')
            finais = stats.get('finalizacoes', {}).get(side, '?')
            form_team = formacao.get('m' if is_home else 'v', '?') if formacao else '?'

            # Infer resultado from forma_recente (geral context)
            res_geral = forma_geral[forma_idx_geral] if forma_idx_geral < len(forma_geral) else '?'

            entry = {
                'adversario': adversario,
                'resultado':  res_geral or '?',
                'gp': '?',   # score not available in JS files
                'gc': '?',
                'mando': 'C' if is_home else 'F',
                'cantos_ft': cantos_ft_team,
                'cantos_ht': cantos_ht_team,
                'cantos_adv_ft': cantos_ft_opp,
                'posse': posse,
                'finalizacoes': finais,
                'formacao': form_team,
                'rodada': rodada,
            }

            if forma_idx_geral < 5:
                hist_geral.append(entry)
                forma_idx_geral += 1

            ctx_entry = {k: v for k, v in entry.items()}
            ctx_entry.pop('mando', None)

            if is_home and forma_idx_casa < 5:
                hist_casa.append(ctx_entry)
                forma_idx_casa += 1
            elif not is_home and forma_idx_fora < 5:
                hist_fora.append(ctx_entry)
                forma_idx_fora += 1

        if hist_geral:
            p['historico_geral'] = hist_geral
            p['historico_casa']  = hist_casa
            p['historico_fora']  = hist_fora
            enriched += 1

    print(f'  [{liga}] Enriched {enriched} teams with historico from JS data')


def enrich_with_memoria(liga, perfis, mem_jogos):
    """
    Enrich historico entries with placar+formação+odds from memoria-teacher.
    Matches on mandante+visitante names.
    """
    print(f'  [{liga}] Enriching with {len(mem_jogos)} memoria-teacher entries...')
    matched = 0
    for jogo in mem_jogos:
        placar = jogo.get('placar', {})
        ft_str = placar.get('ft', '')
        gh, ga = parse_placar(ft_str)
        if gh is None:
            continue

        formacao = jogo.get('formacao', {})
        mercado  = jogo.get('mercado', {})
        man_raw  = jogo.get('mandante', '')
        vis_raw  = jogo.get('visitante', '')

        man_key = match_team(man_raw, list(perfis.keys()))
        vis_key = match_team(vis_raw, list(perfis.keys()))

        resultado_m = 'V' if gh > ga else ('E' if gh == ga else 'D')
        resultado_v = 'V' if ga > gh else ('E' if gh == ga else 'D')

        # Update mandante's history entries for this game
        for team_key, resultado, gp, gc, mando in [
            (man_key, resultado_m, gh, ga, 'C'),
            (vis_key, resultado_v, ga, gh, 'F'),
        ]:
            if not team_key:
                continue
            p = perfis[team_key]
            adversario = vis_key if mando == 'C' else man_key
            form_team = formacao.get('m' if mando == 'C' else 'v', '?')

            # Update any matching '?' entries in historico_geral
            for hist_list in [p.get('historico_geral', []), p.get('historico_casa', []), p.get('historico_fora', [])]:
                for entry in hist_list:
                    adv_norm = normalize(entry.get('adversario', ''))
                    adv_target = normalize(adversario or '')
                    if adv_norm == adv_target or (adversario and adv_norm in normalize(adversario)):
                        if entry.get('gp') == '?':
                            entry['gp'] = gp
                            entry['gc'] = gc
                            entry['resultado'] = resultado
                            if entry.get('formacao') == '?':
                                entry['formacao'] = form_team
                            if mercado.get('oddM'):
                                entry['odds'] = {
                                    'oddM': mercado.get('oddM'),
                                    'oddE': mercado.get('oddEmpate'),
                                    'oddV': mercado.get('oddV'),
                                }
                            matched += 1

    print(f'  [{liga}] Matched {matched} placar entries from memoria-teacher')


def enrich_escoteiro(liga):
    """Main enrichment pipeline for one liga."""
    print(f'\n{"="*60}')
    print(f'  ENRIQUECENDO {liga}')
    print(f'{"="*60}')

    # Load escoteiro
    escot_files = sorted([f for f in os.listdir(ESCOT_DIR) if f.startswith(f'escoteiro_{liga}')])
    if not escot_files:
        print(f'  [SKIP] No escoteiro file for {liga}')
        return
    escot_path = ESCOT_DIR / escot_files[-1]
    with open(escot_path) as f:
        escot = json.load(f)
    perfis = escot.get('perfis', {})
    print(f'  Loaded {len(perfis)} teams from {escot_files[-1]}')

    # Initialize empty historico fields
    for p in perfis.values():
        if 'historico_geral' not in p:
            p['historico_geral'] = []
        if 'historico_casa' not in p:
            p['historico_casa'] = []
        if 'historico_fora' not in p:
            p['historico_fora'] = []

    # Step 1: Enrich from JS cantos/stats data
    if liga in LEAGUE_JS:
        js_fname, _ = LEAGUE_JS[liga]
        js_path = DATA_DIR / js_fname
        if js_path.exists():
            js_data = parse_js(js_path)
            build_historico_from_js(liga, perfis, js_data.get('jogos', []))
        else:
            print(f'  [SKIP] JS data file not found: {js_path}')

    # Step 2: Enrich with placar+formação from memoria-teacher
    if liga in MEMORIA_FILES:
        mem_path = MEM_DIR / MEMORIA_FILES[liga]
        if mem_path.exists():
            with open(mem_path) as f:
                mem = json.load(f)
            mem_jogos = mem.get('pos_jogo', {}).get('jogos', [])
            if mem_jogos:
                enrich_with_memoria(liga, perfis, mem_jogos)
        else:
            print(f'  [SKIP] memoria-teacher not found: {mem_path}')

    # Save enriched escoteiro
    escot['perfis'] = perfis
    escot['_enriched'] = True
    with open(escot_path, 'w', encoding='utf-8') as f:
        json.dump(escot, f, ensure_ascii=False, indent=2)
    print(f'  ✅ Saved enriched escoteiro: {escot_path.name}')

    # Show sample
    sample_team = next(iter(perfis))
    sp = perfis[sample_team]
    print(f'\n  Sample — {sample_team}:')
    for h in sp.get('historico_geral', [])[:3]:
        res_icon = '✅' if h['resultado']=='V' else ('🟡' if h['resultado']=='E' else '❌')
        print(f'    {res_icon} vs {h["adversario"]} | Cantos FT: {h.get("cantos_ft","?")} | Posse: {h.get("posse","?")}%')


# ─── Run all ligas ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    LIGAS = ['BR', 'MLS', 'ARG', 'USL', 'BUN']
    for liga in LIGAS:
        enrich_escoteiro(liga)
    print('\n✅ Enriquecimento concluído!')
