import type { Metadata } from "next";
import CapexPowerArticle from "./article";

const canonical = "https://idc-index.com/columns/ai-capex-power";

export const metadata: Metadata = {
  title: "AI 基建竞赛进入电力时代｜IDC Atlas",
  description: "从 Microsoft、Alphabet、Meta 与 Amazon 的资本开支，看 AI 基础设施约束如何从芯片扩展至电力、园区、液冷与投运。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/ai-capex-power" } },
  openGraph: { title: "AI 基建竞赛进入电力时代", description: "科技巨头的资本开支，正在从芯片订单传导至电力、园区和可计费容量。", url: canonical, type: "article", publishedTime: "2026-07-27T00:00:00+08:00", images: [{ url: "https://idc-index.com/column-ai-capex-grid.png", width: 1672, height: 941, alt: "AI 数据中心与电网约束" }] },
  twitter: { card: "summary_large_image", title: "AI 基建竞赛进入电力时代", description: "四家科技巨头的资本开支，正在揭示 AI 基建的供电与投运约束。", images: ["https://idc-index.com/column-ai-capex-grid.png"] },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "AI 基建竞赛进入电力时代",
        description: metadata.description,
        image: "https://idc-index.com/column-ai-capex-grid.png",
        datePublished: "2026-07-27T00:00:00+08:00",
        dateModified: "2026-07-27T00:00:00+08:00",
        inLanguage: "zh-CN",
        articleSection: "AI 基础设施资本开支",
        isAccessibleForFree: true,
        about: ["超大规模云厂商资本开支", "数据中心电力", "液冷", "可计费 AI 容量"],
        citation: [
          "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3",
          "https://abc.xyz/investor/events/event-details/2026/2025-Q4-Earnings-Call-2026-Dr_C033hS6/default.aspx",
          "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000048/goog-20260331.htm",
          "https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-First-Quarter-2026-Results/",
          "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-First-Quarter-Results/default.aspx",
        ],
        author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        mainEntityOfPage: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: "专栏", item: "https://idc-index.com/columns" },
          { "@type": "ListItem", position: 3, name: "AI 基建竞赛进入电力时代", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CapexPowerArticle lang="zh" /></>;
}
