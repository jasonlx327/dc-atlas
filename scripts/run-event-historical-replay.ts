import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConnectorResult } from "../worker/connectors/types.ts";
import { runShadowPipeline, type ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";
import type { EventReplayCorpus, ReplayObservation } from "./build-event-replay-corpus.ts";

type HistoricalSlot = {
  slotId: string;
  slot: "event-night" | "event-day";
  beijingDate: string;
  scheduledAtUtc: string;
  artifact: string;
  reportSha256: string;
  stats: ShadowRunReport["stats"];
  checks: ReturnType<typeof hardChecks>["checks"];
  allThresholdsPass: boolean;
};

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const corpusPath = fileURLToPath(new URL("./fixtures/event-intelligence/history-v1.json", import.meta.url));
const outputRoot = fileURLToPath(new URL("../artifacts/event-intelligence/historical-replay-7d/", import.meta.url));
const ledgerPath = fileURLToPath(new URL("../artifacts/event-intelligence/historical-replay-7d-ledger.json", import.meta.url));

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function effectivePublishedAt(observation: ReplayObservation): number | null {
  if (!observation.publishedAt || !Number.isFinite(Date.parse(observation.publishedAt))) return null;
  return Date.parse(observation.publishedAt);
}

function expectedSchedule(slot: "event-night" | "event-day", date: string): string {
  const midnightUtc = Date.parse(`${date}T00:00:00.000Z`);
  return new Date(midnightUtc + (slot === "event-day" ? 9.5 : -2.5) * 3_600_000).toISOString();
}

function buildResults(corpus: EventReplayCorpus, observations: ReplayObservation[], fetchedAt: string): ConnectorResult[] {
  const grouped = new Map<string, ReplayObservation[]>();
  for (const observation of observations) grouped.set(observation.sourceId, [...(grouped.get(observation.sourceId) ?? []), observation]);
  return corpus.sources.map((source) => {
    const selected = grouped.get(source.id) ?? [];
    return {
      status: selected.length ? "ok" : "empty",
      sourceId: source.id,
      endpointId: source.endpoint.id,
      fetchedAt,
      httpStatus: 200,
      responseMs: 0,
      observations: selected,
    };
  });
}

function hardChecks(report: ShadowRunReport) {
  const mediaOnlyToPulse = report.events.filter((event) => event.route === "pulse" && !event.sourceTiers.some((tier) => tier === "T0" || tier === "T1") && event.sourceTiers.some((tier) => tier === "T2" || tier === "T3")).length;
  const nonT0PolicyRoutes = report.events.filter((event) => event.route === "policy-index" && !event.sourceTiers.includes("T0")).length;
  const capacityBoundaryErrors = report.events.filter((event) => event.route !== "hold" && event.route !== "rejected").flatMap((event) => event.facts).filter((fact) => fact.factType === "capacity" && (!fact.qualifier || !fact.capacityType || fact.capacityType === "unspecified_capacity")).length;
  const sourcelessPublic = report.events.filter((event) => event.eligible && event.sourceChain.length === 0).length;
  const publicTranslationErrors = report.events.filter((event) => event.eligible && (!event.titleZh || !event.titleEn || !event.summaryZh || !event.summaryEn)).length;
  const keyPipelineErrors = report.failures.filter((failure) => /pipeline|normalize|classif|cluster|route/i.test(failure)).length;
  const checks = { mediaOnlyToPulse, nonT0PolicyRoutes, capacityBoundaryErrors, sourcelessPublic, publicTranslationErrors, keyPipelineErrors };
  return { checks, allThresholdsPass: report.status === "succeeded" && Object.values(checks).every((value) => value === 0) };
}

const asOf = arg("as-of") ?? "2026-08-09";
if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf) || !Number.isFinite(Date.parse(`${asOf}T00:00:00.000Z`))) throw new Error("--as-of must be YYYY-MM-DD");
const corpus = JSON.parse(await readFile(corpusPath, "utf8")) as EventReplayCorpus;
const baseUtc = Date.parse(`${asOf}T00:00:00.000Z`);
const datedObservations = corpus.observations.filter((observation) => effectivePublishedAt(observation) !== null);
const slots: HistoricalSlot[] = [];
await mkdir(outputRoot, { recursive: true });

