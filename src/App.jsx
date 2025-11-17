
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: 应用根组件 —— 纯前端多页面布局（Home / Tools / About / FAQ / Contact / Privacy / Terms / Sitemap / Search）
 *  - 默认英文 + 浅色主题
 *  - 顶部主导航 + 移动端菜单预留
 *  - 面包屑导航
 *  - Footer 版权 / 隐私政策 / 用户协议 / 社交链接
 */
import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import ToolsPage from "./pages/ToolsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.jsx";
import SitemapPage from "./pages/SitemapPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

/**
 * 面包屑组件：根据当前路径简单拆分为 Home / 子页面
 */
function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname === "/" ? [] : location.pathname.split("/").filter(Boolean);

  const items = [
    <li key="home">
      <Link to="/">Home</Link>
    </li>,
  ];

  if (path.length === 1) {
    const map = {
      tools: "Tools",
      about: "About",
      faq: "FAQ",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      sitemap: "Sitemap",
      search: "Search",
    };
    const label = map[path[0]] || path[0];
    items.push(<li key={path[0]}>{label}</li>);
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>{items}</ol>
    </nav>
  );
}

/**
 * 顶部导航栏
 */
function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          <span className="logo-mark">xyh.wiki</span>
          <span className="logo-text">Image & Text Tools</span>
        </Link>
        <nav className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/search">Search</Link>
        </nav>
        <div className="site-actions">
          <span className="lang-indicator">EN</span>
          <Link to="/tools" className="btn btn-primary btn-sm">
            Try Now
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * 页面底部 Footer：版权 / 隐私政策 / 用户协议 / 社交媒体链接
 */
function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-left">
          <div>© {new Date().getFullYear()} xyh.wiki. All rights reserved.</div>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms">Terms of Service</Link>
            <span>·</span>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <div className="footer-legal">
            This site focuses on online OCR and text tools. Please avoid uploading sensitive or illegal content.
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-social">
            <a href="https://github.com/xyh-wiki" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              X / Twitter
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <div className="footer-contact">
            Contact:{" "}
            <a href="mailto:xyh.wiki@gmail.com" className="footer-mail">
              xyh.wiki@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * 应用根组件
 */
export default function App() {
  return (
    <div className="site-root theme-light">
      <SiteHeader />
      <main className="site-main">
        <Breadcrumb />
        <div className="site-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/convert" element={<Navigate to="/tools" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
