import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn("Aviso: Chaves do Supabase não encontradas no ambiente.");
        // Retornamos um mock ou null para evitar quebra no build
        return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
};

// Para manter compatibilidade com quem importa o objeto direto
export const supabase = null; 
