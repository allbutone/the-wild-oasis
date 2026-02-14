import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zzudlfaityyrmtxwajxy.supabase.co";
const supabaseKey = `sb_publishable_plGqUIAGRKAVV5P6sehKEg_T-4_yRlX`;// publishable key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
