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

    // [NOVO] DETECÇÃO DE FATOS (Memória de Longo Prazo Orgânica)
    try {
        const factPrompt = `Analise a frase do usuário. Se ele estiver informando um dado pessoal permanente ou importante sobre si mesmo (ex: data de nascimento, nome, profissão, gostos), resuma isso em uma frase curta (Ex: "O usuário nasceu em 10/10/1990"). Se NÃO houver dado pessoal permanente, responda EXATAMENTE com a palavra "NENHUM".\n\nFrase: "${userInput}"`;
        const factCheck = await callGemini(factPrompt, [], "Você é um analisador de dados de memória.", null, overrideApiKey);
        const factResult = factCheck?.trim() || "NENHUM";
        
        if (factResult && !factResult.toUpperCase().includes("NENHUM") && factResult.length > 5) {
            const { saveFact } = await import('../memory/memory.js');
            await saveFact(userId, factResult);
            console.log(`[MEMÓRIA] Dado permanente aprendido: ${factResult}`);
        }
    } catch(e) {
        console.warn("[MEMÓRIA] Falha na extração de fatos orgânica:", e.message);
    }

    // 4. Buscar memórias e histórico (antes de salvar a nova mensagem do usuário)
    const userFacts = await getUserFacts(userId);
    const recentHistory = await getLastMessages(userId, 5, conversationId);
    
    // Salva a mensagem do usuário antes de chamar a API (se a API falhar, não perdemos o input)
    const userSave = await saveMessage(userId, 'user', userInput, conversationId);
    if (userSave?.error) console.error("[CRITICAL] Falha ao salvar user msg:", userSave.error);

    // 5. Chamada ao LLM
    const contextPrefix = userFacts ? `[MEMÓRIA DE IVAN: ${userFacts}]\n` : "";
    const responseText = await callGemini(userInput, recentHistory, `${specialistInstructions}\n${contextPrefix}`, null, overrideApiKey);
    
    // Salva a resposta da IA
    const asstSave = await saveMessage(userId, 'assistant', responseText, conversationId);
    if (asstSave?.error) console.error("[CRITICAL] Falha ao salvar asst msg:", asstSave.error);
    
    return { 
        response: responseText, 
        module: dbConfig ? dbConfig.name : (specialistKey || "Jarvis"),
        dbError: userSave?.error || asstSave?.error 
    };
}
