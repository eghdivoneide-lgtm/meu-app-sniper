import logging
import os
import sys
import threading

log = logging.getLogger(__name__)


def iniciar_analista() -> None:
    import app_analista_argentino

    app_analista_argentino.main()


def iniciar_suporte() -> None:
    import app_suporte_eds

    app_suporte_eds.main()


def iniciar_ambos() -> None:
    t1 = threading.Thread(target=iniciar_analista, daemon=True, name="analista")
    t2 = threading.Thread(target=iniciar_suporte, daemon=True, name="suporte")

    t1.start()
    t2.start()

    t1.join()
    t2.join()


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    alvo = os.getenv("BOT_TARGET", "suporte").strip().lower()
    print(f"[main.py] BOT_TARGET={alvo!r} — iniciando...", flush=True)

    runners = {
        "analista": iniciar_analista,
        "suporte": iniciar_suporte,
        "ambos": iniciar_ambos,
    }

    if alvo not in runners:
        log.critical(
            "BOT_TARGET invalido: %r. Use: suporte, analista ou ambos.", alvo
        )
        raise RuntimeError(
            f"BOT_TARGET invalido: {alvo!r}. Use: suporte, analista ou ambos."
        )

    log.info("Iniciando servico configurado: %s", alvo)
    runners[alvo]()


if __name__ == "__main__":
    main()
