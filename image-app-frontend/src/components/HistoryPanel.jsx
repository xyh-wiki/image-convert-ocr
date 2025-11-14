
/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: OCR 历史记录展示组件，支持分页和关键字搜索
 */

import React, { useState, useMemo } from "react";
import Pagination from "./Pagination.jsx";

/**
 * OCR 历史记录组件
 * @param {Array} history 历史记录数组，元素形如 { time: string, text: string }
 * @param {string} lang 当前语言：'en' 或 'zh'
 * @param {object} t 文案字典，用于多语言显示
 */
export default function HistoryPanel({ history, lang, t }) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const pageSize = 5;

  const filtered = useMemo(() => {
    if (!keyword) return history;
    const lower = keyword.toLowerCase();
    return history.filter((h) => (h.text || "").toLowerCase().includes(lower));
  }, [history, keyword]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="card history">
      <div className="card-header">
        <div>
          <div className="card-title">{t.historyTitle}</div>
          <div className="card-desc">{t.historySubtitle}</div>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setKeyword("");
            setPage(1);
          }}
        >
          {t.btnClearFilter}
        </button>
      </div>

      <input
        className="input"
        placeholder={t.historySearchPlaceholder}
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setPage(1);
        }}
      />

      <div className="history-list">
        {pageItems.length === 0 && (
          <div className="helper-text">{t.historyEmpty}</div>
        )}

        {pageItems.map((h, idx) => (
          <div key={idx} className="history-item">
            <div className="history-time">{h.time}</div>
            <div className="history-text">{h.text}</div>
          </div>
        ))}
      </div>

      <Pagination
        page={page}
        total={filtered.length}
        pageSize={pageSize}
        onChange={setPage}
      />
    </div>
  );
}
