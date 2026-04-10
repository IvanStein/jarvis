import { supabase } from '../config/supabase.js';

/**
 * Salva uma mensagem no histórico do banco de dados.
 * @param {string} userId - ID do usuário.
 * @param {string} role - 'user' ou 'assistant'.
 * @param {string} content - Conteúdo da mensagem.
 */
export async function saveMessage(userId, role, content) {
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
 * Recupera as últimas mensagens de um usuário para servir de contexto.
 * @param {string} userId - ID do usuário.
 * @param {number} limit - Quantidade de mensagens a recuperar.
 * @returns {Promise<Array>} - Lista de mensagens formatadas.
 */
export async function getLastMessages(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // Inverter para que fiquem em ordem cronológica (antigas primeiro)
        return data.reverse();
    } catch (error) {
        console.error("Erro ao buscar histórico no Supabase:", error);
        return [];
    }
}
