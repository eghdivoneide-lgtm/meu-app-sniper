const express = require('express');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(__dirname, 'chave-vertex.json');
const CONFIG_PATH = path.join(__dirname, 'config.json');
const PROJECT_ID = 'gen-lang-client-0033369940';
const LOCATION = 'us-central1';

let config = {};
if (fs.existsSync(CONFIG_PATH)) {
  try { config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch {}
}

const auth = new GoogleAuth({
  keyFile: KEY_PATH,
  scopes: [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/generative-language',
  ],
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, '..')));

app.get('/health', (req, res) => res.json({
  status: 'ok',
  geminiKeyConfigured: !!config.geminiApiKey,
  project: PROJECT_ID
}));

app.post('/api/configurar-key', (req, res) => {
  const { geminiApiKey } = req.body;
  if (!geminiApiKey || !geminiApiKey.startsWith('AIza'))
    return res.status(400).json({ erro: 'API Key inválida. Deve começar com AIza' });
  config.geminiApiKey = geminiApiKey;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log('[EDS Visual] ✅ Gemini API Key configurada!');
  res.json({ sucesso: true });
});

async function getAccessToken() {
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

// System instruction igual ao do AI Studio — especialista em transformação artística
const SYSTEM_INSTRUCTION = `Você é o ARTISTA VISUAL IA MASTER — especialista de elite em transformação e reimaginação artística de imagens. 
Sua missão: receber uma foto real de pessoas e transformá-la em uma obra de arte no estilo solicitado, com altíssima fidelidade às características físicas das pessoas originais.

REGRAS ABSOLUTAS:
1. Preserve com precisão EXTREMA: tom de pele, cor de cabelo, forma do rosto, expressões, posições relativas das pessoas.
2. Mantenha o número exato de pessoas na imagem.
3. Aplique o estilo artístico completamente, sem comprometer a identidade das pessoas.
4. Resolução e detalhamento MÁXIMOS — cada detalhe importa.
5. NUNCA mude etnia, cor de pele ou características raciais.`;

// ─── Modelo principal: mesmo do AI Studio ─────────────────────────────────
// Modelos em ordem de prioridade — gemini-3-pro-image-preview é o mesmo do AI Studio
const GEMINI_MODELS = [
  'gemini-3-pro-image-preview',           // ⭐ Nano Banana Pro (AI Studio)
  'gemini-3.0-pro-image-preview',         // variante com ponto
  'gemini-2.5-pro-exp-03-25',             // Gemini 2.5 Pro experimental
  'gemini-2.5-pro-preview-03-25',
  'gemini-2.0-flash-exp-image-generation', // Flash image gen
  'gemini-2.0-flash-exp',
];

async function gerarComGeminiAPIKey(prompt, imagemBase64, mimeType) {
  if (!config.geminiApiKey) throw new Error('API Key não configurada');

  const errors = [];
  for (const model of GEMINI_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`;

      const payload = {
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType || 'image/jpeg', data: imagemBase64 } }
          ]
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
          temperature: 1.0,
        }
      };

      console.log(`[EDS Visual] Tentando modelo: ${model}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        errors.push(`${model}: ${data.error?.message?.slice(0, 80) || 'erro'}`);
        continue;
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(p => p.inlineData || p.inline_data);
      if (!imgPart) {
        errors.push(`${model}: sem imagem na resposta`);
        continue;
      }

      const inline = imgPart.inlineData || imgPart.inline_data;
      console.log(`[EDS Visual] ⭐ Sucesso com modelo: ${model}`);
      return { imagemBase64: inline.data, mimeType: inline.mimeType || inline.mime_type || 'image/png', modelo: model };
    } catch (e) {
      errors.push(`${model}: ${e.message.slice(0, 80)}`);
    }
  }
  throw new Error('Todos os modelos Gemini falharam:\n' + errors.join('\n'));
}

// ─── Fallback: Imagen 3 via Vertex AI (service account) ───────────────────
async function gerarComImagen(prompt, imagemBase64, token) {
  const model = 'imagen-3.0-capability-001';
  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}:predict`;

  const payload = {
    instances: [{
      prompt: SYSTEM_INSTRUCTION.split('\n')[0] + '\n' + prompt,
      referenceImages: [{
        referenceType: 'REFERENCE_TYPE_SUBJECT',
        referenceId: 1,
        referenceImage: { bytesBase64Encoded: imagemBase64 },
        subjectImageConfig: { subjectType: 'SUBJECT_TYPE_PERSON' }
      }]
    }],
    parameters: {
      sampleCount: 1,
      aspectRatio: '1:1',
      safetyFilterLevel: 'block_few',
      personGeneration: 'allow_all',
      outputMimeType: 'image/png',
      addWatermark: false,
      enhancedPrompt: false,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || 'Imagen falhou');

  const predictions = data.predictions || [];
  if (!predictions[0]?.bytesBase64Encoded) throw new Error('Imagen sem imagem na resposta');

  return { imagemBase64: predictions[0].bytesBase64Encoded, mimeType: 'image/png', modelo: 'imagen-3.0-capability-001' };
}

// ─── Rota principal ────────────────────────────────────────────────────────
app.post('/api/gerar-imagem', async (req, res) => {
  try {
    const { prompt, imagemBase64, mimeType } = req.body;
    if (!prompt || !imagemBase64) return res.status(400).json({ erro: 'Prompt e imagem são obrigatórios.' });

    let resultado = null;

    // Prioridade 1: Gemini (mesma qualidade AI Studio)
    try {
      resultado = await gerarComGeminiAPIKey(prompt, imagemBase64, mimeType);
    } catch (e1) {
      console.warn('[EDS Visual] Gemini API Key indisponível:', e1.message.slice(0, 150));

      // Fallback: Imagen 3 via Vertex AI
      console.log('[EDS Visual] Usando Imagen 3 (fallback Vertex AI)...');
      const token = await getAccessToken();
      resultado = await gerarComImagen(prompt, imagemBase64, token);
    }

    console.log(`[EDS Visual] ✅ Arte gerada — Modelo: ${resultado.modelo} | ${Math.round(resultado.imagemBase64.length / 1024)}KB`);
    res.json({ sucesso: true, imagemBase64: resultado.imagemBase64, mimeType: resultado.mimeType, modelo: resultado.modelo });

  } catch (err) {
    console.error('[EDS Visual] ❌ Erro fatal:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  const keyStatus = config.geminiApiKey
    ? '✅ Gemini API Key configurada — usando modelo de alta qualidade!'
    : '⚠️  Configure a Gemini API Key no app para qualidade máxima';
  console.log(`\n🎨 EDS Visual | http://localhost:${PORT}`);
  console.log(`   ${keyStatus}`);
  console.log(`   Modelos tentados: ${GEMINI_MODELS.slice(0, 3).join(' → ')} → Imagen3\n`);
});
