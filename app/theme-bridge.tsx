"use client";

import { useEffect } from "react";

const THEME_KEY = "amaala";

function applyTheme(theme?: string) {
  const enabled = theme === THEME_KEY;
  document.body.dataset.masarTheme = enabled ? THEME_KEY : theme || "masar";
  const page = document.querySelector<HTMLElement>(".cx-page");
  if (!page) return;
  page.classList.toggle("theme-amaala", enabled);
}

async function readConfig() {
  const response = await fetch("/api/site-config", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to read site configuration");
  return response.json();
}

async function activateAmaala() {
  const result = await readConfig();
  const config = { ...(result.config || {}), theme: THEME_KEY };
  const response = await fetch("/api/site-config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config }),
  });
  if (!response.ok) throw new Error("Unable to save theme");
  applyTheme(THEME_KEY);
  window.location.reload();
}

function injectAdminOption() {
  const grid = document.querySelector<HTMLElement>(".theme-grid");
  if (!grid || grid.querySelector('[data-theme-option="amaala"]')) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = `theme-option ${document.body.dataset.masarTheme === THEME_KEY ? "selected" : ""}`;
  button.dataset.themeOption = THEME_KEY;
  button.innerHTML = `
    <span class="theme-preview preview-amaala"><i></i><i></i><i></i></span>
    <b>Amaala Light</b>
    <span class="theme-identity">Coastal Editorial</span>
    <small>هوية فاتحة هادئة مستوحاة من الفخامة الساحلية والتحريرية</small>
    ${document.body.dataset.masarTheme === THEME_KEY ? "<em>مفعّل</em>" : ""}
  `;
  button.addEventListener("click", async () => {
    button.setAttribute("disabled", "true");
    try {
      await activateAmaala();
    } catch {
      button.removeAttribute("disabled");
      window.alert("تعذر حفظ الثيم. تأكد من تسجيل الدخول ثم حاول مجددًا.");
    }
  });
  grid.appendChild(button);
}

export default function ThemeBridge() {
  useEffect(() => {
    readConfig()
      .then((result) => applyTheme(result.config?.theme))
      .catch(() => applyTheme("masar"));

    const observer = new MutationObserver(() => {
      injectAdminOption();
      if (document.body.dataset.masarTheme === THEME_KEY) applyTheme(THEME_KEY);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    injectAdminOption();
    return () => observer.disconnect();
  }, []);

  return null;
}
