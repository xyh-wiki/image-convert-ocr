package com.xyh.imageapp.service;

/**
 * @Author: XYH
 * @Date: 2025-11-14
 * @Description: 图片编辑功能服务，包括压缩、裁剪、尺寸调整
 */

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Slf4j
@Service
public class ImageEditService {

    /**
     * 图片压缩
     *
     * @param file  原图
     * @param quality 压缩质量（0.1 - 1.0）
     */
    public byte[] compress(MultipartFile file, double quality) throws IOException {
        if (quality <= 0 || quality > 1) {
            throw new IllegalArgumentException("Quality must be between 0.1 and 1");
        }

        BufferedImage img = javax.imageio.ImageIO.read(file.getInputStream());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Thumbnails.of(img)
                .scale(1.0)
                .outputQuality(quality)
                .toOutputStream(out);

        return out.toByteArray();
    }

    /**
     * 图片裁剪
     */
    public byte[] crop(MultipartFile file,
                       int x, int y, int w, int h) throws IOException {

        BufferedImage img = javax.imageio.ImageIO.read(file.getInputStream());
        BufferedImage sub = img.getSubimage(x, y, w, h);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        javax.imageio.ImageIO.write(sub, "png", out);

        return out.toByteArray();
    }

    /**
     * 图片尺寸调整（缩放）
     */
    public byte[] resize(MultipartFile file,
                         int width, int height) throws IOException {

        BufferedImage img = javax.imageio.ImageIO.read(file.getInputStream());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Thumbnails.of(img)
                .size(width, height)
                .keepAspectRatio(true)
                .toOutputStream(out);

        return out.toByteArray();
    }
}