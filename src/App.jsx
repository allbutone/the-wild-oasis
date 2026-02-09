import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Input from "./ui/Input";

// styled components 借助了 es6 的 feature: tagged template literals
// 当使用 H1 时, 会自动执行 styled.h1 这个 function, H1 就是这个 function 返回的 component
const H1 = styled.h1`
  font-size: 25px;
  font-weight: bold;
  text-decoration: underlidne;
`;
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
        <H1>hello world</H1>
        <Button onClick={() => alert("clicked!")}>LEFT</Button>
        <Button onClick={() => alert("clicked!")}>RIGHT</Button>
        <Input />
      </StyledApp>
    </>
  );
}

export default App;
