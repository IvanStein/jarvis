import { NextResponse } from 'next/server';
import { getSupabase } from '../../../../config/supabase.js';

export async function GET() {
    try {
        const supabase = getSupabase();
        
        // 1. Buscar configs dos especialistas
        const { data: configs } = await supabase.from('specialists_config').select('*');
        
        // 2. Buscar estatísticas de conhecimento (RAG)
        const { count } = await supabase.from('documents').select('*', { count: 'exact', head: true });

        return NextResponse.json({
            specialists: configs || [],
            totalKnowledge: count || 0
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
