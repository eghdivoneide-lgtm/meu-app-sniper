const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const ai = new GoogleGenAI({ apiKey: "fake" });
let txt = "GET:\n" + ai.operations.get.toString() + "\n\nGETVIDEOS:\n" + ai.operations.getVideosOperation.toString();
fs.writeFileSync('dump.txt', txt);
