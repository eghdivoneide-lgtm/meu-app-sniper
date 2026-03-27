const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    try {
        console.log("Starting generation...");
        let op = await ai.models.generateVideos({
            model: "veo-2.0-generate-001",
            prompt: "Test prompt 123",
            config: { aspectRatio: "16:9" }
        });
        
        console.log("Got op:", op.name);
        try {
            const poll1 = await ai.operations.getVideosOperation({ operation: op });
            console.log("Poll 1 object op success");
        } catch(e) { console.error("Poll 1 err:", e.message); }
        
        try {
            const poll2 = await ai.operations.getVideosOperation({ operation: op.name });
            console.log("Poll 2 string op success");
        } catch(e) { console.error("Poll 2 err:", e.message); }
        
        try {
            const poll3 = await ai.operations.getVideosOperation({ name: op.name });
            console.log("Poll 3 object name success");
        } catch(e) { console.error("Poll 3 err:", e.message); }
        
        try {
            const poll4 = await ai.operations.getOperation?.({ name: op.name });
            console.log("Poll 4 getOperation name success");
        } catch(e) { console.error("Poll 4 err:", e.message); }
    } catch(err) {
        console.error("Fatal:", err.message);
    }
}
test();
