import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { shadowSources } from "../worker/connectors/index.ts";
import { dailySelectionCandidates } from "../worker/event-intelligence/daily-model-selection.ts";
import { matchCoreCompanies } from "../worker/event-intelligence/core-company-watchlist.ts";
import { modelMaterialBand, semanticScore, type ModelDimensionScores } from "../worker/event-intelligence/model-scoring.ts";
import { requiresEditorialPublicCopy } from "../worker/event-intelligence/codex-editorial-judgment.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

function beijingDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(date);
}

function accessible(source: ShadowRunReport["events"][number]["sourceChain"][number]): boolean {
  return Boolean(source.url)
    && !["blocked", "paywalled", "unavailable", "login-required"].includes(source.accessStatus);
}

function sourceName(sourceId: string): string {
  return shadowSources().find((source) => source.id === sourceId)?.name ?? sourceId;
}

function scoresOf(event: ShadowRunReport["events"][number]): ModelDimensionScores {
  return {
    topicRelevanceScore: event.scoring.topicRelevanceScore,
    mechanismDepthScore: event.scoring.mechanismDepthScore,
    specificityScore: event.scoring.specificityScore,
    researchValueScore: event.scoring.researchValueScore,
    readerValueScore: event.scoring.readerValueScore,
  };
}

async function run() {
  const input = resolve(arg("input") ?? "artifacts/event-intelligence/2026-08-25-1630-event.json");
  const output = resolve(arg("output") ?? "artifacts/event-intelligence/2026-08-25-1630-editorial-fallback.json");
  const sourceReport = JSON.parse(await readFile(input, "utf8")) as ShadowRunReport;
  const generatedAt = new Date().toISOString();
  const candidates = dailySelectionCandidates([sourceReport], Date.parse(generatedAt));
  const verdicts = candidates.map((event) => {
    const scores = scoresOf(event);
    const strongestTier = (["T0", "T1", "T2", "T3", "T4", "T5", "D"] as const)
      .find((tier) => event.sourceTiers.includes(tier)) ?? "D";
    const result = { scores, semanticScore: semanticScore(scores) };
    const band = modelMaterialBand(result, {
      sourceTier: strongestTier,
      independentSourceCount: event.independentSourceCount,
      coreCompanyCount: matchCoreCompanies([event.titleZh, event.titleEn, ...event.entities]).length,
    });
    const copy = undefined; // Deterministic scoring never creates reviewed public copy.
    const source = event.sourceChain.find((item) => accessible(item));
    return {
      eventId: event.id,
      band,
      scores,
      rationale: `确定性回退：沿用来源扫描的五维评分；最高来源层级 ${strongestTier}；${source ? `首个可访问来源 ${sourceName(source.sourceId)}` : "没有可访问来源"}。`,
      reasonCodes: [
        "deterministic-editorial-fallback",
        strongestTier === "T0" || strongestTier === "T1" ? "primary-source-path" : "attributed-reporting-path",
        ...(copy ? ["bilingual-copy-valid"] : ["copy-not-generated"]),
      ],
      ...(copy ? { publicCopy: copy } : {}),
    };
  });
  const candidateById = new Map(candidates.map((event) => [event.id, event]));
  const completionRequired = verdicts.flatMap((verdict) => {
    const event = candidateById.get(verdict.eventId)!;
    return requiresEditorialPublicCopy(event, verdict.band) && !verdict.publicCopy
      ? [{ eventId: verdict.eventId, reason: "missing-or-invalid-bilingual-publicCopy" }]
      : [];
  });
  const judgment = {
    schemaVersion: "atlas-codex-editorial-judgment.v1",
    day: beijingDay(new Date(generatedAt)),
    generatedAt,
    sourceGeneratedAt: sourceReport.generatedAt,
    model: "deterministic-atlas-fallback-v1",
    status: completionRequired.length ? "needs-editorial-completion" : "completed",
    verdicts,
    errors: completionRequired.length
      ? [`${completionRequired.length} 个可公开候选需要当前 Codex 完成中英文 publicCopy。`]
      : [],
    completionRequired,
  };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(judgment, null, 2)}\n`);
  console.log(JSON.stringify({
    message: completionRequired.length
      ? "Deterministic fallback retained candidates; editorial completion required before ingest"
      : "Deterministic editorial fallback created",
    input,
    output,
    day: judgment.day,
    candidates: verdicts.length,
    status: judgment.status,
    completionRequired: completionRequired.length,
  }));
}

void run();
