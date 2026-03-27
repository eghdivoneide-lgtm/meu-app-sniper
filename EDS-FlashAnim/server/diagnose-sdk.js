/**
 * diagnose-sdk.js
 * Faz uma chamada real ao SDK e salva a estrutura COMPLETA do objeto retornado.
 * Isso vai revelar exatamente o que o SDK retorna após o polling.
 */
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'chave-vertex.json');

const ai = new GoogleGenAI({
  vertexai: { project: 'eds-ultra-prod', location: 'us-central1' },
  project: 'eds-ultra-prod',
  location: 'us-central1',
});

// Serializa recursivamente o objeto, tratando casos especiais (Uint8Array, etc.)
function safeStringify(obj, depth = 0) {
  if (depth > 5) return '"[MaxDepth]"';
  if (obj === null || obj === undefined) return String(obj);
  if (obj instanceof Uint8Array) return `"[Uint8Array len=${obj.length}]"`;
  if (Buffer.isBuffer(obj)) return `"[Buffer len=${obj.length}]"`;
  if (typeof obj === 'string') {
    return JSON.stringify(obj.length > 100 ? obj.slice(0, 100) + '...[truncated]' : obj);
  }
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    const items = obj.slice(0, 3).map(i => safeStringify(i, depth + 1));
    return `[${items.join(', ')}${obj.length > 3 ? `, ...(${obj.length - 3} more)` : ''}]`;
  }
  const keys = Object.keys(obj);
  const pairs = keys.map(k => `${JSON.stringify(k)}: ${safeStringify(obj[k], depth + 1)}`);
  return `{${pairs.join(', ')}}`;
}

async function main() {
  console.log('🔍 Iniciando diagnóstico do SDK...');
  console.log('📡 Fazendo chamada de geração (prompt simples sem pessoas)...\n');

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: 'A beautiful sunset over the ocean with golden reflections on calm water',
      config: {
        aspectRatio: '16:9',
        personGeneration: 'DONT_ALLOW',
      },
    });

    console.log('✅ Operação iniciada:', operation.name);
    console.log('\n--- ESTRUTURA INICIAL DO OPERATION ---');
    console.log('Tipo:', typeof operation);
    console.log('Chaves:', Object.keys(operation));
    console.log('done:', operation.done);
    console.log('Estrutura completa:', safeStringify(operation));
    console.log('-----------------------------------\n');

    fs.writeFileSync('initial-op-structure.json', safeStringify(operation));
    console.log('💾 Estrutura inicial salva em initial-op-structure.json');

    // Aguardar 30s e fazer um poll
    console.log('\n⏳ Aguardando 30s para 1 poll de teste...');
    await new Promise(r => setTimeout(r, 30000));

    const updated = await ai.operations.getVideosOperation({ operation: operation });
    console.log('\n--- ESTRUTURA APÓS POLLING ---');
    console.log('Tipo:', typeof updated);
    console.log('Chaves:', Object.keys(updated));
    console.log('done:', updated.done);
    console.log('Estrutura completa:', safeStringify(updated));
    console.log('-----------------------------------\n');

    fs.writeFileSync('polled-op-structure.json', safeStringify(updated));
    console.log('💾 Estrutura após polling salva em polled-op-structure.json');

  } catch(err) {
    console.error('❌ Erro:', err.message);
    if (err.message.includes('63236870')) {
      console.log('\n⚠️  Prompt com pessoas detectado, use outro prompt!');
    }
  }
}

main();
