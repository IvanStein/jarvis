// core/agent.js
import { callGemini } from './llm.js';
import { saveMessage, getLastMessages, getUserFacts, getSpecialistConfig, updateSpecialistConfig } from '../memory/memory.js';
import { SPECIALISTS, routeToSpecialist } from './specialists.js';
import { learnFromYouTube } from '../rag/ingest.js';
import { transcribeAdvanced } from '../rag/transcribe.js';

export async function runAgent(userInput, userId) {
    console.log(`[ORQUESTRADOR] Analisando requisição...`);

    // 1. Comando de TREINAMENTO de Especialista
    if (userInput.startsWith('/treinar')) {
        const parts = userInput.split(':');
        if (parts.length >= 2) {
            const specialistId = parts[0].replace('/treinar', '').trim().toUpperCase();
            const newContent = parts.slice(1).join(':').trim();
            const success = await updateSpecialistConfig(specialistId, newContent);
            if (success) return { response: `✅ Módulo ${specialistId} recalibrado.`, module: "Sistema" };
        }
    }

    // 2. Detecção de APRENDIZAGEM e TRANSCRIÇÃO (YouTube)
    if (userInput.toLowerCase().includes('youtube.com') || userInput.toLowerCase().includes('youtu.be')) {
        const urlMatch = userInput.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
            const result = await transcribeAdvanced(urlMatch[0], userId);
            return { response: result, module: "Transcrição" };
        }
    }

    // 3. Identificar o especialista necessário
    const specialistKey = routeToSpecialist(userInput);
    const dbConfig = await getSpecialistConfig(specialistKey);
    const specialistInstructions = dbConfig ? dbConfig.instruction : (SPECIALISTS[specialistKey]?.instruction || "Agindo como Jarvis (Geral)");

    // 4. Buscar memórias e histórico
    const userFacts = await getUserFacts(userId);
    const recentHistory = await getLastMessages(userId, 5);
    
    // 5. Chamada ao LLM
    const contextPrefix = userFacts ? `[MEMÓRIA DE IVAN: ${userFacts}]\n` : "";
    const responseText = await callGemini(userInput, recentHistory, `${specialistInstructions}\n${contextPrefix}`);
    
    await saveMessage(userId, 'user', userInput);
    await saveMessage(userId, 'assistant', responseText);
    
    return { response: responseText, module: dbConfig ? dbConfig.name : (specialistKey || "Jarvis") };
}
