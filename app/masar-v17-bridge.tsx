"use client";

import { useEffect } from "react";

function patchSaudiRoutes() {
  const page = document.querySelector<HTMLElement>(".cx-page.theme-masar.home-page");
  if (!page) return;
  const svg = page.querySelector<SVGSVGElement>(".masar-routes-v16");
  if (!svg || svg.dataset.saudihub === "1") return;

  svg.innerHTML = `
    <defs>
      <linearGradient id="masarRouteGradientV16" x1="0" x2="1">
        <stop offset="0%" stop-color="#78e7ff" stop-opacity=".92" />
        <stop offset="18%" stop-color="#67a9ff" stop-opacity=".82" />
        <stop offset="72%" stop-color="#58e0ff" stop-opacity=".72" />
        <stop offset="100%" stop-color="#68a8ff" stop-opacity="0" />
      </linearGradient>
    </defs>

    <path class="route" d="M900 520 C 865 403, 815 310, 752 246" />
    <path class="route soft" d="M900 520 C 1080 430, 1275 425, 1480 500" />
    <path class="route" d="M900 520 C 1045 295, 1268 183, 1518 206" />
    <path class="route soft" d="M900 520 C 824 605, 706 656, 575 681" />
    <path class="route" d="M900 520 C 1060 385, 1248 320, 1450 300" />

    <circle class="route-hub-ring" cx="900" cy="520" r="13" />
    <circle class="route-hub-dot" cx="900" cy="520" r="3.2" />
    <text class="route-hub-label" x="914" y="514">Saudi Arabia</text>
  `;
  svg.dataset.saudihub = "1";
}

export default function MasarV17Bridge() {
  useEffect(() => {
    patchSaudiRoutes();
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        patchSaudiRoutes();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
