import { NextResponse } from 'next/server';
import { runAgent } from '../../../../core/agent.js';

console.log('[API /chat] Módulo carregado');

export async function GET() {
    return NextResponse.json({ 
        status: 'API Chat is online', 
        timestamp: new Date().toISOString(),
        node_env: process.env.NODE_ENV,
        has_gemini_key: !!process.env.GEMINI_API_KEY
    });
}

export async function POST(request) {
    try {
        console.log('[API /chat] Nova requisição recebida');
        
        const body = await request.json().catch(() => ({}));
        const { message, userId, conversationId } = body;

        if (!message) {
            return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
        }

        // Timer para monitorar lentidão
        const start = Date.now();
        
        console.log(`[API /chat] Executando agente para: ${userId} em ${conversationId || 'default'}`);
        const result = await runAgent(message, userId || 'anon', conversationId || 'default');
        
        const duration = Date.now() - start;
        console.log(`[API /chat] Agente finalizado em ${duration}ms`);

        if (!result || typeof result !== 'object') {
            throw new Error('Resposta do agente em formato inválido');
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('[API /chat] ERRO:', error.message);
        return NextResponse.json({ 
            error: error.message || 'Erro interno do servidor',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
