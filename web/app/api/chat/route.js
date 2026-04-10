import { NextResponse } from 'next/server';
const { runAgent } = require('../../../../../core/agent');

export async function POST(request) {
    try {
        const { message, userId } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
        }

        const result = await runAgent(message, userId || 'anon');

        return NextResponse.json(result);
    } catch (error) {
        console.error('Erro na API /api/chat:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
