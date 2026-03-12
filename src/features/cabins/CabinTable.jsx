import CabinTableRow from "./CabinTableRow.jsx";
import Spinner from "../../ui/Spinner.jsx";
import toast from "react-hot-toast";
import { useCabins } from "./useCabins.js";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty.jsx";

export default function CabinTable() {
  // 根据 search param `discount` 的值来 filter 数据(cabins)
  const [searchParams] = useSearchParams();
  const discount = searchParams.get("discount");
  console.log(discount);

  const { isLoading, data, isError, error } = useCabins();
  if (isLoading) {
    return <Spinner></Spinner>;
  }
  if (!data.length) {
    // 如果加载完毕后, 没有数据, 就展示 Empty 组件
    return <Empty resource={"cabins"} />;
  }
  if (isError) {
    toast.error(error.message);
    return null;
  }
  // 对数据进行筛选(filter)
  let filteredCabins;
  switch (discount) {
    case "with-discount":
      filteredCabins = data.filter((cabin) => cabin.discount > 0);
      break;
    case "no-discount":
      filteredCabins = data.filter((cabin) => cabin.discount === 0);
      break;
    // 如果 url 中未指定 searchParam 'discount'
    default:
      filteredCabins = data;
  }
  console.log(`filtered cabins: `);
  console.log(filteredCabins);

  // 对过滤后的数据进行排序(sort):
  const sortBy = searchParams.get("sortBy") || "none";
  let sortedCabins;
  if (sortBy === "none") {
    sortedCabins = filteredCabins;
  } else {
    const [sortField, sortDirection] = sortBy.split("-");
    if (sortDirection === "asc")
      sortedCabins = filteredCabins.sort((a, b) => a[sortField] - b[sortField]); // 前者减后者, 是升序
    if (sortDirection === "desc") {
      sortedCabins = filteredCabins.sort((a, b) => b[sortField] - a[sortField]);
    }
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
      <Menus>
        <Table $columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
          <Table.Header>
            <div></div>
            <div>cabin_name</div>
            <div>capacity</div>
            <div>price</div>
            <div>discount</div>
            <div></div>
          </Table.Header>
          <Table.Body
            // data={filteredCabins}
            data={sortedCabins}
            // data={data}
            // 测试 data 为空时, 是否展示 <Empty />
            // data={[]}
            render={(cabin) => (
              <Table.Row key={cabin.id}>
                <CabinTableRow cabin={cabin}  />
              </Table.Row>
            )}
          />
          <Table.Footer>
            <span>this is table footer for test purpose</span>
          </Table.Footer>
        </Table>
      </Menus>
    </>
  );
}
