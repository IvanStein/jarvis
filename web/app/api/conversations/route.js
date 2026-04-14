import { NextResponse } from 'next/server';
import { getConversations } from '../../../../memory/memory.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'anon';

        const conversations = await getConversations(userId);

        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Erro na API /api/conversations:', error);
        return NextResponse.json({ error: 'Erro ao listar conversas' }, { status: 500 });
    }
}
