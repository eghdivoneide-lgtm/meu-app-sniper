const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + '/chave-vertex.json';

async function test() {
    try {
        console.log("Authenticating via Service Account (Vertex LRO)...");
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        
        console.log("Token acquired! Generating LRO...");
        
        const urlGen = `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/eds-ultra-prod/locations/us-central1/publishers/google/models/veo-2.0-generate-001:predictLongRunning`;
        const headers = { 'Authorization': `Bearer ${accessToken.token}`, 'Content-Type': 'application/json' };
        
        const body = {
            instances: [
                { prompt: "A cute little cat playing with yarn" }
            ],
            parameters: {
                aspectRatio: "16:9",
                personGeneration: "DONT_ALLOW"
            }
        };
        
        const res1 = await axios.post(urlGen, body, { headers });
        const opName = res1.data.name; // projects/.../operations/ee...
        const parts = opName.split('/');
        const opId = parts[parts.length - 1]; 
        
        console.log("Operation generated! Waiting 3s...");
        await new Promise(r => setTimeout(r, 3000));
        
        const urls = [
            `https://us-central1-aiplatform.googleapis.com/v1beta1/${opName}`,
            `https://us-central1-aiplatform.googleapis.com/v1/${opName}`,
            `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/eds-ultra-prod/locations/us-central1/operations/${opId}`,
            `https://us-central1-aiplatform.googleapis.com/v1/projects/eds-ultra-prod/locations/us-central1/operations/${opId}`
        ];
        
        const results = [];
        for (let i = 0; i < urls.length; i++) {
            console.log(`Polling URL ${i+1}`);
            try {
                const res = await axios.get(urls[i], { headers });
                results.push({ url: urls[i], status: res.status, success: true, data: res.data });
            } catch(e) {
                results.push({ url: urls[i], status: e.response?.status, success: false, error: e.response?.data?.error?.message || e.message });
            }
        }
        fs.writeFileSync('test-vertex-log.json', JSON.stringify({opName: opName, results}, null, 2));
        
    } catch(err) {
        console.error("Test Failed Vertex Auth:", err.message);
    }
}
test();
