import type { Metadata } from "next";
import CxmtUsChipImpactArticle from "./article";

const canonical = "https://idc-index.com/columns/cxmt-us-chip-impact";

export const metadata: Metadata = {
  title: "长鑫上市，对美股芯片有什么影响？｜IDC Atlas",
  description: "从通用 DRAM、HBM、半导体设备与中国收入四条传导链，分析长鑫科技上市对 Micron、NVIDIA、AMD、AMAT、LRCX、KLAC 与 Rambus 的影响。",
  alternates: { canonical, languages: { "zh-CN": canonical, en: "https://idc-index.com/en/columns/cxmt-us-chip-impact" } },
  openGraph: { title: "长鑫上市，谁会先感到压力？", description: "Micron 处在第一层，美国设备商面临双向影响，NVIDIA 与 AMD 仍取决于 HBM 量产和认证。", url: canonical, type: "article", publishedTime: "2026-07-28T00:00:00+08:00", images: [{ url: "https://idc-index.com/column-cxmt-us-chips.png", width: 1672, height: 941, alt: "DRAM 晶圆、存储供给与半导体周期的原创专栏插画" }] },
  twitter: { card: "summary_large_image", title: "长鑫上市，对美股芯片有什么影响？", description: "拆解 MU、AMAT、LRCX、KLAC、NVDA、AMD 与 RMBS 的影响顺序。", images: ["https://idc-index.com/column-cxmt-us-chips.png"] },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "长鑫上市，对美股芯片有什么影响？",
        description: metadata.description,
        image: "https://idc-index.com/column-cxmt-us-chips.png",
        datePublished: "2026-07-28T00:00:00+08:00",
        dateModified: "2026-07-28T00:00:00+08:00",
        inLanguage: "zh-CN",
        articleSection: "存储芯片与美股半导体",
        isAccessibleForFree: true,
        about: ["长鑫科技", "Micron", "DRAM", "HBM", "半导体设备"],
        citation: Object.values({
          cxmt: "https://static.sse.com.cn/stock/disclosure/announcement/c/202512/002170_20251230_B8QS.pdf",
          micron: "https://www.sec.gov/Archives/edgar/data/723125/000072312526000006/mu-20260226.htm",
          nvidia: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm",
          appliedMaterials: "https://www.sec.gov/Archives/edgar/data/6951/000162828026037227/amat-20260426.htm",
          lamResearch: "https://www.sec.gov/Archives/edgar/data/707549/000070754926000022/lrcx-20260329.htm",
          kla: "https://www.sec.gov/Archives/edgar/data/319201/000031920126000016/klac-20260331.htm",
        }),
        author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/" },
        mainEntityOfPage: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: "专栏", item: "https://idc-index.com/columns" },
          { "@type": "ListItem", position: 3, name: "长鑫上市，对美股芯片有什么影响？", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CxmtUsChipImpactArticle lang="zh" /></>;
}
