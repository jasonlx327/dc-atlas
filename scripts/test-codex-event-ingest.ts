import assert from "node:assert/strict";
import { fetchSourcesBatched } from "../worker/event-intelligence/source-fetch-batches.ts";
import { canonicalRunKey, codexRunKey, validateCodexIngestReport } from "../worker/event-intelligence/codex-ingest.ts";
import { shadowSources } from "../worker/connectors/index.ts";
import type { ConnectorResult, SourceDefinition } from "../worker/connectors/types.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";
import { runEventIntelligenceShadow } from "../worker/event-intelligence/runtime.ts";

function source(id: string): SourceDefinition {
  return {
    id,
    slug: id,
    name: id,
    tier: id === "official" ? "T1" : "T3",
    publisherType: "test",
    region: "全球",
    language: "en",
    independenceGroup: id,
    topics: ["data centers"],
    endpoint: { id: `${id}-endpoint`, type: "rss", url: `https://${id}.example/feed`, parserKey: "rss", pollIntervalMinutes: 60 },
    enabled: true,
  };
}

const sources = [source("official"), source("media"), source("discovery")];
const active = new Set<string>();
let peak = 0;
const attempts = new Map<string, number>();
const results = await fetchSourcesBatched(sources, async (entry): Promise<ConnectorResult> => {
  active.add(entry.id);
  peak = Math.max(peak, active.size);
  attempts.set(entry.id, (attempts.get(entry.id) ?? 0) + 1);
  await Promise.resolve();
  active.delete(entry.id);
  if (entry.id === "media" && attempts.get(entry.id) === 1) {
    return { status: "failed", sourceId: entry.id, endpointId: entry.endpoint.id, fetchedAt: "2026-08-18T01:00:00.000Z", observations: [], error: "temporary" };
  }
  return { status: "empty", sourceId: entry.id, endpointId: entry.endpoint.id, fetchedAt: "2026-08-18T01:00:00.000Z", observations: [] };
}, { concurrency: 2, retries: 1, retryDelayMs: 0 });

assert.ok(peak <= 2, "local collector must respect its concurrency bound");
assert.equal(attempts.get("media"), 2, "temporary source failures should retry locally");
assert.deepEqual(results.map((result) => result.sourceId), sources.map((entry) => entry.id), "results should preserve registry order");

const report = {
  schemaVersion: "atlas-event-shadow.v1",
  generatedAt: "2026-08-18T01:00:00.000Z",
  status: "succeeded",
  sourceHealth: results.map((result, index) => ({ sourceId: result.sourceId, endpointId: result.endpointId, tier: sources[index]!.tier, independenceGroup: sources[index]!.independenceGroup, status: result.status, observations: 0 })),
  failures: [],
} as unknown as ShadowRunReport;
const validation = validateCodexIngestReport(report, sources, "2026-08-18");
assert.equal(validation.sourceCount, 3);
assert.equal(validation.passingSourceCount, 3);
assert.equal(codexRunKey("event-night", validation.day), "event-intelligence:codex-run:event-night:2026-08-18");
assert.equal(canonicalRunKey("event-night", validation.day), "event-intelligence:run:event-night:2026-08-18");

assert.throws(() => validateCodexIngestReport({ ...report, sourceHealth: report.sourceHealth.slice(0, 2) }, sources), /缺少 1 个/);
assert.throws(() => validateCodexIngestReport({ ...report, failures: ["source: Too many subrequests by single Worker invocation"] }, sources), /子请求上限/);

class MemoryKv {
  values = new Map<string, string>();
  async get<T>(key: string, type?: string): Promise<T | string | null> {
    const value = this.values.get(key);
    if (value === undefined) return null;
    return type === "json" ? JSON.parse(value) as T : value;
  }
  async put(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }
}

const runtimeSources = shadowSources();
const scheduledTime = Date.parse("2026-08-17T21:30:00.000Z");
const runtimeReport: ShadowRunReport = {
  schemaVersion: "atlas-event-shadow.v1",
  generatedAt: "2026-08-17T21:20:00.000Z",
  strategyVersion: "test",
  classifierVersion: "test",
  status: "succeeded",
  freshness: "verified-no-change",
  stats: { fetched: 0, normalized: 0, duplicates: 0, relevant: 0, uncertain: 0, deepScored: 0, clusters: 0, publicEligible: 0, rejected: 0, held: 0, errors: 0, routeCounts: { "rumor-watch": 0, pulse: 0, "policy-index": 0, "research-queue": 0, hold: 0, rejected: 0 } },
  sourceHealth: runtimeSources.map((entry) => ({ sourceId: entry.id, endpointId: entry.endpoint.id, tier: entry.tier, independenceGroup: entry.independenceGroup, status: "empty", observations: 0 })),
  observationAnalysis: [],
  events: [],
  failures: [],
  cost: { modelCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, note: "test" },
};
const kv = new MemoryKv();
kv.values.set(codexRunKey("event-night", "2026-08-18"), JSON.stringify(runtimeReport));
const runtime = await runEventIntelligenceShadow({ IDC_DAILY_SNAPSHOTS: kv } as unknown as Env, "event-night", scheduledTime);
assert.equal(runtime?.latestRun.sources, runtimeSources.length, "Worker should consume the complete Codex source packet");
assert.equal(runtime?.latestRun.errors, 0);
assert.equal(JSON.parse(kv.values.get(canonicalRunKey("event-night", "2026-08-18")) ?? "null").generatedAt, runtimeReport.generatedAt);

console.log(JSON.stringify({ message: "Codex event ingestion tests passed", peakConcurrency: peak, attempts: Object.fromEntries(attempts) }));
