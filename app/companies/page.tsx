import type { Metadata } from "next";
import CompanyDirectoryPage from "../company-directory-page";
import { entityDirectory } from "../entity-directory";
import { loadInitialAtlasPayload } from "../initial-atlas";

export const metadata: Metadata = {
  title: "AI 基础设施公司库｜IDC Atlas",
  description: "追踪全球 AI 基础设施公司的一手披露、项目动态、关联研究和下一验证点。",
  alternates: { canonical: "/companies", languages: { "zh-CN": "/companies", en: "/en/companies", "x-default": "/en/companies" } },
};

export default async function CompaniesPage() {
  const payload = await loadInitialAtlasPayload();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "IDC Atlas AI 基础设施公司库", url: "https://idc-index.com/companies", inLanguage: "zh-CN", description: metadata.description },
      { "@type": "ItemList", name: "AI 基础设施公司", numberOfItems: entityDirectory.length, itemListElement: entityDirectory.map((entity, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "Organization", name: entity.name, url: `https://idc-index.com/companies/${entity.slug}`, ...(entity.ticker ? { tickerSymbol: entity.ticker } : {}) } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "公司库", item: "https://idc-index.com/companies" }] },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CompanyDirectoryPage lang="zh" initialPayload={payload} /></>;
}
