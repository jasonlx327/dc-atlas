"use client";

import { useEffect, useMemo, useState } from "react";
import { publishedColumnArticles } from "./columns/articles";
import { deriveConsoleMeta } from "./console-meta";
import { entityDirectory } from "./entity-directory";
import EntityFollowButton, { useFollowedEntityIds } from "./entity-follow-button";
import { entityStories, nextCheckpoint, relatedResearch, shouldAdoptPayload, type IntelligenceStory } from "./intelligence-model";
import { IntelligenceConsoleShell } from "./intelligence-console-overview";

type DirectoryPayload = Record<string, unknown> & {
  idcPulse?: IntelligenceStory[];
  listedCompanyNews?: IntelligenceStory[];
};

export default function CompanyDirectoryPage({ lang, initialPayload = null }: { lang: "zh" | "en"; initialPayload?: Record<string, unknown> | null }) {
  const english = lang === "en";
  const [payload, setPayload] = useState<DirectoryPayload>((initialPayload ?? {}) as DirectoryPayload);
  const meta = deriveConsoleMeta(payload);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"all" | "中国" | "美国" | "全球">("all");
  const [category, setCategory] = useState("all");
  const [activity, setActivity] = useState<"all" | "active" | "watch">("all");
  const [recency, setRecency] = useState<"all" | "7" | "30">("all");
  const [followedOnly, setFollowedOnly] = useState(false);
  const followedEntityIds = useFollowedEntityIds();
  const stories = useMemo(() => [...(payload.listedCompanyNews ?? []), ...(payload.idcPulse ?? [])], [payload.idcPulse, payload.listedCompanyNews]);
  const dataConnected = Boolean(payload.generatedAt || stories.length);
  const articles = publishedColumnArticles();
  const categories = [...new Set(entityDirectory.map((entity) => english ? entity.categoryEn : entity.category))].sort();
  const visible = useMemo(() => entityDirectory.map((entity) => {
    const updates = entityStories(entity, stories);
    return { entity, updates, research: relatedResearch(entity, articles) };
  }).filter(({ entity, updates }) => {
    const haystack = [entity.name, entity.nameEn, entity.ticker, entity.category, entity.categoryEn, ...entity.aliases].filter(Boolean).join(" ").toLocaleLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLocaleLowerCase());
    const matchesRegion = region === "all" || entity.region === region;
    const label = english ? entity.categoryEn : entity.category;
    const matchesActivity = activity === "all" || (activity === "active" ? updates.length >= 2 : updates.length === 1);
    const newest = updates[0]?.publishedAt ? Date.parse(updates[0].publishedAt) : 0;
    const reference = Date.parse(meta.generatedAt ?? meta.lastContentChangedAt ?? new Date().toISOString());
    const matchesRecency = recency === "all" || (newest > 0 && reference - newest <= Number(recency) * 86_400_000);
    const matchesFollow = !followedOnly || followedEntityIds.includes(entity.slug);
    return matchesQuery && matchesRegion && matchesActivity && matchesRecency && matchesFollow && (category === "all" || label === category);
  }).sort((a, b) => {
    const aDate = Date.parse(a.updates[0]?.publishedAt ?? "1970-01-01");
    const bDate = Date.parse(b.updates[0]?.publishedAt ?? "1970-01-01");
    return bDate - aDate || b.updates.length - a.updates.length || a.entity.nameEn.localeCompare(b.entity.nameEn);
  }), [activity, articles, category, english, followedEntityIds, followedOnly, meta.generatedAt, meta.lastContentChangedAt, query, recency, region, stories]);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/atlas-live-v5?schema=v1", { signal: controller.signal, cache: "no-store", headers: { "cache-control": "no-cache" } })
      .then((response) => response.ok ? response.json() as Promise<DirectoryPayload> : Promise.reject(new Error("Atlas unavailable")))
      .then((next) => setPayload((current) => shouldAdoptPayload(current, next) ? next : current))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return <IntelligenceConsoleShell
    lang={lang}
    activeSection="companies"
    generatedAt={meta.generatedAt}
    reviewedAt={meta.reviewedAt}
    contentVersion={meta.contentVersion}
    lastContentChangedAt={meta.lastContentChangedAt}
    sourceCount={meta.sourceCount}
    verifiedCount={meta.verifiedCount}
    pageLabel={english ? "Company intelligence library" : "公司情报库"}
    className="atlas-company-directory-shell"
  >
    <div className="atlas-company-directory atlas-console-content-page">
      <header className="atlas-company-directory-hero">
        <div><span>IDC ATLAS · {english ? "COMPANY INTELLIGENCE" : "公司情报库"}</span><h1>{english ? "Companies behind the AI infrastructure buildout" : "AI 基础设施公司的事实、研究与下一节点"}</h1><p>{english ? "One place for formal disclosures, related analysis and the next checkpoint across the companies Atlas tracks." : "把正式披露、关联研究和下一验证点放在同一个公司入口；不再让公司动态散落在首页卡片里。"}</p></div>
        <dl><div><dt>{english ? "Tracked" : "覆盖公司"}</dt><dd>{entityDirectory.length}</dd></div><div><dt>{english ? "With research" : "已有研究"}</dt><dd>{entityDirectory.filter((entity) => relatedResearch(entity, articles).length > 0).length}</dd></div><div><dt>{english ? "Live updates" : "当前动态"}</dt><dd>{dataConnected ? stories.length : (english ? "Syncing" : "同步中")}</dd></div></dl>
      </header>

      <section className="atlas-company-directory-tools" aria-label={english ? "Company filters" : "公司筛选"}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? "Search name, ticker or category" : "搜索公司、代码或类别"} aria-label={english ? "Search companies" : "搜索公司"} />
        <select value={region} onChange={(event) => setRegion(event.target.value as typeof region)} aria-label={english ? "Filter by market" : "按市场筛选"}><option value="all">{english ? "All markets" : "全部市场"}</option><option value="中国">{english ? "China" : "中国"}</option><option value="美国">{english ? "United States" : "美国"}</option><option value="全球">{english ? "Global" : "全球"}</option></select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={english ? "Filter by category" : "按类别筛选"}><option value="all">{english ? "All categories" : "全部类别"}</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select>
        <select value={activity} onChange={(event) => setActivity(event.target.value as typeof activity)} aria-label={english ? "Filter by event strength" : "按事件强度筛选"}><option value="all">{english ? "Any event strength" : "全部事件强度"}</option><option value="active">{english ? "High activity (2+)" : "高强度（2+）"}</option><option value="watch">{english ? "Single update" : "单一动态"}</option></select>
        <select value={recency} onChange={(event) => setRecency(event.target.value as typeof recency)} aria-label={english ? "Filter by update time" : "按更新时间筛选"}><option value="all">{english ? "Any update time" : "全部更新时间"}</option><option value="7">{english ? "Last 7 days" : "近 7 天"}</option><option value="30">{english ? "Last 30 days" : "近 30 天"}</option></select>
        <button type="button" className="atlas-company-follow-filter" aria-pressed={followedOnly} onClick={() => setFollowedOnly((value) => !value)}>{english ? `Following (${followedEntityIds.length})` : `仅看关注（${followedEntityIds.length}）`}</button>
        <strong>{visible.length} {english ? "companies" : "家公司"}</strong>
      </section>

      <section className="atlas-company-directory-grid" aria-live="polite">
        {visible.map(({ entity, updates, research }) => {
          return <article key={entity.slug}>
            <header><span>{entity.ticker ?? (english ? "PRIVATE" : "未上市")}</span><EntityFollowButton slug={entity.slug} lang={lang} compact /></header>
            <h2><a href={english ? `/en/companies/${entity.slug}` : `/companies/${entity.slug}`}>{english ? entity.nameEn : entity.name}</a></h2>
            <p>{english ? entity.descriptionEn : entity.description}</p>
            <dl><div><dt>{english ? "Market" : "市场"}</dt><dd>{english ? (entity.region === "中国" ? "China" : entity.region === "美国" ? "United States" : "Global") : entity.region}</dd></div><div><dt>{english ? "Category" : "类别"}</dt><dd>{english ? entity.categoryEn : entity.category}</dd></div><div><dt>{english ? "Verified updates" : "已核验动态"}</dt><dd>{dataConnected ? updates.length : "—"}</dd></div><div><dt>{english ? "Research" : "研究"}</dt><dd>{research.length ? `${research.length} · ${research[0].date}` : (english ? "Queued" : "待跟进")}</dd></div><div className="atlas-company-checkpoint"><dt>{english ? "Next checkpoint" : "下一验证点"}</dt><dd>{nextCheckpoint(entity, lang)}</dd></div></dl>
            <footer><a href={english ? `/en/companies/${entity.slug}` : `/companies/${entity.slug}`}>{english ? "Open company intelligence" : "打开公司情报"} →</a>{updates[0] && <time>{new Intl.DateTimeFormat(english ? "en-US" : "zh-CN", { dateStyle: "medium" }).format(new Date(updates[0].publishedAt ?? 0))}</time>}</footer>
          </article>;
        })}
      </section>
    </div>
  </IntelligenceConsoleShell>;
}
