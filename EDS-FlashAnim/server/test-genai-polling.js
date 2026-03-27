const { GoogleGenAI } = require('@google/genai');
const path = require('path');
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'chave-vertex.json');

const ai = new GoogleGenAI({ 
    vertexai: { project: 'eds-ultra-prod', location: 'us-central1' },
    project: 'eds-ultra-prod', 
    location: 'us-central1' 
});

async function test() {
    let op = await ai.models.generateVideos({ model: 'veo-2.0-generate-001', prompt: 'test', config: { personGeneration: 'DONT_ALLOW' }});
    console.log("Got op:", op.name);
    try {
        let op2 = await ai.operations.get({ name: op.name });
        console.log("get() success:", Object.keys(op2), op2.done);
    } catch(e) { console.log("get() error:", e.message); }
    
    try {
        let op3 = await ai.operations.getVideosOperation({ name: op.name });
        console.log("getVideosOperation({name}) success:", Object.keys(op3), op3.done);
    } catch(e) { console.log("getVideosOperation({name}) error:", e.message); }
    
    try {
        let op4 = await ai.operations.getVideosOperation({ operation: op.name });
        console.log("getVideosOperation({operation}) success:", Object.keys(op4), op4.done);
    } catch(e) { console.log("getVideosOperation({operation}) error:", e.message); }
    
    try {
        let op5 = await ai.operations.getVideosOperation({ operationId: op.name.split('/').pop() });
        console.log("getVideosOperation({operationId}) success:", Object.keys(op5), op5.done);
    } catch(e) { console.log("getVideosOperation({operationId}) error:", e.message); }
}
test();
