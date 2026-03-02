import CabinTableRow from "./CabinTableRow.jsx";
import Spinner from "../../ui/Spinner.jsx";
import toast from "react-hot-toast";
import { useCabins } from "./useCabins.js";
import Table from "../../ui/Table.jsx";

export default function CabinTable() {
  const { isLoading, data, isError, error } = useCabins();
  if (isLoading) {
    return <Spinner></Spinner>;
  }
  if (isError) {
    toast.error(error.message);
    return null;
  }
  return (
    <>
      {/* 
      <StyledCabinTable role="table">
        <StyledCabinTableHeader role="row">
          <div></div>
          <div>cabin_name</div>
          <div>capacity</div>
          <div>price</div>
          <div>discount</div>
          <div></div>
        </StyledCabinTableHeader>
        {data.map((cabin) => (
          <CabinTableRow cabin={cabin} key={cabin.id}></CabinTableRow>
        ))}
      </StyledCabinTable> 
      */}
      {/* 上述 return value 的缺点: */}
      {/* StyledCabinTable 定义了 grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr; */}
      {/* CabinTableRow 也定义了 grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr; */}
      {/* */}
      {/* 下面使用 compound component 来进行简化, 方便组件复用 */}
      {/* 
          思路: 
          创建 TableContext, 并将 grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr; 
          的值 '0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;' 存储到 context 中 
      */}
      {/* 实现如下效果: */}
      <Table columns={'0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;' }>
        <Table.Header>
          <div></div>
          <div>cabin_name</div>
          <div>capacity</div>
          <div>price</div>
          <div>discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={data}
          // 测试 data 为空时, 是否展示 <Empty />
          // data={[]} 
          render={(cabin) => (
            <CabinTableRow cabin={cabin} key={cabin.id} />
          )}
        />
        <Table.Footer>
          <span>this is table footer for test purpose</span>
        </Table.Footer>
      </Table>
    </>
  );
}
