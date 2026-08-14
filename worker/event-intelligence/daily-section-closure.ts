import type { DailyEditorialCandidatePacket, DailyMaterialSelectionItem } from "./daily-model-selection.ts";

export type AtlasDailySectionId =
  | "idc-pulse"
  | "listed-companies"
  | "mna"
  | "capacity"
  | "cooling"
  | "compute-products"
  | "china-gpu"
  | "supply-chain"
  | "power-model-demand"
  | "earnings-calendar"
  | "rumors"
  | "policy"
  | "columns";

export type AtlasDailySectionOutcome = {
  section: AtlasDailySectionId;
  status: "updated" | "verified-no-change" | "blocked";
  publicationMode: "auto-published" | "candidate-ready" | "internal-only" | "no-change" | "needs-review";
  candidateEventIds: string[];
  eligibleEventIds: string[];
  blockedEventIds: string[];
  reason: string;
};

export type AtlasDailyClosureReport = {
  schemaVersion: "atlas-daily-section-closure.v1";
  day: string;
  generatedAt: string;
  scheduledForBeijing: "06:30";
  status: "completed" | "partial" | "blocked";
  sourcePacketGeneratedAt: string | null;
  sourceSlots: string[];
  sections: AtlasDailySectionOutcome[];
  counts: {
    updated: number;
    verifiedNoChange: number;
    blocked: number;
  };
  retryRequired: boolean;
};

export const DAILY_SECTION_CLOSURE_LATEST_KEY = "atlas-daily-update:closure:latest";

const SECTION_IDS: AtlasDailySectionId[] = [
  "idc-pulse",
  "listed-companies",
  "mna",
  "capacity",
  "cooling",
  "compute-products",
  "china-gpu",
  "supply-chain",
  "power-model-demand",
  "earnings-calendar",
  "rumors",
  "policy",
  "columns",
];

const patterns: Partial<Record<AtlasDailySectionId, RegExp>> = {
  "listed-companies": /财报|业绩|指引|营收|capital expenditure|capex|earnings|guidance|revenue|SEC|交易所|上市/i,
  mna: /并购|收购|合并|融资|投资|合资|acqui|merger|financ|funding|investment|joint venture|stake/i,
  capacity: /数据中心|园区|机房|容量|租约|AI 工厂|data cent(?:er|re)|campus|capacity|lease|AI factory|GW|MW/i,
  cooling: /液冷|冷板|浸没|散热|cooling|liquid cool|cold plate|immersion|thermal/i,
  "compute-products": /NVIDIA|AMD|英伟达|GPU|CPU|NPU|accelerator|Blackwell|Rubin|MI\d|rack.?scale|superpod/i,
  "china-gpu": /华为|海光|沐曦|摩尔线程|壁仞|燧原|寒武纪|天数智芯|昆仑芯|中科曙光|国产\s*(?:GPU|算力|芯片)|China.{0,12}(?:GPU|accelerator)/i,
  "supply-chain": /服务器|机柜|交换机|光模块|网络|变压器|UPS|母线|电源|内存|HBM|server|rack|switch|optical|network|transformer|memory/i,
  "power-model-demand": /电力|电网|并网|PPA|供电|模型|推理|训练|token|power|grid|interconnect|model|inference|training|cloud/i,
  "earnings-calendar": /财报|业绩|电话会|指引|季度|earnings|results|conference call|guidance|quarter/i,
};

function beijingDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(date);
}

function closureKey(day: string): string {
  return `atlas-daily-update:closure:${day}`;
}

function itemText(item: DailyMaterialSelectionItem): string {
  return [item.titleZh, item.titleEn, item.summaryZh, item.summaryEn, ...(item.coreCompanies ?? [])].join(" ");
}

function sectionsFor(item: DailyMaterialSelectionItem): AtlasDailySectionId[] {
  const sections = new Set<AtlasDailySectionId>();
  const text = itemText(item);
  const pulseCandidate = item.routeCandidates.includes("pulse") || item.route === "pulse";
  if (pulseCandidate) sections.add("idc-pulse");
  if (item.routeCandidates.includes("rumor-watch") || item.route === "rumor-watch") sections.add("rumors");
  if (item.routeCandidates.includes("policy-index") || item.route === "policy-index") sections.add("policy");
  if (item.routeCandidates.includes("research-queue") || item.route === "research-queue") sections.add("columns");
  if (pulseCandidate) {
    for (const [section, pattern] of Object.entries(patterns) as Array<[AtlasDailySectionId, RegExp]>) {
      if (pattern.test(text)) sections.add(section);
    }
    if ((item.coreCompanies?.length ?? 0) > 0) sections.add("listed-companies");
  }
  return [...sections];
}

