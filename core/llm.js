import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

let genAI;
let model;

function initModel() {
    if (model) return model;

    // 1. Limpar a chave de aspas ou espaços acidentais
    const apiKey = process.env.GEMINI_API_KEY?.trim()?.replace(/^["']|["']$/g, '');
    
    // 2. Diagnóstico se a chave não for encontrada
    if (!apiKey) {
        const foundKeys = Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('SUPABASE'));
        const errorMsg = "Configuração da API Gemini pendente.";
        const debugInfo = {
            model: "gemini-2.5-flash-lite",
            keyFound: false,
            envKeysFound: foundKeys,
            runtime: "Node.js (Next.js API)"
        };
        
        console.warn(`❌ ${errorMsg}`, debugInfo);
        
        // Criar um erro especial com contexto de debug
        const error = new Error(errorMsg);
        error.debugContext = debugInfo;
        throw error;
    }
    
    // 3. Se chegou aqui, a chave existe.
    const maskedKey = apiKey.substring(0, 6) + "..." + apiKey.substring(apiKey.length - 4);
    console.log(`✅ API Gemini carregada: ${maskedKey} | Modelo: gemini-2.5-flash-lite`);

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
    // Chamar initModel que pode lançar o erro com debugContext
    const activeModel = initModel();

    try {
        const validatedPrompt = z.string().min(1).parse(prompt);
        
        // Formatar histórico para o Gemini
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
