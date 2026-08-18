import type { SourceTier } from "../connectors/types.ts";
import { validateBilingualPair } from "./provider-contract.ts";
import type { DailyEditorialCandidatePacket, DailyMaterialSelectionItem } from "./daily-model-selection.ts";
import type { AtlasDailySectionId } from "./source-coverage.ts";

export type AtlasEditorPublicCopy = {
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
};

export type AtlasEditorPublicClaim = {
  claim: string;
  sourceRefs: string[];
  state: "source-stated" | "reported";
  qualifier?: string;
  capacityType?: string;
};

export type AtlasEditorDecision = {
  eventId: string;
  action: "publish" | "watch" | "hold" | "reject";
  route: "formal-section" | "rumor-watch" | "research-queue" | "internal";
  section: AtlasDailySectionId | null;
  sourceTier: SourceTier;
  evidenceStatus: string;
  canonicalUrls: string[];
  reasonCodes: string[];
  publicCopy: AtlasEditorPublicCopy | null;
  publicClaims: AtlasEditorPublicClaim[];
  internalNotes: string[];
  fallbackScored: boolean;
  holdClass: "blocking" | "watch" | null;
  entities: string[];
  region: string;
  publishedAt: string;
  sourceId: string | null;
};

export type AtlasEditorDecisionPacket = {
  schemaVersion: "atlas-editor-decision.v1";
  generatedAt: string;
  cutoffAt: string;
  timezone: "Asia/Shanghai";
  day: string;
  status: "completed" | "partial" | "blocked";
  sourcePacketGeneratedAt: string | null;
  decisions: AtlasEditorDecision[];
  summary: {
    publishFormal: number;
    publishRumor: number;
    research: number;
    hold: number;
    reject: number;
    fallbackScored: number;
    adapterReady: number;
    blockingHold: number;
  };
};

export const ATLAS_EDITOR_DECISION_LATEST_KEY = "atlas-editor:decision:latest";

const FORMAL_ADAPTER_SECTIONS = new Set<AtlasDailySectionId>([
  "idc-pulse",
  "listed-companies",
  "capacity",
  "cooling",
  "compute-products",
  "china-gpu",
  "supply-chain",
  "power-model-demand",
]);

const tierOrder: SourceTier[] = ["T0", "T1", "T2", "T3", "T4", "T5", "D"];

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function strongestTier(tiers: SourceTier[]): SourceTier {
  return tierOrder.find((tier) => tiers.includes(tier)) ?? "D";
}

function itemText(item: DailyMaterialSelectionItem): string {
  return [item.titleZh, item.titleEn, item.summaryZh, item.summaryEn, ...item.entities, ...item.coreCompanies].join(" ");
}

export function editorSectionFor(item: DailyMaterialSelectionItem): AtlasDailySectionId {
  if (item.route === "rumor-watch") return "rumors";
  if (item.route === "policy-index" || item.routeCandidates.includes("policy-index")) return "policy";
  if (item.route === "research-queue" && !item.routeCandidates.includes("pulse")) return "columns";
  const text = itemText(item);
  if (/并购|收购|合并|股权|合资|acqui|merger|joint venture|stake/i.test(text)) return "mna";
  if (/财报|业绩|营收|利润|指引|earnings|results|revenue|guidance|quarter/i.test(text)) return "listed-companies";
  if (/液冷|冷板|浸没|散热|cooling|liquid cool|cold plate|immersion|thermal/i.test(text)) return "cooling";
  if (/华为|海光|沐曦|摩尔线程|壁仞|燧原|寒武纪|天数智芯|昆仑芯|国产.{0,8}(?:GPU|算力|芯片)|China.{0,12}(?:GPU|accelerator)/i.test(text)) return "china-gpu";
  if (/数据中心|园区|机房|容量|租约|AI 工厂|data cent(?:er|re)|campus|capacity|lease|AI factory|GW|MW/i.test(text)) return "capacity";
  if (/NVIDIA|AMD|英伟达|GPU|CPU|NPU|accelerator|Blackwell|Rubin|MI\d|rack.?scale|superpod/i.test(text)) return "compute-products";
  if (/服务器|机柜|交换机|光模块|网络|变压器|UPS|母线|内存|HBM|server|rack|switch|optical|network|transformer|memory/i.test(text)) return "supply-chain";
  if (/电力|电网|并网|PPA|供电|模型|推理|训练|token|power|grid|interconnect|model|inference|training|cloud/i.test(text)) return "power-model-demand";
  if (item.coreCompanies.length) return "listed-companies";
  return "idc-pulse";
}

