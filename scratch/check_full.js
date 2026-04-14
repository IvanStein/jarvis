
import 'dotenv/config';
import { getSupabase } from '../config/supabase.js';

async function check() {
    const supabase = getSupabase();
    const { data } = await supabase.from('chat_messages').select('*').limit(20);
    console.log("ALL TABLE DATA:", data);
}
check();
