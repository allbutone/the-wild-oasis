import styled from "styled-components";
import HeaderMenus from "./HeaderMenus";
import UserAvatar from "../features/authentication/UserAvatar";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  justify-content: end;
  align-items: center;
  gap: 2.4rem;
`;
export default function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <HeaderMenus />
    </StyledHeader>
  );
}
