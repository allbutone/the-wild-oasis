import styled  from "styled-components";
import ButtonWithIcon from "./ButtonIcon";
import { HiOutlineMoon, HiOutlineSun, HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../features/authentication/LogoutButton";
import { useDarkMode } from "../context/ThemeContext";

const StyledHeaderMenus = styled.ul`
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  align-items: center;
`;
export default function HeaderMenus() {
  const navigate = useNavigate();
  const {isDarkMode, toggleTheme} = useDarkMode();

  return (
    <StyledHeaderMenus>
      <li>
        {/* click to show user details */}
        <ButtonWithIcon onClick={() => navigate("/account")}>
          <HiOutlineUser />
        </ButtonWithIcon>
      </li>
      <li>
        <ButtonWithIcon onClick={toggleTheme}>
          {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
        </ButtonWithIcon>
      </li>
      <li>
        <LogoutButton />
      </li>
    </StyledHeaderMenus>
  );
}
