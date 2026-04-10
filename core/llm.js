// core/llm.js
const { axios } = require('axios');

async function callGemini(prompt) {
    // Implementar integração com Gemini API
    console.log("Chamando Gemini com:", prompt);
    return "Resposta da AURA";
}

module.exports = { callGemini };
