import type { Metadata } from "next";
import CompanyDirectoryPage from "../../company-directory-page";
import { entityDirectory } from "../../entity-directory";
import { loadInitialAtlasPayload } from "../../initial-atlas";

export const metadata: Metadata = {
  title: "AI Infrastructure Company Library | IDC Atlas",
  description: "Track primary disclosures, project updates, related research and next checkpoints for global AI infrastructure companies.",
  alternates: { canonical: "/en/companies", languages: { "zh-CN": "/companies", en: "/en/companies", "x-default": "/en/companies" } },
};

export default async function EnglishCompaniesPage() {
  const payload = await loadInitialAtlasPayload();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "IDC Atlas AI Infrastructure Company Library", url: "https://idc-index.com/en/companies", inLanguage: "en-US", description: metadata.description },
      { "@type": "ItemList", name: "AI infrastructure companies", numberOfItems: entityDirectory.length, itemListElement: entityDirectory.map((entity, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "Organization", name: entity.nameEn, url: `https://idc-index.com/en/companies/${entity.slug}`, ...(entity.ticker ? { tickerSymbol: entity.ticker } : {}) } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "Companies", item: "https://idc-index.com/en/companies" }] },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CompanyDirectoryPage lang="en" initialPayload={payload} /></>;
}
