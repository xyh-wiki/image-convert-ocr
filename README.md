# XYH 在线文本与文件工具平台（优化版）

本项目为 `xyh.wiki` 主站的前端单页应用（SPA），基于 **React + TypeScript + Vite** 实现，
重点聚焦四大核心工具模块：

1. 图片格式转换与 OCR 文字识别（对应 `ocr.xyh.wiki`）
2. 二进制文件文本提取（对应 `binaryextract.xyh.wiki`）
3. 在线文本工具合集（对应 `text-tools.xyh.wiki`）
4. 在线文本编辑与清洗（对应 `edittext.xyh.wiki`）

并提供标准企业站结构页面：About / Products / FAQ / Contact / Privacy / Terms / Sitemap / Search 等，
内置国际化（中英切换）、面包屑导航、站内搜索入口、Toast/Modal/Loading 交互组件等。

## 快速开始

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 技术栈

- React 18
- TypeScript 5
- Vite 5
- react-router-dom 6

## 目录结构（核心）

- `src/main.tsx`：应用入口
- `src/App.tsx`：路由与整体布局
- `src/i18n.ts`：国际化配置与上下文
- `src/components/layout/*`：导航、页脚、布局组件
- `src/components/common/*`：Toast、Modal、Loading、Breadcrumb、Search 等通用组件
- `src/pages/*`：各个业务页面与产品子页面
- `src/styles/global.css`：全局样式与浅色主题配置
