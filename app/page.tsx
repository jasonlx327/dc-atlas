import type { Metadata } from "next";
import Home, { type AtlasPayload } from "./home-client";
import { loadInitialAtlasPayload } from "./initial-atlas";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { "zh-CN": "/", en: "/en" } },
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
        description: "全球数据中心产业地图与实时情报站。",
      },
      {
        "@type": "Organization",
        name: "IDC Atlas",
        url: "https://idc-index.com/",
        sameAs: ["https://github.com/jasonlx327"],
      },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><Home initialPayload={initialPayload} /></>;
}
