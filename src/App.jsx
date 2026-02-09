import styled from "styled-components";

// styled components 借助了 es6 的 feature: tagged template literals
// 当使用 H1 时, 会自动执行 styled.h1 这个 function, H1 就是这个 function 返回的 component
const H1 = styled.h1`
  font-size: 25px;
  font-weight: bold;
  text-decoration: underline;
`;
// styled.xxx 执行后所返回的 component, 是可以透传 props 的, 也就是说:
// <Button> 的 onClick 是会被传递给底层的 <button> 的
const Button = styled.button`
  color: white;
  background-color: black;
  font-size: 1.4rem;
  font-weight: 500;
  padding: 1.2rem 1.6rem;
  margin: 1rem;
  border: none;
  border-radius: 7px;
`;
const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.8rem 1.2rem;
`;
const StyledApp = styled.div`
background-color: orange;
padding: 10px;
`
function App() {
  return (
    <StyledApp>
      <H1>hello world</H1>
      <Button onClick={() => alert("clicked!")}>LEFT</Button>
      <Button onClick={() => alert("clicked!")}>RIGHT</Button>
      <Input />
    </StyledApp>
  );
}

export default App;
