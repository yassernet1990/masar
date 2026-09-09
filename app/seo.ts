import type { Metadata } from "next";

export const SITE_ORIGIN = "https://masarps.com";
export type SiteLang = "en" | "ar";
export type SearchParams = Record<string, string | string[] | undefined>;
export type PublicPageProps = { searchParams: Promise<SearchParams> };
export const pageLanguage = (params: SearchParams): SiteLang => params.lang === "ar" ? "ar" : "en";
export const pageDetails = {
  home: { path: "/", en: ["MASAR | Procurement & Commercial Advisory", "Procurement, strategic sourcing, commercial and contracts advisory, business setup and market presence services across Saudi Arabia and the region."], ar: ["مسار | استشارات المشتريات والعقود والأعمال", "حلول المشتريات والتوريد الاستراتيجي والاستشارات التجارية والتعاقدية وتأسيس الأعمال والحضور في السوق في السعودية والمنطقة."] },
  procurement: { path: "/services/procurement", en: ["Procurement, Strategic Sourcing & Vendor Management | MASAR", "Explore procurement strategy, department setup, tendering, supplier qualification, sourcing and executive advisory services from MASAR."], ar: ["المشتريات والتوريد الاستراتيجي وإدارة الموردين | مسار", "خدمات استراتيجية المشتريات وتأسيس إدارتها وإعداد المناقصات وتأهيل الموردين والتوريد والاستشارات التنفيذية من مسار."] },
  commercial: { path: "/services/commercial-contracts", en: ["Commercial & Contracts Advisory | MASAR", "Contract review and administration, variations, claims strategy, payment and final account reviews, and project cost controls from MASAR."], ar: ["الاستشارات التجارية والتعاقدية | مسار", "خدمات مراجعة وإدارة العقود والأوامر التغييرية والمطالبات والمستخلصات والحسابات الختامية وضبط تكاليف المشاريع من مسار."] },
  business: { path: "/services/business-setup", en: ["Business Setup & Operational Systems | MASAR", "Business planning, feasibility studies, operational systems, policies, process improvement and executive advisory services from MASAR."], ar: ["تأسيس الأعمال والأنظمة التشغيلية | مسار", "خدمات تخطيط الأعمال ودراسات الجدوى والأنظمة التشغيلية والسياسات وتحسين الإجراءات والاستشارات التنفيذية من مسار."] },
  packages: { path: "/packages", en: ["Brand & Website Packages | MASAR", "Explore MASAR packages for brand identity, websites, company profiles and procurement templates, with clear pricing and optional additions."], ar: ["باقات الهوية والمواقع الإلكترونية | مسار", "استعرض باقات مسار للهوية البصرية والمواقع الإلكترونية والملفات التعريفية ونماذج المشتريات، مع الأسعار والخدمات الإضافية."] },
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
