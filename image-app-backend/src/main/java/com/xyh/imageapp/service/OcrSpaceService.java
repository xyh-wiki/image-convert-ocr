package com.xyh.imageapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xyh.imageapp.config.OcrProperties;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description: 封装 OCR.space 调用逻辑的服务类，提供 doOcr 方法给控制层使用
 */
@Slf4j
@Service
public class OcrSpaceService {

    /**
     * OkHttp 客户端，用于发起 HTTP 请求
     */
    private final OkHttpClient httpClient;

    /**
     * JSON 解析器，用于解析 OCR.space 返回的 JSON 字符串
     */
    private final ObjectMapper objectMapper;

    /**
     * OCR 相关配置（API Key、接口地址、默认语言等）
     */
    private final OcrProperties ocrProperties;

    /**
     * 通过构造函数注入配置类
     *
     * @param ocrProperties OCR 相关配置
     */
    public OcrSpaceService(OcrProperties ocrProperties) {
        this.ocrProperties = ocrProperties;
        this.httpClient = new OkHttpClient.Builder().build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 调用 OCR.space 接口进行文字识别，返回提取出的纯文本
     *
     * @param file     前端上传的图片文件
     * @param language 识别语言，可为空；为空时使用配置中的默认语言
     * @return 识别出的纯文本内容（如果无法识别，将返回空字符串）
     */
    public String doOcr(MultipartFile file, String language) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件不能为空");
        }

        // 1. 读取配置中的 API Key 和 URL
        String apiKey = ocrProperties.getApiKey();
        String url = ocrProperties.getUrl();
        String defaultLang = ocrProperties.getLanguage();

        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("OCR.space API Key 未配置，请在配置文件中设置 ocr.space.api-key");
        }
        if (url == null || url.trim().isEmpty()) {
            // OCR.space 默认的 API 地址
            url = "https://api.ocr.space/parse/image";
        }

        // 2. 确定识别语言
        String lang = (language != null && !language.trim().isEmpty())
                ? language.trim()
                : (defaultLang != null && !defaultLang.trim().isEmpty() ? defaultLang.trim() : "chs");

        try {
            // 3. 构造 multipart/form-data 请求体
            String contentType = file.getContentType();
            if (contentType == null || contentType.trim().isEmpty()) {
                contentType = "application/octet-stream";
            }

            RequestBody fileBody = RequestBody.create(
                    file.getBytes(),
                    MediaType.parse(contentType)
            );

            MultipartBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    // 文件字段名必须是 "file"
                    .addFormDataPart("file", file.getOriginalFilename(), fileBody)
                    // OCR.space 必要参数
                    .addFormDataPart("apikey", apiKey)
                    .addFormDataPart("language", lang)
                    // 是否返回字符区域信息，这里不需要，降低返回体大小
                    .addFormDataPart("isOverlayRequired", "false")
                    // 是否放大图片，适当提高小字体识别率
                    .addFormDataPart("scale", "true")
                    // 是否按表格模式识别，这里默认关闭
                    .addFormDataPart("isTable", "false")
                    .build();

            Request request = new Request.Builder()
                    .url(url)
                    .post(requestBody)
                    .build();

            // 4. 发送请求并获取响应
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    String errorText = response.body() != null
                            ? response.body().string()
                            : ("HTTP " + response.code());
                    log.error("调用 OCR.space 失败，HTTP 状态码：{}，响应：{}", response.code(), errorText);
                    throw new RuntimeException("调用 OCR.space 失败，HTTP 状态码：" + response.code());
                }

                String respBody = response.body() != null
                        ? response.body().string()
                        : "";
                log.debug("OCR.space 返回原始数据: {}", respBody);

                // 5. 从 JSON 中抽取 ParsedText 作为纯文本返回
                String text = extractTextFromJson(respBody);
                if (text == null) {
                    text = "";
                }
                return text;
            }
        } catch (IOException e) {
            log.error("调用 OCR.space 发生 IO 异常", e);
            throw new RuntimeException("调用 OCR.space 发生 IO 异常：" + e.getMessage(), e);
        } catch (Exception e) {
            log.error("调用 OCR.space 出现异常", e);
            throw new RuntimeException("调用 OCR.space 出现未知异常：" + e.getMessage(), e);
        }
    }

    /**
     * 从 OCR.space 返回的 JSON 字符串中提取所有 ParsedText 字段，并拼接为一个完整文本
     *
     * @param json OCR.space 返回的 JSON 字符串
     * @return 拼接后的纯文本结果
     * @throws IOException JSON 解析异常
     */
    private String extractTextFromJson(String json) throws IOException {
        if (json == null || json.trim().isEmpty()) {
            return "";
        }

        JsonNode root = objectMapper.readTree(json);

        // 如果 OCRExitCode 不为 1，说明识别失败，记录错误信息
        JsonNode exitCodeNode = root.get("OCRExitCode");
        if (exitCodeNode != null && exitCodeNode.isInt()) {
            int code = exitCodeNode.asInt();
            if (code != 1) {
                JsonNode errorNode = root.get("ErrorMessage");
                String errorMsg = (errorNode != null && !errorNode.isNull())
                        ? errorNode.toString()
                        : "未知错误";
                log.warn("OCR.space 识别未成功，OCRExitCode={}，错误信息={}", code, errorMsg);
            }
        }

        // 解析 ParsedResults 数组
        JsonNode results = root.get("ParsedResults");
        if (results == null || !results.isArray()) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        for (JsonNode item : results) {
            JsonNode parsedTextNode = item.get("ParsedText");
            if (parsedTextNode != null && !parsedTextNode.isNull()) {
                String part = parsedTextNode.asText("");
                if (!part.isEmpty()) {
                    if (sb.length() > 0) {
                        sb.append("\n");
                    }
                    // OCR.space 返回中常包含 \r\n，这里统一替换成 \n
                    sb.append(part.replace("\r\n", "\n"));
                }
            }
        }

        return sb.toString();
    }
}