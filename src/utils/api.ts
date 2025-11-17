/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description:
 *   前端 TypeScript 版本，无需任何后端。
 *   - OCR 使用 OCRSpace 官方接口（K85220907888957）
 *   - 图片格式转换 / 压缩 / 裁剪 / 调整尺寸均使用浏览器 Canvas 完成
 *   - 同时兼容旧的 FormData 调用方式（ToolsPage.tsx 中仍使用 FormData）
 */

export interface ImageProcessResult {
  blob?: Blob;
  filename?: string;
  width?: number;
  height?: number;
  text?: string;
  [key: string]: any;
}

// ===========================
// 1. OCR.Space API 配置
// ===========================
const OCRSPACE_API_KEY = "K85220907888957";
const OCRSPACE_URL = "https://api.ocr.space/parse/image";

/**
 * OCR: 使用 OCRSpace 官方接口识别图片文字
 */
export async function ocrImageWithOcrSpace(file: File): Promise<ImageProcessResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("apikey", OCRSPACE_API_KEY);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");

  const resp = await fetch(OCRSPACE_URL, {
    method: "POST",
    body: formData,
  });

  const json = await resp.json().catch(() => null);

  if (!resp.ok || !json) {
    throw new Error("OCR request failed");
  }

  const parsedText: string =
    json?.ParsedResults?.map((p: any) => p.ParsedText || "").join("\n") || "";

  return { text: parsedText };
}

// ===========================
// 2. 纯前端图片处理工具（Canvas）
// ===========================

/**
 * 工具：将目标格式映射为 MIME 类型
 */
function getMimeByFormat(fmt: string): string {
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
  };
  return map[fmt.toLowerCase()] || "image/png";
}

/**
 * 工具：将 File 读取为 HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 工具：将 Image 绘制到 Canvas，并导出为 Blob
 */
async function renderToBlob(
  img: HTMLImageElement,
  opts: {
    mime?: string;
    quality?: number;
    width?: number;
    height?: number;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
  } = {}
): Promise<{ blob: Blob; width: number; height: number }> {
  const {
    mime = "image/png",
    quality = 0.92,
    width,
    height,
    sx,
    sy,
    sw,
    sh,
  } = opts;

  const targetW = width || img.width;
  const targetH = height || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  if (sx != null && sy != null && sw != null && sh != null) {
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
  } else {
    ctx.drawImage(img, 0, 0, targetW, targetH);
  }

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) return reject(new Error("Canvas toBlob returned null"));
        resolve(b);
      },
      mime,
      quality
    );
  });

  return { blob, width: targetW, height: targetH };
}

// ===========================
// 3. 对外导出方法（支持 File 与 FormData 两种调用）
// ===========================

/**
 * 图片格式转换
 * - File + targetFormat 直接调用
 * - FormData 中读取 file / targetFormat 字段（兼容 ToolsPage.tsx 老写法）
 */
export async function convertImage(
  fileOrForm: File | FormData,
  targetFormat?: string
): Promise<ImageProcessResult> {
  let file: File | null = null;
  let fmt: string = targetFormat || "png";

  if (fileOrForm instanceof File) {
    file = fileOrForm;
  } else {
    const maybeFile = fileOrForm.get("file");
    if (maybeFile instanceof File) {
      file = maybeFile;
    }
    const tf = fileOrForm.get("targetFormat");
    if (typeof tf === "string" && tf) {
      fmt = tf;
    }
  }

  if (!file) {
    throw new Error("No file provided for convertImage");
  }

  const img = await loadImage(file);
  const mime = getMimeByFormat(fmt);
  const { blob, width, height } = await renderToBlob(img, { mime });
  const filename = `converted.${fmt}`;
  return { blob, filename, width, height };
}

/**
 * 图片压缩：通过降低质量实现
 * - File + 百分比
 * - FormData 中读取 file / quality 字段
 */
