import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

let genAI;

function getModelInstance(customInstruction = null) {
    const apiKey = process.env.GEMINI_API_KEY?.trim()?.replace(/^["']|["']$/g, '');
    
    if (!apiKey) {
        const error = new Error("Configuração da API Gemini pendente.");
        error.debugContext = { keyFound: false, envKeys: Object.keys(process.env).filter(k => k.includes('GEMINI')) };
        throw error;
    }

    if (!genAI) genAI = new GoogleGenerativeAI(apiKey);

    const baseInstruction = `Você é AURA, um sistema inteligente com personalidade JARVIS.
FOCO ATUAL: ${customInstruction || "Gestão Geral e Auxílio ao Ivan Stein"}.
REGRAS: Seja conciso, técnico e sofisticado. Use o histórico e contexto aprendido para economizar tokens.`;

    return genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite",
        systemInstruction: baseInstruction
    });
}

/**
 * Chama o Gemini com suporte a especialistas.
 */
export async function callGemini(prompt, history = [], specialistInstruction = null) {
    const activeModel = getModelInstance(specialistInstruction);

    try {
        const validatedPrompt = z.string().min(1).parse(prompt);
        const chatHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = activeModel.startChat({ history: chatHistory });
        const result = await chat.sendMessage(validatedPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro no Gemini:", error.message, error.stack);
        throw new Error(`Erro na AURA: ${error.message}`);
    }
}
