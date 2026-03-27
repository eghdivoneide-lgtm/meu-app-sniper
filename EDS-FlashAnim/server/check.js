const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: "fake" });

console.log(ai.operations ? Object.keys(ai.operations) : "No operations module");
if (ai.operations && ai.operations.get) {
  console.log(ai.operations.get.toString());
}
