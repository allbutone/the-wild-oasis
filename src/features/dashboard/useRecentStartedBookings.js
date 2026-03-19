// 查找近期(在 time span 内)开始入住(不一定入住, 取决于 status)的 bookings
// time span:
// from: today's date - recentDays
// to: today's date

import { useQuery } from "@tanstack/react-query";
import { getBookingsByStartAtBetween } from "../../services/apiBookings";
import { subDays } from "date-fns";
import { getUTCEndOfDay } from "../../utils/helpers";

export default function useRecentStartedBookings(recentDays) {
  const now = new Date();
  const to = getUTCEndOfDay(now).toISOString();
  const from = getUTCEndOfDay(subDays(now, recentDays)).toISOString();
  console.log(`querying field 'startDate' in between ${from} to ${to}`);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["bookings-started-between", from, to],
    queryFn: () =>
      getBookingsByStartAtBetween(from, to),
  });
  return { isLoading, data, isError, error };
}
