import { shadowSources } from "../connectors/index.ts";
import { matchCoreCompanies } from "./core-company-watchlist.ts";
import {
  buildAtlasEditorDecision,
  type AtlasEditorDecisionPacket,
} from "./atlas-auto-editor.ts";
import { validateCodexIngestReport } from "./codex-ingest.ts";
import {
  candidatePacketKey,
  dailyCandidatePacket,
  dailySelectionCandidates,
  selectionItem,
  type DailyEditorialCandidatePacket,
  type DailyMaterialSelectionReport,
} from "./daily-model-selection.ts";
import {
  buildDailySectionClosure,
  type AtlasDailyClosureReport,
} from "./daily-section-closure.ts";
import {
  modelMaterialBand,
  parseModelScorePayload,
  semanticScore,
  type ModelMaterialBand,
  type ModelScoringResult,
} from "./model-scoring.ts";
import type { ShadowRunReport } from "./pipeline.ts";

export type CodexEditorialVerdict = {
  eventId: string;
  band: ModelMaterialBand;
  scores: {
    topicRelevanceScore: number;
    mechanismDepthScore: number;
    specificityScore: number;
    researchValueScore: number;
    readerValueScore: number;
  };
  rationale: string;
  reasonCodes: string[];
  publicCopy?: {
    titleZh: string;
    titleEn: string;
    summaryZh: string;
    summaryEn: string;
  };
};

export type CodexEditorialJudgment = {
  schemaVersion: "atlas-codex-editorial-judgment.v1";
  day: string;
  generatedAt: string;
  sourceGeneratedAt: string;
  model: "gpt-5.6-luna";
  status: "completed";
  verdicts: CodexEditorialVerdict[];
  errors: [];
};

export type CodexEditorialPackets = {
  selection: DailyMaterialSelectionReport;
  candidates: DailyEditorialCandidatePacket;
  editor: AtlasEditorDecisionPacket;
  closure: AtlasDailyClosureReport;
};

function strongestTier(tiers: Array<"T0" | "T1" | "T2" | "T3" | "T4" | "T5" | "D">) {
  const order = ["T0", "T1", "T2", "T3", "T4", "T5", "D"] as const;
  return order.find((tier) => tiers.includes(tier)) ?? "D";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBand(value: unknown): ModelMaterialBand {
  if (value === "selected" || value === "watch" || value === "dropped") return value;
  throw new Error("Codex verdict band 无效。");
}

export function parseCodexEditorialJudgment(value: unknown): CodexEditorialJudgment {
  if (!isRecord(value) || value.schemaVersion !== "atlas-codex-editorial-judgment.v1") {
    throw new Error("Codex editorial judgment schema 无效。");
  }
  if (value.model !== "gpt-5.6-luna") throw new Error("Codex editorial judgment 必须由 gpt-5.6-luna 生成。");
  if (value.status !== "completed") throw new Error("Codex editorial judgment 未完成，拒绝写入。");
  if (!Array.isArray(value.errors) || value.errors.length !== 0) throw new Error("Codex editorial judgment 含错误，拒绝写入。");
  if (!Array.isArray(value.verdicts)) throw new Error("Codex editorial judgment verdicts 无效。");
  const verdicts = value.verdicts.map((raw) => {
    if (!isRecord(raw) || typeof raw.eventId !== "string" || !raw.eventId.trim()) throw new Error("Codex verdict eventId 无效。");
    const parsed = parseModelScorePayload(raw);
    return {
      eventId: raw.eventId.trim(),
      band: parseBand(raw.band),
      ...parsed,
    } satisfies CodexEditorialVerdict;
  });
  const generatedAt = typeof value.generatedAt === "string" ? value.generatedAt : "";
  const sourceGeneratedAt = typeof value.sourceGeneratedAt === "string" ? value.sourceGeneratedAt : "";
  if (!Number.isFinite(Date.parse(generatedAt)) || !Number.isFinite(Date.parse(sourceGeneratedAt))) {
    throw new Error("Codex editorial judgment 时间戳无效。");
  }
  if (typeof value.day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.day)) throw new Error("Codex editorial judgment day 无效。");
  return {
    schemaVersion: "atlas-codex-editorial-judgment.v1",
    day: value.day,
    generatedAt,
    sourceGeneratedAt,
    model: "gpt-5.6-luna",
    status: "completed",
    verdicts,
    errors: [],
  };
}

