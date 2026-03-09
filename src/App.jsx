import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Account from "./pages/Account";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewUsers from "./pages/Users";
import PageNotFound from "./pages/PageNotFound";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import Settings from "./pages/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Booking from "./pages/Booking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 }, // 将 query 的 stale time 设置为 1 分钟
  },
});
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      {/* 开发项目之前, 使用 GlobalStyles 来重置样式 */}
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* <Route index element={<Dashboard />}></Route> */}
            {/* Navigate 是 useNavigate 的 declarative version, 如下, 其中 props.replace 如未赋值, 将会是 true */}
            <Route
              index
              element={<Navigate replace to={"dashboard"} />}
            ></Route>
            <Route path="dashboard" element={<Dashboard />}></Route>
            <Route path="account" element={<Account />}></Route>
            <Route path="bookings" element={<Bookings />}></Route>
            <Route
              path="bookings/:bookingId"
              element={<Booking />}
            ></Route>
            <Route path="cabins" element={<Cabins />}></Route>
            <Route path="users" element={<NewUsers />}></Route>
            <Route path="settings" element={<Settings />}></Route>
          </Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
      {/* 具体如何调整 toast 的样式, 请参考: https://react-hot-toast.com/docs/styling */}
      {/* toast 的 position 默认为 fixed, 可通过 containerStyle 修改 */}
      {/* toaster 下可以有多个 toast, 这些 toast 之间的 gutter 可以通过 prop 'gutter' 调整, 单位默认为 px */}
      {/* 
          下面定义了 app 全局使用的 toaster, 如果需要多个地方使用 toaster, 请参考 
          https://react-hot-toast.com/docs/multi-toaster 
          实测: toast('xxx') / toast.success('xxx') / toast.error('xxx') 会默认使用没有指定 toasterId 的 toaster
      */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ position: "fixed", margin: "10px", top: "20px" }}
        toastOptions={{
          success: { duration: 3000 }, // 操作成功提示, 3s 后自动 dismiss, 对应 toast.success('xxx')
          error: { duration: 5000 }, // 操作失败提示, 3s 后自动 dismiss, 对应 toast.error('yyy')
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
