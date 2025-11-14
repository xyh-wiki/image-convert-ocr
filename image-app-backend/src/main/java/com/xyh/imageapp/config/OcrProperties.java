package com.xyh.imageapp.config;

/**
 * @Author: XYH
 * @Date: 2025-11-12
 * @Description: OCRSpace 配置属性映射类
 */
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ocr.space")
public class OcrProperties {
    /** ocr.space 的 API Key，建议以环境变量 OCR_SPACE_API_KEY 注入 */
    private String apiKey;
    /** OCR 接口URL */
    private String url = "https://api.ocr.space/parse/image";
    /** 语言代码：chs/eng/jpn/kor 等 */
    private String language = "chs";
    /** 是否缩放以提升识别小字 */
    private boolean scale = true;
    /** 是否表格模式 */
    private boolean table = false;

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public boolean isScale() { return scale; }
    public void setScale(boolean scale) { this.scale = scale; }
    public boolean isTable() { return table; }
    public void setTable(boolean table) { this.table = table; }
}
