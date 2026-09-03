import type { SourceTier } from "../connectors/types.ts";
import type { Route, ShadowRunReport } from "./pipeline.ts";
import { matchCoreCompanies } from "./core-company-watchlist.ts";
import {
  modelMaterialBand,
  modelScoringStatus,
  modelUsageKey,
  scoreWithOpenAiCompatible,
  semanticScore,
  type ModelMaterialBand,
  type ModelScoringInput,
  type ModelScoringResult,
} from "./model-scoring.ts";
import { validateBilingualPair } from "./provider-contract.ts";

export type EventRecord = ShadowRunReport["events"][number];
export type DailySelectionSlot = "event-night" | "event-midday" | "event-day";

export type DailyMaterialSelectionItem = {
  eventId: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  route: Route;
  routeCandidates: Route[];
  priorityScore: number;
  band: ModelMaterialBand;
  publicationReadiness: "eligible-by-rules" | "needs-source-verification";
  evidenceStatus: EventRecord["evidenceStatus"];
  sourceTiers: SourceTier[];
  independentSourceCount: number;
  coreCompanies: string[];
  entities: string[];
  region: string;
  facts: EventRecord["facts"];
  sourceChain: EventRecord["sourceChain"];
  firstSeenAt: string;
  lastUpdatedAt: string;
  sourceLastUpdatedAt: string;
  result: ModelScoringResult;
};

export type DailyMaterialSelectionReport = {
  schemaVersion: "atlas-daily-model-selection.v1";
  day: string;
  generatedAt: string;
  sourceSlots: DailySelectionSlot[];
  status: "completed" | "partial" | "skipped";
  model: string;
  candidateCount: number;
  newCandidateCount: number;
  alreadyScoredCount: number;
  attemptedCount: number;
  selectedCount: number;
  watchCount: number;
  droppedCount: number;
  fallbackCount?: number;
  packetKey: string;
  items: DailyMaterialSelectionItem[];
  errors: string[];
};

export type DailyEditorialCandidatePacket = {
  schemaVersion: "atlas-daily-candidate-packet.v1";
  day: string;
  generatedAt: string;
  sourceSlots: DailySelectionSlot[];
  model: string;
  status: DailyMaterialSelectionReport["status"];
  candidateCount: number;
  selectedCount: number;
  watchCount: number;
  ruleEligibleCount: number;
  copyReadyCount: number;
  /** @deprecated Candidate packets never carry publication authority. Use Atlas Auto Editor adapterReady. */
  publicationReadyCount: number;
  fallbackCount?: number;
  selected: DailyMaterialSelectionItem[];
  watch: DailyMaterialSelectionItem[];
  errors: string[];
};

export const DAILY_MODEL_SELECTION_LATEST_KEY = "event-intelligence:model-selection:latest";
export const DAILY_CANDIDATE_PACKET_LATEST_KEY = "event-intelligence:daily-candidates:latest";

function beijingDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(date);
}

export function selectionDayKey(day: string): string {
  return `event-intelligence:model-selection:${day}`;
}

export function candidatePacketKey(day: string): string {
  return `event-intelligence:daily-candidates:${day}`;
}

function eventRunKey(slot: DailySelectionSlot, day: string): string {
  return `event-intelligence:run:${slot}:${day}`;
}

function strongestTier(tiers: SourceTier[]): SourceTier {
  const order: SourceTier[] = ["T0", "T1", "T2", "T3", "T4", "T5", "D"];
  return order.find((tier) => tiers.includes(tier)) ?? "D";
}

function isEditorialCandidate(event: EventRecord): boolean {
  const routed = event.routeCandidates?.some((route) => route === "pulse" || route === "rumor-watch" || route === "research-queue");
  const attributableLead = (event.route === "hold" || event.route === "rejected")
    && event.sourceTiers.some((tier) => tier !== "D")
    && (event.priorityScore ?? 0) >= 24
    && event.scoring.topicRelevanceScore >= 2;
  const discoveryLead = (event.route === "hold" || event.route === "rejected")
    && event.sourceTiers.includes("D")
    && (event.priorityScore ?? 0) >= 30
    && event.scoring.topicRelevanceScore >= 2.4;
  return Boolean(routed || attributableLead || discoveryLead);
}

