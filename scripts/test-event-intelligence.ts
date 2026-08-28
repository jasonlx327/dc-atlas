import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { persistShadowReport } from "./run-event-intelligence-shadow.ts";
import { canonicalizeUrl, runShadowPipeline } from "../worker/event-intelligence/pipeline.ts";
import { beijingLabel, dispatchEventIntelligenceSchedule, eventIntelligenceSchedule, jobForUtcSlot, newYorkLabel } from "../worker/event-intelligence/schedule.ts";
import { fetchRegisteredSource, shadowSources, sourceRegistry, sourceRegistryById } from "../worker/connectors/index.ts";
import type { ConnectorResult, ObservationEnvelope } from "../worker/connectors/types.ts";

const fixtureUrl = new URL("./fixtures/event-intelligence/core-cases.json", import.meta.url);
const observations = JSON.parse(await readFile(fixtureUrl, "utf8")) as ObservationEnvelope[];
const groups = new Map<string, ObservationEnvelope[]>();
for (const observation of observations) {
  const key = `${observation.sourceId}/${observation.endpointId}`;
  groups.set(key, [...(groups.get(key) ?? []), observation]);
}
const results: ConnectorResult[] = [...groups.entries()].map(([key, items]) => {
  const [sourceId, endpointId] = key.split("/");
  assert.ok(sourceId && endpointId);
  return { status: "ok", sourceId, endpointId, fetchedAt: "2026-08-08T14:00:00.000Z", httpStatus: 200, responseMs: 1, observations: items };
});
const report = await runShadowPipeline(results, sourceRegistry, { generatedAt: "2026-08-08T14:00:00.000Z" });
const enabledSources = shadowSources();
assert.ok(enabledSources.length >= 50, "runtime source coverage should use the broad enabled registry");
for (const sourceId of ["cninfo", "sse", "ndrc", "semi-analysis", "capacity-media", "google-news-data-center", "google-news-cn-infrastructure", "google-news-cn-policy"]) {
  assert.ok(enabledSources.some((source) => source.id === sourceId), `${sourceId} should be enabled for runtime collection`);
}

assert.equal(canonicalizeUrl("https://example.com/story?utm_source=x&b=2&a=1#fragment"), "https://example.com/story?a=1&b=2");
assert.equal(report.stats.fetched, 12);
assert.equal(report.stats.duplicates, 1);
assert.equal(report.stats.clusters, 7);
assert.equal(report.events.find((event) => event.eventKey.startsWith("cloud-company|"))?.route, "rumor-watch");
assert.equal(report.events.find((event) => event.eventKey.startsWith("us-policy|"))?.route, "pulse");
assert.equal(report.events.find((event) => event.eventKey.startsWith("us-policy|"))?.reasonCodes?.includes("material-official-policy-routes-to-pulse"), true);
assert.equal(report.events.filter((event) => event.route === "pulse" && event.sourceTiers.every((tier) => tier !== "T0" && tier !== "T1")).length, 0);
assert.equal(report.events.filter((event) => event.eligible).flatMap((event) => event.facts).filter((fact) => fact.factType === "capacity" && (!fact.qualifier || !fact.capacityType)).length, 0);
assert.equal(report.events.find((event) => event.eventKey.startsWith("nvidia|capacity-plan|other-campus"))?.route, "hold");

function observation(overrides: Partial<ObservationEnvelope> & Pick<ObservationEnvelope, "sourceId" | "endpointId" | "titleOriginal" | "summaryOriginal">): ObservationEnvelope {
  return {
    canonicalUrl: `https://example.com/${crypto.randomUUID()}`,
    originalUrl: `https://example.com/${crypto.randomUUID()}`,
    language: "en-US",
    discoveredAt: "2026-08-08T12:00:00.000Z",
    fetchedAt: "2026-08-08T12:01:00.000Z",
    publishedAt: "2026-08-08T11:00:00.000Z",
    rawPayload: { stance: "reports" },
    accessStatus: "public",
    entities: ["NVIDIA"],
    locations: ["United States"],
    topics: ["data centers", "capacity"],
    eventType: "capacity-agreement",
    ...overrides,
  };
}

