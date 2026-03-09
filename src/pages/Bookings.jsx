import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";

function Bookings() {
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </StyledRow>
      <StyledRow>
        <BookingTable/>
      </StyledRow>
    </>
  );
}

export default Bookings;
