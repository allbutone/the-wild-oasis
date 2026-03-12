import { useState } from "react";
import Button from "../../ui/Button";
import StyledForm from "../../ui/StyledForm";
import Input from "../../ui/Input";
import FormRow from "../../ui/StyledFormRow";
import { login } from "../../services/apiAuth";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if(!email || !password){
      return; // 如果 email 或 password 没有填, 就直接 return
    }

    login({email, password});
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
        />
      </FormRow>
      <FormRow label="Password" $orientation={"vertical"}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRow>
      <FormRow $orientation={"vertical"}>
        <Button size="large">Login</Button>
      </FormRow>
    </StyledForm>
  );
}

export default LoginForm;
