import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [reactRefresh()],
  });
};

// "@vitejs/plugin-react-refresh": "^1.3.6",
// "cross-env": "^7.0.3",
// "postcss-preset-env": "^6.7.0",
// "vite": "^2.6.14"
