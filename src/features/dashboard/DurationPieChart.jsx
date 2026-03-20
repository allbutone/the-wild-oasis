import { Cell, Legend, Pie, PieChart, Sector, Tooltip } from "recharts";
import styled from "styled-components";
import { useDarkMode } from "../../context/ThemeContext";
import Heading from "../../ui/Heading";

const StyledPieChartContainer = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;

  /* 跨越 3-4 列 */
  grid-column: 3 / span 2;

  // grid item 内的 chart 居中展示:
  display: flex;
  flex-direction: column;
  align-items: center;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

// confirmedBookings 中的每个 booking 都将汇入对应分类中
const categoriesForLightMode = [
  {
    label: "1-3 nights", // category 对应的 section label (描述信息)
    value: 0, // category 对应的 section size (面积大小)
    color: "#ba4444", // category 对应的 section fill color (填充色)
  },
  {
    label: "4-7 nights",
    value: 0,
    color: "#84cc16",
  },
  {
    label: "8-14 nights",
    value: 0,
    color: "#14b8a6",
  },
  {
    label: "15-21 nights",
    value: 0,
    color: "#3b82f6",
  },
  {
    label: "21+ nights",
    value: 0,
    color: "#a855f7",
  },
];

const categoriesForDarkMode = [
  {
    label: "1-3 nights",
    value: 0,
    color: "#075985",
  },
  {
    label: "4-7 nights",
    value: 0,
    color: "#166534",
  },
  {
    label: "8-14 nights",
    value: 0,
    color: "#595A90",
  },
  {
    label: "15-21 nights",
    value: 0,
    color: "#854D0E",
  },
  {
    label: "21+ nights",
    value: 0,
    color: "#D193FF",
  },
];

// 将 confirmedBookings 中的 booking 按照 booking.numNights 统计到 initialCategories 中
function fillCategories(initialCategories, confirmedBookings) {
  function fillCategory(categories, label) {
    return categories.map((category) =>
      category.label === label
        ? { ...category, value: category.value + 1 }
        : category,
    );
  }

  const filledCategories = confirmedBookings
    .reduce((categories, currentBooking) => {
      const num = currentBooking.numNights;
      if ([1, 2, 3].includes(num))
        return fillCategory(categories, "1-3 nights");
      if ([4, 5, 6, 7].includes(num))
        return fillCategory(categories, "4-7 nights");
      if (num >= 8 && num <= 14) return fillCategory(categories, "8-14 nights");
      if (num >= 15 && num <= 21)
        return fillCategory(categories, "15-21 nights");
      if (num >= 21) return fillCategory(categories, "21+ nights");
      return categories;
    }, initialCategories)
    .filter((category) => category.value > 0); // 只要 value > 0 的 category

  return filledCategories;
}

