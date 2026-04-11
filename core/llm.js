import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

let genAI;
let model;

function initModel() {
    if (model) return model;

    // Limpar a chave de aspas ou espaços acidentais
    const apiKey = process.env.GEMINI_API_KEY?.trim()?.replace(/^["']|["']$/g, '');
    
    if (!apiKey) {
        const foundKeys = Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('SUPABASE'));
        console.warn("❌ Erro: GEMINI_API_KEY não encontrada no process.env ou está vazia.");
        console.log("Variáveis de ambiente relacionadas que foram encontradas:", foundKeys.length > 0 ? foundKeys.join(', ') : 'NENHUMA');
        console.log("DICA: Verifique se o nome no Vercel é exatamente GEMINI_API_KEY e se você fez o REDEPLOY.");
        return null;
    }
    
    console.log(`API Gemini configurada com sucesso (Tamanho: ${apiKey.length}).`);

    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite",
        systemInstruction: "Você é AURA, um assistente inteligente pessoal.\n\nRegras:\n- Seja direto\n- Use contexto disponível\n- Use tools quando necessário\n- Aprenda com o usuário"
    });
    return model;
}

/**
 * Chama o Gemini para processar um prompt com histórico.
 * @param {string} prompt - O input do usuário.
 * @param {Array} history - Array de mensagens passadas [{ role: 'user', content: '...' }, ...]
 * @returns {Promise<string>} - A resposta da IA.
 */
export async function callGemini(prompt, history = []) {
    const activeModel = initModel();
    if (!activeModel) {
        throw new Error("Configuração da API Gemini pendente.");
    }

    try {
        const validatedPrompt = z.string().min(1).parse(prompt);
        
        // Formatar histórico para o Gemini (ele espera roles específicas e partes)
        const chatHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = activeModel.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(validatedPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro detalhado do Gemini:", error);
        throw new Error(`Erro na AURA: ${error.message || 'Falha na comunicação'}`);
    }
}

