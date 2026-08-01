import type { Metadata } from "next";
import SkHynixHbmEarningsArticle from "./article";

const canonical = "https://idc-index.com/columns/sk-hynix-hbm-earnings";
export const metadata: Metadata = {
  title: "海力士财报之后，AI 存储的好消息还剩什么？｜IDC Atlas",
  description: "解读 SK hynix 2026 年二季度业绩：长期客户协议、HBM4 执行与资本开支纪律如何影响 AI 存储周期。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/sk-hynix-hbm-earnings" } },
  openGraph: { title: "海力士财报之后，AI 存储的好消息还剩什么？", description: "财报以外，客户协议、HBM4 和扩产纪律才是下一阶段的三条线索。", url: canonical, type: "article", publishedTime: "2026-07-29T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-sk-hynix-hbm.png", width: 1672, height: 941, alt: "连接 AI 数据中心的高带宽存储堆叠" }] },
  twitter: { card: "summary_large_image", title: "海力士财报之后，AI 存储的好消息还剩什么？", description: "三条线索：客户协议、HBM4、扩产纪律。", images: ["https://idc-index.com/column-sk-hynix-hbm.png"] },
};
export default function Page() { const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: "海力士财报之后，AI 存储的好消息还剩什么？", description: metadata.description, image: "https://idc-index.com/column-sk-hynix-hbm.png", datePublished: "2026-07-29T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "zh-CN", articleSection: "AI 存储与 HBM", isAccessibleForFree: true, about: ["SK hynix", "HBM4", "AI memory", "DRAM"], citation: ["https://news.skhynix.com/en/q2-2026-business-results/", "https://www.skhynix.com/ir/UI-FR-IR99/", "https://www.investing.com/news/stock-market-news/sk-hynix-ceo-sees-worstever-memory-supply-shortage-in-2027-says-demand-to-outstrip-supply-beyond-2030-4786660"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical }; return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><SkHynixHbmEarningsArticle lang="zh" /></>; }
