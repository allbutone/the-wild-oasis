import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";

function Settings() {
  return (
    <StyledRow>
      <Heading as="h1">Update hotel settings</Heading>
      <UpdateSettingsForm />
    </StyledRow>
  );
}

export default Settings;
