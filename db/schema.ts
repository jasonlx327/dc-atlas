import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const sourceTiers = ["T0", "T1", "T2", "T3", "T4", "T5", "D"] as const;
export const ingestionRunStatuses = ["running", "succeeded", "partial", "failed", "blocked"] as const;
export const evidenceStatuses = [
  "lead",
  "reported",
  "official_response",
  "officially_confirmed",
  "legally_disclosed",
  "superseded",
  "retracted",
  "verified_no_change",
] as const;
export const publicationStates = ["internal", "pending", "public", "withdrawn"] as const;
export const routes = ["rumor-watch", "pulse", "policy-index", "research-queue", "hold", "rejected"] as const;
export const accessStatuses = ["public", "public-api", "paywalled", "licensed", "login-required", "unavailable"] as const;

const now = sql`CURRENT_TIMESTAMP`;

export const sources = sqliteTable("sources", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  tier: text("tier", { enum: sourceTiers }).notNull(),
  publisherType: text("publisher_type").notNull(),
  region: text("region").notNull(),
  language: text("language").notNull(),
  independenceGroup: text("independence_group").notNull(),
  topicsJson: text("topics_json").notNull().default("[]"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  accessNotes: text("access_notes").notNull().default(""),
  copyrightNotes: text("copyright_notes").notNull().default(""),
  lastAttemptAt: text("last_attempt_at"),
  lastSuccessAt: text("last_success_at"),
  lastHttpStatus: integer("last_http_status"),
  lastResponseMs: real("last_response_ms"),
  etag: text("etag"),
  lastModified: text("last_modified"),
  consecutiveFailures: integer("consecutive_failures").notNull().default(0),
  rolling7dSuccessRate: real("rolling_7d_success_rate"),
  lastNewCount: integer("last_new_count").notNull().default(0),
  lastDuplicateCount: integer("last_duplicate_count").notNull().default(0),
  lastParseErrorCount: integer("last_parse_error_count").notNull().default(0),
  parserVersion: text("parser_version").notNull().default("v1"),
  lastError: text("last_error"),
  createdAt: text("created_at").notNull().default(now),
  updatedAt: text("updated_at").notNull().default(now),
}, (table) => ({
  slugUnique: uniqueIndex("uq_sources_slug").on(table.slug),
  tierEnabledIdx: index("idx_sources_tier_enabled").on(table.tier, table.enabled),
  healthIdx: index("idx_sources_health").on(table.lastSuccessAt, table.consecutiveFailures),
}));

export const sourceEndpoints = sqliteTable("source_endpoints", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => sources.id),
  endpointType: text("endpoint_type").notNull(),
  url: text("url").notNull(),
  pollIntervalMinutes: integer("poll_interval_minutes").notNull().default(60),
  parserKey: text("parser_key").notNull(),
  accessNotes: text("access_notes").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(now),
  updatedAt: text("updated_at").notNull().default(now),
}, (table) => ({
  sourceUrlUnique: uniqueIndex("uq_source_endpoints_source_url").on(table.sourceId, table.url),
  enabledPollIdx: index("idx_source_endpoints_enabled_poll").on(table.enabled, table.pollIntervalMinutes),
}));

export const sourceSyncState = sqliteTable("source_sync_state", {
  endpointId: text("endpoint_id").primaryKey().references(() => sourceEndpoints.id),
  cursor: text("cursor"),
  etag: text("etag"),
  lastModified: text("last_modified"),
  lastAttemptAt: text("last_attempt_at"),
  lastSuccessAt: text("last_success_at"),
  lastStatus: text("last_status").notNull().default("never-run"),
  consecutiveFailures: integer("consecutive_failures").notNull().default(0),
  lastError: text("last_error"),
  updatedAt: text("updated_at").notNull().default(now),
});

export const ingestionRuns = sqliteTable("ingestion_runs", {
  id: text("id").primaryKey(),
  trigger: text("trigger").notNull(),
  startedAt: text("started_at").notNull(),
  finishedAt: text("finished_at"),
  status: text("status", { enum: ingestionRunStatuses }).notNull(),
  strategyVersion: text("strategy_version").notNull(),
  fetchedCount: integer("fetched_count").notNull().default(0),
  normalizedCount: integer("normalized_count").notNull().default(0),
  classifiedRelevantCount: integer("classified_relevant_count").notNull().default(0),
  deepScoredCount: integer("deep_scored_count").notNull().default(0),
  clusteredCount: integer("clustered_count").notNull().default(0),
  publishedCount: integer("published_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  summaryJson: text("summary_json").notNull().default("{}"),
});

export const observations = sqliteTable("observations", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => sources.id),
  endpointId: text("endpoint_id").notNull().references(() => sourceEndpoints.id),
  canonicalUrl: text("canonical_url").notNull(),
  originalUrl: text("original_url").notNull(),
  externalId: text("external_id"),
  titleOriginal: text("title_original").notNull(),
  summaryOriginal: text("summary_original").notNull().default(""),
  language: text("language").notNull(),
  author: text("author"),
  publishedAt: text("published_at"),
  discoveredAt: text("discovered_at").notNull(),
  fetchedAt: text("fetched_at").notNull(),
  contentHash: text("content_hash").notNull(),
  canonicalUrlHash: text("canonical_url_hash").notNull(),
  rawPayloadJson: text("raw_payload_json").notNull().default("{}"),
  accessStatus: text("access_status", { enum: accessStatuses }).notNull(),
}, (table) => ({
  canonicalHashUnique: uniqueIndex("uq_observations_canonical_url_hash").on(table.canonicalUrlHash),
  sourceExternalUnique: uniqueIndex("uq_observations_source_external_id").on(table.sourceId, table.externalId),
  publishedIdx: index("idx_observations_published_at").on(table.publishedAt),
  sourceIdx: index("idx_observations_source_id").on(table.sourceId),
  contentIdx: index("idx_observations_content_hash").on(table.contentHash),
}));

