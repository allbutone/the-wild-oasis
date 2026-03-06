import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import Uploader from "../data/Uploader";

//sidebar 占据第一行(1)到最后一行(-1)
const StyledSideBar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);

  grid-row: 1 / -1;
  grid-column: 1 / span 1;

  display: flex;
  flex-direction: column;
  /* 让 Logo 和 MainNav 之间拉开间距 */
  gap: 3.2rem;
`;
export default function Sidebar() {
  return (
    <StyledSideBar>
      <Logo />
      <MainNav />

      {/* 用于上传测试数据(cabins/guests/bookings) */}
      {/* 需要为每个 table 开启增删改查对应的 RLS(row level security) Policy */}
      {/* cabin photos 需要手动上传到 bucket, 且需要将 bucket 设置为 public */}
      {/* 否则 cabin.image 无法使用 image file 对应的 public url */}
      <Uploader />
    </StyledSideBar>
  );
}
