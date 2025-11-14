/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 前端主页面：支持图片格式转换、OCR 独立模式、历史记录分页、多语言切换与 Google Ads
 */

import React, { useState, useEffect, useCallback } from "react";
import HistoryPanel from "./components/HistoryPanel.jsx";
import { convertImage, ocrImage } from "./utils/api.js";

/**
 * 文案字典：支持英文与简体中文
 */
const texts = {
  en: {
    brandMain: "Image Convert & OCR",
    brandSub: "Online image format converter with optional OCR text extraction",
    title: "Online Image Format Converter & OCR",
    subtitle:
        "Convert PNG, JPEG, WebP, TIFF, GIF, BMP, PSD images or extract text via OCR. Files are processed in real time on the server.",
    uploadTitle: "Upload & Tools",
    uploadDesc:
        "Choose a mode below: pure format conversion or OCR-only text extraction, then upload an image.",
    uploadMain: "Click or drag image here to upload",
    uploadSub: "Supported formats: PNG, JPEG, WEBP, TIFF, GIF, BMP, PSD",
    uploadMeta:
        "Max size depends on server configuration. Clear images give better OCR results.",
    targetLabel: "Target format",
    ocrLabel: "Enable OCR text extraction",
    ocrHint: "When disabled, only format conversion will be performed.",
    btnConvert: "Start",
    historyTitle: "OCR History",
    historySubtitle: "Recent text extracted from uploaded images",
    historySearchPlaceholder: "Search in OCR text...",
    historyEmpty:
        "No OCR history yet. Upload an image with OCR enabled to see results here.",
    btnClearFilter: "Reset",
    footerText:
        "All conversions happen on the server. Please avoid uploading sensitive or confidential content.",
    helperNoFile: "Please select or drop an image file first.",
    helperConverting:
        "Processing image... This may take a few seconds for large files.",
    helperOcring: "Running OCR... Please wait a moment.",
    helperSuccess: "Conversion completed. Download should start automatically.",
    helperOcrSuccess: "OCR completed. The result has been added to history.",
    helperErrorPrefix: "Error: ",
    convertTab: "Format Convert",
    ocrTab: "OCR Only",
  },
  zh: {
    brandMain: "图片转换与 OCR 提取",
    brandSub: "在线图片格式转换，支持可选 OCR 文本识别",
    title: "在线图片格式转换 & OCR 中文识别",
    subtitle:
        "支持 PNG、JPEG、WebP、TIFF、GIF、BMP、PSD 等格式在线互转，并可选开启 OCR 将图片中的文字提取为可编辑文本。",
    uploadTitle: "上传与工具",
    uploadDesc: "在下方选择模式：仅格式转换 或 仅 OCR 文本识别，然后上传图片。",
    uploadMain: "点击或拖拽图片到此区域上传",
    uploadSub: "支持格式：PNG、JPEG、WEBP、TIFF、GIF、BMP、PSD",
    uploadMeta: "最大文件大小由服务器限制决定，清晰图片有助于提升识别效果。",
    targetLabel: "目标格式",
    ocrLabel: "开启 OCR 文本识别",
    ocrHint: "关闭时只做格式转换，不执行文本识别。",
    btnConvert: "开始处理",
    historyTitle: "OCR 历史记录",
    historySubtitle: "最近上传图片的文字识别结果会展示在这里",
    historySearchPlaceholder: "在历史文本中搜索…",
    historyEmpty: "当前还没有 OCR 历史。勾选 OCR 并上传图片后，这里会展示识别结果。",
    btnClearFilter: "重置",
    footerText:
        "所有转换均在服务器端进行，请勿上传涉密或包含敏感信息的图片文件。",
    helperNoFile: "请先选择或拖拽一张图片文件。",
    helperConverting: "正在进行格式转换… 大图可能需要几秒钟时间。",
    helperOcring: "正在进行 OCR 识别，请稍候。",
    helperSuccess: "格式转换完成，浏览器应自动开始下载转换后的图片。",
    helperOcrSuccess: "OCR 完成，结果已加入右侧历史列表。",
    helperErrorPrefix: "处理失败：",
    convertTab: "格式转换",
    ocrTab: "仅 OCR 识别",
  },
};

function useTexts(lang) {
  return texts[lang] || texts.en;
}

