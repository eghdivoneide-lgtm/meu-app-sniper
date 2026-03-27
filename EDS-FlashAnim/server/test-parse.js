// test-parse.js — testa o parsing com o final-op.json real
const fs = require('fs');
const path = require('path');

const opPath = path.join(__dirname, 'final-op.json');
if (!fs.existsSync(opPath)) {
  console.error('❌ final-op.json não encontrado. O arquivo de dump deve estar no diretório server/');
  process.exit(1);
}

const operation = JSON.parse(fs.readFileSync(opPath, 'utf8'));
const response = operation.response;

console.log('=== ESTRUTURA DO OBJETO OPERATION ===');
console.log('Chaves do operation:', Object.keys(operation));
if (response) {
  console.log('Chaves de operation.response:', Object.keys(response));
}

const sources = [operation, response].filter(Boolean);
let base64str = null;
let mimeTypeOut = 'video/mp4';
let foundIn = null;

for (const [i, src] of sources.entries()) {
  const label = i === 0 ? 'operation' : 'operation.response';
  if (base64str) break;

  if (src.generatedVideos && src.generatedVideos.length > 0) {
    const gv = src.generatedVideos[0];
    console.log(`\n[${label}] Encontrado generatedVideos. Chaves:`, Object.keys(gv));
    if (gv.video) console.log(`  Chaves de gv.video:`, Object.keys(gv.video));
    base64str = gv.video?.videoBytes || gv.video?.encodedVideo || gv.videoBytes || gv.encodedVideo;
    mimeTypeOut = gv.video?.mimeType || gv.video?.encoding || 'video/mp4';
    foundIn = label;
  } else if (src.generatedSamples && src.generatedSamples.length > 0) {
    const sample = src.generatedSamples[0];
    base64str = sample.video?.encodedVideo || sample.video?.videoBytes || sample.encodedVideo || sample.videoBytes;
    mimeTypeOut = sample.video?.encoding || sample.video?.mimeType || 'video/mp4';
    foundIn = label;
  } else if (src.videos && src.videos.length > 0) {
    base64str = src.videos[0].videoBytes || src.videos[0].encodedVideo || src.videos[0].bytesBase64Encoded;
    foundIn = label;
  } else if (src.predictions && src.predictions.length > 0) {
    base64str = src.predictions[0].bytesBase64Encoded || src.predictions[0].videoBytes;
    foundIn = label;
  }
}

if (base64str) {
  console.log(`\n✅ VIDEO EXTRAÍDO com sucesso de: ${foundIn}`);
  console.log(`   Tamanho: ${base64str.length} chars`);
  console.log(`   Primeiros 80 chars: ${base64str.slice(0, 80)}...`);
  console.log(`   MimeType: ${mimeTypeOut}`);
} else {
  console.error('\n❌ PARSING FALHOU — nenhum campo de vídeo encontrado!');
  console.error('  operationKeys:', Object.keys(operation));
  console.error('  responseKeys:', response ? Object.keys(response) : 'N/A');
}
