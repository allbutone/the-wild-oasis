import { useState } from "react";
import Button from "../../ui/Button";
import StyledForm from "../../ui/StyledForm";
import Input from "../../ui/Input";
import FormRow from "../../ui/StyledFormRow";
import useLogin from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const { login, isLoggingIn, loginResult, isLoginError, loginError } =
    useLogin();

  // 为了测试方便, 直接将 username 作为 default value
  const [email, setEmail] = useState("zaxitu@denipl.net"); // 使用 https://tempmailo.com/ 提供的 random email 来作为 userName 和 email

  // 为了测试方便, 直接将 password 作为 default value
  // 密码不要设置为 'test' 这类过于简单的, 否则测试的
  // 时候 chrome 总是弹出 alert window 提醒 password breached, 很烦
  const [password, setPassword] = useState("zaxitu@denipl.net"); // 使用 https://tempmailo.com/ 提供的 random email 来作为 password

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      return; // 如果 email 或 password 没有填, 就直接 return
    }

    login(
      { email, password },
      {
        onSettled: () => {
          // 无论 login 成功与否, 都重置表单
          setEmail("");
          setPassword("");
        },
      },
    );
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormRow label="Email address" $orientation={"vertical"}>
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoggingIn}
        />
      </FormRow>
      <FormRow label="Password" $orientation={"vertical"}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoggingIn}
        />
      </FormRow>
      <FormRow $orientation={"vertical"}>
        <Button size="large" disabled={isLoggingIn}>
          {isLoggingIn ? <SpinnerMini /> : "Login"}
        </Button>
      </FormRow>
    </StyledForm>
  );
}

export default LoginForm;