for (let offset = 7; offset >= 1; offset -= 1) {
  const date = new Date(baseUtc - offset * 86_400_000).toISOString().slice(0, 10);
  for (const slot of ["event-night", "event-day"] as const) {
    const scheduledAtUtc = expectedSchedule(slot, date);
    const cutoff = Date.parse(scheduledAtUtc);
    const observations = datedObservations.filter((observation) => (effectivePublishedAt(observation) ?? Number.POSITIVE_INFINITY) <= cutoff);
    const report = await runShadowPipeline(buildResults(corpus, observations, scheduledAtUtc), corpus.sources, { generatedAt: scheduledAtUtc, strategyVersion: "atlas-event-v2-historical-replay" });
    const { checks, allThresholdsPass } = hardChecks(report);
    const slotId = `${slot}-${date}`;
    const artifactPath = `${outputRoot}/${slotId}.json`;
    const statusCounts = report.sourceHealth.reduce<Record<string, number>>((counts, source) => {
      counts[source.status] = (counts[source.status] ?? 0) + 1;
      return counts;
    }, {});
    const output = {
      schemaVersion: "atlas-event-historical-slot.v1",
      generatedAt: report.generatedAt,
      strategyVersion: report.strategyVersion,
      classifierVersion: report.classifierVersion,
      status: report.status,
      freshness: report.freshness,
      inputMode: "historical-replay",
      trigger: slot,
      scheduledAtUtc,
      replayCutoffAtUtc: scheduledAtUtc,
      stats: report.stats,
      sourceHealth: {
        total: report.sourceHealth.length,
        statusCounts,
        failures: report.sourceHealth.filter((source) => !["ok", "empty", "not-modified"].includes(source.status)),
      },
      failures: report.failures,
      cost: report.cost,
      temporalGuard: {
        method: "published-at-cutoff",
        corpusObservations: corpus.observations.length,
        observationsWithPublishedAt: datedObservations.length,
        includedObservations: observations.length,
        excludedWithoutPublishedAt: corpus.observations.length - datedObservations.length,
        excludedAfterCutoff: datedObservations.length - observations.length,
        limitation: "Reconstructed from the current traceable corpus by publication time; it does not prove the item was fetched by Atlas at that historical instant.",
      },
      checks,
      allThresholdsPass,
      productionTouched: false,
    };
    const bytes = `${JSON.stringify(output, null, 2)}\n`;
    await writeFile(artifactPath, bytes, "utf8");
    slots.push({
      slotId,
      slot,
      beijingDate: date,
      scheduledAtUtc,
      artifact: relative(projectRoot, artifactPath),
      reportSha256: createHash("sha256").update(bytes).digest("hex"),
      stats: report.stats,
      checks,
      allThresholdsPass,
    });
  }
}

const completeDates = new Set(slots.filter((candidate) => slots.some((other) => other.beijingDate === candidate.beijingDate && other.slot !== candidate.slot)).map((slot) => slot.beijingDate)).size;
const ledger = {
  schemaVersion: "atlas-event-historical-replay-7d.v1",
  generatedAt: new Date().toISOString(),
  asOfBeijingDate: asOf,
  window: { from: new Date(baseUtc - 7 * 86_400_000).toISOString().slice(0, 10), to: new Date(baseUtc - 86_400_000).toISOString().slice(0, 10), requiredSlots: 14 },
  status: slots.length === 14 && completeDates === 7 && slots.every((slot) => slot.allThresholdsPass) ? "passed" : "failed",
  slotCount: slots.length,
  completeBeijingDates: completeDates,
  passingSlots: slots.filter((slot) => slot.allThresholdsPass).length,
  temporalBoundary: "Historical reconstruction uses only observations with explicit publishedAt at or before each cutoff. It is not a substitute for live fetch provenance.",
  slots,
  productionTouched: false,
};
await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ledger: relative(projectRoot, ledgerPath), status: ledger.status, slots: ledger.slotCount, completeBeijingDates: ledger.completeBeijingDates, passingSlots: ledger.passingSlots, averageIncludedObservations: round(slots.reduce((total, slot) => total + slot.stats.fetched, 0) / slots.length) }, null, 2));
