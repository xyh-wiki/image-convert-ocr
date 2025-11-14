package com.xyh.imageapp.controller;

import com.xyh.imageapp.service.ImageConvertService;
import com.xyh.imageapp.service.OcrSpaceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description:
 *  图片格式转换模块与 OCR 模块控制器：
 *  1. /api/image/convert：只做图片格式转换，返回 base64 等信息给前端下载
 *  2. /api/image/download：返回二进制文件流，浏览器直接下载
 *  3. /api/image/ocr：只做 OCR 文字识别，返回识别文本
 */
@Slf4j
@RestController
@RequestMapping("/api/image")
public class ImageController {

    /** 图片格式转换服务 */
    private final ImageConvertService convertService;
    /** OCR 识别服务 */
    private final OcrSpaceService ocrService;

    /**
     * 构造方法注入 Service
     *
     * @param convertService 图片格式转换服务
     * @param ocrService     OCR 识别服务
     */
    public ImageController(ImageConvertService convertService, OcrSpaceService ocrService) {
        this.convertService = convertService;
        this.ocrService = ocrService;
    }

    /**
     * 构造统一错误响应 JSON
     *
     * @param message 错误提示信息
     * @param status  HTTP 状态码
     * @return 带有 success=false 和 message 的 ResponseEntity
     */
    private ResponseEntity<Map<String, Object>> buildError(String message, int status) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    /**
     * 提取文件基础名（去掉扩展名）
     *
     * @param name 原始文件名
     * @return 去除扩展名的基础名，空时返回 output
     */
    private String baseName(String name) {
        if (name == null) {
            return "output";
        }
        int p = name.lastIndexOf('.');
        return p > 0 ? name.substring(0, p) : name;
    }

    /**
     * 根据目标格式推断 MIME 类型
     *
     * @param fmt 目标格式字符串
     * @return 对应的 Content-Type
     */
    private String guessContentType(String fmt) {
        switch (fmt.toLowerCase()) {
            case "png":
                return "image/png";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "webp":
                return "image/webp";
            case "tiff":
                return "image/tiff";
            case "bmp":
                return "image/bmp";
            case "gif":
                return "image/gif";
            case "psd":
                return "image/vnd.adobe.photoshop";
            default:
                return "application/octet-stream";
        }
    }

    // =========================================================
    // 1. 图片格式转换模块（只负责格式转换，不做 OCR）
    // =========================================================

    /**
     * 图片格式转换接口：
     *  - 入参：file + targetFormat
     *  - 返回：Base64 + 文件名 + Content-Type
     *
     * 对应前端：
     *   const data = await convertImage(form);
     *   if (data.base64 && data.filename) { ... }
     *
     * @param file         上传图片文件
     * @param targetFormat 目标格式（如：png、jpeg、webp 等）
     * @return JSON 结构，包含 success、filename、contentType、base64
     */
    @PostMapping("/convert")
    public ResponseEntity<Map<String, Object>> convert(
            @RequestPart("file") MultipartFile file,
            @RequestParam("targetFormat") String targetFormat) {

        // 1. 基本参数校验
        if (file == null || file.isEmpty()) {
            return buildError("File is empty", 400);
        }

        try {
            // 2. 调用 Service 进行格式转换（这里使用你实现好的完整逻辑）
            ImageConvertService.ImageConvertResult result = convertService.convert(file, targetFormat);

            // 注意：
            // - result.getTargetFormat() 是归一化后的格式（如 jpeg/jpg 都会统一为 jpg）
            // - result.getFilename() 已经是带正确后缀的文件名
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("filename", result.getFilename());
            resp.put("contentType", result.getContentType());
            resp.put("base64", result.getBase64());
            // 你也可以顺带把宽高回传给前端，后续想展示额外信息的话：
            resp.put("width", result.getWidth());
            resp.put("height", result.getHeight());
            resp.put("targetFormat", result.getTargetFormat());

            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            // 不支持的格式等参数错误，可以在 Service 内抛 IllegalArgumentException 或自定义异常
            log.warn("Convert illegal argument: {}", e.getMessage(), e);
            return buildError(e.getMessage(), 400);
        } catch (Exception e) {
            // 其他异常统一记录日志，返回 500
            log.error("Image convert error", e);
            return buildError("Internal convert error", 500);
        }
    }

    /**
     * 直接下载形式的格式转换接口（可选使用）
     *  - 和 /convert 的区别：
     *    /convert 返回 JSON + base64，前端自己触发下载
     *    /download 直接返回二进制流，浏览器会自动弹下载框
     *
     * @param file         上传图片文件
     * @param targetFormat 目标格式
     * @return 返回二进制文件数据，浏览器直接下载
     */
    @PostMapping("/download")
    public ResponseEntity<byte[]> download(
            @RequestPart("file") MultipartFile file,
            @RequestParam("targetFormat") String targetFormat) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // 使用同一个 Service，保证逻辑一致
            ImageConvertService.ImageConvertResult result = convertService.convert(file, targetFormat);

            // 统一使用 Service 生成的文件名与 Content-Type
            String filename = result.getFilename();
            String contentType = result.getContentType();

            // 按照 RFC 5987 对文件名进行 UTF-8 编码，防止中文名乱码
            String encoded = URLEncoder.encode(filename, String.valueOf(StandardCharsets.UTF_8));

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null
                            ? contentType
                            : guessContentType(result.getTargetFormat())))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename*=UTF-8''" + encoded)
                    .body(result.getBytes());
        } catch (Exception e) {
            log.error("Image download convert error", e);
            return ResponseEntity.status(500).build();
        }
    }

    // =========================================================
    // 2. OCR 文本识别模块（只做 OCR，不做格式转换）
    // =========================================================

    /**
     * OCR 接口：
     *  - 入参：file
     *  - 返回：识别出的 ocrText 文本
     *
     * 前端对应：
     *   const data = await ocrImage(form);
     *   if (data.ocrText) { ... }
     *
     * @param file 上传图片文件
     * @return JSON 结构，包含 success、ocrText
     */
    @PostMapping("/ocr")
    public ResponseEntity<Map<String, Object>> ocr(@RequestPart("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return buildError("File is empty", 400);
        }

        try {
            // 调用 OCR 服务
            String text = ocrService.ocrByFile(file);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("ocrText", text);
            return ResponseEntity.ok(resp);
        } catch (IllegalStateException e) {
            // 比如 OCR Space 未配置 API KEY，可以在 Service 中抛 IllegalStateException
            log.warn("OCR config error: {}", e.getMessage(), e);
            return buildError(e.getMessage(), 500);
        } catch (Exception e) {
            log.error("OCR error", e);
            return buildError("Internal OCR error", 500);
        }
    }
}