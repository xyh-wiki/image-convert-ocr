/**
 * @Author:XYH
 * @Date:2025-11-17
 * @Description: Contact page with a simple form
 */
import React, { useState } from 'react'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { useToast } from '../components/common/ToastContext'

export const Contact: React.FC = () => {
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'feedback',
    message: ''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      showToast(
        'Thanks for reaching out! The form was submitted on the frontend – please also feel free to contact via email.'
      )
      setForm({
        name: '',
        email: '',
        subject: '',
        type: 'feedback',
        message: ''
      })
    }, 800)
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Contact' }
        ]}
      />
      <section className="section">
        <div className="section-header">
          <h1 className="section-title">Contact</h1>
          <p className="section-description">
            For feature requests, bug reports or collaboration ideas, use the form below or send an
            email to <a href="mailto:xyh.wiki@gmail.com">xyh.wiki@gmail.com</a>.
          </p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label" htmlFor="name">
              Name (optional)
            </label>
            <input
              id="name"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              placeholder="How should we call you?"
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="email">
              Email (for replies)
            </label>
            <input
              id="email"
              name="email"
              className="form-input"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              className="form-input"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. OCR issue report / feature idea"
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="type">
              Category
            </label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={form.type}
              onChange={handleChange}
            >
              <option value="feedback">Feedback / idea</option>
              <option value="bug">Bug report</option>
              <option value="coop">Collaboration</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="message">
              Details
            </label>
            <textarea
              id="message"
              name="message"
              className="form-textarea"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your use case, problem or idea as clearly as possible."
              required
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
