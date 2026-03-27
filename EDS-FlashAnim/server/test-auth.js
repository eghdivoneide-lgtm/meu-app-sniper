const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + '/chave-vertex.json';

async function test() {
    try {
        console.log("Authenticating via Service Account...");
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        
        console.log("Token acquired!");
        
        const urlGen = `https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:generateVideos`;
        const headers = { 'Authorization': `Bearer ${accessToken.token}`, 'Content-Type': 'application/json' };
        const body = { prompt: "Test", model: "models/veo-2.0-generate-001" };
        
        console.log("Req generation...");
        const res1 = await axios.post(urlGen, body, { headers });
        console.log("Res1:", res1.data);
        
        const opName = res1.data.name;
        console.log("Operation:", opName);
        
        console.log("Polling OAuth...");
        const urlPoll = `https://generativelanguage.googleapis.com/v1beta/${opName}`;
        const res2 = await axios.get(urlPoll, { headers });
        console.log("Poll SUCCESS:", Object.keys(res2.data));
    } catch(err) {
        fs.writeFileSync('error-vertex.json', JSON.stringify(err.response ? err.response.data : err.message, null, 2));
        console.error("Test Failed Vertex Auth:", err.message);
    }
}
test();
