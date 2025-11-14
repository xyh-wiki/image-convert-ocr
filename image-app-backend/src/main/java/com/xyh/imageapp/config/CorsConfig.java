package com.xyh.imageapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 全局 CORS 配置，允许前端域名跨域访问后端接口
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * 配置跨域访问规则
     *
     * @param registry Spring 提供的 CORS 注册器，用于集中配置所有接口的跨域策略
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 这里写允许访问后端的前端域名
                .allowedOrigins(
                        "https://ocr.xyh.wiki"
                        // 如果你本地调试用   http://localhost:5173  也可以一起放进来
                        // ,"http://localhost:5173"
                )
                // 允许的 HTTP 方法
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // 允许携带的请求头
                .allowedHeaders("*")
                // 是否允许携带 Cookie 等凭证
                .allowCredentials(false)
                // 预检请求的缓存时间（秒）
                .maxAge(3600);
    }
}