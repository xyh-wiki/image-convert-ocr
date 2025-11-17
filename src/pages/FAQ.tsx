/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: FAQ page
 */
import React from 'react'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

export const FAQ: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'FAQ' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Frequently asked questions</h1>
        </div>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">Do you store my files?</div>
            <div className="faq-answer">
              Files and text are stored only as long as needed to run OCR or extraction tasks. After
              processing, they are cleaned up according to backend retention policies, and are not
              intended for long-term storage.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">Are there size or usage limits?</div>
            <div className="faq-answer">
              The platform is currently free for individual and developer use, with reasonable limits
              to prevent abuse. Any future quota or paid plans will be clearly described on the site.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">Is there an API?</div>
            <div className="faq-answer">
              Today the web interface is the main entry point. A public REST API and batch processing
              endpoints are on the roadmap, and user feedback will help prioritise them.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">How is my privacy protected?</div>
            <div className="faq-answer">
              The platform aims to collect only minimal technical information required to keep the
              service running (such as logs and aggregate statistics). For file content, processing
              is focused on the task at hand and not on building personal profiles. See the Privacy
              Policy page for more details.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
