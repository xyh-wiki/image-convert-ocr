package com.xyh.imageapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xyh.imageapp.config.OcrProperties;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * @Author: XYH
 * @Date: 2025-11-12
 * @Description: 稳定版 OCRSpace 调用封装（自动处理 403 / 无 API Key / OCRExitCode）
 */
@Slf4j
@Service
public class OcrSpaceService {

    private final OcrProperties props;
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public OcrSpaceService(OcrProperties props) {
        this.props = props;
    }

    /** 判断 API Key 是否有效 */
    private boolean isApiKeyConfigured() {
        String key = props.getApiKey();
        if (key == null) return false;
        key = key.trim();
        return !key.isEmpty() && !key.equalsIgnoreCase("demo_key_replace_me");
    }

    /**
     * 文件 OCR
     */
    public String ocrByFile(MultipartFile file) throws IOException {
        if (!isApiKeyConfigured()) {
            throw new IllegalStateException("OCR API key not configured");
        }

        RequestBody fileBody = RequestBody.create(
                file.getBytes(),
                MediaType.parse("application/octet-stream")
        );

        MultipartBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("language", props.getLanguage())
                .addFormDataPart("isOverlayRequired", "false")
                .addFormDataPart("scale", String.valueOf(props.isScale()))
                .addFormDataPart("isTable", String.valueOf(props.isTable()))
                .addFormDataPart("file", file.getOriginalFilename(), fileBody)
                .build();

        Request request = new Request.Builder()
                .url(props.getUrl())
                .addHeader("apikey", props.getApiKey())
                .post(requestBody)
                .build();

        return executeOcr(request);
    }

    /**
     * URL OCR
     */
    public String ocrByUrl(String imageUrl) throws IOException {
        if (!isApiKeyConfigured()) {
            throw new IllegalStateException("OCR API key not configured");
        }

        FormBody form = new FormBody.Builder()
                .add("language", props.getLanguage())
                .add("isOverlayRequired", "false")
                .add("scale", String.valueOf(props.isScale()))
                .add("isTable", String.valueOf(props.isTable()))
                .add("url", imageUrl)
                .build();

        Request request = new Request.Builder()
                .url(props.getUrl())
                .addHeader("apikey", props.getApiKey())
                .post(form)
                .build();

        return executeOcr(request);
    }

    /**
     * OCR 执行与错误处理
     */
    private String executeOcr(Request request) throws IOException {
        try (Response resp = client.newCall(request).execute()) {

            if (resp.code() == 403) {
                throw new IllegalStateException("OCR request rejected (403): invalid API key");
            }

            if (!resp.isSuccessful()) {
                throw new IOException("OCR HTTP " + resp.code());
            }

            String json = resp.body().string();
            JsonNode root = mapper.readTree(json);

            // OCRExitCode 必须是 1 才表示成功
            JsonNode exitCode = root.get("OCRExitCode");
            if (exitCode != null && exitCode.asInt() != 1) {
                String errorMsg = "";
                if (root.has("ErrorMessage")) {
                    errorMsg = root.get("ErrorMessage").toString();
                }
                throw new IllegalStateException("OCR failed: " + errorMsg);
            }

            return extractText(root);
        }
    }

    /**
     * 提取 OCR 文本
     */
    private String extractText(JsonNode root) {
        if (root.has("ParsedResults") && root.get("ParsedResults").isArray()) {
            StringBuilder sb = new StringBuilder();
            for (JsonNode r : root.get("ParsedResults")) {
                String t = r.path("ParsedText").asText("");
                if (!t.isEmpty()) sb.append(t).append("\n");
            }
            return sb.toString().trim();
        }
        return "";
    }
}