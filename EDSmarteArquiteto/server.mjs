import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';

// Carrega as chaves do .env.local
dotenv.config({ path: '.env.local' });

const VERTEX_LOCATION   = process.env.VERTEX_LOCATION   || 'us-central1';
const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'eds-ultra-prod';
const VERTEX_CREDENTIALS_PATH = process.env.VERTEX_CREDENTIALS_PATH || path.resolve(process.cwd(), 'vertex-service-account.json');
const GEMINI_API_KEY    = process.env.GEMINI_API_KEY    || '';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ── Autenticação Vertex (para Imagen fallback) ────────────────────────────────
const createVertexAuth = () => {
  if (!fs.existsSync(VERTEX_CREDENTIALS_PATH)) return null;
  return new GoogleAuth({
    keyFilename: VERTEX_CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
};
const vertexAuth = createVertexAuth();

async function getVertexToken() {
  if (!vertexAuth) throw new Error('Credencial Vertex não encontrada.');
  const token = await vertexAuth.getAccessToken();
  return token;
}

// ── Etapa 1: Análise da imagem com Gemini Vision ──────────────────────────────
async function analisarImovel(imagemBase64, mimeType, apiKey) {
  if (!apiKey) return null;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      parts: [
        {
          text: `Analise esta imagem de imóvel/edificação com MÁXIMO DETALHE arquitetônico:
1. Tipo de construção (casa, prédio, fachada, interior, etc)
2. Materiais visíveis (tijolos, reboco, vidro, madeira, pedra, etc)
3. Elementos arquitetônicos (janelas, portas, varandas, telhado, colunas, etc)
4. Cores predominantes atuais
5. Estilo atual da construção
6. Proporções e layout geral
7. Entorno imediato (jardim, calçada, etc)

Seja extremamente preciso. Esta análise será usada para transformar o estilo do imóvel PRESERVANDO sua estrutura e proporções.`
        },
        { inline_data: { mime_type: mimeType || 'image/jpeg', data: imagemBase64 } }
      ]
    }],
    generationConfig: { temperature: 0.1 }
  };
  try {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) { console.log(`[EDSmarte] 📋 Análise do imóvel concluída (${text.length} chars)`); return text; }
  } catch (e) { console.warn('[EDSmarte] Análise falhou (não crítico):', e.message); }
  return null;
}

// ── Etapa 2A: Transformação via Gemini image generation (image-to-image) ──────
const SYSTEM_INSTRUCTION_ARQUITETURA = `Você é um arquiteto e renderizador 3D de elite especializado em transformação fotorrealista de imóveis.

REGRAS ABSOLUTAS:
1. PRESERVE com precisão a estrutura, proporções e layout do imóvel original.
2. MANTENHA o número e posição de janelas, portas, pavimentos e elementos estruturais.
3. APLIQUE o novo estilo apenas nos acabamentos, materiais, cores e detalhes decorativos.
4. Gere imagem FOTORREALISTA em alta resolução (8K), como se fosse uma foto real do imóvel reformado.
5. NUNCA mude a planta baixa, o ângulo de visão ou as proporções originais.
6. O resultado deve parecer uma fotografia profissional de arquitetura, não um render de computador.`;

const GEMINI_IMAGE_MODELS = [
  'gemini-3-pro-image-preview',
  'gemini-2.5-pro-preview-03-25',
  'gemini-2.0-flash-exp-image-generation',
  'gemini-2.0-flash-exp',
];

async function gerarComGemini(promptEstilo, descricaoImovel, imagemBase64, mimeType, apiKey) {
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada');

  const promptFinal = descricaoImovel
    ? `ANÁLISE DETALHADA DO IMÓVEL ORIGINAL:\n${descricaoImovel}\n\n---\n\nTRANSFORMAÇÃO ARQUITETÔNICA SOLICITADA:\n${promptEstilo}\n\nIMPORTANTE: Use a análise acima para preservar CADA detalhe estrutural ao aplicar o novo estilo.`
    : promptEstilo;

  const errors = [];
  for (const model of GEMINI_IMAGE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION_ARQUITETURA }] },
        contents: [{
          parts: [
            { text: promptFinal },
            { inline_data: { mime_type: mimeType || 'image/jpeg', data: imagemBase64 } }
          ]
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
          temperature: 1.0,
        }
      };

      console.log(`[EDSmarte] 🎨 Tentando Gemini: ${model}`);
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();

      if (!response.ok || data.error) {
        errors.push(`${model}: ${data.error?.message?.slice(0, 100) || 'erro desconhecido'}`);
        continue;
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(p => p.inlineData || p.inline_data);
      if (!imgPart) { errors.push(`${model}: resposta sem imagem`); continue; }

      const inline = imgPart.inlineData || imgPart.inline_data;
      console.log(`[EDSmarte] ⭐ Sucesso com Gemini: ${model}`);
      return `data:${inline.mimeType || inline.mime_type || 'image/png'};base64,${inline.data}`;
    } catch (e) {
      errors.push(`${model}: ${e.message.slice(0, 80)}`);
    }
  }
  throw new Error('Gemini indisponível:\n' + errors.join('\n'));
}

