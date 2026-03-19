import { useSearchParams } from "react-router-dom";

export default function useSpecificSearchParam(name, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams();

  let value = searchParams.get(name);

  // 注意:
  // 1. 如果没有指定的 search param, 那么其值为 null 而非 undefined
  // 2. 不能使用 !value 来判断, 因为 value 的有效值可能是 false, 会被误判为没有值
  if (value === null) {
    value = defaultValue;
  }
  return {
    name,
    value,
  };
}
