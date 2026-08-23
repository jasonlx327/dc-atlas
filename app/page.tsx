import type { Metadata } from "next";
import Home, { type AtlasPayload } from "./home-client";
import { loadInitialAtlasPayload } from "./initial-atlas";
import { deriveConsoleMeta } from "./console-meta";
import { entityDirectory } from "./entity-directory";
import { publishedColumnArticles } from "./columns/articles";
import { buildDailyBrief } from "./intelligence-model";

export const metadata: Metadata = {
  title: "全球数据中心与 AI 基础设施情报｜IDC Atlas",
  description: "每日追踪全球数据中心项目、超大规模云厂商 CAPEX、IDC 租赁、电力、液冷与 AI 算力硬件，保留公开来源与更新时间。",
  alternates: {
    canonical: "/",
    languages: { "zh-CN": "/", en: "/en", "x-default": "/en" },
    types: { "application/rss+xml": "/feed.xml" },
  },
  other: { "content-language": "zh-CN" },
  openGraph: {
    title: "全球数据中心与 AI 基础设施情报｜IDC Atlas",
    description: "每日追踪全球数据中心项目、超大规模云厂商 CAPEX、IDC 租赁、电力、液冷与 AI 算力硬件，保留公开来源与更新时间。",
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 全球数据中心与 AI 基础设施情报" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "全球数据中心与 AI 基础设施情报｜IDC Atlas",
    description: "每日追踪全球数据中心项目、超大规模云厂商 CAPEX、IDC 租赁、电力、液冷与 AI 算力硬件，保留公开来源与更新时间。",
    images: ["/og.png"],
  },
};

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
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
        url: "https://idc-index.com/",
        inLanguage: ["zh-CN", "en"],
        description: "全球数据中心项目、云厂商资本开支、IDC 租赁、电力、液冷与算力硬件情报。",
      },
      {
        "@type": "Organization",
        name: "IDC Atlas",
        url: "https://idc-index.com/",
        sameAs: ["https://github.com/jasonlx327"],
      },
      {
        "@type": "CollectionPage",
        name: "全球数据中心与 AI 基础设施情报",
        url: "https://idc-index.com/",
        inLanguage: "zh-CN",
        description: metadata.description,
        dateModified: contentMeta.lastContentChangedAt ?? contentMeta.reviewedAt,
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        about: [
          { "@type": "Thing", name: "数据中心基础设施" },
          { "@type": "Thing", name: "超大规模云厂商资本开支" },
          { "@type": "Thing", name: "数据中心电力与液冷" },
        ],
        hasPart: [
          { "@type": "WebPage", name: "IDC 项目脉冲", url: "https://idc-index.com/pulse" },
          { "@type": "WebPage", name: "AI 基础设施产业链", url: "https://idc-index.com/industry" },
          { "@type": "WebPage", name: "IDC Atlas 专栏", url: "https://idc-index.com/columns" },
          { "@type": "WebPage", name: "全球科技财报日历", url: "https://idc-index.com/calendar" },
          { "@type": "WebPage", name: "市场情报与报道线索", url: "https://idc-index.com/rumors" },
          { "@type": "CollectionPage", name: "AI 基础设施公司库", url: "https://idc-index.com/companies" },
        ],
      },
      {
        "@type": "ItemList",
        name: "IDC Atlas 重点公司",
        numberOfItems: entityDirectory.length,
        itemListElement: entityDirectory.map((entity, index) => ({ "@type": "ListItem", position: index + 1, url: `https://idc-index.com/companies/${entity.slug}`, name: entity.name })),
      },
      ...(dailyBrief ? [{
        "@type": "AnalysisNewsArticle",
        "@id": `https://idc-index.com${dailyBrief.article.href}#article`,
        headline: dailyBrief.article.title,
        description: dailyBrief.article.summary,
        url: `https://idc-index.com${dailyBrief.article.href}`,
        inLanguage: "zh-CN",
        datePublished: dailyBrief.article.publishAt,
        dateModified: dailyBrief.publishedAt,
        image: `https://idc-index.com${dailyBrief.article.image}`,
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        about: dailyBrief.relatedEntities.map((entity) => ({ "@id": `https://idc-index.com/companies/${entity.slug}#company` })),
      }] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
        ],
      },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Home initialPayload={initialPayload} /></>;
}
