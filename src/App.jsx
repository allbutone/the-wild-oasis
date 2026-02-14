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

export default function App() {
  return (
    <>
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
            <Route path="cabins" element={<Cabins />}></Route>
            <Route path="users" element={<NewUsers />}></Route>
            <Route path="settings" element={<Settings />}></Route>
          </Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
