import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const artifactRoot = fileURLToPath(new URL("../artifacts/event-intelligence/", import.meta.url));
const ledgerPath = artifactRoot + "/shadow-7d-ledger.json";
const historicalLedgerPath = artifactRoot + "/historical-replay-7d-ledger.json";
const outputPath = artifactRoot + "/gate4-readiness-package.json";
const markdownPath = artifactRoot + "/gate4-readiness-package.md";

type ReadinessSlot = {
  slotId: string;
  slot: "event-night" | "event-day";
  scheduledAtUtc: string;
  beijingDate: string;
  observedAtUtc: string;
  artifact: string;
  status: string;
  freshness: string;
  stats: { fetched: number; clusters: number };
  sourceHealth: { successRate: number };
  checks?: { unresolvedTranslations?: number };
  provenance?: { inputMode?: string; trigger?: string; reportSha256?: string; scheduledAtMatchesSlot?: boolean };
  allThresholdsPass: boolean;
};

type ReadinessLedger = {
  schemaVersion: string;
  windowDays: number;
  requiredSlots: number;
  startedAtUtc: string | null;
  updatedAtUtc: string | null;
  slots: ReadinessSlot[];
  replayGate: { pass: boolean; [key: string]: unknown };
  productionTouched: boolean;
};

async function load<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

const emptyLedger: ReadinessLedger = { schemaVersion: "atlas-event-shadow-7d.v1", windowDays: 7, requiredSlots: 14, startedAtUtc: null, updatedAtUtc: null, slots: [], replayGate: { pass: false }, productionTouched: false };
const ledger = await load<ReadinessLedger>(ledgerPath, emptyLedger);
const historical = await load<{ status?: string; slotCount?: number; completeBeijingDates?: number; passingSlots?: number; slots?: Array<{ artifact: string; reportSha256: string; allThresholdsPass: boolean }> }>(historicalLedgerPath, {});
const sourceHealth = await load<{ sample?: { sampledEndpointCount?: number; contractErrorCount?: number; semanticEligibleEndpointCount?: number; healthySemanticEndpointCount?: number }; stabilityVerdict?: string }>(artifactRoot + "/source-health-30.json", {});
const clustering = await load<{ caseCount?: number; labelGate?: { pass?: boolean }; summary?: { passed?: number; failed?: number } }>(artifactRoot + "/clustering-regression.json", {});
const replay = await load<{ labelGate?: { pass?: boolean; policyAudited?: number; independentlyReviewed?: number }; metrics?: Record<string, unknown> }>(artifactRoot + "/replay-history-v1.json", {});
const timezone = await load<{ status?: string }>(artifactRoot + "/timezone-dst-report.json", {});
const provider = await load<{ status?: string; externalProvider?: { selected?: boolean; privacyReview?: string; retentionReview?: string; costReview?: string; latencyReview?: string } }>(artifactRoot + "/provider-decision.json", {});

function beijingDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}

function expectedSchedule(slot: "event-night" | "event-day", date: string): string {
  const midnightUtc = Date.parse(`${date}T00:00:00.000Z`);
  const offsetMs = slot === "event-day" ? 9.5 * 3_600_000 : -2.5 * 3_600_000;
  return new Date(midnightUtc + offsetMs).toISOString();
}

async function verifyLedgerSlot(slot: ReadinessSlot): Promise<{ valid: boolean; reason?: string }> {
  if (slot.provenance?.inputMode !== "live" || slot.provenance.trigger !== slot.slot || !slot.provenance.reportSha256 || slot.provenance.scheduledAtMatchesSlot !== true) {
    return { valid: false, reason: `${slot.slotId}: missing live-run provenance` };
  }
  if (!Number.isFinite(Date.parse(slot.observedAtUtc)) || !Number.isFinite(Date.parse(slot.scheduledAtUtc)) || beijingDate(slot.observedAtUtc) !== slot.beijingDate) {
    return { valid: false, reason: `${slot.slotId}: invalid observed/scheduled timestamp or Beijing date` };
  }
  if (Math.abs(Date.parse(slot.scheduledAtUtc) - Date.parse(expectedSchedule(slot.slot, slot.beijingDate))) > 60_000) {
    return { valid: false, reason: `${slot.slotId}: scheduled time does not match the canonical slot` };
  }
  const artifactPath = resolve(projectRoot, slot.artifact);
  if (!artifactPath.startsWith(projectRoot)) return { valid: false, reason: `${slot.slotId}: artifact path escapes the project root` };
  try {
    const bytes = await readFile(artifactPath);
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== slot.provenance.reportSha256) return { valid: false, reason: `${slot.slotId}: report hash mismatch` };
    const report = JSON.parse(bytes.toString("utf8")) as { inputMode?: string; trigger?: string; generatedAt?: string };
    if (report.inputMode !== "live" || report.trigger !== slot.slot || report.generatedAt !== slot.observedAtUtc) return { valid: false, reason: `${slot.slotId}: artifact provenance does not match the ledger` };
  } catch {
    return { valid: false, reason: `${slot.slotId}: artifact is missing or unreadable` };
  }
  return { valid: true };
}

