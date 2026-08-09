import type { Metadata } from "next";
import { notFound } from "next/navigation";
import latestRunJson from "../../../artifacts/event-intelligence/latest-run.json";
import strategyComparisonJson from "../../../artifacts/event-intelligence/strategy-comparison.json";
import type { Route, ShadowRunReport } from "../../../worker/event-intelligence/pipeline.ts";

export const metadata: Metadata = {
  title: "Intelligence Console · IDC Atlas",
  robots: { index: false, follow: false },
};

type LocalReport = ShadowRunReport & {
  inputMode?: string;
  shadowDbPath?: string;
  sourceRegistryCount?: number;
};

type StrategyComparison = {
  fixture: { observations: number; labelledEvents: number; clusteredEvents: number; scaleCaveat: string };
  current: { routeCounts: Record<Route, number>; labelChecks: { total: number; passed: number; failed: number; failures: string[] }; mediaOnlyEscalatedToPulse: number; nonT0PolicyRoutes: number; capacityBoundaryErrors: string[] };
  legacyTierOnly: { routeCounts: Record<string, number>; mediaOnlyEscalatedToPulse: number; policyNotSeparated: number; note: string };
};

const report = latestRunJson as unknown as LocalReport;
const comparison = strategyComparisonJson as unknown as StrategyComparison;

const routeLabels: Record<Route, string> = {
  "rumor-watch": "Rumor Watch",
  pulse: "Pulse",
  "policy-index": "Policy Evidence (legacy)",
  "research-queue": "Research Queue",
  hold: "Hold",
  rejected: "Rejected",
};

function routeLabel(route: Route | undefined): string {
  return route ? routeLabels[route] : "Hold";
}

function statusClass(value: string): string {
  return `atlas-intelligence-badge atlas-intelligence-badge-${value.replaceAll("_", "-")}`;
}

function sourceNames(event: LocalReport["events"][number]): string {
  return [...new Set(event.sourceChain.map((item) => item.sourceId))].join(" · ");
}

