import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://idc-index.com/topics/data-center-glossary";

export const metadata: Metadata = {
  title: "数据中心术语：容量、CAPEX、电力、液冷与 AI 集群｜IDC Atlas",
  description: "解释数据中心容量、资本开支、并网与电力、液冷、AI GPU 集群等常见术语，并说明各指标的阅读边界。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/topics/data-center-glossary", "x-default": "https://idc-index.com/en/topics/data-center-glossary" } },
  openGraph: { title: "数据中心术语：容量、CAPEX、电力、液冷与 AI 集群", description: "面向数据中心和 AI 基础设施研究的核心术语与阅读边界。", url: canonical, type: "article" },
};

const terms = [
  ["容量：宣布、送电与可计费", "园区宣布的 MW、已送电的 MW 与已经向客户交付、能够计费的 MW 不属于同一阶段。比较项目时，应先确认容量是规划、并网、投运还是已出租口径。"],
  ["CAPEX：投入不等于收入", "资本开支可以覆盖土地、机房、服务器、网络、电力和冷却等不同项目。它反映建设强度，但不能单独证明需求、上架速度或未来自由现金流。"],
  ["电力与并网：容量的前置条件", "高密度算力园区需要取得可用电力、完成输配电建设并满足并网与许可要求。宣布的园区规模只有在电力路径明确后，才更接近可交付容量。"],
  ["液冷：热设计的工程选择", "液冷用于应对高功率密度机柜的散热需求。阅读项目披露时，应区分采用的冷却方案、实际部署范围、机柜密度和交付状态。"],
  ["AI GPU 集群：从芯片到可用算力", "GPU 数量只是集群规模的一部分。网络互联、存储、供电、冷却、软件栈和运维共同决定一套系统能否持续提供训练或推理服务。"],
] as const;

export default function DataCenterGlossaryPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "DefinedTermSet", name: "IDC Atlas 数据中心与 AI 基础设施术语", url: canonical, inLanguage: "zh-CN", hasDefinedTerm: terms.map(([name, description]) => ({ "@type": "DefinedTerm", name, description, inDefinedTermSet: canonical })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "数据中心术语", item: canonical }] },
    ],
  };

  return <main className="topic-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><Link href="/">IDC ATLAS</Link><div><Link href="/en/topics/data-center-glossary" lang="en">English</Link><Link href="/industry">返回产业中心</Link></div></header><section className="topic-hero"><p>REFERENCE GUIDE · 数据中心术语</p><h1>读懂数据中心<br /><em>与 AI 基础设施指标。</em></h1><p>IDC Atlas 使用公开来源追踪项目、园区、电力、液冷与算力硬件。下面的术语帮助区分项目宣传、工程进度和可交付能力，不替代每条卡片附带的原始披露。</p><Link href="/pulse">查看最新项目与公司动态</Link></section><section className="topic-sections">{terms.map(([name, description]) => <article key={name}><span>IDC ATLAS · TERM</span><h2>{name}</h2><p>{description}</p></article>)}</section><section className="topic-note"><h2>使用边界</h2><p>术语是阅读框架，不是对单个项目的结论。容量、交付、产品参数与财务数字应以信息卡片附带的原始出处和具体日期为准。</p><p><Link href="/topics/data-center-intelligence">数据中心市场追踪</Link> · <Link href="/industry">产业中心</Link> · <Link href="/methodology">方法与数据来源</Link></p></section></main>;
}
