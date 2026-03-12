import styled, { css } from "styled-components";

// StyledForm 的 props 'type' 为 modal 时, 表示: 在 modal 内展示 StyledForm
// StyledForm 的 props 'type' 为 regular 时, 表示: 没有在 modal 内展示 StyledForm
const StyledForm = styled.form`
  ${(props) =>
    props.$type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.$type === "modal" &&
    css`
      width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

export default StyledForm;
