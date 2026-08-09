import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { sourceRegistry } from "../worker/connectors/index.ts";
import { validateBilingualPair } from "../worker/event-intelligence/provider-contract.ts";
import type { AccessStatus, ObservationEnvelope, SourceDefinition, SourceTier } from "../worker/connectors/types.ts";
import type { Route } from "../worker/event-intelligence/pipeline.ts";

type RawRecord = Record<string, unknown> & {
  __file: string;
  __line: number;
  __sourceKey: "sourceUrl" | "url";
};

type LabelReview = {
  fixture_id: string;
  label_hash: string;
  reviewed_by: string;
  reviewed_at: string;
  source_checks: string[];
  review_type: "automated-policy-audit" | "human";
  decision: "accept" | "reject";
};

type LabelReviewManifest = {
  schema_version: "atlas-event-label-review.v1";
  corpus_id: "history-v1";
  reviews: LabelReview[];
};

export type ReplaySource = SourceDefinition & {
  fixtureRecordCount: number;
};

export type ReplayObservation = ObservationEnvelope & {
  id: string;
};

export type FrozenEvent = {
  fixture_id: string;
  label_hash: string;
  source_observation_ids: string[];
  expected_relevance: boolean;
  expected_event_key: string;
  expected_cluster_members: string[];
  expected_primary_source_id: string;
  expected_evidence_status: "lead" | "reported" | "official_response" | "officially_confirmed";
  expected_route: Route;
  expected_public_eligible: boolean;
  expected_entities: string[];
  expected_capacity_facts: Array<{
    value_text: string;
    capacity_type: "total_power" | "utility_power" | "it_capacity" | "gpu_nameplate_compute" | "leased_capacity" | "unspecified_capacity";
    qualifier: string;
  }>;
  expected_relationships: Array<{
    relation: string;
    from: string;
    to: string;
  }>;
  expected_bilingual_state: "complete" | "source-only";
  label_basis: string[];
  label_status: "provisional" | "audited" | "frozen";
  coverage: {
    primary_event: boolean;
    media_event: boolean;
    duplicate_or_syndication: boolean;
    negative_ai_keyword: boolean;
    capacity_boundary: boolean;
    bilingual_pair: boolean;
    timeline_response: boolean;
  };
};

export type EventReplayCorpus = {
  schema_version: "atlas-event-replay.v1";
  corpus_id: "history-v1";
  generated_at: string;
  provenance: {
    files: string[];
    source_policy: string;
    model_calls: number;
    production_touched: false;
    label_review_manifest: string;
    policy_audited_labels: number;
    independently_reviewed_labels: number;
  };
  sources: ReplaySource[];
  observations: ReplayObservation[];
  frozen_events: FrozenEvent[];
};

const outputUrl = new URL("./fixtures/event-intelligence/history-v1.json", import.meta.url);
const labelReviewUrl = new URL("./fixtures/event-intelligence/history-v1-label-reviews.json", import.meta.url);
const projectRoot = dirname(fileURLToPath(new URL("../", import.meta.url)));
const outputPath = fileURLToPath(outputUrl);

function hash(value: string, length = 20): string {
  return createHash("sha256").update(value).digest("hex").slice(0, length);
}

function labelHash(event: FrozenEvent): string {
  return hash(JSON.stringify({
    expected_relevance: event.expected_relevance,
    expected_event_key: event.expected_event_key,
    expected_cluster_members: [...event.expected_cluster_members].sort(),
    expected_primary_source_id: event.expected_primary_source_id,
    expected_evidence_status: event.expected_evidence_status,
    expected_route: event.expected_route,
    expected_public_eligible: event.expected_public_eligible,
    expected_entities: [...event.expected_entities].sort(),
    expected_capacity_facts: event.expected_capacity_facts,
    expected_relationships: event.expected_relationships,
    expected_bilingual_state: event.expected_bilingual_state,
  }), 32);
}

function stringValue(node: ts.Expression | undefined): string | null {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return "true";
  if (node.kind === ts.SyntaxKind.FalseKeyword) return "false";
  return null;
}

function primitiveValue(node: ts.Expression | undefined): unknown {
  if (!node) return null;
  const scalar = stringValue(node);
  if (scalar !== null) return scalar;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((item) => primitiveValue(item));
  if (ts.isObjectLiteralExpression(node)) {
    const value: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const name = propertyName(property.name);
      if (name) value[name] = primitiveValue(property.initializer);
    }
    return value;
  }
  return null;
}