export async function compressImage(
  fileOrForm: File | FormData,
  qualityPercent?: number
): Promise<ImageProcessResult> {
  let file: File | null = null;
  let qp: number = qualityPercent ?? 80;

  if (fileOrForm instanceof File) {
    file = fileOrForm;
  } else {
    const maybeFile = fileOrForm.get("file");
    if (maybeFile instanceof File) {
      file = maybeFile;
    }
    const qv = fileOrForm.get("quality");
    if (typeof qv === "string" && qv) {
      const n = Number(qv);
      if (!Number.isNaN(n)) {
        qp = n;
      }
    }
  }

  if (!file) {
    throw new Error("No file provided for compressImage");
  }

  const img = await loadImage(file);
  const quality = Math.min(100, Math.max(10, qp)) / 100;
  const { blob, width, height } = await renderToBlob(img, {
    mime: "image/jpeg",
    quality,
  });
  return { blob, filename: "compressed.jpg", width, height };
}

/**
 * 图片裁剪：指定起点与宽高
 * - File + x,y,w,h
 * - FormData: file + x,y,width,height
 */
export async function cropImage(
  fileOrForm: File | FormData,
  x?: number,
  y?: number,
  w?: number,
  h?: number
): Promise<ImageProcessResult> {
  let file: File | null = null;
  let _x = x ?? 0;
  let _y = y ?? 0;
  let _w = w ?? 0;
  let _h = h ?? 0;

  if (fileOrForm instanceof File) {
    file = fileOrForm;
  } else {
    const maybeFile = fileOrForm.get("file");
    if (maybeFile instanceof File) {
      file = maybeFile;
    }
    const gx = fileOrForm.get("x");
    const gy = fileOrForm.get("y");
    const gw = fileOrForm.get("width");
    const gh = fileOrForm.get("height");

    if (typeof gx === "string" && gx) _x = Number(gx) || 0;
    if (typeof gy === "string" && gy) _y = Number(gy) || 0;
    if (typeof gw === "string" && gw) _w = Number(gw) || 0;
    if (typeof gh === "string" && gh) _h = Number(gh) || 0;
  }

  if (!file) {
    throw new Error("No file provided for cropImage");
  }

  const img = await loadImage(file);
  const { blob, width, height } = await renderToBlob(img, {
    mime: "image/png",
    sx: _x,
    sy: _y,
    sw: _w,
    sh: _h,
    width: _w,
    height: _h,
  });
  return { blob, filename: "cropped.png", width, height };
}

/**
 * 图片缩放
 * - File + width,height
 * - FormData: file + width,height
 */
export async function resizeImage(
  fileOrForm: File | FormData,
  width?: number,
  height?: number
): Promise<ImageProcessResult> {
  let file: File | null = null;
  let w = width ?? 0;
  let h = height ?? 0;

  if (fileOrForm instanceof File) {
    file = fileOrForm;
  } else {
    const maybeFile = fileOrForm.get("file");
    if (maybeFile instanceof File) {
      file = maybeFile;
    }
    const gw = fileOrForm.get("width");
    const gh = fileOrForm.get("height");
    if (typeof gw === "string" && gw) w = Number(gw) || 0;
    if (typeof gh === "string" && gh) h = Number(gh) || 0;
  }

  if (!file) {
    throw new Error("No file provided for resizeImage");
  }

  const img = await loadImage(file);
  const { blob, width: w2, height: h2 } = await renderToBlob(img, {
    mime: "image/png",
    width: w || img.width,
    height: h || img.height,
  });
  return { blob, filename: "resized.png", width: w2, height: h2 };
}

/**
 * OCR 统一封装：
 * - 直接传 File
 * - 也兼容传入 FormData（从中读取 file 字段）
 */
export async function ocrImage(formDataOrFile: FormData | File): Promise<ImageProcessResult> {
  if (formDataOrFile instanceof File) {
    return ocrImageWithOcrSpace(formDataOrFile);
  }
  const file = formDataOrFile.get("file") as File | null;
  if (!file) {
    throw new Error("file not found in FormData");
  }
  return ocrImageWithOcrSpace(file);
}

/**
 * 兼容旧的 downloadConverted 调用：内部其实就是格式转换
 */
export async function downloadConverted(file: File, targetFormat: string): Promise<ImageProcessResult> {
  return convertImage(file, targetFormat);
}
