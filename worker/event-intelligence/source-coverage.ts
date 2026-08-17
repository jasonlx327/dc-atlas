import { shadowSources } from "../connectors/index.ts";
import type { ConnectorResult, SourceDefinition, SourceTier } from "../connectors/types.ts";
import type { ShadowRunReport } from "./pipeline.ts";

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

export const ATLAS_DAILY_SECTION_IDS: AtlasDailySectionId[] = [
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

export type AtlasSectionSourceCoverage = {
  section: AtlasDailySectionId;
  status: "passed" | "blocked";
  expectedSourceIds: string[];
  checkedSourceIds: string[];
  passingSourceIds: string[];
  failedSourceIds: string[];
  primaryPassing: number;
  reportingPassing: number;
  discoveryPassing: number;
  successRate: number;
  reason: string;
};

const PASSING = new Set<ConnectorResult["status"]>(["ok", "empty", "not-modified"]);

const SECTION_PATTERNS: Record<AtlasDailySectionId, RegExp> = {
  "idc-pulse": /data cent|数据中心|capacity|lease|land|power|grid|interconnection|capex|infrastructure/i,
  "listed-companies": /filings|capex|m&a|capacity|lease|cloud|data cent|gpu|cpu|memory|foundry|infrastructure/i,
  mna: /m&a|filings|capex|investment|financ|acqui|merger/i,
  capacity: /capacity|data cent|lease|land|power|grid|interconnection/i,
  cooling: /cooling|water|thermal|data cent|ai infrastructure/i,
  "compute-products": /gpu|cpu|chips|foundry|servers|network|ai infrastructure/i,
  "china-gpu": /chips|gpu|foundry|memory|hbm|ai|filings/i,
  "supply-chain": /servers|storage|network|optical|memory|hbm|power|cooling|foundry|chips/i,
  "power-model-demand": /power|grid|interconnection|energy|compute demand|ai models|cloud|capex|infrastructure/i,
  "earnings-calendar": /filings|capex|m&a|capacity|lease|cloud|gpu|cpu|memory|foundry/i,
  rumors: /./i,
  policy: /policy|law|tax|environment|standards|cybersecurity|energy|water|land/i,
  columns: /./i,
};

function sourceText(source: SourceDefinition): string {
  return [source.id, source.name, source.publisherType, ...source.topics].join(" ");
}

function relevantSource(source: SourceDefinition, section: AtlasDailySectionId): boolean {
  if (section === "rumors") return source.tier === "D" || source.tier === "T2" || source.tier === "T3";
  if (section === "columns") return source.tier !== "T4" && source.tier !== "T5";
  if (source.tier === "D" && section !== "policy") {
    return section !== "china-gpu" || source.region === "中国" || /AI infrastructure|GPU|芯片|算力/i.test(sourceText(source));
  }
  if (section === "china-gpu") {
    const chinaSignal = source.region === "中国" || /cninfo|sse|szse|miit|ndrc|china|huawei|cambricon/i.test(sourceText(source));
    return chinaSignal && SECTION_PATTERNS[section].test(sourceText(source));
  }
  return SECTION_PATTERNS[section].test(sourceText(source));
}

function isPrimary(tier: SourceTier): boolean {
  return tier === "T0" || tier === "T1";
}

export function buildSectionSourceCoverage(
  report: ShadowRunReport | null,
  sources: SourceDefinition[] = shadowSources(),
): AtlasSectionSourceCoverage[] {
  const healthBySource = new Map((report?.sourceHealth ?? []).map((health) => [health.sourceId, health]));
  return ATLAS_DAILY_SECTION_IDS.map((section) => {
    const expected = sources.filter((source) => relevantSource(source, section));
    const checked = expected.filter((source) => healthBySource.has(source.id));
    const passing = checked.filter((source) => PASSING.has(healthBySource.get(source.id)!.status));
    const failed = checked.filter((source) => !PASSING.has(healthBySource.get(source.id)!.status));
    const primaryPassing = passing.filter((source) => isPrimary(source.tier)).length;
    const reportingPassing = passing.filter((source) => source.tier === "T2" || source.tier === "T3").length;
    const discoveryPassing = passing.filter((source) => source.tier === "D").length;
    const successRate = expected.length ? passing.length / expected.length : 0;
    const primaryRequirement = section === "rumors" ? true : section === "policy" ? primaryPassing >= 2 : primaryPassing >= 1;
    const breadthRequirement = section === "rumors"
      ? reportingPassing >= 1 && discoveryPassing >= 1
      : section === "policy"
        ? true
        : reportingPassing + discoveryPassing >= 1;
    const status = Boolean(report)
      && expected.length >= 2
      && checked.length === expected.length
      && successRate >= 0.6
      && primaryRequirement
      && breadthRequirement
      ? "passed"
      : "blocked";
    const reason = status === "passed"
      ? `已检查 ${checked.length}/${expected.length} 个板块信源，${passing.length} 个成功，包含 ${primaryPassing} 个一手来源。`
      : `信源覆盖不足：检查 ${checked.length}/${expected.length}，成功 ${passing.length}，一手 ${primaryPassing}，媒体 ${reportingPassing}，发现源 ${discoveryPassing}。`;
    return {
      section,
      status,
      expectedSourceIds: expected.map((source) => source.id),
      checkedSourceIds: checked.map((source) => source.id),
      passingSourceIds: passing.map((source) => source.id),
      failedSourceIds: failed.map((source) => source.id),
      primaryPassing,
      reportingPassing,
      discoveryPassing,
      successRate,
      reason,
    };
  });
}
