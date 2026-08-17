import type { ConnectorResult, ObservationEnvelope, SourceDefinition, SourceTier } from "../connectors/types.ts";
import { recordedTranslationAdapter } from "./provider-contract.ts";

export const STRATEGY_VERSION = "atlas-event-v2";
export const CLASSIFIER_VERSION = "rules-v1";

export type TopicBucket =
  | "core-infrastructure"
  | "upstream-compute-demand"
  | "material-policy-capital"
  | "keyword-only"
  | "irrelevant";

export type NormalizedObservation = ObservationEnvelope & {
  id: string;
  normalizedTitle: string;
  normalizedSummary: string;
  canonicalUrlHash: string;
  contentHash: string;
  eventKey: string;
  eventKeyExplicit: boolean;
  sourceTier: SourceTier;
  independenceGroup: string;
};

export type Classification = {
  topicBucket: TopicBucket;
  isRelevant: boolean;
  uncertain: boolean;
  reasonCodes: string[];
};

export type FactCandidate = {
  factType: "capacity" | "financial-value" | "date";
  valueText: string;
  valueNumber?: number;
  unit?: string;
  qualifier?: string;
  capacityType?: "total_power" | "utility_power" | "it_capacity" | "gpu_nameplate_compute" | "leased_capacity" | "unspecified_capacity";
  confidenceState: "source-stated" | "reported" | "inference";
  sourceObservationId: string;
};

export type Analysis = {
  topicRelevanceScore: number;
  mechanismDepthScore: number;
  specificityScore: number;
  researchValueScore: number;
  readerValueScore: number;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  translationStatus: "complete" | "source-only" | "pending";
  entities: string[];
  facts: FactCandidate[];
  analysisStatus: "deterministic-shadow" | "pending" | "failed";
  reason: string;
};

export type AnalyzedObservation = NormalizedObservation & Classification & Analysis;

export type ClusterRelationship = {
  observationId: string;
  relationship: "origin" | "confirmation" | "official_response" | "syndication" | "translation" | "follow_up" | "contradiction";
  noveltyClass: "new-event" | "new-source" | "new-detail" | "official-response" | "contradiction" | "duplicate";
  newFactCount: number;
  isIndependentConfirmation: boolean;
  isMain: boolean;
};

export type EventCluster = {
  id: string;
  eventKey: string;
  eventType: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  firstSeenAt: string;
  lastUpdatedAt: string;
  eventTime: string | null;
  region: string;
  evidenceStatus: "lead" | "reported" | "official_response" | "officially_confirmed";
  observations: AnalyzedObservation[];
  relationships: ClusterRelationship[];
  entities: string[];
  locations: string[];
  sourceTiers: SourceTier[];
  independenceGroups: string[];
  independentSourceCount: number;
  mainObservationId: string;
  facts: FactCandidate[];
  priorityScore?: number;
  reasonCodes?: string[];
  route?: Route;
  routeCandidates?: Route[];
  eligible?: boolean;
};

export type Route = "rumor-watch" | "pulse" | "policy-index" | "research-queue" | "hold" | "rejected";

export type SelectionDecision = {
  eligible: boolean;
  priorityScore: number;
  route: Route;
  routeCandidates: Route[];
  reasonCodes: string[];
};

export type ShadowObservationAnalysis = {
  id: string;
  sourceId: string;
  endpointId: string;
  canonicalUrl: string;
  originalUrl: string;
  externalId: string | null;
  titleOriginal: string;
  summaryOriginal: string;
  language: string;
  author: string | null;
  publishedAt: string | null;
  discoveredAt: string;
  fetchedAt: string;
  contentHash: string;
  canonicalUrlHash: string;
  rawPayload: Record<string, unknown>;
  accessStatus: ObservationEnvelope["accessStatus"];
  sourceTier: SourceTier;
  eventKey: string;
  classification: Classification;
  analysis: Analysis;
};

export type ShadowRunReport = {
  schemaVersion: "atlas-event-shadow.v1";
  generatedAt: string;
  strategyVersion: string;
  classifierVersion: string;
  status: "succeeded" | "partial" | "failed" | "blocked";
  freshness: "live" | "partial" | "failed" | "blocked" | "verified-no-change";
  stats: {
    fetched: number;
    normalized: number;
    duplicates: number;
    relevant: number;
    uncertain: number;
    deepScored: number;
    clusters: number;
    publicEligible: number;
    rejected: number;
    held: number;
    errors: number;
    routeCounts: Record<Route, number>;
  };
  sourceHealth: Array<{
    sourceId: string;
    endpointId: string;
    tier: SourceTier;
    independenceGroup: string;
    status: ConnectorResult["status"];
    httpStatus?: number;
    responseMs?: number;
    observations: number;
    error?: string;
  }>;
  observationAnalysis: ShadowObservationAnalysis[];
  events: Array<Omit<EventCluster, "observations"> & {
    scoring: {
      topicRelevanceScore: number;
      mechanismDepthScore: number;
      specificityScore: number;
      researchValueScore: number;
      readerValueScore: number;
      analysisReason: string;
    };
    sourceChain: Array<{
      observationId: string;
      sourceId: string;
      tier: SourceTier;
      independenceGroup: string;
      relationship: ClusterRelationship["relationship"];
      noveltyClass: ClusterRelationship["noveltyClass"];
      newFactCount: number;
      title: string;
      url: string;
      publishedAt: string | null;
      accessStatus: ObservationEnvelope["accessStatus"];
    }>;
  }>;
  failures: string[];
  cost: {
    modelCalls: number;
    inputTokens: number;
    outputTokens: number;
    estimatedUsd: number;
    note: string;
  };
};

export const scoringConfig = {
  weights: {
    topicRelevance: 0.28,
    mechanismDepth: 0.23,
    specificity: 0.2,
    researchValue: 0.17,
    readerValue: 0.12,
  },
  tierWeight: { T0: 12, T1: 10, T2: 7, T3: 5, T4: 3, T5: 1, D: 0 } satisfies Record<SourceTier, number>,
  thresholds: {
    public: 40,
    research: 52,
  },
};

