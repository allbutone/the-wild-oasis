import supabase from "./supabase";

export async function loginWithPassword({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(
      `error occurred: ${error.message}`,
    );
  }

  // console.log('successfully logged in! the result is: ')
  // console.log(data); // 这个返回的 data 会存储在 local storage 中, 只是存储结构稍有变化
  return data;
}
