/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Image OCR & format conversion product page
 */
import React from 'react'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'

export const OcrProduct: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: 'Image OCR & format conversion' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Image OCR & format conversion (ocr.xyh.wiki)</h1>
          <p className="section-description">
            Upload screenshots, scans and image-based documents, convert them to standard formats and
            extract selectable text through OCR.
          </p>
        </div>
        <p style={{ fontSize: 14, color: '#4b5563' }}>
          Typical formats include PNG, JPG/JPEG, WebP, TIFF, BMP, GIF and more. You can convert less
          common formats such as WebP and TIFF into more universal PNG or JPG, while performing OCR
          at the same time.
        </p>

        <h2 className="section-title" style={{ fontSize: 18 }}>
          Example use cases
        </h2>
        <ul style={{ fontSize: 14, color: '#4b5563', paddingLeft: 18 }}>
          <li>Turn course slides or printed materials into editable notes via OCR.</li>
          <li>Extract text from scanned contracts, invoices or receipts for quick record keeping.</li>
          <li>Convert WebP or TIFF images to PNG/JPG while capturing the text content.</li>
        </ul>

        <h2 className="section-title" style={{ fontSize: 18 }}>
          Open the dedicated OCR tool
        </h2>
        <p style={{ fontSize: 14, color: '#4b5563' }}>
          The actual OCR experience lives on a separate site optimised for file upload workflows:
        </p>
        <a
          href="https://ocr.xyh.wiki/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Go to ocr.xyh.wiki
        </a>

        <h2 className="section-title" style={{ fontSize: 18, marginTop: 24 }}>
          SEO keywords & search questions
        </h2>
        <ul style={{ fontSize: 13, color: '#4b5563', paddingLeft: 18 }}>
          <li>How to OCR an image to text online?</li>
          <li>How to convert WebP to PNG and extract text?</li>
          <li>How to OCR TIFF images in the browser?</li>
          <li>Online OCR tool for scanned PDFs and screenshots</li>
          <li>Free image to text converter for study notes</li>
        </ul>
      </section>
    </>
  )
}
