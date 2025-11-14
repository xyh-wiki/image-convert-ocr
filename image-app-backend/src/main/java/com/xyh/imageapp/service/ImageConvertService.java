package com.xyh.imageapp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.List;
import java.util.Base64;

/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description:
 *  图片格式转换服务：
 *  1. 接收前端上传的 MultipartFile 图片
 *  2. 校验并归一化目标格式（jpg/png/gif/tiff/bmp/webp 等）
 *  3. 使用 ImageIO 将图片转换为指定格式，输出为字节数组
 *  4. 封装为 ImageConvertResult（包含 base64、文件名、Content-Type 等）返回给 Controller
 *
 *  说明：
 *  - 标准 JDK 自带 ImageIO 对部分格式支持有限：
 *      * PNG / GIF / JPG / BMP 基本可用
 *      * TIFF / WebP / PSD 需要引入第三方库（如 TwelveMonkeys）
 *  - 如果需要更强大的格式支持，请在 pom.xml 中添加：

 */
@Service
public class ImageConvertService {

    /**
     * 支持的目标格式集合（全部用小写保存，便于统一比较）
     * 注意：这里是“内部归一化后的格式”，比如 jpg 代表所有 jpeg/jpg
     */
    private static final Set<String> SUPPORTED_FORMATS = new HashSet<>(
            Arrays.asList("jpg", "png", "gif", "tiff", "bmp", "webp")
    );

    /**
     * 图片格式转换核心方法
     *
     * @param file         上传的原始图片文件
     * @param targetFormat 前端传入的目标格式（可能是 jpeg / JPG / PnG 等）
     * @return 转换结果对象（包含 base64、文件名、Content-Type 等）
     * @throws IOException 当目标格式不支持或转换失败时抛出
     */
    public ImageConvertResult convert(MultipartFile file,
                                      String targetFormat) throws IOException {
        // 0. 基本参数校验
        if (file == null || file.isEmpty()) {
            throw new IOException("上传文件为空");
        }
        if (targetFormat == null || targetFormat.trim().isEmpty()) {
            throw new IOException("目标格式不能为空");
        }

        // 1. 统一大小写
        String lowerFormat = targetFormat.toLowerCase(Locale.ROOT).trim();

        // 2. 将前端传入格式转换为内部标准格式（别名归一）
        String normalizedFormat = normalizeFormat(lowerFormat);

        // 3. 校验是否在支持列表中
        if (!SUPPORTED_FORMATS.contains(normalizedFormat)) {
            // 这里保留原始传入格式，方便日志排查
            throw new IOException("不支持的目标格式：" + targetFormat);
        }

        // 4. 使用 ImageIO 读取原始图片为 BufferedImage
        //    注意：ImageIO.read 可能返回 null，表示无法识别输入流格式
        BufferedImage srcImage = ImageIO.read(file.getInputStream());
        if (srcImage == null) {
            throw new IOException("无法解析输入图片，可能是文件已损坏或格式不受支持");
        }

        // 5. 针对目标格式的特殊处理：
        //    - JPG 不支持透明通道（Alpha），需要手动转换为 RGB 背景（如白色）
        //    - 其他格式基本可以保留原有色彩空间
        BufferedImage convertedImage = prepareImageForTargetFormat(srcImage, normalizedFormat);

        // 6. 使用 ImageIO 将 BufferedImage 写入到字节数组
        byte[] outBytes = writeImageToBytes(convertedImage, normalizedFormat);

        // 7. 生成输出文件名：原始文件名去掉后缀 + 新后缀
        String originalFilename = file.getOriginalFilename();
        String baseName = extractFileBaseName(originalFilename);
        String outFilename = baseName + "." + normalizedFormat;

        // 8. 生成 Content-Type
        String contentType = guessContentType(normalizedFormat);

        // 9. 封装结果对象
        ImageConvertResult result = new ImageConvertResult();
        result.setTargetFormat(normalizedFormat);
        result.setFilename(outFilename);
        result.setContentType(contentType);
        result.setBytes(outBytes);
        result.setBase64(Base64.getEncoder().encodeToString(outBytes));
        result.setWidth(convertedImage.getWidth());
        result.setHeight(convertedImage.getHeight());

        return result;
    }

    /**
     * 将各种格式别名转换为内部统一使用的标准格式
     *
     * @param format 前端传入的小写格式字符串（如 "jpeg"、"jpg"、"tif"）
     * @return 归一化后的标准格式（如 "jpg"、"tiff" 等）
     */
    private String normalizeFormat(String format) {
        if (format == null) {
            return "";
        }
        switch (format) {
            case "jpeg":
            case "jpg":
                return "jpg";
            case "tif":
            case "tiff":
                return "tiff";
            // 其余格式没有别名的，直接返回原值（如 png/webp/gif/bmp）
            default:
                return format;
        }
    }

