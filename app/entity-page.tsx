"use client";

import { useEffect, useMemo, useState } from "react";
import { publishedColumnArticles, type ColumnArticle } from "./columns/articles";
import { deriveConsoleMeta, type ConsoleMeta } from "./console-meta";
import { IntelligenceConsoleShell, type ConsoleStory } from "./intelligence-console-overview";
import type { EntityRecord } from "./entity-directory";
import EntityFollowButton from "./entity-follow-button";
import { entityStories, nextCheckpoint, relatedResearch, shouldAdoptPayload, sortNewest } from "./intelligence-model";

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
  rumors?: Array<{ id: string; title: string; titleEn?: string; summary: string; summaryEn?: string; publishedAt: string; sourceName: string; sourceUrl?: string; entities: string[]; statusLabel: string; statusLabelEn: string }>;
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

function relatedStories(entity: EntityRecord, payload: EntityPayload): Array<{ id: string; title: string; titleEn?: string; summary?: string; summaryEn?: string; publishedAt?: string | null; sourceName?: string | null; sourceUrl?: string | null; category?: string | null }> {
  const terms = [entity.name, entity.nameEn, entity.ticker, ...entity.aliases].filter((value): value is string => Boolean(value)).map((value) => value.toLocaleLowerCase());
  const matches = (value: string) => terms.some((term) => value.toLocaleLowerCase().includes(term));
  const stories = entityStories(entity, [...(payload.listedCompanyNews ?? []), ...(payload.idcPulse ?? [])])
    .map((story) => ({ id: story.id, title: story.title, titleEn: story.titleEn, summary: story.summary, summaryEn: story.summaryEn, publishedAt: story.publishedAt, sourceName: story.sourceName, sourceUrl: story.sourceUrl, category: story.category }));
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
        setPayload((current) => shouldAdoptPayload(current, data) ? { ...data, ...deriveConsoleMeta(data) } : current);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const stories = useMemo(() => relatedStories(entity, payload ?? {}), [entity, payload]);
  const publishedArticles = publishedColumnArticles();
  const articles = relatedResearch(entity, publishedArticles) as ColumnArticle[];
  const rumors = useMemo(() => sortNewest(payload?.rumors ?? []).filter((item) => item.entities.some((name) => [entity.name, entity.nameEn, entity.ticker, ...entity.aliases].filter(Boolean).some((term) => name.toLocaleLowerCase().includes(String(term).toLocaleLowerCase())))).slice(0, 4), [entity, payload]);
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
    contentVersion={liveMeta.contentVersion}
    lastContentChangedAt={liveMeta.lastContentChangedAt}
    sourceCount={liveMeta.sourceCount}
    verifiedCount={liveMeta.verifiedCount}
    pageLabel={english ? "Entity profile" : "实体档案"}
    className="atlas-entity-shell"
  >
    <div className="atlas-entity-page atlas-console-content-page" lang={english ? "en" : "zh-CN"}>
      <header className="atlas-entity-hero">
        <div><span>{english ? "IDC ATLAS · ENTITY PROFILE" : "IDC ATLAS · 实体档案"}</span><h1>{displayName}</h1><p>{description}</p><div className="atlas-entity-actions"><EntityFollowButton slug={entity.slug} lang={lang} /><a href={english ? "/en/companies" : "/companies"}>{english ? "All companies" : "全部公司"} →</a></div></div>
        <dl><div><dt>{english ? "Market" : "市场"}</dt><dd>{region}</dd></div><div><dt>{english ? "Category" : "类别"}</dt><dd>{category}</dd></div>{entity.ticker && <div><dt>{english ? "Ticker" : "代码"}</dt><dd>{entity.ticker}</dd></div>}</dl>
      </header>

      <section className="atlas-entity-relation" aria-labelledby="entity-relation-title">
        <header><span>{english ? "INTELLIGENCE RELATION" : "情报关系链"}</span><h2 id="entity-relation-title">{english ? "From disclosure to next test" : "从事实变化到下一验证点"}</h2></header>
        <ol>
          <li><span>01</span><small>{english ? "Latest formal update" : "最新正式动态"}</small><strong>{stories[0] ? (english ? stories[0].titleEn ?? stories[0].title : stories[0].title) : (english ? "Awaiting a matching disclosure" : "等待匹配的一手披露")}</strong></li>
          <li><span>02</span><small>{english ? "Entity" : "公司实体"}</small><strong>{displayName}{entity.ticker ? ` · ${entity.ticker}` : ""}</strong></li>
          <li><span>03</span><small>{english ? "Industry node" : "产业节点"}</small><strong><a href={english ? "/en/industry" : "/industry"}>{category} →</a></strong></li>
          <li><span>04</span><small>{english ? "Research / next test" : "研究 / 下一验证"}</small><strong>{articles[0] ? <a href={english ? articles[0].hrefEn : articles[0].href}>{english ? articles[0].titleEn : articles[0].title} →</a> : nextCheckpoint(entity, lang)}</strong></li>
        </ol>
      </section>

      <section className="atlas-entity-section">
        <header><div><span>{english ? "SOURCE-LINKED UPDATES" : "来源可追溯动态"}</span><h2>{english ? "Latest disclosures" : "最新披露"}</h2></div><a href={english ? "/en/pulse" : "/pulse"}>{english ? "Open pulse" : "查看脉搏"} →</a></header>
        {stories.length ? <div className="atlas-entity-story-grid">{stories.map((story) => { const title = english ? story.titleEn ?? story.title : story.title; const summary = english ? story.summaryEn ?? story.summary : story.summary; return <article className="atlas-entity-story" key={story.id}><div><span>{story.category ?? (english ? "Infrastructure" : "基础设施")}</span><time>{formatDate(story.publishedAt, lang)}</time></div><h3>{story.sourceUrl ? <a href={story.sourceUrl} target="_blank" rel="noreferrer">{title} ↗</a> : title}</h3><p>{summary ?? (english ? "Open the source for the full disclosure." : "打开来源查看完整披露。")}</p><small>{story.sourceName ?? "IDC Atlas source record"}</small></article>; })}</div> : <p className="atlas-entity-empty">{english ? "No matching source-linked update in the current window." : "当前窗口暂未匹配到来源可追溯动态。"}</p>}
      </section>

      {rumors.length > 0 && <section className="atlas-entity-section atlas-entity-rumors">
        <header><div><span>RUMOR WATCH</span><h2>{english ? "Reported, not yet formal" : "报道线索，不等于正式事实"}</h2></div><a href={english ? "/en/rumors" : "/rumors"}>{english ? "Open intelligence" : "进入情报台"} →</a></header>
        <div className="atlas-entity-rumor-list">{rumors.map((item) => <a href={item.sourceUrl ?? (english ? "/en/rumors" : "/rumors")} target="_blank" rel="noreferrer" key={item.id}><time>{formatDate(item.publishedAt, lang)}</time><strong>{english ? item.titleEn ?? item.title : item.title}</strong><span>{english ? item.statusLabelEn : item.statusLabel}</span></a>)}</div>
      </section>}

      <section className="atlas-entity-section atlas-entity-research">
        <header><div><span>{english ? "RELATED RESEARCH" : "关联研究"}</span><h2>{english ? "Read the analysis" : "阅读相关专栏"}</h2></div><a href={english ? "/en/columns" : "/columns"}>{english ? "All columns" : "全部专栏"} →</a></header>
        <div className="atlas-entity-column-grid">{articles.map((article) => <a href={english ? article.hrefEn : article.href} key={article.href}><img src={article.image} alt={english ? article.titleEn : article.title} /><div><span>{article.series}</span><h3>{english ? article.titleEn : article.title}</h3><p>{english ? article.summaryEn : article.summary}</p><time>{formatDate(article.date, lang)}</time></div></a>)}{!articles.length && <p className="atlas-entity-empty">{english ? "No related column yet." : "暂无线性关联专栏。"}</p>}</div>
      </section>

      <section className="atlas-entity-section atlas-entity-checkpoint">
        <header><div><span>{english ? "NEXT CHECKPOINT" : "下一验证点"}</span><h2>{english ? "What changes the view" : "下一步看什么"}</h2></div></header>
        <div><strong>{nextCheckpoint(entity, lang)}</strong><p>{english ? "Atlas will move a reported item into the formal timeline only after a primary disclosure establishes the underlying fact." : "只有一手披露确立事实后，报道线索才会转入正式时间线；扫描时间本身不会制造内容更新。"}</p></div>
      </section>

      <div className="atlas-entity-footer"><span>{english ? "Entity pages combine formal records, reported intelligence, research and the next checkpoint." : "实体页将正式记录、报道线索、关联研究和下一验证点分层展示。"}</span><a href={english ? "/en/companies" : "/companies"}>{english ? "Company library" : "公司库"} →</a></div>
    </div>
  </IntelligenceConsoleShell>;
}
