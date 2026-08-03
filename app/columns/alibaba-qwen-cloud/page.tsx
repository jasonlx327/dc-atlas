import type { Metadata } from "next";
import AlibabaQwenCloudArticle from "./article";

const canonical = "https://idc-index.com/columns/alibaba-qwen-cloud";
const image = "https://idc-index.com/column-alibaba-qwen-cloud-v2.jpg";
const citations = [
  "https://data.alibabagroup.com/ecms-files/1532295521/5b1cb883-8d00-4237-a148-6631cc12a5d2/Alibaba%20Group%20Announces%20March%20Quarter%202026%20and%20Fiscal%20Year%202026%20Results.pdf",
  "https://help.aliyun.com/en/model-studio/models",
  "https://www.alibabagroup.com/en-US/document-1991364841188622336",
  "https://www.alibabagroup.com/en-US/document-1830678592242057216",
];

export const metadata: Metadata = {
  title: "Qwen3.8 已上线，阿里云下一份财报要回答七个问题｜IDC Atlas",
  description: "从外部云收入、模型服务 ARR、三年 3800 亿元基础设施投入、自研芯片、利润率与现金流，拆解阿里云下一份财报的七项检验。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/alibaba-qwen-cloud", "x-default": "https://idc-index.com/en/columns/alibaba-qwen-cloud" } },
  openGraph: { title: "Qwen3.8 已上线，阿里云下一份财报要回答七个问题", description: "模型发布之后，重点转向持续调用、可售算力、云利润与现金回报。", url: canonical, type: "article", publishedTime: "2026-08-03T17:20:00+08:00", modifiedTime: "2026-08-03T17:20:00+08:00", images: [{ url: image, width: 1672, height: 941, alt: "连接云网络、电力与冷却设施的推理机架" }] },
  twitter: { card: "summary_large_image", title: "Qwen3.8 上线后，阿里云财报要回答什么？", description: "七项检验：增长质量、模型商业化、容量、自研芯片、利润和现金流。", images: [image] },
};

export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "AnalysisNewsArticle", headline: "Qwen3.8 已上线，阿里云下一份财报要回答七个问题", description: metadata.description, image, datePublished: "2026-08-03T17:20:00+08:00", dateModified: "2026-08-03T17:20:00+08:00", inLanguage: "zh-CN", articleSection: "中国云计算与 AI 基础设施", isAccessibleForFree: true, about: ["Alibaba", "Alibaba Cloud", "Qwen3.8", "AI infrastructure", "cloud computing"], citation: citations, author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "专栏", item: "https://idc-index.com/columns" }, { "@type": "ListItem", position: 3, name: "Qwen3.8 与阿里云财报", item: canonical }] },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><AlibabaQwenCloudArticle lang="zh" /></>;
}
