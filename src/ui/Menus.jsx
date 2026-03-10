import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import useClickOutsideRef from "../hooks/useClickOutsideRef";

// 负责设定 currentId (决定了哪个 MenuList 被展示)
const StyledLaunchButton = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

//StyledMenuList 内包含 multiple StyledMenu
const StyledMenuList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  z-index: 10;

  left: ${(props) => props.position.right - props.position.width / 2}px;
  top: ${(props) => props.position.bottom - props.position.height / 2}px;
`;
// 一开始为了测试方便, 可以先这么设置:
// right: 20px
// top: 20px
// 课程里 context menu 出现的位置, 需要这么设定:
// right: ${(props) => window.innerWidth - props.position.right}px;
// top: ${(props) => props.position.bottom}px;
// 但自己觉的修改为如下更合适:
// left: ${(props) => props.position.right - props.position.width / 2}px;
// top: ${(props) => props.position.bottom - props.position.height / 2}px;

// StyledMenu 内包含 StyledMenuButton
const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledMenuButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
  & span {
    width: max-content;
  }
`;

const MenuContext = createContext();
export default function Menus({ children }) {
  // currentId 表示: 为哪行数据展示对应的 menus list
  const [currentId, setCurrentId] = useState(""); // '' 表示默认不展示任何记录的 menu list
  const [position, setPosition] = useState(); // click 'menu laucnch button' 时, 获取到的位置信息, 稍后将基于该位置展示 menu list

  function openMenuList(id) {
    setCurrentId(id);
  }

  function closeAllMenuList() {
    setCurrentId("");
  }

  return (
    <MenuContext.Provider
      value={{
        currentId,
        openMenuList,
        closeAllMenuList,
        position,
        setPosition,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

// props 'children':  button icon
// props 'id': which menu list to launch/open
// LaunchButton 负责设置 currentId, 如果某个 MenuList 的 id 与其匹配, 该 MenuList 就会被展示
function LaunchButton({ children, id }) {
  const { openMenuList, setPosition } = useContext(MenuContext);

  function handleClick(e) {
    // 设定: 哪个 MenuList 需要展示
    openMenuList(id);

    // 获取 `click 时光标的位置信息`
    // e.target 返回 Element
    // 参考 https://developer.mozilla.org/en-US/docs/Web/API/Element/closest 可知:
    // e.target.closest(selectors) 返回 ancestorElement
    // 参考 https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect 可知:
    // ancestorElement.getBoundingClientRect() 返回 DOMRect object (简称 rect)
    // rect 对应 ancestorElement 所占用的矩形区域, 其作用是:
    // viewport 左上角为坐标原点 (0, 0), 向右是 x-axis (数值为正数), 向下是 y-axis (数值为正数)
    // rect.left: rect 左边框对应的 x-axis 值, 和 rect.x 等价
    // rect.right: rect 右边框对应的 x-axis 值
    // rect.top: rect 上边框对应的 y-axis 值, 和 rect.y 等价
    // rect.bottom: rect 下边框对应的 y-axis 值
    const rect = e.target.closest("button").getBoundingClientRect();

    // 设定 `click 时光标的位置信息`
    setPosition(rect);
  }
  return (
    <StyledLaunchButton onClick={handleClick}>{children}</StyledLaunchButton>
  );
}
Menus.LaunchButton = LaunchButton;

// LaunchButton 负责设置 currentId, 如果某个 MenuList 的 id 与其匹配, 该 MenuList 就会被展示
function MenuList({ children, id }) {
  const { currentId, closeAllMenuList, position } = useContext(MenuContext);
  const ref = useClickOutsideRef(closeAllMenuList);

  // StyledMenuList 会使用 props.position 来给底层的 <ul> 定位
  return (
    currentId === id &&
    createPortal(
      <StyledMenuList position={position} ref={ref}>
        {children}
      </StyledMenuList>,
      document.body,
    )
  );
}
Menus.MenuList = MenuList;

//props 'children': button icon and button text
function Menu({ children, onClick }) {
  const { closeAllMenuList, currentId } = useContext(MenuContext);

  function handleClick(e) {
    console.log(`menu button of ${currentId} clicked`);
    onClick?.(); // 如果 menu button 指定了 'click' handler, 就执行

    closeAllMenuList();
    // 上行代码存在的问题:
    // 如果让 Menus.Menu 充当 Modal.LaunchButton 如下:
    // <Menus.LaunchButton id="xxx" />
    // <Menus.MenuList id="xxx">
    //     <Menus.Menu />
    //     <Modal>
    //         <Modal.LaunchButton />
    //             <Menus.Menu>
    //         <Modal.LaunchButton />
    //         <Modal.Content />
    //     </Modal>
    // </Menus.MenuList>
    //
    // Menus.Menu 添加了 click handler (click_handler_1) 来关闭 Menus.MenuList
    // Modal.LaunchButton 添加了 click handler (click_handler_2) 来打开 Modal.Content
    //
    // 当 click Menus.Menu 时:
    // 1. 当 event 游历到 <Menus.Menu> 时, 会执行 click_handler_1 关闭 Menus.MenuList
    // 2. 然后 event 向上冒泡到 <Modal.LaunchButton> 会执行 click_handler_2 打开 Modal.Content
    //
    // 但 Modal.Content 在 Menus.MenuList 内, 因此 step-1 关闭后者会导致前者消失
    // 导致 step-2 执行 click_handler_2 没有任何效果
    // 为了解决这个问题, 可将 Modal.Content 移到 Menus.MenuList 外, 结构调整如下:
    // <Menus.LaunchButton id="xxx" />
    // <Modal>
    //     <Menus.MenuList id="xxx">
    //         <Menus.Menu>
    //         <Modal.LaunchButton />
    //             <Menus.Menu>
    //         <Modal.LaunchButton />
    //     </Menus.MenuList>
    //     <Modal.Content />
    // </Modal>
    // 这样: step-1 关闭 Menus.MenuList 后, 并不影响 Modal.Content, step-2 仍可正常打开 Modal.Content
  }

  return (
    <StyledMenu>
      <StyledMenuButton onClick={handleClick}>{children}</StyledMenuButton>
    </StyledMenu>
  );
}
Menus.Menu = Menu;