const persistenceSource = sourceRegistryById.get("nvidia")!;
const persistenceExternalId = "shadow-persistence-url-drift";
const persistenceResult = (canonicalUrl: string, fetchedAt: string): ConnectorResult[] => [{
  status: "ok",
  sourceId: persistenceSource.id,
  endpointId: persistenceSource.endpoint.id,
  fetchedAt,
  observations: [observation({
    sourceId: persistenceSource.id,
    endpointId: persistenceSource.endpoint.id,
    canonicalUrl,
    originalUrl: canonicalUrl,
    externalId: persistenceExternalId,
    titleOriginal: "NVIDIA launches a data-center GPU platform",
    summaryOriginal: "NVIDIA launched a new GPU platform for data-center infrastructure.",
    entities: ["NVIDIA"],
    eventType: "product-release",
  })],
}];
const firstPersistenceResults = persistenceResult("https://www.nvidia.com/news/first-url", "2026-08-08T12:01:00.000Z");
const secondPersistenceResults = persistenceResult("https://www.nvidia.com/news/updated-url", "2026-08-08T13:01:00.000Z");
const firstPersistenceReport = await runShadowPipeline(firstPersistenceResults, sourceRegistry, { generatedAt: "2026-08-08T12:02:00.000Z" });
const secondPersistenceReport = await runShadowPipeline(secondPersistenceResults, sourceRegistry, { generatedAt: "2026-08-08T13:02:00.000Z" });
const duplicatePersistenceReport = await runShadowPipeline([{
  ...firstPersistenceResults[0],
  observations: [...firstPersistenceResults[0].observations, ...secondPersistenceResults[0].observations],
}], sourceRegistry, { generatedAt: "2026-08-08T14:02:00.000Z" });
assert.equal(duplicatePersistenceReport.stats.duplicates, 1, "same-source external IDs should deduplicate even when the canonical URL drifts");

const persistenceTempDir = await mkdtemp(join(tmpdir(), "idc-atlas-shadow-persistence-"));
const persistenceDbPath = join(persistenceTempDir, "shadow.sqlite");
const migration = await readFile(new URL("../drizzle/0000_event_intelligence.sql", import.meta.url), "utf8");
try {
  persistShadowReport(firstPersistenceReport, firstPersistenceResults, sourceRegistry, persistenceDbPath, migration, "fixture-first");
  persistShadowReport(secondPersistenceReport, secondPersistenceResults, sourceRegistry, persistenceDbPath, migration, "fixture-second");
  const persistenceDb = new DatabaseSync(persistenceDbPath);
  try {
    const rows = persistenceDb.prepare("SELECT id, canonical_url FROM observations WHERE source_id = ? AND external_id = ?").all(persistenceSource.id, persistenceExternalId) as Array<{ id: string; canonical_url: string }>;
    assert.equal(rows.length, 1, "URL drift must update one observation instead of violating the source/external ID constraint");
    assert.equal(rows[0]?.id, firstPersistenceReport.observationAnalysis[0]?.id, "persisted observation identity should remain stable");
    assert.equal(rows[0]?.canonical_url, "https://www.nvidia.com/news/updated-url");
  } finally {
    persistenceDb.close();
  }
} finally {
  await rm(persistenceTempDir, { recursive: true, force: true });
}

