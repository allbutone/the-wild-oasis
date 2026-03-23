import styled from "styled-components";

import Heading from "../../ui/Heading";
import StyledRow from "../../ui/Row";
import useTodayActivities from "./useTodayActivities";
import Activity from "./Activity.jsx";
import Spinner from "../../ui/Spinner";

const StyledTodayActivitiesContainer = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
  padding-top: 2.4rem;
`;

const ActivityList = styled.ul`
  overflow: scroll;
  overflow-x: hidden;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  // scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

export default function TodayActivities() {
  const { todayActivities, isLoadingTodayActivities } = useTodayActivities();

  console.log(todayActivities);

  // 下面这样展示的 spinner 会替换 StyledTodayActivitiesContainer, 效果不好
  // 建议让 spinner 替换 <ActivityList>, 这样替换的就是列表, 效果好一些
  // if (isLoadingTodayActivities) return <Spinner />;

  return (
    <StyledTodayActivitiesContainer>
      {/* 课程里将 Heading 放在 StyledRow 内展示, 但个人觉得
      如果内容只有一个 Heading 的话, 就没必要使用 StyledRow 了 */}
      {/* <StyledRow> */}
      <Heading as={"h2"}>Today's Activities</Heading>
      {/* </StyledRow> */}

      {/* 展示逻辑: */}
      {/* 如果正在加载, 就在目标位置展示 Spinner */}
      {/* 如果加载完毕, 但内容长度为 0, 就在目标位置展示 NoActivity */}
      {/* 如果加载完毕, 但内容长度非 0, 就在目标位置展示 ActivityList */}
      {isLoadingTodayActivities ? (
        <Spinner />
      ) : todayActivities.length === 0 ? (
        <NoActivity>NO activity today...</NoActivity>
      ) : (
        <ActivityList>
          {todayActivities.map((booking) => (
            <Activity booking={booking} />
            // 为了测试 activity 过多时是否会纵向滚动展示, 可以将上行代码替换如下:
            /* <>
            <Activity booking={booking} />
            <Activity booking={booking} />
            <Activity booking={booking} />
            <Activity booking={booking} />
            <Activity booking={booking} />
            <Activity booking={booking} />
            <Activity booking={booking} />
            <Activity booking={booking} />
            <Activity booking={booking} />
          </> */
          ))}
        </ActivityList>
      )}
    </StyledTodayActivitiesContainer>
  );
}
