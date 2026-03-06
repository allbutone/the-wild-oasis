import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export default function useBookings() {
  const [searchParams] = useSearchParams();

  // add filter conditions for bookings
  const status = searchParams.get("status") || "all";
  const filter = status === "all" ? null : { field: "status", value: status };

  // add sort conditions for bookings
  const sortBy = searchParams.get("sortBy") || "id-asc"; // 默认为第一个 option
  const [field, direction] = sortBy.split("-");
  const sort = { field, direction };

  // 获取当前页码, 用于在查询数据时确定 .range(from, to) 里的 from 和 to
  const pageCurrent = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("size")
    ? Number(searchParams.get("size"))
    : 10;
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