function normalizeWhitespace(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

export function canonicalizeUrl(input: string): string {
  try {
    const url = new URL(input.trim());
    const retained = [...url.searchParams.entries()]
      .filter(([key]) => !/^(utm_|fbclid$|gclid$|mc_|ref$|source$|spm$)/i.test(key))
      .sort(([left], [right]) => left.localeCompare(right));
    url.search = "";
    for (const [key, value] of retained) url.searchParams.append(key, value);
    url.hash = "";
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch {
    return input.trim();
  }
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function sourceFor(observation: ObservationEnvelope, sourceMap: Map<string, SourceDefinition>): SourceDefinition {
  return sourceMap.get(observation.sourceId) ?? {
    id: observation.sourceId,
    slug: observation.sourceId,
    name: observation.sourceId,
    tier: "D",
    publisherType: "unknown",
    region: "全球",
    language: observation.language,
    independenceGroup: observation.sourceId,
    topics: observation.topics ?? [],
    endpoint: { id: observation.endpointId, type: "manual", url: observation.originalUrl, parserKey: "unknown", pollIntervalMinutes: 60 },
    enabled: false,
  };
}

function eventKeyFromTitle(title: string, observation: ObservationEnvelope): string {
  const entity = observation.entities?.[0] ?? observation.sourceId;
  const eventType = observation.eventType ?? observation.topics?.[0] ?? "observation";
  return `auto|${entity}|${eventType}|${title.toLocaleLowerCase().slice(0, 160)}`;
}

export async function normalizeObservation(
  observation: ObservationEnvelope,
  sourceMap: Map<string, SourceDefinition>,
): Promise<NormalizedObservation> {
  const canonicalUrl = canonicalizeUrl(observation.canonicalUrl || observation.originalUrl);
  const normalizedTitle = normalizeWhitespace(observation.titleOriginal).replace(/\s*(?:\||｜)\s*(?:Reuters|Bloomberg|CNBC|AI HOT)\s*$/i, "");
  const normalizedSummary = normalizeWhitespace(observation.summaryOriginal).slice(0, 1200);
  const canonicalUrlHash = await sha256(canonicalUrl);
  const contentHash = await sha256(`${normalizedTitle}\n${normalizedSummary}`);
  const source = sourceFor(observation, sourceMap);
  return {
    ...observation,
    id: `obs-${canonicalUrlHash.slice(0, 20)}`,
    canonicalUrl,
    normalizedTitle,
    normalizedSummary,
    canonicalUrlHash,
    contentHash,
    eventKey: observation.eventKey?.trim() || eventKeyFromTitle(normalizedTitle, observation),
    eventKeyExplicit: Boolean(observation.eventKey?.trim()),
    sourceTier: source.tier,
    independenceGroup: source.independenceGroup,
  };
}

const topicSignals: Array<[TopicBucket, string[]]> = [
  ["core-infrastructure", ["data center", "数据中心", "datacenter", "campus", "园区", "capacity", "容量", "lease", "租约", "commission", "投运", "power", "电力", "grid", "电网", "cooling", "液冷", "network", "网络"]],
  ["upstream-compute-demand", ["gpu", "nvidia", "amd", "accelerator", "加速卡", "hbm", "memory", "内存", "server", "服务器", "model", "模型", "inference", "推理", "training", "训练"]],
  ["material-policy-capital", ["regulation", "policy", "permit", "approval", "law", "rule", "政策", "监管", "许可", "审批", "法规", "capex", "资本开支", "financing", "融资", "acquisition", "收购", "merger", "并购"]],
];

function hasAtlasSignal(text: string): boolean {
  return topicSignals.some(([, signals]) => signals.some((signal) => text.includes(signal)));
}

function hasConcretePolicySignal(text: string): boolean {
  return /data\s*cent(?:er|re)|datacenter|cloud|artificial intelligence|\bAI\b|GPU|accelerator|semiconductor|chip|memory|server|compute|power|electricity|energy|grid|capacity|cooling|water|network|telecom|数据中心|云|人工智能|芯片|内存|服务器|算力|电力|能源|电网|容量|液冷|网络|水资源/i.test(text);
}

export function classifyObservation(observation: NormalizedObservation): Classification {
  const text = `${observation.normalizedTitle} ${observation.normalizedSummary}`.toLocaleLowerCase();
  const bucket = topicSignals.find(([, signals]) => signals.some((signal) => text.includes(signal)))?.[0] ?? "irrelevant";
  const entityFound = Boolean(observation.entities?.length) || /\b(?:[A-Z][A-Za-z0-9.-]{2,}|[\u4e00-\u9fff]{2,})\b/.test(observation.titleOriginal);
  const measurable = /\b\d+(?:[.,]\d+)?\s?(?:mw|gw|kw|tb|gb|million|billion|亿元|亿美元|%|万平方)/i.test(text);
  const mechanism = /(?:contract|lease|permit|approval|commission|construction|interconnect|power|cooling|capacity|capex|融资|租约|许可|投运|建设|并网|电力|液冷|容量|资本开支)/i.test(text);
  const uncertain = !observation.publishedAt && !observation.discoveredAt || (observation.sourceTier === "T0" && !mechanism);
  const routineCloudUpdate = /(?:generally available|now available|availability zone|console|dashboard|observability|identity|security hub|cloudwatch|feature update|preview region|现已可用|控制台|仪表盘|可观测性)/i.test(text);
  const materialEvent = /(?:contract|lease|permit|approval|commission|construction|interconnect|capex|financing|acquisition|merger|earnings|guidance|model release|launches? (?:a )?(?:new )?(?:gpu|accelerator|server|model)|融资|签约|租约|许可|审批|投运|建设|并网|资本开支|收购|并购|财报|指引|模型发布)/i.test(text);
  const materialAwsInfrastructure = /(?:data\s*cent(?:er|re)|campus|capex|capital expenditure|lease|contract|construction|power purchase|\b(?:mw|gw)\b|gpu|trainium|inferentia|outposts? rack|acquisition|investment|earnings|guidance)/i.test(observation.normalizedTitle);
  const genericHtmlLandingPage = observation.eventType === "html-update"
    && !observation.publishedAt
    && observation.canonicalUrl.replace(/\/$/, "") === observation.originalUrl.replace(/\/$/, "");
  if (genericHtmlLandingPage) return { topicBucket: "irrelevant", isRelevant: false, uncertain: false, reasonCodes: ["html-landing-page-change-only"] };
  if (observation.sourceTier === "T0" && !hasConcretePolicySignal(text)) return { topicBucket: "irrelevant", isRelevant: false, uncertain: false, reasonCodes: ["t0-out-of-scope"] };
  if (observation.sourceId === "sec-edgar" && /^8-k(?:\/a)?\b/i.test(observation.titleOriginal) && !/(?:data\s*cent(?:er|re)|datacenter|AI|GPU|accelerator|capacity|power|energy|grid|cloud|server|semiconductor|chip|acquisition|merger|capital expenditure|CAPEX|并购|收购|数据中心|电力|能源|云|服务器|芯片)/i.test(observation.summaryOriginal)) return { topicBucket: "irrelevant", isRelevant: false, uncertain: false, reasonCodes: ["sec-filing-out-of-scope"] };
  if (bucket === "irrelevant") return { topicBucket: "irrelevant", isRelevant: false, uncertain: false, reasonCodes: ["no-atlas-topic"] };
  if (observation.sourceId === "aws-news" && !materialAwsInfrastructure) return { topicBucket: "irrelevant", isRelevant: false, uncertain: false, reasonCodes: ["routine-aws-product-update"] };
  if (routineCloudUpdate && !materialEvent) return { topicBucket: "irrelevant", isRelevant: false, uncertain: false, reasonCodes: ["routine-cloud-product-update"] };
  if (!entityFound && !measurable) return { topicBucket: "keyword-only", isRelevant: false, uncertain: false, reasonCodes: ["keyword-only", "missing-entity-or-measure"] };
  if (!hasAtlasSignal(text)) return { topicBucket: "keyword-only", isRelevant: false, uncertain: false, reasonCodes: ["keyword-only"] };
  return {
    topicBucket: bucket,
    isRelevant: true,
    uncertain,
    reasonCodes: [bucket, entityFound ? "named-entity" : "measurable-term", mechanism ? "mechanism-present" : "mechanism-uncertain", ...(uncertain ? ["uncertain"] : [])],
  };
}

function numberFromMatch(value: string): number {
  return Number(value.replace(/,/g, ""));
}

function capacityQualifier(context: string): string | undefined {
  if (/(?:does not say|does not confirm|doesn't say|doesn't confirm|not yet|not currently|not operating|not in service|未投运|尚未运营|不等同).{0,80}(?:operating|in service|投运|运营)|未披露/i.test(context)) return "proposed";
  if (/under construction|construction|在建|施工/i.test(context)) return "under_construction";
  if (/commissioned|commissioning|投运|调试/i.test(context)) return "commissioned";
  if (/revenue-generating|revenue generating|收入容量|产生收入/i.test(context)) return "revenue_generating";
  if (/operating|in service|in-service|已投运|运营|已交付/i.test(context)) return "operating";
  if (/permitted|permit|approved|获批|许可|审批/i.test(context)) return "permitted";
  if (/power secured|并网|供电保障/i.test(context)) return "power_secured";
  if (/land secured|land rights|土地|场址/i.test(context)) return "land_secured";
  if (/up to|最高|potential|潜在|reported|discussion|in talks|讨论|洽谈|could\s+(?:develop|build|add)|可能|no\s+(?:[a-z]+\s+){0,5}(?:contract|lease)|not\s+(?:[a-z]+\s+){0,5}signed|未签/i.test(context)) return "potential";
  if (/proposed|planned|plan|planning|target|targeted|future|expansion|expand|规划|拟/i.test(context)) return "proposed";
  if (/contracted|signed|签约/i.test(context)) return "contracted";
  return undefined;
}

function capacityType(context: string): FactCandidate["capacityType"] {
  if (/\b(?:it\s*(?:load|capacity)|data\s*cent(?:er|re)\s*load|critical\s*(?:it|load)|机房\s*(?:it|容量)|it负载|it容量)\b/i.test(context)) return "it_capacity";
  if (/\b(?:total power|total site power|nameplate power|总电力|总供电|园区供电)\b/i.test(context)) return "total_power";
  if (/\b(?:leased|lease|contracted|租约|签约)\b/i.test(context)) return "leased_capacity";
  if (/\b(?:gpu|accelerator|compute|算力|加速卡)\b/i.test(context)) return "gpu_nameplate_compute";
  if (/\b(?:utility|grid|power|electricity|供电|电力|电网)\b/i.test(context) && !/\bit\s*(?:load|capacity)\b/i.test(context)) return "utility_power";
  return "unspecified_capacity";
}

function factSpecificity(fact: FactCandidate): number {
  if (fact.factType !== "capacity") return 0;
  const typeScore = fact.capacityType === "total_power" || fact.capacityType === "it_capacity" ? 4
    : fact.capacityType === "leased_capacity" || fact.capacityType === "gpu_nameplate_compute" ? 3
      : fact.capacityType === "utility_power" ? 2 : 0;
  return typeScore + (fact.qualifier ? 1 : 0);
}

export function extractFacts(observation: NormalizedObservation): FactCandidate[] {
  const text = `${observation.normalizedTitle}. ${observation.normalizedSummary}`;
  const tierState = observation.sourceTier === "T0" || observation.sourceTier === "T1" ? "source-stated" : observation.sourceTier === "T2" || observation.sourceTier === "T3" ? "reported" : "inference";
  const facts: FactCandidate[] = [];
  const capacityPattern = /(?:[$¥￥])?\s?(\d+(?:[.,]\d+)?)\s?(GW|MW|kW|万张|张|亿美元|亿元|billion|million|bn|m)\b/gi;
  const matches = [...text.matchAll(capacityPattern)];
  for (const [index, match] of matches.entries()) {
    const unit = match[2];
    const number = numberFromMatch(match[1]);
    const isFinancial = /^(?:美元|亿元|billion|million|bn|m)$/i.test(unit) || text.slice(Math.max(0, (match.index ?? 0) - 5), match.index ?? 0).includes("$");
    const matchStart = match.index ?? 0;
    const matchEnd = matchStart + match[0].length;
    const sentenceStart = Math.max(
      text.lastIndexOf(".", matchStart - 1),
      text.lastIndexOf("。", matchStart - 1),
      text.lastIndexOf("!", matchStart - 1),
      text.lastIndexOf("！", matchStart - 1),
      text.lastIndexOf("?", matchStart - 1),
      text.lastIndexOf("？", matchStart - 1),
      text.lastIndexOf(";", matchStart - 1),
      text.lastIndexOf("；", matchStart - 1),
    ) + 1;
    const sentenceEndCandidates = [
      text.indexOf(".", matchEnd),
      text.indexOf("。", matchEnd),
      text.indexOf("!", matchEnd),
      text.indexOf("！", matchEnd),
      text.indexOf("?", matchEnd),
      text.indexOf("？", matchEnd),
      text.indexOf(";", matchEnd),
      text.indexOf("；", matchEnd),
      ...(matches[index + 1]?.index !== undefined ? [matches[index + 1].index] : []),
    ].filter((position) => position >= 0);
    const contextStart = sentenceStart;
    const contextEnd = sentenceEndCandidates.length ? Math.min(...sentenceEndCandidates) + 1 : text.length;
    const context = text.slice(contextStart, contextEnd);
    const nearbyContext = text.slice(Math.max(0, matchStart - 140), Math.min(text.length, matchEnd + 140));
    const qualifier = isFinancial ? undefined : capacityQualifier(context) ?? capacityQualifier(nearbyContext);
    facts.push({
      factType: isFinancial ? "financial-value" : "capacity",
      valueText: match[0].trim(),
      valueNumber: number,
      unit,
      qualifier,
      capacityType: isFinancial ? undefined : capacityType(context),
      confidenceState: tierState,
      sourceObservationId: observation.id,
    });
  }
  if (observation.publishedAt) facts.push({ factType: "date", valueText: observation.publishedAt, qualifier: "published_at", confidenceState: tierState, sourceObservationId: observation.id });
  const unique = new Map<string, FactCandidate>();
  for (const fact of facts) {
    const key = [fact.factType, fact.valueNumber ?? fact.valueText, fact.unit ?? ""].join("|").toLocaleLowerCase();
    const existing = unique.get(key);
    if (!existing || factSpecificity(fact) > factSpecificity(existing)) unique.set(key, fact);
  }
  return [...unique.values()].slice(0, 12);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(5, Math.round(value * 10) / 10));
}

export function analyzeObservation(observation: NormalizedObservation, classification: Classification): Analysis {
  const rawString = (key: string): string | null => typeof observation.rawPayload[key] === "string" && String(observation.rawPayload[key]).trim() ? String(observation.rawPayload[key]).trim() : null;
  const sourceIsZh = observation.language.startsWith("zh");
  const suppliedTitleZh = rawString("titleZh");
  const suppliedTitleEn = rawString("titleEn") ?? (!sourceIsZh ? observation.titleOriginal : rawString("originalTitle"));
  const suppliedSummaryZh = rawString("summaryZh");
  const suppliedSummaryEn = rawString("summaryEn") ?? (!sourceIsZh ? observation.summaryOriginal : null);
  const titleZh = suppliedTitleZh ?? (sourceIsZh ? observation.titleOriginal : observation.titleOriginal);
  const titleEn = suppliedTitleEn ?? (!sourceIsZh ? observation.titleOriginal : observation.titleOriginal);
  const summaryZh = suppliedSummaryZh ?? (sourceIsZh ? observation.summaryOriginal : observation.summaryOriginal);
  const summaryEn = suppliedSummaryEn ?? (!sourceIsZh ? observation.summaryOriginal : observation.summaryOriginal);
  const translationFieldsPresent = sourceIsZh
    ? Boolean(suppliedTitleEn && suppliedSummaryEn)
    : Boolean(suppliedTitleZh && suppliedSummaryZh);
  const bilingualValidation = translationFieldsPresent
    ? recordedTranslationAdapter.validateBilingualPair({ titleZh, titleEn, summaryZh, summaryEn, entities: observation.entities })
    : null;
  const translationStatus: Analysis["translationStatus"] = !translationFieldsPresent
    ? "source-only"
    : bilingualValidation?.status === "pass" ? "complete" : "pending";
  if (!classification.isRelevant && !classification.uncertain) {
    return {
      topicRelevanceScore: 0,
      mechanismDepthScore: 0,
      specificityScore: 0,
      researchValueScore: 0,
      readerValueScore: 0,
      titleZh,
      titleEn,
      summaryZh,
      summaryEn,
      translationStatus,
      entities: observation.entities ?? [],
      facts: [],
      analysisStatus: "deterministic-shadow",
      reason: "not-selected-for-deep-analysis",
    };
  }
  const text = `${observation.normalizedTitle} ${observation.normalizedSummary}`;
  const facts = extractFacts(observation);
  const mechanismHits = ["contract", "lease", "permit", "approval", "construction", "commission", "interconnect", "power", "cooling", "capacity", "capex", "租约", "许可", "建设", "投运", "并网", "电力", "液冷", "容量", "资本开支"].filter((term) => text.toLocaleLowerCase().includes(term)).length;
  const specificity = (observation.entities?.length ? 1.5 : 0) + (observation.publishedAt ? 1 : 0) + (facts.length ? 2 : 0) + (observation.locations?.length ? 0.5 : 0);
  const topic = classification.topicBucket === "core-infrastructure" ? 5 : classification.topicBucket === "upstream-compute-demand" ? 4.3 : classification.topicBucket === "material-policy-capital" ? 4.2 : 2.5;
  const mechanismDepth = mechanismHits >= 4 ? 5 : mechanismHits >= 2 ? 3.8 : mechanismHits > 0 ? 2.5 : 1.2;
  const researchValue = observation.sourceTier === "T0" ? 5 : observation.sourceTier === "T1" ? 4.4 : observation.sourceTier === "T2" || observation.sourceTier === "T3" ? 3.5 : 2;
  const readerValue = facts.length || observation.entities?.length ? 4 : 2.5;
  return {
    topicRelevanceScore: clampScore(topic),
    mechanismDepthScore: clampScore(mechanismDepth),
    specificityScore: clampScore(specificity),
    researchValueScore: clampScore(researchValue),
    readerValueScore: clampScore(readerValue),
    titleZh,
    titleEn,
    summaryZh,
    summaryEn,
    translationStatus,
    entities: observation.entities ?? [],
    facts,
    analysisStatus: "deterministic-shadow",
    reason: `rule-derived; ${classification.reasonCodes.join(",")}; translation-${translationStatus}${bilingualValidation?.errors.length ? `; translation-errors-${bilingualValidation.errors.join("|")}` : ""}`,
  };
}

function tierRank(tier: SourceTier): number {
  return { T0: 0, T1: 1, T2: 2, T3: 3, T4: 4, T5: 5, D: 6 }[tier];
}

function stanceOf(observation: NormalizedObservation): string {
  const stance = observation.rawPayload.stance;
  return typeof stance === "string" ? stance : "reports";
}

const clusterStopWords = new Set([
  "a", "an", "and", "at", "by", "for", "from", "in", "into", "new", "of", "on", "the", "to", "with",
  "announces", "announced", "says", "said", "reports", "reported", "signs", "signed", "reaches", "reached",
]);

function normalizedEventText(observation: AnalyzedObservation): string {
  return [observation.normalizedTitle, observation.normalizedSummary, observation.titleZh, observation.titleEn, observation.summaryZh, observation.summaryEn]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase()
    .replace(/\b(?:one[-\s]?gigawatt)\b/g, "1gw")
    .replace(/\b(?:one[-\s]?megawatt)\b/g, "1mw")
    .replace(/(\d+(?:\.\d+)?)\s+(gw|mw|kw)\b/g, "$1$2");
}

function actionBucket(observation: AnalyzedObservation): string {
  const text = normalizedEventText(observation);
  const buckets: Array<[string, RegExp]> = [
    ["acquisition", /\b(?:acqui(?:re|res|red|sition)|merger|buyout)\b|收购|并购/i],
    ["contract", /\b(?:contract|agreement|lease|partnership|deal)\b|签约|协议|租约|合作/i],
    ["construction", /\b(?:construct(?:ion|s|ed)|breaks ground|build(?:s|ing)?)\b|建设|开工|施工/i],
    ["commissioning", /\b(?:commission(?:ed|ing)?|in service|operating)\b|投运|运营/i],
    ["policy", /\b(?:policy|regulation|rule|permit|approval)\b|政策|监管|法规|许可|审批/i],
    ["financing", /\b(?:financing|funding|capital raise|investment)\b|融资|募资|投资/i],
    ["earnings", /\b(?:earnings|guidance|revenue|capex)\b|财报|业绩|指引|资本开支/i],
    ["release", /\b(?:launch(?:es|ed)?|release(?:s|d)?|unveil(?:s|ed)?)\b|发布|推出/i],
    ["expansion", /\b(?:expand(?:s|ed|ing)?|expansion|capacity plan)\b|扩建|扩张|扩容/i],
  ];
  return buckets.find(([, pattern]) => pattern.test(text))?.[0] ?? observation.eventType ?? observation.topicBucket;
}

function capacityAnchors(observation: AnalyzedObservation): string[] {
  const text = normalizedEventText(observation);
  return [...text.matchAll(/\b\d+(?:\.\d+)?(?:gw|mw|kw)\b/g)].map((match) => match[0]).sort();
}

function significantTokens(observation: AnalyzedObservation): Set<string> {
  const text = normalizedEventText(observation);
  const latin = text
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !clusterStopWords.has(token) && !/^\d+(?:\.\d+)?(?:gw|mw|kw)$/.test(token));
  const cjk = [...text.matchAll(/[\u3400-\u9fff]+/g)].flatMap(([run]) => {
    const terms: string[] = [];
    for (let index = 0; index < run.length - 1; index += 1) terms.push(run.slice(index, index + 2));
    return terms;
  });
  return new Set([...latin, ...cjk]);
}

function tokenSimilarity(left: AnalyzedObservation, right: AnalyzedObservation): number {
  const leftTokens = significantTokens(left);
  const rightTokens = significantTokens(right);
  const union = new Set([...leftTokens, ...rightTokens]);
  if (!union.size) return 0;
  let shared = 0;
  for (const token of leftTokens) if (rightTokens.has(token)) shared += 1;
  return shared / union.size;
}

function factIdentity(fact: FactCandidate): string | null {
  if (fact.factType === "date") return null;
  return [fact.factType, fact.valueNumber ?? fact.valueText, fact.unit ?? "", fact.qualifier ?? "", fact.capacityType ?? ""]
    .join("|")
    .toLocaleLowerCase();
}

function sameNamedEntity(left: AnalyzedObservation, right: AnalyzedObservation): boolean {
  const leftEntities = new Set((left.entities ?? []).map((item) => item.toLocaleLowerCase()));
  return (right.entities ?? []).some((item) => leftEntities.has(item.toLocaleLowerCase()));
}

function locationsCompatible(left: AnalyzedObservation, right: AnalyzedObservation): boolean {
  const leftLocations = (left.locations ?? []).map((item) => item.toLocaleLowerCase());
  const rightLocations = (right.locations ?? []).map((item) => item.toLocaleLowerCase());
  if (!leftLocations.length || !rightLocations.length) return true;
  return leftLocations.some((item) => rightLocations.includes(item));
}

function observationsDescribeSameEvent(left: AnalyzedObservation, right: AnalyzedObservation): boolean {
  if (left.eventKeyExplicit || right.eventKeyExplicit) return left.eventKeyExplicit && right.eventKeyExplicit && left.eventKey === right.eventKey;
  if (!sameNamedEntity(left, right) || !locationsCompatible(left, right)) return false;
  if (actionBucket(left) !== actionBucket(right)) return false;
  const leftTime = new Date(left.publishedAt ?? left.discoveredAt).getTime();
  const rightTime = new Date(right.publishedAt ?? right.discoveredAt).getTime();
  if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && Math.abs(leftTime - rightTime) > 7 * 86_400_000) return false;
  const leftCapacity = capacityAnchors(left);
  const rightCapacity = capacityAnchors(right);
  if (leftCapacity.length && rightCapacity.length && !leftCapacity.some((item) => rightCapacity.includes(item))) return false;
  return tokenSimilarity(left, right) >= 0.16 || (leftCapacity.length > 0 && rightCapacity.length > 0);
}

