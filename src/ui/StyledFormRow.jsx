import styled from "styled-components";
import { StyledFormLabel } from "./StyledFormLabel";
import { StyledFormError } from "./StyledFormError";

export const StyledFormRow = styled.div`
  display: grid;
  align-items: center;

  grid-template-columns: ${(props) => (props.$orientation === "vertical" ? "1fr" : "24rem 1fr 1.2fr")};
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

export default function FormRow({ label, error, children, $orientation }) {
  return (
    <StyledFormRow $orientation={$orientation}>
      {label && (
        <StyledFormLabel htmlFor={children.props.id}>{label}</StyledFormLabel>
      )}
      {children}
      {error && <StyledFormError>{error}</StyledFormError>}
    </StyledFormRow>
  );
}
