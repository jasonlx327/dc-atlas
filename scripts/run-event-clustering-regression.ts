import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConnectorResult } from "../worker/connectors/types.ts";
import { runShadowPipeline } from "../worker/event-intelligence/pipeline.ts";
import type { EventReplayCorpus, ReplayObservation } from "./build-event-replay-corpus.ts";

const corpusUrl = new URL("./fixtures/event-intelligence/history-v1.json", import.meta.url);
const validationUrl = new URL("../artifacts/event-intelligence/replay-corpus-validation.json", import.meta.url);
const outputUrl = new URL("../artifacts/event-intelligence/clustering-regression.json", import.meta.url);

type RegressionCase = {
  caseId: string;
  category: "exact-canonical-dedup" | "same-event-cross-source" | "separate-events";
  inputObservationIds: string[];
  inputCanonicalUrls: string[];
  expectedSameEvent: boolean;
  expectedEventKey: string | null;
  expectedRelationship: "deduplicated" | "syndication" | "translation" | "confirmation" | "separate-event";
  actualEventKeys: string[];
  actualClusterCount: number;
  actualRelationships: string[];
  pass: boolean;
  note: string;
};

function buildResults(observations: ReplayObservation[]): ConnectorResult[] {
  const groups = new Map<string, ReplayObservation[]>();
  for (const observation of observations) {
    const key = `${observation.sourceId}/${observation.endpointId}`;
    groups.set(key, [...(groups.get(key) ?? []), observation]);
  }
  return [...groups.entries()].map(([key, items]) => {
    const [sourceId, endpointId] = key.split("/");
    return { status: "ok", sourceId, endpointId, fetchedAt: "2026-08-09T00:00:00.000Z", httpStatus: 200, responseMs: 0, observations: items };
  });
}

async function evaluate(
  corpus: EventReplayCorpus,
  candidate: ReplayObservation[],
  expectedSameEvent: boolean,
  category: RegressionCase["category"],
  expectedRelationship: RegressionCase["expectedRelationship"],
  caseId: string,
): Promise<RegressionCase> {
  const report = await runShadowPipeline(buildResults(candidate), corpus.sources, { generatedAt: "2026-08-09T00:00:00.000Z", strategyVersion: "atlas-event-v2-cluster-regression" });
  const candidateUrls = new Set(candidate.flatMap((observation) => [observation.canonicalUrl, observation.originalUrl]));
  const events = report.events.filter((event) => event.sourceChain.some((source) => candidateUrls.has(source.url)));
  const actualEventKeys = [...new Set(events.map((event) => event.eventKey))];
  const actualSameEvent = actualEventKeys.length === 1 && events.length === 1;
  const actualRelationships = [...new Set(events.flatMap((event) => event.sourceChain.map((source) => source.relationship)))];
  const clusterPass = expectedSameEvent ? actualSameEvent : actualEventKeys.length >= 2;
  const relationshipPass = expectedRelationship === "deduplicated" || expectedRelationship === "separate-event" || actualRelationships.includes(expectedRelationship);
  const pass = clusterPass && relationshipPass;
  return {
    caseId,
    category,
    inputObservationIds: candidate.map((observation) => observation.id),
    inputCanonicalUrls: candidate.map((observation) => observation.canonicalUrl),
    expectedSameEvent,
    expectedEventKey: expectedSameEvent ? candidate[0]?.eventKey ?? null : null,
    expectedRelationship,
    actualEventKeys,
    actualClusterCount: events.length,
    actualRelationships,
    pass,
    note: pass ? "cluster behavior and source relationship matched the fixed case expectation" : `expected ${expectedSameEvent ? "one event" : "separate events"} with ${expectedRelationship}, observed ${events.length} clusters and ${actualRelationships.join(",") || "no relationships"}`,
  };
}

const corpus = JSON.parse(await readFile(corpusUrl, "utf8")) as EventReplayCorpus;
const validation = JSON.parse(await readFile(validationUrl, "utf8")) as { status: string; gateReady?: boolean };
if (validation.status !== "passed") throw new Error("history-v1 corpus validation must pass before clustering regression");
const fullReport = await runShadowPipeline(buildResults(corpus.observations), corpus.sources, { generatedAt: corpus.generated_at, strategyVersion: "atlas-event-v2-cluster-regression" });
const relevantUrls = new Set(fullReport.events.flatMap((event) => event.sourceChain.map((source) => source.url)));
const relevant = corpus.observations.filter((observation) => relevantUrls.has(observation.canonicalUrl));
const cases: RegressionCase[] = [];

