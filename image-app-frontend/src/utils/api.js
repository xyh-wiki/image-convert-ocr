/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 前端 API 封装模块 —— 支持图片格式转换与 OCR 独立接口
 */

// =============================
// 读取后端基础地址
// =============================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ocr.api.xyh.wiki";

// =============================
// 图片格式转换接口（/convert）
// =============================
/**
 * 调用后端图片格式转换接口
 * @param {FormData} formData 仅包含 file、targetFormat
 * @returns {Promise<object>}
 */
export async function convertImage(formData) {
  const resp = await fetch(`${BASE_URL}/api/image/convert`, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text || "Convert failed"}`);
  }

  return resp.json();
}

// =============================
// OCR 识别接口（/ocr）
// =============================
/**
 * 调用后端 OCR 识别接口
 * @param {FormData} formData 仅包含 file
 * @returns {Promise<object>}
 */
export async function ocrImage(formData) {
  const resp = await fetch(`${BASE_URL}/api/image/ocr`, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text || "OCR failed"}`);
  }

  return resp.json();
}