
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: Contact 页面 —— 联系表单 + 邮箱展示
 */
import React, { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !message) {
      setToast("Please fill in at least your email and message.");
      return;
    }
    setSubmitting(true);
    setToast("");

    // 纯前端项目，这里仅做前端模拟提交
    setTimeout(() => {
      setSubmitting(false);
      setToast("Thank you! Your message has been recorded locally.");
      setName("");
      setEmail("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="page page-contact">
      <h1>Contact Us</h1>
      <p>
        You can send feedback or questions directly to{" "}
        <a href="mailto:xyh.wiki@gmail.com">xyh.wiki@gmail.com</a>, or use the form below.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Name (optional)
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Email *
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Message *
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
            ></textarea>
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </div>
      </form>

      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}
