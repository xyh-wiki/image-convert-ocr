
/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 前端主页面：支持图片格式转换、可选 OCR、历史记录分页、多语言切换与 Google Ads
 */

import React, { useState, useEffect, useCallback } from "react";
import HistoryPanel from "./components/HistoryPanel.jsx";
import { convertImage } from "./utils/api.js";

/**
 * 文案字典：支持英文与简体中文
 * 说明：页面默认英文，通过语言切换按钮在 en / zh 之间切换
 */
const texts = {
  en: {
    brandMain: "Image Convert & OCR",
    brandSub: "Online image format converter with optional OCR extraction",
    title: "Online Image Format Converter & OCR",
    subtitle:
      "Convert PNG, JPEG, WebP, TIFF, GIF, BMP, PSD images and optionally extract text with OCR. Files are processed in real time on the server.",
    uploadTitle: "Upload & Conversion",
    uploadDesc: "Upload an image, choose target format, optionally enable OCR, and click Convert.",
    uploadMain: "Click or drag image here to upload",
    uploadSub: "Supported formats: PNG, JPEG, WEBP, TIFF, GIF, BMP, PSD",
    uploadMeta: "Max size depends on server configuration. For best results, use clear images.",
    targetLabel: "Target format",
    ocrLabel: "Enable OCR text extraction",
    ocrHint: "If disabled, only format conversion will be performed.",
    btnConvert: "Start Conversion",
    historyTitle: "OCR History",
    historySubtitle: "Recent text extracted from uploaded images",
    historySearchPlaceholder: "Search in OCR text...",
    historyEmpty: "No OCR history yet. Enable OCR and upload an image to see results here.",
    btnClearFilter: "Reset",
    footerText:
      "All conversions happen on the server. Please avoid uploading sensitive or confidential content.",
    helperNoFile: "Please select or drop an image file first.",
    helperConverting: "Processing... This may take a few seconds for large images or OCR.",
    helperSuccess: "Conversion completed. Download should start automatically.",
    helperErrorPrefix: "Error: ",
  },
  zh: {
    brandMain: "图片转换与 OCR 提取",
    brandSub: "在线图片格式转换，支持可选 OCR 文本识别",
    title: "在线图片格式转换 & OCR 中文识别",
    subtitle:
      "支持 PNG、JPEG、WebP、TIFF、GIF、BMP、PSD 等格式在线互转，并可选开启 OCR 将图片中的文字提取为可编辑文本。",
    uploadTitle: "上传与格式转换",
    uploadDesc: "上传图片，选择目标格式，可选开启 OCR，点击开始处理即可。",
    uploadMain: "点击或拖拽图片到此区域上传",
    uploadSub: "支持格式：PNG、JPEG、WEBP、TIFF、GIF、BMP、PSD",
    uploadMeta: "最大文件大小由服务器限制决定，清晰图片有助于提升识别效果。",
    targetLabel: "目标格式",
    ocrLabel: "同时开启 OCR 文本识别",
    ocrHint: "关闭此选项时，只进行格式转换，不做文字识别。",
    btnConvert: "开始处理",
    historyTitle: "OCR 历史记录",
    historySubtitle: "最近一次上传图片所提取的文字会展示在这里",
    historySearchPlaceholder: "在历史文本中搜索…",
    historyEmpty: "当前还没有 OCR 历史。勾选 OCR 并上传图片后，这里会展示识别结果。",
    btnClearFilter: "重置",
    footerText:
      "所有转换均在服务器端进行，请勿上传涉密或包含敏感信息的图片文件。",
    helperNoFile: "请先选择或拖拽一张图片文件。",
    helperConverting: "正在处理… 大图或开启 OCR 时可能需要几秒钟时间。",
    helperSuccess: "处理完成，浏览器应自动开始下载转换后的图片。",
    helperErrorPrefix: "处理失败：",
  },
};

/**
 * 辅助函数：根据当前语言返回文案对象
 * @param {'en'|'zh'} lang 当前语言
 * @returns 文案对象
 */
function useTexts(lang) {
  return texts[lang] || texts.en;
}

