
import TranscriptClient from 'youtube-transcript-api';

async function test() {
    const client = new TranscriptClient();
    await client.ready;
    console.log('Cliente pronto.');
    
    const videoId = 'dQw4w9WgXcQ'; // Teste com um vídeo clássico
    try {
        const transcript = await client.getTranscript(videoId);
        console.log('Transcript recebido:', typeof transcript);
        if (transcript) {
            console.log('Keys do objeto:', Object.keys(transcript));
            // Provavelmente tem 'transcript' ou 'content'
        }
    } catch (e) {
        console.error('Erro no teste:', e.message);
    }
}

test();
