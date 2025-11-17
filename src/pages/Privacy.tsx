/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Privacy policy page (short version)
 */
import React from 'react'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

export const Privacy: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Privacy Policy' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Privacy Policy (short notice)</h1>
          <p className="section-description">
            This page is a simplified draft and should be adapted to your actual deployment,
            logging and compliance requirements.
          </p>
        </div>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
          XYH Tools aims to respect user privacy. Only limited technical information is collected
          where necessary, such as basic access logs and aggregate usage statistics, in order to keep
          the service secure and reliable. For files and text processed via OCR or extraction, content
          is retained only briefly while tasks are running and is cleaned up periodically afterwards.
        </p>
      </section>
    </>
  )
}
