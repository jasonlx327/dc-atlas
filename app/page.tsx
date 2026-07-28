import type { Metadata } from "next";
import Home, { type AtlasPayload } from "./home-client";
import { loadInitialAtlasPayload } from "./initial-atlas";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { "zh-CN": "/", en: "/en", "x-default": "/en" } },
};

export default async function Page() {
  const initialPayload = await loadInitialAtlasPayload() as Partial<AtlasPayload> | null;
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
        about: [
          { "@type": "Thing", name: "数据中心基础设施" },
          { "@type": "Thing", name: "超大规模云厂商资本开支" },
          { "@type": "Thing", name: "数据中心电力与液冷" },
        ],
        hasPart: [
          { "@type": "WebPage", name: "IDC 项目脉冲", url: "https://idc-index.com/pulse" },
          { "@type": "WebPage", name: "AI 基础设施产业链", url: "https://idc-index.com/industry" },
          { "@type": "WebPage", name: "IDC Atlas 专栏", url: "https://idc-index.com/columns" },
        ],
      },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Home initialPayload={initialPayload} /></>;
}
