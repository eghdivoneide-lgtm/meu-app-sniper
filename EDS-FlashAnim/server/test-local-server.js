const axios = require('axios');

async function testServer() {
    try {
        console.log("Enviando requisição para o servidor local (http://localhost:3001/api/generate-video)...");
        const res = await axios.post('http://localhost:3001/api/generate-video', {
            prompt: "A short cinematic scene of a flying car.",
        }, {
            timeout: 300000 // 5 minutos de timeout
        });
        console.log("SUCESSO!!!");
        if (res.data.videos && res.data.videos.length > 0) {
            console.log("Recebidos", res.data.videos.length, "vídeos. Tamanho do vídeo 1:", res.data.videos[0].videoBase64.length, "caracteres na string Base64.");
        } else {
            console.log("Sem vídeos?");
            console.log(res.data);
        }
    } catch (err) {
        console.error("ERRO ao testar o servidor local:");
        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testServer();
