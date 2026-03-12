import { useMutation } from "@tanstack/react-query";
import { loginWithPassword } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function useLogin() {
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
      // 登录成功后, 需要 redirect 到 dashboard
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
