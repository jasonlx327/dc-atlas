import assert from "node:assert/strict";
import { buildDailySectionClosure } from "../worker/event-intelligence/daily-section-closure.ts";
import { buildAtlasEditorDecision } from "../worker/event-intelligence/atlas-auto-editor.ts";
import type { DailyEditorialCandidatePacket, DailyMaterialSelectionItem } from "../worker/event-intelligence/daily-model-selection.ts";
import { shadowSources } from "../worker/connectors/index.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

function item(overrides: Partial<DailyMaterialSelectionItem> = {}): DailyMaterialSelectionItem {
  return {
    eventId: "event-official-campus",
    titleZh: "NVIDIA 宣布建设 300MW AI 数据中心园区",
    titleEn: "NVIDIA announces a 300MW AI data-center campus",
    summaryZh: "公司公告披露首期容量与建设状态。",
    summaryEn: "The company disclosure provides initial capacity and construction status.",
    route: "pulse",
    routeCandidates: ["pulse", "research-queue"],
    priorityScore: 88,
    band: "selected",
    publicationReadiness: "eligible-by-rules",
    evidenceStatus: "officially_confirmed",
    sourceTiers: ["T1"],
    independentSourceCount: 1,
    coreCompanies: ["NVIDIA"],
    entities: ["NVIDIA"],
    region: "美国",
    facts: [{ factType: "capacity", valueText: "300MW", qualifier: "planned", capacityType: "total_power", confidenceState: "source-stated", sourceObservationId: "obs-1" }],
    sourceChain: [{ observationId: "obs-nvidia", sourceId: "nvidia", tier: "T1", independenceGroup: "nvidia", relationship: "origin", noveltyClass: "new-event", newFactCount: 1, title: "NVIDIA announces a campus", url: "https://nvidia.com/news/example", accessStatus: "public", publishedAt: "2026-08-13T01:00:00.000Z" }],
    firstSeenAt: "2026-08-13T01:00:00.000Z",
    lastUpdatedAt: "2026-08-13T01:00:00.000Z",
    sourceLastUpdatedAt: "2026-08-13T01:00:00.000Z",
    result: {
      schemaVersion: "atlas-model-score.v1",
      mode: "shadow",
      routeImpact: false,
      provider: "openai-compatible",
      model: "deepseek-v4-flash",
      scoredAt: "2026-08-13T01:01:00.000Z",
      scores: { topicRelevanceScore: 5, mechanismDepthScore: 4, specificityScore: 5, researchValueScore: 4, readerValueScore: 4 },
      semanticScore: 4.5,
      rationale: "Material primary disclosure.",
      reasonCodes: ["primary-source"],
      publicCopy: {
        titleZh: "NVIDIA 宣布建设 300MW AI 数据中心园区",
        titleEn: "NVIDIA announces a 300MW AI data-center campus",
        summaryZh: "公司公告披露 300MW 规划容量与建设状态。",
        summaryEn: "The company disclosure provides 300MW of planned capacity and its construction status.",
      },
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 },
    },
    ...overrides,
  };
}

const packet: DailyEditorialCandidatePacket = {
  schemaVersion: "atlas-daily-candidate-packet.v1",
  day: "2026-08-13",
  generatedAt: "2026-08-13T21:30:00.000Z",
  sourceSlots: ["event-night"],
  model: "deepseek-v4-flash",
  status: "completed",
  candidateCount: 1,
  selectedCount: 1,
  watchCount: 0,
  ruleEligibleCount: 1,
  publicationReadyCount: 1,
  selected: [item()],
  watch: [],
  errors: [],
};

function sourceReport(generatedAt: string): ShadowRunReport {
  const sources = shadowSources();
  return {
    schemaVersion: "atlas-event-shadow.v1",
    generatedAt,
    strategyVersion: "test",
    classifierVersion: "test",
    status: "succeeded",
    freshness: "live",
    stats: { fetched: 1, normalized: 1, duplicates: 0, relevant: 1, uncertain: 0, deepScored: 1, clusters: 1, publicEligible: 1, rejected: 0, held: 0, errors: 0, routeCounts: { "rumor-watch": 0, pulse: 1, "policy-index": 0, "research-queue": 0, hold: 0, rejected: 0 } },
    sourceHealth: sources.map((source) => ({ sourceId: source.id, endpointId: source.endpoint.id, tier: source.tier, independenceGroup: source.independenceGroup, status: "ok", observations: 0 })),
    observationAnalysis: [],
    events: [],
    failures: [],
    cost: { modelCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, note: "test" },
  };
}

