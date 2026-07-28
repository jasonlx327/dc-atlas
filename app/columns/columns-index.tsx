import { columnArticles } from "./articles";

export default function ColumnsIndex({ lang }: { lang: "zh" | "en" }) {
  const english = lang === "en";
  return <main className="columns-index-page" lang={english ? "en" : "zh-CN"}>
    <header className="columns-index-nav"><a href={english ? "/en" : "/"}>IDC <b>ATLAS</b></a><div><a href={english ? "/columns" : "/en/columns"}>{english ? "中文" : "EN"}</a><a href={english ? "/en" : "/"}>{english ? "Back to intelligence" : "返回实时情报站"}</a></div></header>
    <section className="columns-index-hero"><span>IDC ATLAS · ORIGINAL RESEARCH</span><h1>{english ? <>Columns for the <em>infrastructure cycle.</em></> : <>专栏，追踪<em>基础设施周期。</em></>}</h1><p>{english ? "Source-linked analysis of data-center contracts, cloud capital spending, power availability and the path from announced capacity to billable infrastructure." : "围绕数据中心合同、云厂商资本开支、电力资源与容量兑现进行持续研究。每篇文章保留公开来源，并明确数据口径与研究边界。"}</p></section>
    <section className="columns-index-list" aria-label={english ? "IDC Atlas columns" : "IDC Atlas 专栏列表"}>
      {columnArticles.map((article, index) => <article className={index === 0 ? "featured" : ""} key={article.href}>
        <a className="columns-index-image" href={english ? article.hrefEn : article.href}><img src={article.image} alt="" loading={index === 0 ? "eager" : "lazy"} /></a>
        <div><div className="columns-index-meta"><span>{article.series}</span><time dateTime={article.date}>{english ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${article.date}T00:00:00Z`)) : article.date.replaceAll("-", " / ")}</time></div><h2><a href={english ? article.hrefEn : article.href}>{english ? article.titleEn : article.title}</a></h2><p>{english ? article.summaryEn : article.summary}</p><a className="columns-index-read" href={english ? article.hrefEn : article.href}>{english ? "Read the column →" : "阅读全文 →"}</a></div>
      </article>)}
    </section>
    <footer className="columns-index-footer"><span>IDC ATLAS · SOURCE FIRST</span><p>{english ? "For information and research only. This is not investment advice." : "本网站数据与内容仅用于信息展示与研究，不构成任何投资建议。"}</p></footer>
  </main>;
}
