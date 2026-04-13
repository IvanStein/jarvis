
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBpJ3T0wV8BGodTL_SF6UfSezApgk2Qdfo"; // Sua chave
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('Listando modelos...');
        // O SDK do Node não tem um método direto listModels fácil sem o cliente de baixo nível,
        // então vamos tentar o gemini-2.0-flash-exp direto que é o mais provável de funcionar.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent("Oi");
        console.log('Gemini 2.0 Flash Exp Funciona!');
    } catch (e) {
        console.error('Gemini 2.0 Falhou:', e.message);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Oi");
            console.log('Gemini 1.5 Flash Funciona!');
        } catch (e2) {
            console.error('Gemini 1.5 Falhou:', e2.message);
        }
    }
}

listModels();
