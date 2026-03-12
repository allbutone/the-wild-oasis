import styled, { css } from "styled-components";

// 如果不借助 helper function styled.h1, template literal 内的 ${fn}
// 会被这么处理: fn.toString()
// const Heading = `
//   font-size: ${() => 10 > 5 ? '30px' : '10px'};
// `;
// 借助 helper function styled.h1, template literal 内的 ${fn}
// 会被这么处理: fn() 得到 string, 然后嵌入到 template literal 内对应位置
// const Heading = styled.h1`
//   font-size: ${() => 10 > 5 ? '30px' : '10px'};
// `;

// styled components 提供了 props.as, 作用是: 将接收自定义样式的 element(h1) 动态替换为 props.as 指定的 element
// return css`template_literal` 而不是 return `template_literal` 的原因是:
// 1. 前者的 template_literal 内如果指定了 ${fn} 的话, fn 会被执行, 而不会被 .toString()
// 2. 前者的 template_literal 内支持自动补全
const Heading = styled.h1`
  ${(props) => {
    switch (props.as) {
      case "h1":
        return css`
          font-size: 3rem;
          font-weight: 600;
        `;
      case "h2":
        return css`
          font-size: 3rem;
          font-weight: 600;
        `;
      case "h3":
        return css`
          font-size: 3rem;
          font-weight: 500;
        `;
      case "h4":
        return css`
          font-size: 2rem;
          font-weight: 500;
          text-align: center;
        `;
    }
  }}
  line-height: 1.8
`;

export default Heading;
