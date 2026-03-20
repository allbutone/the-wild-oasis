import styled from "styled-components";
import useRecentCreatedBookings from "./useRecentCreatedBookings.js";
import Spinner from "../../ui/Spinner.jsx";
import useSpecificSearchParam from "../../hooks/useSpecificSearchParam.js";
import useRecentStartedBookings from "./useRecentStartedBookings.js";
import Stat from "./Stat.jsx";
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers.js";
import { useCabins } from "../cabins/useCabins.js";
import SalesAreaChart from "./SalesAreaChart.jsx";
import { eachDayOfInterval, format, subDays } from "date-fns";
import DurationPieChart from "./DurationPieChart.jsx";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  // 课程里给出的样式: 会导致第二行的 pie chart 因为高度不足而纵向溢出展示
  // 注释掉就解决问题了:
  // grid-template-rows: auto 34rem auto;

  gap: 2.4rem;
`;
export default function DashboardLayout() {
  const { value: recentDays } = useSpecificSearchParam("last", 7);

  // 近期创建的订单
  const {
    isLoading: isLoadingRecentCreatedBookings,
    data: recentCreatedBookings,
    isError: isCreatedBookingsError,
    error: createdBookingsError,
  } = useRecentCreatedBookings(Number(recentDays));

  // 近期入住的订单
  const {
    isLoading: isLoadingRecentStartedBookings,
    data: recentStartedBookings,
    isError: isStartedBookingsError,
    error: startedBookingsError,
  } = useRecentStartedBookings(Number(recentDays));

  // 用于统计总共有多少 cabin
  const {
    isLoading: isLoadingCabins,
    data: cabins,
    isError: isCabinsError,
    error: cabinsError,
  } = useCabins();

  if (
    isLoadingRecentCreatedBookings ||
    isLoadingRecentStartedBookings ||
    isLoadingCabins
  ) {
    return <Spinner />;
  }

  // 近期创建的订单, 汇总的销售额
  const sales = recentCreatedBookings.reduce(
    (acc, current) => (acc += current.totalPrice),
    0,
  );

  // 近期入住的订单里面, 有多少已经实际入住(status 为 checked-in 或 checked-out)
  const confirmedBookings = recentStartedBookings.filter(
    (b) => b.status !== "unconfirmed",
  );

  // 客房(cabin) 入住率, 计算公式(并不精准):
  // 1. 对 confirmedBookings 进行汇总, 看总共入住了多少晚
  // 2. 计算: 在 recentDays 这个 time span 内, all cabins 最多能住多少晚
  // 3. step-1/step-2 即可得到粗略的入住率
  const occupancyRate =
    confirmedBookings.reduce((acc, current) => (acc += current.numNights), 0) /
    (recentDays * cabins.length);

  console.log(recentCreatedBookings);
  console.log(recentStartedBookings);

  // 为 recentCreatedBookings 统计 dailySales 和 dailyExtraSales
  // stats 的最终结构是这样的:
  // const stats = [{
  //   label: 'Mar 14',
  //   dailySales: 1000,
  //   dailyExtraSales: 200,
  // },{
  //   label: 'Mar 15',
  //   dailySales: 500,
  //   dailyExtraSales: 10,
  // }]

  // 自己的统计方式, 缺点: stats [obj, obj, ...] 中的 obj 并没有按照 obj.label 升序排列
  function getStatsOfRecentCreatedBookings1() {
    const stats = recentCreatedBookings.reduce((acc, current) => {
      const label = format(current.created_at, "MMM dd");
      // console.log(`acc:`, acc);
      const obj = acc.find((one) => one.label === label);
      if (obj) {
        obj.dailySales += current.totalPrice;
        obj.dailyExtraSales += current.extrasPrice;
      } else {
        acc.push({
          label: label,
          dailySales: current.totalPrice,
          dailyExtraSales: current.extrasPrice,
        });
      }
      return acc;
    }, []);
    // 如果 recentDays 内 some day 没有对应的 booking, 那么在 stats 内就没有对应的 object
    // 因此需要为 some day 插入对应的 object
    const today = new Date();
    for (let i = 0; i < recentDays; i++) {
      const currentDay = subDays(today, i);
      const labelOfCurrentDay = format(currentDay, "MMM dd");
      const obj = stats.find((one) => one.label === labelOfCurrentDay);
      if (!obj) {
        stats.push({
          label: labelOfCurrentDay,
          dailySales: 0,
          dailyExtraSales: 0,
        });
      }
    }

    return stats;
  }

  // 课程使用的统计方式
  function getStatsOfRecentCreatedBookings2() {
    const today = new Date();
    const from = subDays(today, recentDays - 1);
    const to = today;
    // 按照日期升序, 生成 `today - recentDays` 到 `today` 范围内的 [obj, obj, ...]
    const dateRange = eachDayOfInterval({
      start: from,
      end: to,
    });
    // map [date, date, ...] to [obj, obj, ...]
    const stats = dateRange.map((date) => {
      const currentLabel = format(date, "MMM dd");
      return {
        label: currentLabel,
        dailySales: recentCreatedBookings.reduce((acc, current) => {
          if (format(current.created_at, "MMM dd") === currentLabel) {
            acc += current.totalPrice;
          }
          return acc;
        }, 0),
        dailyExtraSales: recentCreatedBookings.reduce((acc, current) => {
          if (format(current.created_at, "MMM dd") === currentLabel) {
            acc += current.extrasPrice;
          }
          return acc;
        }, 0),
      };
    });

    return { stats, from, to };
  }

  // const statsOfRecentCreatedBookings = getStatsOfRecentCreatedBookings1();
  const {
    stats: statsOfRecentCreatedBookings,
    from,
    to,
  } = getStatsOfRecentCreatedBookings2();
  console.log(`statsOfRecentCreatedBookings`, statsOfRecentCreatedBookings);

  return (
    <StyledDashboardLayout>
      {/* 近期订单数量 */}
      <Stat
        icon={<HiOutlineBriefcase />}
        // Icon 内会使用 props 'color' 动态计算背景色
        color={"blue"}
        title={"Bookings"}
        value={recentCreatedBookings.length}
      />
      {/* 由近期订单统计出来的销售额 */}
      <Stat
        icon={<HiOutlineBanknotes />}
        color={"green"}
        title={"Sales"}
        value={formatCurrency(sales)}
      />
      {/* 近期入住订单中, 有多少实际入住过(状态不是 unconfirmed) */}
      <Stat
        icon={<HiOutlineCalendar />}
        color={"indigo"}
        title={"Checked In & Outs"}
        value={confirmedBookings.length}
      />
      {/* 客房(cabin) 入住率 */}
      <Stat
        icon={<HiOutlineCalendar />}
        color={"yellow"}
        title={"Occupancy Rate"}
        value={`${Math.round(occupancyRate * 100)}%`}
      />
      {/* 为 confirmedBookings 按照 booking.numNights 分类统计 */}
      <DurationPieChart confirmedBookings={confirmedBookings} />
      {/* 为 recentCreatedBookings 统计 dailySales 和 dailyExtraSales */}
      <SalesAreaChart
        stats={statsOfRecentCreatedBookings}
        title={`Daily sales stats from ${format(from, "MMM dd, yyyy")} to ${format(to, "MMM dd, yyyy")}`}
      />
    </StyledDashboardLayout>
  );
}
