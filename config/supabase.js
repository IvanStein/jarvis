import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Aviso: Chaves do Supabase não encontradas no ambiente.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
