/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description: 前端主页面：
 *  - 支持图片格式转换 / OCR / 压缩 / 裁剪 / 调整尺寸 五种模式
 *  - 模式切换按钮移动到页面顶部工具栏
 *  - 工具区域铺满屏幕宽度，右侧历史面板自适应高度
 */

import React, { useState, useEffect, useCallback } from "react";
import HistoryPanel from "./components/HistoryPanel.jsx";
import { convertImage, ocrImage, editImage } from "./utils/api.js"; // editImage 为压缩/裁剪/尺寸调整统一接口（如果你还没加，可以先保留占位）

/**
 * 文案字典：支持英文与简体中文
 */
const texts = {
  en: {
    brandMain: "Image Tools Platform",
    brandSub: "Convert · OCR · Compress · Crop · Resize",
    title: "Online Image Tools",
    subtitle:
        "Convert, compress, crop, resize or extract text via OCR. Files are processed in real time on the server.",
    uploadTitle: "Upload & Tools",
    uploadDesc:
        "Choose a tool mode below. Upload an image to start processing.",
    uploadMain: "Click or drag image here to upload",
    uploadSub: "Supported: PNG, JPEG, WEBP, TIFF, GIF, BMP, PSD",
    uploadMeta: "Clear images produce better results.",
    targetLabel: "Target Format",
    btnStart: "Start",
    btnClear: "Clear",
    historyTitle: "OCR History",
    historySubtitle: "Recent text extracted from uploaded images",
    historySearchPlaceholder: "Search in OCR text...",
    historyEmpty:
        "No OCR history yet. Upload an image and run OCR to see results here.",
    btnClearFilter: "Reset",
    footerText:
        "All conversions happen on the server. Please avoid uploading sensitive or confidential content.",
    helperNoFile: "Please select or drop an image first.",
    helperConverting: "Processing image… This may take a few seconds.",
    helperOcring: "Running OCR… Please wait a moment.",
    helperSuccess: "Done. Download should start automatically.",
    helperOcrSuccess: "OCR completed. The result has been added to history.",
    helperErrorPrefix: "Error: ",
    convertTab: "Convert",
    ocrTab: "OCR",
    compressTab: "Compress",
    cropTab: "Crop",
    resizeTab: "Resize",
  },
  zh: {
    brandMain: "图片工具平台",
    brandSub: "格式转换 · OCR · 压缩 · 裁剪 · 调整尺寸",
    title: "在线图片工具集",
    subtitle:
        "支持图片格式转换、压缩、裁剪、尺寸调整以及 OCR 文字识别，全部在服务端实时完成。",
    uploadTitle: "上传与工具",
    uploadDesc: "在下方选择工具模式，上传图片即可开始处理。",
    uploadMain: "点击或拖拽图片到此区域上传",
    uploadSub: "支持格式：PNG、JPEG、WEBP、TIFF、GIF、BMP、PSD",
    uploadMeta: "图片越清晰，转换与识别效果越好。",
    targetLabel: "目标格式",
    btnStart: "开始",
    btnClear: "清空",
    historyTitle: "OCR 历史记录",
    historySubtitle: "最近识别出的文字会展示在这里",
    historySearchPlaceholder: "在历史文本中搜索…",
    historyEmpty: "当前还没有 OCR 历史。上传图片并执行 OCR 后会显示结果。",
    btnClearFilter: "重置",
    footerText:
        "所有处理均在服务器端进行，请勿上传涉密或包含敏感信息的图片文件。",
    helperNoFile: "请先选择或拖拽一张图片。",
    helperConverting: "正在处理图片… 大图可能需要几秒钟时间。",
    helperOcring: "正在执行 OCR 识别，请稍候。",
    helperSuccess: "处理完成，浏览器应自动开始下载结果图片。",
    helperOcrSuccess: "OCR 完成，结果已加入右侧历史列表。",
    helperErrorPrefix: "处理失败：",
    convertTab: "转换",
    ocrTab: "OCR",
    compressTab: "压缩",
    cropTab: "裁剪",
    resizeTab: "调整尺寸",
  },
};

/**
 * 根据语言返回文案
 */
function useTexts(lang) {
  return texts[lang] || texts.en;
}

