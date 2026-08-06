import type { Metadata } from "next";
import FrontierModelEconomicsArticle from "./article";

const canonical = "https://idc-index.com/columns/frontier-model-economics";
export const metadata: Metadata = { title: "模型价格开始分层，AI 基建进入调用深度竞争｜IDC Atlas", description: "从 GPT-5.6、Claude Sonnet 5、Opus 4.8 与 Fable 5 看模型分层、代理工作流和 AI 推理基础设施需求。", alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/frontier-model-economics", "x-default": "https://idc-index.com/en/columns/frontier-model-economics" } }, openGraph: { title: "模型价格开始分层，AI 基建进入调用深度竞争", description: "单位完成任务成本下降后，调用深度、峰值并发与已投运容量才是关键。", url: canonical, type: "article", publishedTime: "2026-07-29T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-frontier-model-economics-v2.jpg", alt: "AI 模型与基础设施链路" }] } };
export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: "模型价格开始分层，AI 基建进入调用深度竞争", description: metadata.description, image: "https://idc-index.com/column-frontier-model-economics-v2.jpg", datePublished: "2026-07-29T00:00:00+08:00", dateModified: "2026-08-01T23:00:00+08:00", inLanguage: "zh-CN", articleSection: "AI 模型需求与基础设施", citation: ["https://openai.com/index/gpt-5-6/", "https://www.anthropic.com/news/claude-sonnet-5", "https://www.anthropic.com/news/claude-opus-4-8", "https://www.anthropic.com/news/redeploying-fable-5"], author: { "@type": "Organization", name: "IDC Atlas" }, publisher: { "@type": "Organization", name: "IDC Atlas" }, mainEntityOfPage: canonical },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "专栏", item: "https://idc-index.com/columns" }, { "@type": "ListItem", position: 3, name: "模型价格开始分层，AI 基建进入调用深度竞争", item: canonical }] },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><FrontierModelEconomicsArticle lang="zh" /></>;
}
