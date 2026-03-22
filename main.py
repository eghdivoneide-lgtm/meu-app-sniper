import logging
import os
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
    )

    alvo = os.getenv("BOT_TARGET", "suporte").strip().lower()
    runners = {
        "analista": iniciar_analista,
        "suporte": iniciar_suporte,
        "ambos": iniciar_ambos,
    }

    if alvo not in runners:
        raise RuntimeError(
            "BOT_TARGET invalido. Use: suporte, analista ou ambos."
        )

    log.info("Iniciando servico configurado: %s", alvo)
    runners[alvo]()


if __name__ == "__main__":
    main()