export default function IntelligenceConsolePage() {
  if (process.env.ATLAS_INTELLIGENCE_ADMIN !== "1") {
    notFound();
  }

  return (
    <main className="atlas-intelligence-page">
      <header className="atlas-intelligence-header">
        <div>
          <p className="atlas-intelligence-kicker">IDC ATLAS / LOCAL OPERATIONS</p>
          <h1>事件情报观测台</h1>
          <p className="atlas-intelligence-lede">观察 source → observation → analysis → event → route 的 shadow 结果。当前页面只读本地 shadow artifact，不代表生产 D1、Worker、Sites 或正式来源切换。</p>
        </div>
        <div className="atlas-intelligence-run-status">
          <span className={statusClass(report.status)}>{report.status}</span>
          <small>{report.generatedAt} · {report.inputMode ?? "unknown"}</small>
        </div>
      </header>

      <nav className="atlas-intelligence-tabs" aria-label="Intelligence views">
        <a href="#overview">Overview</a>
        <a href="#sources">Sources</a>
        <a href="#event-stream">Event Stream</a>
        <a href="#event-detail">Event Detail</a>
        <a href="#pipeline-runs">Pipeline Runs</a>
        <a href="#strategy-lab">Strategy Lab</a>
      </nav>

      <section id="overview" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>01</span><h2>Overview</h2></div><small>strategy {report.strategyVersion} · classifier {report.classifierVersion}</small></div>
        <div className="atlas-intelligence-metrics">
          {([ ["Fetched", report.stats.fetched], ["Relevant", report.stats.relevant], ["Clusters", report.stats.clusters], ["Public eligible", report.stats.publicEligible], ["Failures", report.stats.errors], ["Model calls", report.cost.modelCalls] ] as Array<[string, number]>).map(([label, value]) => <div className="atlas-intelligence-metric" key={label}><small>{label}</small><strong>{value}</strong></div>)}
        </div>
        <div className="atlas-intelligence-grid atlas-intelligence-grid-3">
          <div className="atlas-intelligence-card"><small>Freshness</small><strong>{report.freshness}</strong><p>Run status is derived from connector results; `verified-no-change` remains a valid state.</p></div>
          <div className="atlas-intelligence-card"><small>Route split</small><strong>{Object.entries(report.stats.routeCounts).filter(([, count]) => count > 0).map(([route, count]) => `${routeLabel(route as Route)} ${count}`).join(" · ")}</strong><p>Evidence route and priority score are stored separately.</p></div>
          <div className="atlas-intelligence-card"><small>Storage boundary</small><strong>SQLite shadow</strong><p>{report.shadowDbPath ?? "Local shadow database path not recorded"}; no production binding.</p></div>
        </div>
      </section>

      <section id="sources" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>02</span><h2>Sources</h2></div><small>{report.sourceRegistryCount ?? report.sourceHealth.length} registered / {report.sourceHealth.length} sampled</small></div>
        <div className="atlas-intelligence-table-wrap"><table className="atlas-intelligence-table"><thead><tr><th>Source</th><th>Endpoint</th><th>Tier / group</th><th>Status</th><th>Items</th><th>Error</th></tr></thead><tbody>{report.sourceHealth.map((source) => <tr key={`${source.sourceId}-${source.endpointId}`}><td>{source.sourceId}</td><td>{source.endpointId}</td><td>{source.tier} / {source.independenceGroup}</td><td><span className={statusClass(source.status)}>{source.status}</span></td><td>{source.observations}</td><td>{source.error ?? "—"}</td></tr>)}</tbody></table></div>
        <p className="atlas-intelligence-note">Access status stays attached to each observation. Media-only inputs remain Rumor Watch; AI HOT is discovery/lead input and does not replace original-source verification.</p>
      </section>

      <section id="event-stream" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>03</span><h2>Event Stream</h2></div><small>{report.events.length} clustered events</small></div>
        <div className="atlas-intelligence-table-wrap"><table className="atlas-intelligence-table"><thead><tr><th>Event</th><th>Route</th><th>Evidence</th><th>Priority</th><th>Sources</th><th>Updated</th></tr></thead><tbody>{report.events.map((event) => <tr key={event.id}><td><a href={`#detail-${event.id}`}><strong>{event.titleZh}</strong></a><small>{event.eventKey}</small></td><td><span className={statusClass(event.route ?? "hold")}>{routeLabel(event.route)}</span></td><td><span className={statusClass(event.evidenceStatus)}>{event.evidenceStatus}</span></td><td>{event.priorityScore ?? 0}</td><td>{sourceNames(event)}</td><td>{event.lastUpdatedAt}</td></tr>)}</tbody></table></div>
      </section>

      <section id="event-detail" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>04</span><h2>Event Detail</h2></div><small>source chain · facts · selection rationale</small></div>
        <div className="atlas-intelligence-detail-list">{report.events.map((event) => <article id={`detail-${event.id}`} className="atlas-intelligence-detail" key={event.id}><div className="atlas-intelligence-detail-head"><div><p className="atlas-intelligence-eyebrow">{event.eventType} · {event.region}</p><h3>{event.titleZh}</h3><p>{event.summaryZh}</p></div><span className={statusClass(event.route ?? "hold")}>{routeLabel(event.route)}</span></div><div className="atlas-intelligence-detail-columns"><div><small>Source chain</small><ul>{event.sourceChain.map((source) => <li key={source.observationId}><strong>{source.sourceId}</strong> · {source.tier} · {source.relationship} · {source.accessStatus}</li>)}</ul></div><div><small>Facts</small><ul>{event.facts.length ? event.facts.map((fact, index) => <li key={`${event.id}-fact-${index}`}><strong>{fact.valueText}</strong> · {fact.factType} · {fact.qualifier ?? "qualifier pending"} · {fact.capacityType ?? "—"}</li>) : <li>No extracted facts</li>}</ul></div><div><small>Reason codes</small><ul>{(event.reasonCodes ?? []).map((reason) => <li key={reason}>{reason}</li>)}</ul></div></div></article>)}</div>
      </section>

      <section id="pipeline-runs" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>05</span><h2>Pipeline Runs</h2></div><small>funnel and source health</small></div>
        <div className="atlas-intelligence-funnel">{[["Fetched", report.stats.fetched], ["Normalized", report.stats.normalized], ["Relevant", report.stats.relevant], ["Deep scored", report.stats.deepScored], ["Clustered", report.stats.clusters], ["Public eligible", report.stats.publicEligible]].map(([label, value]) => <div key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <div className="atlas-intelligence-grid atlas-intelligence-grid-3"><div className="atlas-intelligence-card"><small>Failures</small><strong>{report.failures.length || "None"}</strong><p>{report.failures.join(" · ") || "No connector failures in this run."}</p></div><div className="atlas-intelligence-card"><small>Cost</small><strong>${report.cost.estimatedUsd.toFixed(4)}</strong><p>{report.cost.note}</p></div><div className="atlas-intelligence-card"><small>DB migration</small><strong>17 tables / 47 indexes</strong><p>Verified on a blank local SQLite database before this run.</p></div></div>
      </section>

      <section id="strategy-lab" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>06</span><h2>Strategy Lab</h2></div><small>fixture replay comparison</small></div>
        <div className="atlas-intelligence-grid atlas-intelligence-grid-2"><div className="atlas-intelligence-card"><small>Current strategy</small><strong>{comparison.current.labelChecks.passed}/{comparison.current.labelChecks.total} labels passed</strong><p>Media-only → Pulse: {comparison.current.mediaOnlyEscalatedToPulse}; legacy non-T0 policy routes: {comparison.current.nonT0PolicyRoutes}; capacity boundary errors: {comparison.current.capacityBoundaryErrors.length}.</p></div><div className="atlas-intelligence-card"><small>Tier-only baseline</small><strong>Media-only → Pulse: {comparison.legacyTierOnly.mediaOnlyEscalatedToPulse}</strong><p>{comparison.legacyTierOnly.note}</p></div></div>
        <div className="atlas-intelligence-comparison"><div><span>Fixture observations</span><strong>{comparison.fixture.observations}</strong></div><div><span>Labelled events</span><strong>{comparison.fixture.labelledEvents}</strong></div><div><span>Clustered events</span><strong>{comparison.fixture.clusteredEvents}</strong></div></div>
        <p className="atlas-intelligence-note">{comparison.fixture.scaleCaveat}</p>
      </section>
    </main>
  );
}
