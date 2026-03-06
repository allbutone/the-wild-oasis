import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import useBookings from "./useBookings";
import Pagination from "../../ui/Pagination";

function BookingTable() {
  const { isLoading, bookings, count, isError, error } = useBookings();

  // const bookings = [];
  // 加载数据时, 展示 spinner
  if (isLoading) {
    return <Spinner />;
  }
  // 加载数据完毕后, 如果没有数据, 就展示 Empty 组件
  // if (!bookings?.length) {
  //   return <Empty resource={"bookings"} />;
  // }

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
