import type { Metadata } from "next";
import EnglishHome, { type AtlasPayload } from "./english-home";
import { loadInitialAtlasPayload } from "../initial-atlas";
import { deriveConsoleMeta } from "../console-meta";
import { entityDirectory } from "../entity-directory";
import { publishedColumnArticles } from "../columns/articles";
import { buildDailyBrief } from "../intelligence-model";

const canonical = "https://idc-index.com/en";

export const metadata: Metadata = {
  title: "Data Center Infrastructure Intelligence | IDC Atlas",
  description: "Track hyperscaler CAPEX, data-center leases, power, liquid cooling, AI hardware and earnings through daily source-linked intelligence.",
  alternates: {
    canonical,
    languages: { "zh-CN": "https://idc-index.com/", en: canonical, "x-default": canonical },
    types: { "application/rss+xml": "https://idc-index.com/en/feed.xml" },
  },
  other: { "content-language": "en-US" },
  openGraph: {
    title: "Data Center Infrastructure Intelligence | IDC Atlas",
    description: "Track hyperscaler CAPEX, data-center leases, power, cooling and AI hardware through source-linked public intelligence.",
    url: canonical,
    type: "website",
    images: [{ url: "/og-idc-atlas-en.png", width: 1731, height: 909, alt: "IDC Atlas AI Infrastructure Intelligence" }],
  },
  twitter: { card: "summary_large_image", title: "Data Center Infrastructure Intelligence | IDC Atlas", description: "Daily intelligence on hyperscaler CAPEX, data-center leases, power, cooling and AI hardware.", images: ["/og-idc-atlas-en.png"] },
};

export default async function EnglishPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const initialPayload = await loadInitialAtlasPayload(typeof params?.__atlas_prime === "string" ? params.__atlas_prime : null) as Partial<AtlasPayload> | null;
  const contentMeta = deriveConsoleMeta(initialPayload);
  const dailyBrief = buildDailyBrief(publishedColumnArticles());
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "IDC Atlas",
        url: "https://idc-index.com/en",
        inLanguage: ["en", "zh-CN"],
        description: "Source-linked intelligence for data-center construction, AI infrastructure, power, cooling, networking and China AI silicon.",
      },
      {
        "@type": "Organization",
        name: "IDC Atlas",
        url: "https://idc-index.com/",
        sameAs: ["https://github.com/jasonlx327"],
      },
      {
        "@type": "CollectionPage",
        name: "Data Center Infrastructure Intelligence",
        url: canonical,
        inLanguage: "en-US",
        description: metadata.description,
        dateModified: contentMeta.lastContentChangedAt ?? contentMeta.reviewedAt,
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        about: [
          { "@type": "Thing", name: "Data center infrastructure" },
          { "@type": "Thing", name: "Hyperscaler capital expenditure" },
          { "@type": "Thing", name: "Data center leasing" },
          { "@type": "Thing", name: "Power and liquid cooling" },
        ],
        hasPart: [
          { "@type": "WebPage", name: "Infrastructure Pulse", url: "https://idc-index.com/en/pulse" },
          { "@type": "WebPage", name: "AI Infrastructure Industry Map", url: "https://idc-index.com/en/industry" },
          { "@type": "WebPage", name: "IDC Atlas Columns", url: "https://idc-index.com/en/columns" },
          { "@type": "WebPage", name: "Rumor Watch", url: "https://idc-index.com/en/rumors" },
          { "@type": "CollectionPage", name: "AI Infrastructure Company Library", url: "https://idc-index.com/en/companies" },
        ],
      },
      {
        "@type": "ItemList",
        name: "IDC Atlas priority companies",
        numberOfItems: entityDirectory.length,
        itemListElement: entityDirectory.map((entity, index) => ({ "@type": "ListItem", position: index + 1, url: `https://idc-index.com/en/companies/${entity.slug}`, name: entity.nameEn })),
      },
      ...(dailyBrief ? [{
        "@type": "AnalysisNewsArticle",
        "@id": `https://idc-index.com${dailyBrief.article.hrefEn}#article`,
        headline: dailyBrief.article.titleEn,
        description: dailyBrief.article.summaryEn,
        url: `https://idc-index.com${dailyBrief.article.hrefEn}`,
        inLanguage: "en-US",
        datePublished: dailyBrief.article.publishAt,
        dateModified: dailyBrief.publishedAt,
        image: `https://idc-index.com${dailyBrief.article.image}`,
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        about: dailyBrief.relatedEntities.map((entity) => ({ "@id": `https://idc-index.com/en/companies/${entity.slug}#company` })),
      }] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: canonical },
        ],
      },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><EnglishHome initialPayload={initialPayload} /></>;
}
