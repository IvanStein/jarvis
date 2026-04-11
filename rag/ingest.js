// rag/ingest.js
import { getSupabase } from '../config/supabase.js';
import * as YT from 'youtube-transcript-api';
import * as PDFParse from 'pdf-parse';

// Detectar se é importação default ou módulo cheio (Garante compatibilidade Vercel/ESM)
const YoutubeTranscript = YT.default || (YT.YoutubeTranscript) || YT;
const pdf = PDFParse.default || PDFParse;

/**
 * Adiciona conhecimento à biblioteca a partir de texto puro.
 */
export async function ingestKnowledge(text, metadata = {}) {
    const supabase = getSupabase();
    if (!text) return { success: false, chunks: 0 };
    
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const chunks = [];
    for (let i = 0; i < cleanText.length; i += 700) {
        chunks.push(cleanText.slice(i, i + 800));
    }

    console.log(`[RAG] Ingerindo ${chunks.length} pedaços...`);

    for (const chunk of chunks) {
        try {
            const { error } = await supabase
                .from('documents')
                .insert([{ content: chunk, metadata }]);
            if (error) throw error;
        } catch (e) {
            console.error("Erro ao salvar chunk:", e.message);
        }
    }
    return { success: true, chunks: chunks.length };
}

/**
 * Extrai a transcrição de um vídeo do YouTube.
 */
export async function learnFromYouTube(url) {
    try {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'pt' });
        const fullText = transcriptItems.map(i => i.text).join(' ');

        const result = await ingestKnowledge(fullText, {
            title: `Vídeo YouTube: ${videoId}`,
            url,
            type: 'youtube',
            date: new Date().toISOString()
        });

        return { response: `✅ Conhecimento do vídeo absorvido (${result.chunks} fragmentos).`, success: true };
    } catch (error) {
        return { response: `❌ Erro nas legendas: ${error.message}`, success: false };
    }
}

/**
 * Extrai texto de um arquivo PDF.
 */
export async function learnFromPDF(fileBuffer, fileName) {
    try {
        // Chamar o pdf-parse de forma segura
        const data = await pdf(fileBuffer);
        
        const result = await ingestKnowledge(data.text, {
            title: `PDF: ${fileName}`,
            type: 'pdf',
            pages: data.numpages,
            date: new Date().toISOString()
        });

        return { 
            response: `📚 **Conhecimento Absorvido**\n\nIvan, o arquivo "${fileName}" foi processado. Li as ${data.numpages} páginas e agora tenho mais ${result.chunks} fragmentos de dados.`,
            success: true 
        };
    } catch (error) {
        console.error("Erro PDF:", error);
        return { response: `❌ Erro ao processar PDF: ${error.message}`, success: false };
    }
}
