import type { Metadata } from "next";
import Home, { type AtlasPayload } from "../home-client";
import { loadInitialAtlasPayload } from "../initial-atlas";

export const metadata: Metadata = {
  title: "IDC 产业中心｜算力、园区、电力与液冷",
  description: "追踪从算力芯片、网络和电力，到大型园区、液冷与模型需求的公开进展。",
  alternates: {
    canonical: "https://idc-index.com/industry",
    languages: { "zh-CN": "https://idc-index.com/industry", en: "https://idc-index.com/en/industry", "x-default": "https://idc-index.com/en/industry" },
  },
  openGraph: {
    title: "IDC 产业中心｜算力、园区、电力与液冷",
    description: "追踪从算力芯片、网络和电力，到大型园区、液冷与模型需求的公开进展。",
    url: "https://idc-index.com/industry",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 产业中心" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IDC 产业中心｜算力、园区、电力与液冷",
    description: "追踪从算力芯片、网络和电力，到大型园区、液冷与模型需求的公开进展。",
    images: ["/og.png"],
  },
};

export default async function IndustryPage() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
  const canonical = "https://idc-index.com/industry";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "IDC 产业中心",
        url: canonical,
        inLanguage: "zh-CN",
        description: metadata.description,
        dateModified: initialPayload?.generatedAt,
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
        about: ["AI 芯片", "服务器与网络", "数据中心电力", "液冷", "大型数据中心园区"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: "产业中心", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Home initialPayload={initialPayload} view="industry" /></>;
}
