import type { Metadata } from "next";
import IndustryNetworkClient from "./industry-network-client";

const canonical = "https://idc-index.com/industry-network";

export const metadata: Metadata = {
  title: "产业链信息网｜IDC Atlas",
  description: "从一家公司出发，查看它与上下游之间的公开关系、金额与来源，覆盖 HBM、液冷、电力、租赁、存储与国产算力链。",
  alternates: {
    canonical,
    languages: { "zh-CN": canonical, en: "https://idc-index.com/en/industry-network", "x-default": "https://idc-index.com/en/industry-network" },
  },
  openGraph: { title: "产业链信息网｜IDC Atlas", description: "从一家公司出发，查看它与上下游之间的公开关系、金额与来源，覆盖 HBM、液冷、电力、租赁、存储与国产算力链。", url: canonical, type: "website", images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 产业链信息网" }] },
  twitter: { card: "summary_large_image", title: "产业链信息网｜IDC Atlas", description: "从一家公司出发，查看它与上下游之间的公开关系、金额与来源，覆盖 HBM、液冷、电力、租赁、存储与国产算力链。", images: ["/og.png"] },
};

export default async function IndustryNetworkPage({ searchParams }: { searchParams: Promise<{ focus?: string | string[]; scenario?: string | string[] }> }) {
  const params = await searchParams;
  const focus = typeof params.focus === "string" ? params.focus : undefined;
  const scenario = typeof params.scenario === "string" ? params.scenario : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "产业链信息网",
        description: metadata.description,
        url: canonical,
        inLanguage: "zh-CN",
        about: ["HBM", "液冷", "数据中心电力", "IDC 租赁", "存储", "国产算力"],
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
        mainEntity: {
          "@type": "WebApplication",
          name: "IDC Atlas 产业链关系网络",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          isAccessibleForFree: true,
          featureList: ["按公司或项目查看上下游关系", "查看关系金额与来源", "按产业主题筛选公开证据"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: "产业链信息网", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><IndustryNetworkClient lang="zh" initialFocus={focus} initialScenario={scenario} /></>;
}
