package com.xyh.imageapp.service;

/**
 * @Author: XYH
 * @Date: 2025-11-12
 * @Description: 图片格式转换服务，基于 ImageIO + TwelveMonkeys
 */
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageConvertService {
    /**
     * 将上传的图片转换为目标格式（例如 png/jpeg/webp/tiff/bmp/gif/psd）
     * @param file 源文件
     * @param targetFormat 目标后缀（png、jpeg、webp、tiff、bmp、gif、psd 等）
     * @return 转换后的二进制内容
     * @throws IOException 读写错误或不支持的格式
     */
    public byte[] convert(MultipartFile file, String targetFormat) throws IOException {
        String fmt = targetFormat.toLowerCase(Locale.ROOT);
        BufferedImage img = ImageIO.read(file.getInputStream());
        if (img == null) {
            throw new IOException("无法解析图片，请检查文件格式是否受支持");
        }
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            boolean ok = ImageIO.write(img, fmt, bos);
            if (!ok) {
                throw new IOException("不支持的目标格式：" + fmt);
            }
            return bos.toByteArray();
        }
    }
}
