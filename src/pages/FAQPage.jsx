
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: FAQ 页面 —— 常见问答
 */
import React from "react";

const faqs = [
  {
    q: "Is the OCR tool free to use?",
    a: "Yes, the front‑end interface is free. Depending on the backend API you connect, there may be usage limits or costs.",
  },
  {
    q: "Do you store my images or text?",
    a: "The front‑end itself does not store your data. Any storage behavior depends on the backend OCR / conversion service you configure.",
  },
  {
    q: "What image formats are supported?",
    a: "Common formats such as PNG, JPEG, WebP, BMP, GIF and TIFF are supported, depending on the backend service.",
  },
  {
    q: "Is there an API?",
    a: "The UI is prepared to call an external API. You can point the BASE_URL in the configuration to your own OCR / image service.",
  },
  {
    q: "Can I use this for commercial projects?",
    a: "Yes, as long as your backend and deployment comply with your local laws and service terms.",
  },
];

export default function FAQPage() {
  return (
    <div className="page page-faq">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((item, idx) => (
          <div className="faq-item" key={idx}>
            <h2 className="faq-question">{item.q}</h2>
            <p className="faq-answer">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
