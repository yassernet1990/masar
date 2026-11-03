import Home from "./home";
import SeoJsonLd from "./seo-jsonld";
import { pageLanguage, pageMetadata, type PublicPageProps } from "./seo";

export async function generateMetadata({ searchParams }: PublicPageProps) {
  return pageMetadata("home", await searchParams);
}
export default async function Page({ searchParams }: PublicPageProps) {
  const lang = pageLanguage(await searchParams);
  return <>
    <link rel="preload" as="image" href="/images/world-night-mobile-20261103.webp" media="(max-width: 800px)" fetchPriority="high" />
    <link rel="preload" as="image" href="/images/world-night-desktop-20261103.webp" media="(width > 800px)" fetchPriority="high" />
    <SeoJsonLd pageKey="home" lang={lang} /><Home initialLang={lang} /></>;
}
