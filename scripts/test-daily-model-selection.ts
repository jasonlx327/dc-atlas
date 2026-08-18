import assert from "node:assert/strict";
import {
  DAILY_CANDIDATE_PACKET_LATEST_KEY,
  dailySelectionCandidates,
  runDailyModelSelection,
  type DailyEditorialCandidatePacket,
} from "../worker/event-intelligence/daily-model-selection.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

type EventRecord = ShadowRunReport["events"][number];

class MemoryKv {
  readonly values = new Map<string, string>();

  async get<T>(key: string, format?: "json"): Promise<T | string | null> {
    const value = this.values.get(key);
    if (value === undefined) return null;
    return format === "json" ? JSON.parse(value) as T : value;
  }

  async put(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }
}

function event(overrides: Partial<EventRecord> & Pick<EventRecord, "id" | "titleZh" | "lastUpdatedAt">): EventRecord {
  const { id, titleZh, lastUpdatedAt, ...rest } = overrides;
  return {
    id,
    eventKey: id,
    eventType: "industry-event",
    titleZh,
    titleEn: titleZh,
    summaryZh: `${titleZh} 摘要`,
    summaryEn: `${titleZh} summary`,
    firstSeenAt: lastUpdatedAt,
    lastUpdatedAt,
    eventTime: lastUpdatedAt,
    region: "全球",
    evidenceStatus: "reported",
    relationships: [],
    entities: ["NVIDIA"],
    locations: [],
    sourceTiers: ["T1"],
    independenceGroups: ["issuer"],
    independentSourceCount: 1,
    mainObservationId: `${overrides.id}-observation`,
    facts: [],
    priorityScore: 70,
    reasonCodes: [],
    route: "research-queue",
    routeCandidates: ["research-queue"],
    eligible: true,
    scoring: {
      topicRelevanceScore: 5,
      mechanismDepthScore: 4,
      specificityScore: 4,
      researchValueScore: 4,
      readerValueScore: 4,
      analysisReason: "test",
    },
    sourceChain: [],
    ...rest,
  };
}

function report(generatedAt: string, events: EventRecord[]): ShadowRunReport {
  const routeCounts = { "rumor-watch": 0, pulse: 0, "policy-index": 0, "research-queue": 0, hold: 0, rejected: 0 };
  events.forEach((item) => { routeCounts[item.route ?? "hold"] += 1; });
  return {
    schemaVersion: "atlas-event-shadow.v1",
    generatedAt,
    strategyVersion: "test",
    classifierVersion: "test",
    status: "succeeded",
    freshness: "live",
    stats: {
      fetched: events.length,
      normalized: events.length,
      duplicates: 0,
      relevant: events.length,
      uncertain: 0,
      deepScored: 0,
      clusters: events.length,
      publicEligible: events.filter((item) => item.eligible).length,
      rejected: 0,
      held: events.filter((item) => item.route === "hold").length,
      errors: 0,
      routeCounts,
    },
    sourceHealth: [],
    observationAnalysis: [],
    events,
    failures: [],
    cost: { modelCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, note: "test" },
  };
}

