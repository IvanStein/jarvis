import { NextResponse } from 'next/server';
import { getLastMessages } from '../../../../memory/memory.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'anon';
        const conversationId = searchParams.get('conversationId') || 'default';

        const history = await getLastMessages(userId, 50, conversationId);

        return NextResponse.json(history);
    } catch (error) {
        console.error('Erro na API /api/history:', error);
        return NextResponse.json({ error: 'Erro ao carregar histórico' }, { status: 500 });
    }
}
