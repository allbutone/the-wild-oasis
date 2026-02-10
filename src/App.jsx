import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Heading from "./ui/Heading";
import Row from "./ui/Row";

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
        {/* Row 的作用: 1) 指定 Row 之间的间距; 2) 指定 Row 的内容以何种形式排列 */}
        <Row>
          <Row type="horizontal">
            <Heading as={"h1"}>The Wild Oasis</Heading>
            <div>
              <Heading as={"h2"}>Check in and out</Heading>
              <Button onClick={() => alert("check in")}>Check in</Button>
              <Button onClick={() => alert("check out")}>Check out</Button>
            </div>
          </Row>
          <Row>
            <Heading as={"h3"}>Form</Heading>
            <form>
              <Input type="number" placeholder="number of guests" />
              <Input type="number" placeholder="number of guests" />
            </form>
          </Row>
        </Row>
      </StyledApp>
    </>
  );
}

export default App;
