import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("ERRO: Configuração do Supabase ausente.");
        console.error("Variáveis verificadas:", { 
            hasUrl: !!supabaseUrl, 
            hasKey: !!supabaseKey,
            envKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
        });
        return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
};

// Para manter compatibilidade com quem importa o objeto direto
export const supabase = null; 
