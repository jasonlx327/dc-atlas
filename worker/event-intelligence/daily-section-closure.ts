import type { DailyEditorialCandidatePacket, DailyMaterialSelectionItem } from "./daily-model-selection.ts";
import {
  type AtlasEditorDecisionPacket,
} from "./atlas-auto-editor.ts";
import type { ShadowRunReport } from "./pipeline.ts";
import {
  ATLAS_EDITORIAL_COMMIT_LATEST_KEY,
  type AtlasEditorialCommit,
} from "./editorial-commit.ts";
import {
  ATLAS_DAILY_SECTION_IDS,
  buildSectionSourceCoverage,
  type AtlasDailySectionId,
  type AtlasSectionSourceCoverage,
} from "./source-coverage.ts";

export type { AtlasDailySectionId } from "./source-coverage.ts";

export type AtlasDailySectionOutcome = {
  section: AtlasDailySectionId;
  status: "updated" | "verified-no-change" | "blocked";
  publicationMode: "release-ready" | "internal-only" | "no-change" | "needs-review";
  candidateEventIds: string[];
  eligibleEventIds: string[];
  blockedEventIds: string[];
  sourceCoverage: AtlasSectionSourceCoverage;
  reason: string;
};

export type AtlasDailyClosureReport = {
  schemaVersion: "atlas-daily-section-closure.v1";
  day: string;
  generatedAt: string;
  scheduledForBeijing: "06:30";
  status: "completed" | "partial" | "blocked";
  sourcePacketGeneratedAt: string | null;
  sourceRunGeneratedAt: string | null;
  editorGeneratedAt: string | null;
  sourceSlots: string[];
  sections: AtlasDailySectionOutcome[];
  counts: { updated: number; verifiedNoChange: number; blocked: number };
  retryRequired: boolean;
};

export const DAILY_SECTION_CLOSURE_LATEST_KEY = "atlas-daily-update:closure:latest";

function beijingDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(date);
}

export function closureKey(day: string): string {
  return `atlas-daily-update:closure:${day}`;
}

export function isAttributableRumorReport(item: DailyMaterialSelectionItem): boolean {
  return (item.band === "selected" || item.band === "watch")
    && item.evidenceStatus !== "lead"
    && item.sourceTiers.some((tier) => tier === "T2" || tier === "T3")
    && (item.sourceChain ?? []).some((source) => Boolean(source.url)
      && !["blocked", "paywalled", "unavailable", "login-required"].includes(source.accessStatus));
}

function blockedOutcome(section: AtlasDailySectionId, coverage: AtlasSectionSourceCoverage, reason: string): AtlasDailySectionOutcome {
  return {
    section,
    status: "blocked",
    publicationMode: "needs-review",
    candidateEventIds: [],
    eligibleEventIds: [],
    blockedEventIds: [],
    sourceCoverage: coverage,
    reason,
  };
}

