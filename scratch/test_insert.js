
import 'dotenv/config';
import { getSupabase } from '../config/supabase.js';

async function testInsert() {
    const supabase = getSupabase();
    if (!supabase) {
        console.error("Supabase not configured");
        return;
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .insert([{ 
            user_id: 'test_user', 
            role: 'user', 
            content: 'test message',
            conversation_id: 'test_conv' 
        }])
        .select();

    if (error) {
        console.error("Error inserting message:", error);
    } else {
        console.log("Insert successful:", data);
    }
}

testInsert();
