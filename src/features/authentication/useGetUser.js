// hook 'useLogin' 的作用: 通过 email 和 password 来 login 获取 current user session
//     - 会将 current user session 写到 local storage 中

import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/apiAuth";

// hook 'useUser' 的作用: 读取 local storage 中的 current user session, 并获取对应 user
export default function useGetUser() {
  // apiAuth.js 中的 getUser() 可以获取 current user, 但无法管理状态
  // 为此需要借助 react query 为其管理状态如下:
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return {
    isLoadingUser: isLoading,
    user: data,
    isUserError: isError,
    userError: error,
  };
}
