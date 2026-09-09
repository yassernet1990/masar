"use client";

import { useEffect } from "react";

const VIEWBOX_W = 1600;
const VIEWBOX_H = 900;
const MAP_ASPECT = 2; // NASA asset: 4096 x 2048
// Approximate geographic centre of Saudi Arabia; used only to anchor the visual hub.
const SAUDI_CENTER = { lon: 45.0792, lat: 23.8859 };

function parseLastPercent(value: string, fallback: number) {
  const last = value.split(",").pop()?.trim() || "";
  const match = last.match(/(-?\d+(?:\.\d+)?)%/);
  return match ? Number(match[1]) / 100 : fallback;
}

function parseBackgroundPosition(value: string) {
  const last = value.split(",").pop()?.trim() || "";
  const values = last.match(/-?\d+(?:\.\d+)?%/g) || [];
  return {
    x: values[0] ? Number(values[0].replace("%", "")) / 100 : 0.5,
    y: values[1] ? Number(values[1].replace("%", "")) / 100 : 0.5,
  };
}

function ensureRouteMarkup(svg: SVGSVGElement) {
  if (svg.dataset.preciseSaudiHub === "4") return;
  svg.innerHTML = `
    <defs>
      <linearGradient id="masarRouteGradientV16" x1="0" x2="1">
        <stop offset="0%" stop-color="#78e7ff" stop-opacity=".96" />
        <stop offset="16%" stop-color="#67a9ff" stop-opacity=".84" />
        <stop offset="72%" stop-color="#58e0ff" stop-opacity=".70" />
        <stop offset="100%" stop-color="#68a8ff" stop-opacity="0" />
      </linearGradient>
    </defs>
    <g class="saudi-route-group">
      <path class="route route-up-a" />
      <path class="route soft route-up-b" />
      <path class="route route-right" />
      <circle class="route-hub-ring" r="12" />
      <circle class="route-hub-dot" r="3" />
      <text class="route-hub-label">Saudi Arabia</text>
    </g>
  `;
  svg.dataset.preciseSaudiHub = "4";
}

function locateSaudiOnRenderedMap(hero: HTMLElement, art: HTMLElement) {
  const heroRect = hero.getBoundingClientRect();
  const artRect = art.getBoundingClientRect();
  const style = getComputedStyle(art);

  const baseW = art.offsetWidth || artRect.width;
  const baseH = art.offsetHeight || artRect.height;
  const scale = baseW ? artRect.width / baseW : 1;
  const widthRatio = parseLastPercent(style.backgroundSize, 0.86);
  const position = parseBackgroundPosition(style.backgroundPosition);
  const mapW = baseW * widthRatio;
  const mapH = mapW / MAP_ASPECT;
  const mapOffsetX = (baseW - mapW) * position.x;
  const mapOffsetY = (baseH - mapH) * position.y;
  const lonX = (SAUDI_CENTER.lon + 180) / 360;
  const latY = (90 - SAUDI_CENTER.lat) / 180;

  const screenX = artRect.left + (mapOffsetX + mapW * lonX) * scale;
  const screenY = artRect.top + (mapOffsetY + mapH * latY) * scale;

  return {
    x: ((screenX - heroRect.left) / heroRect.width) * VIEWBOX_W,
    y: ((screenY - heroRect.top) / heroRect.height) * VIEWBOX_H,
  };
}

function setPath(svg: SVGSVGElement, selector: string, d: string) {
  svg.querySelector<SVGPathElement>(selector)?.setAttribute("d", d);
}

function positionSaudiRoutes() {
  const page = document.querySelector<HTMLElement>(".cx-page.theme-masar.home-page");
  if (!page) return;
  const hero = page.querySelector<HTMLElement>(".cx-hero");
  const art = page.querySelector<HTMLElement>(".hero-art");
  const svg = page.querySelector<SVGSVGElement>(".masar-routes-v16");
  if (!hero || !art || !svg) return;

  ensureRouteMarkup(svg);
  const { x, y } = locateSaudiOnRenderedMap(hero, art);
  const hx = Math.max(0, Math.min(VIEWBOX_W, x));
  const hy = Math.max(0, Math.min(VIEWBOX_H, y));

  // Final layout: two lines rise upward from Saudi Arabia, one to the left of the other,
  // and the third travels to the right on a slightly higher trajectory.
  setPath(svg, ".route-up-a", `M ${hx} ${hy} C ${hx - 8} ${hy - 108}, ${hx - 42} ${hy - 214}, ${hx - 88} ${hy - 318}`);
  setPath(svg, ".route-up-b", `M ${hx} ${hy} C ${hx - 48} ${hy - 112}, ${hx - 116} ${hy - 220}, ${hx - 202} ${hy - 322}`);
  setPath(svg, ".route-right", `M ${hx} ${hy} C ${hx + 188} ${hy - 58}, ${hx + 390} ${hy - 50}, 1515 ${hy - 28}`);

  const ring = svg.querySelector<SVGCircleElement>(".route-hub-ring");
  const dot = svg.querySelector<SVGCircleElement>(".route-hub-dot");
  const label = svg.querySelector<SVGTextElement>(".route-hub-label");
  ring?.setAttribute("cx", String(hx));
  ring?.setAttribute("cy", String(hy));
  dot?.setAttribute("cx", String(hx));
  dot?.setAttribute("cy", String(hy));
  label?.setAttribute("x", String(hx + 13));
  label?.setAttribute("y", String(hy - 7));
}

export default function MasarV17Bridge() {
  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(positionSaudiRoutes);
      });
    };

    schedule();
    const hero = document.querySelector<HTMLElement>(".cx-page.theme-masar.home-page .cx-hero");
    hero?.addEventListener("pointermove", schedule, { passive: true });
    hero?.addEventListener("pointerleave", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "dir", "style"] });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      hero?.removeEventListener("pointermove", schedule);
      hero?.removeEventListener("pointerleave", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
