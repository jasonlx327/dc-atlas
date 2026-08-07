import type { Metadata } from "next";
import { ContextPage } from "../context-page";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";

const canonical = "https://idc-index.com/methodology";

export const metadata: Metadata = {
  title: "方法与数据来源｜Methodology｜IDC Atlas",
  description: "IDC Atlas 的信息来源、核验原则、更新频率与研究边界说明。",
  alternates: {
    canonical,
    languages: {
      "zh-CN": canonical,
      en: "https://idc-index.com/en/methodology",
      "x-default": "https://idc-index.com/en/methodology",
    },
  },
  openGraph: {
    title: "方法与数据来源｜Methodology｜IDC Atlas",
    description: "IDC Atlas 的信息来源、核验原则、更新频率与研究边界说明。",
    url: canonical,
    type: "article",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "IDC Atlas 方法与数据来源" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "方法与数据来源｜Methodology｜IDC Atlas",
    description: "IDC Atlas 的信息来源、核验原则、更新频率与研究边界说明。",
    images: ["/og.png"],
  },
};

export default function MethodologyPage() {
  const structuredData = { "@context": "https://schema.org", "@type": "AboutPage", name: "方法与数据来源 | Methodology", url: canonical, inLanguage: ["zh-CN", "en"], isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" } };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><IntelligenceConsoleShell
    lang="zh"
    pageLabel="方法论与数据来源"
    className="atlas-method-shell"
    contextStatus={{ title: "研究方法", subtitle: "方法论与数据来源", languageHref: "/en/methodology?lang=en", items: [{ label: "来源层级", value: "一手披露优先" }, { label: "更新机制", value: "重要披露后复核" }, { label: "研究边界", value: "不构成投资建议" }] }}
  ><ContextPage
    eyebrow="METHOD & SOURCES · 研究方法"
    title={<>信息如何进入<br />IDC Atlas</>}
    summary="IDC Atlas 追踪数据中心、AI 基础设施与国产算力的公开进展。我们把发现线索、原始披露与研究结论分开呈现，让读者能回到来源判断信息边界。"
    backHref="/#overview"
    backLabel="返回情报总览 →"
    items={[{ label: "来源层级", value: "原始披露优先" }, { label: "核验对象", value: "容量、金额、规格与交付" }, { label: "呈现原则", value: "线索不等于结论" }]}
    sections={[
      { label: "01 · DISCOVERY", title: "发现线索", copy: "公开媒体、行业渠道与开发者信息用于发现变化；它们提示我们去寻找原始材料，而不直接构成事实结论。" },
      { label: "02 · PRIMARY SOURCES", title: "核验事实", copy: "厂商官网、交易所披露、政府与项目公告、开发者文档等一手材料，用来核验容量、金额、产品规格与投产时间。" },
      { label: "03 · REVIEW", title: "复核与更新", copy: "首页随可用公开信号更新；专题页在出现重要披露后复核。每条重点内容尽量保留来源入口与具体日期。" },
    ]}
    boundary={{ label: "RESEARCH BOUNDARY", title: "公开信息研究，不替代判断", copy: "本站仅用于公开信息研究与行业观察，不构成投资建议。未公开、无法独立核验或彼此矛盾的信息，不会被表述为确定事实。" }}
  /></IntelligenceConsoleShell></>;
}
