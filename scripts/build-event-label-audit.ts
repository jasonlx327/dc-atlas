import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { EventReplayCorpus } from "./build-event-replay-corpus.ts";

const corpusUrl = new URL("./fixtures/event-intelligence/history-v1.json", import.meta.url);
const manifestUrl = new URL("./fixtures/event-intelligence/history-v1-label-reviews.json", import.meta.url);
const reportUrl = new URL("../artifacts/event-intelligence/label-audit-report.json", import.meta.url);

type Review = {
  fixture_id: string;
  label_hash: string;
  reviewed_by: string;
  reviewed_at: string;
  source_checks: string[];
  review_type: "automated-policy-audit" | "human";
  decision: "accept" | "reject";
};

type Manifest = {
  schema_version: "atlas-event-label-review.v1";
  corpus_id: "history-v1";
  reviews: Review[];
};

const corpus = JSON.parse(await readFile(corpusUrl, "utf8")) as EventReplayCorpus;
let prior: Manifest = { schema_version: "atlas-event-label-review.v1", corpus_id: "history-v1", reviews: [] };
try {
  prior = JSON.parse(await readFile(manifestUrl, "utf8")) as Manifest;
} catch {
  // The first audit creates the manifest.
}

const observations = new Map(corpus.observations.map((observation) => [observation.id, observation]));
const sources = new Map(corpus.sources.map((source) => [source.id, source]));
const priorByFixture = new Map(prior.reviews.map((review) => [review.fixture_id, review]));
const auditedAt = new Date().toISOString();
const rejectionReasons: Array<{ fixtureId: string; reasons: string[] }> = [];

function audit(event: EventReplayCorpus["frozen_events"][number]): { decision: "accept" | "reject"; sourceChecks: string[]; reasons: string[] } {
  const reasons: string[] = [];
  const sourceChecks: string[] = [];
  if (!event.label_basis.includes("candidate-rule-label") || !event.label_basis.some((item) => item.includes(":"))) reasons.push("missing traceable rule-label basis");
  if (!event.source_observation_ids.length) reasons.push("missing source observation");
  for (const observationId of event.source_observation_ids) {
    const observation = observations.get(observationId);
    if (!observation) {
      reasons.push(`missing observation ${observationId}`);
      continue;
    }
    sourceChecks.push(observation.canonicalUrl);
    if (!/^https?:\/\//.test(observation.canonicalUrl)) reasons.push(`${observationId}: invalid canonical URL`);
    if (observation.eventKey !== event.expected_event_key) reasons.push(`${observationId}: event-key mismatch`);
    const source = sources.get(observation.sourceId);
    if (!source) {
      reasons.push(`${observationId}: source missing`);
      continue;
    }
    if ((source.tier === "T2" || source.tier === "T3") && event.expected_route === "pulse") reasons.push("media source routed to Pulse");
    if (event.expected_route === "policy-index" && source.tier !== "T0") reasons.push("non-T0 source routed to Policy Index");
    if (["D", "T4", "T5"].includes(source.tier) && !["hold", "rejected"].includes(event.expected_route)) reasons.push(`${source.tier} source routed to a public surface`);
  }
  if (event.expected_primary_source_id !== observations.get(event.source_observation_ids[0] ?? "")?.sourceId) reasons.push("primary-source mismatch");
  if (event.expected_public_eligible && (!event.source_observation_ids.length || event.expected_bilingual_state !== "complete" || ["hold", "rejected"].includes(event.expected_route))) reasons.push("invalid public-eligibility label");
  for (const fact of event.expected_capacity_facts) {
    if (!fact.value_text || !fact.qualifier || fact.capacity_type === "unspecified_capacity") reasons.push("incomplete capacity-boundary label");
  }
  return { decision: reasons.length ? "reject" : "accept", sourceChecks: [...new Set(sourceChecks)], reasons };
}

const generatedReviews: Review[] = [];
for (const event of corpus.frozen_events) {
  const result = audit(event);
  if (result.decision === "reject") rejectionReasons.push({ fixtureId: event.fixture_id, reasons: result.reasons });
  const previous = priorByFixture.get(event.fixture_id);
  if (previous?.review_type === "human" && previous.label_hash === event.label_hash) {
    generatedReviews.push(previous);
    continue;
  }
  generatedReviews.push({
    fixture_id: event.fixture_id,
    label_hash: event.label_hash,
    reviewed_by: "atlas-policy-audit-v1",
    reviewed_at: previous?.label_hash === event.label_hash && previous.review_type === "automated-policy-audit" ? previous.reviewed_at : auditedAt,
    source_checks: result.sourceChecks,
    review_type: "automated-policy-audit",
    decision: result.decision,
  });
}

const manifest: Manifest = { schema_version: "atlas-event-label-review.v1", corpus_id: "history-v1", reviews: generatedReviews };
await mkdir(dirname(fileURLToPath(manifestUrl)), { recursive: true });
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const report = {
  schemaVersion: "atlas-event-label-audit.v1",
  generatedAt: auditedAt,
  corpusId: corpus.corpus_id,
  reviewerType: "automated-policy-audit",
  reviewer: "atlas-policy-audit-v1",
  candidateLabels: corpus.frozen_events.length,
  acceptedLabels: generatedReviews.filter((review) => review.decision === "accept").length,
  rejectedLabels: generatedReviews.filter((review) => review.decision === "reject").length,
  humanReviewedLabels: generatedReviews.filter((review) => review.review_type === "human" && review.decision === "accept").length,
  rejectionReasons,
  boundary: "This is a deterministic second-pass policy audit, not an independent human review.",
  productionTouched: false,
};
await mkdir(dirname(fileURLToPath(reportUrl)), { recursive: true });
await writeFile(reportUrl, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
