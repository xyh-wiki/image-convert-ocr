/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Online text editor & cleanup product page
 */
import React from 'react'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'

export const EditTextProduct: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: 'Online text editor & cleanup' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Online text editor & cleanup (edittext.xyh.wiki)</h1>
          <p className="section-description">
            Paste content from Word, web pages or PDFs, then strip formatting, adjust paragraphs and
            export a clean version.
          </p>
        </div>
        <h2 className="section-title" style={{ fontSize: 18 }}>
          Example use cases
        </h2>
        <ul style={{ fontSize: 14, color: '#4b5563', paddingLeft: 18 }}>
          <li>Remove complex formatting when copying from rich text sources.</li>
          <li>Normalise spacing and paragraph breaks before publishing to a blog or documentation.</li>
          <li>Merge or split paragraphs, proofread and then copy the final text elsewhere.</li>
        </ul>

        <h2 className="section-title" style={{ fontSize: 18 }}>
          Open the online editor
        </h2>
        <p style={{ fontSize: 14, color: '#4b5563' }}>
          Use the dedicated editor for real editing workflows:
        </p>
        <a
          href="https://edittext.xyh.wiki/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Go to edittext.xyh.wiki
        </a>

        <h2 className="section-title" style={{ fontSize: 18, marginTop: 24 }}>
          SEO keywords & search questions
        </h2>
        <ul style={{ fontSize: 13, color: '#4b5563', paddingLeft: 18 }}>
          <li>How to clean copied text and remove formatting?</li>
          <li>Online text editor to standardize paragraphs</li>
          <li>How to fix spacing and line breaks in pasted text?</li>
          <li>How to convert rich text to plain text online?</li>
          <li>Online content cleanup tool for blog posts</li>
        </ul>
      </section>
    </>
  )
}
