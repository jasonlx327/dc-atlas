import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
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
import {
  ATLAS_EDITORIAL_COMMIT_LATEST_KEY,
  editorialCommitKey,
  type AtlasEditorialCommit,
} from "../worker/event-intelligence/editorial-commit.ts";

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

async function getRemote(key: string): Promise<string> {
  return await new Promise<string>((resolvePromise, reject) => {
    const child = spawn("npm", ["exec", "--", "wrangler", "kv", "key", "get", key, "--binding", "IDC_DAILY_SNAPSHOTS", "--remote"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code) => code === 0
      ? resolvePromise(stdout)
      : reject(new Error(`wrangler KV 回读 ${key} 失败，退出码 ${code ?? "unknown"}：${stderr.trim()}`)));
  });
}

function normalizedJson(value: string): string {
  return JSON.stringify(JSON.parse(value));
}

function sha256(value: string): string {
  return createHash("sha256").update(normalizedJson(value)).digest("hex");
}

async function run() {
  const sourcePath = resolve(arg("source") ?? "artifacts/event-intelligence/codex-event-night.json");
  const sourceKey = arg("source-key");
  const judgmentPath = resolve(arg("judgment") ?? "artifacts/event-intelligence/codex-editorial-judgment.json");
  const sourceReport = JSON.parse(sourceKey ? await getRemote(sourceKey) : await readFile(sourcePath, "utf8")) as ShadowRunReport;
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
    console.log(JSON.stringify({
      message: "Codex Luna judgment validation passed; remote write not requested",
      source: sourceKey ?? sourcePath,
      judgmentPath,
      ...summary,
    }));
    return;
  }

  const temporary = await mkdtemp(join(tmpdir(), "idc-atlas-codex-judgment-"));
  try {
    const payloads = [
      { name: "selection", value: packets.selection, datedKey: selectionDayKey(day), latestKey: DAILY_MODEL_SELECTION_LATEST_KEY },
      { name: "candidates", value: packets.candidates, datedKey: candidatePacketKey(day), latestKey: DAILY_CANDIDATE_PACKET_LATEST_KEY },
      { name: "editor", value: packets.editor, datedKey: decisionKey(day), latestKey: ATLAS_EDITOR_DECISION_LATEST_KEY },
      { name: "closure", value: packets.closure, datedKey: closureKey(day), latestKey: DAILY_SECTION_CLOSURE_LATEST_KEY },
    ] as const;
    const hashes = {} as Record<(typeof payloads)[number]["name"], string>;
    for (const payload of payloads) {
      const path = join(temporary, `${payload.name}.json`);
      const serialized = `${JSON.stringify(payload.value)}\n`;
      await writeFile(path, serialized);
      hashes[payload.name] = sha256(serialized);
      await putRemote(payload.datedKey, path);
      if (sha256(await getRemote(payload.datedKey)) !== hashes[payload.name]) {
        throw new Error(`wrangler KV 回读 ${payload.datedKey} 哈希不一致，拒绝提交。`);
      }
    }
    for (const payload of payloads) {
      const path = join(temporary, `${payload.name}.json`);
      await putRemote(payload.latestKey, path);
      if (sha256(await getRemote(payload.latestKey)) !== hashes[payload.name]) {
        throw new Error(`wrangler KV 回读 ${payload.latestKey} 哈希不一致，拒绝提交。`);
      }
    }
    const commit: AtlasEditorialCommit = {
      schemaVersion: "atlas-editorial-commit.v1",
      day,
      committedAt: new Date().toISOString(),
      sourceGeneratedAt: sourceReport.generatedAt,
      judgmentGeneratedAt: packets.editor.generatedAt,
      keys: Object.fromEntries(payloads.map((payload) => [payload.name, payload.datedKey])) as AtlasEditorialCommit["keys"],
      sha256: hashes,
    };
    const commitPath = join(temporary, "commit.json");
    await writeFile(commitPath, `${JSON.stringify(commit)}\n`);
    await putRemote(editorialCommitKey(day), commitPath);
    await putRemote(ATLAS_EDITORIAL_COMMIT_LATEST_KEY, commitPath);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
  console.log(JSON.stringify({ message: "Codex Luna judgment packets written to Cloudflare KV", ...summary }));
}

void run();
