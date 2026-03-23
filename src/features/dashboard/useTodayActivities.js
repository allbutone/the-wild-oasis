import { useQuery } from "@tanstack/react-query";
import {
  getTodayActivities,
} from "../../services/apiBookings";

export default function useTodayActivities() {
  const { isLoading, data } = useQuery({
    queryKey: ["today-activities"],
    queryFn: getTodayActivities,
  });

  return {
    isLoadingTodayActivities: isLoading,
    todayActivities: data,
  };
}
