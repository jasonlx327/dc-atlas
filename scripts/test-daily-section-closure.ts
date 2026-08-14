import assert from "node:assert/strict";
import { buildDailySectionClosure } from "../worker/event-intelligence/daily-section-closure.ts";
import type { DailyEditorialCandidatePacket, DailyMaterialSelectionItem } from "../worker/event-intelligence/daily-model-selection.ts";

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
    sourceChain: [{ sourceId: "nvidia", url: "https://nvidia.com/news/example", relationship: "origin", accessStatus: "ok", publishedAt: "2026-08-13T01:00:00.000Z" }],
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
  publicationReadyCount: 1,
  selected: [item()],
  watch: [],
  errors: [],
};

const report = buildDailySectionClosure(packet, Date.parse("2026-08-12T22:30:00.000Z"));
assert.equal(report.day, "2026-08-13");
assert.equal(report.scheduledForBeijing, "06:30");
assert.equal(report.sections.length, 13);
assert.equal(report.sections.find((section) => section.section === "idc-pulse")?.status, "updated");
assert.equal(report.sections.find((section) => section.section === "columns")?.status, "blocked");
assert.equal(report.sections.find((section) => section.section === "cooling")?.status, "verified-no-change");
assert.equal(report.retryRequired, true);

const mediaOnlyRumor: DailyEditorialCandidatePacket = {
  ...packet,
  selectedCount: 0,
  watchCount: 1,
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
    sourceChain: [{ sourceId: "data-center-dynamics", url: "https://www.datacenterdynamics.com/example", relationship: "origin", accessStatus: "public", publishedAt: "2026-08-13T16:02:51.000Z" }],
  })],
};
const rumorReport = buildDailySectionClosure(mediaOnlyRumor, Date.parse("2026-08-12T22:30:00.000Z"));
assert.equal(rumorReport.status, "completed");
assert.equal(rumorReport.sections.find((section) => section.section === "rumors")?.status, "updated");
assert.equal(rumorReport.sections.find((section) => section.section === "listed-companies")?.status, "verified-no-change");
assert.equal(rumorReport.sections.find((section) => section.section === "capacity")?.status, "verified-no-change");
assert.equal(rumorReport.retryRequired, false);

const stale = buildDailySectionClosure({ ...packet, day: "2026-08-12" }, Date.parse("2026-08-12T22:30:00.000Z"));
assert.equal(stale.status, "blocked");
assert.equal(stale.counts.blocked, 13);

console.log(JSON.stringify({ message: "Daily section closure tests passed", sections: report.sections.length, counts: report.counts }));
