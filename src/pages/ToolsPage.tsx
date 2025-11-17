/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description:
 *  图片工具平台前端 Tools 页面 —— 全新浅色 UI 版本
 *  - 左侧：模式切换 / 上传 / 参数设置 / 操作按钮
 *  - 右侧：图片预览 / OCR 文本结果 / 结果信息
 *  - 完全前端实现：与 utils/api.js 中的前端 Canvas + OCRSpace 调用匹配
 */

import React, { useState, useEffect } from "react";
import {
  convertImage,
  ocrImage,
  compressImage,
  cropImage,
  resizeImage,
} from "../utils/api";

/**
 * 多语言文案定义
 */
const texts = {
  en: {
    brandMain: "Image Tools Platform",
    brandSub: "Convert · OCR · Compress · Crop · Resize",
    pageTitle: "Online Image Tools",
    pageSubtitle:
        "Convert image formats, extract text via OCR, compress, crop, or resize – all in your browser.",

    convertTab: "Convert",
    convertDesc: "Convert image formats such as PNG / JPEG / WebP.",
    ocrTab: "OCR",
    ocrDesc: "Extract searchable text from images using OCR.",
    compressTab: "Compress",
    compressDesc: "Reduce image file size while keeping good quality.",
    cropTab: "Crop",
    cropDesc: "Crop a specific rectangular region from the image.",
    resizeTab: "Resize",
    resizeDesc: "Resize image to the desired width and height.",

    uploadTitle: "Upload image",
    uploadDesc: "Click or drag image here to upload.",
    uploadSupport: "Supported: PNG, JPEG, WEBP, GIF, BMP, PSD",
    uploadHint: "Clear, high-resolution images produce better results.",

    targetLabel: "Target format",
    compressLabel: "Compression (%)",
    cropLabel: "Crop region (px)",
    cropX: "X",
    cropY: "Y",
    cropW: "Width",
    cropH: "Height",
    resizeLabel: "Resize",
    resizeW: "Width",
    resizeH: "Height",

    btnStart: "Start",
    btnClear: "Clear",
    btnDownload: "Download",
    btnCopyText: "Copy text",
    btnCopied: "Copied",

    helperNoFile: "Please select or drop an image first.",
    helperProcessing: "Processing…",
    helperSuccess: "Completed.",
    helperErrorPrefix: "Error: ",

    ocrResultLabel: "OCR result",
    ocrResultPlaceholder: "Recognized text will appear here…",
    previewTitle: "Preview",
    previewEmpty: "Upload an image to see the preview here.",

    metaInfoTitle: "Result details",
    metaInfoSize: "Size",
    metaInfoSizeValue: "{w} × {h} px",

    langEn: "EN",
    langZh: "中文",
  },

  zh: {
    brandMain: "图片工具平台",
    brandSub: "格式转换 · OCR · 压缩 · 裁剪 · 调整尺寸",
    pageTitle: "在线图片工具",
    pageSubtitle:
        "在浏览器中完成图片格式转换、OCR 文字识别、压缩、裁剪与尺寸调整。",

    convertTab: "格式转换",
    convertDesc: "在 PNG / JPEG / WebP 等常见格式之间互相转换。",
    ocrTab: "OCR 识别",
    ocrDesc: "从图片中提取可搜索、可复制的文字内容。",
    compressTab: "图片压缩",
    compressDesc: "在尽可能保证清晰度的前提下减小图片体积。",
    cropTab: "图片裁剪",
    cropDesc: "按指定坐标与宽高裁剪出图片局部区域。",
    resizeTab: "调整尺寸",
    resizeDesc: "将图片缩放到指定宽度与高度。",

    uploadTitle: "上传图片",
    uploadDesc: "点击或拖拽图片到此区域上传。",
    uploadSupport: "支持：PNG、JPEG、WEBP、GIF、BMP、PSD",
    uploadHint: "图片越清晰，处理与识别效果通常越好。",

    targetLabel: "目标格式",
    compressLabel: "压缩比例（%）",
    cropLabel: "裁剪区域（像素）",
    cropX: "X 坐标",
    cropY: "Y 坐标",
    cropW: "宽度",
    cropH: "高度",
    resizeLabel: "调整尺寸",
    resizeW: "宽度",
    resizeH: "高度",

    btnStart: "开始",
    btnClear: "清空",
    btnDownload: "下载结果",
    btnCopyText: "复制文本",
    btnCopied: "已复制",

    helperNoFile: "请先选择或拖拽一张图片。",
    helperProcessing: "正在处理…",
    helperSuccess: "处理完成。",
    helperErrorPrefix: "错误：",

    ocrResultLabel: "OCR 识别结果",
    ocrResultPlaceholder: "识别后的文本将显示在这里，可直接复制使用…",
    previewTitle: "图片预览",
    previewEmpty: "请先上传图片，这里会展示预览效果。",

    metaInfoTitle: "结果信息",
    metaInfoSize: "尺寸",
    metaInfoSizeValue: "宽 {w} × 高 {h} 像素",

    langEn: "EN",
    langZh: "中文",
  },
};

