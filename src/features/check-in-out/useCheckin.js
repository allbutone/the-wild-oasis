import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // 其实 checkin 的本质就是修改 booking.status 为 'checked-in'
  // 为此需要使用 react-query 来 mutate booking
  const { mutate, isPending, data, isError, error } = useMutation({
    mutationFn: ({ bookingId, fieldsToUpdate }) => {
      return updateBooking(bookingId, fieldsToUpdate);
    },
    onSuccess: (result) => {
      toast.success(`booking of id ${result.id} successfully checked in!`);
      //参考 official doc 如下:
      //https://tanstack.com/query/v5/docs/reference/QueryClient#queryclientinvalidatequeries
      //https://tanstack.com/query/v5/docs/framework/react/guides/filters#query-filters

      // 以 queryKey: ['booking', 10] 为例:
      // 默认情况下, 如果 query key 包含 'booking' 和 10, 就会 invalidate
      // 但如果 exact 为 true, 那么当 query key 仅包含 'booking' 和 10, 才会 invalidate
      // queryClient.invalidateQueries({
      //   queryKey: ["booking", result.id],
      //   exact: true,
      // });

      // option 'type' 的作用: 过滤/查找要 invalidate 的 query (matching queries)
      //     option 'type' 默认值: 'all'
      // option 'refetchType' 的作用:  matching queries 中, 哪些 type 的 query 需要立刻 refetch
      //     option 'refetchType' 默认值: 'active'
      //
      // queryClient.invalidateQueries();
      // 上下等价, 意思是: invalidate all type of queries, then refetch only active ones among them
      // queryClient.invalidateQueries({type: 'all', refetchType: 'active'});

      // option 'type' 和 option 'refetchType' 组合使用 (1)
      // invalidate active queries, then refetch active ones among them
      // 效果: 发起 invalidate 的页面的数据实时更新, 其他页面不一定及时刷新
      // queryClient.invalidateQueries({ type: "active", refetchType: "active" });
      //
      // option 'type' 和 option 'refetchType' 组合使用 (2)
      // invaliate all queries, then refetch all of them
      // 效果: 所有页面的数据都实时更新
      queryClient.invalidateQueries({ type: "all", refetchType: "all" });

      // checkin 后需要: navigate back to the dashboard
      // navigate("/");
    },
    onError: (err) => {
      toast.error(`error occurred: ${err.message}`);
    },
  });

  return {
    checkin: mutate,
    isCheckingIn: isPending,
    checkingInResult: data,
    isCheckingError: isError,
    checkInError: error,
  };
}
