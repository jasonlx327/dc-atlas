import type { SourceDefinition } from "../connectors/types.ts";
import type { ShadowRunReport } from "./pipeline.ts";

export type CodexEventSlot = "event-night" | "event-midday" | "event-day";

const PASSING = new Set(["ok", "empty", "not-modified"]);

export function beijingDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(date);
}

export function codexRunKey(slot: CodexEventSlot, day: string): string {
  return `event-intelligence:codex-run:${slot}:${day}`;
}

export function canonicalRunKey(slot: CodexEventSlot, day: string): string {
  return `event-intelligence:run:${slot}:${day}`;
}

export type CodexIngestValidation = {
  day: string;
  sourceCount: number;
  passingSourceCount: number;
  successRate: number;
};

export function validateCodexIngestReport(
  report: ShadowRunReport,
  sources: SourceDefinition[],
  expectedDay?: string,
): CodexIngestValidation {
  if (report.schemaVersion !== "atlas-event-shadow.v1") throw new Error("Codex 抓取包 schema 无效。");
  if (report.status === "failed" || report.status === "blocked") throw new Error(`Codex 抓取包状态不可接收：${report.status}。`);
  const generated = new Date(report.generatedAt);
  if (!Number.isFinite(generated.getTime())) throw new Error("Codex 抓取包 generatedAt 无效。");
  const day = beijingDay(generated);
  if (expectedDay && day !== expectedDay) throw new Error(`Codex 抓取包日期 ${day} 与目标日期 ${expectedDay} 不一致。`);

  const expectedIds = new Set(sources.map((source) => source.id));
  const observedIds = new Set(report.sourceHealth.map((source) => source.sourceId));
  const missing = [...expectedIds].filter((sourceId) => !observedIds.has(sourceId));
  if (missing.length) throw new Error(`Codex 抓取包缺少 ${missing.length} 个已启用来源：${missing.join(", ")}。`);
  if (report.failures.some((failure) => /too many subrequests/i.test(failure))) {
    throw new Error("Codex 抓取包仍包含 Worker 子请求上限错误，拒绝接收。");
  }
  const passingSourceCount = report.sourceHealth.filter((source) => PASSING.has(source.status)).length;
  if (!passingSourceCount) throw new Error("Codex 抓取包没有成功来源。");
  return {
    day,
    sourceCount: report.sourceHealth.length,
    passingSourceCount,
    successRate: passingSourceCount / report.sourceHealth.length,
  };
}