export function dailySelectionCandidates(
  reports: ShadowRunReport[],
  scheduledTime: number,
): EventRecord[] {
  const cutoff = scheduledTime - 48 * 60 * 60 * 1_000;
  const merged = new Map<string, EventRecord>();
  for (const report of reports) {
    for (const event of report.events) {
      if (!isEditorialCandidate(event)) continue;
      const updatedAt = Date.parse(event.lastUpdatedAt);
      if (!Number.isFinite(updatedAt) || updatedAt < cutoff || updatedAt > scheduledTime + 5 * 60 * 1_000) continue;
      const prior = merged.get(event.id);
      if (!prior || Date.parse(prior.lastUpdatedAt) < updatedAt) merged.set(event.id, event);
    }
  }
  return [...merged.values()].sort((left, right) =>
    Number(matchCoreCompanies([right.titleZh, right.titleEn, ...right.entities]).length > 0)
      - Number(matchCoreCompanies([left.titleZh, left.titleEn, ...left.entities]).length > 0)
      || (right.priorityScore ?? 0) - (left.priorityScore ?? 0)
      || new Date(right.lastUpdatedAt).getTime() - new Date(left.lastUpdatedAt).getTime());
}

function input(event: EventRecord): ModelScoringInput {
  return {
    eventId: event.id,
    title: event.titleZh,
    summary: event.summaryZh,
    sourceTier: strongestTier(event.sourceTiers),
    evidenceStatus: event.evidenceStatus,
    independentSourceCount: event.independentSourceCount,
    coreCompanies: matchCoreCompanies([event.titleZh, event.titleEn, ...event.entities]).map((company) => company.name),
    sourceChain: event.sourceChain.map((source) => ({
      sourceId: source.sourceId,
      url: source.url,
      relationship: source.relationship,
      accessStatus: source.accessStatus,
      ...(source.publishedAt ? { publishedAt: source.publishedAt } : {}),
    })),
    routeCandidates: event.routeCandidates,
    entities: event.entities,
    facts: event.facts.map((fact) => ({
      factType: fact.factType,
      valueText: fact.valueText,
      qualifier: fact.qualifier,
      capacityType: fact.capacityType,
    })),
    lastUpdatedAt: event.lastUpdatedAt,
  };
}

export function selectionItem(event: EventRecord, result: ModelScoringResult): DailyMaterialSelectionItem {
  const coreCompanies = matchCoreCompanies([event.titleZh, event.titleEn, ...event.entities]).map((company) => company.name);
  return {
    eventId: event.id,
    titleZh: event.titleZh,
    titleEn: event.titleEn,
    summaryZh: event.summaryZh,
    summaryEn: event.summaryEn,
    route: event.route ?? "research-queue",
    routeCandidates: event.routeCandidates ?? [],
    priorityScore: event.priorityScore ?? 0,
    band: modelMaterialBand(result, {
      sourceTier: strongestTier(event.sourceTiers),
      independentSourceCount: event.independentSourceCount,
      coreCompanyCount: coreCompanies.length,
    }),
    publicationReadiness: event.route !== "hold"
      && event.route !== "rejected"
      && (event.priorityScore ?? 0) >= (event.route === "rumor-watch" ? 30 : 34)
      ? "eligible-by-rules"
      : "needs-source-verification",
    evidenceStatus: event.evidenceStatus,
    sourceTiers: event.sourceTiers,
    independentSourceCount: event.independentSourceCount,
    coreCompanies,
    entities: event.entities,
    region: event.region,
    facts: event.facts,
    sourceChain: event.sourceChain,
    firstSeenAt: event.firstSeenAt,
    lastUpdatedAt: event.lastUpdatedAt,
    sourceLastUpdatedAt: event.lastUpdatedAt,
    result,
  };
}

