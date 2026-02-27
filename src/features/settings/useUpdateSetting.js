import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting } from "../../services/apiSettings";
import toast from "react-hot-toast";

export function useUpdateSetting(){
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateSetting,
    onSuccess: (data) => {
      toast.success(
        `successfully updated setting!`,
      );
      queryClient.invalidateQueries({ queryKey: ["setting"] });
    },
    // err 是 mutationFn 执行时产生的 error instance
    onError: (err) =>
      toast.error(`oops! detected error with message ${err.message}`),
  });
  return {mutate, isPending};
}
