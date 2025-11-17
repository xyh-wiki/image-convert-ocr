
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: 网站首页（Hero / Banner / 特色功能模块），默认英文 + 浅色风格
 */
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page page-home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1 className="hero-title">Powerful Online OCR & Text Tools</h1>
            <p className="hero-subtitle">
              Convert images to text, change image formats, clean and optimize your text — all in your browser.
            </p>
            <div className="hero-actions">
              <Link to="/tools" className="btn btn-primary">
                Try OCR & Image Tools
              </Link>
              <Link to="/tools" className="btn btn-outline">
                View All Tools
              </Link>
            </div>
            <ul className="hero-highlights">
              <li>✓ Image to text (OCR)</li>
              <li>✓ Image format conversion</li>
              <li>✓ Text cleaning & formatting</li>
              <li>✓ JSON / developer utilities</li>
            </ul>
          </div>
          <div className="hero-card">
            <h2 className="hero-card-title">Why this platform?</h2>
            <p className="hero-card-text">
              Designed for developers, writers and knowledge workers who need fast, reliable and privacy‑friendly tools.
            </p>
            <ul className="hero-card-list">
              <li>No installation required</li>
              <li>Modern, responsive UI</li>
              <li>Optimized for daily workflows</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-features">
        <div className="section-header">
          <h2>Featured Tools</h2>
          <p>Jump directly into the tools you use every day.</p>
        </div>
        <div className="feature-grid">
          <Link to="/tools" className="feature-card">
            <h3>Online OCR</h3>
            <p>Turn images into searchable, copyable text in seconds.</p>
          </Link>
          <Link to="/tools" className="feature-card">
            <h3>Image Format Converter</h3>
            <p>Convert PNG / JPG / WebP and more with one click.</p>
          </Link>
          <Link to="/tools" className="feature-card">
            <h3>Text Cleaner</h3>
            <p>Remove extra spaces, line breaks and broken formatting.</p>
          </Link>
          <Link to="/tools" className="feature-card">
            <h3>JSON Formatter</h3>
            <p>Format and validate JSON for APIs and debugging.</p>
          </Link>
        </div>
      </section>

      <section className="section section-seo-tags">
        <div className="section-header">
          <h2>Popular Search Tags</h2>
          <p>
            These phrases help users discover the site via search engines and reflect what the tools actually solve.
          </p>
        </div>
        <div className="tag-list">
          <span className="tag">how to ocr online</span>
          <span className="tag">free ocr tool</span>
          <span className="tag">image to text converter</span>
          <span className="tag">best online ocr 2025</span>
          <span className="tag">convert jpg to text</span>
          <span className="tag">convert png to text</span>
          <span className="tag">extract text from image</span>
          <span className="tag">online text tools</span>
          <span className="tag">remove line breaks online</span>
          <span className="tag">clean text formatting</span>
          <span className="tag">format json online</span>
          <span className="tag">image format converter</span>
          <span className="tag">pdf to text converter</span>
          <span className="tag">base64 encoder decoder</span>
          <span className="tag">web developer tools online</span>
        </div>
      </section>
    </div>
  );
}
