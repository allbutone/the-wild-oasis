import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginWithPassword } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // 虽然在 LoginForm 内可以直接调用 loginWithPassword 进行登录, 但那样无法进行状态管理(onSuccess/onError)
  // 为此需要借助 react query 如下:
  // useQuery 没有 onSuccess / onError 等状态相关 key, 只有 useMutation 有:
  const { mutate, isPending, data, isError, error } = useMutation({
    mutationFn: ({ email, password }) => loginWithPassword({ email, password }),
    onSuccess: (data) => {
      console.log(`successfully logged in!`)
      console.log(`login result:`)
      console.log(data);

      // when user click button 'login':
      // 1. 获取 login result 并将其存储到 local storage 中
      //    获取 login result 过程中, login button 会展示 <SpinnerMini />
      // 2. 跳转到 /dashboard
      //    由于 Dashboard 包裹在 ProtectedRoute 中, 而 ProtectedRoute 会使用 useUser() 来获取 user
      //    在获取 user 的过程中, 会展示 <FullPage><Spinner /></FullPage>
      //
      // 优化:
      // step-1 获取的 login result (data) 的结构是 {user, session}, 其中已经包含了 user
      // 如果在获取到 data 后, 直接将 data.user 存储到 cache 'user' 内 (如下)
      // 那么 step-2 的 useUser() 就可以直接从 cache 'user' 中获取 user, 而无需执行 async queryFn
      // 来获取了, 这样没有 async query 过程, 也就不会展示多余的 <FullPage><Spinner /></FullPage> 了
      queryClient.setQueryData(['user'], data.user);

      // 登录成功后, 需要 redirect 到 /dashboard, 对应的 Dashboard 被 ProtectedRoute 包裹
      navigate('/dashboard');
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return {
    login: mutate,
    isLoggingIn: isPending,
    loginResult: data,
    isLoginError: isError,
    loginError: error,
  };
}
