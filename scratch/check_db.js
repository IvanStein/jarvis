
import 'dotenv/config';
import { getSupabase } from '../config/supabase.js';

async function checkMessages() {
    const supabase = getSupabase();
    if (!supabase) {
        console.error("Supabase not configured");
        console.log("URL:", process.env.SUPABASE_URL);
        return;
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching messages:", error);
    } else {
        console.log("Last 5 messages saved in DB:");
        console.table(data.map(m => ({
            role: m.role,
            content: m.content.substring(0, 50) + '...',
            id: m.conversation_id
        })));
    }
}

checkMessages();