const regressionResults: ConnectorResult[] = [{
  status: "ok",
  sourceId: "mixed-regression",
  endpointId: "mixed-regression-endpoint",
  fetchedAt: "2026-08-08T12:01:00.000Z",
  observations: [
    observation({ sourceId: "reuters", endpointId: "reuters-endpoint", titleOriginal: "NVIDIA signs 1GW data-center agreement", summaryOriginal: "NVIDIA signed a contract for a 1 GW planned campus." }),
    observation({ sourceId: "data-center-dynamics", endpointId: "data-center-dynamics-endpoint", titleOriginal: "One-gigawatt campus deal reached by NVIDIA", summaryOriginal: "The agreement covers a planned one-gigawatt data center." }),
    observation({ sourceId: "federal-register", endpointId: "federal-register-endpoint", titleOriginal: "NVIDIA launches new GPU", summaryOriginal: "A GPU launch notice without an infrastructure mechanism.", eventType: "product-release", locations: [] }),
    observation({ sourceId: "nvidia", endpointId: "nvidia-endpoint", titleOriginal: "Planned data center total power 500MW", summaryOriginal: "NVIDIA describes planned total power of 500 MW for the campus.", eventType: "capacity-plan" }),
    observation({ sourceId: "power-magazine", endpointId: "power-magazine-endpoint", titleOriginal: "Audit could delay 49.8GW of data center load", summaryOriginal: "The queue includes 49.8 GW of data center load; the 49.8GW total is under audit.", entities: ["ERCOT"], eventType: "capacity-report" }),
    observation({ sourceId: "aws-news", endpointId: "aws-news-endpoint", titleOriginal: "AWS Config now supports 15 new resource types", summaryOriginal: "A routine cloud product update.", entities: ["Amazon"], locations: [], eventType: "cloud-feature" }),
    observation({ sourceId: "aws-news", endpointId: "aws-news-endpoint", titleOriginal: "AWS launches Context Ontology Accelerator", summaryOriginal: "A software accelerator for organizing cloud context.", entities: ["Amazon"], locations: [], eventType: "cloud-feature" }),
    observation({ sourceId: "aws-news", endpointId: "aws-news-endpoint", titleOriginal: "Amazon ECS supports fractional GPU scheduling with EC2 G6f", summaryOriginal: "The hardware update adds GPU scheduling for infrastructure workloads.", entities: ["Amazon"], locations: [], eventType: "hardware-release" }),
    observation({ sourceId: "amd", endpointId: "amd-endpoint", canonicalUrl: "https://newsroom.amd.com/", originalUrl: "https://newsroom.amd.com/", titleOriginal: "AMD Newsroom", summaryOriginal: "Artificial intelligence and data center news.", publishedAt: null, eventType: "html-update" }),
  ],
}];
const regression = await runShadowPipeline(regressionResults, sourceRegistry, { generatedAt: "2026-08-08T14:00:00.000Z" });
const merged = regression.events.find((event) => event.sourceChain.length === 2);
assert.ok(merged, "independent headlines describing the same event should cluster");
assert.equal(merged.independentSourceCount, 2);
assert.equal(merged.sourceChain.filter((source) => source.relationship === "confirmation").length, 1);
const uncertain = regression.events.find((event) => event.titleEn.includes("launches new GPU"));
assert.equal(uncertain?.route, "hold");
assert.equal(uncertain?.eligible, false);
const totalPowerFacts = regression.events.flatMap((event) => event.facts).filter((fact) => fact.valueNumber === 500 && fact.unit?.toLocaleLowerCase() === "mw");
assert.equal(totalPowerFacts.length, 1);
assert.equal(totalPowerFacts[0]?.capacityType, "total_power");
assert.equal(totalPowerFacts[0]?.qualifier, "proposed");
const repeatedLoadFacts = regression.events.flatMap((event) => event.facts).filter((fact) => fact.valueNumber === 49.8 && fact.unit?.toLocaleLowerCase() === "gw");
assert.equal(repeatedLoadFacts.length, 1);
assert.equal(repeatedLoadFacts[0]?.capacityType, "it_capacity");
assert.equal(regression.events.some((event) => event.titleEn.includes("AWS Config")), false);
assert.equal(regression.events.some((event) => event.titleEn.includes("Context Ontology")), false);
assert.equal(regression.events.some((event) => event.titleEn.includes("fractional GPU")), true);
assert.equal(regression.events.some((event) => event.titleEn === "AMD Newsroom"), false);

