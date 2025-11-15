package com.xyh.imageapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xyh.imageapp.service.ImageConvertService;
import com.xyh.imageapp.service.ImageEditService;
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
 * @Date:2025-11-15
 * @Description: 图片格式转换 + OCR + 编辑接口控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/image")
public class ImageController {

    private final ImageConvertService imageConvertService;
    private final OcrSpaceService ocrSpaceService;
    private final ImageEditService imageEditService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ImageController(ImageConvertService imageConvertService,
                           OcrSpaceService ocrSpaceService,
                           ImageEditService imageEditService) {
        this.imageConvertService = imageConvertService;
        this.ocrSpaceService = ocrSpaceService;
        this.imageEditService = imageEditService;
    }

    /**
     * 图片格式转换（仅返回 JSON 结果，不直接下载）
     *
     * @param file         上传文件
     * @param targetFormat 目标格式
     * @return JSON，包含 base64、宽高、文件名等
     */
    @PostMapping("/convert")
    public Map<String, Object> convert(@RequestPart("file") MultipartFile file,
                                       @RequestParam("targetFormat") String targetFormat) {
        Map<String, Object> resp = new HashMap<>();
        try {
            ImageConvertService.ImageConvertResult result = imageConvertService.convert(file, targetFormat);
            resp.put("success", true);
            resp.put("filename", result.getFilename());
            resp.put("contentType", result.getContentType());
            resp.put("base64", result.getBase64());
            resp.put("width", result.getWidth());
            resp.put("height", result.getHeight());
            resp.put("targetFormat", result.getTargetFormat());
        } catch (Exception e) {
            log.error("图片格式转换失败", e);
            return buildError("图片格式转换失败：" + e.getMessage(), 500);
        }
        return resp;
    }

