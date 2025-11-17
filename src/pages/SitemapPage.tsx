/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Sitemap page – list the main routes
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

export const SitemapPage: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Sitemap' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Sitemap</h1>
        </div>
        <ul style={{ fontSize: 14, color: '#4b5563', paddingLeft: 18 }}>
          <li>
            <Link to="/">/ — Home</Link>
          </li>
          <li>
            <Link to="/about">/about — About</Link>
          </li>
          <li>
            <Link to="/products">/products — Products</Link>
            <ul>
              <li>
                <Link to="/products/ocr">/products/ocr — Image OCR & format conversion</Link>
              </li>
              <li>
                <Link to="/products/binary-extract">
                  /products/binary-extract — Binary file text extraction
                </Link>
              </li>
              <li>
                <Link to="/products/text-tools">/products/text-tools — Online text tools</Link>
              </li>
              <li>
                <Link to="/products/edit-text">
                  /products/edit-text — Online text editor & cleanup
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/faq">/faq — FAQ</Link>
          </li>
          <li>
            <Link to="/contact">/contact — Contact</Link>
          </li>
          <li>
            <Link to="/privacy">/privacy — Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms">/terms — Terms of Service</Link>
          </li>
          <li>
            <Link to="/sitemap">/sitemap — Sitemap</Link>
          </li>
          <li>
            <Link to="/search">/search — Search</Link>
          </li>
        </ul>
      </section>
    </>
  )
}
