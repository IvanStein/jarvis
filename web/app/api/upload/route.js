import { NextResponse } from 'next/server';
import { learnFromPDF } from '../../../../rag/ingest.js';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name;

        // Iniciar aprendizado
        const result = await learnFromPDF(buffer, fileName);

        return NextResponse.json({ 
            response: result.response,
            status: 'success'
        });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Falha ao processar o arquivo' }, { status: 500 });
    }
}
