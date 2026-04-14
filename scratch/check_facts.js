import 'dotenv/config';
import { getSupabase } from '../config/supabase.js';

async function checkFacts() {
    const supabase = getSupabase();
    const { data } = await supabase.from('user_facts').select('*');
    console.log("USER FACTS IN DB:", data);
}
checkFacts();
