const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
require('dotenv').config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function run() {
    try {
        console.log("Starting a dummy generation to test polling...");
        const reqOptions = {
            model: "veo-2.0-generate-001",
            prompt: "A cool cinematic shot of a city in the night",
            config: { aspectRatio: "16:9" }
        };
        let op = await ai.models.generateVideos(reqOptions);
        console.log("Operation name starting:", op.name);

        console.log("Immediately polling it...");
        try {
            const currentOp = await ai.operations.getOperation({ name: op.name });
            console.log("Poll success!", currentOp.done ? "DONE" : "PENDING");
            fs.writeFileSync('success.json', JSON.stringify(currentOp, null, 2));
        } catch(e) {
            console.log("Poll ERROR =>", e.message, "\n", e.status);
            fs.writeFileSync('error-poll.json', JSON.stringify({message: e.message, status: e.status, stack: e.stack}, null, 2));
        }

    } catch(err) {
        console.log("Outer error:", err.message);
        fs.writeFileSync('error-outer.json', JSON.stringify({message: err.message, stack: err.stack}, null, 2));
    }
}
run();
