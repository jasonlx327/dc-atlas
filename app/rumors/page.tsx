import type { Metadata } from "next";
import WatchIndex, { type WatchPayload } from "../watch-index";
import { loadInitialAtlasPayload } from "../initial-atlas";
import { deriveConsoleMeta } from "../console-meta";
import { RUMOR_BRIEFS } from "../watch-data";

const canonical = "https://idc-index.com/rumors";

export const metadata: Metadata = {
  title: "全球情报台｜IDC Atlas",
  description: "持续发布全球数据中心、云计算、芯片与 AI 基础设施媒体情报，并追踪来源、状态变化与公开回应。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/rumors", "x-default": "https://idc-index.com/en/rumors" } },
  openGraph: { title: "全球情报台｜IDC Atlas", description: "全球媒体情报、来源归因、状态变化与公开回应。", url: canonical, type: "website", images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 全球情报台" }] },
  twitter: { card: "summary_large_image", title: "全球情报台｜IDC Atlas", description: "全球媒体情报、来源归因、状态变化与公开回应。", images: ["/og.png"] },
};

export default async function RumorsPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<WatchPayload> | null;
  const contentMeta = deriveConsoleMeta(initialPayload);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "全球情报台",
    url: canonical,
    inLanguage: "zh-CN",
    description: metadata.description,
    dateModified: contentMeta.lastContentChangedAt ?? contentMeta.reviewedAt,
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: RUMOR_BRIEFS.length,
      itemListElement: RUMOR_BRIEFS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: `https://idc-index.com/rumors/${item.id}`,
      })),
    },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><WatchIndex lang="zh" kind="rumors" initialPayload={initialPayload} /></>;
}
