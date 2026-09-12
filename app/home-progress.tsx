"use client";

import { useEffect, useRef, useState } from "react";

const ids = ["top", "about", "services", "method", "faq", "contact"];

export default function HomeProgress({ lang }: { lang: "en" | "ar" }) {
  const rail = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const labels = lang === "ar" ? ["البداية", "عن مسار", "الخدمات", "المنهجية", "الأسئلة", "التواصل"] : ["Home", "About", "Services", "Method", "FAQ", "Contact"];

  useEffect(() => {
    const sections = ids.map(id => document.getElementById(id));
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.35;
      const tops = sections.map(section => section?.getBoundingClientRect().top ?? Infinity);
      let current = 0;
      tops.forEach((top, index) => { if (top <= marker) current = index; });
      const span = tops[current + 1] - tops[current];
      const part = current === ids.length - 1 ? 0 : Math.max(0, Math.min(1, (marker - tops[current]) / span));
      rail.current?.style.setProperty("--hp-progress", String((current + part) / (ids.length - 1)));
      setActive(previous => previous === current ? previous : current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    sections.forEach(section => { if (section) observer.observe(section); });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav ref={rail} className="hp-progress-nav" aria-label={lang === "ar" ? "أقسام الصفحة" : "Page sections"}>
      <span className="hp-progress-track" aria-hidden="true"><span /></span>
      <div className="hp-progress-stops">
        {ids.map((id, index) => <a key={id} href={`#${id}`} aria-label={labels[index]} aria-current={active === index ? "location" : undefined}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></a>)}
      </div>
      <span key={active} className="hp-progress-label" aria-hidden="true">{labels[active]}</span>
    </nav>
  );
}
