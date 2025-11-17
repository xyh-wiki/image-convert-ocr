/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description:
 *  React 应用入口（TypeScript 版本）：
 *   - 使用 I18nProvider 提供多语言上下文
 *   - 使用 HashRouter 适配 Nixpacks 静态部署环境，避免 /tools 404
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { I18nProvider } from "./i18n";
import "./styles.css";

const rootElement = document.getElementById("root") as HTMLElement | null;

if (!rootElement) {
  throw new Error("Root container #root not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </I18nProvider>
  </React.StrictMode>
);
