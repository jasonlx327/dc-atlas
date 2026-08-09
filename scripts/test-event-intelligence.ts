import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { canonicalizeUrl, runShadowPipeline } from "../worker/event-intelligence/pipeline.ts";
import { beijingLabel, dispatchEventIntelligenceSchedule, eventIntelligenceSchedule, jobForUtcSlot, newYorkLabel } from "../worker/event-intelligence/schedule.ts";
import { fetchRegisteredSource, sourceRegistry, sourceRegistryById } from "../worker/connectors/index.ts";
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
  return { status: "ok", sourceId, endpointId, fetchedAt: "2026-08-08T14:00:00.000Z", httpStatus: 200, responseMs: 1, observations: items };
});
const report = await runShadowPipeline(results, sourceRegistry, { generatedAt: "2026-08-08T14:00:00.000Z" });

assert.equal(canonicalizeUrl("https://example.com/story?utm_source=x&b=2&a=1#fragment"), "https://example.com/story?a=1&b=2");
assert.equal(report.stats.fetched, 12);
assert.equal(report.stats.duplicates, 1);
assert.equal(report.stats.clusters, 7);
assert.equal(report.events.find((event) => event.eventKey.startsWith("cloud-company|"))?.route, "rumor-watch");
assert.equal(report.events.find((event) => event.eventKey.startsWith("us-policy|"))?.route, "pulse");
assert.ok(report.events.find((event) => event.eventKey.startsWith("us-policy|"))?.reasonCodes.includes("material-official-policy-routes-to-pulse"));
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

const scheduleCases = [
  [new Date("2026-08-08T21:30:00Z"), "event-night"],
  [new Date("2026-08-08T22:00:00Z"), "snapshot-daily"],
  [new Date("2026-08-08T09:30:00Z"), "event-day"],
] as const;
for (const [date, expected] of scheduleCases) assert.equal(jobForUtcSlot(date), expected);
assert.equal(jobForUtcSlot(new Date("2026-08-08T12:00:00Z")), null);
assert.equal(new Set(eventIntelligenceSchedule.map((item) => item.job)).size, 3);
assert.match(beijingLabel(new Date("2026-08-08T21:30:00Z")), /08\/09|8\/9/);
assert.match(newYorkLabel(new Date("2026-01-15T15:00:00Z")), /10:00/);
assert.match(newYorkLabel(new Date("2026-07-15T15:00:00Z")), /11:00/);
const dispatched: string[] = [];
const handlers = {
  "event-night": async () => { dispatched.push("event-night"); },
  "snapshot-daily": async () => { dispatched.push("snapshot-daily"); },
  "event-day": async () => { dispatched.push("event-day"); },
};
for (const [date] of scheduleCases) await dispatchEventIntelligenceSchedule(date, handlers);
assert.deepEqual(dispatched, ["event-night", "snapshot-daily", "event-day"]);

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
