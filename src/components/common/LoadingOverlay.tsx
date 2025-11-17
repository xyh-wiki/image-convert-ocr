/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 全局 Loading 遮罩组件，用于异步请求时给用户反馈
 */
import React from 'react'

interface LoadingOverlayProps {
  visible: boolean
  text?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, text }) => {
  if (!visible) return null
  return (
    <div className="loading-overlay">
      <div>{text ?? '正在处理，请稍候…'}</div>
    </div>
  )
}
