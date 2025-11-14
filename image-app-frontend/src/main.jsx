
/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: React 入口文件，挂载根组件并引入全局样式
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
