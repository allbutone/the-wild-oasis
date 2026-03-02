import { createContext, useContext } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const StyledFooter = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements
   * Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext();
// props 'columns' 的值为 `grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;` 中的 `0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;`
export default function Table({ children, columns }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable>{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);

  //StyledHeader 继承自 CommonRow, 而 CommonRow 中用到了 props.columns, 因此需要指定 props 'columns' 如下:
  return (
    <StyledHeader columns={columns} as="header">
      {children}
    </StyledHeader>
  );
}
Table.Header = Header;

// render 定义了 data 中每行数据该如何 render, 而 Body 仅负责使用 map 进行迭代, render logic 交给调用者来定义
function Body({ data, render }) {
  if(!data?.length){ // 如果没有指定 props 'data' 或者 data.length 为 0 就展示 <Empty />
    return <Empty>no rows to display here</Empty>
  }
  return <StyledBody>{data.map(render)}</StyledBody>;
}
Table.Body = Body;

function Row({ children }) {
  const { columns } = useContext(TableContext);
  //StyledRow 继承自 CommonRow, 而 CommonRow 中用到了 props.columns, 因此需要指定 props 'columns' 如下:
  return <StyledRow columns={columns}>{children}</StyledRow>;
}
Table.Row = Row;

function Footer({ children }) {
  return <StyledFooter>{children}</StyledFooter>;
}
Table.Footer = Footer;
