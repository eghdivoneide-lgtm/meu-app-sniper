const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    try {
        let op = await ai.models.generateVideos({
            model: "veo-2.0-generate-001",
            prompt: "A beautiful sunset",
            config: { aspectRatio: "16:9" }
        });
        
        console.log("Got op:", op.name);
        
        // Extract JUST the operation ID
        const parts = op.name.split('/');
        const opId = parts[parts.length - 1];
        
        // REST poll
        const url1 = `https://generativelanguage.googleapis.com/v1beta/operations/${opId}?key=${process.env.GEMINI_API_KEY}`;
        const url2 = `https://generativelanguage.googleapis.com/v1alpha/operations/${opId}?key=${process.env.GEMINI_API_KEY}`;
        const url3 = `https://generativelanguage.googleapis.com/v1beta/tuningJobs/${opId}?key=${process.env.GEMINI_API_KEY}`;
        
        console.log("Polling URL1:", url1);
        try {
            const r1 = await axios.get(url1);
            console.log("URL1 success:", r1.data);
        } catch(e) { console.log("URL1 failed:", e.response?.data?.error?.message || e.message); }
        
        console.log("Polling URL2:", url2);
        try {
            const r2 = await axios.get(url2);
            console.log("URL2 success:", r2.data);
        } catch(e) { console.log("URL2 failed:", e.response?.data?.error?.message || e.message); }

    } catch(err) {
        console.error("Fatal:", err.message);
    }
}
test();
