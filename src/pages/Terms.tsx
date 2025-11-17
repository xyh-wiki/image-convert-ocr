/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Terms of service page (short version)
 */
import React from 'react'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

export const Terms: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Terms of Service' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Terms of Service (short notice)</h1>
          <p className="section-description">
            Using this website and its tools means you agree to the basic terms below. The text here
            is a draft and should be adjusted for your jurisdiction.
          </p>
        </div>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
          Users are responsible for ensuring that their use of the service complies with applicable
          laws and does not infringe the rights of others. It is prohibited to use these tools for
          illegal purposes or to upload content that violates third-party rights. While the platform
          strives for stability and accuracy, it cannot guarantee uninterrupted availability or
          error-free output, especially when external services or networks are involved.
        </p>
      </section>
    </>
  )
}
