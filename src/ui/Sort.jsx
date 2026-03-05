import { useSearchParams } from "react-router-dom";
import Select from "./Select";

// 和 Filter 的作用相同, Sort 也是添加 search params, 例如 ?sortBy=name-asc
// 其中 `sortBy` 是固定不变(不允许指定)的, 而 name-asc 则对应 option.value
export default function Sort({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 数据流向: <select/> -> state 'searchParams'
  function onChange(e) {
    setSearchParams((prevParams) => {
      prevParams.set("sortBy", e.target.value);
      return prevParams; //别忘了原样返回, 否则不会有任何效果
    });
  }

  // 数据流向: state 'searchParams' -> <select/>
  const defaultValue = searchParams.get("sortBy") || '';

  // <Select> 底层是 <select> 是一个 controlled input:
  // 1. 需要传入 props 'defaultValue', prop value 将赋值给 <select> 的 attr 'value'
  // 2. 需要传入 props 'onChange', prop value 将赋值给 <select> 的 attr 'onChange'
  return (
    <Select
      options={options}
      defaultValue={defaultValue}
      onChange={onChange}
    ></Select>
  );
}
