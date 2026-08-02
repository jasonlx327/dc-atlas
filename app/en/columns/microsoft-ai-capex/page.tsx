import type { Metadata } from "next";
import MicrosoftAiCapexArticle from "../../../columns/microsoft-ai-capex/article";

const canonical = "https://idc-index.com/en/columns/microsoft-ai-capex";
const image = "https://idc-index.com/column-microsoft-ai-capex.png";

export const metadata: Metadata = {
  title: "Azure at 43%: What Microsoft’s Next $50 Billion Quarter Must Deliver | IDC Atlas",
  description: "A source-led analysis of Microsoft FY2026 Q4 across Azure capacity, fleet efficiency, deployment speed, lease accounting and the infrastructure chain behind next quarter's $50B-plus CapEx.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/microsoft-ai-capex", en: canonical, "x-default": canonical } },
  openGraph: { title: "Azure at 43%: What Must the Next $50B Deliver?", description: "One gigawatt, faster GPU activation and a less comparable CapEx line reshape the Microsoft AI-infrastructure read.", url: canonical, type: "article", publishedTime: "2026-07-31T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: image, width: 1672, height: 941, alt: "AI data center capacity connecting server halls with grid infrastructure" }] },
  twitter: { card: "summary_large_image", title: "Azure at 43%: Microsoft’s Next $50B Quarter", description: "Capacity, efficiency, activation speed and the build intensity hidden by accounting.", images: [image] },
};

export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "AnalysisNewsArticle", headline: "Azure at 43%: What Microsoft’s Next $50 Billion Quarter Must Deliver", description: metadata.description, image, datePublished: "2026-07-31T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "en", articleSection: "Cloud CapEx and Data Centers", isAccessibleForFree: true, about: ["Microsoft", "Azure", "AI infrastructure", "data center CapEx", "cloud computing"], citation: ["https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast", "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "Columns", item: "https://idc-index.com/en/columns" }, { "@type": "ListItem", position: 3, name: "Azure at 43%", item: canonical }] },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><MicrosoftAiCapexArticle lang="en" /></>;
}
