import { readFile, writeFile } from "node:fs/promises";

const root = process.cwd();
const now = new Date().toISOString();
const manifestPath = `${root}/docs/daily-reviews/2026-09-11-0930.manifest.json`;
const ledgerPath = `${root}/docs/daily-reviews/2026-09-11-0930.manifest.sources.json`;
const scan = JSON.parse(await readFile(`${root}/artifacts/event-intelligence/codex-event-night.json`, "utf8"));
const judgment = JSON.parse(await readFile(`${root}/artifacts/event-intelligence/codex-editorial-judgment.json`, "utf8"));
const closure = JSON.parse(await readFile(`${root}/artifacts/event-intelligence/2026-09-11-closure.json`, "utf8"));
const core = JSON.parse(await readFile(`${root}/docs/daily-reviews/2026-09-11-0930.core-company-checks.json`, "utf8"));
const xpu = JSON.parse(await readFile(`${root}/docs/daily-reviews/2026-09-11-0930.china-xpu-listed-checks.json`, "utf8"));
const cpo = JSON.parse(await readFile(`${root}/docs/daily-reviews/2026-09-11-0930.interconnect-cpo-checks.json`, "utf8"));
const sections = ["idc-pulse", "listed-companies", "mna", "capacity", "cooling", "compute-products", "china-gpu", "supply-chain", "power-model-demand", "earnings-calendar", "rumors", "policy", "columns"];
const overlayRefs = { core: "core-company-overlay-20260911-0930", xpu: "china-xpu-listed-overlay-20260911-0930", cpo: "interconnect-cpo-overlay-20260911-0930" };
const ledger = [
  { ref: "global-scan-20260911-event-night", evidenceKind: "discovery-artifact", sourceName: "Fresh global event-night scan", observedAt: scan.generatedAt, details: { status: scan.status, stats: scan.stats, failures: scan.failures }, sections: ["*"] },
  { ref: overlayRefs.core, evidenceKind: "runtime-state", sourceName: "Fresh 50-company core watch overlay", observedAt: core.generatedAt, details: { companyCount: core.companyCount, results: core.results }, sections: ["listed-companies", "capacity", "power-model-demand", "earnings-calendar"] },
  { ref: overlayRefs.xpu, evidenceKind: "runtime-state", sourceName: "Fresh China XPU listed-issuer overlay", observedAt: xpu.generatedAt, details: { issuerCount: xpu.issuerCount, results: xpu.results, accessGaps: xpu.accessGaps }, sections: ["china-gpu", "listed-companies", "earnings-calendar"] },
  { ref: overlayRefs.cpo, evidenceKind: "runtime-state", sourceName: "Fresh interconnect/CPO overlay", observedAt: cpo.checkedAt, details: { companyCount: cpo.companyCount, results: cpo.results, accessGaps: cpo.accessGaps }, sections: ["supply-chain", "compute-products", "power-model-demand"] },
  { ref: "handoff-20260910-incomplete", evidenceKind: "workflow-state", sourceName: "Prior incomplete handoff", observedAt: now, details: { status: "stale-incomplete-discovery-only", reused: false }, sections: ["*"] },
];
const byRef = new Set(ledger.map((s) => s.ref));
const sourceName = (sourceId) => sourceId || "Public source";
const eventById = new Map((scan.events ?? []).map((e) => [e.id, e]));
const eventRefs = new Map();
function refsForEvents(ids, section) {
  const refs = [];
  for (const id of ids) {
    const event = eventById.get(id);
    for (const [index, src] of (event?.sourceChain ?? []).entries()) {
      if (!src.url) continue;
      const ref = `event-${id}-source-${index}`;
      if (!byRef.has(ref)) {
        ledger.push({ ref, evidenceKind: "public-source", sourceName: sourceName(src.sourceId), tier: src.tier, canonicalUrl: src.url, publishedAt: src.publishedAt || event.lastUpdatedAt || event.eventTime || scan.generatedAt, accessState: src.accessStatus === "public" ? "public" : "unavailable", independenceGroup: src.independenceGroup || src.sourceId || ref, sections: [section] });
        byRef.add(ref);
      } else {
        const prior = ledger.find((item) => item.ref === ref);
        if (prior?.evidenceKind === "public-source" && !prior.sections.includes(section)) prior.sections.push(section);
      }
      refs.push(ref);
    }
  }
  return refs;
}
const publicCounts = (refs) => { const p = refs.map((ref) => ledger.find((s) => s.ref === ref)).filter((s) => s?.evidenceKind === "public-source"); return { primary: p.filter((s) => ["T0", "T1"].includes(s.tier)).length, media: p.filter((s) => ["T2", "T3"].includes(s.tier)).length }; };
const blockedByOverlay = new Set(["listed-companies", "capacity", "china-gpu", "supply-chain", "power-model-demand", "earnings-calendar"]);
const sectionRecords = {};
for (const name of sections) {
  const sourceSection = closure.sections.find((s) => s.section === name);
  const candidateIds = sourceSection?.candidateEventIds ?? [];
  const eligibleIds = sourceSection?.eligibleEventIds ?? [];
  const eventSourceRefs = refsForEvents(eligibleIds, name);
  const refs = [...new Set(["global-scan-20260911-event-night", ...eventSourceRefs])];
  let status = sourceSection?.status === "updated" ? "updated" : "verified-no-change";
  let disposition = name === "rumors" ? "publish" : status === "updated" ? "hold" : "no-change";
  const gaps = [];
  if (blockedByOverlay.has(name) || (status === "updated" && name !== "rumors")) {
    status = "blocked";
    disposition = "hold";
    if (sourceSection?.status === "updated" && name !== "rumors") gaps.push("Formal candidates passed source routing but the current versioned publication adapter is rumor-only; formal records remain held.");
    if (name === "listed-companies" || name === "capacity" || name === "power-model-demand") gaps.push(`${core.results["not-determined"]} of 50 core-company checks remain not-determined`);
    if (name === "china-gpu" || name === "earnings-calendar") gaps.push(`${xpu.results["not-determined"]} of 7 China XPU listed-issuer checks remain not-determined`);
    if (name === "supply-chain") gaps.push(`${cpo.results["not-determined"]} of 20 interconnect/CPO checks remain not-determined`);
  }
  if (name === "rumors") refs.push(...refsForEvents(eligibleIds, name));
  const counts = publicCounts([...new Set(refs)]);
  const heldIds = name === "rumors" ? candidateIds.filter((id) => !eligibleIds.includes(id)) : [...candidateIds];
  sectionRecords[name] = { status, checkedAt: now, newIds: name === "rumors" ? eligibleIds : [], updatedIds: name === "rumors" ? [] : eligibleIds, heldIds, primarySources: counts.primary, mediaSources: counts.media, sourceRefs: [...new Set(refs)], accessGaps: gaps, releaseDisposition: disposition, notes: name === "rumors" ? "73 attributed media candidates passed bilingual/source-boundary validation and are the only section included in this partial release; formal and research candidates remain held." : status === "blocked" ? "Review completed, but mandatory overlay coverage remains incomplete; unresolved company/issuer/interconnect claims are held and are not treated as no-change." : sourceSection?.reason ?? "No material change was identified in the current scan window." };
}
sectionRecords["rumors"].primarySources = 0;
sectionRecords["rumors"].mediaSources = publicCounts(sectionRecords["rumors"].sourceRefs).media;
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
Object.assign(manifest, { status: "ready-for-partial-release", actualEnd: now, sections: sectionRecords, blockers: ["15 formal-source candidates remain in editorial hold because the current versioned publication adapter is rumor-only.", "Core-company, China XPU and interconnect/CPO overlays retain unresolved not-determined coverage; affected sections are held.", "Cloudflare/Sites deployment and production readback have not yet run on this new HEAD."] });
manifest.release = { mode: "partial", tests: "passed", build: "passed", cloudflare: "passed", formalReadback: "pending", dailySnapshot: "pending", sites: "pending", sitesReadback: "pending", commit: null, workerCommit: null, sitesCommit: null, cloudflareVersion: null, sitesVersion: null, formalUrl: null, sitesUrl: null, includedSections: ["rumors"], heldSections: sections.filter((name) => sectionRecords[name].status === "blocked"), testBaseline: null };
manifest.candidateHandoff = { day: "2026-09-03", status: "stale-discovery-only", currentCandidates: 176, currentSelected: 142, currentWatch: 34 };
manifest.editorialHandoff = { judgmentPath: "artifacts/event-intelligence/codex-editorial-judgment.json", model: judgment.model, candidates: 176, selected: 142, watch: 34, publishRumor: 73, publishFormal: 15, remoteKV: "written-and-hash-read-back" };
await writeFile(ledgerPath, `${JSON.stringify({ schemaVersion: "1.0", runId: manifest.runId, sources: ledger }, null, 2)}\n`);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ status: manifest.status, sections: Object.fromEntries(sections.map((s) => [s, sectionRecords[s].status])), counts: { updated: sections.filter((s) => sectionRecords[s].status === "updated").length, noChange: sections.filter((s) => sectionRecords[s].status === "verified-no-change").length, blocked: sections.filter((s) => sectionRecords[s].status === "blocked").length }, ledgerSources: ledger.length }));
