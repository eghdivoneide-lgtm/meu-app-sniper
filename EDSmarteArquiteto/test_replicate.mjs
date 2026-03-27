import Replicate from 'replicate';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const replicate = new Replicate({
  auth: process.env.VITE_REPLICATE_API_TOKEN,
});

async function main() {
  try {
    const errorImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    console.log("Starting test...");
    const output = await replicate.run(
      "jagilley/controlnet-hough",
      {
        input: {
          image: errorImageBase64,
          prompt: "test architect",
          a_prompt: "test",
          n_prompt: "test",
          num_samples: "1",
          image_resolution: "768",
          detect_resolution: "768",
          ddim_steps: 30,
          scale: 9.0
        }
      }
    );
    console.log("Success:", output);
  } catch (err) {
    console.error("API ERROR:", err.message);
    if (err.response) {
      console.error(await err.response.text());
    }
  }
}
main();
