import type { ReactNode } from "react";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";
import { deriveConsoleMeta } from "../console-meta";
import { loadInitialAtlasPayload } from "../initial-atlas";
import { columnArticleBySlug, publishedColumnArticles } from "./articles";
import { articleEntities } from "../intelligence-model";

export async function ColumnArticleConsole({
  lang,
  slug,
  children,
}: {
  lang: "zh" | "en";
  slug: string;
  children: ReactNode;
}) {
  const meta = deriveConsoleMeta(await loadInitialAtlasPayload());
  const english = lang === "en";
  const article = columnArticleBySlug(slug);
  const entities = article ? articleEntities(article) : [];
  const related = article ? publishedColumnArticles().filter((candidate) => candidate.href !== article.href)
    .map((candidate) => ({ article: candidate, score: articleEntities(candidate).filter((entity) => entities.some((current) => current.slug === entity.slug)).length * 2 + Number(candidate.series.split(" · ")[0] === article.series.split(" · ")[0]) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.article.publishAt) - Date.parse(a.article.publishAt))
    .slice(0, 3).map((candidate) => candidate.article) : [];
  return <IntelligenceConsoleShell
    lang={lang}
    activeSection="columns"
    generatedAt={meta.generatedAt}
    reviewedAt={meta.reviewedAt}
    sourceCount={meta.sourceCount}
    verifiedCount={meta.verifiedCount}
    pageLabel={lang === "zh" ? "专栏研究" : "Columns"}
    className="atlas-column-article-shell"
  >
    <div className="column-article-page" lang={lang === "zh" ? "zh-CN" : "en"}>
      {children}
      {article && <aside className="column-article-body column-reading-context" aria-label={english ? "Research context and related reading" : "研究背景与延伸阅读"}>
        <nav className="column-source-links" aria-label={english ? "Article reference" : "文章引用信息"}>
          <span>IDC ATLAS</span><div>
            <a href={english ? article.hrefEn : article.href}>{english ? "Permanent article link" : "文章永久链接"}</a>
            <a href={english ? article.href : article.hrefEn} hrefLang={english ? "zh-CN" : "en"}>{english ? "中文版" : "English version"}</a>
            <a href={english ? "/en/methodology" : "/methodology"}>{english ? "Methodology and sources" : "研究方法与来源规范"}</a>
          </div>
        </nav>
        {entities.length > 0 && <nav className="column-source-links" aria-label={english ? "Companies in this analysis" : "本文相关公司"}>
          <span>{english ? "COMPANIES" : "相关公司"}</span><div>{entities.map((entity) => <a key={entity.slug} href={`${english ? "/en" : ""}/companies/${entity.slug}`}>{english ? entity.nameEn : entity.name}</a>)}</div>
        </nav>}
        {related.length > 0 && <section><h2>{english ? "Continue the research" : "延伸阅读"}</h2><ul>{related.map((item) => <li key={item.href}><a href={english ? item.hrefEn : item.href}>{english ? item.titleEn : item.title}</a></li>)}</ul></section>}
      </aside>}
    </div>
  </IntelligenceConsoleShell>;
}
