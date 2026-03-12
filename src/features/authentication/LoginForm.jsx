import { useState } from "react";
import Button from "../../ui/Button";
import StyledForm from "../../ui/StyledForm";
import Input from "../../ui/Input";
import FormRow from "../../ui/StyledFormRow";
import { loginWithPassword } from "../../services/apiAuth";
import useLogin from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const { login, isLoggingIn, loginResult, isLoginError, loginError } =
    useLogin();
  const [email, setEmail] = useState("test@test.com"); // 为了测试方便, 直接将 username 作为 default value
  const [password, setPassword] = useState("test"); // 为了测试方便, 直接将 password 作为 default value

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      return; // 如果 email 或 password 没有填, 就直接 return
    }

    login({ email, password });
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
