"use client";

import { Children, type ReactNode, useEffect, useMemo, useState } from "react";
import type { Route, ShadowRunReport } from "../../../worker/event-intelligence/pipeline.ts";
import type { EditorialFeedbackAction, EditorialFeedbackRecord } from "../../../worker/event-intelligence/editorial-feedback.ts";

type EventRecord = ShadowRunReport["events"][number];
type SourceRecord = ShadowRunReport["sourceHealth"][number];
type ModuleId = "overview" | "sources" | "event-stream" | "event-detail" | "pipeline-runs" | "strategy-lab";

const modules: Array<{ id: ModuleId; label: string; description: string }> = [
  { id: "overview", label: "总览", description: "运行概览" },
  { id: "sources", label: "信源", description: "信源健康" },
  { id: "event-stream", label: "事件流", description: "筛选与路由" },
  { id: "event-detail", label: "事件详情", description: "单事件检查" },
  { id: "pipeline-runs", label: "管线运行", description: "运行与成本" },
  { id: "strategy-lab", label: "策略实验室", description: "策略回放" },
];

const routeLabels: Record<Route, string> = {
  "rumor-watch": "市场传闻",
  pulse: "事实脉冲",
  "policy-index": "政策证据",
  "research-queue": "研究队列",
  hold: "暂存",
  rejected: "排除",
};

const statusLabels: Record<string, string> = {
  ok: "正常",
  "not-modified": "无更新",
  failed: "失败",
  error: "错误",
  lead: "线索",
  reported: "已报道",
  "official-response": "官方回应",
  "official-confirmed": "官方确认",
  "multi-source": "多源报道",
  "single-source": "单一来源",
  contested: "存在争议",
  unverified: "待核验",
  stale: "已过期",
  completed: "已完成",
  "verified-no-change": "核验无变化",
};

const relationshipLabels: Record<string, string> = {
  "new-event": "新事件",
  "new-source": "新增信源",
  "state-change": "状态变化",
  "official-response": "官方回应",
  "new-detail": "新增事实",
  contradiction: "相互矛盾",
  duplicate: "重复报道",
  "verified-no-change": "核验无变化",
};

const feedbackLabels: Record<EditorialFeedbackAction, string> = {
  "cluster-correct": "聚类正确",
  "false-merge": "误合并",
  "missed-merge": "应合并",
  irrelevant: "无关",
  "needs-review": "需要复核",
};

function statusLabel(value: string): string {
  return statusLabels[value] ?? value;
}

function isModuleId(value: string): value is ModuleId {
  return modules.some((module) => module.id === value);
}

function statusClass(value: string): string {
  return `atlas-intelligence-badge atlas-intelligence-badge-${value.replaceAll("_", "-")}`;
}

function routeLabel(route: Route | undefined): string {
  return route ? routeLabels[route] : "暂存";
}

function sourceNames(event: EventRecord): string {
  return [...new Set(event.sourceChain.map((item) => item.sourceId))].join(" · ");
}

function usePagination(totalItems: number, pageSize = 12) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, pageCount);

  return {
    page: currentPage,
    pageCount,
    setPage,
    start: (currentPage - 1) * pageSize,
    end: currentPage * pageSize,
  };
}

export function IntelligenceWorkspace({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleId>("overview");

  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash.slice(1);
      setActiveModule(isModuleId(hash) ? hash : "overview");
    };

    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  function selectModule(id: ModuleId) {
    if (activeModule === id) return;
    window.history.pushState(null, "", `#${id}`);
    setActiveModule(id);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  return (
    <>
      <nav className="atlas-intelligence-tabs" aria-label="情报后台模块" role="tablist">
        {modules.map((module, index) => (
          <button
            aria-controls={module.id}
            aria-selected={activeModule === module.id}
            className={activeModule === module.id ? "is-active" : undefined}
            key={module.id}
            onClick={() => selectModule(module.id)}
            role="tab"
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{module.label}</strong>
            <small>{module.description}</small>
          </button>
        ))}
      </nav>
      <div className="atlas-intelligence-module-panels" data-active-module={activeModule}>
        {Children.map(children, (child) => child)}
      </div>
    </>
  );
}

function Pagination({ page, pageCount, setPage, total }: { page: number; pageCount: number; setPage: (page: number) => void; total: number }) {
  return (
    <div className="atlas-intelligence-pagination" aria-label="分页">
      <span>共 {total} 条 · 第 {page}/{pageCount} 页</span>
      <div>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} type="button">上一页</button>
        <button disabled={page >= pageCount} onClick={() => setPage(page + 1)} type="button">下一页</button>
      </div>
    </div>
  );
}