function candidateBlockKeys(observation: AnalyzedObservation): string[] {
  const action = actionBucket(observation);
  return [...new Set((observation.entities ?? []).map((entity) => `${entity.toLocaleLowerCase()}|${action}`))];
}

function automaticClusterKey(group: AnalyzedObservation[]): string {
  const first = group[0];
  const entity = (first.entities?.[0] ?? first.sourceId).toLocaleLowerCase();
  const location = [...new Set(group.flatMap((item) => item.locations ?? []).map((item) => item.toLocaleLowerCase()))].sort()[0] ?? "global";
  const capacity = [...new Set(group.flatMap(capacityAnchors))].sort()[0] ?? "no-capacity";
  const date = new Date(first.publishedAt ?? first.discoveredAt);
  const period = Number.isNaN(date.getTime()) ? "unknown-period" : date.toISOString().slice(0, 7);
  return `auto|${entity}|${actionBucket(first)}|${location}|${capacity}|${period}`;
}

function buildObservationGroups(observations: AnalyzedObservation[]): Map<string, AnalyzedObservation[]> {
  const explicit = new Map<string, AnalyzedObservation[]>();
  const automatic = observations.filter((item) => !item.eventKeyExplicit);
  for (const observation of observations.filter((item) => item.eventKeyExplicit)) {
    explicit.set(observation.eventKey, [...(explicit.get(observation.eventKey) ?? []), observation]);
  }
  const parent = automatic.map((_, index) => index);
  const find = (index: number): number => parent[index] === index ? index : (parent[index] = find(parent[index]));
  const union = (left: number, right: number) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
  };
  const candidateBlocks = new Map<string, number[]>();
  for (const [index, observation] of automatic.entries()) {
    for (const key of candidateBlockKeys(observation)) candidateBlocks.set(key, [...(candidateBlocks.get(key) ?? []), index]);
  }
  const compared = new Set<string>();
  for (const indices of candidateBlocks.values()) {
    for (let leftIndex = 0; leftIndex < indices.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < indices.length; rightIndex += 1) {
        const left = indices[leftIndex];
        const right = indices[rightIndex];
        const pairKey = `${Math.min(left, right)}|${Math.max(left, right)}`;
        if (compared.has(pairKey)) continue;
        compared.add(pairKey);
        if (observationsDescribeSameEvent(automatic[left], automatic[right])) union(left, right);
      }
    }
  }
  const connected = new Map<number, AnalyzedObservation[]>();
  for (let index = 0; index < automatic.length; index += 1) {
    const root = find(index);
    connected.set(root, [...(connected.get(root) ?? []), automatic[index]]);
  }
  const autoGroups: AnalyzedObservation[][] = [];
  for (const component of connected.values()) {
    const partitions: AnalyzedObservation[][] = [];
    for (const observation of component) {
      const compatible = partitions.find((partition) => partition.every((member) => observationsDescribeSameEvent(member, observation)));
      if (compatible) compatible.push(observation);
      else partitions.push([observation]);
    }
    autoGroups.push(...partitions);
  }
  const groups = new Map(explicit);
  for (const group of autoGroups) groups.set(automaticClusterKey(group), group);
  return groups;
}

