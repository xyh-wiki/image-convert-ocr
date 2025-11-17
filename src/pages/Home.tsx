/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 首页页面，包含 Hero、四大模块预览、Roadmap、FAQ 精选与联系入口
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export const Home: React.FC = () => {
  const { t } = useI18n()

  return (
    <>
      {/* Hero 区域 */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">{t('hero.eyebrow')}</div>
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-subtitle">{t('hero.subtitle')}</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                {t('hero.primaryCta')}
              </Link>
              <Link to="/products" className="btn btn-outline">
                {t('hero.secondaryCta')}
              </Link>
            </div>
            <div className="hero-metadata">
              <span>· Light theme by default</span>
              <span>· English first, Chinese optional</span>
              <span>· Focused on OCR & text tooling</span>
            </div>
          </div>
          <div className="hero-card">
            <h2 style={{ fontSize: 16, margin: '0 0 8px' }}>Four core modules</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
              <li>✅ Image OCR & format conversion（ocr.xyh.wiki）</li>
              <li>✅ Binary file text extraction（binaryextract.xyh.wiki）</li>
              <li>✅ Online text tools（text-tools.xyh.wiki）</li>
              <li>✅ Online text editor & cleanup（edittext.xyh.wiki）</li>
            </ul>
            <p style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
              Heavy big-data and cluster work stays in the backend. This homepage only surfaces clear,
              easy-to-use tools for everyday workflows.
            </p>
          </div>
        </div>
      </section>

      {/* 四大模块概览区（精简卡片） */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">PRODUCTS</div>
          <h2 className="section-title">{t('home.feature.title')}</h2>
          <p className="section-description">{t('home.feature.desc')}</p>
        </div>
        <div className="product-grid">
          <article className="product-card">
            <div>
              <h3 className="product-card-title">{t('product.ocr.name')}</h3>
              <p className="product-card-desc">{t('product.ocr.desc')}</p>
            </div>
            <div className="product-card-meta">
              <div>Domain: ocr.xyh.wiki</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <Link to="/products/ocr" className="btn btn-outline">
                  Details
                </Link>
                <a
                  href="https://ocr.xyh.wiki/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Open tool
                </a>
              </div>
            </div>
          </article>

          <article className="product-card">
            <div>
              <h3 className="product-card-title">{t('product.binary.name')}</h3>
              <p className="product-card-desc">{t('product.binary.desc')}</p>
            </div>
            <div className="product-card-meta">
              <div>Domain: binaryextract.xyh.wiki</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <Link to="/products/binary-extract" className="btn btn-outline">
                  Details
                </Link>
                <a
                  href="https://binaryextract.xyh.wiki/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Open tool
                </a>
              </div>
            </div>
          </article>

          <article className="product-card">
            <div>
              <h3 className="product-card-title">{t('product.textTools.name')}</h3>
              <p className="product-card-desc">{t('product.textTools.desc')}</p>
            </div>
            <div className="product-card-meta">
              <div>Domain: text-tools.xyh.wiki</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <Link to="/products/text-tools" className="btn btn-outline">
                  Details
                </Link>
                <a
                  href="https://text-tools.xyh.wiki/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Open tool
                </a>
              </div>
            </div>
          </article>

          <article className="product-card">
            <div>
              <h3 className="product-card-title">{t('product.editText.name')}</h3>
              <p className="product-card-desc">{t('product.editText.desc')}</p>
            </div>
            <div className="product-card-meta">
              <div>Domain: edittext.xyh.wiki</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <Link to="/products/edit-text" className="btn btn-outline">
                  Details
                </Link>
                <a
                  href="https://edittext.xyh.wiki/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Open tool
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 未来开发规划区 */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">ROADMAP</div>
          <h2 className="section-title">Roadmap & future ideas</h2>
          <p className="section-description">
            Big-data & cluster capabilities will power more professional features behind these simple
            tools, without exposing complexity to end-users.
          </p>
        </div>
        <ul style={{ fontSize: 13, color: '#4b5563', paddingLeft: 18 }}>
          <li>Expose batch OCR / text extraction via REST APIs for developers.</li>
          <li>Enhance search and filtering across tools and documentation.</li>
          <li>Explore self-hosted / enterprise editions with stronger compliance and data control.</li>
        </ul>
      </section>

      {/* FAQ 精选区 */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-title">Selected questions</h2>
        </div>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">Do you store my files permanently?</div>
            <div className="faq-answer">
              Files and text are only kept temporarily while your OCR or extraction job is running.
              They are regularly cleaned up afterwards and are not meant for long-term storage.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">Is everything free to use?</div>
            <div className="faq-answer">
              For now, all tools are free for personal and developer use, with reasonable rate limits
              to protect the service. Any future paid or quota model will be clearly documented.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">Is there an API or batch mode?</div>
            <div className="faq-answer">
              The main entry today is the web UI. Batch and API access are on the roadmap – if you care
              about this, please reach out on the contact page so it can be prioritised.
            </div>
          </div>
        </div>
      </section>

      {/* Popular SEO queries */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">SEO QUERIES</div>
          <h2 className="section-title">Popular search questions</h2>
          <p className="section-description">
            These are typical queries people use when looking for tools like this platform.
          </p>
        </div>
        <ul style={{ fontSize: 13, color: '#4b5563', paddingLeft: 18 }}>
          <li>How to OCR an image to text online?</li>
          <li>How to convert WebP or TIFF to PNG and extract text?</li>
          <li>How to extract text from PDF or Word in the browser?</li>
          <li>How to remove extra line breaks or spaces from text?</li>
          <li>How to standardize JSON format or pretty-print JSON online?</li>
          <li>How to clean copied text and remove rich formatting?</li>
        </ul>
      </section>

      {/* 联系入口区 */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">CONTACT</div>
          <h2 className="section-title">Feature ideas or collaboration?</h2>
          <p className="section-description">
            If you have suggestions around OCR, text extraction or text tools, feel free to reach out.
          </p>
        </div>
        <Link to="/contact" className="btn btn-primary">
          Go to contact form
        </Link>
      </section>
    </>
  )
}
