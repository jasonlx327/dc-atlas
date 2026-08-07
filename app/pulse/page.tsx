import type { Metadata } from "next";
import Home, { type AtlasPayload } from "../home-client";
import { loadInitialAtlasPayload } from "../initial-atlas";

export const metadata: Metadata = {
  title: "IDC 最新脉冲｜项目、上市公司与 AI 日报",
  description: "追踪近 45 天中美数据中心项目、A 股与美股核心 IDC 标的及每日 AI 资讯。",
  alternates: {
    canonical: "https://idc-index.com/pulse",
    languages: { "zh-CN": "https://idc-index.com/pulse", en: "https://idc-index.com/en/pulse", "x-default": "https://idc-index.com/en/pulse" },
  },
  openGraph: {
    title: "IDC 最新脉冲｜项目、上市公司与 AI 日报",
    description: "追踪近 45 天中美数据中心项目、A 股与美股核心 IDC 标的及每日 AI 资讯。",
    url: "https://idc-index.com/pulse",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 最新脉冲" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IDC 最新脉冲｜项目、上市公司与 AI 日报",
    description: "追踪近 45 天中美数据中心项目、A 股与美股核心 IDC 标的及每日 AI 资讯。",
    images: ["/og.png"],
  },
};

export default async function PulsePage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  const canonical = "https://idc-index.com/pulse";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "IDC 最新脉冲",
        url: canonical,
        inLanguage: "zh-CN",
        description: metadata.description,
        dateModified: initialPayload?.generatedAt,
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
        about: ["数据中心项目", "IDC 上市公司", "AI 基础设施", "数据中心租赁与投运"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: "最新脉冲", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Home initialPayload={initialPayload} view="pulse" /></>;
}