function propertyName(node: ts.PropertyName | undefined): string | null {
  if (!node) return null;
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return null;
}

function readObject(node: ts.ObjectLiteralExpression, file: string, sourceFile: ts.SourceFile, sourceKey: "sourceUrl" | "url"): RawRecord | null {
  const record: RawRecord = { __file: file, __line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1, __sourceKey: sourceKey };
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property.name);
    if (name) record[name] = primitiveValue(property.initializer);
  }
  const url = record[sourceKey];
  if (typeof url !== "string" || !/^https?:\/\//.test(url) || /\$\{|[{}<>]/.test(url)) return null;
  try {
    const parsed = new URL(url);
    return parsed.hostname && !/[${}]/.test(parsed.hostname) ? record : null;
  } catch {
    return null;
  }
}

async function extractTypeScriptRecords(file: string, sourceKey: "sourceUrl" | "url"): Promise<RawRecord[]> {
  const text = await readFile(file, "utf8");
  const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const records: RawRecord[] = [];
  function visit(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node)) {
      const record = readObject(node, file, sourceFile, sourceKey);
      if (record) records.push(record);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return records;
}

function canonicalizeUrl(input: string): string {
  try {
    const url = new URL(input.trim());
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|mc_|ref$|source$|spm$)/i.test(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch {
    return input.trim();
  }
}

function hostname(input: string): string {
  try {
    return new URL(input).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "unknown";
  }
}

function textOf(record: RawRecord): string {
  return [
    record.title,
    record.titleOriginal,
    record.titleZh,
    record.titleEn,
    record.summary,
    record.summaryOriginal,
    record.note,
    record.rationale,
    record.metric,
    record.status,
    record.subject,
    record.target,
    record.model,
    record.name,
    record.eventType,
    record.event_type,
    record.topics,
  ].flatMap((value) => Array.isArray(value) ? value : [value]).filter((value): value is string | number => typeof value === "string" || typeof value === "number").join(" ");
}

function firstString(record: RawRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function parseDate(record: RawRecord): string | null {
  const value = firstString(record, ["publishedAt", "published_at", "announcedAt", "announced_at", "published", "date"]);
  if (!value) return null;
  const candidate = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value;
  return Number.isFinite(Date.parse(candidate)) ? new Date(candidate).toISOString() : null;
}

function languageOf(record: RawRecord): string {
  const language = firstString(record, ["language"]);
  if (language === "zh") return "zh-CN";
  if (language === "en") return "en-US";
  return language ?? (/[\u3400-\u9fff]/.test(textOf(record)) ? "zh-CN" : "en-US");
}

function sourceNameOf(record: RawRecord, url: string): string {
  return firstString(record, ["sourceName", "source_name", "author", "publisher", "source", "name", "vendor"]) ?? hostname(url);
}

function publisherTypeForTier(tier: SourceTier): string {
  return tier === "T0" ? "official-record" : tier === "T1" ? "issuer" : tier === "D" ? "discovery" : "media-or-research";
}

function sourceByUrl(url: string, name: string): SourceDefinition | undefined {
  const host = hostname(url);
  return sourceRegistry.find((source) => {
    try {
      return hostname(source.endpoint.url) === host;
    } catch {
      return source.name.toLocaleLowerCase() === name.toLocaleLowerCase();
    }
  }) ?? sourceRegistry.find((source) => source.name.toLocaleLowerCase() === name.toLocaleLowerCase());
}

function inferTier(record: RawRecord, url: string, name: string): SourceTier {
  const explicit = firstString(record, ["evidence_tier", "evidenceTier", "sourceTier", "tier"]);
  if (["T0", "T1", "T2", "T3", "T4", "T5", "D"].includes(explicit ?? "")) return explicit as SourceTier;
  return sourceByUrl(url, name)?.tier ?? (/reuters|bloomberg|ft|wsj|axios|cnbc|nytimes|new york times|financial times/i.test(name) ? "T2" : /news|media|trendforce|36kr|investing|yahoo|utilitydive|power magazine/i.test(name) ? "T3" : "D");
}

function independenceGroupOf(record: RawRecord, url: string, name: string, tier: SourceTier): string {
  const explicit = firstString(record, ["independence_group", "independenceGroup"]);
  if (explicit) return explicit;
  const source = sourceByUrl(url, name);
  if (source) return source.independenceGroup;
  const host = hostname(url);
  if (tier === "T2" && /reuters|bloomberg|ft|wsj/i.test(name)) return name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");
  return host;
}

function accessOf(record: RawRecord): AccessStatus {
  const value = firstString(record, ["accessStatus", "access_status", "access"]);
  if (value === "restricted" || value === "paywalled") return "paywalled";
  if (value === "licensed") return "licensed";
  if (value === "login-required") return "login-required";
  if (value === "unavailable") return "unavailable";
  if (value === "public-api") return "public-api";
  return "public";
}

function eventTypeOf(record: RawRecord, tier: SourceTier, text: string): string {
  const explicit = firstString(record, ["eventKey", "event_key", "eventType", "event_type", "category", "milestone"]);
  if (explicit?.toLocaleLowerCase().includes("|") && explicit.split("|")[1]) return explicit.split("|")[1];
  if (explicit) return explicit;
  if (tier === "T0" && /policy|rule|bill|permit|standard|tax|tariff|regulation|fcc|government/i.test(text)) return "policy";
  if (/acqui|merger|sale|financ|loan|deal|transaction|m&a/i.test(text)) return "m&a";
  if (/capacity|campus|data center|datacenter|gpu|hbm|memory|cooling|power|grid|compute|server|network/i.test(text)) return "infrastructure";
  return "research-record";
}

function titleOf(record: RawRecord, url: string): string {
  return firstString(record, ["titleOriginal", "title", "titleZh", "titleEn", "model", "name", "target", "subject", "slug"]) ?? `${sourceNameOf(record, url)} source record`;
}

function summaryOf(record: RawRecord, title: string): string {
  return firstString(record, ["summaryOriginal", "summary", "note", "rationale", "metric", "status", "description"]) ?? title;
}

function entitiesOf(record: RawRecord, text: string): string[] {
  const values = [record.entities, record.entitiesJson].flatMap((value) => Array.isArray(value) ? value : []);
  const known = ["Amazon", "AWS", "Microsoft", "Google", "Meta", "NVIDIA", "AMD", "OpenAI", "Anthropic", "Intel", "Micron", "Samsung", "SK hynix", "Galaxy", "Hut 8", "TeraWulf", "Core Scientific", "MARA", "PPL", "ERCOT", "PJM", "FERC", "FCC", "DOE", "EPA", "Vertiv", "Digital Realty", "Firebird", "CXMT", "长鑫科技", "寒武纪", "华为", "沐曦", "壁仞", "中国移动", "中国联通"];
  return [...new Set([...values.filter((value): value is string => typeof value === "string"), ...known.filter((name) => text.toLocaleLowerCase().includes(name.toLocaleLowerCase()))])].slice(0, 12);
}

function locationsOf(record: RawRecord): string[] {
  const values = [record.locations, record.location, record.region, record.jurisdiction].flatMap((value) => Array.isArray(value) ? value : [value]);
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.trim().length > 0).map((value) => value.trim()))].slice(0, 8);
}