const clusteringV2Results: ConnectorResult[] = [{
  status: "ok",
  sourceId: "clustering-v2",
  endpointId: "clustering-v2-endpoint",
  fetchedAt: "2026-08-08T12:01:00.000Z",
  observations: [
    observation({ sourceId: "zh-source-a", endpointId: "zh-a", language: "zh-CN", titleOriginal: "英伟达在俄勒冈签署数据中心长期供电协议", summaryOriginal: "英伟达与园区签订长期数据中心电力供应协议。", entities: ["NVIDIA"], locations: ["Oregon"], publishedAt: "2026-08-08T08:00:00.000Z" }),
    observation({ sourceId: "zh-source-b", endpointId: "zh-b", language: "zh-CN", titleOriginal: "英伟达与俄勒冈园区签订长期数据中心电力协议", summaryOriginal: "这份供电协议覆盖英伟达在俄勒冈的数据中心园区。", entities: ["NVIDIA"], locations: ["Oregon"], publishedAt: "2026-08-08T09:00:00.000Z" }),
    observation({ sourceId: "en-source", endpointId: "en-source", titleOriginal: "NVIDIA signs 300MW Texas data-center power agreement", summaryOriginal: "The 300 MW planned campus power agreement covers NVIDIA's Texas site.", rawPayload: { stance: "reports", titleZh: "英伟达签署德州300MW数据中心供电协议", summaryZh: "这份300MW园区供电协议覆盖英伟达的德州场址。" }, entities: ["NVIDIA"], locations: ["Texas"], publishedAt: "2026-08-08T10:00:00.000Z" }),
    observation({ sourceId: "zh-source-c", endpointId: "zh-c", language: "zh-CN", titleOriginal: "英伟达签署德州300MW数据中心供电协议", summaryOriginal: "英伟达确认德州园区规划300MW供电。", rawPayload: { stance: "reports", titleEn: "NVIDIA signs 300MW Texas data-center power agreement", summaryEn: "NVIDIA confirms 300 MW of planned power for the Texas campus." }, entities: ["NVIDIA"], locations: ["Texas"], publishedAt: "2026-08-08T10:30:00.000Z" }),
    observation({ sourceId: "chain-a", endpointId: "chain-a", titleOriginal: "NVIDIA signs 100MW Nevada data-center agreement", summaryOriginal: "The contract covers a planned 100 MW Nevada data center.", entities: ["NVIDIA"], locations: ["Nevada"], publishedAt: "2026-08-08T07:00:00.000Z" }),
    observation({ sourceId: "chain-b", endpointId: "chain-b", titleOriginal: "NVIDIA reaches Nevada data-center agreement", summaryOriginal: "The contract covers a planned Nevada data-center campus.", entities: ["NVIDIA"], locations: ["Nevada"], publishedAt: "2026-08-08T07:30:00.000Z" }),
    observation({ sourceId: "chain-c", endpointId: "chain-c", titleOriginal: "NVIDIA signs 200MW Nevada data-center agreement", summaryOriginal: "The contract covers a planned 200 MW Nevada data center.", entities: ["NVIDIA"], locations: ["Nevada"], publishedAt: "2026-08-08T08:00:00.000Z" }),
    observation({ sourceId: "delta-a", endpointId: "delta-a", titleOriginal: "AMD signs 500MW Arizona data-center agreement", summaryOriginal: "AMD signed a planned 500 MW campus agreement.", entities: ["AMD"], locations: ["Arizona"], publishedAt: "2026-08-08T06:00:00.000Z" }),
    observation({ sourceId: "delta-b", endpointId: "delta-b", titleOriginal: "AMD reaches 500MW Arizona campus deal worth $5 billion", summaryOriginal: "The planned 500 MW agreement carries a reported $5 billion value.", entities: ["AMD"], locations: ["Arizona"], publishedAt: "2026-08-08T07:00:00.000Z" }),
    observation({ sourceId: "delta-c", endpointId: "delta-c", titleOriginal: "AMD responds to 500MW Arizona data-center agreement report", summaryOriginal: "AMD responded to reporting about the planned 500 MW agreement.", rawPayload: { stance: "responds" }, entities: ["AMD"], locations: ["Arizona"], publishedAt: "2026-08-08T08:00:00.000Z" }),
  ],
}];
const clusteringV2 = await runShadowPipeline(clusteringV2Results, sourceRegistry, { generatedAt: "2026-08-08T14:00:00.000Z" });
const chineseCluster = clusteringV2.events.find((event) => event.sourceChain.some((source) => source.sourceId === "zh-source-a"));
assert.equal(chineseCluster?.sourceChain.length, 2, "Chinese near-duplicate headlines should cluster without whitespace tokenization");
const bilingualCluster = clusteringV2.events.find((event) => event.sourceChain.some((source) => source.sourceId === "en-source"));
assert.equal(bilingualCluster?.sourceChain.length, 2, "recorded bilingual pairs should support cross-language clustering");
const chainClusters = clusteringV2.events.filter((event) => event.sourceChain.some((source) => source.sourceId.startsWith("chain-")));
assert.equal(chainClusters.length, 2, "incompatible capacity anchors must not merge through a bridge observation");
assert.equal(chainClusters.some((event) => event.sourceChain.some((source) => source.sourceId === "chain-a") && event.sourceChain.some((source) => source.sourceId === "chain-c")), false);
const deltaCluster = clusteringV2.events.find((event) => event.sourceChain.some((source) => source.sourceId === "delta-a"));
assert.equal(deltaCluster?.sourceChain.length, 3);
assert.equal(deltaCluster?.sourceChain.find((source) => source.sourceId === "delta-b")?.noveltyClass, "new-detail");
assert.ok((deltaCluster?.sourceChain.find((source) => source.sourceId === "delta-b")?.newFactCount ?? 0) > 0);
assert.equal(deltaCluster?.sourceChain.find((source) => source.sourceId === "delta-c")?.noveltyClass, "official-response");

