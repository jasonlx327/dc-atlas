import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

const artifactRoot = fileURLToPath(new URL("../artifacts/event-intelligence/", import.meta.url));
const latestUrl = new URL("../artifacts/event-intelligence/latest-run.json", import.meta.url);
const ledgerUrl = new URL("../artifacts/event-intelligence/shadow-7d-ledger.json", import.meta.url);
const replayUrl = new URL("../artifacts/event-intelligence/replay-history-v1.json", import.meta.url);

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

type LedgerSlot = {
  slotId: string;
  slot: "event-night" | "event-day";
  scheduledAtUtc: string;
  observedAtUtc: string;
  beijingDate: string;
  status: ShadowRunReport["status"];
  freshness: ShadowRunReport["freshness"];
  artifact: string;
  provenance: {
    inputMode: "live";
    trigger: "event-night" | "event-day";
    reportSha256: string;
    scheduledAtMatchesSlot: true;
  };
  stats: ShadowRunReport["stats"];
  sourceHealth: {
    total: number;
    successOrNoChange: number;
    successRate: number;
    failures: Array<{ sourceId: string; status: string; httpStatus?: number; error?: string }>;
  };
  checks: {
    mediaOnlyToPulse: number;
    nonT0PolicyRoutes: number;
    frozenCapacityFinanceErrors: number;
    bilingualMismatches: number;
    unresolvedTranslations: number;
    sourceOnlyTranslations: number;
    oldDataMasqueradingCurrent: number;
    sourcelessPublic: number;
    duplicateEventRate: number;
    keyPipelineErrors: number;
  };
  thresholds: {
    endpointSuccessNoChange: { value: number; required: number; pass: boolean };
    mediaOnlyToPulse: { value: number; required: number; pass: boolean };
    nonT0PolicyRoutes: { value: number; required: number; pass: boolean };
    frozenCapacityFinanceErrors: { value: number; required: number; pass: boolean };
    bilingualMismatches: { value: number; required: number; pass: boolean };
    unresolvedTranslations: { value: number; required: number; pass: boolean };
    oldDataMasqueradingCurrent: { value: number; required: number; pass: boolean };
    sourcelessPublic: { value: number; required: number; pass: boolean };
    keyPipelineErrors: { value: number; required: number; pass: boolean };
    runStatus: { value: string; required: string; pass: boolean };
  };
  allThresholdsPass: boolean;
  productionTouched: false;
};

function beijingDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}

function successStatus(status: string): boolean {
  return status === "ok" || status === "empty" || status === "not-modified";
}

function percent(numerator: number, denominator: number): number {
  return denominator ? Math.round((numerator / denominator) * 1000) / 1000 : 0;
}

function replayGate(): { highValueRecall: number; relevancePrecision: number; clusteringPurity: number; duplicateEventRate: number; bilingualConsistency: number; policyAudited: number; independentlyReviewed: number; pass: boolean } {
  return { highValueRecall: 0, relevancePrecision: 0, clusteringPurity: 0, duplicateEventRate: 0, bilingualConsistency: 0, policyAudited: 0, independentlyReviewed: 0, pass: false };
}

function expectedSchedule(slot: "event-night" | "event-day", date: string): string {
  const midnightUtc = Date.parse(`${date}T00:00:00.000Z`);
  const offsetMs = slot === "event-day" ? 9.5 * 3_600_000 : -2.5 * 3_600_000;
  return new Date(midnightUtc + offsetMs).toISOString();
}

