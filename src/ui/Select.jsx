import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

// options: 哪些 option 需要被展示, option.label 是 option.value 的描述信息
// defaultValue: 默认选中的 option 的 value
// 为了将 <select> 用作 controlled input, 需要:
// 1. 传入 props 'defaultValue', prop value 会赋值给 <select> 的 attr 'value'
// 2. 传入 props 'onChange', prop value 会赋值给 <select> 的 attr 'onChange'
export default function Select({ options, defaultValue, onChange, ...otherProps }) {
  // ... as rest operator when destrucuring
  //     ...otherProps 表示: 将其余 props 封装到 object `otherProps` 中
  // ... as spread operator when specifying props
  //     {...otherProps} 表示: 将 object `otherProps` 中的键值对 spread 为 props
  //     使用 spread operator 可以快速透传 props
  return (
    // StyledSelect 需要使用 props 'type' 来修改底层 <select> 的样式
    <StyledSelect value={defaultValue} onChange={onChange} {...otherProps}>
      {options.map((o) => (
        <option value={o.value} key={o.value}>
          {o.label}
        </option>
      ))}
    </StyledSelect>
  );
}
