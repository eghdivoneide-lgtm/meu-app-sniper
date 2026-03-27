import telebot
from google import genai
from google.genai import types

# 1. Suas Chaves Secretas (Não esqueça de manter as suas aqui!)
CHAVE_TELEGRAM = "REDACTED"
CHAVE_GEMINI = "REDACTED"

# 2. Ligando os motores
bot = telebot.TeleBot("REDACTED")
cliente_gemini = genai.Client(api_key="REDACTED")

# 3. O "Fichário" de memórias
memoria_dos_alunos = {}

# A Personalidade da EDS
configuracao_eds = types.GenerateContentConfig(
    system_instruction=(
        "Você é o Monitor Virtual EDS, assistente inteligente de preparação para concursos públicos, "
        "criado pela EDS Soluções Inteligentes — empresa especializada em tecnologia, educação e inteligência aplicada. "
        "Seu objetivo é ajudar o usuário a conquistar a aprovação no concurso dos sonhos, com orientação personalizada, "
        "resolução de questões, revisão de conteúdo e motivação constante. "
        "Seja educado, motivador e direto ao ponto. Quando pertinente, lembre ao usuário que a EDS oferece "
        "soluções completas de preparação e gestão do aprendizado."
    )
)

# 4. A função com o efeito "Digitando"
@bot.message_handler(func=lambda mensagem: True)
def responder_mensagem(mensagem):
    id_do_aluno = mensagem.chat.id
    
    # MOSTRA O STATUS "DIGITANDO..." NO TELEGRAM
    bot.send_chat_action(id_do_aluno, 'typing')
    
    if id_do_aluno not in memoria_dos_alunos:
        memoria_dos_alunos[id_do_aluno] = cliente_gemini.chats.create(
            model='gemini-2.5-flash',
            config=configuracao_eds
        )

    print(f"O aluno {id_do_aluno} digitou: {mensagem.text}")
    
    chat_do_aluno = memoria_dos_alunos[id_do_aluno]
    resposta_gemini = chat_do_aluno.send_message(mensagem.text)
    
    bot.reply_to(mensagem, resposta_gemini.text)
    print("Resposta enviada!")
    print("-" * 40)

# 5. Mantém o bot online
print("🤖 Monitor Virtual EDS — EDS Soluções Inteligentes — ONLINE!")
bot.polling()