    /**
     * 图片格式转换并下载（前端点击“下载”按钮时调用）
     *
     * @param file         上传文件
     * @param targetFormat 目标格式
     * @return ResponseEntity<byte[]>
     */
    @PostMapping("/download")
    public ResponseEntity<byte[]> download(@RequestPart("file") MultipartFile file,
                                           @RequestParam("targetFormat") String targetFormat) {
        try {
            ImageConvertService.ImageConvertResult result = imageConvertService.convert(file, targetFormat);
            String downloadName = guessDownloadName(result.getFilename(), result.getTargetFormat());

            String encodedName = URLEncoder.encode(downloadName, StandardCharsets.UTF_8.name())
                    .replaceAll("\\+", "%20");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(result.getContentType()));
            // 下载附件
            headers.setContentDispositionFormData("attachment", encodedName);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(result.getBytes());
        } catch (Exception e) {
            log.error("下载转换后的图片失败", e);
            // 这里返回一个简单的错误文本，前端可以根据 HTTP 状态处理
            return ResponseEntity.status(500)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("下载失败：" + e.getMessage()).getBytes(StandardCharsets.UTF_8));
        }
    }

    /**
     * OCR 识别接口
     *
     * 说明：
     * 1. 不再依赖 OcrSpaceService.OcrResult 内部类，避免 “无法解析符号 OcrResult” 的编译错误；
     * 2. 统一将 doOcr 的返回结果作为 text/raw 返回给前端，前端可以直接展示；
     * 3. 如果后续你给我看 OcrSpaceService 的具体实现，我们再针对性做结构化解析。
     *
     * @param file     上传图片文件
     * @param language 识别语言，可选
     * @return JSON 包含识别结果文本
     */
    @PostMapping("/ocr")
    public Map<String, Object> ocr(@RequestPart("file") MultipartFile file,
                                   @RequestParam(value = "language", required = false) String language) {
        Map<String, Object> resp = new HashMap<>();
        try {
            // 新版 OcrSpaceService.doOcr 返回 String 纯文本
            String result = ocrSpaceService.doOcr(file, language);

            resp.put("success", true);
            resp.put("text", result);  // 前端 App.jsx 用 data.text 展示
            resp.put("raw", result);
            resp.put("language", language);
        } catch (Exception e) {
            log.error("OCR 识别失败", e);
            return buildError("OCR 识别失败：" + e.getMessage(), 500);
        }
        return resp;
    }

    /**
     * 图片压缩接口
     *
     * @param file    上传图片
     * @param quality 压缩质量，可以传 0-1 或 1-100
     * @return JSON 包含 base64 及尺寸等
     */
    @PostMapping("/compress")
    public Map<String, Object> compress(@RequestPart("file") MultipartFile file,
                                        @RequestParam(value = "quality", required = false) Float quality) {
        Map<String, Object> resp = new HashMap<>();
        try {
            ImageEditService.EditResult result = imageEditService.compress(file, quality);
            resp.put("success", true);
            resp.put("contentType", result.getContentType());
            resp.put("width", result.getWidth());
            resp.put("height", result.getHeight());
            resp.put("base64", java.util.Base64.getEncoder().encodeToString(result.getBytes()));
        } catch (IllegalArgumentException iae) {
            log.warn("图片压缩参数错误: {}", iae.getMessage());
            return buildError(iae.getMessage(), 400);
        } catch (Exception e) {
            log.error("图片压缩失败", e);
            return buildError("图片压缩失败：" + e.getMessage(), 500);
        }
        return resp;
    }

    /**
     * 图片裁剪接口
     */
    @PostMapping("/crop")
    public Map<String, Object> crop(@RequestPart("file") MultipartFile file,
                                    @RequestParam("x") Integer x,
                                    @RequestParam("y") Integer y,
                                    @RequestParam("width") Integer width,
                                    @RequestParam("height") Integer height) {
        Map<String, Object> resp = new HashMap<>();
        try {
            ImageEditService.EditResult result = imageEditService.crop(file, x, y, width, height);
            resp.put("success", true);
            resp.put("contentType", result.getContentType());
            resp.put("width", result.getWidth());
            resp.put("height", result.getHeight());
            resp.put("base64", java.util.Base64.getEncoder().encodeToString(result.getBytes()));
        } catch (IllegalArgumentException iae) {
            log.warn("图片裁剪参数错误: {}", iae.getMessage());
            return buildError(iae.getMessage(), 400);
        } catch (Exception e) {
            log.error("图片裁剪失败", e);
            return buildError("图片裁剪失败：" + e.getMessage(), 500);
        }
        return resp;
    }

    /**
     * 图片尺寸调整接口
     */
    @PostMapping("/resize")
    public Map<String, Object> resize(@RequestPart("file") MultipartFile file,
                                      @RequestParam(value = "width", required = false) Integer width,
                                      @RequestParam(value = "height", required = false) Integer height) {
        Map<String, Object> resp = new HashMap<>();
        try {
            ImageEditService.EditResult result = imageEditService.resize(file, width, height);
            resp.put("success", true);
            resp.put("contentType", result.getContentType());
            resp.put("width", result.getWidth());
            resp.put("height", result.getHeight());
            resp.put("base64", java.util.Base64.getEncoder().encodeToString(result.getBytes()));
        } catch (IllegalArgumentException iae) {
            log.warn("图片尺寸调整参数错误: {}", iae.getMessage());
            return buildError(iae.getMessage(), 400);
        } catch (Exception e) {
            log.error("图片尺寸调整失败", e);
            return buildError("图片尺寸调整失败：" + e.getMessage(), 500);
        }
        return resp;
    }

    /**
     * 统一构造错误响应 JSON
     */
    private Map<String, Object> buildError(String msg, int code) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", false);
        map.put("message", msg);
        map.put("code", code);
        return map;
    }

    /**
     * 推断下载文件名
     */
    private String guessDownloadName(String originName, String targetFormat) {
        if (originName == null || originName.trim().isEmpty()) {
            return "converted." + targetFormat;
        }
        // 去掉原后缀改成目标格式
        String name = originName;
        int idx = originName.lastIndexOf('.');
        if (idx > 0) {
            name = originName.substring(0, idx);
        }
        return name + "." + targetFormat;
    }
}