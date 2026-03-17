import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser as updateUserApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useUpdateUser() {
  const queryClient = useQueryClient();

  const {
    mutate: updateUser,
    isPending: isUpdating,
    isError: isUpdateUserError,
    error: updateUserError,
  } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: (user) => {
      toast.success("successfully update user!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(`error occurred: ${error.message}`);
    },
  });

  return {
    updateUser,
    isUpdating,
    isUpdateUserError,
    updateUserError,
  };
}
