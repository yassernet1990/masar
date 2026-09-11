"use client";

import { useEffect } from "react";

type Lang = "en" | "ar";

type TaxonomyItem = {
  order: number;
  path: string;
  en: string;
  ar: string;
  descriptionEn: string;
  descriptionAr: string;
};

const taxonomy: TaxonomyItem[] = [
  {
    order: 1,
    path: "/services/procurement",
    en: "Procurement, Strategic Sourcing & Vendor Management",
    ar: "المشتريات والتوريد الاستراتيجي وإدارة الموردين",
    descriptionEn:
      "End-to-end procurement advisory, market analysis, supplier qualification, RFQ/RFP management, negotiation, performance and process optimization.",
    descriptionAr:
      "استشارات المشتريات المتكاملة، تحليل السوق، تأهيل الموردين، إدارة RFQ/RFP، التفاوض، قياس الأداء وتحسين الإجراءات.",
  },
  {
    order: 2,
    path: "/services/business-setup",
    en: "Business, Investment & Development Advisory",
    ar: "استشارات الأعمال والاستثمار والتطوير",
    descriptionEn:
      "Investment and development feasibility, Saudi Arabia & Syria market entry, development strategy, built-to-suit advisory and operational setup.",
    descriptionAr:
      "دراسات جدوى الاستثمار والتطوير، دخول أسواق السعودية وسوريا، استراتيجية التطوير، الاستشارات حسب احتياج العميل، والتأسيس التشغيلي.",
  },
  {
    order: 3,
    path: "/services/commercial-contracts",
    en: "Commercial & Contracts Advisory",
    ar: "الاستشارات التجارية والتعاقدية",
    descriptionEn:
      "Contract and risk reviews, variation assessments, claims strategy, cost control and commercial governance.",
    descriptionAr:
      "مراجعة العقود والمخاطر، تقييم الأوامر التغييرية، استراتيجية المطالبات، ضبط التكاليف والحوكمة التجارية.",
  },
  {
    order: 4,
    path: "/packages",
    en: "Brand Identity & Market Presence",
    ar: "الهوية والحضور في السوق",
    descriptionEn:
      "Visual identity, company profiles, websites, LinkedIn and market presence assets for business launch and growth.",
    descriptionAr:
      "الهوية البصرية والملف التعريفي والموقع ولينكدإن ومواد الحضور في السوق لإطلاق الأعمال وتنميتها.",
  },
];

function currentLang(): Lang {
  const page = document.querySelector<HTMLElement>(".cx-page");
  if (page?.dir === "rtl" || page?.classList.contains("ar")) return "ar";
  const query = new URLSearchParams(window.location.search).get("lang");
  return query === "ar" ? "ar" : "en";
}

function pathnameOf(anchor: HTMLAnchorElement) {
  try {
    return new URL(anchor.href, window.location.origin).pathname;
  } catch {
    return anchor.getAttribute("href")?.split("?")[0] || "";
  }
}

function withLang(path: string, lang: Lang) {
  return `${path}?lang=${lang}`;
}

function syncDropdown(lang: Lang) {
  document.querySelectorAll<HTMLElement>(".nav-package-menu").forEach((menu) => {
    const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>(":scope > a"));
    const byPath = new Map(links.map((link) => [pathnameOf(link), link]));

    taxonomy.forEach((item) => {
      const link = byPath.get(item.path);
      if (!link) return;
      link.textContent = item[lang];
      link.href = withLang(item.path, lang);
      link.dataset.serviceOrder = String(item.order);
    });

    const ordered = taxonomy
      .map((item) => byPath.get(item.path))
      .filter((link): link is HTMLAnchorElement => Boolean(link));

    ordered.forEach((link) => menu.appendChild(link));
  });
}

function syncHomepageCards(lang: Lang) {
  const grid = document.querySelector<HTMLElement>("#services .service-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll<HTMLElement>(":scope > article"));
  const byPath = new Map<string, HTMLElement>();

  cards.forEach((card) => {
    const link = card.querySelector<HTMLAnchorElement>(".service-copy a");
    if (link) byPath.set(pathnameOf(link), card);
  });

  taxonomy.forEach((item) => {
    const card = byPath.get(item.path);
    if (!card) return;

    const number = String(item.order).padStart(2, "0");
    const title = card.querySelector<HTMLElement>(".service-copy h3");
    const description = card.querySelector<HTMLElement>(".service-copy p");
    const visualNumber = card.querySelector<HTMLElement>(".service-visual > span");
    const copyNumber = card.querySelector<HTMLElement>(".service-copy > small");
    const link = card.querySelector<HTMLAnchorElement>(".service-copy a");

    if (title) title.textContent = item[lang];
    if (description)
      description.textContent = lang === "ar" ? item.descriptionAr : item.descriptionEn;
    if (visualNumber) visualNumber.textContent = number;
    if (copyNumber) copyNumber.textContent = `${number} / 04`;
    if (link) link.href = withLang(item.path, lang);

    card.dataset.serviceOrder = String(item.order);
  });

  taxonomy
    .map((item) => byPath.get(item.path))
    .filter((card): card is HTMLElement => Boolean(card))
    .forEach((card) => grid.appendChild(card));
}

function syncAll() {
  const lang = currentLang();
  syncDropdown(lang);
  syncHomepageCards(lang);
}

export default function ServiceTaxonomySync() {
  useEffect(() => {
    syncAll();
    const timers = [100, 400, 1200].map((delay) => window.setTimeout(syncAll, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return null;
}
