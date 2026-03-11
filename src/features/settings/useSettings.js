import { useQuery } from "@tanstack/react-query";
import { getSettings, updateSetting } from "../../services/apiSettings";

export function useSettings() {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
  return { isLoading, data, isError, error };
}
