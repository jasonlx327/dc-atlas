import type { Metadata } from "next";
import ColumnsIndex from "./columns-index";

const canonical = "https://idc-index.com/columns";

export const metadata: Metadata = {
  title: "IDC Atlas 专栏｜数据中心与 AI 基础设施研究",
  description: "IDC Atlas 原创专栏，分析数据中心合同、云厂商资本开支、电力、液冷与可计费容量。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns" } },
  openGraph: { title: "IDC Atlas 专栏", description: "数据中心与 AI 基础设施的来源可追溯研究。", url: canonical, type: "website" },
};

export default function Page() {
  return <ColumnsIndex lang="zh" />;
}