export function buildDailySectionClosure(
  packet: DailyEditorialCandidatePacket | null,
  scheduledTime: number,
  sourceReport: ShadowRunReport | null = null,
  editorPacket: AtlasEditorDecisionPacket | null = null,
): AtlasDailyClosureReport {
  const generatedAt = new Date(scheduledTime).toISOString();
  const day = beijingDay(new Date(scheduledTime));
  const packetCurrent = packet?.day === day && packet.sourceSlots.includes("event-night") && packet.status === "completed";
  const sourceCurrent = sourceReport !== null
    && beijingDay(new Date(sourceReport.generatedAt)) === day
    && sourceReport.status !== "failed"
    && sourceReport.status !== "blocked";
  const editorCurrent = editorPacket?.day === day && editorPacket.status === "completed";
  const coverage = buildSectionSourceCoverage(sourceCurrent ? sourceReport : null);
  const coverageBySection = new Map(coverage.map((entry) => [entry.section, entry]));

  const sections = ATLAS_DAILY_SECTION_IDS.map((section): AtlasDailySectionOutcome => {
    const sectionCoverage = coverageBySection.get(section)!;
    if (!packetCurrent) return blockedOutcome(section, sectionCoverage, "当日事件候选包缺失、过期或未包含 05:30 夜间扫描。");
    if (!sourceCurrent) return blockedOutcome(section, sectionCoverage, "当日信源运行结果缺失、过期或失败，不能据此判定无变化。");
    if (!editorCurrent) return blockedOutcome(section, sectionCoverage, "Atlas Auto Editor 决策包缺失或未完成，候选不能进入公开数据源。");

    const decisions = editorPacket.decisions.filter((decision) => decision.section === section);
    const published = decisions.filter((decision) => decision.action === "publish");
    const held = decisions.filter((decision) => decision.action === "hold");
    const blockingHeld = held.filter((decision) => decision.holdClass === "blocking");
    const research = decisions.filter((decision) => decision.action === "watch" && decision.route === "research-queue");
    const candidateEventIds = decisions.map((decision) => decision.eventId);
    if (published.length) {
      return {
        section,
        status: "updated",
        publicationMode: "release-ready",
        candidateEventIds,
        eligibleEventIds: published.map((decision) => decision.eventId),
        blockedEventIds: blockingHeld.map((decision) => decision.eventId),
        sourceCoverage: sectionCoverage,
        reason: blockingHeld.length
          ? "合格条目已通过来源、双语与声明校验；其余缺口保留在 handoff，不拖累本板块可发布条目。"
          : "合格条目已通过一手或媒体分流、双语与声明来源校验，进入版本化发布队列。",
      };
    }
    if (blockingHeld.length) {
      return {
        section,
        status: "blocked",
        publicationMode: "needs-review",
        candidateEventIds,
        eligibleEventIds: [],
        blockedEventIds: blockingHeld.map((decision) => decision.eventId),
        sourceCoverage: sectionCoverage,
        reason: "存在相关候选，但来源、双语、结构化字段或公开适配器尚未通过确定性发布门槛。",
      };
    }
    if (sectionCoverage.status === "blocked") return blockedOutcome(section, sectionCoverage, sectionCoverage.reason);
    return {
      section,
      status: "verified-no-change",
      publicationMode: research.length || held.length ? "internal-only" : "no-change",
      candidateEventIds,
      eligibleEventIds: [],
      blockedEventIds: [],
      sourceCoverage: sectionCoverage,
      reason: research.length
        ? `已完成板块信源检查；${research.length} 个机制性选题进入研究队列，本次没有达到专栏发布条件的稿件。`
        : held.length
          ? `已完成板块信源检查；${held.length} 个低优先级或待追踪候选保留在观察队列，不构成发布阻断。`
        : "已完成板块必查信源覆盖，未发现满足新增或实质变化条件的公开条目。",
    };
  });

  const counts = {
    updated: sections.filter((section) => section.status === "updated").length,
    verifiedNoChange: sections.filter((section) => section.status === "verified-no-change").length,
    blocked: sections.filter((section) => section.status === "blocked").length,
  };
  return {
    schemaVersion: "atlas-daily-section-closure.v1",
    day,
    generatedAt,
    scheduledForBeijing: "06:30",
    status: counts.blocked === sections.length ? "blocked" : counts.blocked ? "partial" : "completed",
    sourcePacketGeneratedAt: packet?.generatedAt ?? null,
    sourceRunGeneratedAt: sourceReport?.generatedAt ?? null,
    editorGeneratedAt: editorPacket?.generatedAt ?? null,
    sourceSlots: packet?.sourceSlots ?? [],
    sections,
    counts,
    retryRequired: counts.blocked > 0,
  };
}

export async function runDailySectionClosure(env: Env, scheduledTime: number): Promise<AtlasDailyClosureReport> {
  const day = beijingDay(new Date(scheduledTime));
  const commit = await env.IDC_DAILY_SNAPSHOTS.get<AtlasEditorialCommit>(ATLAS_EDITORIAL_COMMIT_LATEST_KEY, "json");
  const committedKeys = commit?.schemaVersion === "atlas-editorial-commit.v1" && commit.day === day ? commit.keys : null;
  const [packet, sourceReport, editorPacket] = await Promise.all([
    committedKeys
      ? env.IDC_DAILY_SNAPSHOTS.get<DailyEditorialCandidatePacket>(committedKeys.candidates, "json")
      : Promise.resolve(null),
    env.IDC_DAILY_SNAPSHOTS.get<ShadowRunReport>(`event-intelligence:run:event-night:${day}`, "json"),
    committedKeys
      ? env.IDC_DAILY_SNAPSHOTS.get<AtlasEditorDecisionPacket>(committedKeys.editor, "json")
      : Promise.resolve(null),
  ]);
  const report = buildDailySectionClosure(packet, scheduledTime, sourceReport, editorPacket);
  await Promise.all([
    env.IDC_DAILY_SNAPSHOTS.put(DAILY_SECTION_CLOSURE_LATEST_KEY, JSON.stringify(report)),
    env.IDC_DAILY_SNAPSHOTS.put(closureKey(report.day), JSON.stringify(report)),
  ]);
  console.log(JSON.stringify({
    message: "Atlas daily section closure saved",
    day: report.day,
    status: report.status,
    ...report.counts,
    retryRequired: report.retryRequired,
  }));
  return report;
}
