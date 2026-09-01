import assert from "node:assert/strict";
import { buildAtlasEditorDecision, editorSectionFor } from "../worker/event-intelligence/atlas-auto-editor.ts";
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
    sourceChain: [{ observationId: "obs-nvidia", sourceId: "nvidia", tier: "T1", independenceGroup: "nvidia", relationship: "origin", noveltyClass: "new-event", newFactCount: 1, title: "NVIDIA announces a campus", url: "https://nvidia.com/news/example", accessStatus: "public", publishedAt: "2026-08-17T01:00:00.000Z" }],
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
    ruleEligibleCount: items.filter((candidate) => candidate.publicationReadiness === "eligible-by-rules").length,
    copyReadyCount: items.filter((candidate) => candidate.result.publicCopy).length,
    publicationReadyCount: 0,
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
  sourceChain: [{ observationId: "obs-dcd", sourceId: "dcd", tier: "T3", independenceGroup: "dcd", relationship: "origin", noveltyClass: "new-event", newFactCount: 0, title: "Amazon reportedly plans a campus", url: "https://www.datacenterdynamics.com/example", accessStatus: "public", publishedAt: "2026-08-17T01:00:00.000Z" }],
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
    { observationId: "obs-issuer", sourceId: "issuer", tier: "T1", independenceGroup: "issuer", relationship: "origin", noveltyClass: "new-event", newFactCount: 1, title: "Issuer update", url: "https://issuer.example/news", accessStatus: "unavailable", publishedAt: "2026-08-17T01:00:00.000Z" },
    { observationId: "obs-media", sourceId: "media", tier: "T3", independenceGroup: "media", relationship: "follow_up", noveltyClass: "new-source", newFactCount: 0, title: "Media report", url: "https://media.example/report", accessStatus: "public", publishedAt: "2026-08-17T01:10:00.000Z" },
  ],
});
const ordinaryWatchHold = item({
  eventId: "event-media-follow-up",
  titleZh: "媒体跟进一项尚待核验的 AI 产业事件",
  titleEn: "媒体跟进一项尚待核验的 AI 产业事件",
  summaryZh: "报道提供了新的线索，但尚未形成正式发布所需的一手证据。",
  summaryEn: "报道提供了新的线索，但英文公开文案尚未生成。",
  route: "pulse",
  routeCandidates: ["pulse"],
  band: "watch",
  publicationReadiness: "needs-source-verification",
  evidenceStatus: "reported",
  sourceTiers: ["T3"],
  facts: [],
  sourceChain: [{ observationId: "obs-follow-up", sourceId: "media", tier: "T3", independenceGroup: "media", relationship: "origin", noveltyClass: "new-event", newFactCount: 0, title: "Media follow-up", url: "https://media.example/follow-up", accessStatus: "public", publishedAt: "2026-08-17T01:00:00.000Z" }],
  result: { ...formal.result, publicCopy: undefined },
});
const ordinaryMediaPublish = item({
  ...ordinaryWatchHold,
  eventId: "event-media-default-public",
  result: {
    ...formal.result,
    publicCopy: {
      titleZh: "媒体跟进一项新的 AI 基础设施项目",
      titleEn: "Media reports a new AI-infrastructure project",
      summaryZh: "媒体报道披露了项目位置与计划规模，相关主张继续按来源归属追踪。",
      summaryEn: "The media report identifies the location and planned scale; the claims remain attributed while follow-up continues.",
    },
  },
});
const mirroredSourceCopy = item({
  eventId: "event-mirrored-source-copy",
  titleZh: "NVIDIA announces a 300MW AI data-center campus",
  titleEn: "NVIDIA announces a 300MW AI data-center campus",
  summaryZh: "The company disclosure provides 300MW of planned capacity.",
  summaryEn: "The company disclosure provides 300MW of planned capacity.",
  result: {
    ...formal.result,
    publicCopy: {
      titleZh: "NVIDIA announces a 300MW AI data-center campus",
      titleEn: "NVIDIA announces a 300MW AI data-center campus",
      summaryZh: "The company disclosure provides 300MW of planned capacity.",
      summaryEn: "The company disclosure provides 300MW of planned capacity.",
    },
  },
});
const releasedSoftware = item({
  eventId: "event-released-software",
  titleZh: "Google 发布开源 C++ 内容凭证库",
  titleEn: "Google released an open-source C++ content-credentials library",
  summaryZh: "该库在客户端和服务器应用中本地验证内容凭证。",
  summaryEn: "The released library validates content credentials locally in client and server applications.",
  facts: [],
  entities: ["Google"],
  coreCompanies: ["Alphabet"],
});

const decision = buildAtlasEditorDecision(packet([formal, rumor, fallback, inaccessiblePrimary, ordinaryWatchHold, ordinaryMediaPublish]), Date.parse("2026-08-17T01:30:00.000Z"));
assert.equal(decision.decisions.find((entry) => entry.eventId === formal.eventId)?.route, "formal-section");
assert.equal(decision.decisions.find((entry) => entry.eventId === rumor.eventId)?.route, "rumor-watch");
assert.equal(decision.decisions.find((entry) => entry.eventId === fallback.eventId)?.action, "publish", "fallback scoring must not discard valid primary evidence");
assert.equal(decision.decisions.find((entry) => entry.eventId === inaccessiblePrimary.eventId)?.route, "rumor-watch", "accessible media should remain public as attributed reporting when the primary source is inaccessible");
assert.ok(decision.decisions.find((entry) => entry.eventId === inaccessiblePrimary.eventId)?.reasonCodes.includes("single-source-report"));
assert.equal(decision.decisions.find((entry) => entry.eventId === ordinaryWatchHold.eventId)?.holdClass, "watch");
assert.equal(decision.decisions.find((entry) => entry.eventId === ordinaryMediaPublish.eventId)?.route, "rumor-watch", "accessible T2/T3 reporting should default to the public intelligence lane regardless of its original topic route");
assert.equal(decision.decisions.find((entry) => entry.eventId === ordinaryMediaPublish.eventId)?.section, "rumors");
assert.equal(decision.summary.adapterReady, 5);
assert.equal(decision.summary.blockingHold, 0);
assert.equal(decision.decisions.find((entry) => entry.eventId === fallback.eventId)?.reasonCodes.filter((reason) => reason === "model-scoring-fallback").length, 1);
assert.ok(decision.decisions.every((entry) => entry.reasonCodes.length > 0));
assert.ok(decision.decisions.filter((entry) => entry.action === "publish").every((entry) => entry.publicClaims.every((claim) => claim.sourceRefs.every((url) => entry.canonicalUrls.includes(url)))));
assert.notEqual(editorSectionFor(releasedSoftware), "capacity", "the word released must not be mistaken for a capacity lease");

const watchOnlyDecision = buildAtlasEditorDecision(packet([ordinaryWatchHold]), Date.parse("2026-08-17T01:30:00.000Z"));
assert.equal(watchOnlyDecision.status, "completed", "ordinary watch holds must not make the whole editor run partial");
const mirroredCopyDecision = buildAtlasEditorDecision(packet([mirroredSourceCopy]), Date.parse("2026-08-17T01:30:00.000Z"));
assert.equal(mirroredCopyDecision.decisions[0]?.action, "hold", "mirrored source-language copy must never reach a public adapter");
assert.ok(mirroredCopyDecision.decisions[0]?.reasonCodes.includes("bilingual-copy-invalid-or-incomplete"));

if (process.argv.includes("--packet")) {
  process.stdout.write(JSON.stringify(decision));
} else {
  console.log(JSON.stringify({ message: "Atlas Auto Editor tests passed", summary: decision.summary }));
}