function dedupeFacts(facts: FactCandidate[]): FactCandidate[] {
  const unique = new Map<string, FactCandidate>();
  for (const fact of facts) {
    const key = [fact.factType, fact.valueNumber ?? fact.valueText, fact.unit ?? "", fact.qualifier ?? "", fact.capacityType ?? ""].join("|").toLocaleLowerCase();
    if (!unique.has(key)) unique.set(key, fact);
  }
  return [...unique.values()];
}

export async function clusterObservations(observations: AnalyzedObservation[]): Promise<EventCluster[]> {
  const groups = buildObservationGroups(observations);
  const result: EventCluster[] = [];
  for (const [eventKey, group] of groups) {
    const ordered = [...group].sort((left, right) => tierRank(left.sourceTier) - tierRank(right.sourceTier) || new Date(right.publishedAt ?? right.discoveredAt).getTime() - new Date(left.publishedAt ?? left.discoveredAt).getTime());
    const independentGroups = [...new Set(group.map((item) => item.independenceGroup))];
    const response = group.find((item) => ["responds", "denies", "questions"].includes(stanceOf(item)));
    const official = group.find((item) => (item.sourceTier === "T0" || item.sourceTier === "T1") && !["responds", "denies", "questions"].includes(stanceOf(item)));
    const media = group.filter((item) => ["T2", "T3"].includes(item.sourceTier));
    const main = official ?? group.find((item) => !["responds", "denies", "questions"].includes(stanceOf(item))) ?? ordered[0];
    const evidenceStatus: EventCluster["evidenceStatus"] = response && !official ? "official_response" : official ? "officially_confirmed" : media.length > 0 ? "reported" : "lead";
    const chronological = [...group].sort((left, right) => new Date(left.publishedAt ?? left.discoveredAt).getTime() - new Date(right.publishedAt ?? right.discoveredAt).getTime());
    const seenFacts = new Set<string>();
    const noveltyByObservation = new Map<string, Pick<ClusterRelationship, "noveltyClass" | "newFactCount">>();
    for (const [index, item] of chronological.entries()) {
      const factKeys = item.facts.map(factIdentity).filter((key): key is string => Boolean(key));
      const newFactCount = factKeys.filter((key) => !seenFacts.has(key)).length;
      const stance = stanceOf(item);
      const noveltyClass: ClusterRelationship["noveltyClass"] = index === 0
        ? "new-event"
        : stance === "denies" || stance === "questions"
          ? "contradiction"
          : stance === "responds"
            ? "official-response"
            : newFactCount > 0
              ? "new-detail"
              : chronological.slice(0, index).some((prior) => prior.independenceGroup === item.independenceGroup)
                ? "duplicate"
                : "new-source";
      noveltyByObservation.set(item.id, { noveltyClass, newFactCount });
      for (const key of factKeys) seenFacts.add(key);
    }
    const relationships: ClusterRelationship[] = group.map((item) => {
      const stance = stanceOf(item);
      const relationship = item.id === main.id
        ? "origin"
        : ["responds", "denies", "questions"].includes(stance)
          ? (stance === "denies" || stance === "questions" ? "contradiction" : "official_response")
          : item.independenceGroup === main.independenceGroup ? "syndication" : item.language.split("-")[0] !== main.language.split("-")[0] ? "translation" : "confirmation";
      const novelty = noveltyByObservation.get(item.id) ?? { noveltyClass: "new-source" as const, newFactCount: 0 };
      return { observationId: item.id, relationship, ...novelty, isIndependentConfirmation: relationship === "confirmation", isMain: item.id === main.id };
    });
    const dateValues = group.map((item) => item.publishedAt ?? item.discoveredAt).sort();
    const locations = [...new Set(group.flatMap((item) => item.locations ?? []))];
    const entities = [...new Set(group.flatMap((item) => item.entities ?? []))];
    const facts = dedupeFacts(group.flatMap((item) => item.facts));
    result.push({
      id: `evt-${(await sha256(eventKey)).slice(0, 20)}`,
      eventKey,
      eventType: main.eventType ?? main.topicBucket,
      titleZh: main.titleZh,
      titleEn: main.titleEn,
      summaryZh: main.summaryZh,
      summaryEn: main.summaryEn,
      firstSeenAt: dateValues[0] ?? main.discoveredAt,
      lastUpdatedAt: dateValues[dateValues.length - 1] ?? main.discoveredAt,
      eventTime: main.publishedAt ?? main.discoveredAt,
      region: locations[0] ?? "全球",
      evidenceStatus,
      observations: group,
      relationships,
      entities,
      locations,
      sourceTiers: [...new Set(group.map((item) => item.sourceTier))],
      independenceGroups: independentGroups,
      independentSourceCount: independentGroups.length,
      mainObservationId: main.id,
      facts,
    });
  }
  return result.sort((left, right) => new Date(right.lastUpdatedAt).getTime() - new Date(left.lastUpdatedAt).getTime());
}

