"use client";

import { useEffect, useMemo, useState } from "react";
import { publishedColumnArticles, type ColumnArticle } from "./columns/articles";
import { deriveConsoleMeta, type ConsoleMeta } from "./console-meta";
import { IntelligenceConsoleShell, type ConsoleStory } from "./intelligence-console-overview";
import type { EntityRecord } from "./entity-directory";

type LiveDeal = {
  id: string;
  announcedAt: string;
  buyer: string;
  target: string;
  value?: string;
  capacity?: string;
  sourceName?: string;
  sourceUrl?: string;
  rationale?: string;
};

type EntityPayload = ConsoleMeta & {
  idcPulse?: ConsoleStory[];
  listedCompanyNews?: ConsoleStory[];
  mnaDeals?: LiveDeal[];
};

function formatDate(value: string | null | undefined, lang: "zh" | "en") {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    timeZone: lang === "zh" ? "Asia/Shanghai" : "America/New_York",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function storyText(story: ConsoleStory) {
  return `${story.title} ${story.summary ?? ""} ${story.sourceName ?? ""} ${story.listedTicker ?? ""}`;
}

function relatedStories(entity: EntityRecord, payload: EntityPayload): Array<{ id: string; title: string; summary?: string; publishedAt?: string | null; sourceName?: string | null; sourceUrl?: string | null; category?: string | null }> {
  const terms = [entity.name, entity.nameEn, entity.ticker, ...entity.aliases].filter((value): value is string => Boolean(value)).map((value) => value.toLocaleLowerCase());
  const matches = (value: string) => terms.some((term) => value.toLocaleLowerCase().includes(term));
  const stories = [...(payload.listedCompanyNews ?? []), ...(payload.idcPulse ?? [])]
    .filter((story) => matches(storyText(story)))
    .map((story) => ({ id: story.id, title: story.title, summary: story.summary, publishedAt: story.publishedAt, sourceName: story.sourceName, sourceUrl: story.sourceUrl, category: story.category }));
  const deals = (payload.mnaDeals ?? []).filter((deal) => matches(`${deal.buyer} ${deal.target} ${deal.rationale ?? ""}`)).map((deal) => ({
    id: deal.id,
    title: `${deal.buyer} → ${deal.target}`,
    summary: [deal.value, deal.capacity, deal.rationale].filter(Boolean).join(" · "),
    publishedAt: deal.announcedAt,
    sourceName: deal.sourceName,
    sourceUrl: deal.sourceUrl,
    category: "M&A",
  }));
  return [...stories, ...deals].sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()).slice(0, 8);
}

export default function EntityPage({ entity, lang, initialPayload }: { entity: EntityRecord; lang: "zh" | "en"; initialPayload?: Record<string, unknown> | null }) {
  const [payload, setPayload] = useState<EntityPayload | null>(() => initialPayload ? { ...initialPayload, ...deriveConsoleMeta(initialPayload) } as EntityPayload : null);
  const english = lang === "en";

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/atlas-live-v5?schema=v1", { signal: controller.signal, cache: "no-store", headers: { "cache-control": "no-cache" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Atlas unavailable")))
      .then((nextPayload: unknown) => {
        const data = nextPayload as EntityPayload;
        setPayload({ ...data, ...deriveConsoleMeta(data) });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const stories = useMemo(() => relatedStories(entity, payload ?? {}), [entity, payload]);
  const publishedArticles = publishedColumnArticles();
  const articles = entity.columnSlugs.map((slug) => publishedArticles.find((article) => article.href.endsWith(`/${slug}`))).filter((article): article is ColumnArticle => Boolean(article));
  const liveMeta = payload ?? {};
  const displayName = english ? entity.nameEn : entity.name;
  const description = english ? entity.descriptionEn : entity.description;
  const region = english ? (entity.region === "中国" ? "China" : entity.region === "美国" ? "United States" : "Global") : entity.region;
  const category = english ? entity.categoryEn : entity.category;

  return <IntelligenceConsoleShell
    lang={lang}
    activeSection="companies"
    generatedAt={liveMeta.generatedAt}
    reviewedAt={liveMeta.reviewedAt}
    sourceCount={liveMeta.sourceCount}
    verifiedCount={liveMeta.verifiedCount}
    pageLabel={english ? "Entity profile" : "实体档案"}
    className="atlas-entity-shell"
  >
    <div className="atlas-entity-page atlas-console-content-page" lang={english ? "en" : "zh-CN"}>
      <header className="atlas-entity-hero">
        <div><span>{english ? "IDC ATLAS · ENTITY PROFILE" : "IDC ATLAS · 实体档案"}</span><h1>{displayName}</h1><p>{description}</p></div>
        <dl><div><dt>{english ? "Market" : "市场"}</dt><dd>{region}</dd></div><div><dt>{english ? "Category" : "类别"}</dt><dd>{category}</dd></div>{entity.ticker && <div><dt>{english ? "Ticker" : "代码"}</dt><dd>{entity.ticker}</dd></div>}</dl>
      </header>

      <section className="atlas-entity-section">
        <header><div><span>{english ? "SOURCE-LINKED UPDATES" : "来源可追溯动态"}</span><h2>{english ? "Latest disclosures" : "最新披露"}</h2></div><a href={english ? "/en/pulse" : "/pulse"}>{english ? "Open pulse" : "查看脉搏"} →</a></header>
        {stories.length ? <div className="atlas-entity-story-grid">{stories.map((story) => <article className="atlas-entity-story" key={story.id}><div><span>{story.category ?? (english ? "Infrastructure" : "基础设施")}</span><time>{formatDate(story.publishedAt, lang)}</time></div><h3>{story.sourceUrl ? <a href={story.sourceUrl} target="_blank" rel="noreferrer">{story.title} ↗</a> : story.title}</h3><p>{story.summary ?? (english ? "Open the source for the full disclosure." : "打开来源查看完整披露。")}</p><small>{story.sourceName ?? "IDC Atlas source record"}</small></article>)}</div> : <p className="atlas-entity-empty">{english ? "No matching source-linked update in the current window." : "当前窗口暂未匹配到来源可追溯动态。"}</p>}
      </section>

      <section className="atlas-entity-section atlas-entity-research">
        <header><div><span>{english ? "RELATED RESEARCH" : "关联研究"}</span><h2>{english ? "Read the analysis" : "阅读相关专栏"}</h2></div><a href={english ? "/en/columns" : "/columns"}>{english ? "All columns" : "全部专栏"} →</a></header>
        <div className="atlas-entity-column-grid">{articles.map((article) => <a href={english ? article.hrefEn : article.href} key={article.href}><img src={article.image} alt={english ? article.titleEn : article.title} /><div><span>{article.series}</span><h3>{english ? article.titleEn : article.title}</h3><p>{english ? article.summaryEn : article.summary}</p><time>{formatDate(article.date, lang)}</time></div></a>)}{!articles.length && <p className="atlas-entity-empty">{english ? "No related column yet." : "暂无线性关联专栏。"}</p>}</div>
      </section>

      <footer className="atlas-entity-footer"><a href={english ? "/en/industry" : "/industry"}>{english ? "Explore the industry map" : "探索产业链地图"} →</a><span>{english ? "Entity pages combine current source-linked records with IDC Atlas research." : "实体页将当前来源记录与 IDC Atlas 研究关联展示。"}</span></footer>
    </div>
  </IntelligenceConsoleShell>;
}
