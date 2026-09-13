"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import "./home-motion.css";

function useSequence(root: RefObject<HTMLDivElement | null>, count: number, delay: number) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    if (root.current) observer.observe(root.current);
    return () => { query.removeEventListener("change", sync); observer.disconnect(); };
  }, [root]);
  useEffect(() => {
    if (paused || hovered || focused || !visible || reduced || count < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((value) => (value + 1) % count);
    }, delay);
    return () => window.clearInterval(timer);
  }, [active, count, delay, paused, hovered, focused, visible, reduced]);
  return { active: Math.min(active, count - 1), setActive, paused, setPaused, reduced,
    events: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: React.FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
    },
  };
}

function Playback({ sequence, lang }: { sequence: ReturnType<typeof useSequence>; lang: string }) {
  if (sequence.reduced) return null;
  const label = sequence.paused ? (lang === "ar" ? "تشغيل التبديل التلقائي" : "Resume autoplay") : (lang === "ar" ? "إيقاف التبديل التلقائي" : "Pause autoplay");
  return <button type="button" className="motion-playback" title={label} aria-label={label} aria-pressed={sequence.paused} onClick={() => sequence.setPaused(!sequence.paused)}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{sequence.paused ? <path d="M4 2l10 6-10 6z" /> : <path d="M3 2h3v12H3zM10 2h3v12h-3z" />}</svg>
  </button>;
}

export function ServiceShowcase({ services, media, paths, more, lang }: {
  services: string[][]; media: string[]; paths: Record<string, string>; more: string; lang: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const sequence = useSequence(root, services.length, 6000);
  return <div ref={root} className="motion-services" {...sequence.events}>
    <div className="motion-service-list" role="group" aria-label={lang === "ar" ? "خدماتنا" : "Our services"}>
      {services.map((service, index) => <button key={service[0]} type="button" className={sequence.active === index ? "is-active" : ""}
        aria-pressed={sequence.active === index} aria-controls={`service-detail-${service[0]}`}
        onMouseEnter={() => sequence.setActive(index)} onFocus={() => sequence.setActive(index)} onClick={() => sequence.setActive(index)}>
        <span className="motion-index">{String(index + 1).padStart(2, "0")}</span><span>{service[1]}</span><span className="motion-arrow" aria-hidden="true">↗</span>
      </button>)}
      <Playback sequence={sequence} lang={lang} />
    </div>
    <div className="motion-service-panels">
      {services.map((service, index) => <article id={`service-detail-${service[0]}`} key={service[0]} className={`motion-service-panel ${sequence.active === index ? "is-active" : ""}`} aria-hidden={sequence.active !== index} inert={sequence.active !== index}>
        <div className="motion-service-image"><img src={media[Number(service[0]) - 1]} alt="" loading="lazy" decoding="async" /></div>
        <div className="motion-service-copy"><small>{String(index + 1).padStart(2, "0")} / 04</small><h3>{service[1]}</h3><p>{service[2]}</p><a href={`${paths[service[0]]}?lang=${lang}`}>{more} <span aria-hidden="true">↗</span></a></div>
      </article>)}
    </div>
  </div>;
}

export function RoadmapTravel({ years, lang }: { years: string[][]; lang: string }) {
  const root = useRef<HTMLDivElement>(null);
  const sequence = useSequence(root, years.length, 6500);
  return <div ref={root} className="motion-roadmap" {...sequence.events} style={{ "--stops": years.length, "--progress": `${years.length > 1 ? sequence.active / (years.length - 1) * 100 : 0}%` } as CSSProperties}>
    <div className="motion-roadmap-years" role="group" aria-label={lang === "ar" ? "مراحل خارطة الطريق" : "Roadmap milestones"}>
      <div className="motion-roadmap-line" aria-hidden="true"><span /><i /></div>
      {years.map((year, index) => <button key={year[0]} type="button" className={index === sequence.active ? "is-active" : ""} aria-pressed={index === sequence.active} aria-controls="roadmap-detail" onMouseEnter={() => sequence.setActive(index)} onFocus={() => sequence.setActive(index)} onClick={() => sequence.setActive(index)}><b>{year[0]}</b><span>{year[1]}</span></button>)}
    </div>
    <div className="motion-roadmap-detail" id="roadmap-detail">
      {years.map((year, index) => <article key={year[0]} className={index === sequence.active ? "is-active" : ""} aria-hidden={index !== sequence.active}><span aria-hidden="true">{year[0]}</span><h3>{year[1]}</h3></article>)}
      <Playback sequence={sequence} lang={lang} />
    </div>
  </div>;
}
