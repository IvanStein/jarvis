import { callGemini } from '../core/llm.js';

async function run() {
    try {
        console.log('Tentando chamar o Gemini...');
        const res = await callGemini('Olá, responda com uma palavra.');
        console.log('Sucesso!', res);
    } catch (e) {
        console.error('Falha esperada/inesperada:', e.message);
    }
}

run();
