import { useEffect } from "react";
import Spinner from "../../ui/Spinner";
import useUser from "./useUser";
import { useNavigate } from "react-router-dom";
import FullPage from "../../ui/FullPage";

// ProtectedRoute 的作用: 获取 authenticated user, 如果没有, 就跳转到 /login 要求登录
export default function ProtectedRoute({ children }) {
  const { isLoadingUser, user, isUserError, userError } = useUser();
  console.log("inside component: ", isLoadingUser, user); // 解构出来的 isLoadingUser 默认为 true, user 默认为 undefined

  const navigate = useNavigate();

  //navigate 属于 side effect, 因此放在 useEffect 内执行最合适
  useEffect(() => {
    // 如果 isLoading 为 false (加载完毕) 且 user 为 null (未能从 local storage 中获取 user, 即: 未登录过), 就跳转到 /login 要求登录
    if (!isLoadingUser && !user) {
      navigate("/login");
      // 测试步骤:
      // 1. 模拟 logout: 删除 local storage 中的 current user session
      // 2. 触发 cache 'user' 的 refetch (两种方式), 这样 useUser() 解构出的 user 为 null
      //    方式一: 手动 invalidate react-query cache 'user' 让其失效, 该操作会自动触发 cache refetch (此时获取到 user 为 null)
      //    方式二: 等待 react-query cache 'user' 变成 stale, 然后 switch browser tab 触发 cache refetch (此时获取到 user 为 null)
      // 3. user 为 null 时, useEffect 生效, 会 navigate 到 /login, 可继续点 "login" 进行测试
      //
      // 观察到的奇怪现象:
      // step-2 之后立刻 login, 会发现即便 login 成功, 也不会跳转到 /dashboard 而是停留在 /login
      // 这是因为:
      // step-2 触发 cache 'user' refetch 后, 虽然其值为 null, 但其状态并非 stale, 而是 inactive (未过期, 只是未被使用)
      // 这样的话, login 成功后, /dashboard 通过 useUser() 从 cache 'user' 获取到的 user 就是 null, 导致又 navigate 到 /login
      //
      // 解决办法:
      // step-3 中, 在点 "login" 进行测试之前, 先删掉 cache 'user' 即可恢复正常
      //
      // 为避免同样的问题, 实际 logout 时应该:
      // 1. 删除 local storage 中的 current user session
      // 2. queryClient.removeQueries({ queryKey: ['user'] }); 而非 queryClient.invalidateQueries({queryKey: ['user'], refetchType: 'active'});
      // 因为后者同样会立刻触发 refetch 让 cache 'user' 的值变为 null, 导致在 staleTime 内点 'login' 仍然会停留在 /login 页面
    }
  }, [isLoadingUser, user, navigate]);

  // 调试 FullPage 样式
  // return (
  //   <FullPage>
  //     <Spinner />
  //   </FullPage>
  // );

  if (isLoadingUser)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // user 可能是 null
  if (user?.role === "authenticated") {
    console.log(`user is authenticated, openning the door...`);
    return children;
  }
}