function topicsOf(record: RawRecord, text: string): string[] {
  const values = [record.topics, record.topic, record.category].flatMap((value) => Array.isArray(value) ? value : [value]);
  const inferred = [
    [/data.?center|campus|capacity|compute/i, "data centers"],
    [/gpu|accelerator|chip|dcu|npu|hbm|dram|memory/i, "compute and memory"],
    [/power|grid|utility|electric|pue|cooling|liquid|chiller/i, "power and cooling"],
    [/policy|rule|permit|government|tax|standard/i, "policy"],
    [/finance|earnings|capex|revenue|loan|acqui|merger|deal/i, "capital and company"],
  ].flatMap(([pattern, topic]) => (pattern as RegExp).test(text) ? [topic as string] : []);
  return [...new Set([...values.filter((value): value is string => typeof value === "string"), ...inferred])].slice(0, 8);
}

function eventKeyOf(record: RawRecord, fixtureId: string, url: string): string {
  const explicit = firstString(record, ["eventKey", "event_key"]);
  if (explicit) return explicit;
  const recordId = firstString(record, ["id", "slug", "model", "target", "name"]);
  return `history|${(recordId ?? `${hostname(url)}-${fixtureId}`).toLocaleLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g, "-").replace(/^-|-$/g, "")} ` .trim();
}

