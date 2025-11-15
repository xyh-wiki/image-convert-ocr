/**
 * @Author:XYH
 * @Date:2025-11-15
 * @Description: OCR 与图片编辑前端主页面组件
 */

import React, { useState } from "react";
import {
  convertImage,
  downloadConverted,
  ocrImage,
  compressImage,
  cropImage,
  resizeImage,
} from "./utils/api";

import HistoryPanel from "./components/HistoryPanel";

function App() {
  // 通用状态
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("convert"); // convert / ocr / compress / crop / resize
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 转换相关
  const [targetFormat, setTargetFormat] = useState("png");
  const [convertResult, setConvertResult] = useState(null); // { filename, targetFormat, base64, width, height }

  // OCR 相关
  const [ocrResult, setOcrResult] = useState(""); // 展示识别结果
  const [ocrHistory, setOcrHistory] = useState([]);

  // 压缩相关
  const [compressQuality, setCompressQuality] = useState(80); // 1-100 的滑块数值
  const [compressResultBase64, setCompressResultBase64] = useState(null);

  // 裁剪相关
  const [cropParams, setCropParams] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [cropResultBase64, setCropResultBase64] = useState(null);

  // 尺寸调整相关
  const [resizeParams, setResizeParams] = useState({
    width: 800,
    height: 0,
  });
  const [resizeResultBase64, setResizeResultBase64] = useState(null);

  /**
   * 文件选择
   */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setConvertResult(null);
    setCompressResultBase64(null);
    setCropResultBase64(null);
    setResizeResultBase64(null);
    setOcrResult("");
    setMessage("");

    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  /**
   * 触发图片格式转换
   */
  const handleConvert = async () => {
    if (!file) {
      setMessage("请先选择图片文件");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", targetFormat);
      const data = await convertImage(formData);
      setConvertResult(data);
      setMessage("格式转换成功，可点击下载按钮进行下载");
    } catch (e) {
      setMessage(e.message || "格式转换失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 点击下载按钮时，真正发起下载请求
   */
  const handleDownloadConverted = async () => {
    if (!file || !targetFormat) {
      setMessage("请先完成一次格式转换");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", targetFormat);
      const blob = await downloadConverted(formData);
      // 创建本地链接并触发下载
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const name =
          (convertResult && convertResult.filename) || `converted.${targetFormat}`;
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setMessage(e.message || "下载失败");
    }
  };

  /**
   * OCR 识别
   */
  const handleOcr = async () => {
    if (!file) {
      setMessage("请先选择图片文件");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await ocrImage(formData);
      const text = data.text || "";
      setOcrResult(text);

      // 写入历史记录
      const item = {
        id: Date.now(),
        time: new Date().toLocaleString(),
        text,
      };
      setOcrHistory((prev) => [item, ...prev]);
      setMessage("OCR 识别成功");
    } catch (e) {
      setMessage(e.message || "OCR 识别失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 图片压缩
   */
  const handleCompress = async () => {
    if (!file) {
      setMessage("请先选择图片文件");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      // compressImage 内部会把 1-100 转为 0-1
      const data = await compressImage(formData, compressQuality);
      setCompressResultBase64(data.base64);
      setMessage("图片压缩成功");
    } catch (e) {
      setMessage(e.message || "图片压缩失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 图片裁剪
   */
  const handleCrop = async () => {
    if (!file) {
      setMessage("请先选择图片文件");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("x", String(cropParams.x));
      formData.append("y", String(cropParams.y));
      formData.append("width", String(cropParams.width));
      formData.append("height", String(cropParams.height));
      const data = await cropImage(formData);
      setCropResultBase64(data.base64);
      setMessage("图片裁剪成功");
    } catch (e) {
      setMessage(e.message || "图片裁剪失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 图片尺寸调整
   */
  const handleResize = async () => {
    if (!file) {
      setMessage("请先选择图片文件");
      return;
    }
    if (!resizeParams.width && !resizeParams.height) {
      setMessage("宽度和高度不能同时为空");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (resizeParams.width) {
        formData.append("width", String(resizeParams.width));
      }
      if (resizeParams.height) {
        formData.append("height", String(resizeParams.height));
      }
      const data = await resizeImage(formData);
      setResizeResultBase64(data.base64);
      setMessage("图片尺寸调整成功");
    } catch (e) {
      setMessage(e.message || "图片尺寸调整失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 重置 OCR 历史
   */
  const handleResetHistory = () => {
    setOcrHistory([]);
  };

  return (
      <div className="app-root">
        <header className="app-header">
          <h1>图片格式转换 & OCR 工具</h1>
        </header>

        <div className="app-body">
          {/* 左侧：上传与预览 */}
          <div className="left-panel">
            <div className="upload-block">
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            {previewUrl && (
                <div className="preview-block">
                  <h3>原图预览</h3>
                  <img src={previewUrl} alt="预览" className="preview-image" />
                </div>
            )}
          </div>

          {/* 右侧：功能区 */}
          <div className="right-panel">
            {/* Tab 切换 */}
            <div className="tab-bar">
              <button
                  className={activeTab === "convert" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("convert")}
              >
                格式转换
              </button>
              <button
                  className={activeTab === "ocr" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("ocr")}
              >
                OCR 识别
              </button>
              <button
                  className={activeTab === "compress" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("compress")}
              >
                图片压缩
              </button>
              <button
                  className={activeTab === "crop" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("crop")}
              >
                图片裁剪
              </button>
              <button
                  className={activeTab === "resize" ? "tab active" : "tab"}
                  onClick={() => setActiveTab("resize")}
              >
                尺寸调整
              </button>
            </div>

            {/* 功能内容 */}
            <div className="tab-content">
              {activeTab === "convert" && (
                  <div>
                    <div className="form-row">
                      <label>目标格式：</label>
                      <select
                          value={targetFormat}
                          onChange={(e) => setTargetFormat(e.target.value)}
                      >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="gif">GIF</option>
                        <option value="bmp">BMP</option>
                        <option value="webp">WEBP</option>
                      </select>
                    </div>
                    <button onClick={handleConvert} disabled={loading}>
                      {loading ? "处理中..." : "开始转换"}
                    </button>

                    {convertResult && (
                        <div className="result-block">
                          <p>
                            转换成功：{convertResult.filename}（目标格式：
                            {convertResult.targetFormat}）
                          </p>
                          <button onClick={handleDownloadConverted}>
                            点击下载
                          </button>
                          {convertResult.base64 && (
                              <div className="preview-block">
                                <h3>转换后预览</h3>
                                <img
                                    src={`data:${convertResult.contentType};base64,${convertResult.base64}`}
                                    alt="转换后预览"
                                    className="preview-image"
                                />
                              </div>
                          )}
                        </div>
                    )}
                  </div>
              )}

              {activeTab === "ocr" && (
                  <div>
                    <button onClick={handleOcr} disabled={loading}>
                      {loading ? "识别中..." : "开始 OCR 识别"}
                    </button>
                    <div className="result-block">
                      <h3>OCR 识别结果</h3>
                      <textarea
                          value={ocrResult}
                          readOnly
                          rows={12}
                          style={{ width: "100%", resize: "vertical" }}
                          placeholder="识别结果将在这里展示..."
                      />
                    </div>

                    <div className="history-block">
                      <h3>OCR 历史记录</h3>
                      <HistoryPanel history={ocrHistory} onReset={handleResetHistory} />
                    </div>
                  </div>
              )}

              {activeTab === "compress" && (
                  <div>
                    <div className="form-row">
                      <label>压缩质量（1-100）：</label>
                      <input
                          type="number"
                          min="1"
                          max="100"
                          value={compressQuality}
                          onChange={(e) =>
                              setCompressQuality(
                                  Math.max(1, Math.min(100, Number(e.target.value) || 1))
                              )
                          }
                      />
                    </div>
                    <button onClick={handleCompress} disabled={loading}>
                      {loading ? "压缩中..." : "开始压缩"}
                    </button>
                    {compressResultBase64 && (
                        <div className="result-block">
                          <h3>压缩后预览</h3>
                          <img
                              src={`data:image/*;base64,${compressResultBase64}`}
                              alt="压缩后"
                              className="preview-image"
                          />
                        </div>
                    )}
                  </div>
              )}

              {activeTab === "crop" && (
                  <div>
                    <div className="form-row">
                      <label>X：</label>
                      <input
                          type="number"
                          value={cropParams.x}
                          onChange={(e) =>
                              setCropParams((p) => ({
                                ...p,
                                x: Number(e.target.value) || 0,
                              }))
                          }
                      />
                    </div>
                    <div className="form-row">
                      <label>Y：</label>
                      <input
                          type="number"
                          value={cropParams.y}
                          onChange={(e) =>
                              setCropParams((p) => ({
                                ...p,
                                y: Number(e.target.value) || 0,
                              }))
                          }
                      />
                    </div>
                    <div className="form-row">
                      <label>宽度：</label>
                      <input
                          type="number"
                          value={cropParams.width}
                          onChange={(e) =>
                              setCropParams((p) => ({
                                ...p,
                                width: Number(e.target.value) || 0,
                              }))
                          }
                      />
                    </div>
                    <div className="form-row">
                      <label>高度：</label>
                      <input
                          type="number"
                          value={cropParams.height}
                          onChange={(e) =>
                              setCropParams((p) => ({
                                ...p,
                                height: Number(e.target.value) || 0,
                              }))
                          }
                      />
                    </div>
                    <button onClick={handleCrop} disabled={loading}>
                      {loading ? "裁剪中..." : "开始裁剪"}
                    </button>
                    {cropResultBase64 && (
                        <div className="result-block">
                          <h3>裁剪结果预览</h3>
                          <img
                              src={`data:image/*;base64,${cropResultBase64}`}
                              alt="裁剪后"
                              className="preview-image"
                          />
                        </div>
                    )}
                  </div>
              )}

              {activeTab === "resize" && (
                  <div>
                    <div className="form-row">
                      <label>目标宽度（可空）：</label>
                      <input
                          type="number"
                          value={resizeParams.width}
                          onChange={(e) =>
                              setResizeParams((p) => ({
                                ...p,
                                width: Number(e.target.value) || 0,
                              }))
                          }
                      />
                    </div>
                    <div className="form-row">
                      <label>目标高度（可空）：</label>
                      <input
                          type="number"
                          value={resizeParams.height}
                          onChange={(e) =>
                              setResizeParams((p) => ({
                                ...p,
                                height: Number(e.target.value) || 0,
                              }))
                          }
                      />
                    </div>
                    <button onClick={handleResize} disabled={loading}>
                      {loading ? "调整中..." : "开始调整"}
                    </button>
                    {resizeResultBase64 && (
                        <div className="result-block">
                          <h3>尺寸调整结果预览</h3>
                          <img
                              src={`data:image/*;base64,${resizeResultBase64}`}
                              alt="调整后"
                              className="preview-image"
                          />
                        </div>
                    )}
                  </div>
              )}
            </div>

            {/* 全局提示 */}
            {message && <div className="message-bar">{message}</div>}
          </div>
        </div>
      </div>
  );
}

export default App;