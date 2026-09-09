"use client";

import { useEffect, useState } from "react";

const items = {
  en: [
    ["About Masar", "about"],
    ["Services", "services"],
    ["Method", "method"],
    ["FAQ", "faq"],
    ["Packages & Pricing", "services"],
  ],
  ar: [
    ["عن مسار", "about"],
    ["الخدمات", "services"],
    ["المنهجية", "method"],
    ["الأسئلة الشائعة", "faq"],
    ["الباقات والأسعار", "services"],
  ],
} as const;

export default function MasarMobileMenu() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const sync = () => {
      const page = document.querySelector<HTMLElement>(".cx-page");
      setLang(page?.classList.contains("ar") || page?.dir === "rtl" ? "ar" : "en");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class", "dir"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("masar-mobile-menu-open", open);
    return () => document.body.classList.remove("masar-mobile-menu-open");
  }, [open]);

  const navigate = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.assign(`/?lang=${lang}#${id}`);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        className={`masar-mobile-rail ${open ? "is-open" : ""}`}
        aria-label={lang === "ar" ? "فتح قائمة التنقل" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`masar-mobile-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`masar-mobile-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="masar-mobile-drawer-head">
          <span>MASAR</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
        </div>
        <nav aria-label={lang === "ar" ? "تنقل الجوال" : "Mobile navigation"}>
          {items[lang].map(([label, id], index) => (
            <button key={`${label}-${index}`} type="button" onClick={() => navigate(id)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{label}</b>
              <i>↗</i>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
