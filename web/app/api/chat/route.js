import { NextResponse } from 'next/server';
import { runAgent } from '../../../../core/agent.js';

export async function POST(request) {
    try {
        const { message, userId } = await request.json();
        console.log('[API /chat] Mensagem recebida:', message);

        if (!message) {
            return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
        }

        console.log('[API /chat] Executando agente...');
        const result = await runAgent(message, userId || 'anon');
        console.log('[API /chat] Resultado:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('[API /chat] Erro:', error.message, error.stack);
        return NextResponse.json({ 
            error: error.message || 'Erro interno do servidor',
            debug: error.debugContext || null,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