export const observationAnalysis = sqliteTable("observation_analysis", {
  observationId: text("observation_id").primaryKey().references(() => observations.id),
  classifierVersion: text("classifier_version").notNull(),
  topicBucket: text("topic_bucket").notNull(),
  isRelevant: integer("is_relevant", { mode: "boolean" }).notNull(),
  uncertain: integer("uncertain", { mode: "boolean" }).notNull().default(false),
  topicRelevanceScore: real("topic_relevance_score"),
  mechanismDepthScore: real("mechanism_depth_score"),
  specificityScore: real("specificity_score"),
  researchValueScore: real("research_value_score"),
  readerValueScore: real("reader_value_score"),
  editorJudgment: text("editor_judgment"),
  reason: text("reason").notNull().default(""),
  entitiesJson: text("entities_json").notNull().default("[]"),
  factsJson: text("facts_json").notNull().default("[]"),
  translatedTitleZh: text("translated_title_zh"),
  translatedTitleEn: text("translated_title_en"),
  summaryZh: text("summary_zh"),
  summaryEn: text("summary_en"),
  embeddingModel: text("embedding_model"),
  embeddingRef: text("embedding_ref"),
  analysisStatus: text("analysis_status").notNull().default("pending"),
  analyzedAt: text("analyzed_at"),
});

export const entities = sqliteTable("entities", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  canonicalName: text("canonical_name").notNull(),
  nameZh: text("name_zh"),
  nameEn: text("name_en"),
  ticker: text("ticker"),
  country: text("country"),
  aliasesJson: text("aliases_json").notNull().default("[]"),
  createdAt: text("created_at").notNull().default(now),
  updatedAt: text("updated_at").notNull().default(now),
}, (table) => ({
  canonicalNameUnique: uniqueIndex("uq_entities_canonical_name").on(table.canonicalName),
  typeNameIdx: index("idx_entities_type_name").on(table.entityType, table.canonicalName),
}));

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  eventKey: text("event_key").notNull(),
  eventType: text("event_type").notNull(),
  titleZh: text("title_zh").notNull(),
  titleEn: text("title_en").notNull(),
  summaryZh: text("summary_zh").notNull(),
  summaryEn: text("summary_en").notNull(),
  firstSeenAt: text("first_seen_at").notNull(),
  lastUpdatedAt: text("last_updated_at").notNull(),
  eventTime: text("event_time"),
  region: text("region").notNull(),
  evidenceStatus: text("evidence_status", { enum: evidenceStatuses }).notNull(),
  publicationState: text("publication_state", { enum: publicationStates }).notNull().default("internal"),
  mainObservationId: text("main_observation_id").references(() => observations.id),
  strategyVersion: text("strategy_version").notNull(),
  internalPriority: real("internal_priority").notNull().default(0),
}, (table) => ({
  eventKeyUnique: uniqueIndex("uq_events_event_key").on(table.eventKey),
  statusPriorityIdx: index("idx_events_status_priority").on(table.evidenceStatus, table.internalPriority),
  updatedIdx: index("idx_events_last_updated_at").on(table.lastUpdatedAt),
}));

export const eventObservations = sqliteTable("event_observations", {
  eventId: text("event_id").notNull().references(() => events.id),
  observationId: text("observation_id").notNull().references(() => observations.id),
  relationship: text("relationship").notNull(),
  isIndependentConfirmation: integer("is_independent_confirmation", { mode: "boolean" }).notNull().default(false),
  isMain: integer("is_main", { mode: "boolean" }).notNull().default(false),
  addedAt: text("added_at").notNull().default(now),
}, (table) => ({
  pk: primaryKey({ columns: [table.eventId, table.observationId] }),
  observationIdx: index("idx_event_observations_observation").on(table.observationId),
  relationshipIdx: index("idx_event_observations_relationship").on(table.relationship),
}));

export const eventEntities = sqliteTable("event_entities", {
  eventId: text("event_id").notNull().references(() => events.id),
  entityId: text("entity_id").notNull().references(() => entities.id),
  role: text("role").notNull(),
  addedAt: text("added_at").notNull().default(now),
}, (table) => ({
  pk: primaryKey({ columns: [table.eventId, table.entityId, table.role] }),
  entityIdx: index("idx_event_entities_entity").on(table.entityId),
}));

