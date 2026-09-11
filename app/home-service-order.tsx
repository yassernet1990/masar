"use client";

import { useEffect } from "react";

type Lang = "ar" | "en";

const copy = {
  en: {
    businessTitle: "Business, Investment & Development Advisory",
    businessDescription:
      "Investment and development feasibility, Saudi Arabia & Syria market entry, development strategy, built-to-suit advisory and operational setup.",
  },
  ar: {
    businessTitle: "استشارات الأعمال والاستثمار والتطوير",
    businessDescription:
      "دراسات جدوى الاستثمار والتطوير، دخول أسواق السعودية وسوريا، استراتيجية التطوير، الاستشارات حسب احتياج العميل، والتأسيس التشغيلي.",
  },
} as const;

const desiredPaths = [
  "/services/procurement",
  "/services/business-setup",
  "/services/commercial-contracts",
  "/packages",
];

function pathOf(anchor: HTMLAnchorElement | null) {
  if (!anchor) return "";
  try {
    return new URL(anchor.href, window.location.origin).pathname;
  } catch {
    return anchor.getAttribute("href")?.split("?")[0] || "";
  }
}

export default function HomeServiceOrder({ lang }: { lang: Lang }) {
  useEffect(() => {
    let applying = false;

    const apply = () => {
      if (applying) return;
      applying = true;

      const menu = document.querySelector<HTMLElement>(".nav-package-menu");
      if (menu) {
        const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>(":scope > a"));
        const byPath = new Map(links.map((link) => [pathOf(link), link]));
        desiredPaths.forEach((path) => {
          const link = byPath.get(path);
          if (!link) return;
          if (path === "/services/business-setup") link.textContent = copy[lang].businessTitle;
          menu.appendChild(link);
        });
      }

      const grid = document.querySelector<HTMLElement>("#services .service-grid");
      if (grid) {
        const cards = Array.from(grid.querySelectorAll<HTMLElement>(":scope > article"));
        const byPath = new Map(
          cards.map((card) => {
            const link = card.querySelector<HTMLAnchorElement>(".service-copy a");
            return [pathOf(link), card] as const;
          }),
        );

        desiredPaths.forEach((path, index) => {
          const card = byPath.get(path);
          if (!card) return;

          if (path === "/services/business-setup") {
            const title = card.querySelector<HTMLElement>(".service-copy h3");
            const description = card.querySelector<HTMLElement>(".service-copy p");
            if (title) title.textContent = copy[lang].businessTitle;
            if (description) description.textContent = copy[lang].businessDescription;
          }

          const number = String(index + 1).padStart(2, "0");
          const visualNumber = card.querySelector<HTMLElement>(".service-visual > span");
          const copyNumber = card.querySelector<HTMLElement>(".service-copy > small");
          if (visualNumber) visualNumber.textContent = number;
          if (copyNumber) copyNumber.textContent = `${number} / 04`;
          grid.appendChild(card);
        });
      }

      applying = false;
    };

    apply();
    const observer = new MutationObserver(() => window.requestAnimationFrame(apply));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [lang]);

  return null;
}
