/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: OCR 历史记录展示组件，支持分页、搜索，并支持外部 Reset
 */

import React, { useState, useMemo, useEffect } from "react";
import Pagination from "./Pagination.jsx";

/**
 * OCR 历史记录组件
 * @param {Array} history  历史记录
 * @param {string} lang    当前语言
 * @param {object} t       文案
 * @param {Function} onReset 清空回调（父组件提供）
 */
export default function HistoryPanel({ history, lang, t, onReset }) {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");

    const pageSize = 5;

    /** history 变化导致页码回退 */
    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil((history?.length || 0) / pageSize));
        if (page > maxPage) setPage(maxPage);
    }, [history, page]);

    /** 搜索过滤 */
    const filtered = useMemo(() => {
        if (!keyword) return history || [];
        const lower = keyword.toLowerCase();
        return history.filter((h) => (h.text || "").toLowerCase().includes(lower));
    }, [history, keyword]);

    /** 分页 */
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    /** Reset */
    const handleReset = () => {
        setKeyword("");
        setPage(1);
        if (typeof onReset === "function") onReset();
    };

    return (
        <div className="card history">
            <div className="card-header">
                <div>
                    <div className="card-title">{t.historyTitle}</div>
                    <div className="card-desc">{t.historySubtitle}</div>
                </div>
                <button
                    className="btn btn-ghost"
                    disabled={history.length === 0}
                    onClick={handleReset}
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
                style={{ marginBottom: 10 }}
            />

            <div className="history-list">
                {pageItems.length === 0 && (
                    <div
                        className="helper-text"
                        style={{ textAlign: "center", padding: 12, opacity: 0.75 }}
                    >
                        {t.historyEmpty}
                    </div>
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