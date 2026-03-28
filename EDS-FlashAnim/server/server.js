import express from 'express';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garantir credenciais Vertex via Variável de Ambiente para o Railway
if (process.env.VERTEX_CREDENTIALS_JSON) {
  const customKeyPath = path.join(__dirname, 'chave-vertex.json');
  fs.writeFileSync(customKeyPath, process.env.VERTEX_CREDENTIALS_JSON);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = customKeyPath;
} else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'chave-vertex.json');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Servir a pasta estática "dist" gerada pelo Vite (Frontend em Produção)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SDK inicializado com Vertex AI (usa chave-vertex.json automaticamente)
const ai = new GoogleGenAI({
  vertexai: { project: 'eds-ultra-prod', location: 'us-central1' },
  project: 'eds-ultra-prod',
  location: 'us-central1',
});

app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt é obrigatório.' });
    }

    console.log('[EDS] Iniciando geração de vídeo via Vertex AI SDK...');
    if (imageBase64) {
      console.log('[EDS] Imagem de referência recebida — modo image-to-video ativado.');
    }

    // Extrair só o base64 puro (remover prefixo "data:image/...;base64," se existir)
    let rawBase64 = null;
    let imageMime = mimeType || 'image/jpeg';
    if (imageBase64) {
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        imageMime = match[1];
        rawBase64 = match[2];
      } else {
        rawBase64 = imageBase64;
      }
    }

    // Montar payload — com ou sem imagem de referência
    const generatePayload = {
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        aspectRatio: '16:9',
        personGeneration: 'ALLOW_ADULT',
      },
    };

    // Adicionar imagem de referência se fornecida (image-to-video)
    if (rawBase64) {
      generatePayload.image = {
        imageBytes: rawBase64,
        mimeType: imageMime,
      };
    }

    let operation = await ai.models.generateVideos(generatePayload);


    console.log(`[EDS] Operação iniciada: ${operation.name}`);

    // Polling
    let startTime = Date.now();
    let pollInterval = 15000;
    const maxPollInterval = 60000;
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 7;

    while (!operation.done) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`[EDS] Aguardando... (${elapsed}s) | Próximo check em ${pollInterval / 1000}s`);
      await new Promise(r => setTimeout(r, pollInterval));

      try {
        const updated = await ai.operations.getVideosOperation({ operation: operation });
        if (updated) {
          operation = updated;
          consecutiveErrors = 0;
          pollInterval = Math.min(pollInterval * 1.3, maxPollInterval);
          console.log(`[EDS] Status polling: done=${operation.done}`);
        }
      } catch (pollErr) {
        console.warn(`[EDS] Polling warning: ${pollErr.message}`);
        consecutiveErrors++;
        if (pollErr.message.includes('429')) {
          pollInterval = Math.min(pollInterval * 2, 120000);
        } else {
          pollInterval = Math.min(pollInterval * 1.5, maxPollInterval);
        }
        if (consecutiveErrors >= maxConsecutiveErrors) {
          throw new Error(`Falha excessiva de comunicação com a API do Google (${consecutiveErrors} erros).`);
        }
      }

      if (operation.error) {
        throw new Error(`Vertex Veo Error: ${operation.error.message || JSON.stringify(operation.error)}`);
      }
    }

    // === EXTRAÇÃO DO VÍDEO ===
    console.log('[EDS] Operação completa! Extraindo vídeo...');
    console.log('[EDS] Chaves do operation:', JSON.stringify(Object.keys(operation || {})));

    const response = operation.response;
    if (response) {
      console.log('[EDS] Chaves de operation.response:', JSON.stringify(Object.keys(response)));
    }


    let base64str = null;
    let mimeTypeOut = 'video/mp4';

    // === VERIFICAR FILTRO RAI (personagens/faces) ===
    // Se o response contém raiMediaFilteredCount, o vídeo foi bloqueado pelo filtro de segurança
    const sources = [operation, response].filter(Boolean);
    for (const src of sources) {
      if (src.raiMediaFilteredCount && src.raiMediaFilteredCount > 0) {
        const reasons = src.raiMediaFilteredReasons || [];
        console.warn('[EDS] ⚠️ Vídeo bloqueado pelo filtro RAI (personagens/faces detectados)');
        throw new Error(
          '🚫 O prompt foi bloqueado pelo filtro de segurança da API Google Veo: ele detectou personagens humanos ou rostos. ' +
          'Por favor, use um prompt sem pessoas, personagens ou expressões faciais. ' +
          'Exemplo: "Uma galáxia se formando no espaço profundo, nuvens de nebulosas coloridas em espiral, 1080p cinematográfico"'
        );
      }
    }

    for (const src of sources) {
      if (base64str) break;

      if (src.generatedVideos && src.generatedVideos.length > 0) {
        const gv = src.generatedVideos[0];
        console.log('[EDS] Encontrado generatedVideos. Chaves do gv:', JSON.stringify(Object.keys(gv)));
        if (gv.video) {
          console.log('[EDS] Chaves de gv.video:', JSON.stringify(Object.keys(gv.video)));
        }
        base64str = gv.video?.videoBytes || gv.video?.encodedVideo || gv.videoBytes || gv.encodedVideo;
        mimeTypeOut = gv.video?.mimeType || gv.video?.encoding || 'video/mp4';

      } else if (src.generatedSamples && src.generatedSamples.length > 0) {
        const sample = src.generatedSamples[0];
        base64str = sample.video?.encodedVideo || sample.video?.videoBytes || sample.encodedVideo || sample.videoBytes;
        mimeTypeOut = sample.video?.encoding || sample.video?.mimeType || 'video/mp4';

      } else if (src.videos && src.videos.length > 0) {
        base64str = src.videos[0].videoBytes || src.videos[0].encodedVideo || src.videos[0].bytesBase64Encoded;
        mimeTypeOut = src.videos[0].mimeType || 'video/mp4';

      } else if (src.predictions && src.predictions.length > 0) {
        base64str = src.predictions[0].bytesBase64Encoded || src.predictions[0].videoBytes;
      }
    }

    // Se base64str for um Buffer, converter para string base64
    if (base64str && Buffer.isBuffer(base64str)) {
      console.log('[EDS] Convertendo Buffer para base64 string...');
      base64str = base64str.toString('base64');
    }
    if (base64str instanceof Uint8Array) {
      console.log('[EDS] Convertendo Uint8Array para base64 string...');
      base64str = Buffer.from(base64str).toString('base64');
    }

    if (!base64str) {
      const debugInfo = {
        operationKeys: Object.keys(operation || {}),
        responseKeys: Object.keys(response || {}),
        operationSample: JSON.stringify(operation).slice(0, 800),
      };
      console.error('[EDS] DEBUG - estrutura não reconhecida:', JSON.stringify(debugInfo));
      throw new Error('Vídeo gerado, mas o formato da resposta do Vertex AI é desconhecido.');
    }

    const videos = [{ videoBase64: base64str, mimeType: mimeTypeOut }];
    console.log(`[EDS] ✅ Sucesso! Vídeo gerado. Tamanho base64: ${base64str.length} chars`);
    res.json({ success: true, videos });

  } catch (error) {
    console.error('[EDS] Erro interno:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Qualquer outra rota não API, serve o React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 EDS FlashAnim Server (Vertex AI SDK) iniciado na porta ${PORT}`);
});
