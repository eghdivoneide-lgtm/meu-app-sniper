import telebot
from google import genai
from google.genai import types

# 1. Suas Chaves Secretas (Não esqueça de manter as suas aqui!)
CHAVE_TELEGRAM = "REDACTED"
CHAVE_GEMINI = "COLE_AQUI_SUA_CHAVE_GEMINI"

# 2. Ligando os motores
bot = telebot.TeleBot(CHAVE_TELEGRAM)
cliente_gemini = genai.Client(api_key=CHAVE_GEMINI)

# 3. O "Fichário" de memórias
memoria_dos_professores = {}

# A Personalidade do Assistente Pedagógico (Parceria EDS x SEDUC-PE)
configuracao_seduc = types.GenerateContentConfig(
    system_instruction=(
        "Você é o Assistente Pedagógico SEDUC-PE, desenvolvido pela EDS Soluções Inteligentes em parceria com a Secretaria de Educação de Pernambuco. "
        "Sua missão é apoiar professores e coordenadores pedagógicos com orientações baseadas na BNCC, "
        "nas diretrizes curriculares de Pernambuco e nas melhores práticas de ensino. "
        "Ajude na elaboração de planos de aula, sequências didáticas, avaliações e estratégias de inclusão. "
        "Seja educado, objetivo, motivador e sempre fundamentado em evidências pedagógicas."
    )
)

# 4. A função com o efeito "Digitando"
@bot.message_handler(func=lambda mensagem: True)
def responder_mensagem(mensagem):
    id_do_professor = mensagem.chat.id
    
    # MOSTRA O STATUS "DIGITANDO..." NO TELEGRAM
    bot.send_chat_action(id_do_professor, 'typing')
    
    if id_do_professor not in memoria_dos_professores:
        memoria_dos_professores[id_do_professor] = cliente_gemini.chats.create(
            model='gemini-2.5-flash',
            config=configuracao_seduc
        )

    print(f"O professor {id_do_professor} digitou: {mensagem.text}")
    
    chat_do_professor = memoria_dos_professores[id_do_professor]
    resposta_gemini = chat_do_professor.send_message(mensagem.text)
    
    bot.reply_to(mensagem, resposta_gemini.text)
    print("Resposta enviada!")
    print("-" * 40)

# 5. Mantém o bot online
print("🤖 Assistente Pedagógico SEDUC-PE — EDS Soluções Inteligentes — ONLINE!")
bot.polling()