import Home from "../../home";
import SeoJsonLd from "../../seo-jsonld";
import { pageLanguage, pageMetadata, type PublicPageProps } from "../../seo";

export async function generateMetadata({ searchParams }: PublicPageProps) {
  return pageMetadata("procurement", await searchParams);
}
export default async function Page({ searchParams }: PublicPageProps) {
  const lang = pageLanguage(await searchParams);
  return <><SeoJsonLd pageKey="procurement" lang={lang} /><Home initialLang={lang} servicePage="procurement" /></>;
}
