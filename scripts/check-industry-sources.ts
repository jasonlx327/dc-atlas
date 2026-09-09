import "./node-transport.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fetchRegisteredSource, sourceRegistry } from "../worker/connectors/index.ts";
import { classifyIndustry } from "../app/industry-taxonomy.ts";
const candidates: unknown[] = [];
const ids = ["semi-analysis", "serve-the-home", "blocks-and-files", "coherent-ir"];
const results = await Promise.all(ids.map(async id => {
 const source = sourceRegistry.find(s => s.id === id)!;
 const result = await fetchRegisteredSource(source, { signal: AbortSignal.timeout(20000) });
 for (const observation of result.observations) {
   const routing = classifyIndustry({id: observation.canonicalUrl, title: observation.titleOriginal, summary: observation.summaryOriginal});
   candidates.push({ sourceId: id, title: observation.titleOriginal, url: observation.canonicalUrl, publishedAt: observation.publishedAt, discoveredAt: observation.discoveredAt, primarySegment: routing.primary?.id ?? null, relatedSegments: routing.matches.map(m => m.id), routingBasis: routing.basis, route: routing.primary ? "research-queue" : "classification-review", evidence: source.tier === "T1" ? "first-party-disclosure" : "attributed-report", publication: "not-approved" });
 }
 return { id, url: source.endpoint.url, checkedAt: result.fetchedAt, status: result.status, httpStatus: result.httpStatus, count: result.observations.length, dated: result.observations.filter(o => o.publishedAt).length, latest: result.observations.map(o => o.publishedAt).filter(Boolean).sort().at(-1) ?? null, error: result.error ?? null, publication: "not-checked" };
}));
await mkdir("artifacts/industry-review", { recursive: true });
await writeFile("artifacts/industry-review/source-health.json", JSON.stringify({ checkedAt: new Date().toISOString(), scope: "four registered connectors; no production write", results }, null, 2));
await writeFile("artifacts/industry-review/candidates.json", JSON.stringify(candidates, null, 2));
console.log(JSON.stringify(results, null, 2));
