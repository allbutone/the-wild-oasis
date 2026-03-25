import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import GlobalStyles from "./styles/GlobalStyles.js";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      {/* 参考: https://styled-components.com/docs/api#createglobalstyle */}
      {/* Returns a StyledComponent that does not accept children. Place it at the top of your React tree and the global styles will be injected when the component is "rendered". */}
      <GlobalStyles />

      {/* 虽然 react 有自己的 react error boundary api, 但由于和 class-based component 纠缠太深, 用起来比较不便 */}
      {/* 导致人们更愿意使用 3rd-party package 'react-error-boundary' 来实现相同的功能(仍然基于 react error boundary api) */}
      {/* 捕获 component function 执行时产生的 error, 即 rendering error (callback function 里的 error 不算, 因为 callback function 不是 component function) */}

      {/* ErrorBoundary 可以使用的 props: */}
      {/* props 'fallback': rendering error 出现时, 要 return 的 content */}
      {/* props 'fallbackRender': rendering error 出现时, 要执行的 function */}
      {/* props 'fallbackComponent': rendering error 出现时, 要 render 的 component */}

      {/* - fallback component 会自动接收的 props */}
      {/* props 'error': catch 到的 rendering error */}
      {/* props 'resetErrorBoundary': 对应 ErrorBoundary 的 props 'onReset' */}

      {/* 测试 ErrorBoundary 是否生效: */}
      {/* 故意在某个组件内添加 throw error, 然后访问该组件所在的 route */}
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // ErrorBoundary 并没有在 BrowserRouter 下, 因此 props 'onReset' 内无法使用后者所提供的 hook 'useNavigate'
          // 来 go back in history, 只能使用 native api 如下:
          // window.history.go(-1); // 异步操作, 需要监听 popstate 来监测是否操作已完成
          // rendering error -> unmount App + mount FallbackComponent (if-else logic)
          // 此时 App 下的 BrowserRouter 也随之 unmount, 其内部维护的 history state 也消失了
          // 因此, 即便 window.history.go(-1) 触发了 react-router 也在监听的 popstate 事件
          // react-router 也无力根据 url change 来更新 internal history state 进而触发 re-render 了
          //
          // 但可以通过如下方式"手动录入url并回车"
          window.location.replace('/') // route '/' 会被重定向到 route '/dashboard'
        }}
      >
        <App />
      </ErrorBoundary>
    </>
  </StrictMode>,
);