    /**
     * 根据目标格式准备合适的 BufferedImage：
     *  - 对于 JPG：转换为 TYPE_INT_RGB，并填充白色背景以去掉透明
     *  - 其余格式：如果原图已经是合适类型，可以直接返回；否则做一次兼容性转换
     *
     * @param src          原始 BufferedImage
     * @param targetFormat 归一化后的目标格式（如 "jpg"、"png"）
     * @return 适合写入目标格式的 BufferedImage
     */
    private BufferedImage prepareImageForTargetFormat(BufferedImage src, String targetFormat) {
        // 如果是 jpg，则强制转为 RGB，不带 Alpha 通道
        if ("jpg".equalsIgnoreCase(targetFormat)) {
            // 创建一个不带透明通道的 RGB 图像
            BufferedImage rgbImage = new BufferedImage(
                    src.getWidth(),
                    src.getHeight(),
                    BufferedImage.TYPE_INT_RGB
            );
            Graphics2D g = rgbImage.createGraphics();
            try {
                // 以白色为背景绘制原始图片（透明区域会变成白色）
                g.setComposite(AlphaComposite.SrcOver);
                g.setColor(Color.WHITE);
                g.fillRect(0, 0, src.getWidth(), src.getHeight());
                g.drawImage(src, 0, 0, null);
            } finally {
                g.dispose();
            }
            return rgbImage;
        }

        // 对于其他格式：如果已经是常见类型，直接返回；否则转换为 ARGB
        int type = src.getType();
        if (type == BufferedImage.TYPE_INT_RGB || type == BufferedImage.TYPE_INT_ARGB) {
            return src;
        }

        BufferedImage argbImage = new BufferedImage(
                src.getWidth(),
                src.getHeight(),
                BufferedImage.TYPE_INT_ARGB
        );
        Graphics2D g = argbImage.createGraphics();
        try {
            g.setComposite(AlphaComposite.SrcOver);
            g.drawImage(src, 0, 0, null);
        } finally {
            g.dispose();
        }
        return argbImage;
    }

    /**
     * 使用 ImageIO 将 BufferedImage 写为指定格式的字节数组
     *
     * @param image        待写入的图片
     * @param targetFormat 归一化后的目标格式（如 "jpg"、"png"）
     * @return 图片的二进制数据
     * @throws IOException 写入失败时抛出
     */
    private byte[] writeImageToBytes(BufferedImage image, String targetFormat) throws IOException {
        // 查找对应格式的 ImageWriter（避免 ImageIO.write 静默失败）
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName(targetFormat);
        if (!writers.hasNext()) {
            // 没有找到对应 writer，一般是未引入相应插件（如 webp/tiff/psd）
            throw new IOException("当前环境不支持写入目标格式：" + targetFormat);
        }

        ImageWriter writer = writers.next();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {

            writer.setOutput(ios);

            // 如果是 jpg，可以设置压缩质量（可选）
            if ("jpg".equalsIgnoreCase(targetFormat)) {
                ImageWriteParam param = writer.getDefaultWriteParam();
                if (param.canWriteCompressed()) {
                    param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                    // 压缩质量 0.0 ~ 1.0，1.0 为最高质量（文件更大）
                    param.setCompressionQuality(0.9f);
                    writer.write(null, new IIOImage(image, null, null), param);
                } else {
                    writer.write(image);
                }
            } else {
                // 其他格式默认写入方式即可
                writer.write(image);
            }

            writer.dispose();
            return baos.toByteArray();
        } finally {
            // 双重保险，防止未关闭 writer
            try {
                writer.dispose();
            } catch (Exception ignore) {
            }
        }
    }

    /**
     * 从原始文件名中提取不带扩展名的部分
     * 例如： "test.image.png" -> "test.image"
     *
     * @param originalFilename 原始文件名，可能为 null
     * @return 去掉最后一个 '.' 后缀的名称；如果原始文件名为空则返回 "converted"
     */
    private String extractFileBaseName(String originalFilename) {
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return "converted";
        }
        String name = originalFilename.trim();
        int lastDot = name.lastIndexOf('.');
        if (lastDot > 0) {
            return name.substring(0, lastDot);
        }
        return name;
    }

    /**
     * 根据目标格式猜测 Content-Type
     *
     * @param format 目标格式（如 "jpg"、"png"）
     * @return 对应的 MIME 类型字符串
     */
    private String guessContentType(String format) {
        switch (format.toLowerCase(Locale.ROOT)) {
            case "jpg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "tiff":
                return "image/tiff";
            case "webp":
                return "image/webp";
            default:
                // 默认回退为二进制流
                return "application/octet-stream";
        }
    }

    /**
     * 图片转换结果封装类
     * 实际项目中如果已有类似 DTO，可以直接替换为你的类定义
     */
    public static class ImageConvertResult {
        /**
         * 实际使用的目标格式（归一化后），如 jpg/png/webp 等
         */
        private String targetFormat;

        /**
         * 输出文件名（带新的扩展名）
         */
        private String filename;

        /**
         * HTTP Content-Type，例如 image/png
         */
        private String contentType;

        /**
         * 图片二进制数据
         */
        private byte[] bytes;

        /**
         * Base64 编码后的图片数据，方便前端直接使用 data URL 下载
         */
        private String base64;

        /**
         * 图片宽度（像素）
         */
        private int width;

        /**
         * 图片高度（像素）
         */
        private int height;

        // ---------------- Getter / Setter ----------------

        public String getTargetFormat() {
            return targetFormat;
        }

        public void setTargetFormat(String targetFormat) {
            this.targetFormat = targetFormat;
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public String getContentType() {
            return contentType;
        }

        public void setContentType(String contentType) {
            this.contentType = contentType;
        }

        public byte[] getBytes() {
            return bytes;
        }

        public void setBytes(byte[] bytes) {
            this.bytes = bytes;
        }

        public String getBase64() {
            return base64;
        }

        public void setBase64(String base64) {
            this.base64 = base64;
        }

        public int getWidth() {
            return width;
        }

        public void setWidth(int width) {
            this.width = width;
        }

        public int getHeight() {
            return height;
        }

        public void setHeight(int height) {
            this.height = height;
        }
    }
}