export function scoreCluster(cluster: EventCluster, nowMs = Date.now()): { priorityScore: number; reasonCodes: string[] } {
  const main = cluster.observations.find((item) => item.id === cluster.mainObservationId) ?? cluster.observations[0];
  const weights = scoringConfig.weights;
  const semantic = main.topicRelevanceScore * weights.topicRelevance
    + main.mechanismDepthScore * weights.mechanismDepth
    + main.specificityScore * weights.specificity
    + main.researchValueScore * weights.researchValue
    + main.readerValueScore * weights.readerValue;
  const recencyHours = Math.max(0, (nowMs - new Date(cluster.lastUpdatedAt).getTime()) / 3_600_000);
  const recencyWeight = Number.isFinite(recencyHours) ? Math.max(0, 8 - Math.min(8, recencyHours / 24)) : 0;
  const independentBonus = Math.min(10, Math.max(0, cluster.independentSourceCount - 1) * 4);
  const syndicationPenalty = cluster.relationships.filter((item) => item.relationship === "syndication").length * 1.5;
  const ambiguityPenalty = cluster.facts.some((fact) => fact.factType === "capacity" && (!fact.qualifier || fact.capacityType === "unspecified_capacity")) ? 5 : 0;
  const priorityScore = Math.round(Math.max(0, Math.min(100, semantic * 14 + scoringConfig.tierWeight[main.sourceTier] + recencyWeight + independentBonus - syndicationPenalty - ambiguityPenalty)) * 10) / 10;
  const reasonCodes = [
    `source-tier-${main.sourceTier}`,
    `independent-sources-${cluster.independentSourceCount}`,
    `semantic-${Math.round(semantic * 10) / 10}`,
    ...(syndicationPenalty ? [`syndication-penalty-${syndicationPenalty}`] : []),
    ...(ambiguityPenalty ? ["capacity-qualifier-or-type-missing"] : []),
  ];
  return { priorityScore, reasonCodes };
}

