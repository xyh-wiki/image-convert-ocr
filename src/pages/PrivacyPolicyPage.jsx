
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: Privacy Policy 页面 —— 隐私政策（简版英文）
 */
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="page page-privacy">
      <h1>Privacy Policy</h1>
      <p>
        This website is a pure front‑end application. It does not directly store or track your images or text. However,
        when you use OCR or image conversion, your browser may send data to the backend API endpoint you configure.
      </p>
      <p>
        Please make sure that your chosen backend service complies with your local privacy laws and that you understand
        how it stores and processes data.
      </p>
      <h2>Analytics</h2>
      <p>
        If you enable analytics (such as Umami or similar tools), only aggregated, non‑identifying metrics are used to
        understand general usage patterns.
      </p>
      <h2>Cookies</h2>
      <p>
        The site is designed to work without tracking cookies. Any cookies that appear come from external services you
        choose to integrate (for example, analytics or ads).
      </p>
    </div>
  );
}
