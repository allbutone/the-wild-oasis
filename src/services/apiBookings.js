import { getToday } from "../utils/helpers";
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

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
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