export function routeCluster(cluster: EventCluster, score: { priorityScore: number; reasonCodes: string[] }): SelectionDecision {
  const main = cluster.observations.find((item) => item.id === cluster.mainObservationId) ?? cluster.observations[0];
  const allTiers = new Set(cluster.observations.map((item) => item.sourceTier));
  const hasOfficial = cluster.observations.some((item) => (item.sourceTier === "T0" || item.sourceTier === "T1") && !["responds", "denies", "questions"].includes(stanceOf(item)));
  const hasMedia = [...allTiers].some((tier) => tier === "T2" || tier === "T3");
  const policyLike = cluster.eventType.toLocaleLowerCase().includes("policy");
  const reasons = [...score.reasonCodes];
  const ambiguousCapacity = cluster.facts.some((fact) => fact.factType === "capacity" && (!fact.qualifier || !fact.capacityType || fact.capacityType === "unspecified_capacity"));
  if (cluster.observations.some((item) => item.uncertain)) {
    return { eligible: false, priorityScore: score.priorityScore, route: "hold", routeCandidates: ["hold"], reasonCodes: [...reasons, "classification-uncertain-kept-internal"] };
  }
  if (ambiguousCapacity) {
    return { eligible: false, priorityScore: score.priorityScore, route: "hold", routeCandidates: ["hold"], reasonCodes: [...reasons, "capacity-boundary-needs-review"] };
  }
  const candidates: Route[] = [];
  if (policyLike && cluster.observations.some((item) => item.sourceTier === "T0" && !["responds", "denies", "questions"].includes(stanceOf(item)))) {
    if (score.priorityScore >= scoringConfig.thresholds.public) {
      candidates.push("pulse");
      reasons.push("material-official-policy-routes-to-pulse");
    } else {
      candidates.push("hold");
      reasons.push("routine-policy-kept-as-internal-evidence");
    }
  }
  if (hasOfficial && !policyLike) {
    candidates.push("pulse");
    reasons.push("official-T0-or-T1-supports-pulse");
  }
  if (hasMedia && !hasOfficial) {
    candidates.push("rumor-watch");
    reasons.push("media-only-stays-rumor-watch");
  }
  if ((hasOfficial || cluster.independentSourceCount >= 2) && score.priorityScore >= scoringConfig.thresholds.research) {
    candidates.push("research-queue");
    reasons.push("research-question-candidate");
  }
  if (!candidates.length && allTiers.has("D")) {
    candidates.push("hold");
    reasons.push("discovery-only-awaits-original-source");
  }
  if (!candidates.length) {
    candidates.push("rejected");
    reasons.push("evidence-route-not-eligible");
  }
  const route = candidates[0];
  const translationComplete = main.translationStatus === "complete";
  const eligible = route !== "hold" && route !== "rejected" && score.priorityScore >= scoringConfig.thresholds.public && translationComplete;
  if (!translationComplete) reasons.push("bilingual-translation-pending");
  return { eligible, priorityScore: score.priorityScore, route, routeCandidates: candidates, reasonCodes: reasons };
}

