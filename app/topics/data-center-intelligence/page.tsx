import type { Metadata } from "next";

const canonical = "https://idc-index.com/topics/data-center-intelligence";

export const metadata: Metadata = {
  title: "全球数据中心情报｜Global Data Center Intelligence",
  description: "IDC Atlas 汇集数据中心园区、容量、电力、液冷、网络和算力硬件的公开进展，提供中英文数据中心情报入口。",
  alternates: { canonical },
  openGraph: { title: "全球数据中心情报｜Global Data Center Intelligence", description: "公开来源驱动的数据中心项目、基础设施与算力需求情报。", url: canonical, type: "article" },
};

const sections = [
  ["园区与容量 / Campus & Capacity", "追踪新建、扩建、租赁、交付与投运等关键节点，并以公开披露为准。", "Track new builds, expansions, leases, delivery and commissioning milestones using public disclosures."],
  ["电力、液冷与网络 / Power, Cooling & Network", "聚焦并网、绿电、供配电、液冷和高速互联，这些因素共同决定高密度算力部署的速度。", "Follow grid access, clean power, distribution, liquid cooling and high-speed interconnects that shape high-density deployment."],
  ["算力需求 / Compute Demand", "把 GPU、服务器、模型发布与云端调用信号放在同一视角，帮助理解基础设施需求的来源。", "Read GPUs, servers, model launches and cloud-usage signals together to understand the source of infrastructure demand."],
] as const;

export default function DataCenterIntelligencePage() {
  const structuredData = { "@context": "https://schema.org", "@type": "CollectionPage", name: "全球数据中心情报 | Global Data Center Intelligence", url: canonical, inLanguage: ["zh-CN", "en"], isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" } };
  return <main className="topic-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><a href="/">IDC ATLAS</a><a href="/">返回实时情报站 / Back to live intelligence</a></header><section className="topic-hero"><p>TOPIC GUIDE · 中英文专题</p><h1>全球数据中心情报<br /><em>Global Data Center Intelligence</em></h1><p>IDC Atlas 面向关注数据中心建设、供电、散热、网络与算力需求的研究者和行业从业者。页面内容以公开来源和可回溯出处为基础。</p><p>IDC Atlas is a bilingual entry point for researchers and operators tracking data-center construction, power, cooling, networking and compute demand from traceable public sources.</p><a href="/#pulse">查看实时进展 / View live updates</a></section><section className="topic-sections">{sections.map(([title, zh, en]) => <article key={title}><span>IDC ATLAS</span><h2>{title}</h2><p>{zh}</p><p lang="en">{en}</p></article>)}</section><section className="topic-note"><h2>使用方式 / How to use this guide</h2><p>实时情报站将新闻线索与官方披露分层展示；对于规模、交付、投运与产品参数，请回到每条卡片附带的原始出处核验。</p><p lang="en">The live site separates news leads from primary disclosures. Verify capacity, delivery, commissioning and product specifications through the source link attached to each item.</p></section></main>;
}
