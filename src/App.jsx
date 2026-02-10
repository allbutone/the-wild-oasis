import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Heading from "./ui/Heading";

// styled components 借助了 es6 的 feature: tagged template literals
// 当使用 H1 时, 会自动执行 styled.h1 这个 function, H1 就是这个 function 返回的 component
const StyledApp = styled.div`
  background-color: white;
  padding: 10px;
`;
function App() {
  return (
    <>
      {/* GlobalStyles 是 styled components 创建的全局样式, 需要作为 App 的 sibling 来声明 */}
      {/* 且其下不接受任何 children */}
      <GlobalStyles />
      <StyledApp>
        <Heading as={"h1"}>heading of level 1</Heading>
        <Heading as={"h2"}>heading of level 2</Heading>
        <Heading as={"h3"}>heading of level 3</Heading>
        <Button onClick={() => alert("clicked!")}>LEFT</Button>
        <Button onClick={() => alert("clicked!")}>RIGHT</Button>
        <Input />
      </StyledApp>
    </>
  );
}

export default App;
