package com.xyh.imageapp.controller;

/**
 * @Author: XYH
 * @Date: 2025-11-12
 * @Description: 图片转换控制器：支持目标格式转换与可选的OCR识别
 */
import com.xyh.imageapp.service.ImageConvertService;
import com.xyh.imageapp.service.OcrSpaceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/image")
public class ImageController {
    private final ImageConvertService convertService;
    private final OcrSpaceService ocrService;

    public ImageController(ImageConvertService convertService, OcrSpaceService ocrService) {
        this.convertService = convertService;
        this.ocrService = ocrService;
    }

    @PostMapping("/convert")
    public ResponseEntity<Map<String,Object>> convert(
            @RequestPart("file") MultipartFile file,
            @RequestParam("targetFormat") String targetFormat,
            @RequestParam(value = "ocr", required = false, defaultValue = "false") String ocrFlag
    ) throws Exception {

        boolean ocr = "true".equalsIgnoreCase(ocrFlag);

        byte[] bytes = convertService.convert(file, targetFormat);
        String filename = baseName(file.getOriginalFilename()) + "." + targetFormat;
        String encoded = URLEncoder.encode(filename, String.valueOf(StandardCharsets.UTF_8));

        Map<String,Object> resp = new HashMap<>();
        String base64 = java.util.Base64.getEncoder().encodeToString(bytes);
        resp.put("filename", filename);
        resp.put("contentType", guessContentType(targetFormat));
        resp.put("base64", base64);

        // 🔥 仅当 ocr=true 时才执行 OCR
        if (ocr) {
            String text = ocrService.ocrByFile(file);
            resp.put("ocrText", text);
        }

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/download")
    public ResponseEntity<byte[]> download(@RequestPart("file") MultipartFile file,
                                           @RequestParam("targetFormat") String targetFormat) throws Exception {
        byte[] bytes = convertService.convert(file, targetFormat);
        String filename = baseName(file.getOriginalFilename()) + "." + targetFormat;
        String encoded = URLEncoder.encode(filename, String.valueOf(StandardCharsets.UTF_8));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(guessContentType(targetFormat)))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encoded)
                .body(bytes);
    }

    private String baseName(String name) {
        if (name == null) return "output";
        int p = name.lastIndexOf('.');
        return p>0 ? name.substring(0,p) : name;
    }

    private String guessContentType(String fmt) {
        switch (fmt.toLowerCase()) {
            case "png": return "image/png";
            case "jpg":
            case "jpeg": return "image/jpeg";
            case "webp": return "image/webp";
            case "tiff": return "image/tiff";
            case "bmp": return "image/bmp";
            case "gif": return "image/gif";
            case "psd": return "image/vnd.adobe.photoshop";
            default: return "application/octet-stream";
        }
    }
}
