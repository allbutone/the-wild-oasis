import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import { useDarkMode } from "../../context/ThemeContext";

// const StyledChartContainer = styled.div`
//   grid-column: 1 / -1;
// `;
const StyledChartContainer = styled(DashboardBox)`
  // 占据 whole row, 相当于指定了 width
  grid-column: 1 / -1;

  // grid item 内的 chart 居中展示:
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default function SalesAreaChart({ stats, title }) {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode
    ? {
        foreground: "#e5e7eb",
        background: "#18212f",
      }
    : {
        foreground: "#374151",
        background: "#fff",
      };
  return (
    <StyledChartContainer>
      <Heading as={"h2"}>{title}</Heading>
      <AreaChart
        style={{
          width: "100%",
          aspectRatio: 16 / 9,
        }}
        responsive
        data={stats}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fill: colors.foreground }} // 刻度对应的文字的颜色
          tickLine={{ stroke: colors.foreground }} // 刻度颜色
        />
        <YAxis
          width="auto"
          tick={{ fill: colors.foreground }} // 刻度对应的文字的颜色
          tickLine={{ stroke: colors.foreground }} // 刻度颜色
        />
        <Tooltip contentStyle={{ backgroundColor: colors.background }} />
        <Area
          type="monotone"
          dataKey="dailySales"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#gradient1)"
          name="daily sales"
          isAnimationActive={true}
          unit={"$"}
        />
        <Area
          type="monotone"
          dataKey="dailyExtraSales"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#gradient2)"
          name="daily extra sales"
          isAnimationActive={true}
          unit={"$"}
        />
      </AreaChart>
    </StyledChartContainer>
  );
}
