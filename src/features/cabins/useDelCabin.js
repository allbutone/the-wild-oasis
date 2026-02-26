import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useDelCabin() {
  const queryClient = useQueryClient();
  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: delCabin,
    onSuccess: () => {
      toast.success(`删除成功`); // 测试可知: val 是 delCabin 的 return value
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
  });
  return { mutate, isDeleting };
}
