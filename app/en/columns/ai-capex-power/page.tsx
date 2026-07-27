import type { Metadata } from "next";
import CapexPowerArticle from "../../../columns/ai-capex-power/article";

const canonical = "https://idc-index.com/en/columns/ai-capex-power";

export const metadata: Metadata = {
  title: "The AI Buildout Enters Its Power-Hungry Phase｜IDC Atlas",
  description: "What Microsoft, Alphabet, Meta and Amazon capital spending says about power, data centers, cooling and revenue-ready AI capacity.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/ai-capex-power", en: canonical } },
  openGraph: { title: "The AI Buildout Enters Its Power-Hungry Phase", description: "Hyperscaler CapEx is moving from chip orders into power, campuses and billable AI capacity.", url: canonical, type: "article", publishedTime: "2026-07-27T00:00:00+08:00", images: [{ url: "https://idc-index.com/column-ai-capex-grid.png", width: 1672, height: 941, alt: "AI data centers meeting a constrained electric grid" }] },
  twitter: { card: "summary_large_image", title: "The AI Buildout Enters Its Power-Hungry Phase", description: "Four hyperscalers reveal the power and commissioning constraints shaping the AI buildout.", images: ["https://idc-index.com/column-ai-capex-grid.png"] },
};

export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: "The AI Buildout Enters Its Power-Hungry Phase", description: metadata.description, image: "https://idc-index.com/column-ai-capex-grid.png", datePublished: "2026-07-27T00:00:00+08:00", dateModified: "2026-07-27T00:00:00+08:00", inLanguage: "en", author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, mainEntityOfPage: canonical };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CapexPowerArticle lang="en" /></>;
}
