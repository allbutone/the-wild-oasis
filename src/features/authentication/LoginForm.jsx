import { useState } from "react";
import Button from "../../ui/Button";
import StyledForm from "../../ui/StyledForm";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {}

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large">Login</Button>
      </FormRowVertical>
    </StyledForm>
  );
}

export default LoginForm;
