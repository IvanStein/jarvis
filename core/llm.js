
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

let genAI;

export function getModelInstance(customInstruction = null) {
    const apiKey = process.env.GEMINI_API_KEY?.trim()?.replace(/^["']|["']$/g, '');
    
    if (!apiKey) {
        throw new Error("Configuração da API Gemini pendente.");
    }

    if (!genAI) genAI = new GoogleGenerativeAI(apiKey);

    const baseInstruction = `Você é AURA, um sistema inteligente com personalidade JARVIS.
FOCO ATUAL: ${customInstruction || "Gestão Geral e Auxílio ao Ivan Stein"}.
REGRAS: Seja conciso, técnico e sofisticado.`;

    return genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite",
        systemInstruction: baseInstruction
    });
}

/**
 * Chama o Gemini com suporte a especialistas e arquivos.
 */
export async function callGemini(prompt, history = [], specialistInstruction = null, fileData = null) {
    const activeModel = getModelInstance(specialistInstruction);

    try {
        const validatedPrompt = z.string().min(1).parse(prompt);
        const chatHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        if (fileData) {
            // Se houver arquivo, não usamos chat history simples, usamos generateContent direto
            const content = [
                { fileData: { mimeType: fileData.mimeType, fileUri: fileData.fileUri } },
                { text: validatedPrompt }
            ];
            const result = await activeModel.generateContent(content);
            return result.response.text();
        }

        const chat = activeModel.startChat({ history: chatHistory });
        const result = await chat.sendMessage(validatedPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro no Gemini:", error.message);
        throw new Error(`Erro na AURA: ${error.message}`);
    }
}
