import type { Metadata } from "next";
import FrontierModelEconomicsArticle from "../../../columns/frontier-model-economics/article";

const canonical = "https://idc-index.com/en/columns/frontier-model-economics";
export const metadata: Metadata = { title: "Model Prices Are Fragmenting. What Changes for AI Infrastructure? | IDC Atlas", description: "A source-linked analysis of GPT-5.6, Claude Sonnet 5, Opus 4.8 and Fable 5, and the infrastructure consequences of model tiering.", alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/frontier-model-economics", en: canonical, "x-default": canonical } }, openGraph: { title: "Model Prices Are Fragmenting. What Changes for AI Infrastructure?", description: "Work depth, peak concurrency and capacity in service matter more than a single benchmark headline.", url: canonical, type: "article", publishedTime: "2026-07-29T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/ai-infrastructure-chain.png", alt: "AI model and infrastructure chain" }] } };
export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: "Model Prices Are Fragmenting. What Changes for AI Infrastructure?", description: metadata.description, image: "https://idc-index.com/ai-infrastructure-chain.png", datePublished: "2026-07-29T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "en", articleSection: "AI Model Demand and Infrastructure", citation: ["https://openai.com/index/gpt-5-6/", "https://www.anthropic.com/news/claude-sonnet-5", "https://www.anthropic.com/news/claude-opus-4-8", "https://www.anthropic.com/news/redeploying-fable-5"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "Columns", item: "https://idc-index.com/en/columns" }, { "@type": "ListItem", position: 3, name: "Model Prices Are Fragmenting", item: canonical }] },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><FrontierModelEconomicsArticle lang="en" /></>;
}
