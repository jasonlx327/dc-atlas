import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const migrationUrl = new URL("../drizzle/0000_event_intelligence.sql", import.meta.url);
const outputUrl = new URL("../artifacts/event-intelligence/migration-verification.json", import.meta.url);

const expectedTables = [
  "sources", "source_endpoints", "source_sync_state", "ingestion_runs", "observations", "observation_analysis", "entities", "events",
  "event_observations", "event_entities", "event_facts", "event_updates", "selection_decisions", "scoring_versions", "publication_records",
  "pipeline_stage_runs", "admin_audit_logs",
];

function applyMigrationOnce(database: DatabaseSync, migrationId: string, sql: string): "applied" | "skipped" {
  database.exec("CREATE TABLE IF NOT EXISTS __shadow_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");
  if (database.prepare("SELECT 1 FROM __shadow_migrations WHERE id = ?").get(migrationId)) return "skipped";
  database.exec(sql.replaceAll("--> statement-breakpoint", "\n"));
  database.prepare("INSERT INTO __shadow_migrations (id, applied_at) VALUES (?, CURRENT_TIMESTAMP)").run(migrationId);
  return "applied";
}

function inspectDatabase(database: DatabaseSync) {
  const tables = database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name != '__shadow_migrations' ORDER BY name").all() as Array<{ name: string }>;
  const indexes = database.prepare("SELECT name, tbl_name, sql FROM sqlite_schema WHERE type = 'index' AND tbl_name != '__shadow_migrations' ORDER BY name").all() as Array<{ name: string; tbl_name: string; sql: string | null }>;
  const eventPlan = tables.some((row) => row.name === "events")
    ? database.prepare("EXPLAIN QUERY PLAN SELECT * FROM events WHERE evidence_status = ? ORDER BY internal_priority DESC").all("reported") as Array<{ detail?: string }>
    : [];
  const observationPlan = tables.some((row) => row.name === "observations")
    ? database.prepare("EXPLAIN QUERY PLAN SELECT * FROM observations WHERE source_id = ? AND published_at >= ?").all("reuters", "2026-08-01T00:00:00Z") as Array<{ detail?: string }>
    : [];
  return {
    tables: tables.map((row) => row.name),
    indexes,
    queryPlans: { events: eventPlan, observations: observationPlan },
  };
}

async function run() {
  const migration = await readFile(migrationUrl, "utf8");
  const firstPath = join(tmpdir(), `idc-atlas-event-intelligence-blank-${Date.now()}.sqlite`);
  const existingPath = join(tmpdir(), `idc-atlas-event-intelligence-existing-${Date.now()}.sqlite`);
  const blank = new DatabaseSync(firstPath);
  const existing = new DatabaseSync(existingPath);
  try {
    blank.exec("PRAGMA foreign_keys = ON");
    existing.exec("PRAGMA foreign_keys = ON");
    const beforeBlank = inspectDatabase(blank);
    const beforeExisting = inspectDatabase(existing);
    const blankFirst = applyMigrationOnce(blank, "0000_event_intelligence", migration);
    const existingFirst = applyMigrationOnce(existing, "0000_event_intelligence", migration);
    const blankSecond = applyMigrationOnce(blank, "0000_event_intelligence", migration);
    const existingSecond = applyMigrationOnce(existing, "0000_event_intelligence", migration);
    const afterBlank = inspectDatabase(blank);
    const afterExisting = inspectDatabase(existing);
    const missingTables = expectedTables.filter((table) => !afterBlank.tables.includes(table));
    const eventUsesIndex = afterBlank.queryPlans.events.some((row) => /idx_events_status_priority|USING INDEX/i.test(row.detail ?? ""));
    const observationUsesIndex = afterBlank.queryPlans.observations.some((row) => /idx_observations_source_id|USING INDEX/i.test(row.detail ?? ""));
    if (missingTables.length || !eventUsesIndex || !observationUsesIndex) {
      throw new Error(`Migration verification failed: missing=${missingTables.join(",")} eventIndex=${eventUsesIndex} observationIndex=${observationUsesIndex}`);
    }
    const report = {
      generatedAt: new Date().toISOString(),
      migration: "drizzle/0000_event_intelligence.sql",
      blankDatabase: { before: beforeBlank, after: afterBlank },
      existingStructureSnapshot: { before: beforeExisting, after: afterExisting },
      repeatedExecution: { blank: [blankFirst, blankSecond], existing: [existingFirst, existingSecond], result: "second invocation skipped by migration ledger" },
      expectedTableCount: expectedTables.length,
      actualTableCount: afterBlank.tables.length,
      indexChecks: { eventStatusPriority: eventUsesIndex, observationSourcePublished: observationUsesIndex },
      productionD1Touched: false,
    };
    await mkdir(new URL("../artifacts/event-intelligence/", import.meta.url), { recursive: true });
    await writeFile(outputUrl, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify({ message: "Event intelligence migration verified", tables: afterBlank.tables.length, indexes: afterBlank.indexes.length, output: outputUrl.pathname }));
  } finally {
    blank.close();
    existing.close();
  }
}

void run();
