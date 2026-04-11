import { NextResponse } from 'next/server';
import { runAgent } from '../../../../core/agent';

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
        return NextResponse.json({ 
            error: error.message || 'Erro interno do servidor',
            debug: error.debugContext || null,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
