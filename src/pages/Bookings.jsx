import BookingTable from "../features/bookings/BookingTable";
import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";

function Bookings() {
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <p>TEST</p>
      </StyledRow>
      <StyledRow>
        <BookingTable/>
      </StyledRow>
    </>
  );
}

export default Bookings;
