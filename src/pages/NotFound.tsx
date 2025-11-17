/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: 404 page
 */
import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound: React.FC = () => {
  return (
    <section className="section">
      <div className="section-header">
        <h1 className="section-title">Page not found (404)</h1>
        <p className="section-description">
          The page you are looking for does not exist or has been moved. Go back to the homepage or
          use search to find what you need.
        </p>
      </div>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </section>
  )
}
