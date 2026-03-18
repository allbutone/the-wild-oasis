import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState("isDarkMode", false); // 默认采用 light mode

  // 当 theme 发生变化时, 改变 <html> 的样式:
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light-mode");
      document.documentElement.classList.add("dark-mode");
    }else{
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.add("light-mode");
    }
  }, [isDarkMode]);

  function toggleTheme() {
    setIsDarkMode((mode) => !mode);
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// styled components 也提供了一个名为 useTheme 的 hook
// 为了避免使用混淆, 命名为 useDarkMode
export function useDarkMode() {
  const value = useContext(ThemeContext);
  if (value === undefined) {
    throw new Error(
      `hook 'useTheme' should be used under ThemeContextProvider`,
    );
  }
  return value;
}