function stanceOf(record: RawRecord, text: string): string {
  const explicit = firstString(record, ["stance"]);
  if (explicit) return explicit;
  if (/deny|denies|否认|未确认|not confirmed|not in force|not yet/i.test(text)) return "denies";
  if (/response|回应|respond|回应|question/i.test(text)) return "responds";
  return "confirms";
}

function bilingualFieldsPresent(record: RawRecord): boolean {
  const hasEn = Boolean(firstString(record, ["titleEn", "title_en", "en"]));
  const hasZh = Boolean(firstString(record, ["titleZh", "title_zh", "zh"]) || (hasEn && firstString(record, ["title"])));
  const hasSummaryEn = Boolean(firstString(record, ["summaryEn", "summary_en"]));
  const hasSummaryZh = Boolean(firstString(record, ["summaryZh", "summary_zh"]) || (hasSummaryEn && firstString(record, ["summary", "summaryOriginal"])));
  return hasZh && hasEn && hasSummaryZh && hasSummaryEn;
}

function bilingualState(record: RawRecord): "complete" | "source-only" {
  if (!bilingualFieldsPresent(record)) return "source-only";
  const titleZh = firstString(record, ["titleZh", "title_zh", "zh"]) ?? firstString(record, ["title"]) ?? "";
  const titleEn = firstString(record, ["titleEn", "title_en", "en"]) ?? "";
  const summaryZh = firstString(record, ["summaryZh", "summary_zh"]) ?? firstString(record, ["summary", "summaryOriginal"]) ?? "";
  const summaryEn = firstString(record, ["summaryEn", "summary_en"]) ?? "";
  return validateBilingualPair({ titleZh, titleEn, summaryZh, summaryEn, entities: entitiesOf(record, `${titleZh} ${titleEn} ${summaryZh} ${summaryEn}`) }).status === "pass" ? "complete" : "source-only";
}

function capacityFacts(record: RawRecord, text: string): FrozenEvent["expected_capacity_facts"] {
  const matches = [...text.matchAll(/(\d+(?:\.\d+)?)\s*(GW|MW|kW|TB|PB|GB|万卡|卡|billion|million|亿|万元|亿美元)/gi)];
  return matches.slice(0, 6).map((match) => {
    const start = Math.max(0, (match.index ?? 0) - 140);
    const context = text.slice(start, Math.min(text.length, (match.index ?? 0) + match[0].length + 140));
    const qualifier = /operat|in service|收入|投运|在服|operational|已投产|已交付/i.test(context) ? "operating"
      : /commission|调试|验收|delivery|交付/i.test(context) ? "commissioned"
        : /construct|在建|施工|开工/i.test(context) ? "under_construction"
          : /contract|租约|签约|service agreement|PPA/i.test(context) ? "contracted"
            : /permit|approval|审批|登记|rights|land|规划|plan|potential|proposed|拟/i.test(context) ? "potential"
              : "unspecified";
    const capacityType = /IT\s*(?:load|capacity)|data\s*cent(?:er|re)\s*load|it容量|it负载/i.test(context) ? "it_capacity"
      : /total power|total site power|nameplate power|总电力|总供电|园区供电/i.test(context) ? "total_power"
        : /leased|lease|contracted|租约|签约/i.test(context) ? "leased_capacity"
          : /GPU|accelerator|compute|算力|加速卡|万卡|卡/i.test(context) ? "gpu_nameplate_compute"
            : /utility|grid|power|electricity|供电|电力|电网/i.test(context) ? "utility_power"
              : "unspecified_capacity";
    return { value_text: `${match[1]} ${match[2]}`, capacity_type: capacityType as FrozenEvent["expected_capacity_facts"][number]["capacity_type"], qualifier };
  }).filter((fact) => fact.qualifier !== "unspecified" && fact.capacity_type !== "unspecified_capacity");
}

function capacityBoundaryNeedsReview(text: string): boolean {
  const matches = [...text.matchAll(/\d+(?:[.,]\d+)?\s*(GW|MW|kW|万卡|卡)\b/gi)];
  return matches.some((match) => {
    const context = text.slice(Math.max(0, (match.index ?? 0) - 140), Math.min(text.length, (match.index ?? 0) + match[0].length + 140));
    const hasQualifier = /operat|in service|收入|投运|在服|operational|已投产|已交付|commission|调试|验收|delivery|交付|construct|在建|施工|开工|contract|租约|签约|service agreement|PPA|permit|approval|审批|登记|rights|land|规划|plan|potential|proposed|拟|up to|最高|reported|discussion|in talks|讨论|洽谈|could/i.test(context);
    const hasType = /IT\s*(?:load|capacity)|data\s*cent(?:er|re)\s*load|it容量|it负载|total power|total site power|nameplate power|总电力|总供电|园区供电|leased|lease|contracted|租约|签约|GPU|accelerator|compute|算力|加速卡|utility|grid|power|electricity|供电|电力|电网/i.test(context);
    return !hasQualifier || !hasType;
  });
}

