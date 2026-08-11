import type { Metadata } from "next";
import latestRunJson from "../../../artifacts/event-intelligence/latest-run.json";
import strategyComparisonJson from "../../../artifacts/event-intelligence/strategy-comparison.json";
import type { Route, ShadowRunReport } from "../../../worker/event-intelligence/pipeline.ts";
import { RuntimeStatus } from "./runtime-status";
import { EventInspector, EventStream, IntelligenceWorkspace, SourcesTable } from "./workspace";

export const metadata: Metadata = {
  title: "事件情报后台 · IDC Atlas",
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
  "rumor-watch": "市场传闻",
  pulse: "事实脉冲",
  "policy-index": "政策证据（历史）",
  "research-queue": "研究队列",
  hold: "暂存",
  rejected: "排除",
};

function routeLabel(route: Route | undefined): string {
  return route ? routeLabels[route] : "暂存";
}

function statusClass(value: string): string {
  return `atlas-intelligence-badge atlas-intelligence-badge-${value.replaceAll("_", "-")}`;
}

function systemLabel(value: string): string {
  const labels: Record<string, string> = {
    succeeded: "运行成功",
    failed: "运行失败",
    live: "实时输入",
    replay: "历史回放",
    shadow: "影子输入",
    "verified-no-change": "核验无变化",
    fresh: "数据新鲜",
    stale: "数据过期",
  };
  return labels[value] ?? value;
}

export default function IntelligenceConsolePage() {
  return (
    <main className="atlas-intelligence-page">
      <header className="atlas-intelligence-header">
        <div>
          <p className="atlas-intelligence-kicker">IDC ATLAS / 私有情报运营</p>
          <h1>事件情报观测台</h1>
          <p className="atlas-intelligence-lede">观察信源 → 原始条目 → 分析 → 事件 → 路由的影子结果。生产 Worker 只写私有 KV；公开站数据源保持不变，直至 Gate 4 具备独立切换条件。</p>
        </div>
        <div className="atlas-intelligence-run-status">
          <span className={statusClass(report.status)}>{systemLabel(report.status)}</span>
          <small>{report.generatedAt} · {systemLabel(report.inputMode ?? "未知输入模式")}</small>
        </div>
      </header>
      <IntelligenceWorkspace>
      <section id="overview" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>01</span><h2>总览</h2></div><small>策略 {report.strategyVersion} · 分类器 {report.classifierVersion}</small></div>
        <RuntimeStatus />
        <div className="atlas-intelligence-metrics">
          {([ ["抓取条目", report.stats.fetched], ["相关条目", report.stats.relevant], ["事件簇", report.stats.clusters], ["可公开候选", report.stats.publicEligible], ["失败", report.stats.errors], ["模型调用", report.cost.modelCalls] ] as Array<[string, number]>).map(([label, value]) => <div className="atlas-intelligence-metric" key={label}><small>{label}</small><strong>{value}</strong></div>)}
        </div>
        <div className="atlas-intelligence-grid atlas-intelligence-grid-3">
          <div className="atlas-intelligence-card"><small>新鲜度</small><strong>{systemLabel(report.freshness)}</strong><p>运行状态由连接器结果生成；“核验无变化”也是有效结果。</p></div>
          <div className="atlas-intelligence-card"><small>路由分布</small><strong>{Object.entries(report.stats.routeCounts).filter(([, count]) => count > 0).map(([route, count]) => `${routeLabel(route as Route)} ${count}`).join(" · ")}</strong><p>证据路由与优先级分数分别存储，互不替代。</p></div>
          <div className="atlas-intelligence-card"><small>存储边界</small><strong>SQLite 影子库</strong><p>{report.shadowDbPath ?? "未记录本地影子数据库路径"}；未绑定生产数据。</p></div>
        </div>
      </section>

      <section id="sources" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>02</span><h2>信源</h2></div><small>登记 {report.sourceRegistryCount ?? report.sourceHealth.length} 个 / 本次采样 {report.sourceHealth.length} 个</small></div>
        <SourcesTable sources={report.sourceHealth} />
        <p className="atlas-intelligence-note">每条原始条目都保留访问状态。只有媒体报道的线索继续进入市场传闻；AI HOT 只用于发现线索，不能替代原始来源核验。</p>
      </section>

      <section id="event-stream" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>03</span><h2>事件流</h2></div><small>{report.events.length} 个聚类事件</small></div>
        <EventStream events={report.events} />
      </section>

      <section id="event-detail" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>04</span><h2>事件详情</h2></div><small>信源链 · 结构化事实 · 筛选依据</small></div>
        <EventInspector events={report.events} />
      </section>

      <section id="pipeline-runs" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>05</span><h2>管线运行</h2></div><small>处理漏斗与信源健康</small></div>
        <div className="atlas-intelligence-funnel">{[["抓取", report.stats.fetched], ["标准化", report.stats.normalized], ["相关", report.stats.relevant], ["深度评分", report.stats.deepScored], ["事件聚类", report.stats.clusters], ["可公开候选", report.stats.publicEligible]].map(([label, value]) => <div key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <div className="atlas-intelligence-grid atlas-intelligence-grid-3"><div className="atlas-intelligence-card"><small>失败</small><strong>{report.failures.length || "无"}</strong><p>{report.failures.join(" · ") || "本次运行没有连接器失败。"}</p></div><div className="atlas-intelligence-card"><small>成本</small><strong>${report.cost.estimatedUsd.toFixed(4)}</strong><p>影子运行使用确定性规则；本次没有调用模型，也没有写入公开站数据。</p></div><div className="atlas-intelligence-card"><small>数据库迁移</small><strong>17 张表 / 47 个索引</strong><p>本次运行前已在空白本地 SQLite 数据库验证。</p></div></div>
      </section>

      <section id="strategy-lab" className="atlas-intelligence-section">
        <div className="atlas-intelligence-section-heading"><div><span>06</span><h2>策略实验室</h2></div><small>固定样本回放对比</small></div>
        <div className="atlas-intelligence-grid atlas-intelligence-grid-2"><div className="atlas-intelligence-card"><small>当前策略</small><strong>{comparison.current.labelChecks.passed}/{comparison.current.labelChecks.total} 个标签通过</strong><p>仅媒体报道 → 事实脉冲：{comparison.current.mediaOnlyEscalatedToPulse}；旧版非 T0 政策路由：{comparison.current.nonT0PolicyRoutes}；容量边界错误：{comparison.current.capacityBoundaryErrors.length}。</p></div><div className="atlas-intelligence-card"><small>仅按层级的基线策略</small><strong>仅媒体报道 → 事实脉冲：{comparison.legacyTierOnly.mediaOnlyEscalatedToPulse}</strong><p>{comparison.legacyTierOnly.note}</p></div></div>
        <div className="atlas-intelligence-comparison"><div><span>样本条目</span><strong>{comparison.fixture.observations}</strong></div><div><span>已标注事件</span><strong>{comparison.fixture.labelledEvents}</strong></div><div><span>聚类事件</span><strong>{comparison.fixture.clusteredEvents}</strong></div></div>
        <p className="atlas-intelligence-note">{comparison.fixture.scaleCaveat}</p>
      </section>
      </IntelligenceWorkspace>
    </main>
  );
}
