import { fetchRegisteredSource, sourceRegistryById } from "../connectors/index.ts";
import type { ConnectorRequestState, ConnectorResult, SourceDefinition } from "../connectors/types.ts";
import { runShadowPipeline, type ShadowRunReport } from "./pipeline.ts";
import type { EventIntelligenceJob } from "./schedule.ts";

const LIVE_SMOKE_SOURCE_IDS = [
  "aihot-discovery",
  "federal-register",
  "sec-edgar",
  "doe",
  "nvidia",
  "amd",
  "microsoft",
  "google-cloud",
  "aws-news",
  "meta",
  "data-center-dynamics",
  "power-magazine",
  "utility-dive",
  "the-register",
] as const;

const LIVE_SMOKE_JOBS = new Set<EventIntelligenceJob>(["event-night", "event-day"]);
const PASSING_CONNECTOR_STATES = new Set<ConnectorResult["status"]>(["ok", "empty", "not-modified"]);

export type EventRuntimeStatus = {
  schemaVersion: "atlas-event-runtime.v1";
  generatedAt: string;
  mode: "shadow";
  gateStatus: "waiting-live-smoke" | "gate4-ready";
  publicCutover: false;
  latestJob: EventIntelligenceJob;
  latestRun: {
    status: ShadowRunReport["status"];
    freshness: ShadowRunReport["freshness"];
    sources: number;
    passingSources: number;
    successRate: number;
    observations: number;
    clusters: number;
    errors: number;
  };
  liveSmoke: Record<"event-night" | "event-day", { passed: boolean; generatedAt: string } | null>;
};

function sourceStateKey(source: SourceDefinition): string {
  return `event-intelligence:request-state:${source.endpoint.id}`;
}

async function requestState(env: Env, source: SourceDefinition): Promise<ConnectorRequestState> {
  return (await env.IDC_DAILY_SNAPSHOTS.get<ConnectorRequestState>(sourceStateKey(source), "json")) ?? {};
}

async function fetchSource(env: Env, source: SourceDefinition): Promise<ConnectorResult> {
  const result = await fetchRegisteredSource(source, { requestState: await requestState(env, source) });
  const state = { etag: result.etag ?? null, lastModified: result.lastModified ?? null, cursor: result.cursor ?? null };
  if (state.etag || state.lastModified || state.cursor) {
    await env.IDC_DAILY_SNAPSHOTS.put(sourceStateKey(source), JSON.stringify(state));
  }
  return result;
}

function smokePassed(results: ConnectorResult[]): boolean {
  if (!results.length) return false;
  const passing = results.filter((result) => PASSING_CONNECTOR_STATES.has(result.status)).length;
  return passing / results.length >= 0.95;
}

async function priorSmoke(
  env: Env,
): Promise<EventRuntimeStatus["liveSmoke"]> {
  return (await env.IDC_DAILY_SNAPSHOTS.get<EventRuntimeStatus["liveSmoke"]>("event-intelligence:live-smoke", "json")) ?? {
    "event-night": null,
    "event-day": null,
  };
}

export async function runEventIntelligenceShadow(
  env: Env,
  job: EventIntelligenceJob,
  scheduledTime: number,
): Promise<EventRuntimeStatus | null> {
  if (!LIVE_SMOKE_JOBS.has(job)) return null;
  const sources = LIVE_SMOKE_SOURCE_IDS.flatMap((id) => {
    const source = sourceRegistryById.get(id);
    return source ? [source] : [];
  });
  const results = await Promise.all(sources.map((source) => fetchSource(env, source)));
  const generatedAt = new Date(scheduledTime).toISOString();
  const report = await runShadowPipeline(results, sources, { generatedAt });
  const passingSources = results.filter((result) => PASSING_CONNECTOR_STATES.has(result.status)).length;
  const liveSmoke = await priorSmoke(env);
  liveSmoke[job] = { passed: smokePassed(results), generatedAt };
  const gateStatus = liveSmoke["event-night"]?.passed && liveSmoke["event-day"]?.passed
    ? "gate4-ready"
    : "waiting-live-smoke";
  const status: EventRuntimeStatus = {
    schemaVersion: "atlas-event-runtime.v1",
    generatedAt,
    mode: "shadow",
    gateStatus,
    publicCutover: false,
    latestJob: job,
    latestRun: {
      status: report.status,
      freshness: report.freshness,
      sources: results.length,
      passingSources,
      successRate: results.length ? passingSources / results.length : 0,
      observations: report.stats.fetched,
      clusters: report.stats.clusters,
      errors: report.stats.errors,
    },
    liveSmoke,
  };
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date(scheduledTime));
  await Promise.all([
    env.IDC_DAILY_SNAPSHOTS.put("event-intelligence:latest-run", JSON.stringify(report)),
    env.IDC_DAILY_SNAPSHOTS.put(`event-intelligence:run:${job}:${day}`, JSON.stringify(report)),
    env.IDC_DAILY_SNAPSHOTS.put("event-intelligence:live-smoke", JSON.stringify(liveSmoke)),
    env.IDC_DAILY_SNAPSHOTS.put("event-intelligence:runtime-status", JSON.stringify(status)),
  ]);
  console.log(JSON.stringify({ message: "Event intelligence shadow run saved", ...status }));
  return status;
}

export async function eventRuntimeStatus(env: Env): Promise<EventRuntimeStatus | null> {
  return await env.IDC_DAILY_SNAPSHOTS.get<EventRuntimeStatus>("event-intelligence:runtime-status", "json");
}
