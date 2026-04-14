
import 'dotenv/config';
import { getSupabase } from '../config/supabase.js';

async function listTables() {
    const supabase = getSupabase();
    const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_schema', 'public');

    if (error) {
        console.error("Error fetching tables:", error);
    } else {
        console.log("Existing Tables:");
        console.table(tables.map(t => t.table_name));
    }
}

listTables();
