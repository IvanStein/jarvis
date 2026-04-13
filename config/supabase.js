import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.trim();
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)?.trim();

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ ERRO DE CONFIGURAÇÃO SUPABASE:");
        console.error("- URL presente:", !!supabaseUrl);
        console.error("- KEY presente:", !!supabaseKey);
        console.error("- Environment:", process.env.NODE_ENV);
        return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
};

// Para manter compatibilidade com quem importa o objeto direto
export const supabase = null; 
