import type { Metadata } from "next";
import HyperscaleLeaseArticle from "./article";

const canonical = "https://idc-index.com/columns/hyperscale-idc-leases";

export const metadata: Metadata = {
  title: "GW 级长租正在改写 IDC 订单｜IDC Atlas",
  description: "从 CoreWeave、Digital Realty、世纪互联等最新公开合同，分析头部互联网与云客户的 IDC 长租结构、交付节奏和风险。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/hyperscale-idc-leases" } },
  openGraph: { title: "GW 级长租正在改写 IDC 订单", description: "签约 MW 提升收入可见度，送电、融资、交付和客户集中度决定订单价值。", url: canonical, type: "article", publishedTime: "2026-07-28T00:00:00+08:00", images: [{ url: "https://idc-index.com/column-hyperscale-leases.png", width: 1672, height: 941, alt: "由长期容量合同连接的超大规模数据中心园区" }] },
  twitter: { card: "summary_large_image", title: "GW 级长租正在改写 IDC 订单", description: "拆解 100–600MW 长租合同如何转化为已送电、可计费的 IDC 容量。", images: ["https://idc-index.com/column-hyperscale-leases.png"] },
};

export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: "GW 级长租正在改写 IDC 订单", description: metadata.description, image: "https://idc-index.com/column-hyperscale-leases.png", datePublished: "2026-07-28T00:00:00+08:00", dateModified: "2026-07-28T00:00:00+08:00", inLanguage: "zh-CN", author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" }, mainEntityOfPage: canonical };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HyperscaleLeaseArticle lang="zh" /></>;
}
