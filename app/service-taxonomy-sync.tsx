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

const footerPhoneHref = "tel:+447452347280";
const footerPhoneLabel = "+44 7452 347280";
const footerWhatsAppHref = "https://wa.me/447452347280";

const mailIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4z"/><path d="m5 7 7 5 7-5"/></svg>';
const phoneIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 4.5 10 8l-2.1 2.1a14.2 14.2 0 0 0 6 6L16 14l3.5 2.8-.7 2.8c-.2.8-.9 1.4-1.8 1.4C9.3 21 3 14.7 3 7c0-.9.6-1.6 1.4-1.8z"/></svg>';
const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 11.7a8.2 8.2 0 0 1-12 7.2L4 20l1.1-4A8.2 8.2 0 1 1 20.2 11.7Z"/><path d="M9 8.3c.2-.4.4-.4.7-.4h.3c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.8c-.2.2-.1.4 0 .6.6 1.1 1.6 2 2.7 2.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .3-.1 1.2-.8 1.7-.6.5-1.4.8-2.2.6-1.2-.2-2.9-.9-4.5-2.4-1.3-1.2-2.2-2.7-2.5-3.9-.3-1 0-1.7.5-2.3.3-.4.6-.6 1-.7Z"/></svg>';

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

function syncFooterContacts(lang: Lang) {
  document.querySelectorAll<HTMLElement>(".masar-footer .footer-bottom").forEach((bottom) => {
    const mail = bottom.querySelector<HTMLAnchorElement>('a[href^="mailto:"]');
    const isHome = Boolean(bottom.closest(".home-page"));
    const phone = bottom.querySelector<HTMLAnchorElement>(isHome ? 'a[href^="tel:"]:not(.footer-contact-action)' : 'a[href^="tel:"]');
    if (!mail || !phone) return;

    phone.href = footerPhoneHref;
    phone.textContent = footerPhoneLabel;
    phone.dir = "ltr";

    const existing = bottom.querySelector<HTMLElement>(".footer-contact-strip");
    if (existing) {
      const mailLabel = existing.querySelector<HTMLElement>('[data-footer-label="mail"]');
      const careLabel = existing.querySelector<HTMLElement>('[data-footer-label="care"]');
      if (mailLabel) mailLabel.textContent = lang === "ar" ? "الاستفسارات العامة" : "General Inquiries";
      if (careLabel) careLabel.textContent = lang === "ar" ? "خدمة العملاء" : "Customer Care";
      return;
    }

    const strip = document.createElement("div");
    strip.className = "footer-contact-strip";

    const mailItem = document.createElement("div");
    mailItem.className = "footer-contact-item";
    mailItem.innerHTML = `<div class="footer-contact-heading"><span class="footer-contact-icon">${mailIcon}</span><span data-footer-label="mail">${lang === "ar" ? "الاستفسارات العامة" : "General Inquiries"}</span></div>`;
    mail.classList.add("footer-contact-value");
    mailItem.appendChild(mail);

    const careItem = document.createElement("div");
    careItem.className = "footer-contact-item";
    careItem.innerHTML = `<div class="footer-contact-heading"><span data-footer-label="care">${lang === "ar" ? "خدمة العملاء" : "Customer Care"}</span><span class="footer-care-actions"><a class="footer-contact-icon footer-contact-action" href="${footerPhoneHref}" aria-label="${lang === "ar" ? "اتصال" : "Call"}">${phoneIcon}</a><a class="footer-contact-icon footer-contact-action footer-whatsapp" href="${footerWhatsAppHref}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${whatsappIcon}</a></span></div>`;
    phone.classList.add("footer-contact-value");
    if (isHome) {
      const row = document.createElement("div");
      row.className = "footer-phone-row";
      row.dir = "ltr";
      const actions = careItem.querySelector<HTMLElement>(".footer-care-actions");
      row.appendChild(phone);
      if (actions) row.appendChild(actions);
      careItem.appendChild(row);
    } else {
      careItem.appendChild(phone);
    }

    strip.append(mailItem, careItem);
    const copyright = Array.from(bottom.children).find((el) => el.tagName === "SPAN");
    bottom.insertBefore(strip, copyright || null);
  });
}

function syncAll() {
  const lang = currentLang();
  syncDropdown(lang);
  syncHomepageCards(lang);
  syncFooterContacts(lang);
}

export default function ServiceTaxonomySync() {
  useEffect(() => {
    syncAll();
    const timers = [100, 400, 1200].map((delay) => window.setTimeout(syncAll, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return null;
}