/**
 * 根据语言获取文案
 */
function useTexts(lang) {
  return texts[lang] || texts.en;
}

/**
 * ToolsPage 主组件
 */
export default function ToolsPage() {
  // ========== 语言与文案 ==========
  const [lang, setLang] = useState("en");
  const t = useTexts(lang);

  // ========== 模式相关 ==========
  const [mode, setMode] = useState("convert");
  // ========== 文件与预览 ==========
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // ========== 结果相关（与前端 api.js 返回结构匹配） ==========
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");
  const [ocrText, setOcrText] = useState<string>("");
  const [resultWidth, setResultWidth] = useState<number | null>(null);
  const [resultHeight, setResultHeight] = useState<number | null>(null);

  // ========== 参数状态 ==========
  const [targetFormat, setTargetFormat] = useState<"png" | "jpg" | "webp">("png");
  const [compressQuality, setCompressQuality] = useState<number>(80);
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropW, setCropW] = useState<number>(400);
  const [cropH, setCropH] = useState<number>(300);
  const [resizeW, setResizeW] = useState<number>(800);
  const [resizeH, setResizeH] = useState<number>(600);

  // ========== 提示 / 状态 ==========
  const [helper, setHelper] = useState<string>("");
  const [helperType, setHelperType] = useState<"info" | "success" | "error">("info");
  const [processing, setProcessing] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // 组件卸载或图片切换时释放 URL，避免内存泄漏
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /** 显示提示信息 */
  function showHelper(msg, type = "info") {
    setHelper(msg);
    setHelperType(type);
  }
  /** 应用新文件，生成预览并清理之前结果 */
  function applyNewFile(f) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    // 清理旧结果
    setDownloadBlob(null);
    setDownloadName("");
    setOcrText("");
    setResultWidth(null);
    setResultHeight(null);
    showHelper("", "info");
  }

  /** input 选择文件 */
  function handleFileChange(e) {    const f = e.target.files?.[0];
    if (!f) return;
    applyNewFile(f);
  }

  /** 拖拽上传 */
  function handleDrop(e) {    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    applyNewFile(f);
  }

  function handleDragOver(e) {    e.preventDefault();
  }

  /** 清空当前所有状态 */
  function handleClear() {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setDownloadBlob(null);
    setDownloadName("");
    setOcrText("");
    setResultWidth(null);
    setResultHeight(null);
    showHelper("", "info");
  }

  /** 统一处理入口：根据当前 mode 调用不同 api.js 方法 */
  async function handleStart() {
    if (!file) {
      showHelper(t.helperNoFile, "error");
      return;
    }

    setProcessing(true);
    showHelper(t.helperProcessing, "info");
    // 每次处理前清空旧的结果
    setDownloadBlob(null);
    setDownloadName("");
    setOcrText("");
    setResultWidth(null);
    setResultHeight(null);

    try {
      const form = new FormData();
      form.append("file", file);

      if (mode === "convert") {
        form.append("targetFormat", targetFormat);
        const res = await convertImage(form);
        setDownloadBlob(res.blob || null);
        setDownloadName(res.filename || `converted.${targetFormat}`);
        setResultWidth(res.width || null);
        setResultHeight(res.height || null);
        showHelper(t.helperSuccess, "success");
      } else if (mode === "ocr") {
        const res = await ocrImage(form);
        setOcrText(res.text || "");
        showHelper(t.helperSuccess, "success");
      } else if (mode === "compress") {
        form.append("quality", String(compressQuality));
        const res = await compressImage(form);
        setDownloadBlob(res.blob || null);
        setDownloadName(res.filename || "compressed.jpg");
        setResultWidth(res.width || null);
        setResultHeight(res.height || null);
        showHelper(t.helperSuccess, "success");
      } else if (mode === "crop") {
        form.append("x", String(cropX));
        form.append("y", String(cropY));
        form.append("width", String(cropW));
        form.append("height", String(cropH));
        const res = await cropImage(form);
        setDownloadBlob(res.blob || null);
        setDownloadName("cropped.png");
        setResultWidth(res.width || null);
        setResultHeight(res.height || null);
        showHelper(t.helperSuccess, "success");
      } else if (mode === "resize") {
        if (resizeW) form.append("width", String(resizeW));
        if (resizeH) form.append("height", String(resizeH));
        const res = await resizeImage(form);
        setDownloadBlob(res.blob || null);
        setDownloadName("resized.png");
        setResultWidth(res.width || null);
        setResultHeight(res.height || null);
        showHelper(t.helperSuccess, "success");
      }
    } catch (e) {
      console.error(e);
      showHelper(
          (t.helperErrorPrefix || "Error: ") + (e?.message || "Unknown error"),
          "error"
      );
    } finally {
      setProcessing(false);
    }
  }

  /** 下载结果图片（convert/compress/crop/resize） */
  async function handleDownload() {
    if (!downloadBlob) return;

    const blobToUse = downloadBlob;
    const filename = downloadName || "image-result.png";

    const url = URL.createObjectURL(blobToUse);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /** 复制 OCR 文本 */
  async function handleCopyText() {
    if (!ocrText) return;
    try {
      await navigator.clipboard.writeText(ocrText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    } catch (e) {
      console.error(e);
    }
  }

  const showDownload =
      (mode === "convert" ||
          mode === "compress" ||
          mode === "crop" ||
          mode === "resize") &&
      !!downloadBlob;

  const showOcrTextArea = mode === "ocr";

  const modeInfo = {
    convert: { title: t.convertTab, desc: t.convertDesc },
    ocr: { title: t.ocrTab, desc: t.ocrDesc },
    compress: { title: t.compressTab, desc: t.compressDesc },
    crop: { title: t.cropTab, desc: t.cropDesc },
    resize: { title: t.resizeTab, desc: t.resizeDesc },
  }[mode];

  return (
      <div className="tools-page">
        {/* 顶部标题 + 品牌 + 语言切换 */}
        <div className="tools-header">
          <div className="tools-header-left">
            <div className="tools-brand">
              <div className="tools-brand-icon">IC</div>
              <div className="tools-brand-text">
                <div className="tools-brand-main">{t.brandMain}</div>
                <div className="tools-brand-sub">{t.brandSub}</div>
              </div>
            </div>
            <div className="tools-title-block">
              <h1 className="tools-title">{t.pageTitle}</h1>
              <p className="tools-subtitle">{t.pageSubtitle}</p>
            </div>
          </div>

          <div className="tools-header-right">
            <div className="tools-lang-switch">
              <button
                  type="button"
                  className={
                      "tools-lang-btn" + (lang === "en" ? " tools-lang-btn-active" : "")
                  }
                  onClick={() => setLang("en")}
              >
                {t.langEn}
              </button>
              <button
                  type="button"
                  className={
                      "tools-lang-btn" + (lang === "zh" ? " tools-lang-btn-active" : "")
                  }
                  onClick={() => setLang("zh")}
              >
                {t.langZh}
              </button>
            </div>
          </div>
        </div>

        {/* 主体：左侧操作区 + 右侧预览/结果区 */}
        <div className="tools-layout">
          {/* 左侧 */}
          <section className="tools-left">
            {/* 模式切换 */}
            <div className="tools-mode-tabs" aria-label="Tool modes">
              <button
                  type="button"
                  className={
                      "tools-tab" + (mode === "convert" ? " tools-tab-active" : "")
                  }
                  onClick={() => setMode("convert")}
              >
                <strong>{t.convertTab}</strong>
                <span>{t.convertDesc}</span>
              </button>
              <button
                  type="button"
                  className={
                      "tools-tab" + (mode === "ocr" ? " tools-tab-active" : "")
                  }
                  onClick={() => setMode("ocr")}
              >
                <strong>{t.ocrTab}</strong>
                <span>{t.ocrDesc}</span>
              </button>
              <button
                  type="button"
                  className={
                      "tools-tab" + (mode === "compress" ? " tools-tab-active" : "")
                  }
                  onClick={() => setMode("compress")}
              >
                <strong>{t.compressTab}</strong>
                <span>{t.compressDesc}</span>
              </button>
              <button
                  type="button"
                  className={
                      "tools-tab" + (mode === "crop" ? " tools-tab-active" : "")
                  }
                  onClick={() => setMode("crop")}
              >
                <strong>{t.cropTab}</strong>
                <span>{t.cropDesc}</span>
              </button>
              <button
                  type="button"
                  className={
                      "tools-tab" + (mode === "resize" ? " tools-tab-active" : "")
                  }
                  onClick={() => setMode("resize")}
              >
                <strong>{t.resizeTab}</strong>
                <span>{t.resizeDesc}</span>
              </button>
            </div>

            {/* 上传区域 */}
            <div
                className="tools-upload-area"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
              <div className="tools-upload-icon">⬆</div>
              <div className="tools-upload-content">
                <div className="tools-upload-title">{t.uploadTitle}</div>
                <div className="tools-upload-desc">{t.uploadDesc}</div>
                <div className="tools-upload-support">{t.uploadSupport}</div>
                <div className="tools-upload-hint">{t.uploadHint}</div>
              </div>
              <div className="tools-upload-input-wrapper">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="tools-upload-input"
                />
              </div>
            </div>

            {/* 参数设置区 */}
            <div className="tools-params">
              {mode === "convert" && (
                  <div className="tools-field">
                    <label className="tools-field-label">{t.targetLabel}</label>
                    <select
                        className="tools-field-control"
                        value={targetFormat}
                        onChange={(e) =>
                            setTargetFormat(e.target.value)
                        }
                    >
                      <option value="png">PNG</option>
                      <option value="jpg">JPG</option>
                      <option value="webp">WEBP</option>
                    </select>
                  </div>
              )}

              {mode === "compress" && (
                  <div className="tools-field">
                    <label className="tools-field-label">
                      {t.compressLabel}: {compressQuality}%
                    </label>
                    <input
                        type="range"
                        min="20"
                        max="100"
                        value={compressQuality}
                        onChange={(e) => setCompressQuality(Number(e.target.value))}
                        className="tools-field-range"
                    />
                  </div>
              )}

              {mode === "crop" && (
                  <div className="tools-field">
                    <label className="tools-field-label">{t.cropLabel}</label>
                    <div className="tools-grid-2">
                      <div className="tools-field-inline">
                        <span>{t.cropX}</span>
                        <input
                            type="number"
                            className="tools-field-control"
                            value={cropX}
                            onChange={(e) =>
                                setCropX(Number(e.target.value) || 0)
                            }
                        />
                      </div>
                      <div className="tools-field-inline">
                        <span>{t.cropY}</span>
                        <input
                            type="number"
                            className="tools-field-control"
                            value={cropY}
                            onChange={(e) =>
                                setCropY(Number(e.target.value) || 0)
                            }
                        />
                      </div>
                    </div>
                    <div className="tools-grid-2 tools-field-mt">
                      <div className="tools-field-inline">
                        <span>{t.cropW}</span>
                        <input
                            type="number"
                            className="tools-field-control"
                            value={cropW}
                            onChange={(e) =>
                                setCropW(Number(e.target.value) || 0)
                            }
                        />
                      </div>
                      <div className="tools-field-inline">
                        <span>{t.cropH}</span>
                        <input
                            type="number"
                            className="tools-field-control"
                            value={cropH}
                            onChange={(e) =>
                                setCropH(Number(e.target.value) || 0)
                            }
                        />
                      </div>
                    </div>
                  </div>
              )}

              {mode === "resize" && (
                  <div className="tools-field">
                    <label className="tools-field-label">{t.resizeLabel}</label>
                    <div className="tools-grid-2">
                      <div className="tools-field-inline">
                        <span>{t.resizeW}</span>
                        <input
                            type="number"
                            className="tools-field-control"
                            value={resizeW}
                            onChange={(e) =>
                                setResizeW(Number(e.target.value) || 0)
                            }
                        />
                      </div>
                      <div className="tools-field-inline">
                        <span>{t.resizeH}</span>
                        <input
                            type="number"
                            className="tools-field-control"
                            value={resizeH}
                            onChange={(e) =>
                                setResizeH(Number(e.target.value) || 0)
                            }
                        />
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* 操作按钮区 */}
            <div className="tools-actions">
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStart}
                  disabled={processing}
              >
                {processing ? t.helperProcessing : t.btnStart}
              </button>
              <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleClear}
              >
                {t.btnClear}
              </button>
              {showDownload && (
                  <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleDownload}
                      disabled={!downloadBlob}
                  >
                    {t.btnDownload}
                  </button>
              )}
              {showOcrTextArea && (
                  <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleCopyText}
                      disabled={!ocrText}
                  >
                    {copySuccess ? t.btnCopied : t.btnCopyText}
                  </button>
              )}
            </div>

            {/* 提示信息 */}
            {helper && (
                <div
                    className={
                        "tools-helper tools-helper-" +
                        (helperType === "error"
                            ? "error"
                            : helperType === "success"
                                ? "success"
                                : "info")
                    }
                >
                  {helper}
                </div>
            )}
          </section>

          {/* 右侧：预览 + OCR 文本 + 结果信息 */}
          <section className="tools-right">
            <div className="tools-preview-card">
              <div className="tools-preview-header">
                <h2>{t.previewTitle}</h2>
                <p className="tools-preview-sub">{modeInfo.desc}</p>
              </div>
              <div className="tools-preview-body">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="tools-preview-image"
                    />
                ) : (
                    <div className="tools-preview-empty">
                      {t.previewEmpty}
                    </div>
                )}
              </div>
            </div>

            {showOcrTextArea && (
                <div className="tools-result-card">
                  <div className="tools-result-header">
                    <h2>{t.ocrResultLabel}</h2>
                  </div>
                  <textarea
                      className="tools-result-textarea"
                      rows={10}
                      placeholder={t.ocrResultPlaceholder}
                      value={ocrText}
                      onChange={(e) => setOcrText(e.target.value)}
                  />
                </div>
            )}

            {(resultWidth && resultHeight) || showDownload ? (
                <div className="tools-meta-card">
                  <div className="tools-meta-header">
                    <h2>{t.metaInfoTitle}</h2>
                  </div>
                  <div className="tools-meta-body">
                    {resultWidth && resultHeight && (
                        <div className="tools-meta-row">
                          <span>{t.metaInfoSize}</span>
                          <span>
                      {t.metaInfoSizeValue
                          .replace("{w}", String(resultWidth))
                          .replace("{h}", String(resultHeight))}
                    </span>
                        </div>
                    )}
                    {showDownload && (
                        <div className="tools-meta-row">
                          <span>Download</span>
                          <span>{downloadName || "-"}</span>
                        </div>
                    )}
                  </div>
                </div>
            ) : null}
          </section>
        </div>
      </div>
  );
}