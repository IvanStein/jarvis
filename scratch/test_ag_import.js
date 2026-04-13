
async function test() {
    try {
        console.log('Tentando carregar transcribe.js...');
        const mod = await import('../rag/transcribe.js');
        console.log('Módulo carregado com sucesso!', Object.keys(mod));
    } catch (e) {
        console.error('ERRO AO CARREGAR:', e.message);
        console.error('Stack:', e.stack);
    }
}
test();
