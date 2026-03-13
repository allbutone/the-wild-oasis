import styled from "styled-components";

const StyledFullPage = styled.div`
  height: 100dvh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;
export default function FullPage({ children }) {
  return <StyledFullPage>{children}</StyledFullPage>;
}
