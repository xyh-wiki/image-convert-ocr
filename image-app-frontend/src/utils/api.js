/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 后端 API 封装模块：格式转换 / OCR / 压缩 / 裁剪 / 调整尺寸
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ocr.api.xyh.wiki";

/** 通用请求函数 */
async function fetchPost(url, formData) {
  const resp = await fetch(url, { method: "POST", body: formData });
  const text = await resp.text();
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${text}`);
  return JSON.parse(text);
}

/** 格式转换 */
export function convertImage(form) {
  return fetchPost(`${BASE_URL}/api/image/convert`, form);
}

/** OCR */
export function ocrImage(form) {
  return fetchPost(`${BASE_URL}/api/image/ocr`, form);
}

/** 图片压缩 */
export function compressImage(form) {
  return fetchPost(`${BASE_URL}/api/image/compress`, form);
}

/** 图片裁剪 */
export function cropImage(form) {
  return fetchPost(`${BASE_URL}/api/image/crop`, form);
}

/** 调整尺寸 */
export function resizeImage(form) {
  return fetchPost(`${BASE_URL}/api/image/resize`, form);
}