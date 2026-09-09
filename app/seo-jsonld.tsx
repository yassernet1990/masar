import { pageDetails, pageUrl, SITE_ORIGIN, type PageKey, type SiteLang } from "./seo";
import { advisoryCatalogs, type ServiceKind } from "./commerce/service-catalog";

export default function SeoJsonLd({ pageKey, lang }: { pageKey: PageKey; lang: SiteLang }) {
  const page = pageDetails[pageKey];
  const url = pageUrl(page.path, lang);
  const organization = `${SITE_ORIGIN}/#organization`;
  const graph: Record<string, unknown>[] = [
    { "@type": "Organization", "@id": organization, name: "MASAR", legalName: "MASAR Procurement & Solutions Ltd", url: SITE_ORIGIN, logo: `${SITE_ORIGIN}/images/masar-logo.png`, email: "info@masarps.com", telephone: "+966505476689", address: { "@type": "PostalAddress", streetAddress: "71-75 Shelton Street, Covent Garden", addressLocality: "London", postalCode: "WC2H 9JQ", addressCountry: "GB" } },
    { "@type": "WebSite", "@id": `${SITE_ORIGIN}/#website`, name: "MASAR", url: SITE_ORIGIN, inLanguage: ["en", "ar"], publisher: { "@id": organization } },
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: page[lang][0], description: page[lang][1], inLanguage: lang, isPartOf: { "@id": `${SITE_ORIGIN}/#website` }, about: { "@id": organization } },
  ];
  if (["procurement", "commercial", "business"].includes(pageKey)) {
    const catalog = advisoryCatalogs[pageKey as ServiceKind];
    graph.push({ "@type": "Service", name: catalog.eyebrow[lang], description: page[lang][1], url, provider: { "@id": organization }, hasOfferCatalog: { "@type": "OfferCatalog", name: catalog.eyebrow[lang], itemListElement: catalog.groups.flatMap(group => group.services.map(service => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.name[lang], description: service.description[lang] } }))) } });
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
