import styled from "styled-components";
import useGetUser from "./useGetUser";

const StyledAvatarContainer = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const StyledAvatar = styled.img`
  display: block;
  width: 3.6rem;
  height: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

export default function UserAvatar() {
  // 页面结构:
  // ProtectedRoute -> AppLayout -> Sidebar + Header + content (<Outlet)
  // 在 ProtectedRoute 内, 只有 user 通过 authentication, 才会展示其下
  // 的 children(即: AppLayout), 继而展示 AppLayout 下的 Header
  // 因此 Header 内通过 hook 'useGetUser' 获取的 user 一定是 loaded 且经过 authentication 的
  // 可以直接使用如下, 无需进行 isLoading 状态判断:
  const { user } = useGetUser();
  const { avatar, fullName } = user.user_metadata;

  // 如果 user 有 avatar (图片地址), 就直接展示, 否则就展示 default avatar image
  return (
    <StyledAvatarContainer>
      <StyledAvatar
        src={avatar || "/default-user.jpg"}
        alt={`avatar of user ${fullName}`}
      />
      <span>{fullName}</span>
    </StyledAvatarContainer>
  );
}
