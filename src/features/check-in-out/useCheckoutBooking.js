import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckoutBooking() {
  const queryClient = useQueryClient();
  const { mutate, isPending, data, isError, error } = useMutation({
    mutationFn: (bookingId) => {
      return updateBooking(bookingId, { status: "checked-out" });
    },
    onSuccess: (result) => {
      toast.success(`booking of id ${result.id} successfully checked out!`);
      // 默认的 invalidateQueries() 相当于:
      // queryClient.invalidateQueries({ type: "all", refetchType: "active" });
      // 不过可以自定义如下:
      queryClient.invalidateQueries({ type: "active", refetchType: "active" });
    },
    onError: (err) => {
      toast.error(`error occurred: ${err.message}`);
    },
  });

  return {
    checkout: mutate,
    isCheckingOut: isPending,
    checkoutResult: data,
    isCheckoutError: isError,
    checkoutError: error,
  };
}
