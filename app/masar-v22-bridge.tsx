"use client";

import { useEffect } from "react";

const VIEWBOX_W = 1600;
const VIEWBOX_H = 900;
const MAP_ASPECT = 2;
const SAUDI_CENTER = { lon: 45.0792, lat: 23.8859 };

function parseMapWidthRatio(value: string) {
  const layer = value.split(",").pop()?.trim() || "86% auto";
  const match = layer.match(/(-?\d+(?:\.\d+)?)%/);
  return match ? Number(match[1]) / 100 : 0.86;
}

function parseMapPosition(value: string) {
  const layer = value.split(",").pop()?.trim() || "62% 53%";
  const matches = layer.match(/-?\d+(?:\.\d+)?%/g) || [];
  return {
    x: matches[0] ? Number(matches[0].replace("%", "")) / 100 : 0.62,
    y: matches[1] ? Number(matches[1].replace("%", "")) / 100 : 0.53,
  };
}

function getSaudiHub(hero: HTMLElement, art: HTMLElement) {
  const heroRect = hero.getBoundingClientRect();
  const artRect = art.getBoundingClientRect();
  const style = getComputedStyle(art);

  const baseW = art.offsetWidth || artRect.width;
  const baseH = art.offsetHeight || artRect.height;
  const scaleX = baseW ? artRect.width / baseW : 1;
  const scaleY = baseH ? artRect.height / baseH : 1;

  const widthRatio = parseMapWidthRatio(style.backgroundSize);
  const position = parseMapPosition(style.backgroundPosition);
  const mapW = baseW * widthRatio;
  const mapH = mapW / MAP_ASPECT;
  const mapX = (baseW - mapW) * position.x;
  const mapY = (baseH - mapH) * position.y;

  const worldX = (SAUDI_CENTER.lon + 180) / 360;
  const worldY = (90 - SAUDI_CENTER.lat) / 180;
  const screenX = artRect.left + (mapX + mapW * worldX) * scaleX;
  const screenY = artRect.top + (mapY + mapH * worldY) * scaleY;

  return {
    x: ((screenX - heroRect.left) / heroRect.width) * VIEWBOX_W,
    y: ((screenY - heroRect.top) / heroRect.height) * VIEWBOX_H,
  };
}

function createOverlay(hero: HTMLElement) {
  let svg = hero.querySelector<SVGSVGElement>(".masar-routes-v22");
  if (svg) return svg;

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "masar-routes-v22");
  svg.setAttribute("viewBox", `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <defs>
      <linearGradient id="masarRouteGradientV22" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#79e8ff" stop-opacity=".98" />
        <stop offset="18%" stop-color="#69b7ff" stop-opacity=".92" />
        <stop offset="74%" stop-color="#5edcff" stop-opacity=".72" />
        <stop offset="100%" stop-color="#5ea8ff" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path class="route route-up-left" />
    <path class="route route-up-right" />
    <path class="route route-east" />
    <circle class="route-hub-ring" r="12" />
    <circle class="route-hub-dot" r="3" />
    <text class="route-hub-label">Saudi Arabia</text>
  `;
  hero.appendChild(svg);
  return svg;
}

function setPath(svg: SVGSVGElement, selector: string, d: string) {
  svg.querySelector<SVGPathElement>(selector)?.setAttribute("d", d);
}

function renderRoutes() {
  const hero = document.querySelector<HTMLElement>(".home-page .cx-hero");
  const art = hero?.querySelector<HTMLElement>(".hero-art");
  if (!hero || !art) return;

  const svg = createOverlay(hero);
  const hub = getSaudiHub(hero, art);
  const hx = Math.max(0, Math.min(VIEWBOX_W, hub.x));
  const hy = Math.max(0, Math.min(VIEWBOX_H, hub.y));

  // Exactly three routes:
  // 1) upper-left rising route
  // 2) upper-right rising route beside it
  // 3) eastbound route raised clearly above the hub level
  setPath(svg, ".route-up-left", `M ${hx} ${hy} C ${hx - 42} ${hy - 112}, ${hx - 112} ${hy - 225}, ${hx - 205} ${hy - 334}`);
  setPath(svg, ".route-up-right", `M ${hx} ${hy} C ${hx + 6} ${hy - 120}, ${hx + 55} ${hy - 238}, ${hx + 122} ${hy - 342}`);
  setPath(svg, ".route-east", `M ${hx} ${hy} C ${hx + 172} ${hy - 78}, ${hx + 390} ${hy - 82}, 1518 ${hy - 52}`);

  const ring = svg.querySelector<SVGCircleElement>(".route-hub-ring");
  const dot = svg.querySelector<SVGCircleElement>(".route-hub-dot");
  const label = svg.querySelector<SVGTextElement>(".route-hub-label");
  ring?.setAttribute("cx", String(hx));
  ring?.setAttribute("cy", String(hy));
  dot?.setAttribute("cx", String(hx));
  dot?.setAttribute("cy", String(hy));
  label?.setAttribute("x", String(hx + 14));
  label?.setAttribute("y", String(hy - 8));
}

export default function MasarV22Bridge() {
  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(renderRoutes);
      });
    };

    schedule();
    const hero = document.querySelector<HTMLElement>(".home-page .cx-hero");
    hero?.addEventListener("pointermove", schedule, { passive: true });
    hero?.addEventListener("pointerleave", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "dir", "style"],
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      hero?.removeEventListener("pointermove", schedule);
      hero?.removeEventListener("pointerleave", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
