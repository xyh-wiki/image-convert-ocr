
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: Sitemap 页面 —— 列出站内主要导航路径
 */
import React from "react";
import { Link } from "react-router-dom";

const routes = [
  { path: "/", label: "Home" },
  { path: "/tools", label: "Tools (Image & OCR)" },
  { path: "/about", label: "About" },
  { path: "/faq", label: "FAQ" },
  { path: "/contact", label: "Contact" },
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Service" },
  { path: "/sitemap", label: "Sitemap" },
  { path: "/search", label: "Search" },
];

export default function SitemapPage() {
  return (
    <div className="page page-sitemap">
      <h1>Sitemap</h1>
      <ul className="sitemap-list">
        {routes.map((r) => (
          <li key={r.path}>
            <Link to={r.path}>{r.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
