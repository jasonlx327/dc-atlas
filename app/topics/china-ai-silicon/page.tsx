import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://idc-index.com/topics/china-ai-silicon";

export const metadata: Metadata = {
  title: "中国 GPU 与 AI 芯片进展｜IDC Atlas",
  description: "追踪中国 GPU、DCU、AI 加速芯片、超节点与开发者生态的公开进展。",
  alternates: {
    canonical,
    languages: {
      "zh-CN": canonical,
      en: "https://idc-index.com/en/topics/china-ai-silicon",
      "x-default": "https://idc-index.com/en/topics/china-ai-silicon",
    },
  },
  openGraph: { title: "中国 GPU 与 AI 芯片进展", description: "中国 GPU、DCU、AI 加速芯片与超节点的公开进展。", url: canonical, type: "article" },
};

const sections = [
  ["芯片与产品", "关注 GPU、DCU 与 AI 加速芯片的产品披露、研发、适配和交付进展，不以未经证实的性能传闻作为结论。"],
  ["超节点与互联", "单卡之外，集群互联、统一内存、液冷和系统软件决定了大规模部署是否可行。"],
  ["软件生态", "开发者工具链、框架适配、通信库和运维能力，是判断国产算力工程可用性的核心观察维度。"],
] as const;

const faqs = [
  ["本专题覆盖哪些中国 AI 芯片范围？", "覆盖 GPU、DCU、AI 加速器、超节点、互联与开发者生态，不将未经证实的产品传闻当作事实。"],
  ["什么信息算作已核验？", "以厂商、交易所、开发者站和项目公告等原始披露为准；媒体报道作为线索并与原始来源区分。"],
  ["如何阅读性能与量产信息？", "性能、量产与交付状态以原始披露为准；跨产品比较还应同时查看测试条件、软件栈与整机系统参数。"],
] as const;

export default function ChinaAiSiliconPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "中国 GPU 与 AI 芯片进展", url: canonical, inLanguage: "zh-CN", isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "中国 GPU 与 AI 芯片进展", item: canonical }] },
      { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ],
  };

  return <main className="topic-page" lang="zh-CN"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><Link href="/">IDC ATLAS</Link><div><span lang="en">China GPU &amp; AI Silicon</span><Link href="/en/topics/china-ai-silicon" lang="en">English</Link><Link href="/industry?tab=china">返回中国 GPU 雷达</Link></div></header><section className="topic-hero coral"><p>TOPIC GUIDE · 中国 GPU</p><h1>中国 GPU 与 AI 芯片进展<br /><em lang="en">China GPU &amp; AI Silicon</em></h1><p>本专题聚焦中国 GPU、DCU、AI 加速芯片、超节点和开发者生态。IDC Atlas 以公开来源为优先，并保留每条动态的出处入口。</p><Link href="/industry?tab=china">查看近期进展 →</Link></section><section className="topic-sections">{sections.map(([title, copy]) => <article key={title}><span>CN SILICON</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="topic-note"><h2>信息边界</h2><p>专题将媒体线索和厂商、交易所、开发者站与项目公告区分展示。性能、量产与交付状态以原始披露为准。</p></section><section className="topic-faq coral" aria-labelledby="topic-faq-title"><div><span>FAQ · SOURCE-FIRST</span><h2 id="topic-faq-title">常见问题</h2></div><div className="topic-faq-grid">{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section></main>;
}
