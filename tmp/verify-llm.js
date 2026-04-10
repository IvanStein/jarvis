// tmp/verify-llm.js
const { callGemini } = require('../core/llm');

async function test() {
    try {
        console.log("--- Testando Conexão com Gemini ---");
        const response = await callGemini("Olá, AURA! Você está online?");
        console.log("Resposta recebida:");
        console.log(response);
        console.log("--- Teste concluído com sucesso ---");
    } catch (error) {
        console.error("Erro no teste:", error.message);
    }
}

test();
