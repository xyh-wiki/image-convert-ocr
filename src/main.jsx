
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: React 应用入口 —— 使用 BrowserRouter 包裹 App，支持多页面路由
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
