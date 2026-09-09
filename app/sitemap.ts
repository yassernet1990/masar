import type { MetadataRoute } from "next";
import { pageDetails, pageUrl, type SiteLang } from "./seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(pageDetails).flatMap(page => (["en", "ar"] as SiteLang[]).map(lang => ({ url: pageUrl(page.path, lang), alternates: { languages: { en: pageUrl(page.path, "en"), ar: pageUrl(page.path, "ar"), "x-default": pageUrl(page.path, "en") } } })));
}
