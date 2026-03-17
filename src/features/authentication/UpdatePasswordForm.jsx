import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import StyledForm from "../../ui/StyledForm";
import FormRow from "../../ui/StyledFormRow";
import Input from "../../ui/Input";
import useUpdateUser from "./useUpdateUser";

// import { useUpdateUser } from "./useUpdateUser";

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const { updateUser, isUpdating } = useUpdateUser();

  function resetForm() {
    // 使用 react hook form 的 reset(values) 来重置表单
    reset({
      password: "",
      passwordConfirm: "",
    });
  }
  function onSubmit({ password }) {
    updateUser(
      { password },
      {
        onSuccess: resetForm,
      },
    );
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Password (min 8 characters)"
        error={errors.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Confirm password" error={errors.passwordConfirm?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (inputValue, formValues) =>
              formValues.password === inputValue || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={resetForm}
          type="reset"
          $variation="secondary"
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </StyledForm>
  );
}

export default UpdatePasswordForm;
