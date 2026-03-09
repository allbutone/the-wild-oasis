import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import usePageAndSize from "../hooks/usePageAndSize";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

const PageSizeSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const PageSizeSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.3rem 1rem;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const PageSizeOption = styled.option``;

// props 'count': 总记录数
export default function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {pageCurrent, pageSize} = usePageAndSize();
  function handleChange(e) {
    setSearchParams(prevParams => {
      prevParams.set('size', Number(e.target.value));
      return prevParams;
    })
  }

  // 根据 pageCurrent 和 pageSize 计算起止记录的 index (1-based)
  const from = (pageCurrent - 1) * pageSize + 1;
  const to = from + pageSize - 1 > count ? count : from + pageSize - 1;

  // 总共有多少页
  const pageTotal = Math.ceil(count / pageSize);

  function handleNext() {
    setSearchParams((prevParams) => {
      prevParams.set(
        "page",
        pageCurrent + 1 > pageTotal ? pageTotal : pageCurrent + 1,
      );
      return prevParams;
    });
  }

  function handlePrev() {
    setSearchParams((prevParams) => {
      prevParams.set("page", pageCurrent - 1 < 1 ? 1 : pageCurrent - 1);
      return prevParams;
    });
  }

  // 如果一页就可以展示所有数据, 就没必要展示 pagination 组件了
  if(count < pageSize){
    return null;
  }

  return (
    <StyledPagination>
      {/* user 将 page size 调大后, url 中 page 不变, 导致 from 可能大于 count, 此时不该展示任何数据 */}
      {from > count ? (
        <P>no data</P>
      ) : (
        <P>
          {/* current page 展示了哪些记录(界面展示的是 1-based) */}
          data from {from} to {to}
        </P>
      )}
      <PageSizeSelector>
        <P>Page Size:</P>
        <PageSizeSelect value={`${pageSize}`} onChange={handleChange}>
          <PageSizeOption value={"5"}>5</PageSizeOption>
          <PageSizeOption value={"10"}>10</PageSizeOption>
          <PageSizeOption value={"20"}>20</PageSizeOption>
          <PageSizeOption value={"30"}>30</PageSizeOption>
        </PageSizeSelect>
      </PageSizeSelector>
      <Buttons>
        <PaginationButton onClick={handlePrev} disabled={pageCurrent === 1}>
          <HiChevronLeft />
          <P>Prev</P>
        </PaginationButton>
        <PaginationButton
          onClick={handleNext}
          disabled={pageCurrent === pageTotal}
        >
          <P>Next</P>
          <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}
