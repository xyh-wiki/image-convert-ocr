/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 简单国际化实现，提供中英文文案与上下文（TSX 版本，支持 JSX）
 */
import React, { createContext, useContext, useState, useMemo } from 'react'

type Locale = 'zh' | 'en'

interface I18nContextValue {
  locale: Locale
  t: (key: string) => string
  switchLocale: (next: Locale) => void
}

// 这里定义简单的 key-value 文案，后续可以按需扩展
const dict: Record<Locale, Record<string, string>> = {
  zh: {
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.products': '产品与服务',
    'nav.faq': '常见问题',
    'nav.contact': '联系我们',

    'hero.eyebrow': '在线文本与文件工具平台',
    'hero.title': '一站式 OCR / 文本提取 / 文本工具 / 在线编辑',
    'hero.subtitle':
      '聚合图片 OCR、二进制文件文本提取、文本处理工具与在线编辑，帮助开发者、写作者与办公用户高效处理内容。',
    'hero.primaryCta': '马上开始',
    'hero.secondaryCta': '了解四大工具',

    'home.feature.title': '四大核心工具模块',
    'home.feature.desc': '围绕文本与文件处理场景，提供高频刚需的轻量在线工具。',

    'product.ocr.name': '图片 OCR 与格式转换',
    'product.ocr.desc': '上传 PNG / JPG / WebP / TIFF 等图片，一键完成格式转换与文字识别。',
    'product.binary.name': '二进制文件文本提取',
    'product.binary.desc': '支持 PDF / Word / 图片等常见格式，提取干净可编辑的文本内容。',
    'product.textTools.name': '在线文本工具合集',
    'product.textTools.desc': '去除多余换行、清洗空格、字数统计、代码格式化等常用文本工具。',
    'product.editText.name': '在线文本编辑与清洗',
    'product.editText.desc': '在浏览器中直接编辑与清洗文本，去格式、重排段落并导出。',

    'footer.copyright': '版权所有 © XYH.wiki',
    'footer.rights': '保留所有权利'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',

    'hero.eyebrow': 'Online text & file tools',
    'hero.title': 'One place for OCR, text extraction & editors',
    'hero.subtitle':
      'Practical tools for images OCR, binary file text extraction, handy text utilities and an online editor – built for developers, writers and office workflows.',
    'hero.primaryCta': 'Get started',
    'hero.secondaryCta': 'Explore tools',

    'home.feature.title': 'Four core modules',
    'home.feature.desc':
      'Focused on real-world text & document workflows with lightweight, high-frequency tools.',

    'product.ocr.name': 'Image OCR & format conversion',
    'product.ocr.desc':
      'Upload PNG / JPG / WebP / TIFF and convert or extract text via OCR in one click.',
    'product.binary.name': 'Binary file text extraction',
    'product.binary.desc':
      'Extract clean, editable text from PDF, Word and image-like documents.',
    'product.textTools.name': 'Online text tools',
    'product.textTools.desc':
      'Remove line breaks, clean spaces, count words and format code directly in the browser.',
    'product.editText.name': 'Online text editor',
    'product.editText.desc':
      'Edit and clean up text in your browser, strip formatting and reflow paragraphs.',

    'footer.copyright': '© XYH.wiki',
    'footer.rights': 'All rights reserved'
  }
}

const I18nContext = createContext<I18nContextValue | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 默认使用英文
  const [locale, setLocale] = useState<Locale>('en')

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key: string) => dict[locale][key] ?? key,
      switchLocale: (next: Locale) => setLocale(next)
    }),
    [locale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