export default function App() {
  // 当前语言：en / zh（默认英文）
  const [lang, setLang] = useState("en");
  const t = useTexts(lang);

  // 当前模式：convert | ocr | compress | crop | resize
  const [mode, setMode] = useState("convert");

  // 业务状态
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("png");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [helper, setHelper] = useState("");
  const [helperType, setHelperType] = useState("info"); // info | error | success
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // URL path → 初始模式
  //   /convert → convert
  //   /ocr     → ocr
  //   /compress|/crop|/resize → 对应模式
  //   其它路径 → /convert
  // -----------------------------
  useEffect(() => {
    const path = window.location.pathname || "/";
    if (path.startsWith("/ocr")) setMode("ocr");
    else if (path.startsWith("/compress")) setMode("compress");
    else if (path.startsWith("/crop")) setMode("crop");
    else if (path.startsWith("/resize")) setMode("resize");
    else {
      if (path !== "/convert") {
        window.history.replaceState(null, "", "/convert");
      }
      setMode("convert");
    }
  }, []);

  // 模式切换：顺带改 URL，顶部大按钮使用
  const handleModeChange = useCallback((nextMode) => {
    setMode(nextMode);
    const nextPath =
        nextMode === "ocr"
            ? "/ocr"
            : nextMode === "compress"
                ? "/compress"
                : nextMode === "crop"
                    ? "/crop"
                    : nextMode === "resize"
                        ? "/resize"
                        : "/convert";
    if (window.location.pathname !== nextPath) {
      window.history.replaceState(null, "", nextPath);
    }
  }, []);

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

  // Reset OCR 历史
  const handleResetHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem("imageapp_ocr_history");
    } catch (e) {
      console.warn("Failed to clear history from localStorage", e);
    }
  }, []);

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

  /** 设置提示信息 */
  const showHelper = (msg, type = "info") => {
    setHelper(msg);
    setHelperType(type);
  };

  /** 选择文件 */
  const handleFileChange = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  }, []);

  /** 拖拽上传 */
  const handleDrop = useCallback((e) => {
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
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /** 点击 Start */
  const handleSubmit = useCallback(
      async () => {
        if (!file) {
          showHelper(t.helperNoFile, "error");
          return;
        }

        const form = new FormData();
        form.append("file", file);

        try {
          setLoading(true);

          // ---------- 1) 格式转换 ----------
          if (mode === "convert") {
            form.append("targetFormat", targetFormat);
            showHelper(t.helperConverting, "info");

            const data = await convertImage(form);

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

          // ---------- 2) OCR ----------
          if (mode === "ocr") {
            showHelper(t.helperOcring, "info");

            const data = await ocrImage(form);

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
            return;
          }

          // ---------- 3) Compress / Crop / Resize ----------
          if (mode === "compress" || mode === "crop" || mode === "resize") {
            // 这里先简单调用统一编辑接口，你后端如果已拆分，可按需调整参数：
            form.append("mode", mode);
            showHelper(t.helperConverting, "info");

            const data = await editImage(form); // 对应 /api/image/edit 或多个子接口

            if (!data || data.success === false) {
              showHelper(
                  t.helperErrorPrefix + (data?.message || "Edit failed"),
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
      },
      [file, targetFormat, mode, t]
  );

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
          <div className="page-headline">
            <div>
              <h1 className="page-title">{t.title}</h1>
              <p className="page-subtitle">{t.subtitle}</p>
            </div>
          </div>

          {/* ✅ 顶部工具模式按钮栏（不再放在卡片内部） */}
          <nav className="tool-tabs">
            <button
                className={mode === "convert" ? "tool-tab active" : "tool-tab"}
                onClick={() => handleModeChange("convert")}
            >
              {t.convertTab}
            </button>
            <button
                className={mode === "ocr" ? "tool-tab active" : "tool-tab"}
                onClick={() => handleModeChange("ocr")}
            >
              {t.ocrTab}
            </button>
            <button
                className={mode === "compress" ? "tool-tab active" : "tool-tab"}
                onClick={() => handleModeChange("compress")}
            >
              {t.compressTab}
            </button>
            <button
                className={mode === "crop" ? "tool-tab active" : "tool-tab"}
                onClick={() => handleModeChange("crop")}
            >
              {t.cropTab}
            </button>
            <button
                className={mode === "resize" ? "tool-tab active" : "tool-tab"}
                onClick={() => handleModeChange("resize")}
            >
              {t.resizeTab}
            </button>
          </nav>

          {/* 主网格：左工具 + 右历史，整体拉满宽度与高度 */}
          <div className="main-grid">
            {/* 左侧：上传 + 工具配置 */}
            <section className="card card-main">
              <div className="card-header">
                <div>
                  <div className="card-title">{t.uploadTitle}</div>
                  <div className="card-desc">{t.uploadDesc}</div>
                </div>
                <div className="mode-badge">{/* 小徽标显示当前模式 */}
                  {mode.toUpperCase()}
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
                        <option value="png">PNG</option>
                        <option value="jpg">JPEG</option>
                        <option value="webp">WebP</option>
                        <option value="bmp">BMP</option>
                        <option value="gif">GIF</option>
                        <option value="psd">PSD</option>
                      </select>
                    </div>
                  </div>
              )}

              {/* 其他模式的配置区预留（压缩质量、裁剪区域、尺寸输入等，可后续继续加） */}
              {mode !== "convert" && mode !== "ocr" && (
                  <div className="advanced-panel">
                    <div className="advanced-tip">
                      {/* 先给一点说明文案，避免画面单调；后续你可以替换成真实表单控件 */}
                      {lang === "en"
                          ? "Advanced options (quality, crop area, resize width/height) will be available here."
                          : "高级参数（压缩质量、裁剪范围、目标宽高等）可在此区域配置，后续可继续扩展。"}
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
              <div className="action-row">
                <button
                    type="button"
                    className="btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                  {loading ? "..." : t.btnStart}
                </button>
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setFile(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                      setHelper("");
                    }}
                >
                  {t.btnClear}
                </button>
              </div>
            </section>

            {/* 右侧：历史记录 */}
            <HistoryPanel
                history={history}
                lang={lang}
                t={t}
                onReset={handleResetHistory}
            />
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