function likelyNegativeAi(text: string, topics: string[]): boolean {
  const hasAi = /\bAI\b|人工智能|模型|大模型|LLM|token|推理|agent/i.test(text);
  const hasInfrastructure = /data.?center|campus|MW|GW|power|grid|cooling|GPU|accelerator|server|network|capacity|机房|园区|电力|液冷|算力|芯片|存储/i.test(text) || topics.some((topic) => /data centers|compute and memory|power and cooling/i.test(topic));
  return hasAi && !hasInfrastructure;
}

function evidenceStatus(tier: SourceTier, stance: string, record: RawRecord): FrozenEvent["expected_evidence_status"] {
  if (["responds", "denies", "questions"].includes(stance)) return "official_response";
  if (tier === "T0" || tier === "T1") return firstString(record, ["level"]) === "reported" ? "reported" : "officially_confirmed";
  if (tier === "D" || tier === "T4" || tier === "T5") return "lead";
  return "reported";
}

function expectedRoute(tier: SourceTier, eventType: string, relevance: boolean, evidence: FrozenEvent["expected_evidence_status"], capacityNeedsReview = false): Route {
  if (!relevance) return "rejected";
  if (capacityNeedsReview) return "hold";
  if (tier === "D" || evidence === "lead") return "hold";
  if (/policy/i.test(eventType) && tier === "T0") return "pulse";
  if (tier === "T0" || tier === "T1") return "pulse";
  if (tier === "T2" || tier === "T3") return "rumor-watch";
  return "hold";
}

function sourceDefinition(record: RawRecord, url: string, name: string, tier: SourceTier, independenceGroup: string, language: string, count: number): ReplaySource {
  const id = `replay-source-${hash(`${name}|${hostname(url)}|${independenceGroup}`)}`;
  const source = sourceByUrl(url, name);
  const endpointType = source?.endpoint.type ?? "manual";
  return {
    id,
    slug: id,
    name,
    tier,
    publisherType: source?.publisherType ?? publisherTypeForTier(tier),
    region: firstString(record, ["region", "jurisdiction"]) ?? source?.region ?? "全球",
    language,
    independenceGroup,
    topics: source?.topics ?? topicsOf(record, textOf(record)),
    endpoint: {
      id: `${id}-endpoint`,
      type: endpointType,
      url,
      parserKey: "history-v1-recorded",
      pollIntervalMinutes: 60,
    },
    enabled: true,
    shadowEnabled: false,
    accessNotes: "历史回放记录；不重新抓取原文。",
    copyrightNotes: "仅保存已有仓库中的元数据、短摘要和原文链接。",
    fixtureRecordCount: count,
  };
}

function relationHints(record: RawRecord, entities: string[]): FrozenEvent["expected_relationships"] {
  const relation = firstString(record, ["relation", "relationship"]);
  if (!relation || entities.length < 2) return [];
  return [{ relation, from: entities[0], to: entities[1] }];
}

function fixturePathOf(record: RawRecord): string {
  const file = record.__file.startsWith("/") ? relative(projectRoot, record.__file) : record.__file;
  return `${file}:${record.__line}`;
}

async function loadJsonRecords(): Promise<RawRecord[]> {
  const files = [
    "docs/daily-reviews/2026-08-05-watch-input.json",
    "docs/daily-reviews/2026-08-06-watch-input.json",
    "docs/daily-reviews/2026-08-09-watch-input.json",
  ];
  const records: RawRecord[] = [];
  for (const file of files) {
    const payload = JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), "utf8")) as { items?: RawRecord[] };
    for (const item of payload.items ?? []) records.push({ ...item, __file: file, __line: 1, __sourceKey: "url" });
  }
  for (const file of ["artifacts/event-intelligence/event-night-live-gate3.json", "artifacts/event-intelligence/event-day-live-gate3.json"]) {
    const payload = JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), "utf8")) as { observationAnalysis?: RawRecord[] };
    for (const item of payload.observationAnalysis ?? []) records.push({ ...item, __file: file, __line: 1, __sourceKey: "url" });
  }
  for (const file of ["artifacts/event-intelligence/latest-run.json", "artifacts/event-intelligence/source-expansion-live.json"]) {
    const payload = JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), "utf8")) as { observationAnalysis?: RawRecord[] };
    for (const item of payload.observationAnalysis ?? []) records.push({ ...item, __file: file, __line: 1, __sourceKey: "url" });
  }
  return records;
}

