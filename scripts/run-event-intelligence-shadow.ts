import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchRegisteredSource, shadowSources, sourceRegistry } from "../worker/connectors/index.ts";
import type { ConnectorResult, ObservationEnvelope, SourceDefinition } from "../worker/connectors/types.ts";
import { fetchSourcesBatched } from "../worker/event-intelligence/source-fetch-batches.ts";
import { runShadowPipeline, scoringConfig, type ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

const artifactDir = new URL("../artifacts/event-intelligence/", import.meta.url);
const fixtureUrl = new URL("./fixtures/event-intelligence/core-cases.json", import.meta.url);
const migrationUrl = new URL("../drizzle/0000_event_intelligence.sql", import.meta.url);
const defaultDbPath = "/private/tmp/idc-atlas-event-intelligence-shadow.sqlite";

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

async function loadFixtureResults(): Promise<ConnectorResult[]> {
  const observations = JSON.parse(await readFile(fixtureUrl, "utf8")) as ObservationEnvelope[];
  const groups = new Map<string, ObservationEnvelope[]>();
  for (const observation of observations) {
    const key = `${observation.sourceId}/${observation.endpointId}`;
    groups.set(key, [...(groups.get(key) ?? []), observation]);
  }
  return [...groups.entries()].map(([key, items]) => {
    const [sourceId, endpointId] = key.split("/");
    return { status: "ok", sourceId, endpointId, fetchedAt: new Date().toISOString(), httpStatus: 200, responseMs: 1, observations: items };
  });
}

function loadRequestStates(dbPath: string): Map<string, { etag: string | null; lastModified: string | null; cursor: string | null }> {
  const states = new Map<string, { etag: string | null; lastModified: string | null; cursor: string | null }>();
  const database = new DatabaseSync(dbPath);
  try {
    const rows = database.prepare("SELECT endpoint_id, etag, last_modified, cursor FROM source_sync_state").all() as Array<{ endpoint_id: string; etag: string | null; last_modified: string | null; cursor: string | null }>;
    for (const row of rows) states.set(row.endpoint_id, { etag: row.etag, lastModified: row.last_modified, cursor: row.cursor });
  } finally {
    database.close();
  }
  return states;
}

async function loadLiveResults(dbPath: string): Promise<ConnectorResult[]> {
  const sources = shadowSources();
  const states = loadRequestStates(dbPath);
  const concurrency = Number.parseInt(arg("concurrency") ?? "6", 10);
  const retries = Number.parseInt(arg("retries") ?? "2", 10);
  return fetchSourcesBatched(
    sources,
    (source) => fetchRegisteredSource(source, { requestState: states.get(source.endpoint.id) }),
    { concurrency, retries },
  );
}

function applyMigration(database: DatabaseSync, migration: string) {
  database.exec(migration.replaceAll("--> statement-breakpoint", "\n"));
}

function ensureShadowDatabase(database: DatabaseSync, migration: string) {
  database.exec("PRAGMA foreign_keys = ON");
  const hasEvents = database.prepare("SELECT 1 AS present FROM sqlite_schema WHERE type = 'table' AND name = 'events'").get();
  if (!hasEvents) {
    applyMigration(database, migration);
  }
}

function initializeShadowDatabase(dbPath: string, migration: string, sources: SourceDefinition[]) {
  const database = new DatabaseSync(dbPath);
  try {
    ensureShadowDatabase(database, migration);
    for (const source of sources) insertSource(database, source);
  } finally {
    database.close();
  }
}

function insertSource(database: DatabaseSync, source: SourceDefinition) {
  database.prepare(`INSERT OR IGNORE INTO sources
    (id, slug, name, tier, publisher_type, region, language, independence_group, topics_json, enabled, access_notes, copyright_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    source.id, source.slug, source.name, source.tier, source.publisherType, source.region, source.language, source.independenceGroup,
    JSON.stringify(source.topics), source.enabled ? 1 : 0, source.accessNotes ?? "", source.copyrightNotes ?? "",
  );
  database.prepare(`INSERT OR IGNORE INTO source_endpoints
    (id, source_id, endpoint_type, url, poll_interval_minutes, parser_key, access_notes, enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    source.endpoint.id, source.id, source.endpoint.type, source.endpoint.url, source.endpoint.pollIntervalMinutes, source.endpoint.parserKey, source.endpoint.accessNotes ?? source.accessNotes ?? "", source.enabled ? 1 : 0,
  );
}

function stableEntityId(name: string): string {
  return `entity-${createHash("sha256").update(name.trim().toLocaleLowerCase()).digest("hex").slice(0, 20)}`;
}

function insertEntity(database: DatabaseSync, name: string, entityType: string) {
  const id = stableEntityId(name);
  database.prepare(`INSERT OR IGNORE INTO entities
    (id, entity_type, canonical_name, aliases_json)
    VALUES (?, ?, ?, ?)`)
    .run(id, entityType, name, "[]");
  return id;
}

export function persistShadowReport(report: ShadowRunReport, results: ConnectorResult[], sources: SourceDefinition[], dbPath: string, migration: string, trigger: string) {
  const database = new DatabaseSync(dbPath);
  let transactionOpen = false;
  try {
    ensureShadowDatabase(database, migration);
    for (const source of sources) insertSource(database, source);
    database.exec("BEGIN IMMEDIATE");
    transactionOpen = true;
    const runId = `run-${report.generatedAt.replace(/[^0-9]/g, "").slice(0, 14)}-${report.strategyVersion}`;
    database.prepare(`INSERT OR REPLACE INTO ingestion_runs
      (id, trigger, started_at, finished_at, status, strategy_version, fetched_count, normalized_count, classified_relevant_count, deep_scored_count, clustered_count, published_count, error_count, summary_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      runId, trigger, report.generatedAt, report.generatedAt, report.status, report.strategyVersion, report.stats.fetched, report.stats.normalized,
      report.stats.relevant, report.stats.deepScored, report.stats.clusters, report.stats.publicEligible, report.stats.errors, JSON.stringify(report.stats),
    );
    database.prepare(`INSERT OR REPLACE INTO scoring_versions
      (version, code_version, classifier_version, prompt_hash, weights_json, thresholds_json, published_at, replay_report_ref, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(report.strategyVersion, report.strategyVersion, report.classifierVersion, null, JSON.stringify(scoringConfig.weights), JSON.stringify(scoringConfig.thresholds), report.generatedAt, "artifacts/event-intelligence/strategy-comparison.json", 1);
    const observationIdByReportId = new Map<string, string>();
    const observationById = database.prepare("SELECT id FROM observations WHERE id = ?");
    const observationBySourceExternalId = database.prepare("SELECT id FROM observations WHERE source_id = ? AND external_id = ?");
    const observationByCanonicalUrlHash = database.prepare("SELECT id FROM observations WHERE canonical_url_hash = ?");
    for (const record of report.observationAnalysis) {
      const identityMatches = [
        observationById.get(record.id) as { id: string } | undefined,
        record.externalId ? observationBySourceExternalId.get(record.sourceId, record.externalId) as { id: string } | undefined : undefined,
        observationByCanonicalUrlHash.get(record.canonicalUrlHash) as { id: string } | undefined,
      ].filter((match): match is { id: string } => Boolean(match));
      const matchedIds = new Set(identityMatches.map((match) => match.id));
      if (matchedIds.size > 1) throw new Error(`Observation identity conflict for ${record.id}: ${[...matchedIds].join(", ")}`);
      const persistedObservationId = identityMatches[0]?.id ?? record.id;
      observationIdByReportId.set(record.id, persistedObservationId);
      database.prepare(`INSERT INTO observations
        (id, source_id, endpoint_id, canonical_url, original_url, external_id, title_original, summary_original, language, author, published_at, discovered_at, fetched_at, content_hash, canonical_url_hash, raw_payload_json, access_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          source_id = excluded.source_id, endpoint_id = excluded.endpoint_id, canonical_url = excluded.canonical_url,
          original_url = excluded.original_url, external_id = excluded.external_id, title_original = excluded.title_original,
          summary_original = excluded.summary_original, language = excluded.language, author = excluded.author,
          published_at = excluded.published_at, discovered_at = excluded.discovered_at, fetched_at = excluded.fetched_at,
          content_hash = excluded.content_hash, canonical_url_hash = excluded.canonical_url_hash,
          raw_payload_json = excluded.raw_payload_json, access_status = excluded.access_status`)
        .run(persistedObservationId, record.sourceId, record.endpointId, record.canonicalUrl, record.originalUrl, record.externalId, record.titleOriginal, record.summaryOriginal, record.language, record.author,
          record.publishedAt, record.discoveredAt, record.fetchedAt, record.contentHash, record.canonicalUrlHash, JSON.stringify(record.rawPayload), record.accessStatus);
      database.prepare(`INSERT OR REPLACE INTO observation_analysis
        (observation_id, classifier_version, topic_bucket, is_relevant, uncertain, topic_relevance_score, mechanism_depth_score, specificity_score, research_value_score, reader_value_score, editor_judgment, reason, entities_json, facts_json, translated_title_zh, translated_title_en, summary_zh, summary_en, embedding_model, embedding_ref, analysis_status, analyzed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(persistedObservationId, report.classifierVersion, record.classification.topicBucket, record.classification.isRelevant ? 1 : 0, record.classification.uncertain ? 1 : 0,
          record.analysis.topicRelevanceScore, record.analysis.mechanismDepthScore, record.analysis.specificityScore, record.analysis.researchValueScore, record.analysis.readerValueScore,
          null, record.analysis.reason, JSON.stringify(record.analysis.entities), JSON.stringify(record.analysis.facts), record.analysis.titleZh, record.analysis.titleEn, record.analysis.summaryZh, record.analysis.summaryEn,
          null, null, record.analysis.analysisStatus, report.generatedAt);
      for (const entity of record.analysis.entities) {
        const entityId = insertEntity(database, entity, "named-entity");
        database.prepare(`INSERT OR IGNORE INTO pipeline_stage_runs
          (id, run_id, stage, observation_id, status, duration_ms, model, estimated_cost_usd, started_at, finished_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(`${runId}-${persistedObservationId}-entity-${entityId}`, runId, "entity", persistedObservationId, "succeeded", 0, "deterministic-shadow-v1", 0, report.generatedAt, report.generatedAt);
      }
      for (const stage of ["normalize", "classify", "analyze"] as const) {
        database.prepare(`INSERT OR IGNORE INTO pipeline_stage_runs
          (id, run_id, stage, observation_id, status, duration_ms, model, estimated_cost_usd, started_at, finished_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(`${runId}-${persistedObservationId}-${stage}`, runId, stage, persistedObservationId, "succeeded", 0, stage === "analyze" ? "deterministic-shadow-v1" : null, 0, report.generatedAt, report.generatedAt);
      }
    }
    for (const event of report.events) {
      const mainObservation = event.sourceChain.find((item) => item.observationId === event.mainObservationId) ?? event.sourceChain[0];
      const mainObservationId = mainObservation ? observationIdByReportId.get(mainObservation.observationId) ?? mainObservation.observationId : null;
      const existing = database.prepare("SELECT evidence_status, publication_state, title_zh, title_en, summary_zh, summary_en, last_updated_at FROM events WHERE id = ?").get(event.id) as { evidence_status: string; publication_state: string; title_zh: string; title_en: string; summary_zh: string; summary_en: string; last_updated_at: string } | undefined;
      const publicationState = event.eligible ? "pending" : "internal";
      database.prepare(`INSERT INTO events
        (id, event_key, event_type, title_zh, title_en, summary_zh, summary_en, first_seen_at, last_updated_at, event_time, region, evidence_status, publication_state, main_observation_id, strategy_version, internal_priority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          event_key = excluded.event_key, event_type = excluded.event_type, title_zh = excluded.title_zh, title_en = excluded.title_en,
          summary_zh = excluded.summary_zh, summary_en = excluded.summary_en, last_updated_at = excluded.last_updated_at,
          event_time = excluded.event_time, region = excluded.region, evidence_status = excluded.evidence_status,
          publication_state = excluded.publication_state, main_observation_id = excluded.main_observation_id,
          strategy_version = excluded.strategy_version, internal_priority = excluded.internal_priority`).run(
        event.id, event.eventKey, event.eventType, event.titleZh, event.titleEn, event.summaryZh, event.summaryEn, event.firstSeenAt, event.lastUpdatedAt,
        event.eventTime, event.region, event.evidenceStatus, publicationState, mainObservationId,
        report.strategyVersion, event.priorityScore ?? 0,
      );
      const changed = !existing || existing.evidence_status !== event.evidenceStatus || existing.publication_state !== publicationState
        || existing.title_zh !== event.titleZh || existing.title_en !== event.titleEn || existing.summary_zh !== event.summaryZh || existing.summary_en !== event.summaryEn;
      if (changed && mainObservation) {
        database.prepare(`INSERT OR IGNORE INTO event_updates
          (id, event_id, status_from, status_to, change_type, observed_at, source_observation_id, note)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
          `${runId}-${event.id}-update`, event.id, existing?.evidence_status ?? null, event.evidenceStatus,
          existing ? "evidence-or-content-change" : "created", report.generatedAt, mainObservationId,
          existing ? `publication ${existing.publication_state} -> ${publicationState}` : "first observed in shadow store",
        );
      }
      for (const entity of event.entities) {
        const entityId = insertEntity(database, entity, "named-entity");
        database.prepare(`INSERT OR IGNORE INTO event_entities (event_id, entity_id, role) VALUES (?, ?, ?)`)
          .run(event.id, entityId, "subject");
      }
      for (const location of event.locations) {
        const entityId = insertEntity(database, location, "location");
        database.prepare(`INSERT OR IGNORE INTO event_entities (event_id, entity_id, role) VALUES (?, ?, ?)`)
          .run(event.id, entityId, "location");
      }
      for (const stage of ["cluster", "score"] as const) {
        database.prepare(`INSERT OR IGNORE INTO pipeline_stage_runs
          (id, run_id, stage, event_id, status, duration_ms, model, estimated_cost_usd, started_at, finished_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(`${runId}-${event.id}-${stage}`, runId, stage, event.id, "succeeded", 0, "deterministic-shadow-v1", 0, report.generatedAt, report.generatedAt);
      }
      for (const chain of event.sourceChain) {
        const chainObservationId = observationIdByReportId.get(chain.observationId) ?? chain.observationId;
        database.prepare(`INSERT OR REPLACE INTO event_observations
          (event_id, observation_id, relationship, is_independent_confirmation, is_main)
          VALUES (?, ?, ?, ?, ?)`).run(
          event.id, chainObservationId, chain.relationship, chain.relationship === "confirmation" ? 1 : 0, chain.observationId === event.mainObservationId ? 1 : 0,
        );
        if (chain.observationId !== event.mainObservationId && ["new-detail", "official-response", "contradiction"].includes(chain.noveltyClass)) {
          database.prepare(`INSERT OR IGNORE INTO event_updates
            (id, event_id, status_from, status_to, change_type, observed_at, source_observation_id, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
            `${runId}-${event.id}-${chainObservationId}-delta`, event.id, event.evidenceStatus, event.evidenceStatus,
            chain.noveltyClass, chain.publishedAt ?? report.generatedAt, chainObservationId,
            `${chain.noveltyClass}; new facts ${chain.newFactCount}`,
          );
        }
      }
      database.prepare(`INSERT OR REPLACE INTO selection_decisions
        (id, event_id, strategy_version, eligible, priority_score, route, reason_codes_json, decided_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
        `${event.id}-${report.strategyVersion}`, event.id, report.strategyVersion, event.eligible ? 1 : 0, event.priorityScore ?? 0,
        event.route ?? "hold", JSON.stringify(event.reasonCodes ?? []), report.generatedAt,
      );
      database.prepare("DELETE FROM event_facts WHERE event_id = ?").run(event.id);
      for (const [index, fact] of event.facts.entries()) {
        database.prepare(`INSERT OR REPLACE INTO event_facts
          (id, event_id, fact_type, value_text, value_number, unit, qualifier, period_start, period_end, source_observation_id, confidence_state)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
          `${event.id}-fact-${index}`, event.id, fact.factType, fact.valueText, fact.valueNumber ?? null, fact.unit ?? null, fact.qualifier ?? null,
          fact.factType === "date" ? fact.valueText : null, null, observationIdByReportId.get(fact.sourceObservationId) ?? fact.sourceObservationId, fact.confidenceState,
        );
      }
      database.prepare(`INSERT OR REPLACE INTO pipeline_stage_runs
        (id, run_id, stage, event_id, status, duration_ms, model, estimated_cost_usd, started_at, finished_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
        `${runId}-${event.id}-route`, runId, "route", event.id, "succeeded", 0, "deterministic-shadow-v1", 0, report.generatedAt, report.generatedAt,
      );
    }
    for (const result of results) {
      const successful = result.status === "ok" || result.status === "empty" || result.status === "not-modified";
      database.prepare(`INSERT INTO source_sync_state
        (endpoint_id, cursor, etag, last_modified, last_attempt_at, last_success_at, last_status, consecutive_failures, last_error)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(endpoint_id) DO UPDATE SET
          cursor = COALESCE(excluded.cursor, source_sync_state.cursor),
          etag = COALESCE(excluded.etag, source_sync_state.etag),
          last_modified = COALESCE(excluded.last_modified, source_sync_state.last_modified),
          last_attempt_at = excluded.last_attempt_at,
          last_success_at = CASE WHEN excluded.consecutive_failures = 0 THEN excluded.last_success_at ELSE source_sync_state.last_success_at END,
          last_status = excluded.last_status,
          consecutive_failures = CASE WHEN excluded.consecutive_failures = 0 THEN 0 ELSE source_sync_state.consecutive_failures + 1 END,
          last_error = excluded.last_error,
          updated_at = CURRENT_TIMESTAMP`).run(
        result.endpointId, result.cursor ?? null, result.etag ?? null, result.lastModified ?? null, result.fetchedAt, successful ? result.fetchedAt : null, result.status,
        successful ? 0 : 1, result.error ?? null,
      );
    }
    database.exec("COMMIT");
    transactionOpen = false;
  } catch (error) {
    if (transactionOpen) database.exec("ROLLBACK");
    throw error;
  } finally {
    database.close();
  }
}

async function run() {
  const mode = arg("mode") ?? "live";
  const dbPath = arg("db") ?? defaultDbPath;
  const trigger = arg("slot") ?? (mode === "fixture" ? "fixture" : "event-shadow");
  const outputName = arg("output") ?? "latest-run.json";
  const migration = await readFile(migrationUrl, "utf8");
  initializeShadowDatabase(dbPath, migration, sourceRegistry);
  const results = mode === "fixture" ? await loadFixtureResults() : await loadLiveResults(dbPath);
  const report = await runShadowPipeline(results, sourceRegistry, { strategyVersion: arg("strategy") ?? undefined });
  persistShadowReport(report, results, sourceRegistry, dbPath, migration, trigger);
  await mkdir(artifactDir, { recursive: true });
  const projectRoot = fileURLToPath(new URL("../", import.meta.url));
  const outputPath = isAbsolute(outputName)
    ? outputName
    : outputName.startsWith("artifacts/event-intelligence/")
      ? resolve(projectRoot, outputName)
      : resolve(fileURLToPath(artifactDir), outputName);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({ ...report, inputMode: mode, executionMode: "codex-local", trigger, shadowDbPath: dbPath, sourceRegistryCount: sourceRegistry.length }, null, 2)}\n`);
  console.log(JSON.stringify({ message: "Event intelligence Codex run complete", mode, trigger, status: report.status, freshness: report.freshness, stats: report.stats, output: outputPath, shadowDbPath: dbPath }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) void run();
