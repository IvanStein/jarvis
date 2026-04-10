// core/agent.js
import { callGemini } from './llm';

export async function runAgent(userInput, userId) {
    console.log(`Rodando agente para o usuário ${userId}: ${userInput}`);
    
    // 1. Buscar memória
    // 2. Buscar contexto (RAG)
    // 3. Decidir tools
    // 4. Chamar LLM
    const response = await callGemini(userInput);
    
    // 5. Salvar memória
    
    return { response };
}
