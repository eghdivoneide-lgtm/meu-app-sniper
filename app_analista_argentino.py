import logging
import csv
import difflib
import json
import os
import re
import time
import unicodedata
import zipfile
from datetime import datetime
from html import unescape
from pathlib import Path

import telebot
from google import genai
from google.genai import types

# ---------------------------------------------------------------------------
# Configuracao
# ---------------------------------------------------------------------------
CHAVE_TELEGRAM = os.getenv("TELEGRAM_TOKEN_ANALISTA")
CHAVE_GEMINI = os.getenv("GEMINI_API_KEY_ANALISTA")

if not CHAVE_TELEGRAM:
    raise RuntimeError("Defina a variavel de ambiente TELEGRAM_TOKEN_ANALISTA.")

if not CHAVE_GEMINI:
    raise RuntimeError("Defina a variavel de ambiente GEMINI_API_KEY_ANALISTA.")

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler("analista_argentino_log.txt", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Rate limit basico
# ---------------------------------------------------------------------------
LIMITE_MSG_POR_MINUTO = 20
historico_rate = {}


def verificar_rate_limit(chat_id: int) -> bool:
    agora = time.time()
    historico_rate.setdefault(chat_id, [])
    historico_rate[chat_id] = [t for t in historico_rate[chat_id] if agora - t < 60]
    if len(historico_rate[chat_id]) >= LIMITE_MSG_POR_MINUTO:
        return False
    historico_rate[chat_id].append(agora)
    return True


# ---------------------------------------------------------------------------
# Bot e cliente Gemini
# ---------------------------------------------------------------------------
bot = telebot.TeleBot(CHAVE_TELEGRAM)
cliente_gemini = genai.Client(api_key=CHAVE_GEMINI)
memoria_analista = {}
ARQUIVO_DESEMPENHO = "sniper_desempenho.json"
DADOS_SNIPER_DIR = Path("dados_sniper")
PASTA_TEMPLATE_GERAL = DADOS_SNIPER_DIR / "_TEMPLATE_GERAL"
PASTA_CALENDARIO_MULTI = PASTA_TEMPLATE_GERAL / "Jogos_da_proxima_rodada"
ARQUIVO_SAIDA_TOP10 = PASTA_TEMPLATE_GERAL / "saida_top10_sniper.csv"
ARQUIVO_H2H_MULTI = PASTA_TEMPLATE_GERAL / "confrontos_diretos_h2h.csv"

ALIASES_LIGAS = {
    "liga profesional abertura": "argentina_lpf",
    "liga profesional argentina": "argentina_lpf",
    "liga profesional": "argentina_lpf",
    "argetina liga professional": "argentina_lpf",
    "argentina liga professional": "argentina_lpf",
    "argentina lpf": "argentina_lpf",
    "primera b nacional": "argentina_serie_b",
    "primera nacional": "argentina_serie_b",
    "argentina serie b": "argentina_serie_b",
    "brasileirao serie a": "brasil_serie_a",
    "brasil serie a": "brasil_serie_a",
    "brasileirao serie b": "brasil_serie_b",
    "brasil serie b": "brasil_serie_b",
    "ligapro": "equador_ligapro",
    "liga pro": "equador_ligapro",
    "liga pro equador": "equador_ligapro",
    "ligapro equador": "equador_ligapro",
    "mls": "mls",
    "usl": "usl",
    "usl championship": "usl",
}

ALIASES_TIMES = {
    "newells old boys": "newell s old boys",
    "newell s old boys": "newell s old boys",
    "ind rivadavia": "ind rivadavia",
    "independiente rivadavia": "ind rivadavia",
    "atl tucuman": "atl tucuman",
    "atletico tucuman": "atl tucuman",
    "tecnico u": "tecnico u",
    "tecnico universitario": "tecnico u",
    "dep cuenca": "dep cuenca",
    "deportivo cuenca": "dep cuenca",
    "central cordoba": "central cordoba",
    "est rio cuarto": "estudiantes rio cuarto",
    "estudiantes rio cuarto": "estudiantes rio cuarto",
    "club a guemes": "club a guemes",
    "guemes": "club a guemes",
}


def _agora_iso() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def carregar_historico_apostas() -> dict:
    try:
        with open(ARQUIVO_DESEMPENHO, encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict) and "apostas" in data and "last_id" in data:
            return data
    except Exception:
        pass
    return {"last_id": 0, "apostas": []}


def salvar_historico_apostas(data: dict) -> None:
    with open(ARQUIVO_DESEMPENHO, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


historico_apostas = carregar_historico_apostas()


def registrar_aposta(chat_id: int, analise_json: dict) -> int | None:
    rec = analise_json.get("recomendada")
    if not rec:
        return None

    historico_apostas["last_id"] += 1
    aposta_id = historico_apostas["last_id"]
    historico_apostas["apostas"].append(
        {
            "id": aposta_id,
            "chat_id": chat_id,
            "jogo": analise_json.get("jogo"),
            "mercado": rec.get("mercado"),
            "odd": rec.get("odd"),
            "prob_est": rec.get("prob_est"),
            "confianca": analise_json.get("nivel_confianca"),
            "status": "pendente",
            "placar": None,
            "acerto": None,
            "lucro_u": 0.0,
            "criado_em": _agora_iso(),
            "liquidado_em": None,
        }
    )
    salvar_historico_apostas(historico_apostas)
    return aposta_id


def _mercado_bateu(mercado: str, gols_mandante: int, gols_visitante: int) -> bool:
    total = gols_mandante + gols_visitante
    if mercado == "Empate":
        return gols_mandante == gols_visitante
    if mercado == "Vitoria Mandante":
        return gols_mandante > gols_visitante
    if mercado == "Vitoria Visitante":
        return gols_visitante > gols_mandante
    if mercado == "Over 2.5":
        return total > 2
    if mercado == "Under 2.5":
        return total < 3
    return False


def extrair_placar_resultado(texto: str):
    m = re.search(r"(\d+)\s*[-xX]\s*(\d+)", texto)
    if not m:
        return None
    return int(m.group(1)), int(m.group(2))


def extrair_id_resultado(texto: str):
    m = re.search(r"(?:id|aposta)\s*[:=#]?\s*(\d+)", texto, flags=re.IGNORECASE)
    if m:
        return int(m.group(1))
    m2 = re.search(r"#(\d+)", texto)
    if m2:
        return int(m2.group(1))
    return None


def buscar_aposta_pendente(chat_id: int, aposta_id: int | None):
    if aposta_id is not None:
        for a in historico_apostas["apostas"]:
            if a["id"] == aposta_id and a["chat_id"] == chat_id:
                return a
        return None

    pendentes = [a for a in historico_apostas["apostas"] if a["chat_id"] == chat_id and a["status"] == "pendente"]
    return pendentes[-1] if pendentes else None


def liquidar_aposta(aposta: dict, gols_mandante: int, gols_visitante: int) -> dict:
    acerto = _mercado_bateu(aposta["mercado"], gols_mandante, gols_visitante)
    odd = float(aposta.get("odd") or 0)
    lucro = (odd - 1.0) if acerto else -1.0

    aposta["status"] = "liquidada"
    aposta["placar"] = f"{gols_mandante}-{gols_visitante}"
    aposta["acerto"] = acerto
    aposta["lucro_u"] = round(lucro, 2)
    aposta["liquidado_em"] = _agora_iso()
    salvar_historico_apostas(historico_apostas)
    return aposta


def _resumo_stats(apostas: list[dict]) -> dict:
    liquidadas = [a for a in apostas if a.get("status") == "liquidada"]
    total = len(liquidadas)
    acertos = sum(1 for a in liquidadas if a.get("acerto"))
    lucro = sum(float(a.get("lucro_u") or 0.0) for a in liquidadas)
    roi = (lucro / total * 100.0) if total else 0.0
    hit = (acertos / total * 100.0) if total else 0.0
    return {
        "total": total,
        "acertos": acertos,
        "erros": total - acertos,
        "hit_rate": hit,
        "lucro_u": lucro,
        "roi": roi,
    }


def _stats_por_mercado(apostas: list[dict]) -> list[tuple[str, dict]]:
    grupos = {}
    for a in apostas:
        if a.get("status") != "liquidada":
            continue
        grupos.setdefault(a.get("mercado", "N/A"), []).append(a)
    saida = []
    for mercado, arr in grupos.items():
        saida.append((mercado, _resumo_stats(arr)))
    return sorted(saida, key=lambda x: x[0])


def ler_csv_com_fallback(caminho: Path) -> list[dict]:
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin1"):
        try:
            with open(caminho, encoding=encoding, newline="") as arquivo:
                return list(csv.DictReader(arquivo))
        except UnicodeDecodeError:
            continue
    with open(caminho, encoding="latin1", newline="") as arquivo:
        return list(csv.DictReader(arquivo))


def detectar_liga_do_csv(caminho: Path) -> str | None:
    nome = normalizar_texto(str(caminho))
    for alias, liga in ALIASES_LIGAS.items():
        if alias in nome:
            return liga
    return None


def carregar_historicos_multi_ligas() -> dict[str, list[dict]]:
    historicos = {}
    if not DADOS_SNIPER_DIR.exists():
        return historicos

    for caminho in DADOS_SNIPER_DIR.rglob("*.csv"):
        if "_TEMPLATE_GERAL" in str(caminho):
            continue
        liga = detectar_liga_do_csv(caminho)
        if not liga:
            continue
        linhas = ler_csv_com_fallback(caminho)
        normalizadas = []
        for linha in linhas:
            mandante = limpar_nome_time(linha.get("Mandante", ""))
            visitante = limpar_nome_time(linha.get("Visitante", ""))
            normalizadas.append(
                {
                    "rodada": (linha.get("Rodada") or "").strip(),
                    "data": (linha.get("Data") or "").strip(),
                    "mandante": mandante,
                    "visitante": visitante,
                    "mandante_norm": normalizar_time_chave(mandante),
                    "visitante_norm": normalizar_time_chave(visitante),
                    "gols_mandante": int(float((linha.get("Gols_Mandante") or 0))),
                    "gols_visitante": int(float((linha.get("Gols_Visitante") or 0))),
                    "odd_1": _odd_para_float(linha.get("Odd_1", "")),
                    "odd_x": _odd_para_float(linha.get("Odd_X", "")),
                    "odd_2": _odd_para_float(linha.get("Odd_2", "")),
                    "vencedor": (linha.get("Vencedor") or "").strip(),
                }
            )
        historicos[liga] = normalizadas
    return historicos


def obter_calendario_multi() -> tuple[Path | None, list[dict]]:
    if not PASTA_CALENDARIO_MULTI.exists():
        return None, []
    arquivos = sorted(PASTA_CALENDARIO_MULTI.glob("*.csv"))
    if not arquivos:
        return None, []
    arquivo = arquivos[0]
    linhas = ler_csv_com_fallback(arquivo)
    for pos, linha in enumerate(linhas, start=1):
        linha.setdefault("jogo_id", f"J{pos:03d}")
    return arquivo, linhas


def carregar_h2h_multi() -> list[dict]:
    if not ARQUIVO_H2H_MULTI.exists():
        return []

    linhas = ler_csv_com_fallback(ARQUIVO_H2H_MULTI)
    h2h = []
    for linha in linhas:
        mandante = limpar_nome_time(linha.get("mandante", ""))
        visitante = limpar_nome_time(linha.get("visitante", ""))
        if not mandante or not visitante:
            continue
        data = str(linha.get("data", "")).strip()
        h2h.append(
            {
                "jogo_id": str(linha.get("jogo_id", "")).strip(),
                "data": data,
                "ordem": int(re.search(r"\d{4}", data).group(0)) if re.search(r"\d{4}", data) else 0,
                "mandante": mandante,
                "visitante": visitante,
                "mandante_norm": normalizar_time_chave(mandante),
                "visitante_norm": normalizar_time_chave(visitante),
                "gols_mandante": int(float(linha.get("gols_mandante") or 0)),
                "gols_visitante": int(float(linha.get("gols_visitante") or 0)),
                "observacoes": str(linha.get("observacoes", "")).strip(),
            }
        )
    return h2h


def resumir_h2h_para_jogo(jogo: dict, h2h_rows: list[dict]) -> dict:
    mandante = limpar_nome_time(jogo.get("Mandante", ""))
    visitante = limpar_nome_time(jogo.get("Visitante", ""))
    mandante_norm = normalizar_time_chave(mandante)
    visitante_norm = normalizar_time_chave(visitante)
    jogo_id = str(jogo.get("jogo_id", "")).strip()

    confrontos = [r for r in h2h_rows if jogo_id and r.get("jogo_id") == jogo_id]
    if not confrontos:
        confrontos = [
            r
            for r in h2h_rows
            if {r.get("mandante_norm"), r.get("visitante_norm")} == {mandante_norm, visitante_norm}
        ]

    confrontos = sorted(confrontos, key=lambda x: x.get("ordem", 0), reverse=True)[:5]
    total = len(confrontos)
    if not total:
        return {
            "n": 0,
            "home_v": 0,
            "empates": 0,
            "away_v": 0,
            "bonus_home": 0.0,
            "bonus_away": 0.0,
            "resumo": "sem H2H disponivel",
        }

    home_v = 0
    empates = 0
    away_v = 0
    for item in confrontos:
        if item["mandante_norm"] == mandante_norm:
            gp = item["gols_mandante"]
            gc = item["gols_visitante"]
        else:
            gp = item["gols_visitante"]
            gc = item["gols_mandante"]

        if gp > gc:
            home_v += 1
        elif gp == gc:
            empates += 1
        else:
            away_v += 1

    base_bonus = ((home_v - away_v) / total) * 8.0
    if total < 3:
        base_bonus *= 0.5

    return {
        "n": total,
        "home_v": home_v,
        "empates": empates,
        "away_v": away_v,
        "bonus_home": round(base_bonus, 2),
        "bonus_away": round(-base_bonus, 2),
        "resumo": f"H2H ultimos {total}: {home_v}V mandante atual | {empates}E | {away_v}V visitante atual",
    }


def resolver_liga_calendario(campeonato: str) -> str | None:
    chave = normalizar_liga_chave(campeonato)
    return chave if chave in set(ALIASES_LIGAS.values()) else None


def _pontuacao_forma(resultados: list[str]) -> float:
    pontos = 0
    for resultado in resultados:
        if resultado == "V":
            pontos += 3
        elif resultado == "E":
            pontos += 1
    jogos = len(resultados)
    return (pontos / (jogos * 3) * 100.0) if jogos else 0.0


def _normalizar_gd(gd_por_jogo: float) -> float:
    return max(0.0, min(100.0, 50.0 + gd_por_jogo * 25.0))


def calcular_metricas_multi_time(time_nome: str, jogos: list[dict], contexto: str) -> dict:
    time_norm = normalizar_time_chave(time_nome)
    geral = []
    recorte = []

    for jogo in jogos:
        if jogo["mandante_norm"] == time_norm:
            gp = jogo["gols_mandante"]
            gc = jogo["gols_visitante"]
            resultado = _resultado_time(gp, gc)
            geral.append((resultado, gp, gc, jogo["data"]))
            if contexto == "casa":
                recorte.append((resultado, gp, gc, jogo["data"]))
        elif jogo["visitante_norm"] == time_norm:
            gp = jogo["gols_visitante"]
            gc = jogo["gols_mandante"]
            resultado = _resultado_time(gp, gc)
            geral.append((resultado, gp, gc, jogo["data"]))
            if contexto == "fora":
                recorte.append((resultado, gp, gc, jogo["data"]))

    ult_geral = geral[-5:]
    ult_recorte = recorte[-5:]
    resultados_geral = [r[0] for r in ult_geral]
    resultados_recorte = [r[0] for r in ult_recorte]
    gp = [r[1] for r in ult_recorte]
    gc = [r[2] for r in ult_recorte]
    total = len(ult_recorte)
    vitorias = resultados_recorte.count("V")
    empates = resultados_recorte.count("E")
    derrotas = resultados_recorte.count("D")
    return {
        "forma_geral": "".join(resultados_geral) if resultados_geral else "-",
        "n_recorte": total,
        "v": vitorias,
        "e": empates,
        "d": derrotas,
        "win_pct": _pct(vitorias, total),
        "loss_pct": _pct(derrotas, total),
        "ppg_forma": _pontuacao_forma(resultados_geral),
        "ppg_recorte": _pontuacao_forma(resultados_recorte),
        "media_gp": _media(gp),
        "media_gc": _media(gc),
        "gd_pg": _media([a - b for a, b in zip(gp, gc)]),
        "datas": [r[3] for r in ult_recorte],
    }


def calcular_score_sniper(jogo: dict, historico_liga: list[dict], h2h_rows: list[dict]) -> dict | None:
    mandante = limpar_nome_time(jogo.get("Mandante", ""))
    visitante = limpar_nome_time(jogo.get("Visitante", ""))
    if not mandante or not visitante:
        return None

    home = calcular_metricas_multi_time(mandante, historico_liga, "casa")
    away = calcular_metricas_multi_time(visitante, historico_liga, "fora")
    away_as_candidate = calcular_metricas_multi_time(visitante, historico_liga, "fora")
    home_as_opponent = calcular_metricas_multi_time(mandante, historico_liga, "casa")

    home_score = (
        home["win_pct"] * 0.35
        + home["ppg_forma"] * 0.20
        + away["loss_pct"] * 0.20
        + _normalizar_gd(home["gd_pg"]) * 0.15
        + (100.0 - away["ppg_recorte"]) * 0.10
    )
    away_score = (
        away_as_candidate["win_pct"] * 0.35
        + away_as_candidate["ppg_forma"] * 0.20
        + home_as_opponent["loss_pct"] * 0.20
        + _normalizar_gd(away_as_candidate["gd_pg"]) * 0.15
        + (100.0 - home_as_opponent["ppg_recorte"]) * 0.10
    )

    amostra_min = min(home["n_recorte"], away["n_recorte"])
    fator_amostra = 0.85 + 0.15 * min(amostra_min, 5) / 5.0
    home_score *= fator_amostra
    away_score *= fator_amostra

    resumo_h2h = resumir_h2h_para_jogo(jogo, h2h_rows)
    home_score += resumo_h2h["bonus_home"]
    away_score += resumo_h2h["bonus_away"]

    mandante_odd = _odd_para_float(jogo.get("Odd_1", ""))
    visitante_odd = _odd_para_float(jogo.get("Odd_2", ""))

    if home_score >= away_score:
        return {
            "jogo": f"{mandante} vs {visitante}",
            "time_recomendado": mandante,
            "indice_confianca": round(home_score, 2),
            "liga": jogo.get("Campeonato", ""),
            "data": jogo.get("Data", ""),
            "horario": jogo.get("Horario", ""),
            "jogo_id": jogo.get("jogo_id", ""),
            "odd_referencia": mandante_odd,
            "h2h_n": resumo_h2h["n"],
            "h2h_resumo": resumo_h2h["resumo"],
            "justificativa_curta": (
                f"Casa {home['v']}/{home['e']}/{home['d']} | forma {home['forma_geral']} | "
                f"visitante fora perde {away['loss_pct']:.1f}% | {resumo_h2h['resumo']}"
            ),
        }
    return {
        "jogo": f"{mandante} vs {visitante}",
        "time_recomendado": visitante,
        "indice_confianca": round(away_score, 2),
        "liga": jogo.get("Campeonato", ""),
        "data": jogo.get("Data", ""),
        "horario": jogo.get("Horario", ""),
        "jogo_id": jogo.get("jogo_id", ""),
        "odd_referencia": visitante_odd,
        "h2h_n": resumo_h2h["n"],
        "h2h_resumo": resumo_h2h["resumo"],
        "justificativa_curta": (
            f"Fora {away_as_candidate['v']}/{away_as_candidate['e']}/{away_as_candidate['d']} | "
            f"forma {away_as_candidate['forma_geral']} | mandante casa perde {home_as_opponent['loss_pct']:.1f}% | {resumo_h2h['resumo']}"
        ),
    }


def gerar_top10_sniper_multi() -> tuple[list[dict], str | None]:
    historicos = carregar_historicos_multi_ligas()
    h2h_rows = carregar_h2h_multi()
    arquivo_calendario, jogos = obter_calendario_multi()
    if not arquivo_calendario or not jogos:
        return [], None

    ranking = []
    for jogo in jogos:
        liga = resolver_liga_calendario(jogo.get("Campeonato", ""))
        if not liga or liga not in historicos:
            continue
        pick = calcular_score_sniper(jogo, historicos[liga], h2h_rows)
        if pick:
            ranking.append(pick)

    ranking.sort(key=lambda item: item["indice_confianca"], reverse=True)
    top10 = ranking[:10]

    if top10:
        with open(ARQUIVO_SAIDA_TOP10, "w", encoding="utf-8", newline="") as arquivo:
            writer = csv.writer(arquivo)
            writer.writerow(["ranking", "jogo_id", "jogo", "liga", "data", "horario", "time_recomendado", "indice_confianca", "odd_referencia", "h2h_n", "h2h_resumo", "justificativa_curta"])
            for pos, item in enumerate(top10, start=1):
                writer.writerow([
                    pos,
                    item.get("jogo_id", ""),
                    item["jogo"],
                    item["liga"],
                    item["data"],
                    item["horario"],
                    item["time_recomendado"],
                    item["indice_confianca"],
                    item["odd_referencia"] if item["odd_referencia"] is not None else "",
                    item.get("h2h_n", 0),
                    item.get("h2h_resumo", ""),
                    item["justificativa_curta"],
                ])

    return top10, arquivo_calendario.name


def carregar_base_historica_docx(caminho_docx: str) -> str:
    """Carrega a base historica do DOCX e retorna texto bruto limpo."""
    try:
        with zipfile.ZipFile(caminho_docx, "r") as docx_zip:
            xml = docx_zip.read("word/document.xml").decode("utf-8", errors="ignore")

        texto = re.sub(r"<w:p[^>]*>", "\n", xml)
        texto = re.sub(r"<w:tr[^>]*>", "\n", texto)
        texto = re.sub(r"<[^>]+>", "", texto)
        texto = unescape(texto)
        texto = texto.replace("\r", "")
        texto = re.sub(r"\n{3,}", "\n\n", texto)
        return texto.strip()
    except Exception as erro:
        log.warning("Nao foi possivel ler DOCX %s: %s", caminho_docx, type(erro).__name__)
        return ""


def extrair_linhas_de_jogos(texto: str) -> str:
    """Extrai jogos do texto, reunindo linhas fragmentadas (data em uma linha, pipe em outra)."""
    resultado = []
    acumulado = ""
    for linha in texto.split("\n"):
        linha_strip = linha.strip()
        if not linha_strip:
            continue
        if re.match(r"^\d{2}\.\d{2}\b", linha_strip):
            # Comeca novo registro de jogo
            if acumulado and "|" in acumulado:
                resultado.append(re.sub(r"\s{2,}", " ", acumulado).strip())
            acumulado = linha_strip
        elif acumulado:
            # Continua o registro de jogo atual
            acumulado += " " + linha_strip
            if "|" in acumulado:
                resultado.append(re.sub(r"\s{2,}", " ", acumulado).strip())
                acumulado = ""
    # Ultimo registro
    if acumulado and "|" in acumulado:
        resultado.append(re.sub(r"\s{2,}", " ", acumulado).strip())
    return "\n".join(resultado)


ARQUIVO_BASE_HISTORICA = "prompt_analista_argentino_2026.docx"
ARQUIVO_BASE_COPY = "prompt_analista_argentino_2026_copy.docx"
ARQUIVO_CACHE_TXT = "base_historica_cache.txt"


def carregar_base_com_cache() -> str:
    """Carrega a base historica priorizando cache txt, depois copy e por fim o DOCX original."""
    import os
    # 1) Tentar carregar do cache txt (evita abrir DOCX)
    if os.path.exists(ARQUIVO_CACHE_TXT):
        try:
            with open(ARQUIVO_CACHE_TXT, encoding="utf-8") as f:
                conteudo = f.read().strip()
            if conteudo and len(conteudo) > 500:
                log.info("Base historica carregada do cache txt.")
                return conteudo
        except Exception:
            pass

    # 2) Tentar a copia do DOCX
    for arquivo in [ARQUIVO_BASE_COPY, ARQUIVO_BASE_HISTORICA]:
        if os.path.exists(arquivo):
            texto_bruto = carregar_base_historica_docx(arquivo)
            conteudo = extrair_linhas_de_jogos(texto_bruto) if texto_bruto else ""
            if len(conteudo) > 500:
                # Salvar cache para proximas inicializacoes
                try:
                    with open(ARQUIVO_CACHE_TXT, "w", encoding="utf-8") as f:
                        f.write(conteudo)
                    log.info("Cache txt criado a partir de: %s", arquivo)
                except Exception:
                    pass
                return conteudo

    log.error("Nao foi possivel carregar a base historica por nenhuma fonte.")
    return ""


BASE_HISTORICA_INTERNA = carregar_base_com_cache()


def reparar_texto_quebrado(texto: str) -> str:
    if not isinstance(texto, str):
        return ""
    texto = texto.strip()
    if not texto:
        return ""
    if any(marcador in texto for marcador in ("Ã", "Â", "â", "Õ", "Ð")):
        try:
            corrigido = texto.encode("latin1", errors="ignore").decode("utf-8", errors="ignore")
            if corrigido:
                return corrigido.strip()
        except Exception:
            pass
    return texto


def normalizar_texto(texto: str) -> str:
    texto = reparar_texto_quebrado(texto)
    sem_acentos = unicodedata.normalize("NFKD", texto)
    sem_acentos = sem_acentos.encode("ascii", "ignore").decode("ascii")
    sem_acentos = re.sub(r"[^a-zA-Z0-9 ]+", " ", sem_acentos.lower())
    return re.sub(r"\s+", " ", sem_acentos).strip()


def limpar_nome_time(nome: str) -> str:
    nome = reparar_texto_quebrado(nome)
    return re.sub(r"\s+", " ", nome.replace("\n", " ")).strip(" -|\t")


def normalizar_liga_chave(texto: str) -> str:
    chave = normalizar_texto(texto)
    return ALIASES_LIGAS.get(chave, chave)


def normalizar_time_chave(texto: str) -> str:
    chave = normalizar_texto(texto)
    return ALIASES_TIMES.get(chave, chave)


def construir_indice_times(base_texto: str) -> dict:
    indice = {}
    # Tolerante: aceita qualquer separador entre os numeros do placar
    padrao_jogo = re.compile(
        r"\d{2}\.\d{2}\s+(.+?)\s+\d+\s*[^\w\s]\s*\d+\s+(.+?)\s*\|",
        re.IGNORECASE,
    )

    for mandante_raw, visitante_raw in padrao_jogo.findall(base_texto):
        mandante = limpar_nome_time(mandante_raw)
        visitante = limpar_nome_time(visitante_raw)

        if len(mandante) >= 3:
            indice[normalizar_time_chave(mandante)] = mandante
        if len(visitante) >= 3:
            indice[normalizar_time_chave(visitante)] = visitante

    return indice


def extrair_jogo_da_mensagem(texto: str):
    padroes = [
        r"(?is)jogo\s*:\s*(.+?)\s*(?:vs|x|versus)\s*(.+?)(?:\n|$)",
        r"(?is)^\s*(.+?)\s*(?:vs|x|versus)\s*(.+?)(?:\n|$)",
    ]
    for padrao in padroes:
        match = re.search(padrao, texto)
        if match:
            mandante = limpar_nome_time(match.group(1))
            visitante = limpar_nome_time(match.group(2))
            if mandante and visitante:
                return mandante, visitante
    return None


INDICE_TIMES_BASE = construir_indice_times(BASE_HISTORICA_INTERNA)
LISTA_TIMES_BASE = sorted(set(INDICE_TIMES_BASE.values()))


def extrair_jogos_estruturados(base_texto: str) -> list[dict]:
    jogos = []
    padrao = re.compile(
        r"^\s*(\d{2}\.\d{2})\s+(.+?)\s+(\d+)\s*[^\w\s]\s*(\d+)\s+(.+?)\s*\|\s*(.+)$"
    )
    for linha in base_texto.splitlines():
        m = padrao.match(linha.strip())
        if not m:
            continue
        data, mandante, g_m, g_v, visitante, odds_raw = m.groups()
        jogos.append(
            {
                "data": data,
                "mandante": limpar_nome_time(mandante),
                "visitante": limpar_nome_time(visitante),
                "mandante_norm": normalizar_time_chave(limpar_nome_time(mandante)),
                "visitante_norm": normalizar_time_chave(limpar_nome_time(visitante)),
                "gols_mandante": int(g_m),
                "gols_visitante": int(g_v),
                "odds_raw": odds_raw.strip(),
            }
        )
    return jogos


JOGOS_BASE = extrair_jogos_estruturados(BASE_HISTORICA_INTERNA)


def _resultado_time(gols_pro: int, gols_contra: int) -> str:
    if gols_pro > gols_contra:
        return "V"
    if gols_pro == gols_contra:
        return "E"
    return "D"


def _media(valores: list[int]) -> float:
    return (sum(valores) / len(valores)) if valores else 0.0


def _pct(qtd: int, total: int) -> float:
    return (qtd * 100.0 / total) if total else 0.0


def calcular_metricas_time(time_base: str, jogos: list[dict], modo: str) -> dict:
    """modo=mandante para jogos em casa; modo=visitante para jogos fora."""
    recorte = []
    forma_geral = []
    time_norm = normalizar_time_chave(time_base)

    for j in jogos:
        if j.get("mandante_norm") == time_norm:
            forma_geral.append(_resultado_time(j["gols_mandante"], j["gols_visitante"]))
            if modo == "mandante":
                recorte.append((j, j["gols_mandante"], j["gols_visitante"]))
        elif j.get("visitante_norm") == time_norm:
            forma_geral.append(_resultado_time(j["gols_visitante"], j["gols_mandante"]))
            if modo == "visitante":
                recorte.append((j, j["gols_visitante"], j["gols_mandante"]))

    ultimos_5_geral = forma_geral[-5:]
    ultimos_5_recorte = recorte[-5:]

    vitorias = 0
    empates = 0
    derrotas = 0
    gols_pro = []
    gols_contra = []
    over25 = 0
    under25 = 0
    amostra_datas = []

    for j, gp, gc in ultimos_5_recorte:
        amostra_datas.append(j["data"])
        gols_pro.append(gp)
        gols_contra.append(gc)
        r = _resultado_time(gp, gc)
        if r == "V":
            vitorias += 1
        elif r == "E":
            empates += 1
        else:
            derrotas += 1
        if gp + gc > 2.5:
            over25 += 1
        else:
            under25 += 1

    total = len(ultimos_5_recorte)
    return {
        "forma_geral": "".join(ultimos_5_geral) if ultimos_5_geral else "-",
        "total_recorte": total,
        "v": vitorias,
        "e": empates,
        "d": derrotas,
        "media_gp": _media(gols_pro),
        "media_gc": _media(gols_contra),
        "media_total": _media([a + b for a, b in zip(gols_pro, gols_contra)]),
        "over25": over25,
        "under25": under25,
        "pct_over25": _pct(over25, total),
        "pct_under25": _pct(under25, total),
        "datas": amostra_datas,
    }


def montar_contexto_estatistico(mandante: str, visitante: str, bloco_jogo: str) -> str:
    m_home = calcular_metricas_time(mandante, JOGOS_BASE, "mandante")
    v_away = calcular_metricas_time(visitante, JOGOS_BASE, "visitante")

    return (
        "ESTATISTICAS_PRE_CALCULADAS (NAO ALTERAR):\n"
        f"JOGO: {mandante} vs {visitante}\n"
        f"MANDANTE_FORMA_GERAL_ULT5={m_home['forma_geral']}\n"
        f"MANDANTE_RECORTE_CASA_ULT5_VED={m_home['v']}/{m_home['e']}/{m_home['d']}\n"
        f"MANDANTE_MEDIA_GOLS_MARCADOS={m_home['media_gp']:.2f}\n"
        f"MANDANTE_MEDIA_GOLS_SOFRIDOS={m_home['media_gc']:.2f}\n"
        f"MANDANTE_MEDIA_GOLS_TOTAIS={m_home['media_total']:.2f}\n"
        f"MANDANTE_OVER25={m_home['over25']} ({m_home['pct_over25']:.1f}%)\n"
        f"MANDANTE_UNDER25={m_home['under25']} ({m_home['pct_under25']:.1f}%)\n"
        f"MANDANTE_DATAS_AMOSTRA={','.join(m_home['datas']) if m_home['datas'] else '-'}\n"
        f"VISITANTE_FORMA_GERAL_ULT5={v_away['forma_geral']}\n"
        f"VISITANTE_RECORTE_FORA_ULT5_VED={v_away['v']}/{v_away['e']}/{v_away['d']}\n"
        f"VISITANTE_MEDIA_GOLS_MARCADOS={v_away['media_gp']:.2f}\n"
        f"VISITANTE_MEDIA_GOLS_SOFRIDOS={v_away['media_gc']:.2f}\n"
        f"VISITANTE_MEDIA_GOLS_TOTAIS={v_away['media_total']:.2f}\n"
        f"VISITANTE_OVER25={v_away['over25']} ({v_away['pct_over25']:.1f}%)\n"
        f"VISITANTE_UNDER25={v_away['under25']} ({v_away['pct_under25']:.1f}%)\n"
        f"VISITANTE_DATAS_AMOSTRA={','.join(v_away['datas']) if v_away['datas'] else '-'}\n"
        "REGRA: Nao usar confrontos diretos (H2H) em nenhuma hipotese.\n"
        "REGRA: Se qualquer recorte tiver menos de 4 jogos validos, sinalizar AMOSTRA REDUZIDA e manter analise conservadora (sem bloquear).\n\n"
        "DADOS_ORIGINAIS_DO_USUARIO:\n"
        + bloco_jogo
    )


def _odd_para_float(valor: str):
    if not valor:
        return None
    token = valor.strip().replace(",", ".")
    m = re.search(r"\d+(?:\.\d+)?", token)
    if not m:
        return None
    try:
        return float(m.group(0))
    except Exception:
        return None


def extrair_odds_mercados(texto: str) -> dict:
    odds = {
        "vitoria_mandante": None,
        "empate": None,
        "vitoria_visitante": None,
        "over_2_5": None,
        "under_2_5": None,
    }

    m_1x2 = re.search(
        r"odds?\s*1x2\s*:\s*([0-9][0-9.,]*)\s*/\s*([0-9][0-9.,]*)\s*/\s*([0-9][0-9.,]*)",
        texto,
        flags=re.IGNORECASE,
    )
    if m_1x2:
        odds["vitoria_mandante"] = _odd_para_float(m_1x2.group(1))
        odds["empate"] = _odd_para_float(m_1x2.group(2))
        odds["vitoria_visitante"] = _odd_para_float(m_1x2.group(3))

    m_over = re.search(r"over\s*2[.,]?5\s*:?\s*([0-9][0-9.,]*)", texto, flags=re.IGNORECASE)
    if m_over:
        odds["over_2_5"] = _odd_para_float(m_over.group(1))

    m_under = re.search(r"under\s*2[.,]?5\s*:?\s*([0-9][0-9.,]*)", texto, flags=re.IGNORECASE)
    if m_under:
        odds["under_2_5"] = _odd_para_float(m_under.group(1))

    return odds


def _prob_implicita_percentual(odd: float):
    if not odd or odd <= 0:
        return None
    return 100.0 / odd


def _rebaixar_confianca(nivel: str) -> str:
    mapa = {"ALTA": "MEDIA", "MEDIA": "ESPECULATIVA", "ESPECULATIVA": "ESPECULATIVA", "N/A": "N/A"}
    return mapa.get(nivel, nivel)


def _nivel_confianca(prob_est: float, odd: float, amostra_reduzida: bool) -> str:
    if prob_est is None or odd is None:
        return "N/A"
    if prob_est >= 60:
        nivel = "ALTA"
    elif prob_est >= 50:
        nivel = "MEDIA"
    elif prob_est >= 40 and odd >= 2.50:
        nivel = "ESPECULATIVA"
    else:
        nivel = "N/A"

    if amostra_reduzida and nivel != "N/A":
        nivel = _rebaixar_confianca(nivel)
    return nivel


def _mercado_label(chave: str) -> str:
    mapa = {
        "vitoria_mandante": "Vitoria Mandante",
        "empate": "Empate",
        "vitoria_visitante": "Vitoria Visitante",
        "over_2_5": "Over 2.5",
        "under_2_5": "Under 2.5",
    }
    return mapa.get(chave, chave)


def montar_json_analise(
    mandante: str,
    visitante: str,
    m_home: dict,
    v_away: dict,
    odds: dict,
    bloco_jogo: str,
) -> dict:
    amostra_reduzida = m_home["total_recorte"] < 4 or v_away["total_recorte"] < 4

    # Probabilidades estimadas por regra deterministica (consistente e auditavel)
    prob_empate = ((m_home["e"] / m_home["total_recorte"] * 100.0) if m_home["total_recorte"] else 0.0)
    prob_empate += ((v_away["e"] / v_away["total_recorte"] * 100.0) if v_away["total_recorte"] else 0.0)
    prob_empate /= 2.0

    prob_vm = (m_home["v"] / m_home["total_recorte"] * 100.0) if m_home["total_recorte"] else 0.0
    prob_vv = (v_away["v"] / v_away["total_recorte"] * 100.0) if v_away["total_recorte"] else 0.0
    prob_over = (m_home["pct_over25"] + v_away["pct_over25"]) / 2.0
    prob_under = (m_home["pct_under25"] + v_away["pct_under25"]) / 2.0

    probs = {
        "vitoria_mandante": prob_vm,
        "empate": prob_empate,
        "vitoria_visitante": prob_vv,
        "over_2_5": prob_over,
        "under_2_5": prob_under,
    }

    mercados = []
    for chave, odd in odds.items():
        if odd is None or odd < 1.80:
            continue
        prob_imp = _prob_implicita_percentual(odd)
        prob_est = probs.get(chave)
        score = (prob_est - prob_imp) if (prob_est is not None and prob_imp is not None) else None
        valor = bool(score is not None and score > 0)
        mercados.append(
            {
                "mercado": _mercado_label(chave),
                "odd": odd,
                "prob_imp": prob_imp,
                "prob_est": prob_est,
                "score": score,
                "valor": valor,
            }
        )

    mercados.sort(key=lambda x: x.get("score") if x.get("score") is not None else -9999, reverse=True)

    recomendada = None
    for m in mercados:
        if m["valor"]:
            recomendada = m
            break

    if recomendada:
        nivel = _nivel_confianca(recomendada["prob_est"], recomendada["odd"], amostra_reduzida)
        fundamento = (
            f"Score de valor = {recomendada['score']:.2f} p.p. (prob_est {recomendada['prob_est']:.2f}% "
            f"vs prob_imp {recomendada['prob_imp']:.2f}%). "
            f"Mandante casa: {m_home['v']}/{m_home['e']}/{m_home['d']} | "
            f"Visitante fora: {v_away['v']}/{v_away['e']}/{v_away['d']}."
        )
    else:
        nivel = "N/A"
        fundamento = "Nenhum mercado com odd >= 1.80 apresentou score positivo de valor."

    return {
        "jogo": f"{mandante} vs {visitante}",
        "status_amostra": "AMOSTRA REDUZIDA" if amostra_reduzida else "COMPLETA",
        "mandante": m_home,
        "visitante": v_away,
        "mercados": mercados,
        "recomendada": recomendada,
        "nivel_confianca": nivel,
        "fundamento": fundamento,
        "odds_recebidas": odds,
        "entrada_usuario": bloco_jogo,
    }


def renderizar_analise_tabela(analise: dict) -> str:
    m_home = analise["mandante"]
    v_away = analise["visitante"]
    rec = analise.get("recomendada")
    mercados_validos = [m for m in analise.get("mercados", []) if m.get("valor")]
    melhor_score = mercados_validos[0]["score"] if mercados_validos else None

    linhas = []
    linhas.append("RESUMO EXECUTIVO")
    linhas.append(f"Jogo: {analise['jogo']}")
    linhas.append(f"Amostra: {analise['status_amostra']}")
    if rec:
        linhas.append(
            f"Sugestao principal: {rec['mercado']} @ {rec['odd']:.2f} | "
            f"Prob.est {rec['prob_est']:.2f}% | Confianca {analise['nivel_confianca']}"
        )
    else:
        linhas.append("Sugestao principal: SEM VALOR IDENTIFICADO")
    if melhor_score is not None:
        linhas.append(f"Score de valor (topo): {melhor_score:.2f} p.p.")
    linhas.append("------------------------------------------------------------")
    linhas.append("")

    linhas.append(f"[JOGO] {analise['jogo']}")
    linhas.append(f"Status da amostra: {analise['status_amostra']}")
    linhas.append("")
    linhas.append("TIME | FORMA ULT5 | V/E/D RECORTE | GM | GS | MT | OVER2.5 | UNDER2.5")
    linhas.append(
        f"MANDANTE | {m_home['forma_geral']} | {m_home['v']}/{m_home['e']}/{m_home['d']} | "
        f"{m_home['media_gp']:.2f} | {m_home['media_gc']:.2f} | {m_home['media_total']:.2f} | "
        f"{m_home['pct_over25']:.1f}% | {m_home['pct_under25']:.1f}%"
    )
    linhas.append(
        f"VISITANTE | {v_away['forma_geral']} | {v_away['v']}/{v_away['e']}/{v_away['d']} | "
        f"{v_away['media_gp']:.2f} | {v_away['media_gc']:.2f} | {v_away['media_total']:.2f} | "
        f"{v_away['pct_over25']:.1f}% | {v_away['pct_under25']:.1f}%"
    )
    linhas.append("")
    linhas.append("MERCADO | ODD | PROB. IMPLICITA | PROB. ESTIMADA | SCORE | VALOR")
    if analise["mercados"]:
        for m in analise["mercados"]:
            linhas.append(
                f"{m['mercado']} | {m['odd']:.2f} | {m['prob_imp']:.2f}% | {m['prob_est']:.2f}% | "
                f"{m['score']:.2f} | {'SIM' if m['valor'] else 'NAO'}"
            )
    else:
        linhas.append("SEM VALOR IDENTIFICADO")

    linhas.append("")
    linhas.append("ENTRADA RECOMENDADA:")
    if rec:
        linhas.append(f"- mercado: {rec['mercado']}")
        linhas.append(f"- odd minima: {rec['odd']:.2f}")
        linhas.append(f"- probabilidade estimada: {rec['prob_est']:.2f}%")
        linhas.append(f"- nivel de confianca: {analise['nivel_confianca']}")
    else:
        linhas.append("- SEM VALOR IDENTIFICADO")
        linhas.append("- odd minima: N/A")
        linhas.append("- probabilidade estimada: N/A")
        linhas.append("- nivel de confianca: N/A")
    linhas.append(f"- fundamento objetivo: {analise['fundamento']}")
    linhas.append("")
    linhas.append("PAINEL DE AUDITORIA:")
    linhas.append(
        f"- jogos usados: mandante_casa={m_home['total_recorte']} | visitante_fora={v_away['total_recorte']}"
    )
    linhas.append(
        f"- datas mandante: {','.join(m_home['datas']) if m_home['datas'] else '-'}"
    )
    linhas.append(
        f"- datas visitante: {','.join(v_away['datas']) if v_away['datas'] else '-'}"
    )
    linhas.append("- regra de selecao: maior score (prob_est - prob_imp) com odd >= 1.80")

    return "\n".join(linhas)


def sugerir_times(nome_informado: str, limite: int = 3) -> list:
    candidatos = difflib.get_close_matches(
        normalizar_texto(nome_informado),
        list(INDICE_TIMES_BASE.keys()),
        n=limite,
        cutoff=0.55,
    )
    return [INDICE_TIMES_BASE[c] for c in candidatos]


PROMPT_MESTRE = (
    "Voce e o SNIPER ELITE ARG, analista especializado no Campeonato Argentino 2026. "
    "Seu objetivo e identificar apostas de valor real apenas nos mercados: vitoria seca, empate, over gols e under gols. "
    "Regra obrigatoria: nunca recomendar odd abaixo de 1.80. Se nao houver valor com odd >= 1.80, responda SEM VALOR IDENTIFICADO.\n\n"
    "A base historica oficial do projeto ja esta carregada internamente. "
    "Nao peca historico ao usuario. "
    "Solicite somente: jogo (mandante x visitante), data opcional e odds disponiveis.\n\n"
    "Sempre aplique a metodologia em 5 passos (sem H2H):\n"
    "1) Leitura do historico por mando e forma recente.\n"
    "2) Calculo de metricas: V/E/D, medias de gols, over/under 2.5, taxa de empate.\n"
    "3) Avaliacao de valor: prob_implicita=1/odd, prob_estimada por frequencia ajustada.\n"
    "4) Selecao do melhor mercado com classificacao de confianca.\n"
    "5) Revisao final de consistencia com os dados pre-calculados.\n\n"
    "Regras adicionais:\n"
    "- Nao usar confrontos diretos (H2H).\n"
    "- Se houver menos de 4 jogos em algum recorte, nao bloquear analise: sinalize AMOSTRA REDUZIDA e seja conservador.\n"
    "- Priorize linha 2.5 para over/under, salvo evidencia forte para outra linha.\n"
    "- Em analise multipla, avalie todos os jogos e finalize com ranking por confianca.\n"
    "- Nao use intuicao; baseie-se apenas na base interna e nas odds enviadas pelo usuario.\n\n"
    "REGRA DE CONSISTENCIA CRITICA:\n"
    "- Quando o usuario enviar bloco com ESTATISTICAS_PRE_CALCULADAS (NAO ALTERAR), use EXATAMENTE os numeros e forma desse bloco.\n"
    "- Nao reescreva V/E/D ou medias com valores diferentes do bloco pre-calculado.\n"
    "- Se a amostra for pequena, sinalize AMOSTRA REDUZIDA (sem bloquear a resposta).\n\n"
    "FORMATO OBRIGATORIO DE SAIDA (resposta harmonizada):\n"
    "1) Cabecalho:\n"
    "[JOGO] mandante vs visitante\n"
    "Status da amostra: COMPLETA ou AMOSTRA REDUZIDA\n\n"
    "2) Tabela de metricas (usar este layout):\n"
    "TIME | FORMA ULT5 | V/E/D RECORTE | GM | GS | MT | OVER2.5 | UNDER2.5\n"
    "MANDANTE | ... | ... | ... | ... | ... | ...% | ...%\n"
    "VISITANTE | ... | ... | ... | ... | ... | ...% | ...%\n\n"
    "3) Tabela de mercados com valor (odd >= 1.80):\n"
    "MERCADO | ODD | PROB. IMPLICITA | PROB. ESTIMADA | VALOR\n"
    "Empate | 3.00 | 33.33% | 41.00% | SIM\n"
    "Se nao houver valor: escrever somente SEM VALOR IDENTIFICADO\n\n"
    "4) Entrada recomendada (sempre incluir porcentagem + nivel):\n"
    "ENTRADA RECOMENDADA:\n"
    "- mercado: ...\n"
    "- odd minima: ...\n"
    "- probabilidade estimada: ...%\n"
    "- nivel de confianca: ALTA, MEDIA ou ESPECULATIVA\n"
    "- fundamento objetivo: 2 a 4 linhas, claro e direto\n\n"
    "5) Em analise multipla: separar cada jogo com uma linha horizontal:\n"
    "------------------------------------------------------------\n\n"
    "BASE HISTORICA INTERNA (usar como fonte principal):\n"
    + BASE_HISTORICA_INTERNA
)

MSG_START = (
    "SNIPER ELITE ARG online.\n\n"
    "A base historica ja esta carregada internamente.\n"
    "Envie somente o jogo e as odds para analise.\n\n"
    "Comandos:\n"
    "/metodo - metodologia de analise\n"
    "/template - formato para enviar jogo\n"
    "/mercados - mercados cobertos\n"
    "/top10 - ranking sniper multi-ligas da proxima rodada\n"
    "/resultado - registrar resultado final de uma pick\n"
    "/desempenho - ver taxa de acerto e ROI geral\n"
    "/semanal - relatorio da ultima semana\n"
    "/encerrar - limpa contexto da sessao"
)

MSG_METODO = (
    "Metodologia em 5 passos (sem H2H):\n"
    "1) Leitura do historico\n"
    "2) Metricas por time\n"
    "3) Avaliacao de valor (prob_imp x prob_est)\n"
    "4) Selecao do melhor mercado\n"
    "5) Revisao de consistencia"
)

MSG_TEMPLATE = (
    "Template sugerido para analise:\n\n"
    "Jogo: River Plate vs Independiente\n"
    "Data: 2026-04-10\n"
    "Odds 1X2: 1.85 / 3.20 / 4.50\n"
    "Over2.5: 1.90\n"
    "Under2.5: 1.95\n\n"
    "Obs: nao precisa enviar historico nem H2H. Eu uso a base interna do projeto.\n"
    "A resposta sera entregue em tabelas com porcentagens e nivel de confianca."
)

MSG_MERCADOS = (
    "Mercados cobertos (odd minima 1.80):\n"
    "- Vitoria seca mandante\n"
    "- Vitoria seca visitante\n"
    "- Empate\n"
    "- Over gols\n"
    "- Under gols"
)

MSG_RATE = "Voce enviou muitas mensagens em pouco tempo. Aguarde alguns segundos."
MSG_LONGA = "Mensagem muito longa. Resuma os dados em ate 2500 caracteres."
MSG_ERRO = "Falha tecnica momentanea. Tente novamente em instantes."
MSG_FORMATO = (
    "Envie no formato: Jogo: Mandante vs Visitante, junto das odds (1X2, Over e Under).\n"
    "Exemplo: Jogo: River Plate vs Independiente"
)


@bot.message_handler(commands=["start"])
def cmd_start(mensagem):
    chat_id = mensagem.chat.id
    memoria_analista.pop(chat_id, None)
    log.info("[START] chat_id=%s", chat_id)
    bot.send_message(chat_id, MSG_START)


@bot.message_handler(commands=["metodo"])
def cmd_metodo(mensagem):
    bot.send_message(mensagem.chat.id, MSG_METODO)


@bot.message_handler(commands=["template"])
def cmd_template(mensagem):
    bot.send_message(mensagem.chat.id, MSG_TEMPLATE)


@bot.message_handler(commands=["mercados"])
def cmd_mercados(mensagem):
    bot.send_message(mensagem.chat.id, MSG_MERCADOS)


@bot.message_handler(commands=["top10"])
def cmd_top10(mensagem):
    chat_id = mensagem.chat.id
    bot.send_chat_action(chat_id, "typing")

    try:
        ranking, nome_calendario = gerar_top10_sniper_multi()
    except Exception as erro:
        log.error("[ERRO-TOP10] chat_id=%s | %s", chat_id, type(erro).__name__)
        bot.send_message(chat_id, MSG_ERRO)
        return

    if not ranking:
        bot.send_message(
            chat_id,
            "Nao encontrei jogos processaveis no calendario da proxima rodada. Verifique o CSV em dados_sniper/_TEMPLATE_GERAL/Jogos_da_proxima_rodada.",
        )
        return

    linhas = [
        "TOP 10 SNIPER MULTI-LIGAS",
        f"Calendario: {nome_calendario}",
        "Foco: vitoria seca com maior indice de confianca",
        "",
    ]

    for pos, item in enumerate(ranking, start=1):
        odd_ref = f"{item['odd_referencia']:.2f}" if item.get("odd_referencia") is not None else "N/A"
        linhas.append(f"{pos}. {item['liga']} | {item['jogo']}")
        linhas.append(
            f"   Pick: {item['time_recomendado']} | Indice: {item['indice_confianca']:.2f} | Odd ref: {odd_ref}"
        )
        linhas.append(f"   Base: {item['justificativa_curta']}")
        linhas.append("")

    linhas.append("CSV consolidado salvo em dados_sniper/_TEMPLATE_GERAL/saida_top10_sniper.csv")
    bot.send_message(chat_id, "\n".join(linhas))


@bot.message_handler(commands=["encerrar"])
def cmd_encerrar(mensagem):
    chat_id = mensagem.chat.id
    memoria_analista.pop(chat_id, None)
    bot.send_message(chat_id, "Sessao limpa. Pode enviar um novo jogo para analise.")


@bot.message_handler(commands=["resultado"])
def cmd_resultado(mensagem):
    chat_id = mensagem.chat.id
    texto = mensagem.text or ""

    placar = extrair_placar_resultado(texto)
    if not placar:
        bot.send_message(
            chat_id,
            "Formato: /resultado id:123 1-0  ou  /resultado 1-0 (usa a ultima pick pendente).",
        )
        return

    aposta_id = extrair_id_resultado(texto)
    aposta = buscar_aposta_pendente(chat_id, aposta_id)
    if not aposta:
        bot.send_message(chat_id, "Nao encontrei pick pendente para este chat/ID.")
        return

    g_m, g_v = placar
    aposta = liquidar_aposta(aposta, g_m, g_v)
    status = "ACERTOU" if aposta["acerto"] else "ERROU"
    retorno = f"+{aposta['lucro_u']:.2f}u" if aposta["lucro_u"] >= 0 else f"{aposta['lucro_u']:.2f}u"

    bot.send_message(
        chat_id,
        "FEEDBACK DA PICK\n"
        f"ID: {aposta['id']}\n"
        f"Jogo: {aposta['jogo']}\n"
        f"Mercado: {aposta['mercado']} @ {float(aposta['odd']):.2f}\n"
        f"Placar final: {aposta['placar']}\n"
        f"Status: {status}\n"
        f"Retorno (1u): {retorno}",
    )


@bot.message_handler(commands=["desempenho"])
def cmd_desempenho(mensagem):
    chat_id = mensagem.chat.id
    apostas_chat = [a for a in historico_apostas["apostas"] if a["chat_id"] == chat_id]
    resumo = _resumo_stats(apostas_chat)
    por_mercado = _stats_por_mercado(apostas_chat)

    linhas = [
        "DESEMPENHO GERAL",
        f"- Picks liquidadas: {resumo['total']}",
        f"- Acertos/Erros: {resumo['acertos']}/{resumo['erros']}",
        f"- Hit rate: {resumo['hit_rate']:.2f}%",
        f"- Lucro acumulado: {resumo['lucro_u']:.2f}u",
        f"- ROI: {resumo['roi']:.2f}%",
        "",
        "POR MERCADO:",
    ]

    if por_mercado:
        for mercado, s in por_mercado:
            linhas.append(
                f"- {mercado}: {s['acertos']}/{s['total']} | hit {s['hit_rate']:.2f}% | lucro {s['lucro_u']:.2f}u | ROI {s['roi']:.2f}%"
            )
    else:
        linhas.append("- Sem picks liquidadas ainda.")

    bot.send_message(chat_id, "\n".join(linhas))


@bot.message_handler(commands=["semanal"])
def cmd_semanal(mensagem):
    chat_id = mensagem.chat.id
    agora = datetime.now()
    apostas_chat = [a for a in historico_apostas["apostas"] if a["chat_id"] == chat_id and a.get("status") == "liquidada"]

    semana = []
    for a in apostas_chat:
        try:
            dt = datetime.strptime(a["liquidado_em"], "%Y-%m-%d %H:%M:%S")
            if (agora - dt).days < 7:
                semana.append(a)
        except Exception:
            continue

    resumo = _resumo_stats(semana)
    bot.send_message(
        chat_id,
        "RELATORIO SEMANAL (7 dias)\n"
        f"- Picks liquidadas: {resumo['total']}\n"
        f"- Acertos/Erros: {resumo['acertos']}/{resumo['erros']}\n"
        f"- Hit rate: {resumo['hit_rate']:.2f}%\n"
        f"- Lucro: {resumo['lucro_u']:.2f}u\n"
        f"- ROI: {resumo['roi']:.2f}%",
    )


def _analisar_bloco_jogo(chat_id: int, bloco_jogo: str) -> None:
    """Valida times na base e envia analise para um bloco de jogo extraido."""
    jogo = extrair_jogo_da_mensagem(bloco_jogo)
    if not jogo:
        return

    mandante_in, visitante_in = jogo
    mandante_norm = normalizar_texto(mandante_in)
    visitante_norm = normalizar_texto(visitante_in)

    nao_encontrados = []
    if mandante_norm not in INDICE_TIMES_BASE:
        nao_encontrados.append(mandante_in)
    if visitante_norm not in INDICE_TIMES_BASE:
        nao_encontrados.append(visitante_in)

    if nao_encontrados:
        trechos = []
        for nome in nao_encontrados:
            sugestoes = sugerir_times(nome)
            if sugestoes:
                trechos.append(f"- {nome}: voce quis dizer {', '.join(sugestoes)}?")
            else:
                trechos.append(f"- {nome}: sem sugestao proxima na base")
        amostra = ", ".join(LISTA_TIMES_BASE[:12])
        bot.send_message(
            chat_id,
            "Nao encontrei um ou mais times na base historica.\n"
            + "\n".join(trechos)
            + "\n\nAlguns times da base: " + amostra,
        )
        return

    mandante_base = INDICE_TIMES_BASE[mandante_norm]
    visitante_base = INDICE_TIMES_BASE[visitante_norm]
    m_home = calcular_metricas_time(mandante_base, JOGOS_BASE, "mandante")
    v_away = calcular_metricas_time(visitante_base, JOGOS_BASE, "visitante")

    odds = extrair_odds_mercados(bloco_jogo)

    if not any(v is not None for v in odds.values()):
        bot.send_message(
            chat_id,
            "Nao consegui identificar as odds no texto/foto. Envie no formato: Odds 1X2: 1.90 / 3.10 / 4.20",
        )
        return

    try:
        bot.send_chat_action(chat_id, "typing")
        analise_json = montar_json_analise(mandante_base, visitante_base, m_home, v_away, odds, bloco_jogo)
        aposta_id = registrar_aposta(chat_id, analise_json)
        resposta_tabela = renderizar_analise_tabela(analise_json)
        if aposta_id is not None:
            resposta_tabela += (
                "\n\nPICK REGISTRADA\n"
                f"- ID: {aposta_id}\n"
                "- Para feedback apos o jogo: /resultado id:"
                f"{aposta_id} 1-0"
            )
        bot.send_message(chat_id, resposta_tabela)
    except Exception as erro:
        log.error("[ERRO-ANALISE] chat_id=%s | %s", chat_id, type(erro).__name__)
        bot.send_message(chat_id, MSG_ERRO)


@bot.message_handler(content_types=["photo"])
def responder_foto(mensagem):
    chat_id = mensagem.chat.id

    if not verificar_rate_limit(chat_id):
        bot.send_message(chat_id, MSG_RATE)
        return

    bot.send_chat_action(chat_id, "typing")
    log.info("[FOTO] chat_id=%s", chat_id)

    # Baixar foto em maior resolucao disponivel
    try:
        file_id = mensagem.photo[-1].file_id
        file_info = bot.get_file(file_id)
        foto_bytes = bot.download_file(file_info.file_path)
    except Exception as erro:
        log.error("[FOTO-DOWNLOAD] chat_id=%s | %s", chat_id, type(erro).__name__)
        bot.send_message(chat_id, MSG_ERRO)
        return

    # Gemini Vision: extrair times e odds da imagem
    try:
        extracao = cliente_gemini.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=foto_bytes, mime_type="image/jpeg"),
                (
                    "Extraia os dados de todas as partidas desta imagem de apostas esportivas. "
                    "Para cada jogo encontrado, retorne exatamente neste formato:\n"
                    "Jogo: [Mandante] vs [Visitante]\n"
                    "Odds 1X2: [Odd1] / [OddX] / [Odd2]\n"
                    "Over2.5: [odd se disponivel]\n"
                    "Under2.5: [odd se disponivel]\n\n"
                    "Se Over/Under nao estiver visivel, omita essas linhas. "
                    "Retorne apenas os dados, sem comentarios."
                ),
            ],
        )
        texto_extraido = extracao.text.strip()
        log.info("[FOTO-EXTRACAO] chat_id=%s | %s", chat_id, texto_extraido[:120])
    except Exception as erro:
        log.error("[FOTO-GEMINI] chat_id=%s | %s", chat_id, type(erro).__name__)
        bot.send_message(chat_id, MSG_ERRO)
        return

    bot.send_message(chat_id, f"Imagem lida. Dados extraidos:\n\n{texto_extraido}\n\nIniciando analise...")

    # Processar cada jogo extraido individualmente
    blocos = re.split(r"\n(?=Jogo:)", texto_extraido)
    for bloco in blocos:
        bloco = bloco.strip()
        if bloco:
            _analisar_bloco_jogo(chat_id, bloco)


@bot.message_handler(func=lambda m: True)
def responder(mensagem):
    chat_id = mensagem.chat.id
    texto = (mensagem.text or "").strip()

    if not verificar_rate_limit(chat_id):
        bot.send_message(chat_id, MSG_RATE)
        return

    if len(texto) > 2500:
        bot.send_message(chat_id, MSG_LONGA)
        return

    bot.send_chat_action(chat_id, "typing")
    log.info("[MSG] chat_id=%s", chat_id)

    if not extrair_jogo_da_mensagem(texto):
        bot.send_message(chat_id, MSG_FORMATO)
        return

    _analisar_bloco_jogo(chat_id, texto)


def main() -> None:
    print("SNIPER ELITE ARG online.")
    bot.polling(skip_pending=True)


if __name__ == "__main__":
    main()
