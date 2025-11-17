/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 应用主组件，定义路由结构与基础布局
 */
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { ProductsIndex } from './pages/products/ProductsIndex'
import { OcrProduct } from './pages/products/OcrProduct'
import { BinaryExtractProduct } from './pages/products/BinaryExtractProduct'
import { TextToolsProduct } from './pages/products/TextToolsProduct'
import { EditTextProduct } from './pages/products/EditTextProduct'
import { FAQ } from './pages/FAQ'
import { Contact } from './pages/Contact'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { SitemapPage } from './pages/SitemapPage'
import { SearchPage } from './pages/SearchPage'
import { NotFound } from './pages/NotFound'
import { ToastProvider } from './components/common/ToastContext'

export const App: React.FC = () => {
  return (
    // ToastProvider 负责全局消息提示
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<ProductsIndex />} />
          <Route path="/products/ocr" element={<OcrProduct />} />
          <Route path="/products/binary-extract" element={<BinaryExtractProduct />} />
          <Route path="/products/text-tools" element={<TextToolsProduct />} />
          <Route path="/products/edit-text" element={<EditTextProduct />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ToastProvider>
  )
}

export default App
