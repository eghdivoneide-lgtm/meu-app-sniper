const { GoogleGenAI } = require('@google/genai');
const path = require('path');
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'chave-vertex.json');

const ai = new GoogleGenAI({ vertexai: { project: 'eds-ultra-prod', location: 'us-central1' } });

async function run() {
    try {
        console.log("Iniciando Vertex...");
        let operation = await ai.models.generateVideos({
            model: "veo-2.0-generate-001",
            prompt: "A beautiful sunset over the city.",
            config: { aspectRatio: "16:9", personGeneration: "DONT_ALLOW" }
        });
        
        console.log("Operation gerada! ID:", operation.name);
        
        // Wait using the recommended method or loop?
        // Is there a .done or we just need to fetch it?
        console.log("Testando operation.result...");
        // the library wrapper might have a getter or we might just await it?
        try {
             // In some versions, generateVideos returns a Promise of the final result directly if we don't handle it differently? Wait, no.
             // If we just loop:
             while (!operation.done) {
                 console.log("Polling...");
                 await new Promise(r => setTimeout(r, 10000));
                 
                 // How to poll with vertexai?
                 // Let's print the methods of operation:
                 console.log("Operation methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(operation)));
                 
                 // Maybe: operation = await ai.models.getOperation({name: operation.name}) ?
                 // GenAI SDK has operations service ? 
             }
        } catch(e) { console.log(e.message); }

    } catch(err) {
        console.log("Erro:", err.message);
    }
}
run();
