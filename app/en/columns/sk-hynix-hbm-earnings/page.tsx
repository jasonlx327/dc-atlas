import type { Metadata } from "next";
import SkHynixHbmEarningsArticle from "../../../columns/sk-hynix-hbm-earnings/article";

const canonical = "https://idc-index.com/en/columns/sk-hynix-hbm-earnings";
export const metadata: Metadata = {
  title: "After SK hynix Earnings, What Still Looks Good in AI Memory? | IDC Atlas",
  description: "A source-linked read of SK hynix Q2 2026 results through contracted demand, HBM4 execution and disciplined capacity expansion.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/sk-hynix-hbm-earnings", en: canonical } },
  openGraph: { title: "After SK hynix Earnings, What Still Looks Good in AI Memory?", description: "Customer agreements, HBM4 execution and supply discipline are the three signals for the next stage.", url: canonical, type: "article", publishedTime: "2026-07-29T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-sk-hynix-hbm.png", width: 1672, height: 941, alt: "Stacked high-bandwidth memory connected to an AI data center" }] },
  twitter: { card: "summary_large_image", title: "After SK hynix Earnings, What Still Looks Good in AI Memory?", description: "Contracts, HBM4 and supply discipline.", images: ["https://idc-index.com/column-sk-hynix-hbm.png"] },
};
export default function Page() { const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: "After SK hynix Earnings, What Still Looks Good in AI Memory?", description: metadata.description, image: "https://idc-index.com/column-sk-hynix-hbm.png", datePublished: "2026-07-29T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "en", articleSection: "AI Memory and HBM", isAccessibleForFree: true, about: ["SK hynix", "HBM4", "AI memory", "DRAM"], citation: ["https://news.skhynix.com/en/q2-2026-business-results/", "https://www.skhynix.com/ir/UI-FR-IR99/", "https://www.investing.com/news/stock-market-news/sk-hynix-ceo-sees-worstever-memory-supply-shortage-in-2027-says-demand-to-outstrip-supply-beyond-2030-4786660"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical }; return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><SkHynixHbmEarningsArticle lang="en" /></>; }
