import DashboardFilter from "../features/dashboard/DashboardFilter";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import Heading from "../ui/Heading";
import StyledRow from "../ui/Row";

function Dashboard() {
  return (
    <>
      <StyledRow type="horizontal">
        <Heading as="h1">Dashboard</Heading>

        {/* 使用 DashboardFilter 为 url 添加 search param 'last' 如下 */}
        <DashboardFilter />
      </StyledRow>
      <DashboardLayout />
    </>

  );
}

export default Dashboard;
