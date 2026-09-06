import type { Metadata } from "next";
import CapexPowerArticle from "../../../columns/ai-capex-power/article";

const canonical = "https://idc-index.com/en/columns/ai-capex-power";

export const metadata: Metadata = {
  title: "Where Hyperscaler AI CapEx Actually Goes｜IDC Atlas",
  description: "A source-linked breakdown of Microsoft, Alphabet, Meta and Amazon AI infrastructure spending, from silicon and servers to campuses, power and billable capacity.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/ai-capex-power", en: canonical, "x-default": canonical } },
  openGraph: { title: "Where Hyperscaler AI CapEx Actually Goes", description: "Follow the capital from silicon orders through campuses, power, commissioning and billable cloud capacity.", url: canonical, type: "article", publishedTime: "2026-07-27T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-ai-capex-power-voxel-palette-v1.jpg", width: 1672, height: 941, alt: "Conceptual voxel illustration of a large compute demand hub meeting a narrow power connector" }] },
  twitter: { card: "summary_large_image", title: "Where Hyperscaler AI CapEx Actually Goes", description: "Microsoft, Alphabet, Meta and Amazon show how AI infrastructure spending moves through the physical stack.", images: ["https://idc-index.com/column-ai-capex-power-voxel-palette-v1.jpg"] },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Where Hyperscaler AI CapEx Actually Goes",
        description: metadata.description,
        image: "https://idc-index.com/column-ai-capex-power-voxel-palette-v1.jpg",
        datePublished: "2026-07-27T00:00:00+08:00",
        dateModified: "2026-08-01T23:00:00+08:00",
        inLanguage: "en-US",
        articleSection: "AI infrastructure capital expenditure",
        isAccessibleForFree: true,
        about: ["Hyperscaler capital expenditure", "Data center power", "Liquid cooling", "Revenue-ready AI capacity"],
        citation: [
          "https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast",
          "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4",
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
          { "@type": "ListItem", position: 3, name: "Where Hyperscaler AI CapEx Actually Goes", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CapexPowerArticle lang="en" /></>;
}
