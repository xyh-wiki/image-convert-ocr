
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: About 页面 —— 介绍站点定位与目标用户
 */
import React from "react";

export default function AboutPage() {
  return (
    <div className="page page-about">
      <h1>About This Project</h1>
      <p>
        This website focuses on practical, privacy‑friendly online tools for OCR, image conversion and text processing.
        It is built as a pure front‑end project so it can be deployed easily on static hosting platforms.
      </p>
      <p>
        The goal is to provide a clean and focused experience for developers, writers, researchers and anyone who works
        with images and plain text on a daily basis.
      </p>
      <h2>What You Can Do Here</h2>
      <ul>
        <li>Convert images between common formats (PNG, JPEG, WebP, etc.).</li>
        <li>Extract text from images using OCR.</li>
        <li>Compress, crop and resize images for web publishing.</li>
        <li>Clean and format text for documents or blogs.</li>
      </ul>
    </div>
  );
}
