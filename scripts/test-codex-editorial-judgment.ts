import assert from "node:assert/strict";
import { shadowSources } from "../worker/connectors/index.ts";
import { buildCodexEditorialPackets, requiresEditorialPublicCopy } from "../worker/event-intelligence/codex-editorial-judgment.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

const sources = shadowSources();
const primary = sources.find((source) => source.tier === "T0" || source.tier === "T1");
assert.ok(primary, "test source registry must contain a primary source");

const report = {
  schemaVersion: "atlas-event-shadow.v1",
  generatedAt: "2026-08-18T01:00:00.000Z",
  strategyVersion: "test",
  classifierVersion: "test",
  status: "succeeded",
  freshness: "live",
  stats: {
    fetched: 1,
    normalized: 1,
    duplicates: 0,
    relevant: 1,
    uncertain: 0,
    deepScored: 1,
    clusters: 1,
    publicEligible: 1,
    rejected: 0,
    held: 0,
    errors: 0,
    routeCounts: { "rumor-watch": 0, pulse: 1, "policy-index": 0, "research-queue": 0, hold: 0, rejected: 0 },
  },
  sourceHealth: sources.map((source) => ({
    sourceId: source.id,
    endpointId: source.endpoint.id,
    tier: source.tier,
    independenceGroup: source.independenceGroup,
    status: "empty",
    observations: source.id === primary.id ? 1 : 0,
  })),
  observationAnalysis: [],
  events: [{
    id: "evt-codex-luna-1",
    eventKey: "codex-luna-test",
    eventType: "capacity",
    titleZh: "NVIDIA 公告新的数据中心容量安排",
    titleEn: "NVIDIA announces a new data center capacity arrangement",
    summaryZh: "NVIDIA 公告一项新的数据中心容量安排，具体交付仍取决于后续建设。",
    summaryEn: "NVIDIA announced a new data center capacity arrangement, with delivery still subject to construction.",
    firstSeenAt: "2026-08-18T00:30:00.000Z",
    lastUpdatedAt: "2026-08-18T01:00:00.000Z",
    eventTime: "2026-08-18T00:30:00.000Z",
    region: "美国",
    evidenceStatus: "officially_confirmed",
    relationships: [],
    entities: ["NVIDIA"],
    locations: ["United States"],
    sourceTiers: [primary.tier],
    independenceGroups: [primary.independenceGroup],
    independentSourceCount: 1,
    mainObservationId: "obs-1",
    facts: [{ factType: "capacity", valueText: "100MW", confidenceState: "source-stated", sourceObservationId: "obs-1", capacityType: "it_capacity" }],
    priorityScore: 60,
    reasonCodes: ["official-source"],
    route: "pulse",
    routeCandidates: ["pulse"],
    eligible: true,
    scoring: {
      topicRelevanceScore: 5,
      mechanismDepthScore: 4,
      specificityScore: 5,
      researchValueScore: 4,
      readerValueScore: 5,
      analysisReason: "test",
    },
    sourceChain: [{
      observationId: "obs-1",
      sourceId: primary.id,
      tier: primary.tier,
      independenceGroup: primary.independenceGroup,
      relationship: "origin",
      noveltyClass: "new-event",
      newFactCount: 1,
      title: "NVIDIA announcement",
      url: "https://example.com/nvidia-announcement",
      publishedAt: "2026-08-18T00:30:00.000Z",
      accessStatus: "accessible",
    }],
  }],
  failures: [],
  cost: { modelCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, note: "test" },
} as unknown as ShadowRunReport;

