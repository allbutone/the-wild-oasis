import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();
  const { mutate, isPending, data, isError, error } = useMutation({
    mutationFn: (bookingId) => {
      return updateBooking(bookingId, { status: "checked-out" });
    },
    onSuccess: (result) => {
      toast.success(`booking of id ${result.id} successfully checked out!`);
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
