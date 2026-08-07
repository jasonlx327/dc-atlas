import type { Metadata } from "next";
import WatchIndex, { type WatchPayload } from "../watch-index";
import { loadInitialAtlasPayload } from "../initial-atlas";
import { POLICY_BRIEFS } from "../watch-data";

const canonical = "https://idc-index.com/policy";

export const metadata: Metadata = {
  title: "中美数据中心政策追踪｜IDC Atlas",
  description: "追踪影响数据中心建设、用电、并网与运营成本的中美政策变化，逐条说明政策内容、执行状态和直接影响。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/policy", "x-default": "https://idc-index.com/en/policy" } },
  openGraph: { title: "中美数据中心政策追踪", description: "来源可回溯的政策简报、执行状态与直接影响。", url: canonical, type: "website", images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 中美数据中心政策追踪" }] },
  twitter: { card: "summary_large_image", title: "中美数据中心政策追踪｜IDC Atlas", description: "来源可回溯的政策简报、执行状态与直接影响。", images: ["/og.png"] },
};

export default async function PolicyPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<WatchPayload> | null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "中美数据中心政策追踪",
    url: canonical,
    inLanguage: "zh-CN",
    description: metadata.description,
    dateModified: initialPayload?.generatedAt,
    isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: POLICY_BRIEFS.length,
      itemListElement: POLICY_BRIEFS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: `https://idc-index.com/policy/${item.id}`,
      })),
    },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><WatchIndex lang="zh" kind="policy" initialPayload={initialPayload} /></>;
}
