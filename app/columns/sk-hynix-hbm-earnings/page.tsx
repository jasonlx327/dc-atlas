import type { Metadata } from "next";
import SkHynixHbmEarningsArticle from "./article";

const canonical = "https://idc-index.com/columns/sk-hynix-hbm-earnings";
export const metadata: Metadata = {
  title: "海力士财报之后，AI 存储景气的三项验证｜IDC Atlas",
  description: "解读 SK hynix 2026 年二季度业绩：长期客户协议、HBM4 执行与资本开支纪律如何影响 AI 存储周期。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/sk-hynix-hbm-earnings", "x-default": "https://idc-index.com/en/columns/sk-hynix-hbm-earnings" } },
  openGraph: { title: "海力士财报之后，AI 存储景气的三项验证", description: "财报以外，客户协议、HBM4 和扩产纪律才是下一阶段的三条线索。", url: canonical, type: "article", publishedTime: "2026-07-29T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-sk-hynix-hbm-earnings-voxel-palette-v1.jpg", width: 1672, height: 941, alt: "概念体素插画：高带宽存储堆栈与分期扩建模块" }] },
  twitter: { card: "summary_large_image", title: "海力士财报之后，AI 存储景气的三项验证", description: "三条线索：客户协议、HBM4、扩产纪律。", images: ["https://idc-index.com/column-sk-hynix-hbm-earnings-voxel-palette-v1.jpg"] },
};
export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", "@id": `${canonical}#article`, url: canonical, workTranslation: { "@id": `${canonical.replace("/columns/", "/en/columns/")}#article` },  headline: "海力士财报之后，AI 存储景气的三项验证", description: metadata.description, image: "https://idc-index.com/column-sk-hynix-hbm-earnings-voxel-palette-v1.jpg", datePublished: "2026-07-29T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "zh-CN", articleSection: "AI 存储与 HBM", isAccessibleForFree: true, about: ["SK hynix", "HBM4", "AI memory", "DRAM"], citation: ["https://news.skhynix.com/en/q2-2026-business-results/", "https://www.skhynix.com/ir/UI-FR-IR99/", "https://www.investing.com/news/stock-market-news/sk-hynix-ceo-sees-worstever-memory-supply-shortage-in-2027-says-demand-to-outstrip-supply-beyond-2030-4786660"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "专栏", item: "https://idc-index.com/columns" }, { "@type": "ListItem", position: 3, name: "海力士财报之后，AI 存储景气的三项验证", item: canonical }] },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><SkHynixHbmEarningsArticle lang="zh" /></>;
}
