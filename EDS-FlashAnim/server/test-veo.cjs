const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
console.log("AI Keys:", Object.keys(ai));
console.log("AI Prots:", Object.getOwnPropertyNames(Object.getPrototypeOf(ai)));
if (ai.operations) {
    console.log("Operations Keys:", Object.keys(ai.operations));
    console.log("Operations Prots:", Object.getOwnPropertyNames(Object.getPrototypeOf(ai.operations)));
}

async function run() {
  try {
    console.log("Iniciando geração de vídeo...");
    const result = await ai.models.generateVideos({
      model: "veo-2.0-generate-001",
      prompt: "A cinematic shot of a sunset over the ocean.",
      config: { aspectRatio: "16:9", personGeneration: "allow_all" }
    });
    console.log("Initial result:", JSON.stringify(result));

    console.log("ai.operations exists?", !!ai.operations);

    // Let's poll it
    let op = result;
    while (!op || !op.done) {
        console.log("Polling... Status:", op?.done ? "Done" : "Processing");
        await new Promise(r => setTimeout(r, 5000));
        try {
            console.log("Calling ai.operations.getVideosOperation({ operation: op })");
            const op2 = await ai.operations.getVideosOperation({ operation: op });
            if (op2) {
                op = op2;
                console.log("Updated op status:", op.done);
            }
        } catch (e) {
            console.log("Polling failed:", e.message);
            // Don't break on temporary errors
        }
    }
    console.log("Final result response:", JSON.stringify(op.response));
  } catch (err) {
    console.error("Error calling Veo:", err.message);
  }
}

run();
