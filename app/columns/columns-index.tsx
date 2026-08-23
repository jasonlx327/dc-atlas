import { publishedColumnArticles } from "./articles";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";
import { deriveConsoleMeta } from "../console-meta";
import { loadInitialAtlasPayload } from "../initial-atlas";
import ResearchLibrary from "./research-library";

export default async function ColumnsIndex({ lang }: { lang: "zh" | "en" }) {
  const english = lang === "en";
  const articles = publishedColumnArticles();
  const meta = deriveConsoleMeta(await loadInitialAtlasPayload());
  const canonical = english ? "https://idc-index.com/en/columns" : "https://idc-index.com/columns";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: english ? "IDC Atlas Columns" : "IDC Atlas 专栏",
        url: canonical,
        inLanguage: english ? "en" : "zh-CN",
        description: english ? "Source-linked research for the data-center and AI-infrastructure cycle." : "数据中心与 AI 基础设施的来源可追溯研究。",
        isPartOf: { "@type": "WebSite", name: "IDC Atlas", url: "https://idc-index.com/" },
        mainEntity: {
          "@type": "ItemList",
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: articles.length,
          itemListElement: articles.map((article, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Article",
              headline: english ? article.titleEn : article.title,
              description: english ? article.summaryEn : article.summary,
              url: `https://idc-index.com${english ? article.hrefEn : article.href}`,
              image: `https://idc-index.com${article.image}`,
              datePublished: article.publishAt,
              dateModified: article.publishAt,
              author: { "@type": "Organization", name: "IDC Atlas" },
              publisher: { "@type": "Organization", name: "IDC Atlas" },
              mainEntityOfPage: `https://idc-index.com${english ? article.hrefEn : article.href}`,
            },
          })),
        },
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "IDC Atlas", item: english ? "https://idc-index.com/en" : "https://idc-index.com/" }, { "@type": "ListItem", position: 2, name: english ? "Columns" : "专栏", item: canonical }] },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><IntelligenceConsoleShell
    lang={lang}
    activeSection="columns"
    generatedAt={meta.generatedAt}
    reviewedAt={meta.reviewedAt}
    contentVersion={meta.contentVersion}
    lastContentChangedAt={meta.lastContentChangedAt}
    sourceCount={meta.sourceCount}
    verifiedCount={meta.verifiedCount ?? articles.length}
    pageLabel={english ? "Research columns" : "研究专栏"}
    className="atlas-columns-shell"
  ><div className="columns-index-page atlas-console-content-page" lang={english ? "en" : "zh-CN"} id="columns">
    <section className="columns-index-hero"><span>IDC ATLAS · ORIGINAL RESEARCH</span><h1>{english ? <>Columns for the <em>infrastructure cycle.</em></> : <><span>专栏，追踪</span><em>基础设施周期。</em></>}</h1><p>{english ? "Source-linked analysis of data-center contracts, cloud capital spending, power availability and the path from announced capacity to billable infrastructure." : "围绕数据中心合同、云厂商资本开支、电力资源与容量兑现进行持续研究。每篇文章保留公开来源，并明确数据口径与研究边界。"}</p></section>
    <ResearchLibrary articles={articles} lang={lang} />
  </div></IntelligenceConsoleShell></>;
}
