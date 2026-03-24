import { useEffect, useRef } from "react";

export default function useClickOutsideRef(closeRefEle) {
  const ref = useRef();
  useEffect(() => {
    //setup fn
    const referencedEle = ref.current;
    // if (referencedEle) {
    //   console.log(
    //     "run setup fn to add click handler for when clicking outside of: ",
    //   );
    //   console.log(referencedEle);
    // }
    const clickHandler = (e) => {
      // <xxx ref={ref}> 会发生什么?
      // 参考 https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref 可知:
      // 当 react 为 xxx 创建 dom node 后, react 会将 ref.current 赋值为 dom node
      // 当 dom node 销毁后, react 会将 ref.current 赋值为 null

      // 如果 referenced_dom_element 存在(ref.current 不为 null), 且事件游历到 referenced_dom_element 之外
      // 就执行 callback 来 close referenced_dom_element(例如 click outside of Modal.Content, callback 指定为: 关闭 Modal.Content)
      // console.log(e);

      /* if (referencedEle && e.target.contains(referencedEle)) { 
        console.log(`click outside referenced dom element: `);
        console.log(referencedEle);
        closeRefEle();
      } */
      // 上面使用 e.target.contains(referencedEle) 来判断"点击的位置在 referencedEle 之外" 是有问题的:
      // 因为其意思是: 点击位置在 referencedEle 的 ancestor 上, 才会 close referencedEle
      // 将判断条件修改为 !referencedEle.contains(e.target) 就对了, 此时:
      // 只要点击位置不在 referencedEle 之内, 就 close referencedEle
      // 这样, 即便 referencedEle 被 createPortal 放到 document.body 下, 也可以正常 close referencedEle
      // 否则, 由于 user 无法 click referencedEle 之上的 element (对 user 不可见), 就无法 close referencedEle
      if (referencedEle && !referencedEle.contains(e.target)) {
        console.log(`click outside referenced dom element: `);
        // console.log(referencedEle);
        closeRefEle();
      }
    };
    document.body.addEventListener("click", clickHandler); // 第三个 argument 默认为 false, 表示: handler is called during bubbling phase
    // 实测发现: 上行为 document.body 添加 onclick handler 后, click Modal.LaunchButton `add cabin` 没有任何反应
    //
    //为此分析如下:
    //0. click button 'add cabin' -> browser creates an event object
    //1. event 向下传播(capturing phase)
    //2. event 经过 outside of Modal.Content -> won't trigger event handler of document.body due to within capturing phase
    //3. event 到达 button 'add cabin' -> triggers onclick handler of button -> open Modal.Content (会设置 onclick handler of document.body, which will close Modal.Content)
    //4. event 向上传播(bubbling phase)
    //5. event 经过 outside of Modal.Content -> triggers onclick handler of document.body -> close Modal.Content
    //6. event 到达 root, 结束
    //
    //可以看出, 最终的效果是:
    //click button 'add cabin' -> open Modal.Content -> close Modal.Content
    //
    //解决方式-1: 在 onclick handler of LaunchButton 内额外执行 e.stopPropagation() 阻止 event 继续 bubbling, 此时流程分析如下:
    //0. click button 'add cabin' -> browser creates an event object
    //1. event 向下传播(capturing phase)
    //2. event 经过 outside of Modal.Content -> won't trigger event handler of document.body due to within capturing phase
    //3. event 到达 button 'add cabin' -> triggers onclick handler of button -> open Modal.Content (会设置 onclick handler of document.body, which will close Modal.Content)
    //4. event 停止传播
    //
    //解决方式-2: 让 onclick handler of document.body 在 capturing phase 执行
    //0. click button 'add cabin' -> browser creates an event object
    //1. event 向下传播(capturing phase)
    //2. event 经过 outside of Modal.Content -> triggers onclick handler of document.body -> close Modal.Content if opened
    //3. event 到达 button 'add cabin' -> triggers onclick handler of button -> open Modal.Content (会设置 onclick handler of document.body, which will close Modal.Content)
    //4. event 向上传播(bubbling phase)
    //5. event 经过 outside of Modal.Content -> won't trigger onclick handler of document.body due to within bubbling phase 
    //6. event 到达 root, 结束
    //
    //下面采用"解决方式-2"
    // document.body.addEventListener("click", clickHandler, true); // 第三个 argument 指定为 true, 表示: handler is called during capturing phase
    // 之后, 可以实现:
    // - 点 Modal.LaunchButton 可以打开对应 Modal.Content, 然后 click outside of Modal.Content 时, 可以关闭 Modal.Content
    // - 点 Menus.LaunchButton 可以打开对应 Menus.MenuList, 但 click outside of Menus.MenuList 时却两种情况:
    //     - 如果 click outside of Menus.MenuList 但没有 click 在 Menus.LaunchButton 上, 可以关闭 Menus.MenuList
    //     - 如果 click outside of Menus.MenuList 但恰好 click 在 Menus.LaunchButton 上, 无法关闭 Menus.MenuList
    //         过程分析如下:
    //         - 第一次 click Menus.LaunchButton -> browser creates an event object
    //         - event 向下传播(capturing phase)
    //         - event 经过 outside of Menus.MenuList -> triggers onclick handler of document.body
    //             - 此时没有效果, 因为 Menus.MenuList 尚未打开
    //         - event 到达 Menus.LaunchButton -> triggers onclick handler of Menus.LaunchButton -> open Menus.MenuList (会设置 onclick handler of document.body, which will close Menus.MenuList)
    //             - 此时会打开 Menus.MenuList
    //         - event 向上传播(bubbling phase)
    //         - event 经过 outside of Menus.MenuList -> won't trigger onclick handler of document.body 
    //             - 此时没有效果, 因为 onclick handler of document.body 不会在 bubbling phase 执行
    //         - event 到达 root, 结束
    //         - 第二次 click Menus.LaunchButton -> browser creates an event object
    //         - event 向下传播(capturing phase)
    //         - event 经过 outside of Menus.MenuList -> triggers onclick handler of document.body
    //             - 此时会关闭 Menus.MenuList
    //         - event 到达 Menus.LaunchButton -> triggers onclick handler of LaunchButton -> open Menus.MenuList (会设置 onclick handler of document.body, which will close Menus.MenuList)
    //             - 此时会重新打开 Menus.MenuList
    //         - event 向上传播(bubbling phase)
    //         - event 经过 outside of Menus.MenuList -> won't trigger onclick handler of document.body
    //             - 此时没有效果, 因为 onclick handler of document.body 不会在 bubbling phase 执行
    //         - event 到达 root, 结束
    //         上述分析可知, 实际效果:
    //         第一次 click Menus.LaunchButton -> open Menus.MenuList -> 第二次 click Menus.LaunchButton -> close Menus.MenuList -> open Menus.MenuList
    //         如果使用 `解决方式-1` 而非 `解决方式-2` , 就不会有这个衍生的问题

    //cleanup fn
    return () => {
      // if (referencedEle) {
        // console.log(
        //   "run cleanup fn to remove click handler for when clicking outside of: ",
        // );
        // console.log(referencedEle);
      // }
      document.body.removeEventListener("click", clickHandler);
      // document.body.removeEventListener("click", clickHandler, true);
    };
  }, [closeRefEle]);

  return ref;
}
