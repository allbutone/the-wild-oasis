import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBooking } from "../../services/apiBookings";

export default function useBooking() {
  // 从 URL 中获取 path param 'bookingId';
  const { bookingId } = useParams();
  const { isLoading, data: booking, isError, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  return { isLoading, booking, isError, error };
}
