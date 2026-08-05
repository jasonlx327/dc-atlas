import type { Metadata } from "next";
import ColumnsIndex from "./columns-index";

const canonical = "https://idc-index.com/columns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IDC Atlas 专栏｜数据中心与 AI 基础设施研究",
  description: "IDC Atlas 原创专栏，分析数据中心合同、云厂商资本开支、电力、液冷与可计费容量。",
  alternates: {
    canonical,
    languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns", "x-default": "https://idc-index.com/en/columns" },
    types: { "application/rss+xml": "https://idc-index.com/feed.xml" },
  },
  openGraph: { title: "IDC Atlas 专栏", description: "数据中心与 AI 基础设施的来源可追溯研究。", url: canonical, type: "website", images: [{ url: "https://idc-index.com/column-cxmt-us-chips-v2.jpg", width: 1672, height: 941, alt: "IDC Atlas 数据中心与 AI 基础设施研究" }] },
  twitter: { card: "summary_large_image", title: "IDC Atlas 专栏", description: "数据中心与 AI 基础设施的来源可追溯研究。", images: ["https://idc-index.com/column-cxmt-us-chips-v2.jpg"] },
};

export default function Page() {
  return <ColumnsIndex lang="zh" />;
}
