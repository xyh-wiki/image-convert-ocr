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
 *  - 若返回非 2xx，会尽量解析返回内容（JSON 或文本），并抛出带 message 的 Error
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

  const text = await resp.text().catch(() => "");

  // 非 2xx，统一抛错，尽量带上后端返回的 message
  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    if (text) {
      try {
        const json = JSON.parse(text);
        // 优先使用后端约定的 message 字段
        if (json && typeof json.message === "string") {
          msg = `HTTP ${resp.status}: ${json.message}`;
        } else {
          msg = `HTTP ${resp.status}: ${text}`;
        }
      } catch (e) {
        // 非 JSON，则直接展示文本
        msg = `HTTP ${resp.status}: ${text}`;
      }
    }
    throw new Error(msg);
  }

  // 2xx 情况下，正常解析 JSON；若解析失败，则返回一个简单对象
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    // 极端情况下后端没返回 JSON，这里兜底成一个对象，避免前端直接崩溃
    return { raw: text };
  }
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
 * @returns {Promise<object>} 后端返回 JSON，如（实际以后端为准）：
 *   {
 *     success: true,
 *     text: "识别出来的文本...",   // ★ 当前后端实现使用 text 字段
 *     raw: "{...原始JSON...}",
 *     language: "chs"
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
 *   - quality: 压缩质量（前端传 20-100 的整数即可）：
 *       - 后端已兼容 0-1 和 1-100 两种形式：
 *         >1 会自动除以 100 转为 0-1，因此前端可以直接传 20-100 的百分比数值
 * @returns {Promise<object>} 后端返回 JSON，格式和 convert 基本一致：
 *   {
 *     success: true,
 *     base64: "....",
 *     contentType: "image/jpeg",
 *     width: 800,
 *     height: 600
 *   }
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
 *   - x: 裁剪起点 X（像素，前端已在 App 中做了 Number 转换）
 *   - y: 裁剪起点 Y（像素）
 *   - width: 裁剪宽度（像素，大于 0）
 *   - height: 裁剪高度（像素，大于 0）
 *  具体参数细节以后端实现为准，这里只负责转发。
 *  后端在参数非法时会返回 400 + message，postForm 会自动包装为 Error。
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
 *   - width: 目标宽度（像素，可选）
 *   - height: 目标高度（像素，可选）
 *   规则：
 *     1）width 和 height 不能同时为空（前端已在 App 中校验）；
 *     2）只传一个时，后端按等比缩放计算另一个值；
 *     3）两个都传时，后端直接缩放到指定宽高。
 */
export async function resizeImage(formData) {
  return postForm("/api/image/resize", formData);
}