const verdict = {
  schemaVersion: "atlas-codex-editorial-judgment.v1",
  day: "2026-08-18",
  generatedAt: "2026-08-18T02:00:00.000Z",
  sourceGeneratedAt: report.generatedAt,
  model: "gpt-5.6-luna",
  status: "completed",
  verdicts: [{
    eventId: "evt-codex-luna-1",
    band: "selected",
    scores: {
      topicRelevanceScore: 5,
      mechanismDepthScore: 4,
      specificityScore: 5,
      researchValueScore: 4,
      readerValueScore: 5,
    },
    rationale: "一手公告、事实具体且与 AI 基础设施直接相关。",
    reasonCodes: ["primary-source", "material-ai-infrastructure"],
    publicCopy: {
      titleZh: "NVIDIA 公告新的数据中心容量安排",
      titleEn: "NVIDIA announces a new data center capacity arrangement",
      summaryZh: "NVIDIA 公告一项新的数据中心容量安排，具体交付仍取决于后续建设。",
      summaryEn: "NVIDIA announced a new data center capacity arrangement, with delivery still subject to construction.",
    },
  }],
  errors: [],
};

const packets = buildCodexEditorialPackets(report, verdict);
for (const action of ["hold", "watch", "reject"] as const) {
  const held = buildCodexEditorialPackets(report, {
    ...verdict,
    verdicts: [{ ...verdict.verdicts[0], publicCopy: undefined,
      editorialDisposition: { action, reason: "Original-source review pending or event outside publication scope." } }],
  });
  assert.equal(held.editor.decisions[0].action, action);
  assert.equal(held.editor.decisions[0].publicCopy, null);
  assert.equal(held.editor.summary.adapterReady, 0);
  assert.equal(held.editor.decisions[0].canonicalUrls.length > 0, true);
}
assert.throws(() => buildCodexEditorialPackets(report, {
  ...verdict, verdicts: [{ ...verdict.verdicts[0], editorialDisposition: { action: "publish", reason: "bypass" } }],
}), /invalid non-public/);
assert.equal(packets.selection.model, "gpt-5.6-luna");
assert.equal(packets.selection.fallbackCount, 0);
assert.equal(packets.candidates.selectedCount, 1);
assert.equal(packets.editor.summary.publishFormal, 1);
assert.equal(packets.editor.decisions[0]?.fallbackScored, false);
assert.equal(packets.closure.sections.length, 13);

for (const model of ["gpt-5.6-terra", "gpt-6-astra"]) {
  const result = buildCodexEditorialPackets(report, { ...verdict, model });
  assert.equal(result.selection.model, model);
  assert.equal(result.selection.fallbackCount, 0);
  assert.throws(() => buildCodexEditorialPackets(report, {
    ...verdict, model, verdicts: [{ ...verdict.verdicts[0], publicCopy: undefined }],
  }), /未完成.*missing-publicCopy/);
}
assert.throws(() => buildCodexEditorialPackets(report, { ...verdict, model: "deepseek-v4-flash" }), /model 无效/);
assert.throws(() => buildCodexEditorialPackets(report, { ...verdict, verdicts: [] }), /缺少 1 个候选/);
assert.throws(() => buildCodexEditorialPackets(report, {
  ...verdict,
  verdicts: [{ ...verdict.verdicts[0], publicCopy: undefined }],
}), /未完成.*missing-publicCopy/);
assert.throws(() => buildCodexEditorialPackets(report, {
  ...verdict,
  verdicts: [{
    ...verdict.verdicts[0],
    publicCopy: {
      ...verdict.verdicts[0].publicCopy,
      titleEn: verdict.verdicts[0].publicCopy.titleZh,
    },
  }],
}), /未完成.*en-copy-contains-han-text/);
assert.throws(() => buildCodexEditorialPackets(report, {
  ...verdict,
  verdicts: [{ ...verdict.verdicts[0], band: "dropped" }],
}), /band=dropped/);

const withoutCandidates = { ...report.events[0], route: "hold" as const, routeCandidates: undefined };
assert.equal(requiresEditorialPublicCopy(withoutCandidates, "selected"), false);
assert.equal(requiresEditorialPublicCopy({ ...withoutCandidates, route: "pulse" }, "selected"), true);
console.log(JSON.stringify({ message: "Codex Luna editorial judgment tests passed", closure: packets.closure.status, sections: packets.closure.counts }));
