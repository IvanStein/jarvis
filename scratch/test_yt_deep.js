
import * as YTNamespace from 'youtube-transcript-api';
const YT = YTNamespace.default || YTNamespace;

console.log('Tipo de YT:', typeof YT);
console.log('YT.fetchTranscript:', typeof YT.fetchTranscript);

if (typeof YT === 'function') {
    try {
        console.log('Tentando instanciar YT...');
        const instance = new YT();
        console.log('Instância criada. Métodos:', Object.keys(Object.getPrototypeOf(instance)));
        console.log('instancia.fetchTranscript:', typeof instance.fetchTranscript);
    } catch(e) {
        console.log('Não é instanciável:', e.message);
    }
}
