package com.xyh.imageapp.service;

/**
 * @Author: XYH
 * @Date: 2025-11-14
 * @Description: 图片编辑服务（压缩、裁剪、调整尺寸）
 */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Slf4j
@Service
public class ImageEditService {

    /**
     * ⭐ 统一返回结构（保证 controller.getFilename() 能访问！）
     */
    @Data
    @AllArgsConstructor
    public static class EditResult {
        private byte[] bytes;       // 输出图片字节
        private String filename;    // 建议文件名（如：xxx_compressed.png）
        private String contentType; // MIME 类型（image/png）
        private Integer width;      // 宽
        private Integer height;     // 高
    }

    // =========================================================
    // 1. 图片压缩
    // =========================================================

    public EditResult compress(MultipartFile file, double quality) throws Exception {

        BufferedImage img = ImageIO.read(file.getInputStream());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Thumbnails.of(img)
                .scale(1.0)
                .outputQuality(quality)
                .toOutputStream(out);

        byte[] bytes = out.toByteArray();

        return new EditResult(
                bytes,
                buildName(file, "compressed"),
                guessContentType(file.getOriginalFilename()),
                img.getWidth(),
                img.getHeight()
        );
    }

    // =========================================================
    // 2. 图片裁剪
    // =========================================================

    public EditResult crop(MultipartFile file, int x, int y, int w, int h) throws Exception {

        BufferedImage img = ImageIO.read(file.getInputStream());
        BufferedImage sub = img.getSubimage(x, y, w, h);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(sub, "png", out);

        return new EditResult(
                out.toByteArray(),
                buildName(file, "cropped"),
                "image/png",
                sub.getWidth(),
                sub.getHeight()
        );
    }

    // =========================================================
    // 3. 图片尺寸调整（缩放）
    // =========================================================

    public EditResult resize(MultipartFile file, int width, int height) throws Exception {

        BufferedImage img = ImageIO.read(file.getInputStream());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        BufferedImage outImg = Thumbnails.of(img)
                .size(width, height)
                .keepAspectRatio(true)
                .asBufferedImage();

        ImageIO.write(outImg, "png", out);

        return new EditResult(
                out.toByteArray(),
                buildName(file, "resized"),
                "image/png",
                outImg.getWidth(),
                outImg.getHeight()
        );
    }

    // =========================================================
    // 公共工具方法
    // =========================================================

    private String buildName(MultipartFile file, String suffix) {
        String name = file.getOriginalFilename();
        if (name == null) return suffix + ".png";

        int p = name.lastIndexOf(".");
        String base = (p > 0 ? name.substring(0, p) : name);

        return base + "_" + suffix + ".png";
    }

    private String guessContentType(String name) {
        if (name == null) return "image/png";

        String lower = name.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".bmp")) return "image/bmp";

        return "image/png";
    }
}