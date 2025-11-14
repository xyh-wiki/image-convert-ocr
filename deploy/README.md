# 图片格式转换 & OCR（优化版）

- 后端：Spring Boot（Java 17），支持 PNG/JPEG/WebP/TIFF/BMP/GIF/PSD 的转换（依赖 TwelveMonkeys）与 ocr.space OCR。
- 前端：Vite + React，深色主题下拉修复、OCR 历史、自动下载转换结果。
- 部署：提供 Dokploy/Nginx/Dockerfile，含 SEO（sitemap、robots、meta）与 Google Ads 基础接入。

## 一键启动（本地）
### 后端
```bash
cd image-app-backend
mvn spring-boot:run
# or
mvn -DskipTests package && java -jar target/*.jar
```

### 前端
```bash
cd image-app-frontend
npm i
npm run dev
# 网关代理到 http://localhost:8080
```

## Dokploy 构建镜像
```bash
# 在 parent 根目录
docker build -f deploy/Dockerfile.backend -t <repo>/image-app-backend:latest .
docker push <repo>/image-app-backend:latest

docker build -f deploy/Dockerfile.frontend -t <repo>/image-app-frontend:latest .
docker push <repo>/image-app-frontend:latest
```
