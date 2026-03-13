import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // apiAuth 中的 logout 只是调用了 supabase.auth.signOut
  // 但是没有对其状态进行管理, 下面借助 react-query 为其添加状态:
  // choose useMutation instead of useQuery 是因为:
  // 可以借助前者的 onSuccess 来添加 logout 应顺带做的事情
  // 例如: 
  // 1. remove all react-query cache
  // 2. navigate to /login
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success(`you have been successfully logged out!`);
      // remove all react-query cache, 尤其是 cache 'user'
      queryClient.removeQueries(); // 不指定 arg 表示: remove all queries

      // 假定访问流程为: /login -> click login -navigate1-> /dashboard -> click logout -navigate2-> /login
      //
      // 当 user 被 navigate1 重定向到 /dashboard 时, user 不该通过 history back 回到 /login 重新登录
      // 因此 navigate1 应该指定 replace: true
      //
      // 当 user 被 navigate2 重定向到 /login 时, user 不该通过 history back 回到 /dashboard 
      // 因此 navigate2 应该指定 replace: true
      navigate("/login", { replace: true }); // replace: true 表示使用 destination url 替换掉 history stack 中的 current entry
    },
  });

  return {
    logout: mutate,
    isLoggingout: isPending,
    isLogoutError: isError,
    logoutError: error,
  };
}
