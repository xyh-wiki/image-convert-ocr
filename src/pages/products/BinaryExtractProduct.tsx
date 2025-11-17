/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Binary file text extraction product page
 */
import React from 'react'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'

export const BinaryExtractProduct: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: 'Binary file text extraction' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Binary file text extraction (binaryextract.xyh.wiki)</h1>
          <p className="section-description">
            Extract clean text from PDF, Word and image-like documents without installing heavy
            desktop software.
          </p>
        </div>
        <h2 className="section-title" style={{ fontSize: 18 }}>
          Supported file types
        </h2>
        <p style={{ fontSize: 14, color: '#4b5563' }}>
          Without exposing backend implementation details, the service can be described as supporting
          mainstream PDF and Office documents (such as Word), as well as certain image-based formats
          that need OCR-assisted extraction. Internally this is powered by dedicated file-type
          detection and parsing components.
        </p>

        <h2 className="section-title" style={{ fontSize: 18 }}>
          Example use cases
        </h2>
        <ul style={{ fontSize: 14, color: '#4b5563', paddingLeft: 18 }}>
          <li>Pull the full text out of contracts, reports and manuals stored as PDF.</li>
          <li>Bulk extract content from Word documents before migrating into a new system.</li>
          <li>Quickly inspect document content on machines where Office software is not installed.</li>
        </ul>

        <h2 className="section-title" style={{ fontSize: 18 }}>
          Open the binary extract tool
        </h2>
        <p style={{ fontSize: 14, color: '#4b5563' }}>
          For real-world usage, visit the dedicated tool site:
        </p>
        <a
          href="https://binaryextract.xyh.wiki/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Go to binaryextract.xyh.wiki
        </a>

        <h2 className="section-title" style={{ fontSize: 18, marginTop: 24 }}>
          SEO keywords & search questions
        </h2>
        <ul style={{ fontSize: 13, color: '#4b5563', paddingLeft: 18 }}>
          <li>How to extract text from PDF online?</li>
          <li>How to convert PDF or Word to plain text?</li>
          <li>Binary file text extractor for documents</li>
          <li>How to read PDF text without installing software?</li>
          <li>Online tool to extract full text from PDF and DOCX</li>
        </ul>
      </section>
    </>
  )
}
