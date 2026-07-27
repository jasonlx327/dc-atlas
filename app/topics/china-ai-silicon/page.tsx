import type { Metadata } from "next";

const canonical = "https://idc-index.com/topics/china-ai-silicon";

export const metadata: Metadata = {
  title: "中国 GPU 与 AI 芯片进展｜China GPU & AI Silicon",
  description: "追踪中国 GPU、DCU、AI 加速芯片、超节点与开发者生态的公开进展；IDC Atlas 提供中英文专题入口。",
  alternates: { canonical },
  openGraph: { title: "中国 GPU 与 AI 芯片进展｜China GPU & AI Silicon", description: "中国 GPU、DCU、AI 加速芯片与超节点的公开进展。", url: canonical, type: "article" },
};

const sections = [
  ["芯片与产品 / Silicon & Products", "关注 GPU、DCU 与 AI 加速芯片的产品披露、研发、适配和交付进展，不以未经证实的性能传闻作为结论。", "Follow product disclosures, development, software enablement and delivery milestones without treating unverified performance claims as fact."],
  ["超节点与互联 / Supernodes & Interconnect", "单卡之外，集群互联、统一内存、液冷和系统软件决定了大规模部署是否可行。", "Beyond a single accelerator, interconnect, shared memory, cooling and systems software determine whether scale-out deployment is practical."],
  ["软件生态 / Software Ecosystem", "开发者工具链、框架适配、通信库和运维能力，是判断国产算力工程可用性的核心观察维度。", "Developer toolchains, framework support, communications libraries and operations are core signals of engineering readiness."],
] as const;

const faqs = [
  ["本专题覆盖哪些中国 AI 芯片范围？", "覆盖 GPU、DCU、AI 加速器、超节点、互联与开发者生态，不将未经证实的产品传闻当作事实。", "Which China AI-silicon areas are covered?", "GPU, DCU, AI accelerators, supernodes, interconnect and developer ecosystems are covered; unverified product rumors are not treated as facts."],
  ["什么信息算作已核验？", "以厂商、交易所、开发者站和项目公告等原始披露为准；媒体报道作为线索并与原始来源区分。", "What counts as verified information?", "Vendor, exchange, developer-site and project disclosures are treated as primary evidence; media reports are labeled as leads and kept distinct from originals."],
  ["如何阅读性能与量产信息？", "性能、量产与交付状态以原始披露为准；跨产品比较还应同时查看测试条件、软件栈与整机系统参数。", "How should performance and production claims be read?", "Performance, production and delivery claims should follow original disclosures. Cross-product comparisons also require the test conditions, software stack and full-system parameters."],
] as const;

export default function ChinaAiSiliconPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "中国 GPU 与 AI 芯片进展 | China GPU & AI Silicon", url: canonical, inLanguage: ["zh-CN", "en"], isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "中国 GPU 与 AI 芯片进展", item: canonical }] },
      { "@type": "FAQPage", mainEntity: faqs.flatMap(([zhQuestion, zhAnswer, enQuestion, enAnswer]) => [{ "@type": "Question", name: zhQuestion, acceptedAnswer: { "@type": "Answer", text: zhAnswer } }, { "@type": "Question", name: enQuestion, acceptedAnswer: { "@type": "Answer", text: enAnswer } }]) },
    ],
  };

  return <main className="topic-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><a href="/">IDC ATLAS</a><a href="/#china-chips">返回中国 GPU 雷达 / Back to China GPU radar</a></header><section className="topic-hero coral"><p>TOPIC GUIDE · 中英文专题</p><h1>中国 GPU 与 AI 芯片进展<br /><em>China GPU &amp; AI Silicon</em></h1><p>本专题聚焦中国 GPU、DCU、AI 加速芯片、超节点和开发者生态。IDC Atlas 以公开来源为优先，并保留每条动态的出处入口。</p><p>Track China&apos;s GPU, DCU, AI accelerator, supernode and developer-ecosystem milestones through public, source-linked intelligence.</p><a href="/#china-chips">查看近期进展 / View latest signals</a></section><section className="topic-sections">{sections.map(([title, zh, en]) => <article key={title}><span>CN SILICON</span><h2>{title}</h2><p>{zh}</p><p lang="en">{en}</p></article>)}</section><section className="topic-note"><h2>信息边界 / Evidence boundary</h2><p>专题将媒体线索和厂商、交易所、开发者站与项目公告区分展示。性能、量产和交付状态以原始披露为准。</p><p lang="en">Media leads are distinguished from vendor, exchange, developer-community and project disclosures. Original disclosures control performance, production and delivery claims.</p></section><section className="topic-faq coral" aria-labelledby="topic-faq-title"><div><span>FAQ · SOURCE-FIRST</span><h2 id="topic-faq-title">常见问题 / Frequently asked questions</h2></div><div className="topic-faq-grid">{faqs.map(([zhQuestion, zhAnswer, enQuestion, enAnswer]) => <article key={zhQuestion}><h3>{zhQuestion}</h3><p>{zhAnswer}</p><h3 lang="en">{enQuestion}</h3><p lang="en">{enAnswer}</p></article>)}</div></section></main>;
}
