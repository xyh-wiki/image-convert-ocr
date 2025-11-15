package com.xyh.imageapp.service;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Region;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description: 图片编辑服务（压缩、裁剪、尺寸调整等统一封装）
 */
@Service
public class ImageEditService {

    /**
     * 图片编辑结果封装对象
     * 用于在控制层中统一返回给前端
     */
    public static class EditResult {
        /**
         * 图片二进制数据
         */
        private byte[] bytes;
        /**
         * 图片 Content-Type（例如 image/jpeg）
         */
        private String contentType;
        /**
         * 图片宽度
         */
        private Integer width;
        /**
         * 图片高度
         */
        private Integer height;

        public EditResult(byte[] bytes, String contentType, Integer width, Integer height) {
            this.bytes = bytes;
            this.contentType = contentType;
            this.width = width;
            this.height = height;
        }

        public byte[] getBytes() {
            return bytes;
        }

        public String getContentType() {
            return contentType;
        }

        public Integer getWidth() {
            return width;
        }

        public Integer getHeight() {
            return height;
        }
    }

    /**
     * 压缩图片
     *
     * @param file    前端上传的原始图片文件
     * @param quality 压缩质量：
     *                1）前端如果传 0-1 之间的小数，则直接使用；
     *                2）如果传 1-100 之间的整数，则自动除以 100 转为 0-1；
     *                3）如果为空，则使用默认 0.8f；
     * @return 压缩后的图片结果
     * @throws IOException 读取或写入图片异常
     */
    public EditResult compress(MultipartFile file, Float quality) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件不能为空");
        }

        // 1. 读取原始图片
        BufferedImage src = ImageIO.read(file.getInputStream());
        if (src == null) {
            throw new IllegalArgumentException("无法读取图片内容，请检查文件格式是否为有效图片");
        }
        int srcWidth = src.getWidth();
        int srcHeight = src.getHeight();

        // 2. 处理质量参数
        float q;
        if (quality == null) {
            // 默认使用 0.8
            q = 0.8f;
        } else {
            q = quality;
            // 如果前端传的是 1-100 之间的整数，例如 80，则自动转换为 0.8
            if (q > 1.0f) {
                q = q / 100.0f;
            }
        }

        // 安全范围校验
        if (q <= 0.0f || q > 1.0f) {
            throw new IllegalArgumentException("Quality must be between 0 and 1 or between 1 and 100");
        }

        // 3. 压缩图片（不改变尺寸，仅改变质量）
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(src)
                .scale(1.0)          // 不缩放尺寸
                .outputQuality(q)    // 设置压缩质量
                .outputFormat(getFormatName(file.getOriginalFilename()))
                .toOutputStream(baos);

        byte[] bytes = baos.toByteArray();
        String contentType = guessContentType(file.getOriginalFilename());

        return new EditResult(bytes, contentType, srcWidth, srcHeight);
    }

    /**
     * 裁剪图片
     *
     * @param file   原始图片
     * @param x      裁剪起始 x 坐标（左上角）
     * @param y      裁剪起始 y 坐标（左上角）
     * @param width  裁剪宽度
     * @param height 裁剪高度
     * @return 裁剪后的图片结果
     * @throws IOException IO 异常
     */
    public EditResult crop(MultipartFile file, Integer x, Integer y, Integer width, Integer height) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件不能为空");
        }

        if (x == null || y == null || width == null || height == null) {
            throw new IllegalArgumentException("裁剪参数 x, y, width, height 不能为空");
        }

        if (width <= 0 || height <= 0) {
            throw new IllegalArgumentException("裁剪宽度和高度必须大于 0");
        }

        BufferedImage src = ImageIO.read(file.getInputStream());
        if (src == null) {
            throw new IllegalArgumentException("无法读取图片内容，请检查文件格式是否为有效图片");
        }
        int srcWidth = src.getWidth();
        int srcHeight = src.getHeight();

        // 对坐标进行边界处理，防止越界导致 500
        int startX = Math.max(0, x);
        int startY = Math.max(0, y);

        if (startX >= srcWidth || startY >= srcHeight) {
            throw new IllegalArgumentException("裁剪起点超出图片范围");
        }

        int cropWidth = Math.min(width, srcWidth - startX);
        int cropHeight = Math.min(height, srcHeight - startY);

        if (cropWidth <= 0 || cropHeight <= 0) {
            throw new IllegalArgumentException("裁剪区域无效，请检查参数");
        }

        // 使用 Thumbnailator 做裁剪
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(src)
                .sourceRegion(startX, startY, cropWidth, cropHeight)
                // 输出尺寸可以保持与裁剪区域一致
                .size(cropWidth, cropHeight)
                .keepAspectRatio(false)
                .outputFormat(getFormatName(file.getOriginalFilename()))
                .toOutputStream(baos);

        byte[] bytes = baos.toByteArray();
        String contentType = guessContentType(file.getOriginalFilename());

        return new EditResult(bytes, contentType, cropWidth, cropHeight);
    }

    /**
     * 调整图片尺寸
     *
     * @param file         原始图片
     * @param targetWidth  目标宽度，可以为 null
     * @param targetHeight 目标高度，可以为 null
     *                     1）两者都为空：抛出异常；
     *                     2）仅指定宽度：按比例计算高度；
     *                     3）仅指定高度：按比例计算宽度；
     *                     4）都指定：直接缩放到指定尺寸。
     * @return 调整尺寸后的图片结果
     * @throws IOException IO 异常
     */
    public EditResult resize(MultipartFile file, Integer targetWidth, Integer targetHeight) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件不能为空");
        }

        if (targetWidth == null && targetHeight == null) {
            throw new IllegalArgumentException("宽度和高度不能同时为空，至少指定一个");
        }

        BufferedImage src = ImageIO.read(file.getInputStream());
        if (src == null) {
            throw new IllegalArgumentException("无法读取图片内容，请检查文件格式是否为有效图片");
        }
        int srcWidth = src.getWidth();
        int srcHeight = src.getHeight();

        int outWidth;
        int outHeight;

        if (targetWidth != null && targetHeight != null) {
            outWidth = targetWidth;
            outHeight = targetHeight;
        } else if (targetWidth != null) {
            if (targetWidth <= 0) {
                throw new IllegalArgumentException("宽度必须大于 0");
            }
            outWidth = targetWidth;
            // 按比例计算高度
            outHeight = (int) Math.round((double) srcHeight * targetWidth / srcWidth);
        } else {
            // 只指定高度
            if (targetHeight <= 0) {
                throw new IllegalArgumentException("高度必须大于 0");
            }
            outHeight = targetHeight;
            outWidth = (int) Math.round((double) srcWidth * targetHeight / srcHeight);
        }

        if (outWidth <= 0 || outHeight <= 0) {
            throw new IllegalArgumentException("输出宽高无效，请检查参数");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(src)
                .size(outWidth, outHeight)
                .keepAspectRatio(false)
                .outputFormat(getFormatName(file.getOriginalFilename()))
                .toOutputStream(baos);

        byte[] bytes = baos.toByteArray();
        String contentType = guessContentType(file.getOriginalFilename());

        return new EditResult(bytes, contentType, outWidth, outHeight);
    }

    /**
     * 根据文件名推测图片格式（不带 image/ 前缀）
     *
     * @param filename 文件名
     * @return 图片格式，如 "jpg"、"png"
     */
    private String getFormatName(String filename) {
        if (filename == null) {
            return "jpg";
        }
        String lower = filename.toLowerCase();
        int index = lower.lastIndexOf('.');
        if (index < 0 || index == lower.length() - 1) {
            return "jpg";
        }
        String ext = lower.substring(index + 1);
        if ("jpeg".equals(ext)) {
            return "jpg";
        }
        return ext;
    }

    /**
     * 根据文件名推测 Content-Type
     *
     * @param filename 文件名
     * @return Content-Type 字符串
     */
    public String guessContentType(String filename) {
        if (filename == null) {
            return "image/jpeg";
        }
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png")) {
            return "image/png";
        } else if (lower.endsWith(".gif")) {
            return "image/gif";
        } else if (lower.endsWith(".bmp")) {
            return "image/bmp";
        } else if (lower.endsWith(".webp")) {
            return "image/webp";
        } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        return "image/jpeg";
    }
}