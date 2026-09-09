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
      setLang(page?.classList.contains("ar") || page?.dir === "rtl" ? "ar" : "en");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class", "dir"] });
    return () => observer.disconnect();
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

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-controls="masar-mobile-navigation"
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
        ref={drawer}
        id="masar-mobile-navigation"
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label={lang === "ar" ? "قائمة التنقل" : "Navigation menu"}
        inert={!open}
        className={`masar-mobile-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="masar-mobile-drawer-head">
          <span>MASAR</span>
          <button type="button" onClick={() => setOpen(false)} aria-label={lang === "ar" ? "إغلاق القائمة" : "Close menu"}>×</button>
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
