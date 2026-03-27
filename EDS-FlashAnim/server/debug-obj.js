const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: "fake" });

const methods = {};
if (ai.operations) {
  let proto = Object.getPrototypeOf(ai.operations);
  methods.ops = Object.getOwnPropertyNames(proto);
}
if (ai.models) {
  let proto = Object.getPrototypeOf(ai.models);
  methods.models = Object.getOwnPropertyNames(proto);
}

fs.writeFileSync('obj.json', JSON.stringify(methods, null, 2));