const slot = arg("slot");
if (slot !== "event-night" && slot !== "event-day") throw new Error("--slot must be event-night or event-day");
const inputPath = arg("input") ?? fileURLToPath(latestUrl);
const inputBytes = await readFile(inputPath);
const report = JSON.parse(inputBytes.toString("utf8")) as ShadowRunReport & { inputMode?: string; trigger?: string };
if (report.inputMode !== "live") throw new Error("only reports carrying inputMode=live can be recorded in the 7-day shadow ledger");
if (report.trigger !== slot) throw new Error(`report trigger ${report.trigger ?? "missing"} does not match --slot=${slot}`);
const observedAtUtc = report.generatedAt;
if (!Number.isFinite(Date.parse(observedAtUtc))) throw new Error("report.generatedAt must be a valid ISO timestamp");
const slotId = `${slot}-${beijingDate(observedAtUtc)}`;
const scheduledAtUtc = arg("scheduled-at");
if (!scheduledAtUtc || !Number.isFinite(Date.parse(scheduledAtUtc))) throw new Error("--scheduled-at=<ISO timestamp> is required for a live ledger slot");
const canonicalSchedule = expectedSchedule(slot, beijingDate(observedAtUtc));
if (Math.abs(Date.parse(scheduledAtUtc) - Date.parse(canonicalSchedule)) > 60_000) throw new Error(`${slotId} must use scheduled-at=${canonicalSchedule}`);
const completionLagMs = Date.parse(observedAtUtc) - Date.parse(scheduledAtUtc);
if (completionLagMs < -5 * 60_000 || completionLagMs > 4 * 3_600_000) throw new Error(`${slotId} report time is outside the allowed scheduled-run window`);
const slotArtifactPath = `${artifactRoot}/shadow-7d/${slotId}.json`;
await mkdir(dirname(slotArtifactPath), { recursive: true });
await writeFile(slotArtifactPath, inputBytes);

const sourceHealth = report.sourceHealth;
const successOrNoChange = sourceHealth.filter((source) => successStatus(source.status)).length;
const sourceFailures = sourceHealth.filter((source) => !successStatus(source.status)).map((source) => ({ sourceId: source.sourceId, status: source.status, httpStatus: source.httpStatus, error: source.error }));
const mediaOnlyToPulse = report.events.filter((event) => event.route === "pulse" && !event.sourceTiers.some((tier) => tier === "T0" || tier === "T1") && event.sourceTiers.some((tier) => tier === "T2" || tier === "T3")).length;
const nonT0PolicyRoutes = report.events.filter((event) => event.route === "policy-index" && !event.sourceTiers.includes("T0")).length;
const frozenCapacityFinanceErrors = report.events
  .filter((event) => event.route !== "hold" && event.route !== "rejected")
  .flatMap((event) => event.facts)
  .filter((fact) => (fact.factType === "capacity" && (!fact.qualifier || !fact.capacityType || fact.capacityType === "unspecified_capacity")) || (fact.factType === "financial-value" && (!fact.valueNumber || !fact.unit))).length;
const bilingualMismatches = report.observationAnalysis.filter((observation) => observation.analysis.reason.includes("translation-errors")).length;
const sourceOnlyTranslations = report.observationAnalysis.filter((observation) => observation.analysis.translationStatus !== "complete").length;
const unresolvedTranslations = report.events.filter((event) => event.eligible && (!event.titleZh || !event.titleEn || !event.summaryZh || !event.summaryEn)).length;
const oldDataMasqueradingCurrent = report.events.filter((event) => event.eligible && event.lastUpdatedAt && Date.parse(event.lastUpdatedAt) < Date.parse(observedAtUtc) - 7 * 86_400_000).length;
const sourcelessPublic = report.events.filter((event) => event.eligible && event.sourceChain.length === 0).length;
const duplicateEventRate = percent(report.events.filter((event) => new Set(event.sourceChain.map((source) => source.url)).size !== event.sourceChain.length).length, report.events.length);
const keyPipelineErrors = report.failures.filter((failure) => /pipeline|normalize|classif|cluster|route|database/i.test(failure)).length;
const checks = { mediaOnlyToPulse, nonT0PolicyRoutes, frozenCapacityFinanceErrors, bilingualMismatches, unresolvedTranslations, sourceOnlyTranslations, oldDataMasqueradingCurrent, sourcelessPublic, duplicateEventRate, keyPipelineErrors };
const thresholds = {
  endpointSuccessNoChange: { value: percent(successOrNoChange, sourceHealth.length), required: 0.95, pass: percent(successOrNoChange, sourceHealth.length) >= 0.95 },
  mediaOnlyToPulse: { value: mediaOnlyToPulse, required: 0, pass: mediaOnlyToPulse === 0 },
  nonT0PolicyRoutes: { value: nonT0PolicyRoutes, required: 0, pass: nonT0PolicyRoutes === 0 },
  frozenCapacityFinanceErrors: { value: frozenCapacityFinanceErrors, required: 0, pass: frozenCapacityFinanceErrors === 0 },
  bilingualMismatches: { value: bilingualMismatches, required: 0, pass: bilingualMismatches === 0 },
  unresolvedTranslations: { value: unresolvedTranslations, required: 0, pass: unresolvedTranslations === 0 },
  oldDataMasqueradingCurrent: { value: oldDataMasqueradingCurrent, required: 0, pass: oldDataMasqueradingCurrent === 0 },
  sourcelessPublic: { value: sourcelessPublic, required: 0, pass: sourcelessPublic === 0 },
  keyPipelineErrors: { value: keyPipelineErrors, required: 0, pass: keyPipelineErrors === 0 },
  runStatus: { value: report.status, required: "succeeded", pass: report.status === "succeeded" },
};
const allThresholdsPass = Object.values(thresholds).every((check) => check.pass);
const slotRecord: LedgerSlot = {
  slotId,
  slot,
  scheduledAtUtc,
  observedAtUtc,
  beijingDate: beijingDate(observedAtUtc),
  status: report.status,
  freshness: report.freshness,
  artifact: `artifacts/event-intelligence/shadow-7d/${basename(slotArtifactPath)}`,
  provenance: {
    inputMode: "live",
    trigger: slot,
    reportSha256: createHash("sha256").update(inputBytes).digest("hex"),
    scheduledAtMatchesSlot: true,
  },
  stats: report.stats,
  sourceHealth: { total: sourceHealth.length, successOrNoChange, successRate: percent(successOrNoChange, sourceHealth.length), failures: sourceFailures },
  checks,
  thresholds,
  allThresholdsPass,
  productionTouched: false,
};

