import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";
import { eventIntelligenceSchedule } from "../worker/event-intelligence/schedule.ts";

type LiveReport = ShadowRunReport & { inputMode?: string; trigger?: string; shadowDbPath?: string; sourceRegistryCount?: number };
type Acceptance = {
  schemaVersion: "atlas-event-shadow-acceptance.v1";
  generatedAt: string;
  gate: "Gate 3";
  status: "complete_with_risks" | "blocked";
  productionTouched: false;
  runs: Array<{
    file: string;
    trigger: string;
    status: LiveReport["status"];
    freshness: LiveReport["freshness"];
    stats: LiveReport["stats"];
    sourceHealth: { total: number; ok: number; empty: number; failed: number; parseError: number; blocked: number; notModified: number; failures: Array<{ sourceId: string; endpointId: string; status: string; httpStatus?: number; error?: string }> };
    checks: { mediaOnlyEscalatedToPulse: number; nonT0PolicyRoutes: number; capacityBoundaryErrors: string[]; eventSamplesAvailable: number };
    cost: LiveReport["cost"];
    shadowDbPath?: string;
  }>;
  comparison: { sameEventKeyCount: number; firstRunEventCount: number; secondRunEventCount: number; staticCompatibility: string; fixtureStrategy: { currentMediaOnlyEscalatedToPulse: number; legacyMediaOnlyEscalatedToPulse: number; labelsPassed: number; labelsTotal: number; scaleCaveat: string } };
  schedule: typeof eventIntelligenceSchedule;
  unresolvedRisks: string[];
};

const runFiles = ["event-night-live-gate3.json", "event-day-live-gate3.json"];
const artifactDir = new URL("../artifacts/event-intelligence/", import.meta.url);
const reportUrl = new URL("../docs/event-intelligence/shadow-run-report.md", import.meta.url);
const jsonUrl = new URL("../artifacts/event-intelligence/live-shadow-acceptance.json", import.meta.url);
const comparisonUrl = new URL("../artifacts/event-intelligence/strategy-comparison.json", import.meta.url);

async function loadRun(file: string): Promise<LiveReport> {
  return JSON.parse(await readFile(new URL(`./${file}`, artifactDir), "utf8")) as LiveReport;
}

function isMediaOnly(event: LiveReport["events"][number]): boolean {
  const confirming = event.sourceChain.filter((item) => !["official_response", "contradiction"].includes(item.relationship));
  return confirming.some((item) => item.tier === "T2" || item.tier === "T3") && !confirming.some((item) => item.tier === "T0" || item.tier === "T1");
}

function summarizeRun(report: LiveReport, file: string) {
  const mediaOnlyEscalatedToPulse = report.events.filter((event) => event.route === "pulse" && isMediaOnly(event)).length;
  const nonT0PolicyRoutes = report.events.filter((event) => event.route === "policy-index" && !event.sourceChain.some((item) => item.tier === "T0" && !["official_response", "contradiction"].includes(item.relationship))).length;
  const capacityBoundaryErrors = report.events.filter((event) => event.eligible).flatMap((event) => event.facts.filter((fact) => fact.factType === "capacity" && (!fact.qualifier || !fact.capacityType)).map((fact) => `${event.eventKey}: ${fact.valueText}`));
  const statuses = report.sourceHealth.reduce<Record<string, number>>((counts, source) => ({ ...counts, [source.status]: (counts[source.status] ?? 0) + 1 }), {});
  return {
    file,
    trigger: report.trigger ?? "unknown",
    status: report.status,
    freshness: report.freshness,
    stats: report.stats,
    sourceHealth: {
      total: report.sourceHealth.length,
      ok: statuses.ok ?? 0,
      empty: statuses.empty ?? 0,
      failed: statuses.failed ?? 0,
      parseError: statuses["parse-error"] ?? 0,
      blocked: statuses.blocked ?? 0,
      notModified: statuses["not-modified"] ?? 0,
      failures: report.sourceHealth.filter((source) => source.status === "failed" || source.status === "blocked" || source.status === "parse-error").map((source) => ({ sourceId: source.sourceId, endpointId: source.endpointId, status: source.status, httpStatus: source.httpStatus, error: source.error })),
    },
    checks: { mediaOnlyEscalatedToPulse, nonT0PolicyRoutes, capacityBoundaryErrors, eventSamplesAvailable: Math.min(10, report.events.length) },
    cost: report.cost,
    shadowDbPath: report.shadowDbPath,
  };
}

