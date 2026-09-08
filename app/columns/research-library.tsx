"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { articleEntities, buildDailyBrief } from "../intelligence-model";
import { AtlasReadingPanel } from "../atlas-reading-panel";
import { researchRecord, type DeskRecord } from "../desk-model";
import { trackAtlasEvent } from "../atlas-analytics";
import type { ColumnArticle } from "./articles";

function columnDate(publishAt: string, lang: "zh" | "en") {
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "zh-CN", {
    timeZone: lang === "en" ? "America/New_York" : "Asia/Shanghai",
    year: "numeric",
    month: lang === "en" ? "long" : "2-digit",
    day: "2-digit",
  }).format(new Date(publishAt));
}

export default function ResearchLibrary({ articles, lang }: { articles: ColumnArticle[]; lang: "zh" | "en" }) {
  const english = lang === "en";
  const [reading, setReading] = useState<DeskRecord | null>(null);
  const closeReading = useCallback(() => setReading(null), []);
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("all");
  const [entity, setEntity] = useState("all");
  const [relation, setRelation] = useState<"all" | "daily" | "company">("all");
  const [lifecycle, setLifecycle] = useState<"all" | "active" | "published">("all");
  const [hydrated, setHydrated] = useState(false);
  const dailyBrief = buildDailyBrief(articles);
  const seriesOptions = [...new Set(articles.map((article) => article.series.split(" · ")[0]))].sort();
  const entityOptions = useMemo(() => {
    const records = new Map<string, ReturnType<typeof articleEntities>[number]>();
    articles.flatMap(articleEntities).forEach((record) => records.set(record.slug, record));
    return [...records.values()].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  }, [articles]);
  const latestResearchAt = Math.max(...articles.map((article) => new Date(article.publishAt).getTime()));
  const visible = useMemo(() => articles.filter((article) => {
    const entities = articleEntities(article);
    const text = `${article.title} ${article.titleEn} ${article.summary} ${article.summaryEn} ${article.series}`.toLocaleLowerCase();
    const matchesQuery = !query.trim() || text.includes(query.trim().toLocaleLowerCase());
    const matchesSeries = series === "all" || article.series.startsWith(series);
    const matchesEntity = entity === "all" || entities.some((record) => record.slug === entity);
    const matchesRelation = relation === "all" || (relation === "daily" ? article.href === dailyBrief?.article.href : entities.length > 0);
    const active = latestResearchAt - new Date(article.publishAt).getTime() <= 7 * 86_400_000;
    const matchesLifecycle = lifecycle === "all" || (lifecycle === "active" ? active : !active);
    return matchesQuery && matchesSeries && matchesEntity && matchesRelation && matchesLifecycle;
  }), [articles, dailyBrief?.article.href, entity, latestResearchAt, lifecycle, query, relation, series]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    queueMicrotask(() => {
      setQuery(params.get("q") ?? "");
      setSeries(params.get("topic") ?? "all");
      setEntity(params.get("company") ?? "all");
      const relationParam = params.get("relation");
      if (relationParam === "daily" || relationParam === "company") setRelation(relationParam);
      const statusParam = params.get("status");
      if (statusParam === "active" || statusParam === "published") setLifecycle(statusParam);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (series !== "all") params.set("topic", series);
    if (entity !== "all") params.set("company", entity);
    if (relation !== "all") params.set("relation", relation);
    if (lifecycle !== "all") params.set("status", lifecycle);
    const href = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    window.history.replaceState(null, "", href);
  }, [entity, hydrated, lifecycle, query, relation, series]);

  return <>
    <AtlasReadingPanel record={reading} lang={lang} onClose={closeReading} />
    <section className="columns-index-tools" aria-label={english ? "Research filters" : "研究筛选"}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? "Search thesis, company or topic" : "搜索判断、公司或主题"} aria-label={english ? "Search research" : "搜索研究"} />
      <select value={series} onChange={(event) => setSeries(event.target.value)} aria-label={english ? "Filter by topic" : "按主题筛选"}><option value="all">{english ? "All topics" : "全部主题"}</option>{seriesOptions.map((item) => <option value={item} key={item}>{item}</option>)}</select>
      <select value={entity} onChange={(event) => setEntity(event.target.value)} aria-label={english ? "Filter by company" : "按公司筛选"}><option value="all">{english ? "All companies" : "全部公司"}</option>{entityOptions.map((item) => <option value={item.slug} key={item.slug}>{english ? item.nameEn : item.name}</option>)}</select>
      <select value={relation} onChange={(event) => setRelation(event.target.value as typeof relation)} aria-label={english ? "Filter by research relation" : "按研究关系筛选"}><option value="all">{english ? "All research" : "全部研究"}</option><option value="daily">{english ? "Today's brief" : "今日重点"}</option><option value="company">{english ? "Company-linked" : "公司关联"}</option></select>
      <select value={lifecycle} onChange={(event) => setLifecycle(event.target.value as typeof lifecycle)} aria-label={english ? "Filter by research lifecycle" : "按研究生命周期筛选"}><option value="all">{english ? "All lifecycle states" : "全部研究状态"}</option><option value="active">{english ? "Active monitoring" : "持续跟踪"}</option><option value="published">{english ? "Published archive" : "已发布归档"}</option></select>
      <strong>{visible.length} {english ? "articles" : "篇研究"}</strong>
    </section>
    <section className="columns-index-list" aria-label={english ? "IDC Atlas columns" : "IDC Atlas 专栏列表"}>
      {visible.map((article, index) => {
        const entities = articleEntities(article);
        const isDaily = article.href === dailyBrief?.article.href;
        const active = latestResearchAt - new Date(article.publishAt).getTime() <= 7 * 86_400_000;
        return <article className={index === 0 ? "featured" : ""} key={article.href}>
          <a className="columns-index-image" href={english ? article.hrefEn : article.href}><img src={article.image} alt={english ? article.titleEn : article.title} loading={index === 0 ? "eager" : "lazy"} /></a>
          <div><div className="columns-index-meta"><span>{article.series}</span><time dateTime={article.publishAt}>{columnDate(article.publishAt, lang)}</time></div><div className="columns-index-relations">{isDaily && <b>{english ? "TODAY'S BRIEF" : "今日重点"}</b>}<span>{active ? (english ? "Active monitoring" : "持续跟踪") : (english ? "Published archive" : "已发布归档")}</span>{entities.slice(0, 4).map((record) => <a href={`${english ? "/en/companies" : "/companies"}/${record.slug}`} key={record.slug}>{english ? record.nameEn : record.name}</a>)}</div><h2><a href={english ? article.hrefEn : article.href}>{english ? article.titleEn : article.title}</a></h2><p>{english ? article.summaryEn : article.summary}</p><button className="desk-preview-button" onClick={() => { setReading(researchRecord(article, lang)); trackAtlasEvent("atlas_research_preview", { article_path: article.href, language: lang }); }}>{english ? "Quick read ↗" : "侧栏速读 ↗"}</button> <a className="columns-index-read" href={english ? article.hrefEn : article.href}>{english ? "Read the column →" : "阅读全文 →"}</a></div>
        </article>;
      })}
      {!visible.length && <p className="columns-index-empty">{english ? "No published research matches these filters." : "没有符合当前筛选的已发布研究。"}</p>}
    </section>
  </>;
}
