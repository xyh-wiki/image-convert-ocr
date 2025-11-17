/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description:
 *   🚀 前端纯 JS 版本，无需任何后端。
 *   - OCR 使用 OCRSpace 官方接口（需 API KEY）
 *   - 图片格式转换 / 压缩 / 裁剪 / 调整尺寸均使用浏览器 Canvas 完成
 *   - 兼容 ToolsPage.jsx 的现有前端逻辑
 */

// ===========================
// 1. OCR.Space API 配置
// ===========================
const OCRSPACE_API_KEY = "K85220907888957";
const OCRSPACE_URL = "https://api.ocr.space/parse/image";

// 用于鉴别 MIME Type
function getMimeByFormat(fmt) {
  const map = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
  };
  return map[fmt.toLowerCase()] || "image/png";
}

// 读取图片为 HTMLImageElement
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// 将图片绘制到 Canvas，返回 Blob
async function renderToBlob(img, opts = {}) {
  const { mime = "image/png", quality = 0.92, width, height, sx, sy, sw, sh } = opts;

  const canvas = document.createElement("canvas");

  canvas.width = width || img.width;
  canvas.height = height || img.height;

  const ctx = canvas.getContext("2d");

  if (sx !== undefined) {
    // 裁剪
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
        (blob) => resolve(blob),
        mime,
        quality
    );
  });
}

// ===========================
// 2. OCR 识别（OCRSPACE）
// ===========================
export async function ocrImage(formData) {
  const file = formData.get("file");
  if (!file) throw new Error("No file uploaded");

  const apiForm = new FormData();
  apiForm.append("apikey", OCRSPACE_API_KEY);
  apiForm.append("language", "eng");
  apiForm.append("file", file);

  const resp = await fetch(OCRSPACE_URL, {
    method: "POST",
    body: apiForm,
  });

  const json = await resp.json();

  const parsed = json?.ParsedResults?.[0]?.ParsedText || "";

  return {
    success: true,
    text: parsed,
    raw: json,
  };
}

// ===========================
// 3. 图片格式转换（前端 Canvas）
// ===========================
export async function convertImage(formData) {
  const file = formData.get("file");
  const targetFormat = formData.get("targetFormat") || "png";

  const img = await loadImage(file);

  const mime = getMimeByFormat(targetFormat);

  const blob = await renderToBlob(img, { mime });

  return {
    success: true,
    filename: `converted.${targetFormat}`,
    contentType: mime,
    blob,
    width: img.width,
    height: img.height,
  };
}

// ===========================
// 4. 压缩图片（Canvas）
// ===========================
export async function compressImage(formData) {
  const file = formData.get("file");
  const quality = (parseInt(formData.get("quality") || "80", 10) / 100);

  const img = await loadImage(file);

  const blob = await renderToBlob(img, {
    mime: "image/jpeg",
    quality,
  });

  return {
    success: true,
    contentType: "image/jpeg",
    blob,
    width: img.width,
    height: img.height,
  };
}

// ===========================
// 5. 裁剪图片
// ===========================
export async function cropImage(formData) {
  const file = formData.get("file");

  const x = Number(formData.get("x"));
  const y = Number(formData.get("y"));
  const w = Number(formData.get("width"));
  const h = Number(formData.get("height"));

  const img = await loadImage(file);

  const blob = await renderToBlob(img, {
    mime: "image/png",
    sx: x,
    sy: y,
    sw: w,
    sh: h,
    width: w,
    height: h,
  });

  return {
    success: true,
    blob,
    width: w,
    height: h,
  };
}

// ===========================
// 6. 调整尺寸
// ===========================
export async function resizeImage(formData) {
  const file = formData.get("file");

  const width = Number(formData.get("width"));
  const height = Number(formData.get("height"));

  const img = await loadImage(file);

  const blob = await renderToBlob(img, {
    mime: "image/png",
    width: width || undefined,
    height: height || undefined,
  });

  return {
    success: true,
    blob,
    width: width || img.width,
    height: height || img.height,
  };
}

// ===========================
// 7. 下载图片（前端 Blob）
// ===========================
export async function downloadConverted(formData) {
  const file = formData.get("file");
  const targetFormat = formData.get("targetFormat") || "png";

  const conv = await convertImage(formData);
  return conv.blob;
}