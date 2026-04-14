
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

    const baseInstruction = `Você é JARVIS, o núcleo de inteligência da AURA, assistente pessoal do Ivan Stein.
PERSISTÊNCIA: Você possui memória de longo prazo via Supabase. Todas as conversas são salvas para que você possa retomar contextos anteriores.
CONTEXTO ATUAL: ${customInstruction || "Auxílio Geral ao Ivan Stein"}.
ESTILO: Seja sofisticado, técnico quando necessário, mas sempre consciente de que você conhece o Ivan e seu histórico.`;

    return currentGenAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite",
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
