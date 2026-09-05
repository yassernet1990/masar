"use client";

import { useState } from "react";

export default function UKCompanyBadge() {
  const [replay, setReplay] = useState(0);
  return (
    <div className="uk-company-badge" dir="ltr" lang="en"
      onPointerEnter={() => setReplay((value) => value + 1)}
      onPointerDown={() => setReplay((value) => value + 1)}>
      <span className="uk-company-art" key={replay}>
        <span className="uk-company-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" width="66" height="44" xmlns="http://www.w3.org/2000/svg">
            <clipPath id="uk-flag-bounds"><path d="M0 0h60v40H0z" /></clipPath>
            <g clipPath="url(#uk-flag-bounds)">
              <path fill="#012169" d="M0 0h60v40H0z" />
              <path stroke="#fff" strokeWidth="8" d="m0 0 60 40M60 0 0 40" />
              <path stroke="#c8102e" strokeWidth="2.7" d="m0 0 30 20m30 20L30 20M60 0 30 20M0 40l30-20" />
              <path stroke="#fff" strokeWidth="13" d="M30 0v40M0 20h60" />
              <path stroke="#c8102e" strokeWidth="8" d="M30 0v40M0 20h60" />
            </g>
          </svg>
        </span>
        <span className="uk-company-text"><b>UK</b><small>Registered Company</small></span>
      </span>
    </div>
  );
}
