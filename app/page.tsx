import Home from "./home";
import SeoJsonLd from "./seo-jsonld";
import { pageLanguage, pageMetadata, type PublicPageProps } from "./seo";

export async function generateMetadata({ searchParams }: PublicPageProps) {
  return pageMetadata("home", await searchParams);
}
export default async function Page({ searchParams }: PublicPageProps) {
  const lang = pageLanguage(await searchParams);
  return <><SeoJsonLd pageKey="home" lang={lang} /><Home initialLang={lang} /></>;
}