// ── Etapa 2B: Fallback — Imagen 3 Capability (image editing real) ─────────────
async function gerarComImagen3Editing(promptEstilo, descricaoImovel, imagemBase64) {
  const token = await getVertexToken();
  const model = 'imagen-3.0-capability-001';
  const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:predict`;

  const promptFinal = descricaoImovel
    ? `${promptEstilo}. ESTRUTURA DO IMÓVEL: ${descricaoImovel.slice(0, 600)}`
    : promptEstilo;

  const payload = {
    instances: [{
      prompt: promptFinal,
      referenceImages: [{
        referenceType: 'REFERENCE_TYPE_STYLE',
        referenceId: 1,
        referenceImage: { bytesBase64Encoded: imagemBase64 },
      }]
    }],
    parameters: {
      sampleCount: 1,
      aspectRatio: '16:9',
      safetyFilterLevel: 'block_few',
      personGeneration: 'allow_all',
      outputMimeType: 'image/png',
      addWatermark: false,
    }
  };

  console.log('[EDSmarte] 🏗️  Tentando Imagen 3 Capability (editing)...');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || data.error) throw new Error(`Imagen 3: ${data.error?.message || response.statusText}`);

  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error(`Imagen 3: resposta sem imagem — ${JSON.stringify(data).slice(0, 300)}`);

  console.log('[EDSmarte] ✅ Imagen 3 Capability OK');
  return `data:image/png;base64,${b64}`;
}

// ── Fallback final — Imagen 3 Generate (sem referência, último recurso) ───────
async function gerarComImagen3Texto(promptEstilo) {
  const token = await getVertexToken();
  const model = 'imagen-3.0-generate-001';
  const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:predict`;

  const payload = {
    instances: [{ prompt: promptEstilo }],
    parameters: { sampleCount: 1, aspectRatio: '16:9', safetyFilterLevel: 'block_some' }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(`Imagen 3 texto: ${data.error?.message || response.statusText}`);
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error('Imagen 3 texto: sem imagem');
  return `data:image/png;base64,${b64}`;
}

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    vertexConfigured: Boolean(vertexAuth),
    geminiConfigured: Boolean(GEMINI_API_KEY),
    vertexProject: VERTEX_PROJECT_ID,
    vertexLocation: VERTEX_LOCATION,
    pipeline: GEMINI_API_KEY
      ? 'Gemini image-to-image → Imagen 3 editing → Imagen 3 texto'
      : 'Imagen 3 editing → Imagen 3 texto (sem Gemini)',
  });
});

// ── Rota principal ─────────────────────────────────────────────────────────────
app.post('/generate', async (req, res) => {
  try {
    const { imageDelta, style, prompt } = req.body;
    if (!imageDelta) return res.status(400).json({ success: false, error: 'Nenhuma imagem enviada.' });

    console.log(`\n[EDSmarte] 🏠 Nova requisição — Estilo: ${style}`);

    // Extrai o base64 puro (remove prefixo data:image/...;base64,)
    const base64Match = imageDelta.match(/^data:([^;]+);base64,(.+)$/);
    const mimeType    = base64Match?.[1] || 'image/jpeg';
    const imagemB64   = base64Match?.[2] || imageDelta;

    // Prompt arquitetônico enriquecido
    const enhancedPrompt = `Transform this building into a stunning ${style} architectural style redesign. ${prompt ? prompt + '.' : ''} Photorealistic 8K exterior architecture photo, award-winning design, professional architectural photography. Preserve the exact structure, proportions, number of floors, windows and doors position. Only change finishes, materials, colors and decorative details.`;

    // ETAPA 1: Analisar o imóvel (se Gemini disponível)
    const geminiKey = GEMINI_API_KEY || req.headers['x-gemini-key'];
    let descricao = null;
    if (geminiKey) {
      descricao = await analisarImovel(imagemB64, mimeType, geminiKey);
    }

    // ETAPA 2: Gerar a transformação (cascade de qualidade)
    let generatedUrl = '';

    if (geminiKey) {
      try {
        generatedUrl = await gerarComGemini(enhancedPrompt, descricao, imagemB64, mimeType, geminiKey);
      } catch (e1) {
        console.warn('[EDSmarte] Gemini falhou:', e1.message.slice(0, 150));
        try {
          generatedUrl = await gerarComImagen3Editing(enhancedPrompt, descricao, imagemB64);
        } catch (e2) {
          console.warn('[EDSmarte] Imagen 3 editing falhou:', e2.message.slice(0, 150));
          generatedUrl = await gerarComImagen3Texto(enhancedPrompt);
        }
      }
    } else {
      // Sem Gemini: tenta Imagen 3 editing direto
      try {
        generatedUrl = await gerarComImagen3Editing(enhancedPrompt, descricao, imagemB64);
      } catch (e2) {
        console.warn('[EDSmarte] Imagen 3 editing falhou:', e2.message.slice(0, 150));
        generatedUrl = await gerarComImagen3Texto(enhancedPrompt);
      }
    }

    console.log('[EDSmarte] ✅ Transformação concluída!\n');
    res.json({ success: true, url: generatedUrl });

  } catch (error) {
    console.error('[EDSmarte] ❌ Erro fatal:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🏠 EDSmarte Arquiteto | Backend na porta ${PORT}`);
  console.log(`   Vertex AI: ${vertexAuth ? '✅ Configurado' : '❌ Sem credenciais'} (${VERTEX_PROJECT_ID})`);
  console.log(`   Gemini: ${GEMINI_API_KEY ? '✅ Configurado (máxima fidelidade)' : '⚠️  Não configurado (configure GEMINI_API_KEY no .env.local)'}`);
  console.log(`   Pipeline: Gemini image-to-image → Imagen 3 editing → Imagen 3 texto\n`);
});
