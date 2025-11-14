package com.xyh.imageapp.service;

/**
 * @Author: XYH
 * @Date: 2025-11-12
 * @Description: 基于 OkHttp 的 ocr.space 访问封装，支持文件与URL识别
 */
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xyh.imageapp.config.OcrProperties;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class OcrSpaceService {
    private final OcrProperties props;
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public OcrSpaceService(OcrProperties props) {
        this.props = props;
    }

    /**
     * 通过文件进行OCR识别
     * @param file 上传图片
     * @return 纯文本
     * @throws IOException 调用异常
     */
    public String ocrByFile(MultipartFile file) throws IOException {
        RequestBody fileBody = RequestBody.create(file.getBytes(), MediaType.parse("application/octet-stream"));
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

        try (Response resp = client.newCall(request).execute()) {
            if (!resp.isSuccessful()) throw new IOException("OCR HTTP " + resp.code());
            String json = resp.body().string();
            return extractText(json);
        }
    }

    /**
     * 通过URL进行OCR识别
     */
    public String ocrByUrl(String imageUrl) throws IOException {
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

        try (Response resp = client.newCall(request).execute()) {
            if (!resp.isSuccessful()) throw new IOException("OCR HTTP " + resp.code());
            String json = resp.body().string();
            return extractText(json);
        }
    }

    /** 解析 ocr.space JSON */
    private String extractText(String json) throws IOException {
        JsonNode root = mapper.readTree(json);
        if (root.has("ParsedResults") && root.get("ParsedResults").isArray()) {
            StringBuilder sb = new StringBuilder();
            for (JsonNode r : root.get("ParsedResults")) {
                String t = r.has("ParsedText") ? r.get("ParsedText").asText() : "";
                if (t != null && !t.isEmpty()) sb.append(t).append("\n");
            }
            return sb.toString().trim();
        }
        return "";
    }
}
