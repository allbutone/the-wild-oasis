import { createClient } from "@supabase/supabase-js";

// export 出去的都是单例
export const supabaseUrl = "https://zzudlfaityyrmtxwajxy.supabase.co";

// 故意将 url 修改错误如下, 以便测试报错
// const supabaseUrl = "https://xxxxxxxxxxxxxzzudlfaityyrmtxwajxy.supabase.co";
const supabaseKey = `sb_publishable_plGqUIAGRKAVV5P6sehKEg_T-4_yRlX`; // publishable key

// initialize supabase client
// const supabase = createClient(supabaseUrl, supabaseKey);
// 改写如下, 方便观察:
// 访问 auth callback page (当前项目 `/dashboard` 充当 auth callback page) 时
// supabase client 是否进行了初始化(会从 url 中 '#' 后的 URL fragment(s) 中获取 token, 并将提取到的 session 存储到 local storage)
const supabase = (() => {
  console.log(`supabase initializing...`)
  return createClient(supabaseUrl, supabaseKey);
})();

export default supabase;
