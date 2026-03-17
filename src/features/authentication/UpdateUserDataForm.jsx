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
  const currentFullName = user.user_metadata?.fullName;

  const [fullName, setFullName] = useState(currentFullName); // 初始值为 current user 的 fullName
  const [avatarFile, setAvatarFile] = useState(null); // avatar 的值为 File instance

  const { updateUser, isUpdating, isUpdateUserError, updateUserError } =
    useUpdateUser();

  function handleSubmit(e) {
    e.preventDefault();

    // 利用如下注释观察 button 'cancel' 的效果
    // console.log("fullName: ", fullName);
    // console.log("avatarFile: ", avatarFile);
    // return;

    if (!fullName && !avatarFile) {
      return;
    }
    const updateObj = {};
    if (fullName) {
      updateObj.fullName = fullName;
    }
    if (avatarFile) {
      updateObj.avatarFile = avatarFile;
      const parts = avatarFile.name.split(".");
      const suffix = `.${parts[parts.length - 1]}`;
      updateObj.avatarStorePath = `${user.id}${suffix}`;
    }
    updateUser(updateObj, { onSuccess: () => {
      // 更新成功后, 将 file input 重置:
      // 1. 重置 file input 对应的 state
      setAvatarFile(null);
      // 2. 重置 file input 的 UI, 让其显示"no file chosen"
      e.target.reset(); // form reset 触发 file input reset
    } });
  }

  function handleReset(e) {
    // form 内的 reset button(type 为 reset 的 button), 无法重置 form 内的 controlled element
    // 例如: 点击 reset button 后, file input 会显示"no file chosen", 但其 value 仍然受对应 state 控制

    // 1. 不要阻止 reset button 的默认行为, 这样 click reset button 时才能让 file input 显示"没有选择任何文件"(value 仍受 state 控制)
    // e.preventDefault();

    // 2. 重置 input 对应的 state
    setAvatarFile(null);
    setFullName(currentFullName);
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
          disabled={isUpdating}
        />
      </FormRow>
      {/* avatar 可以修改 */}
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          // e.target.files[0] 是 File instance
          onChange={(e) => setAvatarFile(e.target.files[0])}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          $variation="secondary"
          disabled={isUpdating}
          onClick={handleReset}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </StyledForm>
  );
}

export default UpdateUserDataForm;