export function toAtlasCompatibility(cluster: EventCluster, decision: SelectionDecision) {
  const main = cluster.observations.find((item) => item.id === cluster.mainObservationId) ?? cluster.observations[0];
  return {
    id: cluster.id,
    title: cluster.titleZh,
    titleEn: cluster.titleEn,
    summary: cluster.summaryZh,
    summaryEn: cluster.summaryEn,
    publishedAt: cluster.eventTime,
    sourceName: main.rawPayload.sourceName ?? main.sourceId,
    sourceUrl: main.originalUrl,
    evidenceStatus: cluster.evidenceStatus,
    route: decision.route,
    priorityScore: decision.priorityScore,
    sourceCount: cluster.independentSourceCount,
    freshness: "shadow",
    fallback: false,
  };
}

function emptyRouteCounts(): Record<Route, number> {
  return { "rumor-watch": 0, pulse: 0, "policy-index": 0, "research-queue": 0, hold: 0, rejected: 0 };
}

export async function runShadowPipeline(
  results: ConnectorResult[],
  sources: SourceDefinition[],
  options: { generatedAt?: string; strategyVersion?: string } = {},
): Promise<ShadowRunReport> {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const sourceMap = new Map(sources.map((source) => [source.id, source]));
  const rawObservations = results.flatMap((result) => result.observations);
  const failures = results.filter((result) => result.status === "failed" || result.status === "blocked" || result.status === "parse-error").map((result) => `${result.sourceId}/${result.endpointId}: ${result.error ?? result.status}`);
  const normalizedAll = await Promise.all(rawObservations.map((observation) => normalizeObservation(observation, sourceMap)));
  const deduped: NormalizedObservation[] = [];
  const seen = new Set<string>();
  let duplicates = 0;
  for (const observation of normalizedAll) {
    if (seen.has(observation.canonicalUrlHash)) {
      duplicates += 1;
      continue;
    }
    seen.add(observation.canonicalUrlHash);
    deduped.push(observation);
  }
  const classified = deduped.map((observation) => ({ observation, classification: classifyObservation(observation) }));
  const selected = classified.filter(({ classification }) => classification.isRelevant || classification.uncertain);
  const analyzed = selected.map(({ observation, classification }) => ({ ...observation, ...classification, ...analyzeObservation(observation, classification) }));
  const clusters = await clusterObservations(analyzed);
  const routeCounts = emptyRouteCounts();
  const events: ShadowRunReport["events"] = [];
  let publicEligible = 0;
  let rejected = 0;
  let held = 0;
  for (const cluster of clusters) {
    const score = scoreCluster(cluster, Date.parse(generatedAt));
    const decision = routeCluster(cluster, score);
    cluster.priorityScore = score.priorityScore;
    cluster.reasonCodes = decision.reasonCodes;
    cluster.route = decision.route;
    cluster.routeCandidates = decision.routeCandidates;
    cluster.eligible = decision.eligible;
    routeCounts[decision.route] += 1;
    if (decision.eligible) publicEligible += 1;
    if (decision.route === "rejected") rejected += 1;
    if (decision.route === "hold") held += 1;
    const sourceChain = cluster.observations.map((observation) => {
      const relation = cluster.relationships.find((item) => item.observationId === observation.id);
      return {
        observationId: observation.id,
        sourceId: observation.sourceId,
        tier: observation.sourceTier,
        independenceGroup: observation.independenceGroup,
        relationship: relation?.relationship ?? "follow_up",
        noveltyClass: relation?.noveltyClass ?? "new-source",
        newFactCount: relation?.newFactCount ?? 0,
        title: observation.titleOriginal,
        url: observation.originalUrl,
        publishedAt: observation.publishedAt ?? null,
        accessStatus: observation.accessStatus,
      };
    });
    const main = cluster.observations.find((item) => item.id === cluster.mainObservationId) ?? cluster.observations[0];
    const event = Object.fromEntries(Object.entries(cluster).filter(([key]) => key !== "observations")) as Omit<EventCluster, "observations">;
    events.push({
      ...event,
      scoring: {
        topicRelevanceScore: main.topicRelevanceScore,
        mechanismDepthScore: main.mechanismDepthScore,
        specificityScore: main.specificityScore,
        researchValueScore: main.researchValueScore,
        readerValueScore: main.readerValueScore,
        analysisReason: main.reason,
      },
      sourceChain,
    });
  }
  const allSuccessful = results.length > 0 && results.every((result) => result.status === "ok" || result.status === "empty" || result.status === "not-modified");
  const allFailed = results.length > 0 && results.every((result) => result.status === "failed" || result.status === "blocked" || result.status === "parse-error");
  const status: ShadowRunReport["status"] = allFailed ? "failed" : failures.length ? "partial" : "succeeded";
  const freshness: ShadowRunReport["freshness"] = allFailed ? "failed" : failures.length ? "partial" : allSuccessful && publicEligible === 0 ? "verified-no-change" : "live";
  const routeCountsSummary = routeCounts;
  return {
    schemaVersion: "atlas-event-shadow.v1",
    generatedAt,
    strategyVersion: options.strategyVersion ?? STRATEGY_VERSION,
    classifierVersion: CLASSIFIER_VERSION,
    status,
    freshness,
    stats: {
      fetched: rawObservations.length,
      normalized: deduped.length,
      duplicates,
      relevant: selected.length,
      uncertain: selected.filter(({ classification }) => classification.uncertain).length,
      deepScored: analyzed.length,
      clusters: clusters.length,
      publicEligible,
      rejected,
      held,
      errors: failures.length,
      routeCounts: routeCountsSummary,
    },
    sourceHealth: results.map((result) => {
      const source = sourceMap.get(result.sourceId);
      return { sourceId: result.sourceId, endpointId: result.endpointId, tier: source?.tier ?? "D", independenceGroup: source?.independenceGroup ?? result.sourceId, status: result.status, httpStatus: result.httpStatus, responseMs: result.responseMs, observations: result.observations.length, error: result.error };
    }),
    observationAnalysis: analyzed.map((observation) => ({
      id: observation.id,
      sourceId: observation.sourceId,
      endpointId: observation.endpointId,
      canonicalUrl: observation.canonicalUrl,
      originalUrl: observation.originalUrl,
      externalId: observation.externalId ?? null,
      titleOriginal: observation.titleOriginal,
      summaryOriginal: observation.summaryOriginal,
      language: observation.language,
      author: observation.author ?? null,
      publishedAt: observation.publishedAt ?? null,
      discoveredAt: observation.discoveredAt,
      fetchedAt: observation.fetchedAt,
      contentHash: observation.contentHash,
      canonicalUrlHash: observation.canonicalUrlHash,
      rawPayload: observation.rawPayload,
      accessStatus: observation.accessStatus,
      sourceTier: observation.sourceTier,
      eventKey: observation.eventKey,
      classification: {
        topicBucket: observation.topicBucket,
        isRelevant: observation.isRelevant,
        uncertain: observation.uncertain,
        reasonCodes: observation.reasonCodes,
      },
      analysis: {
        topicRelevanceScore: observation.topicRelevanceScore,
        mechanismDepthScore: observation.mechanismDepthScore,
        specificityScore: observation.specificityScore,
        researchValueScore: observation.researchValueScore,
        readerValueScore: observation.readerValueScore,
        titleZh: observation.titleZh,
        titleEn: observation.titleEn,
        summaryZh: observation.summaryZh,
        summaryEn: observation.summaryEn,
        translationStatus: observation.translationStatus,
        entities: observation.entities,
        facts: observation.facts,
        analysisStatus: observation.analysisStatus,
        reason: observation.reason,
      },
    })),
    events,
    failures,
    cost: { modelCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, note: "Shadow uses deterministic rules; no model or production write was invoked." },
  };
}
