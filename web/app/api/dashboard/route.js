import { NextResponse } from 'next/server';
import { getSupabase } from '../../../../config/supabase.js';

export async function GET() {
    try {
        const supabase = getSupabase();
        if (!supabase) throw new Error("Supabase não configurado. Adicione as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY.");
        
        const { data: configs, error } = await supabase.from('specialists_config').select('*');
        
        if (error) {
            console.error('Erro ao buscar especialistas:', error);
        }

        const { count } = await supabase.from('documents').select('*', { count: 'exact', head: true });

        return NextResponse.json({
            specialists: configs || [],
            totalKnowledge: count || 0,
            systemStatus: 'online'
        });
    } catch (error) {
        console.error('Erro no dashboard:', error);
        return NextResponse.json({ 
            error: error.message,
            specialists: [],
            totalKnowledge: 0,
            systemStatus: 'offline'
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { specialistId, instruction } = await request.json();
        const supabase = getSupabase();
        if (!supabase) throw new Error("Supabase não configurado. Adicione as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY.");
        
        const { data, error } = await supabase.from('specialists_config')
            .upsert({ 
                id: specialistId, 
                instruction: instruction,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Erro ao treinar especialista:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