export default function App() {
  // 当前语言：en / zh
  const [lang, setLang] = useState("en");
  const t = useTexts(lang);

  // 业务状态
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("png");
  const [enableOcr, setEnableOcr] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [helper, setHelper] = useState("");
  const [helperType, setHelperType] = useState("info"); // 'info' | 'error' | 'success'
  const [loading, setLoading] = useState(false);

  // 初始化读取本地历史记录（LocalStorage）
  useEffect(() => {
    try {
      const cached = localStorage.getItem("imageapp_ocr_history");
      if (cached) {
        const arr = JSON.parse(cached);
        if (Array.isArray(arr)) setHistory(arr);
      }
    } catch (e) {
      console.warn("Failed to load history from localStorage", e);
    }
  }, []);

  // 历史记录变化时写回本地缓存
  useEffect(() => {
    try {
      localStorage.setItem("imageapp_ocr_history", JSON.stringify(history.slice(0, 200)));
    } catch (e) {
      console.warn("Failed to store history", e);
    }
  }, [history]);

  // Google Ads 渲染
  useEffect(() => {
    try {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // ignore
    }
  }, []);

  /**
   * 设置提示信息
   * @param {string} msg 提示内容
   * @param {'info'|'error'|'success'} type 提示类型
   */
  const showHelper = (msg, type = "info") => {
    setHelper(msg);
    setHelperType(type);
  };

  /**
   * 处理文件选择
   */
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  /**
   * 拖拽释放文件
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * 点击开始处理
   */
  const handleSubmit = useCallback(async () => {
    if (!file) {
      showHelper(t.helperNoFile, "error");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("targetFormat", targetFormat);
    form.append("ocr", String(enableOcr));

    try {
      setLoading(true);
      showHelper(t.helperConverting, "info");

      const data = await convertImage(form);

      if (data.ocrText) {
        setHistory((prev) => [
          { time: new Date().toLocaleString(), text: data.ocrText },
          ...prev,
        ]);
      }

      if (data.base64 && data.filename) {
        const a = document.createElement("a");
        a.href = `data:${data.contentType || "application/octet-stream"};base64,${data.base64}`;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showHelper(t.helperSuccess, "success");
      } else {
        showHelper(t.helperErrorPrefix + "empty content", "error");
      }
    } catch (e) {
      console.error(e);
      showHelper(t.helperErrorPrefix + (e.message || "Unknown error"), "error");
    } finally {
      setLoading(false);
    }
  }, [file, targetFormat, enableOcr, t]);

  return (
    <div className="app-shell">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <div className="brand-icon">IC</div>
            <div>
              <div className="brand-text-main">{t.brandMain}</div>
              <div className="brand-text-sub">{t.brandSub}</div>
            </div>
          </div>

          {/* 语言切换：默认英文，可切换到中文 */}
          <div className="lang-switch">
            <button
              type="button"
              className={lang === "en" ? "lang-btn lang-btn-active" : "lang-btn"}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === "zh" ? "lang-btn lang-btn-active" : "lang-btn"}
              onClick={() => setLang("zh")}
            >
              中文
            </button>
          </div>
        </div>

        {/* 顶部广告位（可选展示） */}
        <div className="header-ad">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="app-main">
        <h1 className="page-title">{t.title}</h1>
        <p className="page-subtitle">{t.subtitle}</p>

        <div className="main-grid">
          {/* 左侧：上传 + 配置 */}
          <section className="card">
            <div className="card-header">
              <div>
                <div className="card-title">{t.uploadTitle}</div>
                <div className="card-desc">{t.uploadDesc}</div>
              </div>
            </div>

            {/* 上传区域 */}
            <label
              className="upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="upload-icon">↑</div>
              <div style={{ flex: 1 }}>
                <div className="upload-text-main">{t.uploadMain}</div>
                <div className="upload-text-sub">{t.uploadSub}</div>
              </div>
              <div className="upload-meta">{t.uploadMeta}</div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>

            {/* 选中文件预览 */}
            {previewUrl && (
              <div className="preview-wrapper">
                <div className="preview-label">
                  {file ? file.name : ""}
                </div>
                <img src={previewUrl} alt="preview" className="preview-image" />
              </div>
            )}

            {/* 目标格式与 OCR 开关 */}
            <div className="form-row">
              <div className="field">
                <div className="preview-label">{t.targetLabel}</div>
                <select
                  className="select"
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                  <option value="tiff">TIFF</option>
                  <option value="bmp">BMP</option>
                  <option value="gif">GIF</option>
                  <option value="psd">PSD</option>
                </select>
              </div>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="enable-ocr"
                checked={enableOcr}
                onChange={(e) => setEnableOcr(e.target.checked)}
              />
              <label htmlFor="enable-ocr">
                {t.ocrLabel}
                <span style={{ marginLeft: 4, opacity: 0.7 }}>
                  ({t.ocrHint})
                </span>
              </label>
            </div>

            {/* 状态提示 */}
            {helper && (
              <div
                className={
                  "helper-text " +
                  (helperType === "error"
                    ? "helper-text-error"
                    : helperType === "success"
                    ? "helper-text-success"
                    : "")
                }
              >
                {helper}
              </div>
            )}

            {/* 按钮区域 */}
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn"
                style={{ flex: 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "..." : t.btnConvert}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setFile(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
              >
                ✕
              </button>
            </div>
          </section>

          {/* 右侧：历史记录 */}
          <HistoryPanel history={history} lang={lang} t={t} />
        </div>
      </main>

      {/* 底部 Footer + 广告位 */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="footer-text">{t.footerText}</div>
          <div className="footer-ad">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="9876543210"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>
      </footer>
    </div>
  );
}
