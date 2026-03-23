import { getUTCStartOfDay } from "../utils/helpers";
import supabase from "./supabase";

// filter 是一个 object, 其中:
// - field: 根据哪个字段进行过滤
// - value: 字段的值
// - method: field 和 value 的关系, 例如 'eq', 'gt' 对应 supabase 的 query method
//
// sort 是一个 object, 其中:
// - field: 根据哪个字段排序
// - value: 'asc' or 'desc'
//
// page 是一个 object, 其中:
// - pageCurrent: 当前页码
// - pageSize: 每页多少条数据
export async function getBookings(filter, sort, pageInfo) {
  // console.log(`filter by: `);
  // console.log(filter);
  // console.log(`sort by: `);
  // console.log(sort);
  // console.log(`of page: `);
  // console.log(pageInfo);

  let query = supabase
    .from("bookings")
    // .select('*, cabins(*), guests(*)');
    // 精确获取所需数据, 而不是全部, 如下(和 BookingRow 所需 field 一一对应):
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, status,  cabins(name), guests(fullName)",
      { count: "exact" }, // 这样结果里可以额外 destructure 出来 count
    );

  // 如果指定了 filter 条件
  if (filter) {
    query = query[filter.method || "eq"](filter.field, filter.value);
  }
  // 如果指定了 sort 条件
  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === "asc" });
  }
  // 如果指定了 page 和 size
  if (pageInfo) {
    const { page, size } = pageInfo;
    const from = (page - 1) * size; // 0-based index, inclusive
    const to = from + size - 1; // 0-based index, inclusive
    query = query.range(from, to);
  }
  const result = await query;
  // console.log(`query result: `);
  // console.log(result);
  const { data, error, count } = result;

  if (error) {
    throw new Error(error.message);
  }
  // return []; // 测试 BookingTable 是否会对应展示 Empty 组件
  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// 查询: created_at(下单时间)在 time span 内的 bookings
export async function getBookingsByCreatedAtBetween(from, to) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", from)
    .lte("created_at", to);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// 查询: startDate(入住时间)在 time span 内的 bookings
export async function getBookingsByStartAtBetween(from, to) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", from)
    .lte("startDate", to);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// today activity 分两种情况:
// 1. status 为 unconfirmed, 但是 startDate 是今天, 即: 今日即将签到的 booking
// 2. status 为 checked-in, 但是 endDate 是今天, 即: 今日即将签出的 booking
export async function getTodayActivities() {
  const today = getUTCStartOfDay(new Date()).toISOString(); // timestamp 类型的 field 需要使用 ISO string 来查询

  // or(string_condition) 中: string_condition 遵守的是 PostgREST DSL syntax
  // supabase.js 负责通过 method chain (包括 method 'or') 构建符合 PostgREST DSL 的查询参数, 并发出 http request
  // PostgREST 负责解析请求中的 PostgREST DSL 查询参数, 将其转换为 SQL 并执行
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    // 发现 or(string) 内的 string 如果为了可读性添加换行符, 就会报错
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${today}),and(status.eq.checked-in,endDate.eq.${today})`,
    )
    .order("created_at");
  // 借助 PostgREST 的优点: 在不创建数据库视图的情况下, 实现了数据库视图的功能.

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, fieldsToUpdate) {
  const { data, error } = await supabase
    .from("bookings")
    .update(fieldsToUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