let ledger: { schemaVersion: string; windowDays: 7; requiredSlots: 14; startedAtUtc: string; updatedAtUtc: string; slots: LedgerSlot[]; replayGate: ReturnType<typeof replayGate>; productionTouched: false } = {
  schemaVersion: "atlas-event-shadow-7d.v1",
  windowDays: 7,
  requiredSlots: 14,
  startedAtUtc: observedAtUtc,
  updatedAtUtc: observedAtUtc,
  slots: [],
  replayGate: replayGate(),
  productionTouched: false,
};
try {
  ledger = JSON.parse(await readFile(ledgerUrl, "utf8")) as typeof ledger;
} catch {
  // First slot creates the local ledger.
}
ledger.slots = [...ledger.slots.filter((item) => item.slotId !== slotId), slotRecord].sort((left, right) => left.observedAtUtc.localeCompare(right.observedAtUtc));
ledger.updatedAtUtc = observedAtUtc;
try {
  const replay = JSON.parse(await readFile(replayUrl, "utf8")) as { labelGate?: { pass?: boolean; policyAudited?: number; independentlyReviewed?: number }; metrics?: { highValueRecall?: number; relevance?: { precision?: number }; clusteringPurity?: number; duplicateEventRate?: number; bilingualConsistency?: number } };
  const metrics = replay.metrics;
  const replayValues = {
    highValueRecall: metrics?.highValueRecall ?? 0,
    relevancePrecision: metrics?.relevance?.precision ?? 0,
    clusteringPurity: metrics?.clusteringPurity ?? 0,
    duplicateEventRate: metrics?.duplicateEventRate ?? 1,
    bilingualConsistency: metrics?.bilingualConsistency ?? 0,
    policyAudited: replay.labelGate?.policyAudited ?? 0,
    independentlyReviewed: replay.labelGate?.independentlyReviewed ?? 0,
  };
  ledger.replayGate = { ...replayValues, pass: replay.labelGate?.pass === true && replayValues.highValueRecall >= 0.9 && replayValues.relevancePrecision >= 0.85 && replayValues.clusteringPurity >= 0.95 && replayValues.duplicateEventRate <= 0.05 && replayValues.bilingualConsistency >= 1 };
} catch {
  ledger.replayGate = replayGate();
}
await mkdir(dirname(fileURLToPath(ledgerUrl)), { recursive: true });
await writeFile(fileURLToPath(ledgerUrl), `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ slotId, slots: ledger.slots.length, allThresholdsPass, sourceHealth: slotRecord.sourceHealth, replayGate: ledger.replayGate, ledger: fileURLToPath(ledgerUrl) }, null, 2));