const scheduleCases = [
  [new Date("2026-08-08T21:30:00Z"), "event-night"],
  [new Date("2026-08-08T04:30:00Z"), "event-midday"],
  [new Date("2026-08-08T22:00:00Z"), "snapshot-daily"],
  [new Date("2026-08-08T22:30:00Z"), "daily-closure"],
  [new Date("2026-08-08T12:30:00Z"), "event-day"],
] as const;
for (const [date, expected] of scheduleCases) assert.equal(jobForUtcSlot(date), expected);
assert.equal(jobForUtcSlot(new Date("2026-08-08T12:00:00Z")), null);
assert.equal(new Set(eventIntelligenceSchedule.map((item) => item.job)).size, 5);
assert.match(beijingLabel(new Date("2026-08-08T21:30:00Z")), /08\/09|8\/9/);
assert.match(newYorkLabel(new Date("2026-01-15T15:00:00Z")), /10:00/);
assert.match(newYorkLabel(new Date("2026-07-15T15:00:00Z")), /11:00/);
const dispatched: string[] = [];
const handlers = {
  "event-night": async () => { dispatched.push("event-night"); },
  "event-midday": async () => { dispatched.push("event-midday"); },
  "snapshot-daily": async () => { dispatched.push("snapshot-daily"); },
  "daily-closure": async () => { dispatched.push("daily-closure"); },
  "event-day": async () => { dispatched.push("event-day"); },
};
for (const [date] of scheduleCases) await dispatchEventIntelligenceSchedule(date, handlers);
assert.deepEqual(dispatched, ["event-night", "event-midday", "snapshot-daily", "daily-closure", "event-day"]);

const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async () => new Response('<html><head><meta property="og:title" content="FERC opens data-center interconnection rule"><meta property="og:description" content="The rule covers data-center power and grid interconnection."><link rel="canonical" href="https://www.ferc.gov/example"></head></html>', { status: 200, headers: { "content-type": "text/html" } });
  const htmlResult = await fetchRegisteredSource(sourceRegistryById.get("ferc")!);
  assert.equal(htmlResult.status, "ok");
  assert.equal(htmlResult.observations[0]?.canonicalUrl, "https://www.ferc.gov/example");
  const licensed = await fetchRegisteredSource(sourceRegistryById.get("reuters")!);
  assert.equal(licensed.status, "blocked");
  globalThis.fetch = async () => new Response("<rss><channel><item><description>missing title and link</description></item></channel></rss>", { status: 200, headers: { "content-type": "application/rss+xml" } });
  const parseError = await fetchRegisteredSource(sourceRegistryById.get("google-cloud")!);
  assert.equal(parseError.status, "parse-error");
  globalThis.fetch = async () => new Response("<rss><channel><title>Empty feed</title></channel></rss>", { status: 200, headers: { "content-type": "application/rss+xml" } });
  const emptyFeed = await fetchRegisteredSource(sourceRegistryById.get("google-cloud")!);
  assert.equal(emptyFeed.status, "empty");
  let ifNoneMatch: string | null = null;
  let ifModifiedSince: string | null = null;
  globalThis.fetch = async (_input, init) => {
    const headers = new Headers(init?.headers);
    ifNoneMatch = headers.get("if-none-match");
    ifModifiedSince = headers.get("if-modified-since");
    return new Response(null, { status: 304, headers: { etag: '"next"' } });
  };
  const notModified = await fetchRegisteredSource(sourceRegistryById.get("google-cloud")!, { requestState: { etag: '"prior"', lastModified: "Sat, 08 Aug 2026 12:00:00 GMT" } });
  assert.equal(notModified.status, "not-modified");
  assert.equal(ifNoneMatch, '"prior"');
  assert.equal(ifModifiedSince, "Sat, 08 Aug 2026 12:00:00 GMT");
} finally {
  globalThis.fetch = originalFetch;
}

console.log(JSON.stringify({ message: "Event intelligence tests passed", fixtureObservations: report.stats.fetched, clusters: report.stats.clusters, scheduleJobs: eventIntelligenceSchedule.map((item) => item.job) }));
