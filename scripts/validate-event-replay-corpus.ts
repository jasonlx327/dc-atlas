import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { EventReplayCorpus } from "./build-event-replay-corpus.ts";
import type { Route } from "../worker/event-intelligence/pipeline.ts";

const corpusUrl = new URL("./fixtures/event-intelligence/history-v1.json", import.meta.url);
const reportUrl = new URL("../artifacts/event-intelligence/replay-corpus-validation.json", import.meta.url);

const routes: Route[] = ["rumor-watch", "pulse", "policy-index", "research-queue", "hold", "rejected"];
const evidenceStatuses = ["lead", "reported", "official_response", "officially_confirmed"];
const capacityTypes = ["total_power", "utility_power", "it_capacity", "gpu_nameplate_compute", "leased_capacity", "unspecified_capacity"];

function increment(map: Record<string, number>, key: string): void {
  map[key] = (map[key] ?? 0) + 1;
}

function validate(corpus: EventReplayCorpus) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const gateBlockers: string[] = [];
  const observations = new Map(corpus.observations.map((observation) => [observation.id, observation]));
  const sources = new Map(corpus.sources.map((source) => [source.id, source]));
  const fixtureIds = new Set<string>();
  const observationIds = new Set<string>();
  const canonicalGroups = new Map<string, Set<string>>();
  const canonicalEvents = new Map<string, Set<string>>();
  const routeCounts: Record<string, number> = {};
  const tierCounts: Record<string, number> = {};
  const coverageCounts: Record<string, number> = {};

  if (corpus.schema_version !== "atlas-event-replay.v1") errors.push(`schema_version=${corpus.schema_version}`);
  if (corpus.corpus_id !== "history-v1") errors.push(`corpus_id=${corpus.corpus_id}`);
  if (corpus.provenance.model_calls !== 0) errors.push("fixture labels claim model calls");
  if (corpus.provenance.production_touched !== false) errors.push("fixture provenance says production was touched");
  if (corpus.frozen_events.length < 240) gateBlockers.push(`structured candidate events=${corpus.frozen_events.length}, need >=240 before review coverage can be complete`);
  if (corpus.frozen_events.length > 360) warnings.push(`candidate event count=${corpus.frozen_events.length}; review plan targets 240-360`);
  if (corpus.observations.length < corpus.frozen_events.length) errors.push("observations fewer than frozen events");

  for (const observation of corpus.observations) {
    if (observationIds.has(observation.id)) errors.push(`duplicate observation id ${observation.id}`);
    observationIds.add(observation.id);
    if (!observation.canonicalUrl || !/^https?:\/\//.test(observation.canonicalUrl)) errors.push(`${observation.id}: missing canonical URL`);
    if (!observation.titleOriginal.trim()) errors.push(`${observation.id}: missing original title`);
    if (!sources.has(observation.sourceId)) errors.push(`${observation.id}: source ${observation.sourceId} missing`);
    const source = sources.get(observation.sourceId);
    const group = source?.independenceGroup ?? observation.sourceId;
    const canonical = observation.canonicalUrl;
    canonicalGroups.set(canonical, new Set([...(canonicalGroups.get(canonical) ?? []), group]));
    canonicalEvents.set(canonical, new Set([...(canonicalEvents.get(canonical) ?? []), observation.id]));
    if (source) increment(tierCounts, source.tier);
  }

  for (const [canonical, groups] of canonicalGroups) {
    if (groups.size > 1) errors.push(`canonical URL counted across independence groups: ${canonical} -> ${[...groups].join(", ")}`);
  }

  for (const event of corpus.frozen_events) {
    if (fixtureIds.has(event.fixture_id)) errors.push(`duplicate fixture id ${event.fixture_id}`);
    fixtureIds.add(event.fixture_id);
    if (!/^[a-f0-9]{32}$/.test(event.label_hash)) errors.push(`${event.fixture_id}: missing or invalid label hash`);
    if (!routes.includes(event.expected_route)) errors.push(`${event.fixture_id}: invalid route ${event.expected_route}`);
    if (!evidenceStatuses.includes(event.expected_evidence_status)) errors.push(`${event.fixture_id}: invalid evidence status ${event.expected_evidence_status}`);
    if (!event.label_basis.length) errors.push(`${event.fixture_id}: fixture is not traceable`);
    if (event.label_status === "frozen" && !event.label_basis.includes("independent-human-review")) errors.push(`${event.fixture_id}: frozen label has no independent human review`);
    if (event.label_status === "audited" && !event.label_basis.includes("automated-policy-audit")) errors.push(`${event.fixture_id}: audited label has no policy-audit record`);
    if (!event.source_observation_ids.length) errors.push(`${event.fixture_id}: no source observations`);
    for (const observationId of event.source_observation_ids) {
      const observation = observations.get(observationId);
      if (!observation) {
        errors.push(`${event.fixture_id}: missing observation ${observationId}`);
        continue;
      }
      if (observation.eventKey !== event.expected_event_key) errors.push(`${event.fixture_id}: expected event key does not match observation ${observationId}`);
      if (observation.sourceId !== event.expected_primary_source_id) errors.push(`${event.fixture_id}: primary source does not match observation ${observationId}`);
    }
    for (const member of event.expected_cluster_members) {
      const memberObservation = observations.get(member);
      if (!memberObservation) errors.push(`${event.fixture_id}: cluster member ${member} is missing`);
      else if (memberObservation.eventKey !== event.expected_event_key) errors.push(`${event.fixture_id}: cluster member ${member} has a different event key`);
    }
    increment(routeCounts, event.expected_route);
    if (event.label_status === "audited" || event.label_status === "frozen") for (const [key, value] of Object.entries(event.coverage)) if (value) increment(coverageCounts, key);
    const tier = observations.get(event.source_observation_ids[0])?.sourceId ? sources.get(observations.get(event.source_observation_ids[0])?.sourceId ?? "")?.tier : undefined;
    if ((tier === "T2" || tier === "T3") && event.expected_route === "pulse") errors.push(`${event.fixture_id}: media source routed to Pulse`);
    if (event.expected_route === "policy-index" && tier !== "T0") errors.push(`${event.fixture_id}: non-T0 policy route`);
    if (event.expected_public_eligible && !event.source_observation_ids.length) errors.push(`${event.fixture_id}: public event has no source`);
    for (const fact of event.expected_capacity_facts) {
      if (!fact.value_text || !fact.qualifier || !capacityTypes.includes(fact.capacity_type)) errors.push(`${event.fixture_id}: incomplete capacity boundary fact`);
    }
  }

  const duplicateGroups = [...canonicalEvents.values()].filter((events) => events.size > 1).length;
  if (duplicateGroups < 40) errors.push(`only ${duplicateGroups} duplicate/syndication groups found; need at least 40`);
  const minimumCoverage: Record<string, number> = {
    primary_event: 50,
    media_event: 40,
    duplicate_or_syndication: 40,
    negative_ai_keyword: 30,
    capacity_boundary: 40,
    bilingual_pair: 20,
    timeline_response: 20,
  };
  const policyAudited = corpus.frozen_events.filter((event) => event.label_status === "audited" || event.label_status === "frozen").length;
  const independentlyReviewed = corpus.frozen_events.filter((event) => event.label_status === "frozen").length;
  if (policyAudited < 240) gateBlockers.push(`policy-audited events=${policyAudited}, need >=240`);
  for (const [key, minimum] of Object.entries(minimumCoverage)) if ((coverageCounts[key] ?? 0) < minimum) gateBlockers.push(`reviewed coverage ${key}=${coverageCounts[key] ?? 0}, need >=${minimum}`);
  if ((coverageCounts.primary_event ?? 0) < 50 || (coverageCounts.media_event ?? 0) < 40) warnings.push("tier distribution is based on source records, not independent-source count");

  const result = {
    schemaVersion: "atlas-event-replay-validation.v1",
    generatedAt: new Date().toISOString(),
    corpusId: corpus.corpus_id,
    status: errors.length ? "failed" : "passed",
    gateReady: errors.length === 0 && gateBlockers.length === 0,
    errors,
    warnings,
    gateBlockers,
    counts: {
      candidateEvents: corpus.frozen_events.length,
      policyAudited,
      independentlyReviewed,
      observations: corpus.observations.length,
      sources: corpus.sources.length,
      duplicateGroups,
      routeCounts,
      tierCounts,
      coverageCounts,
    },
    safety: {
      mediaToPulse: corpus.frozen_events.filter((event) => event.coverage.media_event && event.expected_route === "pulse").length,
      nonT0PolicyRoutes: corpus.frozen_events.filter((event) => event.expected_route === "policy-index" && sources.get(observations.get(event.source_observation_ids[0])?.sourceId ?? "")?.tier !== "T0").length,
      incompleteCapacityFacts: corpus.frozen_events.flatMap((event) => event.expected_capacity_facts.filter((fact) => !fact.qualifier || fact.capacity_type === "unspecified_capacity")).length,
      sourceLessPublic: corpus.frozen_events.filter((event) => event.expected_public_eligible && event.source_observation_ids.length === 0).length,
    },
  };
  return result;
}

const corpus = JSON.parse(await readFile(corpusUrl, "utf8")) as EventReplayCorpus;
const result = validate(corpus);
const reportPath = fileURLToPath(reportUrl);
await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
if (result.status !== "passed") process.exitCode = 1;
