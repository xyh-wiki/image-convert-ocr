/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 全局 Toast 上下文，用于页面间展示统一的消息提示
 */
import React, { createContext, useContext, useState, useCallback } from 'react'

export interface ToastMessage {
  id: number
  text: string
}

interface ToastContextValue {
  showToast: (text: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((text: string) => {
    setToasts(current => {
      const id = Date.now()
      return [...current, { id, text }]
    })
    // 简单的自动移除逻辑
    setTimeout(() => {
      setToasts(current => current.slice(1))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
