import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://idc-index.com/topics/data-center-intelligence";

export const metadata: Metadata = {
  title: "数据中心市场追踪与基础设施报告｜IDC Atlas",
  description: "追踪全球数据中心项目、容量、租赁、电力、液冷、算力硬件与上市公司披露，所有关键进展保留公开来源。",
  alternates: {
    canonical,
    languages: {
      "zh-CN": canonical,
      en: "https://idc-index.com/en/topics/data-center-intelligence",
      "x-default": "https://idc-index.com/en/topics/data-center-intelligence",
    },
  },
  openGraph: { title: "数据中心市场追踪与基础设施报告", description: "公开来源驱动的数据中心项目、容量、租赁、电力、液冷与算力需求情报。", url: canonical, type: "article" },
};

const sections = [
  ["项目、园区与容量", "追踪数据中心新建、扩建、租赁、交付和投运节点，区分规划容量、已送电容量与可计费容量。"],
  ["电力、液冷与网络", "关注并网、绿电、供配电、液冷与高速互联，因为这些环节直接影响高密度算力的部署速度。"],
  ["资本开支与上市公司", "连接云厂商 CAPEX、IDC 长租合同和上市公司披露，观察需求如何传导至园区建设与基础设施订单。"],
] as const;

const faqs = [
  ["IDC Atlas 追踪哪些数据中心信号？", "园区建设、容量、租赁、电力、液冷、网络、算力需求和上市公司披露，并优先展示可回溯的公开来源。"],
  ["网站多久更新一次？", "实时卡片随可靠公开信息更新，全站内容每日集中校验一次；每条信息同时保留具体日期和来源。"],
  ["信息如何核验？", "新闻线索与官方披露分层呈现；规模、交付、投运与产品参数以页面附带的原始出处为准。"],
  ["这些内容是否构成投资建议？", "不构成。本网站仅用于信息展示与研究，不提供投资建议。"],
] as const;

export default function DataCenterIntelligencePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "数据中心市场追踪与基础设施报告",
        url: canonical,
        inLanguage: "zh-CN",
        about: ["数据中心项目", "数据中心容量", "数据中心租赁", "数据中心电力", "液冷", "云厂商资本开支"],
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: "数据中心市场追踪", item: canonical }] },
      { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ],
  };

  return <main className="topic-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="topic-nav"><Link href="/">IDC ATLAS</Link><div><Link href="/en/topics/data-center-intelligence" lang="en">English</Link><Link href="/">返回实时情报站</Link></div></header><section className="topic-hero"><p>TOPIC GUIDE · 数据中心市场</p><h1>数据中心市场追踪<br /><em>与基础设施报告</em></h1><p>IDC Atlas 面向关注数据中心建设、容量兑现、供电、散热、网络与算力需求的研究者和行业从业者。页面内容来自公开来源，并保留可回溯出处。</p><Link href="/pulse">查看数据中心项目与上市公司动态</Link></section><section className="topic-sections">{sections.map(([title, copy]) => <article key={title}><span>IDC ATLAS</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="topic-note"><h2>如何使用这些数据</h2><p>实时情报站将新闻线索与官方披露分层展示。阅读规模、交付、投运与产品参数时，请通过每条卡片附带的原始出处核验。</p><p><Link href="/industry">查看数据中心产业链</Link> · <Link href="/columns">阅读专题研究</Link> · <Link href="/methodology">了解数据方法</Link></p></section><section className="topic-faq" aria-labelledby="topic-faq-title"><div><span>FAQ · SOURCE-FIRST</span><h2 id="topic-faq-title">常见问题</h2></div><div className="topic-faq-grid">{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section></main>;
}
