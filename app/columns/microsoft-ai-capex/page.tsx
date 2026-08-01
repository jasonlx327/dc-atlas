import type { Metadata } from "next";
import MicrosoftAiCapexArticle from "./article";

const canonical = "https://idc-index.com/columns/microsoft-ai-capex";
const image = "https://idc-index.com/column-microsoft-ai-capex.png";

export const metadata: Metadata = {
  title: "Azure 增长 43% 之后，微软 500 亿美元 CAPEX 要兑现什么？｜IDC Atlas",
  description: "深度拆解微软 FY2026 Q4：Azure 增长的容量、效率与交付周期，资本开支会计口径，以及超过 500 亿美元下一季度投入的产业链传导。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/microsoft-ai-capex" } },
  openGraph: { title: "Azure 增长 43% 之后，500 亿美元要兑现什么？", description: "从新增 1GW、GPU 上线速度、租赁会计到自由现金流，追踪微软 AI 基础设施的真实兑现路径。", url: canonical, type: "article", publishedTime: "2026-07-31T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: image, width: 1672, height: 941, alt: "连接服务器机房与电网设施的 AI 数据中心容量管线" }] },
  twitter: { card: "summary_large_image", title: "Azure 43% 之后：微软下一季 500 亿美元要买来什么？", description: "容量、效率、上线速度，以及被会计口径遮住的建设强度。", images: [image] },
};

export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@type": "AnalysisNewsArticle", headline: "Azure 增长 43% 之后，微软 500 亿美元 CAPEX 要兑现什么？", description: metadata.description, image, datePublished: "2026-07-31T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "zh-CN", articleSection: "云资本开支与数据中心", isAccessibleForFree: true, about: ["Microsoft", "Azure", "AI infrastructure", "data center CapEx", "cloud computing"], citation: ["https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast", "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><MicrosoftAiCapexArticle lang="zh" /></>;
}
