import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 配置参考 https://vite-plugin-checker.netlify.app/checkers/eslint.html
    // checker({
    //   eslint: {
    //     // for example, lint .ts and .tsx
    //     lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
    //     watchPath: "./src",
    //     // eslint 为 v9+ 之后的话, 需要指定使用 flat config 如下:
    //     useFlatConfig: true,
    //   },
    // }),
  ],
});
