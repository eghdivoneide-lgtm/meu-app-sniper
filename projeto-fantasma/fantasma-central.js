// ============================================
// 🧠 CENTRAL FANTASMA — Controlador Principal
// ============================================
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { log } = require("./logger");
// Sem dependência do Flashscore

const ConectorBetano = require("./conector-betano");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir os arquivos estáticos do Dashboard
app.use(express.static(path.join(__dirname, 'public')));

function broadcastWS(type, data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
}

async function bootSystem() {
  console.clear();
  log("=======================================", "info");
  log("🔥 SISTEMA FANTASMA V3 INICIADO 🔥", "bot");
  log("=======================================", "info");

  server.listen(3000, () => {
    log("🚀 Servidor Dashboard online em http://localhost:3000", "success");
  });

  const betano = new ConectorBetano();

  try {
    // Inicia a navegação Furtiva na área Ao Vivo da Betano
    await betano.iniciar(); 

    log("Rotina de Varredura Iniciada - Intervalo: 30s", "info");

    // Loop Infinito de avaliação
    while (true) {
      const jogosLive = await betano.escanearAoVivo();
      broadcastWS("status_varredura", { totalJogos: jogosLive.length });
      
      if (jogosLive.length > 0) {
        log(`Encontrados ${jogosLive.length} jogos... Avaliando Padrões Sniper.`, "bot");
        
        for (const j of jogosLive) {
          // Filtragem simples para testar visualização
          let tempoValidado = parseInt(j.tempo);
          if (isNaN(tempoValidado)) tempoValidado = 0; // Previne erro com NaN
          
          if (tempoValidado >= 75) {
             log(`Avaliando partida na zona quente (+75'): ${j.mandante} x ${j.visitante} (${j.tempo})`, "bot");
             
             // O bot infiltra na página para ler ODDs reais e Pressão
             const estatisticas = await betano.avaliarEstatisticasDaPartida(`${j.mandante}`);
             
             if (estatisticas) {
                // Algoritmo Tático: Ataques Perigosos por Minuto
                const atqPorMinuto = estatisticas.ataquesPerigosos / tempoValidado;
                
                // Padrão Agressivo: Mais de ~0.8 atq/min ou muitos chutes
                const isAgressivo = (atqPorMinuto >= 0.8) || (estatisticas.chutesAoGol >= 6);
                
                // Padrão Morno: Menos de ~0.4 atq/min e poucos chutes
                const isMorno = (atqPorMinuto <= 0.4) && (estatisticas.chutesAoGol <= 3);

                let tipoSinal = "NEUTRO";
                let propPensada = null;
                let oddCantosTarget = null;
                let oddGolsTarget = null;

                if (isAgressivo) {
                   tipoSinal = "OVER (🔥 Jogo Agressivo)";
                   propPensada = "Tendência Alta: Mais Cantos e Gols";
                   oddCantosTarget = estatisticas.mercados.cantos.oddOver;
                   oddGolsTarget = estatisticas.mercados.gols.oddOver;
                } else if (isMorno) {
                   tipoSinal = "UNDER (❄️ Jogo Morno)";
                   propPensada = "Tendência de Amarrar: Menos Cantos e Gols";
                   oddCantosTarget = estatisticas.mercados.cantos.oddUnder;
                   oddGolsTarget = estatisticas.mercados.gols.oddUnder;
                } else {
                   log("Jogo sem padrão definido (Misto). Ignorado.", "info");
                   continue; // Pula pra o próximo se não bater nenhum dos filtros extremos
                }

                // Emite o alerta para o painel com as estatísticas novas
                broadcastWS("alvo_encontrado", { 
                  mandante: j.mandante, 
                  visitante: j.visitante, 
                  tempo: j.tempo,
                  odd: oddCantosTarget, // Enviaremos a de cantos para compatibilidade visual atual
                  radar: `Atq/Min: ${atqPorMinuto.toFixed(2)} | Chutes: ${estatisticas.chutesAoGol}`,
                  sinal: tipoSinal,
                  dica: propPensada,
                  oddGols: oddGolsTarget
                });
             }
          }
        }
      } else {
        log("Nenhum jogo interessante ativo nesta varredura.", "info");
      }

      // Aguarda 2 Minutos para a próxima varredura
      log(`Aguardando 120s para próxima varredura na Betano...`, "info");
      await new Promise(r => setTimeout(r, 120000));
    }

    log("Rotina de teste de sistema encerrada com sucesso.", "success");

  } catch (error) {
    console.error("Falha grave no sistema central:", error);
    log(`Falha grave no sistema central: ${error.message}`, "error");
  } finally {
    // Cleanup
    await betano.fechar();
    log("Navegadores encerrados após o erro. Mas o Servidor segue online.", "warn");
  }
}

bootSystem();
