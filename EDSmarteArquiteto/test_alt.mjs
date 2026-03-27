import Replicate from 'replicate';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const replicate = new Replicate({ auth: process.env.VITE_REPLICATE_API_TOKEN });
const b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
async function run() {
  try {
    let res = await replicate.run(
      "rossjillian/controlnet:792c3eb1edefe3701aeff2bbbc556c3ee6811218520e5ff305d21aee76cddf30", 
      {
        input: { image: b64, prompt: 'test', structure: 'mlsd', a_prompt: 'best', n_prompt: 'bad', num_samples: "1", image_resolution: "512" }
      }
    );
    console.log("Success:", res);
  } catch(e) { console.error('Error:', e.message); }
}
run();