const scheduledTime = Date.parse("2026-08-12T09:30:00.000Z");
const updatedAt = "2026-08-12T08:00:00.000Z";
const verified = event({ id: "nvidia-official", titleZh: "NVIDIA 发布基础设施更新", lastUpdatedAt: updatedAt });
const discovery = event({
  id: "grok-discovery",
  titleZh: "Grok 新事件线索",
  lastUpdatedAt: updatedAt,
  route: "hold",
  routeCandidates: ["hold"],
  eligible: false,
  sourceTiers: ["D"],
  priorityScore: 58,
});
const grokBotOfficial = event({
  id: "grok-bot-official",
  titleZh: "SpaceXAI 官方发布 Grok Bot early beta",
  lastUpdatedAt: updatedAt,
  titleEn: "SpaceXAI introduces Grok Bot in early beta",
  summaryZh: "Grok Bot 为可持续运行、拥有独立云端电脑并跨应用工作的代理团队。",
  summaryEn: "Grok Bot is a team of always-on agents with their own cloud computers.",
  evidenceStatus: "officially_confirmed",
  sourceTiers: ["T1"],
  entities: ["SpaceXAI", "Grok"],
  sourceChain: [{
    observationId: "grok-bot-official-observation",
    sourceId: "xai-news",
    tier: "T1",
    independenceGroup: "xai",
    relationship: "origin",
    noveltyClass: "new-event",
    newFactCount: 0,
    title: "SpaceXAI introduces Grok Bot in early beta",
    url: "https://x.ai/news/grok-bot",
    publishedAt: updatedAt,
    accessStatus: "public",
  }],
  priorityScore: 76,
});
const old = event({ id: "old", titleZh: "过期事件", lastUpdatedAt: "2026-08-09T08:00:00.000Z" });
assert.deepEqual(
  dailySelectionCandidates([report(new Date(scheduledTime).toISOString(), [verified, discovery, grokBotOfficial, old])], scheduledTime).map((item) => item.id),
  ["grok-bot-official", "nvidia-official", "grok-discovery"],
);
const distributorLead = event({
  id: "distributor-lead",
  titleZh: "公司在新闻稿分发平台宣布新算力项目",
  lastUpdatedAt: updatedAt,
  route: "rejected",
  routeCandidates: ["rejected"],
  eligible: false,
  sourceTiers: ["T4"],
  priorityScore: 40,
});
assert.deepEqual(
  dailySelectionCandidates([report(new Date(scheduledTime).toISOString(), [distributorLead])], scheduledTime).map((item) => item.id),
  ["distributor-lead"],
  "attributable announcement leads should reach Atlas Editor instead of being dropped",
);

const kv = new MemoryKv();
kv.values.set("event-intelligence:run:event-night:2026-08-12", JSON.stringify(report("2026-08-12T00:00:00.000Z", [verified, discovery, grokBotOfficial])));
const env = {
  IDC_DAILY_SNAPSHOTS: kv,
  ATLAS_SCORING_ENABLED: "true",
  ATLAS_SCORING_PROVIDER: "openai-compatible",
  ATLAS_SCORING_BASE_URL: "https://api.deepseek.com",
  ATLAS_SCORING_MODEL: "deepseek-v4-flash",
  ATLAS_SCORING_TIMEOUT_MS: "20000",
  ATLAS_SCORING_DAILY_CALL_LIMIT: "20",
  ATLAS_SCORING_API_KEY: "test-key",
} as unknown as Env;
let calls = 0;
const mockFetch = (async () => {
  calls += 1;
  return Response.json({
    choices: [{ message: { content: JSON.stringify({
      scores: { topicRelevanceScore: 5, mechanismDepthScore: 4, specificityScore: 4, researchValueScore: 4, readerValueScore: 4 },
      rationale: "事件包含明确的基础设施机制和后续核验价值。",
      reasonCodes: ["infrastructure", "material-change"],
    }) } }],
    usage: { prompt_tokens: 100, completion_tokens: 30, total_tokens: 130 },
  });
}) as typeof fetch;

const night = await runDailyModelSelection(env, scheduledTime, "event-night", { fetcher: mockFetch });
assert.equal(night.attemptedCount, 3);
assert.equal(night.selectedCount, 3);
assert.equal(night.items.find((item) => item.eventId === "grok-discovery")?.publicationReadiness, "needs-source-verification");
assert.equal(night.items.find((item) => item.eventId === "grok-bot-official")?.publicationReadiness, "eligible-by-rules");
assert.deepEqual(night.items.find((item) => item.eventId === "grok-bot-official")?.coreCompanies, ["xAI"]);
assert.equal(night.items.find((item) => item.eventId === "grok-bot-official")?.sourceChain[0]?.sourceId, "xai-news");
assert.equal(calls, 3);

kv.values.set("event-intelligence:run:event-midday:2026-08-12", JSON.stringify(report("2026-08-12T04:30:00.000Z", [verified, discovery, grokBotOfficial])));
const midday = await runDailyModelSelection(env, scheduledTime, "event-midday", { fetcher: mockFetch });
assert.equal(midday.attemptedCount, 0);
assert.equal(midday.alreadyScoredCount, 3);

const dayEvent = event({ id: "nvidia-day", titleZh: "NVIDIA 白天新增事件", lastUpdatedAt: "2026-08-12T09:00:00.000Z" });
kv.values.set("event-intelligence:run:event-day:2026-08-12", JSON.stringify(report("2026-08-12T09:30:00.000Z", [verified, discovery, grokBotOfficial, dayEvent])));
const day = await runDailyModelSelection(env, scheduledTime, "event-day", { fetcher: mockFetch });
assert.equal(day.attemptedCount, 1);
assert.equal(day.alreadyScoredCount, 3);
assert.equal(day.items.length, 4);
assert.equal(calls, 4);
assert.equal(kv.values.get("event-intelligence:model-usage:2026-08-12"), "4");

