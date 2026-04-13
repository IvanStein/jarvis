import { getSupabase } from '../config/supabase.js';

/**
 * Salva uma mensagem no histórico do banco de dados.
 */
export async function saveMessage(userId, role, content, conversationId = 'default') {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
        const { error } = await supabase
            .from('chat_messages')
            .insert([{ 
                user_id: userId, 
                role, 
                content,
                conversation_id: conversationId 
            }]);

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao salvar mensagem no Supabase:", error);
    }
}

/**
 * Recupera as últimas mensagens de um usuário em uma conversa específica.
 */
export async function getLastMessages(userId, limit = 10, conversationId = 'default') {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('user_id', userId)
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.warn("[Supabase] Erro ao buscar histórico:", error.message);
            return [];
        }
        return (data || []).reverse();
    } catch (error) {
        console.error("Erro ao buscar histórico no Supabase:", error);
        return [];
    }
}
/**
 * Salva um fato importante aprendido sobre o usuário.
 */
export async function saveFact(userId, fact) {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
        const { error } = await supabase
            .from('user_facts')
            .insert([{ user_id: userId, fact }]);

        if (error) throw error;
    } catch (error) {
        console.error("Erro ao salvar fato no Supabase:", error);
    }
}

/**
 * Recupera todos os fatos conhecidos sobre o usuário.
 */
export async function getUserFacts(userId) {
    const supabase = getSupabase();
    if (!supabase) return "";

    try {
        const { data, error } = await supabase
            .from('user_facts')
            .select('fact')
            .eq('user_id', userId);

        if (error) throw error;
        return data.map(f => f.fact).join(' | ');
    } catch (error) {
        console.error("Erro ao buscar fatos no Supabase:", error);
        return "";
    }
}
/**
 * Busca a configuração de um especialista no banco.
 */
export async function getSpecialistConfig(id) {
    if (!id) return null;
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('specialists_config')
            .select('*')
            .eq('id', id)
            .maybeSingle(); // Usar maybeSingle para evitar erro se não existir

        if (error) {
            console.warn(`[Supabase] Erro ao buscar especialista ${id}:`, error.message);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Erro ao buscar config do especialista:", error);
        return null;
    }
}

/**
 * Atualiza a instrução de um especialista (Treinamento).
 */
export async function updateSpecialistConfig(id, newInstruction) {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
        const { error } = await supabase
            .from('specialists_config')
            .update({ instruction: newInstruction, updated_at: new Date() })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Erro ao atualizar config do especialista:", error);
        return false;
    }
}
