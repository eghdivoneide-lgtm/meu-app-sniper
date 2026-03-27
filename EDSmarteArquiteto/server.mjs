import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Replicate from 'replicate';

// Carrega as chaves do .env.local
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
// Aumenta o limite pois imagens em Base64 são pesadas
app.use(express.json({ limit: '50mb' }));

const replicate = new Replicate({
  auth: process.env.VITE_REPLICATE_API_TOKEN,
});

app.post('/generate', async (req, res) => {
  try {
    const { imageDelta, style, prompt } = req.body;
    
    console.log(`[Replicate] Recebendo requisição nova... Estilo: ${style}`);
    
    // Melhoramos o Prompt de acordo com a premissa de arquitetura requerida
    const enhancedPrompt = `A stunning and fully finished architectural redesign of a ${style} style building. ${prompt}. High-end renovation, exterior facade, photorealistic, 8k resolution, professional architectural photography, award winning exterior design.`;

    console.log("Prompt aprimorado:", enhancedPrompt);

    // MÁGICA FINAL: O modelo antigo (ControlNet Hough) foi removido dos servidores públicos da Replicate (Erro 404).
    // Substituímos pelo super poderoso SDXL em modo Image-to-Image. 
    // Usando prompt_strength = 0.65 preservamos a estrutura base do prédio e apenas mudamos o acabamento.
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: imageDelta,
          prompt: enhancedPrompt,
          negative_prompt: "crooked lines, warped perspective, bad architecture, messy structure, noisy, blurry, out of focus, deformed, ugly, sketch, painting, cartoon, cgi, overexposed, bad proportions, watermark, text",
          prompt_strength: 0.65, // <-- Crucial para manter a forma original e aplicar revestimento novo
          num_inference_steps: 30, // Mais passos = alta qualidade
          guidance_scale: 7.5     // Obediência ao prompt
        }
      }
    );

    console.log("Saída bruta do Replicate:", output);

    // Em novas versões do SDK do Replicate, a saída pode ser um array de ReadableStreams ou Strings.
    let generatedUrl = '';
    const finalOutput = Array.isArray(output) ? output[output.length - 1] : output;
    
    // Extrai a URL primária caso seja um objeto Stream retornado pela API
    if (typeof finalOutput === 'string') {
      generatedUrl = finalOutput;
    } else if (finalOutput && typeof finalOutput.url === 'function') {
      generatedUrl = finalOutput.url().toString(); // Retorna a string pura
    } else {
      generatedUrl = String(finalOutput);
    }
    
    console.log("[Replicate] Renderização Concluída com Sucesso! URL:", generatedUrl);
    res.json({ success: true, url: generatedUrl });

  } catch (error) {
    console.error("[ERRO] Falha na API Replicate:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Integração da IA rodando na porta ${PORT}`);
});
