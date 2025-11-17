
/**
 * @Author:XYH
 * @Date:2025-11-18
 * @Description: Terms of Service 页面 —— 用户协议（简版英文）
 */
import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="page page-terms">
      <h1>Terms of Service</h1>
      <p>
        By using this website, you agree that you are responsible for how you upload, process and distribute any
        images or text. You must not upload illegal, harmful or sensitive content.
      </p>
      <p>
        The tools are provided on an “as is” basis without warranties of any kind. The author is not liable for any
        damages, data loss or legal issues arising from your use of the tools or your chosen backend services.
      </p>
      <h2>Acceptable Use</h2>
      <ul>
        <li>Do not use the tools to process highly sensitive personal data.</li>
        <li>Do not use the site in violation of local or international laws.</li>
        <li>Do not attempt to attack, overload or reverse engineer the service.</li>
      </ul>
    </div>
  );
}