export function buildCodexEditorialPackets(
  sourceReport: ShadowRunReport,
  rawJudgment: unknown,
): CodexEditorialPackets {
  const judgment = parseCodexEditorialJudgment(rawJudgment);
  validateCodexIngestReport(sourceReport, shadowSources(), judgment.day);
  if (judgment.sourceGeneratedAt !== sourceReport.generatedAt) {
    throw new Error("Codex judgment 与来源报告不是同一 generatedAt，拒绝混合写入。");
  }
  const generatedTime = Date.parse(judgment.generatedAt);
  const generatedDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date(generatedTime));
  if (generatedDay !== judgment.day) throw new Error("Codex judgment generatedAt 与 day 不一致。");
  const candidates = dailySelectionCandidates([sourceReport], generatedTime);
  const candidateIds = new Set(candidates.map((event) => event.id));
  const verdictById = new Map<string, CodexEditorialVerdict>();
  for (const verdict of judgment.verdicts) {
    if (verdictById.has(verdict.eventId)) throw new Error(`Codex judgment 重复 eventId：${verdict.eventId}`);
    if (!candidateIds.has(verdict.eventId)) throw new Error(`Codex judgment 包含未知 eventId：${verdict.eventId}`);
    verdictById.set(verdict.eventId, verdict);
  }
  const missing = candidates.filter((event) => !verdictById.has(event.id)).map((event) => event.id);
  if (missing.length) throw new Error(`Codex judgment 缺少 ${missing.length} 个候选：${missing.join(", ")}`);

  const items = candidates.map((event) => {
    const verdict = verdictById.get(event.id)!;
    const result: ModelScoringResult = {
      schemaVersion: "atlas-model-score.v1",
      mode: "shadow",
      routeImpact: false,
      provider: "codex-automation",
      model: judgment.model,
      scoredAt: judgment.generatedAt,
      scores: verdict.scores,
      semanticScore: semanticScore(verdict.scores),
      rationale: verdict.rationale,
      reasonCodes: verdict.reasonCodes,
      ...(verdict.publicCopy ? { publicCopy: verdict.publicCopy } : {}),
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
    const computedBand = modelMaterialBand(result, {
      sourceTier: strongestTier(event.sourceTiers),
      independentSourceCount: event.independentSourceCount,
      coreCompanyCount: matchCoreCompanies([event.titleZh, event.titleEn, ...event.entities]).length,
    });
    if (computedBand !== verdict.band) {
      throw new Error(`Codex verdict ${event.id} 的 band=${verdict.band} 与分数计算 ${computedBand} 不一致。`);
    }
    return selectionItem(event, result);
  }).sort((left, right) => right.result.semanticScore - left.result.semanticScore
    || right.priorityScore - left.priorityScore
    || Date.parse(right.lastUpdatedAt) - Date.parse(left.lastUpdatedAt));

  const selection: DailyMaterialSelectionReport = {
    schemaVersion: "atlas-daily-model-selection.v1",
    day: judgment.day,
    generatedAt: judgment.generatedAt,
    sourceSlots: ["event-night"],
    status: "completed",
    model: judgment.model,
    candidateCount: candidates.length,
    newCandidateCount: candidates.length,
    alreadyScoredCount: 0,
    attemptedCount: candidates.length,
    selectedCount: items.filter((item) => item.band === "selected").length,
    watchCount: items.filter((item) => item.band === "watch").length,
    droppedCount: items.filter((item) => item.band === "dropped").length,
    fallbackCount: 0,
    packetKey: candidatePacketKey(judgment.day),
    items,
    errors: [],
  };
  const candidatePacket = dailyCandidatePacket(selection);
  const editor = buildAtlasEditorDecision(candidatePacket, generatedTime);
  const closure = buildDailySectionClosure(candidatePacket, generatedTime, sourceReport, editor);
  return { selection, candidates: candidatePacket, editor, closure };
}
