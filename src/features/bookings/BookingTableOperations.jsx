import Filter from "../../ui/Filter";
import Sort from "../../ui/Sort";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        fieldName={"status"}
        options={[
          { value: "all", label: "All" },
          { value: "checked-out", label: "Checked out" },
          { value: "checked-in", label: "Checked in" },
          { value: "unconfirmed", label: "Unconfirmed" },
        ]}
      />

      <Sort
        options={[
          {
            // 测试 pagination 时, 根据 id asc 排序, 可以观察出每个分页的数据是否正确
            value: "id-asc",
            label: "Sort by id, asc",
          },
          {
            value: "startDate-desc",
            label: "Sort by date, desc (recent first)",
          },
          {
            value: "startDate-asc",
            label: "Sort by date, asc (earlier first)",
          },
          {
            value: "totalPrice-desc",
            label: "Sort by amount, desc",
          },
          {
            value: "totalPrice-asc",
            label: "Sort by amount, asc",
          },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
