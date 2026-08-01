import type { Metadata } from "next";
import CxmtUsChipImpactArticle from "../../../columns/cxmt-us-chip-impact/article";

const canonical = "https://idc-index.com/en/columns/cxmt-us-chip-impact";

export const metadata: Metadata = {
  title: "CXMT Is Public. Which US Chip Stocks Feel It? | IDC Atlas",
  description: "A source-linked analysis of CXMT's impact on Micron, NVIDIA, AMD, Applied Materials, Lam Research, KLA and Rambus through DRAM pricing, HBM and China exposure.",
  alternates: { canonical, languages: { "zh-CN": "https://idc-index.com/columns/cxmt-us-chip-impact", en: canonical } },
  openGraph: { title: "CXMT Is Public. Which US Chip Stocks Actually Feel It?", description: "Micron sits closest to conventional DRAM pressure. Equipment exposure is two-sided, while NVIDIA and AMD remain a longer-dated HBM question.", url: canonical, type: "article", publishedTime: "2026-07-28T00:00:00+08:00", modifiedTime: "2026-08-01T23:00:00+08:00", images: [{ url: "https://idc-index.com/column-cxmt-us-chips.png", width: 1672, height: 941, alt: "Editorial illustration of a DRAM wafer, memory supply and the semiconductor cycle" }] },
  twitter: { card: "summary_large_image", title: "Which US Chip Stocks Actually Feel CXMT?", description: "The impact ranking across MU, AMAT, LRCX, KLAC, NVDA, AMD and RMBS.", images: ["https://idc-index.com/column-cxmt-us-chips.png"] },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "CXMT Is Public. Which US Chip Stocks Actually Feel It?",
        description: metadata.description,
        image: "https://idc-index.com/column-cxmt-us-chips.png",
        datePublished: "2026-07-28T00:00:00+08:00",
        dateModified: "2026-08-01T23:00:00+08:00",
        inLanguage: "en",
        articleSection: "Memory and US Semiconductors",
        isAccessibleForFree: true,
        about: ["CXMT", "Micron", "DRAM", "HBM", "semiconductor equipment"],
        citation: [
          "https://static.sse.com.cn/stock/disclosure/announcement/c/202512/002170_20251230_B8QS.pdf",
          "https://www.sec.gov/Archives/edgar/data/723125/000072312526000006/mu-20260226.htm",
          "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm",
          "https://www.sec.gov/Archives/edgar/data/6951/000162828026037227/amat-20260426.htm",
          "https://www.sec.gov/Archives/edgar/data/707549/000070754926000022/lrcx-20260329.htm",
          "https://www.sec.gov/Archives/edgar/data/319201/000031920126000016/klac-20260331.htm",
        ],
        author: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/en" },
        publisher: { "@type": "Organization", name: "IDC Atlas", url: "https://idc-index.com/en" },
        mainEntityOfPage: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: "Columns", item: "https://idc-index.com/en/columns" },
          { "@type": "ListItem", position: 3, name: "CXMT impact on US chip stocks", item: canonical },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><CxmtUsChipImpactArticle lang="en" /></>;
}