function accessibleSources(item: DailyMaterialSelectionItem) {
  return (item.sourceChain ?? []).filter((source) => Boolean(source.url)
    && !["blocked", "paywalled", "unavailable", "login-required"].includes(source.accessStatus));
}

function publicCopy(item: DailyMaterialSelectionItem): AtlasEditorPublicCopy | null {
  const candidate = item.result.publicCopy ?? {
    titleZh: item.titleZh,
    titleEn: item.titleEn,
    summaryZh: item.summaryZh,
    summaryEn: item.summaryEn,
  };
  if (!/[\u3400-\u9fff]/.test(`${candidate.titleZh} ${candidate.summaryZh}`)) return null;
  if (/[\u3400-\u9fff]/.test(candidate.titleEn)) return null;
  const validation = validateBilingualPair({ ...candidate, entities: item.entities });
  return validation.status === "pass" ? candidate : null;
}

function publicClaims(item: DailyMaterialSelectionItem, copy: AtlasEditorPublicCopy, urls: string[]): AtlasEditorPublicClaim[] {
  const usableFacts = item.facts.filter((fact) => fact.valueText.trim());
  if (!usableFacts.length) {
    return [{
      claim: copy.summaryEn,
      sourceRefs: urls,
      state: item.evidenceStatus === "officially_confirmed" || item.evidenceStatus === "official_response" ? "source-stated" : "reported",
    }];
  }
  return usableFacts.map((fact) => ({
    claim: fact.valueText,
    sourceRefs: urls,
    state: fact.confidenceState === "reported" ? "reported" : "source-stated",
    ...(fact.qualifier ? { qualifier: fact.qualifier } : {}),
    ...(fact.capacityType ? { capacityType: fact.capacityType } : {}),
  }));
}

function decisionFor(item: DailyMaterialSelectionItem): AtlasEditorDecision {
  const section = editorSectionFor(item);
  const tier = strongestTier(item.sourceTiers);
  const sources = accessibleSources(item);
  const urls = [...new Set(sources.map((source) => source.url))];
  const primarySources = sources.filter((source) => source.tier === "T0" || source.tier === "T1");
  const primaryUrls = [...new Set(primarySources.map((source) => source.url))];
  const reportingSources = sources.filter((source) => source.tier === "T2" || source.tier === "T3");
  const reportingUrls = [...new Set(reportingSources.map((source) => source.url))];
  const copy = publicCopy(item);
  const fallbackScored = item.result.provider === "deterministic-fallback";
  const common = (canonicalSources: typeof sources, canonicalUrls: string[]) => ({
    eventId: item.eventId,
    section,
    sourceTier: tier,
    evidenceStatus: item.evidenceStatus,
    canonicalUrls,
    fallbackScored,
    holdClass: null,
    entities: item.entities,
    region: item.region,
    publishedAt: canonicalSources[0]?.publishedAt ?? item.lastUpdatedAt,
    sourceId: canonicalSources[0]?.sourceId ?? null,
  });
  const formalEvidence = (tier === "T0" || tier === "T1")
    && item.band === "selected"
    && item.publicationReadiness === "eligible-by-rules"
    && (item.evidenceStatus === "officially_confirmed" || item.evidenceStatus === "official_response")
    && primaryUrls.length > 0;
  if (formalEvidence && FORMAL_ADAPTER_SECTIONS.has(section) && copy) {
    return {
      ...common(primarySources, primaryUrls),
      action: "publish",
      route: "formal-section",
      reasonCodes: unique([...item.result.reasonCodes, ...(fallbackScored ? ["model-scoring-fallback"] : []), "formal-primary-source", "bilingual-copy-valid", "public-adapter-ready"]),
      publicCopy: copy,
      publicClaims: publicClaims(item, copy, primaryUrls),
      internalNotes: [],
    };
  }
  const rumorEvidence = section === "rumors"
    && (tier === "T2" || tier === "T3")
    && (item.band === "selected" || item.band === "watch")
    && item.evidenceStatus !== "lead"
    && reportingUrls.length > 0;
  if (rumorEvidence && copy) {
    return {
      ...common(reportingSources, reportingUrls),
      action: "publish",
      route: "rumor-watch",
      reasonCodes: unique([...item.result.reasonCodes, ...(fallbackScored ? ["model-scoring-fallback"] : []), "attributable-media-report", "bilingual-copy-valid"]),
      publicCopy: copy,
      publicClaims: publicClaims(item, copy, reportingUrls).map((claim) => ({ ...claim, state: "reported" })),
      internalNotes: [],
    };
  }
  if (section === "columns" || item.routeCandidates.includes("research-queue")) {
    return {
      ...common(sources, urls),
      action: "watch",
      route: "research-queue",
      reasonCodes: unique([...item.result.reasonCodes, "research-mechanism-review"]),
      publicCopy: null,
      publicClaims: [],
      internalNotes: [fallbackScored ? "model-scoring-fallback" : "research packet required before article publication"],
    };
  }
  const holdReasons = [
    ...(urls.length ? [] : ["canonical-source-unavailable"]),
    ...((tier === "T0" || tier === "T1") && primaryUrls.length === 0 ? ["primary-source-inaccessible"] : []),
    ...(copy ? [] : ["bilingual-copy-invalid-or-incomplete"]),
    ...(formalEvidence && !FORMAL_ADAPTER_SECTIONS.has(section) ? ["structured-public-adapter-unavailable"] : []),
  ];
  if (!holdReasons.length) holdReasons.push("publication-gate-not-met");
  const materialCandidate = item.band === "selected" && item.publicationReadiness === "eligible-by-rules";
  const evidenceCandidate = tier === "T0" || tier === "T1" || (section === "rumors" && (tier === "T2" || tier === "T3"));
  const holdClass = materialCandidate && evidenceCandidate && holdReasons.some((reason) => [
    "canonical-source-unavailable",
    "primary-source-inaccessible",
    "bilingual-copy-invalid-or-incomplete",
    "structured-public-adapter-unavailable",
  ].includes(reason)) ? "blocking" : "watch";
  return {
    ...common(sources, urls),
    action: "hold",
    route: "internal",
    holdClass,
    reasonCodes: unique([...item.result.reasonCodes, ...holdReasons]),
    publicCopy: null,
    publicClaims: [],
    internalNotes: holdReasons,
  };
}

function beijingDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(date);
}

export function decisionKey(day: string): string {
  return `atlas-editor:decision:${day}`;
}

export function buildAtlasEditorDecision(
  packet: DailyEditorialCandidatePacket | null,
  scheduledTime: number,
): AtlasEditorDecisionPacket {
  const now = new Date(scheduledTime);
  const day = beijingDay(now);
  const current = packet?.day === day && packet.status !== "skipped";
  const decisions = current ? [...packet.selected, ...packet.watch].map(decisionFor) : [];
  const summary = {
    publishFormal: decisions.filter((decision) => decision.action === "publish" && decision.route === "formal-section").length,
    publishRumor: decisions.filter((decision) => decision.action === "publish" && decision.route === "rumor-watch").length,
    research: decisions.filter((decision) => decision.action === "watch").length,
    hold: decisions.filter((decision) => decision.action === "hold").length,
    reject: decisions.filter((decision) => decision.action === "reject").length,
    fallbackScored: decisions.filter((decision) => decision.fallbackScored).length,
    adapterReady: decisions.filter((decision) => decision.action === "publish").length,
    blockingHold: decisions.filter((decision) => decision.action === "hold" && decision.holdClass === "blocking").length,
  };
  return {
    schemaVersion: "atlas-editor-decision.v1",
    generatedAt: now.toISOString(),
    cutoffAt: now.toISOString(),
    timezone: "Asia/Shanghai",
    day,
    status: !current ? "blocked" : summary.blockingHold ? "partial" : "completed",
    sourcePacketGeneratedAt: packet?.generatedAt ?? null,
    decisions,
    summary,
  };
}

export async function runAtlasAutoEditor(env: Env, scheduledTime: number): Promise<AtlasEditorDecisionPacket> {
  const packet = await env.IDC_DAILY_SNAPSHOTS.get<DailyEditorialCandidatePacket>("event-intelligence:daily-candidates:latest", "json");
  const decision = buildAtlasEditorDecision(packet, scheduledTime);
  await Promise.all([
    env.IDC_DAILY_SNAPSHOTS.put(ATLAS_EDITOR_DECISION_LATEST_KEY, JSON.stringify(decision)),
    env.IDC_DAILY_SNAPSHOTS.put(decisionKey(decision.day), JSON.stringify(decision)),
  ]);
  console.log(JSON.stringify({ message: "Atlas Auto Editor decision saved", day: decision.day, status: decision.status, ...decision.summary }));
  return decision;
}
