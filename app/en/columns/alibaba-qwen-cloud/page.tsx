import type { Metadata } from "next";
import AlibabaQwenCloudArticle from "../../../columns/alibaba-qwen-cloud/article";

const canonical = "https://idc-index.com/en/columns/alibaba-qwen-cloud";
const image = "https://idc-index.com/column-alibaba-qwen-cloud-voxel-palette-v1.jpg";
const citations = [
  "https://data.alibabagroup.com/ecms-files/1532295521/5b1cb883-8d00-4237-a148-6631cc12a5d2/Alibaba%20Group%20Announces%20March%20Quarter%202026%20and%20Fiscal%20Year%202026%20Results.pdf",
  "https://help.aliyun.com/en/model-studio/models",
  "https://www.alibabagroup.com/en-US/document-1991364841188622336",
  "https://www.alibabagroup.com/en-US/document-1830678592242057216",
];

export const metadata: Metadata = {
  title: "Qwen3.8 Is Live: Seven Tests for Alibaba Cloud’s Next Earnings | IDC Atlas",
  description: "Seven source-led tests across external cloud growth, model-service ARR, the RMB380B infrastructure plan, proprietary chips, margin and cash conversion.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/alibaba-qwen-cloud", en: canonical, "x-default": canonical } },
  openGraph: { title: "Qwen3.8 Is Live. Alibaba Cloud Now Faces Seven Tests.", description: "The model launch raises the bar for recurring use, sellable capacity, cloud profit and cash conversion.", url: canonical, type: "article", publishedTime: "2026-08-03T17:20:00+08:00", modifiedTime: "2026-08-03T17:20:00+08:00", images: [{ url: image, width: 1672, height: 941, alt: "Conceptual voxel illustration of model-service hub linked to a cloud rack terrace" }] },
  twitter: { card: "summary_large_image", title: "Seven Tests for Alibaba Cloud After Qwen3.8", description: "Revenue quality, model monetization, capacity, proprietary silicon, margin and cash.", images: [image] },
};

export default function Page() {
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "AnalysisNewsArticle", "@id": `${canonical}#article`, url: canonical, translationOfWork: { "@id": `${canonical.replace("/en/", "/")}#article` },  headline: "Qwen3.8 Is Live: Seven Tests for Alibaba Cloud’s Next Earnings", description: metadata.description, image, datePublished: "2026-08-03T17:20:00+08:00", dateModified: "2026-08-03T17:20:00+08:00", inLanguage: "en", articleSection: "China Cloud and AI Infrastructure", isAccessibleForFree: true, about: ["Alibaba", "Alibaba Cloud", "Qwen3.8", "AI infrastructure", "cloud computing"], citation: citations, author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" }, { "@type": "ListItem", position: 2, name: "Columns", item: "https://idc-index.com/en/columns" }, { "@type": "ListItem", position: 3, name: "Alibaba Cloud after Qwen3.8", item: canonical }] },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><AlibabaQwenCloudArticle lang="en" /></>;
}
