
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: Search 页面 —— 站内搜索（基于静态路由与描述）
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";

const searchItems = [
  { path: "/", title: "Home", keywords: "home hero banner ocr tools" },
  { path: "/tools", title: "OCR & Image Tools", keywords: "ocr image to text converter image format convert" },
  { path: "/about", title: "About", keywords: "about platform introduction" },
  { path: "/faq", title: "FAQ", keywords: "faq help questions" },
  { path: "/contact", title: "Contact", keywords: "contact email feedback form" },
  { path: "/privacy", title: "Privacy Policy", keywords: "privacy policy data" },
  { path: "/terms", title: "Terms of Service", keywords: "terms of service agreement" },
  { path: "/sitemap", title: "Sitemap", keywords: "sitemap navigation" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const results = q
    ? searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="page page-search">
      <h1>Site Search</h1>
      <p>Search across the main pages and tools using keywords such as “ocr”, “image to text”, or “json”.</p>
      <div className="search-box">
        <input
          type="text"
          placeholder="Type to search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="search-results">
        {q && results.length === 0 && <p>No results found.</p>}
        {results.map((item) => (
          <div className="search-result" key={item.path}>
            <h2>
              <Link to={item.path}>{item.title}</Link>
            </h2>
            <p className="search-keywords">{item.keywords}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
