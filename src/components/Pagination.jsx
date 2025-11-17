
/**
 * @Author:XYH
 * @Date:2025-11-14
 * @Description: 通用分页组件，支持简单页码切换
 */

import React from "react";

/**
 * 分页组件属性说明：
 * @param {number} page 当前页码，从 1 开始
 * @param {number} total 总记录数
 * @param {number} pageSize 每页数量
 * @param {function} onChange 页码切换回调函数
 */
export default function Pagination({ page, total, pageSize = 5, onChange }) {
  const pages = Math.ceil((total || 0) / pageSize);
  if (pages <= 1) return null;

  const nums = [];
  for (let i = 1; i <= pages; i++) {
    nums.push(i);
  }

  return (
    <div className="pagination">
      <span className="pagination-info">
        {`Total: ${total} | Page ${page} / ${pages}`}
      </span>
      {nums.map((n) => (
        <button
          key={n}
          type="button"
          className="btn"
          style={{
            padding: "4px 10px",
            fontSize: 12,
            background:
              n === page ? "var(--primary-dark)" : "var(--primary)",
          }}
          onClick={() => onChange && onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
