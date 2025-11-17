/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 页脚组件，包含版权、友情链接、法律声明与社交媒体链接
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n'

export const Footer: React.FC = () => {
  const { t } = useI18n()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div>{t('footer.copyright')}</div>
          <div>{t('footer.rights')}</div>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/sitemap">Sitemap</Link>
        </div>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <div className="footer-social">
          <a href="mailto:xyh.wiki@gmail.com">xyh.wiki@gmail.com</a>
          <a href="https://github.com/xyh-wiki" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