async function build() {
  const labelReviewManifest = JSON.parse(await readFile(labelReviewUrl, "utf8")) as LabelReviewManifest;
  if (labelReviewManifest.schema_version !== "atlas-event-label-review.v1" || labelReviewManifest.corpus_id !== "history-v1") {
    throw new Error("history-v1 label review manifest has an invalid contract");
  }
  const reviewFixtureIds = labelReviewManifest.reviews.map((review) => review.fixture_id);
  if (new Set(reviewFixtureIds).size !== reviewFixtureIds.length) throw new Error("history-v1 label review manifest contains duplicate fixture reviews");
  const reviews = new Map(labelReviewManifest.reviews.map((review) => [review.fixture_id, review]));
  const records = [
    ...(await extractTypeScriptRecords(fileURLToPath(new URL("../worker/index.ts", import.meta.url)), "sourceUrl")),
    ...(await extractTypeScriptRecords(fileURLToPath(new URL("../app/watch-data.ts", import.meta.url)), "sourceUrl")),
    ...(await extractTypeScriptRecords(fileURLToPath(new URL("../app/columns/scheduled-article-data.ts", import.meta.url)), "url")),
    ...(await loadJsonRecords()),
  ];
  const usedKeys = new Set<string>();
  const canonicalEventKeys = new Map<string, string>();
  const canonicalGroupMap = new Map<string, string>();
  for (const record of records) {
    const url = String(record.sourceUrl ?? record.url ?? record.originalUrl ?? "").trim();
    const canonicalUrl = canonicalizeUrl(url);
    if (!canonicalGroupMap.has(canonicalUrl)) {
      const name = sourceNameOf(record, url);
      const tier = inferTier(record, url, name);
      canonicalGroupMap.set(canonicalUrl, independenceGroupOf(record, url, name, tier));
    }
  }
  const prepared = records.map((record, index) => {
    const url = String(record.sourceUrl ?? record.url ?? record.originalUrl ?? "").trim();
    const canonicalUrl = canonicalizeUrl(url);
    const name = sourceNameOf(record, url);
    const tier = inferTier(record, url, name);
    const language = languageOf(record);
    const independenceGroup = canonicalGroupMap.get(canonicalUrl) ?? independenceGroupOf(record, url, name, tier);
    const sourceId = `replay-source-${hash(`${name}|${hostname(url)}|${independenceGroup}`)}`;
    const rawId = firstString(record, ["id", "externalId", "external_id"]);
    const fixtureId = `history-${hash(`${record.__file}|${record.__line}|${canonicalUrl}|${rawId ?? index}`)}`;
    const observationId = `obs-${hash(`${fixtureId}|${canonicalUrl}`)}`;
    const explicitEventKey = firstString(record, ["eventKey", "event_key"]);
    let eventKey = (explicitEventKey ?? canonicalEventKeys.get(canonicalUrl) ?? eventKeyOf(record, fixtureId, canonicalUrl)).replace(/\s+$/, "");
    if (usedKeys.has(eventKey) && !explicitEventKey && !canonicalEventKeys.has(canonicalUrl)) eventKey = `${eventKey}|${hash(fixtureId, 8)}`;
    if (!canonicalEventKeys.has(canonicalUrl)) canonicalEventKeys.set(canonicalUrl, eventKey);
    usedKeys.add(eventKey);
    const title = titleOf(record, url);
    const summary = summaryOf(record, title);
    const text = textOf({ ...record, title, summary });
    const topics = topicsOf(record, text);
    const entities = entitiesOf(record, text);
    const eventType = eventTypeOf(record, tier, text);
    const stance = stanceOf(record, text);
    const bilingual = bilingualState(record);
    const relevance = !likelyNegativeAi(text, topics) && !/pure share price|price target|technical analysis|market commentary|股价|目标价|技术分析/i.test(text);
    const evidence = evidenceStatus(tier, stance, record);
    const capacity = capacityFacts(record, text);
    const route = expectedRoute(tier, eventType, relevance, evidence, capacityBoundaryNeedsReview(text));
    const duplicateOrSyndication = Boolean(firstString(record, ["origin_url", "originUrl"])) || /mirror|syndicat|转载|转述|translation|翻译/i.test(text) || records.some((other) => other !== record && canonicalizeUrl(String(other.sourceUrl ?? other.url ?? other.originalUrl ?? "")) === canonicalUrl);
    const timelineResponse = Boolean(firstString(record, ["officialResponse", "official_response", "stance"])) || /response|respond|denies|denial|回应|否认|确认|follow.?up|后续/i.test(text);
    const bilingualPair = bilingualFieldsPresent(record);
    const negativeAi = likelyNegativeAi(text, topics);
    const observation: ObservationEnvelope = {
      sourceId,
      endpointId: `${sourceId}-endpoint`,
      canonicalUrl,
      originalUrl: url,
      externalId: rawId,
      titleOriginal: title,
      summaryOriginal: summary.slice(0, 1200),
      language,
      author: firstString(record, ["author", "sourceName", "source_name"]),
      publishedAt: parseDate(record),
      discoveredAt: parseDate(record) ?? "2026-08-09T00:00:00.000Z",
      fetchedAt: "2026-08-09T00:00:00.000Z",
      rawPayload: {
        sourceName: name,
        sourceTier: tier,
        independenceGroup,
        titleZh: firstString(record, ["titleZh", "title_zh", "zh"]) ?? (firstString(record, ["titleEn", "title_en", "en"]) ? firstString(record, ["title"]) : null),
        titleEn: firstString(record, ["titleEn", "title_en", "en"]),
        summaryZh: firstString(record, ["summaryZh", "summary_zh"]) ?? (firstString(record, ["summaryEn", "summary_en"]) ? firstString(record, ["summary", "summaryOriginal"]) : null),
        summaryEn: firstString(record, ["summaryEn", "summary_en"]),
        stance,
        eventKey,
        eventType,
        sourceRecordId: rawId,
        fixturePath: fixturePathOf(record),
        coverage: { primary_event: tier === "T0" || tier === "T1", media_event: tier === "T2" || tier === "T3", duplicate_or_syndication: duplicateOrSyndication, negative_ai_keyword: negativeAi, capacity_boundary: capacity.length > 0, bilingual_pair: bilingualPair, timeline_response: timelineResponse },
      },
      accessStatus: accessOf(record),
      eventKey,
      eventType,
      entities,
      locations: locationsOf(record),
      topics,
    };
    const frozen: FrozenEvent = {
      fixture_id: fixtureId,
      label_hash: "",
      source_observation_ids: [observationId],
      expected_relevance: relevance,
      expected_event_key: eventKey,
      expected_cluster_members: [observationId],
      expected_primary_source_id: sourceId,
      expected_evidence_status: evidence,
      expected_route: route,
      expected_public_eligible: route !== "hold" && route !== "rejected" && bilingual === "complete",
      expected_entities: entities,
      expected_capacity_facts: capacity,
      expected_relationships: relationHints(record, entities),
      expected_bilingual_state: bilingual,
      label_basis: ["existing-source-record", fixturePathOf(record), "candidate-rule-label", "no-model-facts"],
      label_status: "provisional",
      coverage: { primary_event: tier === "T0" || tier === "T1", media_event: tier === "T2" || tier === "T3", duplicate_or_syndication: duplicateOrSyndication, negative_ai_keyword: negativeAi, capacity_boundary: capacity.length > 0, bilingual_pair: bilingualPair, timeline_response: timelineResponse },
    };
    return { observation, frozen, source: sourceDefinition(record, url, name, tier, independenceGroup, language, 0) };
  });
  const sourceCountsById = new Map<string, number>();
  for (const item of prepared) sourceCountsById.set(item.source.id, (sourceCountsById.get(item.source.id) ?? 0) + 1);
  const sourceMap = new Map<string, ReplaySource>();
  for (const item of prepared) sourceMap.set(item.source.id, { ...item.source, fixtureRecordCount: sourceCountsById.get(item.source.id) ?? 0 });
  const frozenPrepared = prepared.filter((item, index) => prepared.findIndex((candidate) => candidate.observation.canonicalUrl === item.observation.canonicalUrl) === index);
  const selectedIds = new Set<string>();
  const selectedFrozenPrepared: typeof prepared = [];
  const selectCoverage = (key: keyof FrozenEvent["coverage"], required: number) => {
    for (const item of prepared) {
      if (selectedFrozenPrepared.length >= 360 || selectedFrozenPrepared.filter((candidate) => candidate.frozen.coverage[key]).length >= required) break;
      if (!item.frozen.coverage[key] || selectedIds.has(item.frozen.fixture_id)) continue;
      selectedIds.add(item.frozen.fixture_id);
      selectedFrozenPrepared.push(item);
    }
  };
  selectCoverage("capacity_boundary", 40);
  selectCoverage("duplicate_or_syndication", 40);
  selectCoverage("negative_ai_keyword", 30);
  selectCoverage("primary_event", 40);
  selectCoverage("media_event", 40);
  selectCoverage("bilingual_pair", 20);
  selectCoverage("timeline_response", 20);
  for (const item of prepared) {
    if (selectedFrozenPrepared.length >= 360) break;
    if (selectedIds.has(item.frozen.fixture_id)) continue;
    selectedIds.add(item.frozen.fixture_id);
    selectedFrozenPrepared.push(item);
  }
  const observationIdOf = (item: (typeof prepared)[number]) => `obs-${hash(`${item.frozen.fixture_id}|${item.observation.canonicalUrl}`)}`;
  const membersByEventKey = new Map<string, string[]>();
  for (const item of prepared) membersByEventKey.set(item.frozen.expected_event_key, [...(membersByEventKey.get(item.frozen.expected_event_key) ?? []), observationIdOf(item)]);
  const candidateFrozenEvents = selectedFrozenPrepared.map((item) => {
    const event = { ...item.frozen, source_observation_ids: [observationIdOf(item)], expected_cluster_members: membersByEventKey.get(item.frozen.expected_event_key) ?? [observationIdOf(item)] };
    return { ...event, label_hash: labelHash(event) };
  });
  const reviewedFrozenEvents = candidateFrozenEvents.map((event) => {
    const review = reviews.get(event.fixture_id);
    const validReview = review
      && review.label_hash === event.label_hash
      && Boolean(review.reviewed_by.trim())
      && Number.isFinite(Date.parse(review.reviewed_at))
      && review.source_checks.length > 0
      && review.source_checks.every((url) => /^https?:\/\//.test(url))
      && review.decision === "accept";
    if (!validReview) return event;
    if (review.review_type === "human") {
      return { ...event, label_status: "frozen" as const, label_basis: [...event.label_basis, "independent-human-review", `reviewed-by:${review.reviewed_by}`, `reviewed-at:${review.reviewed_at}`] };
    }
    return { ...event, label_status: "audited" as const, label_basis: [...event.label_basis, "automated-policy-audit", `reviewed-by:${review.reviewed_by}`, `reviewed-at:${review.reviewed_at}`] };
  });
  const corpus: EventReplayCorpus = {
    schema_version: "atlas-event-replay.v1",
    corpus_id: "history-v1",
    generated_at: "2026-08-09T00:00:00.000Z",
    provenance: {
      files: [...new Set(records.map((record) => record.__file))].sort(),
      source_policy: "Only structured repository event records with an original URL, metadata and bounded short text were used; generic URLs mentioned in prose or code are excluded. No model-generated facts or third-party fetch was performed.",
      model_calls: 0,
      production_touched: false,
      label_review_manifest: "scripts/fixtures/event-intelligence/history-v1-label-reviews.json",
      policy_audited_labels: reviewedFrozenEvents.filter((event) => event.label_status === "audited" || event.label_status === "frozen").length,
      independently_reviewed_labels: reviewedFrozenEvents.filter((event) => event.label_status === "frozen").length,
    },
    sources: [...sourceMap.values()].sort((left, right) => left.id.localeCompare(right.id)),
    observations: prepared.map((item) => ({ ...item.observation, id: `obs-${hash(`${item.frozen.fixture_id}|${item.observation.canonicalUrl}`)}` })),
    frozen_events: reviewedFrozenEvents,
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(corpus, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ output: relative(projectRoot, outputPath), observations: corpus.observations.length, uniqueSourceUrls: frozenPrepared.length, candidateEvents: corpus.frozen_events.length, policyAudited: corpus.provenance.policy_audited_labels, independentlyReviewed: corpus.provenance.independently_reviewed_labels, sources: corpus.sources.length }, null, 2));
}

await build();
