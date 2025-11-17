
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Author:XYH Date:2025-11-14 Description: Vite 配置文件，启用 React 支持与路径别名
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173,
  },
});
