import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";

function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <StyledRow>
        <Heading as="h3">Update user data</Heading>
        <p>Update user data form</p>
      </StyledRow>

      <StyledRow>
        <Heading as="h3">Update password</Heading>
        <p>Update user password form</p>
      </StyledRow>
    </>
  );
}

export default Account;
