/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description:
 *  前端 API 封装模块：
 *   - 封装所有与图片相关的后端接口请求
 *   - 统一处理 HTTP 错误并抛出带详细信息的 Error，方便前端展示
 *
 *  注意：
 *   1. 这里只能写「纯 JS」，不能写 JSX（比如 <div>...</div>），否则 Vite 构建会报错。
 *   2. BASE_URL 支持通过 .env 配置，也可以在 HTML 中挂一个全局变量备用。
 */

// ===============================
// 1. 后端基础地址
// ===============================

// 优先读取 Vite 环境变量，其次读取 window.__IMAGE_APP_API__（可在 index.html 中注入），
// 最后兜底为你的线上网关地址。
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== "undefined" && window.__IMAGE_APP_API__) ||
    "https://ocr.api.xyh.wiki";

/**
 * 通用的 fetch 包装：
 *  - 仅负责 POST FormData 到指定 urlPath
 *  - 若返回非 2xx，会读取 body 文本并抛出 Error
 *
 * @param {string} urlPath 例如 '/api/image/convert'
 * @param {FormData} formData 表单数据，必须包含 file 等字段
 * @returns {Promise<object>} 成功则返回 JSON 对象
 */
async function postForm(urlPath, formData) {
  const resp = await fetch(`${BASE_URL}${urlPath}`, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    // 读取返回文本，方便上层提示更详细信息
    let text = "";
    try {
      text = await resp.text();
    } catch (e) {
      // ignore
    }
    // 抛出 Error，让调用方 try/catch 统一处理
    throw new Error(`HTTP ${resp.status}: ${text || "Request failed"}`);
  }

  // 正常情况返回 JSON
  return resp.json();
}

// ===============================
// 2. 具体业务接口封装
// ===============================

/**
 * 图片格式转换接口
 * 后端：POST /api/image/convert
 *
 * @param {FormData} formData 需要包含：
 *   - file: 图片文件
 *   - targetFormat: 目标格式（png/jpg/webp/gif/psd/bmp...）
 * @returns {Promise<object>} 后端返回 JSON，如：
 *   {
 *     success: true,
 *     filename: "xxx.png",
 *     contentType: "image/png",
 *     base64: "....",
 *     width: 1024,
 *     height: 768,
 *     targetFormat: "png"
 *   }
 */
export async function convertImage(formData) {
  return postForm("/api/image/convert", formData);
}

/**
 * OCR 文本识别接口
 * 后端：POST /api/image/ocr
 *
 * @param {FormData} formData 需要包含：
 *   - file: 图片文件
 * @returns {Promise<object>} 后端返回 JSON，如：
 *   {
 *     success: true,
 *     ocrText: "识别出来的文本..."
 *   }
 */
export async function ocrImage(formData) {
  return postForm("/api/image/ocr", formData);
}

/**
 * 图片压缩接口
 * 后端：POST /api/image/compress
 *
 * @param {FormData} formData 建议包含：
 *   - file: 图片文件（必传）
 *   - quality: 压缩质量，0-100，可选，后端做兜底
 * @returns {Promise<object>} 后端返回 JSON，格式和 convert 基本一致
 */
export async function compressImage(formData) {
  return postForm("/api/image/compress", formData);
}

/**
 * 图片裁剪接口
 * 后端：POST /api/image/crop
 *
 * @param {FormData} formData 建议包含：
 *   - file: 图片文件（必传）
 *   - x: 裁剪起点 X（像素）
 *   - y: 裁剪起点 Y（像素）
 *   - width: 裁剪宽度（像素）
 *   - height: 裁剪高度（像素）
 *  具体参数细节以后端实现为准，这里只负责转发。
 */
export async function cropImage(formData) {
  return postForm("/api/image/crop", formData);
}

/**
 * 调整尺寸接口
 * 后端：POST /api/image/resize
 *
 * @param {FormData} formData 建议包含：
 *   - file: 图片文件（必传）
 *   - width: 目标宽度（像素）
 *   - height: 目标高度（像素，可选，后端可按等比缩放）
 */
export async function resizeImage(formData) {
  return postForm("/api/image/resize", formData);
}