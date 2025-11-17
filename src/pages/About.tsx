/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: About page – introduce project background and goals
 */
import React from 'react'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

export const About: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'About' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">About XYH Tools</h1>
          <p className="section-description">
            XYH Tools is a collection of lightweight web utilities built on top of real-world
            document-processing and big-data capabilities.
          </p>
        </div>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
          In large-scale legal and data projects, there is a constant need to process PDF, Word,
          HTML and image-based documents: extracting text, cleaning formats, and preparing data
          for further analysis. The heavy lifting is usually handled by complex backends and big-data
          pipelines that are not accessible to everyday users.
        </p>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
          This website exposes a thin, friendly layer on top of that experience. The focus is on
          four simple modules – image OCR & format conversion, binary file text extraction, online
          text tools, and an online editor – so that developers, writers, students and office users
          can solve common text problems directly in the browser without worrying about infrastructure.
        </p>
      </section>
    </>
  )
}
