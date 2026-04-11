// rag/ingest.js
import { getSupabase } from '../config/supabase.js';
import { YoutubeTranscript } from 'youtube-transcript-api';

/**
 * Adiciona conhecimento à biblioteca a partir de texto puro.
 */
export async function ingestKnowledge(text, metadata = {}) {
    const supabase = getSupabase();
    // Limpeza simples de texto
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // Quebrar em chunks de ~800 caracteres com sobreposição para não perder contexto
    const chunks = [];
    for (let i = 0; i < cleanText.length; i += 700) {
        chunks.push(cleanText.slice(i, i + 800));
    }

    console.log(`[RAG] Ingerindo ${chunks.length} pedaços de conhecimento...`);

    for (const chunk of chunks) {
        try {
            const { error } = await supabase
                .from('documents')
                .insert([{ 
                    content: chunk, 
                    metadata 
                }]);
            
            if (error) throw error;
        } catch (e) {
            console.error("Erro ao salvar chunk no Supabase:", e.message);
        }
    }
    return { success: true, chunks: chunks.length };
}

/**
 * Extrai a transcrição de um vídeo do YouTube e envia para a biblioteca.
 */
export async function learnFromYouTube(url) {
    try {
        console.log(`[RAG] Acessando transcrição de: ${url}`);
        
        // Extrair ID do vídeo
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        
        // Buscar transcrição
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'pt' });
        const fullText = transcriptItems.map(i => i.text).join(' ');

        // Ingerir o texto completo
        const result = await ingestKnowledge(fullText, {
            title: `Vídeo YouTube: ${videoId}`,
            url: url,
            type: 'youtube',
            date: new Date().toISOString()
        });

        return { 
            response: `✅ Ivan, terminei de processar o vídeo. Agora tenho ${result.chunks} novos fragmentos de conhecimento baseados nessa transcrição.`,
            success: true 
        };
    } catch (error) {
        console.error("Erro ao aprender com YouTube:", error);
        return { 
            response: `❌ Não consegui extrair a legenda deste vídeo. Verifique se ele possui legendas disponíveis (CC).`,
            success: false 
        };
    }
}
