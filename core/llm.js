
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

let genAI;

export function getModelInstance(customInstruction = null, overrideApiKey = null) {
    let apiKey = (overrideApiKey || process.env.GEMINI_API_KEY || "").toString().trim().replace(/^["']|["']$/g, '');
    
    if (!apiKey || apiKey === "undefined") {
        throw new Error("Configuração da API Gemini pendente. Por favor, cole uma chave válida no Dashboard.");
    }

    // Cria nova instância com a chave limpa
    const currentGenAI = new GoogleGenerativeAI(apiKey);

    const baseInstruction = `Você é AURA, um sistema inteligente com personalidade JARVIS.
FOCO ATUAL: ${customInstruction || "Gestão Geral e Auxílio ao Ivan Stein"}.
REGRAS: Seja conciso, técnico e sofisticado.`;

    return currentGenAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        },
        systemInstruction: baseInstruction
    });
}

/**
 * Chama o Gemini com suporte a especialistas e chaves manuais.
 */
export async function callGemini(prompt, history = [], specialistInstruction = null, fileData = null, overrideApiKey = null) {
    const activeModel = getModelInstance(specialistInstruction, overrideApiKey);

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
