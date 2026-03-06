import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useQuery } from "@tanstack/react-query";
import { getBooking, getBookings } from "../../services/apiBookings";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import { useSearchParams } from "react-router-dom";

function BookingTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  // add filter conditions for bookings
  const status = searchParams.get("status") || "all";
  const filter = status === "all" ? null : { field: "status", value: status };

  // add sort conditions for bookings
  const sortBy = searchParams.get('sortBy') || "startDate-desc"; // 默认为第一个 option
  const [field, direction] = sortBy.split('-');
  const sort = {field, direction};

  const {
    isLoading,
    data: bookings,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sort],
    queryFn: () => getBookings(filter, sort),
  });

  // const bookings = [];
  // 加载数据时, 展示 spinner
  if (isLoading) {
    return <Spinner />;
  }
  // 加载数据完毕后, 如果没有数据, 就展示 Empty 组件
  if (!bookings?.length) {
    return <Empty resource={"bookings"} />;
  }

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
      </Table>
    </Menus>
  );
}

export default BookingTable;
