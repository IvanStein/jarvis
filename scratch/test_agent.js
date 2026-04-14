import 'dotenv/config';
import { runAgent } from '../core/agent.js';

async function testAgent() {
    process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "TEST";
    const res = await runAgent("Jarvis, lembrete importante: meu cpf é 123456789", "ivan_stein", "test12345", process.env.GEMINI_API_KEY);
    console.log("Response:", res);
}
testAgent();
