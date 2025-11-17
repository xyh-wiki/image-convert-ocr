import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// @Author:XYH
// @Date:2025-11-17
// @Description: Vite 项目配置文件，启用 React 插件并支持基础路径配置

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
