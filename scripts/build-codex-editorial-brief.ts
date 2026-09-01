import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { shadowSources } from "../worker/connectors/index.ts";
import { validateCodexIngestReport } from "../worker/event-intelligence/codex-ingest.ts";
import { dailySelectionCandidates } from "../worker/event-intelligence/daily-model-selection.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

async function run() {
  const input = resolve(arg("input") ?? "artifacts/event-intelligence/codex-event-night.json");
  const output = resolve(arg("output") ?? "artifacts/event-intelligence/codex-editorial-brief.json");
  const report = JSON.parse(await readFile(input, "utf8")) as ShadowRunReport;
  const validation = validateCodexIngestReport(report, shadowSources(), arg("day") ?? undefined);
  const generatedAt = new Date().toISOString();
  const candidates = dailySelectionCandidates([report], Date.parse(generatedAt));
  const brief = {
    schemaVersion: "atlas-codex-editorial-brief.v1",
    day: validation.day,
    generatedAt,
    sourceGeneratedAt: report.generatedAt,
    requiredModel: "gpt-5.6-luna",
    candidateCount: candidates.length,
    candidates: candidates.map((event) => ({
      eventId: event.id,
      titleZh: event.titleZh,
      titleEn: event.titleEn,
      summaryZh: event.summaryZh,
      summaryEn: event.summaryEn,
      route: event.route,
      routeCandidates: event.routeCandidates,
      priorityScore: event.priorityScore,
      evidenceStatus: event.evidenceStatus,
      sourceTiers: event.sourceTiers,
      independentSourceCount: event.independentSourceCount,
      entities: event.entities,
      region: event.region,
      facts: event.facts,
      sourceChain: event.sourceChain,
      firstSeenAt: event.firstSeenAt,
      lastUpdatedAt: event.lastUpdatedAt,
      deterministicScores: event.scoring,
    })),
    outputContract: {
      schemaVersion: "atlas-codex-editorial-judgment.v1",
      day: validation.day,
      generatedAt: "ISO-8601 time on the same Beijing day",
      sourceGeneratedAt: report.generatedAt,
      model: "gpt-5.6-luna",
      allowedModels: ["gpt-5.6-luna", "deterministic-atlas-fallback-v1"],
      status: "completed",
      verdicts: "exactly one verdict for every candidate; no unknown or duplicate eventId",
      publicCopy: "generate complete natural Chinese and English publicCopy for every current publishable T0-T3 item; if source material is insufficient, hold only that event and preserve its source chain; T2/T3 copy must attribute the report and must not claim official confirmation",
      intelligencePolicy: "presume public intelligence publication for current accessible reader-relevant T2/T3 reporting regardless of its original topic route; one independent source is enough for single-source-report; missing T0/T1 confirmation changes evidence status but never blocks media visibility",
      publicationBridge: "after editor adapterReady validation, run event:intelligence:apply against the completed editor packet, review the versioned app/data/public-intelligence.json diff, then validate and deploy the same HEAD; candidate, selected, watch or action=publish alone is never publication proof",
      errors: [],
    },
  };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(brief, null, 2)}\n`);
  console.log(JSON.stringify({ message: "Codex editorial brief created", input, output, day: validation.day, candidates: candidates.length }));
}

void run();
