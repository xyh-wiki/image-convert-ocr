/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description: 前端接口封装工具，统一与后端进行交互
 */

// 优先从环境变量读取接口地址
const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    (window.__OCR_API_BASE__ ? window.__OCR_API_BASE__ : "");

/**
 * 通用 POST 表单请求
 * @param {string} path 接口路径，如 /api/image/convert
 * @param {FormData} formData 表单数据
 * @param {Object} options 其他选项（如返回类型）
 * @returns {Promise<any>}
 */
async function postForm(path, formData, options = {}) {
  const resp = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });

  // 如果需要 Blob（例如下载）
  if (options.responseType === "blob") {
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${text}`);
    }
    return await resp.blob();
  }

  const text = await resp.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(`响应解析失败: ${e.message}, 原始响应: ${text}`);
  }

  if (!resp.ok || data.success === false) {
    const msg =
        (data && data.message) ||
        `HTTP ${resp.status}: ${text || "Unknown error"}`;
    throw new Error(msg);
  }

  return data;
}

/**
 * 图片格式转换
 */
export function convertImage(formData) {
  return postForm("/api/image/convert", formData);
}

/**
 * 下载已转换的图片（点击下载按钮时调用）
 */
export function downloadConverted(formData) {
  return postForm("/api/image/download", formData, { responseType: "blob" });
}

/**
 * OCR 识别
 */
export function ocrImage(formData) {
  return postForm("/api/image/ocr", formData);
}

/**
 * 图片压缩
 * 这里特别注意：前端如果 UI 上使用 1-100 的滑块，需要转换为 0-1 或在参数中标记
 * 为了兼容后端，统一在这里将 1-100 转为 0-1
 */
export function compressImage(formData, rawQuality) {
  // rawQuality 为前端的原始值（1-100），如果传了，就覆盖 formData 中的 quality
  if (typeof rawQuality === "number") {
    let q = rawQuality;
    // 转换为 0-1 的小数
    if (q > 1) {
      q = q / 100.0;
    }
    formData.set("quality", String(q));
  }
  return postForm("/api/image/compress", formData);
}

/**
 * 图片裁剪
 */
export function cropImage(formData) {
  return postForm("/api/image/crop", formData);
}

/**
 * 图片尺寸调整
 */
export function resizeImage(formData) {
  return postForm("/api/image/resize", formData);
}