function accessiblePrimarySource(item: DailyMaterialSelectionItem): boolean {
  const primaryTier = item.sourceTiers.some((tier) => tier === "T0" || tier === "T1");
  const accessibleOrigin = (item.sourceChain ?? []).some((source) =>
    (source.relationship === "origin" || source.relationship === "confirmation" || source.relationship === "official_response")
      && Boolean(source.url)
      && source.accessStatus !== "blocked"
      && source.accessStatus !== "paywalled");
  return primaryTier && accessibleOrigin;
}

function formalEligible(item: DailyMaterialSelectionItem): boolean {
  return item.band === "selected"
    && item.publicationReadiness === "eligible-by-rules"
    && accessiblePrimarySource(item)
    && (item.evidenceStatus === "officially_confirmed" || item.evidenceStatus === "official_response");
}

export function isAttributableRumorReport(item: DailyMaterialSelectionItem): boolean {
  return item.route === "rumor-watch"
    && (item.band === "selected" || item.band === "watch")
    && item.evidenceStatus !== "lead"
    && item.sourceTiers.some((tier) => tier === "T2" || tier === "T3")
    && (item.sourceChain ?? []).some((source) => Boolean(source.url) && source.accessStatus !== "blocked" && source.accessStatus !== "paywalled");
}

export function buildDailySectionClosure(
  packet: DailyEditorialCandidatePacket | null,
  scheduledTime: number,
): AtlasDailyClosureReport {
  const generatedAt = new Date(scheduledTime).toISOString();
  const day = beijingDay(new Date(scheduledTime));
  const packetCurrent = packet?.day === day && packet.sourceSlots.includes("event-night") && packet.status !== "skipped";
  const candidates = packetCurrent ? [...packet.selected, ...packet.watch] : [];

  const sections = SECTION_IDS.map((section): AtlasDailySectionOutcome => {
    if (!packetCurrent) {
      return {
        section,
        status: "blocked",
        publicationMode: "needs-review",
        candidateEventIds: [],
        eligibleEventIds: [],
        blockedEventIds: [],
        reason: "当日 05:30 事件管线或 DeepSeek 候选包未形成有效闭环。",
      };
    }
    const relevant = candidates.filter((item) => sectionsFor(item).includes(section));
    if (!relevant.length) {
      return {
        section,
        status: "verified-no-change",
        publicationMode: "no-change",
        candidateEventIds: [],
        eligibleEventIds: [],
        blockedEventIds: [],
        reason: "当日已完成来源扫描，未发现满足新增或实质变化条件的候选。",
      };
    }
    if (section === "columns") {
      return {
        section,
        status: "blocked",
        publicationMode: "needs-review",
        candidateEventIds: relevant.map((item) => item.eventId),
        eligibleEventIds: [],
        blockedEventIds: relevant.map((item) => item.eventId),
        reason: "研究候选已形成，但深度专栏必须经过来源账本、机制分析和人工复核。",
      };
    }
    if (section === "policy") {
      const eligible = relevant.filter(formalEligible);
      return {
        section,
        status: eligible.length ? "updated" : "blocked",
        publicationMode: "internal-only",
        candidateEventIds: relevant.map((item) => item.eventId),
        eligibleEventIds: eligible.map((item) => item.eventId),
        blockedEventIds: relevant.filter((item) => !formalEligible(item)).map((item) => item.eventId),
        reason: eligible.length ? "政策变化已进入内部监测记录，不恢复公开政策页。" : "政策线索缺少满足正式事实门槛的一手来源或双语核验。",
      };
    }
    const eligible = relevant.filter(section === "rumors" ? isAttributableRumorReport : formalEligible);
    const blocked = relevant.filter((item) => !(section === "rumors" ? isAttributableRumorReport(item) : formalEligible(item)));
    if (eligible.length) {
      return {
        section,
        status: "updated",
        publicationMode: section === "rumors" ? "auto-published" : "candidate-ready",
        candidateEventIds: relevant.map((item) => item.eventId),
        eligibleEventIds: eligible.map((item) => item.eventId),
        blockedEventIds: blocked.map((item) => item.eventId),
        reason: blocked.length ? "已有通过门槛的新增候选；其余条目留待 09:30 复核。" : "新增候选已通过来源、证据和双语规则门槛。",
      };
    }
    return {
      section,
      status: "blocked",
      publicationMode: "needs-review",
      candidateEventIds: relevant.map((item) => item.eventId),
      eligibleEventIds: [],
      blockedEventIds: relevant.map((item) => item.eventId),
      reason: "存在候选，但一手来源、证据状态或双语发布规则尚未全部通过。",
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
    sourceSlots: packet?.sourceSlots ?? [],
    sections,
    counts,
    retryRequired: counts.blocked > 0,
  };
}

export async function runDailySectionClosure(env: Env, scheduledTime: number): Promise<AtlasDailyClosureReport> {
  const packet = await env.IDC_DAILY_SNAPSHOTS.get<DailyEditorialCandidatePacket>("event-intelligence:daily-candidates:latest", "json");
  const report = buildDailySectionClosure(packet, scheduledTime);
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
