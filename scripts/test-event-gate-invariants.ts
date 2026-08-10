import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const artifactRoot = fileURLToPath(new URL("../artifacts/event-intelligence/", import.meta.url));
const projectRoot = fileURLToPath(new URL("../", import.meta.url));

async function load<T>(name: string): Promise<T> {
  return JSON.parse(await readFile(`${artifactRoot}/${name}`, "utf8")) as T;
}

const validation = await load<{ status: string; gateReady: boolean; gateBlockers: string[]; counts: { policyAudited: number; independentlyReviewed: number } }>("replay-corpus-validation.json");
const replay = await load<{ labelGate: { pass: boolean }; metrics: unknown | null }>("replay-history-v1.json");
const clustering = await load<{ caseCount: number; labelGate: { pass: boolean }; summary: { passed: number; failed: number } }>("clustering-regression.json");
const sourceHealth = await load<{ sample: { sampledEndpointCount: number; contractErrorCount: number; healthySemanticEndpointCount: number } }>("source-health-30.json");
const historical = await load<{ status: string; slotCount: number; completeBeijingDates: number; passingSlots: number }>("historical-replay-7d-ledger.json");
const gate4 = await load<{
  status: string;
  gates: {
    requiredSlots: { pass: boolean };
    historicalReplay: { pass: boolean };
    liveSmoke: { pass: boolean };
    replay: { pass: boolean };
    sourceContract: { pass: boolean };
    clustering: { pass: boolean };
  };
}>("gate4-readiness-package.json");

const reviewed = validation.counts?.policyAudited ?? 0;
const labelsReady = validation.status === "passed" && reviewed >= 240 && validation.gateBlockers?.length === 0;
assert.equal(validation.gateReady, labelsReady);
assert.equal(replay.labelGate?.pass, validation.gateReady);
assert.equal(replay.metrics === null, !validation.gateReady);
assert.equal(clustering.labelGate?.pass, validation.gateReady);

const sourceSemanticReady = (sourceHealth.sample?.sampledEndpointCount ?? 0) >= 30
  && (sourceHealth.sample?.contractErrorCount ?? 1) === 0
  && (sourceHealth.sample?.healthySemanticEndpointCount ?? 0) >= 30;
assert.equal(gate4.gates?.sourceContract?.pass, sourceSemanticReady);

const clusteringReady = clustering.labelGate?.pass === true
  && clustering.caseCount === 20
  && clustering.summary?.passed === 20
  && clustering.summary?.failed === 0;
assert.equal(gate4.gates?.clustering?.pass, clusteringReady);
const historicalReady = historical.status === "passed" && historical.slotCount === 14 && historical.completeBeijingDates === 7 && historical.passingSlots === 14;
assert.equal(gate4.gates?.historicalReplay?.pass, historicalReady);
assert.equal(gate4.gates?.replay?.pass, replay.labelGate?.pass === true);
if (!gate4.gates?.historicalReplay?.pass || !gate4.gates?.liveSmoke?.pass || !gate4.gates?.replay?.pass || !gate4.gates?.sourceContract?.pass || !gate4.gates?.clustering?.pass) {
  assert.notEqual(gate4.status, "gate4-ready");
}

let unsafeRecordRejected = false;
const unsafeFixtureDir = await mkdtemp(join(tmpdir(), "atlas-event-gate-"));
try {
  const latestRun = await load<Record<string, unknown>>("latest-run.json");
  const unsafeFixture = join(unsafeFixtureDir, "unsafe-run.json");
  await writeFile(unsafeFixture, JSON.stringify({ ...latestRun, inputMode: "snapshot", trigger: "event-day" }));
  await execFile(process.execPath, ["--experimental-strip-types", "scripts/record-event-shadow-slot.ts", "--slot=event-day", `--input=${unsafeFixture}`], { cwd: projectRoot });
} catch (error) {
  const output = `${(error as { stdout?: string }).stdout ?? ""}\n${(error as { stderr?: string }).stderr ?? ""}`;
  unsafeRecordRejected = /inputMode=live|scheduled-at=.*required/.test(output);
} finally {
  await rm(unsafeFixtureDir, { recursive: true, force: true });
}
assert.equal(unsafeRecordRejected, true, "unscheduled or non-live reports must not enter the seven-day ledger");

console.log(JSON.stringify({
  message: "Event intelligence gate invariants passed",
  labelsReady,
  reviewed,
  sourceSemanticReady,
  clusteringReady,
  gate4Status: gate4.status,
  historicalReady,
  unsafeRecordRejected,
}));
