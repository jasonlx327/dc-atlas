"use client";

import { useEffect, useMemo, useState } from "react";
import { IntelligenceConsoleShell } from "./intelligence-console-overview";
import {
  POLICY_BRIEFS,
  RUMOR_BRIEFS,
  type PolicyIndexRecord,
  type RumorWatchItem,
} from "./watch-data";

export type { PolicyIndexRecord, RumorWatchItem } from "./watch-data";

export type WatchPayload = {
  generatedAt?: string;
  contentReviewedAt?: string;
  policyIndex?: PolicyIndexRecord[];
  policyStatus?: "policy-briefs" | "source-index";
  rumors?: RumorWatchItem[];
  rumorStatus?: "live" | "not-yet-published";
  rumorNote?: string;
};

type Props = {
  lang: "zh" | "en";
  kind: "policy" | "rumors";
  initialPayload?: Partial<WatchPayload> | null;
};

const EMPTY_POLICY: PolicyIndexRecord[] = [];
const EMPTY_RUMORS: RumorWatchItem[] = [];

function formatDate(value: string | null | undefined, lang: "zh" | "en") {
  if (!value) return lang === "zh" ? "持续监测" : "Ongoing watch";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    timeZone: lang === "zh" ? "Asia/Shanghai" : "America/New_York",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function WatchIndex({ lang, kind, initialPayload = null }: Props) {
  const isZh = lang === "zh";
  const [payload, setPayload] = useState<Partial<WatchPayload> | null>(initialPayload);
  const [filter, setFilter] = useState<"all" | "US" | "中国" | "美国" | "全球">("all");
  const policy = payload?.policyStatus === "policy-briefs" && payload.policyIndex?.length
    ? payload.policyIndex
    : kind === "policy"
      ? POLICY_BRIEFS
      : EMPTY_POLICY;
  const rumors = payload?.rumors?.length
    ? payload.rumors
    : kind === "rumors"
      ? RUMOR_BRIEFS
      : EMPTY_RUMORS;
  const visiblePolicy = useMemo(() => {
    if (filter === "all") return policy;
    if (filter === "中国") return policy.filter((item) => item.jurisdiction === "中国");
    if (filter === "US") return policy.filter((item) => item.jurisdiction === "US");
    return policy;
  }, [filter, policy]);
  const visibleRumors = useMemo(() => {
    if (filter === "all") return rumors;
    if (filter === "全球") return rumors.filter((item) => item.region === "全球");
    if (filter === "美国") return rumors.filter((item) => item.region === "美国");
    if (filter === "中国") return rumors.filter((item) => item.region === "中国");
    return rumors;
  }, [filter, rumors]);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/atlas-live-v5?schema=v1", { signal: controller.signal, cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<WatchPayload> : Promise.reject(new Error("Atlas unavailable")))
      .then((next) => setPayload(next))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const sourceCount = kind === "policy"
    ? new Set(policy.map((item) => item.sourceName)).size
    : new Set(rumors.map((item) => item.sourceName)).size;
  const verifiedCount = kind === "policy" ? policy.length : 0;
  const pageLabel = kind === "policy" ? (isZh ? "政策动态" : "Policy tracker") : (isZh ? "市场传闻" : "Rumor Watch");
  const title = kind === "policy"
    ? (isZh ? "中美数据中心政策追踪" : "Data-center policy tracker")
    : (isZh ? "市场传闻与待核验线索" : "Reported market developments");
  const description = kind === "policy"
    ? (isZh ? "追踪影响数据中心建设、用电、并网和运营成本的中美政策变化。每条提炼政策内容、执行状态和直接影响，原文仅作核验出处。" : "Tracks China and U.S. policy that changes data-center construction, power, interconnection and operating costs. Each brief separates the policy, its status and its direct effect.")
    : (isZh ? "汇总已由主流媒体公开报道、但尚未获得公司或监管方完整确认的基础设施线索。每条保留涉及主体、报道状态与原始出处。" : "Tracks infrastructure developments reported by major media but not yet fully confirmed by companies or regulators. Each item keeps the entities, status and original source visible.");
  const items = kind === "policy" ? visiblePolicy : visibleRumors;

  return <IntelligenceConsoleShell
    lang={lang}
    activeSection={kind}
    generatedAt={payload?.generatedAt}
    reviewedAt={payload?.contentReviewedAt}
    sourceCount={sourceCount}
    verifiedCount={verifiedCount}
    pageLabel={pageLabel}
    className={`atlas-watch-shell atlas-${kind}-shell`}
  >
    <div className={`watch-page ${kind === "policy" ? "policy-page" : "rumor-page"}`}>
      <header className="watch-hero">
        <span>{kind === "policy" ? "POLICY WATCH · DIRECT IMPACT" : "RUMOR WATCH · SOURCE LINKED"}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="watch-hero-meta">
          {kind === "policy" ? <>
            <span>{isZh ? "官方文件" : "Official source"}</span>
            <span>{isZh ? "执行状态" : "Implementation status"}</span>
            <span>{isZh ? "直接影响" : "Direct effect"}</span>
          </> : <>
            <span>{isZh ? "媒体报道" : "Media reported"}</span>
            <span>{isZh ? "未获完整确认" : "Not fully confirmed"}</span>
            <span>{isZh ? "保留来源" : "Source linked"}</span>
          </>}
          <span>{isZh ? "更新时间" : "Updated"} {formatDate(payload?.generatedAt, lang)}</span>
        </div>
      </header>

      <section className="watch-toolbar" aria-label={isZh ? "筛选" : "Filters"}>
        <div>
          <strong>{kind === "policy" ? (isZh ? "政策动态" : "Policy briefs") : (isZh ? "报道线索" : "Reported items")}</strong>
          <span>{kind === "policy" ? (isZh ? `${visiblePolicy.length} 条政策更新` : `${visiblePolicy.length} policy updates`) : (isZh ? `${visibleRumors.length} 条公开报道` : `${visibleRumors.length} public reports`)}</span>
        </div>
        <nav>
          {(kind === "policy" ? [["all", isZh ? "全部" : "All"], ["中国", isZh ? "中国" : "China"], ["US", isZh ? "美国" : "U.S."]] : [["all", isZh ? "全部" : "All"], ["全球", isZh ? "全球" : "Global"], ["美国", isZh ? "美国" : "U.S."], ["中国", isZh ? "中国" : "China"]]).map(([key, label]) => <button type="button" key={key} className={filter === key ? "active" : ""} aria-pressed={filter === key} onClick={() => setFilter(key as typeof filter)}>{label}</button>)}
        </nav>
      </section>

      {items.length ? <section className="watch-grid" aria-live="polite">{kind === "policy"
        ? visiblePolicy.map((item) => <article className="watch-card policy-card" key={item.id}>
          <div className="watch-card-top"><span>{item.jurisdiction === "US" ? "U.S." : "中国"}</span><time>{formatDate(item.publishedAt, lang)}</time></div>
          <h2>{isZh ? item.title : item.titleEn}</h2>
          <p className="watch-scope">{isZh ? item.scope : item.scopeEn}</p>
          <p>{isZh ? item.summary : item.summaryEn}</p>
          <div className="watch-impact">
            <span>{isZh ? "直接影响" : "DIRECT EFFECT"}</span>
            <p>{isZh ? item.impact : item.impactEn}</p>
          </div>
          <dl className="watch-card-facts">
            <div>
              <dt>{isZh ? "适用对象" : "WHO IT AFFECTS"}</dt>
              <dd>{isZh ? item.affected : item.affectedEn}</dd>
            </div>
            <div>
              <dt>{isZh ? "执行状态" : "IMPLEMENTATION"}</dt>
              <dd>{isZh ? item.effectiveLabel : item.effectiveLabelEn}</dd>
            </div>
          </dl>
          <div className="watch-card-foot"><strong>{isZh ? item.status : item.statusEn}</strong><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceName} ↗</a></div>
        </article>)
        : visibleRumors.map((item) => <article className="watch-card rumor-card" key={item.id}>
          <div className="watch-card-top"><span>{isZh ? "媒体报道" : "REPORTED"}</span><time>{formatDate(item.publishedAt, lang)}</time></div>
          <h2>{isZh ? item.title : item.titleEn}</h2>
          <p>{isZh ? item.summary : item.summaryEn}</p>
          <div className="watch-entity-row">
            {item.entities.map((entity) => <span key={entity}>{entity}</span>)}
          </div>
          <div className="watch-response">
            <span>{isZh ? "公开回应" : "PUBLIC RESPONSE"}</span>
            <p>{isZh ? item.officialResponse : item.officialResponseEn}</p>
          </div>
          <p className="watch-source-note">{isZh ? item.sourceNote : item.sourceNoteEn}</p>
          <div className="watch-card-foot"><strong>{isZh ? item.statusLabel : item.statusLabelEn}</strong><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceName} ↗</a></div>
        </article>)}</section> : <section className="watch-empty" aria-live="polite"><span>NO CURRENT MATCH</span><h2>{kind === "policy" ? (isZh ? "当前筛选下没有政策更新。" : "No policy update matches this filter.") : (isZh ? "当前筛选下没有公开报道。" : "No public report matches this filter.")}</h2><p>{kind === "policy" ? (isZh ? "政策简报只收录可回溯到官方文件、且能说明执行状态与直接影响的条目。" : "Policy briefs require an official document plus a clear implementation status and direct effect.") : (payload?.rumorNote ?? (isZh ? "不会用旧内容或未注明来源的消息填充当前列表。" : "The list is not backfilled with stale or unsourced items."))}</p></section>}

      <aside className="watch-boundary"><strong>{isZh ? "阅读边界" : "Reading boundary"}</strong><p>{kind === "policy" ? (isZh ? "页面内容是对公开政策文件的研究摘要，不构成法律意见；具体适用范围与执行要求以发布机构正式文件为准。" : "These are research summaries of public policy documents, not legal advice. The issuing authority's text controls scope and implementation.") : (isZh ? "Rumor Watch 只记录公开报道，不把线索当作已核验事实，也不作投资建议；出现官方披露后，信息会转入对应脉冲或公司页面。" : "Rumor Watch records public reporting without treating it as verified fact or investment advice. Official disclosures move to the relevant pulse or company page.")}</p></aside>
    </div>
  </IntelligenceConsoleShell>;
}

export default WatchIndex;
