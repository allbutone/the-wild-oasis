import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins, // queryFn 是一个 return value 为 promise 的 function
  });
  return { isLoading, data, isError, error};
}
