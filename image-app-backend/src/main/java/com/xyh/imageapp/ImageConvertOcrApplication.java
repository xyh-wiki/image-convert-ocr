package com.xyh.imageapp;

/**
 * @Author: XYH
 * @Date: 2025-11-12
 * @Description: Spring Boot 启动类
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ImageConvertOcrApplication {
    /**
     * 主入口方法，启动 SpringBoot 应用
     * @param args 启动参数
     */
    public static void main(String[] args) {
        SpringApplication.run(ImageConvertOcrApplication.class, args);
    }
}
