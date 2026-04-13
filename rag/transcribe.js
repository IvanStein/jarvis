
import fs from 'fs';
import path from 'path';
import ytdl from '@distube/ytdl-core';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { callGemini } from '../core/llm.js';

/**
 * Baixa o áudio de um vídeo, transcreve usando Gemini e gera insights.
 */
export async function transcribeAdvanced(url, userId) {
    const TmpPath = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(TmpPath)) {
        fs.mkdirSync(TmpPath, { recursive: true });
    }
    
    const videoId = url.split('v=')[1]?.split('&')[0] || Date.now().toString();
    const filePath = path.join(TmpPath, `${videoId}.mp3`);

    console.log(`[TRANSCREVER] Iniciando processo para: ${url}`);

    try {
        // 1. Download do áudio
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        const fileStream = fs.createWriteStream(filePath);
        
        await new Promise((resolve, reject) => {
            stream.pipe(fileStream);
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        console.log(`[TRANSCREVER] Download concluído: ${filePath}`);

        // 2. Upload para o Gemini (File API)
        const apiKey = process.env.GEMINI_API_KEY?.trim()?.replace(/^["']|["']$/g, '');
        const fileManager = new GoogleAIFileManager(apiKey);
        
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: "audio/mp3",
            displayName: `AURA_TRANSCRIPT_${videoId}`,
        });

        console.log(`[TRANSCREVER] Arquivo enviado para Gemini: ${uploadResult.file.uri}`);

        // 3. Processamento e Insights
        const prompt = "Transcreva este áudio na íntegra em português. Após a transcrição, extraia os 5 principais insights, tópicos abordados e faça um resumo executivo para o Ivan Stein.";
        
        const responseText = await callGemini(prompt, [], "Especialista em Transcrição e Análise", {
            mimeType: uploadResult.file.mimeType,
            fileUri: uploadResult.file.uri
        });

        // 4. Limpeza (Cleanup) - Deletar do disco local
        try {
            fs.unlinkSync(filePath);
            await fileManager.deleteFile(uploadResult.file.name);
            console.log(`[TRANSCREVER] Cleanup concluído para ${videoId}`);
        } catch (cleanupErr) {
            console.warn(`[TRANSCREVER] Aviso no cleanup: ${cleanupErr.message}`);
        }

        return responseText;
    } catch (error) {
        console.error("[TRANSCREVER] Erro crítico:", error);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return `❌ Falha na transcrição avançada: ${error.message}`;
    }
}
