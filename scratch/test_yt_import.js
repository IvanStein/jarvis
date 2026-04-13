
import YT from 'youtube-transcript-api';
import * as YTScope from 'youtube-transcript-api';

console.log('--- TESTE DE IMPORT YOUTUBE ---');
console.log('Default import:', typeof YT, YT ? Object.keys(YT) : 'null');
console.log('Namespace import:', typeof YTScope, Object.keys(YTScope));

try {
    const YoutubeTranscript = YT || YTScope.YoutubeTranscript || YTScope;
    console.log('YoutubeTranscript detectado:', typeof YoutubeTranscript);
    if (YoutubeTranscript) {
        console.log('Métodos disponíveis:', Object.keys(YoutubeTranscript));
    }
} catch (e) {
    console.error('Erro ao acessar YoutubeTranscript:', e.message);
}