export default function DurationPieChart({ confirmedBookings }) {
  const { isDarkMode } = useDarkMode();
  const initialCategories = isDarkMode
    ? categoriesForDarkMode
    : categoriesForLightMode;
  const filledCategories = fillCategories(initialCategories, confirmedBookings);
  console.log(`confirmedBookings: `, confirmedBookings);
  console.log(`filledCategories: `, filledCategories);

  // 参考自: https://recharts.github.io/en-US/examples/PieChartWithCustomizedLabel/
  function customLabel(args) {
    const RADIAN = Math.PI / 180;

    // 查看 args 结构:
    // console.log(`custom label function args: `, args);
    // 按需解构如下:
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      payload: { label, value, color },
    } = args;

    if (
      cx == null ||
      cy == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        // 字体颜色
        fill="white"
        textAnchor={x > ncx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  }

  // 参考自: https://recharts.github.io/en-US/examples/PieChartWithCustomizedLabel/
  function customLegend(props) {
    // 查看 props 中都有哪些可以解构:
    console.log(`custom legend props: `, props);
    // 然后按需解构:
    const { payload } = props;

    // 如果 payload 有值, 其值就是 Pie 的 props 'data'
    return (
      // 先拿到: 当 Legend 不指定 props 'content' 时默认渲染出来的 ul (图例)
      // 然后为 Legend 指定 props 'content' 并动态填充如下:
      <ul
        className="recharts-default-legend"
        style={{
          padding: "0px",
          margin: "0px 0px 0px 2rem",
          textAlign: "left",
        }}
      >
        {payload.map((category) => (
          <li
            key={category.payload.label}
            className="recharts-legend-item legend-item-0"
            style={{ display: "block", marginRight: "10px" }}
          >
            <svg
              aria-label="1-3 nights legend icon"
              className="recharts-surface"
              width="14"
              height="14"
              viewBox="0 0 32 32"
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: "4px",
              }}
            >
              <title></title>
              <desc></desc>
              <path
                // 动态填充 fill color
                fill={category.payload.color}
                cx="16"
                cy="16"
                className="recharts-symbols"
                transform="translate(16, 16)"
                d="M16,0A16,16,0,1,1,-16,0A16,16,0,1,1,16,0"
              ></path>
            </svg>
            <span
              className="recharts-legend-item-text"
              // 动态填充 text color
              style={{ color: category.payload.color }}
            >
              {category.payload.label}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  function customSector(props) {
    // 查看 props 中都有哪些可以解构:
    // console.log(`custom sector props: `, props);
    // 然后按需解构:
    const {
      payload: { color },
    } = props;
    return <Sector {...props} fill={color} />;
  }

  return (
    <StyledPieChartContainer>
      <Heading as={"h2"}>Booking duration category</Heading>
      <PieChart
        style={{
          width: "100%",
          aspectRatio: 1,
        }}
        responsive
      >
        <Pie
          data={filledCategories}
          // nameKey 默认为 "name"
          nameKey={"label"}
          dataKey="value"
          innerRadius={90}
          outerRadius={150}
          labelLine={false}
          // 参考: https://recharts.github.io/en-US/api/Pie/#label
          label={customLabel}
          fill="#8884d8"
          isAnimationActive={true}
          // 课程中在 Pie 下添加 Cell, 可以实现:
          // 1. 通过 Cell 指定 sector 的颜色(fill/stroke...)
          // 2. 之后 Pie 下 Legend 的颜色会自动和 Cell 对应
          //
          // 但根据 https://recharts.github.io/en-US/guide/cell/ 可知:
          // Cell is deprecated and will be removed in Recharts 4.0, please use props 'shape' instead
          //
          // 但实测发现: 使用 props 'shape' 能指定 sector 的 fill/stroke color, 但 Pie 下的 Legend 所使用的颜色无法与之对应
          // 本来都放弃了, 无意间看了下 <Cell> 的 hover doc, 说可以使用 Legend 的 props 'content' 生成自定义图例内容
          // 测试了下, 果然可以, 详见 function `customLegend`
          //
          // 仔细想想, recharts 4.0 之后, 会希望用户:
          // 1. 通过自己的数据来渲染 Legend (通过 Legend 的 props 'content')
          // 2. 通过自己的数据来渲染 Tooltip (通过 Tooltip 的 props 'content')
          // ...
          shape={customSector}
          // padding angle is the gap between each pie slice
          paddingAngle={5}
        >
          {/* 课程里的做法: */}
          {/* {filledCategories.map((category) => (
            <Cell
              key={category.color}
              fill={category.color}
              stroke={category.color}
            />
          ))} */}
          <Tooltip />
          {/* align: 图例的水平方位 */}
          {/* verticalAlign: 图例的垂直方位 */}
          {/* layout: 图例中每一项如何排布 */}
          {/* iconType: 图例中每一项对应的 icon 的形状 */}
          <Legend
            align="right"
            verticalAlign="middle"
            layout="vertical"
            iconType="circle"
            content={customLegend}
          />
        </Pie>
      </PieChart>
    </StyledPieChartContainer>
  );
}
