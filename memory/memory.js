import { getSupabase } from '../config/supabase.js';

/**
 * Salva uma mensagem no histórico do banco de dados.
 */
export async function saveMessage(userId, role, content) {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
        const { error } = await supabase
            .from('chat_messages')
            .insert([{ user_id: userId, role, content }]);

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao salvar mensagem no Supabase:", error);
    }
}

/**
 * Recupera as últimas mensagens de um usuário.
 */
export async function getLastMessages(userId, limit = 10) {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data.reverse();
    } catch (error) {
        console.error("Erro ao buscar histórico no Supabase:", error);
        return [];
    }
}
