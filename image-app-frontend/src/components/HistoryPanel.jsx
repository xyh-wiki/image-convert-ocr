/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: OCR 历史记录展示组件，支持分页和关键字搜索，并支持外部重置
 */

import React, { useState, useMemo, useEffect } from "react";
import Pagination from "./Pagination.jsx";

/**
 * OCR 历史记录组件
 * @param {Array}  history  历史记录数组，元素形如 { time: string, text: string }
 * @param {string} lang     当前语言：'en' 或 'zh'
 * @param {object} t        文案字典，用于多语言显示
 * @param {Function} onReset 可选的外部重置回调，用于清空父组件中的 history（localStorage）
 */
export default function HistoryPanel({ history, lang, t, onReset }) {
    // 当前页码
    const [page, setPage] = useState(1);
    // 搜索关键字
    const [keyword, setKeyword] = useState("");

    // 每页条数
    const pageSize = 5;

    /**
     * 当 history 长度变小时（例如点击 Reset 清空）：
     * 如果当前页已经超出最大页数，则自动回退到最后一页或第一页
     */
    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil((history?.length || 0) / pageSize));
        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [history, page]);

    /**
     * 过滤：按关键字在 text 中模糊匹配
     */
    const filtered = useMemo(() => {
        if (!keyword) return history || [];
        const lower = keyword.toLowerCase();
        return (history || []).filter((h) =>
            (h.text || "").toLowerCase().includes(lower)
        );
    }, [history, keyword]);

    /**
     * 分页切片
     */
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    /**
     * Reset 按钮点击：
     * 1. 清空搜索关键字
     * 2. 重置页码为 1
     * 3. 如果父组件传入 onReset，则调用父组件的清空逻辑（清空 history + localStorage）
     */
    const handleResetClick = () => {
        setKeyword("");
        setPage(1);
        if (typeof onReset === "function") {
            onReset();
        }
    };

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
                    onClick={handleResetClick}
                >
                    {t.btnClearFilter}
                </button>
            </div>

            {/* 搜索输入框 */}
            <input
                className="input"
                placeholder={t.historySearchPlaceholder}
                value={keyword}
                onChange={(e) => {
                    setKeyword(e.target.value);
                    setPage(1);
                }}
            />

            {/* 列表区域 */}
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

            {/* 分页组件 */}
            <Pagination
                page={page}
                total={filtered.length}
                pageSize={pageSize}
                onChange={setPage}
            />
        </div>
    );
}