const slotChecks = await Promise.all((Array.isArray(ledger.slots) ? ledger.slots : []).map(async (slot) => ({ slot, verification: await verifyLedgerSlot(slot) })));
const invalidLedgerSlots = slotChecks.filter((item) => !item.verification.valid).map((item) => item.verification.reason ?? `${item.slot.slotId}: invalid`);
const slots = slotChecks.filter((item) => item.verification.valid).map((item) => item.slot);
const uniqueSlotIds = new Set(slots.map((slot) => slot.slotId));
const sortedSlots = [...slots].sort((left, right) => String(left.observedAtUtc).localeCompare(String(right.observedAtUtc)));
const firstAt = sortedSlots[0]?.observedAtUtc ? Date.parse(sortedSlots[0].observedAtUtc) : NaN;
const lastSlot = sortedSlots.at(-1);
const lastAt = lastSlot?.observedAtUtc ? Date.parse(lastSlot.observedAtUtc) : NaN;
const naturalSpanDays = Number.isFinite(firstAt) && Number.isFinite(lastAt) ? Math.round(((lastAt - firstAt) / 86_400_000) * 1000) / 1000 : 0;
const liveKinds = new Set(slots.filter((slot) => slot.allThresholdsPass).map((slot) => slot.slot));
const liveSmokePass = liveKinds.has("event-night") && liveKinds.has("event-day");
const replayPass = replay.labelGate?.pass === true && (replay.labelGate?.policyAudited ?? 0) >= 240;
const sourceContractPass = (sourceHealth.sample?.sampledEndpointCount ?? 0) >= 30 && (sourceHealth.sample?.contractErrorCount ?? 1) === 0 && (sourceHealth.sample?.healthySemanticEndpointCount ?? 0) >= 30;
const clusteringPass = clustering.labelGate?.pass === true && clustering.caseCount === 20 && clustering.summary?.passed === 20 && clustering.summary.failed === 0;
const timezonePass = timezone.status === "passed";
const historicalArtifactChecks = await Promise.all((historical.slots ?? []).map(async (slot) => {
  try {
    const bytes = await readFile(resolve(projectRoot, slot.artifact));
    return createHash("sha256").update(bytes).digest("hex") === slot.reportSha256 && slot.allThresholdsPass === true;
  } catch {
    return false;
  }
}));
const historicalPass = historical.status === "passed" && historical.slotCount === 14 && historical.completeBeijingDates === 7 && historical.passingSlots === 14 && historicalArtifactChecks.length === 14 && historicalArtifactChecks.every(Boolean);
const translationPass = historicalPass && slots.every((slot) => slot.checks?.unresolvedTranslations === 0);
const externalReviewsComplete = provider.externalProvider?.selected === true
  && [provider.externalProvider.privacyReview, provider.externalProvider.retentionReview, provider.externalProvider.costReview, provider.externalProvider.latencyReview].every((review) => review === "approved");
