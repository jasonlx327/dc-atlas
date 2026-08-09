import { mkdir, readFile, writeFile } from "node:fs/promises";
import { runShadowPipeline, type Route, type ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";
import { sourceRegistry } from "../worker/connectors/index.ts";
import type { ConnectorResult, ObservationEnvelope } from "../worker/connectors/types.ts";

type ExpectedLabel = {
  eventKey: string;
  expectedRoute: Route;
  expectedEvidenceStatus: ShadowRunReport["events"][number]["evidenceStatus"];
  expectedPublic: boolean;
  expectedCapacityQualifiers?: string[];
};

type StrategyComparison = {
  schemaVersion: "atlas-event-strategy-comparison.v1";
  generatedAt: string;
  strategyVersion: string;
  classifierVersion: string;
  fixture: {
    observations: number;
    labelledEvents: number;
    clusteredEvents: number;
    scaleCaveat: string;
  };
  current: {
    routeCounts: Record<Route, number>;
    labelChecks: { total: number; passed: number; failed: number; failures: string[] };
    mediaOnlyEscalatedToPulse: number;
    nonT0PolicyRoutes: number;
    capacityBoundaryErrors: string[];
  };
  legacyTierOnly: {
    routeCounts: Record<string, number>;
    mediaOnlyEscalatedToPulse: number;
    policyNotSeparated: number;
    note: string;
  };
  cost: ShadowRunReport["cost"];
};

const fixtureUrl = new URL("./fixtures/event-intelligence/core-cases.json", import.meta.url);
const labelsUrl = new URL("./fixtures/event-intelligence/labels.json", import.meta.url);
const outputUrl = new URL("../artifacts/event-intelligence/strategy-comparison.json", import.meta.url);

async function loadFixtureResults(): Promise<{ results: ConnectorResult[]; count: number }> {
  const observations = JSON.parse(await readFile(fixtureUrl, "utf8")) as ObservationEnvelope[];
  const groups = new Map<string, ObservationEnvelope[]>();
  for (const observation of observations) {
    const key = `${observation.sourceId}/${observation.endpointId}`;
    groups.set(key, [...(groups.get(key) ?? []), observation]);
  }
  return {
    count: observations.length,
    results: [...groups.entries()].map(([key, items]) => {
      const [sourceId, endpointId] = key.split("/");
      return { status: "ok", sourceId, endpointId, fetchedAt: "2026-08-08T14:00:00.000Z", httpStatus: 200, responseMs: 1, observations: items };
    }),
  };
}

function legacyTierOnlyRoute(event: ShadowRunReport["events"][number]): "pulse" | "rumor-watch" | "hold" {
  const tiers = new Set(event.sourceChain.map((item) => item.tier));
  if (tiers.has("T0") || tiers.has("T1") || tiers.has("T2") || tiers.has("T3")) return "pulse";
  return tiers.has("D") ? "hold" : "rumor-watch";
}

function eventIsMediaOnly(event: ShadowRunReport["events"][number]): boolean {
  const confirmingTiers = event.sourceChain
    .filter((item) => !["official_response", "contradiction"].includes(item.relationship))
    .map((item) => item.tier);
  return confirmingTiers.some((tier) => tier === "T2" || tier === "T3") && !confirmingTiers.some((tier) => tier === "T0" || tier === "T1");
}

async function run() {
  const fixture = await loadFixtureResults();
  const report = await runShadowPipeline(fixture.results, sourceRegistry, { generatedAt: "2026-08-08T14:00:00.000Z" });
  const labels = JSON.parse(await readFile(labelsUrl, "utf8")) as ExpectedLabel[];
  const eventsByKey = new Map(report.events.map((event) => [event.eventKey, event]));
  const failures: string[] = [];
  for (const label of labels) {
    const event = eventsByKey.get(label.eventKey);
    if (!event) {
      failures.push(`${label.eventKey}: missing event`);
      continue;
    }
    if (event.route !== label.expectedRoute) failures.push(`${label.eventKey}: route=${event.route}, expected=${label.expectedRoute}`);
    if (event.evidenceStatus !== label.expectedEvidenceStatus) failures.push(`${label.eventKey}: evidence=${event.evidenceStatus}, expected=${label.expectedEvidenceStatus}`);
    const publicEligible = event.eligible === true;
    if (publicEligible !== label.expectedPublic) failures.push(`${label.eventKey}: public=${publicEligible}, expected=${label.expectedPublic}`);
    if (label.expectedCapacityQualifiers) {
      const qualifiers = new Set(event.facts.filter((fact) => fact.factType === "capacity").map((fact) => fact.qualifier));
      for (const qualifier of label.expectedCapacityQualifiers) {
        if (!qualifiers.has(qualifier)) failures.push(`${label.eventKey}: missing capacity qualifier=${qualifier}`);
      }
    }
  }
  const capacityBoundaryErrors = report.events.flatMap((event) => event.facts
    .filter((fact) => fact.factType === "capacity" && (!fact.qualifier || !fact.capacityType))
    .map((fact) => `${event.eventKey}: ${fact.valueText} lacks qualifier/type`));

  const currentMediaOnlyEscalatedToPulse = report.events.filter((event) => event.route === "pulse" && eventIsMediaOnly(event)).length;
  const nonT0PolicyRoutes = report.events.filter((event) => event.eventType === "policy" && event.route === "policy-index" && !event.sourceChain.some((item) => item.tier === "T0" && item.relationship !== "official_response")).length;
  const legacyRouteCounts: Record<string, number> = { pulse: 0, "rumor-watch": 0, hold: 0 };
  let legacyMediaOnlyEscalatedToPulse = 0;
  let policyNotSeparated = 0;
  for (const event of report.events) {
    const route = legacyTierOnlyRoute(event);
    legacyRouteCounts[route] += 1;
    if (route === "pulse" && eventIsMediaOnly(event)) legacyMediaOnlyEscalatedToPulse += 1;
    if (event.eventType === "policy") policyNotSeparated += 1;
  }
  const comparison: StrategyComparison = {
    schemaVersion: "atlas-event-strategy-comparison.v1",
    generatedAt: report.generatedAt,
    strategyVersion: report.strategyVersion,
    classifierVersion: report.classifierVersion,
    fixture: {
      observations: fixture.count,
      labelledEvents: labels.length,
      clusteredEvents: report.events.length,
      scaleCaveat: "这是可审计的核心边界 fixture，不等同于计划要求的 200–500 条历史回放；真实 shadow 运行后需再次观察该指标。",
    },
    current: {
      routeCounts: report.stats.routeCounts,
      labelChecks: { total: labels.length, passed: labels.length - failures.length, failed: failures.length, failures },
      mediaOnlyEscalatedToPulse: currentMediaOnlyEscalatedToPulse,
      nonT0PolicyRoutes,
      capacityBoundaryErrors,
    },
    legacyTierOnly: {
      routeCounts: legacyRouteCounts,
      mediaOnlyEscalatedToPulse: legacyMediaOnlyEscalatedToPulse,
      policyNotSeparated,
      note: "对照组只按来源 tier 粗分，并故意不建事件簇、不区分官方回应、不区分 policy-index；仅用于展示边界回归，不代表生产旧 Worker 的完整逻辑。",
    },
    cost: report.cost,
  };
  await mkdir(new URL("../artifacts/event-intelligence/", import.meta.url), { recursive: true });
  await writeFile(outputUrl, `${JSON.stringify(comparison, null, 2)}\n`);
  console.log(JSON.stringify({ message: "Event intelligence strategy comparison complete", passed: failures.length === 0, checks: comparison.current.labelChecks, mediaOnlyEscalatedToPulse: currentMediaOnlyEscalatedToPulse, legacyMediaOnlyEscalatedToPulse, output: outputUrl.pathname }));
}

void run();
