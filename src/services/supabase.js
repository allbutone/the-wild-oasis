import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zzudlfaityyrmtxwajxy.supabase.co";
// 故意将 url 修改错误如下, 以便测试报错
// const supabaseUrl = "https://xxxxxxxxxxxxxzzudlfaityyrmtxwajxy.supabase.co";
const supabaseKey = `sb_publishable_plGqUIAGRKAVV5P6sehKEg_T-4_yRlX`;// publishable key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