const providerPass = translationPass && (provider.externalProvider?.selected === false || externalReviewsComplete);
const ready = historicalPass && liveSmokePass && replayPass && sourceContractPass && clusteringPass && timezonePass && providerPass;
const blockers = [
  ...(!historicalPass ? [`T-7 historical replay incomplete or invalid: ${historical.passingSlots ?? 0}/14 passing slots across ${historical.completeBeijingDates ?? 0}/7 Beijing dates`] : []),
  ...(!liveSmokePass ? [`live smoke incomplete: ${liveKinds.size}/2 canonical slot types recorded; event-night and event-day are both required`] : []),
  ...invalidLedgerSlots,
  ...(!replayPass ? [`replay policy-audited labels below gate: ${replay.labelGate?.policyAudited ?? 0}/240`] : []),
  ...(!sourceContractPass ? [`healthy event-semantic source endpoints below gate: ${sourceHealth.sample?.healthySemanticEndpointCount ?? 0}/30`] : []),
  ...(!clusteringPass ? [`clustering regression not gate-valid: ${clustering.summary?.passed ?? 0}/20 passing; audited labels required`] : []),
  ...(!timezonePass ? ["timezone/DST regression failed or missing"] : []),
  ...(!translationPass ? ["historical replay and all recorded live public-eligible items must have zero unresolved translations"] : []),
  ...(!providerPass ? ["translation provider boundary is unresolved or required reviews are incomplete"] : []),
];
const git = await execFile("git", ["status", "--short", "--branch"], { cwd: projectRoot });
const packageOutput = {
  schemaVersion: "atlas-event-gate4-readiness.v1",
  status: ready ? "gate4-ready" : historicalPass ? "waiting-live-smoke" : "blocked-historical-replay",
  generatedAt: new Date().toISOString(),
  stopAfterPackage: ready,
  gates: {
    historicalReplay: { value: { slots: historical.slotCount ?? 0, completeBeijingDates: historical.completeBeijingDates ?? 0, passingSlots: historical.passingSlots ?? 0 }, required: "14 passing slots across seven Beijing dates", pass: historicalPass },
    liveSmoke: { value: { validSlots: uniqueSlotIds.size, canonicalSlotTypes: [...liveKinds].sort() }, required: ["event-night", "event-day"], pass: liveSmokePass },
    requiredSlots: { value: historical.slotCount ?? 0, required: 14, pass: historicalPass },
    naturalSpanDays: { value: naturalSpanDays, required: "informational for live smoke; historical replay covers seven dates", pass: historicalPass },
    completeBeijingDates: { value: historical.completeBeijingDates ?? 0, required: 7, pass: historicalPass },
    slotThresholds: { value: historical.passingSlots ?? 0, required: 14, pass: historicalPass },
    replay: { value: { metrics: replay.metrics ?? null, labelGate: replay.labelGate ?? null }, pass: replayPass },
    sourceContract: { value: sourceHealth.sample ?? null, pass: sourceContractPass },
    clustering: { value: clustering.summary ?? null, pass: clusteringPass },
    timezoneDst: { value: timezone.status ?? "missing", pass: timezonePass },
    providerBoundary: { value: provider.status ?? "missing", pass: providerPass },
    translationReadiness: { value: slots.reduce((total, slot) => total + (slot.checks?.unresolvedTranslations ?? 0), 0), required: 0, pass: translationPass },
  },
  slots: sortedSlots,
  blockers,
  artifacts: [
    "artifacts/event-intelligence/history-v1.json",
    "artifacts/event-intelligence/replay-corpus-validation.json",
    "artifacts/event-intelligence/replay-history-v1.json",
    "artifacts/event-intelligence/source-health-30.json",
    "artifacts/event-intelligence/clustering-regression.json",
    "artifacts/event-intelligence/timezone-dst-report.json",
    "artifacts/event-intelligence/provider-decision.json",
    "artifacts/event-intelligence/shadow-7d-ledger.json",
    "artifacts/event-intelligence/historical-replay-7d-ledger.json",
  ],
  externalDecisions: {
    provider: provider.status ?? "missing",
    productionDeployment: "not requested and not performed",
    productionD1WorkerSitesKVPublicApi: "unchanged",
    industryNetwork: "unchanged",
  },
  rollback: "Local-only rollback is deleting or archiving the shadow SQLite/artifacts; production has no new state to roll back.",
  productionTouched: false,
  gitStatusAtPackage: git.stdout,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(packageOutput, null, 2) + "\n", "utf8");
const rows = sortedSlots.map((slot) => "| " + slot.slotId + " | " + slot.status + " | " + slot.freshness + " | " + slot.sourceHealth.successRate + " | " + slot.stats.fetched + " | " + slot.stats.clusters + " | " + (slot.allThresholdsPass ? "pass" : "fail") + " |").join("\n");
const markdown = [
  "# Atlas Event Intelligence Gate 4 readiness package",
  "",
  "**Status:** " + packageOutput.status,
  "",
  "This package is local/shadow-only. It does not authorize deployment or production writes.",
  "",
  "## Gate summary",
  "",
  "- Historical replay: " + (historical.passingSlots ?? 0) + "/14 passing across " + (historical.completeBeijingDates ?? 0) + "/7 Beijing dates",
  "- Live smoke: " + liveKinds.size + "/2 canonical slot types",
  "- Replay labels/metrics: " + (replayPass ? "pass" : "pending/fail"),
  "- Source contract: " + (sourceContractPass ? "pass" : "pending/fail"),
  "- Clustering: " + (clusteringPass ? "pass" : "pending/fail"),
  "- Timezone/DST: " + (timezonePass ? "pass" : "pending/fail"),
  "- Translation/provider boundary: " + (providerPass ? "ready" : "blocked or pending"),
  "- Blockers: " + (blockers.length ? blockers.join("; ") : "none"),
  "",
  "## Shadow slots",
  "",
  "| Slot | Status | Freshness | Source success/no-change | Fetched | Clusters | Thresholds |",
  "| --- | --- | --- | ---: | ---: | ---: | --- |",
  rows || "| — | waiting | — | — | — | — | pending |",
  "",
  "## Boundary",
  "",
  "Production D1, Worker, Sites, KV, public API semantics, and the industry-network path are unchanged.",
  ready
    ? "This package is complete; stop the task and return it for review."
    : historicalPass
      ? "The accelerated seven-day replay is complete; the package is waiting only for both canonical live smoke slot types."
      : "The accelerated historical replay or another quality gate is incomplete.",
  "",
].join("\n");
await writeFile(markdownPath, markdown, "utf8");
console.log(JSON.stringify({ output: outputPath, markdown: markdownPath, status: packageOutput.status, slots: uniqueSlotIds.size, naturalSpanDays, stopAfterPackage: ready }, null, 2));
