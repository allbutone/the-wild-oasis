import BookingDetail from "../features/bookings/BookingDetail";

export default function Booking() {
  throw Error('我是故意添加的 rendering error, 由 ErrorBoundary 负责 catch!');
  return <BookingDetail />;
}
