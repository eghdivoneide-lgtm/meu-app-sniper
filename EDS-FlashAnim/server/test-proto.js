const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    let response = await ai.models.generateVideos({
        model: "veo-2.0-generate-001",
        prompt: "A tiny cute cat",
        config: { aspectRatio: "16:9" }
    });
    console.log("Returned Keys:", Object.keys(response));
    console.log("Is operation?", !!response.name);
    console.log("Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(response)));
}
test();
