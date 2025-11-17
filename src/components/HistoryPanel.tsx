/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: OCR 历史记录展示组件（TS 版本），支持分页、搜索，并支持外部 Reset
 */

import React, { useState, useMemo, useEffect } from "react";
import Pagination from "./Pagination";

export interface HistoryItem {
  id?: string;
  time?: string;
  fileName?: string;
  mode?: string;
  textPreview?: string;
  [key: string]: any;
}

export interface HistoryPanelProps {
  history: HistoryItem[];
  lang: string;
  t: Record<string, string>;
  onReset?: () => void;
}

/**
 * OCR 历史记录组件
 */
const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, lang, t, onReset }) => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const pageSize = 5;

  // history 变化导致页码回退
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil((history?.length || 0) / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [history, page]);

  const filtered = useMemo(() => {
    if (!keyword) return history || [];
    const k = keyword.toLowerCase();
    return (history || []).filter((it) => {
      const txt =
        (it.textPreview || "") +
        (it.fileName || "") +
        (it.mode || "") +
        (it.time || "");
      return txt.toLowerCase().includes(k);
    });
  }, [history, keyword]);

  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="history-panel">
      <div className="history-header">
        <div className="history-title">
          {lang === "zh" ? "OCR 历史记录" : "OCR History"}
        </div>
        <div className="history-actions">
          <input
            className="history-search-input"
            placeholder={
              lang === "zh" ? "搜索文件名 / 内容..." : "Search by file or text..."
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {onReset && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onReset()}
            >
              {lang === "zh" ? "清空历史" : "Clear"}
            </button>
          )}
        </div>
      </div>

      <div className="history-list">
        {currentPageItems.length === 0 ? (
          <div className="history-empty">
            {lang === "zh" ? "暂无历史记录" : "No history yet."}
          </div>
        ) : (
          currentPageItems.map((item, idx) => (
            <div key={item.id || idx} className="history-item">
              <div className="history-item-main">
                <div className="history-item-title">
                  {item.fileName || (lang === "zh" ? "未命名文件" : "Untitled")}
                </div>
                <div className="history-item-sub">
                  {item.mode || ""} · {item.time || ""}
                </div>
              </div>
              {item.textPreview && (
                <div className="history-item-preview">{item.textPreview}</div>
              )}
            </div>
          ))
        )}
      </div>

      <Pagination
        page={page}
        total={filtered.length}
        pageSize={pageSize}
        onChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default HistoryPanel;
