import styled from "styled-components";
import LogoutButton from "../features/authentication/LogoutButton";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;
export default function Header() {
  return <StyledHeader>
    <LogoutButton />
  </StyledHeader>;
}
