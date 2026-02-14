import {
  HiHome,
  HiHomeModern,
  HiOutlineCalendarDays,
  HiOutlineCog8Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineUsers,
  HiUsers,
} from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

/* 
使用 NavLink 的好处是: 会被 react router 自动添加 .active 样式
但缺点是:
NavLink 的默认样式几乎没有, 我们需要通过 styled components 为其添加样式如下: 

styled styled-components 添加样式分两种情况:
1. 为 native element 例如 <a> 添加样式
    const YourComponent = styled.a``
2. 为 non-native element 例如 <NavLink> 添加样式
    const YourComponent = styled(NavLink)``
    这样: 既可以保留 NavLink 的行为(自动添加 class 'active'), 又可以为其添加样式
*/

// const StyledLink = styled.a`
const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  /*
    react-icons 内的 heroicons 来自 tailwind, 从 project 地址可以看出来:
    https://github.com/tailwindlabs/heroicons
    安装 react-icons 后, li 内的 icon 组件在 chrome devtools 中对应 svg 
  */
  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  /* icon (本质为 svg) 所在的 li 被 hover 后, svg 应变成的颜色: */
  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    /* icon (本质为 svg) 所在的 li 被 click 后, svg 应变成的颜色: */
    color: var(--color-brand-600);
  }
`;

export default function MainNav() {
  return (
    <nav>
      <StyledList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/bookings">
            <HiOutlineCalendarDays />
            <span>Bookings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/cabins">
            <HiOutlineHomeModern />
            <span>Cabins</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/users">
            <HiOutlineUsers />
            <span>Users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            {/* cog 是齿轮的意思, 8 tooth 表示八齿齿轮 */}
            <HiOutlineCog8Tooth />
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </StyledList>
    </nav>
  );
}
