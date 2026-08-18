import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import {
  ATLAS_EDITOR_DECISION_LATEST_KEY,
  decisionKey,
} from "../worker/event-intelligence/atlas-auto-editor.ts";
import { buildCodexEditorialPackets } from "../worker/event-intelligence/codex-editorial-judgment.ts";
import {
  DAILY_CANDIDATE_PACKET_LATEST_KEY,
  DAILY_MODEL_SELECTION_LATEST_KEY,
  candidatePacketKey,
  selectionDayKey,
} from "../worker/event-intelligence/daily-model-selection.ts";
import {
  DAILY_SECTION_CLOSURE_LATEST_KEY,
  closureKey,
} from "../worker/event-intelligence/daily-section-closure.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function putRemote(key: string, path: string): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn("npm", ["exec", "--", "wrangler", "kv", "key", "put", key, "--binding", "IDC_DAILY_SNAPSHOTS", "--path", path, "--remote"], {
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(`wrangler KV 写入 ${key} 失败，退出码 ${code ?? "unknown"}。`)));
  });
}

async function run() {
  const sourcePath = resolve(arg("source") ?? "artifacts/event-intelligence/codex-event-night.json");
  const judgmentPath = resolve(arg("judgment") ?? "artifacts/event-intelligence/codex-editorial-judgment.json");
  const sourceReport = JSON.parse(await readFile(sourcePath, "utf8")) as ShadowRunReport;
  const judgment = JSON.parse(await readFile(judgmentPath, "utf8")) as unknown;
  const packets = buildCodexEditorialPackets(sourceReport, judgment);
  const day = packets.selection.day;
  const summary = {
    day,
    model: packets.selection.model,
    candidates: packets.selection.candidateCount,
    selected: packets.selection.selectedCount,
    watch: packets.selection.watchCount,
    dropped: packets.selection.droppedCount,
    publishFormal: packets.editor.summary.publishFormal,
    publishRumor: packets.editor.summary.publishRumor,
    research: packets.editor.summary.research,
    blockingHold: packets.editor.summary.blockingHold,
    closure: packets.closure.status,
    sections: packets.closure.counts,
  };
  if (!hasFlag("remote")) {
    console.log(JSON.stringify({ message: "Codex Luna judgment validation passed; remote write not requested", sourcePath, judgmentPath, ...summary }));
    return;
  }

  const temporary = await mkdtemp(join(tmpdir(), "idc-atlas-codex-judgment-"));
  try {
    const payloads = [
      { name: "selection", value: packets.selection, keys: [selectionDayKey(day), DAILY_MODEL_SELECTION_LATEST_KEY] },
      { name: "candidates", value: packets.candidates, keys: [candidatePacketKey(day), DAILY_CANDIDATE_PACKET_LATEST_KEY] },
      { name: "editor", value: packets.editor, keys: [decisionKey(day), ATLAS_EDITOR_DECISION_LATEST_KEY] },
      { name: "closure", value: packets.closure, keys: [closureKey(day), DAILY_SECTION_CLOSURE_LATEST_KEY] },
    ];
    for (const payload of payloads) {
      const path = join(temporary, `${payload.name}.json`);
      await writeFile(path, `${JSON.stringify(payload.value)}\n`);
      for (const key of payload.keys) await putRemote(key, path);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
  console.log(JSON.stringify({ message: "Codex Luna judgment packets written to Cloudflare KV", ...summary }));
}

void run();
