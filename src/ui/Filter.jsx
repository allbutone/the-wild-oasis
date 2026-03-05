import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) => {
    if (props.active) {
      return css`
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
      `;
    }
  }}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

// 在 Filter 中设置 search param `discount=xxx`
// 在 CabinTable 中订阅 search param `discount=xxx` 并根据 xxx 的值对 cabins 进行过滤
// fieldName: 根据哪个 field 进行 filter
// options: filter 可以使用的选项, 其结构如下, 其中:
// - value 为 field value
// - label 为 field value 体现在界面上的值
// [
//   {value: 'all', label: 'All'}
//   {value: 'with-discount', label: 'With discount'}
//   {value: 'no-discount', label: 'No discount'}
// ]
// 默认第一个 option 为 default option
export default function Filter({ fieldName, options }) {
  // 获取/设置 search param 需要使用 hook `useSearchParams` 如下:
  const [searchParams, setSearchParams] = useSearchParams();

  // 如果 url 中未指定 search param 'discount'
  // 则默认为 ?discount=yyy
  // 其中 yyy 为 options.at(0).value
  // 这样: first filter button 会被默认选中
  const currentValue = searchParams.get(fieldName) || options.at(0).value;
  return (
    <StyledFilter>
      {/* When you call setSearchParams */}
      {/* it replaces the entire existing query string with the new values provided.  */}
      {/* To update only a single parameter while preserving others */}
      {/* you can use functional updates or merge the existing params with new ones */}
      {options.map((option) => (
        <FilterButton
          key={option.value}
          // 如果 FilterButton 被点击了, 就添加 active 样式做区分
          // FilterButton 需要 props 'active' 来动态添加 active style
          active={currentValue === option.value}
          onClick={() => {
            setSearchParams((params) => {
              params.set(fieldName, option.value);
              return params;
            });
          }}
          disabled={currentValue === option.value}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}
