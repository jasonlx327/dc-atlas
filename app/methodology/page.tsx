import type { Metadata } from "next";

const canonical = "https://idc-index.com/methodology";

export const metadata: Metadata = {
  title: "方法与数据来源｜Methodology｜IDC Atlas",
  description: "IDC Atlas 的信息来源、核验原则、更新频率与研究边界说明。",
  alternates: { canonical },
};

const sections = [
  ["信息来源 / Sources", "AI HOT 与公开媒体用于发现线索；厂商官网、交易所披露、政府与项目公告、开发者文档等一手材料用于核验关键事实。", "AI HOT and public reporting surface leads. Vendor sites, exchange filings, government and project notices, and developer documentation verify material facts."],
  ["核验与呈现 / Verification", "容量、金额、产品规格、投产时间等关键信息优先采用原始披露。若只有媒体报道，会明确标注来源，不把推测写成结论。", "Capacity, value, specifications and delivery timing are anchored to primary disclosures where available. Media-only claims remain attributed rather than presented as settled fact."],
  ["更新频率 / Update cadence", "首页资讯与市场信号按可用公开数据更新；专题页按周或在出现重要披露后更新；每条内容尽量保留来源入口与核验时间。", "The homepage updates with available public signals. Topic pages are reviewed weekly or after material disclosures, with source links and verification dates retained where possible."],
] as const;

export default function MethodologyPage() {
  const structuredData = { "@context": "https://schema.org", "@type": "AboutPage", name: "方法与数据来源 | Methodology", url: canonical, inLanguage: ["zh-CN", "en"], isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" } };

  return <main className="topic-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><a href="/">IDC ATLAS</a><a href="/#method">返回信息来源 / Back to sources</a></header><section className="topic-hero"><p>METHOD &amp; SOURCES · 方法与数据来源</p><h1>信息如何进入 IDC Atlas<br /><em>How we build the signal</em></h1><p>IDC Atlas 追踪数据中心、AI 基础设施与国产算力的公开进展。我们区分“发现线索”和“核验事实”，让读者能够回到出处理解信息边界。</p><p>IDC Atlas tracks public developments in data centers, AI infrastructure and China AI silicon. We distinguish discovery signals from verified facts so readers can trace the evidence themselves.</p><a href="/#method">查看首页来源框架 / View source framework</a></section><section className="topic-sections">{sections.map(([title, zh, en]) => <article key={title}><span>IDC ATLAS STANDARD</span><h2>{title}</h2><p>{zh}</p><p lang="en">{en}</p></article>)}</section><section className="topic-note"><h2>研究边界 / Research boundary</h2><p>本站仅用于公开信息研究与行业观察，不构成投资建议。未公开、无法独立核验或彼此矛盾的信息，将不被表述为确定事实。</p><p lang="en">This site is for public-information research and industry observation only, not investment advice. Undisclosed, unverifiable or conflicting claims are not presented as confirmed facts.</p></section></main>;
}
