import { uploadFile } from "./apiFile";
import supabase from "./supabase";

export async function loginWithPassword({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`error occurred: ${error.message}`);
  }

  // console.log('successfully logged in! the result is: ')
  // console.log(data); // 这个返回的 data 会存储在 local storage 中, 只是存储结构稍有变化
  return data;
}

export async function getUser() {
  // 方式一: getSession(), 参考 https://supabase.com/docs/reference/javascript/auth-getsession
  // - 速度快, 仅读取 local storage 中的 current session, 不发起网络请求
  /*
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (!data.session) {
    // 如果 local storage 中没有 current user session, 根据文档, data.session 会是 null
    // 此时需要 return something 告诉调用者, 这样调用者可以 redirect to login page
    console.log(
      `no current user session detected in local storage (not authenticated)`,
    );
    return null; // const {user} = useGetUser() 时, 解构出来的 user 就是 null
  }
  console.log(`current user session detected in local storage`);
  return data.session.user;
  */
  // 方式二: getUser(), 参考: https://supabase.com/docs/reference/javascript/auth-getuser
  // 会顺序执行:
  // 1. 读取 local storage 中的 current session, 如果没有读到, 就 return {data:{user:null}, error:null}
  // 2. 如果读到了, 就提取其中的 access token 和 refresh token, 请求 server 获取:
  //    - {data: {user}, err: null} -> token valid && user not banned && user not deleted
  //    - {data: {user: null}, err} -> token invalid || user banned || user deleted
  console.log(
    `extract token from current session (stored in local storage) and request server for authentic user info...`,
  );
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log(`authentic user info from server:`);
  console.log(user);

  return user;
}

export async function logout() {
  // 参考 https://supabase.com/docs/reference/javascript/auth-signout 可知:
  // 1. signOut 会从 browser local storage 中删除 session
  // 2. 发出 SIGNED_OUT 事件
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  // signOut 没有 data 可以 return
}

// signUp 有频率限制, 貌似是每小时只能注册两次, 否则会 response 如下:
// {
//     "code": "over_email_send_rate_limit",
//     "message": "email rate limit exceeded"
// }
export async function createNewUser({ email, password, fullName }) {
  // 参考 https://supabase.com/docs/reference/javascript/auth-signup 的案例 'sign up with additional user metadata'
  // signUp(obj) 中, object 只有 field email/password/phone/options
  // 因此只能将额外的 field 存储到 options 内
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
      },
      // https://supabase.com/dashboard/project/zzudlfaityyrmtxwajxy/auth/url-configuration 中定义了 provider 将使用的 site url 和 redirect urls
      // emailRedirectTo 指定了 confirmation email 中的 verify link 将 redirect 到哪里
      // emailRedirectTo 必须是 redirect urls 中的一个, 否则将默认使用 site url
      emailRedirectTo: "http://localhost:5173/dashboard",
    },
  });
  if (error) {
    return new Error(error.message);
  }
  return data; // data 的结构为 {session: {}, user: {}}
}

export async function updateUser({
  fullName,
  avatarFile,
  avatarStorePath,
  password,
}) {
  let updateObj = {};
  if (password) {
    // only update password
    updateObj.password = password;
  } else {
    // only update fullName and avatar
    updateObj = { data: {} };
    if (avatarFile) {
      const { signedUrl } = await uploadFile(
        "user-avatars",
        avatarFile,
        avatarStorePath,
      );
      // 根据 https://supabase.com/docs/reference/javascript/auth-updateuser 可知: key 'data' 对应 auth.users.raw_user_meta_data 列
      // 这样 user.user_metadata 就可以从 column 'raw_user_meta_data' of table 'users' 列取值了
      updateObj.data.avatar = signedUrl;
    }
    if (fullName) {
      updateObj.data.fullName = fullName;
    }
  }
  console.log(`user attributes to update: `, updateObj);

  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser(updateObj);

  if (error) {
    return new Error(error.message);
  }

  return user;
}
