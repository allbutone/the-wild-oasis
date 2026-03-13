import { useMutation } from "@tanstack/react-query";
import { createNewUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useSignUp() {
  // apiAuth 中的 signUp 只是调用了 supabase.auth.signUp 方法
  // 下面借助 useMutation 对其进行状态管理
  const { mutate, isPending, data, isError, error } = useMutation({
    mutationFn: createNewUser,
    onSuccess: (data) => {
      toast.success(
        `successfully created user ${data.user.email}, now please verify your email before first-time sign-in`,
      );
    },
  });

  return {
    signUp: mutate,
    isSigningUp: isPending,
    signUpResult: data,
    isSignUpError: isError,
    signUpError: error,
  };
}
