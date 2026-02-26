import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrUpdateCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreateOrUpdateCabin(isUpdate){
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createOrUpdateCabin,
    onSuccess: (cabin) => {
      toast.success(
        `successfully ${isUpdate ? "updated" : "created"} one cabin with id ${cabin.id} and name ${cabin.name}`,
      );
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    // err 是 mutationFn 执行时产生的 error instance, 而不是 react-hook-form 校验时产生的 error
    onError: (err) =>
      toast.error(`oops! detected error with message ${err.message}`),
  });
  return {mutate, isPending};
}
