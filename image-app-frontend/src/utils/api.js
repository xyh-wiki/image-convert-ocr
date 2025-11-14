
/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 后端 API 封装模块，提供图片格式转换与 OCR 请求能力
 */

// 从环境变量中读取后端基础地址，默认指向部署域名
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ocr.api.xyh.wiki";

/**
 * 调用后端图片转换接口
 * @param {FormData} formData 包含 file、targetFormat、ocr 的表单数据
 * @returns {Promise<object>} 后端返回的 JSON 结果
 */
export async function convertImage(formData) {
  const resp = await fetch(`${BASE_URL}/api/image/convert`, {
    method: "POST",
    body: formData,
  });
  if (!resp.ok) {
    // 这里抛出错误，交给上层统一处理，便于在界面展示错误提示
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text || "Convert failed"}`);
  }
  return resp.json();
}
