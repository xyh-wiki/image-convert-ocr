/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 站内搜索弹窗，只负责输入与跳转
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">站内搜索</label>
            <input
              className="form-input"
              placeholder="请输入关键词，例如：OCR、PDF 提取、文本工具..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              搜索
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
