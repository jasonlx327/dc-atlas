import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CONNECTOR_CONTRACT_VERSION, sourceRegistry } from "../worker/connectors/index.ts";
import type { ConnectorResult } from "../worker/connectors/types.ts";

const inputUrl = new URL("../artifacts/event-intelligence/latest-run.json", import.meta.url);

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

const inputPath = arg("input") ?? fileURLToPath(inputUrl);
const outputPath = fileURLToPath(new URL(`../artifacts/event-intelligence/${arg("output") ?? "source-health-30.json"}`, import.meta.url));
const report = JSON.parse(await readFile(inputPath, "utf8")) as {
  generatedAt: string;
  status: string;
  freshness: string;
  sourceHealth: Array<{
    sourceId: string;
    endpointId: string;
    tier: string;
    independenceGroup: string;
    status: ConnectorResult["status"];
    httpStatus?: number;
    responseMs?: number;
    observations: number;
    error?: string;
  }>;
};

const sourceMap = new Map(sourceRegistry.map((source) => [source.id, source]));
const health = report.sourceHealth.map((item) => {
  const source = sourceMap.get(item.sourceId);
  if (!source) return { ...item, contractVersion: CONNECTOR_CONTRACT_VERSION, contractError: "source definition missing" };
  return {
    contractVersion: CONNECTOR_CONTRACT_VERSION,
    sourceId: item.sourceId,
    endpointId: item.endpointId,
    endpointType: source.endpoint.type,
    parserKey: source.endpoint.parserKey,
    url: source.endpoint.url,
    tier: source.tier,
    independenceGroup: source.independenceGroup,
    status: item.status,
    httpStatus: item.httpStatus,
    responseMs: item.responseMs,
    observations: item.observations,
    semanticMode: source.endpoint.type === "html" && source.endpoint.parserKey === "official-html" ? "page-change-signal" : "event-records",
    eventSemanticEligible: !(source.endpoint.type === "html" && source.endpoint.parserKey === "official-html"),
    error: item.error,
  };
});
const contractErrors = health.flatMap((item) => {
  const errors: string[] = [];
  if (item.contractVersion !== CONNECTOR_CONTRACT_VERSION) errors.push(`${item.sourceId}: contract version mismatch`);
  if (!item.endpointId || !item.sourceId || !item.url || !item.parserKey) errors.push(`${item.sourceId}: missing endpoint contract field`);
  if (!item.status) errors.push(`${item.sourceId}: missing status`);
  if (item.responseMs !== undefined && item.responseMs < 0) errors.push(`${item.sourceId}: negative response time`);
  if (item.status === "ok" && item.eventSemanticEligible && item.observations < 1) errors.push(`${item.sourceId}: ok event feed returned no event records`);
  return errors;
});
if (health.length < 30) throw new Error(`source health sample has ${health.length} endpoints; need at least 30`);

const statusCounts = health.reduce<Record<string, number>>((counts, item) => {
  counts[item.status] = (counts[item.status] ?? 0) + 1;
  return counts;
}, {});
const semanticEligibleEndpointCount = health.filter((item) => item.eventSemanticEligible).length;
const healthySemanticEndpointCount = health.filter((item) => item.eventSemanticEligible && ["ok", "empty", "not-modified"].includes(item.status)).length;
const pageChangeSignalCount = health.filter((item) => item.semanticMode === "page-change-signal").length;
const sourceGatePass = health.length >= 30 && contractErrors.length === 0 && healthySemanticEndpointCount >= 30;
const output = {
  schemaVersion: "atlas-source-health.v1",
  generatedAt: new Date().toISOString(),
  sourceRunAt: report.generatedAt,
  sourceRunStatus: report.status,
  sourceRunFreshness: report.freshness,
  stabilityVerdict: sourceGatePass ? "source-contract-passed" : "source-contract-failed",
  connectorContract: {
    version: CONNECTOR_CONTRACT_VERSION,
    requiredFields: ["sourceId", "endpointId", "endpointType", "parserKey", "url", "tier", "independenceGroup", "status", "observations"],
    allowedStatuses: ["ok", "empty", "not-modified", "parse-error", "failed", "blocked"],
    requestState: "ETag, Last-Modified and cursor are local-shadow SQLite state only.",
    responseLimitBytes: 2_000_000,
    retryPolicy: "three attempts for transient fetch failures and 5xx responses; blocked and parse failures remain visible",
  },
  sample: {
    requestedMinimum: 30,
    sampledEndpointCount: health.length,
    sourceRegistryCount: sourceRegistry.length,
    statusCounts,
    contractErrorCount: contractErrors.length,
    semanticEligibleEndpointCount,
    healthySemanticEndpointCount,
    pageChangeSignalCount,
  },
  health,
  contractErrors,
  productionTouched: false,
  writeScope: "local artifact only; no production D1, Worker, Sites, KV, public API, or industry-network write",
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, sampledEndpointCount: health.length, statusCounts, contractErrors: contractErrors.length, semanticEligibleEndpointCount, healthySemanticEndpointCount, stabilityVerdict: output.stabilityVerdict }, null, 2));
