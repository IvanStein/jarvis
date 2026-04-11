import 'dotenv/config';
import fs from 'fs';
import path from 'path';

console.log('--- DIAGNÓSTICO DE AMBIENTE ---');
console.log('Project Root Key:', !!process.env.GEMINI_API_KEY);
console.log('Key prefix:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 7) : 'N/A');

const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
    console.log('.env found in root');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('.env lines:', content.split('\n').length);
} else {
    console.log('.env NOT found in root');
}
