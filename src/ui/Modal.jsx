import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

// Modal_v1:
// 缺点:
// Modal 的开关状态在 Modal 外定义
// 但 Modal 内也有触发 Modal 开关的地方
// 为此外界还得将 props 'onClose' 传递给 Modal 才能修改状态
/* export default function Modal({ children, onClose }) {
  // createPortal() 的作用: 
  // component 仍在 react component tree 中
  // 但对应的 dom element 则出现在指定元素下
  // 这样 component 的样式不会受到 react component tree 中上级元素的影响
  return createPortal(
    <StyledOverlay>
      <StyledModal>
        <StyledCloseButton onClick={onClose}>
          <HiXMark />
        </StyledCloseButton>
        {children}
      </StyledModal>
    </StyledOverlay>,
    document.body,
  );
} */
//
// Modal_v2:
// 借助 compound component 来重构
// 实现: 在 Modal 内维护 Modal 开关状态, 且在 Modal 内触发 Modal 的开关
//
// 按照 compound component 重构时, 这么做会轻松很多:
// 先写出你所希望的 Modal 的最终使用方式(如下), 再借助 Context API 去实现它
//   <Modal>
//     {/* modal launch button 默认显示 */}
//     {/* modal launch button 负责 launch modal content */}
//     <Modal.LaunchButton>
//       {/* custom modal launch button */}
//       <Button>add cabin</Button>
//     </Modal.LaunchButton>
//     {/* modal content 默认不显示 */}
//     <Modal.Content>
//       {/* custom modal content */}
//       <CabinForm />
//     </Modal.Content>
//   </Modal>
//
// 照着上述预期的使用方式, 借助 Context API 来实现如下:
const ModalContext = createContext();
export default function Modal({ children }) {
  // 记录 current content 是哪个, 默认为 '', 表示没有 content 要展示
  const [currentContentName, setCurrentContentName] = useState("");

  return (
    // 将 showContent 和 setShowContent 放入 context 内, 以便 children 可按需:
    // 1. 根据 context 内的 showContent 展示/隐藏 modal content
    // 2. 使用 context 内的 setShowContent 来 toggle state `showContent`
    <ModalContext.Provider
      value={{
        currentContentName,
        setCurrentContentName,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// children: custom launch button
function LaunchButton({ children, launches }) {
  const { setCurrentContentName } = useContext(ModalContext);

  // 下面的问题是:
  // 无法为 children 指定 props 'onClick' 来 launch modal content
  // return children;
  // 但可借助 cloneElement 实现: 为 children "添加" props 'onClick' 如下
  return cloneElement(children, {
    onClick: (e) => {
      setCurrentContentName(launches);
      // e.stopPropagation();
    },
  });
}
Modal.LaunchButton = LaunchButton; //为了使用方便

// children: custom modal content
function Content({ children, name }) {
  const { currentContentName, setCurrentContentName } =
    useContext(ModalContext);

  const ref = useRef();

  //Modal.Content mount/init-render 时, 添加对应的 event listener, 实现: click outside of modal -> close modal
  useEffect(() => {
    console.log("run setup fn to add event listener");
    //setup fn
    const clickHandler = (e) => {
      // <xxx ref={ref}> 会发生什么?
      // 参考 https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref 可知:
      // 当 react 为 xxx 创建 dom node 后, react 会将 ref.current 赋值为 dom node
      // 当 dom node 销毁后, react 会将 ref.current 赋值为 null
      //
      // 如果 StyledModal 存在(ref.current 不为 null), 且事件游历到 StyledModal 外围, 就关闭 StyledOverlay
      if (ref.current && e.target.contains(ref.current)) {
        console.log(ref.current);
        console.log("click outside modal window...");
        setCurrentContentName("");
      }
    };
    //为 document.body 添加 onclick handler 如下后, 实测发现: click button 'add cabin' 没有任何反应
    // document.body.addEventListener("click", clickHandler); // 第三个 argument 默认为 false, 表示: handler is called during bubbling phase
    //
    //分析如下:
    //0. click button 'add cabin' -> browser creates an event object
    //1. event 继续向下传播(capturing phase)
    //2. event 到达 button 'add cabin' -> triggers onclick handler of button (open Modal (Modal.Content 会设置 onclick handler of document.body))
    //3. event 继续向上传播(bubbling phase)
    //4. event 到达 Modal 之外 -> triggers onclick handler of document.body (which will close Modal)
    //5. event 到达 root, 结束
    //
    //解决方式-1: 让 onclick handler of button 最后额外执行 e.stopPropagation()
    //解决方式-2: 让 onclick handler of document.body 在 caturing phase 执行
    document.body.addEventListener("click", clickHandler, true); // 第三个 argument 指定为 true, 表示: handler is called during capturing phase

    //cleanup fn
    return () => {
      console.log("run cleanup fn to remove event listener");
      // document.body.removeEventListener("click", clickHandler);
      document.body.removeEventListener("click", clickHandler, true);
    };
  }, [setCurrentContentName]);

  function closeModalContent() {
    setCurrentContentName("");
  }
  return (
    name === currentContentName &&
    createPortal(
      <StyledOverlay>
        <StyledModal ref={ref}>
          {/* modal window 右上角的关闭按钮 */}
          <StyledCloseButton onClick={closeModalContent}>
            <HiXMark />
          </StyledCloseButton>

          {/* 如果 children 内也有需要触发 close modal content 的地方*/}
          {/* 就需要将 closeModalContent 作为 props 传递到 children 内 */}
          {/* 但问题时: 无法直接为 children 添加 props */}
          {/* {children} */}
          {/* 就只好通过 cloneElement 将 props 'onClose' 注入到 children 对应的组件中  */}
          {cloneElement(children, { onClose: closeModalContent })}
        </StyledModal>
      </StyledOverlay>,
      document.body,
    )
  );
}
Modal.Content = Content; //为了使用方便