export function SourcesTable({ sources }: { sources: SourceRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesQuery = !normalizedQuery || `${source.sourceId} ${source.endpointId} ${source.independenceGroup}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (status === "all" || source.status === status) && (tier === "all" || source.tier === tier);
    });
  }, [query, sources, status, tier]);
  const pagination = usePagination(filtered.length);
  const statuses = useMemo(() => [...new Set(sources.map((source) => source.status))].sort(), [sources]);
  const tiers = useMemo(() => [...new Set(sources.map((source) => source.tier))].sort(), [sources]);

  return (
    <>
      <div className="atlas-intelligence-toolbar">
        <label className="atlas-intelligence-search">
          <span>搜索信源</span>
          <input onChange={(event) => { setQuery(event.target.value); pagination.setPage(1); }} placeholder="信源 / 接口 / 独立组" type="search" value={query} />
        </label>
        <label><span>状态</span><select onChange={(event) => { setStatus(event.target.value); pagination.setPage(1); }} value={status}><option value="all">全部状态</option>{statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select></label>
        <label><span>层级</span><select onChange={(event) => { setTier(event.target.value); pagination.setPage(1); }} value={tier}><option value="all">全部层级</option>{tiers.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <div className="atlas-intelligence-filter-summary"><strong>{filtered.length}</strong><span>当前结果</span></div>
      </div>
      <div className="atlas-intelligence-table-wrap"><table className="atlas-intelligence-table"><thead><tr><th>信源</th><th>接口</th><th>层级 / 独立组</th><th>状态</th><th>条目</th><th>错误</th></tr></thead><tbody>{filtered.slice(pagination.start, pagination.end).map((source) => <tr key={`${source.sourceId}-${source.endpointId}`}><td><strong>{source.sourceId}</strong></td><td>{source.endpointId}</td><td>{source.tier} / {source.independenceGroup}</td><td><span className={statusClass(source.status)}>{statusLabel(source.status)}</span></td><td>{source.observations}</td><td>{source.error ?? "—"}</td></tr>)}</tbody></table></div>
      <Pagination page={pagination.page} pageCount={pagination.pageCount} setPage={pagination.setPage} total={filtered.length} />
    </>
  );
}

export function EventStream({ events }: { events: EventRecord[] }) {
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState("all");
  const [evidence, setEvidence] = useState("all");
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return events.filter((event) => {
      const haystack = `${event.titleZh} ${event.titleEn} ${event.eventKey} ${event.entities.join(" ")} ${sourceNames(event)}`.toLowerCase();
      return (!normalizedQuery || haystack.includes(normalizedQuery)) && (route === "all" || (event.route ?? "hold") === route) && (evidence === "all" || event.evidenceStatus === evidence);
    });
  }, [events, evidence, query, route]);
  const pagination = usePagination(filtered.length);
  const evidenceStates = useMemo(() => [...new Set(events.map((event) => event.evidenceStatus))].sort(), [events]);

  function openEvent(id: string) {
    window.sessionStorage.setItem("atlas-admin-event", id);
    window.dispatchEvent(new CustomEvent("atlas-select-event", { detail: id }));
    window.history.pushState(null, "", "#event-detail");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <>
      <div className="atlas-intelligence-toolbar">
        <label className="atlas-intelligence-search"><span>搜索事件</span><input onChange={(event) => { setQuery(event.target.value); pagination.setPage(1); }} placeholder="标题 / 公司 / 事件键 / 信源" type="search" value={query} /></label>
        <label><span>路由</span><select onChange={(event) => { setRoute(event.target.value); pagination.setPage(1); }} value={route}><option value="all">全部路由</option>{Object.entries(routeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span>证据状态</span><select onChange={(event) => { setEvidence(event.target.value); pagination.setPage(1); }} value={evidence}><option value="all">全部状态</option>{evidenceStates.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select></label>
        <div className="atlas-intelligence-filter-summary"><strong>{filtered.length}</strong><span>当前结果</span></div>
      </div>
      <div className="atlas-intelligence-table-wrap"><table className="atlas-intelligence-table"><thead><tr><th>事件</th><th>路由</th><th>证据状态</th><th>优先级</th><th>信源</th><th>更新时间</th></tr></thead><tbody>{filtered.slice(pagination.start, pagination.end).map((event) => <tr key={event.id}><td><button className="atlas-intelligence-event-link" onClick={() => openEvent(event.id)} type="button"><strong>{event.titleZh}</strong><small>{event.eventKey}</small></button></td><td><span className={statusClass(event.route ?? "hold")}>{routeLabel(event.route)}</span></td><td><span className={statusClass(event.evidenceStatus)}>{statusLabel(event.evidenceStatus)}</span></td><td>{event.priorityScore ?? 0}</td><td>{sourceNames(event)}</td><td>{event.lastUpdatedAt}</td></tr>)}</tbody></table></div>
      <Pagination page={pagination.page} pageCount={pagination.pageCount} setPage={pagination.setPage} total={filtered.length} />
    </>
  );
}

export function EventInspector({ events }: { events: EventRecord[] }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id ?? "");
  const [feedback, setFeedback] = useState<EditorialFeedbackRecord | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [relatedEventId, setRelatedEventId] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "loading" | "saving">("loading");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const selectedIndex = Math.max(0, events.findIndex((event) => event.id === selectedId));
  const event = events[selectedIndex];

  useEffect(() => {
    const stored = window.sessionStorage.getItem("atlas-admin-event");
    const frame = stored && events.some((event) => event.id === stored)
      ? window.requestAnimationFrame(() => setSelectedId(stored))
      : null;
    const select = (input: Event) => {
      const id = (input as CustomEvent<string>).detail;
      if (events.some((event) => event.id === id)) {
        setFeedback(null);
        setFeedbackState("loading");
        setFeedbackMessage("");
        setSelectedId(id);
      }
    };
    window.addEventListener("atlas-select-event", select);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("atlas-select-event", select);
    };
  }, [events]);

  useEffect(() => {
    if (!event) return;
    const controller = new AbortController();
    fetch(`/api/admin/intelligence/feedback?eventId=${encodeURIComponent(event.id)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("无法读取反馈记录");
        return response.json() as Promise<{ feedback: EditorialFeedbackRecord | null }>;
      })
      .then(({ feedback: saved }) => {
        setFeedback(saved);
        setFeedbackNote(saved?.note ?? "");
        setRelatedEventId(saved?.relatedEventId ?? "");
        setFeedbackState("idle");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setFeedback(null);
        setFeedbackState("idle");
        setFeedbackMessage(error instanceof Error ? error.message : "无法读取反馈记录");
      });
    return () => controller.abort();
  }, [event]);

  if (!event) return <p className="atlas-intelligence-note">当前运行没有聚类事件。</p>;

  function select(id: string) {
    setFeedback(null);
    setFeedbackState("loading");
    setFeedbackMessage("");
    setSelectedId(id);
    window.sessionStorage.setItem("atlas-admin-event", id);
  }

  async function saveFeedback(action: EditorialFeedbackAction) {
    if (!event || feedbackState === "saving") return;
    if (action === "missed-merge" && !relatedEventId) {
      setFeedbackMessage("请先选择应该合并的另一条事件。");
      return;
    }

    setFeedbackState("saving");
    setFeedbackMessage("");
    try {
      const response = await fetch("/api/admin/intelligence/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventKey: event.eventKey,
          eventTitle: event.titleZh,
          action,
          relatedEventId: action === "missed-merge" ? relatedEventId : null,
          note: feedbackNote,
        }),
      });
      const payload = await response.json() as { feedback?: EditorialFeedbackRecord; error?: string };
      if (!response.ok || !payload.feedback) throw new Error(payload.error ?? "保存失败");
      setFeedback(payload.feedback);
      setFeedbackState("idle");
      setFeedbackMessage("反馈已保存，并写入回放样本。不会自动修改公开内容。");
    } catch (error) {
      setFeedbackState("idle");
      setFeedbackMessage(error instanceof Error ? error.message : "保存失败");
    }
  }

  return (
    <>
      <div className="atlas-intelligence-inspector-nav">
        <label><span>当前事件</span><select onChange={(input) => select(input.target.value)} value={event.id}>{events.map((item, index) => <option key={item.id} value={item.id}>{String(index + 1).padStart(2, "0")} · {item.titleZh}</option>)}</select></label>
        <span>{selectedIndex + 1} / {events.length}</span>
        <div><button disabled={selectedIndex === 0} onClick={() => select(events[selectedIndex - 1].id)} type="button">上一条</button><button disabled={selectedIndex === events.length - 1} onClick={() => select(events[selectedIndex + 1].id)} type="button">下一条</button></div>
      </div>
      <article className="atlas-intelligence-detail">
        <div className="atlas-intelligence-detail-head"><div><p className="atlas-intelligence-eyebrow">{event.eventType} · {event.region}</p><h3>{event.titleZh}</h3><p>{event.summaryZh}</p></div><span className={statusClass(event.route ?? "hold")}>{routeLabel(event.route)}</span></div>
        <div className="atlas-intelligence-detail-meta"><div><small>证据状态</small><strong>{statusLabel(event.evidenceStatus)}</strong></div><div><small>优先级</small><strong>{event.priorityScore ?? 0}</strong></div><div><small>独立信源</small><strong>{event.independentSourceCount}</strong></div><div><small>更新时间</small><strong>{event.lastUpdatedAt}</strong></div></div>
        <div className="atlas-intelligence-detail-columns"><div><small>信源链</small><ul>{event.sourceChain.map((source) => <li key={source.observationId}><a href={source.url} rel="noreferrer" target="_blank"><strong>{source.sourceId}</strong></a> · {source.tier} · {relationshipLabels[source.relationship] ?? source.relationship} · {statusLabel(source.accessStatus)}</li>)}</ul></div><div><small>结构化事实</small><ul>{event.facts.length ? event.facts.map((fact, index) => <li key={`${event.id}-fact-${index}`}><strong>{fact.valueText}</strong> · {fact.factType} · {fact.qualifier ?? "限定条件待补"} · {fact.capacityType ?? "—"}</li>) : <li>暂无提取事实</li>}</ul></div><div><small>判定代码</small><ul>{(event.reasonCodes ?? []).length ? (event.reasonCodes ?? []).map((reason) => <li key={reason}>{reason}</li>) : <li>暂无判定代码</li>}</ul></div></div>
        <section className="atlas-intelligence-feedback" aria-labelledby="atlas-feedback-title">
          <div className="atlas-intelligence-feedback-head">
            <div><small>人工反馈 · 仅供内部回放</small><h4 id="atlas-feedback-title">这条事件的聚类与路由是否正确？</h4></div>
            <span className={feedback ? statusClass(feedback.action) : statusClass("unverified")}>
              {feedback ? feedbackLabels[feedback.action] : feedbackState === "loading" ? "读取中" : "尚未标注"}
            </span>
          </div>
          <div className="atlas-intelligence-feedback-actions">
            {(["cluster-correct", "false-merge", "irrelevant", "needs-review"] as EditorialFeedbackAction[]).map((action) => (
              <button disabled={feedbackState !== "idle"} key={action} onClick={() => saveFeedback(action)} type="button">{feedbackLabels[action]}</button>
            ))}
          </div>
          <div className="atlas-intelligence-feedback-merge">
            <label><span>漏合并目标</span><select onChange={(input) => setRelatedEventId(input.target.value)} value={relatedEventId}><option value="">选择另一条事件</option>{events.filter((item) => item.id !== event.id).map((item) => <option key={item.id} value={item.id}>{item.titleZh}</option>)}</select></label>
            <button disabled={feedbackState !== "idle" || !relatedEventId} onClick={() => saveFeedback("missed-merge")} type="button">标记应合并</button>
          </div>
          <label className="atlas-intelligence-feedback-note"><span>补充说明（可选）</span><textarea maxLength={800} onChange={(input) => setFeedbackNote(input.target.value)} placeholder="写下误判原因、缺失实体或需要核验的事实。" rows={3} value={feedbackNote} /></label>
          <div className="atlas-intelligence-feedback-status" aria-live="polite">
            <span>{feedback ? `最近标注：${new Date(feedback.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}` : "每次提交都会保留历史记录。"}</span>
            {feedbackMessage ? <strong>{feedbackMessage}</strong> : null}
          </div>
        </section>
      </article>
    </>
  );
}