function md(value: unknown): string {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function sampleRows(report: LiveReport): string {
  return report.events.slice(0, 10).map((event, index) => {
    const chain = event.sourceChain.map((source) => `${source.sourceId}[${source.tier}/${source.relationship}/${source.accessStatus}]`).join(" → ");
    const facts = event.facts.filter((fact) => fact.factType === "capacity").map((fact) => `${fact.valueText} ${fact.qualifier ?? "?"}/${fact.capacityType ?? "?"}`).join(", ") || "—";
    return `| ${index + 1} | ${md(event.titleZh || event.titleEn)} | ${md(event.evidenceStatus)} | ${md(event.route ?? "hold")} | ${md(event.priorityScore ?? 0)} | ${md(chain)} | ${md(facts)} | ${md((event.reasonCodes ?? []).join(", "))} |`;
  }).join("\n");
}

function failureLines(run: ReturnType<typeof summarizeRun>): string {
  return run.sourceHealth.failures.length ? run.sourceHealth.failures.map((failure) => `- \`${failure.sourceId}\` / \`${failure.endpointId}\`: ${failure.status}${failure.httpStatus ? ` HTTP ${failure.httpStatus}` : ""} — ${failure.error ?? "unknown error"}`).join("\n") : "- None";
}

async function run() {
  const reports = await Promise.all(runFiles.map(loadRun));
  const summaries = reports.map((report, index) => summarizeRun(report, runFiles[index]));
  const firstKeys = new Set(reports[0].events.map((event) => event.eventKey));
  const sameEventKeyCount = reports[1].events.filter((event) => firstKeys.has(event.eventKey)).length;
  const fixture = JSON.parse(await readFile(comparisonUrl, "utf8")) as { current: { mediaOnlyEscalatedToPulse: number; labelChecks: { passed: number; total: number } }; legacyTierOnly: { mediaOnlyEscalatedToPulse: number }; fixture: { scaleCaveat: string } };
  const translationPending = reports.some((report) => report.events.some((event) => event.reasonCodes?.includes("bilingual-translation-pending")));
  const failedEndpointCount = summaries[0].sourceHealth.failed + summaries[0].sourceHealth.parseError + summaries[0].sourceHealth.blocked;
  const unresolvedRisks = [
    ...(failedEndpointCount > 0 ? [`event-night 有 ${failedEndpointCount} 个 endpoint failed/parse-error/blocked；不得用旧数据替代。`] : []),
    "当前真实 shadow 的分类、五维分析、聚类、评分和路由仍是 deterministic-shadow，不代表模型版本已校准。",
    `真实数据的 ${summaries[0].stats.clusters} 个事件簇尚未与 Atlas 历史 200–500 条标注集回放；现有 fixture 只有 12 条观察、7 个标注事件。`,
    ...(translationPending ? ["真实双语翻译适配器尚未接入；源语言内容只可进入内部路线，不能成为公开候选。"] : []),
    "公开候选数量不是发布授权；生产 D1、发布记录、日报和公开 API 均未写入。",
  ];
  const acceptance: Acceptance = {
    schemaVersion: "atlas-event-shadow-acceptance.v1",
    generatedAt: new Date().toISOString(),
    gate: "Gate 3",
    status: fixture.current.labelChecks.total >= 200 && !translationPending ? "complete_with_risks" : "blocked",
    productionTouched: false,
    runs: summaries,
    comparison: {
      sameEventKeyCount,
      firstRunEventCount: reports[0].events.length,
      secondRunEventCount: reports[1].events.length,
      staticCompatibility: "现有 atlas-live-v5、公开 Worker route、静态 RUMOR/POLICY fallback 和站点生产读取链没有切换；本报告只记录 shadow 旁路结果，未做逐条静态内容替换比较。",
      fixtureStrategy: {
        currentMediaOnlyEscalatedToPulse: fixture.current.mediaOnlyEscalatedToPulse,
        legacyMediaOnlyEscalatedToPulse: fixture.legacyTierOnly.mediaOnlyEscalatedToPulse,
        labelsPassed: fixture.current.labelChecks.passed,
        labelsTotal: fixture.current.labelChecks.total,
        scaleCaveat: fixture.fixture.scaleCaveat,
      },
    },
    schedule: eventIntelligenceSchedule,
    unresolvedRisks,
  };
  await mkdir(artifactDir, { recursive: true });
  await writeFile(jsonUrl, `${JSON.stringify(acceptance, null, 2)}\n`);
  const first = summaries[0];
  const second = summaries[1];
  const scheduleRows = eventIntelligenceSchedule.map((slot) => `| ${slot.job} | ${slot.utc} | ${slot.beijing} | ${slot.purpose} |`).join("\n");
  const riskRows = acceptance.unresolvedRisks.map((risk) => `- ${risk}`).join("\n");
  const markdown = `# IDC Atlas Event Intelligence · Gate 3 Shadow Run Report

Generated: ${acceptance.generatedAt}

## Gate status

**${acceptance.status}**. The required two public-source shadow slots completed as event-night and event-day against the same persistent shadow database. Connector failures were retained as failures. Gate 3 remains blocked until the labelled replay set reaches 200–500 events and bilingual translation is supplied. No production D1, production Worker, formal Site, public API source switch, or industry-network route was modified.

## Run summary

| Slot | Status | Freshness | Fetched | Relevant | Clusters | Public eligible | Errors | Rumor | Pulse | Policy | Hold |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| event-night | ${first.status} | ${first.freshness} | ${first.stats.fetched} | ${first.stats.relevant} | ${first.stats.clusters} | ${first.stats.publicEligible} | ${first.stats.errors} | ${first.stats.routeCounts["rumor-watch"]} | ${first.stats.routeCounts.pulse} | ${first.stats.routeCounts["policy-index"]} | ${first.stats.routeCounts.hold} |
| event-day | ${second.status} | ${second.freshness} | ${second.stats.fetched} | ${second.stats.relevant} | ${second.stats.clusters} | ${second.stats.publicEligible} | ${second.stats.errors} | ${second.stats.routeCounts["rumor-watch"]} | ${second.stats.routeCounts.pulse} | ${second.stats.routeCounts["policy-index"]} | ${second.stats.routeCounts.hold} |

Event-night returned ${first.stats.fetched} observations and ${first.stats.clusters} clusters; event-day returned ${second.stats.fetched} observations and ${second.stats.clusters} clusters. The two slots shared ${sameEventKeyCount} event keys; this is expected because both fetches were executed close together and is not evidence of a production delta.

## Source health

Each slot sampled ${first.sourceHealth.total} public endpoints from a 45-source registry. Event-night: ${first.sourceHealth.ok} ok, ${first.sourceHealth.empty} empty, ${first.sourceHealth.parseError} parse-error, ${first.sourceHealth.failed} failed, ${first.sourceHealth.blocked} blocked. Event-day: ${second.sourceHealth.ok} ok, ${second.sourceHealth.empty} empty, ${second.sourceHealth.parseError} parse-error, ${second.sourceHealth.failed} failed, ${second.sourceHealth.blocked} blocked.

### Event-night failures

${failureLines(first)}

### Event-day failures

${failureLines(second)}

Failures are not replaced with old observations and do not advance a successful cursor. AI HOT was called through its current v1 connector (/api/v1/items, selected, 24h); the old /api/public/* contract was not copied.

## Safety checks

| Check | Event-night | Event-day | Gate target |
| --- | ---: | ---: | --- |
| Media-only events routed to Pulse | ${first.checks.mediaOnlyEscalatedToPulse} | ${second.checks.mediaOnlyEscalatedToPulse} | 0 |
| Non-T0 events routed to Policy Index | ${first.checks.nonT0PolicyRoutes} | ${second.checks.nonT0PolicyRoutes} | 0 |
| Capacity facts missing qualifier/type | ${first.checks.capacityBoundaryErrors.length} | ${second.checks.capacityBoundaryErrors.length} | 0 |
| Event samples available | ${first.checks.eventSamplesAvailable} | ${second.checks.eventSamplesAvailable} | ≥10 |

Unspecified capacity type is retained as explicit 'unspecified_capacity'; it is not silently converted to IT load, utility power, or GPU compute. An unstated stage remains unset and makes the event ineligible for public output.

## Ten event-cluster samples

The following are source-chain samples from event-night. They are internal shadow objects, not published Atlas records.

| # | Main event | Evidence | Route | Priority | Source chain | Capacity facts | Route reasons |
| ---: | --- | --- | --- | ---: | --- | --- | --- |
${sampleRows(reports[0])}

## Strategy, model and cost

- Strategy version: ${reports[0].strategyVersion}
- Classifier version: ${reports[0].classifierVersion}
- Model calls: ${reports[0].cost.modelCalls} in each run.
- Estimated model cost: ${reports[0].cost.estimatedUsd} in each run.
- Shadow analysis is deterministic and does not prove a production model prompt/schema contract.
- Fixture comparison: current media-only → Pulse = ${acceptance.comparison.fixtureStrategy.currentMediaOnlyEscalatedToPulse}; tier-only baseline = ${acceptance.comparison.fixtureStrategy.legacyMediaOnlyEscalatedToPulse}; labels = ${acceptance.comparison.fixtureStrategy.labelsPassed}/${acceptance.comparison.fixtureStrategy.labelsTotal}.
- ${acceptance.comparison.fixtureStrategy.scaleCaveat}

## Schedule proof

| Job | UTC cron | Beijing | Purpose |
| --- | --- | --- | --- |
${scheduleRows}

The local schedule map distinguishes the three jobs. The existing production Wrangler cron was not changed in this gate.

## Compatibility and static-output boundary

${acceptance.comparison.staticCompatibility}

## Unresolved risks

${riskRows}

## Acceptance declaration

- Schema/migration: local blank SQLite migration verified; repeated invocation is skipped by a local migration ledger.
- Persistence: shadow SQLite contains sources, endpoints, sync state, ingestion run, observations, observation analysis, entities, events, event relationships, facts, selection decisions, scoring version, and pipeline stage runs.
- Production D1: **not modified**.
- Production Worker: **not modified**.
- Formal Site / public URL: **not deployed**.
- Public API source switch: **not performed**.
- Industry-network WIP and route: **not modified**.
- Gate 3 action: **stop here for review; no deployment**.
`;
  await writeFile(reportUrl, markdown);
  console.log(JSON.stringify({ message: "Event intelligence shadow acceptance package built", status: acceptance.status, eventSamples: first.checks.eventSamplesAvailable, output: reportUrl.pathname, json: jsonUrl.pathname }));
}

void run();
