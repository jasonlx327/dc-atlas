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
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "The AI Buildout Enters Its Power-Hungry Phase",
        description: metadata.description,
        image: "https://idc-index.com/column-ai-capex-grid.png",
        datePublished: "2026-07-27T00:00:00+08:00",
        dateModified: "2026-07-27T00:00:00+08:00",
        inLanguage: "en-US",
        articleSection: "AI infrastructure capital expenditure",
        isAccessibleForFree: true,
        about: ["Hyperscaler capital expenditure", "Data center power", "Liquid cooling", "Revenue-ready AI capacity"],
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
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: "Columns", item: "https://idc-index.com/en/columns" },
          { "@type": "ListItem", position: 3, name: "The AI Buildout Enters Its Power-Hungry Phase", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CapexPowerArticle lang="en" /></>;
}
