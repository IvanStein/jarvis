const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY não encontrada no arquivo .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-lite-preview-02-05", // Modelo solicitado: Gemini 2.0 Flash Lite (ou 2.5 conforme sua preferência, usando a versão estável disponível)
    systemInstruction: "Você é AURA, um assistente inteligente pessoal.\n\nRegras:\n- Seja direto\n- Use contexto disponível\n- Use tools quando necessário\n- Aprenda com o usuário"
});




/**
 * Chama o Gemini para processar um prompt.
 * @param {string} prompt - O input do usuário.
 * @returns {Promise<string>} - A resposta da IA.
 */
async function callGemini(prompt) {
    try {
        const validatedPrompt = z.string().min(1).parse(prompt);

        const result = await model.generateContent(validatedPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro detalhado do Gemini:", error);
        if (error instanceof z.ZodError) {
            throw new Error("Prompt inválido: o conteúdo não pode estar vazio.");
        }
        throw new Error("Falha na comunicação com a AURA. Verifique sua chave de API e conexão.");
    }

}

module.exports = { callGemini };

