import time
import logging
import os
import telebot
from google import genai
from google.genai import types


def obter_env(*nomes: str, default: str | None = None) -> str | None:
    for nome in nomes:
        valor = os.getenv(nome)
        if valor:
            return valor
    return default


# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------
CHAVE_TELEGRAM = obter_env("TELEGRAM_TOKEN_SUPORTE", "SUPORTE_TOKEN_TELEGRAM")
CHAVE_GEMINI = obter_env("GEMINI_API_KEY_SUPORTE", "SUPORTE_GEMINI_API_KEY")
EMAIL_EDS = obter_env("SUPPORT_EMAIL", "E-MAIL DE SUPORTE", default="supportedsi@gmail.com")

if not CHAVE_TELEGRAM:
    raise RuntimeError("Defina a variavel de ambiente TELEGRAM_TOKEN_SUPORTE.")

if not CHAVE_GEMINI:
    raise RuntimeError("Defina a variavel de ambiente GEMINI_API_KEY_SUPORTE.")

# ---------------------------------------------------------------------------
# Logging — sem dados sensíveis no arquivo
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler("suporte_eds_log.txt", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Rate limiting básico — máx 20 mensagens por minuto por usuário
# ---------------------------------------------------------------------------
LIMITE_MSG_POR_MINUTO = 20
historico_rate: dict[int, list[float]] = {}


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
bot            = telebot.TeleBot(CHAVE_TELEGRAM)
cliente_gemini = genai.Client(api_key=CHAVE_GEMINI)
memoria_suporte: dict[int, object] = {}   # {chat_id: objeto de chat Gemini}

# ---------------------------------------------------------------------------
# Prompt mestre institucional-comercial
# ---------------------------------------------------------------------------
PROMPT_MESTRE = (
    "Você é o Agente de Suporte da EDS Soluções Inteligentes no Telegram.\n\n"
    "Sua função é realizar atendimento inicial, triagem e orientação objetiva para clientes "
    "e interessados, com linguagem profissional, clara e respeitosa.\n\n"

    "Você pode ajudar diretamente em:\n"
    "- Dúvidas gerais de suporte\n"
    "- Orientação inicial sobre integrações\n"
    "- Passo a passo para criação de chave Google Gemini\n"
    "- Passo a passo para criação de chave Anthropic\n"
    "- Direcionamento para o contato humano da EDS\n\n"

    "Você NÃO pode resolver diretamente:\n"
    "renegociação, contratos, cobranças individualizadas, análise documental, "
    "confirmação de dados pessoais, decisões financeiras, validação de propostas "
    "ou qualquer caso que dependa de análise humana ou política interna.\n\n"

    "QUANDO o assunto envolver chave Google Gemini, responda com este passo a passo:\n"
    "1. Acesse: https://aistudio.google.com/app/apikey?hl=pt-br\n"
    "2. Entre com sua conta Google\n"
    "3. Crie ou visualize sua chave\n"
    "4. Guarde a chave em local seguro\n"
    "5. Para restrições: https://console.cloud.google.com/apis/credentials?hl=pt-br\n"
    "6. Documentação oficial: https://ai.google.dev/gemini-api/docs/api-key\n"
    "E sempre inclua o aviso: Nunca envie sua chave no chat.\n\n"

    "QUANDO o assunto envolver chave Anthropic, responda com este passo a passo:\n"
    "1. Acesse: https://platform.claude.com/\n"
    "2. Entre na sua conta\n"
    "3. Vá para: https://platform.claude.com/settings/keys\n"
    "4. Gere sua API key\n"
    "5. Guia oficial: https://platform.claude.com/docs/en/api/getting-started\n"
    "E sempre inclua o aviso: Não compartilhe sua chave em chat ou e-mail aberto.\n\n"

    "QUANDO o assunto envolver contrato, cobrança, renegociação, documento, CPF, CNPJ, "
    "proposta, contestação, dados pessoais, dados bancários ou análise de caso individual, "
    "responda exatamente:\n"
    "Esse assunto precisa de análise humana. "
    f"Por favor, envie sua solicitação para {EMAIL_EDS} informando: "
    "Nome, Telefone, Resumo do caso e Melhor horário para retorno.\n\n"

    "QUANDO a pergunta depender de um aplicativo, sistema ou integração específica e você não "
    "tiver contexto suficiente, responda de forma objetiva. Use esta linha como base: "
    "Essa dúvida depende do aplicativo ou sistema utilizado. "
    f"Se for uma solução da EDS Soluções Inteligentes ou uma integração apoiada por nossa equipe, envie sua solicitação para {EMAIL_EDS} "
    "informando Nome, Telefone, Resumo do caso e Melhor horário para retorno.\n\n"

    "REGRAS OBRIGATÓRIAS:\n"
    "- Nunca peça chave completa, senha, documento, dado bancário ou arquivo no chat\n"
    "- Nunca invente política interna, prazo, preço ou aprovação\n"
    "- Nunca faça aconselhamento financeiro, jurídico ou contratual\n"
    f"- Se não souber responder, encaminhe para {EMAIL_EDS}\n"
    "- Use frases curtas, tom profissional e respostas objetivas\n"
)

# ---------------------------------------------------------------------------
# Classificador de intenções por palavras-chave
# ---------------------------------------------------------------------------
PALAVRAS_GOOGLE     = ["google", "gemini", "ai studio", "apikey", "api key",
                       "chave google", "chave gemini", "aistudio"]
PALAVRAS_ANTHROPIC  = ["anthropic", "claude", "chave anthropic",
                       "api anthropic", "platform.claude"]
PALAVRAS_EMAIL      = ["email", "e-mail", "equipe", "humano", "falar com",
                       "atendimento humano", "contato", "supportedssi", "supportedsi"]
PALAVRAS_SENSIVEL   = ["contrato", "cobran", "renegoc", "document", "cpf",
                       "cnpj", "proposta", "contest", "dados pessoais",
                       "dado pessoal", "banc", "boleto", "parcela",
                       "divida", "dívida", "inadimpl", "aprovac", "aprovaç"]


def classificar_intencao(texto: str) -> str:
    t = texto.lower()
    for p in PALAVRAS_SENSIVEL:
        if p in t:
            return "sensivel"
    for p in PALAVRAS_GOOGLE:
        if p in t:
            return "google"
    for p in PALAVRAS_ANTHROPIC:
        if p in t:
            return "anthropic"
    for p in PALAVRAS_EMAIL:
        if p in t:
            return "email"
    return "geral"

# ---------------------------------------------------------------------------
# Mensagens fixas
# ---------------------------------------------------------------------------
MSG_BOAS_VINDAS = (
    "👋 Olá! Sou o Agente de Suporte da EDS Soluções Inteligentes.\n\n"
    "Posso ajudar com orientações iniciais, configuração de chave Google Gemini ou Anthropic "
    "e encaminhamento para nossa equipe.\n\n"
    f"Casos que exigem análise humana serão direcionados para {EMAIL_EDS}.\n\n"
    "📋 /ajuda — Ver opções disponíveis\n"
    "🛠 /suporte — Suporte geral\n"
    "🔑 /google — Chave Google Gemini\n"
    "🤖 /anthropic — Chave Anthropic\n"
    "📧 /email — Falar com a equipe EDS\n"
    "👋 /encerrar — Encerrar atendimento\n\n"
    "Ou envie sua dúvida diretamente."
)

MSG_AJUDA = (
    "📋 *Opções disponíveis:*\n\n"
    "🛠 /suporte — Dúvidas gerais\n"
    "🔑 /google — Chave Google Gemini\n"
    "🤖 /anthropic — Chave Anthropic\n"
    "📧 /email — Contato com a equipe EDS\n"
    "👋 /encerrar — Encerrar atendimento\n\n"
    "Ou envie sua dúvida e eu identifico o melhor encaminhamento."
)

MSG_GOOGLE = (
    "🔑 *Cadastro de Chave Google Gemini*\n\n"
    "1️⃣ Acesse:\nhttps://aistudio.google.com/app/apikey?hl=pt-br\n\n"
    "2️⃣ Entre com sua conta Google\n\n"
    "3️⃣ Clique em *Criar chave de API* e copie\n\n"
    "4️⃣ Guarde a chave em local seguro\n\n"
    "5️⃣ Para restringir ou gerenciar:\nhttps://console.cloud.google.com/apis/credentials?hl=pt-br\n\n"
    "6️⃣ Documentação oficial:\nhttps://ai.google.dev/gemini-api/docs/api-key\n\n"
    "⚠️ *Nunca envie sua chave no chat ou em grupos.*"
)

MSG_ANTHROPIC = (
    "🤖 *Cadastro de Chave Anthropic*\n\n"
    "1️⃣ Acesse:\nhttps://platform.claude.com/\n\n"
    "2️⃣ Entre na sua conta ou crie uma\n\n"
    "3️⃣ Vá para a área de chaves:\nhttps://platform.claude.com/settings/keys\n\n"
    "4️⃣ Clique em *Create Key* e copie\n\n"
    "5️⃣ Guia oficial:\nhttps://platform.claude.com/docs/en/api/getting-started\n\n"
    "⚠️ *Não compartilhe sua chave em chat, e-mail aberto ou grupo.*"
)

MSG_EMAIL = (
    "📧 Contato com a Equipe EDS\n\n"
    "Para atendimento humano, envie para:\n"
    f"{EMAIL_EDS}\n\n"
    "Modelo sugerido:\n"
    "Assunto: Suporte EDS Soluções Inteligentes - seu nome\n\n"
    "Corpo:\n"
    "- Nome completo\n"
    "- Telefone\n"
    "- Empresa (se houver)\n"
    "- Resumo da necessidade\n"
    "- Melhor horário para retorno"
)

MSG_SENSIVEL = (
    "⚠️ Esse assunto precisa de análise humana.\n\n"
    "Por favor, envie sua solicitação para:\n"
    f"📧 {EMAIL_EDS}\n\n"
    "Informe:\n"
    "- Nome\n"
    "- Telefone\n"
    "- Resumo do caso\n"
    "- Melhor horário para retorno\n\n"
    "📌 Assunto sugerido: Suporte EDS Soluções Inteligentes - seu nome"
)

MSG_ENCERRAR = (
    "👋 Atendimento inicial encerrado.\n\n"
    "Se precisar de novo suporte, é só me chamar.\n"
    f"Para casos que exigem análise humana: {EMAIL_EDS}"
)

MSG_RATE_LIMIT = (
    "⏳ Você enviou muitas mensagens em pouco tempo.\n"
    "Aguarde um momento e tente novamente."
)

MSG_MUITO_LONGA = (
    "⚠️ Mensagem muito longa. Por favor, resuma sua dúvida em uma ou duas frases."
)

MSG_ERRO_TECNICO = (
    "⚠️ Tive um problema técnico agora. Tente novamente em instantes ou "
    f"entre em contato pelo {EMAIL_EDS}."
)

# ---------------------------------------------------------------------------
# Handlers de comandos
# ---------------------------------------------------------------------------
@bot.message_handler(commands=["start"])
def cmd_start(mensagem):
    chat_id = mensagem.chat.id
    memoria_suporte.pop(chat_id, None)   # reseta sessão anterior
    log.info("[START] chat_id=%s", chat_id)
    bot.send_message(chat_id, MSG_BOAS_VINDAS)


@bot.message_handler(commands=["ajuda"])
def cmd_ajuda(mensagem):
    chat_id = mensagem.chat.id
    log.info("[AJUDA] chat_id=%s", chat_id)
    bot.send_message(chat_id, MSG_AJUDA, parse_mode="Markdown")


@bot.message_handler(commands=["suporte"])
def cmd_suporte(mensagem):
    chat_id = mensagem.chat.id
    log.info("[SUPORTE] chat_id=%s", chat_id)
    bot.send_chat_action(chat_id, "typing")
    bot.send_message(
        chat_id,
        "🛠 *Suporte Geral*\n\n"
        "Envie sua dúvida e eu vou orientar o melhor caminho.\n"
        "Se o assunto envolver análise de caso, documentos, cobrança ou dados sensíveis, "
        f"vou encaminhar para *{EMAIL_EDS}*.\n\n"
        "Se a dúvida depender de um aplicativo ou sistema específico, informe o nome da solução para eu te orientar melhor.",
        parse_mode="Markdown",
    )


@bot.message_handler(commands=["google"])
def cmd_google(mensagem):
    chat_id = mensagem.chat.id
    log.info("[GOOGLE] chat_id=%s", chat_id)
    bot.send_message(chat_id, MSG_GOOGLE, parse_mode="Markdown",
                     disable_web_page_preview=True)


@bot.message_handler(commands=["anthropic"])
def cmd_anthropic(mensagem):
    chat_id = mensagem.chat.id
    log.info("[ANTHROPIC] chat_id=%s", chat_id)
    bot.send_message(chat_id, MSG_ANTHROPIC, parse_mode="Markdown",
                     disable_web_page_preview=True)


@bot.message_handler(commands=["email"])
def cmd_email(mensagem):
    chat_id = mensagem.chat.id
    log.info("[EMAIL] chat_id=%s", chat_id)
    bot.send_message(chat_id, MSG_EMAIL)


@bot.message_handler(commands=["encerrar"])
def cmd_encerrar(mensagem):
    chat_id = mensagem.chat.id
    memoria_suporte.pop(chat_id, None)
    log.info("[ENCERRAR] chat_id=%s", chat_id)
    bot.send_message(chat_id, MSG_ENCERRAR)


# ---------------------------------------------------------------------------
# Handler principal — mensagens livres
# ---------------------------------------------------------------------------
@bot.message_handler(func=lambda m: True)
def responder_mensagem(mensagem):
    chat_id = mensagem.chat.id
    texto   = mensagem.text or ""

    # Rate limiting
    if not verificar_rate_limit(chat_id):
        log.warning("[RATE-LIMIT] chat_id=%s", chat_id)
        bot.send_message(chat_id, MSG_RATE_LIMIT)
        return

    # Tamanho máximo de mensagem
    if len(texto) > 1500:
        bot.send_message(chat_id, MSG_MUITO_LONGA)
        return

    bot.send_chat_action(chat_id, "typing")

    # Classificar intenção e despachar fluxo fixo quando possível
    intencao = classificar_intencao(texto)
    log.info("[MSG] chat_id=%s | intencao=%s", chat_id, intencao)

    if intencao == "sensivel":
        bot.send_message(chat_id, MSG_SENSIVEL)
        return

    if intencao == "google":
        bot.send_message(chat_id, MSG_GOOGLE, parse_mode="Markdown",
                         disable_web_page_preview=True)
        return

    if intencao == "anthropic":
        bot.send_message(chat_id, MSG_ANTHROPIC, parse_mode="Markdown",
                         disable_web_page_preview=True)
        return

    if intencao == "email":
        bot.send_message(chat_id, MSG_EMAIL)
        return

    # Suporte geral via Gemini com memória de sessão
    if chat_id not in memoria_suporte:
        memoria_suporte[chat_id] = cliente_gemini.chats.create(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(system_instruction=PROMPT_MESTRE),
        )

    try:
        resposta = memoria_suporte[chat_id].send_message(texto)
        bot.reply_to(mensagem, resposta.text)
    except Exception as erro:
        log.error("[ERRO-GEMINI] chat_id=%s | %s", chat_id, type(erro).__name__)
        bot.send_message(chat_id, MSG_ERRO_TECNICO)


# ---------------------------------------------------------------------------
# Inicialização
# ---------------------------------------------------------------------------
def main() -> None:
    print("Agente de Suporte EDS Solucoes Inteligentes — ONLINE!")
    log.info("Bot iniciado.")
    bot.polling(skip_pending=True)


if __name__ == "__main__":
    main()
