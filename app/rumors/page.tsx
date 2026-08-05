import type { Metadata } from "next";
import WatchIndex, { type WatchPayload } from "../watch-index";
import { loadInitialAtlasPayload } from "../initial-atlas";
import { RUMOR_BRIEFS } from "../watch-data";

const canonical = "https://idc-index.com/rumors";

export const metadata: Metadata = {
  title: "市场传闻与待核验线索｜IDC Atlas",
  description: "汇总主流媒体已公开报道、但尚未获得公司或监管方完整确认的数据中心、云计算、芯片与 AI 基础设施线索。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/rumors", "x-default": "https://idc-index.com/en/rumors" } },
  openGraph: { title: "市场传闻与待核验线索｜IDC Atlas", description: "保留涉及主体、公开回应、时间与来源的媒体报道监测。", url: canonical, type: "website" },
};

export default async function RumorsPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<WatchPayload> | null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "市场传闻与待核验线索",
    url: canonical,
    inLanguage: "zh-CN",
    description: metadata.description,
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
