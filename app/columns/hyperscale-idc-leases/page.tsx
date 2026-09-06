import type { Metadata } from "next";
import HyperscaleLeaseArticle from "./article";

const canonical = "https://idc-index.com/columns/hyperscale-idc-leases";

export const metadata: Metadata = {
  title: "GW 级长租正在改写 IDC 订单｜IDC Atlas",
  description: "从 CoreWeave、Digital Realty、世纪互联等最新公开合同，分析头部互联网与云客户的 IDC 长租结构、交付节奏和风险。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/hyperscale-idc-leases", "x-default": "https://idc-index.com/en/columns/hyperscale-idc-leases" } },
  openGraph: { title: "GW 级长租正在改写 IDC 订单", description: "签约 MW 提升收入可见度，送电、融资、交付和客户集中度决定订单价值。", url: canonical, type: "article", publishedTime: "2026-07-28T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-hyperscale-idc-leases-voxel-palette-v1.jpg", width: 1672, height: 941, alt: "概念体素插画：沿交付通道排列的分期机房与电力开关" }] },
  twitter: { card: "summary_large_image", title: "GW 级长租正在改写 IDC 订单", description: "拆解 100–600MW 长租合同如何转化为已送电、可计费的 IDC 容量。", images: ["https://idc-index.com/column-hyperscale-idc-leases-voxel-palette-v1.jpg"] },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "GW 级长租正在改写 IDC 订单",
        description: metadata.description,
        image: "https://idc-index.com/column-hyperscale-idc-leases-voxel-palette-v1.jpg",
        datePublished: "2026-07-28T00:00:00+08:00",
        dateModified: "2026-08-01T23:00:00+08:00",
        inLanguage: "zh-CN",
        articleSection: "超大规模数据中心租赁",
        isAccessibleForFree: true,
        about: ["数据中心长租", "超大规模云客户", "送电容量", "可计费 MW"],
        citation: [
          "https://ir.applieddigital.com/sec-filings/all-sec-filings/content/0001144879-26-000036/apld_invxinvestorpresent.htm",
          "https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001193125-26-165121/d149019dex992.htm",
          "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-announces-purchase-blackstone-interest-three",
          "https://ir.vnet.com/news-releases/news-release-details/vnet-reports-unaudited-first-quarter-2026-financial-results",
        ],
        author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        mainEntityOfPage: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: "专栏", item: "https://idc-index.com/columns" },
          { "@type": "ListItem", position: 3, name: "GW 级长租正在改写 IDC 订单", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HyperscaleLeaseArticle lang="zh" /></>;
}
