"use strict";
// Shared icon; only explicitly marked App introductions use config.description.
(() => {
  const config = window.INTENT_SUPPORT || {};
  const assetsURL = new URL(".", document.currentScript.src);
  const description = document.querySelector("[data-brand-description]");
  const localized = config.description?.[document.documentElement.lang];
  if (description && localized) description.textContent = localized;

  const icon = document.getElementById("app-icon-image");
  const fallback = document.getElementById("app-icon-fallback");
  if (!config.icon || !icon || !fallback) return;
  icon.addEventListener("load", () => {
    icon.hidden = false;
    fallback.hidden = true;
    icon.parentElement.classList.add("has-image");
  });
  icon.addEventListener("error", () => {
    icon.hidden = true;
    fallback.hidden = false;
    icon.parentElement.classList.remove("has-image");
  });
  icon.src = new URL(config.icon, assetsURL).href;
})();
