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
        // console.log(`click outside referenced dom element: `);
        // console.log(referencedEle);
        closeRefEle();
      }
    };
    // document.body.addEventListener("click", clickHandler); // 第三个 argument 默认为 false, 表示: handler is called during bubbling phase
    // 实测发现: 上行为 document.body 添加 onclick handler 后, click Modal.LaunchButton `add cabin` 没有任何反应
    //
    //分析如下:
    //0. click button 'add cabin' -> browser creates an event object
    //1. event 继续向下传播(capturing phase)
    //2. event 到达 button 'add cabin' -> triggers onclick handler of button -> open Modal.Content (会设置 onclick handler of document.body)
    //3. event 继续向上传播(bubbling phase)
    //4. event 到达 Modal.Content 之外 -> triggers onclick handler of document.body (which will close Modal.Content)
    //5. event 到达 root, 结束
    //
    //解决方式-1: 让 onclick handler of button 最后额外执行 e.stopPropagation() 阻止其继续冒泡
    //解决方式-2: 让 onclick handler of document.body 在 caturing phase 执行, 如下:
    document.body.addEventListener("click", clickHandler, true); // 第三个 argument 指定为 true, 表示: handler is called during capturing phase

    //cleanup fn
    return () => {
      // if (referencedEle) {
        // console.log(
        //   "run cleanup fn to remove click handler for when clicking outside of: ",
        // );
        // console.log(referencedEle);
      // }
      // document.body.removeEventListener("click", clickHandler);
      document.body.removeEventListener("click", clickHandler, true);
    };
  }, [closeRefEle]);

  return ref;
}
