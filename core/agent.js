// core/agent.js
import { callGemini } from './llm.js';
import { saveMessage, getLastMessages } from '../memory/memory.js';

export async function runAgent(userInput, userId) {
    console.log(`Rodando agente para o usuário ${userId}: ${userInput}`);
    
    // 1. Buscar memória (Contexto)
    const history = await getLastMessages(userId, 10);
    
    // 2. Buscar contexto (RAG - Futuro)
    
    // 3. Decidir tools (Skills - Futuro)
    
    // 4. Chamar LLM com o histórico
    const responseText = await callGemini(userInput, history);
    
    // 5. Salvar memória (A pergunta e a resposta)
    await saveMessage(userId, 'user', userInput);
    await saveMessage(userId, 'assistant', responseText);
    
    return { response: responseText };
}
