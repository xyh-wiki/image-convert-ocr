/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 语言切换组件（中英文），通过 i18n 上下文切换
 */
import React from 'react'
import { useI18n } from '../../i18n'

export const LanguageSwitcher: React.FC = () => {
  const { locale, switchLocale } = useI18n()
  const toggle = () => {
    switchLocale(locale === 'zh' ? 'en' : 'zh')
  }
  return (
    <button type="button" className="btn btn-outline" onClick={toggle}>
      {locale === 'zh' ? 'EN' : '中文'}
    </button>
  )
}
