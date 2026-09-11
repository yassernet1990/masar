import type { Metadata } from "next";

export const SITE_ORIGIN = "https://masarps.com";
export type SiteLang = "en" | "ar";
export type SearchParams = Record<string, string | string[] | undefined>;
export type PublicPageProps = { searchParams: Promise<SearchParams> };
export const pageLanguage = (params: SearchParams): SiteLang => params.lang === "ar" ? "ar" : "en";
export const pageDetails = {
  home: { path: "/", en: ["MASAR | Procurement, Investment & Commercial Advisory", "Procurement, strategic sourcing, business, investment and development advisory, commercial and contracts advisory, and brand identity and market presence services."], ar: ["مسار | استشارات المشتريات والاستثمار والعقود", "حلول المشتريات والتوريد الاستراتيجي واستشارات الأعمال والاستثمار والتطوير والاستشارات التجارية والتعاقدية والهوية والحضور في السوق." ] },
  procurement: { path: "/services/procurement", en: ["Procurement, Strategic Sourcing & Vendor Management | MASAR", "Explore procurement strategy, department setup, tendering, supplier qualification, sourcing and executive advisory services from MASAR."], ar: ["المشتريات والتوريد الاستراتيجي وإدارة الموردين | مسار", "خدمات استراتيجية المشتريات وتأسيس إدارتها وإعداد المناقصات وتأهيل الموردين والتوريد والاستشارات التنفيذية من مسار."] },
  business: { path: "/services/business-setup", en: ["Business, Investment & Development Advisory | MASAR", "Investment and development feasibility, Saudi Arabia and Syria market entry, development strategy, built-to-suit advisory, operational setup and executive advisory services from MASAR."], ar: ["استشارات الأعمال والاستثمار والتطوير | مسار", "دراسات جدوى الاستثمار والتطوير ودخول أسواق السعودية وسوريا واستراتيجية التطوير والاستشارات حسب احتياج العميل والتأسيس التشغيلي والاستشارات التنفيذية من مسار."] },
  commercial: { path: "/services/commercial-contracts", en: ["Commercial & Contracts Advisory | MASAR", "Contract review and administration, variations, claims strategy, payment and final account reviews, project cost controls and commercial governance from MASAR."], ar: ["الاستشارات التجارية والتعاقدية | مسار", "خدمات مراجعة وإدارة العقود والأوامر التغييرية والمطالبات والمستخلصات والحسابات الختامية وضبط تكاليف المشاريع والحوكمة التجارية من مسار."] },
  packages: { path: "/packages", en: ["Brand Identity & Market Presence | MASAR", "Explore MASAR services for brand identity, websites, company profiles, LinkedIn and market presence, with clear packages and pricing."], ar: ["الهوية والحضور في السوق | مسار", "استعرض خدمات مسار للهوية البصرية والمواقع الإلكترونية والملفات التعريفية ولينكدإن والحضور في السوق، مع باقات وأسعار واضحة."] },
} as const;
export type PageKey = keyof typeof pageDetails;
export const pageUrl = (path: string, lang: SiteLang) => `${SITE_ORIGIN}${path}?lang=${lang}`;

export function pageMetadata(key: PageKey, params: SearchParams): Metadata {
  const lang = pageLanguage(params);
  const page = pageDetails[key];
  const [title, description] = page[lang];
  const url = pageUrl(page.path, lang);
  return {
    title, description, metadataBase: new URL(SITE_ORIGIN),
    alternates: { canonical: url, languages: { en: pageUrl(page.path, "en"), ar: pageUrl(page.path, "ar"), "x-default": pageUrl(page.path, "en") } },
    openGraph: { title, description, url, type: "website", siteName: "MASAR", locale: lang === "ar" ? "ar_SA" : "en_GB", alternateLocale: lang === "ar" ? "en_GB" : "ar_SA" },
    twitter: { card: "summary", title, description },
    robots: params.admin || params.checkout || params.session_id ? { index: false, follow: false } : { index: true, follow: true },
  };
}
