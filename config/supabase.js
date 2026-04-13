import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance;

    // Tenta todas as variações possíveis (Vercel e Local)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return null;
    }

    try {
        supabaseInstance = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false }
        });
        return supabaseInstance;
    } catch (e) {
        console.error("Erro fatal ao criar cliente Supabase:", e.message);
        return null;
    }
};

// Para manter compatibilidade com quem importa o objeto direto
export const supabase = null; 