const canonicalGroups = new Map<string, ReplayObservation[]>();
for (const observation of relevant) canonicalGroups.set(observation.canonicalUrl, [...(canonicalGroups.get(observation.canonicalUrl) ?? []), observation]);
for (const [, observations] of canonicalGroups) {
  if (cases.filter((item) => item.category === "exact-canonical-dedup").length >= 12) break;
  if (observations.length < 2) continue;
  cases.push(await evaluate(corpus, observations.slice(0, 2), true, "exact-canonical-dedup", "deduplicated", `cluster-dedup-${cases.length + 1}`));
}

const eventGroups = new Map<string, ReplayObservation[]>();
for (const observation of relevant) eventGroups.set(observation.eventKey ?? observation.id, [...(eventGroups.get(observation.eventKey ?? observation.id) ?? []), observation]);
for (const observations of eventGroups.values()) {
  if (cases.filter((item) => item.category === "same-event-cross-source").length >= 5) break;
  const byUrl = [...new Map(observations.map((observation) => [observation.canonicalUrl, observation]))]
    .map(([canonicalUrl]) => observations
      .filter((observation) => observation.canonicalUrl === canonicalUrl)
      .sort((left, right) => Number(left.titleOriginal.includes(" source reference ")) - Number(right.titleOriginal.includes(" source reference ")) || right.summaryOriginal.length - left.summaryOriginal.length)[0])
    .filter((observation): observation is ReplayObservation => Boolean(observation));
  if (byUrl.length < 2) continue;
  const candidate = byUrl.slice(0, 2);
  const sourceGroups = candidate.map((observation) => corpus.sources.find((source) => source.id === observation.sourceId)?.independenceGroup ?? observation.sourceId);
  const languageGroups = candidate.map((observation) => observation.language.split("-")[0]);
  const expectedRelationship: RegressionCase["expectedRelationship"] = sourceGroups[0] === sourceGroups[1]
    ? "syndication"
    : languageGroups[0] !== languageGroups[1] ? "translation" : "confirmation";
  cases.push(await evaluate(corpus, candidate, true, "same-event-cross-source", expectedRelationship, `cluster-cross-source-${cases.length + 1}`));
}

const representatives = [...new Map([...fullReport.events].map((event) => [event.eventKey, event])).values()]
  .map((event) => corpus.observations.find((observation) => observation.canonicalUrl === event.sourceChain[0]?.url))
  .filter((observation): observation is ReplayObservation => Boolean(observation));
for (let left = 0; left < representatives.length && cases.filter((item) => item.category === "separate-events").length < 5; left += 1) {
  for (let right = left + 1; right < representatives.length && cases.filter((item) => item.category === "separate-events").length < 5; right += 1) {
    const leftObservation = representatives[left];
    const rightObservation = representatives[right];
    if (!leftObservation || !rightObservation || leftObservation.eventKey === rightObservation.eventKey) continue;
    const candidate = await evaluate(corpus, [leftObservation, rightObservation], false, "separate-events", "separate-event", `cluster-separate-${cases.length + 1}`);
    cases.push(candidate);
  }
}

if (cases.length < 20) throw new Error(`clustering regression contains ${cases.length} cases; need at least 20`);
const selected = cases.slice(0, 20);
const output = {
  schemaVersion: "atlas-event-clustering-regression.v1",
  generatedAt: new Date().toISOString(),
  corpusId: corpus.corpus_id,
  strategyVersion: fullReport.strategyVersion,
  caseCount: selected.length,
  summary: {
    passed: selected.filter((item) => item.pass).length,
    failed: selected.filter((item) => !item.pass).length,
    byCategory: selected.reduce<Record<string, number>>((counts, item) => ({ ...counts, [item.category]: (counts[item.category] ?? 0) + 1 }), {}),
  },
  labelGate: {
    pass: validation.gateReady === true,
    mode: validation.gateReady === true ? "policy-audited" : "provisional-diagnostic",
  },
  cases: selected,
  productionTouched: false,
  writeScope: "local replay artifact only; no production D1, Worker, Sites, KV, public API, or industry-network write",
};
const outputPath = fileURLToPath(outputUrl);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, caseCount: output.caseCount, summary: output.summary }, null, 2));
