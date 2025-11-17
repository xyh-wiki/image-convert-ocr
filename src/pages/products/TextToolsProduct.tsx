/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Online text tools product page
 */
import React from 'react'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'

export const TextToolsProduct: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: 'Online text tools' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Online text tools (text-tools.xyh.wiki)</h1>
          <p className="section-description">
            A hub of small utilities for cleaning, transforming and inspecting text directly in the
            browser.
          </p>
        </div>
        <h2 className="section-title" style={{ fontSize: 18 }}>
          Typical tools
        </h2>
        <ul style={{ fontSize: 14, color: '#4b5563', paddingLeft: 18 }}>
          <li>Remove extra line breaks and merge lines.</li>
          <li>Clean up extra spaces, tabs and invisible characters.</li>
          <li>Word and character counters for articles or posts.</li>
          <li>JSON / SQL / code formatting and indentation helpers.</li>
        </ul>

        <h2 className="section-title" style={{ fontSize: 18 }}>
          Open the text tools hub
        </h2>
        <p style={{ fontSize: 14, color: '#4b5563' }}>
          All the micro tools are grouped on a dedicated site:
        </p>
        <a
          href="https://text-tools.xyh.wiki/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Go to text-tools.xyh.wiki
        </a>

        <h2 className="section-title" style={{ fontSize: 18, marginTop: 24 }}>
          SEO keywords & search questions
        </h2>
        <ul style={{ fontSize: 13, color: '#4b5563', paddingLeft: 18 }}>
          <li>How to remove line breaks from text online?</li>
          <li>How to standardize JSON format or pretty-print JSON?</li>
          <li>Online word counter for blog posts and essays</li>
          <li>Online tool to clean whitespace and tabs</li>
          <li>How to format SQL or code snippets in the browser?</li>
        </ul>
      </section>
    </>
  )
}
