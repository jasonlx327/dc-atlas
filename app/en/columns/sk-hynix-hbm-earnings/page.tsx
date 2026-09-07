import type { Metadata } from "next";
import SkHynixHbmEarningsArticle from "../../../columns/sk-hynix-hbm-earnings/article";

const canonical = "https://idc-index.com/en/columns/sk-hynix-hbm-earnings";
export const metadata: Metadata = {
  title: "After SK hynix Earnings: Three Tests for AI Memory | IDC Atlas",
  description: "A source-linked read of SK hynix Q2 2026 results through contracted demand, HBM4 execution and disciplined capacity expansion.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/sk-hynix-hbm-earnings", en: canonical, "x-default": canonical } },
  openGraph: { title: "After SK hynix Earnings: Three Tests for AI Memory", description: "Customer agreements, HBM4 execution and supply discipline are the three signals for the next stage.", url: canonical, type: "article", publishedTime: "2026-07-29T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-sk-hynix-hbm-earnings-voxel-palette-v1.jpg", width: 1672, height: 941, alt: "Conceptual voxel illustration of monumental hbm stack with a restrained expansion terrace" }] },
  twitter: { card: "summary_large_image", title: "After SK hynix Earnings: Three Tests for AI Memory", description: "Contracts, HBM4 and supply discipline.", images: ["https://idc-index.com/column-sk-hynix-hbm-earnings-voxel-palette-v1.jpg"] },
};
export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", "@id": `${canonical}#article`, url: canonical, translationOfWork: { "@id": `${canonical.replace("/en/", "/")}#article` },  headline: "After SK hynix Earnings: Three Tests for AI Memory", description: metadata.description, image: "https://idc-index.com/column-sk-hynix-hbm-earnings-voxel-palette-v1.jpg", datePublished: "2026-07-29T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "en", articleSection: "AI Memory and HBM", isAccessibleForFree: true, about: ["SK hynix", "HBM4", "AI memory", "DRAM"], citation: ["https://news.skhynix.com/en/q2-2026-business-results/", "https://www.skhynix.com/ir/UI-FR-IR99/", "https://www.investing.com/news/stock-market-news/sk-hynix-ceo-sees-worstever-memory-supply-shortage-in-2027-says-demand-to-outstrip-supply-beyond-2030-4786660"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "Columns", item: "https://idc-index.com/en/columns" }, { "@type": "ListItem", position: 3, name: "After SK hynix Earnings", item: canonical }] },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><SkHynixHbmEarningsArticle lang="en" /></>;
}