function fallbackResult(event: EventRecord, scoredAt: string, reason: string): ModelScoringResult {
  const scores = {
    topicRelevanceScore: event.scoring.topicRelevanceScore,
    mechanismDepthScore: event.scoring.mechanismDepthScore,
    specificityScore: event.scoring.specificityScore,
    researchValueScore: event.scoring.researchValueScore,
    readerValueScore: event.scoring.readerValueScore,
  };
  return {
    schemaVersion: "atlas-model-score.v1",
    mode: "shadow",
    routeImpact: false,
    provider: "deterministic-fallback",
    model: "atlas-deterministic-fallback-v1",
    scoredAt,
    scores,
    semanticScore: semanticScore(scores),
    rationale: "外部模型未完成评分，保留确定性候选，交由 Atlas Editor 继续筛选。",
    reasonCodes: ["model-scoring-fallback", reason],
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
  };
}

function sortItems(items: DailyMaterialSelectionItem[]): DailyMaterialSelectionItem[] {
  return items.sort((left, right) =>
    right.result.semanticScore - left.result.semanticScore
      || right.priorityScore - left.priorityScore
      || Date.parse(right.lastUpdatedAt) - Date.parse(left.lastUpdatedAt));
}

export function dailyCandidatePacket(report: DailyMaterialSelectionReport): DailyEditorialCandidatePacket {
  const selected = report.items.filter((item) => item.band === "selected");
  const watch = report.items.filter((item) => item.band === "watch");
  const ruleEligibleCount = selected.filter((item) => item.publicationReadiness === "eligible-by-rules").length;
  const copyReadyCount = [...selected, ...watch].filter((item) => {
    const copy = item.result.publicCopy;
    if (!copy) return false;
    return validateBilingualPair({ ...copy, entities: item.entities }).status === "pass";
  }).length;
  return {
    schemaVersion: "atlas-daily-candidate-packet.v1",
    day: report.day,
    generatedAt: report.generatedAt,
    sourceSlots: report.sourceSlots,
    model: report.model,
    status: report.status,
    candidateCount: report.candidateCount,
    selectedCount: selected.length,
    watchCount: watch.length,
    ruleEligibleCount,
    copyReadyCount,
    publicationReadyCount: 0,
    fallbackCount: report.items.filter((item) => item.result.provider === "deterministic-fallback").length,
    selected,
    watch,
    errors: report.errors,
  };
}

async function eventReports(env: Env, day: string): Promise<Array<{ slot: DailySelectionSlot; report: ShadowRunReport }>> {
  const slots: DailySelectionSlot[] = ["event-night", "event-midday", "event-day"];
  const reports = await Promise.all(slots.map(async (slot) => ({
    slot,
    report: await env.IDC_DAILY_SNAPSHOTS.get<ShadowRunReport>(eventRunKey(slot, day), "json"),
  })));
  return reports.flatMap(({ slot, report }) => report ? [{ slot, report }] : []);
}

