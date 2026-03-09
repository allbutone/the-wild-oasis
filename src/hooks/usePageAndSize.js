import { useSearchParams } from "react-router-dom";

function useSearchParamPageAndSize() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1; // 如果未指定, 就默认第 1 页
  const size = searchParams.get("size")
    ? Number(searchParams.get("size"))
    : 10;// 如果未指定, 就默认每页 10 条记录
  return { page, size };
}
export default useSearchParamPageAndSize;
