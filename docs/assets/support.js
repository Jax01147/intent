"use strict";
(() => {
  const config = window.INTENT_SUPPORT || {};
  const language = document.documentElement.lang;
  const zh = language === "zh-Hant";
  const text = zh ? {
    missing: "未提供", copied: "已複製，可貼到支援信件。",
    fallback: "無法自動複製。文字已選取，請按 ⌘C（Windows：Ctrl+C）複製。",
    opening: "已請求開啟郵件 App。若沒有反應，請複製資訊，並使用上方信箱手動寄信。",
    subject: "Intent 支援請求", issue: "[請描述問題]", steps: "[請填寫重現步驟]",
    expected: "[預期應該發生什麼]", actual: "[實際發生什麼]",
    url: "[有問題的網站網址，選填]", attachment: "[請視需要附上已遮蔽個資的截圖]"
  } : {
    missing: "Not provided", copied: "Copied. You can paste this into your support email.",
    fallback: "Automatic copy is unavailable. Text is selected; press ⌘C (Windows: Ctrl+C).",
    opening: "Your email app has been requested. If nothing opens, copy the details and email the address above manually.",
    subject: "Intent support request", issue: "[Describe the issue]", steps: "[Steps to reproduce]",
    expected: "[What you expected]", actual: "[What actually happened]",
    url: "[Affected website URL, optional]", attachment: "[Attach a screenshot with personal information hidden, if helpful]"
  };

  const report = document.getElementById("report");
  const fields = ["app-version", "os-version", "browser-version"];
  const status = document.getElementById("status");
  const contact = document.getElementById("email-address");
  const emailButton = document.getElementById("email-button");
  const copyButton = document.getElementById("copy-button");
  const configuredEmail = typeof config.email === "string" ? config.email.trim() : "";
  // Do not turn the unfinished template into an email to a sample address.
  const emailReady = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(configuredEmail)
    && !/@(?:example\.(?:com|org|net)|yourdomain\.com)$/i.test(configuredEmail);

  function value(id) {
    return document.getElementById(id).value.trim().replace(/[\r\n]/g, " ") || text.missing;
  }
  function updateReport() {
    report.value = [
      "Intent — Support", "",
      `App version: ${value("app-version")}`,
      `macOS version: ${value("os-version")}`,
      `Affected browser / version: ${value("browser-version")}`,
      `Support page browser (UA): ${navigator.userAgent.slice(0, 400)}`,
      `Browser language: ${navigator.language}`, "",
      `Issue: ${text.issue}`, `Steps: ${text.steps}`,
      `Expected: ${text.expected}`, `Actual: ${text.actual}`,
      `Website: ${text.url}`, `Screenshot: ${text.attachment}`
    ].join("\n");
  }

  if (emailReady) {
    contact.textContent = configuredEmail;
    contact.href = `mailto:${encodeURIComponent(configuredEmail)}`;
    contact.hidden = false;
    document.getElementById("email-pending").hidden = true;
    emailButton.disabled = false;
  } else {
    contact.hidden = true;
    document.getElementById("email-pending").hidden = false;
  }

  fields.forEach(id => document.getElementById(id).addEventListener("input", () => {
    updateReport();
    status.textContent = "";
  }));
  copyButton.disabled = false;
  copyButton.addEventListener("click", async () => {
    updateReport();
    try {
      await navigator.clipboard.writeText(report.value);
      status.textContent = text.copied;
    } catch {
      document.getElementById("report-details").open = true;
      report.focus();
      report.select();
      status.textContent = text.fallback;
    }
  });
  emailButton.addEventListener("click", () => {
    if (!emailReady) return;
    updateReport();
    const mailto = `mailto:${encodeURIComponent(configuredEmail)}`
      + `?subject=${encodeURIComponent(text.subject)}`
      + `&body=${encodeURIComponent(report.value)}`;
    status.textContent = text.opening;
    // Opens a draft. The user reviews, attaches screenshots, and sends it themselves.
    window.location.href = mailto;
  });
  updateReport();
})();
