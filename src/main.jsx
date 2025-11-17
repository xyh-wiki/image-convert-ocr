/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: React 应用入口 —— 使用 HashRouter 解决前端路由在 Nixpacks 部署下返回 404 的问题
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";   // ← 替换 BrowserRouter
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HashRouter>      {/* ← 替换 BrowserRouter */}
            <App />
        </HashRouter>
    </React.StrictMode>
);