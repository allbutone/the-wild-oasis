// 查找近期(在 time span 内)创建的 bookings
// time span:
// from: today's date - daysBefore
// to: today's date

import { useQuery } from "@tanstack/react-query";
import { getBookingsByCreatedAtBetween } from "../../services/apiBookings";
import { endOfDay, subDays } from "date-fns";
import { getUTCEndOfDay } from "../../utils/helpers";

export default function useRecentCreatedBookings(daysBefore) {
  // 注意:
  // 1. Date 虽然看起来是"仅日期", 但实际是带有 time part 的
  // 2. Supabase uses the ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) for timestamp fields, ensuring consistent UTC time storage. When working with timestamptz (timestamp with time zone) in PostgreSQL via the Supabase JS client, dates should be converted to this string format, typically using new Date().toISOString().
  // 3. table 'bookings' 内 field 'created_at' 的 type 为 timestampz, 需要使用 ISO 8601 format string 对其进行查询

  // const now = new Date();
  // console.log(now.toLocaleString()); // 3/19/2026, 11:21:10 AM
  // console.log(now.toISOString()); // 2026-03-19T03:21:10.345Z
  //
  // const to = endOfDay(now);
  // console.log(to.toLocaleString()); // 3/19/2026, 11:59:59 PM
  // console.log(to.toISOString()); // 2026-03-19T15:59:59.999Z
  //
  // const from = endOfDay(subDays(now, daysBefore));
  // console.log(from.toLocaleString()); // 3/12/2026, 11:59:59 PM
  // console.log(from.toISOString()); // 2026-03-12T15:59:59.999Z

  // 希望 from.toISOString() 返回 2026-03-12T23:59:59.999Z 却返回了 2026-03-12T15:59:59.999Z
  // 希望 to.toISOString() 返回 2026-03-19T23:59:59.999Z 却返回了 2026-03-19T15:59:59.999Z
  // 无奈, 只好手动实现如下:
  const now = new Date();
  const to = getUTCEndOfDay(now).toISOString();
  const from = getUTCEndOfDay(subDays(now, daysBefore)).toISOString();
  console.log(`querying field 'created_at' in between ${from} to ${to}`); // from 2026-03-12T23:59:59.999Z to 2026-03-19T23:59:59.999Z

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["bookings-created-between", from, to],
    queryFn: () =>
      getBookingsByCreatedAtBetween(from, to),
  });
  return { isLoading, data, isError, error };
}
