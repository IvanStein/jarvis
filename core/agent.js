import { callGemini } from './llm.js';
import { saveMessage, getLastMessages, getUserFacts, getSpecialistConfig, updateSpecialistConfig } from '../memory/memory.js';
import { SPECIALISTS, routeToSpecialist } from './specialists.js';
import { learnFromYouTube } from '../rag/ingest.js';

export async function runAgent(userInput, userId, conversationId = 'default', overrideApiKey = null) {
    console.log(`[ORQUESTRADOR] Analisando requisição...`);
    
    // Import dinâmico para evitar quebra de inicialização se a lib de áudio falhar
    const { transcribeAdvanced } = await import('../rag/transcribe.js').catch(err => {
        console.error('Erro ao carregar módulo de transcrição:', err.message);
        return { transcribeAdvanced: null };
    });

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
            if (!transcribeAdvanced) {
                console.log('[AGENT] Usando fallback de legendas...');
                const result = await learnFromYouTube(urlMatch[0]);
                return { response: `⚠️ **Aviso**: Módulo de áudio indisponível. Extraindo legendas como alternativa...\n\n${result.response}`, module: "RAG" };
            }
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
    const recentHistory = await getLastMessages(userId, 5, conversationId);
    
    // 5. Chamada ao LLM
    const contextPrefix = userFacts ? `[MEMÓRIA DE IVAN: ${userFacts}]\n` : "";
    const responseText = await callGemini(userInput, recentHistory, `${specialistInstructions}\n${contextPrefix}`, null, overrideApiKey);
    
    await saveMessage(userId, 'user', userInput, conversationId);
    await saveMessage(userId, 'assistant', responseText, conversationId);
    
    return { response: responseText, module: dbConfig ? dbConfig.name : (specialistKey || "Jarvis") };
}
