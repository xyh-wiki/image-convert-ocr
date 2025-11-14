/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description: 图片工具平台前端 —— 支持格式转换 / OCR / 压缩 / 裁剪 / 调整尺寸，单画布大模块布局
 */

import React, { useState, useEffect } from "react";
import {
  convertImage,
  ocrImage,
  compressImage,
  cropImage,
  resizeImage,
} from "./utils/api.js";

/**
 * 多语言文案
 */
const texts = {
  en: {
    brandMain: "Image Tools Platform",
    brandSub: "Convert · OCR · Compress · Crop · Resize",
    title: "Online Image Tools",
    subtitle: "Convert, compress, crop, resize or extract text via OCR.",

    uploadTitle: "Upload & Tools",
    uploadDesc:
      "Choose a tool mode below. Upload an image to start processing.",
    uploadMain: "Click or drag image here to upload",
    uploadSub: "Supported: PNG, JPEG, WEBP, TIFF, GIF, BMP, PSD",
    uploadMeta: "Clear images produce better results.",

    convertTab: "Convert",
    ocrTab: "OCR",
    compressTab: "Compress",
    cropTab: "Crop",
    resizeTab: "Resize",

    // 各模式描述，用于顶部模式说明面板
    convertDesc: "Convert image formats such as PNG / JPEG / WebP…",
    ocrDesc: "Extract searchable text from images using OCR.",
    compressDesc: "Reduce image file size while keeping good quality.",
    cropDesc: "Crop a specific rectangular region from the image.",
    resizeDesc: "Resize image to the desired width and height.",

    targetLabel: "Target Format",

    compressLabel: "Compression (%)",
    cropLabel: "Crop Region",
    cropX: "X",
    cropY: "Y",
    cropW: "Width",
    cropH: "Height",

    resizeLabel: "Resize",
    resizeW: "Width",
    resizeH: "Height",

    btnStart: "Start",
    btnClear: "Clear",

    helperNoFile: "Please select or drop an image first.",
    helperConverting: "Processing…",
    helperSuccess: "Completed. Downloading…",
    helperErrorPrefix: "Error: ",

    // OCR
    helperOcring: "Running OCR…",
    helperOcrSuccess: "OCR completed.",

    footerText: "All tasks run on server. Please avoid sensitive images.",
  },

  zh: {
    brandMain: "图片工具平台",
    brandSub: "格式转换 · OCR · 压缩 · 裁剪 · 调整尺寸",
    title: "在线图片工具合集",
    subtitle: "支持格式转换、压缩、裁剪、尺寸修改与 OCR 文字提取",

    uploadTitle: "上传与工具面板",
    uploadDesc: "在下方选择需要使用的工具模式，然后上传图片即可开始处理。",
    uploadMain: "点击或拖拽上传图片",
    uploadSub: "支持：PNG、JPEG、WEBP、TIFF、GIF、BMP、PSD",
    uploadMeta: "图片越清晰，处理与识别效果越佳。",

    convertTab: "格式转换",
    ocrTab: "OCR 识别",
    compressTab: "图片压缩",
    cropTab: "图片裁剪",
    resizeTab: "调整尺寸",

    convertDesc: "在 PNG / JPEG / WebP 等主流格式之间快速互转。",
    ocrDesc: "从图片中提取可搜索、可复制的文本内容。",
    compressDesc: "降低图片体积，兼顾清晰度与加载速度。",
    cropDesc: "按指定坐标裁剪图片中指定矩形区域。",
    resizeDesc: "将图片缩放到目标宽高，适配不同场景需求。",

    targetLabel: "目标格式",

    compressLabel: "压缩比例 (%)",
    cropLabel: "裁剪区域",
    cropX: "X 坐标",
    cropY: "Y 坐标",
    cropW: "宽度",
    cropH: "高度",

    resizeLabel: "调整尺寸",
    resizeW: "宽度",
    resizeH: "高度",

    btnStart: "开始处理",
    btnClear: "清空",

    helperNoFile: "请先选择或拖拽一张图片。",
    helperConverting: "正在处理…",
    helperSuccess: "处理完成，正在下载…",
    helperErrorPrefix: "错误：",

    helperOcring: "正在执行 OCR 识别…",
    helperOcrSuccess: "OCR 完成，已生成文本结果。",

    footerText: "所有处理均在服务器端完成，请勿上传敏感或涉密图片。",
  },
};

function useTexts(lang) {
  return texts[lang] || texts.en;
}

