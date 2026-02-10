import styled, { css } from "styled-components";

// 如果不指定 props.type 的话, 其行为和 props.type 指定为 'vertical' 一致
const Row = styled.div`
  display: flex;
  ${(props) => {
    switch (props.type) {
      case "horizontal":
        return css`
          justify-content: space-between;
          align-items: center;
        `;
      case "vertical":
      default:
        return css`
          flex-direction: column;
          gap: 1.6rem;
        `;
    }
  }}
`;
// 实测在 react v19.2 中, 即便为 Row 设置 props 的默认值如下
// 如果 <Row> 不指定 props `type` 的话, props.type 仍然是 undefined
// 也就是说: Row.defaultProps 不会被自动合并到 props 内了
Row.defaultProps = {
  type: "vertical",
};
export default Row;
