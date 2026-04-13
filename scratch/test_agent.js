
import { runAgent } from '../core/agent.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        console.log('Testando runAgent...');
        const result = await runAgent('oi', 'test_user');
        console.log('Resultado:', result);
    } catch (error) {
        console.error('ERRO NO TESTE:', error);
    }
}

test();