export default function App() {
  // ========== 基本状态 ==========
  const [lang, setLang] = useState("en");
  const t = useTexts(lang);

  // 五个工具模式
  const modes = ["convert", "ocr", "compress", "crop", "resize"];
  const [mode, setMode] = useState("convert");

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [helper, setHelper] = useState("");
  const [helperType, setHelperType] = useState("info");
  const [loading, setLoading] = useState(false);

  // 各模式独立参数
  const [targetFormat, setTargetFormat] = useState("png");
  const [compressPct, setCompressPct] = useState(80);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(300);
  const [cropH, setCropH] = useState(300);
  const [resizeW, setResizeW] = useState(800);
  const [resizeH, setResizeH] = useState(600);

  // ========== URL 同步模式 ==========
  useEffect(() => {
    const path = (window.location.pathname || "/").replace("/", "");
    if (modes.includes(path)) {
      setMode(path);
    } else {
      window.history.replaceState(null, "", "/convert");
      setMode("convert");
    }
  }, []);

  const updateUrl = (m) => {
    window.history.replaceState(null, "", `/${m}`);
    setMode(m);
  };

  // ========== 提示 ==========
  const showHelper = (msg, type = "info") => {
    setHelper(msg);
    setHelperType(type);
  };

  // ========== 文件选择 ==========
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
  };

  // ========== 主处理入口 ==========
  const handleStart = async () => {
    if (!file) {
      showHelper(t.helperNoFile, "error");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);
      let data = null;

      switch (mode) {
        case "convert":
          form.append("targetFormat", targetFormat);
          showHelper(t.helperConverting);
          data = await convertImage(form);
          break;
        case "ocr":
          showHelper(t.helperOcring);
          data = await ocrImage(form);
          if (data?.ocrText) {
            showHelper(t.helperOcrSuccess, "success");
          }
          break;
        case "compress":
          form.append("quality", compressPct);
          showHelper(t.helperConverting);
          data = await compressImage(form);
          break;
        case "crop":
          form.append("x", cropX);
          form.append("y", cropY);
          form.append("width", cropW);
          form.append("height", cropH);
          showHelper(t.helperConverting);
          data = await cropImage(form);
          break;
        case "resize":
          form.append("width", resizeW);
          form.append("height", resizeH);
          showHelper(t.helperConverting);
          data = await resizeImage(form);
          break;
        default:
          break;
      }

      // 统一下载处理：所有非 OCR 模式都返回 base64 + filename
      if (mode !== "ocr" && data?.base64 && data?.filename) {
        const a = document.createElement("a");
        a.href = `data:${data.contentType};base64,${data.base64}`;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showHelper(t.helperSuccess, "success");
      }
    } catch (e) {
      showHelper(t.helperErrorPrefix + (e?.message || "Unknown error"), "error");
    } finally {
      setLoading(false);
    }
  };

  // 当前模式的标题和描述（用于主画布顶部）
  const modeInfo = {
    convert: { title: t.convertTab, desc: t.convertDesc },
    ocr: { title: t.ocrTab, desc: t.ocrDesc },
    compress: { title: t.compressTab, desc: t.compressDesc },
    crop: { title: t.cropTab, desc: t.cropDesc },
    resize: { title: t.resizeTab, desc: t.resizeDesc },
  };

  return (
    <div className="app-shell">
      {/* 顶部品牌 + 语言切换 */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <div className="brand-icon">IC</div>
            <div>
              <div className="brand-text-main">{t.brandMain}</div>
              <div className="brand-text-sub">{t.brandSub}</div>
            </div>
          </div>

          <div className="lang-switch">
            <button
              className={lang === "en" ? "lang-btn lang-btn-active" : "lang-btn"}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              className={lang === "zh" ? "lang-btn lang-btn-active" : "lang-btn"}
              onClick={() => setLang("zh")}
            >
              中文
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区域：顶部说明 + 工具画布 */}
      <main className="app-main">
        <section className="tool-hero">
          <h1 className="page-title">{t.title}</h1>
          <p className="page-subtitle">{t.subtitle}</p>

          {/* 五个大功能模块按钮 */}
          <div className="tool-strip">
            <button
              className={mode === "convert" ? "tool-pill tool-pill-active" : "tool-pill"}
              onClick={() => updateUrl("convert")}
            >
              <div className="tool-pill-title">{t.convertTab}</div>
              <div className="tool-pill-desc">{t.convertDesc}</div>
            </button>
            <button
              className={mode === "ocr" ? "tool-pill tool-pill-active" : "tool-pill"}
              onClick={() => updateUrl("ocr")}
            >
              <div className="tool-pill-title">{t.ocrTab}</div>
              <div className="tool-pill-desc">{t.ocrDesc}</div>
            </button>
            <button
              className={mode === "compress" ? "tool-pill tool-pill-active" : "tool-pill"}
              onClick={() => updateUrl("compress")}
            >
              <div className="tool-pill-title">{t.compressTab}</div>
              <div className="tool-pill-desc">{t.compressDesc}</div>
            </button>
            <button
              className={mode === "crop" ? "tool-pill tool-pill-active" : "tool-pill"}
              onClick={() => updateUrl("crop")}
            >
              <div className="tool-pill-title">{t.cropTab}</div>
              <div className="tool-pill-desc">{t.cropDesc}</div>
            </button>
            <button
              className={mode === "resize" ? "tool-pill tool-pill-active" : "tool-pill"}
              onClick={() => updateUrl("resize")}
            >
              <div className="tool-pill-title">{t.resizeTab}</div>
              <div className="tool-pill-desc">{t.resizeDesc}</div>
            </button>
          </div>
        </section>

        {/* 主功能画布：左右拉满，整体高度占视口上方区域 */}
        <section className="card tool-card">
          <div className="tool-card-header">
            <div className="tool-card-title">{modeInfo[mode].title}</div>
            <div className="tool-card-desc">{modeInfo[mode].desc}</div>
          </div>

          {/* 上传区域 */}
          <label
            className="upload-area"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="upload-icon">↑</div>
            <div style={{ flex: 1 }}>
              <div className="upload-text-main">{t.uploadMain}</div>
              <div className="upload-text-sub">{t.uploadSub}</div>
            </div>
            <div className="upload-meta">{t.uploadMeta}</div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {/* 预览区域 */}
          {previewUrl && (
            <div className="preview-wrapper">
              <div className="preview-label">{file?.name}</div>
              <img src={previewUrl} className="preview-image" alt="preview" />
            </div>
          )}

          {/* 按模式显示参数面板 */}
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

          {mode === "compress" && (
            <div className="form-row">
              <div className="field">
                <div className="preview-label">{t.compressLabel}</div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={compressPct}
                  onChange={(e) => setCompressPct(Number(e.target.value))}
                  className="input"
                />
                <div className="slider-value">{compressPct}%</div>
              </div>
            </div>
          )}

          {mode === "crop" && (
            <div className="form-row column">
              <div className="preview-label">{t.cropLabel}</div>
              <div className="field-row">
                <input
                  className="input"
                  placeholder={t.cropX}
                  value={cropX}
                  onChange={(e) => setCropX(e.target.value)}
                />
                <input
                  className="input"
                  placeholder={t.cropY}
                  value={cropY}
                  onChange={(e) => setCropY(e.target.value)}
                />
              </div>
              <div className="field-row">
                <input
                  className="input"
                  placeholder={t.cropW}
                  value={cropW}
                  onChange={(e) => setCropW(e.target.value)}
                />
                <input
                  className="input"
                  placeholder={t.cropH}
                  value={cropH}
                  onChange={(e) => setCropH(e.target.value)}
                />
              </div>
            </div>
          )}

          {mode === "resize" && (
            <div className="form-row column">
              <div className="preview-label">{t.resizeLabel}</div>
              <div className="field-row">
                <input
                  className="input"
                  placeholder={t.resizeW}
                  value={resizeW}
                  onChange={(e) => setResizeW(e.target.value)}
                />
                <input
                  className="input"
                  placeholder={t.resizeH}
                  value={resizeH}
                  onChange={(e) => setResizeH(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 提示信息 */}
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

          {/* 操作按钮区 */}
          <div className="action-row">
            <button className="btn" onClick={handleStart} disabled={loading}>
              {loading ? "…" : t.btnStart}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }}
            >
              {t.btnClear}
            </button>
          </div>
        </section>

        {/* 底部广告与说明区域，预留给 Google Ads */}
        <section className="bottom-ads">
          <div className="bottom-ads-inner">
            <div className="bottom-ads-text">
              Image Convert &amp; OCR provides image format conversion,
              compression, cropping, resizing, and OCR text extraction. All
              processing is completed on the server side, requiring no software
              installation, making it suitable for daily office work and
              development debugging.
            </div>
            <div className="bottom-ads-slot">
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="2233445566"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚说明 */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="footer-text">{t.footerText}</div>
        </div>
      </footer>
    </div>
  );
}