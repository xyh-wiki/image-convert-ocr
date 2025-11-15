/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description: 图片工具平台前端 —— 支持格式转换 / OCR / 压缩 / 裁剪 / 调整尺寸，单画布大模块布局
 */

import React, {useState, useEffect} from "react";
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
        // ★ 调整为通用“处理完成”说明，避免误导为自动下载
        helperSuccess: "Completed.",
        helperErrorPrefix: "Error: ",

        // OCR
        helperOcring: "Running OCR…",
        helperOcrSuccess: "OCR completed.",

        footerText: "All tasks run on server. Please avoid sensitive images.",

        // 新增提示文案（仅在代码内使用，并不改变布局）
        helperConvertSuccessWithLink:
            "Conversion finished. Click the download link below to save the file.",
        ocrResultLabel: "OCR Result",
        ocrResultPlaceholder: "Recognized text will appear here…",
        downloadLinkText: "Click here to download the converted image",
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
        // ★ 调整为通用“处理完成”
        helperSuccess: "处理完成。",
        helperErrorPrefix: "错误：",

        helperOcring: "正在执行 OCR 识别…",
        helperOcrSuccess: "OCR 完成，已生成文本结果。",

        footerText: "所有处理均在服务器端完成，请勿上传敏感或涉密图片。",

        helperConvertSuccessWithLink: "格式转换完成，请点击下方的下载链接进行下载。",
        ocrResultLabel: "OCR 识别结果",
        ocrResultPlaceholder: "识别后的文本将显示在这里，可直接复制使用…",
        downloadLinkText: "点击这里下载转换后的图片",
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

    // ========== 新增：转换结果信息（用于生成下载链接） ==========
    /**
     * convertedInfo:
     * {
     *   base64: 后端返回的 base64 字符串,
     *   filename: 建议下载文件名,
     *   contentType: MIME 类型
     * }
     */
    const [convertedInfo, setConvertedInfo] = useState(null);

    // ========== 新增：OCR 识别结果文本 ==========
    const [ocrText, setOcrText] = useState("");

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

        // 新文件时重置上一轮结果
        setConvertedInfo(null);
        setOcrText("");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (!f) return;
        setFile(f);
        const url = URL.createObjectURL(f);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(url);

        // 新文件时重置上一轮结果
        setConvertedInfo(null);
        setOcrText("");
    };

    // ========== 主处理入口 ==========
    /**
     * 统一“开始处理”入口：
     * 1. 各模式仍然共用一个按钮，但内部根据 mode 分支调用不同 API；
     * 2. 格式转换模式：只保存 base64 结果 + 显示下载链接，不再自动下载；
     * 3. OCR 模式：保存识别文本到 ocrText 状态，在页面中展示；
     * 4. 压缩 / 裁剪 / 调整尺寸：在前端做参数校验，避免非法参数导致后端 500。
     */
    const handleStart = async () => {
        if (!file) {
            showHelper(t.helperNoFile, "error");
            return;
        }

        // 每次处理前清空上一轮的转换结果 / OCR 文本
        setConvertedInfo(null);
        setOcrText("");

        const form = new FormData();
        form.append("file", file);

        try {
            setLoading(true);
            let data = null;

            switch (mode) {
                case "convert": {
                    // ========== 1. 格式转换：只生成下载链接，不自动下载 ==========
                    form.append("targetFormat", targetFormat);
                    showHelper(t.helperConverting);

                    data = await convertImage(form);
                    // 预期后端返回：base64 / filename / contentType / width / height 等
                    if (data && data.base64) {
                        const info = {
                            base64: data.base64,
                            filename:
                                data.filename || `converted.${targetFormat || "png"}`,
                            contentType: data.contentType || "image/*",
                        };
                        setConvertedInfo(info);
                        showHelper(t.helperConvertSuccessWithLink, "success");
                    } else {
                        showHelper(
                            t.helperErrorPrefix +
                            "No base64 data returned from server.",
                            "error"
                        );
                    }
                    break;
                }

                case "ocr": {
                    // ========== 2. OCR 模式：展示识别结果 ==========
                    showHelper(t.helperOcring);
                    data = await ocrImage(form);
                    // 尽量兼容多种后端字段命名
                    const text =
                        (data && (data.text || data.ocrText || data.raw)) || "";
                    setOcrText(text);
                    showHelper(t.helperOcrSuccess, "success");
                    break;
                }

                case "compress": {
                    // ========== 3. 压缩模式：传递质量参数（百分比） ==========
                    // 这里仍传 20-100 的百分比，后端已支持 >1 自动除以 100，无需前端自己换算
                    form.append("quality", compressPct);
                    showHelper(t.helperConverting);
                    data = await compressImage(form);
                    // 当前布局中没有预览/下载压缩结果，只提示成功即可
                    showHelper(t.helperSuccess, "success");
                    break;
                }

                case "crop": {
                    // ========== 4. 裁剪模式：前端先做参数校验 ==========
                    // 将输入的字符串强制转为数字，避免空串 / 非数字直接传给后端
                    const x = Number(cropX) || 0;
                    const y = Number(cropY) || 0;
                    const w = Number(cropW) || 0;
                    const h = Number(cropH) || 0;

                    if (w <= 0 || h <= 0) {
                        showHelper(
                            (lang === "zh"
                                ? "裁剪宽度和高度必须大于 0。"
                                : "Width and height for cropping must be greater than 0.") +
                            "",
                            "error"
                        );
                        return;
                    }

                    form.append("x", String(x));
                    form.append("y", String(y));
                    form.append("width", String(w));
                    form.append("height", String(h));

                    showHelper(t.helperConverting);
                    data = await cropImage(form);
                    // 当前布局中没有单独展示裁剪后预览，仅提示成功
                    showHelper(t.helperSuccess, "success");
                    break;
                }

                case "resize": {
                    // ========== 5. 调整尺寸模式：至少有一个>0，避免都为空 ==========
                    const w = Number(resizeW) || 0;
                    const h = Number(resizeH) || 0;

                    if (w <= 0 && h <= 0) {
                        showHelper(
                            lang === "zh"
                                ? "宽度和高度不能同时为空或小于等于 0。"
                                : "Width and height cannot both be empty or <= 0.",
                            "error"
                        );
                        return;
                    }

                    if (w > 0) {
                        form.append("width", String(w));
                    }
                    if (h > 0) {
                        form.append("height", String(h));
                    }

                    showHelper(t.helperConverting);
                    data = await resizeImage(form);
                    // 同样仅提示成功
                    showHelper(t.helperSuccess, "success");
                    break;
                }

                default:
                    break;
            }
        } catch (e) {
            showHelper(
                t.helperErrorPrefix + (e?.message || "Unknown error"),
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // 当前模式的标题和描述（用于主画布顶部）
    const modeInfo = {
        convert: {title: t.convertTab, desc: t.convertDesc},
        ocr: {title: t.ocrTab, desc: t.ocrDesc},
        compress: {title: t.compressTab, desc: t.compressDesc},
        crop: {title: t.cropTab, desc: t.cropDesc},
        resize: {title: t.resizeTab, desc: t.resizeDesc},
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
                            className={
                                lang === "en" ? "lang-btn lang-btn-active" : "lang-btn"
                            }
                            onClick={() => setLang("en")}
                        >
                            EN
                        </button>
                        <button
                            className={
                                lang === "zh" ? "lang-btn lang-btn-active" : "lang-btn"
                            }
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

                    {/* 五个大功能模块按钮：横向功能带，只保留图标 + 标题 */}
                    <div className="mode-tabs">
                        <button
                            className={mode === "convert" ? "tab tab-active" : "tab"}
                            onClick={() => updateUrl("convert")}
                        >
                            <strong>🔄 {t.convertTab}</strong>
                            <span>{t.convertDesc}</span>
                        </button>

                        <button
                            className={mode === "ocr" ? "tab tab-active" : "tab"}
                            onClick={() => updateUrl("ocr")}
                        >
                            <strong>🔍 {t.ocrTab}</strong>
                            <span>{t.ocrDesc}</span>
                        </button>

                        <button
                            className={mode === "compress" ? "tab tab-active" : "tab"}
                            onClick={() => updateUrl("compress")}
                        >
                            <strong>📦 {t.compressTab}</strong>
                            <span>{t.compressDesc}</span>
                        </button>

                        <button
                            className={mode === "crop" ? "tab tab-active" : "tab"}
                            onClick={() => updateUrl("crop")}
                        >
                            <strong>✂️ {t.cropTab}</strong>
                            <span>{t.cropDesc}</span>
                        </button>

                        <button
                            className={mode === "resize" ? "tab tab-active" : "tab"}
                            onClick={() => updateUrl("resize")}
                        >
                            <strong>📐 {t.resizeTab}</strong>
                            <span>{t.resizeDesc}</span>
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
                        <div style={{flex: 1}}>
                            <div className="upload-text-main">{t.uploadMain}</div>
                            <div className="upload-text-sub">{t.uploadSub}</div>
                        </div>
                        <div className="upload-meta">{t.uploadMeta}</div>
                        <input type="file" accept="image/*" onChange={handleFileChange}/>
                    </label>

                    {/* 预览区域 */}
                    {previewUrl && (
                        <div className="preview-wrapper">
                            <div className="preview-label">{file?.name}</div>
                            <img src={previewUrl} className="preview-image" alt="preview"/>
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

                    {/* OCR 模式下的文本结果展示区域（新增，不影响整体布局结构） */}
                    {mode === "ocr" && (
                        <div className="form-row column">
                            {/* OCR 结果标题 */}
                            <div className="preview-label">{t.ocrResultLabel}</div>

                            {/*
      外层包一层容器，方便单独控制 OCR 区域的最大宽度、内边距和与上下内容的间距，
      不会影响整体布局，只是避免发光边太“抢眼”遮挡下方内容。
    */}
                            <div className="ocr-result-wrapper">
      <textarea
          className="ocr-result-textarea"  {/* 使用单独样式，避免复用 input 的椭圆发光效果 */}
          rows={10}
          readOnly
          value={ocrText}
          placeholder={t.ocrResultPlaceholder}
      />
                            </div>
                        </div>
                    )}

                    {/* 格式转换模式下的下载链接展示区域（新增，不自动下载） */}
                    {mode === "convert" && convertedInfo && convertedInfo.base64 && (
                        <div className="form-row">
                            <div className="preview-label">
                                <a
                                    href={`data:${convertedInfo.contentType};base64,${convertedInfo.base64}`}
                                    download={convertedInfo.filename}
                                >
                                    {t.downloadLinkText}
                                </a>
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
                                setConvertedInfo(null);
                                setOcrText("");
                            }}
                        >
                            {t.btnClear}
                        </button>
                    </div>
                </section>

                {/* 底部广告与说明区域 */}
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
                                style={{display: "block"}}
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