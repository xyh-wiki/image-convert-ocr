/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: OCR & 图片工具网站首页（Hero / Banner / 特色功能模块），默认英文 + 浅色风格
 */
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
      <div className="page page-home">
        {/* 顶部 Hero 区域 */}
        <section className="hero">
          <div className="hero-inner">
            {/* 左侧文案 */}
            <div className="hero-text">
              <h1 className="hero-title">Powerful Online OCR & Image Tools</h1>
              <p className="hero-subtitle">
                Convert images to text with OCR, change image formats, compress, crop and resize – all directly in your browser, with no backend required.
              </p>
              <div className="hero-actions">
                <Link to="/tools" className="btn btn-primary">
                  Start OCR & Image Tools
                </Link>
                <Link to="/tools" className="btn btn-outline">
                  View All Image Tools
                </Link>
              </div>
              <ul className="hero-highlights">
                <li>✓ Image to text (OCR)</li>
                <li>✓ Image format conversion (PNG / JPG / WebP…)</li>
                <li>✓ Online image compression</li>
                <li>✓ Crop & resize pictures in the browser</li>
              </ul>
            </div>

            {/* 右侧说明卡片 */}
            <div className="hero-card">
              <h2 className="hero-card-title">Why this OCR & image platform?</h2>
              <p className="hero-card-text">
                Designed for developers, researchers and knowledge workers who need fast, reliable and privacy-friendly image tools.
              </p>
              <ul className="hero-card-list">
                <li>No installation or backend required</li>
                <li>Modern, responsive and clean UI</li>
                <li>Runs fully in the browser with OCR API</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 特色功能模块：只保留 OCR + 图片相关功能 */}
        <section className="section section-features">
          <div className="section-header">
            <h2>Featured Image Tools</h2>
            <p>Jump directly into the core OCR and image tools you use every day.</p>
          </div>
          <div className="feature-grid">
            <Link to="/tools" className="feature-card">
              <h3>Online OCR</h3>
              <p>Turn images into searchable, copyable text in seconds.</p>
            </Link>
            <Link to="/tools" className="feature-card">
              <h3>Image Format Converter</h3>
              <p>Convert between PNG, JPG, WebP and more with one click.</p>
            </Link>
            <Link to="/tools" className="feature-card">
              <h3>Image Compressor</h3>
              <p>Reduce file size while keeping acceptable visual quality.</p>
            </Link>
            <Link to="/tools" className="feature-card">
              <h3>Crop & Resize</h3>
              <p>Crop a region or resize images to exact width and height.</p>
            </Link>
          </div>
        </section>

        {/* SEO 关键词区域：只围绕 OCR + 图片五个功能 */}
        <section className="section section-seo-tags">
          <div className="section-header">
            <h2>Popular Search Tags</h2>
            <p>
              These phrases help users discover the OCR & image tools via search engines and reflect what this site really offers.
            </p>
          </div>
          <div className="tag-list">
            {/* OCR 相关 */}
            <span className="tag">how to ocr image online</span>
            <span className="tag">free online ocr tool</span>
            <span className="tag">image to text converter</span>
            <span className="tag">convert jpg to text</span>
            <span className="tag">convert png to text</span>
            <span className="tag">extract text from image</span>
            <span className="tag">best online ocr 2025</span>

            {/* 图片转换 / 压缩 / 裁剪 / 调整尺寸 */}
            <span className="tag">online image format converter</span>
            <span className="tag">convert jpg to png online</span>
            <span className="tag">convert png to webp online</span>
            <span className="tag">compress image online</span>
            <span className="tag">reduce photo size online</span>
            <span className="tag">crop image online</span>
            <span className="tag">resize image online</span>
            <span className="tag">resize png jpg webp</span>
          </div>
        </section>
      </div>
  );
}
