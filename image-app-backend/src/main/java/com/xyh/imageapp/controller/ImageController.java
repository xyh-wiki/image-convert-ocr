package com.xyh.imageapp.controller;

import com.xyh.imageapp.service.ImageConvertService;
import com.xyh.imageapp.service.OcrSpaceService;
import com.xyh.imageapp.service.ImageEditService;
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
 *   图片工具控制器：格式转换、OCR、压缩、裁剪、调整尺寸
 */
@Slf4j
@RestController
@RequestMapping("/api/image")
public class ImageController {

    /** 图片格式转换服务 */
    private final ImageConvertService convertService;
    /** OCR 识别服务 */
    private final OcrSpaceService ocrService;
    /** 图片编辑服务（压缩 / 裁剪 / 调整尺寸等） */
    private final ImageEditService editService;

    public ImageController(
            ImageConvertService convertService,
            OcrSpaceService ocrService,
            ImageEditService editService) {
        this.convertService = convertService;
        this.ocrService = ocrService;
        this.editService = editService;
    }

    // =========================================================
    // 工具方法
    // =========================================================

    /**
     * 构造统一错误响应 JSON
     */
    private ResponseEntity<Map<String, Object>> buildError(String message, int status) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", false);
        map.put("message", message);
        return ResponseEntity.status(status).body(map);
    }

    /**
     * 文件名 UTF-8 编码（防止中文名下载乱码）
     */
    private String encodeName(String name) {
        try {
            return URLEncoder.encode(name, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            return name;
        }
    }

    // =========================================================
    // 1. 图片格式转换
    // =========================================================

    @PostMapping("/convert")
    public ResponseEntity<Map<String, Object>> convert(
            @RequestPart("file") MultipartFile file,
            @RequestParam("targetFormat") String targetFormat) {

        if (file == null || file.isEmpty()) {
            return buildError("File is empty", 400);
        }

        try {
            ImageConvertService.ImageConvertResult result =
                    convertService.convert(file, targetFormat);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("filename", result.getFilename());
            resp.put("contentType", result.getContentType());
            resp.put("base64", result.getBase64());
            resp.put("width", result.getWidth());
            resp.put("height", result.getHeight());
            resp.put("targetFormat", result.getTargetFormat());

            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            log.warn("Invalid convert argument: {}", e.getMessage());
            return buildError(e.getMessage(), 400);
        } catch (Exception e) {
            log.error("Convert error", e);
            return buildError("Internal convert error", 500);
        }
    }

    /**
     * 直接下载版本（浏览器弹下载框）
     */
    @PostMapping("/download")
    public ResponseEntity<byte[]> download(
            @RequestPart("file") MultipartFile file,
            @RequestParam("targetFormat") String targetFormat) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            ImageConvertService.ImageConvertResult result =
                    convertService.convert(file, targetFormat);

            String encoded = encodeName(result.getFilename());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(result.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename*=UTF-8''" + encoded)
                    .body(result.getBytes());

        } catch (Exception e) {
            log.error("Download convert error", e);
            return ResponseEntity.status(500).build();
        }
    }

    // =========================================================
    // 2. OCR 识别
    // =========================================================

    @PostMapping("/ocr")
    public ResponseEntity<Map<String, Object>> ocr(
            @RequestPart("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return buildError("File is empty", 400);
        }

        try {
            String text = ocrService.ocrByFile(file);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("ocrText", text);

            return ResponseEntity.ok(resp);

        } catch (IllegalStateException e) {
            // 比如 OCR 未配置 API KEY
            return buildError(e.getMessage(), 500);
        } catch (Exception e) {
            log.error("OCR failed", e);
            return buildError("Internal OCR error", 500);
        }
    }

    // =========================================================
    // 3. 图片压缩（quality = 0.1~1.0）
    // =========================================================

    @PostMapping("/compress")
    public ResponseEntity<Map<String, Object>> compress(
            @RequestPart("file") MultipartFile file,
            @RequestParam("quality") Double quality) {

        if (file == null || file.isEmpty()) {
            return buildError("File is empty", 400);
        }
        if (quality == null || quality <= 0 || quality > 1) {
            return buildError("Quality must be between 0 and 1", 400);
        }

        try {
            // ⭐ 这里改成用 EditResult，而不是 byte[]
            ImageEditService.EditResult result = editService.compress(file, quality);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("filename", result.getFilename());
            resp.put("contentType", result.getContentType());
            resp.put("base64", java.util.Base64.getEncoder().encodeToString(result.getBytes()));
            if (result.getWidth() != null) {
                resp.put("width", result.getWidth());
            }
            if (result.getHeight() != null) {
                resp.put("height", result.getHeight());
            }

            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            log.warn("Compress illegal argument: {}", e.getMessage());
            return buildError(e.getMessage(), 400);
        } catch (Exception e) {
            log.error("Compress failed", e);
            return buildError("Compress failed: " + e.getMessage(), 500);
        }
    }

    // =========================================================
    // 4. 裁剪（crop）
    // =========================================================

    @PostMapping("/crop")
    public ResponseEntity<Map<String, Object>> crop(
            @RequestPart("file") MultipartFile file,
            @RequestParam int x,
            @RequestParam int y,
            @RequestParam int width,
            @RequestParam int height) {

        if (file == null || file.isEmpty()) {
            return buildError("File is empty", 400);
        }
        if (width <= 0 || height <= 0) {
            return buildError("Invalid crop size", 400);
        }

        try {
            // ⭐ 这里也改成 EditResult
            ImageEditService.EditResult result = editService.crop(file, x, y, width, height);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("filename", result.getFilename());
            resp.put("contentType", result.getContentType());
            resp.put("base64", java.util.Base64.getEncoder().encodeToString(result.getBytes()));
            if (result.getWidth() != null) {
                resp.put("width", result.getWidth());
            }
            if (result.getHeight() != null) {
                resp.put("height", result.getHeight());
            }

            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            log.warn("Crop illegal argument: {}", e.getMessage());
            return buildError(e.getMessage(), 400);
        } catch (Exception e) {
            log.error("Crop failed", e);
            return buildError("Crop failed: " + e.getMessage(), 500);
        }
    }

    // =========================================================
    // 5. 调整尺寸（resize）
    // =========================================================

    @PostMapping("/resize")
    public ResponseEntity<Map<String, Object>> resize(
            @RequestPart("file") MultipartFile file,
            @RequestParam Integer width,
            @RequestParam Integer height) {

        if (file == null || file.isEmpty()) {
            return buildError("File is empty", 400);
        }
        if (width == null || height == null || width <= 0 || height <= 0) {
            return buildError("Width/height must be > 0", 400);
        }

        try {
            // ❌ 原来这里写的是：byte[] result = editService.resize(...)
            // ✅ 改成使用 EditResult
            ImageEditService.EditResult result = editService.resize(file, width, height);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("filename", result.getFilename());
            resp.put("contentType", result.getContentType());
            resp.put("base64", java.util.Base64.getEncoder().encodeToString(result.getBytes()));
            if (result.getWidth() != null) {
                resp.put("width", result.getWidth());
            } else {
                resp.put("width", width);
            }
            if (result.getHeight() != null) {
                resp.put("height", result.getHeight());
            } else {
                resp.put("height", height);
            }

            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            log.warn("Resize illegal argument: {}", e.getMessage());
            return buildError(e.getMessage(), 400);
        } catch (Exception e) {
            log.error("Resize failed", e);
            return buildError("Resize failed: " + e.getMessage(), 500);
        }
    }
}