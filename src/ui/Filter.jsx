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

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

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
export default function Filter() {
  // 获取/设置 search param 需要使用 hook `useSearchParams` 如下:
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <StyledFilter>
      {/* When you call setSearchParams */}
      {/* it replaces the entire existing query string with the new values provided.  */}
      {/* To update only a single parameter while preserving others */}
      {/* you can use functional updates or merge the existing params with new ones */}
      <FilterButton
        onClick={() => {
          setSearchParams((params) => {
            params.set("discount", "all");
            return params;
          });
        }}
      >
        All
      </FilterButton>
      <FilterButton
        onClick={() => {
          setSearchParams((params) => {
            params.set("discount", "with-discount");
            return params;
          });
        }}
      >
        With discount
      </FilterButton>
      <FilterButton
        onClick={() => {
          setSearchParams((params) => {
            params.set("discount", "no-discount");
            return params;
          });
        }}
      >
        No discount
      </FilterButton>
    </StyledFilter>
  );
}
