import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonWithIcon from "../../ui/ButtonIcon";
import useLogout from "./useLogout";
import SpinnerMini from "../../ui/SpinnerMini";

// 教程里叫做 Logout, 但其实就是一个定制的 button
export default function LogoutButton() {
  const { logout, isLoggingout, isLogoutError, logoutError } = useLogout();
  return (
    <ButtonWithIcon disabled={isLoggingout} onClick={logout}>
      {isLoggingout ? <SpinnerMini /> : <HiArrowRightOnRectangle />}
    </ButtonWithIcon>
  );
}
