/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: 通用分页组件（TS 版本），支持简单页码切换
 */

import React from "react";

export interface PaginationProps {
  page: number;
  total: number;
  pageSize?: number;
  onChange: (page: number) => void;
}

/**
 * 分页组件
 */
const Pagination: React.FC<PaginationProps> = ({ page, total, pageSize = 5, onChange }) => {
  const pages = Math.ceil((total || 0) / pageSize);
  if (pages <= 1) return null;

  const nums: number[] = [];
  for (let i = 1; i <= pages; i++) {
    nums.push(i);
  }

  return (
    <div className="pagination">
      <span className="pagination-info">
        {page} / {pages}
      </span>
      <div className="pagination-pages">
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            className={
              "pagination-btn" + (n === page ? " pagination-btn-active" : "")
            }
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
