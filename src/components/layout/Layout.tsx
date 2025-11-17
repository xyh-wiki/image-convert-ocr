/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 整体页面布局组件，包含头部、主体和页脚
 */
import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
