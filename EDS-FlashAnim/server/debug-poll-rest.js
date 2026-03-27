const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    console.log("Starting GenAI Veo request...");
    let op = await ai.models.generateVideos({
        model: "veo-2.0-generate-001",
        prompt: "A cinematic shot of a sunset",
        config: { aspectRatio: "16:9" }
    });
    console.log("Operation name:", op.name);
    try {
        console.log("Polling with REST API...");
        let res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/${op.name}?key=${process.env.GEMINI_API_KEY}`);
        fs.writeFileSync('rest-success.json', JSON.stringify(res.data, null, 2));
        console.log("REST Poll success! Status:", res.data.done ? "DONE" : "PENDING");
    } catch(err) {
        console.log("REST Poll error", err.message);
        fs.writeFileSync('rest-error.json', JSON.stringify(err.response?.data || {error: err.message}, null, 2));
    }
}
test();
