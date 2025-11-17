/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Products overview page – show the four core modules
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'

export const ProductsIndex: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Products & services</h1>
          <p className="section-description">
            The platform focuses on four high-frequency text and document workflows. Each module has
            its own standalone site plus an overview page here.
          </p>
        </div>
        <div className="product-grid">
          <article className="product-card">
            <h2 className="product-card-title">Image OCR & format conversion</h2>
            <p className="product-card-desc">
              Upload screenshots and scanned images, convert formats and extract selectable text via
              OCR – ideal for study notes, documentation and daily office work.
            </p>
            <div className="product-card-meta">
              <div>Site: ocr.xyh.wiki</div>
              <div>Keywords: image to text, online OCR, TIFF/WebP OCR</div>
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
            <h2 className="product-card-title">Binary file text extraction</h2>
            <p className="product-card-desc">
              Extract clean, editable text from PDF, Word and image-like documents. Useful when you
              need the full content for editing or downstream processing.
            </p>
            <div className="product-card-meta">
              <div>Site: binaryextract.xyh.wiki</div>
              <div>Keywords: PDF text extract, document text extraction</div>
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
            <h2 className="product-card-title">Online text tools</h2>
            <p className="product-card-desc">
              Clean up messy text: remove extra line breaks, spaces and tabs, count words and
              characters, or format code and JSON snippets.
            </p>
            <div className="product-card-meta">
              <div>Site: text-tools.xyh.wiki</div>
              <div>Keywords: online text tools, remove line breaks, word counter</div>
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
            <h2 className="product-card-title">Online text editor & cleanup</h2>
            <p className="product-card-desc">
              Paste content from web pages or documents, strip formatting, adjust paragraphs and then
              copy or export the cleaned result.
            </p>
            <div className="product-card-meta">
              <div>Site: edittext.xyh.wiki</div>
              <div>Keywords: online text editor, clean pasted text</div>
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
    </>
  )
}
