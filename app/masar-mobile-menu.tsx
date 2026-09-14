"use client";

import { useEffect, useRef, useState } from "react";

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
  const drawer = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const sync = () => {
      const page = document.querySelector<HTMLElement>(".cx-page");
      const urlLang = new URLSearchParams(window.location.search).get("lang");
      const isArabic =
        page?.classList.contains("ar") ||
        page?.dir === "rtl" ||
        document.documentElement.dir === "rtl" ||
        urlLang === "ar";
      setLang(isArabic ? "ar" : "en");
    };

    sync();
    const bodyObserver = new MutationObserver(sync);
    bodyObserver.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "dir"],
    });
    const htmlObserver = new MutationObserver(sync);
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "dir", "lang"],
    });
    window.addEventListener("popstate", sync);

    return () => {
      bodyObserver.disconnect();
      htmlObserver.disconnect();
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("masar-mobile-menu-open", open);
    if (!open) return () => document.body.classList.remove("masar-mobile-menu-open");
    const previous = document.activeElement as HTMLElement | null;
    const first = drawer.current?.querySelector<HTMLButtonElement>("button");
    first?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab") return;
      const controls = Array.from(drawer.current?.querySelectorAll<HTMLElement>("button, a[href]") || []);
      const firstControl = controls[0];
      const lastControl = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === firstControl) { event.preventDefault(); lastControl?.focus(); }
      else if (!event.shiftKey && document.activeElement === lastControl) { event.preventDefault(); firstControl?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("masar-mobile-menu-open");
      document.removeEventListener("keydown", onKey);
      (previous || trigger.current)?.focus();
    };
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

  const rtl = lang === "ar";

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-controls="masar-mobile-navigation"
        className={`masar-mobile-rail ${rtl ? "is-ar" : "is-en"} ${open ? "is-open" : ""}`}
        data-lang={lang}
        style={rtl ? { left: 11, right: "auto" } : undefined}
        aria-label={rtl ? "فتح قائمة التنقل" : "Open navigation menu"}
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
        ref={drawer}
        id="masar-mobile-navigation"
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label={rtl ? "قائمة التنقل" : "Navigation menu"}
        inert={!open}
        className={`masar-mobile-drawer ${rtl ? "is-ar" : "is-en"} ${open ? "is-open" : ""}`}
        data-lang={lang}
        style={rtl ? {
          left: 0,
          right: "auto",
          borderLeft: 0,
          borderRight: "1px solid rgba(123,207,255,.14)",
          boxShadow: "28px 0 70px rgba(0,0,0,.34)",
          transform: open ? "translateX(0)" : "translateX(-104%)",
        } : undefined}
        aria-hidden={!open}
        dir={rtl ? "rtl" : "ltr"}
      >
        <div className="masar-mobile-drawer-head">
          <span>MASAR</span>
          <button type="button" onClick={() => setOpen(false)} aria-label={rtl ? "إغلاق القائمة" : "Close menu"}>×</button>
        </div>
        <nav aria-label={rtl ? "تنقل الجوال" : "Mobile navigation"}>
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
