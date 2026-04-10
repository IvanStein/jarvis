import { NextResponse } from 'next/server';
import { getLastMessages } from '../../../../memory/memory.js';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'anon';

        const history = await getLastMessages(userId, 50);

        return NextResponse.json(history);
    } catch (error) {
        console.error('Erro na API /api/history:', error);
        return NextResponse.json({ error: 'Erro ao carregar histórico' }, { status: 500 });
    }
}
