import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import usePageAndSize from "../../hooks/usePageAndSize";

export default function useBookings() {
  const [searchParams] = useSearchParams();
  const {pageCurrent, pageSize} = usePageAndSize();

  // add filter conditions for bookings
  const status = searchParams.get("status") || "all";
  const filter = status === "all" ? null : { field: "status", value: status };

  // add sort conditions for bookings
  const sortBy = searchParams.get("sortBy") || "id-asc"; // 默认为第一个 option
  const [field, direction] = sortBy.split("-");
  const sort = { field, direction };

  const page = {pageCurrent, pageSize};

  const {
    isLoading,
    data: { data: bookings, count } = {}, // data 在初期为 undefined, 因此需要指定为 {}, 防止解构报错
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sort, page], // 建议在 react query devtools 中观察 key 值
    queryFn: () => getBookings(filter, sort, page),
  });

  return {
    isLoading,
    bookings,
    count,
    isError,
    error,
  };
}