const packet = JSON.parse(kv.values.get(DAILY_CANDIDATE_PACKET_LATEST_KEY) ?? "null") as DailyEditorialCandidatePacket;
assert.equal(packet.selectedCount, 4);
assert.equal(packet.ruleEligibleCount, 3);
assert.equal(packet.publicationReadyCount, 3);
assert.deepEqual(packet.sourceSlots, ["event-night", "event-midday", "event-day"]);

const limitedKv = new MemoryKv();
const limitedEvents = [
  event({ id: "limit-one", titleZh: "NVIDIA 发布新数据中心系统", lastUpdatedAt: updatedAt }),
  event({ id: "limit-two", titleZh: "AMD 公布新服务器平台", lastUpdatedAt: updatedAt, entities: ["AMD"] }),
  event({ id: "limit-three", titleZh: "CoreWeave 宣布新算力合同", lastUpdatedAt: updatedAt, entities: ["CoreWeave"] }),
];
limitedKv.values.set("event-intelligence:run:event-night:2026-08-12", JSON.stringify(report("2026-08-12T00:00:00.000Z", limitedEvents)));
const limitedEnv = {
  ...env,
  IDC_DAILY_SNAPSHOTS: limitedKv,
  ATLAS_SCORING_DAILY_CALL_LIMIT: "1",
} as unknown as Env;
let limitedCalls = 0;
const limited = await runDailyModelSelection(limitedEnv, scheduledTime, "event-night", {
  fetcher: (async (...args: Parameters<typeof fetch>) => {
    limitedCalls += 1;
    return mockFetch(...args);
  }) as typeof fetch,
});
assert.equal(limitedCalls, 1);
assert.equal(limited.items.length, 3, "call-limit fallback must retain every editorial candidate");
assert.equal(limited.fallbackCount, 2);
assert.equal(limited.status, "partial", "fallback scoring must stay visible as a partial run");
assert.match(limited.errors.join(" "), /daily-model-call-limit/);
assert.equal(limited.items.filter((item) => item.result.provider === "deterministic-fallback").length, 2);

const retried = await runDailyModelSelection({
  ...limitedEnv,
  ATLAS_SCORING_DAILY_CALL_LIMIT: "3",
} as unknown as Env, scheduledTime, "event-night", { fetcher: mockFetch });
assert.equal(retried.attemptedCount, 2, "same-day fallback candidates must be retried when model budget returns");
assert.equal(retried.alreadyScoredCount, 1);
assert.equal(retried.fallbackCount, 0);
assert.equal(retried.status, "completed");

const failureKv = new MemoryKv();
failureKv.values.set("event-intelligence:run:event-night:2026-08-12", JSON.stringify(report("2026-08-12T00:00:00.000Z", limitedEvents)));
const failureEnv = { ...env, IDC_DAILY_SNAPSHOTS: failureKv } as unknown as Env;
const failed = await runDailyModelSelection(failureEnv, scheduledTime, "event-night", {
  fetcher: (async () => new Response("rate limited", { status: 429 })) as typeof fetch,
});
assert.equal(failed.status, "partial");
assert.equal(failed.items.length, 3, "model failures must fall back instead of dropping candidates");
assert.equal(failed.fallbackCount, 3);
assert.equal(failed.items.every((item) => item.result.provider === "deterministic-fallback"), true);

const unavailableKv = new MemoryKv();
unavailableKv.values.set("event-intelligence:run:event-night:2026-08-12", JSON.stringify(report("2026-08-12T00:00:00.000Z", limitedEvents)));
const unavailable = await runDailyModelSelection({
  ...env,
  IDC_DAILY_SNAPSHOTS: unavailableKv,
  ATLAS_SCORING_ENABLED: "false",
  ATLAS_SCORING_API_KEY: undefined,
} as unknown as Env, scheduledTime, "event-night");
assert.equal(unavailable.status, "partial");
assert.equal(unavailable.attemptedCount, 0);
assert.equal(unavailable.items.length, 3, "provider outages must retain deterministic candidates");
assert.equal(unavailable.fallbackCount, 3);

console.log("daily model selection tests passed");
