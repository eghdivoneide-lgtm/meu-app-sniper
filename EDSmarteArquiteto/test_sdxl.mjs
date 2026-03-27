import Replicate from 'replicate';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const replicate = new Replicate({ auth: process.env.VITE_REPLICATE_API_TOKEN });
const b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
async function run() {
  try {
    let res = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", 
      {
        input: { 
          image: b64, 
          prompt: 'test', 
          prompt_strength: 0.65,
          negative_prompt: 'bad', 
          num_inference_steps: 25, 
          guidance_scale: 7.5 
        }
      }
    );
    console.log("Success:", res);
  } catch(e) { console.error('Error:', e.message); }
}
run();
