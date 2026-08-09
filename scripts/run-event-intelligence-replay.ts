import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConnectorResult } from "../worker/connectors/types.ts";
import { runShadowPipeline, type Route, type ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";
import type { EventReplayCorpus, FrozenEvent, ReplayObservation } from "./build-event-replay-corpus.ts";

const corpusUrl = new URL("./fixtures/event-intelligence/history-v1.json", import.meta.url);
const validationUrl = new URL("../artifacts/event-intelligence/replay-corpus-validation.json", import.meta.url);
const outputUrl = new URL("../artifacts/event-intelligence/replay-history-v1.json", import.meta.url);

type ReplayMetrics = {
  relevance: { precision: number; recall: number; truePositive: number; falsePositive: number; falseNegative: number; compared: number };
  highValueRecall: number;
  duplicateEventRate: number;
  exactDuplicateObservationRate: number;
  clusteringPurity: number;
  incorrectMergeRate: number;
  primarySourceAccuracy: number;
  bilingualConsistency: number;
  safety: {
    mediaOnlyToPulse: number;
    nonT0PolicyRoutes: number;
    capacityBoundaryErrors: number;
    sourceLessPublic: number;
  };
  cost: ShadowRunReport["cost"] & { p50LatencyMs: number; p95LatencyMs: number };
  routeDistribution: Record<Route, number>;
};

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function percent(numerator: number, denominator: number): number {
  return denominator ? round(numerator / denominator) : 0;
}

function buildResults(corpus: EventReplayCorpus): ConnectorResult[] {
  const grouped = new Map<string, ReplayObservation[]>();
  for (const observation of corpus.observations) {
    const key = `${observation.sourceId}/${observation.endpointId}`;
    grouped.set(key, [...(grouped.get(key) ?? []), observation]);
  }
  return [...grouped.entries()].map(([key, observations]) => {
    const [sourceId, endpointId] = key.split("/");
    return { status: "ok", sourceId, endpointId, fetchedAt: corpus.generated_at, httpStatus: 200, responseMs: 0, observations };
  });
}

function eventMap(report: ShadowRunReport): Map<string, ShadowRunReport["events"][number]> {
  return new Map(report.events.map((event) => [event.eventKey, event]));
}

function observationMap(report: ShadowRunReport): Map<string, ShadowRunReport["observationAnalysis"][number]> {
  const map = new Map<string, ShadowRunReport["observationAnalysis"][number]>();
  for (const observation of report.observationAnalysis) map.set(observation.canonicalUrl, observation);
  return map;
}

function calculateMetrics(corpus: EventReplayCorpus, report: ShadowRunReport): ReplayMetrics {
  const observationById = new Map(corpus.observations.map((observation) => [observation.id, observation]));
  const firstObservationIdByUrl = new Map<string, string>();
  for (const observation of corpus.observations) {
    if (!firstObservationIdByUrl.has(observation.canonicalUrl)) firstObservationIdByUrl.set(observation.canonicalUrl, observation.id);
  }
  const reviewedEvents = corpus.frozen_events.filter((event) => {
    if (event.label_status !== "audited" && event.label_status !== "frozen") return false;
    const observation = observationById.get(event.source_observation_ids[0]);
    return observation ? firstObservationIdByUrl.get(observation.canonicalUrl) === observation.id : false;
  });
  const expectedByKey = new Map<string, FrozenEvent[]>();
  for (const event of reviewedEvents) expectedByKey.set(event.expected_event_key, [...(expectedByKey.get(event.expected_event_key) ?? []), event]);
  const actualEvents = eventMap(report);
  const actualObservations = observationMap(report);
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  let compared = 0;
  let highValueExpected = 0;
  let highValueFound = 0;
  let bilingualCompared = 0;
  let bilingualPassed = 0;
  const incorrectMerges: string[] = [];
  let primarySourceMatches = 0;
  let primarySourceCompared = 0;
  for (const frozen of reviewedEvents) {
    const observation = corpus.observations.find((item) => item.id === frozen.source_observation_ids[0]);
    const actualObservation = observation ? actualObservations.get(observation.canonicalUrl) : undefined;
    if (!actualObservation) continue;
    compared += 1;
    if (frozen.expected_relevance && actualObservation.classification.isRelevant) truePositive += 1;
    if (!frozen.expected_relevance && actualObservation.classification.isRelevant) falsePositive += 1;
    if (frozen.expected_relevance && !actualObservation.classification.isRelevant) falseNegative += 1;
    if (frozen.expected_relevance && (frozen.expected_route === "pulse" || frozen.expected_route === "policy-index")) {
      highValueExpected += 1;
      if (actualEvents.has(frozen.expected_event_key)) highValueFound += 1;
    }
    if (frozen.expected_bilingual_state === "complete") {
      bilingualCompared += 1;
      if (actualObservation.analysis.translationStatus === "complete") bilingualPassed += 1;
    }
    if (frozen.expected_route === "pulse" || frozen.expected_route === "policy-index") {
      primarySourceCompared += 1;
      const actualEvent = actualEvents.get(frozen.expected_event_key);
      if (actualEvent?.mainObservationId === actualObservation.id) primarySourceMatches += 1;
    }
  }
  for (const [eventKey, events] of expectedByKey) {
    const actual = actualEvents.get(eventKey);
    if (!actual || events.length < 2) continue;
    const observedKeys = new Set(actual.sourceChain.map((item) => corpus.observations.find((observation) => observation.canonicalUrl === item.url)?.eventKey ?? eventKey));
    if (observedKeys.size > 1) incorrectMerges.push(`${eventKey}: ${[...observedKeys].join(",")}`);
  }
  const mediaOnlyToPulse = report.events.filter((event) => {
    const tiers = new Set(event.sourceChain.filter((source) => !["official_response", "contradiction"].includes(source.relationship)).map((source) => source.tier));
    return event.route === "pulse" && !tiers.has("T0") && !tiers.has("T1") && (tiers.has("T2") || tiers.has("T3"));
  }).length;
  const nonT0PolicyRoutes = report.events.filter((event) => event.route === "policy-index" && !event.sourceChain.some((source) => source.tier === "T0" && source.relationship !== "official_response")).length;
  const capacityBoundaryErrors = report.events
    .filter((event) => event.route !== "hold" && event.route !== "rejected")
    .flatMap((event) => event.facts.filter((fact) => fact.factType === "capacity" && (!fact.qualifier || !fact.capacityType || fact.capacityType === "unspecified_capacity"))).length;
  const duplicateEventCount = report.events.filter((event) => {
    const urls = event.sourceChain.map((source) => source.url);
    return new Set(urls).size !== urls.length;
  }).length;
  const latencies = report.sourceHealth.map((source) => source.responseMs ?? 0).sort((left, right) => left - right);
  const p = (quantile: number) => latencies.length ? latencies[Math.min(latencies.length - 1, Math.floor((latencies.length - 1) * quantile))] : 0;
  return {
    relevance: { precision: percent(truePositive, truePositive + falsePositive), recall: percent(truePositive, truePositive + falseNegative), truePositive, falsePositive, falseNegative, compared },
    highValueRecall: percent(highValueFound, highValueExpected),
    duplicateEventRate: percent(duplicateEventCount + incorrectMerges.length, report.events.length),
    exactDuplicateObservationRate: percent(report.stats.duplicates, report.stats.fetched),
    clusteringPurity: percent(report.events.filter((event) => !incorrectMerges.some((item) => item.startsWith(`${event.eventKey}:`))).length, report.events.length),
    incorrectMergeRate: percent(incorrectMerges.length, report.events.length),
    primarySourceAccuracy: percent(primarySourceMatches, primarySourceCompared),
    bilingualConsistency: percent(bilingualPassed, bilingualCompared),
    safety: { mediaOnlyToPulse, nonT0PolicyRoutes, capacityBoundaryErrors, sourceLessPublic: report.events.filter((event) => event.eligible && event.sourceChain.length === 0).length },
    cost: { ...report.cost, p50LatencyMs: p(0.5), p95LatencyMs: p(0.95) },
    routeDistribution: report.stats.routeCounts,
  };
}

const corpus = JSON.parse(await readFile(corpusUrl, "utf8")) as EventReplayCorpus;
const validation = JSON.parse(await readFile(validationUrl, "utf8")) as { status: string; gateReady?: boolean; counts?: { policyAudited?: number; independentlyReviewed?: number }; gateBlockers?: string[] };
if (validation.status !== "passed") throw new Error("history-v1 corpus validation must pass before replay");
const report = await runShadowPipeline(buildResults(corpus), corpus.sources, { generatedAt: corpus.generated_at, strategyVersion: "atlas-event-v2-replay" });
const metrics = validation.gateReady === true ? calculateMetrics(corpus, report) : null;
const output = {
  schemaVersion: "atlas-event-replay-report.v1",
  generatedAt: new Date().toISOString(),
  corpusId: corpus.corpus_id,
  status: report.status,
  gateStatus: validation.gateReady === true ? "eligible" : "blocked-unaudited-labels",
  strategyVersion: report.strategyVersion,
  fixture: { observations: corpus.observations.length, candidateEvents: corpus.frozen_events.length, clusteredEvents: report.events.length, sources: corpus.sources.length },
  labelGate: {
    policyAudited: validation.counts?.policyAudited ?? 0,
    independentlyReviewed: validation.counts?.independentlyReviewed ?? 0,
    required: 240,
    requiredReviewType: "automated-policy-audit-or-human",
    pass: validation.gateReady === true,
    blockers: validation.gateBlockers ?? [],
  },
  metrics,
  report: {
    stats: report.stats,
    failures: report.failures,
    cost: report.cost,
    sourceHealth: report.sourceHealth,
    events: report.events,
  },
  productionTouched: false,
};
const outputPath = fileURLToPath(outputUrl);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify(output, null, 2));