const scheduledTime = Date.parse("2026-08-12T22:30:00.000Z");
const sources = sourceReport("2026-08-12T21:30:00.000Z");
const editor = buildAtlasEditorDecision(packet, scheduledTime);
const report = buildDailySectionClosure(packet, scheduledTime, sources, editor);
assert.equal(report.day, "2026-08-13");
assert.equal(report.scheduledForBeijing, "06:30");
assert.equal(report.sections.length, 13);
assert.equal(report.sections.find((section) => section.section === "capacity")?.status, "updated");
assert.equal(report.sections.find((section) => section.section === "columns")?.status, "verified-no-change");
assert.equal(report.sections.find((section) => section.section === "cooling")?.status, "verified-no-change");
assert.equal(report.retryRequired, false);

const mediaOnlyRumor: DailyEditorialCandidatePacket = {
  ...packet,
  selectedCount: 0,
  watchCount: 1,
  ruleEligibleCount: 0,
  publicationReadyCount: 0,
  selected: [],
  watch: [item({
    eventId: "event-amazon-media-campus",
    titleZh: "Amazon 据报道计划在俄亥俄建设 18 栋数据中心园区",
    titleEn: "Amazon reportedly plans an 18-building data-center campus in Ohio",
    summaryZh: "单一媒体报道披露园区位置与规划面积，尚无公司或许可确认。",
    summaryEn: "A single media report gives a location and planned footprint; no company or permit confirmation is available.",
    route: "rumor-watch",
    routeCandidates: ["rumor-watch"],
    band: "watch",
    publicationReadiness: "needs-source-verification",
    evidenceStatus: "reported",
    sourceTiers: ["T3"],
    coreCompanies: ["Amazon"],
    entities: ["Amazon"],
    region: "美国",
    facts: [],
    sourceChain: [{ observationId: "obs-dcd", sourceId: "data-center-dynamics", tier: "T3", independenceGroup: "dcd", relationship: "origin", noveltyClass: "new-event", newFactCount: 0, title: "Amazon reportedly plans a campus", url: "https://www.datacenterdynamics.com/example", accessStatus: "public", publishedAt: "2026-08-13T16:02:51.000Z" }],
    result: {
      ...item().result,
      publicCopy: {
        titleZh: "Amazon 据报道计划在俄亥俄建设 18 栋数据中心园区",
        titleEn: "Amazon reportedly plans an 18-building data-center campus in Ohio",
        summaryZh: "媒体报道称该项目规划 18 栋建筑，尚无公司或许可确认。",
        summaryEn: "The report describes 18 planned buildings; no company or permit confirmation is available.",
      },
    },
  })],
};
const rumorEditor = buildAtlasEditorDecision(mediaOnlyRumor, scheduledTime);
const rumorReport = buildDailySectionClosure(mediaOnlyRumor, scheduledTime, sources, rumorEditor);
assert.equal(rumorReport.status, "completed");
assert.equal(rumorReport.sections.find((section) => section.section === "rumors")?.status, "updated");
assert.equal(rumorReport.sections.find((section) => section.section === "listed-companies")?.status, "verified-no-change");
assert.equal(rumorReport.sections.find((section) => section.section === "capacity")?.status, "verified-no-change");
assert.equal(rumorReport.retryRequired, false);

const stale = buildDailySectionClosure({ ...packet, day: "2026-08-12" }, scheduledTime, sources, editor);
assert.equal(stale.status, "blocked");
assert.equal(stale.counts.blocked, 13);

const incompleteSources: ShadowRunReport = {
  ...sources,
  sourceHealth: sources.sourceHealth.filter((source) => source.sourceId !== "google-news-data-center"),
};
const incompleteCoverage = buildDailySectionClosure(packet, scheduledTime, incompleteSources, editor);
assert.equal(incompleteCoverage.sections.find((section) => section.section === "capacity")?.status, "updated", "a verified publishable item must not be blocked by unrelated source gaps");
assert.equal(incompleteCoverage.sections.find((section) => section.section === "cooling")?.status, "verified-no-change");

const ordinaryHoldPacket: DailyEditorialCandidatePacket = {
  ...packet,
  selectedCount: 0,
  watchCount: 1,
  ruleEligibleCount: 0,
  publicationReadyCount: 0,
  selected: [],
  watch: [item({
    eventId: "event-watch-only",
    route: "pulse",
    routeCandidates: ["pulse"],
    band: "watch",
    publicationReadiness: "needs-source-verification",
    evidenceStatus: "reported",
    sourceTiers: ["T3"],
    facts: [],
    result: { ...item().result, publicCopy: undefined },
  })],
};
const ordinaryHoldEditor = buildAtlasEditorDecision(ordinaryHoldPacket, scheduledTime);
const ordinaryHoldClosure = buildDailySectionClosure(ordinaryHoldPacket, scheduledTime, sources, ordinaryHoldEditor);
assert.equal(ordinaryHoldEditor.summary.blockingHold, 0);
assert.equal(ordinaryHoldClosure.sections.find((section) => section.section === "capacity")?.status, "verified-no-change");
assert.equal(ordinaryHoldClosure.retryRequired, false);

console.log(JSON.stringify({ message: "Daily section closure tests passed", sections: report.sections.length, counts: report.counts }));
