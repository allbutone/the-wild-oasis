import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import useSearchParamPageAndSize from "../../hooks/usePageAndSize";

export default function useBookings() {
  const [searchParams] = useSearchParams();
  const { page, size } = useSearchParamPageAndSize();

  // add filter conditions for bookings
  const status = searchParams.get("status") || "all";
  const filter = status === "all" ? null : { field: "status", value: status };

  // add sort conditions for bookings
  const sortBy = searchParams.get("sortBy") || "id-asc"; // 默认为第一个 option
  const [field, direction] = sortBy.split("-");
  const sort = { field, direction };

  const pageCurrent = { size, page };

  const {
    isLoading,
    data: { data: bookings, count } = {}, // data 在初期为 undefined, 因此需要指定为 {}, 防止解构报错
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sort, pageCurrent], // 建议在 react query devtools 中观察 key 值
    queryFn: () => getBookings(filter, sort, pageCurrent),
  });

  //prefetching for next page:
  const queryClient = useQueryClient();
  //prefetchQuery() 会 return promise (promise to get data of next page)
  //但不要在 prefetchQuery() 前面添加 await, 否则会耽误 data of current page 的获取
  const pageCount = Math.ceil(count / size);
  const pageNext = { size, page: page + 1 };
  //only prefetch next page when the current page is not the last page
  if (page < pageCount) {
    //如果要与查询的数据已经有了, 可以直接 queryClient.setQueryData
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sort, pageNext],
      queryFn: () => getBookings(filter, sort, pageNext),
    });
  }
  //only prefetch previous page when the current page is not the first page
  const pagePrev = { size, page: page - 1 };
  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sort, pagePrev],
      queryFn: () => getBookings(filter, sort, pagePrev),
    });
  }

  return {
    isLoading,
    bookings,
    count,
    isError,
    error,
  };
}
