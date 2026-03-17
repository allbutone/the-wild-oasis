import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import StyledForm from "../../ui/StyledForm";
import FormRow from "../../ui/StyledFormRow";
import Input from "../../ui/Input";

import useGetUser from "./useGetUser";
import useUpdateUser from "./useUpdateUser";

function UpdateUserDataForm() {
  // 页面结构:
  // ProtectedRoute -> Account -> UpdateUserDataForm
  // 当 UpdateUserDataForm 被 return 的时候, ProtectedRoute 中通过 hook 'useGetUser' 获取的 user 一定是 loaded 且 authenticated
  // 下面直接使用即可, 无需判断是否 loaded
  const { user } = useGetUser();

  const [fullName, setFullName] = useState(user.user_metadata?.fullName); // 初始值为 current user 的 fullName
  const [avatarFile, setAvatarFile] = useState(null); // avatar 的值为 File instance

  const { updateUser, isUpdating, isUpdateUserError, updateUserError } =
    useUpdateUser();

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName && !avatarFile) {
      return;
    }
    const updateObj = {};
    if (fullName) {
      updateObj.fullName = fullName;
    }
    if (avatarFile) {
      updateObj.avatarFile = avatarFile;
      const parts = avatarFile.name.split('.');
      const suffix = `.${parts[parts.length - 1]}`
      updateObj.avatarStorePath = `${user.id}${suffix}`;
    }
    updateUser(updateObj);
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      {/* 不允许修改 email, 登录的时候要用 */}
      <FormRow label="Email address">
        <Input value={user.email} disabled />
      </FormRow>
      {/* fullName 可以修改 */}
      <FormRow label="Full name">
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </FormRow>
      {/* avatar 可以修改 */}
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          // e.target.files[0] 是 File instance
          onChange={(e) => setAvatarFile(e.target.files[0])}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" $variation="secondary">
          Cancel
        </Button>
        <Button>Update account</Button>
      </FormRow>
    </StyledForm>
  );
}

export default UpdateUserDataForm;
