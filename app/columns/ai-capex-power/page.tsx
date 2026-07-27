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
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: "AI 基建竞赛进入电力时代", description: metadata.description, image: "https://idc-index.com/column-ai-capex-grid.png", datePublished: "2026-07-27T00:00:00+08:00", dateModified: "2026-07-27T00:00:00+08:00", inLanguage: "zh-CN", author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, mainEntityOfPage: canonical };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CapexPowerArticle lang="zh" /></>;
}