export async function runDailyModelSelection(
  env: Env,
  scheduledTime: number,
  slot: DailySelectionSlot,
  options: { fetcher?: typeof fetch } = {},
): Promise<DailyMaterialSelectionReport> {
  const scheduledDate = new Date(scheduledTime);
  const day = beijingDay(scheduledDate);
  const generatedAt = scheduledDate.toISOString();
  const status = modelScoringStatus(env);
  const reportEntries = await eventReports(env, day);
  const packetKey = candidatePacketKey(day);
  if (!reportEntries.length) {
    const skipped: DailyMaterialSelectionReport = {
      schemaVersion: "atlas-daily-model-selection.v1",
      day,
      generatedAt,
      sourceSlots: reportEntries.map((entry) => entry.slot),
      status: "skipped",
      model: status.model,
      candidateCount: 0,
      newCandidateCount: 0,
      alreadyScoredCount: 0,
      attemptedCount: 0,
      selectedCount: 0,
      watchCount: 0,
      droppedCount: 0,
      fallbackCount: 0,
      packetKey,
      items: [],
      errors: ["当日事件管线尚无可用结果。"],
    };
    const packet = dailyCandidatePacket(skipped);
    await Promise.all([
      env.IDC_DAILY_SNAPSHOTS.put(DAILY_MODEL_SELECTION_LATEST_KEY, JSON.stringify(skipped)),
      env.IDC_DAILY_SNAPSHOTS.put(DAILY_CANDIDATE_PACKET_LATEST_KEY, JSON.stringify(packet)),
    ]);
    return skipped;
  }

  const candidateList = dailySelectionCandidates(reportEntries.map((entry) => entry.report), scheduledTime);
  if (!status.ready) {
    const items = sortItems(candidateList.map((event) => selectionItem(event, fallbackResult(event, generatedAt, "model-provider-unavailable"))));
    const output: DailyMaterialSelectionReport = {
      schemaVersion: "atlas-daily-model-selection.v1",
      day,
      generatedAt,
      sourceSlots: reportEntries.map((entry) => entry.slot),
      status: "partial",
      model: status.model,
      candidateCount: candidateList.length,
      newCandidateCount: candidateList.length,
      alreadyScoredCount: 0,
      attemptedCount: 0,
      selectedCount: items.filter((item) => item.band === "selected").length,
      watchCount: items.filter((item) => item.band === "watch").length,
      droppedCount: items.filter((item) => item.band === "dropped").length,
      fallbackCount: items.length,
      packetKey,
      items,
      errors: ["DeepSeek Worker Secret 尚未配置；已使用确定性评分保留候选。"],
    };
    const packet = dailyCandidatePacket(output);
    await Promise.all([
      env.IDC_DAILY_SNAPSHOTS.put(DAILY_MODEL_SELECTION_LATEST_KEY, JSON.stringify(output)),
      env.IDC_DAILY_SNAPSHOTS.put(selectionDayKey(day), JSON.stringify(output)),
      env.IDC_DAILY_SNAPSHOTS.put(DAILY_CANDIDATE_PACKET_LATEST_KEY, JSON.stringify(packet)),
      env.IDC_DAILY_SNAPSHOTS.put(packetKey, JSON.stringify(packet)),
    ]);
    return output;
  }
  const [sameDay, priorDay] = await Promise.all([
    env.IDC_DAILY_SNAPSHOTS.get<DailyMaterialSelectionReport>(selectionDayKey(day), "json"),
    env.IDC_DAILY_SNAPSHOTS.get<DailyMaterialSelectionReport>(selectionDayKey(beijingDay(new Date(scheduledTime - 86_400_000))), "json"),
  ]);
  const sameDayById = new Map((sameDay?.items ?? []).map((item) => [item.eventId, item]));
  const priorDayById = new Map((priorDay?.items ?? []).map((item) => [item.eventId, item]));
  const unchangedSameDay: DailyMaterialSelectionItem[] = [];
  const queue: EventRecord[] = [];
  let alreadyScoredCount = 0;
  for (const event of candidateList) {
    const same = sameDayById.get(event.id);
    if (same?.sourceLastUpdatedAt === event.lastUpdatedAt && same.result.provider !== "deterministic-fallback") {
      unchangedSameDay.push(same);
      alreadyScoredCount += 1;
      continue;
    }
    const prior = priorDayById.get(event.id);
    if (prior?.sourceLastUpdatedAt === event.lastUpdatedAt && prior.result.provider !== "deterministic-fallback") {
      alreadyScoredCount += 1;
      continue;
    }
    queue.push(event);
  }

  const usageKey = modelUsageKey(scheduledDate);
  const callsToday = Number.parseInt(await env.IDC_DAILY_SNAPSHOTS.get(usageKey) ?? "0", 10) || 0;
  const remaining = Math.max(0, status.dailyCallLimit - callsToday);
  const morningClosureLimit = Math.ceil(status.dailyCallLimit * 0.75);
  const perLaterSlotLimit = Math.ceil(status.dailyCallLimit * 0.25);
  const slotLimit = slot === "event-night"
    ? Math.min(remaining, morningClosureLimit)
    : slot === "event-day"
      ? remaining
      : Math.min(remaining, perLaterSlotLimit);
  const scoreQueue = queue.slice(0, slotLimit);
  const scoredItems: DailyMaterialSelectionItem[] = [];
  const fallbackItems: DailyMaterialSelectionItem[] = queue.slice(slotLimit)
    .map((event) => selectionItem(event, fallbackResult(event, generatedAt, "daily-model-call-limit")));
  const handledEventIds = new Set<string>();
  const errors: string[] = [];
  let attemptedCount = 0;
  for (let offset = 0; offset < scoreQueue.length && errors.length < 2; offset += 4) {
    const chunk = scoreQueue.slice(offset, offset + 4);
    attemptedCount += chunk.length;
    const results = await Promise.allSettled(chunk.map(async (event) => ({
      event,
      result: await scoreWithOpenAiCompatible(env, input(event), options.fetcher),
    })));
    results.forEach((settled, index) => {
      if (settled.status === "fulfilled") {
        scoredItems.push(selectionItem(settled.value.event, settled.value.result));
        handledEventIds.add(settled.value.event.id);
      } else {
        const message = settled.reason instanceof Error ? settled.reason.message : "评分失败";
        errors.push(`${chunk[index]?.id ?? "unknown"}: ${message}`);
        const failedEvent = chunk[index];
        if (failedEvent) {
          handledEventIds.add(failedEvent.id);
          fallbackItems.push(selectionItem(failedEvent, fallbackResult(failedEvent, generatedAt, "model-request-failed")));
        }
      }
    });
  }

  for (const event of scoreQueue) {
    if (!handledEventIds.has(event.id)) {
      fallbackItems.push(selectionItem(event, fallbackResult(event, generatedAt, "model-circuit-breaker")));
    }
  }

  const items = sortItems([...unchangedSameDay, ...scoredItems, ...fallbackItems]);
  const fallbackCount = items.filter((item) => item.result.provider === "deterministic-fallback").length;
  const outputErrors = [...errors];
  if (fallbackCount) {
    const categories = [...new Set(items
      .filter((item) => item.result.provider === "deterministic-fallback")
      .flatMap((item) => item.result.reasonCodes.filter((reason) => reason !== "model-scoring-fallback")))];
    outputErrors.push(`fallback-scoring:${fallbackCount}:${categories.join(",") || "unknown"}`);
  }
  const output: DailyMaterialSelectionReport = {
    schemaVersion: "atlas-daily-model-selection.v1",
    day,
    generatedAt,
    sourceSlots: reportEntries.map((entry) => entry.slot),
    status: outputErrors.length ? "partial" : "completed",
    model: status.model,
    candidateCount: candidateList.length,
    newCandidateCount: queue.length,
    alreadyScoredCount,
    attemptedCount,
    selectedCount: items.filter((item) => item.band === "selected").length,
    watchCount: items.filter((item) => item.band === "watch").length,
    droppedCount: items.filter((item) => item.band === "dropped").length,
    fallbackCount,
    packetKey,
    items,
    errors: outputErrors,
  };
  const packet = dailyCandidatePacket(output);
  await Promise.all([
    env.IDC_DAILY_SNAPSHOTS.put(DAILY_MODEL_SELECTION_LATEST_KEY, JSON.stringify(output)),
    env.IDC_DAILY_SNAPSHOTS.put(selectionDayKey(day), JSON.stringify(output)),
    env.IDC_DAILY_SNAPSHOTS.put(DAILY_CANDIDATE_PACKET_LATEST_KEY, JSON.stringify(packet)),
    env.IDC_DAILY_SNAPSHOTS.put(packetKey, JSON.stringify(packet)),
    env.IDC_DAILY_SNAPSHOTS.put(usageKey, String(callsToday + attemptedCount), { expirationTtl: 172_800 }),
  ]);
  console.log(JSON.stringify({
    message: "Daily model material selection saved",
    day,
    slot,
    sourceSlots: output.sourceSlots,
    status: output.status,
    candidates: output.candidateCount,
    newCandidates: output.newCandidateCount,
    alreadyScored: output.alreadyScoredCount,
    attempted: output.attemptedCount,
    selected: output.selectedCount,
    ruleEligible: packet.ruleEligibleCount,
    fallback: output.fallbackCount,
    errors: output.errors.length,
  }));
  return output;
}
