import type { Metadata } from "next";
import WatchIndex, { type WatchPayload } from "../watch-index";
import { loadInitialAtlasPayload } from "../initial-atlas";
import { deriveConsoleMeta } from "../console-meta";
import { RUMOR_BRIEFS } from "../watch-data";

const canonical = "https://idc-index.com/rumors";

export const metadata: Metadata = {
  title: "市场情报 Rumor Watch｜IDC Atlas",
  description: "聚合主流媒体报道的数据中心、云计算、芯片与 AI 基础设施线索，保留时间、涉及主体、证据状态与公开回应。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/rumors", "x-default": "https://idc-index.com/en/rumors" } },
  openGraph: { title: "市场情报 Rumor Watch｜IDC Atlas", description: "保留涉及主体、公开回应、时间与来源边界的报道情报台。", url: canonical, type: "website", images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 市场情报 Rumor Watch" }] },
  twitter: { card: "summary_large_image", title: "市场情报 Rumor Watch｜IDC Atlas", description: "保留涉及主体、公开回应、时间与来源边界的报道情报台。", images: ["/og.png"] },
};

export default async function RumorsPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<WatchPayload> | null;
  const contentMeta = deriveConsoleMeta(initialPayload);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "市场情报 Rumor Watch",
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
