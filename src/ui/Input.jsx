import styled from "styled-components";

const Input = styled.input`
  /* 输入框的边框: 灰色(300) */
  border: 1px solid var(--color-grey-300);
  /* 输入框的背景色: 灰色(0), 相当于白色 */
  background-color: var(--color-grey-0);
  border-radius: var(--order-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

export default Input;
