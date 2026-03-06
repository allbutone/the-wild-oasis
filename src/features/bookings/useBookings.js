import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export default function useBookings() {
  const [searchParams] = useSearchParams();

  // add filter conditions for bookings
  const status = searchParams.get("status") || "all";
  const filter = status === "all" ? null : { field: "status", value: status };

  // add sort conditions for bookings
  const sortBy = searchParams.get("sortBy") || "startDate-desc"; // 默认为第一个 option
  const [field, direction] = sortBy.split("-");
  const sort = { field, direction };

  const {
    isLoading,
    data: bookings,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sort],
    queryFn: () => getBookings(filter, sort),
  });

  return {
    isLoading,
    bookings,
    isError,
    error,
  };
}