export default function App() {
  // 当前语言：en / zh
  const [lang, setLang] = useState("en");
  const t = useTexts(lang);

  // mode: "convert" | "ocr"
  const [mode, setMode] = useState("convert");

  // 业务状态
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("png");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [helper, setHelper] = useState("");
  const [helperType, setHelperType] = useState("info");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // ① 根据 URL path 决定初始模式
  //    /convert -> convert
  //    /ocr     -> ocr
  //    /       -> 重写为 /convert
  // -----------------------------
  useEffect(() => {
    const path = window.location.pathname || "/";
    if (path.startsWith("/ocr")) {
      setMode("ocr");
    } else {
      // 默认跳到 /convert
      if (path !== "/convert") {
        window.history.replaceState(null, "", "/convert");
      }
      setMode("convert");
    }
  }, []);

  // ② 封装切换模式时同步修改 URL 的函数
  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    const nextPath = nextMode === "ocr" ? "/ocr" : "/convert";
    if (window.location.pathname !== nextPath) {
      window.history.replaceState(null, "", nextPath);
    }
  };

  // -----------------------------
  // 历史记录本地持久化
  // -----------------------------
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

  useEffect(() => {
    try {
      localStorage.setItem(
          "imageapp_ocr_history",
          JSON.stringify(history.slice(0, 200))
      );
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

  const showHelper = (msg, type = "info") => {
    setHelper(msg);
    setHelperType(type);
  };

  // 文件选择
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

  // 拖拽上传
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

  // 点击开始处理
  const handleSubmit = useCallback(async () => {
    if (!file) {
      showHelper(t.helperNoFile, "error");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);

      // ---------- 格式转换模式 ----------
      if (mode === "convert") {
        form.append("targetFormat", targetFormat);
        showHelper(t.helperConverting, "info");

        const data = await convertImage(form); // 调用 /api/image/convert

        if (!data || data.success === false) {
          showHelper(
              t.helperErrorPrefix + (data?.message || "Convert failed"),
              "error"
          );
          return;
        }

        if (data.base64 && data.filename) {
          const a = document.createElement("a");
          a.href = `data:${
              data.contentType || "application/octet-stream"
          };base64,${data.base64}`;
          a.download = data.filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        showHelper(t.helperSuccess, "success");
        return;
      }

      // ---------- OCR 模式 ----------
      if (mode === "ocr") {
        showHelper(t.helperOcring, "info");

        const data = await ocrImage(form); // 调用 /api/image/ocr

        if (!data || data.success === false) {
          showHelper(
              t.helperErrorPrefix + (data?.message || "OCR failed"),
              "error"
          );
          return;
        }

        if (data.ocrText) {
          setHistory((prev) => [
            { time: new Date().toLocaleString(), text: data.ocrText },
            ...prev,
          ]);
          showHelper(t.helperOcrSuccess, "success");
        } else {
          showHelper(t.helperErrorPrefix + "empty OCR result", "error");
        }
      }
    } catch (e) {
      console.error(e);
      showHelper(
          t.helperErrorPrefix + (e.message || "Unknown error"),
          "error"
      );
    } finally {
      setLoading(false);
    }
  }, [file, targetFormat, mode, t]);

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

            {/* 语言切换 */}
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

          {/* 顶部广告位 */}
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
            {/* 左侧：上传 + 模式 */}
            <section className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">{t.uploadTitle}</div>
                  <div className="card-desc">{t.uploadDesc}</div>
                </div>
              </div>

              {/* 模式 Tab：路径联动 */}
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button
                    className={mode === "convert" ? "tab-active" : "tab"}
                    onClick={() => handleModeChange("convert")}
                >
                  {t.convertTab}
                </button>

                <button
                    className={mode === "ocr" ? "tab-active" : "tab"}
                    onClick={() => handleModeChange("ocr")}
                >
                  {t.ocrTab}
                </button>
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
                    <div className="preview-label">{file ? file.name : ""}</div>
                    <img src={previewUrl} alt="preview" className="preview-image" />
                  </div>
              )}

              {/* 仅在“格式转换模式”下显示目标格式 */}
              {mode === "convert" && (
                  <div className="form-row">
                    <div className="field">
                      <div className="preview-label">{t.targetLabel}</div>
                      <select
                          className="select"
                          value={targetFormat}
                          onChange={(e) => setTargetFormat(e.target.value)}
                      >
                        {/* 这里的 value 要和后端支持列表严格一致 */}
                        <option value="png">PNG</option>
                        <option value="jpg">JPEG</option>   {/* ← 改成 jpg */}
                        <option value="webp">WebP</option>
                        <option value="bmp">BMP</option>
                        <option value="gif">GIF</option>
                        <option value="psd">PSD</option>
                      </select>
                    </div>
                  </div>
              )}

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

              {/* 操作按钮 */}
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