export const eventFacts = sqliteTable("event_facts", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id),
  factType: text("fact_type").notNull(),
  valueText: text("value_text"),
  valueNumber: real("value_number"),
  unit: text("unit"),
  qualifier: text("qualifier"),
  periodStart: text("period_start"),
  periodEnd: text("period_end"),
  sourceObservationId: text("source_observation_id").notNull().references(() => observations.id),
  confidenceState: text("confidence_state").notNull(),
}, (table) => ({
  eventTypeIdx: index("idx_event_facts_event_type").on(table.eventId, table.factType),
  sourceIdx: index("idx_event_facts_source").on(table.sourceObservationId),
}));

export const eventUpdates = sqliteTable("event_updates", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id),
  statusFrom: text("status_from"),
  statusTo: text("status_to").notNull(),
  changeType: text("change_type").notNull(),
  observedAt: text("observed_at").notNull(),
  sourceObservationId: text("source_observation_id").notNull().references(() => observations.id),
  note: text("note").notNull().default(""),
  createdAt: text("created_at").notNull().default(now),
}, (table) => ({
  eventObservedIdx: index("idx_event_updates_event_observed").on(table.eventId, table.observedAt),
}));

export const selectionDecisions = sqliteTable("selection_decisions", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id),
  strategyVersion: text("strategy_version").notNull(),
  eligible: integer("eligible", { mode: "boolean" }).notNull(),
  priorityScore: real("priority_score").notNull(),
  route: text("route", { enum: routes }).notNull(),
  reasonCodesJson: text("reason_codes_json").notNull().default("[]"),
  decidedAt: text("decided_at").notNull(),
}, (table) => ({
  eventStrategyUnique: uniqueIndex("uq_selection_decisions_event_strategy").on(table.eventId, table.strategyVersion),
  routePriorityIdx: index("idx_selection_decisions_route_priority").on(table.route, table.priorityScore),
}));

export const scoringVersions = sqliteTable("scoring_versions", {
  version: text("version").primaryKey(),
  codeVersion: text("code_version").notNull(),
  classifierVersion: text("classifier_version").notNull(),
  promptHash: text("prompt_hash"),
  weightsJson: text("weights_json").notNull(),
  thresholdsJson: text("thresholds_json").notNull(),
  publishedAt: text("published_at").notNull(),
  replayReportRef: text("replay_report_ref"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
});

export const publicationRecords = sqliteTable("publication_records", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id),
  language: text("language").notNull(),
  route: text("route", { enum: routes }).notNull(),
  target: text("target").notNull(),
  publicationKey: text("publication_key").notNull(),
  publishedAt: text("published_at").notNull(),
  snapshotVersion: text("snapshot_version").notNull(),
  rollbackOf: text("rollback_of"),
}, (table) => ({
  publicationUnique: uniqueIndex("uq_publication_records_key").on(table.eventId, table.language, table.target),
  targetPublishedIdx: index("idx_publication_records_target_published").on(table.target, table.publishedAt),
}));

export const pipelineStageRuns = sqliteTable("pipeline_stage_runs", {
  id: text("id").primaryKey(),
  runId: text("run_id").notNull().references(() => ingestionRuns.id),
  stage: text("stage").notNull(),
  observationId: text("observation_id").references(() => observations.id),
  eventId: text("event_id").references(() => events.id),
  status: text("status").notNull(),
  durationMs: integer("duration_ms"),
  model: text("model"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  estimatedCostUsd: real("estimated_cost_usd"),
  retryCount: integer("retry_count").notNull().default(0),
  error: text("error"),
  startedAt: text("started_at").notNull(),
  finishedAt: text("finished_at"),
}, (table) => ({
  runStageIdx: index("idx_pipeline_stage_runs_run_stage").on(table.runId, table.stage),
  observationIdx: index("idx_pipeline_stage_runs_observation").on(table.observationId),
  eventIdx: index("idx_pipeline_stage_runs_event").on(table.eventId),
}));

export const adminAuditLogs = sqliteTable("admin_audit_logs", {
  id: text("id").primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  beforeJson: text("before_json"),
  afterJson: text("after_json"),
  reason: text("reason").notNull(),
  runId: text("run_id").references(() => ingestionRuns.id),
  eventId: text("event_id").references(() => events.id),
  sourceId: text("source_id").references(() => sources.id),
  createdAt: text("created_at").notNull().default(now),
}, (table) => ({
  createdIdx: index("idx_admin_audit_logs_created_at").on(table.createdAt),
  targetIdx: index("idx_admin_audit_logs_targets").on(table.runId, table.eventId, table.sourceId),
}));

export const schema = {
  sources,
  sourceEndpoints,
  sourceSyncState,
  ingestionRuns,
  observations,
  observationAnalysis,
  entities,
  events,
  eventObservations,
  eventEntities,
  eventFacts,
  eventUpdates,
  selectionDecisions,
  scoringVersions,
  publicationRecords,
  pipelineStageRuns,
  adminAuditLogs,
};
