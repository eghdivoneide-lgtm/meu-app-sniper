const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'chave-vertex.json');

const ai = new GoogleGenAI({
  vertexai: { project: 'eds-ultra-prod', location: 'us-central1' },
  project: 'eds-ultra-prod',
  location: 'us-central1',
});

async function run() {
    console.log("Gerando...");
    let op = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: 'A beautiful sunset',
        config: { aspectRatio: '16:9', personGeneration: 'DONT_ALLOW' }
    });
    console.log("Iniciado:", op.name);

    while (!op.done) {
        console.log("Polling...");
        await new Promise(r => setTimeout(r, 15000));
        op = await ai.operations.getVideosOperation({ operation: op });
        console.log("done=", op.done);
    }

    // Salvar a estrutura completa para entender o formato
    const raw = JSON.parse(JSON.stringify(op));
    fs.writeFileSync('final-op.json', JSON.stringify(raw, null, 2));
    console.log("Salvo em final-op.json");
}
run().catch(e => {
    fs.writeFileSync('final-op-error.json', JSON.stringify({error: e.message, stack: e.stack}, null, 2));
    console.log("Erro:", e.message);
});
