import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useMoveBack } from "../../hooks/useMoveBack";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  // const moveBack = useMoveBack();

  const { mutate, isPending, data, isError, error } = useMutation({
    mutationFn: (bookingId) => {
      return deleteBooking(bookingId);
    },
    onSuccess: () => {
      toast.success(`booking successfully deleted!`);
      // queryClient.invalidateQueries({ type: "all" }); // 会 refetch 刚才删掉的 booking
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // invalidate all queries with key 'bookings'
      
      // 1. 如果是在 booking list 触发的删除, 那么应该停留在 current page
      // 2. 如果是在 booking detail 触发的删除, 则应该 move back to previous page
      //
      // 因此, 是否要 move back to previous page, 取决于 mutate 在哪里触发, 也就是说:
      // onSuccess 指定为 mutate 的参数比较合适
      // moveBack(); // 哪来的回哪儿去
    },
    onError: (err) => {
      toast.error(`error occurred: ${err.message}`);
    },
  });

  return {
    // delete 是 JavaScript 关键字, 需要避开使用
    del: mutate,
    isDeleting: isPending,
    deleteResult: data,
    isDeleteError: isError,
    deleteError: error,
  };
}
