import { columnArticleBySlug } from "./articles";
import { scheduledResearchBySlug, type ResearchCopy, type ResearchSource } from "./scheduled-article-data";
import { ColumnArticleConsole } from "./article-console";

function SourceLink({ source, lang }: { source: ResearchSource; lang: "zh" | "en" }) {
  return <a href={source.url} target="_blank" rel="noreferrer">
    {lang === "zh" ? source.zh : source.en}<span aria-hidden="true"> ↗</span>
  </a>;
}

function ArticleHeader({ slug, lang }: { slug: string; lang: "zh" | "en" }) {
  const article = columnArticleBySlug(slug);
  const record = scheduledResearchBySlug(slug);
  if (!article || !record) return null;
  const english = lang === "en";
  const date = new Date(article.publishAt);
  const dateLabel = new Intl.DateTimeFormat(english ? "en-US" : "zh-CN", {
    timeZone: english ? "America/New_York" : "Asia/Shanghai",
    year: "numeric",
    month: english ? "long" : "long",
    day: "numeric",
  }).format(date);
  const title = english ? article.titleEn : article.title;
  const copy = english ? record.en : record.zh;

  return <><header className="column-article-nav">
    <a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a>
    <div>
      <a href={english ? article.href : article.hrefEn}>{english ? "中文" : "EN"}</a>
      <a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a>
    </div>
  </header>
  <section className="column-article-hero">
    <div><span>IDC ATLAS COLUMN · {article.series}</span><time dateTime={article.publishAt}>{dateLabel}</time></div>
    <h1>{title}</h1>
    <p>{copy.hero}</p>
  </section>
  <figure className="column-article-cover column-article-cover--contain">
    <img src={article.image} alt={english ? record.imageAltEn : record.imageAltZh} />
    <figcaption>{english ? `IDC Atlas original editorial cover · ${article.series}` : `IDC Atlas 原创专栏封面 · ${article.series}`}</figcaption>
  </figure></>;
}

function MetricsTable({ copy, lang }: { copy: ResearchCopy["sections"][number]["metrics"]; lang: "zh" | "en" }) {
  if (!copy?.length) return null;
  return <div className="column-fact-table column-fact-table--three" role="region" aria-label={lang === "zh" ? "核心数据与口径" : "Key figures and definitions"}>
    <table>
      <thead><tr><th>{lang === "zh" ? "指标" : "Metric"}</th><th>{lang === "zh" ? "本次披露" : "Disclosure"}</th><th>{lang === "zh" ? "口径与边界" : "Basis and boundary"}</th></tr></thead>
      <tbody>{copy.map((metric) => <tr key={metric.label}><th>{metric.label}</th><td><strong>{metric.value}</strong></td><td>{metric.note}</td></tr>)}</tbody>
    </table>
  </div>;
}

function ResearchBody({ slug, lang }: { slug: string; lang: "zh" | "en" }) {
  const record = scheduledResearchBySlug(slug);
  if (!record) return null;
  const copy = lang === "zh" ? record.zh : record.en;
  return <article className="column-article-body">
    <aside className="column-article-thesis"><span>{lang === "zh" ? "核心判断" : "THE TAKEAWAY"}</span><p>{copy.thesis}</p></aside>
    <section>
      {copy.opening.map((paragraph, index) => <p className={index === 0 ? "column-dropcap" : undefined} key={paragraph}>{paragraph}</p>)}
      <nav className="column-source-links" aria-label={lang === "zh" ? "本文来源" : "Article sources"}>
        <span>{lang === "zh" ? "来源" : "SOURCES"}</span>
        <div>{record.sources.map((source) => <SourceLink key={source.url} source={source} lang={lang} />)}</div>
      </nav>
    </section>
    {copy.sections.map((section) => <section key={section.label}>
      <div className="column-section-label">{section.label}</div>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <MetricsTable copy={section.metrics} lang={lang} />
      {section.steps?.length ? <ol className="column-transmission">{section.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.title}</strong><p>{step.body}</p></div></li>)}</ol> : null}
      {section.cards?.length ? <div className="column-question-grid">{section.cards.map((card) => <article key={`${card.label}-${card.title}`}><span>{card.label}</span><h3>{card.title}</h3><p>{card.body}</p></article>)}</div> : null}
    </section>)}
    <blockquote><span>IDC ATLAS VIEW</span><p>{copy.conclusion}</p></blockquote>
    <footer className="column-article-disclosure"><p>{copy.disclosure}</p><p>{lang === "zh" ? "本网站内容仅用于信息展示与研究，不构成任何投资建议。" : "For information and research only. This is not investment advice."}</p></footer>
  </article>;
}

export function ScheduledResearchArticle({ slug, lang }: { slug: string; lang: "zh" | "en" }) {
  return <ColumnArticleConsole lang={lang}><ArticleHeader slug={slug} lang={lang} /><ResearchBody slug={slug} lang={lang} /></ColumnArticleConsole>;
}

export function researchStructuredData(slug: string, lang: "zh" | "en"): Record<string, unknown> | null {
  const article = columnArticleBySlug(slug);
  const record = scheduledResearchBySlug(slug);
  if (!article || !record) return null;
  const english = lang === "en";
  const canonical = `https://idc-index.com${english ? article.hrefEn : article.href}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AnalysisNewsArticle",
        headline: english ? article.titleEn : article.title,
        description: english ? article.summaryEn : article.summary,
        image: `https://idc-index.com${article.image}`,
        datePublished: article.publishAt,
        dateModified: article.publishAt,
        inLanguage: english ? "en" : "zh-CN",
        articleSection: english ? record.articleSectionEn : record.articleSectionZh,
        isAccessibleForFree: true,
        about: record.topics,
        citation: record.sources.map((source) => source.url),
        author: { "@type": "Organization", name: "IDC Atlas" },
        publisher: { "@type": "Organization", name: "IDC Atlas" },
        mainEntityOfPage: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: english ? "https://idc-index.com/en" : "https://idc-index.com/" },
          { "@type": "ListItem", position: 2, name: english ? "Columns" : "专栏", item: english ? "https://idc-index.com/en/columns" : "https://idc-index.com/columns" },
          { "@type": "ListItem", position: 3, name: english ? article.titleEn : article.title, item: canonical },
        ],
      },
    ],
  };
}

export function researchMetadataFields(slug: string, lang: "zh" | "en"): {
  title: string;
  description: string;
  canonical: string;
  alternate: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
} | null {
  const article = columnArticleBySlug(slug);
  const record = scheduledResearchBySlug(slug);
  if (!article || !record) return null;
  const english = lang === "en";
  return {
    title: english ? article.titleEn : article.title,
    description: english ? article.summaryEn : article.summary,
    canonical: `https://idc-index.com${english ? article.hrefEn : article.href}`,
    alternate: `https://idc-index.com${english ? article.href : article.hrefEn}`,
    image: `https://idc-index.com${article.image}`,
    imageAlt: english ? record.imageAltEn : record.imageAltZh,
    publishedAt: article.publishAt,
  };
}
