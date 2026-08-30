import { fetchRegisteredSource, shadowSources } from "../connectors/index.ts";
import type { ConnectorRequestState, ConnectorResult, SourceDefinition } from "../connectors/types.ts";
import { runShadowPipeline, type ShadowRunReport } from "./pipeline.ts";
import type { EventIntelligenceJob } from "./schedule.ts";
import { codexRunKey, type CodexEventSlot, validateCodexIngestReport } from "./codex-ingest.ts";
import {
  CORE_COMPANY_WATCH_STATE_KEY,
  buildCoreCompanyWatchState,
  type CoreCompanyWatchState,
} from "./core-company-watchlist.ts";

const LIVE_SMOKE_GATE_SOURCE_IDS = [
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

const LIVE_SMOKE_JOBS = new Set<EventIntelligenceJob>(["event-night", "event-midday", "event-day"]);
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
  liveSmoke: Record<"event-night" | "event-midday" | "event-day", { passed: boolean; generatedAt: string } | null>;
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

async function fetchSources(env: Env, sources: SourceDefinition[]): Promise<ConnectorResult[]> {
  const results: ConnectorResult[] = [];
  for (let offset = 0; offset < sources.length; offset += 8) {
    results.push(...await Promise.all(sources.slice(offset, offset + 8).map((source) => fetchSource(env, source))));
  }
  return results;
}

function smokePassed(results: Array<{ sourceId: string; status: ConnectorResult["status"] }>): boolean {
  const gateSources = new Set<string>(LIVE_SMOKE_GATE_SOURCE_IDS);
  const required = results.filter((result) => gateSources.has(result.sourceId));
  if (!required.length) return false;
  const passing = required.filter((result) => PASSING_CONNECTOR_STATES.has(result.status)).length;
  return passing / required.length >= 0.95;
}

async function priorSmoke(
  env: Env,
): Promise<EventRuntimeStatus["liveSmoke"]> {
  return (await env.IDC_DAILY_SNAPSHOTS.get<EventRuntimeStatus["liveSmoke"]>("event-intelligence:live-smoke", "json")) ?? {
    "event-night": null,
    "event-midday": null,
    "event-day": null,
  };
}

export async function runEventIntelligenceShadow(
  env: Env,
  job: EventIntelligenceJob,
  scheduledTime: number,
): Promise<EventRuntimeStatus | null> {
  if (!LIVE_SMOKE_JOBS.has(job)) return null;
  const allSources = shadowSources();
  const generatedAt = new Date(scheduledTime).toISOString();
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date(scheduledTime));
  const smokeJob = job as CodexEventSlot;
  const codexReport = await env.IDC_DAILY_SNAPSHOTS.get<ShadowRunReport>(codexRunKey(smokeJob, day), "json");
  let report: ShadowRunReport | null = null;
  if (codexReport) {
    try {
      validateCodexIngestReport(codexReport, allSources, day);
      report = codexReport;
    } catch (error) {
      console.warn(JSON.stringify({ message: "Codex event run rejected; using Worker emergency scan", job, day, error: String(error) }));
    }
  }
  if (!report) {
    const fallbackIds = new Set<string>(LIVE_SMOKE_GATE_SOURCE_IDS);
    const fallbackSources = allSources.filter((source) => fallbackIds.has(source.id));
    const results = await fetchSources(env, fallbackSources);
    report = await runShadowPipeline(results, fallbackSources, { generatedAt });
  }
  const priorCompanyWatch = await env.IDC_DAILY_SNAPSHOTS.get<CoreCompanyWatchState>(CORE_COMPANY_WATCH_STATE_KEY, "json");
  const companyWatch = buildCoreCompanyWatchState(report.events, generatedAt, priorCompanyWatch, report.sourceHealth);
  const passingSources = report.sourceHealth.filter((result) => PASSING_CONNECTOR_STATES.has(result.status)).length;
  const liveSmoke = await priorSmoke(env);
  liveSmoke[smokeJob] = { passed: smokePassed(report.sourceHealth), generatedAt };
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
      sources: report.sourceHealth.length,
      passingSources,
      successRate: report.sourceHealth.length ? passingSources / report.sourceHealth.length : 0,
      observations: report.stats.fetched,
      clusters: report.stats.clusters,
      errors: report.stats.errors,
    },
    liveSmoke,
  };
  await Promise.all([
    env.IDC_DAILY_SNAPSHOTS.put("event-intelligence:latest-run", JSON.stringify(report)),
    env.IDC_DAILY_SNAPSHOTS.put(`event-intelligence:run:${job}:${day}`, JSON.stringify(report)),
    env.IDC_DAILY_SNAPSHOTS.put("event-intelligence:live-smoke", JSON.stringify(liveSmoke)),
    env.IDC_DAILY_SNAPSHOTS.put("event-intelligence:runtime-status", JSON.stringify(status)),
    env.IDC_DAILY_SNAPSHOTS.put(CORE_COMPANY_WATCH_STATE_KEY, JSON.stringify(companyWatch)),
  ]);
  console.log(JSON.stringify({ message: codexReport === report ? "Codex event run accepted by Worker" : "Worker emergency event scan saved", ...status }));
  return status;
}

export async function eventRuntimeStatus(env: Env): Promise<EventRuntimeStatus | null> {
  return await env.IDC_DAILY_SNAPSHOTS.get<EventRuntimeStatus>("event-intelligence:runtime-status", "json");
}
