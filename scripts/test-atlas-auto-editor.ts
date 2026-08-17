import assert from "node:assert/strict";
import { buildAtlasEditorDecision } from "../worker/event-intelligence/atlas-auto-editor.ts";
import type { DailyEditorialCandidatePacket, DailyMaterialSelectionItem } from "../worker/event-intelligence/daily-model-selection.ts";

function item(overrides: Partial<DailyMaterialSelectionItem> = {}): DailyMaterialSelectionItem {
  return {
    eventId: "event-official-campus",
    titleZh: "NVIDIA 宣布建设 300MW AI 数据中心园区",
    titleEn: "NVIDIA announces a 300MW AI data-center campus",
    summaryZh: "公司公告披露 300MW 规划容量与建设状态。",
    summaryEn: "The company disclosure provides 300MW of planned capacity and its construction status.",
    route: "pulse",
    routeCandidates: ["pulse"],
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
    sourceChain: [{ sourceId: "nvidia", url: "https://nvidia.com/news/example", tier: "T1", relationship: "origin", accessStatus: "ok", publishedAt: "2026-08-17T01:00:00.000Z" }],
    firstSeenAt: "2026-08-17T01:00:00.000Z",
    lastUpdatedAt: "2026-08-17T01:00:00.000Z",
    sourceLastUpdatedAt: "2026-08-17T01:00:00.000Z",
    result: {
      schemaVersion: "atlas-model-score.v1",
      mode: "shadow",
      routeImpact: false,
      provider: "openai-compatible",
      model: "deepseek-v4-flash",
      scoredAt: "2026-08-17T01:01:00.000Z",
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

function packet(items: DailyMaterialSelectionItem[]): DailyEditorialCandidatePacket {
  return {
    schemaVersion: "atlas-daily-candidate-packet.v1",
    day: "2026-08-17",
    generatedAt: "2026-08-17T01:20:00.000Z",
    sourceSlots: ["event-night"],
    model: "deepseek-v4-flash",
    status: "completed",
    candidateCount: items.length,
    selectedCount: items.filter((candidate) => candidate.band === "selected").length,
    watchCount: items.filter((candidate) => candidate.band === "watch").length,
    publicationReadyCount: items.filter((candidate) => candidate.publicationReadiness === "eligible-by-rules").length,
    selected: items.filter((candidate) => candidate.band === "selected"),
    watch: items.filter((candidate) => candidate.band === "watch"),
    errors: [],
  };
}

const formal = item();
const rumor = item({
  eventId: "event-reported-campus",
  titleZh: "Amazon 据报道计划建设 18 栋数据中心",
  titleEn: "Amazon reportedly plans an 18-building data-center campus",
  summaryZh: "媒体报道称该项目规划 18 栋建筑，尚无公司确认。",
  summaryEn: "The report describes 18 planned buildings; the company has not confirmed the project.",
  route: "rumor-watch",
  routeCandidates: ["rumor-watch"],
  band: "watch",
  publicationReadiness: "needs-source-verification",
  evidenceStatus: "reported",
  sourceTiers: ["T3"],
  facts: [],
  sourceChain: [{ sourceId: "dcd", url: "https://www.datacenterdynamics.com/example", tier: "T3", relationship: "origin", accessStatus: "public", publishedAt: "2026-08-17T01:00:00.000Z" }],
  entities: ["Amazon"],
  coreCompanies: ["Amazon"],
  result: {
    ...formal.result,
    publicCopy: {
      titleZh: "Amazon 据报道计划建设 18 栋数据中心",
      titleEn: "Amazon reportedly plans an 18-building data-center campus",
      summaryZh: "媒体报道称该项目规划 18 栋建筑，尚无公司确认。",
      summaryEn: "The report describes 18 planned buildings; the company has not confirmed the project.",
    },
  },
});
const fallback = item({
  eventId: "event-fallback-primary",
  result: { ...formal.result, provider: "deterministic-fallback" },
});
const inaccessiblePrimary = item({
  eventId: "event-inaccessible-primary",
  sourceTiers: ["T1", "T3"],
  sourceChain: [
    { sourceId: "issuer", url: "https://issuer.example/news", tier: "T1", relationship: "origin", accessStatus: "blocked", publishedAt: "2026-08-17T01:00:00.000Z" },
    { sourceId: "media", url: "https://media.example/report", tier: "T3", relationship: "coverage", accessStatus: "ok", publishedAt: "2026-08-17T01:10:00.000Z" },
  ],
});

const decision = buildAtlasEditorDecision(packet([formal, rumor, fallback, inaccessiblePrimary]), Date.parse("2026-08-17T01:30:00.000Z"));
assert.equal(decision.decisions.find((entry) => entry.eventId === formal.eventId)?.route, "formal-section");
assert.equal(decision.decisions.find((entry) => entry.eventId === rumor.eventId)?.route, "rumor-watch");
assert.equal(decision.decisions.find((entry) => entry.eventId === fallback.eventId)?.action, "publish", "fallback scoring must not discard valid primary evidence");
assert.equal(decision.decisions.find((entry) => entry.eventId === inaccessiblePrimary.eventId)?.action, "hold", "accessible media must not stand in for an inaccessible primary source");
assert.ok(decision.decisions.every((entry) => entry.reasonCodes.length > 0));
assert.ok(decision.decisions.filter((entry) => entry.action === "publish").every((entry) => entry.publicClaims.every((claim) => claim.sourceRefs.every((url) => entry.canonicalUrls.includes(url)))));

if (process.argv.includes("--packet")) {
  process.stdout.write(JSON.stringify(decision));
} else {
  console.log(JSON.stringify({ message: "Atlas Auto Editor tests passed", summary: decision.summary }));
}
