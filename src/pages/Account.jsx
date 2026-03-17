import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";

function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <StyledRow>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </StyledRow>

      <StyledRow>
        <Heading as="h3">Update password</Heading>
        {/* <UpdatePasswordForm /> */}
      </StyledRow>
    </>
  );
}

export default Account;
