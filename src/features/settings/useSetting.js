import { useQuery } from "@tanstack/react-query";
import { getSettings, updateSetting } from "../../services/apiSettings";

export function useSetting() {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["setting"],
    queryFn: getSettings,
  });
  return { isLoading, data, isError, error };
}
