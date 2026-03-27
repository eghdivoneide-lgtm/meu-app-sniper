export interface GenerateRequest {
  imageDelta: string;
  style: string;
  colors: string[];
  prompt: string;
}

/**
 * Integração Real - Comunica direta com o Proxy Node.js Local 
 * que dispara o Replicate Model (ControlNet)
 */
export const generateArchitecturalDesign = async (req: GenerateRequest): Promise<string> => {
  console.log("Enviando imagem real para o Motor IA no Backend Local...");
  
  try {
    const response = await fetch('http://localhost:3001/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "A Rendeziracão falhou.");
    }

    return data.url;
  } catch (err) {
    console.error("Falha crística no serviço de I.A.:", err);
    throw err;
  }
};
