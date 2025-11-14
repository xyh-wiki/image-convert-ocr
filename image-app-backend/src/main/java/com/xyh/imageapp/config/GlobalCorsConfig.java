package com.xyh.imageapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 全局 CORS 配置，允许前端域名通过浏览器访问后端 API
 */
@Configuration
public class GlobalCorsConfig implements WebMvcConfigurer {

    /**
     * 添加跨域映射配置
     *
     * @param registry CORS 注册对象，用于配置允许跨域访问的路径、来源、方法等
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 只开放 /api 开头的接口
                // 允许的前端来源（你的前端域名）
                .allowedOrigins("https://ocr.xyh.wiki")
                // 允许的 HTTP 方法，根据需要增减
                .allowedMethods("GET", "POST", "OPTIONS")
                // 允许携带的自定义请求头
                .allowedHeaders("*")
                // 是否允许发送 Cookie（这里不需要就设为 false）
                .allowCredentials(false)
                // 预检请求（OPTIONS）的缓存时间，单位秒
                .maxAge(3600);
    }
}