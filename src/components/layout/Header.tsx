/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 站点头部导航栏，包含主导航、搜索入口与语言切换
 */
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LanguageSwitcher } from '../common/LanguageSwitcher'
import { SearchModal } from '../common/SearchModal'
import { useI18n } from '../../i18n'

export const Header: React.FC = () => {
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navLinks = (
    <>
      <NavLink to="/" end>
        {t('nav.home')}
      </NavLink>
      <NavLink to="/about">{t('nav.about')}</NavLink>
      <NavLink to="/products">{t('nav.products')}</NavLink>
      <NavLink to="/faq">{t('nav.faq')}</NavLink>
      <NavLink to="/contact">{t('nav.contact')}</NavLink>
    </>
  )

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            XYH Tools
          </Link>
          <span className="nav-tagline">Online text & file tools</span>
        </div>
        <nav className="nav-links">{navLinks}</nav>
        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-outline"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            🔍
          </button>
          <LanguageSwitcher />
          <button
            type="button"
            className="nav-toggle"
            aria-label="Open menu"
            onClick={() => setMobileOpen(open => !open)}
          >
            ☰
          </button>
        </div>
      </div>
      {/* 移动端抽屉菜单 */}
      {mobileOpen && (
        <div className="container" style={{ paddingBottom: 8 }}>
          <nav className="nav-links" style={{ display: 'flex', flexDirection: 'column' }}>
            {navLinks}
          </nav>
        </div>
      )}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
