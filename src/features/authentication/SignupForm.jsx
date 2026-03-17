import Button from "../../ui/Button";
import StyledForm from "../../ui/StyledForm";
import FormRow from "../../ui/StyledFormRow";
import Input from "../../ui/Input";
import { useForm } from "react-hook-form";
import useSignUp from "./useSignUp";

// Email regex: /\S+@\S+\.\S+/

// 测试: sign up user (也算技术小结)
// 1. 到 https://tempmailo.com/ 获取 random email, 例如 xusuxu@denipl.net
// 2. 在 sign up form 中, 将 fullName email password passwordConfirm 都填成 xusuxu@denipl.net (懒省事的做法)
//    然后提交表单, 注意, 免费版 supabase 会限制每小时内的 sign up 次数(貌似是每小时只能注册两次), 超过的话, 会报错如下:
//    {
//        "code": "over_email_send_rate_limit",
//        "message": "email rate limit exceeded"
//    }
// 3. 执行 logout, 会: 
//    - 执行 supabase.auth.signOut() 删除 local storage 中的 current session
//    - 执行 queryClient.removeQueries(); 删除 query cache 'user' 
//    - 执行 navigate("/login", { replace: true }); 跳转到 /login
// 4. 在 /login 界面, 尝试使用如下信息登录:
//    email:    xusuxu@denipl.net
//    password: xusuxu@denipl.net
//    会报错, 提示: email not verified
// 5. 到 supabase 后台查看 table `users` 里 xusuxu@denipl.net 对应的 row, 发现 column 'last sign in at' 提示 'waiting for verification'
// 6. 到 https://tempmailo.com/ 打开 confirmation email, 点里面的 verify link 跳转到 /dashboard 界面:
//    https://zzudlfaityyrmtxwajxy.supabase.co/auth/v1/verify?token=xxx&type=signup&redirect_to=http://localhost:5173/dashboard
//    此时会顺序执行:
//    - Dashboard 所间接 import 的 supabase (supabase client variable) 会完成初始化(从 verify link 中提取 token 并将 current session 存储到 local storage)
//      本质和 login form 所调用的 supabase.auth.signInWithPassword() 作用相同, 都是将 authentication result (current session) 存储到 local storage
//    - Dashboard 所使用的 hook 'useGetUser' 会
//        - 执行 supabase.auth.getSession() 从 local storage 中提取 session 
//        - 将 session.user 存储到 query cache 'user' 中
// 7. 此时在 /dashboard 界面可以看到 Header 所展示的 fullName 为 xusuxu@denipl.net, 表示 current user 的 fullName 为 xusuxu@denipl.net
// 8. 再次回到 supabase 后台查看 table `users` 里 xusuxu@denipl.net 对应的 row, 发现 column 'last sign in at' 变成了 "click verify link to login" 时的时间戳了
function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { signUp, isSigningUp, signUpResult, isSignUpError, signUpError } =
    useSignUp();

  console.log("validation errors:", errors); // 查看 validation errors 的结构
  // 结构是这样的:
  // {
  //   fullName: { type: "required", message: "this field is required" },
  //   email: { type: "required", message: "this field is required" },
  // }

  function onSubmit(formData) {
    console.log("form data:", formData);

    // 提交表单, 然后重置表单
    signUp(formData, { onSettled: () => reset({
      fullName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    }) });
  }

  function onError(formError) {}

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Full name" error={errors.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isSigningUp}
          {...register("fullName", {
            required: "this field is required",
          })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors.email?.message}>
        <Input
          // 如果 type 为 email 的话, form 在 submit 的时候会有 default pattern checking
          // 但我们希望使用自定义的 pattern checking, 因此将 type 修改为 text 如下:
          // type="email"
          type="text"
          id="email"
          disabled={isSigningUp}
          {...register("email", {
            required: "this field is required",
            pattern: {
              value: /\S+@\S+\.\S+/, // course 在注释里提供了这个 regex
              message: "please fill in a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isSigningUp}
          {...register("password", {
            required: "this field is required",
            minLength: {
              value: 8,
              message: "password should contain at least 8 chars",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isSigningUp}
          {...register("passwordConfirm", {
            required: "this field is required",
            validate: (fieldValue, formValues) => {
              return fieldValue === formValues.password || "password mismatch";
            },
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        {/* 只要 type 为 reset, 就可以重置所在 form, 不需要添加 onClick 让其去执行 reset function */}
        <Button $variation="secondary" type="reset" disabled={isSigningUp}>
          Cancel
        </Button>
        <Button disabled={isSigningUp}>Create new user</Button>
      </FormRow>
    </StyledForm>
  );
}

export default SignupForm;
